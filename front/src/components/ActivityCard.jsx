import React from 'react';
import { Card, Typography, Space, Button } from 'antd'; 
import { EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography; 

const ActivityCard = ({ activity, userRole }) => {
    const navigate = useNavigate();

    // Отсекаем localhost, если он пришел из БД
    const imageUrl = activity.imageUrls?.[0] 
        ? activity.imageUrls[0].replace('https://localhost:7015', '') 
        : 'https://placehold.co/600x400/eeeeee/999999?text=Нет+фото';

    return (
        <Card
            hoverable
            style={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                border: 'none',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            bodyStyle={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'; 
                e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0, 0, 0, 0.05)';
            }}
            cover={
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img
                        alt={activity.title}
                        src={imageUrl}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        backdropFilter: 'blur(4px)',
                        fontWeight: '700',
                        fontSize: '16px',
                        color: '#1F2937',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        от {activity.basePrice?.toLocaleString()} ₽
                    </div>
                </div>
            }
        >
            <Space direction="vertical" size={4} style={{ width: '100%', flex: 1 }}>
                <Space style={{ color: '#6B7280', fontSize: '13px' }}>
                    <EnvironmentOutlined />
                    <span>Камчатка</span>
                </Space>
                
                <Title level={4} style={{ margin: '4px 0 20px 0', fontSize: '18px', lineHeight: '1.4' }} ellipsis={{ rows: 2 }}>
                    {activity.title}
                </Title>
                
            </Space>

            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <Button 
                    type="primary" 
                    style={{ flex: 1, borderRadius: '8px' }}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                >
                    Подробнее
                </Button>
                
                {userRole === 1 && (
                    <Button 
                        icon={<EditOutlined />}
                        style={{ borderRadius: '8px' }}
                        onClick={() => navigate(`/edit-activity/${activity.id}`)}
                    />
                )}
            </div>
        </Card>
    );
};

export default ActivityCard;