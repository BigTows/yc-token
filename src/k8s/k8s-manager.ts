import * as fs from 'fs'
import YAML from 'yaml'

export default class K8sManager {
  basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  setToken(token: string): void {
    const kubeConfig = YAML.parse(
      fs.readFileSync(`${this.basePath}/config`, 'utf-8')
    )

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
    fs.writeFileSync('/Users/bigtows/.kube/d', YAML.stringify(kubeConfig))
  }

  getConfig(): string {
    return fs.readFileSync(`${this.basePath}/config`, 'utf-8')
  }
}
