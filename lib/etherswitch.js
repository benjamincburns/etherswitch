// A very simple virtual ethernet switch written in pure JavaScript

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var broadcast = 'ffffffffffff';

function Switch() {
    this._portmap = { };
}

Switch.prototype._closePort = function(mac) {
    if (this._portMap.hasOwnProperty(mac)) {
        delete this._portMap[mac];
    }
}

Switch.prototype._updateMACTable = function(port, oldmac) {
    this._closePort(oldmac);
    this._portMap[port._mac] = port;
}

Switch.prototype._switchFrame = function(frame) {
    var dest = frame.toString('hex', 0, 6);
    if (dest == broadcast || (frame[0] & 0x1 == 1)) {
        for (var mac in this._portmap) {
            this._send(frame, mac);
        }
    } else {
        this.send(frame, dest);
    }
}

Switch.prototype._send = function(frame, mac) {
    if (this._portmap.hasOwnProperty(mac)) {
        this._portmap[mac].emit('frame', frame);
    }
}

util.inherits(Port, EventEmitter);
function Port(vswitch) {
    this._vswitch = vswitch;
    this._mac = '';
}

Port.prototype.send = function(frame) {
    // grab source mac address
    var source = frame.toString('hex', 6, 12);
    
    if (source != this._mac) {
        var oldmac = this._mac;
        this._mac = source;
        this._vswitch._updateMACTable(this, oldmac);
    }
    
    this._vswitch._switchFrame(data);
}

Port.prototype.close = function() {
    this._vswitch._closePort(this.mac);
}

module.exports = {
    Switch : Switch,
    Port : Port
};
