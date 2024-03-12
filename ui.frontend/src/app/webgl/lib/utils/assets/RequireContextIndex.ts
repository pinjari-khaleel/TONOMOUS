import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';

interface IAssetNameMap {
  [name: string]: {
    contextIndex: number;
    path: string;
  };
}

interface IAssetPathMap {
  [path: string]: number;
}

interface IAssetRef {
  webpackContext: __WebpackModuleApi.RequireContext;
  path: string;
}

/**
 * Class that manages one or more webpack contexts created using the require.context method.
 * Will index all files in the context by filename so they can be easily retrieved.
 */
export default class RequireContextIndex<TModule = any> {
  public webpackContexts: Array<__WebpackModuleApi.RequireContext> = [];
  private assetNameMap: IAssetNameMap = {};
  private assetPathMap: IAssetPathMap = {};

  public loadAssetByPath(path: string): Promise<TModule> {
    const assetRef = this.getAssetByPath(path);

    return LoadUtils.loadSingleFromRequireContext<TModule>(assetRef.webpackContext, assetRef.path);
  }

  public getAssetByPath(path: string): IAssetRef {
    const normalizedPath = `./${path.replace(/^\.\//, '')}`;
    if (typeof this.assetPathMap[normalizedPath] === 'undefined') {
      throw new ReferenceError(
        `Could not find asset with path ${path}. Available paths: \n${Object.keys(
          this.assetPathMap,
        ).join('\n')}`,
      );
    }

    return {
      webpackContext: this.webpackContexts[this.assetPathMap[normalizedPath]],
      path: normalizedPath,
    };
  }

  public loadAssetByName(name: string): Promise<TModule> {
    const assetMap = this.getAssetByName(name);
    return LoadUtils.loadSingleFromRequireContext<TModule>(assetMap.webpackContext, assetMap.path);
  }

  public getAssetByName(name: string): IAssetRef {
    if (!this.assetNameMap[name]) console.warn('asset not found', name);
    if (typeof this.assetNameMap[name] === 'undefined') {
      throw new ReferenceError(
        `Could not find asset with name "${name}". Available assets: \n${Object.keys(
          this.assetNameMap.vs,
        ).join(', ')}`,
      );
    }

    return {
      webpackContext: this.webpackContexts[this.assetNameMap[name].contextIndex],
      path: this.assetNameMap[name].path,
    };
  }

  public addContext(context: __WebpackModuleApi.RequireContext) {
    if (this.webpackContexts.indexOf(context) >= 0) {
      // don't add duplicate contexts
      return;
    }

    const contextIndex = this.webpackContexts.length;

    this.webpackContexts.push(context);

    context.keys().forEach((path: string) => {
      const parsed = path.match(/([^\\\/]+)$/);

      if (parsed) {
        if (this.assetNameMap[parsed[1]]) {
          const resolvedPath = this.webpackContexts[
            this.assetNameMap[parsed[1]].contextIndex
          ].resolve(this.assetNameMap[parsed[1]].path);

          console.warn(
            `WARNING: found asset "${path}" but another asset with the name "${parsed[1]}" was already found at "${resolvedPath}"`,
          );
        }

        this.assetNameMap[parsed[1]] = { contextIndex, path };
      }
      this.assetPathMap[path] = contextIndex;
    });
  }
}
