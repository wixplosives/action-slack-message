/* eslint-disable no-console */
import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel } from '@slack/web-api';
import { Octokit } from '@octokit/core';
import type { Status } from './types';
import { createSlackAttachment } from './components/create-slack-attachment';
import { getTextString } from './components/get-text-string';

const getActionLink = async (
    repoOwner: string,
    repoName: string,
    runId: number,
    jobName: string,
    matrixOs: string,
    matrixNode: string
): Promise<string> => {
    const github_token = process.env['GITHUB_TOKEN'];
    const octokit = new Octokit({ auth: github_token });
    const response = await octokit.request(
        'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs',
        {
            owner: repoOwner,
            repo: repoName,
            run_id: runId
        }
    );
    let jobId;
    for (const job of response.data.jobs) {
        const currentJobName = job.name;
        if (
            currentJobName.includes(jobName) &&
            currentJobName.includes(matrixOs) &&
            currentJobName.includes(matrixNode)
        ) {
            jobId = String(job.id);
            jobName = currentJobName;
            break;
        }
    }
    if (!jobId) throw new Error('Action link not found');
    return jobId;
};

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

        const { workflow, sha, ref } = context;
        const { owner: repoOwner, repo: repoName } = context.repo;
        const runId = context.runId;

        if (!actionLink) {
            const innerJobId = await getActionLink(
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
            logLevel: LogLevel.DEBUG
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

            console.log(result);
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
