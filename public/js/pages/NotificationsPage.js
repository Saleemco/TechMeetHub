
import { Data, Auth } from '../data.js';
import { getIcon } from '../components.js';
import { LoginPage } from './LoginPage.js';

export async function NotificationsPage() {
  const user = await Auth.me();
  if (!user) return LoginPage({ redirect: '/notifications' });
  if (user.role === 'participant') {
    return `
      <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <span class="text-4xl">🔒</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p class="text-gray-500 mb-8">Only organizers and admins can send notifications.</p>
        <a href="/dashboard" data-navigate class="px-6 py-3 rounded-xl text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">Go to Dashboard</a>
      </div>
    `;
  }

  let hostingEvents = [];
  let notifications = [];

  try {
    hostingEvents = await Data.getHostingEvents();
    notifications = await Data.getNotifications();
  } catch (e) {
    console.error('Failed to load notifications data:', e);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const preselectedEvent = urlParams.get('event');

  return `
    <div class="page-transition max-w-4xl mx-auto">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h1>
        <p class="text-gray-500 text-sm mt-1">Send emails to event attendees</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Send Notification Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Send Notification</h2>
            <form id="notification-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Event</label>
                <select name="eventId" class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
                  <option value="">Select an event</option>
                  ${hostingEvents.map(e => `
                    <option value="${e.id}" ${preselectedEvent === e.id ? 'selected' : ''}>${e.title} (${e.date})</option>
                  `).join('')}
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="announcement">Announcement</option>
                  <option value="reminder">Reminder</option>
                  <option value="update">Update</option>
                  <option value="cancellation">Cancellation</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" name="subject" placeholder="e.g. Important update about the event" 
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" rows="5" placeholder="Write your message here..." 
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" required></textarea>
              </div>
              <button type="submit" id="send-notif-btn" class="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <span id="send-notif-btn-text">Send Notification</span>
                <span id="send-notif-btn-spinner" class="hidden w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </button>
            </form>
          </div>
        </div>

        <!-- Notification History -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">History</h2>
            <div class="space-y-3 max-h-[500px] overflow-y-auto">
              ${notifications.length > 0 ? notifications.slice(0, 20).map(n => `
                <div class="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${n.type === 'announcement' ? 'bg-blue-50 text-blue-600 border border-blue-200' : n.type === 'reminder' ? 'bg-amber-50 text-amber-600 border border-amber-200' : n.type === 'attendance' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}">${n.type}</span>
                    <span class="text-xs text-gray-400">${new Date(n.sent_at || n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <p class="text-sm font-medium text-gray-900 truncate">${n.subject}</p>
                  <p class="text-xs text-gray-500 truncate">To: ${n.recipient_email || n.recipient_id}</p>
                  ${n.event_title ? `<p class="text-xs text-gray-400 mt-0.5">Event: ${n.event_title}</p>` : ''}
                </div>
              `).join('') : `
                <p class="text-sm text-gray-500 text-center py-4">No notifications sent yet</p>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}