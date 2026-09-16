// Reset token save করা (database এ)

import pool from '../../config/database';

// কেন database এ রাখি: token expire চেক করার জন্য এবং একবার use হলে delete করার জন্য
export const saveResetToken = async (
  userId: string,
  hashedToken: string | null,
  expiresAt: Date | null
): Promise<void> => {
  const query = `
    UPDATE users 
    SET reset_password_token = $2, reset_password_expires = $3
    WHERE id = $1 
  `;

  await pool.query(query, [userId, hashedToken, expiresAt]);
};

export const findValidResetToken = async (
  hashedToken: string
): Promise<{ user_id: string } | null> => {
  const query = `
    SELECT id as user_id 
    FROM users 
    WHERE reset_password_token = $1 AND reset_password_expires > NOW()
  `;
  const result = await pool.query(query, [hashedToken]);
  return result.rows[0] || null;
};

// User এর password update করা
export const updateUserPassword = async (userId: string, hashedPassword: string): Promise<void> => {
  const query = `
    UPDATE users 
    SET password = $1, updated_at = NOW() 
    WHERE id = $2
  `;
  await pool.query(query, [hashedPassword, userId]);
};
