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
    const repoName: string = 'Example Workflow';
    const branchName: string = 'master';
    core.debug(`Processing ${status} ${text} ${channel} ${slackToken}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const { runId, job } = context;
    const sha = context.sha;
    const { owner, repo } = context.repo;
    const repoUrl = `https://github.com/${owner}/${repo}`;
    const client = new WebClient(slackToken, {
      logLevel: LogLevel.DEBUG
    });

    try {
      const result = await client.chat.postMessage({
        channel,
        text: '',
        username: 'CI Slack Notifier',
        attachments: [
          {
            title: job,
            title_link: `${repoUrl}/runs/${runId}`,
            text: `
              Status: *${status.toUpperCase()}*
              *Repo*: <${repoUrl}|${repoName}>
              *Branch*: <${repoUrl}/commit/${sha}|${branchName}>
              sha: 
              `,
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
