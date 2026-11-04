import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, Space, message, Empty, Popconfirm, Divider, Modal, Row, Col, List } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, CheckCircleOutlined, ExclamationCircleFilled, CalendarOutlined, EnvironmentOutlined, LockOutlined } from '@ant-design/icons';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { confirm } = Modal;

const RoutesPage = () => {
    const [routeItems, setRouteItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const navigate = useNavigate();

    const fetchRoute = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Routes');
            
            const items = response.data?.items || [];
            setRouteItems(items);
        } catch (error) {
            console.error("Ошибка загрузки корзины:", error);
            setRouteItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        try {
            await api.delete('/Routes');
            message.success('Корзина очищена');
            fetchRoute();
        } catch (error) {
            message.error('Ошибка при очистке');
        }
    };

    // Главная функция: Проверка перед оформлением
    const handleCheckoutCheck = async () => {
        if (checkoutLoading || routeItems.length === 0) return;

        try {
            setCheckoutLoading(true);

            // 1. Запрашиваем старые заказы пользователя
            const ordersRes = await api.get('/Orders/my');
            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.$values || []);

            // 2. Вытаскиваем все ScheduleId из старых заказов
            let orderedScheduleIds = [];
            orders.forEach(order => {
                const items = order.items?.$values || order.items || [];
                items.forEach(item => {
                    const id = item.scheduleId || item.ScheduleId || item.id;
                    if (id) {
                        orderedScheduleIds.push(String(id).toLowerCase());
                    }
                });
            });

            // 3. Проверяем, есть ли хотя бы один тур из корзины в списке старых заказов
            const hasDuplicate = routeItems.some(cartItem => {
                const cartId = String(cartItem.scheduleId).toLowerCase();
                return orderedScheduleIds.includes(cartId);
            });

            // 4. Если нашли дубликат — показываем окно
            if (hasDuplicate) {
                setCheckoutLoading(false); 
                
                confirm({
                    title: 'Вы уже бронировали этот тур',
                    icon: <ExclamationCircleFilled style={{ color: '#faad14' }}/>,
                    content: 'В вашей корзине есть туры (даты и время), которые вы уже успешно оформляли ранее. Вы уверены, что хотите сделать повторный заказ на те же самые места?',
                    okText: 'Да, оформить повторно',
                    cancelText: 'Отмена',
                    onOk: async () => {
                        await executeCheckout();
                    }
                });
            } else {
                await executeCheckout();
            }

        } catch (error) {
            console.error("Ошибка при проверке истории заказов:", error);
            await executeCheckout();
        }
    };

    // Функция самого оформления заказа
    const executeCheckout = async () => {
        try {
            setCheckoutLoading(true);
            await api.post('/Orders/checkout');
            message.success('Заказ успешно оформлен!');
            navigate('/orders'); // Логичнее после успешного оформления отправить клиента в "Мои заказы"
        } catch (error) {
            message.error('Ошибка оформления заказа');
            setCheckoutLoading(false);
        }
    };

    useEffect(() => {
        fetchRoute();
    }, []);

    // Вычисляем общую стоимость
    const totalPrice = routeItems.reduce((sum, item) => sum + (item.price || 0), 0);

    if (loading) {
        return (
            <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={4} style={{ color: '#9CA3AF' }}>Загружаем вашу корзину...</Title>
            </div>
        );
    }

    if (routeItems.length === 0) {
        return (
            <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <span style={{ fontSize: '18px', color: '#6B7280' }}>
                            Ваша корзина пока пуста
                        </span>
                    }
                />
                <Button 
                    type="primary" 
                    size="large" 
                    onClick={() => navigate('/activities')}
                    style={{ marginTop: '24px', borderRadius: '8px' }}
                >
                    Перейти к каталогу туров
                </Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '60px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontSize: '32px' }}>
                    Оформление заказа
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Проверьте выбранные туры перед подтверждением
                </Text>
            </div>

            <Row gutter={[40, 40]}>
                {/* ЛЕВАЯ КОЛОНКА: СПИСОК ТУРОВ */}
                <Col xs={24} lg={15}>
                    <List
                        dataSource={routeItems}
                        renderItem={(item) => (
                            <div style={{ 
                                padding: '24px', 
                                border: '1px solid #E5E7EB', 
                                borderRadius: '16px', 
                                marginBottom: '16px',
                                background: '#fff',
                                transition: 'box-shadow 0.2s',
                            }}>
                                <Row justify="space-between" align="middle">
                                    <Col xs={24} sm={16}>
                                        <Space direction="vertical" size={8}>
                                            <Title level={4} style={{ margin: 0, fontSize: '20px' }}>{item.title}</Title>
                                            <Space style={{ color: '#6B7280', fontSize: '14px' }}>
                                                <CalendarOutlined />
                                                <span>{new Date(item.startTime).toLocaleDateString()}</span>
                                                <Divider type="vertical" />
                                                <span>{new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </Space>
                                            <Space style={{ color: '#6B7280', fontSize: '14px' }}>
                                                <EnvironmentOutlined />
                                                <span>Камчатка</span>
                                            </Space>
                                        </Space>
                                    </Col>
                                    <Col xs={24} sm={8} style={{ textAlign: 'right', marginTop: '16px' }}>
                                        <Text strong style={{ fontSize: '22px', color: '#1F2937' }}>
                                            {item.price?.toLocaleString()} ₽
                                        </Text>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    />

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-start' }}>
                        <Popconfirm 
                            title="Вы уверены, что хотите удалить все туры из корзины?" 
                            onConfirm={handleClear} 
                            okText="Да, очистить" 
                            cancelText="Отмена" 
                            disabled={checkoutLoading}
                        >
                            <Button danger type="text" icon={<DeleteOutlined />} disabled={checkoutLoading}>
                                Очистить корзину целиком
                            </Button>
                        </Popconfirm>
                    </div>
                </Col>

                {/* ПРАВАЯ КОЛОНКА: ИТОГОВЫЙ ЧЕК (ЛИПКАЯ) */}
                <Col xs={24} lg={9}>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <Card 
                            style={{ 
                                borderRadius: '16px', 
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <Title level={4} style={{ marginBottom: '24px' }}>Детали оплаты</Title>
                            
                            <Space direction="vertical" style={{ width: '100%' }} size={16}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#4B5563', fontSize: '16px' }}>Количество туров:</Text>
                                    <Text style={{ fontSize: '16px' }}>{routeItems.length} шт.</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#4B5563', fontSize: '16px' }}>Сервисный сбор:</Text>
                                    <Text style={{ fontSize: '16px', color: '#10B981' }}>0 ₽</Text>
                                </div>
                                
                                <Divider style={{ margin: '8px 0' }} />
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: '18px' }}>К оплате:</Text>
                                    <Text strong style={{ fontSize: '28px', color: '#1F2937' }}>
                                        {totalPrice.toLocaleString()} ₽
                                    </Text>
                                </div>
                            </Space>

                            <Button 
                                type="primary" 
                                size="large" 
                                block 
                                icon={<LockOutlined />} 
                                onClick={handleCheckoutCheck} 
                                loading={checkoutLoading} 
                                style={{ height: '56px', borderRadius: '12px', marginTop: '32px', fontSize: '16px', fontWeight: 600 }}
                            >
                                Подтвердить бронирование
                            </Button>
                            
                            <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '12px' }}>
                                Нажимая кнопку, вы соглашаетесь с условиями сервиса. Оплата производится после подтверждения гидом.
                            </Text>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RoutesPage;