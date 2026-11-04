import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, message, Tag, Space, Button, Popconfirm, List, Row, Col, DatePicker, Empty } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, CalendarOutlined, CompassOutlined, FilterOutlined } from '@ant-design/icons';
import api from '../api/axiosInstance';

const { Title, Text } = Typography;

const SellerOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 👇 Состояния для фильтра-календаря 👇
    const [selectedDate, setSelectedDate] = useState(null);
    const [filterDate, setFilterDate] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/Orders/seller-orders');
            const data = Array.isArray(res.data) ? res.data : (res.data?.$values || []);
            setOrders(data);
        } catch (e) {
            console.error(e);
            message.error('Ошибка загрузки заказов клиентов');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/Orders/${id}/status`, status, { 
                headers: { 'Content-Type': 'application/json' }
            });
            message.success('Статус заказа успешно изменен');
            fetchOrders(); 
        } catch (e) {
            message.error('Не удалось изменить статус');
        }
    };

    useEffect(() => { 
        fetchOrders(); 
    }, []);

    const getStatusConfig = (status) => {
        const s = String(status);
        if (s === 'Pending' || s === '0') return { color: 'orange', text: 'ОЖИДАЕТ ПОДТВЕРЖДЕНИЯ', bg: '#fff7e6', border: '#ffd591' };
        if (s === 'Confirmed' || s === '1') return { color: 'blue', text: 'ПОДТВЕРЖДЕНО', bg: '#e6f7ff', border: '#91d5ff' };
        if (s === 'Paid' || s === '2') return { color: 'green', text: 'ОПЛАЧЕНО', bg: '#f6ffed', border: '#b7eb8f' };
        if (s === 'Cancelled' || s === '3') return { color: 'red', text: 'ОТМЕНЕНО', bg: '#fff2f0', border: '#ffa39e' };
        return { color: 'default', text: 'НЕИЗВЕСТНО', bg: '#f5f5f5', border: '#d9d9d9' };
    };

    // 👇 ЛОГИКА ФИЛЬТРАЦИИ ПО ДАТЕ 👇
    const filteredOrders = orders.filter(order => {
        if (!filterDate) return true;
        
        const items = order.items?.$values || order.items || [];
        return items.some(item => {
            if (!item.startTime) return false;
            const d1 = new Date(item.startTime);
            const d2 = filterDate.toDate ? filterDate.toDate() : new Date(filterDate);
            
            return d1.getFullYear() === d2.getFullYear() &&
                   d1.getMonth() === d2.getMonth() &&
                   d1.getDate() === d2.getDate();
        });
    });

    if (loading) return <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '60px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontSize: '32px' }}>Заказы клиентов</Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>Управление новыми заявками и статусами оплат</Text>
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
                        <Text strong>Фильтр по дате проведения:</Text>
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
                    <Empty description={<span style={{ fontSize: '16px', color: '#6B7280' }}>У вас пока нет заказов от клиентов.</span>} />
                </Card>
            ) : filteredOrders.length === 0 ? (
                <Card style={{ borderRadius: '16px', textAlign: 'center', padding: '40px 0', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Empty description={<span style={{ fontSize: '16px', color: '#6B7280' }}>На выбранную дату заказов нет.</span>} />
                    <Button size="large" onClick={() => { setSelectedDate(null); setFilterDate(null); }} style={{ marginTop: '24px', borderRadius: '8px' }}>
                        Сбросить фильтр
                    </Button>
                </Card>
            ) : (
                <List
                    dataSource={filteredOrders}
                    renderItem={(order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const s = String(order.status);
                        const isPending = s === 'Pending' || s === '0';
                        const isConfirmed = s === 'Confirmed' || s === '1';
                        const orderId = order.orderId || order.id || '???';
                        const items = order.items?.$values || order.items || [];

                        return (
                            <Card 
                                style={{ 
                                    borderRadius: '16px', 
                                    marginBottom: '20px', 
                                    border: '1px solid #E5E7EB',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                }}
                                bodyStyle={{ padding: '24px' }}
                            >
                                <Row justify="space-between" align="top" gutter={[16, 16]}>
                                    <Col xs={24} md={16}>
                                        <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                            <Space size="large" style={{ flexWrap: 'wrap' }}>
                                                <Tag color={statusConfig.color} style={{ margin: 0, padding: '4px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, background: statusConfig.bg, borderColor: statusConfig.border, color: statusConfig.color }}>
                                                    {statusConfig.text}
                                                </Tag>
                                                <Text type="secondary">Создан: {new Date(order.createdAt || order.orderDate).toLocaleString()}</Text>
                                                <Text type="secondary">ID: #{String(orderId).substring(0,8).toUpperCase()}</Text>
                                            </Space>

                                            <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                                {items.map((item, idx) => (
                                                    <Space key={idx} direction="vertical" size={4} style={{ width: '100%', marginBottom: idx !== items.length - 1 ? '16px' : '0' }}>
                                                        <Text strong style={{ fontSize: '16px' }}>{item.activityTitle}</Text>
                                                        <Space>
                                                            <CalendarOutlined style={{ color: '#6B7280' }}/>
                                                            <Text type="secondary">Старт: {new Date(item.startTime).toLocaleString()}</Text>
                                                        </Space>
                                                    </Space>
                                                ))}
                                            </div>
                                        </Space>
                                    </Col>

                                    <Col xs={24} md={8} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                        <Text strong style={{ fontSize: '24px', color: '#1F2937', marginBottom: '24px', display: 'block' }}>
                                            {order.totalAmount?.toLocaleString()} ₽
                                        </Text>
                                        
                                        <Space direction="vertical" style={{ width: '100%', alignItems: 'flex-end' }}>
                                            {isPending && (
                                                <Button size="large" icon={<CheckCircleOutlined />} type="primary" onClick={() => updateStatus(orderId, 1)} style={{ borderRadius: '8px', width: '100%' }}>
                                                    Подтвердить
                                                </Button>
                                            )}
                                            {isConfirmed && (
                                                <Button size="large" icon={<DollarOutlined />} onClick={() => updateStatus(orderId, 2)} style={{ borderColor: '#10B981', color: '#10B981', borderRadius: '8px', width: '100%' }}>
                                                    Отметить оплату
                                                </Button>
                                            )}
                                            {(isPending || isConfirmed) && (
                                                <Popconfirm title="Точно отменить заказ? Места вернутся клиентам." onConfirm={() => updateStatus(orderId, 3)} okText="Да" cancelText="Нет">
                                                    <Button size="large" danger type="text" icon={<CloseCircleOutlined />} style={{ width: '100%', marginTop: '8px' }}>
                                                        Отменить заявку
                                                    </Button>
                                                </Popconfirm>
                                            )}
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    }}
                />
            )}
        </div>
    );
};

export default SellerOrdersPage;