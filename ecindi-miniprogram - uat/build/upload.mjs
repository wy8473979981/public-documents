import shell from 'shelljs'

import { resolve } from 'path'
const folder = resolve('./dist/build/mp-weixin')
const logFile = resolve('./dist/build/info.json')

// import { version } from '../src/utils/baseconfig.js'

// mjs文件中无法直接引入js文件，所以需要通过shelljs来复制为mjs文件
// 1. 复制baseconfig.js为baseconfig.mjs，并放到dist目录下
shell.cp('src/utils/baseconfig.js', 'dist/baseconfig.mjs')
// 2. 导入baseconfig.mjs文件
const baseconfig = await import('../dist/baseconfig.mjs')
const version = baseconfig.version

const command = `cli upload --project ${folder} -v ${version} -d ${version} -i ${logFile}`

// 上传
shell.exec(command)

console.log('======== ********** ========')
console.log(version)
console.log('======== ********** ========')
