
import React, { useState } from 'react';
import { TrainingTopic, TrainingSession } from '../../../types';

interface ScheduleTrainingFormProps {
  approvedTopics: TrainingTopic[];
  teamMembers: { id: string; name: string }[];
  onSave: (data: Omit<TrainingSession, 'id' | 'status' | 'department' | 'attendees'> & { attendees: string[] }) => void;
  onCancel: () => void;
}

const ScheduleTrainingForm: React.FC<ScheduleTrainingFormProps> = ({ approvedTopics, teamMembers, onSave, onCancel }) => {
  const [topicId, setTopicId] = useState('');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [trainer, setTrainer] = useState('');
  const [error, setError] = useState('');

  const handleAttendeeChange = (employeeId: string) => {
    setAttendees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId || attendees.length === 0 || !scheduledDate || !trainer.trim()) {
      setError('All fields are required.');
      return;
    }
    const selectedTopic = approvedTopics.find(t => t.id === topicId);
    if (selectedTopic) {
        onSave({ topicId, topicTitle: selectedTopic.title, attendees, scheduledDate, trainer });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="topicId" className="block text-sm font-medium text-gray-700">Training Topic</label>
        <select id="topicId" value={topicId} onChange={(e) => setTopicId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
          <option value="">-- Select an approved topic --</option>
          {approvedTopics.map(topic => (
            <option key={topic.id} value={topic.id}>{topic.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Select Attendees</label>
        <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
          {teamMembers.map(member => (
            <label key={member.id} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100">
              <input type="checkbox" checked={attendees.includes(member.id)} onChange={() => handleAttendeeChange(member.id)}
                className="rounded border-gray-300 text-brand-secondary focus:ring-brand-accent"/>
              <span>{member.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" id="scheduledDate" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
         <div>
            <label htmlFor="trainer" className="block text-sm font-medium text-gray-700">Trainer</label>
            <input type="text" id="trainer" value={trainer} onChange={(e) => setTrainer(e.target.value)}
            placeholder="e.g., Internal / Vendor Name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <footer className="pt-4 flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-md">Schedule Session</button>
      </footer>
    </form>
  );
};

export default ScheduleTrainingForm;