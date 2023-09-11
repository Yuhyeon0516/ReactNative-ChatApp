import {createContext} from 'react';
import {AuthContextProp} from '../types';

const AuthContext = createContext<AuthContextProp>({
    initialized: false,
    user: null,
    signup: async () => {},
    processingSignup: false,
});

export default AuthContext;
