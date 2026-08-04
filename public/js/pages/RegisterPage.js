import { getIcon } from '../components.js';

export function RegisterPage() {
  return `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-lg bg-teal-900 flex items-center justify-center mx-auto mb-4">
            <div class="text-orange-400">${getIcon('calendar', 24)}</div>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Create Account</h1>
          <p class="text-gray-500 text-sm mt-2">Join TechMeetHub and start connecting</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <form id="register-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span class="text-red-500">*</span></label>
              <input type="text" name="name" required class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Email <span class="text-red-500">*</span></label>
              <input type="email" name="email" required class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 transition-colors" placeholder="you@example.com" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Password <span class="text-red-500">*</span></label>
                <input type="password" name="password" required minlength="6" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 transition-colors" placeholder="••••••••" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm <span class="text-red-500">*</span></label>
                <input type="password" name="confirmPassword" required class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 transition-colors" placeholder="••••••••" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Role <span class="text-red-500">*</span></label>
              <select name="role" required class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 transition-colors">
                <option value="participant">Participant</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
            
            <button type="submit" id="register-btn" class="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-900 text-white hover:bg-teal-800 transition-colors flex items-center justify-center gap-2">
              <span id="register-btn-text">Create Account</span>
              <span id="register-btn-spinner" class="hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">Already have an account? <a href="/login" data-navigate class="font-medium text-teal-800 hover:text-orange-500 transition-colors">Sign In</a></p>
          </div>
        </div>
      </div>
    </div>
  `;
}