import os from 'node:os';
import path from 'node:path';

const PROJECT_NAME = 'light-ai';

export const LLAMA_BINARIES_DIR = path.join(os.homedir(), '.cache', '@node-llama-cpp');

export const MODELS_DIR = path.join(os.homedir(), '.config', PROJECT_NAME, 'models');

export const MODELS_FILE = path.join(MODELS_DIR, 'models.json');

export const TMP_DIR = path.join(os.tmpdir(), PROJECT_NAME);
