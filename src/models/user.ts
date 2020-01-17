export default interface AppUser {
    id: number;
    login: string;
    name: string;
    email: string;
    password: string;
    role: number;
}

export const Guest: Partial<AppUser> = {
    name: 'Guest',
    role: 0
};
