import { createApp } from 'vue'
import App from './App.vue'

import router from './router'  // Router importieren


const app = createApp(App)





// Router hinzufügen
app.use(router)

app.mount('#app')
