/* eslint-disable @typescript-eslint/no-require-imports */

export interface IKeys {
    github_token: string;
}

export const getGithubToken = (): IKeys => {
    if (process.env.GITHUB_TOKEN) {
        return require('./prod');
    } else {
        //dev - define your private auth key:
        return require('./dev');
    }
};
