// public/js/pages/ProfilePage.js
import { Data, Auth } from '../data.js';
import { Input, getIcon } from '../components.js';
import { LoginPage } from './LoginPage.js';

export async function ProfilePage() {
  const user = await Auth.me();
  if (!user) return LoginPage({ redirect: '/profile' });

  return `
    <div class="page-transition max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p class="text-secondary">Manage your personal information and preferences</p>
      </div>
      <div class="glass rounded-xl p-6 md:p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-20 h-20 rounded-full ${user.initialsColor} avatar-initials text-2xl">${user.avatar}</div>
          <div>
            <h2 class="text-xl font-bold text-white">${user.name}</h2>
            <p class="text-secondary text-sm">${user.email}</p>
            <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : user.role === 'organizer' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}">${user.role}</span>
          </div>
        </div>
        <form id="profile-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${Input({ label: 'Full Name', name: 'name', value: user.name, required: true })}
            ${Input({ label: 'Email', name: 'email', type: 'email', value: user.email, required: true })}
          </div>
          ${Input({ label: 'Bio', name: 'bio', type: 'textarea', value: user.bio, placeholder: 'Tell us about yourself...', rows: 3 })}
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Skills <span class="text-gray-500">(comma separated)</span></label>
            <input type="text" name="skills" value="${user.skills.join(', ')}" placeholder="e.g., React, Node.js, Python, AI" class="w-full px-4 py-2.5 input-shell placeholder-gray-500" />
            <div class="flex flex-wrap gap-2 mt-2">${user.skills.map(skill => `<span class="tag-pill">${skill}</span>`).join('')}</div>
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-default">
            <button type="submit" class="px-6 py-2.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors">Save Changes</button>
            <button type="button" onclick="window.logout()" class="px-6 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">Logout</button>
          </div>
        </form>
      </div>
    </div>
  `;
}