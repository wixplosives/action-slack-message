import type { Job } from './types';

export interface IGetJobIdOptions {
    workflowJobs: Job[];
    jobName: string;
    matrixOs: string;
    matrixNode: string;
}

export const getJobId = ({ workflowJobs, jobName, matrixOs, matrixNode }: IGetJobIdOptions): number => {
    for (const job of workflowJobs) {
        // eslint-disable-next-line no-console
        console.log('job', job);
        const currentJobName = job.name;
        if (
            currentJobName.includes(jobName) &&
            currentJobName.includes(matrixOs) &&
            currentJobName.includes(matrixNode)
        ) {
            return job.id;
        }
    }
    throw new Error(`cannot determine jobId`);
};
