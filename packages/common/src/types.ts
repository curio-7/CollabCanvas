import {z} from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().min(1).max(50),
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(50),
});

export const SignInSchema = z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(50),
});

export const CreateRoomSchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().min(1).max(200).optional(),
});




