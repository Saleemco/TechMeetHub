// public/js/pages/auth.js
import { Auth } from '../data.js';
import { LoginPage } from './LoginPage.js';

export function requireAuth(pageFn) {
  return async function(...args) {
    const user = await Auth.me();
    if (!user) {
      return LoginPage({ redirect: window.location.pathname });
    }
    return await pageFn(...args);
  };
}

export function requireRole(roles, pageFn) {
  return async function(...args) {
    const user = await Auth.me();
    if (!user) return LoginPage({ redirect: window.location.pathname });
    if (!roles.includes(user.role)) {
      return `
        <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div class="w-20 h-20 rounded-full bg-input flex items-center justify-center mx-auto mb-6">
            <span class="text-4xl">🔒</span>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p class="text-gray-400 mb-8">You don't have permission to view this page.</p>
          <a href="/" data-navigate class="px-6 py-3 rounded-xl text-base font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors">Go Home</a>
        </div>
      `;
    }
    return await pageFn(...args);
  };
}