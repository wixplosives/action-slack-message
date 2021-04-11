<p align="center">
  <a href="https://github.com/wixplosives/action-slack-message/actions"><img alt="typescript-action status" src="https://github.com/wixplosives/action-slack-message/workflows/build-test/badge.svg"></a>
</p>

# Slack Message Action

-   Use this action to send slack notification from github actions.
-   This action also let you extract the inner jobs link for each workflow

This action includes compilation support, tests, a validation workflow, publishing, and versioning guidance.

## Install

`Node >= v9`

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

## Arguments

### **Custom job name**

When you define a custom job name, like this:

```yaml
notify-custom-name:
    runs-on: ${{ matrix.os }}
    name: some custom name # <<< CUSTOM JOB NAME DEFINED HERE
    strategy:
        matrix:
            os: [ubuntu-latest, windows-latest]
```

You need to pass as an argument the custom job name, as the following:

```yaml
        steps:
            - name: Notify slack
              uses: 'wixplosives/action-slack-message@main'
              ...
              with:
                  ...
                  custom_job_name: some custom name
```

## Usage in a private repo:

Add github.token as an environment variable

```yaml
- name: Notify slack
  uses: 'wixplosives/action-slack-message@main'
  env:
      GITHUB_TOKEN: ${{ github.token }}
```
