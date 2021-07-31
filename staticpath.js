import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = process.env.STATIC_DIR || path.join('../../dirname(__filename);