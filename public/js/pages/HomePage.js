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
      <div class="page-transition -mt-6 -mb-6">

        <!-- Hero Section -->
        <section class="relative bg-teal-900 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] lg:min-h-0 flex items-center">
          <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div class="max-w-xl">
              <div class="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full mb-5">
                ${getIcon('calendar', 14)} Smarter Events. Stronger Communities.
              </div>
              <h1 class="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-white leading-tight mb-3">
                Plan, Manage and Grow
                Your <span class="text-orange-400">Tech Events</span> with Ease
              </h1>
              <p class="text-teal-100/80 text-base md:text-lg mb-6 max-w-md">
                TechMeetHub is the all-in-one platform for creating, managing and scaling impactful tech events — from meetups to global conferences.
              </p>
              <div class="flex flex-wrap items-center gap-4">
                <a href="/register" data-navigate class="px-6 py-3 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2">
                  Create an Event ${getIcon('arrowRight', 16)}
                </a>
                <a href="/events" data-navigate class="px-6 py-3 rounded-lg text-sm font-semibold bg-transparent text-white border border-white/40 hover:bg-white/10 transition-colors flex items-center gap-2">
                  Browse Events ${getIcon('calendar', 16)}
                </a>
              </div>
            </div>
            <div class="w-full max-w-lg mx-auto lg:max-w-none">
              ${HeroImage()}
            </div>
          </div>
        </section>

        <!-- Stats Bar -->
        <section class="bg-gray-100 -mx-4 sm:-mx-6 lg:-mx-8">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 grid grid-cols-2 lg:grid-cols-4 divide-y-0 gap-y-6">
            ${StatItem('users', `${(stats?.totalAttendees || 10000).toLocaleString()}+`, 'Event Attendees')}
            ${StatItem('calendar', `${stats?.totalEvents || 350}+`, 'Events Hosted')}
            ${StatItem('building', `${stats?.totalPartners || 120}+`, 'Partner Organizations')}
            ${StatItem('globe', `${stats?.citiesReached || 15}+`, 'Cities Reached')}
          </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">

          <!-- Feature Highlights -->
          <section class="py-10 md:py-14 text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Everything You Need to Run Successful Tech Events
            </h2>
            <div class="w-16 h-1 bg-orange-500 mx-auto mb-3 rounded-full"></div>
            <p class="text-gray-500 mb-10">Powerful tools to help you create memorable experiences for your community.</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              ${FeatureCard('calendar', 'Easy Event Creation', 'Set up and publish your events in minutes with our streamlined tools.', '/register', 'Create Event')}
              ${FeatureCard('mic', 'Manage Speakers & Sessions', 'Organize your agenda, speakers and schedules all in one place.', '/register', 'Explore Features')}
              ${FeatureCard('users', 'Seamless Registration', 'Handle attendee registrations, RSVPs and check-ins with ease.', '/register', 'See How It Works')}
              ${FeatureCard('barChart', 'Track & Analyze', 'Monitor attendance, budget and event performance with real-time insights.', '/register', 'View Reports')}
            </div>
          </section>

          <!-- Categories -->
          <section class="mb-12">
            ${SectionTitle({ title: 'Browse by Category', subtitle: 'Find events that match your interests' })}
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              ${(allCategories || []).map((cat) => `
                <a href="/events?category=${cat.id}" data-navigate class="group bg-white rounded-xl p-4 text-center hover:shadow-md transition-all border border-gray-200 hover:border-teal-700">
                  <div class="w-12 h-12 rounded-lg bg-teal-900 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
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
          <section class="mb-16">
            ${SectionTitle({ title: 'Upcoming Events', subtitle: 'Mark your calendar for these upcoming tech gatherings', action: { href: '/events', label: 'View All' } })}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              ${(upcoming || []).slice(0, 4).length > 0 ? (await Promise.all(upcoming.slice(0, 4).map((event, i) => EventCard(event, i, user)))).join('') : `
                <div class="col-span-full text-center text-gray-500 py-8">No upcoming events</div>
              `}
            </div>
          </section>
        </div>

        <!-- Bottom CTA Banner -->
        <section class="bg-teal-900 -mx-4 sm:-mx-6 lg:-mx-8">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-white mb-1">Ready to host your next impactful tech event?</h3>
              <p class="text-teal-100/80">Join hundreds of organizers building stronger tech communities.</p>
            </div>
            <a href="/register" data-navigate class="shrink-0 px-6 py-3 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2">
              Get Started Today ${getIcon('arrowRight', 16)}
            </a>
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

function StatItem(icon, value, label) {
  return `
    <div class="flex items-center gap-3 justify-center lg:justify-start">
      <div class="w-11 h-11 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 shrink-0">
        ${getIcon(icon, 20)}
      </div>
      <div>
        <div class="text-xl font-bold text-gray-900">${value}</div>
        <div class="text-sm text-gray-500">${label}</div>
      </div>
    </div>
  `;
}

function FeatureCard(icon, title, description, href, linkLabel) {
  return `
    <div class="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4 text-teal-800">
        ${getIcon(icon, 26)}
      </div>
      <h3 class="font-bold text-gray-900 mb-2">${title}</h3>
      <p class="text-sm text-gray-500 mb-4">${description}</p>
      <a href="${href}" data-navigate class="inline-flex items-center gap-1 text-teal-800 text-sm font-semibold hover:text-orange-500 transition-colors">
        ${linkLabel} ${getIcon('arrowRight', 14)}
      </a>
    </div>
  `;
}

function HeroImage() {
  return `
    <div class="relative overflow-hidden shadow-xl">
      <img
        src="/img/hero-conference.png"
        alt="Tech conference audience watching a speaker on stage"
        class="w-full h-52 sm:h-64 md:h-72 lg:h-80 object-cover"
      />
      <div class="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 text-white text-sm font-semibold hidden md:block">
        Building the Next Generation
      </div>
    </div>
  `;
}