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
    <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">My Events</h1>
        <p class="text-secondary">Track your events and discover new ones</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        ${StatCard({ icon: 'calendar', value: attending.length, label: 'Attending', color: 'brand' })}
        ${StatCard({ icon: 'check', value: upcoming.length, label: 'Upcoming', color: 'emerald' })}
        ${StatCard({ icon: 'award', value: past.length, label: 'Attended', color: 'amber' })}
        ${StatCard({ icon: 'trend', value: stats.totalEvents, label: 'Total Events', color: 'accent' })}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          ${SectionTitle({ title: 'Upcoming', subtitle: `${upcoming.length} events to attend` })}
          <div class="space-y-3">
            ${upcoming.length > 0 ? (await Promise.all(upcoming.map(e => EventListItem(e, true)))).join('') : `
              <div class="glass rounded-lg p-8 text-center">
                <div class="text-gray-500 mb-2">${getIcon('calendar', 32)}</div>
                <p class="text-secondary text-sm">No upcoming events</p>
                <a href="/events" data-navigate class="text-brand-400 text-sm hover:text-brand-300 mt-2 inline-block">Browse events</a>
              </div>
            `}
          </div>
        </div>
        <div>
          ${SectionTitle({ title: 'Past Events', subtitle: "Events you've attended" })}
          <div class="space-y-3">
            ${past.length > 0 ? (await Promise.all(past.map(e => EventListItem(e, true)))).join('') : `
              <div class="glass rounded-lg p-8 text-center">
                <div class="text-gray-500 mb-2">${getIcon('award', 32)}</div>
                <p class="text-secondary text-sm">No past events yet</p>
              </div>
            `}
          </div>
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
  const totalAttendees = hosting.reduce((sum, e) => sum + e.attendees.length, 0);

  return `
    <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Organizer Dashboard</h1>
        <p class="text-secondary">Manage your events and track their performance</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        ${StatCard({ icon: 'calendar', value: hosting.length, label: 'Events Hosted', color: 'brand' })}
        ${StatCard({ icon: 'users', value: totalAttendees, label: 'Total Attendees', color: 'accent' })}
        ${StatCard({ icon: 'check', value: upcoming.length, label: 'Upcoming', color: 'emerald' })}
        ${StatCard({ icon: 'award', value: past.length, label: 'Completed', color: 'amber' })}
      </div>
      <div class="mb-6">
        ${SectionTitle({ title: 'My Events', subtitle: `${upcoming.length} upcoming events`, action: { href: '/create', label: 'Create New' } })}
        <div class="space-y-3">
          ${hosting.length > 0 ? (await Promise.all(hosting.map(e => EventListItem(e)))).join('') : `
            <div class="glass rounded-lg p-8 text-center">
              <div class="text-gray-500 mb-2">${getIcon('calendar', 32)}</div>
              <p class="text-secondary text-sm">No events yet</p>
              <a href="/create" data-navigate class="text-brand-400 text-sm hover:text-brand-300 mt-2 inline-block">Create your first event</a>
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

  return `
    <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p class="text-secondary">Manage the entire platform</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        ${StatCard({ icon: 'users', value: adminStats.totalUsers, label: 'Total Users', color: 'brand' })}
        ${StatCard({ icon: 'calendar', value: adminStats.totalEvents, label: 'Total Events', color: 'accent' })}
        ${StatCard({ icon: 'user', value: adminStats.totalAttendees, label: 'Attendees', color: 'emerald' })}
        ${StatCard({ icon: 'zap', value: adminStats.participants, label: 'Participants', color: 'cyan' })}
        ${StatCard({ icon: 'briefcase', value: adminStats.organizers, label: 'Organizers', color: 'amber' })}
        ${StatCard({ icon: 'shield', value: adminStats.admins, label: 'Admins', color: 'rose' })}
      </div>

      <!-- Users and Events Lists -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Users List -->
        <div class="glass rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-white">All Users (${allUsers.length})</h2>
          </div>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            ${allUsers.map(u => `
              <div class="flex items-center gap-3 p-3 bg-input rounded-lg participant-list-item">
                <div class="w-10 h-10 rounded-full ${u.initialsColor} avatar-initials text-sm">${u.avatar}</div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-white truncate">${u.name}</div>
                  <div class="text-sm text-secondary">${u.email}</div>
                </div>
                <span class="px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : u.role === 'organizer' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}">${u.role}</span>
                <button onclick="window.deleteUser('${u.id}')" class="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">${getIcon('trash', 14)}</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Events List -->
        <div class="glass rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-white">All Events (${allEvents.length})</h2>
          </div>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            ${allEvents.map(e => `
              <div class="flex items-center gap-3 p-3 bg-input rounded-lg participant-list-item">
                <img src="${e.image}" alt="" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-white truncate">${e.title}</div>
                  <div class="text-sm text-secondary">${e.location} · ${e.attendees.length}/${e.capacity}</div>
                </div>
                <button onclick="window.deleteEventAdmin('${e.id}')" class="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">${getIcon('trash', 14)}</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}