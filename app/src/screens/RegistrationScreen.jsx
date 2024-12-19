
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AuthService from '../services/AuthService';
import { saveToken, getToken } from '../services/SecureStorage';
import { globalStyles } from '../styles/theme';

const RegistrationScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getToken();
            if (token) {
                navigation.replace('Home');
            }
        };
        checkAuth();
    }, []);

    const handleRegister = async () => {
        try {
            const data = await AuthService.register(email, password);
            if (data?.access_token) {
                await saveToken(data.access_token);
                Alert.alert('Успешно', 'Регистрация прошла успешно');
                navigation.replace('Home');
            } else {
                Alert.alert('Ошибка регистрации', JSON.stringify(data));
            }
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Регистрация</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Пароль"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
                <Text style={globalStyles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegistrationScreen;
