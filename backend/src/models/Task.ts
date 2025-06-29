import { query } from '../utils/database';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskResponse } from '../types';

export class TaskModel {
  static async create(taskData: CreateTaskRequest, userId: number): Promise<TaskResponse> {
    const { title, description, status = 'pending', priority = 'medium' } = taskData;

    const result = await query(
      `INSERT INTO tasks (title, description, status, priority, user_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, title, description, status, priority, user_id, created_at, updated_at`,
      [title, description, status, priority, userId]
    );

    return result.rows[0];
  }

  static async findByUserId(userId: number, status?: string, priority?: string): Promise<TaskResponse[]> {
    let sql = 'SELECT id, title, description, status, priority, user_id, created_at, updated_at FROM tasks WHERE user_id = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (priority) {
      sql += ` AND priority = $${paramIndex}`;
      params.push(priority);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  static async findById(id: number, userId: number): Promise<TaskResponse | null> {
    const result = await query(
      'SELECT id, title, description, status, priority, user_id, created_at, updated_at FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    return result.rows[0] || null;
  }

  static async update(id: number, userId: number, updateData: UpdateTaskRequest): Promise<TaskResponse | null> {
    const { title, description, status, priority } = updateData;
    
    const setClause: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      setClause.push(`title = $${paramIndex}`);
      params.push(title);
      paramIndex++;
    }

    if (description !== undefined) {
      setClause.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }

    if (status !== undefined) {
      setClause.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (priority !== undefined) {
      setClause.push(`priority = $${paramIndex}`);
      params.push(priority);
      paramIndex++;
    }

    if (setClause.length === 0) {
      return this.findById(id, userId);
    }

    params.push(id, userId);
    const result = await query(
      `UPDATE tasks SET ${setClause.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} 
       RETURNING id, title, description, status, priority, user_id, created_at, updated_at`,
      params
    );

    return result.rows[0] || null;
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    return (result.rowCount ?? 0) > 0;
  }

  static async findByUserIdPaginated(userId: number, status?: string, priority?: string, page = 1, limit = 10): Promise<{ tasks: TaskResponse[]; total: number; }> {
    let sql = 'SELECT id, title, description, status, priority, user_id, created_at, updated_at FROM tasks WHERE user_id = $1';
    let countSql = 'SELECT COUNT(*) FROM tasks WHERE user_id = $1';
    const params: any[] = [userId];
    const countParams: any[] = [userId];
    let paramIndex = 2;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      countSql += ` AND status = $${paramIndex}`;
      params.push(status);
      countParams.push(status);
      paramIndex++;
    }

    if (priority) {
      sql += ` AND priority = $${paramIndex}`;
      countSql += ` AND priority = $${paramIndex}`;
      params.push(priority);
      countParams.push(priority);
    }

    sql += ' ORDER BY created_at DESC';
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, (page - 1) * limit);

    const [result, countResult] = await Promise.all([
      query(sql, params),
      query(countSql, countParams)
    ]);
    const total = parseInt(countResult.rows[0].count, 10);
    return { tasks: result.rows, total };
  }
} 