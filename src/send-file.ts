import path from 'path';
import { readdir, lstatSync, existsSync } from 'fs';
import { promisify } from 'util';

const readDirAsync = promisify(readdir);

interface IVerfifyFiles {
    fileName?: string;
    filePattern?: string;
}

export const verifyFiles = async ({ fileName, filePattern }: IVerfifyFiles) => {
    const filePath = fileName ? path.resolve(fileName) : '';

    if (fileName && !existsSync(filePath)) {
        throw new Error("file_name was given, but wasn't found");
    }

    const filePaths = filePattern ? await getMatchingFiles(filePattern) : [];
    if (filePattern && filePaths.length === 0) {
        throw new Error('file_pattern was given, but no files matching the given pattern');
    }
};

export const getMatchingFiles = async (filePattern: string) => {
    const fileNames = await readDirAsync('./');
    const matchedFilenames = fileNames.filter(
        (filename) => filename.match(filePattern) && lstatSync(filename).isFile()
    );
    return matchedFilenames.map((filename) => path.resolve(filename));
};
