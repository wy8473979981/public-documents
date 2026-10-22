import shell from 'shelljs'
import { internalIpV4 } from 'internal-ip'
import replace from 'replace'

const existing = shell.test('-f', './.env.development.local')
if (!existing) {
  shell.cp('./.env.development', './.env.development.local')
}

var ip = await internalIpV4()
const targetValue = `VUE_APP_BASE = 'http://${ip}:9090'`

replace({
  regex: /VUE_APP_BASE = .*(http:).+/g,
  replacement: targetValue,
  paths: ['./.env.development.local'],
  recursive: false,
  silent: false
})

// shell.exec('yarn dev:mp-weixin')
