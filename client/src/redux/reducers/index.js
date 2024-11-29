import { combineReducers } from 'redux';
import { UserReducer } from './userReducer';
import { PostReducer } from './postReducer';
import { SettingsReducer } from './settingsReducer';
import { CommentReducer } from './commentReducer';
import { ErrorReducer } from './errorReducer';

const rootReducer = combineReducers({
    User: UserReducer,
    Post: PostReducer,
    Settings: SettingsReducer,
    Comment: CommentReducer,
    Error: ErrorReducer
});

export default rootReducer;
