// public/js/pages/EventsPage.js
import { Data, Auth } from '../data.js';
import { EventCard, EmptyState, getIcon } from '../components.js';

export async function EventsPage() {
  const [events, allCategories, user] = await Promise.all([
    Data.getEvents(),
    Data.getCategories(),
    Auth.me()
  ]);

  return `
    <div class="page-transition max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Discover Events</h1>
        <p class="text-gray-500 text-sm">Find your next tech gathering</p>
      </div>
      
      <div class="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <div class="flex flex-col md:flex-row gap-3">
          <div class="flex-1 relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${getIcon('search', 18)}</div>
            <input type="text" id="search-input" placeholder="Search events, topics, locations..." class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
          </div>
          <div class="flex gap-2">
            <select id="category-filter" class="px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
              <option value="all">All Categories</option>
              ${allCategories.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
            </select>
            <select id="status-filter" class="px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>
      
      <div id="events-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${(await Promise.all(events.map((event, i) => EventCard(event, i, user)))).join('')}
      </div>
      <div id="events-empty" class="hidden">
        ${EmptyState({ icon: 'search', title: 'No events found', message: "Try adjusting your search or filters to find what you're looking for.", action: { href: '/create', label: 'Create Event' } })}
      </div>
    </div>
  `;
}