import React, { useEffect, useState } from 'react';
import { Typography, Button, Row, Col, Card, Carousel, Space } from 'antd';
import { 
    CompassOutlined, 
    SafetyCertificateOutlined, 
    StarOutlined, 
    ControlOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/axiosInstance';
import '../App.css'; // Подключение стилей для классов главной страницы

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [heroImages, setHeroImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await api.get('/Activities');
                const data = Array.isArray(response.data) ? response.data : (response.data?.$values || []);
                
                const allImages = data.flatMap(activity => activity.imageUrls || []).filter(Boolean);
                
                const shuffled = allImages.sort(() => 0.5 - Math.random()).slice(0, 8);
                setHeroImages(shuffled);
            } catch (error) {
                console.error("Не удалось загрузить изображения для карусели", error);
            }
        };

        fetchImages();
    }, []);

    const features = [
        {
            icon: <CompassOutlined style={{ fontSize: '32px', color: '#0057FF' }} />,
            title: 'Авторские маршруты',
            desc: 'Никаких скучных шаблонов. Только уникальные локации, скрытые от массового туриста, и программы, созданные с душой.'
        },
        {
            icon: <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#0057FF' }} />,
            title: 'Безопасная сделка',
            desc: 'Прозрачная система бронирования. Оплата производится только после того, как гид подтвердит вашу заявку и забронирует места.'
        },
        {
            icon: <StarOutlined style={{ fontSize: '32px', color: '#0057FF' }} />,
            title: 'Честные отзывы',
            desc: 'Рейтинги формируются исключительно на основе впечатлений реальных путешественников, которые уже посетили тур.'
        },
        {
            icon: <ControlOutlined style={{ fontSize: '32px', color: '#0057FF' }} />,
            title: 'Удобство для гидов',
            desc: 'Мощная панель управления: создавайте расписания, контролируйте списки участников и управляйте статусами оплат в пару кликов.'
        }
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
            
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', marginBottom: '60px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                {heroImages.length > 0 ? (
                    <Carousel autoplay effect="fade" dots={false}>
                        {heroImages.map((url, idx) => (
                            <div key={idx}>
                                <div style={{ 
                                    height: '500px', 
                                    backgroundImage: `url(${url.replace('https://localhost:7015', '')})`, 
                                    backgroundSize: 'cover', 
                                    backgroundPosition: 'center' 
                                }} />
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <div style={{ height: '500px', backgroundColor: '#1F2937' }} />
                )}

                <div className="hero-overlay" style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <Title className="hero-title" style={{ color: '#ffffff', margin: 0, maxWidth: '700px', letterSpacing: '-1px' }}>
                        Откройте мир <br />незабываемых путешествий
                    </Title>
                    <Paragraph className="hero-desc" style={{ color: '#D1D5DB', maxWidth: '600px', marginTop: '20px', marginBottom: '40px', lineHeight: '1.6' }}>
                        TourismApp — это единая платформа, объединяющая увлеченных путешественников и профессиональных гидов Камчатки. 
                    </Paragraph>
                    <div>
                        <Button 
                            type="primary" 
                            size="large" 
                            onClick={() => navigate(user?.role === 1 ? '/create-activity' : '/activities')}
                            style={{ height: '56px', padding: '0 40px', fontSize: '18px', borderRadius: '12px' }}
                        >
                            {user?.role === 1 ? 'Создать новый тур' : 'Смотреть каталог'} <ArrowRightOutlined />
                        </Button>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <Title level={2} style={{ fontSize: '36px' }}>Почему выбирают TourismApp</Title>
                <Text type="secondary" style={{ fontSize: '18px' }}>Всё необходимое для идеального отдыха в одном месте</Text>
            </div>

            <Row gutter={[32, 32]}>
                {features.map((feature, idx) => (
                    <Col xs={24} sm={12} lg={6} key={idx}>
                        <Card 
                            bordered={false} 
                            style={{ height: '100%', background: 'transparent' }}
                            bodyStyle={{ padding: '20px 10px', textAlign: 'center' }}
                        >
                            <div style={{ 
                                width: '64px', height: '64px', margin: '0 auto 20px', 
                                background: '#E6F0FF', borderRadius: '16px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center' 
                            }}>
                                {feature.icon}
                            </div>
                            <Title level={4} style={{ marginBottom: '12px', fontSize: '20px' }}>{feature.title}</Title>
                            <Paragraph style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6' }}>
                                {feature.desc}
                            </Paragraph>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="cta-section" style={{ 
                marginTop: '80px', 
                background: '#F9FAFB', 
                borderRadius: '24px', 
                border: '1px solid #E5E7EB',
                textAlign: 'center'
            }}>
                <Title level={2} style={{ margin: '0 0 16px 0' }}>Готовы к новым впечатлениям?</Title>
                <Paragraph style={{ fontSize: '18px', color: '#4B5563', maxWidth: '600px', margin: '0 auto 32px' }}>
                    {user?.role === 1 
                        ? 'Расскажите о своих уникальных маршрутах тысячам потенциальных клиентов. Начните получать заявки уже сегодня.' 
                        : 'Присоединяйтесь к нашему комьюнити и бронируйте лучшие места в авторских турах.'}
                </Paragraph>
                <Space size="middle">
                    <Button 
                        type="primary" 
                        size="large" 
                        onClick={() => navigate(user?.role === 1 ? '/activities' : '/activities')}
                        style={{ height: '48px', padding: '0 32px', borderRadius: '8px' }}
                    >
                        {user?.role === 1 ? 'Управление турами' : 'Перейти к турам'}
                    </Button>
                    <Button 
                        size="large" 
                        onClick={() => navigate(user?.role === 1 ? '/seller-orders' : '/orders')}
                        style={{ height: '48px', padding: '0 32px', borderRadius: '8px' }}
                    >
                        {user?.role === 1 ? 'Заказы клиентов' : 'Моя история поездок'}
                    </Button>
                </Space>
            </div>

        </div>
    );
};

export default HomePage;