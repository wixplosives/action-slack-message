import { expect } from 'chai';
import { getWorkflowJobs } from '../src/get-workflow-jobs';
import { IX_JOB_DATA } from './expected-test-output';

if (process.env['GITHUB_TOKEN']) {
    describe('getWorkflowJobs()', () => {
        it('should get correct workflow data', async function () {
            const basicJobData = {
                repoOwner: 'wixplosives',
                repoName: 'action-slack-message',
                runId: 728982924,
            };
            const workflowJobs = await getWorkflowJobs(basicJobData);
            const testedJob = workflowJobs.find((job) => job.id === IX_JOB_DATA.id);
            if (testedJob) {
                expect(testedJob.name).to.be.eq(IX_JOB_DATA.name);
                expect(testedJob.run_id).to.be.eq(IX_JOB_DATA.run_id);
            }
        });
    });
}
