export enum Category {
    Common = 'common',
    Search = 'search',
    Trade = 'trade',
    General = 'general',
}

export interface ICategoryItem {
    value: Category;
    label: string;
}

interface ICreatedBy {
    username: string;
    id: string;
}

export interface IAd {
    id: string;
    title: string;
    description: string;
    category: Category;
    createdAt: string;
    createdBy: ICreatedBy;
}
