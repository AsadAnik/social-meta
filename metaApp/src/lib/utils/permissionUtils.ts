import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

// Define permission types
export type MediaPermissionType = 'photo' | 'video' | 'camera';


/**
 * Get the appropriate permission for the platform and media type
 * @param type - The type of media permission to get
 * @returns The appropriate permission for the platform and media type
 */
// region Get Permission
const getPermission = (type: MediaPermissionType): Permission => {
    if (Platform.OS === 'ios') {
        switch (type) {
            case 'photo':
            case 'video':
                return PERMISSIONS.IOS.PHOTO_LIBRARY;
            case 'camera':
                return PERMISSIONS.IOS.CAMERA;
            default:
                return PERMISSIONS.IOS.PHOTO_LIBRARY;
        }
    } else {
        // Android permissions
        const androidVersion = parseInt(Platform.Version.toString(), 10);
        if (androidVersion >= 33) {
            // Android 13+ uses granular permissions
            switch (type) {
                case 'photo':
                    return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
                case 'video':
                    return PERMISSIONS.ANDROID.READ_MEDIA_VIDEO;
                case 'camera':
                    return PERMISSIONS.ANDROID.CAMERA;
                default:
                    return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
            }
        } else {
            // Android 12 and below
            switch (type) {
                case 'photo':
                case 'video':
                    return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
                case 'camera':
                    return PERMISSIONS.ANDROID.CAMERA;
                default:
                    return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
            }
        }
    }
};


/**
 * Check if permission is granted
 * @param type - The type of media permission to check
 * @returns True if permission is granted, false otherwise
 */
// region Check Permission
export const checkMediaPermission = async (type: MediaPermissionType): Promise<boolean> => {
    try {
        const permission = getPermission(type);
        const result = await check(permission);

        return result === RESULTS.GRANTED;
    } catch (error) {
        console.error('Error checking permission:', error);
        return false;
    }
};


/**
 * Request permission
 * @param type - The type of media permission to request
 * @returns True if permission is granted, false otherwise
 */
// region Request Permission
export const requestMediaPermission = async (type: MediaPermissionType): Promise<boolean> => {
    try {
        const permission = getPermission(type);
        const result = await request(permission);

        return result === RESULTS.GRANTED;
    } catch (error) {
        console.error('Error requesting permission:', error);
        return false;
    }
};


/**
 * Check and request permission with user-friendly messaging
 * @param type - The type of media permission to check and request
 * @param onSuccess - The function to call if permission is granted
 * @param onFailure - The function to call if permission is denied
 * @returns True if permission is granted, false otherwise
 */
// region Ensure Permission
export const ensureMediaPermission = async (type: MediaPermissionType, onSuccess?: () => void, onFailure?: () => void): Promise<boolean> => {
    try {
        // First check if permission is already granted
        const hasPermission = await checkMediaPermission(type);

        if (hasPermission) {
            onSuccess?.();
            return true;
        }

        // Request permission
        const granted = await requestMediaPermission(type);

        if (granted) {
            onSuccess?.();
            return true;
        } else {
            // Permission denied - show alert with option to open settings
            Alert.alert(
                'Permission Required',
                `This app needs access to your ${type === 'photo' ? 'photos' : type === 'video' ? 'videos' : 'camera'} to function properly. Please grant permission in Settings.`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: onFailure,
                    },
                    {
                        text: 'Open Settings',
                        onPress: () => {
                            Linking.openSettings();
                            onFailure?.();
                        },
                    },
                ]
            );
            return false;
        }
    } catch (error) {
        console.error('Error ensuring permission:', error);
        onFailure?.();
        return false;
    }
};


/**
 * Check multiple permissions at once
 * @param types - The types of media permissions to check
 * @returns True if all permissions are granted, false otherwise
 */
// region Check Multiple Permissions
export const checkMultipleMediaPermissions = async (types: MediaPermissionType[]): Promise<boolean> => {
    try {
        const permissionChecks = await Promise.all(
            types.map(type => checkMediaPermission(type))
        );

        return permissionChecks.every(hasPermission => hasPermission);
    } catch (error) {
        console.error('Error checking multiple permissions:', error);
        return false;
    }
};


/**
 * Request multiple permissions at once
 * @param types - The types of media permissions to request
 * @returns True if all permissions are granted, false otherwise
 */
// region Request Multiple Permissions
export const requestMultipleMediaPermissions = async (types: MediaPermissionType[]): Promise<boolean> => {
    try {
        const permissionRequests = await Promise.all(
            types.map(type => requestMediaPermission(type))
        );

        return permissionRequests.every(granted => granted);
    } catch (error) {
        console.error('Error requesting multiple permissions:', error);
        return false;
    }
};
