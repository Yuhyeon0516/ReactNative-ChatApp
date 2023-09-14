import {useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {RESULTS, requestNotifications} from 'react-native-permissions';

export default function usePushNotification() {
    const requestPermission = useCallback(async () => {
        const {status} = await requestNotifications([]);
        const enabled = status === RESULTS.GRANTED;

        if (!enabled) {
            Alert.alert('알림 권한을 허용해주세요.');
        }
    }, []);

    useEffect(() => {
        requestPermission();
    }, [requestPermission]);
}
