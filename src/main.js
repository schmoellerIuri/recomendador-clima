import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { PDFPlugin } from 'vue3-pdfmake';

const app = createApp(App)

app.use(PDFPlugin);

app.config.globalProperties.$axios = axios

app.mount('#app')
