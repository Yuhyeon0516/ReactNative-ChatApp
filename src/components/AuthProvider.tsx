import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Collections, User} from '../types';
import AuthContext from './AuthContext';
import _ from 'lodash';
import storage from '@react-native-firebase/storage';

function AuthProvider({children}: {children: React.ReactNode}) {
    const [initialized, setInitialized] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [processingSignup, setProcessingSignup] = useState(false);
    const [processingSignin, setProcessingSignin] = useState(false);

    useEffect(() => {
        const unsubsribe = auth().onUserChanged(async fbUser => {
            if (fbUser) {
                // login
                setUser({
                    userId: fbUser.uid,
                    email: fbUser.email ?? '',
                    name: fbUser.displayName ?? '',
                    profileUrl: fbUser.photoURL ?? '',
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
            } finally {
                setProcessingSignup(false);
            }
        },
        [],
    );

    const signin = useCallback(async (email: string, password: string) => {
        setProcessingSignin(true);

        try {
            await auth().signInWithEmailAndPassword(email, password);
        } finally {
            setProcessingSignin(false);
        }
    }, []);

    const updateProfileImage = useCallback(
        async (filepath: string) => {
            if (!user) {
                throw new Error('User is undefined');
            }
            const filename = _.last(filepath.split('/'));

            if (!filename) {
                throw new Error('Filename is undefined');
            }

            const storageFilePath = `users/${user.userId}/${filename}`;
            await storage().ref(storageFilePath).putFile(filepath);
            const url = await storage().ref(storageFilePath).getDownloadURL();
            await auth().currentUser?.updateProfile({photoURL: url});

            await firestore()
                .collection(Collections.USERS)
                .doc(user.userId)
                .update({
                    profileUrl: url,
                });
            // TODO: Register image on user profile
        },
        [user],
    );

    const addFcmToken = useCallback(
        async (token: string) => {
            if (user != null) {
                await firestore()
                    .collection(Collections.USERS)
                    .doc(user?.userId)
                    .update({
                        fcmToekns: firestore.FieldValue.arrayUnion(token),
                    });
            }
        },
        [user],
    );

    const value = useMemo(() => {
        return {
            initialized,
            user,
            signup,
            processingSignup,
            signin,
            processingSignin,
            updateProfileImage,
            addFcmToken,
        };
    }, [
        initialized,
        processingSignin,
        processingSignup,
        signin,
        signup,
        updateProfileImage,
        user,
        addFcmToken,
    ]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export default AuthProvider;
