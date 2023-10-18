import { Octokit } from '@octokit/core';

export interface IGetWorkflowJobsOptions {
    repoOwner: string;
    repoName: string;
    runId: number;
}

export const getWorkflowJobs = async ({ repoOwner, repoName, runId }: IGetWorkflowJobsOptions) => {
    const githubToken = process.env['GITHUB_TOKEN'];
    if (!githubToken) {
        throw new Error(`GITHUB_TOKEN environment variable must be provided`);
    }
    const octokit = new Octokit({ auth: githubToken });
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
        owner: repoOwner,
        repo: repoName,
        ['run_id']: runId,
        ['per_page']: 100,
    });

    return response.data.jobs;
};
