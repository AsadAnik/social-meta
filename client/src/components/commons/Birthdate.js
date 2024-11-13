import React from 'react';
import { Paper } from '@mui/material';
import StylesModule from '../../css/birthdate.module.css';
import CakeIcon from '@mui/icons-material/Cake';
import { connect } from 'react-redux';
import moment from "moment";


// Component of Birthdate..
const Birthdate = (props) => {
    // ThemeMode here..
    const [themeMode, setThemeMode] = React.useState({
        backgroundColor: 'white',
        cardBorder: 'lightgray',
        textColor: 'black'
    });
    const [appColor, setAppColor] = React.useState('royalblue');
    const birthdate = "2000-01-13T13:55:41Z"; // ISO format is recommended


    // useEffect.. Hook..
    React.useEffect(() => {
        // setting from Redux store..
        if (props.Settings) {
            if (props.Settings.themeMode) {
                // themeMode..
                const { backgroundColor, cardBorder, textColor } = props.Settings.themeMode;
                // set the theme..
                setThemeMode({
                    backgroundColor,
                    cardBorder,
                    textColor
                });
            }

            if (props.Settings.appColor) {
                const { appColor } = props.Settings;
                setAppColor(appColor.backgroundColor);
            }
        }
        // cleanup function here..
        return () => {
            setThemeMode({
                backgroundColor: '',
                cardBorder: '',
                textColor: ''
            });
            setAppColor('royalblue');
        };
    }, [props.Settings]);

    // CSS Style for birthdate icon..
    const commonThemeColor = appColor;
    const birthdateIcon = {
        fontSize: '30px',
        position: 'relative',
        top: '5px',
        color: commonThemeColor
    };

    // CSS Style for birthdate text..
    const birthdateText = {
        background: commonThemeColor,
        color: 'white',
        borderRadius: '5px',
        textAlign: 'center'
    };

    // returning statement..
    return (
        <Paper
            className={StylesModule.birthdatePaper}
            style={{
                background: themeMode.backgroundColor,
                border: themeMode.cardBorder,
                color: themeMode.textColor
            }}
        >
            <h3>
                <span><CakeIcon style={birthdateIcon} /></span>
                <span> </span>
                <span>Birthdate</span>
            </h3>

            <p style={{ fontSize: "25px", color: "#555" }}>
                Born on {moment(birthdate).format("MMMM D, YYYY")}
            </p>
        </Paper>
    );
};

// mapStateToProps..
const mapStateToProps = (state) => {
    return {
        Settings: state.Settings
    };
};

export default connect(mapStateToProps)(Birthdate);
