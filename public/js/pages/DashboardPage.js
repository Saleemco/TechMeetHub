// public/js/pages/DashboardPage.js
import { Data, Auth } from '../data.js';
import { EventListItem, SectionTitle, StatCard, getIcon } from '../components.js';
import { LoginPage } from './LoginPage.js';

export async function DashboardPage() {
  const user = await Auth.me();
  if (!user) return LoginPage({ redirect: '/dashboard' });

  if (user.role === 'admin') return AdminDashboard();
  if (user.role === 'organizer') return OrganizerDashboard(user);
  return ParticipantDashboard(user);
}

// ========== ADMIN DASHBOARD ==========
async function AdminDashboard() {
  const [adminStats, allUsers, allEvents] = await Promise.all([
    Data.getAdminStats(),
    Data.getAdminUsers(),
    Data.getAdminEvents()
  ]);

  const totalEvents = adminStats.totalEvents || 0;
  const totalAttendees = adminStats.totalAttendees || 0;
  const totalUsers = adminStats.totalUsers || 0;
  const participants = adminStats.participants || 0;
  const organizers = adminStats.organizers || 0;
  const admins = adminStats.admins || 0;

  const upcomingEvents = allEvents
    .filter(e => e.date >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const recentUsers = allUsers.slice(0, 5);

  return `
    <div class="page-transition">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-500 text-sm mt-1">Platform overview and management</p>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        ${StatCard({ icon: 'calendar', value: totalEvents, label: 'Total Events', color: 'blue', change: '+12' })}
        ${StatCard({ icon: 'users', value: totalAttendees.toLocaleString(), label: 'Attendees', color: 'green', change: '+18%' })}
        ${StatCard({ icon: 'user', value: totalUsers, label: 'Total Users', color: 'amber', change: '+12%' })}
        ${StatCard({ icon: 'clock', value: adminStats.upcomingEvents || 0, label: 'Upcoming', color: 'purple', change: '+12' })}
      </div>

      <!-- User Breakdown Row -->
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
        <div class="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              ${getIcon('users', 12)}
            </div>
            <div>
              <div class="text-base sm:text-lg font-bold text-gray-900">${participants}</div>
              <div class="text-xs text-gray-500">Participants</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              ${getIcon('briefcase', 12)}
            </div>
            <div>
              <div class="text-base sm:text-lg font-bold text-gray-900">${organizers}</div>
              <div class="text-xs text-gray-500">Organizers</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow col-span-2 lg:col-span-1">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              ${getIcon('shield', 12)}
            </div>
            <div>
              <div class="text-base sm:text-lg font-bold text-gray-900">${admins}</div>
              <div class="text-xs text-gray-500">Admins</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        <a href="/admin/events" data-navigate class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">${getIcon('calendar', 16)}</div>
          <div class="min-w-0">
            <div class="text-xs sm:text-sm font-semibold text-gray-900 truncate">All Events</div>
            <div class="text-[10px] sm:text-xs text-gray-500">Manage events</div>
          </div>
        </a>
        <a href="/create" data-navigate class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">${getIcon('plus', 16)}</div>
          <div class="min-w-0">
            <div class="text-xs sm:text-sm font-semibold text-gray-900 truncate">Create Event</div>
            <div class="text-[10px] sm:text-xs text-gray-500">New event</div>
          </div>
        </a>
        <a href="/admin/users" data-navigate class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">${getIcon('users', 16)}</div>
          <div class="min-w-0">
            <div class="text-xs sm:text-sm font-semibold text-gray-900 truncate">Manage Users</div>
            <div class="text-[10px] sm:text-xs text-gray-500">${totalUsers} users</div>
          </div>
        </a>
        <a href="/profile" data-navigate class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">${getIcon('user', 16)}</div>
          <div class="min-w-0">
            <div class="text-xs sm:text-sm font-semibold text-gray-900 truncate">My Profile</div>
            <div class="text-[10px] sm:text-xs text-gray-500">Edit profile</div>
          </div>
        </a>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <!-- Upcoming Events Table -->
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <a href="/admin/events" data-navigate class="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors">View All</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs sm:text-sm">
              <thead>
                <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Event</th>
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium hidden md:table-cell">Date</th>
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium hidden lg:table-cell">Organizer</th>
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Attendees</th>
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${upcomingEvents.length > 0 ? upcomingEvents.map(e => `
                  <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-900 cursor-pointer truncate max-w-[120px] sm:max-w-none" onclick="window.navigateTo('/events/${e.id}')">${e.title}</td>
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 hidden md:table-cell cursor-pointer whitespace-nowrap" onclick="window.navigateTo('/events/${e.id}')">${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 hidden lg:table-cell cursor-pointer" onclick="window.navigateTo('/events/${e.id}')">${e.organizer?.name || 'Unknown'}</td>
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 cursor-pointer whitespace-nowrap" onclick="window.navigateTo('/events/${e.id}')">${e.attendees?.length || 0} / ${e.capacity}</td>
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                      <button onclick="window.deleteEventAdmin('${e.id}')" class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete event">
                        ${getIcon('trash', 14)}
                      </button>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-gray-500">No upcoming events</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Users Table -->
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Recent Users</h2>
            <a href="/admin/users" data-navigate class="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors">View All</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs sm:text-sm">
              <thead>
                <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">User</th>
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Role</th>
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium hidden md:table-cell">Email</th>
                  <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${recentUsers.length > 0 ? recentUsers.map(u => `
                  <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3">
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full ${u.initialsColor || 'bg-gray-400'} avatar-initials text-[10px] text-white flex items-center justify-center shrink-0">${u.avatar || '?'}</div>
                        <span class="font-medium text-gray-900 truncate max-w-[80px] sm:max-w-none">${u.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3">
                      <span class="inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : u.role === 'organizer' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}">${u.role || 'participant'}</span>
                    </td>
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 hidden md:table-cell truncate">${u.email || '-'}</td>
                    <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                      <button onclick="window.deleteUser('${u.id}')" class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete user">
                        ${getIcon('trash', 14)}
                      </button>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-gray-500">No users found</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========== ORGANIZER DASHBOARD ==========
async function OrganizerDashboard(user) {
  const [stats, hosting] = await Promise.all([
    Data.getStats(),
    Data.getHostingEvents()
  ]);
  
  const now = new Date().toISOString().split('T')[0];
  const upcoming = hosting.filter(e => e.date >= now);
  const past = hosting.filter(e => e.date < now);
  const totalAttendees = hosting.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);

  const upcomingEvents = hosting
    .filter(e => e.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return `
    <div class="page-transition">
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p class="text-gray-500 text-sm mt-1">Manage your events and track performance</p>
          </div>
          <a href="/create" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            ${getIcon('plus', 16)} Create Event
          </a>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        ${StatCard({ icon: 'calendar', value: hosting.length, label: 'My Events', color: 'blue' })}
        ${StatCard({ icon: 'users', value: totalAttendees, label: 'Attendees', color: 'green', change: '+16%' })}
        ${StatCard({ icon: 'check', value: upcoming.length, label: 'Upcoming', color: 'amber' })}
        ${StatCard({ icon: 'award', value: past.length, label: 'Completed', color: 'purple' })}
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">My Upcoming Events</h2>
          <a href="/events" data-navigate class="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors">View All</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs sm:text-sm">
            <thead>
              <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Event</th>
                <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium hidden md:table-cell">Date</th>
                <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Attendees</th>
                <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium hidden lg:table-cell">Revenue</th>
                <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${upcomingEvents.length > 0 ? upcomingEvents.map(e => `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-900 cursor-pointer truncate max-w-[120px] sm:max-w-none" onclick="window.navigateTo('/events/${e.id}')">${e.title}</td>
                  <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 hidden md:table-cell cursor-pointer whitespace-nowrap" onclick="window.navigateTo('/events/${e.id}')">${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 cursor-pointer whitespace-nowrap" onclick="window.navigateTo('/events/${e.id}')">${e.attendees?.length || 0} / ${e.capacity}</td>
                  <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 hidden lg:table-cell cursor-pointer" onclick="window.navigateTo('/events/${e.id}')">$${(e.attendees?.length || 0) * 25}</td>
                  <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                    <button onclick="window.navigateTo('/create?edit=${e.id}')" class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors mr-1" title="Edit event">
                      ${getIcon('wrench', 14)}
                    </button>
                    <button onclick="window.deleteEvent('${e.id}')" class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete event">
                      ${getIcon('trash', 14)}
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="px-4 py-8 text-center text-gray-500">No upcoming events</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ========== PARTICIPANT DASHBOARD ==========
async function ParticipantDashboard(user) {
  const [stats, attending] = await Promise.all([
    Data.getStats(),
    Data.getAttendingEvents()
  ]);
  
  const now = new Date().toISOString().split('T')[0];
  const upcoming = attending.filter(e => e.date >= now);
  const past = attending.filter(e => e.date < now);

  return `
    <div class="page-transition">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, ${user.name}! 👋</h1>
        <p class="text-gray-500 text-sm mt-1">Discover and manage events you're attending</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        ${StatCard({ icon: 'calendar', value: attending.length, label: 'My Registrations', color: 'blue' })}
        ${StatCard({ icon: 'check', value: upcoming.length, label: 'Upcoming Events', color: 'green' })}
        ${StatCard({ icon: 'award', value: past.length, label: 'Attended', color: 'amber' })}
        ${StatCard({ icon: 'trend', value: stats.totalEvents || 0, label: 'Total Events', color: 'purple' })}
      </div>

      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">My Registrations</h2>
          <a href="/events" data-navigate class="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors">View All</a>
        </div>
        <div class="space-y-3">
          ${upcoming.length > 0 ? (await Promise.all(upcoming.map(e => EventListItem(e, true)))).join('') : `
            <div class="bg-white rounded-xl p-6 sm:p-8 text-center border border-gray-200">
              <div class="text-gray-400 mb-2">${getIcon('calendar', 28)}</div>
              <p class="text-gray-500 text-sm">No upcoming events</p>
              <a href="/events" data-navigate class="text-blue-600 text-sm hover:text-blue-800 mt-2 inline-block">Browse events</a>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}