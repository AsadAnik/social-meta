const initialState = {
    allPosts: [],
    postsByUserId: [],
    likes: 0,
    deletedPost: null,
    readPost: null,
    updatePost: null,
    createdPost: null,
    currentUserPosts: [],
    loading: false,
    error: null,
};

export function PostReducer(state = initialState, action) {
    switch (action.type) {
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

        case 'FETCH_POSTS_SUCCESS':
            const { posts, total, totalPages, page } = action.payload;

            // Append new posts to existing ones
            return {
                ...state,
                allPosts: page === 1 ? posts : [...state.allPosts, ...posts], // Append if not the first page
                total,
                totalPages,
            };

        case "POST_CREATE":
            return { ...state, createdPost: action.payload };

        case "CURRENT_USER_POSTS":
            return { ...state, currentUserPosts: action.payload };

        default:
            return state;
    }
}
