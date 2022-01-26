import React from 'react';
import { Grid, Paper, Container } from '@mui/material';
import PostHead from '../commons/postHead';
import PostCard from '../commons/PostCard';
import SuggestedFollows from "../commons/SuggestedFollows";
import { connect } from 'react-redux';
import { readAllPosts } from '../../redux/actions/PostActions';
import NotFound from "../widgets/NotFound";

const notFoundColor = 'gray';

class Home extends React.Component{
    constructor(props) {
        super(props);
        // dispatched action here..
        this.props.dispatch(readAllPosts());
    }

    // show current User Posts
    showAllPosts = (Posts) => {
        if (Posts === null){
            return (
                <Grid item xs={6} md={8}>
                    <NotFound
                        msg={"Post Not Found!"}
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
                        msg={"Post Not Found!"}
                        color={notFoundColor}
                        size={100}
                    />
                </Grid>
            );
        }

        return Posts.length && Posts.map((post) => (
            <Grid key={post._id} item xs={6} md={8}>
                <PostCard
                    ownerId={post.ownerId}
                    postBody={post.body}
                    postImage={post.image}
                    createdAt={post.createdAt}
                />
            </Grid>
        ));
    }

    render() {
        // console.log(this.props.Posts);

        return (
            <>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={8}>
                            <Paper>
                                <PostHead />
                            </Paper>
                        </Grid>

                        <Grid item xs={6} md={4}>
                            <SuggestedFollows />
                        </Grid>

                        {/*----- Showing all posts ----*/}
                        {this.showAllPosts(this.props.allPosts ? this.props.allPosts : null)}
                    </Grid>
                </Container>
            </>
        );
    }
}

// mapStateToProps Function..
const mapStateToProps = (state) => {
    return {...state.Post};
};

export default connect(mapStateToProps)(Home);
