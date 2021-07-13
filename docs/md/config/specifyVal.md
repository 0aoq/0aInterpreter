# specifyVal

```html
<specifyVal>true</specifyVal>
```

`specifyVal` is used to determine if variables should be specifed using `val:VARIABLE_NAME` or just `VARIABLE_NAME`

```lua
# specifyVal ENABLED

val test = "Hello, world!"
log (val:test)

# specifyVal DISABLED

val test = "Hello, world!"
log (test)
```

Note: specifyVal only affects global variables, any parameters must still be specified with `$:PARAMETER_NAME`