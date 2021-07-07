# Learn functions
Functions in 0a are very simple to learn. You start a function with:

```
func &;NAME{/s}
```

the `{/s}` shows the start of the function, and `&;NAME` represents the name of your function. The following function is just named test:

```
func test{/s}
```

Functions must all be closed with an `{/end} &;NAME` to show that is the end of the function, and the parser should continue on normally. The following is a simple
function that logs "Hello, world!" to the output.

```
func logTest{/s}
    log (Hello, world!)
{/end} logTest
```

Functions are run with the [run](index.html?md/keywords/run.md) command. The following will run our newly made function.

```
run logTest ()
// expected output: Hello, world!
```

Arguments can also be passed into a function. Let's say our `logTest` function now looks like this:

```
func logTest{/s}
    log ($:logThis)
{/end} logTest
```

We are now showing that we want to log the `$:logThis` parameter, $: variables are function specific parameters. It would now be run with:

```
run logTest (logThis = Hello, world!)
// expected output: Hello, world!
```

The different types of variables are explained in the [understanding variables](index.html?md/guides/variables.md) guide. For information on function limits, please view the [api](index.html?md/api/keywords/func.md).

The ending code from this guide looks like:

```
// guides/learnfunc.md
// basic example of functions with parameters
// log whatever parameter is passed

func logTest{/s}
    log ($:logThis)
{/end} logTest

run logTest (logThis = Hello, world!)
// expected output: Hello, world!
```

<br><br>