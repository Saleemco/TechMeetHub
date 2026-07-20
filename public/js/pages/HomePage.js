// public/js/pages/HomePage.js
import { Data, Auth } from '../data.js';
import { EventCard, SectionTitle, getIcon } from '../components.js';

export async function HomePage() {
  console.log('HomePage rendering...');
  
  try {
    const [stats, featured, upcoming, allCategories, user] = await Promise.all([
      Data.getStats(),
      Data.getFeaturedEvents(),
      Data.getUpcomingEvents(),
      Data.getCategories(),
      Auth.me()
    ]);

    console.log('Stats:', stats);
    console.log('Featured events:', featured);
    console.log('Upcoming events:', upcoming);

    return `
      <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 overflow-x-hidden">
        <!-- Hero Section -->
        <section class="relative rounded-2xl overflow-hidden mb-12 bg-orange-50">
          <div class="relative z-10 px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="max-w-xl">
              <div class="inline-flex items-center gap-2 text-orange-500 text-xs font-bold tracking-wide mb-4">
                UNIVERSITY TECH EVENTS, SIMPLIFIED
              </div>
              <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Plan. Organize.
                <span class="block text-orange-500">Inspire.</span>
              </h1>
              <p class="text-gray-500 text-base md:text-lg mb-6 max-w-md">
                Tech Event Planner is a university-focused platform to create, manage, and discover tech events with ease. From workshops to hackathons, we help you bring ideas to life and build a stronger tech community.
              </p>
              <div class="flex flex-wrap items-center gap-3">
                <a href="/events" data-navigate class="px-6 py-3 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2">
                  Explore Events ${getIcon('arrowRight', 16)}
                </a>
                ${!user ? `
                  <a href="/register" data-navigate class="px-6 py-3 rounded-lg text-sm font-semibold bg-white text-gray-800 hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2">
                    ${getIcon('userPlus', 16)} Join Free
                  </a>
                ` : user.role === 'organizer' ? `
                  <a href="/create" data-navigate class="px-6 py-3 rounded-lg text-sm font-semibold bg-white text-gray-800 hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2">
                    ${getIcon('plus', 16)} Host an Event
                  </a>
                ` : ''}
              </div>
              <div class="flex items-center gap-6 mt-8 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500">${getIcon('users', 14)}</div>
                  <span><strong class="text-gray-900">${stats?.totalEvents || 0}</strong> Events</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500">${getIcon('user', 14)}</div>
                  <span><strong class="text-gray-900">${stats?.totalAttendees || 0}+</strong> Attendees</span>
                </div>
              </div>
            </div>
            <div class="w-full max-w-md mx-auto lg:max-w-none">
              ${HeroMockup()}
            </div>
          </div>
        </section>

        <!-- Categories -->
        <section class="mb-12">
          ${SectionTitle({ title: 'Browse by Category', subtitle: 'Find events that match your interests' })}
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            ${(allCategories || []).map((cat, i) => `
              <a href="/events?category=${cat.id}" data-navigate class="group bg-white rounded-xl p-4 text-center hover:shadow-md transition-all border border-gray-200 hover:border-orange-300">
                <div class="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
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
            ${(featured || []).length > 0 ? (await Promise.all(featured.map((event, i) => EventCard(event, i, user)))).join('') : `
              <div class="col-span-full text-center text-gray-500 py-8">No featured events</div>
            `}
          </div>
        </section>

        <!-- Upcoming Events -->
        <section>
          ${SectionTitle({ title: 'Upcoming Events', subtitle: 'Mark your calendar for these upcoming tech gatherings', action: { href: '/events', label: 'View All' } })}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${(upcoming || []).slice(0, 4).length > 0 ? (await Promise.all(upcoming.slice(0, 4).map((event, i) => EventCard(event, i, user)))).join('') : `
              <div class="col-span-full text-center text-gray-500 py-8">No upcoming events</div>
            `}
          </div>
        </section>
      </div>
    `;
  } catch (error) {
    console.error('HomePage error:', error);
    return `
      <div class="page-transition max-w-7xl mx-auto py-16 text-center">
        <div class="text-red-500 mb-4">Something went wrong loading the homepage.</div>
        <div class="text-gray-500 text-sm">${error.message}</div>
        <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Refresh</button>
      </div>
    `;
  }
}

function HeroMockup() {
  return `
    <div class="relative w-full">
      <div class="relative mx-auto max-w-md">
        <!-- Laptop -->
        <div class="relative rounded-t-lg bg-gray-900 p-2 shadow-xl">
          <div class="bg-white rounded-md overflow-hidden">
            <div class="bg-gray-50 px-3 py-2 flex items-center justify-between border-b border-gray-100">
              <span class="text-[10px] font-semibold text-gray-700">Welcome back, Alex</span>
              <div class="w-5 h-5 rounded-full bg-gray-200"></div>
            </div>
            <div class="p-3 grid grid-cols-3 gap-2">
              <div class="bg-gray-50 rounded p-2">
                <div class="text-[9px] text-gray-400">Upcoming Events</div>
                <div class="text-sm font-bold text-gray-800">8</div>
              </div>
              <div class="bg-gray-50 rounded p-2">
                <div class="text-[9px] text-gray-400">Participants</div>
                <div class="text-sm font-bold text-gray-800">1,245</div>
              </div>
              <div class="bg-gray-50 rounded p-2">
                <div class="text-[9px] text-gray-400">Tasks Pending</div>
                <div class="text-sm font-bold text-orange-500">12</div>
              </div>
            </div>
            <div class="px-3 pb-3 space-y-1.5">
              <div class="h-4 bg-gray-50 rounded flex items-center px-2 text-[8px] text-gray-400">AI Summit 2026</div>
              <div class="h-4 bg-gray-50 rounded flex items-center px-2 text-[8px] text-gray-400">Web Development Workshop</div>
              <div class="h-4 bg-gray-50 rounded flex items-center px-2 text-[8px] text-gray-400">CodeFest Hackathon</div>
            </div>
          </div>
        </div>
        <div class="h-3 bg-gray-800 rounded-b-lg mx-4"></div>

        <!-- Phone overlay -->
        <div class="absolute -right-2 sm:-right-4 -bottom-8 w-24 sm:w-28 rounded-2xl bg-gray-900 p-1.5 shadow-xl">
          <div class="bg-white rounded-xl overflow-hidden">
            <div class="bg-gray-50 px-2 py-1.5 text-[8px] font-semibold text-gray-700">Upcoming Events</div>
            <div class="p-1.5 space-y-1">
              <div class="h-6 bg-gray-50 rounded"></div>
              <div class="h-6 bg-gray-50 rounded"></div>
              <div class="h-6 bg-gray-50 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}