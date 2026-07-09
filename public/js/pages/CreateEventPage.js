// public/js/pages/CreateEventPage.js
import { Input } from '../components.js';

export function CreateEventPage() {
  const allCategories = [
    { id: 'hackathon', label: 'Hackathon' }, { id: 'meetup', label: 'Meetup' },
    { id: 'workshop', label: 'Workshop' }, { id: 'conference', label: 'Conference' },
    { id: 'webinar', label: 'Webinar' }, { id: 'social', label: 'Social' },
  ];
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');

  return `
    <div class="page-transition max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">${editId ? 'Edit Event' : 'Create Event'}</h1>
        <p class="text-secondary">${editId ? 'Update your event details' : 'Host a new event for the tech community'}</p>
      </div>
      <form id="create-event-form" class="glass rounded-xl p-6 md:p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Input({ label: 'Event Title', name: 'title', placeholder: 'e.g., React Advanced Patterns Workshop', required: true })}
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Category <span class="text-red-400">*</span></label>
            <select name="category" required class="w-full px-4 py-2.5 select-shell">
              <option value="" disabled selected>Select a category</option>
              ${allCategories.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Input({ label: 'Date', name: 'date', type: 'date', required: true })}
          ${Input({ label: 'Time', name: 'time', type: 'time', required: true })}
        </div>
        ${Input({ label: 'Location', name: 'location', placeholder: 'e.g., San Francisco, CA or Online (Zoom)', required: true })}
        ${Input({ label: 'Capacity', name: 'capacity', type: 'number', placeholder: 'e.g., 100', required: true, min: 1 })}
        ${Input({ label: 'Description', name: 'description', type: 'textarea', placeholder: 'Describe your event, what attendees will learn, and any prerequisites...', required: true, rows: 5 })}
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-1.5">Tags <span class="text-gray-500">(comma separated)</span></label>
          <input type="text" name="tags" placeholder="e.g., React, JavaScript, AI, Web3" class="w-full px-4 py-2.5 input-shell placeholder-gray-500" />
        </div>
        <div class="flex items-center gap-3 pt-4 border-t border-default">
          <button type="submit" class="px-6 py-2.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors">${editId ? 'Update Event' : 'Create Event'}</button>
          <a href="/events" data-navigate class="px-6 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-white hover:bg-white/5 transition-colors">Cancel</a>
        </div>
      </form>
    </div>
  `;
}