import type { Job } from './types';

export interface IGetJobIdOptions {
    workflowJobs: Job[];
    jobName: string;
    matrixOs: string;
    matrixNode: string;
    customJobName?: string;
}

export const getJobId = ({ workflowJobs, jobName, matrixOs, matrixNode, customJobName }: IGetJobIdOptions): number => {
    for (const job of workflowJobs) {
        const currentJobName = job.name;

        if (customJobName && currentJobName === customJobName) {
            return job.id;
        } else if (
            currentJobName.includes(jobName) &&
            currentJobName.includes(matrixOs) &&
            currentJobName.includes(matrixNode)
        ) {
            return job.id;
        }
    }
    throw new Error(`cannot determine jobId`);
};
