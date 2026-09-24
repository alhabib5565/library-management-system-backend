import { TBookStatus } from './book.constant';

export interface IBook {
  book_id: string;
  title: string;
  author: string;
  isbn: string;
  image: string;
  created_by: string;
  status: TBookStatus;
  created_at: Date;
  updated_at: Date;
}
export interface IBookQuery {
  page?: number;
  limit?: number;
  search?: string | undefined;
  status?: string | undefined;
}
