import React, {useCallback, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../modules/Colors';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 24,
        color: Colors.WHITE,
    },
    timeText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.WHITE,
        minWidth: 52,
        textAlign: 'center',
    },
});

const otherMessageStyles = {
    icon: [styles.icon, {color: Colors.BLACK}],
    timeText: [styles.timeText, {color: Colors.BLACK}],
};

interface AudioMessageProps {
    url: string;
    isOtherMessage: boolean;
}

export default function AudioMessage({url, isOtherMessage}: AudioMessageProps) {
    const messageStyle = isOtherMessage ? otherMessageStyles : styles;
    const [playing, setPlaying] = useState(false);
    const [remainingTimeinMs, setRemainingTimeinMs] = useState(0);
    const audioPlayerRef = useRef(new AudioRecorderPlayer());

    const stopPlay = useCallback(async () => {
        await audioPlayerRef.current.stopPlayer();
        setPlaying(false);
        audioPlayerRef.current.removePlayBackListener();
    }, []);

    const startPlay = useCallback(async () => {
        await audioPlayerRef.current.startPlayer(url);
        setPlaying(true);
        audioPlayerRef.current.addPlayBackListener(e => {
            const timeInMs = e.duration - e.currentPosition;
            setRemainingTimeinMs(timeInMs);

            if (timeInMs === 0) {
                stopPlay();
            }
        });
    }, [stopPlay, url]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={playing ? stopPlay : startPlay}>
                <MaterialIcons
                    name={playing ? 'stop' : 'play-arrow'}
                    style={messageStyle.icon}
                />
            </TouchableOpacity>

            <Text style={messageStyle.timeText}>
                {audioPlayerRef.current.mmss(
                    Math.floor(remainingTimeinMs / 1000),
                )}
            </Text>
        </View>
    );
}
