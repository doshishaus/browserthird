import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function parseCSV(filePath: string) {
    const file = fs.readFileSync(path.resolve(filePath), 'utf8');
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error: any) => {
                reject(error);
            }
        });
    });
}
