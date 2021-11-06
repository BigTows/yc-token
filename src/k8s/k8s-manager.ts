import * as fs from 'fs'
import YAML from 'yaml'

//@typescript-eslint/no-extraneous-class
export default function k8sManager(token: string): void {
  const kubeConfig = YAML.parse(
    fs.readFileSync('/Users/bigtows/.kube/config', 'utf-8')
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
  fs.writeFileSync('/Users/bigtows/.kube/config', YAML.stringify(kubeConfig))
}
