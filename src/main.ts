import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'

// 创建应用实例
const app = createApp(App)

// 安装Ant Design Vue
app.use(Antd)

// 挂载应用
app.mount('#app')