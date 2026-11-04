import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, message, Tag, List, Space, Empty, Button, DatePicker } from 'antd';
import { CompassOutlined, CalendarOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const { Title, Text, Link: AntLink } = Typography;

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 👇 Состояния для фильтра-календаря 👇
    const [selectedDate, setSelectedDate] = useState(null);
    const [filterDate, setFilterDate] = useState(null);
    
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Orders/my');
            const data = Array.isArray(response.data) ? response.data : (response.data?.$values || []);
            setOrders(data);
        } catch (error) {
            console.error("Ошибка загрузки заказов:", error);
            message.error('Не удалось загрузить историю заказов');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Дата не указана';
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Некорректная дата' : date.toLocaleDateString();
    };

    const formatStartTime = (start) => {
        const startDate = new Date(start);
        if (isNaN(startDate.getTime())) return 'Время не указано';
        const datePart = startDate.toLocaleDateString();
        const timePart = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${datePart} в ${timePart}`;
    };

    const getStatusConfig = (status) => {
        const s = String(status);
        if (s === 'Pending' || s === '0') return { color: 'orange', text: 'ОЖИДАЕТ ПОДТВЕРЖДЕНИЯ', bg: '#fff7e6', border: '#ffd591' };
        if (s === 'Confirmed' || s === '1') return { color: 'blue', text: 'ПОДТВЕРЖДЕНО', bg: '#e6f7ff', border: '#91d5ff' };
        if (s === 'Paid' || s === '2') return { color: 'green', text: 'ОПЛАЧЕНО', bg: '#f6ffed', border: '#b7eb8f' };
        if (s === 'Cancelled' || s === '3') return { color: 'red', text: 'ОТМЕНЕНО', bg: '#fff2f0', border: '#ffa39e' };
        return { color: 'default', text: 'НЕИЗВЕСТНО', bg: '#f5f5f5', border: '#d9d9d9' };
    };

    const handleActivityClick = (item) => {
        const actId = item.activityId || item.ActivityId;
        if (actId && actId !== '00000000-0000-0000-0000-000000000000') {
            navigate(`/activities/${actId}`);
        } else {
            message.warning('ID тура не найден. Разработчику: добавьте ActivityId в DTO заказов на бэкенде.');
        }
    };

    // 👇 ЛОГИКА ФИЛЬТРАЦИИ ПО ДАТЕ 👇
    const filteredOrders = orders.filter(order => {
        if (!filterDate) return true; // Если фильтр не применен, показываем всё
        
        const items = order.items?.$values || order.items || [];
        // Проверяем, есть ли внутри заказа тур на выбранную дату
        return items.some(item => {
            if (!item.startTime) return false;
            const d1 = new Date(item.startTime);
            const d2 = filterDate.toDate ? filterDate.toDate() : new Date(filterDate);
            
            return d1.getFullYear() === d2.getFullYear() &&
                   d1.getMonth() === d2.getMonth() &&
                   d1.getDate() === d2.getDate();
        });
    });

    if (loading) {
        return <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontSize: '32px' }}>Мои путешествия</Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>История ваших бронирований и поездок</Text>
            </div>

            {/* 👇 ПАНЕЛЬ ФИЛЬТРАЦИИ 👇 */}
            {orders.length > 0 && (
                <div style={{ 
                    marginBottom: '24px', padding: '16px', background: '#F9FAFB', 
                    borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', 
                    gap: '12px', alignItems: 'center', flexWrap: 'wrap' 
                }}>
                    <Space>
                        <FilterOutlined style={{ color: '#6B7280' }} />
                        <Text strong>Фильтр по дате тура:</Text>
                    </Space>
                    <DatePicker 
                        size="large" 
                        placeholder="Выберите дату" 
                        format="DD.MM.YYYY"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        style={{ borderRadius: '8px' }}
                    />
                    <Button type="primary" size="large" onClick={() => setFilterDate(selectedDate)} disabled={!selectedDate} style={{ borderRadius: '8px' }}>
                        Применить
                    </Button>
                    <Button size="large" onClick={() => { setSelectedDate(null); setFilterDate(null); }} style={{ borderRadius: '8px' }}>
                        Сбросить
                    </Button>
                </div>
            )}

            {orders.length === 0 ? (
                <Card style={{ borderRadius: '16px', textAlign: 'center', padding: '40px 0', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span style={{ fontSize: '16px', color: '#6B7280' }}>Вы еще ничего не забронировали</span>}
                    />
                    <Button type="primary" size="large" onClick={() => navigate('/activities')} style={{ marginTop: '24px', borderRadius: '8px' }}>
                        Найти тур
                    </Button>
                </Card>
            ) : filteredOrders.length === 0 ? (
                <Card style={{ borderRadius: '16px', textAlign: 'center', padding: '40px 0', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span style={{ fontSize: '16px', color: '#6B7280' }}>На выбранную дату туров не найдено</span>}
                    />
                    <Button size="large" onClick={() => { setSelectedDate(null); setFilterDate(null); }} style={{ marginTop: '24px', borderRadius: '8px' }}>
                        Сбросить фильтр
                    </Button>
                </Card>
            ) : (
                <List
                    dataSource={filteredOrders}
                    renderItem={(order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const items = order.items?.$values || order.items || [];
                        const orderId = order.orderId || order.id || '???';

                        return (
                            <Card 
                                style={{ 
                                    borderRadius: '16px', 
                                    marginBottom: '20px', 
                                    border: '1px solid #E5E7EB',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                }}
                                bodyStyle={{ padding: 0 }}
                            >
                                <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                    <Space size="large">
                                        <div>
                                            <Text type="secondary" style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase' }}>Заказ оформлен</Text>
                                            <Text strong>{formatDate(order.orderDate || order.createdAt)}</Text>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase' }}>Номер заказа</Text>
                                            <Text strong>#{String(orderId).substring(0, 8).toUpperCase()}</Text>
                                        </div>
                                    </Space>
                                    <Tag color={statusConfig.color} style={{ margin: 0, padding: '4px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, background: statusConfig.bg, borderColor: statusConfig.border, color: statusConfig.color }}>
                                        {statusConfig.text}
                                    </Tag>
                                </div>

                                <div style={{ padding: '24px' }}>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={items}
                                        renderItem={item => (
                                            <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                                <List.Item.Meta
                                                    avatar={<div style={{ width: 48, height: 48, borderRadius: 8, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CompassOutlined style={{ fontSize: 24, color: '#9CA3AF' }} /></div>}
                                                    title={
                                                        <AntLink 
                                                            onClick={() => handleActivityClick(item)}
                                                            style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}
                                                        >
                                                            {item.activityTitle}
                                                        </AntLink>
                                                    }
                                                    description={
                                                        <Space style={{ marginTop: 4 }}>
                                                            <CalendarOutlined style={{ color: '#6B7280' }} />
                                                            <Text type="secondary">{formatStartTime(item.startTime)}</Text>
                                                        </Space>
                                                    }
                                                />
                                                <Text strong style={{ fontSize: '16px' }}>{item.price?.toLocaleString() || order.totalAmount?.toLocaleString()} ₽</Text>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </Card>
                        );
                    }}
                />
            )}
        </div>
    );
};

export default OrdersPage;