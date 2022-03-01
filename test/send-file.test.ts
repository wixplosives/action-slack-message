import path from 'path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getMatchingFiles, verifyFiles } from '../src/send-file';

chai.use(chaiAsPromised);

describe('send-file', () => {
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
            expect(await verifyFiles({ fileName: 'README.md', failOnMissingFile: true })).to.be.true;
        });
        it('single file - does not exist', async function () {
            await expect(verifyFiles({ fileName: 'READMEzxczxczxc.md', failOnMissingFile: true })).to.be.rejectedWith(
                Error
            );
        });

        it('pattern - exist', async function () {
            expect(await verifyFiles({ filePattern: 'git', failOnMissingFile: true })).to.be.true;
        });
        it('pattern - does not exist', async function () {
            await expect(verifyFiles({ filePattern: 'ZCZXCASCDACACAC', failOnMissingFile: true })).to.be.rejectedWith(
                Error
            );
        });
    });
});
