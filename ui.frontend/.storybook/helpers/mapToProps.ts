export type Args = {
  [key: string]: ArgValue;
};

export type ArgValue = string | number | boolean;

type PropHistoryItem = {
  id: string;
  parent: string;
};

type Component = {
  (): {
    template: string;
    data?: Object;
  };
  args?: Args;
};

const mapToProps = <T extends Record<string, any>>(args: Args): T => {
  let propsWithNoNesting: PropHistoryItem[] = [];
  let propsWithNesting: PropHistoryItem[] = [];

  const mapFlatKeyValuePairToProps = (
    accumulatedProps: Record<string, any>,
    key: string,
    value: ArgValue,
    parentKey: string = '',
  ) => {
    if (includesUnderscore(key) && !includesDoubleUnderscore(key)) {
      throw new Error(`Please use double underscore "__" to specify nesting in ${key}`);
    }
    let prop: Record<string, any> = {};
    if (includesDoubleUnderscore(key)) {
      // nesting
      const splitKeys = splitKey(key);

      const firstKey = splitKeys[0];

      propsWithNesting = [...propsWithNesting, { id: firstKey, parent: parentKey }];

      const parentKeyBranch = parentKey ? `${parentKey}__${firstKey}` : firstKey;

      const restOfKeys = splitKeys[1];

      prop = accumulatedProps[firstKey]
        ? {
            [firstKey]: {
              ...accumulatedProps[firstKey],
            },
          }
        : {
            [firstKey]: {},
          };

      if (includesDoubleUnderscore(restOfKeys)) {
        // further nesting

        let objectProp = { ...prop[firstKey] };

        const nestedProp = mapFlatKeyValuePairToProps(
          objectProp,
          restOfKeys,
          value,
          parentKeyBranch,
        );
        objectProp = { ...objectProp, ...nestedProp };

        prop[firstKey] = objectProp;
      } else {
        // no further nesting

        propsWithNoNesting = [...propsWithNoNesting, { id: restOfKeys, parent: parentKeyBranch }];
        checkForProperNesting(propsWithNesting, propsWithNoNesting);
        prop[firstKey][restOfKeys] = value;
      }

      return prop;
    } else {
      // no nesting
      propsWithNoNesting = [...propsWithNoNesting, { id: key, parent: '' }];
      checkForProperNesting(propsWithNesting, propsWithNoNesting);
      prop[key] = value;

      return prop;
    }
  };

  return Object.entries(args).reduce((props, [key, value]) => {
    const prop = mapFlatKeyValuePairToProps(props, key, value);

    return { ...props, ...prop };
  }, {} as T);
};

// Helpers for mapToProps
const includesUnderscore = (str: string) => str.includes('_');
const includesDoubleUnderscore = (str: string) => str.includes('__');

const splitKey = (str: string) => {
  const [key1, ...rest] = str.split('__');
  const key2 = rest.join('__');
  return [key1, key2];
};

const findOverlapInNestedAndNonNestedKeys = (
  nestedKeysHistory: PropHistoryItem[],
  nonNestedKeysHistory: PropHistoryItem[],
) => {
  return nestedKeysHistory.find((nestedPropHistoryItem: PropHistoryItem) =>
    nonNestedKeysHistory.find(
      (nonNestedPropHistoryItem: PropHistoryItem) =>
        nestedPropHistoryItem.id === nonNestedPropHistoryItem.id &&
        nestedPropHistoryItem.parent === nonNestedPropHistoryItem.parent,
    ),
  );
};

const checkForProperNesting = (
  propsWithNesting: PropHistoryItem[],
  propsWithNoNesting: PropHistoryItem[],
) => {
  const overlappingKey = findOverlapInNestedAndNonNestedKeys(propsWithNesting, propsWithNoNesting);
  if (overlappingKey) {
    throw new Error(
      `Please decide whether you want "${overlappingKey.parent}__${overlappingKey.id}" prop to be an object or not`,
    );
  }
};

// Higher order function to 'enhance' the passed component with
// mapped props as its data
const withMappedProps = <PropsType>(component: Component): Component =>
  function () {
    const args: Args = arguments[0];
    const mappedProps = mapToProps<PropsType>(args);
    const { template, data } = component();

    if (data) {
      return {
        template,
        data: { ...mappedProps, ...data },
      };
    }
    return {
      template,
      data: mappedProps,
    };
  };
export { mapToProps, withMappedProps };
