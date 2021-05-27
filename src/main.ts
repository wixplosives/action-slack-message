import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel, MessageAttachment } from '@slack/web-api';
import { getJobId } from './get-job-id';
import type { Status } from './types';
import { getMessageText } from './get-message-text';
import { getWorkflowJobs } from './get-workflow-jobs';
import { colors } from './colors';
import { createReadStream } from 'node:fs';

async function run(): Promise<void> {
    const status = core.getInput('status') as Status;
    const text = core.getInput('text');
    const channel = core.getInput('channel');
    const slackToken = core.getInput('slack_token');
    const matrixOs = core.getInput('matrix_os');
    const matrixNode = core.getInput('matrix_node');
    const customJobName = core.getInput('custom_job_name');
    const fileName = core.getInput('fileName');
    let actionLink = core.getInput('action_link');

    // const jobName = customJobName || context.job;
    // const { workflow, sha, ref } = context;
    // const { owner: repoOwner, repo: repoName } = context.repo;
    // const runId = context.runId;

    // if (!actionLink) {
    //     const workflowJobs = await getWorkflowJobs({
    //         repoOwner,
    //         repoName,
    //         runId,
    //     });
    //     const jobId = getJobId({
    //         workflowJobs,
    //         jobName,
    //         matrixOs,
    //         matrixNode,
    //     });
    //     actionLink = `https://github.com/${repoOwner}/${repoName}/runs/${jobId}?check_suite_focus=true`;
    // }

    // const textString = getMessageText({
    //     status,
    //     repoOwner,
    //     repoName,
    //     ref,
    //     sha,
    //     matrixOs,
    //     matrixNode,
    // });

    const client = new WebClient(slackToken, {
        logLevel: LogLevel.ERROR,
    });

    // const slackAttachment: MessageAttachment = {
    //     title: `${workflow}${jobName ? `: ${jobName}` : ''} `,
    //     ['title_link']: actionLink,
    //     text: textString,
    //     color: colors[status],
    //     ['mrkdwn_in']: ['text'],
    // };

    // const result = await client.chat.postMessage({
    //     channel,
    //     text,
    //     attachments: [slackAttachment],
    // });

    if (fileName) {
        try {
            // Call the files.upload method using the WebClient
            const result = await client.files.upload({
                // channels can be a list of one to many strings
                channels: channel,
                // eslint-disable-next-line camelcase
                initial_comment: "Here's my file :smile:",
                // Include your filename in a ReadStream here
                file: createReadStream(fileName),
            });

            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }

    // eslint-disable-next-line no-console
    console.log(result);
}

// eslint-disable-next-line github/no-then
run().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    core.setFailed(e.message);
});
