import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    
    user: (() => {
        try {
            const u = localStorage.getItem('user');
            if (u && u !== "undefined") {
                const parsedUser = JSON.parse(u);
                // Если это не гость, то страхуемся и переводим роль в число
                if (parsedUser.role !== 'guest') {
                    parsedUser.role = Number(parsedUser.role); 
                }
                return parsedUser;
            }
            return null;
        } catch { return null; }
    })(),

    login: (token, user) => {
        if (!token) return;
        if (user.role !== 'guest') {
            user.role = Number(user.role); // Страховка при записи
        }
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user || {}));
        set({ token, user });
    },

    loginAsGuest: () => {
        const guestUser = { role: 'guest', name: 'Анонимный путешественник' };
        localStorage.setItem('user', JSON.stringify(guestUser));
        localStorage.removeItem('token'); // У гостя нет токена
        set({ token: null, user: guestUser });
    },

    logout: () => {
        localStorage.clear();
        set({ token: null, user: null });
        window.location.href = '/login'; 
    }
}));