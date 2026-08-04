import { getIcon } from '../components.js';

export function LoginPage({ redirect = '/dashboard' } = {}) {
  return `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-lg bg-teal-900 flex items-center justify-center mx-auto mb-4">
            <div class="text-orange-400">${getIcon('calendar', 24)}</div>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back</h1>
          <p class="text-gray-500 text-sm mt-2">Sign in to your TechMeetHub account</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <form id="login-form" class="space-y-4">
            <input type="hidden" name="redirect" value="${redirect}" />
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" name="email" required class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 transition-colors" placeholder="you@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" required class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 transition-colors" placeholder="••••••••" />
            </div>
            
            <button type="submit" id="login-btn" class="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-900 text-white hover:bg-teal-800 transition-colors flex items-center justify-center gap-2">
              <span id="login-btn-text">Sign In</span>
              <span id="login-btn-spinner" class="hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">Don't have an account? <a href="/register" data-navigate class="font-medium text-teal-800 hover:text-orange-500 transition-colors">Get Started</a></p>
          </div>
        </div>
      </div>
    </div>
  `;
}