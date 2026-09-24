import pool from '../../config/database';
import { BOOK_STATUS } from './book.constant';
import { IBook, IBookQuery } from './book.interface';

const createBook = async (data: IBook): Promise<IBook> => {
  console.log(data, 'data');
  const query = `
    INSERT INTO books 
      (title, author, isbn, image, created_by, status)
    VALUES 
      ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [data.title, data.author, data.isbn, data.image, data.created_by, data.status];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getAllBooks = async ({ page = 1, limit = 10, search, status }: IBookQuery) => {
  const offset = (page - 1) * limit;

  const values: (string | number)[] = [];
  const conditions: string[] = [];

  if (search) {
    values.push(`%${search}%`);

    conditions.push(`
      (
        title ILIKE $${values.length}
        OR author ILIKE $${values.length}
        OR isbn ILIKE $${values.length}
      )
    `);
  }

  // Status filter
  if (status) {
    values.push(status);

    conditions.push(`status = $${values.length}`);
  } else {
    // Soft deleted books should not appear normally
    values.push('Deleted');

    conditions.push(`status != $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // LIMIT
  values.push(limit);
  const limitParam = values.length;

  // OFFSET
  values.push(offset);
  const offsetParam = values.length;

  const query = `
    SELECT 
      book_id,
      title,
      author,
      isbn,
      image,
      created_by,
      status,
      created_at,
      updated_at
    FROM books
    ${whereClause}
    ORDER BY created_at DESC, book_id DESC
    LIMIT $${limitParam}
    OFFSET $${offsetParam}
  `;

  const result = await pool.query(query, values);

  return result.rows;
};

const countBooks = async ({ search, status }: Pick<IBookQuery, 'search' | 'status'>) => {
  const values: string[] = [];
  const conditions: string[] = [];

  // Search
  if (search) {
    values.push(`%${search}%`);

    conditions.push(`
      (
        title ILIKE $${values.length}
        OR author ILIKE $${values.length}
        OR isbn ILIKE $${values.length}
      )
    `);
  }

  // Status filter
  if (status) {
    values.push(status);

    conditions.push(`status = $${values.length}`);
  } else {
    // Exclude soft deleted books
    values.push('Deleted');

    conditions.push(`status != $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT COUNT(*)::int AS total
    FROM books
    ${whereClause}
  `;

  const result = await pool.query(query, values);

  return result.rows[0].total;
};

const getBookById = async (id: string): Promise<IBook | null> => {
  const query = `
    SELECT 
      book_id,
      title,
      author,
      isbn,
      image,
      created_by,
      status,
      created_at,
      updated_at
    FROM books
    WHERE book_id = $1
      AND status != $2
  `;

  const values = [id, 'Deleted'];

  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
};

const getBookByISBN = async (isbn: string): Promise<IBook | null> => {
  const query = `
    SELECT 
      book_id,
      title,
      author,
      isbn,
      status
    FROM books
    WHERE isbn = $1
      AND status != $2
  `;

  const values = [isbn, 'Deleted'];

  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
};

const updateBook = async (id: string, data: Partial<IBook>): Promise<IBook | null> => {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (data.title !== undefined) {
    values.push(data.title);
    fields.push(`title = $${values.length}`);
  }

  if (data.author !== undefined) {
    values.push(data.author);
    fields.push(`author = $${values.length}`);
  }

  if (data.isbn !== undefined) {
    values.push(data.isbn);
    fields.push(`isbn = $${values.length}`);
  }

  if (data.image !== undefined) {
    values.push(data.image);
    fields.push(`image = $${values.length}`);
  }

  if (data.status !== undefined) {
    values.push(data.status);
    fields.push(`status = $${values.length}`);
  }

  if (fields.length === 0) {
    return getBookById(id);
  }

  fields.push('updated_at = NOW()');

  values.push(id);
  const idParam = values.length;

  const query = `
    UPDATE books
    SET ${fields.join(', ')}
    WHERE book_id = $${idParam}
      AND status != 'Deleted'
    RETURNING *
  `;

  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
};

const deleteBook = async (id: string): Promise<IBook | null> => {
  const query = `
    UPDATE books
    SET 
      status = ${BOOK_STATUS.INACTIVE},
      updated_at = NOW()
    WHERE book_id = $1
      AND status != ${BOOK_STATUS.INACTIVE}
    RETURNING *
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] ?? null;
};

export const bookRepository = {
  createBook,
  getAllBooks,
  countBooks,
  getBookById,
  getBookByISBN,
  updateBook,
  deleteBook,
};
