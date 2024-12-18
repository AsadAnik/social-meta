import * as React from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Paper,
    Box,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
    InputAdornment
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import StylesModule from '../../css/loginRegister.module.css';
import Copyright from '../widgets/Copyright';
import SimpleReactValidator from 'simple-react-validator';
import AlertNotify from '../widgets/AlertNotify';
import { connect } from 'react-redux';
import { loginUser } from '../../redux/actions/UserActions';
import BackdropLoading from '../widgets/BackdropLoading';
import { handleApiError } from '../../utils/errorHandler';

// react validator..
const validator = new SimpleReactValidator({ messagesShown: false });
const theme = createTheme();

// Login component..
const Login = (props) => {
    // hook..
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        showPassword: false,
        validForm: null,
        formMessage: 'keep filling the form!',
        backdropLoading: false
    });

    // react router dom's navigation..
    const navigate = useNavigate();

    // useEffect React Hook..
    React.useEffect(() => {
        if (props.User) {
            if (props.User.login) {
                if (props.User.login.isAuth) {
                    // console.log('Loggedin -->> ', props.User.login);
                    setFormData({ ...formData, backdropLoading: true });

                    return setTimeout(() => {
                        navigate(`/profile`);
                        // window.location.reload();
                    }, 3000);
                }

                if (!props.User.login.isAuth) {
                    return null;
                }
            }
        }

        // useEffect cleanup function here..
        return () => {
            setFormData({ ...formData, backdropLoading: false });
        };

    }, [setFormData]);

    // onChange handler..
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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

    // submit form..
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const data = new FormData(event.currentTarget);

    //     if (validator.allValid()) {
    //         setFormData({ ...formData, validForm: true, formMessage: 'You are logged in successfully.' });

    //         // dispatching action method of redux..
    //         props.dispatch(loginUser({
    //             email: data.get('email'),
    //             password: data.get('password')
    //         }));

    //         // showing the Backdrop Loading after register user..
    //         // setFormData({ ...formData, backdropLoading: true });
    //         // console.log('loading');

    //     } else {
    //         validator.showMessages();
    //         setFormData({ ...formData, validForm: false, formMessage: 'Your form is not valid please try again' });

    //         // Again make normal the Alert Notify..
    //         setTimeout(() => {
    //             setFormData({ ...formData, validForm: null, formMessage: 'Keep filling' });
    //         }, 2000);
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    
        if (validator.allValid()) {
            setFormData({ ...formData, validForm: true, formMessage: 'Attempting to log in...' });
    
            try {
                // Dispatching login action
                await props.dispatch(
                    loginUser({
                        email: data.get('email'),
                        password: data.get('password'),
                    })
                );
    
                // Successful login (if Redux updates state correctly)
                setFormData({ ...formData, backdropLoading: true });
            } catch (error) {
                // Handle API error gracefully
                const errorMessage = handleApiError(error, 'Login failed. Please try again.');
                setFormData({ ...formData, validForm: false, formMessage: errorMessage });
            }
        } else {
            validator.showMessages();
            setFormData({ ...formData, validForm: false, formMessage: 'Your form is not valid. Please try again.' });
    
            // Reset alert after 2 seconds
            setTimeout(() => {
                setFormData({ ...formData, validForm: null, formMessage: 'Keep filling' });
            }, 2000);
        }
    };
    

    // Destructuring for props data..
    const { login } = props.User;

    // Backdrop Loading..
    // When the laoding..
    if (!formData.backdropLoading) {
        return (
            <ThemeProvider theme={theme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    {/*------- Backdrop Loading ------*/}
                    {formData.backdropLoading && <BackdropLoading />}

                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(/jerry-zhou-5_UkFNpURas-unsplash.jpg)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>

                                {/*-------- Email --------*/}
                                <TextField
                                    error={validator.visibleFields.length && !validator.fieldValid('email') ? true : false}
                                    required
                                    fullWidth
                                    margin="normal"
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={formData.email}
                                    onChange={(e) => handleChange(e)}
                                    onBlur={() => validator.showMessageFor('email')}
                                />
                                {validator.message('email', formData.email, 'required|email', { className: StylesModule.error })}

                                {/*-------- Password ---------*/}
                                <FormControl
                                    fullWidth
                                    required
                                    variant="outlined"
                                    margin="normal"
                                >
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <OutlinedInput
                                        error={validator.visibleFields.length && !validator.fieldValid('password') ? true : false}
                                        id="password"
                                        type={formData.showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        name="password"
                                        autoComplete="current-password"
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

                                {/*--------- Checking Form's Result ----------*/}
                                <Grid style={{ marginTop: '10px' }}>
                                    {/* { console.log('FormData Error -->> inner from return --', props) } */}
                                    {
                                        login && !login.isAuth && login.message ?
                                            showResultsAlertNofity(false, login.message)
                                            :
                                            login ? login.isAuth && showResultsAlertNofity(true, "Successfully Logged-in.")
                                                :
                                                null
                                    }
                                </Grid>

                                {/*-------- Sign In --------*/}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        {/* <Link href="/register" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link> */}

                                        <RouterLink to="/register" className={StylesModule.link}>
                                            {"Don't have an account? Sign Up"}
                                        </RouterLink>
                                    </Grid>
                                </Grid>
                                <Copyright sx={{ mt: 5 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }

    // Returining statement..
    return <BackdropLoading />;
}

// mapStateToProps function..
const mapStateToProps = (state) => {
    return {
        User: state.User
    };
};

export default connect(mapStateToProps)(Login);