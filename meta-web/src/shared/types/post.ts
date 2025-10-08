// region Owner Type
type OwnerType = {
    _id: string;
    firstname: string;
    lastname: string;
    profilePhoto?: string;
    title: string;
};

// region Post Interface
export interface IPost {
    _id: string;
    content: string;
    body: string;
    createdAt: string;
    likes_count: number;
    dislikes_count: number;
    comments_count: number;
    image: string;
    owner: OwnerType;
    likedByCurrentUser?: boolean;
    comments?: any;
}
