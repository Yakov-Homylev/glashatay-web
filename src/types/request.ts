import { Category } from '@/types/ad';

export interface IReqFilter {
    categories?: string;
    page?: number;
    limit?: number;
    query?: string;
}

export interface IReqAddAd {
    title: string;
    description: string;
    category: Category;
}

export interface IAuthData {
    accessToken: string;
    refreshToken: string;
}
