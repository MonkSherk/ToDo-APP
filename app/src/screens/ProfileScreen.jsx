
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../styles/theme';
import AuthService from '../services/AuthService';
import { getToken } from '../services/SecureStorage';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);

    const loadProfile = async () => {
        try {
            const token = await getToken();
            if (!token) return;
            const data = await AuthService.getCurrentUser(token);
            setProfile(data);
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось получить профиль');
            console.error(error);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChangeAvatar = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Ошибка', 'Нет доступа к галерее');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const selected = result.assets[0];
                const localUri = selected.uri;

                const token = await getToken();
                if (!token) return;

                const formData = new FormData();
                formData.append('avatar', {
                    uri: localUri,
                    name: 'avatar.jpg',
                    type: 'image/jpeg',
                });

                await AuthService.updateUser(token, formData);

                Alert.alert('Успешно', 'Аватар обновлён');
                loadProfile();
            }
        } catch (error) {
            console.error('Ошибка изменения аватара:', error);
            Alert.alert('Ошибка', 'Не удалось изменить аватар');
        }
    };

    if (!profile) {
        return (
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Делаем вид что ищем ваш профиль...</Text>
            </View>
        );
    }

    let API_BASE_URL = 'https://test.ai-softdev.com'
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Профиль Далбаеба</Text>

            {profile.avatar ? (
                <Image
                    source={{ uri: `${API_BASE_URL}/${profile.avatar}` }}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        marginBottom: 16,
                        alignSelf: 'center',
                    }}
                />
            ) : (
                <Text style={{ color: '#FFF', marginBottom: 8 }}>Нет аватара</Text>
            )}

            <Text style={{ color: '#FFF', marginBottom: 8 }}>Email: {profile.email}</Text>
            <Text style={{ color: '#FFF', marginBottom: 20 }}>ID: {profile.id}</Text>

            <TouchableOpacity style={globalStyles.button} onPress={handleChangeAvatar}>
                <Text style={globalStyles.buttonText}>Изменить аватар</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[globalStyles.button, { marginTop: 16 }]}
                onPress={() => navigation.goBack()}
            >
                <Text style={globalStyles.buttonText}>Назад</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;
