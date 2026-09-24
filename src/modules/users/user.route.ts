import { Router } from 'express';
import { validateData } from '../../middlewares/validateData';
import { userController } from './user.controller';
import { createUserSchema, updateUserSchema } from './user.validation';

const router = Router();

// Routes
router.post(
  '/',
  validateData(createUserSchema),
  userController.createUser
  /*
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/components/schemas/CreateUser" }
  }
  #swagger.responses[201] = {
    schema: { $ref: "#/components/schemas/CreateUserResponse" }
  }
  */
);
router.get(
  '/',
  userController.getAllUsers
  /*
 #swagger.parameters['$ref'] = [
      '#/components/parameters/Page',
      '#/components/parameters/Limit',
      '#/components/parameters/Search'
    ]
 #swagger.responses[200] = {
    schema: { $ref: "#/components/schemas/UserListResponse" }
  }
  */
);
router.get(
  '/:id',
  userController.getUserById
  /*
 #swagger.responses[200] = {
    schema: { $ref: "#/components/schemas/UserResponse" }
  }
  */
);
router.put(
  '/:id',
  validateData(updateUserSchema),
  userController.updateUser /*
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/components/schemas/UpdateUser" }
  }
  #swagger.responses[200] = {
    schema: { $ref: "#/components/schemas/UpdateUserResponse" }
  }
  */
);
router.delete('/:id', userController.deleteUser);

export const userRoutes = router;
