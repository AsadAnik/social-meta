export interface IComment {
    _id: string;
    comment: any;
    success: any;
    postId: string;
    text: string;
    user: any; // Can be a user object
    createdAt: string;
}
