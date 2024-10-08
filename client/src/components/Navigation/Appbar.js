import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Badge,
    MenuItem,
    Menu,
    Container,
    ListItemIcon,
    Avatar,
    Fab,
    useScrollTrigger,
    Zoom
} from '@mui/material';
import {
    Search as SearchIcon,
    AccountCircle,
    Mail as MailIcon,
    Notifications as NotificationsIcon,
    MoreVert as MoreIcon,
    Home as HomeIcon,
    Logout as LogoutIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/UserActions';
import * as PropTypes from "prop-types";
import Settings from '../Settings';
import SearchModal from './SearchEngineModal/SearchModal';


// ByDefault profile photo path..
const initialProfileImgPath = "/profileUpload";

// Styling Components..
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


function ScrollTop(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-anchor',
        );

        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    };

    return (
        <Zoom in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {children}
            </Box>
        </Zoom>
    );
}

ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};



// Appbar component..
const Appbar = (props) => {
    // Search Modal open Hook..
    const [searchModalOpen, setSearchModalOpen] = React.useState(false);

    // useNavigate Hook from react-router-dom..
    const navigate = useNavigate();
    const [AppbarBG, setAppbarBG] = React.useState('royalblue');

    React.useEffect(() => {
        if (props.User) {
            if (props.User.logout) {
                // so make redirect..
                navigate('/login');
            }
        }

        if (props.Settings) {
            if (props.Settings.appColor) {
                const { appColor } = props.Settings;
                setAppbarBG(appColor.backgroundColor);
            }
        }

        // React Cleanup Function...
        return () => {
            setAppbarBG('royalblue');
        };

    }, [props, navigate]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    // Handle Search Modal Open & Close..
    const handleSearchClose = () => {
        setSearchModalOpen(false);
    };

    const handleSearchOpen = () => {
        setSearchModalOpen(true);
    };

    // Logout function..
    const logoutFunc = () => {
        // makes User logout..
        props.dispatch(logout());

        // make reloading for improve the navigate function..
        window.location.reload();
    };

    // show Profile or Avatar..
    const showProfileOrNot = (User) => {
        if (User === null) {
            return <AccountCircle />;
        }

        if (User !== null) {
            if (User.login) {
                return (
                    <Avatar
                        src={`${initialProfileImgPath}/${User.login.profilePhoto}`}
                        style={{ width: '28px', height: '28px', border: '1.5px solid white' }}
                    />
                );
            }
        }
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {/*---- Profile navigate from here ----*/}
            <NavLink
                to={`/profile`}
                style={{
                    color: "black",
                    textDecoration: 'none',
                }}>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
            </NavLink>


            <MenuItem onClick={(e) => { handleMenuClose(e); logoutFunc() }}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    );

    // -------- Mobile Menu...
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {/*-------- HomeIcon -------*/}
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <HomeIcon />
                </IconButton>
                <p>Home</p>
            </MenuItem>
            {/*-------- MailIcon -------*/}
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <NavLink
                        to={'/messenger'}
                        style={({ isActive }) => ({
                            color: !isActive ? "white" : "black"
                        })}
                    >
                       <Badge badgeContent={4} color="error">
                            <MailIcon />
                       </Badge>
                    </NavLink>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            {/*-------- NotificationIcon -------*/}
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>

            {/*---- Settings Icon ----*/}
            <MenuItem>
                <IconButton
                    size="large"
                    color="inherit"
                >
                    <SettingsIcon />
                </IconButton>
                <p>Settings</p>
            </MenuItem>

            {/*-------- ManuItem Icon -------*/}
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    // console.log('AppBar PROPS -- ', props);

    //  returning statement..
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar style={{ backgroundColor: AppbarBG }}>
                <Container>
                    <Toolbar>
                        {/*-------- App Name --------*/}
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            SocialMeta
                        </Typography>

                        {/*------- Search Bar -------*/}
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onClick={handleSearchOpen}
                                disabled={false}
                                readOnly={true}
                            />
                            <SearchModal open={searchModalOpen} handleClose={handleSearchClose} />
                        </Search>

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {/*------- HomeIcon -------*/}
                            <IconButton size="large">
                                <NavLink
                                    to={'/'}
                                    style={({isActive}) => ({
                                        color: !isActive ? "white" : "black"
                                    })}
                                >
                                    <HomeIcon />
                                </NavLink>
                            </IconButton>

                            {/*------- MailIcon -------*/}
                            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                <NavLink
                                    to={'/messenger'}
                                    style={({isActive}) => ({
                                        color: !isActive ? "white" : "black"
                                    })}
                                >
                                    <Badge badgeContent={4} color="error">
                                        <MailIcon />
                                    </Badge>
                                </NavLink>
                            </IconButton>

                            {/*------- NotificationIcon -------*/}
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                            >
                                <Badge badgeContent={17} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            {/*---- Settings Icon ----*/}
                            <IconButton size="large" color="inherit">
                                <Settings />
                            </IconButton>

                            {/*------- Account -------*/}
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                {showProfileOrNot(props.User ? props.User : null)}
                            </IconButton>
                        </Box>

                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}

            {/*---- Make Scroll Up when page comes down -----*/}
            <Toolbar id="back-to-top-anchor" />
            <ScrollTop {...props}>
                <Fab style={{backgroundColor: AppbarBG, color: 'white'}} size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </Box>
    );
}

// mapStateToProps..
const mapStateToProps = (state) => {
    return {
        User: state.User,
        Settings: state.Settings
    };
};

export default connect(mapStateToProps)(Appbar);
