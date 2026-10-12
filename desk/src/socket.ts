import { io } from "socket.io-client";
import { socketio_port } from "../../../../sites/common_site_config.json";

// extend window object
// 注意：类型必须与 frappe-ui 中同名声明保持一致（site_name?: string），
// 否则两处 declare global 合并时会报“声明修饰符/类型不一致”。
declare global {
  interface Window {
    site_name?: string;
  }
}

export function initSocket() {
  let host = window.location.hostname;
  let siteName = window.site_name || host;
  let port = window.location.port ? `:${socketio_port}` : "";
  // 用页面实际协议判断，而不是"有无端口"：http 站点（80 端口）此前会被误判为 https，
  // 导致 socket.io 连到未监听的 443 而被拒绝。
  let protocol = window.location.protocol === "https:" ? "https" : "http";
  let url = `${protocol}://${host}${port}/${siteName}`;

  const socket = io(url, {
    withCredentials: true,
    reconnectionAttempts: 5,
  });

  return socket;
}

export const socket = initSocket();
