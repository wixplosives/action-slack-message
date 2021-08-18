import type { Job } from './types';

export interface IGetJobIdOptions {
    workflowJobs: Job[];
    jobName: string;
    matrixOs: string;
    matrixNode: string;
}

export const getJobId = ({ workflowJobs, jobName, matrixOs }: IGetJobIdOptions): number => {
    for (const job of workflowJobs) {
        const currentJobName = job.name;
        // eslint-disable-next-line no-console
        console.log(currentJobName);
        if (currentJobName.includes(jobName) && currentJobName.includes(matrixOs)) {
            return job.id;
        }
    }
    throw new Error(`cannot determine jobId`);
};
