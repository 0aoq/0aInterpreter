# helpers.0a

The following is a function that is useful for organizing the [mk](https://0aoq.github.io/0aInterpreter/?md/api/files/mk.md) command.

```lua
func makeFile do
    # makeFile (makeDir = true, fileName = test.txt)

    #  check if $:fileName exists, stop if not
    if $:fileName == null do SyntaxError Please provide a fileName parameter. else log ("Creating $:fileName")

    #  create file
    if $:makeDir == true do mk includedir $:fileName else mk false $:fileName

    log ("Created file")
end makeFile
```