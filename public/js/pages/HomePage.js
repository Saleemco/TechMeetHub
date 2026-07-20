// public/js/pages/HomePage.js
import { Data, Auth } from '../data.js';
import { getIcon } from '../components.js';

export async function HomePage() {
  console.log('HomePage rendering...');

  try {
    const [stats, user] = await Promise.all([
      Data.getStats(),
      Auth.me()
    ]);

    console.log('Stats:', stats);

    const statValue = (value, fallback) => (value ?? fallback);

    return `
      <div class="page-transition max-w-7xl mx-auto">
        <!-- Hero Section -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-10 md:py-16">
          <div>
            <div class="inline-flex items-center gap-2 text-orange-500 text-xs font-bold tracking-wide mb-4">
              UNIVERSITY TECH EVENTS, SIMPLIFIED
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Plan. Organize.
              <span class="block text-orange-500">Inspire.</span>
            </h1>
            <p class="text-gray-500 text-base md:text-lg mb-8 max-w-md">
              Tech Event Planner is a university-focused platform to create, manage, and discover tech events with ease. From workshops to hackathons, we help you bring ideas to life and build a stronger tech community.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <a href="${user && user.role === 'organizer' ? '/create' : '/register'}" data-navigate
                 class="px-6 py-3 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2">
                Create an Event ${getIcon('arrowRight', 16)}
              </a>
              <a href="/events" data-navigate
                 class="px-6 py-3 rounded-lg text-sm font-semibold bg-white text-gray-800 hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2">
                ${getIcon('calendar', 16)} Explore Events
              </a>
            </div>
          </div>

          <div class="relative">
            ${HeroMockup()}
          </div>
        </section>

        <!-- Features -->
        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Everything you need to run successful tech events
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            ${FEATURES.map(FeatureCard).join('')}
          </div>
        </section>

        <!-- Stats Band -->
        <section class="mb-12">
          <div class="bg-orange-50 rounded-2xl p-8 md:p-10">
            <h3 class="text-lg font-bold text-gray-900 text-center mb-8">
              Empowering university tech communities
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              ${StatItem('calendar', `${statValue(stats?.totalEvents, 250)}+`, 'Events Organized')}
              ${StatItem('users', `${statValue(stats?.totalAttendees, '15K')}+`, 'Students Engaged')}
              ${StatItem('building', `${statValue(stats?.totalDepartments, 30)}+`, 'Departments')}
              ${StatItem('trophy', `${statValue(stats?.totalHackathons, 8)}+`, 'Hackathons')}
              ${StatItem('code', `${statValue(stats?.totalWorkshops, 50)}+`, 'Workshops')}
            </div>
          </div>
        </section>

        <!-- Bottom CTA -->
        <section class="mb-12">
          <div class="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-10 md:px-10 md:py-12">
            <div class="flex flex-col md:flex-row items-center justify-between gap-8">
              <div class="flex items-center gap-6">
                <div class="hidden md:flex w-40 h-32 rounded-xl bg-white/5 items-center justify-center shrink-0">
                  ${getIcon('users', 40)}
                </div>
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-white mb-2">
                    Ready to organize your next tech event?
                  </h3>
                  <p class="text-gray-400 text-sm md:text-base max-w-md">
                    Join organizers and students across campus building impactful and memorable tech experiences.
                  </p>
                </div>
              </div>
              <a href="${user && user.role === 'organizer' ? '/create' : '/register'}" data-navigate
                 class="shrink-0 px-6 py-3 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2">
                Get Started Now ${getIcon('arrowRight', 16)}
              </a>
            </div>
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

const FEATURES = [
  { icon: 'calendar', color: 'bg-orange-500', title: 'Create & Manage', desc: 'Easily create events and manage all the essential details in one place.' },
  { icon: 'users', color: 'bg-orange-500', title: 'Manage Participants', desc: 'Handle registrations, track participants and check-in effortlessly.' },
  { icon: 'clock', color: 'bg-orange-500', title: 'Build Schedules', desc: 'Organize sessions, speakers and timelines with a simple agenda builder.' },
  { icon: 'truck', color: 'bg-orange-500', title: 'Track Logistics', desc: 'Manage venues, resources, and logistics to keep everything on track.' },
  { icon: 'bell', color: 'bg-orange-500', title: 'Send Announcements', desc: 'Keep everyone informed with real-time updates and notifications.' },
  { icon: 'trendingUp', color: 'bg-orange-500', title: 'View Reports', desc: 'Gain insights with detailed reports and event analytics.' },
];

function FeatureCard(feature) {
  return `
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="w-11 h-11 rounded-lg ${feature.color} flex items-center justify-center mb-4">
        <div class="text-white">${getIcon(feature.icon, 20)}</div>
      </div>
      <h4 class="font-semibold text-gray-900 mb-1">${feature.title}</h4>
      <p class="text-sm text-gray-500 leading-relaxed">${feature.desc}</p>
    </div>
  `;
}

function StatItem(icon, value, label) {
  return `
    <div class="flex items-center gap-3">
      <div class="text-orange-500 shrink-0">${getIcon(icon, 22)}</div>
      <div>
        <div class="text-xl font-bold text-gray-900">${value}</div>
        <div class="text-xs text-gray-500">${label}</div>
      </div>
    </div>
  `;
}

function HeroMockup() {
  return `
    <div class="relative bg-orange-50 rounded-2xl p-8 md:p-12">
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
        <div class="absolute -right-4 -bottom-8 w-28 rounded-2xl bg-gray-900 p-1.5 shadow-xl">
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