import { Data, Auth } from '../data.js';
import { getIcon, Input, Button } from '../components.js';

export async function ProfilePage() {
  const user = await Auth.me();
  if (!user) {
    return `
      <div class="page-transition max-w-7xl mx-auto text-center py-20 px-4">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
        <p class="text-gray-500 mb-4">You need to be logged in to view your profile.</p>
        <a href="/login" data-navigate class="px-4 py-2 rounded-lg bg-teal-900 text-white text-sm font-medium hover:bg-teal-800 transition-colors">Login</a>
      </div>
    `;
  }

  return `
    <div class="page-transition max-w-4xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        <!-- Profile Card -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 text-center">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full ${user.initialsColor || 'bg-teal-900'} avatar-initials text-2xl sm:text-3xl text-white flex items-center justify-center mx-auto mb-4">
              ${user.avatar || '?'}
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-1">${user.name}</h2>
            <p class="text-sm text-gray-500 mb-4 capitalize">${user.role}</p>
            
            <div class="space-y-2 text-left">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                ${getIcon('user', 14)} <span class="truncate">${user.email}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                ${getIcon('calendar', 14)} Joined ${new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h2>
            <form id="profile-form" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${Input({ label: 'Full Name', name: 'name', value: user.name || '', required: true })}
                ${Input({ label: 'Email', name: 'email', type: 'email', value: user.email || '', required: true })}
              </div>
              ${Input({ label: 'Bio', name: 'bio', type: 'textarea', value: user.bio || '', rows: 4, placeholder: 'Tell us about yourself...' })}
              ${Input({ label: 'Skills (comma separated)', name: 'skills', placeholder: 'React, Node.js, Design', value: user.skills?.join(', ') || '' })}
              
              <div class="pt-2">
                ${Button({ label: 'Save Changes', type: 'submit', variant: 'primary', fullWidth: false })}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}