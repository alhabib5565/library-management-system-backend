import bcrypt from 'bcrypt';

export const comparePassword = (plaintextPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plaintextPassword, hashedPassword)
}

