import React, {useMemo} from 'react';
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TouchableOpacity,
    Image,
    ImageStyle,
    TextStyle,
    Text,
} from 'react-native';
import {Colors} from '../modules/Colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.GRAY,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface ProfileProps {
    size?: number;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    imageUrl?: string;
    text?: string;
    textStyle?: StyleProp<TextStyle>;
}

export default function Profile({
    size = 48,
    style: containerStyleProp,
    onPress,
    imageUrl,
    text,
    textStyle,
}: ProfileProps) {
    const containerStyle = useMemo<StyleProp<ViewStyle>>(() => {
        return [
            styles.container,
            {width: size, height: size, borderRadius: size / 2},
            containerStyleProp,
        ];
    }, [containerStyleProp, size]);

    const imageStyle = useMemo<StyleProp<ImageStyle>>(() => {
        return {
            width: size,
            height: size,
        };
    }, [size]);

    return (
        <TouchableOpacity disabled={onPress == null} onPress={onPress}>
            <View style={containerStyle}>
                {imageUrl ? (
                    <Image style={imageStyle} source={{uri: imageUrl}} />
                ) : text ? (
                    <Text style={textStyle}>{text}</Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );
}
