import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel } from '@slack/web-api';
import { getJobId } from './components/get-job-id';
import type { Status } from './types';
import { createSlackAttachment } from './components/create-slack-attachment';
import { getTextString } from './components/get-text-string';
import { getWorkflowJobs } from './components/get-workflow-jobs';

async function run(): Promise<void> {
    try {
        const status = core.getInput('status') as Status;
        const text: string = core.getInput('text');
        const channel: string = core.getInput('channel');
        const slackToken: string = core.getInput('slack_token');
        const matrixOs = core.getInput('matrix_os');
        const matrixNode = core.getInput('matrix_node');
        const customJobName = core.getInput('custom_job_name');
        let actionLink: string = core.getInput('action_link');

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

        const textString = getTextString({
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

        const slackAttachment = createSlackAttachment({
            workflow,
            actionLink,
            textString,
            status,
            jobName,
        });

        try {
            const result = await client.chat.postMessage({
                channel,
                text,
                attachments: [slackAttachment],
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

void run();
