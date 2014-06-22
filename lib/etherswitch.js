// A very simple virtual ethernet switch written in pure JavaScript

var broadcast = 'ffffffffffff';

function Switch() {
    this.portmap = { };
}

Switch.prototype.UpdateMACTable = function(port, oldmac) {
    this.ClosePort(oldmac);
    this.portMap[port.mac] = port;
}

Switch.prototype.OpenPort() {
    return new Port(this);
}

Switch.prototype.ClosePort = function(mac) {
    if (this.portMap.hasOwnProperty(mac)) {
        delete this.portMap[mac];
    }
}

Switch.prototype.Switch(frame) {
    var dest = frame.toString('hex', 0, 6);
    if (dest == broadcast || (frame[0] & 0x1 == 1)) {
        for (var mac in this.portmap) {
            this.Send(frame, mac);
        }
    } else {
        this.send(frame, dest);
    }
}

Switch.prototype.Send(frame, mac) {
    if (this.portmap.hasOwnProperty(mac)) {
        this.portmap[mac].onframe(frame);
    }
}

function Port(vswitch) {
    this.vswitch = vswitch;
    this.mac = '';
    this.onframe = function(frame) { }
}

Port.prototype.Send(frame) {
    // grab source mac address
    var source = frame.toString('hex', 6, 12);
    
    if (source != this.mac) {
        var oldmac = this.mac;
        this.mac = source;
        this.vswitch.UpdateMACTable(this, oldmac);
    }
    
    this.vswitch.Switch(data);
}

Port.prototype.Close() {
    this.vswitch.ClosePort(this.mac);
}

module.exports = Switch;
