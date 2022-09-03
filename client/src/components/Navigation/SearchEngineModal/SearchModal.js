import React from 'react';
import { Modal, Typography, Box, InputBase, Button } from '@mui/material';
import {
    Search as SearchIcon,
    EditLocationAlt as EditLocationAltIcon,
    SupervisedUserCircle as SupervisedUserCircleIcon,
    DynamicFeed as DynamicFeedIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import NotFound from '../../widgets/NotFound';
import { connect } from 'react-redux';
import { showAllUsers } from '../../../redux/actions/UserActions';
import { readAllPosts } from '../../../redux/actions/PostActions';
import FoundUser from './FoundUser';
import FoundPost from './FoundPost';

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
            width: '100ch',
        },
    },
}));

// The Stylesheet here...
const styleModalBox = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid lightgray',
    paddingLeft: 1,
    paddingRight: 1,
    boxShadow: 24,
    borderRadius: 2,
    maxHeight: 500,
    overflow: 'scroll',
    scrollBehavior: 'smooth'
};

const styleSearchBar = {
    padding: 0,
    margin: 0,
    border: '1px solid lightgray',
    marginBottom: 10,
    width: '90%',
    position: 'sticky',
    top: 0,
};

const styleSearchTypeIcon = {
    fontSize: 35,
    padding: 5,
    backgroundColor: 'gray',
    // marginLeft: 10,
    borderRadius: 5,
    color: 'white',
    cursor: 'pointer',
    marginTop: -11
};

const styleJustifySearchTypes = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 5,
    border: '1px solid lightgray',
    margin: 5,
    cursor: 'pointer',
};

