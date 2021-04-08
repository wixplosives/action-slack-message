<p align="center">
  <a href="https://github.com/wixplosives/action-slack-message/actions"><img alt="typescript-action status" src="https://github.com/wixplosives/action-slack-message/workflows/build-test/badge.svg"></a>
</p>

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

````yaml
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
````

# Edit this TypeScript Action

Use this template to bootstrap the creation of a TypeScript action.

This template includes compilation support, tests, a validation workflow, publishing, and versioning guidance.

If you are new, there's also a simpler introduction. See the [Hello World JavaScript Action](https://github.com/actions/hello-world-javascript-action)

## Create an action from this template

Click the `Use this Template` and provide the new repo details for your action

## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

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

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
    milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:
