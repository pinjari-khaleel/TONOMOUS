const path = require('path');

exports.config = ({ config, isDevelopment, isPartials }) => (webpackConfig) => {
  const entry = {};

  if (isPartials) {
    entry.partials = ['./src/app/partials.js'];
  } else if (isDevelopment) {
    entry.main = [
      './src/app/polyfills.js',
      './src/app/bootstrap.dev.ts',
      './src/app/style/aem-editor.scss',
    ];
  } else {
    entry.bundle = [
      'modernizr',
      './src/app/component/layout/app/app.hbs',
      './src/app/polyfills.js',
      './src/app/bootstrap.dist.ts',
    ];
    entry.preview = ['./src/app/component/layout/index/index.hbs'];
    entry.editorStyles = ['./src/app/style/aem-editor.scss'];
  }

  return {
    ...webpackConfig,
    entry,
  };
};
