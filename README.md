# Design token editor

[![NPM package](https://img.shields.io/npm/v/design-token-editor.svg)](https://www.npmjs.com/package/design-token-editor)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

Provide insight into design tokens and edit their values.

This package provides React components to work with design tokens emitted by
[Style Dictionary](https://amzn.github.io/style-dictionary/) builds.

**Warning** - this package is under active development and public API may still change
significantly.

## Who is it for?

In short - anyone benefiting from using design tokens!

### Design system maintainers

Design systems that make use of design tokens typically do so to allow users to create
their own themes. Using the `TokensTable` component can help you **automatically**
document the available tokens for a given component.

More complex integration could even make it possible for people to interactively alter
the values of design tokens and see how the component reacts/looks like in your
storybook documentation, for example!

### Theme designers

Theme designers often have the hard task of figuring out which components are available,
where and how they are used and the figure out how they can change the look and feel.

When all that's done, they have to write JSON to actually implement their theme, get it
built with style-dictionary and finally check the results.

By exposing an editor around the tokens table, theme designers can interactively enter
the values to play around with components _and_ see the resulting JSON code which only
needs to be copy-pasted into their own build pipeline.

Combine this with interactive documentation, and as a theme designer you may get to
experiment and settle on your desired colors in a minimum of time!

### Applications exposing themeing controls

White-label products/software benefit massively from using components styled through
design tokens, making it even possible for run-time theme editing.

Exposing the design-token-editor in a user-friendly interface helps them configure their
themes without having to bother your support staff ;)

## Usage

See the [Storybook](https://sergei-maertens.github.io/design-token-editor/)
documentation for the available components and public API.

### Including the styles

The package ships with stylesheets to include for proper styling:

- `design-token-editor/lib/css/dte.css` with the styles
- `design-token-editor/lib/css/index.css` (or `root.css`) with the default theme values

Note that the `index.css` has the theme values scoped under the `.dte-default-theme`
selector, while the `root.css` uses the `root:` selector. Using the former is
recommended, but it requires you to apply the `dte-default-theme` class name to your
container element.

You are of course free to create your own theme, in which case you should specify the
appropriate selector to use.

### Rendering a table of available tokens

For example in storybook MDX format:

```jsx
import {TokensTable} from 'design-token-editor';
import myTokens from 'my-design-tokens/dist/tokens';

<div className="dte-default-theme">
  <TokensTable container={myTokens} autoExpand />;
</div>;
```

### Providing the editor

**Warning** - the editor is WIP

```jsx
import {TokenEditor} from 'design-token-editor';
import myTokens from 'my-design-tokens/dist/tokens';

<div className="dte-default-theme">
  <TokenEditor tokens={myTokens} initialValues={{'my.tokens.foo': 'bar'}} />;
</div>;
```
