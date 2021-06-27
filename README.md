[![Build Status](https://github.com/wixplosives/action-slack-message/workflows/tests/badge.svg)](https://github.com/wixplosives/action-slack-message/actions)

# Slack Message Action

- Use this action to send slack notification from github actions.
- This action also let you extract the inner jobs link for each workflow

This action includes compilation support, tests, a validation workflow, publishing, and versioning guidance.

## Install

`Node >= v9`

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

## Run it to send slack message

This is most basic example of how to run the action.

```yaml
- name: Notify slack
  uses: 'wixplosives/action-slack-message@master'
  with:
    text: 'My text is so awesome'
    channel: 'testing-yarden-public'
    slack_token: ${{ secrets.SLACK_BOT_TOKEN }}
```

### Run it to notify about job status

`if always()` is required because we want to send status update even if action fails.

```yaml
- name: Notify slack
  if: always()
  uses: 'wixplosives/action-slack-message@master'
  with:
    text: 'My text is so awesome'
    status: ${{job.status}}
    channel: 'testing-yarden-public'
    slack_token: ${{ secrets.SLACK_BOT_TOKEN }}
```

### **Custom job name**

When you define a custom job name, like this

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
            uses: 'wixplosives/action-slack-message@master'
            ...
            with:
                ...
                custom_job_name: some custom name
```

### **output format**

passing the following values to "output_format" will modify the output as follows:
`simple` : removes attachment from message

any other values will result in the default formatting

## Usage in a private repo:

Add github.token as an environment variable

```yaml
- name: Notify slack
  uses: 'wixplosives/action-slack-message@master'
  env:
    GITHUB_TOKEN: ${{ github.token }}
```

## Send a file:

Add github.token as an environment variable

```yaml
- name: Notify slack
  uses: 'wixplosives/action-slack-message@master'
  env:
    GITHUB_TOKEN: ${{ github.token }}
  with:
    channel: 'testing-yarden-public'
    slack_token: ${{ secrets.SLACK_BOT_TOKEN }}
    file_name: file.txt
```
