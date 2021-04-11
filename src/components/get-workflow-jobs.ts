import { Octokit } from '@octokit/core';
import { getKeys } from '../config/keys';
import { IGetWorkflowJobs, Job } from '../types';

export const getWorkflowJobs = async ({
    repoOwner,
    repoName,
    runId
}: IGetWorkflowJobs): Promise<Job[]> => {
    const keys = getKeys();
    const octokit = new Octokit({ auth: keys.githubToken });
    const response = await octokit.request(
        'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs',
        {
            owner: repoOwner,
            repo: repoName,
            ['run_id']: runId
        }
    );

    return response.data.jobs as Job[];
};
