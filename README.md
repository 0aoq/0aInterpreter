# 0a Interpreter

Note that 0aInterpreter is meant to be used as a CLI, if using from npm use `buildLaunch()` to create a batch file to launch 0aInterpreter.
If launched from npm use the `run()` function to run a command from your file, configuration files, file loading, and custom commands are disabled if running from npm.

If downloading from github, make sure you use the typescript compiler to compile the typescript files into javascript files. 0aInterpreter can be run from `package/core/index.js` after being compiled.

## About

I tried to create a basic programming language interpreter for a simple language with little features and simple syntax.

Please note that I made this just for fun, and used it to learn more typescript than I already knew.

### Currently Includes

- Simple syntax
- Easy to use custom function system
    - For more information on custom functions/commands, view the [introduction guide](https://0aoq.github.io/0aInterpreter/?md/guides/customs.md).
- Simple to understand configuration system for configuring permissions
    - More information on the [introduction guide](https://0aoq.github.io/0aInterpreter/?md/config/introduction.md).

## Links

- Sourced at: https://github.com/0aoq/0aInterpreter
- Documentation at: https://0aoq.github.io/0aInterpreter ([0aInterpreter/docs](https://github.com/0aoq/0aInterpreter/tree/main/docs))
- Downloadable from [npm](https://www.npmjs.com/package/0ainterpreter) (CLI)

## License

The 0a Interpreter is licensed under the **GNU Lesser General Public License v2.1** license.
For more information of limits and permissions view [the license page](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html).

https://github.com/0aoq/0aInterpreter/blob/main/LICENSE
