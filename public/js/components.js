// Shared UI Components for TechMeetHub

import { Auth, categories } from './data.js';

// SVG Icons
const icons = {
  zap: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  wrench: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
  mic: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
  video: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
  arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
  dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  logout: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
  tag: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
  hash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
  filter: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
  trend: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  award: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
  link: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
  share: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
  github: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>',
  twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  alert: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  play: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
  bookOpen: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
  layers: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
  cpu: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>',
  shield: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  database: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
  send: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  eyeOff: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>',
  unlock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>',
  lock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
  upload: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
  image: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
  map: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>',
  coffee: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
  sun: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
  moon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
  bell: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
  moreHorizontal: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>',
  key: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>',
  userPlus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>',
  barChart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
  list: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
};

export function getIcon(name, size = 16) {
  const svg = icons[name] || icons.info;
  return svg.replace(/width="16" height="16"/g, `width="${size}" height="${size}"`);
}

// ===== DATE AND TIME FORMATTING FUNCTIONS =====
export function formatDate(dateStr) {
  if (!dateStr) return 'Date TBD';
  try {
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      date = new Date(dateStr + 'T00:00:00');
    }
    if (isNaN(date.getTime())) {
      return 'Date TBD';
    }
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return 'Date TBD';
  }
}

export function formatFullDate(dateStr) {
  if (!dateStr) return 'Date TBD';
  try {
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      date = new Date(dateStr + 'T00:00:00');
    }
    if (isNaN(date.getTime())) {
      return 'Date TBD';
    }
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return 'Date TBD';
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return 'TBD';
  try {
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parts[1] || '00';
      if (isNaN(hours)) return timeStr;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h12 = hours % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    }
    return timeStr;
  } catch (e) {
    return timeStr || 'TBD';
  }
}

export function getCategoryLabel(catId) {
  const cat = categories.find(c => c.id === catId);
  return cat ? cat.label : catId;
}

export function getCategoryIcon(catId, size = 16) {
  const cat = categories.find(c => c.id === catId);
  return cat ? getIcon(cat.icon, size) : getIcon('zap', size);
}

export function getCategoryColor(catId) {
  const cat = categories.find(c => c.id === catId);
  return cat ? cat.color : 'category-meetup';
}

// ========== EVENT CARD ==========
export async function EventCard(event, index = 0, user = null) {
  const userId = user?.id || '';
  const userRole = user?.role || '';
  
  // Safely handle missing organizer with fallbacks
  const organizer = event.organizer || {
    id: event.organizer_id || '',
    name: event.organizer_name || 'Unknown Organizer',
    avatar: event.organizer_avatar || '?',
    initialsColor: event.organizer_initials_color || 'bg-gradient-to-br from-brand-500 to-violet-600'
  };
  
  const isAttending = userId ? (event.attendees?.includes(userId) || false) : false;
  const isOwnEvent = userId && organizer.id === userId;
  const spotsLeft = (event.capacity || 0) - (event.attendees?.length || 0);
  const isFull = spotsLeft <= 0;
  const date = formatDate(event.date);
  const time = formatTime(event.time);

  let actionButton = '';
  if (!user) {
    actionButton = '';
  } else if (userRole === 'participant') {
    actionButton = `
      <button 
        onclick="window.handleRsvp('${event.id}')" 
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all btn-primary ${isAttending ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-500 text-white hover:bg-brand-600'}"
        ${isFull && !isAttending ? 'disabled' : ''}
      >
        ${isAttending ? getIcon('check', 12) + ' Going' : 'Register'}
      </button>
    `;
  } else if (userRole === 'organizer' && isOwnEvent) {
    actionButton = `
      <button onclick="window.navigateTo('/create?edit=${event.id}')" class="px-3 py-1.5 rounded-lg text-xs font-medium btn-secondary border hover:text-brand-500 transition-colors">
        ${getIcon('edit', 12)} Edit
      </button>
    `;
  } else {
    actionButton = `
      <button 
        onclick="window.handleRsvp('${event.id}')" 
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all btn-primary ${isAttending ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-500 text-white hover:bg-brand-600'}"
        ${isFull && !isAttending ? 'disabled' : ''}
      >
        ${isAttending ? getIcon('check', 12) + ' Going' : 'Register'}
      </button>
    `;
  }

  return `
    <div class="event-card glass rounded-xl overflow-hidden animate-fade-in-up stagger-${Math.min(index + 1, 6)} opacity-0" style="animation-fill-mode: forwards;">
      <div class="h-40 relative img-overlay">
        <img src="${event.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop'}" alt="${event.title}" class="w-full h-full object-cover" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/50 to-transparent z-10"></div>
        <div class="absolute inset-0 flex items-center justify-center z-20">
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-input backdrop-blur flex items-center justify-center mx-auto mb-2 border border-white/20">
              <div class="text-white/90">${getCategoryIcon(event.category, 24)}</div>
            </div>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium text-white/90 bg-input backdrop-blur border border-default">
              ${getCategoryLabel(event.category)}
            </span>
          </div>
        </div>
        <div class="absolute top-3 right-3 z-20">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isFull ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
            ${isFull ? 'Full' : `${spotsLeft} spots left`}
          </span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-lg text-primary leading-tight mb-2 hover:text-brand-400 transition-colors cursor-pointer" onclick="window.navigateTo('/events/${event.id}')">${event.title}</h3>
        <div class="flex items-center gap-3 text-sm text-secondary mb-3">
          <span class="flex items-center gap-1">${getIcon('calendar', 14)} ${date}</span>
          <span class="flex items-center gap-1">${getIcon('clock', 14)} ${time}</span>
        </div>
        <div class="flex items-center gap-1 text-sm text-secondary mb-3">
          ${getIcon('mapPin', 14)}
          <span class="truncate">${event.location}</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          ${(event.tags || []).slice(0, 3).map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-default">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full ${organizer.initialsColor} avatar-initials text-xs">${organizer.avatar}</div>
            <span class="text-xs text-secondary">${organizer.name}</span>
          </div>
          ${actionButton}
        </div>
      </div>
    </div>
  `;
}

