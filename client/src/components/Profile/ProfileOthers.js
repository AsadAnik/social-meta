import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { Grid, Container } from '@mui/material';
import ProfileHead from '../commons/profileHead';
import { userInfoById } from '../../redux/actions/UserActions';
import { postsByUserId } from '../../redux/actions/PostActions';
import { useParams } from 'react-router-dom';
import NotFound from "../widgets/NotFound";
import PostCard from "../commons/PostCard";
import Birthdate from "../commons/Birthdate";
import FriendsBar from "../commons/FriendsBar";
import SuggestedFollows from "../commons/SuggestedFollows";
import Footer from "../commons/Footer";

const notFoundColor = 'gray';

const ProfileOthers = (props) => {
    const { userId } = useParams();

    useEffect(() => {
        // dispatching for User info by userId and for Posts of userId..
        props.dispatch(userInfoById(userId));
        props.dispatch(postsByUserId(userId));
    }, []);

    // user info there..
    const userInfo = {
        firstname: props?.userInfoById ? props?.userInfoById?.userById?.firstname : "Loading...",
        lastname: props?.userInfoById ? props?.userInfoById?.userById?.lastname : "Loading...",
        title: props?.userInfoById ? props?.userInfoById?.userById?.title : "Loading...",
        bio: props.userInfoById ? props?.userInfoById?.userById?.bio : "Loading...",
        email: props?.userInfoById ? props?.userInfoById?.userById?.email : "Loading...",
        profilePhoto: props?.userInfoById ? props?.userInfoById?.userById?.profilePhoto : "Loading...",
        coverPhoto: props?.userInfoById ? props?.userInfoById?.userById?.coverPhoto : "Loading..."
    };

    // show current User Posts
    const showPostsByUserId = (Posts) => {
        if (Posts === null){
            return (
                <Grid item xs={6} md={8}>
                    <NotFound
                        msg={"No Post!"}
                        color={notFoundColor}
                        size={100}
                    />
                </Grid>
            );
        }

        if (Posts.length < 1){
            return (
                <Grid item xs={6} md={8}>
                    <NotFound
                        msg={"No Post!"}
                        color={notFoundColor}
                        size={100}
                    />
                </Grid>
            );
        }

        return Posts.length && Posts.map((post) => (
                <PostCard
                    key={post._id}
                    postType="PROFILE_OTHERS"
                    postId={post._id}
                    ownerId={post.ownerId}
                    postBody={post.body}
                    postImage={post.image}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                    postLikes={post.likes ? post.likes : 0}
                    comments={post.comments}
                />
        ));
    }

    return (
        <Container>
            <Grid container spacing={2}>
                {/*---- Profile Head showing here ----*/}
                <Grid item xs={8} md={12}>
                    <ProfileHead {...userInfo} />
                </Grid>

                {/*----- Showing current user posts ----*/}
                <Grid item xs={8} md={8}>
                    {showPostsByUserId(props.postsByUserId ? props.postsByUserId : null)}
                </Grid>

                {/*---- BirthDate Section ----*/}
                <Grid item xs={6} md={4}>
                    {/*---- Show ----*/}
                    <FriendsBar/>
                    <SuggestedFollows />
                    <Birthdate  />
                    <Footer />
                </Grid>
            </Grid>
        </Container>
    );
};

// mapStateToProps Function..
const mapStateToProps = (state) => {
    return { ...state.User, ...state.Post };
};

export default connect(mapStateToProps)(ProfileOthers);
