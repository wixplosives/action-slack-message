import { expect } from 'chai';
import { getMessageText } from '../src/get-message-text';

describe('get-message-text()', () => {
    it('outputs all variables', () => {
        const textString = getMessageText({
            status: 'failed',
            repoOwner: 'owner',
            repoName: 'testRepo',
            ref: 'master',
            sha: 'ABC',
        });
        expect(textString).to.contain('owner');
        expect(textString).to.contain('testRepo');
        expect(textString).to.contain('master');
        expect(textString).to.contain('ABC');
        expect(textString).to.contain('FAILED');
    });

    it('not showing status when its empty', () => {
        const textString = getMessageText({
            status: '',
            repoOwner: 'owner',
            repoName: 'testRepo',
            ref: 'master',
            sha: 'ABC',
        });
        expect(textString).to.not.contain('status');
    });
});
