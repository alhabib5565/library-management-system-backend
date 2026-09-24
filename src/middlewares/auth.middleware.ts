import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../modules/auth/auth.utils';
import { userRepository } from '../modules/users/user.repository';

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = verifyAccessToken(token.split(' ')[1] as string);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userRepository.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden access' });
    }
    req.user = user;
    next();
  };
};

export default auth;
