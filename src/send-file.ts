import path from 'path';
import { readdir, lstatSync, existsSync, createReadStream } from 'fs';
import { promisify } from 'util';
import type { WebClient } from '@slack/web-api';

const readDirAsync = promisify(readdir);

export interface sendFile {
    client: WebClient;
    fileName: string;
    channel: string;
    jobName: string;
}

export const sendFile = async ({ client, fileName, channel, jobName }: sendFile) => {
    const filePath = path.resolve(fileName);
    const results = await client.files.upload({
        channels: channel,
        ['initial_comment']: `File \`${path.parse(filePath).base}\` sent for job: ${jobName}`,
        file: createReadStream(fileName),
    });

    // eslint-disable-next-line no-console
    console.log(results);
};

export interface sendFiles {
    client: WebClient;
    filePattern: string;
    channel: string;
    jobName: string;
}

export const sendFiles = async ({ client, filePattern, channel, jobName }: sendFiles) => {
    // eslint-disable-next-line no-console
    console.log('Sending files by pattern...');

    const filePaths = await getMatchingFiles(filePattern);

    for (const filepath of filePaths) {
        // eslint-disable-next-line no-console
        console.log(`Sending file: ${path.parse(filepath).base}`);

        const results = await client.files.upload({
            channels: channel,
            ['initial_comment']: `File \`${path.parse(filepath).base}\` sent for job: ${jobName}`,
            file: createReadStream(filepath),
        });

        // eslint-disable-next-line no-console
        console.log(results);
    }
};

export interface IVerifyFiles {
    failOnMissingFile: boolean;
    fileName?: string;
    filePattern?: string;
}

export const verifyFiles = async ({ fileName, filePattern, failOnMissingFile }: IVerifyFiles) => {
    const filePath = fileName ? path.resolve(fileName) : '';

    try {
        if (fileName && !existsSync(filePath)) {
            throw new Error("file_name was given, but wasn't found");
        }

        const filePaths = filePattern ? await getMatchingFiles(filePattern) : [];
        if (filePattern && filePaths.length === 0) {
            throw new Error('file_pattern was given, but no files matching the given pattern');
        }
        return true;
    } catch (err) {
        if (failOnMissingFile) {
            throw err;
        } else {
            return false;
        }
    }
};

export const getMatchingFiles = async (filePattern: string) => {
    const fileNames = await readDirAsync('./');
    const matchedFilenames = fileNames.filter(
        (filename) => filename.match(filePattern) && lstatSync(filename).isFile()
    );
    return matchedFilenames.map((filename) => path.resolve(filename));
};
