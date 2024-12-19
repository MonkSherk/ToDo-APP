
import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#4C51C6',
    secondary: '#6C63FF',
    white: '#FFFFFF',
    textDark: '#333333',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 8,
        marginVertical: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.secondary,
        borderRadius: 8,
        marginVertical: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 10,
        marginVertical: 6,
        padding: 12,
    },
});
