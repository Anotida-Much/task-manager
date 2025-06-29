import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { RegisterRequest, LoginRequest, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<RegisterRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(255).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<LoginRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

export const validateCreateTask = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<CreateTaskRequest>({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(1000).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

export const validateUpdateTask = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<UpdateTaskRequest>({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(1000).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
}; 