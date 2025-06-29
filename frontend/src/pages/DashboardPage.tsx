import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Task } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL;

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: '⏳ Pending' },
  { value: 'in-progress', label: '🔄 In Progress' },
  { value: 'completed', label: '✅ Completed' },
];

const priorityOptions = [
  { value: '', label: 'All Priority' },
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
];

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', status: 'pending', priority: 'medium' });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // You can adjust the default page size
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      params.append('page', String(page));
      params.append('limit', String(limit));
      const res = await fetch(`${API_URL}/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');
      setTasks(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleEditTask = (task: Task) => {
    setEditTaskId(task.id);
    setCreateForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
    setShowCreate(true);
  };

  const handleCreateOrEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!createForm.title) {
      setCreateError('Title is required.');
      return;
    }
    setCreateLoading(true);
    try {
      let res, data;
      if (editTaskId) {
        res = await fetch(`${API_URL}/api/tasks/${editTaskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(createForm),
        });
      } else {
        res = await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(createForm),
        });
      }
      data = await res.json();
      if (!res.ok) throw new Error(data.error || (editTaskId ? 'Failed to update task' : 'Failed to create task'));
      setShowCreate(false);
      setEditTaskId(null);
      setCreateForm({ title: '', description: '', status: 'pending', priority: 'medium' });
      fetchTasks();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete task');
      fetchTasks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
    // eslint-disable-next-line
  }, [token, status, priority, page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Task Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <button 
                onClick={logout} 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tasks and Create Task Button */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8 sticky top-4 z-20 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              >
                {priorityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowCreate(v => !v)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200 mt-4 sm:mt-0"
            >
              {showCreate ? 'Cancel' : 'Create Task'}
            </button>
          </div>
        </div>
        {/* Modal Create Task Form */}
        {showCreate && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => { setShowCreate(false); setEditTaskId(null); }} />
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <form onSubmit={handleCreateOrEditTask} className="relative bg-white/90 rounded-xl p-6 shadow-lg border border-white/20 space-y-4 max-w-lg w-full mx-4">
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setEditTaskId(null); }}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center">{editTaskId ? 'Edit Task' : 'Create Task'}</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={createForm.title}
                    onChange={handleCreateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    rows={3}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={createForm.status}
                      onChange={handleCreateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={createForm.priority}
                      onChange={handleCreateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                {createError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{createError}</p>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={createLoading}
                >
                  {createLoading ? (editTaskId ? 'Updating...' : 'Creating...') : (editTaskId ? 'Update Task' : 'Create Task')}
                </button>
              </form>
            </div>
          </>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading tasks...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <>
            {tasks.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center shadow-lg border border-white/20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks available</h3>
                <p className="text-gray-600">Create your first task to get started!</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {tasks.map(task => (
                    <div key={task.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-semibold text-gray-900 pr-4">{task.title}</h3>
                            <div className="flex space-x-2">
                              <span className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">
                                {task.status}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">
                                {task.priority}
                              </span>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-gray-600 mb-4 leading-relaxed">{task.description}</p>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                            {task.updated_at !== task.created_at && (
                              <span className="ml-4">Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-4 lg:mt-0">
                          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg" onClick={() => handleEditTask(task)}>
                            Edit
                          </button>
                          <button className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg" onClick={() => handleDeleteTask(task.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 