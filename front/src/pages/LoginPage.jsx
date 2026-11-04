import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; 
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await api.post('/Auth/login', values);
            const token = response.data.token;
            
            const decoded = jwtDecode(token);
            // СМОТРИ СЮДА В КОНСОЛИ (F12)
            console.log("ПОЛНЫЙ ДЕКОДИРОВАННЫЙ ТОКЕН:", decoded);

            // Ищем роль во всех возможных местах
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                         decoded.role || 
                         decoded.UserRole;

            const user = { 
                email: decoded.email || values.email, 
                role: role 
            };

            console.log("ИТОГОВЫЙ ОБЪЕКТ USER ДЛЯ ХРАНИЛИЩА:", user);

            login(token, user);
            message.success('Вход выполнен!');
            navigate('/');
        } catch (error) {
            console.error(error);
            message.error('Ошибка входа.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="Вход в систему (TourismApp)" style={{ width: 400 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="admin@example.com" />
                    </Form.Item>
                    <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large">Войти</Button>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;