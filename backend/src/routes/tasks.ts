import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { validateCreateTask, validateUpdateTask } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All task routes are protected
router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router; 