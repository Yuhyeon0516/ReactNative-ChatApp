import React, {useCallback, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import AudioRecorderPlayer, {
    AVEncodingOption,
    AudioEncoderAndroidType,
} from 'react-native-audio-recorder-player';

const styles = StyleSheet.create({});

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

    return (
        <View>
            <Text>MicButton</Text>
        </View>
    );
}
