import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { root } from './build.mjs';
const dist=resolve(root,'dist');
async function walk(path){const files=[];for(const entry of await readdir(path,{withFileTypes:true})){const full=resolve(path,entry.name);files.push(...(entry.isDirectory()?await walk(full):[full]));}return files;}
const files=await walk(dist);const errors=[];let links=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await readFile(file,'utf8');
 if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${file}: debe tener un h1`);
 for(const token of [file.includes('/en/')?'lang="en"':'lang="es"','name="description"','property="og:title"','<title>']) if(!html.includes(token))errors.push(`${file}: falta ${token}`);
 for(const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)){
  const href=match[1];if(/^(https?:|data:|mailto:|tel:)/.test(href))continue;
  const [target,hash]=href.split('#');const clean=target.split('?')[0];
  let destination=clean.startsWith('/')?resolve(dist,'.'+clean):clean?resolve(dirname(file),clean):file;
  try{if((await stat(destination)).isDirectory())destination=resolve(destination,'index.html');await stat(destination);if(hash&&destination.endsWith('.html')&&!(await readFile(destination,'utf8')).includes(`id="${hash}"`))errors.push(`${file}: ancla inexistente ${href}`);}catch{errors.push(`${file}: recurso inexistente ${href}`);}links++;
 }
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`${files.filter(f=>f.endsWith('.html')).length} páginas y ${links} enlaces/recursos verificados.`);
