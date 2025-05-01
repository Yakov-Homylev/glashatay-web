import apiClient from '@/api/index';
import type { IAuthData } from '@/types/request';
import type { IUser } from '@/types/user';

export async function login(login: string, password: string): Promise<IAuthData> {
    const body = {
        login,
        password,
    };
    const response = await apiClient.post('/auth/login', body);
    return response.data.result.tokens;
}

export async function logout(): Promise<void> {
    const response = await apiClient.post('/auth/logout');
    return response.data.result;
}

export async function refreshAuthToken(refreshToken: string): Promise<IAuthData> {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data.result.tokens;
}

export async function getIAMData(): Promise<{ user: IUser }> {
    const response = await apiClient.get('/user/iam');
    return response.data.result;
}

export async function registration(login: string, password: string, username: string): Promise<IAuthData> {
    const body = {
        login,
        password,
        username,
    };
    const response = await apiClient.post('/auth/registration', body);
    return response.data.result.tokens;
}

export async function getUserInfo(id: string): Promise<{ user: IUser }> {
    const response = await apiClient.get(`/user/list/${id}`);
    return response.data.result;
}

export async function updateSelfInfo(username: string, about: string, id: string): Promise<{ user: IUser }> {
    const body = { username, about };
    const response = await apiClient.patch(`/user/list/${id}`, body);
    return response.data.result;
}
