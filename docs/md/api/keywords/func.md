# func
Create a new global function that can be accessed from any instance that requires it.

- name: **(string)**
- actions: **(0a)**

Functions can be nested up to 2 functions, this limit is for clean code, as well as readability. If you must go past this, please create a seperate function.
This limit also applies to other multi line objects, if you have a nested function inside of another function, a multi line object will not be parsed if it is within the
nested function.

```lua
func test do
    log ($:param)

    func test1 do
        log ("Nested1")

        func test2 do
            log ("Nested2")
        end test2
        
        run test2 ()
    end test1

    run test1 ()
end test

run test (param = "123")
```

Functions can also be run without using `run`

```lua
test (param = "123)
```

Note: Function parameter variables are not affected by configuration [specifyVal](https://0aoq.github.io/0aInterpreter/?md/config/specifyVal.md).