export interface IUser {
    _id: string;
    email: string;
    firstname: string;
    lastname: string;
    title: string;
    profilePhoto?: string;
    themeMode?: string;
    colorMode?: string;
}