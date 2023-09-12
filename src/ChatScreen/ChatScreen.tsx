import React, {useCallback, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
    messageList: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInputContainer: {
        flex: 1,
        marginRight: 10,
        borderRadius: 24,
        borderColor: Colors.BLACK,
        borderWidth: 1,
        overflow: 'hidden',
        padding: 10,
        minHeight: 50,
        justifyContent: 'center',
    },
    textInput: {
        paddingVertical: 0,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BLACK,
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    sendIcon: {
        color: Colors.WHITE,
        fontSize: 18,
    },
});

const disableSendButtonStyle = [
    styles.sendButton,
    {backgroundColor: Colors.GRAY},
];

export default function ChatScreen() {
    const {params} = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
    const {loadingChat, chat} = useChat(params.userIds);
    const [text, setText] = useState('');
    const sendDisabled = useMemo(() => text.length === 0, [text.length]);

    const onChagneText = useCallback((newText: string) => {
        setText(newText);
    }, []);

    const onPressSendButton = useCallback(() => {
        // TODO: send text
        setText('');
    }, []);

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

                <View style={styles.messageList} />
                <View style={styles.inputContainer}>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            multiline
                            style={styles.textInput}
                            value={text}
                            onChangeText={onChagneText}
                        />
                    </View>

                    <TouchableOpacity
                        style={
                            sendDisabled
                                ? disableSendButtonStyle
                                : styles.sendButton
                        }
                        onPress={onPressSendButton}
                        disabled={sendDisabled}>
                        <MaterialIcons name="send" style={styles.sendIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, [chat, onChagneText, onPressSendButton, sendDisabled, text]);

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