export function EventListItem(event, isAttending = false) {
  const date = formatDate(event.date);
  return `
    <div class="flex items-center gap-4 p-4 glass rounded-lg hover:bg-card-hover transition-colors cursor-pointer neon-border" onclick="window.navigateTo('/events/${event.id}')">
      <img src="${event.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop'}" alt="" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-primary truncate">${event.title}</h4>
        <div class="flex items-center gap-2 text-sm text-secondary mt-1">
          <span class="flex items-center gap-1">${getIcon('calendar', 12)} ${date}</span>
          <span class="flex items-center gap-1">${getIcon('mapPin', 12)} ${event.location}</span>
        </div>
      </div>
      <span class="px-2 py-1 rounded-full text-xs font-medium ${isAttending ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'}">
        ${isAttending ? 'Attending' : getCategoryLabel(event.category)}
      </span>
    </div>
  `;
}

// ========== HEADER FUNCTION ==========
export function Header(user = null) {
  const isLoggedIn = !!user;
  const role = user?.role || '';

  // Check if we're on the admin dashboard
  const pathname = window.location.pathname || '/';
  const isAdminDashboard = pathname === '/dashboard' && user?.role === 'admin';

  // If admin dashboard, show ONLY the logo and logout button
  if (isAdminDashboard) {
    return `
      <nav class="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-default">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-8">
              <a href="/" class="flex items-center gap-2 group" data-navigate>
                <div class="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                  <span class="text-white font-bold text-sm">T</span>
                </div>
                <span class="font-bold text-lg text-primary group-hover:text-brand-400 transition-colors">TechMeetHub</span>
              </a>
            </div>
            <div class="flex items-center gap-3">
              <button onclick="window.logout()" class="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div class="h-16"></div>
    `;
  }

  // If organizer is logged in (any page), show organizer nav (no Home link)
  if (isLoggedIn && role === 'organizer') {
    const organizerNavLinks = [
      { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { href: '/events', label: 'Events', icon: 'calendar' },
      { href: '/create', label: 'Create Event', icon: 'plus' },
      { href: '/profile', label: 'Profile', icon: 'user' },
    ];

    const themeToggleBtn = `
      <button onclick="window.toggleTheme()" class="theme-toggle" title="Toggle theme">
        <span class="sun-icon">${getIcon('sun', 18)}</span>
        <span class="moon-icon">${getIcon('moon', 18)}</span>
      </button>
    `;

    return `
      <nav class="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-default">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-8">
              <a href="/" class="flex items-center gap-2 group" data-navigate>
                <div class="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                  <span class="text-white font-bold text-sm">T</span>
                </div>
                <span class="font-bold text-lg text-primary group-hover:text-brand-400 transition-colors">TechMeetHub</span>
              </a>
              <div class="hidden md:flex items-center gap-1">
                ${organizerNavLinks.map(link => `
                  <a href="${link.href}" class="nav-link px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-card-hover transition-colors" data-route="${link.href}" data-navigate>
                    <span class="flex items-center gap-1.5">${getIcon(link.icon, 14)} ${link.label}</span>
                  </a>
                `).join('')}
              </div>
            </div>
            <div class="flex items-center gap-3">
              ${themeToggleBtn}
              <a href="/profile" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-card-hover transition-colors" data-navigate>
                <div class="w-8 h-8 rounded-full ${user.initialsColor || 'bg-gradient-to-br from-brand-500 to-violet-600'} avatar-initials text-sm">${user.avatar || '?'}</div>
                <span class="text-sm font-medium text-secondary hidden sm:inline">${user.name || 'User'}</span>
              </a>
              <button onclick="window.logout()" class="p-2 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors" title="Logout">
                ${getIcon('logout', 18)}
              </button>
            </div>
            <button class="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-card-hover" onclick="window.toggleMobileMenu()">
              ${getIcon('menu', 20)}
            </button>
          </div>
        </div>
      </nav>
      <div class="h-16"></div>
      <div id="mobile-menu" class="mobile-menu fixed inset-0 z-50 md:hidden">
        <div class="p-4">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                <span class="text-white font-bold text-sm">T</span>
              </div>
              <span class="font-bold text-lg text-primary">TechMeetHub</span>
            </div>
            <button onclick="window.toggleMobileMenu()" class="p-2 rounded-lg text-secondary hover:text-primary">
              ${getIcon('x', 20)}
            </button>
          </div>
          <div class="flex flex-col gap-2">
            ${organizerNavLinks.map(link => `
              <a href="${link.href}" data-navigate onclick="window.navigateTo('${link.href}'); window.toggleMobileMenu();" class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors">
                ${getIcon(link.icon, 18)} ${link.label}
              </a>
            `).join('')}
            <button onclick="window.toggleTheme(); window.toggleMobileMenu();" class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors text-left w-full">
              <span class="sun-icon inline">${getIcon('sun', 18)}</span>
              <span class="moon-icon inline">${getIcon('moon', 18)}</span>
              <span>Toggle Theme</span>
            </button>
            <button onclick="window.logout(); window.toggleMobileMenu();" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left">
              ${getIcon('logout', 18)} Logout
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // If participant is logged in (any page), show participant nav (no Home link)
  if (isLoggedIn && role === 'participant') {
    const participantNavLinks = [
      { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { href: '/events', label: 'Events', icon: 'calendar' },
      { href: '/profile', label: 'Profile', icon: 'user' },
    ];

    const themeToggleBtn = `
      <button onclick="window.toggleTheme()" class="theme-toggle" title="Toggle theme">
        <span class="sun-icon">${getIcon('sun', 18)}</span>
        <span class="moon-icon">${getIcon('moon', 18)}</span>
      </button>
    `;

    return `
      <nav class="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-default">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-8">
              <a href="/" class="flex items-center gap-2 group" data-navigate>
                <div class="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                  <span class="text-white font-bold text-sm">T</span>
                </div>
                <span class="font-bold text-lg text-primary group-hover:text-brand-400 transition-colors">TechMeetHub</span>
              </a>
              <div class="hidden md:flex items-center gap-1">
                ${participantNavLinks.map(link => `
                  <a href="${link.href}" class="nav-link px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-card-hover transition-colors" data-route="${link.href}" data-navigate>
                    <span class="flex items-center gap-1.5">${getIcon(link.icon, 14)} ${link.label}</span>
                  </a>
                `).join('')}
              </div>
            </div>
            <div class="flex items-center gap-3">
              ${themeToggleBtn}
              <a href="/profile" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-card-hover transition-colors" data-navigate>
                <div class="w-8 h-8 rounded-full ${user.initialsColor || 'bg-gradient-to-br from-brand-500 to-violet-600'} avatar-initials text-sm">${user.avatar || '?'}</div>
                <span class="text-sm font-medium text-secondary hidden sm:inline">${user.name || 'User'}</span>
              </a>
              <button onclick="window.logout()" class="p-2 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors" title="Logout">
                ${getIcon('logout', 18)}
              </button>
            </div>
            <button class="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-card-hover" onclick="window.toggleMobileMenu()">
              ${getIcon('menu', 20)}
            </button>
          </div>
        </div>
      </nav>
      <div class="h-16"></div>
      <div id="mobile-menu" class="mobile-menu fixed inset-0 z-50 md:hidden">
        <div class="p-4">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                <span class="text-white font-bold text-sm">T</span>
              </div>
              <span class="font-bold text-lg text-primary">TechMeetHub</span>
            </div>
            <button onclick="window.toggleMobileMenu()" class="p-2 rounded-lg text-secondary hover:text-primary">
              ${getIcon('x', 20)}
            </button>
          </div>
          <div class="flex flex-col gap-2">
            ${participantNavLinks.map(link => `
              <a href="${link.href}" data-navigate onclick="window.navigateTo('${link.href}'); window.toggleMobileMenu();" class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors">
                ${getIcon(link.icon, 18)} ${link.label}
              </a>
            `).join('')}
            <button onclick="window.toggleTheme(); window.toggleMobileMenu();" class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors text-left w-full">
              <span class="sun-icon inline">${getIcon('sun', 18)}</span>
              <span class="moon-icon inline">${getIcon('moon', 18)}</span>
              <span>Toggle Theme</span>
            </button>
            <button onclick="window.logout(); window.toggleMobileMenu();" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left">
              ${getIcon('logout', 18)} Logout
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Regular navigation for non-logged in users only (shows Home and Events)
  const navLinks = [
    { href: '/', label: 'Home', icon: 'home' }, 
    { href: '/events', label: 'Events', icon: 'calendar' }
  ];

  const themeToggleBtn = `
    <button onclick="window.toggleTheme()" class="theme-toggle" title="Toggle theme">
      <span class="sun-icon">${getIcon('sun', 18)}</span>
      <span class="moon-icon">${getIcon('moon', 18)}</span>
    </button>
  `;

  const authSection = isLoggedIn ? `
    <div class="hidden md:flex items-center gap-3">
      ${themeToggleBtn}
      ${role === 'organizer' || role === 'admin' ? `
        <a href="/create" class="px-4 py-2 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors flex items-center gap-1.5" data-navigate>
          ${getIcon('plus', 14)} Create Event
        </a>
      ` : ''}
      <a href="/profile" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-card-hover transition-colors" data-navigate>
        <div class="w-8 h-8 rounded-full ${user.initialsColor || 'bg-gradient-to-br from-brand-500 to-violet-600'} avatar-initials text-sm">${user.avatar || '?'}</div>
        <span class="text-sm font-medium text-secondary">${user.name || 'User'}</span>
      </a>
      <button onclick="window.logout()" class="p-2 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors" title="Logout">
        ${getIcon('logout', 18)}
      </button>
    </div>
  ` : `
    <div class="hidden md:flex items-center gap-3">
      ${themeToggleBtn}
      <a href="/login" class="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-card-hover transition-colors" data-navigate>Sign In</a>
      <a href="/register" class="px-4 py-2 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors" data-navigate>Get Started</a>
    </div>
  `;

  const mobileAuthLinks = isLoggedIn ? `
    <a href="/profile" data-navigate onclick="window.toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors">${getIcon('user', 18)} Profile</a>
    <button onclick="window.logout(); window.toggleMobileMenu();" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left">${getIcon('logout', 18)} Logout</button>
  ` : `
    <a href="/login" data-navigate onclick="window.toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors">${getIcon('lock', 18)} Sign In</a>
    <a href="/register" data-navigate onclick="window.toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors">${getIcon('userPlus', 18)} Get Started</a>
  `;

  const mobileCreateLink = (role === 'organizer' || role === 'admin') ? `
    <a href="/create" data-navigate onclick="window.toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors">${getIcon('plus', 18)} Create Event</a>
  ` : '';

  const mobileAdminLink = role === 'admin' ? `
    <a href="/admin" data-navigate onclick="window.toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">${getIcon('shield', 18)} Admin</a>
  ` : '';

  const mobileThemeToggle = `
    <button onclick="window.toggleTheme(); window.toggleMobileMenu();" class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors text-left w-full">
      <span class="sun-icon inline">${getIcon('sun', 18)}</span>
      <span class="moon-icon inline">${getIcon('moon', 18)}</span>
      <span>Toggle Theme</span>
    </button>
  `;

  return `
    <nav class="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-default">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <a href="/" class="flex items-center gap-2 group" data-navigate>
              <div class="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                <span class="text-white font-bold text-sm">T</span>
              </div>
              <span class="font-bold text-lg text-primary group-hover:text-brand-400 transition-colors">TechMeetHub</span>
            </a>
            <div class="hidden md:flex items-center gap-1">
              ${navLinks.map(link => `
                <a href="${link.href}" class="nav-link px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-card-hover transition-colors" data-route="${link.href}" data-navigate>
                  <span class="flex items-center gap-1.5">${getIcon(link.icon, 14)} ${link.label}</span>
                </a>
              `).join('')}
            </div>
          </div>
          ${authSection}
          <button class="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-card-hover" onclick="window.toggleMobileMenu()">
            ${getIcon('menu', 20)}
          </button>
        </div>
      </div>
    </nav>
    <div class="h-16"></div>
    <div id="mobile-menu" class="mobile-menu fixed inset-0 z-50 md:hidden">
      <div class="p-4">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
              <span class="text-white font-bold text-sm">T</span>
            </div>
            <span class="font-bold text-lg text-primary">TechMeetHub</span>
          </div>
          <button onclick="window.toggleMobileMenu()" class="p-2 rounded-lg text-secondary hover:text-primary">
            ${getIcon('x', 20)}
          </button>
        </div>
        <div class="flex flex-col gap-2">
          ${navLinks.map(link => `
            <a href="${link.href}" data-navigate onclick="window.navigateTo('${link.href}'); window.toggleMobileMenu();" class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-card-hover transition-colors">
              ${getIcon(link.icon, 18)} ${link.label}
            </a>
          `).join('')}
          ${mobileCreateLink}
          ${mobileAdminLink}
          ${mobileThemeToggle}
          ${mobileAuthLinks}
        </div>
      </div>
    </div>
  `;
}

// ========== FOOTER ==========
export function Footer() {
  return `
    <footer class="mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                <span class="text-white font-bold text-sm">T</span>
              </div>
              <span class="font-bold text-lg text-primary">TechMeetHub</span>
            </div>
            <p class="text-secondary text-sm max-w-sm">Connect with the tech community. Discover events, meet like-minded developers, and grow together.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-200 mb-3 text-sm">Platform</h4>
            <ul class="space-y-2">
              <li><a href="/events" data-navigate class="text-secondary hover:text-brand-400 text-sm transition-colors">Browse Events</a></li>
              <li><a href="/create" data-navigate class="text-secondary hover:text-brand-400 text-sm transition-colors">Create Event</a></li>
              <li><a href="/dashboard" data-navigate class="text-secondary hover:text-brand-400 text-sm transition-colors">My Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-200 mb-3 text-sm">Community</h4>
            <ul class="space-y-2">
              <li><span class="text-secondary text-sm">About</span></li>
              <li><span class="text-secondary text-sm">Guidelines</span></li>
              <li><span class="text-secondary text-sm">Support</span></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-default mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-muted text-sm"> TechMeetHub. Built for the tech community.</p>
          <div class="flex items-center gap-4">
            <span class="text-secondary hover:text-primary transition-colors cursor-pointer">${getIcon('github', 18)}</span>
            <span class="text-secondary hover:text-primary transition-colors cursor-pointer">${getIcon('twitter', 18)}</span>
            <span class="text-secondary hover:text-primary transition-colors cursor-pointer">${getIcon('linkedin', 18)}</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ========== TOAST ==========
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-brand-500/10 border-brand-500/30 text-brand-400',
  };

  toast.className = `px-4 py-3 rounded-lg border glass toast ${colors[type] || colors.success}`;
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      ${type === 'success' ? getIcon('check', 16) : type === 'error' ? getIcon('alert', 16) : getIcon('info', 16)}
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========== EMPTY STATE ==========
export function EmptyState({ icon, title, message, action }) {
  return `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 rounded-full bg-input flex items-center justify-center mb-4">
        <div class="text-muted">${getIcon(icon, 28)}</div>
      </div>
      <h3 class="text-lg font-semibold text-secondary mb-2">${title}</h3>
      <p class="text-muted text-sm max-w-sm mb-6">${message}</p>
      ${action ? `<a href="${action.href}" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors">${action.label}</a>` : ''}
    </div>
  `;
}

// ========== SECTION TITLE ==========
export function SectionTitle({ title, subtitle, action }) {
  return `
    <div class="flex items-end justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-primary">${title}</h2>
        ${subtitle ? `<p class="text-secondary mt-1">${subtitle}</p>` : ''}
      </div>
      ${action ? `<a href="${action.href}" data-navigate class="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">${action.label} ${getIcon('arrowRight', 14)}</a>` : ''}
    </div>
  `;
}

// ========== STAT CARD ==========
export function StatCard({ icon, value, label, color = 'brand' }) {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/10',
    accent: 'text-accent-400 bg-accent-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
  };
  const colorClass = colorMap[color] || colorMap.brand;

  return `
    <div class="stat-card rounded-xl p-5">
      <div class="w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center mb-3">
        <div>${getIcon(icon, 20)}</div>
      </div>
      <div class="text-2xl font-bold text-primary">${value}</div>
      <div class="text-sm text-secondary mt-1">${label}</div>
    </div>
  `;
}

// ========== INPUT ==========
export function Input({ label, name, type = 'text', placeholder, value = '', required = false, rows, maxLength, min, max }) {
  const inputClass = "w-full px-4 py-2.5 input-shell placeholder-gray-500";

  if (type === 'textarea') {
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium text-secondary mb-1.5">${label}${required ? ' <span class="text-red-400">*</span>' : ''}</label>
        <textarea name="${name}" placeholder="${placeholder || ''}" ${required ? 'required' : ''} rows="${rows || 4}" maxlength="${maxLength || ''}" class="${inputClass} resize-none">${value}</textarea>
      </div>
    `;
  }

  if (type === 'select') {
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium text-secondary mb-1.5">${label}${required ? ' <span class="text-red-400">*</span>' : ''}</label>
        <select name="${name}" ${required ? 'required' : ''} class="${inputClass}">
          ${placeholder ? `<option value="" disabled selected>${placeholder}</option>` : ''}
        </select>
      </div>
    `;
  }

  return `
    <div class="mb-4">
      <label class="block text-sm font-medium text-secondary mb-1.5">${label}${required ? ' <span class="text-red-400">*</span>' : ''}</label>
      <input type="${type}" name="${name}" placeholder="${placeholder || ''}" value="${value}" ${required ? 'required' : ''} ${min ? `min="${min}"` : ''} ${max ? `max="${max}"` : ''} class="${inputClass}" />
    </div>
  `;
}

// ========== BUTTON ==========
export function Button({ label, type = 'button', variant = 'primary', icon, fullWidth = false, onclick, disabled = false }) {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    secondary: 'bg-input text-gray-200 hover:bg-card-hover border border-default',
    outline: 'bg-transparent border border-default text-secondary hover:bg-card-hover',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30',
    ghost: 'text-secondary hover:text-primary hover:bg-card-hover',
  };

  return `
    <button type="${type}" ${onclick ? `onclick="${onclick}"` : ''} ${disabled ? 'disabled' : ''} class="px-4 py-2.5 rounded-lg text-sm font-medium transition-all btn-primary ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}">
      ${icon ? `<span class="inline-flex items-center gap-1.5">${icon} ${label}</span>` : label}
    </button>
  `;
}

export { icons };