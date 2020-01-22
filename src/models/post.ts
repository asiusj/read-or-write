import AppUser from './user';

export default interface IPost {
    id: number;
    userId: number;
    author: AppUser;
    title: string;
    description: string;
    fullText: string | InnerHTML;
    createdAt: Date | string;
    updatedAt: Date | string;
    likes: number;
    usersLiked: number[];
}
