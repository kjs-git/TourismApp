import React, { useEffect, useState } from 'react';
import { Spin, message, Row, Col, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';
import ActivityCard from '../components/ActivityCard'; 

const { Title, Text } = Typography;

const ActivitiesPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const { user } = useAuthStore();

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const endpoint = user?.role === 1 ? '/Activities/my-activities' : '/Activities';
            const response = await api.get(endpoint);
            
            const data = Array.isArray(response.data) 
                ? response.data 
                : (response.data?.$values || []);

            setActivities(data);
        } catch (error) {
            console.error("Ошибка загрузки активностей:", error);
            message.error('Не удалось загрузить список активностей');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const filteredActivities = activities.filter(activity => 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* */}
            <div style={{ marginBottom: '48px', textAlign: 'center', paddingTop: '24px' }}>
                <Title level={1} style={{ fontSize: '36px', marginBottom: '16px', letterSpacing: '-0.5px' }}>
                    {user?.role === 1 ? "Управление моими турами" : "Откройте для себя Камчатку"}
                </Title>
                <Text style={{ fontSize: '18px', color: '#6B7280' }}>
                    {user?.role === 1 
                        ? "Редактируйте программы и следите за своими предложениями" 
                        : "Незабываемые впечатления, авторские маршруты и лучшие гиды"}
                </Text>
                
                {/* */}
                <div style={{ maxWidth: '600px', margin: '32px auto 0' }}>
                    <Input 
                        size="large" 
                        placeholder="Найти тур, например: Вулкан..." 
                        prefix={<SearchOutlined style={{ color: '#9CA3AF' }} />}
                        value={searchQuery} // Привязываем значение к состоянию
                        onChange={(e) => setSearchQuery(e.target.value)} // Обновляем состояние при вводе
                        style={{ 
                            borderRadius: '12px', 
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                            borderWidth: 0,
                            padding: '12px 24px'
                        }}
                    />
                </div>
            </div>

            {/* */}
            {filteredActivities.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '60px', color: '#9CA3AF' }}>
                    {searchQuery 
                        ? <Text>Упс, по запросу «{searchQuery}» ничего не найдено.</Text>
                        : <Text>Упс, пока здесь нет доступных активностей.</Text>
                    }
                </div>
            ) : (
                <Row gutter={[24, 32]}>
                    {filteredActivities.map(activity => (
                        <Col xs={24} sm={12} md={8} key={activity.id}>
                            <ActivityCard activity={activity} userRole={user?.role} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ActivitiesPage;