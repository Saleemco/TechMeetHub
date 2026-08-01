// public/js/pages/AdminEventsPage.js
import { Data, Auth } from '../data.js';
import { getIcon } from '../components.js';
import { LoginPage } from './LoginPage.js';

export async function AdminEventsPage() {
  const user = await Auth.me();
  if (!user) return LoginPage({ redirect: '/admin/events' });
  if (user.role !== 'admin') {
    return `
      <div class="page-transition max-w-7xl mx-auto">
        <div class="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-600">${getIcon('shield', 28)}</div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p class="text-gray-500 text-sm mb-4">You don't have permission to view this page.</p>
          <a href="/dashboard" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-teal-900 text-white hover:bg-teal-800 transition-colors">Go to Dashboard</a>
        </div>
      </div>
    `;
  }

  const allEvents = await Data.getAdminEvents();
  const today = new Date().toISOString().split('T')[0];

  return `
    <div class="page-transition max-w-7xl mx-auto">
      <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">All Events</h1>
          <p class="text-gray-500 text-sm mt-1">${allEvents.length} total events</p>
        </div>
        <a href="/dashboard" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors flex items-center gap-2">
          ${getIcon('arrowLeft', 16)} Back to Dashboard
        </a>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th class="px-4 py-3 font-medium">Event</th>
                <th class="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th class="px-4 py-3 font-medium hidden lg:table-cell">Organizer</th>
                <th class="px-4 py-3 font-medium">Attendees</th>
                <th class="px-4 py-3 font-medium hidden md:table-cell">Status</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allEvents.length > 0 ? allEvents.map(e => `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <img src="${e.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=100&h=100&fit=crop'}" alt="" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <div class="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" onclick="window.navigateTo('/events/${e.id}')">${e.title}</div>
                        <div class="text-xs text-gray-500">${e.location || 'No location'}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-gray-500 hidden md:table-cell">${e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</td>
                  <td class="px-4 py-3 text-gray-500 hidden lg:table-cell">${e.organizer?.name || 'Unknown'}</td>
                  <td class="px-4 py-3 text-gray-500">${e.attendees?.length || 0} / ${e.capacity || 0}</td>
                  <td class="px-4 py-3 hidden md:table-cell">
                    <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium ${e.date >= today ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}">${e.date >= today ? 'Upcoming' : 'Past'}</span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button onclick="window.navigateTo('/events/${e.id}')" class="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors mr-1" title="View event">
                      ${getIcon('arrowRight', 16)}
                    </button>
                    <button onclick="window.deleteEventAdmin('${e.id}')" class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete event">
                      ${getIcon('trash', 16)}
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" class="px-4 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                      <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">${getIcon('calendar', 24)}</div>
                      <p>No events found</p>
                    </div>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}