// public/js/pages/HomePage.js
import { Data, Auth } from '../data.js';
import { EventCard, SectionTitle, getIcon } from '../components.js';

export async function HomePage() {
  console.log('HomePage rendering...');

  try {
    // Fetch all data safely
    let stats = {}, featured = [], upcoming = [], allCategories = [], user = null;
    
    try { stats = await Data.getStats(); } catch (e) { console.warn('getStats failed:', e); }
    try { featured = await Data.getFeaturedEvents(); } catch (e) { console.warn('getFeaturedEvents failed:', e); }
    try { upcoming = await Data.getUpcomingEvents(); } catch (e) { console.warn('getUpcomingEvents failed:', e); }
    try { allCategories = await Data.getCategories(); } catch (e) { console.warn('getCategories failed:', e); }
    try { user = await Auth.me(); } catch (e) { console.warn('Auth.me failed:', e); }

    // Safe defaults
    stats = stats || {};
    featured = Array.isArray(featured) ? featured : [];
    upcoming = Array.isArray(upcoming) ? upcoming : [];
    allCategories = Array.isArray(allCategories) ? allCategories : [];

    return `
      <div class="page-transition">

        <!-- Hero Section -->
        <section class="relative bg-teal-900 overflow-hidden">
          <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
            <div class="max-w-xl order-2 lg:order-1">
              <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
                Connect, Code, and Grow Your <span class="text-orange-400">Campus Tech Community</span>
              </h1>
              <p class="text-teal-100/80 text-sm sm:text-base md:text-lg mb-5 sm:mb-6 max-w-md leading-relaxed">
                The all-in-one platform for student tech clubs, hackathons, workshops, and campus events. Built by students, for students.
              </p>
              <div class="flex flex-wrap items-center gap-3">
                <a href="/register" data-navigate class="px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg">
                  Start a Club Event ${getIcon('arrowRight', 16)}
                </a>
                <a href="/events" data-navigate class="px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-sm font-semibold bg-transparent text-white border border-white/40 hover:bg-white/10 transition-colors flex items-center gap-2">
                  Browse Campus Events ${getIcon('calendar', 16)}
                </a>
              </div>
            </div>
            <div class="w-full max-w-lg mx-auto lg:max-w-none order-1 lg:order-2">
              ${HeroImage()}
            </div>
          </div>
        </section>

        <!-- Stats Bar -->
        <section class="bg-gray-100">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              ${StatItem('users', `${(stats?.totalAttendees || 2500).toLocaleString()}+`, 'Student Members')}
              ${StatItem('calendar', `${(stats?.totalEvents || 120).toLocaleString()}+`, 'Campus Events')}
              ${StatItem('building', `${(stats?.totalClubs || 45).toLocaleString()}+`, 'Student Tech Clubs')}
              ${StatItem('globe', `${(stats?.campuses || 8).toLocaleString()}+`, 'Universities')}
            </div>
          </div>
        </section>

        <!-- Content wrapper -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          <!-- About Section -->
          <section id="about" class="mb-12 sm:mb-16">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
              <div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Empowering the Next Generation of Builders
                </h2>
                <div class="w-16 h-1 bg-orange-500 mb-4 rounded-full"></div>
                <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  TechMeetHub was built to help student tech communities thrive. Whether you are running a CS club, organizing a hackathon, or hosting a workshop, we give you the tools to bring students together.
                </p>
                <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
                  From freshman coding nights to senior design showcases, our platform helps you discover events, manage registrations, and build a campus network that lasts beyond graduation.
                </p>
                <div class="flex flex-wrap gap-4 sm:gap-6">
                  <div>
                    <div class="text-xl sm:text-2xl font-bold text-teal-900">2022</div>
                    <div class="text-xs sm:text-sm text-gray-500">Campus Launch</div>
                  </div>
                  <div>
                    <div class="text-xl sm:text-2xl font-bold text-teal-900">50+</div>
                    <div class="text-xs sm:text-sm text-gray-500">Student Orgs</div>
                  </div>
                  <div>
                    <div class="text-xl sm:text-2xl font-bold text-teal-900">10K+</div>
                    <div class="text-xs sm:text-sm text-gray-500">Students Reached</div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 sm:gap-4">
                ${AboutCard('users', 'Clubs & Communities', 'Built for ACM, IEEE, hackathon teams, and every tech club in between')}
                ${AboutCard('zap', 'Hackathon Ready', 'From 24-hour sprints to week-long build challenges')}
                ${AboutCard('shield', 'Campus Safe', 'University-verified organizers and student-only spaces')}
                ${AboutCard('globe', 'Cross-Campus', 'Connect with tech students across departments and universities')}
              </div>
            </div>
          </section>

          <!-- Feature Highlights -->
          <section class="mb-12 sm:mb-16 text-center">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Everything Your Club Needs to Run Campus Events
            </h2>
            <div class="w-16 h-1 bg-orange-500 mx-auto mb-3 rounded-full"></div>
            <p class="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10">Tools designed for busy students who want to focus on building, not logistics.</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
              ${FeatureCard('calendar', 'Host Hackathons & Workshops', 'Set up coding events, design jams, and tech talks in minutes — no bureaucracy.', '/register', 'Create Event')}
              ${FeatureCard('users', 'Manage Your Club', 'Track members, send updates, and handle club logistics all in one place.', '/register', 'Start a Club')}
              ${FeatureCard('search', 'Campus-Wide Discovery', 'Find events by major, interest, or department. Never miss a workshop again.', '/events', 'Find Events')}
              ${FeatureCard('award', 'Build Your Portfolio', 'Showcase events you have organized or attended. Great for resumes and interviews.', '/profile', 'View Profile')}
            </div>
          </section>

          <!-- Featured Events -->
          <section id="events" class="mb-10 sm:mb-12">
            ${SectionTitle({ title: 'Featured Campus Events', subtitle: "Do not miss these student-run highlights", action: { href: '/events', label: 'View All' } })}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              ${featured.length > 0 ? (await Promise.all(featured.map((event, i) => EventCard(event, i, user)))).join('') : `
                <div class="col-span-full text-center text-gray-500 py-8">No featured events this week</div>
              `}
            </div>
          </section>

          <!-- Upcoming Events -->
          <section class="mb-8 sm:mb-12">
            ${SectionTitle({ title: 'Happening This Week', subtitle: 'Workshops, hackathons, and meetups near you', action: { href: '/events', label: 'View All' } })}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              ${upcoming.slice(0, 4).length > 0 ? (await Promise.all(upcoming.slice(0, 4).map((event, i) => EventCard(event, i, user)))).join('') : `
                <div class="col-span-full text-center text-gray-500 py-8">No upcoming events</div>
              `}
            </div>
          </section>

        </div>
      </div>
    `;
  } catch (error) {
    console.error('HomePage fatal error:', error);
    return `
      <div class="page-transition max-w-7xl mx-auto py-16 text-center px-4">
        <div class="text-red-500 mb-4 text-lg font-semibold">Unable to load homepage</div>
        <div class="text-gray-500 text-sm mb-4">${error?.message || 'Unknown error'}</div>
        <pre class="text-left text-xs bg-gray-100 p-4 rounded-lg overflow-auto max-w-lg mx-auto mb-4">${error?.stack || ''}</pre>
        <button onclick="window.location.reload()" class="mt-2 px-6 py-2 bg-teal-900 text-white rounded-lg hover:bg-teal-800 transition-colors">Reload Page</button>
      </div>
    `;
  }
}

