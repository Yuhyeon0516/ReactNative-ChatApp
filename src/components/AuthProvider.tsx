import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Collections, User} from '../types';
import AuthContext from './AuthContext';

function AuthProvider({children}: {children: React.ReactNode}) {
    const [initialized, setInitialized] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [processingSignup, setProcessingSignup] = useState(false);

    useEffect(() => {
        const unsubsribe = auth().onUserChanged(async fbUser => {
            if (fbUser) {
                // login
                setUser({
                    userId: fbUser.uid,
                    email: fbUser.email ?? '',
                    name: fbUser.displayName ?? '',
                });
            } else {
                // logout
                setUser(null);
            }

            setInitialized(true);
        });

        return () => {
            unsubsribe();
        };
    }, []);

    const signup = useCallback(
        async (email: string, password: string, name: string) => {
            setProcessingSignup(true);

            try {
                const {user: currentUser} =
                    await auth().createUserWithEmailAndPassword(
                        email,
                        password,
                    );
                await currentUser.updateProfile({displayName: name});
                await firestore()
                    .collection(Collections.USERS)
                    .doc(currentUser.uid)
                    .set({userId: currentUser.uid, email, name});
            } catch (error) {
                console.log(error);
            } finally {
                setProcessingSignup(false);
            }
        },
        [],
    );

    const value = useMemo(() => {
        return {
            initialized,
            user,
            signup,
            processingSignup,
        };
    }, [initialized, processingSignup, signup, user]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export default AuthProvider;
