// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-proxy-object-internal-methods-and-internal-slots-defineownproperty-p-desc
description: >
  Throws if trap is not callable (honoring the Realm of the current execution
  context)
info: |
    [[DefineOwnProperty]] (P, Desc)

    ...
    6. Let trap be GetMethod(handler, "defineProperty").
    ...
        7.3.9 GetMethod (O, P)
        ...
        2. Let func be GetV(O, P).
        5. If IsCallable(func) is false, throw a TypeError exception.
        ...
features: [cross-realm, Proxy]
---*/

var OProxy = $262.createRealm().global.Proxy;
var p = new OProxy({}, {
  defineProperty: {}
});

assert.throws(TypeError, function() {
  Object.defineProperty(p, "foo", {
    value: 1
  });
});
