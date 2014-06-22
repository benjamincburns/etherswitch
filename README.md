# etherswitch

A virtual ethernet switch written in pure JavaScript.

Normal use:

```js
var Switch = require('etherswitch')

var vswitch = new Switch();
var port1 = vswitch.OpenPort();
var port2 = vswitch.OpenPort();

port1.onframe = function(frame) {
    ethernet1.Recv(frame);
}

port2.onframe = function(frame) {
    ethernet2.Recv(frame);
}

ethernet1.onframe(function(frame) {
    port1.Send(frame);
});

ethernet2.onframe(function(frame) {
    port2.Send(frame);
});

ethernet1.onclose(function() {
    port1.Close();
});

ethernet2.onclose(function() {
    port2.Close;
});
```
