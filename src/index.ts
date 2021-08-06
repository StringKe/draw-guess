import Main from './main';
import { Backend } from './backend';

Backend.getUser().then((id) => {
  const backend = new Backend(id);
  backend.init().then((backendInit) => {
    if (backendInit) {
      const app = new Main(document.body, backend);
      app.init();

      backend.createRoom();
    } else {
      alert('链接服务器失败，请稍后重试');
    }
  });
});
