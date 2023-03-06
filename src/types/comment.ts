export interface Comments {
    id: number;
    comment: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    child_id: number;
    child_comment: string;
    child_user_id: number;
    child_created_at: Date;
    child_updated_at: Date;
}

export interface ParsedChildComment {
    id: number;
    comment: string;
    user_id: number
    created_at: Date;
    updated_at: Date;
}

export interface ParsedComment {
    id: number;
    comment: string;
    user_id: number
    created_at: Date;
    updated_at: Date;
    child_comment: ParsedChildComment[]
}