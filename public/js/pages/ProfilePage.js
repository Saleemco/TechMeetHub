// public/js/pages/ProfilePage.js
import { Data, Auth } from '../data.js';
import { Input, getIcon } from '../components.js';
import { LoginPage } from './LoginPage.js';

export async function ProfilePage() {
  const user = await Auth.me();
  if (!user) return LoginPage({ redirect: '/profile' });

  return `
    <div class="page-transition max-w-3xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
        <p class="text-gray-500 text-sm">Manage your personal information and preferences</p>
      </div>
      <div class="bg-white rounded-xl p-6 md:p-8 border border-gray-200">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-20 h-20 rounded-full ${user.initialsColor} avatar-initials text-2xl text-white">${user.avatar}</div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">${user.name}</h2>
            <p class="text-gray-500 text-sm">${user.email}</p>
            <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : user.role === 'organizer' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}">${user.role}</span>
          </div>
        </div>
        <form id="profile-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${Input({ label: 'Full Name', name: 'name', value: user.name, required: true })}
            ${Input({ label: 'Email', name: 'email', type: 'email', value: user.email, required: true })}
          </div>
          ${Input({ label: 'Bio', name: 'bio', type: 'textarea', value: user.bio, placeholder: 'Tell us about yourself...', rows: 3 })}
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Skills <span class="text-gray-400">(comma separated)</span></label>
            <input type="text" name="skills" value="${user.skills.join(', ')}" placeholder="e.g., React, Node.js, Python, AI" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
            <div class="flex flex-wrap gap-2 mt-2">${user.skills.map(skill => `<span class="tag-pill">${skill}</span>`).join('')}</div>
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button type="submit" class="px-6 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">Save Changes</button>
            <button type="button" onclick="window.logout()" class="px-6 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">Logout</button>
          </div>
        </form>
      </div>
    </div>
  `;
}