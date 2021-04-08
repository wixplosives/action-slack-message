import { Octokit } from '@octokit/core';
import { getGithubToken } from '../config/keys';

export const getInnerJobId = async (
    repoOwner: string,
    repoName: string,
    runId: number,
    jobName: string,
    matrixOs: string,
    matrixNode: string
): Promise<string> => {
    const octokit = new Octokit({ auth: getGithubToken() });
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
