import cac from 'cac';
import { input } from '@inquirer/prompts';
import figlet from 'figlet';
import { run } from './task.js';
import { writeFile } from 'node:fs/promises';

const cli = cac('crawler');

cli
  .option('--url <start-url>', 'URL to start crawling')
  .option('--out <output-file>', 'File path to save results', { default: 'result.txt' });

const parsed = cli.parse();

if (parsed.options.help) {
  cli.outputHelp();
} else {
  console.log(figlet.textSync('crawler'));
  await exec(parsed.options);
}

async function exec ({ url, out }) {

  try {
    url = new URL(url || await input({ message: 'Input URL to start crawling:' })).toString();
  } catch (e) {
    console.log(e.message);
    process.exit();
  }

  const results = await run(url);

  await writeFile(out, results.sort().join('\n'), 'utf-8');

}