function StatItem(icon, value, label) {
  return `
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 shrink-0">
        ${getIcon(icon, 18)}
      </div>
      <div class="min-w-0">
        <div class="text-lg sm:text-xl font-bold text-gray-900 truncate">${value}</div>
        <div class="text-xs sm:text-sm text-gray-500 truncate">${label}</div>
      </div>
    </div>
  `;
}

function AboutCard(icon, title, description) {
  return `
    <div class="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 mb-3">
        ${getIcon(icon, 20)}
      </div>
      <h4 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">${title}</h4>
      <p class="text-xs sm:text-sm text-gray-500">${description}</p>
    </div>
  `;
}

function FeatureCard(icon, title, description, href, linkLabel) {
  return `
    <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 text-center sm:text-left hover:shadow-md transition-shadow">
      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto sm:mx-0 mb-3 sm:mb-4 text-teal-800">
        ${getIcon(icon, 22)}
      </div>
      <h3 class="font-bold text-gray-900 text-sm sm:text-base mb-2">${title}</h3>
      <p class="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">${description}</p>
      <a href="${href}" data-navigate class="inline-flex items-center gap-1 text-teal-800 text-xs sm:text-sm font-semibold hover:text-orange-500 transition-colors">
        ${linkLabel} ${getIcon('arrowRight', 12)}
      </a>
    </div>
  `;
}

function HeroImage() {
  return `
    <div class="relative overflow-hidden shadow-xl bg-teal-800 rounded-lg">
      <img
        src="/img/hero-conference.png"
        alt="Students collaborating at a campus hackathon"
        class="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg"
        width="800"
        height="400"
        loading="eager"
        decoding="async"
        onerror="this.style.display='none'; this.parentElement.classList.add('bg-gradient-to-br', 'from-teal-800', 'to-teal-950');"
      />
      <div class="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 text-white text-xs sm:text-sm font-semibold rounded-lg">
        Campus Hackathon 2026
      </div>
    </div>
  `;
}