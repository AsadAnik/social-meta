import { User } from '../models';

class UserService {
    private readonly userModelRepository: typeof User;

    constructor(userModel_repository: typeof User = User) {
        this.userModelRepository = userModel_repository;
    }

    /**
     * UPDATE USER INFORMATIONS
     * Find user by Id and then update informations
     * @param userId
     * @param userInfo
     * @returns
     */
    // region Update User-Info
    public async updateUserInfo(userId: string, userInfo: any) {
        try {
            const updatedUser = await this.userModelRepository.findByIdAndUpdate(userId, userInfo);
            if (!updatedUser) throw new Error('Error while try to update user info.');
            return updatedUser;

        } catch (error) {
            console.error(`Error occured while update user info: ${error}`);
        }
    }

    /**
     * FIND USER BY USER_ID
     * Finds a user by their ID.
     * @param userId
     */
    // region Find User By ID
    public async findUser(userId: string): Promise<any> {
        try {
            const user = await this.userModelRepository.findById(userId).select('-password');
            return user;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    }

    /**
     * GET FOLLOW SUGGESTED USERS
     * Get follow suggested users
     * @returns
     */
    // region Get Follow Suggested
    public async getFollowSuggestedUsers(): Promise<unknown> {
        try {
            const followSuggestedUsers = await this.userModelRepository.find({}).select('_id firstname lastname email title profilePhoto');
            return followSuggestedUsers;

        } catch (error) {
            console.error(`Error occured while get follow suggested users: ${error}`);
            throw error;
        }
    }
}

export default UserService;