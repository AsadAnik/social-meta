import axios from 'axios';
import httpConfig from '../../utils/httpConfig';

// POST API ENDPOINT..
const POST_API_ENDPOINT = `${process.env.REACT_APP_BACKEND_API}/post`;

// Liked Post here..
export function likedPost(isLiked, postId, data) {
    const request = axios.get(`${POST_API_ENDPOINT}/get_post_likes?postId=${postId}`, httpConfig)
        .then(response => {
            let likeCounter = null;

            if (response.data.likes) {
                likeCounter = response.data.likes;
                console.log('BEFORE -- ', likeCounter);
            }

            if (!response.data.likes) {
                likeCounter = 0;
            }

            if (!isLiked) {
                likeCounter = likeCounter - 1;
            }

            if (isLiked) {
                likeCounter = likeCounter + 1;
            }

            console.log('AFTER -- ', likeCounter);

            const request = axios.post(`${POST_API_ENDPOINT}/post_like?postId=${postId}&likes=${likeCounter}`, data, httpConfig)
                .then(response => response.data)
                .catch(error => console.log('ERR! when try to make like into Post by post req. ', error.message));

            return request;
        })
        .catch(error => console.log('ERR! when try to grave likes from post. ', error.message));

    return {
        type: "LIKED_POST",
        payload: request
    };
}

// User Posts for ProfileOthers..
export function postsByUserId(userId) {
    const request = axios.get(`${POST_API_ENDPOINT}/user_posts?userId=${userId}`, httpConfig)
        .then(response => response.data)
        .catch(error => console.log('ERR! when try to make get posts by userId', error.message));

    return {
        type: "POSTS_BY_USER_ID",
        payload: request
    };
}

// Delete Post..
export function deletePost(postId) {
    const request = axios.delete(`${POST_API_ENDPOINT}/post_delete?id=${postId}`, httpConfig)
        .then(response => response.data)
        .catch(error => console.log('ERR! when try to make delete post -> ', error.message));

    return {
        type: "POST_DELETE",
        payload: request
    };
}

// Read Post..
export function readPost(postId) {
    const request = axios.get(`${POST_API_ENDPOINT}/post_read?postId=${postId}`, httpConfig)
        .then(response => response.data)
        .catch(error => console.log('ERR! when try to make read post -> ', error.message));

    return {
        type: "POST_READ",
        payload: request
    };
}

// Update Post..
export function updatePost(data) {
    const request = axios.post(`${POST_API_ENDPOINT}/post_update`, data, httpConfig)
        .then(response => response.data)
        .catch(error => console.log('ERR! when try to make update post -> ', error.message));

    return {
        type: "POST_UPDATE",
        payload: request
    };
}

// Action: readAllPosts
// export const readAllPosts = (page, limit) => async (dispatch) => {
//     try {
//         const response = await axios.get(`${POST_API_ENDPOINT}/read_all_posts?page=${page}&limit=${limit}`, httpConfig);
//         const { posts, total } = response.data;

//         dispatch({
//             type: "READ_ALL_POSTS",
//             payload: { posts, total, page },
//         });
//         return { posts, total }; 
//     } catch (err) {
//         console.error('Error fetching posts:', err);
//         throw err;
//     }
// };
// In your PostActions.js or wherever your actions are defined
export const readAllPosts = (page, limit) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`${POST_API_ENDPOINT}/read_all_posts?page=${page}&limit=${limit}`,httpConfig);
        const { posts, total, totalPages } = response.data;
  
        // Dispatch action to update the posts in Redux store
        dispatch({
          type: 'FETCH_POSTS_SUCCESS',
          payload: { posts, total, totalPages, page },
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  };
  



// Post Create..
export function postCreate(data) {
    const request = axios.post(`${POST_API_ENDPOINT}/post_create`, data, httpConfig)
        .then(response => response.data)
        .catch(error => console.log('ERR! when try to make create post -> ', error.message));

    return {
        type: "POST_CREATE",
        payload: request
    };
}

// Showing Current User Posts to profile..
export function currentUserPosts() {
    const request = axios.get(`${POST_API_ENDPOINT}/current_user_posts`, httpConfig)
        .then(response => response.data)
        .catch(error => console.log('ERR! when try to make read current user posts -> ', error.message));

    return {
        type: "CURRENT_USER_POSTS",
        payload: request
    };
}
