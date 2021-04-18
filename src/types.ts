import type { components } from '@octokit/openapi-types';

export type Status = 'success' | 'fail' | 'failed' | 'info' | 'true' | 'false' | 'cancelled' | 'failure' | '';

export type MrkDwnIn = ('text' | 'pretext' | 'fields')[];

export type Job = components['schemas']['job'];
