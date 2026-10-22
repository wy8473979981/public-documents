import shell from 'shelljs'
import { resolve } from 'path'

const folder = resolve('./dist/dev/mp-weixin')
const command = `cli open --project ${folder}`

shell.exec(command)
