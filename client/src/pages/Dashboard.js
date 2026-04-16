import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';

const COLUMNS = ['applied', 'interview', 'offer', 'rejected'];

const COLUMN_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

const COLUMN_COLORS = {
  applied: '#3b82f6',
  interview: '#f59e0b',
  offer: '#10b981',
  rejected: '#ef4444',
};

const emptyForm = {
  company: '',
  position: '',
  status: 'applied',
  notes: '',
  applied_date: '',
};

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState('');

  // Fetch all jobs when the page loads
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      setError('Failed to load jobs.');
    }
  };

  // Group jobs by their status column
  const getJobsByStatus = (status) => jobs.filter((job) => job.status === status);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingJob) {
        // Update existing job
        const res = await api.put(`/jobs/${editingJob.id}`, form);
        setJobs(jobs.map((j) => (j.id === editingJob.id ? res.data : j)));
      } else {
        // Add new job
        const res = await api.post('/jobs', form);
        setJobs([res.data, ...jobs]);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingJob(null);
    } catch (err) {
      setError('Failed to save job.');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setForm({
      company: job.company,
      position: job.position,
      status: job.status,
      notes: job.notes || '',
      applied_date: job.applied_date ? job.applied_date.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job application?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      setError('Failed to delete job.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingJob(null);
    setError('');
  };

  // When a card is dragged and dropped into a new column, update its status
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const jobId = parseInt(draggableId);
    const job = jobs.find((j) => j.id === jobId);

    // Optimistically update the UI before the server responds
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)));

    try {
      await api.put(`/jobs/${jobId}`, { ...job, status: newStatus });
    } catch (err) {
      setError('Failed to update status.');
      fetchJobs(); // Revert if the server call fails
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>My Applications</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Job
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingJob ? 'Edit Application' : 'Add Application'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {COLUMNS.map((col) => (
                    <option key={col} value={col}>
                      {COLUMN_LABELS[col]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date Applied</label>
                <input
                  type="date"
                  name="applied_date"
                  value={form.applied_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any notes about this application..."
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingJob ? 'Save Changes' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {COLUMNS.map((col) => (
            <div className="kanban-column" key={col}>
              <div
                className="kanban-column-header"
                style={{ borderTop: `4px solid ${COLUMN_COLORS[col]}` }}
              >
                <span>{COLUMN_LABELS[col]}</span>
                <span className="kanban-count">{getJobsByStatus(col).length}</span>
              </div>

              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div
                    className={`kanban-cards ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {getJobsByStatus(col).map((job, index) => (
                      <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className={`job-card ${snapshot.isDragging ? 'dragging' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="job-card-header">
                              <strong>{job.company}</strong>
                              <div className="job-card-actions">
                                <button onClick={() => handleEdit(job)} className="btn-icon">✏️</button>
                                <button onClick={() => handleDelete(job.id)} className="btn-icon">🗑️</button>
                              </div>
                            </div>
                            <p className="job-position">{job.position}</p>
                            {job.applied_date && (
                              <p className="job-date">
                                Applied: {new Date(job.applied_date).toLocaleDateString()}
                              </p>
                            )}
                            {job.notes && <p className="job-notes">{job.notes}</p>}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
