import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import cliProgress from 'cli-progress';

import { TMP_DIR } from '@/config/paths';

export async function download(url: string, done?: (tempFilePath: string) => void) {
  const _url = new URL(url);
  const name = _url.pathname.split('/').pop() as string;

  !fs.existsSync(TMP_DIR) && fs.mkdirSync(TMP_DIR, { recursive: true });

  const response = await fetch(url);

  if (!response.ok) {
    const { status, statusText } = response;
    throw new Error(`${status} ${statusText}`);
  }

  if (!response.body) {
    throw new Error('Empty response');
  }
  const body: ReadableStream<Uint8Array> = response.body;

  const tempFilePath = path.join(TMP_DIR, `temp_${name}`);
  const writer = fs.createWriteStream(tempFilePath);

  const downloadSignal = {
    stop: false,
  };

  console.log(chalk.bold('Download:'), url);
  const progressBar = new cliProgress.SingleBar(
    {
      format: '[{bar}] {percentage}% | {value}/{total} Chunks',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      clearOnComplete: true,
    },
    cliProgress.Presets.rect,
  );

  const contentLength = response.headers.get('content-length');
  const total = Number.parseInt(contentLength || '0', 10);
  progressBar.start(Math.round(total / 1024), 0, {
    speed: 'N/A',
  });

  let loaded = 0;
  const reader = body.getReader();

  const start = async (onProgress?: (progress: { percent: number; loaded: number; total: number }) => void) => {
    while (true) {
      const { done, value } = await reader.read();
      if (done || downloadSignal.stop) {
        break;
      }
      loaded += value.byteLength;
      progressBar.update(Math.round(loaded / 1024));
      if (onProgress) {
        onProgress({
          percent: Math.floor((loaded / total) * 100),
          loaded,
          total,
        });
      }
      writer.write(value);
    }
    writer.end();
    progressBar.stop();
    console.clear();

    if (downloadSignal.stop) {
      fs.unlinkSync(tempFilePath);
    } else {
      if (done) {
        void done(tempFilePath);
      }
    }
  };

  const getProgress = async function* () {
    while (true) {
      const { done, value } = await reader.read();
      if (done || downloadSignal.stop) {
        break;
      }
      loaded += value.byteLength;
      progressBar.update(Math.round(loaded / 1024));
      yield {
        percent: Math.floor((loaded / total) * 100),
        loaded,
        total,
      };
      writer.write(value);
    }
    writer.end();
    progressBar.stop();
    // console.clear();
    clearLastLine();

    if (downloadSignal.stop) {
      fs.unlinkSync(tempFilePath);
    } else {
      if (done) {
        void done(tempFilePath);
      }
    }
  };

  const stop = () => {
    downloadSignal.stop = true;
  };

  return {
    getProgress,
    start,
    stop,
  };
}

function clearLastLine() {
  process.stdout.moveCursor(0, -1); // up one line
  process.stdout.clearLine(1); // from cursor to end
}
