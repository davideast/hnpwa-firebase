(function () {
   if ('serviceWorker' in navigator) {
      function auf(registration, versionChangeCallback, offlineReadyCallback) {
         registration.onupdatefound = function () {
            var installingWorker = registration.installing;
            installingWorker.onstatechange = function () {
               if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                     versionChangeCallback();
                  } else {
                     offlineReadyCallback();
                  }
               }
            };
         };
      }
      navigator.serviceWorker.register('/sw.main.js').then(function (reg) {
         auf(reg, function versionChanged() {
            console.log('new version!');
         }, function offlineReady() {
            console.log('offline ready!');
         });
      });
   }
}());
