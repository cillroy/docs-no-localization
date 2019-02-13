# Docs Ignore Localization

[![Current-Version](https://vsmarketplacebadge.apphb.com/version/cillroy.docs-no-localization.svg)](https://marketplace.visualstudio.com/items?itemName=cillroy.docs-no-localization)

An extension to quickly add in the `noloc` markdown extension into your content.

`Ctrl+D Ctrl+N` will add the `noloc` extension based on the document language.

## Features

### Markdown

This will allow you to either select text and then run the extension (`ctrl+d ctrl+n`) to wrap the text with the markdown extension.  If no text is selected, then a markdown extension will be created with sample text.

```markdown
:::noloc text="String-To-Not-Localize":::
```

### Metadata

This will allow you to either select text and then run the extension (`ctrl+d ctrl+n`) to wrap the text with the metadata extension.  If no text is selected, then a metadata extension will be created with sample text.

```
noloc: [Words, to not, Localize]
```

### Yaml

This will allow you to either select text and then run the extension (`ctrl+d ctrl+n`) to wrap the text with the yaml extension.  If no text is selected, then a yaml extension will be created with sample text.

```yaml
noloc:
- String-To-Not-Localize
```
