/* eslint-disable no-console */
import * as core from '@actions/core';
import { context } from '@actions/github';
import { WebClient, LogLevel } from '@slack/web-api';
import { colors } from './const';
import type { Status, MrkDwnIn } from './types';
//import { Octokit } from '@octokit/core';

const getActionLink = (): string => {
    return String(context.runId);
};

async function run(): Promise<void> {
    try {
        const status = core.getInput('status') as Status;
        const text: string = core.getInput('text');
        const channel: string = core.getInput('channel');
        const slackToken: string = core.getInput('slack_token');
        let actionLink: string = core.getInput('action_link');
        core.debug(
            `Processing ${status} ${text} ${channel} ${slackToken} ${actionLink}`
        ); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

        const { workflow, sha, ref } = context;
        const { owner: repoOwner, repo: repoName } = context.repo;

        if (!actionLink) actionLink = getActionLink();

        const textString = getTextString({
            status,
            repoOwner,
            repoName,
            ref,
            sha
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
}

export const getTextString = ({
    status,
    repoOwner,
    repoName,
    ref,
    sha
}: ITextString): string => {
    const repoUrl = `https://github.com/${repoOwner}/${repoName}`;
    const statusString = status ? `Status: *${status.toUpperCase()}*` : '';
    const repoString = `*Repo*: <${repoUrl}|${repoName}>`;

    const branchName = ref.startsWith('refs/heads/') ? ref.slice(11) : ref;
    const branchString = `*Branch*: <${repoUrl}/commit/${sha}|${branchName}>`;

    return `${statusString}\n${repoString}\n${branchString}`;
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
