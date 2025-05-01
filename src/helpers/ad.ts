import { Category } from '@/types/ad';
import type { ICategoryItem } from '@/types/ad';

export const categoryList: ICategoryItem[] = [
    { value: Category.Common, label: 'Общее' },
    { value: Category.Search, label: 'Поиск' },
    { value: Category.Trade, label: 'Торговля' },
    { value: Category.General, label: 'Княжий' },
];

export function getCategoryDescription(type: Category) {
    return categoryList.find((item) => item.value === type)?.label || '';
}

export function setIconByCategory(category: Category) {
    switch (category) {
        case Category.Common:
            return 'scroll';
        case Category.Search:
            return 'trace';
        case Category.Trade:
            return 'trade';
        case Category.General:
            return 'crown-shield';
        default:
            return 'scroll';
    }
}
