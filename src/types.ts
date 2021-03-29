export type Status =
    | 'success'
    | 'fail'
    | 'failed'
    | 'info'
    | 'true'
    | 'false'
    | 'cancelled'
    | 'failure'
    | '';

export type MrkDwnIn = ('text' | 'pretext' | 'fields')[];
