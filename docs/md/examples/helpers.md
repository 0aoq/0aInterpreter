# helpers.0a

The following is a function that is useful for organizing the [mk](/?md/api/files/mk.md) command.

```
func makeFile{/s}
    // check if $:fileName exists, stop if not
    if $:fileName == null => SyntaxError Please provide a fileName parameter.
    if $:fileName == null => {/stop}
    if $:fileName == $:fileName => log Creating File: $:fileName

    // create file
    if $:makeDir == true => mk includedir $:fileName
    if $:makeDir == false => mk false $:fileName

    log (File created!)
{/end} makeFile
```