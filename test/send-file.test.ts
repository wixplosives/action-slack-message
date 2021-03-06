import path from 'path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getMatchingFiles, verifyFiles } from '../src/send-file';

chai.use(chaiAsPromised);

// eslint-disable-next-line no-only-tests/no-only-tests
describe.only('send-file', () => {
    describe('getMatchingFiles()', () => {
        it('existing file', async function () {
            const matching = await getMatchingFiles('READ');
            expect(path.parse(matching[0]).base).to.eql('README.md');
        });
        it('non-existing file', async function () {
            const matching = await getMatchingFiles('zzzzzzzzzzzzzz');
            expect(matching).to.eql([]);
        });
    });

    describe('verifyFiles()', () => {
        it('single file - exist', async function () {
            expect(await verifyFiles({ fileName: 'README.md' })).to.equal(undefined);
        });
        it('single file - does not exist', async function () {
            await expect(verifyFiles({ fileName: 'READMEzxczxczxc.md' })).to.be.rejectedWith(Error);
        });

        it('pattern - exist', async function () {
            expect(await verifyFiles({ filePattern: 'git' })).to.equal(undefined);
        });
        it('pattern - does not exist', async function () {
            await expect(verifyFiles({ filePattern: 'ZCZXCASCDACACAC' })).to.be.rejectedWith(Error);
        });
    });
});
