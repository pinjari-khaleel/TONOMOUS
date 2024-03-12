import { Args, ArgValue } from './mapToProps';

/* 
SHORT DOC
---------

PURPOSE
-------
The flattenProps function is complementary to the mapToProps helper function in .storybook/helpers .
It can be used to automatically flatten the data to be passed to a storybook component, following the
pseudo-BEM notation that mapToProps expects.

IMPORTANT: If you decide to use the flattenProps function, you also have to use the mapToProps helper
to 'unwrap' your data before they are passed to the handlebars template.

USAGE EXAMPLES
--------------

In a {componentName}.stories.ts file import the function using a relative path: 
import {flattenProps} from {yourRelativePath}/.storybook/helpers/flattenProps.ts

Decide if you want to create the data object yourself, or to import it from a yaml file:
- If you decide to make the data object yourself, proceed as you normally would. Eg: 

type myPropsType = {
  eyebrow: {
    text: string,
    size: string
  }
}
const data : myPropsType = {
  eyebrow: {
    text: 'Eyebrow',
    size: 'Large'
  }
}

Then pass that data object to the flattenProps function and assign the output to the
storybook component's "args" property as you normally would.

Default.args = flattenProps<myPropsType>(data);

The output of flattenProps in this case would be :

{
  eyebrow__text: 'Eyebrow',
  eyebrow__size: 'Large'
}

- If you choose to import the data from a yaml file the same process applies:
import SomeDataFromYaml from '{somePath}/data/M01ExampleComponentData.yaml';
import SomePropTypes from './M01ExampleComponent.types';


Default.args = flattenProps<SomePropTypes>(SomeDataFromYaml);

In case the imported data is not exactly to your liking (eg. has extra properties that you don't
want in the controls, or missing properties), you can delete some properties, replace some properties,
or extend the data with new properties before passing it to flattenProps: 

- Remove extra properties example:

delete SomeDataFromYaml.propertyIWantToDelete

Default.args = flattenProps<SomePropTypes>(SomeDataFromYaml);

- Extend existing data example:

const myExtendedData : SomePropTypes = {
  ...SomeDataFromYaml,
  myNewProperty: 'myNewValue'
}

Default.args = flattenProps<SomePropTypes>(myExtendedData);
*/

const getFlatKey = (key: string, parentKey?: string) => (parentKey ? `${parentKey}__${key}` : key);

const extractFlatKeys = (key: string, value: ArgValue | object, parentKey?: string): Args => {
  const flatKey = getFlatKey(key, parentKey);
  if (value === null || typeof value !== 'object') {
    // no nesting
    return {
      [flatKey]: value,
    };
  } else {
    // nesting
    const nestedFlatKeyValuePairs = Object.entries(value).reduce(
      (nestedFlatKeyValuePairs, [key, value]) => {
        const nestedFlatKeyValuePair = extractFlatKeys(key, value, flatKey);
        return { ...nestedFlatKeyValuePairs, ...nestedFlatKeyValuePair };
      },
      {},
    );

    return nestedFlatKeyValuePairs;
  }
};

const flattenProps = <T extends object>(data: T): Args => {
  return Object.entries(data).reduce<Args>((flatProps, [key, value]) => {
    const flatKeyValuePairs = extractFlatKeys(key, value);

    return { ...flatProps, ...flatKeyValuePairs };
  }, {});
};

export { flattenProps };
