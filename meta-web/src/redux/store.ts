import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authAPISlice, authSliceReducer } from './slice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { postsApi } from './slice/post.slice';
import postReducer from './slice/post.slice'
import notificationReducer from './slice/notificationSlice';
import commnetReducer, { commentsApi } from './slice/comment.slice';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authSliceReducer,
  posts: postReducer,
  notifications: notificationReducer,
  comments: commnetReducer,
  [authAPISlice.reducerPath]: authAPISlice.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authAPISlice.middleware, postsApi.middleware, commentsApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
