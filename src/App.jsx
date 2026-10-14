import React, { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_web_tasks');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'JavaScript Proje Envanterini Tamamla',
        description: 'React ve Tailwind CSS kullanarak CRUD uygulamasını bitir.',
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toLocaleDateString('tr-TR')
      }
    ];
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('taskflow_web_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? {
        ...t,
        title,
        description,
        priority
      } : t));
      setEditingTask(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        title,
        description,
        priority,
        status: 'pending',
        createdAt: new Date().toLocaleDateString('tr-TR')
      };
      setTasks([newTask, ...tasks]);
    }
    resetForm();
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' };
      }
      return t;
    }));
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high': return <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-semibold">Yüksek</span>;
      case 'medium': return <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-semibold">Orta</span>;
      default: return <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold">Düşük</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-600 mb-2">TASKFLOW Web Application</h1>
          <p className="text-slate-600">Modern JavaScript & React.js ile Görev Yönetimi</p>
        </header>

        {/* Form Bölümü */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8">
          <h2 className="text-xl font-bold mb-4 text-slate-700">
            {editingTask ? '✏️ Görevi Düzenle' : '➕ Yeni Görev Ekle'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-600">Görev Başlığı *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Proje arayüzünü tasarla"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-600">Öncelik</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-slate-600">Açıklama</label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Görev detaylarını yazınız..."
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            {editingTask && (
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 font-medium cursor-pointer"
              >
                İptal
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition cursor-pointer"
            >
              {editingTask ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>

        {/* Görev Listesi Bölümü */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-lg">Henüz eklenmiş bir görev bulunmuyor.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:shadow-md ${
                  task.status === 'completed' ? 'opacity-60 bg-slate-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleToggleStatus(task.id)}
                    className="mt-1.5 w-5 h-5 text-indigo-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-lg ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </h3>
                      {getPriorityBadge(task.priority)}
                    </div>
                    {task.description && <p className="text-slate-600 text-sm mb-2">{task.description}</p>}
                    <span className="text-xs text-slate-400">Oluşturulma: {task.createdAt}</span>
                  </div>
                </div>
                <div className="flex gap-2 self-end md:self-center">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}