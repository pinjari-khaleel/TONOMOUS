// partials in these component folders can be rendered dynamically by handlebars
const dynamicPartialsFolders = ['/block/', '/organism/', '/molecule/', '/atom/'];

const registerPartialMap = [
  (path: string) =>
    dynamicPartialsFolders.some((folderName) => path.includes(folderName))
      ? /\/([^/]+)\.hbs/gi.exec(path)![1]
      : null,
];

export default registerPartialMap;
