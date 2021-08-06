import { config } from "../core/index.js"
import * as utility from "../core/utility.js"

const fs = require('fs')
const path = require('path')

// interprets the .0aconfig file
export function configparse () { // config file parsing
    try {
        if (fs.existsSync(path.resolve(process.cwd(), ".0aconfig"))) {
            fs.readFile(path.resolve(process.cwd(), ".0aconfig"), 'utf-8', function (err, data) {
                if (err) {
                    console.log(err)
                }
    
                let __init = false
                data.split(/\r?\n/).forEach((line) => {
                    for (let i = 0; i < 10000; i++) { // remove tabs up to 10,000, Error: line.replaceAll is not a function.
                        line = line.replace("    ", "") // remove \t spaces
                        line = line.replace("\t", "") // remove \t spaces
                    }
    
                    if (line == "<config>") {
                        __init = true
                    } else if (line == "</config>") {
                        __init = false
                    }
    
                    if (__init && line.split(" ")[0] != "#") {
                        let __tag_split = line.split(">")
                        let $$_ = []
    
                        for (let tag of __tag_split) {
                            $$_.push(tag.split("<"))
                        }
    
                        __tag_split = $$_
    
                        let boolean = utility.getBoolean(__tag_split[1][0]) 

                        /* 
                            Example: [ [ '', 'allowMultiLine' ], [ 'false', '/allowMultiLine' ], [ '' ] ] 
                            
                            From:
                            <config>
                                <allowMultiLine>false</allowMultiLine>
                            </config>
                        */
                        
                        if (boolean != null) {
                            if (__tag_split[1][1] == "/allowMultiLine") {
                                config[0].allowMultiLine = boolean
                            } else if (__tag_split[1][1] == "/allowFileLoading") {
                                config[0].allowFileLoading = boolean
                            } else if (__tag_split[1][1] == "/specifyVal") {
                                config[0].specifyVal = boolean
                            }
                        }
                    }
                })
            })
        }
    } catch (err) {
        console.error(err)
    }
}

export default {
    configparse
}