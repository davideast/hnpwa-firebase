# If this isn't a pull request, abort.
if [ "${TRAVIS_EVENT_TYPE}" != "pull_request" ]; then
  echo "This only runs on pull_request events. Event was $TRAVIS_EVENT_TYPE."
  exit
fi

# If there were build failures, abort
if [ "${TRAVIS_TEST_RESULT}" = "1" ]; then
  echo "Deploy aborted, there were build/test failures."
  exit
fi

./node_modules/.bin/firebase deploy --token --project hnpwa-firebase-staging
