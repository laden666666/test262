// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: >
    IteratorClose is called when reference evaluation produces a "return"
    completion
info: |
    ArrayAssignmentPattern : [ Elisionopt AssignmentRestElement ]

    [...]
    5. Let result be the result of performing
       IteratorDestructuringAssignmentEvaluation of AssignmentRestElement with
       iteratorRecord as the argument
    6. If iteratorRecord.[[done]] is false, return IteratorClose(iterator,
       result).

    AssignmentRestElement[Yield] : ... DestructuringAssignmentTarget

    1. If DestructuringAssignmentTarget is neither an ObjectLiteral nor an
       ArrayLiteral, then
       a. Let lref be the result of evaluating DestructuringAssignmentTarget.
       b. ReturnIfAbrupt(lref).

    7.4.6 IteratorClose( iterator, completion )

    [...]
    6. Let innerResult be Call(return, iterator, « »).
    [...]

    7.4.6 IteratorClose( iterator, completion )

    [...]
    6. Let innerResult be Call(return, iterator, « »).
    7. If completion.[[type]] is throw, return Completion(completion).
    8. If innerResult.[[type]] is throw, return Completion(innerResult).
features: [Symbol.iterator, generators]
es6id: 12.14.5.2
esid: sec-runtime-semantics-destructuringassignmentevaluation
---*/

var returnCount = 0;
var unreachable = 0;
var thisValue = null;
var args = null;
var iterable = {};
var iterator = {
  return: function() {
    returnCount += 1;
    thisValue = this;
    args = arguments;
    return {};
  }
};
var iter, result;
iterable[Symbol.iterator] = function() {
  return iterator;
};

function* g() {
  [...{}[yield]] = iterable;
  unreachable += 1;
}

iter = g();
iter.next();
result = iter.return(444);

assert.sameValue(returnCount, 1);
assert.sameValue(unreachable, 0, 'Unreachable statement was not executed');
assert.sameValue(result.value, 444);
assert(result.done, 'Iterator correctly closed');
assert.sameValue(thisValue, iterator, 'correct `this` value');
assert(!!args, 'arguments object provided');
assert.sameValue(args.length, 0, 'zero arguments specified');