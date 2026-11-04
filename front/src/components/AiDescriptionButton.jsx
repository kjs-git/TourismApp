import React, { useState } from 'react';
import api from '../api/axiosInstance'; 
import { Button, Modal, Spin, Typography, message, Alert } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

const AiDescriptionButton = ({ activityId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [aiText, setAiText] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const fetchAiDescription = async () => {
        setIsModalVisible(true);
        setErrorMsg(""); 
        
        if (aiText) return; 

        setIsLoading(true);
        console.log(`[AI] Отправка запроса на бэкенд для тура ID: ${activityId}`);

        try {
            const response = await api.get(`/Activities/${activityId}/ai-description`);
            console.log("[AI] Успешный ответ от сервера:", response.data);
            
            if (response.data && response.data.expandedDescription) {
                setAiText(response.data.expandedDescription);
            } else {
                setErrorMsg("ИИ вернул пустой ответ. Попробуйте еще раз.");
            }
        } catch (error) {
            console.error("[AI] Ошибка сетевого запроса:", error);
            const serverError = error.response?.data?.message || error.message;
            setErrorMsg(`Ошибка: ${serverError}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button 
                type="dashed" 
                icon={<RobotOutlined />} 
                onClick={fetchAiDescription}
                style={{ marginTop: '10px' }}
            >
                Узнать подробности у ИИ
            </Button>

            <Modal 
                title="Краеведческая справка от нейросети" 
                open={isModalVisible} 
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
                        Понятно
                    </Button>
                ]}
                width={700}
            >
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <Spin size="large" tip="Связываемся с нейросетью..." />
                    </div>
                ) : errorMsg ? (
                    <Alert message="Сбой генерации" description={errorMsg} type="error" showIcon />
                ) : (
                    <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '16px', lineHeight: '1.6' }}>
                        {aiText || "Нажмите кнопку, чтобы сгенерировать описание."}
                    </Paragraph>
                )}
            </Modal>
        </>
    );
};

export default AiDescriptionButton;