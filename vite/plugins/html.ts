import { createHtmlPlugin } from "vite-plugin-html";

export default function createPluginHtml(env: any) {
  const { VITE_APP_TITLE } = env;

  return createHtmlPlugin({
    inject: {
      data: {
        title: VITE_APP_TITLE,
        injectScript: `<script src="/hk/jquery-1.7.1.min.js"></script>
                <script src="/hk/codebase/encryption/AES.js"></script>
                <script src="/hk/codebase/encryption/cryptico.min.js"></script>
                <script src="/hk/codebase/encryption/crypto-3.1.2.min.js"></script>
                <script id="videonode" src="/hk/codebase/webVideoCtrl.js"></script>`,
      },
    },
  });
}
