import { expect } from 'chai';
import { getTextString } from '../src/components/get-text-string';
import { createSlackAttachment } from '../src/components/create-slack-attachment';
import { getJobId } from '../src/components/get-job-id';
import { primaryBlue } from '../src/const';
import { JOB_DATA, OS } from './const';
import jobsData from './jobs-data.json';

const parsedJsonData = JSON.parse(jobsData);

describe('main.ts', () => {});

describe('getTextString()', () => {
    it('outputs all variables', () => {
        const textString = getTextString({
            status: 'failed',
            repoOwner: 'owner',
            repoName: 'testRepo',
            ref: 'master',
            sha: 'ABC'
        });
        expect(textString).to.contain('owner');
        expect(textString).to.contain('testRepo');
        expect(textString).to.contain('master');
        expect(textString).to.contain('ABC');
        expect(textString).to.contain('FAILED');
    });

    it('not showing status when its empty', () => {
        const textString = getTextString({
            status: '',
            repoOwner: 'owner',
            repoName: 'testRepo',
            ref: 'master',
            sha: 'ABC'
        });
        expect(textString.includes('status')).to.be.false;
    });
});
describe('createSlackAttachment()', () => {
    it('it should output the correct color when empty', () => {
        const attachment = createSlackAttachment({
            workflow: 'abc',
            actionLink: '',
            textString: '',
            status: ''
        });
        expect(attachment.color).to.contain(primaryBlue);
    });
});

describe('getJobId()', () => {
    it('finds id of custom name job, with 2 os', async () => {
        const ubuntuArgs = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.CUSTOM_NAME.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: ''
        };

        const ubuntuJobId = await getJobId(ubuntuArgs);

        expect(ubuntuJobId).to.be.equal(JOB_DATA.CUSTOM_NAME.RESULTS.UBUNTU);

        const windowsArgs = {
            ...ubuntuArgs,
            matrixOs: OS.WINDOWS
        };

        const windowsJobId = await getJobId(windowsArgs);

        expect(windowsJobId).to.be.equal(JOB_DATA.CUSTOM_NAME.RESULTS.WINDOWS);
    });

    it('finds  id of a job with 2 node versions', async () => {
        const nodeFourteenArgs = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_NODES.JOB_NAME,
            matrixOs: '',
            matrixNode: '14'
        };
        const nodeFourteenJobId = await getJobId(nodeFourteenArgs);
        expect(nodeFourteenJobId).to.be.equal(JOB_DATA.TWO_NODES.RESULTS._14);

        const nodeTwelveArgs = {
            ...nodeFourteenArgs,
            matrixNode: '12'
        };
        const nodeTwelveJobId = await getJobId(nodeTwelveArgs);
        expect(nodeTwelveJobId).to.be.equal(JOB_DATA.TWO_NODES.RESULTS._12);
    });

    it('finds  id of a job with 2 node versions and 3 os - macos 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: '14'
        };
        const ubuntuFourteenJobId = getJobId(args);
        expect(ubuntuFourteenJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.UBUNTU_14
        );
    });
    it('finds  id of a job with 2 node versions and 3 os - macos 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: '12'
        };
        const ubuntuTwelveJobId = getJobId(args);
        expect(ubuntuTwelveJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.UBUNTU_12
        );
    });
    it('finds  id of a job with 2 node versions and 3 os - macos 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.MACOS,
            matrixNode: '14'
        };
        const macosFourteenJobId = getJobId(args);
        expect(macosFourteenJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.MACOS_14
        );
    });
    it('finds  id of a job with 2 node versions and 3 os - macos 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.MACOS,
            matrixNode: '12'
        };
        const macosTwelveJobId = getJobId(args);
        expect(macosTwelveJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.MACOS_12
        );
    });
    it('finds  id of a job with 2 node versions and 3 os - windows 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: '14'
        };
        const windowsFourteenJobId = getJobId(args);
        expect(windowsFourteenJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.WINDOWS_14
        );
    });
    it('finds  id of a job with 2 node versions and 3 os - windows 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: '12'
        };
        const windowsTwelveJobId = getJobId(args);
        expect(windowsTwelveJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.WINDOWS_12
        );
    });
    it('finds  id of a job with 2 OS - windows', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_OS.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: ''
        };
        const windowsJobId = getJobId(args);
        expect(windowsJobId).to.be.equal(JOB_DATA.TWO_OS.RESULTS.WINDOWS);
    });

    it('finds  id of a job with 2 OS - ubuntu', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_OS.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: ''
        };
        const ubuntuJobId = getJobId(args);
        expect(ubuntuJobId).to.be.equal(JOB_DATA.TWO_OS.RESULTS.UBUNTU);
    });

    it('finds  id of a job with 1 os and 1 node', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.ONE_OS_AND_NODE.JOB_NAME,
            matrixOs: '',
            matrixNode: ''
        };
        const JobId = getJobId(args);
        expect(JobId).to.be.equal(JOB_DATA.ONE_OS_AND_NODE.RESULTS);
    });

    it('finds  id of a job with 1 os', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.ONE_OS.JOB_NAME,
            matrixOs: '',
            matrixNode: ''
        };
        const JobId = getJobId(args);
        expect(JobId).to.be.equal(JOB_DATA.ONE_OS.RESULTS);
    });
});
