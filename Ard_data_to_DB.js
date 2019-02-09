const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const mongoose = require('mongoose');
const port = new SerialPort('/dev/cu.usbmodem14101', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const db = mongoose.connection;
// Read the port data

mongoose.connect('mongodb://localhost:27017/test');

port.on("open", () => {
  console.log('serial port open');
});

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', ()=>{
  console.log('DB connected');
});

const OndoSchema = mongoose.Schema({
  time : { type:Date, default:Date.now },
  humi : Number,
  temp : Number
});

const Ondo = mongoose.model('ondo', OndoSchema);

parser.on('data', data =>{
  var humi_ = data.slice(0,2);
  var temp_ = data.slice(2,4);
  var ondodata = new Ondo({humi:humi_,temp:temp_});
  ondodata.save();
});
