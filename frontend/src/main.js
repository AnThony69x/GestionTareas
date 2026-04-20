import { createApp } from 'vue';
import App from "./App.vue";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.min.css";
    
// Crear y montar la aplicación
const app = createApp(App);

// Registrar plugins (router, store, etc)
app.use(router);

// Montar la aplicación en el elemento con id="app"
app.mount("#app");
