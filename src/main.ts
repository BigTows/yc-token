import * as core from '@actions/core'
import YandexCloudInitializer from './yc/yandex-cloud-initializer'

async function run(): Promise<void> {
  try {
    const secretToken: string = core.getInput('service-account-token')
    const yc = new YandexCloudInitializer('service-account-key', secretToken)
    await createTokenByType(yc, core.getInput('type-token'))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function createTokenByType(
  yc: YandexCloudInitializer,
  typeToken: string
) {
  switch (typeToken.toLowerCase()) {
    case 'iam': {
      yc.createIamToken()
      break
    }
    case 'k8s': {
      await yc.createK8sToken(core.getInput('cluster-id'))
      break
    }
    default: {
      core.debug('Undefined token type: ' + typeToken)
    }
  }
}

run()
