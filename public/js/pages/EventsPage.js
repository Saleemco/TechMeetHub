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
    <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Discover Events</h1>
        <p class="text-secondary">Find your next tech gathering</p>
      </div>
      <div class="glass rounded-xl p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-3">
          <div class="flex-1 relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">${getIcon('search', 18)}</div>
            <input type="text" id="search-input" placeholder="Search events, topics, locations..." class="w-full pl-10 pr-4 py-2.5 input-shell placeholder-gray-500" />
          </div>
          <div class="flex gap-2">
            <select id="category-filter" class="select-shell px-3 py-2.5">
              <option value="all">All Categories</option>
              ${allCategories.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
            </select>
            <select id="status-filter" class="select-shell px-3 py-2.5">
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