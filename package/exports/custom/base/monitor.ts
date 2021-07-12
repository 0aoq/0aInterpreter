import { createCmdFromFile } from '../../../core/index.js';
import { getArgs} from '../../../core/utility.js';

import * as os from 'os'

const colors = require('colors')

createCmdFromFile("monitor", false, function ($) {
    let $for = parseInt(getArgs($.cmd, 2, 0))
    let waited = 0

    if (!isNaN($for)) {
        console.log(`Monitoring CPU ${os.cpus()[0].model} on ${os.hostname()}, on platform ${os.platform()}, ${os.arch()}`)
        setInterval(function() {
            if (waited < $for) {
                waited++
                
                let total = os.totalmem()
                let free = os.freemem()
                let used = total - free
                let human = Math.ceil(used / 1000000) + ' MB'
        
                if (used > total * 0.8) {
                    console.log(colors.red(colors.bold(`${human}/${total / 1000000 + ' MB'}`)))
                } else {
                    console.log(colors.green(`${human}/${total / 1000000 + ' MB'}`))
                }
            }
        }, 1000)
    }
})