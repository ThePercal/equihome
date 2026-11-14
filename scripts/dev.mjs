import { createServer } from 'node:http';
import { readFile, stat, watch } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const run = promisify(execFile);
// Un proceso nuevo evita la caché de módulos de Node al editar las plantillas.
let building = false;
let queued = false;
async function build() {
  if (building) { queued = true; return; }
  building = true;
  try {
    const result = await run(process.execPath, [resolve(root, 'scripts/build.mjs')]);
    process.stdout.write(result.stdout);
  } finally {
    building = false;
    if (queued) { queued = false; await build(); }
  }
}
await build();
const dist=resolve(root,'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const server=createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let path=resolve(dist,'.'+pathname);
    if(path!==dist&&!path.startsWith(dist+sep)) {res.writeHead(403);res.end('Forbidden');return;}
    let status=200;
    try {const info=await stat(path);if(info.isDirectory()) {if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'});res.end();return;}path=resolve(path,'index.html');}}
    catch{path=resolve(dist,'404.html');status=404;}
    const body=await readFile(path);
    res.writeHead(status,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});res.end(body);
  } catch {res.writeHead(400);res.end('Bad request');}
});
const port=Number(process.env.PORT||4173);
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
let pending;
async function watchFiles(directory){try{for await(const event of watch(resolve(root,directory),{recursive:true})){clearTimeout(pending);pending=setTimeout(()=>build().catch(console.error),150);}}catch(error){console.error('Watcher:',error.message);}}
watchFiles('src');watchFiles('public');
