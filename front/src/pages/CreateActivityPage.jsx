import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Upload, Typography, Space, Row, Col, Divider } from 'antd';
import { InboxOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';

const { TextArea } = Input;
// 👇 ИСПРАВЛЕНИЕ ЗДЕСЬ: Добавили Paragraph 👇
const { Title, Text, Paragraph } = Typography; 
const { Dragger } = Upload;

const CreateActivityPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams(); 
    const isEditMode = !!id;
    
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Подгрузка данных, если это режим редактирования
    useEffect(() => {
        if (isEditMode) {
            const fetchActivity = async () => {
                try {
                    const res = await api.get(`/Activities/${id}`);
                    const data = res.data;
                    
                    form.setFieldsValue({
                        title: data.title,
                        basePrice: data.basePrice,
                        maxParticipants: data.maxParticipants,
                        description: data.description,
                    });

                    if (data.imageUrls && data.imageUrls.length > 0) {
                        setFileList(data.imageUrls.map((url, i) => ({
                            uid: `-${i}`,
                            name: `image-${i}`,
                            status: 'done',
                             url: url// Порт бэкенда
                        })));
                    }
                } catch (error) {
                    message.error("Не удалось загрузить данные тура");
                }
            };
            fetchActivity();
        }
    }, [id, form]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            
            // Вытаскиваем URL загруженных картинок
            const finalImageUrls = fileList
                .filter(file => file.status === 'done')
                .map(file => file.response ? file.response.url : file.url);

            const payload = {
                title: values.title,
                basePrice: values.basePrice,
                maxParticipants: values.maxParticipants,
                description: values.description,
                imageUrls: finalImageUrls,
                attributes: {},
                includedInPrice: []
            };

            if (isEditMode) {
                await api.put(`/Activities/${id}`, payload);
                message.success('Тур успешно обновлен!');
            } else {
                await api.post('/Activities', payload);
                message.success('Тур успешно создан!');
            }
            navigate('/activities');
        } catch (error) {
            message.error('Ошибка сохранения (проверьте данные и права)');
        } finally {
            setLoading(false);
        }
    };

    // Настройки для компонента Upload (загрузка файлов)
    const token = localStorage.getItem('token');
    const uploadProps = {
        name: 'file',
        multiple: true,
        action: '/api/Activities/upload-image', // Порт бэкенда
        headers: { Authorization: `Bearer ${token}` },
        listType: 'picture-card',
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '60px' }}>
            <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)} 
                style={{ marginBottom: 24, fontSize: '16px' }}
            >
                Назад
            </Button>

            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0 }}>
                    {isEditMode ? "Редактирование тура" : "Создание нового тура"}
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    {isEditMode ? "Внесите изменения в программу и сохраните." : "Заполните все детали, чтобы привлечь больше путешественников."}
                </Text>
            </div>

            <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.05)' }}>
                <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                    
                    <Title level={4} style={{ marginBottom: '24px' }}>Основная информация</Title>
                    <Form.Item name="title" label="Название тура" rules={[{ required: true, message: 'Пожалуйста, введите название' }]}>
                        <Input placeholder="Например: Восхождение на Авачинский вулкан" />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="basePrice" label="Стоимость за человека (₽)" rules={[{ required: true, message: 'Укажите цену' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="5000" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="maxParticipants" label="Максимальный размер группы" rules={[{ required: true, message: 'Укажите размер группы' }]}>
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="12" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="description" label="Подробное описание">
                        <TextArea 
                            rows={6} 
                            placeholder="Опишите программу тура, маршрут, что нужно взять с собой и к чему быть готовым..." 
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Divider />

                    <Title level={4} style={{ marginBottom: '16px' }}>Медиагалерея</Title>
                    <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                        Загрузите яркие фотографии маршрута. Первая фотография станет обложкой тура в каталоге.
                    </Paragraph>
                    
                    <Form.Item>
                        <Dragger {...uploadProps} style={{ background: '#F9FAFB', borderColor: '#E5E7EB', borderRadius: '12px' }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined style={{ color: '#0057FF' }} />
                            </p>
                            <p className="ant-upload-text">Нажмите или перетащите файлы в эту область</p>
                            <p className="ant-upload-hint">
                                Поддерживается одиночная или массовая загрузка. Форматы: JPG, PNG.
                            </p>
                        </Dragger>
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                        <Space size="middle">
                            <Button size="large" onClick={() => navigate('/activities')}>Отмена</Button>
                            <Button type="primary" size="large" htmlType="submit" loading={loading} icon={<SaveOutlined />} style={{ padding: '0 40px' }}>
                                {isEditMode ? "Сохранить изменения" : "Опубликовать тур"}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default CreateActivityPage;