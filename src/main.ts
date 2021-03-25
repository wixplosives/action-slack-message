/* eslint-disable no-console */
import * as core from '@actions/core';
import { WebClient, LogLevel } from '@slack/web-api';
import { colors } from './const';
import type { Status } from './types';

async function run(): Promise<void> {
  try {
    const status = core.getInput('status') as Status;
    const text: string = core.getInput('text');
    const channel: string = core.getInput('channel');
    const slackToken: string = core.getInput('slack_token');
    const repoName: string = 'someRepoName';
    const workflowName: string = 'someWorkflowName';
    const branchName: string = 'someBranchName';
    core.debug(`Processing ${status} ${text} ${channel} ${slackToken}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const client = new WebClient(slackToken, {
      logLevel: LogLevel.DEBUG
    });

    try {
      const result = await client.chat.postMessage({
        channel,
        text: '',
        attachments: [
          {
            title: workflowName,
            title_link: 'https://workflow.link',
            text: `Status: ${status.toUpperCase()}
            **Repo**: <http://repo.url|${repoName}>
            **Branch**: <http://branch.commit.url|${branchName}>
            *Alert details*:\n*Alert:* api-server down - \n*Description:* api-server at 1.2.3.4:8080 couldn't be scraped *Details:*\n   • *alertname:* \n`,
            color: colors[status],
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
