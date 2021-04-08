import { IGetInnerJobId } from '../types';

export const getInnerJobId = ({
    workflowJobs,
    jobName,
    matrixOs,
    matrixNode
}: IGetInnerJobId): string => {
    let jobId;
    for (const job of workflowJobs) {
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
