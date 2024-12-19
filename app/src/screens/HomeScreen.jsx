
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/theme';
import AuthService from '../services/AuthService';
import { deleteToken } from '../services/SecureStorage';

const HomeScreen = ({ navigation }) => {
    const handleLogout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error('Ошибка логаута', error);
        }
        await deleteToken();
        navigation.replace('Login');
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Добро пожаловать в ваш личный ТуДу лист , удачи с выполнением задач пидор баля</Text>

            <TouchableOpacity
                style={globalStyles.button}
                onPress={() => navigation.navigate('Tasks')}
            >
                <Text style={globalStyles.buttonText}>Мои задачи</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={globalStyles.button}
                onPress={() => navigation.navigate('Profile')}
            >
                <Text style={globalStyles.buttonText}>Профиль</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.button} onPress={handleLogout}>
                <Text style={globalStyles.buttonText}>Выйти</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
