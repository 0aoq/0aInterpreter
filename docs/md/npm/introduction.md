# npm introduction

To download 0aInterpreter from npm use
```
npm i 0ainterpreter
```

If downloading from npm, it is recommended that you run `buildLaunch()` and then use the generated batch file to run 0aInterpreter.

The generated batch file will look somewhat like the following:

```batch
:: Generated from 0aInterpreter.buildLaunch()
:: Provides an entry point to the 0aInterpreter CLI

@echo off
node PATH_TO_INDEX_.JS
pause
```