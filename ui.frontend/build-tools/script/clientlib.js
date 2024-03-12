const chalk = require('chalk');
const fs = require('fs-extra');
const clientlib = require('aem-clientlib-generator');

module.exports = function (config) {
  if (
    config.distPath === undefined ||
    config.clientLibRoot === undefined ||
    config.clientLibCategory === undefined
  ) {
    console.log(`${chalk.green('Clientlib Variables not set skipping...')}`);
    return;
  }

  const assetsFolder = `${config.distPath}/site/asset/`;
  const clientLibRoot = config.clientLibRoot;
  const clientLibName = config.clientLibName;
  const clientLibCategory = config.clientLibCategory;
  const clientLibSeparateEditorStyles = config.clientLibSeparateEditorStyles;

  console.log(`${chalk.blue('Creating clientlibs for AEM...')}`);

  fs.readdir(assetsFolder, function (err, items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].search(/^preview\.(js|css)$/g) > -1) {
        fs.removeSync(`${assetsFolder}${items[i]}`);
        continue;
      }
    }

    const configItems = [
      {
        name: `${clientLibName}`,
        categories: [`${clientLibCategory}`],
        serializationFormat: 'xml',
        cssProcessor: ['default:none', 'min:none'],
        jsProcessor: ['default:none', 'min:gcc;compilationLevel=whitespace'],
        allowProxy: true,
        assets: {
          js: {
            cwd: `${assetsFolder}`,
            files: ['**/bundle.js'],
            flatten: false,
          },
          css: {
            cwd: `${assetsFolder}`,
            files: clientLibSeparateEditorStyles ? ['**/bundle.css'] : ['**/*.css'],
            flatten: false,
          },
          resources: {
            base: 'resources/asset',
            cwd: `${assetsFolder}`,
            files: ['**/*.*'],
            flatten: false,
            ignore: ['**/bundle.js', '**/bundle.css'],
          },
        },
      },
    ];

    if (clientLibSeparateEditorStyles) {
      configItems.push({
        name: `clientlib-editor`,
        categories: [`tonomus.editor`],
        serializationFormat: 'xml',
        cssProcessor: ['default:none', 'min:none'],
        jsProcessor: ['default:none', 'min:gcc;compilationLevel=whitespace'],
        allowProxy: true,
        assets: {
          css: {
            cwd: `${assetsFolder}`,
            files: ['**/editorStyles.css'],
            flatten: false,
          },
        },
      });
    }

    clientlib(
      configItems,
      {
        cwd: __dirname, // using folder of the file as current working directory
        clientLibRoot: `${clientLibRoot}`,
        verbose: true,
      },
      function () {
        console.log(`${chalk.green('clientlibs created...')}`);
        if (clientLibSeparateEditorStyles) {
          console.log(`${chalk.green('editor styles placed in separate clientlibs folder...')}`);
        }
      },
    );
  });
};
