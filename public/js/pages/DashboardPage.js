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
    .slice(0, 4);

  return `
    <div class="page-transition">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-500 text-sm mt-1">Overview of platform activity</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${StatCard({ icon: 'calendar', value: totalEvents, label: 'Total Events', color: 'blue', change: '+12 this month' })}
        ${StatCard({ icon: 'users', value: totalAttendees.toLocaleString(), label: 'Total Attendees', color: 'green', change: '+18.5%' })}
        ${StatCard({ icon: 'user', value: totalUsers, label: 'Total Users', color: 'amber', change: '+12.3%' })}
        ${StatCard({ icon: 'clock', value: adminStats.upcomingEvents || 0, label: 'Upcoming Events', color: 'purple', change: '+12' })}
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              ${getIcon('users', 14)}
            </div>
            <div>
              <div class="text-lg font-bold text-gray-900">${participants}</div>
              <div class="text-xs text-gray-500">Participants</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              ${getIcon('briefcase', 14)}
            </div>
            <div>
              <div class="text-lg font-bold text-gray-900">${organizers}</div>
              <div class="text-xs text-gray-500">Organizers</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              ${getIcon('shield', 14)}
            </div>
            <div>
              <div class="text-lg font-bold text-gray-900">${admins}</div>
              <div class="text-xs text-gray-500">Admins</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          <a href="/events" data-navigate class="text-sm text-blue-600 hover:text-blue-800 transition-colors">View All</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th class="px-4 py-3 font-medium">Event</th>
                <th class="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th class="px-4 py-3 font-medium hidden lg:table-cell">Organizer</th>
                <th class="px-4 py-3 font-medium">Attendees</th>
                <th class="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              ${upcomingEvents.length > 0 ? upcomingEvents.map(e => `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.navigateTo('/events/${e.id}')">
                  <td class="px-4 py-3 font-medium text-gray-900">${e.title}</td>
                  <td class="px-4 py-3 text-gray-500 hidden md:table-cell">${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td class="px-4 py-3 text-gray-500 hidden lg:table-cell">${e.organizer?.name || 'Unknown'}</td>
                  <td class="px-4 py-3 text-gray-500">${e.attendees?.length || 0} / ${e.capacity}</td>
                  <td class="px-4 py-3">
                    <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">Published</span>
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
    .slice(0, 4);

  return `
    <div class="page-transition">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p class="text-gray-500 text-sm mt-1">Manage your events and track performance</p>
          </div>
          <a href="/create" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
            ${getIcon('plus', 16)} Create Event
          </a>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${StatCard({ icon: 'calendar', value: hosting.length, label: 'My Events', color: 'blue' })}
        ${StatCard({ icon: 'users', value: totalAttendees, label: 'Total Attendees', color: 'green', change: '+16%' })}
        ${StatCard({ icon: 'check', value: upcoming.length, label: 'Upcoming', color: 'amber' })}
        ${StatCard({ icon: 'award', value: past.length, label: 'Completed', color: 'purple' })}
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">My Upcoming Events</h2>
          <a href="/events" data-navigate class="text-sm text-blue-600 hover:text-blue-800 transition-colors">View All</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th class="px-4 py-3 font-medium">Event</th>
                <th class="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th class="px-4 py-3 font-medium">Attendees</th>
                <th class="px-4 py-3 font-medium hidden lg:table-cell">Revenue</th>
                <th class="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              ${upcomingEvents.length > 0 ? upcomingEvents.map(e => `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.navigateTo('/events/${e.id}')">
                  <td class="px-4 py-3 font-medium text-gray-900">${e.title}</td>
                  <td class="px-4 py-3 text-gray-500 hidden md:table-cell">${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td class="px-4 py-3 text-gray-500">${e.attendees?.length || 0} / ${e.capacity}</td>
                  <td class="px-4 py-3 text-gray-500 hidden lg:table-cell">$${(e.attendees?.length || 0) * 25}</td>
                  <td class="px-4 py-3">
                    <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">Published</span>
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
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Welcome back, ${user.name}! 👋</h1>
        <p class="text-gray-500 text-sm mt-1">Discover and manage events you're attending</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${StatCard({ icon: 'calendar', value: attending.length, label: 'My Registrations', color: 'blue' })}
        ${StatCard({ icon: 'check', value: upcoming.length, label: 'Upcoming Events', color: 'green' })}
        ${StatCard({ icon: 'award', value: past.length, label: 'Attended', color: 'amber' })}
        ${StatCard({ icon: 'trend', value: stats.totalEvents || 0, label: 'Total Events', color: 'purple' })}
      </div>

      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">My Registrations</h2>
          <a href="/events" data-navigate class="text-sm text-blue-600 hover:text-blue-800 transition-colors">View All</a>
        </div>
        <div class="space-y-3">
          ${upcoming.length > 0 ? (await Promise.all(upcoming.map(e => EventListItem(e, true)))).join('') : `
            <div class="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div class="text-gray-400 mb-2">${getIcon('calendar', 32)}</div>
              <p class="text-gray-500 text-sm">No upcoming events</p>
              <a href="/events" data-navigate class="text-blue-600 text-sm hover:text-blue-800 mt-2 inline-block">Browse events</a>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}