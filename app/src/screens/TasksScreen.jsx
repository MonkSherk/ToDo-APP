import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
    ActivityIndicator,
    Modal,
    StyleSheet,
    Platform,
} from 'react-native';
import TaskService from '../services/TaskService';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors} from "@/app/src/styles/theme";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthService from "@/app/src/services/AuthService";
import {deleteToken} from "@/app/src/services/SecureStorage";

const TasksScreen = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');

    const fetchTasks = async () => {
        if (!hasMore && page !== 1) return;
        setIsLoading(true);
        try {
            let data;
            if (selectedDate) {
                console.log('Получение задач по дате:', selectedDate);
                data = await TaskService.getTasksByDate(selectedDate, page, limit);
            } else {
                console.log('Получение всех задач');
                data = await TaskService.getTasks(page, limit);
            }
            console.log('Полученные задачи:', data);
            const newTasks = data.data;
            setTasks(prevTasks => (page === 1 ? newTasks : [...prevTasks, ...newTasks]));
            if (page * limit >= data.count) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error) {
            console.error('Ошибка загрузки задач:', error.response ? error.response.data : error.message);
            if (error.response) {
                if (error.response.status === 401) {
                    Alert.alert('Ошибка', 'Не авторизован. Пожалуйста, войдите в систему.');
                } else if (error.response.status === 404) {
                    Alert.alert('Ошибка', 'Ресурс не найден.');
                } else {
                    Alert.alert('Ошибка', 'Не удалось загрузить задачи. Попробуйте позже.');
                }
            } else {
                Alert.alert('Ошибка', 'Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchTasks();
    }, [selectedDate, page]);

    const handleCreateTask = async () => {
        console.log('handleCreateTask вызван');
        if (!title.trim()) {
            Alert.alert('Ошибка', 'Введите заголовок задачи');
            console.log('Заголовок задачи не введен');
            return;
        }

        try {
            console.log('Перед вызовом TaskService.createTask');
            const newTaskResponse = await TaskService.createTask({ title, description }, page, limit);
            console.log('Ответ при создании задачи:', newTaskResponse);

            let newTask;
            if (newTaskResponse.data && Array.isArray(newTaskResponse.data)) {
                console.log('Ответ содержит массив задач');
                newTask = newTaskResponse.data.reduce((latest, task) => {
                    console.log(`Сравниваем задачи: ${latest.created_at} и ${task.created_at}`);
                    return new Date(task.created_at) > new Date(latest.created_at) ? task : latest;
                }, newTaskResponse.data[0]);
            } else {
                console.log('Ответ содержит одну задачу');
                newTask = newTaskResponse;
            }

            if (newTask) {
                console.log('Задача успешно создана:', newTask);
                Alert.alert('Успешно', 'Задача создана!');
                setTasks(prevTasks => [newTask, ...prevTasks]);
                console.log('Список задач обновлен');
                setTitle('');
                setDescription('');
                console.log('Поля формы сброшены');

                if (tasks.length + 1 >= newTaskResponse.count) {
                    setHasMore(false);
                    console.log('Достигнут предел задач');
                } else {
                    setHasMore(true);
                    console.log('Можно загружать больше задач');
                }
            } else {
                console.log('Не удалось определить созданную задачу');
                Alert.alert('Ошибка', 'Не удалось определить созданную задачу.');
            }
        } catch (error) {
            console.error('Ошибка создания задачи:', error.response ? error.response.data : error.message);
            if (error.response) {
                if (error.response.status === 401) {
                    Alert.alert('Ошибка', 'Не авторизован. Пожалуйста, войдите в систему.');
                    console.log('Ошибка 401: Не авторизован');
                } else if (error.response.status === 404) {
                    Alert.alert('Ошибка', 'Ресурс не найден.');
                    console.log('Ошибка 404: Ресурс не найден');
                } else {
                    Alert.alert('Ошибка', 'Не удалось создать задачу. Попробуйте позже.');
                    console.log(`Ошибка ${error.response.status}: ${error.response.data}`);
                }
            } else {
                Alert.alert('Ошибка', 'Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.');
                console.log('Ошибка подключения к серверу');
            }
        }
    };
    const handleUpdateTask = async (id, updatedTitle, updatedDescription) => {
        try {
            const updatedTaskResponse = await TaskService.updateTask(id, { title: updatedTitle, description: updatedDescription }, page, limit);
            console.log('Ответ при обновлении задачи:', updatedTaskResponse);

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === id
                        ? { ...task, title: updatedTitle, description: updatedDescription }
                        : task
                )
            );
            Alert.alert('Успешно', 'Задача обновлена!');
            setModalVisible(false);
            setCurrentTaskId(null);
            setUpdatedTitle('');
            setUpdatedDescription('');
        } catch (error) {
            console.error('Ошибка обновления задачи:', error.response ? error.response.data : error.message);
            if (error.response) {
                if (error.response.status === 401) {
                    Alert.alert('Ошибка', 'Не авторизован. Пожалуйста, войдите в систему.');
                } else if (error.response.status === 404) {
                    Alert.alert('Ошибка', 'Задача не найдена.');
                } else {
                    Alert.alert('Ошибка', 'Не удалось обновить задачу. Попробуйте позже.');
                }
            } else {
                Alert.alert('Ошибка', 'Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.');
            }
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const deleteResponse = await TaskService.deleteTask(id, page, limit);
            console.log('Ответ при удалении задачи:', deleteResponse);

            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            Alert.alert('Успешно', 'Задача удалена!');

            if (tasks.length - 1 < deleteResponse.count) {
                setHasMore(true);
            }
        } catch (error) {
            console.error('Ошибка удаления задачи:', error.response ? error.response.data : error.message);
            if (error.response) {
                if (error.response.status === 401) {
                    Alert.alert('Ошибка', 'Не авторизован. Пожалуйста, войдите в систему.');
                } else if (error.response.status === 404) {
                    Alert.alert('Ошибка', 'Задача не найдена.');
                } else {
                    Alert.alert('Ошибка', 'Не удалось удалить задачу. Попробуйте позже.');
                }
            } else {
                Alert.alert('Ошибка', 'Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.');
            }
        }
    };

    const handleMarkDone = async (id) => {
        try {
            await TaskService.markTaskDone(id, page, limit);
            Alert.alert('Успешно', 'Задача выполнена');
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === id ? { ...task, done: true } : task
                )
            );
        } catch (error) {
            console.error('Ошибка завершения задачи:', error.response ? error.response.data : error.message);
            if (error.response) {
                if (error.response.status === 401) {
                    Alert.alert('Ошибка', 'Не авторизован. Пожалуйста, войдите в систему.');
                } else if (error.response.status === 404) {
                    Alert.alert('Ошибка', 'Задача не найдена.');
                } else {
                    Alert.alert('Ошибка', 'Не удалось завершить задачу. Попробуйте позже.');
                }
            } else {
                Alert.alert('Ошибка', 'Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.');
            }
        }
    };

    const handlePickDate = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            const isoString = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
            setSelectedDate(isoString);
            setPage(1);
            setHasMore(true);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        await fetchTasks();
        setRefreshing(false);
    };

    const loadMoreTasks = () => {
        if (!isLoading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const openUpdateModal = (task) => {
        setCurrentTaskId(task.id);
        setUpdatedTitle(task.title);
        setUpdatedDescription(task.description);
        setModalVisible(true);
    };

    const showActionMenu = (item) => {
        const actions = [
            {
                text: 'Обновить хуйню',
                onPress: () => openUpdateModal(item),
            },
            {
                text: 'Удалить нахуй',
                style: 'destructive',
                onPress: () => handleDeleteTask(item.id),
            },
            { text: 'Отмена', style: 'cancel' },
        ];

        Alert.alert('Действия над долбаебом', '', actions);
    };



    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>

                <View style={styles.statusContainer}>
                    <Text style={styles.taskStatus}>{item.done ? 'Выполнено' : 'Не выполнено'}</Text>
                    <Icon
                        name={item.done ? 'check-circle' : 'cancel'}
                        size={30}
                        color={item.done ? '#4CAF50' : '#F44336'}
                    />
                </View>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={() => showActionMenu(item)}>
                    <Icon name="edit" style={25} size={30} color="#2196F3" />
                </TouchableOpacity>
                {!item.done && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleMarkDone(item.id)}
                    >
                        <Icon name="check" size={30} color="#4CAF50" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Мои задачи</Text>

            <TextInput
                style={styles.input}
                placeholder="Название задачи"
                placeholderTextColor="#888"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Описание"
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
                <Text style={styles.buttonText}>Создать задачу</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FF9800', marginTop: 10 }]}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.buttonText}>
                    {selectedDate ? `Задачи на ${selectedDate}` : 'Выбрать дату'}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate ? new Date(selectedDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handlePickDate}
                />
            )}

            {isLoading && page === 1 ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={styles.rowWrapper}
                    onEndReached={loadMoreTasks}
                    onEndReachedThreshold={0.5}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListFooterComponent={isLoading && page > 1 ? <ActivityIndicator size="small" color="#0000ff" /> : null}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setCurrentTaskId(null);
                    setUpdatedTitle('');
                    setUpdatedDescription('');
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Обновить задачу</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Название задачи"
                            placeholderTextColor="#888"
                            value={updatedTitle}
                            onChangeText={setUpdatedTitle}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Описание"
                            placeholderTextColor="#888"
                            value={updatedDescription}
                            onChangeText={setUpdatedDescription}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#4CAF50', flex: 1, marginRight: 5 }]}
                                onPress={() => {
                                    if (!updatedTitle.trim()) {
                                        Alert.alert('Ошибка', 'Название задачи не может быть пустым.');
                                        return;
                                    }
                                    handleUpdateTask(currentTaskId, updatedTitle, updatedDescription);
                                }}
                            >
                                <Text style={styles.buttonText}>Сохранить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#F44336', flex: 1, marginLeft: 5 }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setCurrentTaskId(null);
                                    setUpdatedTitle('');
                                    setUpdatedDescription('');
                                }}
                            >
                                <Text style={styles.buttonText}>Отмена</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        justifyContent: 'center',
        marginBottom: 20,
        paddingTop: 20,
        paddingBottom: 20,

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

    createButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    rowWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    card: {
        width: '47%',
        aspectRatio: 1,
        margin: 5,
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },

    taskContent: {
        alignItems: 'center',
        marginBottom: 10,
    },

    taskTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },

    taskDescription: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },

    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    taskStatus: {
        fontSize: 14,
        color: '#333',
        marginRight: 5,
    },

    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },

    actionButton: {
        marginHorizontal: 10,
        padding: 5,
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },

    modalInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: '#000',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

});

export default TasksScreen;
