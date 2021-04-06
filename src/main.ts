/* eslint-disable no-console */
import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel } from '@slack/web-api';
import { colors } from './const';
import type { Status, MrkDwnIn } from './types';
import { Octokit } from '@octokit/core';

const getActionLink = async (
    repoOwner: string,
    repoName: string,
    runId: number,
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
        const jobName = job.name;
        if (jobName.includes(matrixOs) && jobName.includes(matrixNode)) {
            jobId = String(job.id);
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
        console.log(matrixNode);

        const { workflow, sha, ref } = context;
        const { owner: repoOwner, repo: repoName } = context.repo;
        const runId = context.runId;

        if (!actionLink) {
            const innerJobId = await getActionLink(
                repoOwner,
                repoName,
                runId,
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
                        status
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

export interface ITextString {
    status?: string;
    repoOwner: string;
    repoName: string;
    ref: string;
    sha: string;
    matrixOs?: string;
    matrixNode?: string;
}

export const getTextString = ({
    status,
    repoOwner,
    repoName,
    ref,
    sha,
    matrixOs,
    matrixNode
}: ITextString): string => {
    const repoUrl = `https://github.com/${repoOwner}/${repoName}`;
    const statusString = status ? `Status: *${status.toUpperCase()}*` : '';
    const repoString = `*Repo*: <${repoUrl}|${repoName}>`;
    const os = `${matrixOs ? `OS: ${matrixOs}` : ''}`;
    const node = `${matrixOs ? `\n${' '.repeat(14)}` : ''} ${
        matrixNode ? `Node version: ${matrixNode}` : ''
    }`;
    const branchName = ref.startsWith('refs/heads/') ? ref.slice(11) : ref;
    const branchString = `*Branch*: <${repoUrl}/commit/${sha}|${branchName}>`;
    const details = matrixOs || matrixNode ? `*Details*: ${os} ${node}` : '';

    return `${statusString}\n${repoString}\n${branchString}\n${details}`;
};

export interface ICreateSlackAttachment {
    workflow: string;
    actionLink: string;
    textString: string;
    status: Status;
}

export interface ISlackAttachment {
    title: string;
    title_link: string;
    text: string;
    color: string;
    mrkdwn_in: MrkDwnIn;
}

export const createSlackAttachment = ({
    workflow,
    actionLink,
    textString,
    status
}: ICreateSlackAttachment): ISlackAttachment => {
    return {
        title: workflow,
        title_link: actionLink,
        text: textString,
        color: colors[status],
        mrkdwn_in: ['text']
    };
};

run();
