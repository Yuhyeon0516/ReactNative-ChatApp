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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
    backButtonIcon: {
        color: Colors.BLACK,
        fontSize: 20,
        marginLeft: 20,
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
                            <MaterialIcons
                                name="arrow-back"
                                style={styles.backButtonIcon}
                            />
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
