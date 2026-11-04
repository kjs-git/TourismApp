import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Card, Button, Typography, Descriptions, List, Spin, 
    message, Divider, Space, Modal, Table, Form, 
    DatePicker, InputNumber, Rate, Input, Avatar, Carousel, Row, Col, Tag,
    Upload, Image, Popconfirm
} from 'antd';
import { 
    ArrowLeftOutlined, TeamOutlined, PlusCircleOutlined, 
    CalendarOutlined, UserOutlined, MessageOutlined, StarOutlined,
    ExclamationCircleFilled, EnvironmentOutlined, UploadOutlined
} from '@ant-design/icons';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

// === ВАЖНО: Импортируем наш новый компонент с кнопкой ИИ ===
import AiDescriptionButton from "../components/AiDescriptionButton";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const ActivityDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [form] = Form.useForm();
    const [reviewForm] = Form.useForm();
    
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    
    const [participantData, setParticipantData] = useState({ title: '', items: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [partLoading, setPartLoading] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [activityRes, reviewsRes] = await Promise.all([
                api.get(`/Activities/${id}`),
                api.get(`/Reviews/${id}`)
            ]);
            
            setActivity(activityRes.data);
            const reviewsData = Array.isArray(reviewsRes.data) ? reviewsRes.data : (reviewsRes.data?.$values || []);
            setReviews(reviewsData);
        } catch (error) {
            console.error("Error fetching data:", error);
            message.error('Ошибка загрузки данных');
            navigate('/activities');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const handleAddReview = async (values) => {
        try {
            setSubmittingReview(true);
            
            const formData = new FormData();
            formData.append('activityId', id);
            formData.append('rating', values.rating);
            formData.append('comment', values.comment);

            if (values.images && values.images.length > 0) {
                values.images.forEach(fileObj => {
                    formData.append('images', fileObj.originFileObj);
                });
            }

            await api.post('/Reviews', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            message.success('Отзыв опубликован!');
            reviewForm.resetFields();
            
            const res = await api.get(`/Reviews/${id}`);
            setReviews(Array.isArray(res.data) ? res.data : (res.data?.$values || []));
        } catch (error) {
            message.error('Не удалось отправить отзыв');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleViewParticipants = async (scheduleId) => {
        try {
            setPartLoading(true);
            setIsModalOpen(true);
            const response = await api.get(`/Orders/schedule/${scheduleId}/participants`);
            
            const data = response.data;
            setParticipantData({
                title: data.activityTitle || 'Список участников',
                items: data.participants?.$values || data.participants || []
            });
        } catch (error) {
            message.error('Ошибка доступа к списку участников');
            setIsModalOpen(false);
        } finally {
            setPartLoading(false);
        }
    };

    const handleAddToRoute = async (scheduleId) => {
        if (user?.role === 'guest') {
            message.info('Для бронирования тура необходимо войти в аккаунт или зарегистрироваться');
            navigate('/login');
            return;
        }

        try {
            const [cartRes, ordersRes] = await Promise.all([
                api.get('/Routes'),
                api.get('/Orders/my')
            ]);

            const targetId = String(scheduleId).toLowerCase();
            const cartItems = cartRes.data?.items || [];
            const cartScheduleIds = cartItems.map(item => String(item.scheduleId || '').toLowerCase());

            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.$values || []);
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

            const isAlreadyInCart = cartScheduleIds.includes(targetId);
            const isAlreadyOrdered = orderedScheduleIds.includes(targetId);

            if (isAlreadyOrdered || isAlreadyInCart) {
                confirm({
                    title: 'Повторное бронирование',
                    icon: <ExclamationCircleFilled style={{ color: '#faad14' }}/>,
                    content: 'У вас уже есть оплаченная бронь или этот тур лежит в корзине на это же время. Забронировать еще одно место?',
                    okText: 'Да, добавить еще',
                    cancelText: 'Отмена',
                    onOk: async () => {
                        await proceedToCart(scheduleId);
                    }
                });
            } else {
                await proceedToCart(scheduleId);
            }
        } catch (error) {
            await proceedToCart(scheduleId);
        }
    };

    const proceedToCart = async (scheduleId) => {
        try {
            await api.post('/Routes/items', { scheduleId });
            message.success('Добавлено в вашу корзину!');
        } catch (error) {
            message.error('Ошибка бронирования. Возможно, места закончились.');
        }
    };

    const handleAddSchedule = async (values) => {
        try {
            const payload = {
                startTime: values.timeRange[0].toISOString(),
                endTime: values.timeRange[1].toISOString(),
                totalSeats: values.totalSeats
            };
            await api.post(`/Activities/${id}/schedules`, payload);
            message.success('Расписание успешно добавлено');
            setIsScheduleModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error('Не удалось создать расписание');
        }
    };

    const handleDeleteActivity = async () => {
        try {
            await api.delete(`/Activities/${id}`);
            message.success('Тур успешно удален');
            navigate('/activities'); 
        } catch (error) {
            message.error('Не удалось удалить тур. Проверьте права.');
        }
    };

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '150px auto' }} />;

    return (
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 24, fontSize: '16px' }}>
                Назад к списку
            </Button>
            
            <div style={{ marginBottom: '40px' }}>
                <Title level={1} style={{ fontSize: '32px', marginBottom: '16px' }}>{activity?.title}</Title>
            
                {activity?.imageUrls && activity.imageUrls.length > 0 ? (
                    <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Carousel autoplay arrows style={{ borderRadius: '16px' }}>
                            {activity.imageUrls.map((url, index) => (
                                <div key={index}>
                                    <img 
                                        src={url.replace('https://localhost:7015', '')}
                                        alt={`Фото тура ${index + 1}`} 
                                        style={{ width: '100%', height: '500px', objectFit: 'cover' }} 
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                ) : (
                    <div style={{ height: '300px', background: '#e5e7eb', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text type="secondary">Нет фотографий</Text>
                    </div>
                )}
            </div>

            <Row gutter={[48, 48]}>
                <Col xs={24} md={16}>
                    <Title level={3} style={{ marginBottom: '24px' }}>Об этом туре</Title>
                    <Paragraph style={{ fontSize: '16px', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                        {activity?.description}
                    </Paragraph>

                    <div style={{ marginBottom: '40px' }}>
                        <AiDescriptionButton activityId={activity?.id} />
                    </div>
                    
                    <Divider />
                    
                    <Title level={3} style={{ marginBottom: '24px' }}><MessageOutlined /> Отзывы ({reviews.length})</Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={reviews}
                        locale={{ emptyText: 'Отзывов пока нет. Станьте первым!' }}
                        renderItem={(item) => (
                            <List.Item style={{ padding: '24px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <List.Item.Meta
                                    avatar={<Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#D1D5DB' }} />}
                                    title={
                                        <Space direction="vertical" size={2}>
                                            <Text strong style={{ fontSize: '16px' }}>{item.userFullName || item.userEmail || "Анонимный путешественник"}</Text>
                                            <Rate disabled value={item.rating} style={{ fontSize: 14, color: '#FBBF24' }} />
                                        </Space>
                                    }
                                    description={
                                        <div>
                                            <Text style={{ color: '#374151', fontSize: '15px', marginTop: '8px', display: 'block' }}>
                                                {item.comment}
                                            </Text>
                                            
                                            {item.imageUrls && item.imageUrls.length > 0 && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <Image.PreviewGroup>
                                                        <Space size={8} wrap>
                                                            {item.imageUrls.map((url, i) => (
                                                                <Image 
                                                                    key={i} 
                                                                    src={url.replace('https://localhost:7015', '')} 
                                                                    width={80} 
                                                                    height={80} 
                                                                    style={{ objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB' }} 
                                                                />
                                                            ))}
                                                        </Space>
                                                    </Image.PreviewGroup>
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />

                    {user?.role === 0 && (
                        <div style={{ marginTop: '40px', padding: '32px', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                            <Title level={4} style={{ marginBottom: '24px' }}>Поделитесь впечатлениями</Title>
                            <Form form={reviewForm} layout="vertical" onFinish={handleAddReview}>
                                <Form.Item name="rating" label="Ваша оценка" rules={[{ required: true, message: 'Выберите количество звезд' }]}>
                                    <Rate style={{ color: '#FBBF24' }} />
                                </Form.Item>
                                
                                <Form.Item name="comment" label="Ваш комментарий" rules={[{ required: true, message: 'Напишите хотя бы пару слов' }]}>
                                    <TextArea rows={4} placeholder="Расскажите, что вам понравилось больше всего..." style={{ borderRadius: '8px' }}/>
                                </Form.Item>
                                
                                <Form.Item 
                                    name="images" 
                                    label="Фотографии (необязательно)" 
                                    valuePropName="fileList" 
                                    getValueFromEvent={normFile}
                                >
                                    <Upload 
                                        beforeUpload={() => false} 
                                        multiple 
                                        listType="picture" 
                                        accept="image/*"
                                    >
                                        <Button icon={<UploadOutlined />}>Прикрепить фото</Button>
                                    </Upload>
                                </Form.Item>

                                <Button type="primary" size="large" htmlType="submit" loading={submittingReview} style={{ borderRadius: '8px', marginTop: '8px' }}>
                                    Опубликовать отзыв
                                </Button>
                            </Form>
                        </div>
                    )}

                    {user?.role === 'guest' && (
                        <div style={{ marginTop: '40px', padding: '32px', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
                            <Title level={4} style={{ marginBottom: '8px' }}>Поделитесь впечатлениями</Title>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '24px', fontSize: '16px' }}>
                                Только зарегистрированные путешественники могут оставлять отзывы и прикреплять фотографии.
                            </Text>
                            <Button type="primary" size="large" onClick={() => navigate('/login')} style={{ borderRadius: '8px' }}>
                                Войти или зарегистрироваться
                            </Button>
                        </div>
                    )}
                </Col>

                <Col xs={24} md={8}>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <Card style={{ borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: 'none' }}>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <Text style={{ fontSize: '24px', fontWeight: 700, color: '#1F2937' }}>
                                    {activity?.basePrice?.toLocaleString()} ₽
                                </Text>
                                <Text type="secondary" style={{ fontSize: '16px' }}> / чел.</Text>
                            </div>

                            <Descriptions column={1} size="small" style={{ marginBottom: '24px' }}>
                                <Descriptions.Item label="Макс. группа">{activity?.maxParticipants} чел.</Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            {user?.role === 1 ? (
                                <>
                                    <Title level={5} style={{ marginBottom: '16px' }}>Управление туром</Title>
                                    <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
                                        <Button 
                                            type="dashed" block icon={<PlusCircleOutlined />} 
                                            onClick={() => setIsScheduleModalOpen(true)}
                                            style={{ height: '44px', borderRadius: '8px' }}
                                        >
                                            Добавить расписание
                                        </Button>
                                        <Button 
                                            block 
                                            onClick={() => navigate(`/edit-activity/${id}`)}
                                            style={{ height: '44px', borderRadius: '8px' }}
                                        >
                                            Редактировать тур
                                        </Button>
                                        <Popconfirm
                                            title="Удалить этот тур?"
                                            description="Это действие необратимо. Все расписания будут удалены."
                                            okText="Удалить"
                                            cancelText="Отмена"
                                            onConfirm={handleDeleteActivity}
                                        >
                                            <Button danger block style={{ height: '44px', borderRadius: '8px' }}>
                                                Удалить тур полностью
                                            </Button>
                                        </Popconfirm>
                                    </Space>
                                </>
                            ) : (
                                <Title level={5} style={{ marginBottom: '16px' }}>Доступные даты</Title>
                            )}

                            <List
                                dataSource={activity?.schedules || []}
                                locale={{ emptyText: 'Нет доступных дат' }}
                                renderItem={(item) => (
                                    <div style={{ 
                                        padding: '16px', 
                                        border: '1px solid #E5E7EB', 
                                        borderRadius: '12px', 
                                        marginBottom: '12px',
                                        background: item.availableSeats === 0 ? '#F3F4F6' : '#fff'
                                    }}>
                                        <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: '12px' }}>
                                            <Text strong style={{ fontSize: '15px' }}>
                                                <CalendarOutlined style={{ marginRight: '8px' }}/> 
                                                {new Date(item.startTime).toLocaleDateString()}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                                {new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </Text>
                                            {item.availableSeats > 0 ? (
                                                <Tag color="blue" style={{ marginTop: '4px' }}>Мест: {item.availableSeats}</Tag>
                                            ) : (
                                                <Tag color="default" style={{ marginTop: '4px' }}>Мест нет</Tag>
                                            )}
                                        </Space>

                                        {(user?.role === 0 || user?.role === 'guest') && (
                                            <Button 
                                                type="primary" 
                                                block 
                                                size="large"
                                                style={{ borderRadius: '8px' }}
                                                onClick={() => handleAddToRoute(item.id)} 
                                                disabled={item.availableSeats === 0}
                                            >
                                                Забронировать
                                            </Button>
                                        )}

                                        {user?.role === 1 && (
                                            <Button 
                                                icon={<TeamOutlined />} 
                                                block
                                                onClick={() => handleViewParticipants(item.id)}
                                            >
                                                Участники
                                            </Button>
                                        )}
                                    </div>
                                )}
                            />
                        </Card>
                    </div>
                </Col>
            </Row>

            <Modal 
                title={<Space><TeamOutlined /> {participantData.title}</Space>} 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)} 
                footer={null}
                width={700}
            >
                <Table 
                    loading={partLoading}
                    dataSource={participantData.items}
                    rowKey={(record) => record.email || Math.random()}
                    columns={[
                        { title: 'ФИО', dataIndex: 'fullName', key: 'fullName', render: (t) => <b>{t}</b> },
                        { title: 'Email', dataIndex: 'email', key: 'email', render: (t) => <Text copyable>{t}</Text> },
                        { title: 'Дата брони', dataIndex: 'orderDate', key: 'date', render: (d) => new Date(d).toLocaleDateString() }
                    ]}
                />
            </Modal>

            <Modal 
                title="Создать новое время тура" 
                open={isScheduleModalOpen} 
                onCancel={() => setIsScheduleModalOpen(false)} 
                onOk={() => form.submit()}
                okText="Создать"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical" onFinish={handleAddSchedule}>
                    <Form.Item name="timeRange" label="Интервал проведения" rules={[{ required: true }]}>
                        <DatePicker.RangePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="totalSeats" label="Количество мест в группе" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );  
};

export default ActivityDetailsPage;