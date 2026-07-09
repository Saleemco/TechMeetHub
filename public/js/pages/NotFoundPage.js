// public/js/pages/NotFoundPage.js
export function NotFoundPage() {
  return `
    <div class="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="w-20 h-20 rounded-full bg-input flex items-center justify-center mx-auto mb-6">
        <span class="text-4xl">404</span>
      </div>
      <h1 class="text-3xl font-bold text-white mb-2">Page Not Found</h1>
      <p class="text-secondary mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" data-navigate class="px-6 py-3 rounded-xl text-base font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors">Go Home</a>
    </div>
  `;
}