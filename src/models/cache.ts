import IPost from './post';

export default interface Cache {
    allPosts: IPost[];
    textPages: ITextPage[];
}

export interface ITextPage {
    id: number;
    header: string;
    type: string;
    body: string | InnerHTML;
    author: string;
    date: Date | string;
}
