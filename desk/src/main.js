import { createApp, h } from "vue";
import {
  Badge,
  Button,
  Dialog,
  ErrorMessage,
  FeatherIcon,
  FormControl,
  frappeRequest,
  FrappeUI,
  setConfig,
  TextInput,
  toast,
  Tooltip,
  dayjs,
} from "frappe-ui";
import "dayjs/esm/locale/zh-cn";
import { createPinia } from "pinia";
import App from "./App.vue";
import { spritePlugin } from "frappe-ui/icons";
import { createDialog } from "./components/dialogs";
import "./index.css";
import { router } from "./router";
import { telemetryPlugin } from "frappe-ui/frappe";
import { isCustomerPortal } from "@/utils";
import { translationPlugin } from "./translation";
import CircleAlert from "~icons/lucide/circle-alert";
import { initSocket } from "./socket";

// dayjs 默认是英文 locale，中文站点下日期会显示成 "Oct 11, 6:04 pm"。
// 按站点语言切到对应 locale（中文用 zh-cn），保证月份/AM-PM 等本地化。
const siteLang = String(window.lang || "en").toLowerCase();
dayjs.locale(siteLang.startsWith("zh") ? "zh-cn" : siteLang);

const globalComponents = {
  Badge,
  Button,
  Dialog,
  ErrorMessage,
  FeatherIcon,
  FormControl,
  Tooltip,
  TextInput,
};

setConfig("resourceFetcher", frappeRequest);
setConfig("serverMessagesHandler", (msgs) => {
  if (isCustomerPortal.value) {
    return;
  }
  msgs.forEach((msg) => {
    msg = JSON.parse(msg);
    if (msg && msg.message == "Feedback email has been sent to the customer.") {
      toast.success(msg.message);
      return;
    }
    toast.create({
      message: msg.message,
      icon: h(CircleAlert, { class: "text-ink-blue-5" }),
    });
  });
});
setConfig("fallbackErrorHandler", (error) => {
  const msg = error.exc_type
    ? (error.messages || error.message || []).join(", ")
    : error.message;
  toast.error(msg);
});

const pinia = createPinia();
const app = createApp(App);

// helpdesk 自己通过 ./socket 初始化 socket（带站点命名空间），
// 这里关掉 frappe-ui 插件的默认 socket，避免它额外建连并在 http 站点上误连 https。
app.use(FrappeUI, { socketio: false });
app.use(spritePlugin);
app.use(pinia);
app.use(router);
app.use(translationPlugin);
app.use(telemetryPlugin, { app_name: "helpdesk" });

for (const c in globalComponents) {
  app.component(c, globalComponents[c]);
}

app.config.globalProperties.$dialog = createDialog;

let socket;
if (import.meta.env.DEV) {
  frappeRequest({
    url: "/api/method/helpdesk.www.helpdesk.index.get_context_for_dev",
  }).then((values) => {
    for (let key in values) {
      window[key] = values[key];
    }
    if (window.dir) document.documentElement.dir = window.dir;
    if (window.lang) document.documentElement.lang = window.lang;
    socket = initSocket();
    app.config.globalProperties.$socket = socket;
    app.mount("#app");
  });
} else {
  socket = initSocket();
  app.config.globalProperties.$socket = socket;
  app.mount("#app");
}
