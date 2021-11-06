import * as fs from 'fs'
import YAML from 'yaml'

export default class K8sManager {
  basePath: string

  constructor(basePath: string) {
    this.basePath = `${basePath}/config`

    if (!fs.existsSync(this.basePath)) {
      throw new Error(`Can't find k8s configuration file at ${this.basePath}`)
    }
  }

  setToken(token: string): void {
    const kubeConfig = YAML.parse(fs.readFileSync(`${this.basePath}`, 'utf-8'))

    for (const user of kubeConfig.users) {
      if (user.user.exec === undefined) {
        user.user.exec = {}
        user.user.exec.apiVersion = 'client.authentication.k8s.io/v1beta1'
      }
      const execCredentials = user.user.exec
      execCredentials.command = 'echo'
      execCredentials.args = []

      execCredentials.args.push(token)
    }
    fs.writeFileSync(`${this.basePath}`, YAML.stringify(kubeConfig))
  }

  getConfig(): string {
    return fs.readFileSync(`${this.basePath}`, 'utf-8')
  }
}
