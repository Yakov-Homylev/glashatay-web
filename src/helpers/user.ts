import { Roles } from '@/types/user';

export function setRoleDescription(role: Roles) {
    switch (role) {
        case Roles.User:
            return 'Людин';
        case Roles.Moderator:
            return 'Огнищанин';
        case Roles.Admin:
            return 'Княжий тиун';
        default:
            return 'Посадский';
    }
}
