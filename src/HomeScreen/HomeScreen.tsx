import React, {useCallback, useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import Screen from '../components/Screen';
import AuthContext from '../components/AuthContext';
import {Colors} from '../modules/Colors';

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
});

export default function HomeScreen() {
    const {user: me} = useContext(AuthContext);

    const onPressLogout = useCallback(() => {
        auth().signOut();
    }, []);

    if (me === null) return null;

    return (
        <Screen title="홈">
            <View style={styles.container}>
                <View>
                    <Text style={styles.sectionTitleText}>나의 정보</Text>

                    <View style={styles.userSectionContext}>
                        <View style={styles.myProfile}>
                            <Text style={styles.myNameText}>{me.name}</Text>
                            <Text style={styles.myEmailText}>{me.email}</Text>
                        </View>

                        <TouchableOpacity onPress={onPressLogout}>
                            <Text style={styles.logoutText}>로그아웃</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Screen>
    );
}
