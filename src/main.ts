import path from 'path';
import { createReadStream } from 'fs';
import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel, MessageAttachment } from '@slack/web-api';
import { getJobId } from './get-job-id';
import type { Status } from './types';
import { getMessageText } from './get-message-text';
import { getWorkflowJobs } from './get-workflow-jobs';
import { colors } from './colors';
import { getMatchingFiles, verifyFiles } from './send-file';

async function run(): Promise<void> {
    const status = core.getInput('status') as Status;
    const text = core.getInput('text');
    const channel = core.getInput('channel');
    const slackToken = core.getInput('slack_token');
    const matrixOs = core.getInput('matrix_os');
    const matrixNode = core.getInput('matrix_node');
    const customJobName = core.getInput('custom_job_name');
    const fileName = core.getInput('file_name');
    const filePattern = core.getInput('file_pattern');
    let actionLink = core.getInput('action_link');

    // eslint-disable-next-line no-console
    console.log({ status, text, channel, matrixOs, matrixNode, customJobName, fileName, filePattern, actionLink });

    const jobName = customJobName || context.job;
    const { workflow, sha, ref } = context;
    const { owner: repoOwner, repo: repoName } = context.repo;
    const runId = context.runId;

    if (fileName || filePattern) {
        await verifyFiles({ fileName, filePattern });
    }

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
        attachments: [slackAttachment],
    });

    // eslint-disable-next-line no-console
    console.log(result);

    if (fileName || filePattern) {
        if (filePattern) {
            // eslint-disable-next-line no-console
            console.log('Sending files by pattern...');

            const filePaths = await getMatchingFiles(filePattern);

            for (const filepath of filePaths) {
                // eslint-disable-next-line no-console
                console.log(`Sending file: ${path.parse(filepath).base}`);

                const results = await client.files.upload({
                    channels: channel,
                    ['initial_comment']: `File \`${path.parse(filepath).base}\` sent for job: ${jobName}`,
                    file: createReadStream(filepath),
                });

                // eslint-disable-next-line no-console
                console.log(results);
            }
        } else {
            const filePath = path.resolve(fileName);
            const results = await client.files.upload({
                channels: channel,
                ['initial_comment']: `File \`${path.parse(filePath).base}\` sent for job: ${jobName}`,
                file: createReadStream(fileName),
            });

            // eslint-disable-next-line no-console
            console.log(results);
        }
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
