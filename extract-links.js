/**
 * URLを読み込み、htmlのリンクを抽出する
 */
export async function extractLinks (browser, url, credential = undefined) {
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 911 });
  if (credential) {
    await page.authenticate(credential);
  }

  return page.goto(url, { waitUntil: ['load', 'networkidle0'] })
    .then(async (res) => {
      if (!res?.ok()) return [];
      if (!res?.headers()['content-type']?.startsWith('text/html')) return [];

     return await page.evaluate(() => {
        return Array.from(document.links)
          .map(link => link.href);
      });
    })
    .catch(e => {
      console.log(e.message);
      return [];
    })
    .finally(async ()=>{
      await page.close();
    });
}
