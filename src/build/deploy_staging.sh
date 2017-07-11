node_modules/.bin/firebase deploy --non-interactive --token "$FIREBASE_TOKEN" --project hnpwa-firebase-staging
curl https://hnpwa-firebase-staging.firebaseapp.com
node node_modules/lighthouse-ci/runlighthouse.js --score=97 https://hnpwa-firebase-staging.firebaseapp.com
