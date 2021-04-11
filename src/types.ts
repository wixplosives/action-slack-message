export type Status = 'success' | 'fail' | 'failed' | 'info' | 'true' | 'false' | 'cancelled' | 'failure' | '';

export type MrkDwnIn = ('text' | 'pretext' | 'fields')[];

export interface IGetJobId {
    workflowJobs: Job[];
    jobName: string;
    matrixOs: string;
    matrixNode: string;
}

export interface IGetWorkflowJobs {
    repoOwner: string;
    repoName: string;
    runId: number;
}

export interface Job {
    id: number;
    name: string;
    ['run_id']: number;
}
