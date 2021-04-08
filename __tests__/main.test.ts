import { getTextString } from '../src/components/get-text-string';
import { createSlackAttachment } from '../src/components/create-slack-attachment';
import { primaryBlue } from '../src/const';
import { getGithubToken } from '../src/config/keys';

describe('main.ts', () => {
    describe('getTextString()', () => {
        it('outputs all variables', () => {
            const textString = getTextString({
                status: 'failed',
                repoOwner: 'owner',
                repoName: 'testRepo',
                ref: 'master',
                sha: 'ABC'
            });
            expect(textString).toContain('owner');
            expect(textString).toContain('testRepo');
            expect(textString).toContain('master');
            expect(textString).toContain('ABC');
            expect(textString).toContain('FAILED');
        });

        it('not showing status when its empty', () => {
            const textString = getTextString({
                status: '',
                repoOwner: 'owner',
                repoName: 'testRepo',
                ref: 'master',
                sha: 'ABC'
            });
            expect(textString.includes('status')).toBe(false);
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
            expect(attachment.color).toContain(primaryBlue);
        });
    });
});
