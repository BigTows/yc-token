import * as core from '@actions/core'
import YandexCloudInitializer from './yc/yandex-cloud-initializer'

async function run(): Promise<void> {
  try {
    const secretToken: string = core.getInput('service-account-token')
    const yc = new YandexCloudInitializer('service-account-key', secretToken)
    createTokenByType(yc, core.getInput('type-token'))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function createTokenByType(yc: YandexCloudInitializer, typeToken: string) {
  switch (typeToken.toLowerCase()) {
    case 'iam': {
      yc.createIamToken()
      break
    }
    default: {
      core.debug('Undefined token type: ' + typeToken)
    }
  }
}

run()
