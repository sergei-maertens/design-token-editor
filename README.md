# Design token editor

[![Build package](https://github.com/sergei-maertens/design-token-editor/actions/workflows/build.yml/badge.svg)](https://github.com/sergei-maertens/design-token-editor/actions/workflows/build.yml)
[![Build and publish storybook](https://github.com/sergei-maertens/design-token-editor/actions/workflows/storybook.yml/badge.svg)](https://github.com/sergei-maertens/design-token-editor/actions/workflows/storybook.yml)
[![NPM package](https://img.shields.io/npm/v/design-token-editor.svg)](https://www.npmjs.com/package/design-token-editor)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

Provide insight into design tokens and edit their values.

This package provides React components to work with design tokens emitted by
[Style Dictionary](https://amzn.github.io/style-dictionary/) builds.

**Warning** - this package is under active development and public API may still change
significantly.

[Storybook][Storybook] documents the (public) API.

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

Please see the [Storybook][Storybook] documentation.

[Storybook]: https://sergei-maertens.github.io/design-token-editor/
