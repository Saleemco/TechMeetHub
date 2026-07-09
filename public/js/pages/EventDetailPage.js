// public/js/pages/EventDetailPage.js
import { Data, Auth } from '../data.js';
import { EmptyState, getIcon, formatFullDate, formatTime, getCategoryLabel, getCategoryIcon } from '../components.js';

export async function EventDetailPage(eventId) {
  const event = await Data.getEvent(eventId);
  if (!event) {
    return `<div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">${EmptyState({ icon: 'alert', title: 'Event Not Found', message: "The event you're looking for doesn't exist or has been removed.", action: { href: '/events', label: 'Browse Events' } })}</div>`;
  }

  const user = await Auth.me();
  const isAttending = event.attendees.includes(user?.id || '');
  const spotsLeft = event.capacity - event.attendees.length;
  const isFull = spotsLeft <= 0;
  const isOrganizer = user?.id === event.organizer.id;
  const canRsvp = user && (user.role === 'participant' || (user.role === 'organizer' && !isOrganizer) || user.role === 'admin');
  const attendeeDetails = event.attendeeDetails || [];

  const participantSection = isOrganizer && attendeeDetails.length > 0 ? `
    <div class="glass rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-white">Participants (${attendeeDetails.length})</h2>
        <span class="text-sm text-secondary">${attendeeDetails.length} / ${event.capacity} registered</span>
      </div>
      <div class="space-y-2 max-h-80 overflow-y-auto">
        ${attendeeDetails.map(a => `
          <div class="flex items-center gap-3 p-3 bg-input rounded-lg participant-list-item">
            <div class="w-10 h-10 rounded-full ${a.initialsColor} avatar-initials text-sm">${a.avatar}</div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-white truncate">${a.name}</div>
              <div class="text-sm text-secondary">Participant</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `
    <div class="page-transition">
      <div class="h-64 md:h-80 relative overflow-hidden">
        <img src="${event.image}" alt="${event.title}" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/70 to-[#08080f]/30 z-10"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8 relative z-20">
          <div class="flex-1">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur text-white/90 border border-white/10 mb-3">
              ${getCategoryIcon(event.category, 12)} ${getCategoryLabel(event.category)}
            </span>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">${event.title}</h1>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span class="flex items-center gap-1">${getIcon('calendar', 14)} ${formatFullDate(event.date)}</span>
              <span class="flex items-center gap-1">${getIcon('clock', 14)} ${formatTime(event.time)}</span>
              <span class="flex items-center gap-1">${getIcon('mapPin', 14)} ${event.location}</span>
            </div>
          </div>
          <div class="hidden md:flex items-center gap-3">
            ${isOrganizer ? `
              <button onclick="window.navigateTo('/create?edit=${event.id}')" class="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-white/20 transition-colors">${getIcon('edit', 14)} Edit</button>
              <button onclick="window.deleteEvent('${event.id}')" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">${getIcon('trash', 14)} Delete</button>
            ` : canRsvp ? `
              <button onclick="window.handleRsvp('${event.id}')" class="px-6 py-3 rounded-xl text-base font-semibold transition-all btn-primary ${isAttending ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-500 text-white hover:bg-brand-600'}" ${isFull && !isAttending ? 'disabled' : ''}>
                ${isAttending ? getIcon('check', 16) + " You're Going" : 'Register Now'}
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="glass rounded-xl p-6">
              <h2 class="text-xl font-semibold text-white mb-4">About This Event</h2>
              <p class="text-gray-300 leading-relaxed">${event.description}</p>
              <div class="flex flex-wrap gap-2 mt-4">${event.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}</div>
            </div>
            ${participantSection}
            ${event.speakers && event.speakers.length > 0 ? `
              <div class="glass rounded-xl p-6">
                <h2 class="text-xl font-semibold text-white mb-4">Speakers</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${event.speakers.map(speaker => `
                    <div class="flex items-center gap-4 p-4 bg-input rounded-lg">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold">${speaker.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <div class="font-medium text-gray-200">${speaker.name}</div>
                        <div class="text-sm text-secondary">${speaker.role}</div>
                        <div class="text-sm text-brand-400 mt-0.5">${speaker.topic}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            ${event.agenda && event.agenda.length > 0 ? `
              <div class="glass rounded-xl p-6">
                <h2 class="text-xl font-semibold text-white mb-4">Agenda</h2>
                <div class="space-y-3">
                  ${event.agenda.map((item) => `
                    <div class="flex items-start gap-4 p-4 bg-input rounded-lg agenda-item">
                      <div class="w-16 text-sm font-medium text-brand-400 flex-shrink-0">${item.time}</div>
                      <div class="flex-1">
                        <div class="font-medium text-gray-200">${item.title}</div>
                        <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${item.type === 'social' ? 'bg-input text-secondary' : item.type === 'keynote' ? 'bg-brand-500/20 text-brand-400' : 'bg-accent-500/20 text-accent-400'}">${item.type}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          <div class="space-y-6">
            <div class="glass rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm text-secondary">Attendees</span>
                <span class="text-sm font-medium text-white">${event.attendees.length} / ${event.capacity}</span>
              </div>
              <div class="w-full bg-input rounded-full h-2 mb-4">
                <div class="bg-brand-500 h-2 rounded-full transition-all" style="width: ${(event.attendees.length / event.capacity) * 100}%"></div>
              </div>
              <div class="flex items-center gap-2 mb-4">
                <div class="flex -space-x-2">
                  ${event.attendees.slice(0, 5).map(() => `
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 border-2 border-[#08080f] flex items-center justify-center text-xs text-white font-bold">${String.fromCharCode(65 + Math.floor(Math.random() * 26))}</div>
                  `).join('')}
                  ${event.attendees.length > 5 ? `<div class="w-8 h-8 rounded-full bg-input border-2 border-[#08080f] flex items-center justify-center text-xs text-gray-300">+${event.attendees.length - 5}</div>` : ''}
                </div>
              </div>
              ${canRsvp ? `
                <button onclick="window.handleRsvp('${event.id}')" class="w-full py-3 rounded-xl text-base font-semibold transition-all btn-primary ${isAttending ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-500 text-white hover:bg-brand-600'}" ${isFull && !isAttending ? 'disabled' : ''}>
                  ${isAttending ? getIcon('check', 16) + " You're Going" : isFull ? 'Event Full' : 'Register Now'}
                </button>
              ` : isOrganizer ? `<div class="text-sm text-secondary text-center py-2">You are the organizer</div>` : `
                <a href="/login" data-navigate class="block w-full py-3 rounded-xl text-base font-semibold text-center bg-brand-500 text-white hover:bg-brand-600 transition-colors">Login to Register</a>
              `}
            </div>
            <div class="glass rounded-xl p-6">
              <h3 class="font-semibold text-white mb-4">Organizer</h3>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full ${event.organizer.initialsColor} avatar-initials text-sm">${event.organizer.avatar}</div>
                <div>
                  <div class="font-medium text-gray-200">${event.organizer.name}</div>
                  <div class="text-sm text-secondary">Event Host</div>
                </div>
              </div>
            </div>
            <div class="glass rounded-xl p-6">
              <h3 class="font-semibold text-white mb-3">Share</h3>
              <button onclick="window.copyEventLink('${event.id}')" class="w-full px-3 py-2 rounded-lg bg-input text-secondary text-sm hover:bg-card-hover transition-colors flex items-center justify-center gap-1.5">${getIcon('link', 14)} Copy Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}