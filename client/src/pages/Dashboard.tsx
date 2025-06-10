import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskEditForm from '../components/TaskEditForm';
import TagForm from '../components/TagForm';
import TaskForm from '../components/TaskForm';
import CategoryBar from '../components/CategoryBar';
import {DndContext,closestCenter,PointerSensor,useSensor,useSensors} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {arrayMove,SortableContext,verticalListSortingStrategy,} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../styles/dashboard.scss';

export type Task = {
  _id: string;
  title: string;
  description: string;
  tag: string;
  category: string;
};

export type Tag = {
  _id: string;
  name: string;
  color: string;
};

export type Category = {
  _id: string;
  name: string;
  color?: string;
};

function SortableTaskCard({ task, children }: { task: Task; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-card">
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#cccccc');
  const [selectedCategory, setSelectedCategory] = useState('GENERAL');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchTasks = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.get('/tasks', { headers });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.get('/tags', { headers });
      setTags(res.data);
    } catch (err) {
      console.error('Failed to fetch tags', err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.get('/categories', { headers });
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchTags();
    fetchCategories();
  }, [fetchTasks, fetchTags, fetchCategories]);

  const handleAddTask = async (data: Omit<Task, '_id'>) => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.post('/tasks', data, { headers });
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleAddTag = async (tagData: { name: string; color: string }) => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.post('/tags', tagData, { headers });
      setTags((prev) => [...prev, res.data]);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        alert('Tag already exists.');
      } else {
        console.error('Failed to add tag', err);
      }
    }
  };

  const handleAddCategory = async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const color = newCategoryColor || '#cccccc';
      const res = await axios.post('/categories', { name: newCategoryName, color }, { headers });
      if (res.data) {
        setCategories((prev) => [...prev, res.data]);
      }
      setNewCategoryName('');
      setNewCategoryColor('#cccccc');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || 'Unknown error';
        alert(`Failed to add category: ${msg}`);
      } else {
        console.error('Failed to add category', err);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      await axios.delete(`/categories/${id}`, { headers });
      fetchCategories();
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  const getTagColorClass = (tagName: string) => {
    const tag = tags.find((t) => t.name === tagName);
    if (!tag || typeof tag.color !== 'string') return '';
    return `tag-${tag.color.toLowerCase()}`;
  };

  const filteredTasks = selectedCategory === 'GENERAL'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  async function handleDelete(_id: string): Promise<void> {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      await axios.delete(`/tasks/${_id}`, { headers });
      setTasks((prev) => prev.filter(task => task._id !== _id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  }

  async function handleUpdateTask(updatedTask: Task): Promise<void> {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      await axios.put(`/tasks/${updatedTask._id}`, updatedTask, { headers });
      setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      setEditingTaskId(null);
    } catch (err) {
      console.error('Failed to update task', err);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex(t => t._id === active.id);
      const newIndex = tasks.findIndex(t => t._id === over?.id);
      const updated = arrayMove(tasks, oldIndex, newIndex);
      setTasks(updated);
    }
  }

  return (
    <div className="page">
      <nav className="navbar">
        <h2>My Tasks</h2>
        <button className="primary-button" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="form-toggle-buttons">
        <button className="primary-button" onClick={() => setShowTaskForm(s => !s)}>
          {showTaskForm ? 'Close Task Form' : 'Add Task'}
        </button>
        <button className="primary-button" onClick={() => setShowTagForm(s => !s)}>
          {showTagForm ? 'Close Tag Form' : 'Add Tag'}
        </button>
      </div>

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryColor={newCategoryColor}
        setNewCategoryColor={setNewCategoryColor}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
        showAddControls={true}
      />

      {showTaskForm && (
        <TaskForm tags={tags} categories={categories} onAdd={handleAddTask} />
      )}

      {showTagForm && <TagForm onAdd={handleAddTag} />}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          <div className="task-grid">
            {filteredTasks.map((task) => {
              const categoryColor = categories.find(c => c.name === task.category)?.color || '#ccc';
              return (
                <SortableTaskCard key={task._id} task={task}>
                  {editingTaskId === task._id ? (
                    <TaskEditForm
                      task={task}
                      tags={tags}
                      categories={categories}
                      onCancel={() => setEditingTaskId(null)}
                      onSave={handleUpdateTask}
                    />
                  ) : (
                    <>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      <span className={`tag ${getTagColorClass(task.tag)}`}>{task.tag}</span>
                      <span className="tag category" style={{ backgroundColor: categoryColor }}>{task.category}</span>
                      <div className="task-actions">
                        <button className="edit" onClick={() => setEditingTaskId(task._id)}>Edit</button>
                        <button className="danger" onClick={() => handleDelete(task._id)}>Delete</button>
                      </div>
                    </>
                  )}
                </SortableTaskCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}