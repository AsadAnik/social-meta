import { z } from 'zod';

class UserSchema {
    // region REGISTRATION VALIDATION
    static get registrationSchema() {
        return z.object({
            firstname: z.string(),
            lastname: z.string(),
            email: z.string().email(),
            password: z.string().min(7),
            bio: z.string(),
            birthdate: z.string(),
            title: z.string()
        });
    }

    // region LODIN VALIDATION
    static get loginSchema() {
        return z.object({
            email: z.string().email(),
            password: z.string().min(7),
        });
    }
}

export default UserSchema;