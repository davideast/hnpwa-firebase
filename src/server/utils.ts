import * as fs from 'fs';

export function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err: Error, data: any) => {
      if(err) { reject(err); }
      resolve(data);
    });
  });
}

export function writeFile(path: string, data: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err: Error) => {
      if(err) { reject(err); return; }
      resolve(data);
    });
  });  
}
