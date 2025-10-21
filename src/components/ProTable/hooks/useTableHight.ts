/**
 * @date 2024-06-26 AM 10:55
 * @author 蒲鑫宇
 * @description 获取表格的高度 hook
 */
import { onMounted, ref, type Ref } from 'vue';

import type { PMProTableProps } from '../types';

interface useTableHeightProps {
  tQProFormRef: Ref
  attrs: PMProTableProps
  clientHeight: Ref<number>
}

export default function useTableHeight({
  tQProFormRef,
  attrs,
  clientHeight
}: useTableHeightProps): [Ref<number>, () => void] {
  // 表格可视区域高度
  const heightY = ref(0);

  onMounted(() => getHeight());

  const getHeight = () => {
    // 高度自适应，页面不要出现滚动条
    const docHeight = document.body.offsetHeight;

    // + 10 是 form 下面的 marginBottom
    const formHeight = tQProFormRef.value?.$el.offsetHeight + 10 || 0;
    // 公共顶部
    const header = 80;
    const tableHeader = 0;
    const footer = attrs.isVirtual ? 10 : attrs.pagination !== false ? 40 : 10;
    const tableHeaderEl = 0
    const tableHeaderHeight = attrs.tableHeader || 0;
    // 底部高度
    let tableFooter = 0;
    if (attrs.footer || attrs.isVirtual) {
      // const footerEl = 0
      tableFooter = 0
    }
    heightY.value = docHeight - header - tableHeader - formHeight - tableHeaderHeight - footer - tableFooter;

    // 可视区域的高度
    clientHeight.value = heightY.value;
  };

  return [heightY, () => getHeight()];
}
