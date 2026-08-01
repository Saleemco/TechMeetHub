// public/js/pages/AdminUsersPage.js
import { Data, Auth } from '../data.js';
import { getIcon } from '../components.js';
import { LoginPage } from './LoginPage.js';

export async function AdminUsersPage() {
  const user = await Auth.me();
  if (!user) return LoginPage({ redirect: '/admin/users' });
  if (user.role !== 'admin') {
    return `
      <div class="page-transition max-w-7xl mx-auto">
        <div class="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-600">${getIcon('shield', 28)}</div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p class="text-gray-500 text-sm mb-4">You don't have permission to view this page.</p>
          <a href="/dashboard" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-teal-900 text-white hover:bg-teal-800 transition-colors">Go to Dashboard</a>
        </div>
      </div>
    `;
  }

  const allUsers = await Data.getAdminUsers();

  return `
    <div class="page-transition max-w-7xl mx-auto">
      <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">All Users</h1>
          <p class="text-gray-500 text-sm mt-1">${allUsers.length} registered users</p>
        </div>
        <a href="/dashboard" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors flex items-center gap-2">
          ${getIcon('arrowLeft', 16)} Back to Dashboard
        </a>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th class="px-4 py-3 font-medium">User</th>
                <th class="px-4 py-3 font-medium">Role</th>
                <th class="px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th class="px-4 py-3 font-medium hidden lg:table-cell">Joined</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allUsers.length > 0 ? allUsers.map(u => `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full ${u.initialsColor || 'bg-gray-400'} avatar-initials text-xs text-white flex items-center justify-center">${u.avatar || '?'}</div>
                      <div>
                        <div class="font-medium text-gray-900">${u.name || 'Unknown'}</div>
                        <div class="text-xs text-gray-500">ID: ${u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : u.role === 'organizer' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}">${u.role || 'participant'}</span>
                  </td>
                  <td class="px-4 py-3 text-gray-500 hidden md:table-cell">${u.email || '-'}</td>
                  <td class="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">${u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</td>
                  <td class="px-4 py-3 text-right">
                    <button onclick="window.deleteUser('${u.id}')" class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete user">
                      ${getIcon('trash', 16)}
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="px-4 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                      <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">${getIcon('users', 24)}</div>
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}