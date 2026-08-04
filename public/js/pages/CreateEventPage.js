import { Data, Auth } from '../data.js';
import { getIcon, Input, Button } from '../components.js';

export async function CreateEventPage() {
  const user = await Auth.me();
  if (!user) {
    return `
      <div class="page-transition max-w-7xl mx-auto text-center py-20 px-4">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p class="text-gray-500 mb-4">Please login to create an event.</p>
        <a href="/login" data-navigate class="px-4 py-2 rounded-lg bg-teal-900 text-white text-sm font-medium hover:bg-teal-800 transition-colors">Go to Login</a>
      </div>
    `;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');
  let event = null;
  if (editId) {
    event = await Data.getEvent(editId);
    if (!event || (event.organizer_id !== user.id && user.role !== 'admin')) {
      return `<div class="page-transition max-w-7xl mx-auto p-4 text-center text-red-600">You don't have permission to edit this event.</div>`;
    }
  }

  const categories = await Data.getCategories();

  return `
    <div class="page-transition max-w-3xl mx-auto px-4 sm:px-6">
      <div class="mb-6">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">${editId ? 'Edit Event' : 'Create New Event'}</h1>
        <p class="text-gray-500 text-sm mt-1">${editId ? 'Update your event details below.' : 'Fill in the details to publish your event.'}</p>
      </div>

      <form id="create-event-form" class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
        
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Input({ label: 'Event Title', name: 'title', placeholder: 'e.g. React Conference 2026', value: event?.title || '', required: true })}
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Category <span class="text-red-500">*</span></label>
            <select name="category" required class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 transition-colors">
              <option value="">Select category</option>
              ${categories.map(c => `<option value="${c.id}" ${event?.category === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Input({ label: 'Date', name: 'date', type: 'date', value: event?.date || '', required: true })}
          ${Input({ label: 'Time', name: 'time', type: 'time', value: event?.time || '', required: true })}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Input({ label: 'Location', name: 'location', placeholder: 'e.g. San Francisco, CA', value: event?.location || '', required: true })}
          ${Input({ label: 'Capacity', name: 'capacity', type: 'number', placeholder: 'e.g. 100', value: event?.capacity || '', required: true, min: 1 })}
        </div>

        ${Input({ label: 'Description', name: 'description', type: 'textarea', placeholder: 'Describe your event...', value: event?.description || '', required: true, rows: 5 })}
        ${Input({ label: 'Tags (comma separated)', name: 'tags', placeholder: 'javascript, webdev, networking', value: event?.tags?.join(', ') || '' })}
        ${Input({ label: 'Image URL', name: 'image', placeholder: 'https://...', value: event?.image || '' })}

        <!-- Speakers -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Speakers</h3>
            <button type="button" onclick="window.addSpeaker()" class="text-xs font-medium text-teal-800 hover:text-orange-500 transition-colors flex items-center gap-1">
              ${getIcon('plus', 12)} Add Speaker
            </button>
          </div>
          <div id="speakers-container" class="space-y-3">
            ${(event?.speakers || []).map((s, i) => SpeakerEntry(i, s)).join('') || SpeakerEntry(0)}
          </div>
        </div>

        <!-- Agenda -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Agenda</h3>
            <button type="button" onclick="window.addAgenda()" class="text-xs font-medium text-teal-800 hover:text-orange-500 transition-colors flex items-center gap-1">
              ${getIcon('plus', 12)} Add Agenda Item
            </button>
          </div>
          <div id="agenda-container" class="space-y-3">
            ${(event?.agenda || []).map((a, i) => AgendaEntry(i, a)).join('') || AgendaEntry(0)}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-200">
          ${Button({ label: editId ? 'Update Event' : 'Create Event', type: 'submit', variant: 'primary', fullWidth: true, icon: getIcon('check', 16) })}
          <a href="/events" data-navigate class="w-full sm:w-auto text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors">Cancel</a>
        </div>
      </form>
    </div>
  `;
}

function SpeakerEntry(index, speaker = {}) {
  return `
    <div class="speaker-entry grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
      <input type="text" name="speaker_name_${index}" placeholder="Name" value="${speaker.name || ''}" class="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-teal-700" />
      <input type="text" name="speaker_role_${index}" placeholder="Role" value="${speaker.role || ''}" class="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-teal-700" />
      <div class="flex gap-2">
        <input type="text" name="speaker_topic_${index}" placeholder="Topic" value="${speaker.topic || ''}" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-teal-700" />
        <button type="button" onclick="this.closest('.speaker-entry').remove()" class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove">
          ${getIcon('x', 14)}
        </button>
      </div>
    </div>
  `;
}

function AgendaEntry(index, item = {}) {
  return `
    <div class="agenda-entry grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
      <input type="time" name="agenda_time_${index}" value="${item.time || ''}" class="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-teal-700" />
      <input type="text" name="agenda_title_${index}" placeholder="Session title" value="${item.title || ''}" class="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-teal-700" />
      <div class="flex gap-2">
        <select name="agenda_type_${index}" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-teal-700">
          <option value="social" ${item.type === 'social' ? 'selected' : ''}>Social</option>
          <option value="talk" ${item.type === 'talk' ? 'selected' : ''}>Talk</option>
          <option value="workshop" ${item.type === 'workshop' ? 'selected' : ''}>Workshop</option>
          <option value="break" ${item.type === 'break' ? 'selected' : ''}>Break</option>
        </select>
        <button type="button" onclick="this.closest('.agenda-entry').remove()" class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove">
          ${getIcon('x', 14)}
        </button>
      </div>
    </div>
  `;
}

window.addSpeaker = function() {
  const container = document.getElementById('speakers-container');
  const index = container.children.length;
  const div = document.createElement('div');
  div.innerHTML = SpeakerEntry(index);
  container.appendChild(div.firstElementChild);
};

window.addAgenda = function() {
  const container = document.getElementById('agenda-container');
  const index = container.children.length;
  const div = document.createElement('div');
  div.innerHTML = AgendaEntry(index);
  container.appendChild(div.firstElementChild);
};