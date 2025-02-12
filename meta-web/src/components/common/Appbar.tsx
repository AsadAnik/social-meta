'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PublicIcon from '@mui/icons-material/Public';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreIcon from '@mui/icons-material/MoreVert';
import Searchbar from '../widgets/Searchbar';
import { Container, Fab, Fade } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ModeSwitch } from '@/components/widgets';
import appbarStyles from '@/styles/components/appbar.module.scss';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '@/redux/slice/auth.slice';
import { clearCredentials } from '@/redux/slice/auth.slice';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

// region AppBar Component
export default function PrimarySearchAppBar(props: any) {

    const [logout, { isLoading }] = useLogoutMutation();
    const dispatch = useDispatch();

    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = (): any => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    // region Logout Handler
    const handleLogout = async () => {
        try {
            await logout({});
            dispatch(clearCredentials());
            toast.success("Logout successful!");
            router.push('/login'); // Redirect user to login after logout
        } catch (error) {
            console.error("Logout failed: ", error);
            toast.error("Logout failed. Please try again.");
        } finally {
            handleMenuClose();
        }
    };

    // region Default Menu
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
            <MenuItem onClick={() => {
                router.push('/profile/me');
                handleMenuClose();
            }}>
                <IconButton size="large" color="inherit">
                    <Badge badgeContent={0} color="error">
                        <AccountBoxIcon />
                    </Badge>
                </IconButton>
                <Typography>
                    {" "} My Profile
                </Typography>
            </MenuItem>

            <MenuItem onClick={() => {
                router.push('/settings');
                handleMenuClose();
            }}>
                <IconButton size="large" color="inherit">
                    <Badge badgeContent={0} color="error">
                        <SettingsIcon />
                    </Badge>
                </IconButton>
                <Typography>
                    {" "} Settings
                </Typography>
            </MenuItem>

            <MenuItem onClick={() => {
                // handleLogout();
                handleMenuClose();
            }}>
                <IconButton size="large" color="inherit">
                    <Badge badgeContent={0} color="error">
                        <LogoutIcon />
                    </Badge>
                </IconButton>
                <Typography>
                    {" "} Logout
                </Typography>
            </MenuItem>
        </Menu>
    );

    // region Mobile Menu
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
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
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

    // region ScrollTop Interface
    interface Props {
        /**
         * Injected by the documentation to work in an iframe.
         * You won't need it on your project.
         */
        window?: () => Window;
        children?: React.ReactElement<unknown>;
    }

    // region ScrollTop Component
    function ScrollTop(props: Props) {
        const { children, window } = props;
        // Note that you normally won't need to set the window ref as useScrollTrigger
        // will default to window.
        // This is only being set here because the demo is in an iframe.
        const trigger = useScrollTrigger({
            target: window ? window() : undefined,
            disableHysteresis: true,
            threshold: 100,
        });

        const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
            const anchor = (
                (event.target as HTMLDivElement).ownerDocument || document
            ).querySelector('#back-to-top-anchor');

            if (anchor) {
                anchor.scrollIntoView({
                    block: 'center',
                });
            }
        };

        return (
            <Fade in={trigger}>
                <Box
                    onClick={handleClick}
                    role="presentation"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                >
                    {children}
                </Box>
            </Fade>
        );
    }

    // region AppBar
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" className={appbarStyles.appbar}>
                <Toolbar>
                    {/* Home Icon to Home Page */}
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={() => router.push('/')}
                    >
                        <Badge color="error">
                            <PublicIcon />
                        </Badge>
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        MUI
                    </Typography>

                    {/* SEARCH-BAR COMPONENT */}
                    <Searchbar />

                    {/* MIDDLE GAP COMPONENT */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* ICONS NAVIGATION COMPONENTS */}
                    {/* Desktop View Here */}
                    <Box sx={{ display: { xs: 'none', md: 'flex', lg: 'flex' } }}>
                        {/* Mail Icon */}
                        <IconButton
                            size="large"
                            aria-label="show 4 new mails"
                            color="inherit"
                            onClick={() => router.push('/messenger')}
                        >
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>

                        {/* Notification Icon */}
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            onClick={() => router.push('/notifications')}
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        {/* Account Icon */}
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>

                        {/* Mode Theme Switch */}
                        <ModeSwitch />
                    </Box>

                    {/* Mobile View Here */}
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
            </AppBar>

            <Toolbar id="back-to-top-anchor" />

            {/* CONTAINER COMPONENT */}
            <Container>
                <Box sx={{ my: 2 }}>
                    {props.children}
                </Box>
            </Container>

            {/* SCROLL TO TOP COMPONENT */}
            <ScrollTop {...props}>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>

            {/* RENDEING MENU AND MOBILE MENU HERE */}
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}