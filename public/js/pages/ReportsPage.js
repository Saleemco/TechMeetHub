
import { Data, Auth } from '../data.js';
import { getIcon, StatCard } from '../components.js';
import { LoginPage } from './LoginPage.js';

export async function ReportsPage() {
  const user = await Auth.me();
  if (!user) return LoginPage({ redirect: '/reports' });
  if (user.role === 'participant') {
    return `
      <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <span class="text-4xl">🔒</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p class="text-gray-500 mb-8">Only organizers and admins can view reports.</p>
        <a href="/dashboard" data-navigate class="px-6 py-3 rounded-xl text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">Go to Dashboard</a>
      </div>
    `;
  }

  let reportData = null;
  let organizerReport = null;

  try {
    if (user.role === 'admin') {
      reportData = await Data.getPlatformReport();
    }
    if (user.role === 'organizer' || user.role === 'admin') {
      organizerReport = await Data.getOrganizerReport();
    }
  } catch (e) {
    console.error('Failed to load reports:', e);
  }

  const firstName = user.name ? user.name.split(' ')[0] : 'User';

  return `
    <div class="page-transition">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p class="text-gray-500 text-sm mt-1">Event performance and attendance insights</p>
      </div>

      ${user.role === 'admin' && reportData ? `
        <!-- Platform Overview -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Platform Overview</h2>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
            ${StatCard({ icon: 'calendar', value: reportData.totalEvents, label: 'Total Events', color: 'blue' })}
            ${StatCard({ icon: 'users', value: reportData.totalRegistrations, label: 'Total Registrations', color: 'green' })}
            ${StatCard({ icon: 'check', value: reportData.totalAttendanceMarked, label: 'Attendance Marked', color: 'amber' })}
            ${StatCard({ icon: 'user', value: reportData.totalUsers, label: 'Total Users', color: 'purple' })}
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <!-- Top Events -->
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div class="p-3 sm:p-4 border-b border-gray-200">
                <h3 class="text-base font-semibold text-gray-900">Top Events by Registrations</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm">
                  <thead>
                    <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                      <th class="px-3 sm:px-4 py-2.5 font-medium">Event</th>
                      <th class="px-3 sm:px-4 py-2.5 font-medium">Date</th>
                      <th class="px-3 sm:px-4 py-2.5 font-medium text-right">Registrations</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reportData.topEvents?.length ? reportData.topEvents.map(e => `
                      <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td class="px-3 sm:px-4 py-2.5 font-medium text-gray-900 truncate max-w-[200px]">${e.title}</td>
                        <td class="px-3 sm:px-4 py-2.5 text-gray-500 whitespace-nowrap">${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td class="px-3 sm:px-4 py-2.5 text-right font-semibold text-gray-900">${e.registrations}</td>
                      </tr>
                    `).join('') : `
                      <tr><td colspan="3" class="px-4 py-8 text-center text-gray-500">No data</td></tr>
                    `}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Category Breakdown -->
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div class="p-3 sm:p-4 border-b border-gray-200">
                <h3 class="text-base font-semibold text-gray-900">Events by Category</h3>
              </div>
              <div class="p-4 space-y-3">
                ${reportData.categoryBreakdown?.length ? reportData.categoryBreakdown.map(cat => `
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-600 capitalize w-24 truncate">${cat.category}</span>
                    <div class="flex-1 bg-gray-100 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" style="width: ${Math.min(100, (cat.count / reportData.totalEvents) * 100)}%"></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 w-8 text-right">${cat.count}</span>
                  </div>
                `).join('') : `
                  <p class="text-sm text-gray-500 text-center py-4">No data</p>
                `}
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      ${organizerReport ? `
        <!-- Organizer Events Report -->
        <div class="mt-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">My Events Performance</h2>
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-xs sm:text-sm">
                <thead>
                  <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                    <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Event</th>
                    <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium hidden md:table-cell">Date</th>
                    <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Registered</th>
                    <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Attended</th>
                    <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Rate</th>
                    <th class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${organizerReport.events?.length ? organizerReport.events.map(e => `
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td class="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[250px]">${e.title}</td>
                      <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 hidden md:table-cell whitespace-nowrap">${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500">${e.registered}</td>
                      <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500">${e.present}</td>
                      <td class="px-3 sm:px-4 py-2.5 sm:py-3">
                        <span class="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium ${e.rate >= 70 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : e.rate >= 40 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'}">${e.rate}%</span>
                      </td>
                      <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                        <button data-download-csv data-event-id="${e.id}" class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Download CSV">
                          ${getIcon('download', 14)}
                        </button>
                      </td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td colspan="6" class="px-4 py-8 text-center text-gray-500">No events found</td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}