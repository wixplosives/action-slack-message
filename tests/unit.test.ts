import { expect } from 'chai';
import { getTextString } from '../src/components/get-text-string';
import { createSlackAttachment } from '../src/components/create-slack-attachment';
import { getInnerJobId } from '../src/components/get-inner-job-id';
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

describe('getInnerJobId()', () => {
    it('finds inner id of custom name job, with 2 os', async () => {
        const ubuntuArgs = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.CUSTOM_NAME.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: ''
        };

        const ubuntuInnerJobId = await getInnerJobId(ubuntuArgs);

        expect(ubuntuInnerJobId).to.be.equal(
            JOB_DATA.CUSTOM_NAME.RESULTS.UBUNTU
        );

        const windowsArgs = {
            ...ubuntuArgs,
            matrixOs: OS.WINDOWS
        };

        const windowsJobId = await getInnerJobId(windowsArgs);

        expect(windowsJobId).to.be.equal(JOB_DATA.CUSTOM_NAME.RESULTS.WINDOWS);
    });

    it('finds inner id of a job with 2 node versions', async () => {
        const nodeFourteenArgs = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_NODES.JOB_NAME,
            matrixOs: '',
            matrixNode: '14'
        };
        const nodeFourteenInnerJobId = await getInnerJobId(nodeFourteenArgs);
        expect(nodeFourteenInnerJobId).to.be.equal(
            JOB_DATA.TWO_NODES.RESULTS._14
        );

        const nodeTwelveArgs = {
            ...nodeFourteenArgs,
            matrixNode: '12'
        };
        const nodeTwelveJobId = await getInnerJobId(nodeTwelveArgs);
        expect(nodeTwelveJobId).to.be.equal(JOB_DATA.TWO_NODES.RESULTS._12);
    });

    it('finds inner id of a job with 2 node versions and 3 os - macos 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: '14'
        };
        const ubuntuFourteenInnerJobId = getInnerJobId(args);
        expect(ubuntuFourteenInnerJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.UBUNTU_14
        );
    });
    it('finds inner id of a job with 2 node versions and 3 os - macos 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: '12'
        };
        const ubuntuTwelveInnerJobId = getInnerJobId(args);
        expect(ubuntuTwelveInnerJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.UBUNTU_12
        );
    });
    it('finds inner id of a job with 2 node versions and 3 os - macos 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.MACOS,
            matrixNode: '14'
        };
        const macosFourteenInnerJobId = getInnerJobId(args);
        expect(macosFourteenInnerJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.MACOS_14
        );
    });
    it('finds inner id of a job with 2 node versions and 3 os - macos 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.MACOS,
            matrixNode: '12'
        };
        const macosTwelveInnerJobId = getInnerJobId(args);
        expect(macosTwelveInnerJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.MACOS_12
        );
    });
    it('finds inner id of a job with 2 node versions and 3 os - windows 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: '14'
        };
        const windowsFourteenInnerJobId = getInnerJobId(args);
        expect(windowsFourteenInnerJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.WINDOWS_14
        );
    });
    it('finds inner id of a job with 2 node versions and 3 os - windows 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: '12'
        };
        const windowsTwelveInnerJobId = getInnerJobId(args);
        expect(windowsTwelveInnerJobId).to.be.equal(
            JOB_DATA.THREE_OS_TWO_NODES.RESULTS.WINDOWS_12
        );
    });
    it('finds inner id of a job with 2 OS - windows', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_OS.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: ''
        };
        const windowsInnerJobId = getInnerJobId(args);
        expect(windowsInnerJobId).to.be.equal(JOB_DATA.TWO_OS.RESULTS.WINDOWS);
    });

    it('finds inner id of a job with 2 OS - ubuntu', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_OS.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: ''
        };
        const ubuntuInnerJobId = getInnerJobId(args);
        expect(ubuntuInnerJobId).to.be.equal(JOB_DATA.TWO_OS.RESULTS.UBUNTU);
    });

    it('finds inner id of a job with 1 os and 1 node', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.ONE_OS_AND_NODE.JOB_NAME,
            matrixOs: '',
            matrixNode: ''
        };
        const innerJobId = getInnerJobId(args);
        expect(innerJobId).to.be.equal(JOB_DATA.ONE_OS_AND_NODE.RESULTS);
    });

    it('finds inner id of a job with 1 os', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.ONE_OS.JOB_NAME,
            matrixOs: '',
            matrixNode: ''
        };
        const innerJobId = getInnerJobId(args);
        expect(innerJobId).to.be.equal(JOB_DATA.ONE_OS.RESULTS);
    });
});
