import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { Grid, Container } from '@mui/material';
import ProfileHead from '../commons/profileHead';
import PostHead from '../commons/postHead';
import PostCard from '../commons/PostCard';
import SuggestedFollows from "../commons/SuggestedFollows";
import { ownProfileInfo } from '../../redux/actions/UserActions';
import { currentUserPosts } from '../../redux/actions/PostActions';
import NotFound from "../widgets/NotFound";
import FriendsBar from "../commons/FriendsBar";
import Birthdate from "../commons/Birthdate";
import Footer from "../commons/Footer";

const notFoundColor = 'gray';

const ProfileOwn = (props) => {
    useEffect(() => {
        // dispatched action here..
        props.dispatch(ownProfileInfo());
        props.dispatch(currentUserPosts());
    }, []);

    // user info there..
    const userInfo = {
        firstname: props.ownProfileInfo ? props.ownProfileInfo.firstname : "Loading...",
        lastname: props.ownProfileInfo ? props.ownProfileInfo.lastname : "Loading...",
        title: props.ownProfileInfo ? props.ownProfileInfo.title : "Loading...",
        bio: props.ownProfileInfo ? props.ownProfileInfo.bio : "Loading...",
        email: props.ownProfileInfo ? props.ownProfileInfo.email : "Loading...",
        profilePhoto: props.ownProfileInfo ? props.ownProfileInfo.profilePhoto : "Loading...",
        coverPhoto: props.ownProfileInfo ? props.ownProfileInfo.coverPhoto : "Loading...",
        birthdate: props.ownProfileInfo ? props.ownProfileInfo.birthdate : "Loading..."
    };



    // show current User Posts
    const showCurrentUserPosts = (Posts) => {
        if (Posts === null){
            return (
                <NotFound
                    msg={"No Post!"}
                    color={notFoundColor}
                    size={100}
                />
            );
        }

        if (Posts.length < 1){
            return (
                <NotFound
                    msg={"No Post!"}
                    color={notFoundColor}
                    size={100}
                />
            );
        }

        return Posts.length && Posts.map((post) => (
                <PostCard
                    key={post._id}
                    postType="PROFILE"
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

                {/*---- Post creating head here ----*/}
                <Grid item xs={6} md={8}>
                    <PostHead />
                </Grid>

                {/*---- Suggested followers showing here ----*/}
                <Grid item xs={6} md={4}>
                    <FriendsBar/>
                </Grid>

                {/*----- Showing current user posts ----*/}
                <Grid item xs={8} md={8}>
                    {showCurrentUserPosts(props.currentUserPosts ? props.currentUserPosts : null)}
                </Grid>

                {/*---- BirthDate Section ----*/}
                <Grid item xs={6} md={4}>
                    <SuggestedFollows />
                    <Birthdate birthdata={userInfo.birthdate}/>
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

export default connect(mapStateToProps)(ProfileOwn);
