import { Octokit } from '@octokit/core';

export const getInnerJobId = async (
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
    let currentJobName;
    for (const job of response.data.jobs) {
        currentJobName = job.name;
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
    if (!jobId)
        throw new Error(`Action link not found for job: ${jobName}
    ${JSON.stringify(response.data.jobs)}`);
    return jobId;
};
