import { createHtmlPlugin } from 'vite-plugin-html';

export default function createPluginHtml(env: any) {
  const { VITE_APP_TITLE } = env;

  return createHtmlPlugin({
    inject: {
      data: {
        title: VITE_APP_TITLE
      }
    }
  });
}
