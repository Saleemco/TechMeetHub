// public/js/pages/CreateEventPage.js
import { Input, getIcon } from '../components.js';

export function CreateEventPage() {
  const allCategories = [
    { id: 'hackathon', label: 'Hackathon' }, { id: 'meetup', label: 'Meetup' },
    { id: 'workshop', label: 'Workshop' }, { id: 'conference', label: 'Conference' },
    { id: 'webinar', label: 'Webinar' }, { id: 'social', label: 'Social' },
  ];
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');

  return `
    <div class="page-transition max-w-3xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white mb-1">${editId ? 'Edit Event' : 'Create New Event'}</h1>
        <p class="text-gray-400 text-sm">${editId ? 'Update your event details' : 'Host a new event for the tech community'}</p>
      </div>
      <form id="create-event-form" class="glass rounded-xl p-6 md:p-8 border border-white/5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Input({ label: 'Event Title', name: 'title', placeholder: 'e.g., React Advanced Patterns Workshop', required: true })}
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Category <span class="text-red-400">*</span></label>
            <select name="category" required class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors">
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
        
        <!-- Speakers Section -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-1.5">Speakers</label>
          <div id="speakers-container">
            <div class="speaker-entry grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 p-3 rounded-lg bg-white/5">
              <input type="text" name="speaker_name_0" placeholder="Speaker Name" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
              <input type="text" name="speaker_role_0" placeholder="Role / Title" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
              <input type="text" name="speaker_topic_0" placeholder="Topic" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
          <button type="button" onclick="window.addSpeakerField()" class="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
            ${getIcon('plus', 14)} Add Speaker
          </button>
          <p class="text-xs text-gray-500 mt-1">Add speakers for your event (optional)</p>
        </div>

        <!-- Agenda Section -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-1.5">Agenda</label>
          <div id="agenda-container">
            <div class="agenda-entry grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 p-3 rounded-lg bg-white/5">
              <input type="text" name="agenda_time_0" placeholder="Time (e.g., 09:00)" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
              <input type="text" name="agenda_title_0" placeholder="Title (e.g., Opening Keynote)" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
              <select name="agenda_type_0" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors">
                <option value="social">Social</option>
                <option value="keynote">Keynote</option>
                <option value="work">Work</option>
              </select>
            </div>
          </div>
          <button type="button" onclick="window.addAgendaField()" class="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
            ${getIcon('plus', 14)} Add Agenda Item
          </button>
          <p class="text-xs text-gray-500 mt-1">Add agenda items for your event (optional)</p>
        </div>

        ${Input({ label: 'Tags', name: 'tags', placeholder: 'e.g., React, JavaScript, AI, Web3', required: false })}
        
        <div class="flex items-center gap-3 pt-4 border-t border-white/5">
          <button type="submit" class="px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">${editId ? 'Update Event' : 'Create Event'}</button>
          <a href="/events" data-navigate class="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</a>
        </div>
      </form>
    </div>
  `;
}

// Global functions for adding fields
window.addSpeakerField = function() {
  const container = document.getElementById('speakers-container');
  if (!container) return;
  const index = container.children.length;
  const entry = document.createElement('div');
  entry.className = 'speaker-entry grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 p-3 rounded-lg bg-white/5';
  entry.innerHTML = `
    <input type="text" name="speaker_name_${index}" placeholder="Speaker Name" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
    <input type="text" name="speaker_role_${index}" placeholder="Role / Title" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
    <input type="text" name="speaker_topic_${index}" placeholder="Topic" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
  `;
  container.appendChild(entry);
};

window.addAgendaField = function() {
  const container = document.getElementById('agenda-container');
  if (!container) return;
  const index = container.children.length;
  const entry = document.createElement('div');
  entry.className = 'agenda-entry grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 p-3 rounded-lg bg-white/5';
  entry.innerHTML = `
    <input type="text" name="agenda_time_${index}" placeholder="Time (e.g., 09:00)" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
    <input type="text" name="agenda_title_${index}" placeholder="Title (e.g., Opening Keynote)" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
    <select name="agenda_type_${index}" class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors">
      <option value="social">Social</option>
      <option value="keynote">Keynote</option>
      <option value="work">Work</option>
    </select>
  `;
  container.appendChild(entry);
};