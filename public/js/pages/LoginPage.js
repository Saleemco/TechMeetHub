// public/js/pages/LoginPage.js
import { Input } from '../components.js';

export function LoginPage({ redirect = '/' } = {}) {
  return `
    <div class="min-h-[100dvh] flex items-center justify-center px-4 -my-6">
      <div class="w-full max-w-md py-12">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-lg">TM</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p class="text-gray-500 text-sm">Sign in to your account</p>
        </div>
        <form id="login-form" class="bg-white rounded-xl p-6 md:p-8 border border-gray-200" data-redirect="${redirect}">
          ${Input({ label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', required: true })}
          ${Input({ label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', required: true })}
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" name="remember" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              Remember me
            </label>
          </div>
          <button type="submit" id="login-btn" class="w-full py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <span id="login-btn-text">Sign In</span>
            <span id="login-btn-spinner" class="hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>
          <div class="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <a href="/register" data-navigate class="text-blue-600 hover:text-blue-800 transition-colors">Create one</a>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
            <p class="font-medium text-gray-500 mb-1">Demo accounts (password: "password"):</p>
            <p>Participant: jordan@techmeethub.dev</p>
            <p>Organizer: sarah@techmeethub.dev</p>
            <p>Admin: maya@techmeethub.dev</p>
          </div>
        </form>
      </div>
    </div>
  `;
}