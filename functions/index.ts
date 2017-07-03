const functions = require('firebase-functions');
const express = require('express');
const fs = require('fs');
const request = require('request-promise');
const app = express();

const API_BASE = 'https://hnpwa-api.firebaseapp.com';
const SECTION_MATCHER = /^\/$|news|newest|show|ask|jobs/;
const ITEM_MATCHER = '/item';

const storyTemplate = (story, rank) => `
<section id="${story.id}" class="hn-story">
  <div class="hn-storyrank">
    <h2 class="hn-h2">${rank + 1}</h2>
  </div>
  <div class="hn-storydetails">
    <h4 class="hn-h4">
      <a href="${story.url}">
      ${story.title}
      <span class="hn-link">(${story.domain})</span>
      </a>
    </h4>
    <div class="hn-storymeta">
      ${story.points} points by <a href="/users/${story.user}">${story.user}</a> 
      ${story.time_ago} |
      <a href="#">${story.comments_count} comments</a>
    </div>
  </div>
</section>
`;

const commentTreeTemplate = `
<div class="hn-itembyline">
  <h2>{{title}} ({{domain}})</h2>
  <div class="hn-itemmeta>
    <p>
      {{points}} by
      <a href="/user/{{user}}>{{user}}</a>
      {{time_ago}} | {{comments_count}} comments
    </p>
  </div>
  
  {{> commentList comments }}

</div>
`;

const commentListTemplate = `
  <div class="hn-commentlist">
    {{#each this}}
      <details class="hn-commentthread" open>
        <p class="hn-comment">
          {{{ content }}}
        </p>
        
        {{> commentList comments }}

      </details>
    {{/each}}
  </div>
`;

/**
 * Looks at a string path and returns the matching result.
 */
function topicLookup(path) {
  if (path === '/') {
    return 'news';
  }
  return `${path.match(SECTION_MATCHER)[0]}`
}

/**
 * Route matcher for all routes. Proxies to hnpwa-api for JSON
 * data and then renders to index.html if it matches 
 * /news/newest/ask/show/jobs, otherwise will render to item.html.
 */
app.get('*', (req, res) => {
  if (req.path.match(SECTION_MATCHER)) {
    const topic = topicLookup(req.path);
    request(`${API_BASE}/${topic}.json`).then(storiesJson => {
      const stories = JSON.parse(storiesJson);
      const storyHtml = stories.map(storyTemplate).join('');
      const index = fs.readFileSync(__dirname + '/index.html', 'utf8');
      const replaced = index.replace('<!-- ::STORIES:: -->', storyHtml);
      res.send(replaced);
    });
  } else if (req.path.match(ITEM_MATCHER)) {
    let id = req.query.id;
    if(!id) {
      id = req.path.replace('/item/', '');
    }
    request(`${API_BASE}/item/${id}.json`).then(itemJson => {
      const item = JSON.parse(itemJson);
      const template = Handlebars.compile(commentTreeTemplate);
      const html = template(item);
      replaced = index.replace('<!-- ::ITEM:: -->', html);
      res.set('Cache-Control', 'public; max-age=300, s-maxage=600');
      res.send(replaced);         
    });
  } else {
    res.set('Cache-Control', 'public; max-age=300, s-maxage=600');
    res.send(replaced);       
  }

  }
});

/**
 * Export express app to Cloud Functions
 */
exports.app = functions.https.onRequest(app);
