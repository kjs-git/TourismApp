import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Space, Popconfirm, message, Typography, Form, Input, Card, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined, UserAddOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboardPage = () => {
    const [users, setUsers] = useState([]);
    const [activities, setActivities] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adminForm] = Form.useForm();
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const res = await api.get('/Activities');
            setActivities(Array.isArray(res.data) ? res.data : (res.data?.$values || []));
        } catch (error) { message.error('Ошибка загрузки туров'); }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/Admin/users');
            setUsers(Array.isArray(res.data) ? res.data : (res.data?.$values || []));
        } catch (error) { console.error('Ошибка загрузки пользователей (требуется бэкенд)'); }
    };

    const fetchReviews = async () => {
        try {
            const res = await api.get('/Admin/reviews');
            setReviews(Array.isArray(res.data) ? res.data : (res.data?.$values || []));
        } catch (error) { console.error('Ошибка загрузки отзывов (требуется бэкенд)'); }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchActivities(), fetchUsers(), fetchReviews()]).finally(() => setLoading(false));
    }, []);

    // --- ФУНКЦИИ УДАЛЕНИЯ (МОДЕРАЦИЯ) ---
    const handleDeleteActivity = async (id) => {
        try {
            await api.delete(`/Activities/${id}`); // Либо специальный роут /Admin/activities/{id}
            message.success('Тур удален');
            fetchActivities();
        } catch (error) { message.error('Не удалось удалить тур'); }
    };

    const handleDeleteUser = async (id) => {
        try {
            await api.delete(`/Admin/users/${id}`);
            message.success('Пользователь удален');
            fetchUsers();
        } catch (error) { message.error('Не удалось удалить пользователя'); }
    };

    const handleDeleteReview = async (id) => {
        try {
            await api.delete(`/Admin/reviews/${id}`);
            message.success('Отзыв удален');
            fetchReviews();
        } catch (error) { message.error('Не удалось удалить отзыв'); }
    };

    // --- ФУНКЦИЯ СОЗДАНИЯ НОВОГО АДМИНА ---
    const handleCreateAdmin = async (values) => {
        try {
            // Используем стандартный эндпоинт регистрации, жестко передавая роль 2 (Admin)
            await api.post('/Auth/register', { 
                fullName: values.fullName,
                email: values.email, 
                password: values.password, 
                role: 2 
            });
            message.success('Новый администратор успешно зарегистрирован!');
            adminForm.resetFields();
            fetchUsers(); // Обновляем список пользователей
        } catch (error) {
            message.error('Ошибка при создании администратора. Возможно, email уже занят.');
        }
    };

    // --- КОЛОНКИ ДЛЯ ТАБЛИЦ ---
    const activityColumns = [
        { title: 'Название тура', dataIndex: 'title', key: 'title', render: text => <Text strong>{text}</Text> },
        { title: 'Цена', dataIndex: 'basePrice', key: 'price', render: price => `${price?.toLocaleString()} ₽` },
        { title: 'Макс. мест', dataIndex: 'maxParticipants', key: 'seats' },
        {
            title: 'Действия', key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => navigate(`/activities/${record.id}`)}>Смотреть</Button>
                    <Popconfirm title="Удалить тур за нарушение правил?" onConfirm={() => handleDeleteActivity(record.id)} okText="Да" cancelText="Нет">
                        <Button danger icon={<DeleteOutlined />}>Удалить</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const userColumns = [
        { title: 'ФИО', dataIndex: 'fullName', key: 'name', render: text => text || 'Не указано' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Роль', dataIndex: 'role', key: 'role',
            render: role => {
                if (role === 2) return <Tag color="purple">Администратор</Tag>;
                if (role === 1) return <Tag color="blue">Гид</Tag>;
                return <Tag color="green">Турист</Tag>;
            }
        },
        {
            title: 'Действия', key: 'action',
            render: (_, record) => (
                <Popconfirm title="Заблокировать и удалить пользователя?" onConfirm={() => handleDeleteUser(record.id)} okText="Да" cancelText="Нет">
                    <Button danger type="text" icon={<DeleteOutlined />}>Удалить</Button>
                </Popconfirm>
            ),
        },
    ];

    const reviewColumns = [
        { title: 'Автор', dataIndex: 'userFullName', key: 'author', render: (text, record) => text || record.userEmail },
        { title: 'Оценка', dataIndex: 'rating', key: 'rating', render: rating => <Text strong style={{ color: '#FBBF24' }}>{rating} ⭐</Text> },
        { title: 'Комментарий', dataIndex: 'comment', key: 'comment', render: text => <Text ellipsis style={{ maxWidth: 300 }}>{text}</Text> },
        {
            title: 'Действия', key: 'action',
            render: (_, record) => (
                <Popconfirm title="Удалить этот отзыв?" onConfirm={() => handleDeleteReview(record.id)} okText="Да" cancelText="Нет">
                    <Button danger type="text" icon={<DeleteOutlined />}>Удалить</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#722ED1' }} />
                <Title level={2} style={{ margin: 0 }}>Глобальная панель управления</Title>
            </div>

            <Card style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Tabs defaultActiveKey="1" size="large">
                    
                    <TabPane tab="Модерация туров" key="1">
                        <Table columns={activityColumns} dataSource={activities} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
                    </TabPane>

                    <TabPane tab="Пользователи платформы" key="2">
                        <Table columns={userColumns} dataSource={users} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
                    </TabPane>

                    <TabPane tab="Модерация отзывов" key="3">
                        <Table columns={reviewColumns} dataSource={reviews} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
                    </TabPane>

                    <TabPane tab="Настройки (Новый Админ)" key="4">
                        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px 0' }}>
                            <Title level={4} style={{ marginBottom: '24px', textAlign: 'center' }}>
                                Добавить администратора
                            </Title>
                            <Form form={adminForm} layout="vertical" onFinish={handleCreateAdmin}>
                                <Form.Item name="fullName" label="ФИО администратора" rules={[{ required: true }]}>
                                    <Input prefix={<UserAddOutlined />} size="large" placeholder="Иванов Иван" />
                                </Form.Item>
                                <Form.Item name="email" label="Email (Логин)" rules={[{ required: true, type: 'email' }]}>
                                    <Input size="large" placeholder="admin@tourismapp.com" />
                                </Form.Item>
                                <Form.Item name="password" label="Временный пароль" rules={[{ required: true, min: 6 }]}>
                                    <Input.Password size="large" />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" block size="large" style={{ background: '#722ED1', borderColor: '#722ED1' }}>
                                    Предоставить права Администратора
                                </Button>
                            </Form>
                        </div>
                    </TabPane>

                </Tabs>
            </Card>
        </div>
    );
};

export default AdminDashboardPage;