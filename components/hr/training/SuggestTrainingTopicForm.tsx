
import React, { useState } from 'react';

interface SuggestTrainingTopicFormProps {
    onSave: (data: { title: string }) => void;
    onCancel: () => void;
}

const SuggestTrainingTopicForm: React.FC<SuggestTrainingTopicFormProps> = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSave({ title });
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="topicTitle" className="block text-sm font-medium text-slate-700">Topic Title</label>
                <input 
                    type="text" 
                    id="topicTitle" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent" 
                    required 
                    placeholder="e.g., Advanced Welding Techniques"
                />
            </div>
            <footer className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-blue-700 rounded-md">Submit for Approval</button>
            </footer>
        </form>
    );
};

export default SuggestTrainingTopicForm;