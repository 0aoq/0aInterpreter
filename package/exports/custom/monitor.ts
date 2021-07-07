import { createCmdFromFile } from '../../core/index.js';
import { getArgs} from '../../core/utility.js';

let clui = require("clui")
let os = require('os')

createCmdFromFile("monitor", false, function ($) {
    let $for = parseInt(getArgs($.cmd, 2, 0))
    let waited = 0

    if (!isNaN($for)) {
        console.log(`Monitoring CPU ${os.cpus()[0].model} on ${os.hostname()}, on platform ${os.platform()}, ${os.arch()}`)
        setInterval(function() {
            if (waited < $for) {
                waited++
        
                let Gauge = clui.Gauge
        
                let total = os.totalmem()
                let free = os.freemem()
                let used = total - free
                let human = Math.ceil(used / 1000000) + ' MB'
        
                console.log(Gauge(used, total, 20, total * 0.8, human))
            }
        }, 1000)
    }
})