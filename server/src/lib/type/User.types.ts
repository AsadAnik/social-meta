export type UserType = {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

interface IUser extends UserType {
    bio?: string;
    profilePhoto?: string;
    coverPhoto?: string;
    birthdate?: string;
    title?: string;
    themeMode?: string;
    colorMode?: string;
}

export default IUser;
