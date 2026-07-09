// public/js/pages/RegisterPage.js
import { Input } from '../components.js';

export function RegisterPage() {
  return `
    <div class="page-transition min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-lg gradient-violet flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p class="text-secondary text-sm">Join the tech community today</p>
        </div>
        <form id="register-form" class="glass rounded-xl p-6 md:p-8">
          ${Input({ label: 'Full Name', name: 'name', placeholder: 'Jordan Smith', required: true })}
          ${Input({ label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', required: true })}
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Account Type <span class="text-red-400">*</span></label>
            <select name="role" required class="w-full px-4 py-2.5 select-shell">
              <option value="" disabled selected>Select your role</option>
              <option value="participant">Participant — Attend events</option>
              <option value="organizer">Organizer — Host events</option>
            </select>
          </div>
          ${Input({ label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', required: true })}
          ${Input({ label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••', required: true })}
          <button type="submit" class="w-full py-2.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors btn-primary mt-2">Create Account</button>
          <div class="mt-6 text-center text-sm text-secondary">
            Already have an account? <a href="/login" data-navigate class="text-brand-400 hover:text-brand-300 transition-colors">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  `;
}