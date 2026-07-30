// public/js/pages/RegisterPage.js
import { Input } from '../components.js';

export function RegisterPage() {
  return `
    <div class="min-h-[100dvh] flex items-center justify-center px-4 bg-gray-50">
      <div class="w-full max-w-md py-12">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-lg">TM</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p class="text-gray-500 text-sm">Join the tech community today</p>
        </div>
        <form id="register-form" class="bg-white rounded-xl p-6 md:p-8 border border-gray-200">
          ${Input({ label: 'Full Name', name: 'name', placeholder: 'Jordan Smith', required: true })}
          ${Input({ label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', required: true })}
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Account Type <span class="text-red-500">*</span></label>
            <select name="role" required class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
              <option value="" disabled selected>Select your role</option>
              <option value="participant">Participant — Attend events</option>
              <option value="organizer">Organizer — Host events</option>
            </select>
          </div>
          ${Input({ label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', required: true })}
          ${Input({ label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••', required: true })}
          <button type="submit" id="register-btn" class="w-full py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <span id="register-btn-text">Create Account</span>
            <span id="register-btn-spinner" class="hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>
          <div class="mt-6 text-center text-sm text-gray-500">
            Already have an account? <a href="/login" data-navigate class="text-blue-600 hover:text-blue-800 transition-colors">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  `;
}