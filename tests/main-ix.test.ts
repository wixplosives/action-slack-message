import { getWorkflowJobs } from '../src/components/get-workflow-jobs';
import { IX_JOB_DATA } from './const';

describe('getWorkflowJobs()', () => {
    it.only('should get correct workflow data', async () => {
        const basicJobData = {
            repoOwner: 'wixplosives',
            repoName: 'action-slack-message',
            runId: 728982924
        };
        const workflowJobs = await getWorkflowJobs(basicJobData);
        const testedJob = workflowJobs.find(job => job.id === IX_JOB_DATA.id);
        if (testedJob) {
            expect(testedJob.name).toBe(IX_JOB_DATA.name);
            expect(testedJob.run_id).toBe(IX_JOB_DATA.run_id);
        }
    });
});
