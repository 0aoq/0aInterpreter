# if
Runs code based on the result of a query

- statement: **(string)**
- run: **(0a)**

```
func ifTest{/s}
    // logs "true" if value == another
    if $:param1 == hello do log log ("true")
        
    // logs "false" if value != another
    ifnot $:param2 == test_ing do log ("false")
{/end} ifTest
    
run ifTest (param1 = hello; param2 = testing)

// expected output: true
// expected output: false
```

See: [function](index.html?md/api/keywords/func.md)