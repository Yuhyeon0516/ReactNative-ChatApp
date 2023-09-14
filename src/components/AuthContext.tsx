import {createContext} from 'react';
import {AuthContextProp} from '../types';

const AuthContext = createContext<AuthContextProp>({
    initialized: false,
    user: null,
    signup: async () => {},
    processingSignup: false,
    signin: async () => {},
    processingSignin: false,
    updateProfileImage: async () => {},
    addFcmToken: async () => {},
});

export default AuthContext;
