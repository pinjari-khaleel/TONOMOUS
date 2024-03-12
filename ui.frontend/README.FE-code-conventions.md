## Style aBEM classes only.

FE developers should style against aBEM classes. Generic atomic-CSS classes (`.copy-01`,
`.heading-02`) and data attributes (`[data-component="a42-foo"]`) are not allowed.

### Exceptions are scopes:

Classes and elements in a scope class are exempt from this rule. These are reserved scopes for
wysiwyg edtiros and 3rd party libraries.

### Do not use .js- classnames

classnames are used for styling only. The project utilises the HTML dataset object to receive data
from the BE and add interactions in Javascript.

## SCSS

NEOM favors the MM Code conventions with a few tweaks and enhancements in writing strict components:

### Implicit shorthands

It is encouraged to use shorthand CSS for defining dimensions:

```scss
.a-foo {
  &.-bad {
    padding-top: 20px;
  }

  &.-correct {
    padding: 20px 0 0;
  }
}
```

The former is more malleable to unexpected previous declarations, while the latter is not. An
exception is made for clear visual modifier logic:

```scss
.a-bar {
  padding: 20px 0;

  &.-noPaddingTop {
    padding-top: 0;
  }
}
```

### CSS variables

It is strongly encouraged to prefer native CSS variables over SCSS variables in components:

```scss
$colorBar: blue;

.a-foo {
  .bar {
    color: $colorBar;
  }

  &.-alt {
    $colorBar: red;

    .bar {
      color: $colorBar;
    }
  }
}
```

```scss
--color-bar: blue;

.foo {
  .bar {
    color: var(--color-bar);
  }

  &.-alt {
    --color-bar: green;
  }
}
```

The latter is more legible and encouraging of scope.

```scss
.foo {
  .bar {
    padding: 20px;
  }
}

.a-foo {
  &__bar {
    padding: 20px;
  }
}
```

#### Pros:

- `.a-foo__bar` has lighter CSS specificity.
- `.a-foo__bar` is unique to `.a-foo` and will not leak "heavier" `.bar` properties to child
  components using `.bar`.

#### Cons:

- Ampersand nesting makes it hard to inspect & search complete classnames. If BEM practices aren't
  observed properly and styles for `.foo` elements are not handled exclusively in the Foo component,
  this can hinder developers in finding layout bugs.
- aBEM Modifiers break the ability of ampersands to work properly:

```scss
.a-foo {
  &__bar {
    color: blue;
  }

  &.-baz {
    // &__bar doesn't work here
    .a-foo__bar {
      color: red;
    }
  }
}
```
