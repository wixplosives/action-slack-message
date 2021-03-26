/* eslint-disable no-console */
import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel } from '@slack/web-api';
import { colors } from './const';
import type { Status } from './types';

async function run(): Promise<void> {
  try {
    const status = core.getInput('status') as Status;
    const text: string = core.getInput('text');
    const channel: string = core.getInput('channel');
    const slackToken: string = core.getInput('slack_token');
    const actionLink: string = core.getInput('action_link');

    core.debug(
      `Processing ${status} ${text} ${channel} ${slackToken} ${actionLink}`
    ); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const { workflow } = context;
    const sha = context.sha;
    const { owner, repo } = context.repo;
    const repoUrl = `https://github.com/${owner}/${repo}`;
    const { ref } = context;
    const branchName = ref.startsWith('refs/heads/') ? ref.slice(11) : ref;

    const textString: string = `
    Status: *${status.toUpperCase()}*
    *Repo*: <${repoUrl}|${repo}>
    *Branch*: <${repoUrl}/commit/${sha}|${branchName}>`;

    const client = new WebClient(slackToken, {
      logLevel: LogLevel.DEBUG
    });

    try {
      const result = await client.chat.postMessage({
        channel,
        text,
        username: 'CI Slack Notifier',
        attachments: [
          {
            title: workflow,
            title_link: actionLink || '',
            text: textString,
            color: colors[status],
            mrkdwn_in: ['text']
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
