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
      <section class="hero-section">
        <div class="hero-bg-image">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=600&fit=crop" alt="Tech community" />
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative hero-content">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
              ${getIcon('zap', 14)} The tech community's favorite event platform
            </div>
            <h1 class="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Connect. Learn. <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400 glow-text">Build.</span>
            </h1>
            <p class="text-lg text-secondary mb-8 max-w-xl">
              Discover hackathons, meetups, workshops, and conferences. Join thousands of developers building the future together.
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <a href="/events" data-navigate class="px-6 py-3 rounded-xl text-base font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-colors flex items-center gap-2 animate-pulse-glow">
                Explore Events ${getIcon('arrowRight', 18)}
              </a>
              ${!user ? `
                <a href="/register" data-navigate class="px-6 py-3 rounded-xl text-base font-semibold btn-secondary text-primary flex items-center gap-2">
                  ${getIcon('userPlus', 18)} Join Free
                </a>
              ` : user.role === 'organizer' ? `
                <a href="/create" data-navigate class="px-6 py-3 rounded-xl text-base font-semibold btn-secondary text-primary flex items-center gap-2">
                  ${getIcon('plus', 18)} Host an Event
                </a>
              ` : ''}
            </div>
            <div class="flex items-center gap-6 mt-10 text-sm text-secondary">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">${getIcon('users', 14)}</div>
                <span><strong class="text-white">${stats.totalEvents}</strong> Events</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center">${getIcon('user', 14)}</div>
                <span><strong class="text-white">${stats.totalAttendees}+</strong> Attendees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        ${SectionTitle({ title: 'Browse by Category', subtitle: 'Find events that match your interests' })}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          ${allCategories.map((cat, i) => `
            <a href="/events?category=${cat.id}" data-navigate class="group glass rounded-xl p-5 text-center hover:scale-105 transition-transform cursor-pointer animate-fade-in-up stagger-${i + 1} opacity-0" style="animation-fill-mode: forwards;">
              <div class="w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <div class="text-white">${getIcon(cat.icon, 22)}</div>
              </div>
              <span class="font-medium text-white text-sm">${cat.label}</span>
            </a>
          `).join('')}
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        ${SectionTitle({ title: 'Featured Events', subtitle: "Hand-picked events you don't want to miss", action: { href: '/events', label: 'View all' } })}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${(await Promise.all(featured.map((event, i) => EventCard(event, i, user)))).join('')}
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        ${SectionTitle({ title: 'Upcoming Events', subtitle: 'Mark your calendar for these upcoming tech gatherings', action: { href: '/events', label: 'View all' } })}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${(await Promise.all(upcoming.slice(0, 4).map((event, i) => EventCard(event, i, user)))).join('')}
        </div>
      </section>
    </div>
  `;
}