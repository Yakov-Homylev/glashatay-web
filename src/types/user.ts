export enum Roles {
    User = 'user',
    Moderator = 'moderator',
    Admin = 'admin',
}

export interface IUser {
    id: string;
    login: string;
    role: Roles;
    username: string;
    about?: string;
    avatar?: string;
    createdAt?: Date;
}
