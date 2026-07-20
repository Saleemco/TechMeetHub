// public/js/pages/EventDetailPage.js
import { Data, Auth } from '../data.js';
import { EmptyState, getIcon, formatFullDate, formatTime, getCategoryLabel, getCategoryIcon } from '../components.js';

export async function EventDetailPage(eventId) {
  const event = await Data.getEvent(eventId);
  if (!event) {
    return `<div class="page-transition">${EmptyState({ icon: 'alert', title: 'Event Not Found', message: "The event you're looking for doesn't exist or has been removed.", action: { href: '/events', label: 'Browse Events' } })}</div>`;
  }

  const user = await Auth.me();
  const isAttending = event.attendees.includes(user?.id || '');
  const spotsLeft = event.capacity - event.attendees.length;
  const isFull = spotsLeft <= 0;
  const isOrganizer = user?.id === event.organizer.id;
  const canRsvp = user && (user.role === 'participant' || (user.role === 'organizer' && !isOrganizer) || user.role === 'admin');
  const attendeeDetails = event.attendeeDetails || [];

  const participantSection = isOrganizer && attendeeDetails.length > 0 ? `
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Participants (${attendeeDetails.length})</h2>
        <span class="text-sm text-gray-500">${attendeeDetails.length} / ${event.capacity} registered</span>
      </div>
      <div class="space-y-2 max-h-80 overflow-y-auto">
        ${attendeeDetails.map(a => `
          <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div class="w-8 h-8 rounded-full ${a.initialsColor} avatar-initials text-xs text-white">${a.avatar}</div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 truncate text-sm">${a.name}</div>
              <div class="text-xs text-gray-500">Participant</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `
    <div class="page-transition">
      <div class="relative rounded-2xl overflow-hidden h-64 md:h-80 mb-8">
        <img src="${event.image}" alt="${event.title}" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 border border-gray-200 mb-2">
              ${getCategoryIcon(event.category, 12)} ${getCategoryLabel(event.category)}
            </span>
            <h1 class="text-2xl md:text-3xl font-bold text-white">${event.title}</h1>
            <div class="flex flex-wrap items-center gap-4 text-sm text-white/80 mt-2">
              <span class="flex items-center gap-1">${getIcon('calendar', 14)} ${formatFullDate(event.date)}</span>
              <span class="flex items-center gap-1">${getIcon('clock', 14)} ${formatTime(event.time)}</span>
              <span class="flex items-center gap-1">${getIcon('mapPin', 14)} ${event.location}</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            ${isOrganizer ? `
              <button onclick="window.navigateTo('/create?edit=${event.id}')" class="px-4 py-2 rounded-lg text-sm font-medium bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30 transition-colors flex items-center gap-2">
                ${getIcon('edit', 14)} Edit
              </button>
              <button onclick="window.deleteEvent('${event.id}')" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center gap-2">
                ${getIcon('trash', 14)} Delete
              </button>
            ` : canRsvp ? `
              <button onclick="window.handleRsvp('${event.id}')" class="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isAttending ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700'}" ${isFull && !isAttending ? 'disabled' : ''}>
                ${isAttending ? getIcon('check', 16) + " You're Going" : isFull ? 'Event Full' : 'Register Now'}
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">About This Event</h2>
            <p class="text-gray-600 leading-relaxed">${event.description}</p>
            <div class="flex flex-wrap gap-2 mt-4">${event.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}</div>
          </div>

          ${participantSection}

          ${event.speakers && event.speakers.length > 0 ? `
            <div class="bg-white rounded-xl p-6 border border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Speakers</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${event.speakers.map(speaker => `
                  <div class="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                    <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">${speaker.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <div class="font-medium text-gray-900 text-sm">${speaker.name}</div>
                      <div class="text-xs text-gray-500">${speaker.role}</div>
                      <div class="text-xs text-blue-600 mt-0.5">${speaker.topic}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${event.agenda && event.agenda.length > 0 ? `
            <div class="bg-white rounded-xl p-6 border border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Agenda</h2>
              <div class="space-y-3">
                ${event.agenda.map((item) => `
                  <div class="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                    <div class="w-16 text-sm font-medium text-blue-600 flex-shrink-0">${item.time}</div>
                    <div class="flex-1">
                      <div class="font-medium text-gray-900 text-sm">${item.title}</div>
                      <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${item.type === 'social' ? 'bg-gray-100 text-gray-600' : item.type === 'keynote' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}">${item.type}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-500">Attendees</span>
              <span class="text-sm font-medium text-gray-900">${event.attendees.length} / ${event.capacity}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div class="bg-blue-600 h-2 rounded-full transition-all" style="width: ${(event.attendees.length / event.capacity) * 100}%"></div>
            </div>
            <div class="flex items-center gap-2 mb-4">
              <div class="flex -space-x-2">
                ${event.attendees.slice(0, 5).map(() => `
                  <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs text-white font-bold">${String.fromCharCode(65 + Math.floor(Math.random() * 26))}</div>
                `).join('')}
                ${event.attendees.length > 5 ? `<div class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">+${event.attendees.length - 5}</div>` : ''}
              </div>
            </div>
            ${canRsvp ? `
              <button onclick="window.handleRsvp('${event.id}')" class="w-full py-3 rounded-lg text-sm font-semibold transition-colors ${isAttending ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700'}" ${isFull && !isAttending ? 'disabled' : ''}>
                ${isAttending ? getIcon('check', 16) + " You're Going" : isFull ? 'Event Full' : 'Register Now'}
              </button>
            ` : isOrganizer ? `<div class="text-sm text-gray-500 text-center py-2">You are the organizer</div>` : `
              <a href="/login" data-navigate class="block w-full py-3 rounded-lg text-sm font-semibold text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors">Login to Register</a>
            `}
          </div>

          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <h3 class="font-semibold text-gray-900 mb-3">Organizer</h3>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full ${event.organizer.initialsColor} avatar-initials text-sm text-white">${event.organizer.avatar}</div>
              <div>
                <div class="font-medium text-gray-900 text-sm">${event.organizer.name}</div>
                <div class="text-xs text-gray-500">Event Host</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <h3 class="font-semibold text-gray-900 mb-3">Share</h3>
            <button onclick="window.copyEventLink('${event.id}')" class="w-full px-4 py-2.5 rounded-lg bg-gray-50 text-gray-600 text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              ${getIcon('link', 14)} Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}