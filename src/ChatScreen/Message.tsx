import moment from 'moment';
import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../modules/Colors';
import UserPhoto from '../components/UserPhoto';

interface MessageProps {
    name: string;
    text: string;
    createdAt: Date;
    isOtherMessage: boolean;
    imageUrl?: string;
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end',
        flex: 1,
    },
    nameText: {
        fontSize: 12,
        color: Colors.GRAY,
        marginBottom: 4,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    timeText: {
        fontSize: 12,
        color: Colors.GRAY,
        marginRight: 4,
    },
    bubble: {
        backgroundColor: Colors.BLACK,
        borderRadius: 12,
        padding: 12,
        flexShrink: 1,
    },
    messageText: {
        fontSize: 14,
        color: Colors.WHITE,
    },
    root: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userPhoto: {
        marginRight: 4,
    },
    photoNameText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const otherMessageStyles = {
    container: [styles.container, {alignItems: 'flex-start' as const}],
    bubble: [styles.bubble, {backgroundColor: Colors.LIGHT_GRAY}],
    messageText: [styles.messageText, {color: Colors.BLACK}],
    timeText: [styles.timeText, {marginRight: 0, marginLeft: 4}],
};

export default function Message({
    name,
    text,
    createdAt,
    isOtherMessage,
    imageUrl,
}: MessageProps) {
    const messageStyles = isOtherMessage ? otherMessageStyles : styles;
    const renderMessageContainer = useCallback(() => {
        const components = [
            <Text key={'timeText'} style={messageStyles.timeText}>
                {moment(createdAt).format('HH:mm')}
            </Text>,
            <View key={'message'} style={messageStyles.bubble}>
                <Text style={messageStyles.messageText}>{text}</Text>
            </View>,
        ];
        return isOtherMessage ? components.reverse() : components;
    }, [createdAt, isOtherMessage, messageStyles, text]);

    return (
        <View style={styles.root}>
            {isOtherMessage && (
                <UserPhoto
                    style={styles.userPhoto}
                    imageUrl={imageUrl}
                    name={name}
                    nameStyle={styles.photoNameText}
                    size={48}
                />
            )}
            <View style={messageStyles.container}>
                <Text style={styles.nameText}>{name}</Text>
                <View style={styles.messageContainer}>
                    {renderMessageContainer()}
                </View>
            </View>
        </View>
    );
}
