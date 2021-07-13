# Configuration File

The interpreter can be configured through a `.0aconfig` file. The currently supported configuration options are listed below.

- allowMultiLine: **(boolean)**
- allowFileLoading: **(boolean)**
- specifyVal: **(boolean)**

Configuration files must start out by declaring the begin on the file with `<config>` and ended with `</config>`

```html
<config>
    <allowMultiLine>true</allowMultiLine>
    <allowFileLoading>true</allowFileLoading>
    <specifiyVal>true</specifyVal>
</config>
```

All options must be opened with `<NAME_OF_TAG>` and closed with `</NAME_OF_TAG>`, most options will take a boolean value inside the middle of the tags.

This update is included in all 0aInterpreter versions 0.7.6 and above.
- https://github.com/0aoq/0aInterpreter
- https://www.npmjs.com/package/0ainterpreter

The default configuration file can be found [here](https://github.com/0aoq/0aInterpreter/blob/main/.0aconfig).
