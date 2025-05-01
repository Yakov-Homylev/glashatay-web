import apiClient from '@/api/index';
import type { IReqFilter, IReqAddAd } from '@/types/request';

export async function getAdsList(filters: IReqFilter) {
    const params = {
        categories: filters?.categories || null,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        query: filters?.query || null,
    };
    const response = await apiClient.get('/ads/list', {
        params,
    });
    return response.data.result;
}

export async function getAdById(id: string) {
    const response = await apiClient.get(`/ads/list/${id}`);
    return response.data.result;
}

export async function addAd(ad: IReqAddAd) {
    const body = {
        ...(ad || {}),
    };
    const response = await apiClient.post(`/ads/create`, body);
    return response.data.result;
}

export async function deleteAd(id: string) {
    const response = await apiClient.delete(`/ads/delete/${id}`);
    return response.data.result;
}

export async function editAd(id: string, title: string, description: string) {
    const body = {
        title,
        description,
    };
    const response = await apiClient.patch(`/ads/list/${id}`, body);
    return response.data.result;
}
