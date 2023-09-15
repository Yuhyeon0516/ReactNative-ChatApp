import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Screen from '../components/Screen';
import AuthContext from '../components/AuthContext';
import {Colors} from '../modules/Colors';
import {Collections, RootStackParamList, User} from '../types';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import Profile from './Profile';
import UserPhoto from '../components/UserPhoto';
import messaging from '@react-native-firebase/messaging';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sectionTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.BLACK,
        marginBottom: 10,
    },
    userSectionContext: {
        backgroundColor: Colors.BLACK,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    myProfile: {
        flex: 1,
    },
    myNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.WHITE,
    },
    myEmailText: {
        fontSize: 14,
        color: Colors.WHITE,
        marginTop: 4,
    },
    logoutText: {
        fontSize: 14,
        color: Colors.WHITE,
    },
    userListSection: {
        flex: 1,
        marginTop: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userList: {
        flex: 1,
    },
    userListItem: {
        backgroundColor: Colors.LIGHT_GRAY,
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    otherNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    otherEmailText: {
        fontSize: 14,
        color: Colors.BLACK,
        marginTop: 4,
    },
    separator: {
        height: 10,
    },
    emptyText: {
        color: Colors.BLACK,
    },
    profile: {
        marginRight: 10,
    },
    userPhoto: {
        marginRight: 10,
    },
    photoNameText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default function HomeScreen() {
    const {user: me, updateProfileImage} = useContext(AuthContext);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const onPressLogout = useCallback(() => {
        auth().signOut();
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            setLoadingUsers(true);
            const snapshot = await firestore()
                .collection(Collections.USERS)
                .get();
            setUsers(
                snapshot.docs
                    .map(doc => doc.data() as User)
                    .filter(user => user.userId !== me?.userId),
            );
        } finally {
            setLoadingUsers(false);
        }
    }, [me?.userId]);

    const onPressProfile = useCallback(async () => {
        const image = await ImageCropPicker.openPicker({
            cropping: true,
            cropperCircleOverlay: true,
        });

        await updateProfileImage(image.path);
    }, [updateProfileImage]);

    const renderLoading = useCallback(
        () => (
            <View style={styles.loadingContainer}>
                <ActivityIndicator />
            </View>
        ),
        [],
    );

    // 1. 앱이 백그라운드에 있을때.

    useEffect(() => {
        const unsubscribe = messaging().onNotificationOpenedApp(
            remoteMessage => {
                console.log(remoteMessage);
                const stringifiedUserIds = remoteMessage.data?.userIds;

                if (stringifiedUserIds != null) {
                    const userIds = JSON.parse(stringifiedUserIds) as string[];
                    navigation.navigate('Chat', {userIds});
                }
            },
        );

        return () => {
            unsubscribe();
        };
    }, [navigation]);

    // 2. 앱이 종료 된 상태일때.

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    if (me === null) return null;

    return (
        <Screen title="홈">
            <View style={styles.container}>
                <View>
                    <Text style={styles.sectionTitleText}>나의 정보</Text>

                    <View style={styles.userSectionContext}>
                        <Profile
                            style={styles.profile}
                            onPress={onPressProfile}
                            imageUrl={me.profileUrl}
                        />
                        <View style={styles.myProfile}>
                            <Text style={styles.myNameText}>{me.name}</Text>
                            <Text style={styles.myEmailText}>{me.email}</Text>
                        </View>

                        <TouchableOpacity onPress={onPressLogout}>
                            <Text style={styles.logoutText}>로그아웃</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.userListSection}>
                    {loadingUsers ? (
                        renderLoading()
                    ) : (
                        <>
                            <Text style={styles.sectionTitleText}>
                                다른 사용자와 대화해보세요!
                            </Text>

                            <FlatList
                                style={styles.userList}
                                data={users}
                                renderItem={({item: user}) => (
                                    <TouchableOpacity
                                        style={styles.userListItem}
                                        onPress={() => {
                                            navigation.navigate('Chat', {
                                                userIds: [
                                                    me.userId,
                                                    user.userId,
                                                ],
                                            });
                                        }}>
                                        <UserPhoto
                                            style={styles.userPhoto}
                                            imageUrl={user.profileUrl}
                                            name={user.name}
                                            nameStyle={styles.photoNameText}
                                        />
                                        <View>
                                            <Text style={styles.otherNameText}>
                                                {user.name}
                                            </Text>
                                            <Text style={styles.otherEmailText}>
                                                {user.email}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => (
                                    <View style={styles.separator} />
                                )}
                                ListEmptyComponent={() => (
                                    <Text style={styles.emptyText}>
                                        사용자가 없습니다.
                                    </Text>
                                )}
                            />
                        </>
                    )}
                </View>
            </View>
        </Screen>
    );
}
