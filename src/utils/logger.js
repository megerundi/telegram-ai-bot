import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../../logs');

const logPaths = {
    app: path.join(logsDir, 'app.log'),
    error: path.join(logsDir, 'error.log'),
}

if(!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir, {recursive: true});
}

/**
 * Универсальный логгер.
 * @param {string} level - уровень лога ('info', 'error', и т.п.)
 * @param {string} message - текст сообщения
 */

export function logger(level, message){
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    let filePath;

    // Используем if else для большей читаемости кода
    if (level === 'error'){ 
        filePath = logPaths.error; 
    } else { 
        filePath = logPaths.app;
    }

    fs.appendFile(filePath, logMessage, (err) => {
        if (err) {
          console.error(`Ошибка при записи в файл ${level}`, err);
        }
    });

    console.log(logMessage);
};