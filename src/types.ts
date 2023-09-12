export type RootStackParamList = {
    Signup: undefined;
    Signin: undefined;
    Home: undefined;
    Loading: undefined;
    Chat: {
        userIds: string[];
        other: User;
    };
};

export interface User {
    userId: string;
    email: string;
    name: string;
}

export interface AuthContextProp {
    initialized: boolean;
    user: User | null;
    signup: (email: string, password: string, name: string) => Promise<void>;
    processingSignup: boolean;
    signin: (email: string, password: string) => Promise<void>;
    processingSignin: boolean;
}

export enum Collections {
    USERS = 'users',
    CHATS = 'chats',
}

export interface Chat {
    id: string;
    userIds: string[];
    users: User[];
}
