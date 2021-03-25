import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const status: string = core.getInput('status')
    const text: string = core.getInput('text')
    const channel: string = core.getInput('channel')
    const slack_token: string = core.getInput('slack_token')
    core.debug(`Processing ${status} ${text} ${channel} ${slack_token}`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
