# Yandex.Cloud token generator
Action for GitHub, which helps generate tokens of Yandex Cloud.
Current supported token's:
 - [IAM](https://cloud.yandex.ru/docs/iam/concepts/authorization/iam-token)
 - k8s - This is  token for your [Managed Service for Kubernetes](https://cloud.yandex.ru/docs/managed-kubernetes/) config file. (aka [ExecCredential](https://kubernetes.io/docs/reference/config-api/client-authentication.v1beta1/)) 
## Action parameters description
 | Name                   | Description                                                               | Example                                                        |
 |------------------------|---------------------------------------------------------------------------|----------------------------------------------------------------|
 | service-account-token  | **Required params** Account token of your cloud                           | [Generate him](https://cloud.yandex.ru/docs/iam/quickstart-sa) |
 | type-token             | **Required params** Type of token you need, available: <br>- IAM<br>- k8s | `iam`                                                          |

## Example's of usage
 ### Basic usage
- In same job
```yaml
    - name: Create IAM token
      id: generation-iam-token
      uses: bigtows/yc-token@latest
      with:
        service-account-token: ${{ secrets.SERVICE_ACCOUNT_TOKEN }}
        type-token: iam
    - name: Test
      run: echo ${{ steps.generation-iam-token.outputs.iam-token }}
```
- Getting value from another job
```yaml
generate-token:
  runs-on: ubuntu-latest
  outputs:
    iam-token: ${{ steps.generation-iam-token.outputs.iam-token }}
  steps:
    - uses: actions/checkout@v2
    - name: Create IAM token
      id: generation-iam-token
      uses: bigtows/yc-token@latest
      with:
        service-account-token: ${{ secrets.SERVICE_ACCOUNT_TOKEN }}
        type-token: iam
another-job:
  runs-on: ubuntu-latest
  steps:
    - name: Echo IAM
      run:  echo ${{ needs.generate-token.outputs.iam-token }}
```

## Token for your kubernetes cluster

- Token usage example
```yaml
    - name: Create IAM token
      id: generation-iam-token
      uses: bigtows/yc-token@latest
      with:
        service-account-token: ${{ secrets.SERVICE_ACCOUNT_TOKEN }}
        type-token: k8s
    - name: Test
      run: echo ${{ steps.generation-iam-token.outputs.k8s-token }}
```

About how create `secrets.SERVICE_ACCOUNT_TOKEN` you can find [here](https://cloud.yandex.ru/docs/iam/operations/iam-token/create-for-sa) (--output key.json)

Based on template [actions/typescript-action](https://github.com/actions/typescript-action)