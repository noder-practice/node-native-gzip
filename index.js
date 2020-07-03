const http = require('http')
const fs = require('fs')
const { resolve } = require('path')
const { createGzip } = require('zlib');
const { pipeline } = require('stream');


const server = http.createServer((req, res) => {

  const rawPath = req.url

  if (/^\/public/.test(rawPath)) {
    const path = rawPath.replace(/public\//, '')

    const filePath = resolve(__dirname, `./static/${path}`);

    if (!fs.existsSync(filePath)) {

      res.writeHead(404);
      res.end('404 file not found')

    } else {

      res.setHeader('Vary', 'Accept-Encoding');
      res.writeHead(200, { 'Content-Encoding': 'gzip' });

      const stream = fs.createReadStream(filePath)

      pipeline(stream, createGzip(), res, (error) => {
        // TODO: 错误上报
        console.log(error);
      })
    }

    return
  }

  res.writeHead(200);
  res.write('hello world')
  res.end()
})


server.listen(8888, () => {
  console.log('server listening on 8888');
})