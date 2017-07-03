import * as functions from 'firebase-functions';
import * as express from 'express';
import * as fs from 'fs';
import * as request from 'request-promise';
import * as templates from './templates';
import * as Handlebars from 'handlebars';

const app = express.Router();
Handlebars.registerPartial('commentList', templates.commentList);

const API_BASE = 'https://hnpwa-api.firebaseapp.com';
const SECTION_MATCHER = /^\/$|news|newest|show|ask|jobs/;
const ITEM_MATCHER = '/item';

/**
 * Looks at a string path and returns the matching result.
 */
function topicLookup(path: string) {
  if (path === '/') {
    return 'news';
  }
  return `${path.match(SECTION_MATCHER)![0]}`
}

/**
 * Route matcher for all routes. Proxies to hnpwa-api for JSON
 * data and then renders to index.html if it matches 
 * /news/newest/ask/show/jobs, otherwise will render to item.html.
 */
app.get('*', async (req, res) => {
  if (req.path.match(SECTION_MATCHER)) {
    const topic = topicLookup(req.path);
    const storiesJson = await request(`${API_BASE}/${topic}.json`);
    const stories = JSON.parse(storiesJson);
    const template = Handlebars.compile(templates.story);
    const storyHtml = stories.map((story: any, i: number) => {
      // handle story rank in template
      return template({ rank: i + 1, ...story});
    }).join('');
    const index = fs.readFileSync(__dirname + '/index.html', 'utf8');
    const replaced = index.replace('<!-- ::STORIES:: -->', storyHtml);
    res.send(replaced);
  } else if (req.path.match(ITEM_MATCHER)) {
    let id = req.query.id;
    if (!id) {
      id = req.path.replace('/item/', '');
    }
    const itemJson = await request(`${API_BASE}/item/${id}.json`)
    const item = JSON.parse(itemJson);
    const template = Handlebars.compile(templates.commentTree);
    const html = template(item);
    const index = fs.readFileSync(__dirname + '/index.html', 'utf8');
    const replaced = index.replace('<!-- ::ITEM:: -->', html);
    res.set('Cache-Control', 'public; max-age=300, s-maxage=600');
    res.send(replaced);
  }

});

/**
 * Export express app to Cloud Functions
 */
exports.app = functions.https.onRequest(app as any);
