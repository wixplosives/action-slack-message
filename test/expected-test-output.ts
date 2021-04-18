export const OS = {
    UBUNTU: 'ubuntu-latest',
    WINDOWS: 'windows-latest',
    MACOS: 'macos-latest',
};

export const IX_JOB_DATA = {
    id: 2295360965,
    ['run_id']: 728982924,
    name: 'notify-3-os-on-2-nodes-matrix (14, ubuntu-latest)',
};

export const JOB_DATA = {
    CUSTOM_NAME: {
        JOB_NAME: 'custom name',
        RESULTS: { UBUNTU: 2295361377, WINDOWS: 2295361428 },
    },
    TWO_NODES: {
        JOB_NAME: 'notify-2-node-versions',
        RESULTS: {
            _14: 2295361254,
            _12: 2295361294,
        },
    },
    THREE_OS_TWO_NODES: {
        JOB_NAME: 'notify-3-os-on-2-nodes-matrix',
        RESULTS: {
            UBUNTU_14: 2295360965,
            MACOS_14: 2295360984,
            WINDOWS_14: 2295361009,
            UBUNTU_12: 2295361024,
            MACOS_12: 2295361046,
            WINDOWS_12: 2295361071,
        },
    },
    TWO_OS: {
        JOB_NAME: 'notify-2-os-matrix',
        RESULTS: {
            UBUNTU: 2295361964,
            WINDOWS: 2295362015,
        },
    },
    ONE_OS_AND_NODE: {
        JOB_NAME: 'notify-1-os-1-node',
        RESULTS: 2295361524,
    },
    ONE_OS: {
        JOB_NAME: 'notify-1-os-only',
        RESULTS: 2295361636,
    },
};
