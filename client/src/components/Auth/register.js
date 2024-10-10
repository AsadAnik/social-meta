import React, { useState } from 'react';
import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    Box,
    Typography,
    Grid,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
    InputAdornment
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import StylesModule from '../../css/loginRegister.module.css';
import { connect } from 'react-redux';
import { register } from '../../redux/actions/UserActions';
import SimpleReactValidator from 'simple-react-validator';
import AlertNotify from '../widgets/AlertNotify';
import BackdropLoading from '../widgets/BackdropLoading';
import Copyright from '../widgets/Copyright';
import RegisterUserExist from './RegisterUserExist';
import ProfileUploadRegister from './ProfileUploadRegister';

// Using React Validator..
const validator = new SimpleReactValidator({ messagesShown: false });

// Theme..
const theme = createTheme();


// Register component..
const Register = (props) => {
    const [date, setDate] = useState(new Date());
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        title: '',
        email: '',
        password: '',
        birthdate: '',
        bio: '',
        showPassword: false,
        validForm: null,
        formMessage: 'keep filling the form',
        backdropLoading: false,
        moveNext: false
    });

    // click eye to show pass..
    const handleClickShowPassword = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // onChange handler..
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };

    // show Result Notify..
    const showResultsAlertNofity = (validForm, formMessage) => {
        if (validForm === null) {
            return <AlertNotify type="INFO" message={formMessage} />;
        }
        if (!validForm) {
            return <AlertNotify type="ERROR" message={formMessage} />;
        }
        if (validForm) {
            return <AlertNotify type="SUCCESS" message={formMessage} />;
        }
    };

    // handle submit..
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (validator.allValid()) {
            setFormData({ ...formData, validForm: true, formMessage: 'User created you are registered so login now' });

            // dispatching to action method of redux..
            props.dispatch(register({
                firstname: data.get('firstName'),
                lastname: data.get('lastName'),
                email: data.get('email'),
                password: data.get('password'),
                bio: data.get('bio'),
                birthdate: String(date),
                title: data.get('title'),
            }));

            // showing the Backdrop Loading after register user..
            setFormData({ ...formData, backdropLoading: true });
            // console.log('loading');

        } else {
            validator.showMessages();
            setFormData({ ...formData, validForm: false, formMessage: 'Your form is not valid please try again' });

            // Again make normal the Alert Notify..
            setTimeout(() => {
                setFormData({ ...formData, validForm: null, formMessage: 'Keep filling' });
            }, 3000);
        }
    };

    // if the user created successfully then redirect to profileUpload..
    // otherwise it will redirect to error page.. 
    if (props.User.register) {
        if (!props.User.register.success) {
            return <RegisterUserExist {...props} />;
        }

        if (props.User.register.success) {
            setTimeout(() => {
                setFormData({ ...formData, moveNext: true });
            }, 4000);

            if (formData.moveNext) {
                return <ProfileUploadRegister />;
            }
        }
    }

    // returining statement..
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                {/*------- Backdrop Loading ------*/}
                {formData.backdropLoading && <BackdropLoading />}

                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={(e) => handleSubmit(e)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {/*-------- FirstName --------*/}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={validator.visibleFields.length && !validator.fieldValid('firstName') ? true : false}
                                    required
                                    fullWidth
                                    autoFocus
                                    autoComplete="given-name"
                                    name="firstName"
                                    id="firstName"
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange(e)}
                                    onBlur={() => validator.showMessageFor('firstName')}
                                />
                                <span className="error">
                                    {validator.message('firstName', formData.firstName, 'required|alpha', { className: StylesModule.error })}
                                </span>
                            </Grid>

                            {/*-------- LastName -------*/}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={(e) => handleChange(e)}
                                    value={formData.lastName}
                                />
                            </Grid>

                            {/*-------- Title Or Profession --------*/}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="title"
                                    label="Title or Profession"
                                    name="title"
                                    onChange={(e) => handleChange(e)}
                                    value={formData.title}
                                />
                            </Grid>

                            {/*-------- Email --------*/}
                            <Grid item xs={12}>
                                <TextField
                                    error={validator.visibleFields.length && !validator.fieldValid('email') ? true : false}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange(e)}
                                    onBlur={() => validator.showMessageFor('email')}
                                />
                                {validator.message('email', formData.email, 'required|email', { className: StylesModule.error })}
                            </Grid>

                            {/*------- Password --------*/}
                            <Grid item xs={12}>
                                {/* <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                /> */}

                                <FormControl fullWidth required variant="outlined">
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <OutlinedInput
                                        error={validator.visibleFields.length && !validator.fieldValid('password') ? true : false}
                                        id="password"
                                        type={formData.showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        name="password"
                                        onChange={(e) => handleChange(e)}
                                        onBlur={() => validator.showMessageFor('password')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                                {validator.message('password', formData.password, 'required|min:7', { className: StylesModule.error })}
                            </Grid>

                            {/*-------- Birth Date -------*/}
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Basic date picker" />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            {/*-------- Bio --------*/}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth={true}
                                    id="outlined-multiline-static"
                                    label="Your Bio"
                                    name="bio"
                                    multiline
                                    rows={4}
                                    defaultValue="I am chill guy."
                                />
                            </Grid>
                        </Grid>

                        {/*--------- Checking Form's Result ----------*/}
                        <Grid style={{ marginTop: '10px' }}>
                            {showResultsAlertNofity(formData.validForm, formData.formMessage)}
                        </Grid>

                        {/*------- Sign Up --------*/}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>

                        {/*-------- Already have account --------*/}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <RouterLink to="/login" className={StylesModule.link}>
                                    Already have an account? Sign in
                                </RouterLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
};

// mapStateToProps..
const mapStateToProps = (state) => {
    return {
        User: state.User
    };
};

export default connect(mapStateToProps)(Register);