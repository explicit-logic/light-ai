import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

export async function extractTgz(sourcePath: string, targetPath: string) {
  return new Promise<void>((resolve, reject) => {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    const fileStream = fs.createReadStream(sourcePath);
    const gunzip = zlib.createGunzip();

    const headerBuffer = Buffer.alloc(512);
    let headerPos = 0;
    let currentFileBuffer: Buffer | null = null;
    let currentFileName = '';
    let currentFilePos = 0;
    let currentFileSize = 0;
    let rootFolder: string | null = null;

    // Helper function to get the relative path without root folder
    function getRelativePath(fullPath: string) {
      const parts = fullPath.split('/');
      if (parts.length <= 1) return fullPath;

      // If we haven't identified the root folder yet
      if (!rootFolder) {
        rootFolder = parts[0];
      }

      // Remove the root folder and return the rest of the path
      return parts.slice(1).join('/');
    }

    gunzip.on('data', (chunk) => {
      let offset = 0;

      while (offset < chunk.length) {
        if (currentFileBuffer === null) {
          const copySize = Math.min(512 - headerPos, chunk.length - offset);
          chunk.copy(headerBuffer, headerPos, offset, offset + copySize);
          headerPos += copySize;
          offset += copySize;

          if (headerPos === 512) {
            if (headerBuffer.every((byte) => byte === 0)) {
              return;
            }

            // Get the original filename from header
            currentFileName = headerBuffer.toString('utf8', 0, 100).replace(/\0/g, '').trim();
            const fileSizeOctal = headerBuffer.toString('utf8', 124, 136).trim();
            currentFileSize = Number.parseInt(fileSizeOctal, 8);

            // Get the relative path without root folder
            const relativeFileName = getRelativePath(currentFileName);

            // Skip if this would be an empty path (root directory itself)
            if (!relativeFileName) {
              headerPos = 0;
              continue;
            }

            currentFileName = relativeFileName;

            // Handle directories
            if (currentFileName.endsWith('/')) {
              const dirPath = path.join(targetPath, currentFileName);
              if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
              }
              headerPos = 0;
              continue;
            }

            currentFileBuffer = Buffer.alloc(currentFileSize);
            currentFilePos = 0;
            headerPos = 0;
          }
        } else {
          const copySize = Math.min(currentFileSize - currentFilePos, chunk.length - offset);
          chunk.copy(currentFileBuffer, currentFilePos, offset, offset + copySize);
          currentFilePos += copySize;
          offset += copySize;

          if (currentFilePos === currentFileSize) {
            // Only process file if it has a valid path
            if (currentFileName && currentFileName !== '/') {
              const targetFilePath = path.join(targetPath, currentFileName);
              const targetFileDir = path.dirname(targetFilePath);

              // Create directory structure if needed
              if (!fs.existsSync(targetFileDir)) {
                fs.mkdirSync(targetFileDir, { recursive: true });
              }

              // Write the file
              const data = new Uint8Array(currentFileBuffer);
              fs.writeFileSync(targetFilePath, data);
              // fs.writeFileSync(targetFilePath, currentFileBuffer as unknown as NodeJS.ArrayBufferView);
            }

            // Skip padding bytes
            const padding = (512 - (currentFileSize % 512)) % 512;
            offset += padding;

            // Reset for next file
            currentFileBuffer = null;
            currentFileName = '';
            currentFilePos = 0;
            currentFileSize = 0;
          }
        }
      }
    });

    gunzip.on('end', () => {
      resolve();
    });

    gunzip.on('error', (err) => {
      reject(err);
    });

    fileStream.pipe(gunzip);
  });
}
