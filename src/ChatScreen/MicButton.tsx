import React, {useCallback, useRef, useState} from 'react';
import {
    StyleSheet,
    Platform,
    PermissionsAndroid,
    TouchableOpacity,
} from 'react-native';
import AudioRecorderPlayer, {
    AVEncodingOption,
    AudioEncoderAndroidType,
} from 'react-native-audio-recorder-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../modules/Colors';

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: Colors.BLACK,
        borderRadius: 8,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micIcon: {
        color: Colors.BLACK,
        fontSize: 32,
    },
    stopIcon: {
        color: Colors.RED,
        fontSize: 32,
    },
});

interface MicButtonProps {
    onRecorded: (path: string) => void;
}

export default function MicButton({onRecorded}: MicButtonProps) {
    const [recording, setRecording] = useState(false);
    const autdioRecorderPlayerRef = useRef(new AudioRecorderPlayer());
    const startRecord = useCallback(async () => {
        if (Platform.OS === 'android') {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);

            const granted =
                grants[
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                ] === PermissionsAndroid.RESULTS.GRANTED &&
                grants[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
                    PermissionsAndroid.RESULTS.GRANTED;

            if (!granted) {
                return;
            }
        }

        await autdioRecorderPlayerRef.current.startRecorder(undefined, {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        });
        autdioRecorderPlayerRef.current.addRecordBackListener(() => {});
        setRecording(true);
    }, []);

    const stopRecord = useCallback(async () => {
        const uri = await autdioRecorderPlayerRef.current.stopRecorder();
        autdioRecorderPlayerRef.current.removeRecordBackListener();
        setRecording(false);
        onRecorded(uri);
    }, [onRecorded]);

    if (recording) {
        return (
            <TouchableOpacity style={styles.button} onPress={stopRecord}>
                <MaterialIcons name="stop" style={styles.stopIcon} />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.button} onPress={startRecord}>
            <MaterialIcons name="mic" style={styles.micIcon} />
        </TouchableOpacity>
    );
}
