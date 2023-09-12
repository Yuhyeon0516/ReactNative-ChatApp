import React, {useCallback} from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Screen from '../components/Screen';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import useChat from './useChat';
import {Colors} from '../modules/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatContainer: {
        flex: 1,
        padding: 20,
    },
    membersSection: {},
    membersTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.BLACK,
        marginBottom: 8,
    },
    userProfile: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: Colors.BLACK,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userProfileText: {
        color: Colors.WHITE,
    },
    separator: {
        width: 5,
    },
});

export default function ChatScreen() {
    const {params} = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
    const {loadingChat, chat} = useChat(params.userIds);

    const renderChat = useCallback(() => {
        if (chat === null) return null;
        return (
            <View style={styles.chatContainer}>
                <View style={styles.membersSection}>
                    <Text style={styles.membersTitleText}>대화상대</Text>
                    <FlatList
                        data={chat.users}
                        horizontal
                        renderItem={({item: user}) => (
                            <View style={styles.userProfile}>
                                <Text style={styles.userProfileText}>
                                    {user.name[0]}
                                </Text>
                            </View>
                        )}
                        ItemSeparatorComponent={() => (
                            <View style={styles.separator} />
                        )}
                    />
                </View>
            </View>
        );
    }, [chat]);

    return (
        <Screen title={params.other.name}>
            <View style={styles.container}>
                {loadingChat ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator />
                    </View>
                ) : (
                    renderChat()
                )}
            </View>
        </Screen>
    );
}
