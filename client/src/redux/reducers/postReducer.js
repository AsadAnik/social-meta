// Posts Reducer..
export function PostReducer(state={}, action){
    switch (action.type){
        case "LIKES_BY_POST_ID":
            return { ...state, likes: action.payload };

        case "LIKED_POST":
            return { ...state, likes: action.payload };

        case "POSTS_BY_USER_ID":
            return { ...state, postsByUserId: action.payload };

        case "POST_DELETE":
            return { ...state, deletedPost: action.payload };

        case "POST_READ":
            return { ...state, readPost: action.payload };

        case "POST_UPDATE":
            return { ...state, updatePost: action.payload };

        case "READ_ALL_POSTS":
            return { ...state, allPosts: action.payload };

        case "POST_CREATE":
            return { ...state, createdPost: action.payload };

        case "CURRENT_USER_POSTS":
            return { ...state, currentUserPosts: action.payload };

        default:
            return state;
    }
}
