import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../HOC/layout';
import PrivateRoute from './PrivateRouter';

import Home from '../components/Home';
import Profile from '../components/Profile/ProfileOwn';
import Login from '../components/Auth/login';
import Register from '../components/Auth/register';
import ProfileOthers from '../components/Profile/ProfileOthers';
import Post from '../components/Post';
import Messenger from '../components/Messenger'
import Notifications from '../components/Notifications/Notifications';

// Router..
const Router = () => {
    return (
        <Layout>
            <Routes>
                {/*---- Home.. ----*/}
                <Route path={'/'} exact element={ <PrivateRoute restrictionLoading={true} /> }>
                    <Route path={'/'} exact element={ <Home /> } />
                </Route>

                {/*---- Profile ----*/}
                <Route path={'/profile'} exact element={ <PrivateRoute restrictionLoading={true} /> }>
                    <Route path={'/profile'} exact element={ <Profile /> } />
                </Route>

                {/*---- Login.. ----*/}
                <Route path={'/login'} exact element={ <PrivateRoute restrictionLoading={false} /> }>
                    <Route path={'/login'} exact element={ <Login /> } />
                </Route>

                {/*---- Register.. ----*/}
                <Route path={'/register'} exact element={ <PrivateRoute restrictionLoading={false} /> }>
                    <Route path={'/register'} exact element={ <Register /> } />
                </Route>

                {/* Temporary Route here */}
                {/* <Route path={'/temporary'} exact element={<Temporary />} /> */}

                {/*---- ProfileOthers means userById ----*/}
                <Route path={'/profile-others/:userId'} exact element={ <PrivateRoute restrictionLoading={true} /> }>
                    <Route path={'/profile-others/:userId'} exact element={ <ProfileOthers /> } />
                </Route>

                {/*---- Specefic Post to See ----*/}
                <Route path={'/post/:postId'} exact element={ <PrivateRoute restrictionLoading={false} /> }>
                    <Route path={'/post/:postId'} exact element={ <Post /> } />
                </Route>

                {/* ---- Messenger Page ---- */}
                <Route path={'/messenger'} exact element={ <PrivateRoute restrictionLoading={true} /> } >
                    <Route path={'/messenger'} exact element={ <Messenger/> } />
                </Route>

                {/* ---- Messenger Page ---- */}
                <Route path={'/notification'} exact element={ <PrivateRoute restrictionLoading={true} /> } >
                    <Route path={'/notification'} exact element={ <Notifications/> } />
                </Route>
            </Routes>
        </Layout>
    );
};

export default Router;
