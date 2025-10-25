// region FollowButton Type
export type FollowButtonType = {
    title: string;
    size: number;
    onPress?: () => void;
    children?: any
};

// region Button Type
export type ButtonType = {
    title: string;
    bgColor?: string;
    size?: number;
    textColor?: string;
    width?: number;
    height?: number;
    onPress?: (event: any) => void;
    children?: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
};

// region IconButton Type
export type IconButtonType = {
  title: string;
  isLoading: boolean;
  onPress: (event: any) => void;
  bgColor?: string;
  iconName?: string;
};

// region RootStackParamList
export type RootStackParamList = {
    UploadProfile: undefined;
    MainTabs: undefined;
    // Add other routes as needed
};
