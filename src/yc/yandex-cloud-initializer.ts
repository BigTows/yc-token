import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import K8sManager from '../k8s/k8s-manager'
import {execSync} from 'child_process'

const YC_BASE_PATH = '/home/runner/yandex-cloud'
const YC_INSTALLER = `curl -sS https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash`

const ALLOWED_TYPE_AUTHORIZATION = new Map([
  [
    'service-account-key',
    (secretToken: string) => {
      core.debug('Add service-account-key')
      fs.appendFileSync(`${YC_BASE_PATH}/secret.json`, secretToken)
      execSync(`yc config set service-account-key ${YC_BASE_PATH}/secret.json`)
      fs.unlinkSync(`${YC_BASE_PATH}/secret.json`)
    }
  ]
])

export default class YandexCloudInitializer {
  constructor(typeAuthorization: string, data: string) {
    const processorAuthorization =
      ALLOWED_TYPE_AUTHORIZATION.get(typeAuthorization)
    if (processorAuthorization === undefined) {
      throw new Error('Unsupported type of authorization')
    }
    YandexCloudInitializer.initializeCli()
    processorAuthorization(data)
  }

  /**
   * Initialize CLI of yandex.cloud
   * @private
   */
  private static initializeCli(): void {
    if (fs.existsSync(`${YC_BASE_PATH}/bin/yc`)) {
      core.debug('YandexCloud CLI is already initialized')
      return
    }
    core.debug(execSync(YC_INSTALLER).toString())
    core.addPath(`${YC_BASE_PATH}/bin`)
    core.debug('YandexCloud CLI initialized')
  }

  /**
   * Create IAM token
   */
  createIamToken(): void {
    core.debug('Start creating an iam token')
    const iamToken: string = execSync(`yc iam create-token`).toString()
    core.setSecret(iamToken)
    core.setOutput('iam-token', iamToken)
  }

  async createK8sToken(clusterId: string): Promise<void> {
    core.debug('Start creating a k8s token')
    await exec.exec(
      `yc managed-kubernetes cluster get-credentials --id ${clusterId} --external`
    )
    const output = await exec.getExecOutput('yc k8s create-token')

    K8sManager(output.stdout)

    const k8sToken: string = execSync(
      `yc managed-kubernetes cluster get-credentials --id ${clusterId} --external`
    )
      .toString()
      .trim()
    core.setSecret(k8sToken)
    core.setOutput('k8s-token', k8sToken)
  }
}
