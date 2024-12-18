/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { LogBox } from 'react-native';

// Suppress the specific warning
LogBox.ignoreLogs(['Support for defaultProps will be removed']);


AppRegistry.registerComponent(appName, () => App);
