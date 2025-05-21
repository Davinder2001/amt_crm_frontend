'use client';
import React from 'react';
import { FaCheckCircle, FaRegClock, FaCalendarAlt } from 'react-icons/fa';
import { useGetPendingTasksQuery, useMarkTaskAsWorkingMutation } from '@/slices/tasks/taskApi';
import Loader from '@/components/common/Loader';

const MyTasks = () => {
  const { data, isLoading, error } = useGetPendingTasksQuery();
  const tasks = data?.data || [];

  const [markTaskAsWorking, { isLoading: isMarking }] = useMarkTaskAsWorkingMutation();

  const handleCheckTask = async (taskId: number) => {
    try {
      await markTaskAsWorking(taskId).unwrap();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Failed to load tasks. Please try again.</p>;

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <div className="task-card" key={task.id}>
          <div className="task-header">
            <h3 className="task-title">{task.name}</h3>
            <span className={`task-priority ${task.priority?.toLowerCase() || 'normal'}`}>
              {task.priority || 'Normal'}
            </span>
          </div>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-meta">
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <span>{task.start_date || 'Flexible'}</span>
            </div>
            <div className="meta-item">
              <FaRegClock className="meta-icon" />
              <span>{task.end_date || 'Ongoing'}</span>
            </div>
          </div>

          <button
            onClick={() => handleCheckTask(task.id)}
            disabled={isMarking}
            className="task-button"
          >
            <FaCheckCircle className="button-icon" />
            {isMarking ? 'Updating...' : 'Start'}
          </button>
        </div>
      ))}

      <style jsx>{`
        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          padding: 0.5rem;
        }
        
        .task-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 0.75rem;
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }
        
        .task-title {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .task-priority {
          font-size: 10px;
          font-weight: 600;
          padding: 0.2rem 0.4rem;
          border-radius: 12px;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        
        .task-priority.high {
          background: #fee2e2;
          color: #b91c1c;
        }
        
        .task-priority.medium {
          background: #fef3c7;
          color: #b45309;
        }
        
        .task-priority.normal {
          background: #e0f2fe;
          color: #0369a1;
        }
        
        .task-description {
          color: #4a5568;
          font-size: 13px;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .task-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 12px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #718096;
        }
        
        .meta-icon {
          color: #a0aec0;
          font-size: 12px;
        }
        
        .task-button {
          background: #009693;
          color: white;
          border: none;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
          margin-top: 0.25rem;
          width: 100%;
          justify-content: center;
        }
        
        .task-button:hover {
          background: #00827c;
        }
        
        .task-button:disabled {
          background: #e2e8f0;
          cursor: not-allowed;
        }
        
        .button-icon {
          font-size: 12px;
        }
        
        .error-message {
          color: #e53e3e;
          text-align: center;
          padding: 1rem;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default MyTasks;