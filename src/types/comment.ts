export interface Comments {
    id: number;
    comment: string;
    nickname: string;
    updated_at: Date;
    child_id: number;
    child_comment: string;
    child_nickname: string;
    child_updated_at: Date;
}

export interface ParsedChildComment {
    id: number;
    comment: string;
    nickname: string
    updated_at: Date;
}

export interface ParsedComment {
    id: number;
    comment: string;
    nickname: string
    updated_at: Date;
    child_comment: ParsedChildComment[]
}