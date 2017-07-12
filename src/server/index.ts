import * as functions from 'firebase-functions';
import * as express from 'express';
import * as fs from 'fs';
import * as request from 'request-promise';
import * as templates from './templates';
import * as Handlebars from 'handlebars';
import * as embedcss from './embedcss';
import * as htmlmin from 'html-minifier';

const minify = htmlmin.minify;
export const app = express.Router();
Handlebars.registerPartial('commentList', templates.commentList);

const API_BASE = 'https://hnpwa.com/api/v0';
const SECTION_MATCHER = /^\/$|news|newest|show|ask|jobs/;
const ITEM_MATCHER = /item\/(\d+$)/;;

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
 * Create an entire section based on it's topic name
 */
async function renderStories(path: string, page = "1") {
  const topic = topicLookup(path);
  const pageInt = parseInt(page, 10);
  let storiesJson;
  if(path === '/') {
    storiesJson = await request(`${API_BASE}/news.json`);
  } else {
    storiesJson = await request(`${API_BASE}/${topic}.json?page=${page}`);
  }
  const stories = JSON.parse(storiesJson);
  const template = Handlebars.compile(templates.story);
  const pagerTemplate = Handlebars.compile(templates.pager);
  const storyHtml = stories.map((story: any, i: number) => {
    // handle story rank in template
    return template({ rank: i + 1, ...story });
  }).join('');
  // Embed CSS in HTML template
  const styledIndex = await embedcss.embedInHtml(
    __dirname + '/index.html',
    __dirname + '/stories.css.html'
  );
  // Dynamically render the stories in the HTML template
  const storesIndex = styledIndex.replace('<!-- ::STORIES:: -->', storyHtml);
  const back = pageInt - 1;
  const next = pageInt + 1
  const nextPositive = back > 0;
  const pageHtml = pagerTemplate({ topic, next, back, nextPositive });
  const allIndex = storesIndex.replace('<!-- ::PAGER:: -->', pageHtml);
  return minify(allIndex, {
    minifyJS: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  });
}

/**
 * Create a single item based on it's id
 */
async function renderItem(id: string) {
  const itemJson = await request(`${API_BASE}/item/${id}.json`)
  const item = JSON.parse(itemJson);
  const template = Handlebars.compile(templates.commentTree);
  const html = template(item);
  // Embed CSS in HTML template
  const styledIndex = await embedcss.embedInHtml(
    __dirname + '/index.html',
    __dirname + '/item.css.html'
  );
  const itemIndex = styledIndex.replace('<!-- ::ITEM:: -->', html);
  return minify(itemIndex, {
    minifyJS: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  });
}

/**
 * Set the Cache-Control header as middleware so we don't have to set it for each and
 * every route. 
 */
function cacheControl(req: express.Request, res: express.Response, next: Function) {
  res.set('Cache-Control', 'public; max-age=300, s-maxage=600, stale-while-revalidate=400');
  res.set('Link', '</sw.reg.js>;rel=preload;as=script');
  next();
}

app.use(cacheControl);

/**
 * Handle main routes like 'news', 'ask', 'show', 'jobs', etc...
 */
app.get(SECTION_MATCHER, async (req, res) => {
  let page = req.query.page;
  if(!page) {
    page = "1";
  }
  const storiesHtml = await renderStories(req.path, page);
  res.send(storiesHtml);
});

/**
 * Handle id query param (/item?id=1)
 */
app.get('/item', async(req, res) => {
  let id = req.query.id;
  const itemHtml = await renderItem(id);
  res.send(itemHtml);
});

/**
 * Handle clean routes (/item/1)
 */
app.get(ITEM_MATCHER, async (req, res) => {
  const id = req.path.replace('/item/', '');
  const itemHtml = await renderItem(id);
  res.send(itemHtml);
});

/**
 * Export express app to Cloud Functions
 */
exports.app = functions.https.onRequest(app as any);
