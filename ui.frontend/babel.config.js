module.exports = function (api) {
  api.cache(!api.env('production'));

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['last 3 iOS versions', 'last 3 versions', 'ie >= 11'],
          },
          modules: false,
          useBuiltIns: 'entry',
          corejs: { version: 3, proposals: true },

          exclude: [
            'esnext.symbol.*',
            'esnext.composite-symbol',

            'es.typed.*',

            'es.reflect.*',
            'esnext.reflect.*',

            'es.math.*',
            'esnext.math.*',

            'es.array-buffer.*',
            'es.data-view',

            'esnext.observable',

            // Funky unused HTML string methods
            'es.string.anchor',
            'es.string.big',
            'es.string.blink',
            'es.string.bold',
            'es.string.code-point-at',
            'es.string.fixed',
            'es.string.fontcolor',
            'es.string.fontsize',
            'es.string.from-code-point',
            'es.string.italics',
            'es.string.iterator',
            'es.string.link',

            // Lighthouse recommendations
            'es.array.fill',
            'es.array.filter',
            'es.array.find',
            'es.array.find-index',
            'es.array.for-each',
            'es.array.from',
            'es.array.includes',
            'es.array.map',
            'es.array.some',
            'es.number.is-integer',
            'es.number.is-safe-integer',
            'es.object.entries',
            'es.object.freeze',
            'es.object.get-own-property-descriptors',
            'es.object.get-prototype-of',
            'es.object.is-extensible',
            'es.object.is-frozen',
            'es.object.is-sealed',
            'es.object.keys',
            'es.object.prevent-extensions',
            'es.object.seal',
            'es.object.set-prototype-of',
            'es.object.values',
            'es.string.raw',
            'es.string.repeat',

            // Heavy things
            'es.promise.*',
            'web.url-search-params.*',
            'web.url.*',
            'es.string.split',
            'es.string.match-all.*',
            'es.string.match-all',
            'es.weak-map.*',
            'es.string.replace',
            'es.number.to-fixed',
            'es.symbol.*',
            'es.weak-map',
            'es.number.constructor.*',
            'es.regexp.constructor.*',
            'es.array.splice.*',
            'es.array.concat.*',
            'esnext.string.replace-all.*',
            'es.array.slice.*',
          ],
        },
      ],
    ],
    plugins: [
      // NOTE: adding helpers will reduce the filesize if you have a lot off classes,
      // but it will increase the main bundle size due to core-js/library/module imports
      // where babel-preset-env includes core-js/modules
      // The ../library/.. versions don't pollute the global scope, this is why babel-runtime
      // uses those for their helpers. But since we already have the global ones loaded,
      // we don't need both.
      // Until there is a fix for this (related: https://github.com/babel/babel/issues/5699)
      // you need to analyze your bundle to see if enabling this gives you an advantage
      // 25kb parsed / 5.9kb (gzip)

      // [
      //   '@babel/plugin-transform-runtime',
      //   {
      //     helpers: true,
      //     corejs: 2,
      //     regenerator: false,
      //   },
      // ],

      '@babel/plugin-transform-runtime',
      'lodash',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      ['@babel/plugin-proposal-class-properties', { loose: false }],
      '@babel/plugin-proposal-json-strings',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/plugin-proposal-optional-chaining',

      // needed to register muban-components
      '@babel/plugin-transform-react-display-name',
    ],
  };
};
