
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AuthService from '../services/AuthService';
import { saveToken, getToken } from '../services/SecureStorage';
import { globalStyles } from '../styles/theme';

const LoginScreen = ({ navigation }) => {
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

    const handleLogin = async () => {
        try {
            const data = await AuthService.login(email, password);
            if (data?.access_token) {
                await saveToken(data.access_token);
                Alert.alert('Успешно', 'Вход выполнен');
                navigation.replace('Home');
            } else {
                Alert.alert('Ошибка', 'Неверный логин или пароль');
            }
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось войти');
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Вход</Text>
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

            <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
                <Text style={globalStyles.buttonText}>Войти</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={globalStyles.button}
                onPress={() => navigation.navigate('Registration')}
            >
                <Text style={globalStyles.buttonText}>Регистрация</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
