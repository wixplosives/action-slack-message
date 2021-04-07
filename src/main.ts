import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel } from '@slack/web-api';
import { getInnerJobId } from './components/get-inner-job-id';
import type { Status } from './types';
import { createSlackAttachment } from './components/create-slack-attachment';
import { getTextString } from './components/get-text-string';

async function run(): Promise<void> {
    try {
        const status = core.getInput('status') as Status;
        const text: string = core.getInput('text');
        const channel: string = core.getInput('channel');
        const slackToken: string = core.getInput('slack_token');
        const matrixOs = core.getInput('matrix_os');
        const matrixNode = core.getInput('matrix_node');
        let actionLink: string = core.getInput('action_link');

        const jobName = context.job;
        console.log(jobName);
        const { workflow, sha, ref } = context;
        const { owner: repoOwner, repo: repoName } = context.repo;
        const runId = context.runId;

        if (!actionLink) {
            const innerJobId = await getInnerJobId(
                repoOwner,
                repoName,
                runId,
                jobName,
                matrixOs,
                matrixNode
            );
            actionLink = `https://github.com/${repoOwner}/${repoName}/runs/${innerJobId}?check_suite_focus=true`;
        }

        const textString = getTextString({
            status,
            repoOwner,
            repoName,
            ref,
            sha,
            matrixOs,
            matrixNode
        });

        const client = new WebClient(slackToken, {
            logLevel: LogLevel.ERROR
        });

        try {
            const result = await client.chat.postMessage({
                channel,
                text,
                attachments: [
                    createSlackAttachment({
                        workflow,
                        actionLink,
                        textString,
                        status,
                        jobName
                    })
                ]
            });

            // eslint-disable-next-line no-console
            console.log(result);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
