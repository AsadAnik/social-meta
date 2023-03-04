import axios from 'axios';
import httpConfig from '../../utils/httpConfig';

// USER API ENDPOINT..
const USER_API_ENDPOINT = `${process.env.REACT_APP_BACKEND_API}/user`;

/** ---------------- Settings AppColor here ------------------ **/
// App Color's ...
export async function appColorBlack() {
    const appColor = {
        backgroundColor: 'black',
    };  

    await axios.post(`${USER_API_ENDPOINT}/user_colorMode_update?colorMode=${appColor.backgroundColor}`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR!! error when try to maked Black ColorMode Action -- ', err.message));

    return {
        type: 'APP_COLOR_BLACK',
        payload: appColor
    };
}

export async function appColorRoyalblue() {
    const appColor = {
        backgroundColor: 'royalblue',
    };

    await axios.post(`${USER_API_ENDPOINT}/user_colorMode_update?colorMode=${appColor.backgroundColor}`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR!! error when try to maked Royalblue ColorMode Action -- ', err.message));

    return {
        type: 'APP_COLOR_ROYALBLUE',
        payload: appColor
    };
}

export async function appColorGreen() {
    const appColor = {
        backgroundColor: 'green',
    };

    await axios.post(`${USER_API_ENDPOINT}/user_colorMode_update?colorMode=${appColor.backgroundColor}`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR!! error when try to maked Green ColorMode Action -- ', err.message));

    return {
        type: 'APP_COLOR_GREEN',
        payload: appColor
    };
}

export async function appColorRed() {
    const appColor = {
        backgroundColor: 'red'
    };

    await axios.post(`${USER_API_ENDPOINT}/user_colorMode_update?colorMode=${appColor.backgroundColor}`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR!! error when try to maked Red ColorMode Action -- ', err.message));

    return {
        type: 'APP_COLOR_RED',
        payload: appColor
    };
}


/** ---------------- Settings ThemeMode here ------------------ **/
// Theme Mode High-Contrast..
export async function themeModeHighContrast() {
    const themeModeName = "contrastMode";
     // new update..
     const highContrastTheme = {
        themeMode: {
            backgroundColor: 'black',
            textColor: 'lightgray',
            iconColor: 'gray',
            cardBackgroundColor: 'black',
            cardFontColor: 'lightgray',
            cardSubFontColor: 'gray',
            cardBorder: '1px solid gray'
        }
    };

    // make change to backend & DB...
    await axios.post(`${USER_API_ENDPOINT}/user_themeMode_updateName?themeMode=${themeModeName}`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR!! error when try to maked lightMode Action -- ', err.message));

    return {
        type: "THEME_MODE_HIGH_CONTRAST",
        payload: highContrastTheme.themeMode
    };
}

// Theme Mode Light..
export async function themeModeLight() {
    const themeModeName = "lightMode";
    // new update..
    const lightTheme = {
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

    // make change to backend & DB...
    await axios.post(`${USER_API_ENDPOINT}/user_themeMode_updateName?themeMode=${themeModeName}`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR!! error when try to maked lightMode Action -- ', err.message));

    return {
        type: "THEME_MODE_LIGHT",
        payload: lightTheme.themeMode,
    };
}

// Theme Mode Dark..
export async function themeModeDark() {
    const themeModeName = "darkMode";
    // new update...
    const darkTheme = {
        themeMode: {
            backgroundColor: 'rgb(0, 30, 60)',
            textColor: 'lightgray',
            iconColor: 'gray',
            cardBackgroundColor: 'rgba(0, 0, 0, 0.49)',
            cardFontColor: 'lightgray',
            cardSubFontColor: 'gray',
            cardBorder: '1px solid gray'
        }
    };

    // make change to backend & DB...
    const req = await axios.post(`${USER_API_ENDPOINT}/user_themeMode_updateName?themeMode=${themeModeName}`, httpConfig)
        .then(response => response.data)
        .catch(err => console.log('ERR!! error when try to maked lightMode Action -- ', err.message));

    return {
        type: "THEME_MODE_DARK",
        payload: darkTheme.themeMode
    };
}
