module.exports = function (plop) {
  plop.setHelper('equals', (v1, v2) => {
    return v1 === v2;
  });
  plop.setGenerator('component', {
    description: 'Atomic Component generator',
    prompts: [
      {
        name: 'type',
        type: 'list',
        message: 'What type of component would you like to generate?',
        choices: [
          { name: 'Atom', value: 'atom' },
          { name: 'Molecule', value: 'molecule' },
          { name: 'Organism', value: 'organism' },
          { name: 'Block Component', value: 'block' },
        ],
        default: 'atom',
      },
      {
        name: 'id',
        type: 'input',
        message: 'What is the id you would like to assign the component?',
        validate: (value) =>
          value.length === 0 || Number.isNaN(Number(value))
            ? 'Your id must be a valid number'
            : true,
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the component name you would like to give this component?',
        validate: (value) => (value.length === 0 ? 'Please enter a component name' : true),
      },
      {
        type: 'confirm',
        name: 'lazy',
        message: 'Would you like to set this component up as a lazy loaded component?',
        when(answers) {
          return answers.type === 'block';
        },
      },
      {
        type: 'confirm',
        name: 'transition',
        message: 'Would you like to set this component up as a TransitionComponent?',
      },
    ],
    actions: (userData) => {
      const { type, name, id, transition, lazy } = userData;
      const componentPrefix = type === 'block' ? `c${id}` : `${type.charAt(0)}${id}`;
      const lazyExtension = lazy ? '.lazy' : '';

      const data = {
        aBEMPrefix: type.charAt(0),
        componentName: `${componentPrefix}-${name}`,
        componentPrefix,
        transitionComponent: transition,
        type,
        lazy,
        lazyExtension,
      };

      const actions = [
        {
          data,
          type: 'addMany',
          base: 'build-tools/plop-template/component',
          templateFiles: `build-tools/plop-template/component/${
            transition ? '' : '!(*TransitionController)'
          }*.*`,
          destination: 'src/app/component/{{type}}/{{dashCase componentName}}/',
        },
        {
          data,
          type: 'add',
          templateFile: 'build-tools/plop-template/component/data/default.yaml',
          path: 'src/app/component/{{type}}/{{dashCase componentName}}/data/default.yaml',
        },
      ];

      if (type === 'block') {
        actions.push({
          data,
          type: 'add',
          templateFile: 'build-tools/plop-template/component/data/page.yaml',
          path: 'src/data/{{dashCase componentName}}.yaml',
        });
      }
      return actions;
    },
  });

  plop.setGenerator('page', {
    description: 'Page generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What name would you like to give the component?',
      },
    ],
    actions: (userData) => {
      const { name } = userData;

      const data = {
        componentName: name,
      };

      const actions = [
        {
          data,
          type: 'add',
          templateFile: 'build-tools/plop-template/component/data/page.yaml',
          path: 'src/data/{{dashCase componentName}}.yaml',
        },
      ];

      return actions;
    },
  });
};
