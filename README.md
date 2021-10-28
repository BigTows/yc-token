# Yandex.Cloud token generator
Action for GitHub, which helps generate tokens of yandex cloud.
Current supported token's:
 - [IAM](https://cloud.yandex.ru/docs/iam/concepts/authorization/iam-token)

## Example's of usage
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

About how create `secrets.SERVICE_ACCOUNT_TOKEN` you can find [here](https://cloud.yandex.ru/docs/iam/operations/iam-token/create-for-sa) (--output key.json)

Based on template [actions/typescript-action](https://github.com/actions/typescript-action)