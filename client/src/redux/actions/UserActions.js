import axios from 'axios';
import httpConfig from '../../utils/httpConfig';
import { handleApiError } from '../../utils/errorHandler';
import { toast } from 'react-toastify';

// initial themeMode setting..
const initialThemeModeSetting = {
    themeMode: {
        backgroundColor: 'white',
        textColor: 'black',
        iconColor: 'gray',
        cardBackgroundColor: '',
        cardFontColor: '',
        cardSubFontColor: '',
        cardBorder: ''
    }
};

// USER API ENDPOINT..
const USER_API_ENDPOINT = `${process.env.REACT_APP_BACKEND_API}/user`;

// AUTH API ENDPOINT..
const AUTH_API_ENDPOINT = `${process.env.REACT_APP_BACKEND_API}/auth`;

// Own Profile..
export function ownProfileInfo(){
    const request = axios.get(`${USER_API_ENDPOINT}/profile`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR! when try to get own profile info -> ', err.message));

    return {
        type: "OWN_PROFILE_INFO",
        payload: request
    };
}

// Others Profile User By Id..
export function userInfoById(id) {
    const request = axios.get(`${USER_API_ENDPOINT}/profile_by_id?userId=${id}`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR! when try to get profileById -> ', err.message));

    return {
        type: "USER_BY_ID",
        payload: request
    };
}

// Auth of User..
export function auth() {
    const request = axios.get(`${USER_API_ENDPOINT}/auth`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR! when try to get auth -> ', err.message));

    return {
        type: "USER_AUTH",
        payload: request
    };
}

// Logout User..
export function logout(){
    const request = axios.get(`${USER_API_ENDPOINT}/logout`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR! when try to make logout -> ', err.message));

    return {
        type: "USER_LOGOUT",
        payload: request
    };
}

// Login User..
// export function loginUser(data){
//     const request = axios.post(`${AUTH_API_ENDPOINT}/login`, data, httpConfig)
//         .then(response => response.data)
//         .catch(err => console.log('ERR! when try to post user login -> ', err.message));

//     return {
//         type: "USER_LOGIN",
//         payload: request
//     };
// }

export const loginUser = (data) => async (dispatch) => {
    try {
        const response = await axios.post(`${AUTH_API_ENDPOINT}/login`, data, httpConfig);
        dispatch({
            type: 'USER_LOGIN',
            payload: response.data,
        });
        toast.success('Login successful!');
    } catch (error) {
        const message = handleApiError(error, 'Login failed. Please check your credentials.');
        dispatch({
            type: 'USER_LOGIN_ERROR',
            payload: message,
        });
    }
};


// Sign Up User..
export function register(data){
    const request = axios.post(`${AUTH_API_ENDPOINT}/register`, data, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR! when try to post user register -> ', err.message));

    return {
        type: "USER_REGISTER",
        payload: request
    };
}

// profile pictures upload..
export function profileUpload(data){
    const request = axios.post(`${USER_API_ENDPOINT}/profile_upload`, data, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR! when try to post user profile upload -> ', err.message));

    return {
        type: "PROFILE_UPLOAD",
        payload: request
    };
}

// Show All Users..
export function showAllUsers(){
    const request = axios.get(`${USER_API_ENDPOINT}/read_all_users`, httpConfig)
        .then(response => response.data.users)
        .catch(err => console.log('Get ERR! when try to fetch all users data.', err.message));

    return {
        type: "ALL_USERS",
        payload: request
    };
}