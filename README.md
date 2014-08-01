# etherswitch

A virtual ethernet switch written in pure JavaScript.

This library provides two classes, `Switch`, and `Port`.

`Switch` has no public methods. It's just used to connect `Port`s together.

`Ports` have the methods `send` and `close`, which each do exactly what you'd
expect.

`Port.send` accepts one argument, a `Buffer` containing an Ethernet frame.

`Port.close` removes the instance of `Port` from the switch.

`Port` also emits the event `frame`. The `frame` event handler is also passed
a single argument - the frame to be received by the consumer of that `Port`.


```js

var Switch = require('etherswitch')


var vswitch = new Switch();

var port1 = new Port(vswitch);
var port2 = new Port(vswitch);

ethernet1 = new SomeProviderOfEthernetFrames();
ethernet2 = new SomeProviderOfEthernetFrames();

port1.on('frame', function(frame) {
    ethernet1.recv('frame');
});

port2.on('frame', function(frame) {
    ethernet2.recv('frame');
});

ethernet1.on('frame', function(frame) {
    port1.send(frame);
});

ethernet2.on('frame', function(frame) {
    port2.send(frame);
});

ethernet1.on('close', port1.close);

ethernet2.on('close', port2.close);
```
