import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, ConfigProvider } from 'antd';
import AuthPage from './pages/AuthPage'; 
import RoutesPage from './pages/RoutesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetailsPage from './pages/ActivityDetailsPage';
import OrdersPage from './pages/OrdersPage'; 
import CreateActivityPage from './pages/CreateActivityPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useAuthStore } from './store/useAuthStore';
import './App.css'; // Убедитесь, что стили импортируются!

const { Header, Content } = Layout;

const premiumTheme = {
    token: {
        colorPrimary: '#0057FF',
        colorInfo: '#0057FF',
        colorSuccess: '#00B67A',
        colorTextBase: '#1F2937', 
        colorBgLayout: '#F9FAFB', 
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
        borderRadius: 12,
        wireframe: false,
    },
    components: {
        Button: {
            borderRadius: 8,
            controlHeight: 44,
            fontWeight: 600,
        },
        Card: {
            borderRadiusLG: 16,
            boxShadowTertiary: '0 12px 24px -6px rgba(0, 0, 0, 0.05)',
        },
        Menu: {
            itemBg: 'transparent',
            itemHoverColor: '#0057FF',
            itemSelectedColor: '#0057FF',
        },
        Layout: {
            headerBg: '#ffffff',
        }
    }
};

const NavigationMenu = () => {
    const location = useLocation();
    const { user } = useAuthStore();
    const role = user?.role; 
    
    const menuItems = [
        { key: '/', label: <Link to="/">Главная</Link> },
        { key: '/activities', label: <Link to="/activities">{role === 1 ? 'Мои туры' : 'Каталог туров'}</Link> },
    ];

    if (role === 1) {
        menuItems.push({ key: '/create-activity', label: <Link to="/create-activity">Создать тур</Link> });
        menuItems.push({ key: '/seller-orders', label: <Link to="/seller-orders">Заказы клиентов</Link> });
    }

    if (role === 0) {
        menuItems.push({ key: '/routes', label: <Link to="/routes">Моя корзина</Link> });
        menuItems.push({ key: '/orders', label: <Link to="/orders">Мои заказы</Link> });
    }

    if (role === 2) {
        menuItems.push({ 
            key: '/admin', 
            label: <Link to="/admin" style={{ color: '#722ED1', fontWeight: 'bold' }}>Панель управления</Link> 
        });
    }

    return (
        <Menu 
            mode="horizontal" 
            items={menuItems} 
            style={{ flex: 1, minWidth: 0, borderBottom: 'none', fontSize: '15px', fontWeight: 500 }} 
            selectedKeys={[location.pathname]} 
        />
    );
};

const MainLayout = ({ children }) => {
    const { user, logout } = useAuthStore();
    
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="app-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div className="logo-menu-wrapper" style={{ display: 'flex', flex: 1, alignItems: 'center', height: '100%' }}>
                    <div style={{ 
                        color: '#0057FF', 
                        fontWeight: 800, 
                        marginRight: '24px', 
                        fontSize: '22px',
                        letterSpacing: '-0.5px'
                    }}>
                        TourismApp
                    </div>
                    <NavigationMenu />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: '#4B5563', fontWeight: 500 }}>
                        <span className="user-email-text">
                            {user?.role === 'guest' ? 'Гость' : user?.email} 
                        </span>
                        <span style={{ color: '#9CA3AF', fontSize: '13px', marginLeft: '4px' }}>
                            {user?.role === 1 ? '(Гид)' : user?.role === 2 ? '(Админ)' : ''}
                        </span>
                    </span>
                    
                    {user?.role === 'guest' ? (
                        <Button type="primary" onClick={logout} style={{ fontWeight: 500 }}>Войти / Регистрация</Button>
                    ) : (
                        <Button type="default" onClick={logout} style={{ fontWeight: 500 }}>Выйти</Button>
                    )}
                </div>
            </Header>
            <Content style={{ padding: '40px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </Content>
        </Layout>
    );
};

const ProtectedRoute = ({ children, allowedRoles, allowGuest = false }) => {
    const { token, user } = useAuthStore();
    const isGuest = user?.role === 'guest';
    
    if (!token && !isGuest) return <Navigate to="/login" replace />;
    
    if (isGuest && !allowGuest) return <Navigate to="/" replace />;
    
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }
    
    return <MainLayout>{children}</MainLayout>;
};

function App() {
    const token = useAuthStore((state) => state.token);

    return (
        <ConfigProvider theme={premiumTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={!token ? <AuthPage /> : <Navigate to="/" />} />
                    
                    <Route path="/" element={
                        <ProtectedRoute allowGuest={true}>
                            <HomePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/activities" element={
                        <ProtectedRoute allowGuest={true}>
                            <ActivitiesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/activities/:id" element={
                        <ProtectedRoute allowGuest={true}>
                            <ActivityDetailsPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/create-activity" element={
                        <ProtectedRoute allowedRoles={[1]}>
                            <CreateActivityPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/seller-orders" element={ 
                        <ProtectedRoute allowedRoles={[1]}>
                            <SellerOrdersPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-activity/:id" element={
                        <ProtectedRoute allowedRoles={[1]}>
                             <CreateActivityPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/routes" element={
                        <ProtectedRoute allowedRoles={[0]}>
                            <RoutesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute allowedRoles={[0]}>
                            <OrdersPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;