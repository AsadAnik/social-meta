import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSliceReducer, { authAPISlice } from "./slice/auth.slice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import postReducer, { postsApi } from './slice/post.slice';
import notificationReducer from './slice/notificationSlice';
import commnetReducer, { commentsApi } from './slice/comment.slice';
import userReducer, { usersApi } from './slice/user.slice'; // Import userReducer

// region ROOT-REDUCER
const rootReducer = combineReducers({
    auth: authSliceReducer,
    user: userReducer, // Add user reducer
    posts: postReducer,
    notifications: notificationReducer,
    comments: commnetReducer,
    [authAPISlice.reducerPath]: authAPISlice.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
});

// region PERSIST-CONFIG
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'user'], // Add 'user' to the persist whitelist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// region STORE
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            authAPISlice.middleware,
            postsApi.middleware,
            commentsApi.middleware,
            usersApi.middleware
        ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
