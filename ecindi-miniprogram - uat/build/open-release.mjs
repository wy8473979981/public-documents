import shell from 'shelljs'
import { resolve } from 'path'

const folder = resolve('./dist/build/mp-weixin')
const command = `cli open --project ${folder}`

shell.exec(command)
