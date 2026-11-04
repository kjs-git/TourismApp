import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Select, message, Typography, Divider } from 'antd'; // Добавили Divider
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AuthPage = () => {
    // Достаем login и loginAsGuest из нашего стора
    const { login, loginAsGuest } = useAuthStore(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Логика Входа
    const onLogin = async (values) => {
        setLoading(true);
        try {
            const response = await api.post('/Auth/login', values);
            const token = response.data.token;
            const decoded = jwtDecode(token);
            
            const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
            const rawRole = decoded[roleKey] || decoded.role;

            const roleMapping = {
                "Client": 0,
                "Seller": 1,
                "Admin": 2
            };

            const finalRole = roleMapping[rawRole] !== undefined ? roleMapping[rawRole] : Number(rawRole);

            const user = { 
                email: decoded.email || values.email, 
                role: finalRole 
            };

            login(token, user);
            message.success('С возвращением!');
            navigate('/');
        } catch (error) {
            message.error('Ошибка входа. Проверьте данные.');
        } finally {
            setLoading(false);
        }
    };

    // Логика Регистрации
    const onRegister = async (values) => {
        setLoading(true);
        try {
            await api.post('/Auth/register', {
                ...values,
                role: parseInt(values.role)
            });
            message.success('Регистрация успешна! Теперь войдите.');
            window.location.reload(); 
        } catch (error) {
            message.error('Ошибка регистрации. Возможно, email уже занят.');
        } finally {
            setLoading(false);
        }
    };

    // 👇 Логика Гостевого входа 👇
    const handleGuestLogin = () => {
        loginAsGuest();
        message.info('Вы вошли в гостевом режиме');
        navigate('/');
    };

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            minHeight: '100vh', background: '#f0f2f5', padding: '20px' 
        }}>
            <Card style={{ width: 450, borderRadius: '15px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={2} style={{ color: '#1890ff', margin: 0 }}>TourismApp</Title>
                    <Text type="secondary">Путешествия по Камчатке</Text>
                </div>

                <Tabs defaultActiveKey="1" centered size="large">
                    {/* ВКЛАДКА ЛОГИНА */}
                    <TabPane tab="Вход" key="1">
                        <Form layout="vertical" onFinish={onLogin} style={{ marginTop: 20 }}>
                            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Введите почту!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль!' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                                Войти
                            </Button>
                        </Form>

                        {/* 👇 КНОПКА ГОСТЕВОГО ВХОДА 👇 */}
                        <Divider style={{ color: '#9CA3AF', fontSize: '14px' }}>ИЛИ</Divider>
                        <Button 
                            type="dashed" 
                            block 
                            size="large" 
                            onClick={handleGuestLogin}
                        >
                            Продолжить без регистрации
                        </Button>
                    </TabPane>

                    {/* ВКЛАДКА РЕГИСТРАЦИИ */}
                    <TabPane tab="Регистрация" key="2">
                        <Form layout="vertical" onFinish={onRegister} style={{ marginTop: 20 }}>
                            <Form.Item name="fullName" rules={[{ required: true, message: 'Как вас зовут?' }]}>
                                <Input prefix={<IdcardOutlined />} placeholder="ФИО полностью" size="large" />
                            </Form.Item>
                            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Введите Email!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Пароль от 6 символов!' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Придумайте пароль" size="large" />
                            </Form.Item>
                            <Form.Item name="role" label="Я хочу быть:" initialValue={0} rules={[{ required: true }]}>
                                <Select size="large">
                                    <Select.Option value={0}>Клиентом (искать туры)</Select.Option>
                                    <Select.Option value={1}>Гидом (создавать туры)</Select.Option>
                                </Select>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                                Создать аккаунт
                            </Button>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default AuthPage;