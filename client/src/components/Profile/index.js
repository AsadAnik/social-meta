import React from 'react';
import { connect } from 'react-redux';
import { Grid, Container } from '@mui/material';
import ProfileHead from './profileHead';
import PostHead from '../commons/postHead';
import PostCard from '../commons/PostCard';
import SuggestedFollows from "../commons/SuggestedFollows";
import { currentUserPosts } from '../../redux/actions/PostActions';
import NotFound from "../widgets/NotFound";

const notFoundColor = 'gray';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        // dispatched action here..
        this.props.dispatch(currentUserPosts());
    }

    // show current User Posts
    showCurrentUserPosts = (Posts) => {
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
            <Grid key={post._id} item xs={6} md={8}>
                <PostCard
                    postType="PROFILE"
                    postId={post._id}
                    ownerId={post.ownerId}
                    postBody={post.body}
                    postImage={post.image}
                    createdAt={post.createdAt}
                />
            </Grid>
        ));
    }

    // rendering method..
    render() {
        // console.log('profile indexed outputted here -->> ', this.props);

        return (
            <Container>
                <Grid container spacing={2}>
                    {/*---- Profile Head showing here ----*/}
                    <Grid item xs={8} md={12}>
                        <ProfileHead />
                    </Grid>

                    {/*---- Post creating head here ----*/}
                    <Grid item xs={6} md={8}>
                        <PostHead />
                    </Grid>

                    {/*---- Suggested followers showing here ----*/}
                    <Grid item xs={6} md={4}>
                       <SuggestedFollows />
                    </Grid>

                    {/*----- Showing current user posts ----*/}
                    {this.showCurrentUserPosts(this.props.currentUserPosts ? this.props.currentUserPosts : null)}
                </Grid>
            </Container>
        );
    }
}

// mapStateToProps Function..
const mapStateToProps = (state) => {
    return {...state.Post};
};

export default connect(mapStateToProps)(Profile);
