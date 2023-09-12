import React, {useCallback} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Colors} from '../modules/Colors';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 48,
        flexDirection: 'row',
    },
    left: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    right: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    body: {
        flex: 1,
    },
    backButtonText: {
        fontSize: 12,
        color: Colors.BLACK,
    },
});

interface ScreenProps {
    title?: string;
    children?: React.ReactNode;
}

export default function Screen({children, title}: ScreenProps) {
    const navigation = useNavigation();
    const onPressBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.left}>
                    {navigation.canGoBack() && (
                        <TouchableOpacity onPress={onPressBackButton}>
                            <Text style={styles.backButtonText}>{'Back'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.center}>
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>
                <View style={styles.right} />
            </View>

            <View style={styles.body}>{children}</View>
        </SafeAreaView>
    );
}
