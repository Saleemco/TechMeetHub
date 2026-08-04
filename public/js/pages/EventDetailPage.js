import { Data, Auth } from '../data.js';
import { getIcon, formatFullDate, formatTime } from '../components.js';

export async function EventDetailPage(id) {
  const [event, user, allUsers] = await Promise.all([
    Data.getEvent(id),
    Auth.me(),
    Data.getAdminUsers().catch(() => [])
  ]);
  
  if (!event) {
    return `
      <div class="page-transition max-w-7xl mx-auto text-center py-20 px-4">
        <div class="text-gray-400 mb-4">${getIcon('search', 48)}</div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p class="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <a href="/events" data-navigate class="px-4 py-2 rounded-lg bg-teal-900 text-white text-sm font-medium hover:bg-teal-800 transition-colors">Browse Events</a>
      </div>
    `;
  }

  // Build a lookup map of user ID -> user object
  const userMap = new Map(allUsers.map(u => [u.id, u]));
  
  // Resolve attendee IDs to actual user objects
  const resolvedAttendees = (event.attendees || []).map(attendeeId => {
    if (typeof attendeeId === 'object' && attendeeId.id) return attendeeId;
    return userMap.get(attendeeId) || { id: attendeeId, name: 'User', avatar: '?', initialsColor: 'bg-gray-300' };
  });

  const isAttending = user?.id && event.attendees?.includes(user.id);
  const isOrganizer = user?.id === event.organizer_id;
  const isAdmin = user?.role === 'admin';
  const canEdit = isOrganizer || isAdmin;
  const date = formatFullDate(event.date);
  const time = formatTime(event.time);
  const spotsLeft = (event.capacity || 0) - (event.attendees?.length || 0);
  const isFull = spotsLeft <= 0;

  return `
    <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Hero Image -->
      <div class="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-4 sm:mb-6 bg-gray-100">
        <img src="${event.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop&q=80'}" 
             alt="${event.title}" 
             class="w-full h-full object-cover"
             width="1200"
             height="600"
             fetchpriority="high"
             decoding="async"
             onerror="this.style.display='none'" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div class="absolute bottom-4 left-4 right-4">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 border border-white/20 mb-2">${event.category}</span>
          <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">${event.title}</h1>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6">
          
          <!-- Event Info -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500 mb-4">
              <span class="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                ${getIcon('calendar', 14)} ${date}
              </span>
              <span class="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                ${getIcon('clock', 14)} ${time}
              </span>
              <span class="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                ${getIcon('mapPin', 14)} ${event.location}
              </span>
            </div>
            
            <h2 class="text-lg font-semibold text-gray-900 mb-2">About this event</h2>
            <p class="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">${event.description || 'No description available.'}</p>
            
            ${event.tags?.length ? `
              <div class="mt-4 flex flex-wrap gap-2">
                ${event.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Speakers -->
          ${event.speakers?.length ? `
            <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Speakers</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${event.speakers.map(s => `
                  <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div class="w-10 h-10 rounded-full bg-teal-900 avatar-initials text-sm text-white flex items-center justify-center shrink-0">${s.name?.charAt(0) || '?'}</div>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 text-sm truncate">${s.name}</p>
                      <p class="text-xs text-gray-500 truncate">${s.role}${s.topic ? ` · ${s.topic}` : ''}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Agenda -->
          ${event.agenda?.length ? `
            <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Agenda</h2>
              <div class="space-y-3">
                ${event.agenda.map(item => `
                  <div class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div class="shrink-0 w-16 text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-1 rounded text-center border border-teal-100">${item.time}</div>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 text-sm">${item.title}</p>
                      <p class="text-xs text-gray-500 capitalize">${item.type}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Attendees -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 class="text-lg font-semibold text-gray-900">Attendees</h2>
              <span class="text-sm text-gray-500">${resolvedAttendees.length} / ${event.capacity || 0} registered</span>
            </div>
            ${resolvedAttendees.length > 0 ? `
              <div class="flex flex-wrap gap-2">
                ${resolvedAttendees.slice(0, 12).map(u => `
                  <div class="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full pl-1 pr-3 py-1">
                    <div class="w-7 h-7 rounded-full ${u.initialsColor || 'bg-teal-900'} avatar-initials text-xs text-white flex items-center justify-center">${u.avatar || u.name?.charAt(0) || '?'}</div>
                    <span class="text-xs font-medium text-gray-700 truncate max-w-[80px] sm:max-w-[120px]">${u.name || 'User'}</span>
                  </div>
                `).join('')}
                ${resolvedAttendees.length > 12 ? `
                  <div class="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">+${resolvedAttendees.length - 12}</div>
                ` : ''}
              </div>
            ` : '<p class="text-sm text-gray-500">No attendees yet. Be the first to register!</p>'}
          </div>
        </div>

        <!-- Right Column (Sidebar) -->
        <div class="space-y-4 sm:space-y-6">
          
          <!-- Action Card -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-20">
            <div class="text-center mb-4">
              <div class="text-3xl font-bold text-gray-900 mb-1">${spotsLeft > 0 ? spotsLeft : 0}</div>
              <div class="text-sm text-gray-500">spots remaining</div>
            </div>

            ${!user ? `
              <a href="/login" data-navigate class="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-900 text-white hover:bg-teal-800 transition-colors mb-2">Login to Register</a>
            ` : isAttending ? `
              <button onclick="window.handleRsvp('${event.id}')" class="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors mb-2">Cancel Registration</button>
            ` : isFull ? `
              <button disabled class="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed mb-2">Event Full</button>
            ` : `
              <button onclick="window.handleRsvp('${event.id}')" class="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-900 text-white hover:bg-teal-800 transition-colors mb-2">Register Now</button>
            `}

            ${canEdit ? `
              <div class="grid grid-cols-2 gap-2 mt-3">
                <button onclick="window.navigateTo('/create?edit=${event.id}')" class="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-colors flex items-center justify-center gap-1">
                  ${getIcon('wrench', 12)} Edit
                </button>
                <button onclick="window.deleteEvent('${event.id}')" class="px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-1">
                  ${getIcon('trash', 12)} Delete
                </button>
              </div>
            ` : ''}

            <button onclick="window.copyEventLink('${event.id}')" class="w-full mt-2 px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-teal-900 hover:bg-gray-50 border border-gray-200 transition-colors flex items-center justify-center gap-1">
              ${getIcon('link', 12)} Copy Link
            </button>
          </div>

          <!-- Organizer Card -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Organizer</h3>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full ${event.organizer?.initialsColor || 'bg-teal-900'} avatar-initials text-lg text-white flex items-center justify-center shrink-0">${event.organizer?.avatar || '?'}</div>
              <div class="min-w-0">
                <p class="font-medium text-gray-900 truncate">${event.organizer?.name || 'Unknown'}</p>
                <p class="text-xs text-gray-500">Event Organizer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}