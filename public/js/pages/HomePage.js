// public/js/pages/HomePage.js
import { Data, Auth } from '../data.js';
import { EventCard, SectionTitle, getIcon } from '../components.js';

export async function HomePage() {
  const [stats, featured, upcoming, allCategories, user] = await Promise.all([
    Data.getStats(),
    Data.getFeaturedEvents(),
    Data.getUpcomingEvents(),
    Data.getCategories(),
    Auth.me()
  ]);

  return `
    <div class="page-transition">
      <!-- Hero Section -->
      <section class="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div class="relative z-10 px-6 py-16 md:py-24 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium mb-4">
            ${getIcon('zap', 12)} The tech community's favorite event platform
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Connect. Learn. <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Build.</span>
          </h1>
          <p class="text-white/80 text-lg mb-6 max-w-xl">
            Discover hackathons, meetups, workshops, and conferences. Join thousands of developers building the future together.
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <a href="/events" data-navigate class="px-6 py-3 rounded-lg text-sm font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2">
              Explore Events ${getIcon('arrowRight', 16)}
            </a>
            ${!user ? `
              <a href="/register" data-navigate class="px-6 py-3 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2">
                ${getIcon('userPlus', 16)} Join Free
              </a>
            ` : user.role === 'organizer' ? `
              <a href="/create" data-navigate class="px-6 py-3 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2">
                ${getIcon('plus', 16)} Host an Event
              </a>
            ` : ''}
          </div>
          <div class="flex items-center gap-6 mt-8 text-sm text-white/80">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">${getIcon('users', 14)}</div>
              <span><strong class="text-white">${stats.totalEvents || 0}</strong> Events</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">${getIcon('user', 14)}</div>
              <span><strong class="text-white">${stats.totalAttendees || 0}+</strong> Attendees</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="mb-12">
        ${SectionTitle({ title: 'Browse by Category', subtitle: 'Find events that match your interests' })}
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          ${allCategories.map((cat, i) => `
            <a href="/events?category=${cat.id}" data-navigate class="group bg-white rounded-xl p-4 text-center hover:shadow-md transition-all border border-gray-200 hover:border-blue-300">
              <div class="w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <div class="text-white">${getIcon(cat.icon, 22)}</div>
              </div>
              <span class="font-medium text-gray-700 text-sm">${cat.label}</span>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- Featured Events -->
      <section class="mb-12">
        ${SectionTitle({ title: 'Featured Events', subtitle: "Hand-picked events you don't want to miss", action: { href: '/events', label: 'View All' } })}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${(await Promise.all(featured.map((event, i) => EventCard(event, i, user)))).join('')}
        </div>
      </section>

      <!-- Upcoming Events -->
      <section>
        ${SectionTitle({ title: 'Upcoming Events', subtitle: 'Mark your calendar for these upcoming tech gatherings', action: { href: '/events', label: 'View All' } })}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${(await Promise.all(upcoming.slice(0, 4).map((event, i) => EventCard(event, i, user)))).join('')}
        </div>
      </section>
    </div>
  `;
}