#!/usr/bin/env node
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
import readline from 'readline';
import fs from 'fs';
// '/Users/nacho/Google Drive/dreamers/dreamers/datos/indices/peliculas/'
class App{
  constructor(){
    server.listen(8081, () => {
      console.log('listening port 8081.');
    });
    app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/index.html`);
    });

    this.summary = io.of('/summary');
    this.summary.on('connection', socket => {
      console.log('connected');
      socket.on('disconnect', (e) => {
        console.log('disconnect', e);
      });
      this.lineReader = readline.createInterface({
        input:fs.createReadStream('src/summary.csv'),
      });
      this.lineReader.on('line', (line)=>{
        console.log('line ', line);
        this.summary.emit('msg', {line});
      });
      this.lineReader.on('close', ()=>{
        console.log('close');
        this.summary.emit('endMsgs');
      });
    });
  }

}

const socketApp = new App();
export default socketApp;
