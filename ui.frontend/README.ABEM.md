# aBEM component structure

NEOM template development uses aBEM design principles, which boils down to the following:

1. We use [BEM](https://getbem.com) to structure components internally and reduce unintended
   conflicts as the project scales.
2. We use [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) to break up the site
   into smaller, reusable components that follow a hierarchical ruleset.
3. We apply these two principles with [aBEM](https://css-tricks.com/abem-useful-adaptation-bem/),
   plus tweaks to reduce complexity and fall in line with regular conventions for a Muban project.

## aBEM syntax

```
.[prefix]-[blockName]__[elementName] -[modifierName]
```

1. Class names use `camelCase` instead of `kebab-case` or `snake_case`.
2. A _prefix_ denotes the type of component you're dealing with.
3. A hyphen separates the prefix from the block name.
4. Two underscores separate the block name from the element name.
5. A single hyphen prefixes modifier names.

### SCSS formatting example

```
.o-loginForm {

  &__heading { // .o-loginForm__heading
    ...
  }

  &.-modal { // .o-loginForm.-modal
    ...
  }

  @include respond-to(BREAKPOINT_HERE) {

    &__heading {
        ...
    }
  }
}
```

## Component levels

Atomic Design proposes a naming structure that serves as a hierarchy for components. Other than
forcing you to think about how components get ordered and which should be parents of which, they are
all still just components. Nothing really changed.

Still, it may be confusing at first. This [handy tool](https://dan503.github.io/Atomic-Categorizer/)
should help you in the early stages of adoption and when in doubt, involve the team to come to a
proper choice.

### Atom

The smallest building block in the component set. Tends to be a generic single item which doesn't
necessarily contain a lot of functionality. Cannot contain other components (atoms, molecules,
organisms or blocks).

Uses the `a-` prefix (i.e. `.a-icon`) in scss.

### Molecule

Combines atom components together to form a more distinct component. Can be expected to contain some
functionality. May contain atoms, but cannot contain organisms, other molecules or blocks.

Uses the `m-` prefix (i.e. `.m-button`) in scss.

### Organism

Combines molecules (and for notable exceptions, atoms) to create higher-order components. These
components are more likely to be self-contained and have js interaction and animation for its child
components.

Organisms can have organisms for parents, although this practice should be clearly communicated with
the FE team where appropriate. Cannot contain blocks.

Uses the `o-` prefix (i.e. `.o-loginForm`) in scss. Optionally may contain molecules and atoms,
although this is not good practice.

### Block

Combines organisms into block components. Blocks are similar to Atomic Design's template level apart
from being just a (reusable) portion of the whole page, whereas the template would be a full page.

Uses the `b-` prefix (i.e. `.b-homeHeader`) in scss.

### Other prefixes

Since aBEM has a similar prefix system, ITCSS principles can be easily imported to the project:

- `.s-` for scope classes, helpful for defining styling on user generated content.
- `.u-` for utility classes, like Bootstrap-like column systems and list reset patterns.

## Seng generator templates

Because aBEM comes with slight organisational differences compared to a normal Muban project, a
modified set of sg templates is available. You can access them easily with `$ sg wizard`.

- `atom` for atom components
- `block` for block components.
- `molecule` for molecule components
- `organism` for organism components
