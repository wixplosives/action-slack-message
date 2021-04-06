import type { Status, MrkDwnIn } from '../types';
import { colors } from '../const';

export interface ICreateSlackAttachment {
    workflow: string;
    actionLink: string;
    textString: string;
    status: Status;
    jobName?: string;
}

export interface ISlackAttachment {
    title: string;
    title_link: string;
    text: string;
    color: string;
    mrkdwn_in: MrkDwnIn;
}

export const createSlackAttachment = ({
    workflow,
    actionLink,
    textString,
    status,
    jobName = ''
}: ICreateSlackAttachment): ISlackAttachment => {
    return {
        title: `${workflow}${jobName ? `: ${jobName}` : ''} `,
        title_link: actionLink,
        text: textString,
        color: colors[status],
        mrkdwn_in: ['text']
    };
};
