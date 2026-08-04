import { getIcon } from '../components.js';

export function NotFoundPage() {
  return `
    <div class="page-transition min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
        ${getIcon('search', 32)}
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">404</h1>
      <h2 class="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p class="text-gray-500 text-sm sm:text-base max-w-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div class="flex flex-col sm:flex-row gap-3">
        <a href="/" data-navigate class="px-6 py-2.5 rounded-lg text-sm font-medium bg-teal-900 text-white hover:bg-teal-800 transition-colors">Go Home</a>
        <a href="/events" data-navigate class="px-6 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors">Browse Events</a>
      </div>
    </div>
  `;
}