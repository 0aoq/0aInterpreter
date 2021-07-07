# Modules/Lua

The lua module is a built in module for generating lua code files.

Below is a snippet to create a file named `luatest.lua` which contains 5 lines.
```lua
lua.new luatest --sandbox:true do
    print("Hello, world!")

    function luafunction then
        print("Lua function")
    end
end luatest
```