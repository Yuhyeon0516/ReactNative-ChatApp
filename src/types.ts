export type RootStackParamList = {
    Signup: undefined;
    Signin: undefined;
};

export interface User {
    userId: string;
    email: string;
    name: string;
}

export interface AuthContextProp {
    initialized: boolean;
    user: User | null;
    signup: (email: string, password: string, name: string) => void;
    processingSignup: boolean;
}

export enum Collections {
    USERS = 'users',
}
