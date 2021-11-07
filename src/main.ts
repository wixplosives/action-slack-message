import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel, MessageAttachment } from '@slack/web-api';
import { getJobId } from './get-job-id';
import type { Status } from './types';
import { getMessageText } from './get-message-text';
import { getWorkflowJobs } from './get-workflow-jobs';
import { colors } from './colors';
import { sendFile, sendFiles, verifyFiles } from './send-file';

async function run(): Promise<void> {
    const status = core.getInput('status') as Status;
    const text = core.getInput('text');
    const channel = core.getInput('channel');
    const slackToken = core.getInput('slack_token');
    const matrixOs = core.getInput('matrix_os') ?? core.getInput('matrix_platform');
    const matrixNode = core.getInput('matrix_node');
    const customJobName = core.getInput('custom_job_name');
    const fileName = core.getInput('file_name');
    const filePattern = core.getInput('file_pattern');
    const outputFormat = core.getInput('output_format');
    let actionLink = core.getInput('action_link');

    // eslint-disable-next-line no-console
    console.log({ status, text, channel, matrixOs, matrixNode, customJobName, fileName, filePattern, actionLink });

    const jobName = customJobName || context.job;
    const { workflow, sha, ref } = context;
    const { owner: repoOwner, repo: repoName } = context.repo;
    const runId = context.runId;

    if (!actionLink) {
        const workflowJobs = await getWorkflowJobs({
            repoOwner,
            repoName,
            runId,
        });
        const jobId = getJobId({
            workflowJobs,
            jobName,
            matrixOs,
            matrixNode,
        });
        actionLink = `https://github.com/${repoOwner}/${repoName}/runs/${jobId}?check_suite_focus=true`;
    }

    const textString = getMessageText({
        status,
        repoOwner,
        repoName,
        ref,
        sha,
        matrixOs,
        matrixNode,
    });

    const client = new WebClient(slackToken, {
        logLevel: LogLevel.ERROR,
    });

    const slackAttachment: MessageAttachment = {
        title: `${workflow}${jobName ? `: ${jobName}` : ''} `,
        ['title_link']: actionLink,
        text: textString,
        color: colors[status],
        ['mrkdwn_in']: ['text'],
    };

    const result = await client.chat.postMessage({
        channel,
        text,
        attachments: outputFormat === 'simple' ? [] : [slackAttachment],
    });

    // eslint-disable-next-line no-console
    console.log(result);

    if (fileName || filePattern) {
        await verifyFiles({ fileName, filePattern });
    }

    if (filePattern) {
        await sendFiles({ client, filePattern, channel, jobName });
    }
    if (fileName) {
        await sendFile({ client, fileName, channel, jobName });
    }
}

// eslint-disable-next-line github/no-then
run().catch((e) => {
    const fail = (core.getInput('fail_on_error') || 'false').toUpperCase() === 'TRUE';
    // eslint-disable-next-line no-console
    console.error(e);
    if (fail) {
        core.setFailed(e.message);
    } else {
        core.info(e.message);
    }
});
