import { expect } from 'chai';
import { getJobId } from '../src/get-job-id';
import { JOB_DATA, OS } from './expected-test-output';
import jobsData from './jobs-data.json';

describe('getJobId()', () => {
    const parsedJsonData = JSON.parse(jobsData);
    it('finds id of custom name job, with 2 os', () => {
        const ubuntuArgs = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.CUSTOM_NAME.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: '',
        };

        const ubuntuJobId = getJobId(ubuntuArgs);

        expect(ubuntuJobId).to.equal(JOB_DATA.CUSTOM_NAME.RESULTS.UBUNTU);

        const windowsArgs = {
            ...ubuntuArgs,
            matrixOs: OS.WINDOWS,
        };

        const windowsJobId = getJobId(windowsArgs);

        expect(windowsJobId).to.equal(JOB_DATA.CUSTOM_NAME.RESULTS.WINDOWS);
    });

    it('finds id of a job with 2 node versions', () => {
        const nodeFourteenArgs = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_NODES.JOB_NAME,
            matrixOs: '',
            matrixNode: '14',
        };
        const nodeFourteenJobId = getJobId(nodeFourteenArgs);
        expect(nodeFourteenJobId).to.equal(JOB_DATA.TWO_NODES.RESULTS._14);

        const nodeTwelveArgs = {
            ...nodeFourteenArgs,
            matrixNode: '12',
        };
        const nodeTwelveJobId = getJobId(nodeTwelveArgs);
        expect(nodeTwelveJobId).to.equal(JOB_DATA.TWO_NODES.RESULTS._12);
    });

    it('finds id of a job with 2 node versions and 3 os - macos 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: '14',
        };
        const ubuntuFourteenJobId = getJobId(args);
        expect(ubuntuFourteenJobId).to.equal(JOB_DATA.THREE_OS_TWO_NODES.RESULTS.UBUNTU_14);
    });
    it('finds id of a job with 2 node versions and 3 os - macos 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: '12',
        };
        const ubuntuTwelveJobId = getJobId(args);
        expect(ubuntuTwelveJobId).to.equal(JOB_DATA.THREE_OS_TWO_NODES.RESULTS.UBUNTU_12);
    });
    it('finds id of a job with 2 node versions and 3 os - macos 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.MACOS,
            matrixNode: '14',
        };
        const macosFourteenJobId = getJobId(args);
        expect(macosFourteenJobId).to.equal(JOB_DATA.THREE_OS_TWO_NODES.RESULTS.MACOS_14);
    });
    it('finds id of a job with 2 node versions and 3 os - macos 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.MACOS,
            matrixNode: '12',
        };
        const macosTwelveJobId = getJobId(args);
        expect(macosTwelveJobId).to.equal(JOB_DATA.THREE_OS_TWO_NODES.RESULTS.MACOS_12);
    });
    it('finds id of a job with 2 node versions and 3 os - windows 14', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: '14',
        };
        const windowsFourteenJobId = getJobId(args);
        expect(windowsFourteenJobId).to.equal(JOB_DATA.THREE_OS_TWO_NODES.RESULTS.WINDOWS_14);
    });
    it('finds id of a job with 2 node versions and 3 os - windows 12', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.THREE_OS_TWO_NODES.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: '12',
        };
        const windowsTwelveJobId = getJobId(args);
        expect(windowsTwelveJobId).to.equal(JOB_DATA.THREE_OS_TWO_NODES.RESULTS.WINDOWS_12);
    });
    it('finds id of a job with 2 OS - windows', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_OS.JOB_NAME,
            matrixOs: OS.WINDOWS,
            matrixNode: '',
        };
        const windowsJobId = getJobId(args);
        expect(windowsJobId).to.equal(JOB_DATA.TWO_OS.RESULTS.WINDOWS);
    });

    it('finds id of a job with 2 OS - ubuntu', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.TWO_OS.JOB_NAME,
            matrixOs: OS.UBUNTU,
            matrixNode: '',
        };
        const ubuntuJobId = getJobId(args);
        expect(ubuntuJobId).to.equal(JOB_DATA.TWO_OS.RESULTS.UBUNTU);
    });

    it('finds id of a job with 1 os and 1 node', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.ONE_OS_AND_NODE.JOB_NAME,
            matrixOs: '',
            matrixNode: '',
        };
        const JobId = getJobId(args);
        expect(JobId).to.equal(JOB_DATA.ONE_OS_AND_NODE.RESULTS);
    });

    it('finds id of a job with 1 os', () => {
        const args = {
            workflowJobs: parsedJsonData,
            jobName: JOB_DATA.ONE_OS.JOB_NAME,
            matrixOs: '',
            matrixNode: '',
        };
        const jobId = getJobId(args);
        expect(jobId).to.equal(JOB_DATA.ONE_OS.RESULTS);
    });
});
