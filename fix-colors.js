const fs = require('fs');
let c = fs.readFileSync('public/js/components.js', 'utf8');

// 1. text-gray-300 -> text-secondary
 c = c.replace(/text-gray-300/g, 'text-secondary');

// 2. text-gray-400 -> text-secondary
c = c.replace(/text-gray-400/g, 'text-secondary');

// 3. text-gray-500 -> text-muted
c = c.replace(/text-gray-500/g, 'text-muted');

// 4. bg-white/5 -> bg-card-hover
c = c.replace(/bg-white\/5/g, 'bg-card-hover');

// 5. bg-white/10 -> bg-input (careful with trailing chars)
c = c.replace(/bg-white\/10 /g, 'bg-input ');
c = c.replace(/bg-white\/10"/g, 'bg-input"');

// 6. bg-white/15 -> bg-input
c = c.replace(/bg-white\/15/g, 'bg-input');

// 7. bg-white/20 -> bg-input
c = c.replace(/bg-white\/20/g, 'bg-input');

// 8. border-white/10 -> border-default
c = c.replace(/border-white\/10/g, 'border-default');

// 9. border-white/6 -> border-default
c = c.replace(/border-white\/6/g, 'border-default');

// 10. text-white in titles/body text -> text-primary
// h3 titles
c = c.replace(/class="font-semibold text-lg text-white/g, 'class="font-semibold text-lg text-primary');
// h4 titles
c = c.replace(/class="font-medium text-white/g, 'class="font-medium text-primary');
// h1/h2 brand titles
c = c.replace(/class="font-bold text-lg text-white/g, 'class="font-bold text-lg text-primary');
c = c.replace(/class="font-bold text-white/g, 'class="font-bold text-primary');
// nav links
c = c.replace(/class="text-white hover:text-brand/g, 'class="text-primary hover:text-brand');
c = c.replace(/class="text-white group-hover/g, 'class="text-primary group-hover');
// TechMeetHub text
c = c.replace(/class="font-bold text-lg text-white">TechMeetHub/g, 'class="font-bold text-lg text-primary">TechMeetHub');
// Footer titles
// h4 footer titles
// Login/register title

fs.writeFileSync('public/js/components.js', c);
console.log('components.js updated');
