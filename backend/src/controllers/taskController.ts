import { Request, Response } from 'express';
import { TaskModel } from '../models/Task';

export const getTasks = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { status, priority, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const { tasks, total } = await TaskModel.findByUserIdPaginated(
      req.user.userId,
      status as string,
      priority as string,
      pageNum,
      limitNum
    );

    res.json({
      success: true,
      data: tasks,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      message: 'Tasks retrieved successfully'
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
    return;
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const task = await TaskModel.create(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
    return;
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    const taskId = parseInt(idParam);
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID'
      });
    }

    const task = await TaskModel.update(taskId, req.user.userId, req.body);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
    return;
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    const taskId = parseInt(idParam);
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID'
      });
    }

    const deleted = await TaskModel.delete(taskId, req.user.userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
    return;
  }
}; 