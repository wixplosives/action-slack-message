export interface IKeys {
    githubToken: string;
}

export const getKeys = (): IKeys => {
    if (process.env['GITHUB_TOKEN']) {
        return require('./prod');
    } else {
        try {
            return require('./dev');
        } catch (err) {
            throw new Error(
                'No dev key file found. You must create a local key file called `dev` to run test locally. see `./src/config/prod.ts` for example'
            );
        }
    }
};
