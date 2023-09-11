module.exports = {
    root: true,
    extends: ['@react-native', 'prettier'],
    rules: {
        'react-native/no-inline-styles': 0,
        'prettier/prettier': [
            'error',
            {
                'no-inline-styles': false,
            },
        ],
    },
};
