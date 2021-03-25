/* eslint-disable no-console */
import * as core from '@actions/core';
import { WebClient, LogLevel } from '@slack/web-api';

// WebClient insantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.

async function run(): Promise<void> {
  try {
    const status: string = core.getInput('status');
    const text: string = core.getInput('text');
    const channel: string = core.getInput('channel');
    const slackToken: string = core.getInput('slack_token');
    core.debug(`Processing ${status} ${text} ${channel} ${slackToken}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const client = new WebClient(slackToken, {
      logLevel: LogLevel.DEBUG
    });

    try {
      const result = await client.chat.postMessage({
        channel,
        text,
        color: 'green',
        attachments: [
          {
            title:
              '[FIRING:2] InstanceDown for api-server (env="prod", severity="critical")',
            title_link: 'https://alertmanager.local//#/alerts?receiver=default',
            text:
              ":chart_with_upwards_trend: *<http://generator.local/1|Graph>*   :notebook: *<https://runbook.local/1|Runbook>*\n\n*Alert details*:\n*Alert:* api-server down - `critical`\n*Description:* api-server at 1.2.3.4:8080 couldn't be scraped *Details:*\n   • *alertname:* `InstanceDown`\n   • *env:* `prod`\n   • *instance:* `1.2.3.4:8080`\n   • *job:* `api-server`\n   • *severity:* `critical`\n  \n*Alert:* api-server down - `critical`\n*Description:* api-server at 1.2.3.4:8081 couldn't be scraped *Details:*\n   • *alertname:* `InstanceDown`\n   • *env:* `prod`\n   • *instance:* `1.2.3.4:8081`\n   • *job:* `api-server`\n   • *severity:* `critical`\n  \n",
            color: 'danger',
            mrkdwn_in: ['pretext', 'text']
          }
        ]
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
