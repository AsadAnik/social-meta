import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Modal,
    CardHeader,
    Avatar,
    CardContent,
    Card,
    Button,
} from '@mui/material';
import { Cancel as CancelIcon, Send as SendIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import StylesModule from '../../css/postHead.module.css';
import TextEditor from '../widgets/TextEditor';
import Uploader from '../widgets/Uploader';
import { connect } from 'react-redux';
import { postCreate } from '../../redux/actions/PostActions';
import AlertNotify from "../widgets/AlertNotify";
import { useNavigate } from 'react-router-dom';

// Global initial profilePhoto path for Modal..
const initialProfileImgPath = "/profileUpload";

// Modal Component..
const PostModal = ({ themeMode, postModal, setPostModal, clickToSubmit, userFirstname, userLastname, userProfilePhoto, userTitle }) => {
    const [postData, setPostData] = React.useState({
        postBody: '',
        imageFile: '',
        imagePreview: '',
        loading: false
    });

    // themeMode..
    const { backgroundColor, textColor, cardBorder, cardSubFontColor } = themeMode;

    // Global style for Modal..
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
        bgcolor: backgroundColor,
        color: textColor,
        boxShadow: 24,
        border: cardBorder
    };

    const uploaderStyle = {
        width: '100%',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
        border: '1px solid lightgray',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    // Post Submit Button Or Loading after submit..
    const postSubmitButton = (isLoading) => (
        !isLoading ?
            <Button
                variant="contained"
                fullWidth={true}
                color="secondary"
                endIcon={<SendIcon />}
                onClick={(event) => clickToSubmit(event, postData, setPostData)}
            >
                post
            </Button>
            :
            <LoadingButton
                loading
                loadingPosition="start"
                variant="contained"
                fullWidth={true}
                startIcon={<SendIcon />}
            >
                post
            </LoadingButton>
    )


    // Returning statement..
    return (
        <Modal
            open={postModal}
            onClose={() => setPostModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Card sx={style}>
                <CardHeader
                    avatar={
                        <Avatar
                            alt={'No User'}
                            src={`${initialProfileImgPath}/${userProfilePhoto}`}
                        />
                    }
                    title={`${userFirstname} ${userLastname}`}
                    subheader={userTitle}
                    subheaderTypographyProps={{ color: cardSubFontColor }}
                />
                <CardContent>
                    <TextEditor
                        postData={postData}
                        setPostData={setPostData}
                        editorPlaceholder="Write your post here..."
                        type="postBody"
                    />
                    <Uploader
                        customStyle={uploaderStyle}
                        postData={postData}
                        setPostData={setPostData}
                    />

                    {/*---- Post-Submit button or loading ----*/}
                    <div style={{ marginTop: '0.5rem' }}>
                        {postSubmitButton(postData.loading)}
                    </div>

                    {/*---- Post submit Cancel button ----*/}
                    <div style={{ marginTop: '0.5rem' }}>
                        <Button
                            variant="contained"
                            fullWidth={true}
                            color="error"
                            endIcon={<CancelIcon />}
                            onClick={() => setPostModal(false)}
                        >
                            cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Modal>
    );
};


// Post Head Component..
const PostHead = (props) => {
    const profilePath = "/profileUpload";
    const [postModal, setPostModal] = useState(false);
    const [themeMode, setThemeMode] = useState({
        backgroundColor: '',
        textColor: '',
        cardBorder: '',
        cardSubFontColor: ''
    });
    const [AppColor, setAppColor] = useState('royalblue');

    // useEffect Hook..
    useEffect(() => {
        // themeMode..
        if (props.Settings) {
            if (props.Settings.themeMode) {
                const { backgroundColor, textColor, cardBorder, cardSubFontColor } = props.Settings.themeMode;
                setThemeMode({ backgroundColor, textColor, cardBorder, cardSubFontColor });
            }

            if (props.Settings.appColor) {
                const { appColor } = props.Settings;
                setAppColor(appColor.backgroundColor);
            }
        }

        // cleanup function..
        return () => {
            setThemeMode({ backgroundColor: '', textColor: '', cardBorder: '', cardSubFontColor: '' });
        };
    }, [props.Settings]);


    // React-Router-Dom Navigate..
    const navigate = useNavigate();

    const paperStyle = {
        padding: '10px',
        backgroundColor: AppColor,
        marginTop: '1rem'
    };

    // Submit Post..
    const clickToSubmit = (event, postData, setPostData) => {
        event.preventDefault();

        setPostData({ ...postData, loading: true });

        const formData = new FormData();
        formData.append('body', postData.postBody);
        formData.append('file', postData.imageFile);

        // dispatching data to redux store for backend req.
        props.dispatch(postCreate(formData));

        setTimeout(() => {
            setPostData({ ...postData, loading: false });
            setPostModal(false);

            // redirecting to home page..
            navigate('/');
        }, 2000);
    };

    // if face some error so take this...
    if (props.Post) {
        if (props.Post.createdPost) {
            const { success } = props.Post.createdPost;

            if (!success) {
                return (
                    <div style={{ marginTop: '1rem' }}>
                        <AlertNotify type="ERROR" message="Server ERROR! reload app & try again." />
                    </div>
                );
            }
        }
    }

    // current loggedIn user's information..
    const currentUserInfo = {
        userFirstname: props.User && props.User.login ? props.User.login.firstname : "Loading...",
        userLastname: props.User && props.User.login ? props.User.login.lastname : "Loading..",
        userTitle: props.User && props.User.login ? props.User.login.title : "Loading..",
        userProfilePhoto: props.User && props.User.login ? props.User.login.profilePhoto : "Loading.."
    };

    console.log('MODAL ITEM HERE -- ', postModal);

    // Returning statement..
    return (
        <Paper
            elevation={2}
            style={paperStyle}
        >
            <Grid container>
                <Grid item xs={1}>
                    {/*<img*/}
                    {/*    className={StylesModule.postProfilePic}*/}
                    {/*    src={`${profilePath}/${currentUserInfo.userProfilePhoto}`}*/}
                    {/*    alt="profile-pic"*/}
                    {/*/>*/}
                    <Avatar
                        className={StylesModule.postProfilePic}
                        src={`${profilePath}/${currentUserInfo.userProfilePhoto}`}
                        alt="profile-pic"
                    />
                </Grid>

                <Grid item xs={11}>
                    <div onClick={() => setPostModal(true)}>
                        <input
                            className={StylesModule.postInput}
                            type="text"
                            placeholder="Create your post now.."
                            disabled={false}
                            readOnly={true}
                            style={{ background: themeMode.backgroundColor }}
                        />
                    </div>

                    <PostModal
                        themeMode={themeMode}
                        postModal={postModal}
                        setPostModal={setPostModal}
                        clickToSubmit={clickToSubmit}
                        userFirstname={currentUserInfo.userFirstname}
                        userLastname={currentUserInfo.userLastname}
                        userTitle={currentUserInfo.userTitle}
                        userProfilePhoto={currentUserInfo.userProfilePhoto}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

// mapStateToProps function..
const mapStateToProps = (state) => {
    return {
        Post: state.Post,
        User: state.User,
        Settings: state.Settings
    };
};

export default connect(mapStateToProps)(PostHead);
