// public/service-worker.js

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Add code to cache assets, if needed
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
    // Perform activation tasks
  });
  
  self.addEventListener('fetch', (event) => {
    // Handle network requests or serve cached assets
    event.respondWith(fetch(event.request));
  });
  