// SearchModal here..
const SearchModal = (props) => {
    const { open, handleClose } = props;
    const [searchKeyPressed, setSearchKeyPressed] = React.useState(false);
    // const [foundData, setFoundData] = React.useState(true);
    const [searchText, setSearchText] = React.useState('');
    const [AllUsers, setAllUsers] = React.useState([]);
    const [AllPosts, setAllPosts] = React.useState([]);
    const [filteredUsers, setFilteredUsers] = React.useState([]);
    const [filteredPosts, setFilteredPosts] = React.useState([]);
    const [searchTypeOpen, setSearchTypeOpen] = React.useState(false);
    const [typeOfSearch, setTypeOfSearch] = React.useState('USER');

    // React Hook UseEffect..
    React.useEffect(() => {
        props.dispatch(showAllUsers());
        props.dispatch(readAllPosts());
    }, []);

    // console.log('--- Props --- ', props);

    // Search type close handle function..
    const handleSearchTypeClose = () => {
        setSearchTypeOpen(false);
    };

    const searchEngine = (TYPE, searchValue) => {
        // SEARCH FOR USERS..
        if (TYPE === 'USER') {
            // Make Filter for the Search data..
            const filteredData = AllUsers.filter(item => {
                const firstname = item.firstname.toLowerCase();
                const lastname = item.lastname.toLowerCase();
                let userValue = searchValue.toLowerCase();
                userValue = userValue.split(' ', 1).toString();

                if (firstname === userValue) {
                    return firstname === userValue;
                }

                if (lastname === userValue) {
                    return lastname === userValue;
                }
            });

            // console.log('Getting the new Filtered data -- ', filteredData);
            // Make Filtered Data put into the React Hook..
            setFilteredUsers(filteredData);
        }

        // SEARCH FOR POSTS..
        if (TYPE === 'POST') {
            const filteredData = AllPosts.filter(item => {
                let postBody = item.body;
                const userValue = searchValue.toLowerCase();
                postBody = postBody.replace(/<\/?[^>]+(>|$)/g, "");
                postBody = postBody.toLowerCase();

                return postBody.indexOf(userValue) > -1;
            });

            // Make Filtered Data pu into the React Hook..
            setFilteredPosts(filteredData);
        }

        if (searchValue.length > 0) {
            setSearchKeyPressed(true);
        } else {
            setSearchKeyPressed(false);
        }
    };

    // OnChange handler Function..
    const handleSearchKeyChange = (event, TYPE) => {
        const searchValue = event.target.value;
        setSearchText(searchValue);

        // Put all users inside the Array Hook..
        setAllUsers(props.users.allUsers);
        // Put all posts inside the Array Hook..
        setAllPosts(props.posts.allPosts);

        // Search Engine Function..
        searchEngine(TYPE, searchValue);
    };

    // console.log("Filtered OR Search Result -- ", filteredUsers);
    // console.log("Filtered Posts == ", filteredPosts);

    // Founded Data..
    const foundedData = (handleClose, TYPE) => {
        if (TYPE === 'USER') {
            if (filteredUsers.length > 0) {
                return (
                    <>
                        {filteredUsers.map(user => {
                            return (
                                <FoundUser
                                    key={user._id}
                                    handleClose={handleClose}
                                    userId={user._id}
                                    firstname={user.firstname}
                                    lastname={user.lastname}
                                    title={user.title}
                                    profilePhoto={user.profilePhoto}
                                />
                            );
                        })}
                    </>
                );
            }
            return notFoundedData();
        }

        if (TYPE === 'POST') {
            if (filteredPosts.length > 0) {
                return (
                    <>
                        {filteredPosts.map(post => {
                            return (
                                <FoundPost
                                    key={post._id}
                                    handleClose={handleClose}
                                    postId={post._id}
                                    body={post.body}
                                    image={post.image}
                                    ownerId={post.ownerId}
                                />
                            );
                        })}
                    </>
                );
            }
            return notFoundedData();
        }

        return notFoundedData();
    }

    // Not Founded Data..
    const notFoundedData = () => {
        return (
            <NotFound msg="Not Found Any Result!" color="gray" size={50} />
        );
    };

    // returning statement...
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                arial-labelledby="modal-modal-description"
                arial-describedby="modal-modal-description"
            >
                <Box sx={styleModalBox}>
                    <div style={{ display: 'flex', position: 'sticky', top: 0, background: 'white', paddingTop: 5 }}>
                        {/* ---- Search Bar ---- */}
                        <Search style={styleSearchBar}>
                            <SearchIconWrapper>
                                {!searchKeyPressed ? <SearchIcon /> : <LoadingButton loading style={{ marginLeft: '-20px' }} />}
                            </SearchIconWrapper>
                            <StyledInputBase
                                style={{ width: '100%', fontSize: '20px' }}
                                placeholder={typeOfSearch === 'USER' ? 'Search User..' : 'Search Post..'}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(event) => handleSearchKeyChange(event, typeOfSearch)}
                            />
                        </Search>

                        {/* ---- Select Search For Type Change ----- */}
                        <Button onClick={() => setSearchTypeOpen(true)}>
                            <EditLocationAltIcon style={styleSearchTypeIcon} />
                        </Button>

                        <Modal
                            open={searchTypeOpen}
                            onClose={handleSearchTypeClose}
                            arial-labelledby="modal-modal-description"
                            airal-describedby="modal-modal-description"
                        >
                            <Box sx={{ ...styleModalBox, width: 200 }}>
                                <h3 id="child-modal-title">Type of Search</h3>

                                <div
                                    style={{
                                        ...styleJustifySearchTypes,
                                        backgroundColor: typeOfSearch === 'USER' && 'gray',
                                        color: typeOfSearch === 'USER' && 'white',
                                    }}
                                    onClick={() => setTypeOfSearch('USER')}
                                >
                                    <SupervisedUserCircleIcon />
                                    <Typography>User Search</Typography>
                                </div>

                                <div
                                    style={{
                                        ...styleJustifySearchTypes,
                                        backgroundColor: typeOfSearch === 'POST' && 'gray',
                                        color: typeOfSearch === 'POST' && 'white',
                                    }}
                                    onClick={() => setTypeOfSearch('POST')}
                                >
                                    <DynamicFeedIcon />
                                    <Typography>Post Search</Typography>
                                </div>
                            </Box>
                        </Modal>
                    </div>

                    {/* ----- Search Result Data Area ----- */}
                    {foundedData(handleClose, typeOfSearch)}
                </Box>
            </Modal>
        </>
    );
};

// MapStateToProps..
const mapStateToProps = (state) => {
    return {
        users: state.User,
        posts: state.Post
    };
};

export default connect(mapStateToProps, null)(SearchModal);