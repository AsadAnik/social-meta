import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSliceReducer, { authAPI } from './slice/auth.slice';
import postSliceReducer, { postAPI } from './slice/post.slice';

// region Persist-Config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Persist the auth state only
};

// region Reducers
const rootReducer = combineReducers({
  auth: authSliceReducer,
  post: postSliceReducer,
  [authAPI.reducerPath]: authAPI.reducer,
  [postAPI.reducerPath]: postAPI.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// region Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }).concat(authAPI.middleware, postAPI.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
