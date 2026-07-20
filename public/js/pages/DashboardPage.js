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
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Welcome back, ${user.name}! 👋</h1>
        <p class="text-gray-400 text-sm mt-1">Discover and manage events you're attending</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${StatCard({ icon: 'calendar', value: attending.length, label: 'My Registrations', color: 'purple' })}
        ${StatCard({ icon: 'check', value: upcoming.length, label: 'Upcoming Events', color: 'emerald' })}
        ${StatCard({ icon: 'award', value: past.length, label: 'Attended', color: 'amber' })}
        ${StatCard({ icon: 'trend', value: stats.totalEvents || 0, label: 'Total Events', color: 'cyan' })}
      </div>

      <!-- Upcoming Events -->
      <div class="mb-8">
        ${SectionTitle({ title: 'My Registrations', subtitle: `${upcoming.length} events you're attending`, action: { href: '/events', label: 'View All' } })}
        <div class="space-y-3">
          ${upcoming.length > 0 ? (await Promise.all(upcoming.map(e => EventListItem(e, true)))).join('') : `
            <div class="glass rounded-xl p-8 text-center border border-white/5">
              <div class="text-gray-500 mb-2">${getIcon('calendar', 32)}</div>
              <p class="text-gray-400 text-sm">No upcoming events</p>
              <a href="/events" data-navigate class="text-purple-400 text-sm hover:text-purple-300 mt-2 inline-block">Browse events</a>
            </div>
          `}
        </div>
      </div>

      <!-- Past Events -->
      <div>
        ${SectionTitle({ title: 'Past Events', subtitle: "Events you've attended" })}
        <div class="space-y-3">
          ${past.length > 0 ? (await Promise.all(past.map(e => EventListItem(e, true)))).join('') : `
            <div class="glass rounded-xl p-8 text-center border border-white/5">
              <div class="text-gray-500 mb-2">${getIcon('award', 32)}</div>
              <p class="text-gray-400 text-sm">No past events yet</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

async function OrganizerDashboard(user) {
  const [stats, hosting] = await Promise.all([
    Data.getStats(),
    Data.getHostingEvents()
  ]);
  
  const now = new Date().toISOString().split('T')[0];
  const upcoming = hosting.filter(e => e.date >= now);
  const past = hosting.filter(e => e.date < now);
  const totalAttendees = hosting.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);

  return `
    <div class="page-transition">
      <!-- Welcome Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Organizer Dashboard</h1>
            <p class="text-gray-400 text-sm mt-1">Manage your events and track performance</p>
          </div>
          <a href="/create" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity flex items-center gap-2">
            ${getIcon('plus', 16)} Create Event
          </a>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${StatCard({ icon: 'calendar', value: hosting.length, label: 'Events Hosted', color: 'purple' })}
        ${StatCard({ icon: 'users', value: totalAttendees, label: 'Total Attendees', color: 'cyan' })}
        ${StatCard({ icon: 'check', value: upcoming.length, label: 'Upcoming', color: 'emerald' })}
        ${StatCard({ icon: 'award', value: past.length, label: 'Completed', color: 'amber' })}
      </div>

      <!-- My Events -->
      <div>
        ${SectionTitle({ title: 'My Events', subtitle: `${upcoming.length} upcoming events`, action: { href: '/events', label: 'View All' } })}
        <div class="space-y-3">
          ${hosting.length > 0 ? (await Promise.all(hosting.map(e => EventListItem(e)))).join('') : `
            <div class="glass rounded-xl p-8 text-center border border-white/5">
              <div class="text-gray-500 mb-2">${getIcon('calendar', 32)}</div>
              <p class="text-gray-400 text-sm">No events yet</p>
              <a href="/create" data-navigate class="text-purple-400 text-sm hover:text-purple-300 mt-2 inline-block">Create your first event</a>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

async function AdminDashboard() {
  const [adminStats, allUsers, allEvents] = await Promise.all([
    Data.getAdminStats(),
    Data.getAdminUsers(),
    Data.getAdminEvents()
  ]);

  // Calculate some extra stats
  const totalAttendees = adminStats.totalAttendees || 0;
  const totalUsers = adminStats.totalUsers || 0;
  const totalEvents = adminStats.totalEvents || 0;
  const participants = adminStats.participants || 0;
  const organizers = adminStats.organizers || 0;
  const admins = adminStats.admins || 0;

  return `
    <div class="page-transition">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p class="text-gray-400 text-sm mt-1">Overview of platform activity</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${StatCard({ icon: 'calendar', value: totalEvents, label: 'Total Events', color: 'purple' })}
        ${StatCard({ icon: 'users', value: totalAttendees, label: 'Total Attendees', color: 'emerald', change: '+12.0%' })}
        ${StatCard({ icon: 'user', value: totalUsers, label: 'Total Users', color: 'cyan' })}
        ${StatCard({ icon: 'trend', value: participants, label: 'Participants', color: 'blue' })}
      </div>

      <!-- Second Row Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        ${StatCard({ icon: 'briefcase', value: organizers, label: 'Organizers', color: 'amber' })}
        ${StatCard({ icon: 'shield', value: admins, label: 'Admins', color: 'rose' })}
        ${StatCard({ icon: 'calendar', value: adminStats.upcomingEvents || 0, label: 'Upcoming Events', color: 'emerald' })}
      </div>

      <!-- Users and Events Lists -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Users List -->
        <div class="glass rounded-xl p-6 border border-white/5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-white">All Users (${allUsers.length})</h2>
          </div>
          <div class="space-y-2 max-h-80 overflow-y-auto pr-2">
            ${allUsers.map(u => `
              <div class="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div class="w-8 h-8 rounded-full ${u.initialsColor || 'bg-gradient-to-br from-purple-500 to-pink-500'} avatar-initials text-xs">${u.avatar || '?'}</div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-white truncate text-sm">${u.name}</div>
                  <div class="text-xs text-gray-400 truncate">${u.email}</div>
                </div>
                <span class="px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : u.role === 'organizer' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}">${u.role}</span>
                <button onclick="window.deleteUser('${u.id}')" class="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                  ${getIcon('trash', 14)}
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Events List -->
        <div class="glass rounded-xl p-6 border border-white/5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-white">All Events (${allEvents.length})</h2>
          </div>
          <div class="space-y-2 max-h-80 overflow-y-auto pr-2">
            ${allEvents.map(e => `
              <div class="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <img src="${e.image}" alt="" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-white truncate text-sm">${e.title}</div>
                  <div class="text-xs text-gray-400">${e.location} · ${e.attendees?.length || 0}/${e.capacity}</div>
                </div>
                <button onclick="window.deleteEventAdmin('${e.id}')" class="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                  ${getIcon('trash', 14)}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}