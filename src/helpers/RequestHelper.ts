import axios from "axios";
// import router from "../router";
import { useMainStore } from "~/store/mainStore";

const instance = axios.create({
  baseURL: "http://118.31.58.101:45500/api",
});

instance.interceptors.request.use(
  (config) => {
    const store = useMainStore();
    config.headers['User-Id'] = store.userId;       
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

declare module "vue" {
  interface ComponentCustomProperties {
    $axios: typeof instance;
  }
}

export default instance;
