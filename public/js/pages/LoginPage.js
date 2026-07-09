// public/js/pages/LoginPage.js
import { Input, getIcon } from '../components.js';

export function LoginPage({ redirect = '/' } = {}) {
  return `
    <div class="page-transition min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-lg gradient-violet flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p class="text-secondary text-sm">Sign in to your account</p>
        </div>
        <form id="login-form" class="glass rounded-xl p-6 md:p-8" data-redirect="${redirect}">
          ${Input({ label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', required: true })}
          ${Input({ label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', required: true })}
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center gap-2 text-sm text-secondary">
              <input type="checkbox" name="remember" class="rounded bg-white/5 border-white/10 text-brand-500 focus:ring-brand-500" />
              Remember me
            </label>
          </div>
          <button type="submit" class="w-full py-2.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors btn-primary">Sign In</button>
          <div class="mt-6 text-center text-sm text-secondary">
            Don't have an account? <a href="/register" data-navigate class="text-brand-400 hover:text-brand-300 transition-colors">Create one</a>
          </div>
          <div class="mt-4 pt-4 border-t border-white/10 text-xs text-muted">
            <p class="font-medium text-secondary mb-1">Demo accounts (password: "password"):</p>
            <p>Participant: jordan@techmeethub.dev</p>
            <p>Organizer: sarah@techmeethub.dev</p>
            <p>Admin: maya@techmeethub.dev</p>
          </div>
        </form>
      </div>
    </div>
  `;
}