export interface ITextString {
    status?: string;
    repoOwner: string;
    repoName: string;
    ref: string;
    sha: string;
    matrixOs?: string;
    matrixNode?: string;
}

export const getTextString = ({ status, repoOwner, repoName, ref, sha, matrixOs, matrixNode }: ITextString): string => {
    const repoUrl = `https://github.com/${repoOwner}/${repoName}`;
    const statusString = status ? `Status: *${status.toUpperCase()}*` : '';
    const repoString = `*Repo*: <${repoUrl}|${repoName}>`;
    const os = `${matrixOs ? `OS: ${matrixOs}` : ''}`;
    const node = `${matrixOs ? `\n${' '.repeat(14)}` : ''} ${matrixNode ? `Node version: ${matrixNode}` : ''}`;
    const branchName = ref.startsWith('refs/heads/') ? ref.slice(11) : ref;
    const branchString = `*Branch*: <${repoUrl}/commit/${sha}|${branchName}>`;
    const details = matrixOs || matrixNode ? `*Details*: ${os} ${node}` : '';

    return `${statusString}\n${repoString}\n${branchString}\n${details}`;
};
