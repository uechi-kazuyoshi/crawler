import { setTimeout } from 'node:timers/promises';
import puppeteer from 'puppeteer';
import { extractLinks } from './extract-links.js';

const processedUrls = new Set();
const results = new Set();

let base = null;

export async function run (url) {
  base = new URL('.', url);
  console.log('base', base.toString());
  const browser = await puppeteer.launch();
  await extract(browser, url);
  await browser.close();

  return [...results];
}

async function extract (browser, url, depth = 0) {

  if (depth > 5) return;

  let urlObj;
  try {
    urlObj = new URL(url);
    urlObj.hash = urlObj.hash + '';
  } catch (e) {
    return false;
  }

  if (urlObj.hash){
    // console.log('Skip: (hash url)', url);
    return;
  }
  if (!urlObj.toString().startsWith(base.toString())){
    // console.log(`Skip: (no startsWith: ${base})`, url);
    return;
  }

  if (processedUrls.has(urlObj.toString())){
    // console.log('Skip (processed)',url);
    return;
  }
  processedUrls.add(url);

  console.log('processing:', url);

  const links = extractLinks(browser, url);

  for await (const link of await links) {
    // console.log(link);

    let linkUrl;
    try {
      linkUrl = new URL(link);
    } catch (e) {
      console.error(e.message);
      continue;
    }

    results.add(link);

    await extract(browser, link, depth + 1);

  }

  await setTimeout(1000);

}
