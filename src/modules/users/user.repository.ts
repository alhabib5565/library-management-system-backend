import pool from '../../config/database';
import { USER_ROLE } from './user.constants';
import { IUser } from './user.interface';

const createUser = async (userData: IUser): Promise<IUser> => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [
    userData.name,
    userData.email,
    userData.password,
    userData.role || USER_ROLE.LIBRARIAN,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Find user by ID
const findUserById = async (id: string): Promise<IUser | null> => {
  const query = `
    SELECT 
      user_id, 
      name, 
      email, 
      role 
    FROM users 
    WHERE user_id = $1
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// Find user by email
const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const query = `
    SELECT 
      user_id, 
      name, 
      email, 
      role 
    FROM users 
    WHERE email = $1
    `;
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

// Get all users with pagination
const findAllUsers = async (limit: number = 10, page: number = 1): Promise<IUser[]> => {
  const query = `
    SELECT 
      user_id, 
      name, 
      email, 
      role 
    FROM users 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, page]);
  return result.rows;
};

// Update user
const updateUser = async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // Dynamic query building
  if (userData.name !== undefined) {
    fields.push(`name = $${paramCount++}`);
    values.push(userData.name);
  }
  if (userData.email !== undefined) {
    fields.push(`email = $${paramCount++}`);
    values.push(userData.email);
  }
  if (userData.role !== undefined) {
    fields.push(`role = $${paramCount++}`);
    values.push(userData.role);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE users 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// Delete user
const deleteUser = async (id: string): Promise<boolean> => {
  const query = `
  DELETE FROM users 
  WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
};

// Count total users
const countUsers = async (): Promise<number> => {
  const query = `SELECT COUNT(user_id) as total FROM users`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].total);
};

export const userRepository = {
  createUser,
  findUserById,
  findUserByEmail,
  findAllUsers,
  updateUser,
  deleteUser,
  countUsers,
};
