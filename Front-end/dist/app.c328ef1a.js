// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

},{}],"node_modules/xstate/es/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpecialTargets = exports.ActionTypes = void 0;
var ActionTypes;
exports.ActionTypes = ActionTypes;

(function (ActionTypes) {
  ActionTypes["Start"] = "xstate.start";
  ActionTypes["Stop"] = "xstate.stop";
  ActionTypes["Raise"] = "xstate.raise";
  ActionTypes["Send"] = "xstate.send";
  ActionTypes["Cancel"] = "xstate.cancel";
  ActionTypes["NullEvent"] = "";
  ActionTypes["Assign"] = "xstate.assign";
  ActionTypes["After"] = "xstate.after";
  ActionTypes["DoneState"] = "done.state";
  ActionTypes["DoneInvoke"] = "done.invoke";
  ActionTypes["Log"] = "xstate.log";
  ActionTypes["Init"] = "xstate.init";
  ActionTypes["Invoke"] = "xstate.invoke";
  ActionTypes["ErrorExecution"] = "error.execution";
  ActionTypes["ErrorCommunication"] = "error.communication";
  ActionTypes["ErrorPlatform"] = "error.platform";
  ActionTypes["ErrorCustom"] = "xstate.error";
  ActionTypes["Update"] = "xstate.update";
  ActionTypes["Pure"] = "xstate.pure";
  ActionTypes["Choose"] = "xstate.choose";
})(ActionTypes || (exports.ActionTypes = ActionTypes = {}));

var SpecialTargets;
exports.SpecialTargets = SpecialTargets;

(function (SpecialTargets) {
  SpecialTargets["Parent"] = "#_parent";
  SpecialTargets["Internal"] = "#_internal";
})(SpecialTargets || (exports.SpecialTargets = SpecialTargets = {}));
},{}],"node_modules/xstate/es/_virtual/_tslib.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__assign = void 0;
exports.__read = __read;
exports.__rest = __rest;
exports.__spreadArray = __spreadArray;
exports.__values = __values;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
},{}],"node_modules/xstate/es/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TARGETLESS_KEY = exports.STATE_DELIMITER = exports.EMPTY_ACTIVITY_MAP = exports.DEFAULT_GUARD_TYPE = void 0;
var STATE_DELIMITER = '.';
exports.STATE_DELIMITER = STATE_DELIMITER;
var EMPTY_ACTIVITY_MAP = {};
exports.EMPTY_ACTIVITY_MAP = EMPTY_ACTIVITY_MAP;
var DEFAULT_GUARD_TYPE = 'xstate.guard';
exports.DEFAULT_GUARD_TYPE = DEFAULT_GUARD_TYPE;
var TARGETLESS_KEY = '';
exports.TARGETLESS_KEY = TARGETLESS_KEY;
},{}],"node_modules/xstate/es/environment.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_PRODUCTION = void 0;
var IS_PRODUCTION = "development" === 'production';
exports.IS_PRODUCTION = IS_PRODUCTION;
},{}],"node_modules/xstate/es/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInvokeId = createInvokeId;
exports.evaluateGuard = evaluateGuard;
exports.flatten = flatten;
exports.getEventType = getEventType;
exports.interopSymbols = void 0;
exports.isActor = isActor;
exports.isArray = isArray;
exports.isBehavior = isBehavior;
exports.isBuiltInEvent = isBuiltInEvent;
exports.isFunction = isFunction;
exports.isMachine = isMachine;
exports.isObservable = isObservable;
exports.isPromiseLike = isPromiseLike;
exports.isStateLike = isStateLike;
exports.isString = isString;
exports.mapContext = mapContext;
exports.mapFilterValues = mapFilterValues;
exports.mapValues = mapValues;
exports.matchesState = matchesState;
exports.nestedPath = nestedPath;
exports.normalizeTarget = normalizeTarget;
exports.partition = partition;
exports.path = void 0;
exports.pathToStateValue = pathToStateValue;
exports.reportUnhandledExceptionOnInvocation = reportUnhandledExceptionOnInvocation;
exports.symbolObservable = void 0;
exports.toArray = toArray;
exports.toArrayStrict = toArrayStrict;
exports.toEventObject = toEventObject;
exports.toGuard = toGuard;
exports.toInvokeSource = toInvokeSource;
exports.toObserver = toObserver;
exports.toSCXMLEvent = toSCXMLEvent;
exports.toStatePath = toStatePath;
exports.toStatePaths = toStatePaths;
exports.toStateValue = toStateValue;
exports.toTransitionConfigArray = toTransitionConfigArray;
exports.uniqueId = void 0;
exports.updateContext = updateContext;
exports.updateHistoryStates = updateHistoryStates;
exports.updateHistoryValue = updateHistoryValue;
exports.warn = void 0;

var _tslib = require("./_virtual/_tslib.js");

var _constants = require("./constants.js");

var _environment = require("./environment.js");

var _a;

function matchesState(parentStateId, childStateId, delimiter) {
  if (delimiter === void 0) {
    delimiter = _constants.STATE_DELIMITER;
  }

  var parentStateValue = toStateValue(parentStateId, delimiter);
  var childStateValue = toStateValue(childStateId, delimiter);

  if (isString(childStateValue)) {
    if (isString(parentStateValue)) {
      return childStateValue === parentStateValue;
    } // Parent more specific than child


    return false;
  }

  if (isString(parentStateValue)) {
    return parentStateValue in childStateValue;
  }

  return Object.keys(parentStateValue).every(function (key) {
    if (!(key in childStateValue)) {
      return false;
    }

    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}

function getEventType(event) {
  try {
    return isString(event) || typeof event === 'number' ? "".concat(event) : event.type;
  } catch (e) {
    throw new Error('Events must be strings or objects with a string event.type property.');
  }
}

function toStatePath(stateId, delimiter) {
  try {
    if (isArray(stateId)) {
      return stateId;
    }

    return stateId.toString().split(delimiter);
  } catch (e) {
    throw new Error("'".concat(stateId, "' is not a valid state path."));
  }
}

function isStateLike(state) {
  return typeof state === 'object' && 'value' in state && 'context' in state && 'event' in state && '_event' in state;
}

function toStateValue(stateValue, delimiter) {
  if (isStateLike(stateValue)) {
    return stateValue.value;
  }

  if (isArray(stateValue)) {
    return pathToStateValue(stateValue);
  }

  if (typeof stateValue !== 'string') {
    return stateValue;
  }

  var statePath = toStatePath(stateValue, delimiter);
  return pathToStateValue(statePath);
}

function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }

  var value = {};
  var marker = value;

  for (var i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      marker[statePath[i]] = {};
      marker = marker[statePath[i]];
    }
  }

  return value;
}

function mapValues(collection, iteratee) {
  var result = {};
  var collectionKeys = Object.keys(collection);

  for (var i = 0; i < collectionKeys.length; i++) {
    var key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }

  return result;
}

function mapFilterValues(collection, iteratee, predicate) {
  var e_1, _a;

  var result = {};

  try {
    for (var _b = (0, _tslib.__values)(Object.keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var item = collection[key];

      if (!predicate(item)) {
        continue;
      }

      result[key] = iteratee(item, key, collection);
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return result;
}
/**
 * Retrieves a value at the given path.
 * @param props The deep path to the prop of the desired value
 */


var path = function (props) {
  return function (object) {
    var e_2, _a;

    var result = object;

    try {
      for (var props_1 = (0, _tslib.__values)(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
        var prop = props_1_1.value;
        result = result[prop];
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    return result;
  };
};
/**
 * Retrieves a value at the given path via the nested accessor prop.
 * @param props The deep path to the prop of the desired value
 */


exports.path = path;

function nestedPath(props, accessorProp) {
  return function (object) {
    var e_3, _a;

    var result = object;

    try {
      for (var props_2 = (0, _tslib.__values)(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
        var prop = props_2_1.value;
        result = result[accessorProp][prop];
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (props_2_1 && !props_2_1.done && (_a = props_2.return)) _a.call(props_2);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    return result;
  };
}

function toStatePaths(stateValue) {
  if (!stateValue) {
    return [[]];
  }

  if (isString(stateValue)) {
    return [[stateValue]];
  }

  var result = flatten(Object.keys(stateValue).map(function (key) {
    var subStateValue = stateValue[key];

    if (typeof subStateValue !== 'string' && (!subStateValue || !Object.keys(subStateValue).length)) {
      return [[key]];
    }

    return toStatePaths(stateValue[key]).map(function (subPath) {
      return [key].concat(subPath);
    });
  }));
  return result;
}

function flatten(array) {
  var _a;

  return (_a = []).concat.apply(_a, (0, _tslib.__spreadArray)([], (0, _tslib.__read)(array), false));
}

function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }

  return [value];
}

function toArray(value) {
  if (value === undefined) {
    return [];
  }

  return toArrayStrict(value);
}

function mapContext(mapper, context, _event) {
  var e_5, _a;

  if (isFunction(mapper)) {
    return mapper(context, _event.data);
  }

  var result = {};

  try {
    for (var _b = (0, _tslib.__values)(Object.keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var subMapper = mapper[key];

      if (isFunction(subMapper)) {
        result[key] = subMapper(context, _event.data);
      } else {
        result[key] = subMapper;
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_5) throw e_5.error;
    }
  }

  return result;
}

function isBuiltInEvent(eventType) {
  return /^(done|error)\./.test(eventType);
}

function isPromiseLike(value) {
  if (value instanceof Promise) {
    return true;
  } // Check if shape matches the Promise/A+ specification for a "thenable".


  if (value !== null && (isFunction(value) || typeof value === 'object') && isFunction(value.then)) {
    return true;
  }

  return false;
}

function isBehavior(value) {
  return value !== null && typeof value === 'object' && 'transition' in value && typeof value.transition === 'function';
}

function partition(items, predicate) {
  var e_6, _a;

  var _b = (0, _tslib.__read)([[], []], 2),
      truthy = _b[0],
      falsy = _b[1];

  try {
    for (var items_1 = (0, _tslib.__values)(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
      var item = items_1_1.value;

      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
  } catch (e_6_1) {
    e_6 = {
      error: e_6_1
    };
  } finally {
    try {
      if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
    } finally {
      if (e_6) throw e_6.error;
    }
  }

  return [truthy, falsy];
}

function updateHistoryStates(hist, stateValue) {
  return mapValues(hist.states, function (subHist, key) {
    if (!subHist) {
      return undefined;
    }

    var subStateValue = (isString(stateValue) ? undefined : stateValue[key]) || (subHist ? subHist.current : undefined);

    if (!subStateValue) {
      return undefined;
    }

    return {
      current: subStateValue,
      states: updateHistoryStates(subHist, subStateValue)
    };
  });
}

function updateHistoryValue(hist, stateValue) {
  return {
    current: stateValue,
    states: updateHistoryStates(hist, stateValue)
  };
}

function updateContext(context, _event, assignActions, state) {
  if (!_environment.IS_PRODUCTION) {
    warn(!!context, 'Attempting to update undefined context');
  }

  var updatedContext = context ? assignActions.reduce(function (acc, assignAction) {
    var e_7, _a;

    var assignment = assignAction.assignment;
    var meta = {
      state: state,
      action: assignAction,
      _event: _event
    };
    var partialUpdate = {};

    if (isFunction(assignment)) {
      partialUpdate = assignment(acc, _event.data, meta);
    } else {
      try {
        for (var _b = (0, _tslib.__values)(Object.keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var key = _c.value;
          var propAssignment = assignment[key];
          partialUpdate[key] = isFunction(propAssignment) ? propAssignment(acc, _event.data, meta) : propAssignment;
        }
      } catch (e_7_1) {
        e_7 = {
          error: e_7_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_7) throw e_7.error;
        }
      }
    }

    return Object.assign({}, acc, partialUpdate);
  }, context) : context;
  return updatedContext;
} // tslint:disable-next-line:no-empty


var warn = function () {};

exports.warn = warn;

if (!_environment.IS_PRODUCTION) {
  exports.warn = warn = function (condition, message) {
    var error = condition instanceof Error ? condition : undefined;

    if (!error && condition) {
      return;
    }

    if (console !== undefined) {
      var args = ["Warning: ".concat(message)];

      if (error) {
        args.push(error);
      } // tslint:disable-next-line:no-console


      console.warn.apply(console, args);
    }
  };
}

function isArray(value) {
  return Array.isArray(value);
} // tslint:disable-next-line:ban-types


function isFunction(value) {
  return typeof value === 'function';
}

function isString(value) {
  return typeof value === 'string';
}

function toGuard(condition, guardMap) {
  if (!condition) {
    return undefined;
  }

  if (isString(condition)) {
    return {
      type: _constants.DEFAULT_GUARD_TYPE,
      name: condition,
      predicate: guardMap ? guardMap[condition] : undefined
    };
  }

  if (isFunction(condition)) {
    return {
      type: _constants.DEFAULT_GUARD_TYPE,
      name: condition.name,
      predicate: condition
    };
  }

  return condition;
}

function isObservable(value) {
  try {
    return 'subscribe' in value && isFunction(value.subscribe);
  } catch (e) {
    return false;
  }
}

var symbolObservable = /*#__PURE__*/function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
}(); // TODO: to be removed in v5, left it out just to minimize the scope of the change and maintain compatibility with older versions of integration paackages


exports.symbolObservable = symbolObservable;
var interopSymbols = (_a = {}, _a[symbolObservable] = function () {
  return this;
}, _a[Symbol.observable] = function () {
  return this;
}, _a);
exports.interopSymbols = interopSymbols;

function isMachine(value) {
  return !!value && '__xstatenode' in value;
}

function isActor(value) {
  return !!value && typeof value.send === 'function';
}

var uniqueId = /*#__PURE__*/function () {
  var currentId = 0;
  return function () {
    currentId++;
    return currentId.toString(16);
  };
}();

exports.uniqueId = uniqueId;

function toEventObject(event, payload // id?: TEvent['type']
) {
  if (isString(event) || typeof event === 'number') {
    return (0, _tslib.__assign)({
      type: event
    }, payload);
  }

  return event;
}

function toSCXMLEvent(event, scxmlEvent) {
  if (!isString(event) && '$$type' in event && event.$$type === 'scxml') {
    return event;
  }

  var eventObject = toEventObject(event);
  return (0, _tslib.__assign)({
    name: eventObject.type,
    data: eventObject,
    $$type: 'scxml',
    type: 'external'
  }, scxmlEvent);
}

function toTransitionConfigArray(event, configLike) {
  var transitions = toArrayStrict(configLike).map(function (transitionLike) {
    if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string' || isMachine(transitionLike)) {
      return {
        target: transitionLike,
        event: event
      };
    }

    return (0, _tslib.__assign)((0, _tslib.__assign)({}, transitionLike), {
      event: event
    });
  });
  return transitions;
}

function normalizeTarget(target) {
  if (target === undefined || target === _constants.TARGETLESS_KEY) {
    return undefined;
  }

  return toArray(target);
}

function reportUnhandledExceptionOnInvocation(originalError, currentError, id) {
  if (!_environment.IS_PRODUCTION) {
    var originalStackTrace = originalError.stack ? " Stacktrace was '".concat(originalError.stack, "'") : '';

    if (originalError === currentError) {
      // tslint:disable-next-line:no-console
      console.error("Missing onError handler for invocation '".concat(id, "', error was '").concat(originalError, "'.").concat(originalStackTrace));
    } else {
      var stackTrace = currentError.stack ? " Stacktrace was '".concat(currentError.stack, "'") : ''; // tslint:disable-next-line:no-console

      console.error("Missing onError handler and/or unhandled exception/promise rejection for invocation '".concat(id, "'. ") + "Original error: '".concat(originalError, "'. ").concat(originalStackTrace, " Current error is '").concat(currentError, "'.").concat(stackTrace));
    }
  }
}

function evaluateGuard(machine, guard, context, _event, state) {
  var guards = machine.options.guards;
  var guardMeta = {
    state: state,
    cond: guard,
    _event: _event
  }; // TODO: do not hardcode!

  if (guard.type === _constants.DEFAULT_GUARD_TYPE) {
    return ((guards === null || guards === void 0 ? void 0 : guards[guard.name]) || guard.predicate)(context, _event.data, guardMeta);
  }

  var condFn = guards === null || guards === void 0 ? void 0 : guards[guard.type];

  if (!condFn) {
    throw new Error("Guard '".concat(guard.type, "' is not implemented on machine '").concat(machine.id, "'."));
  }

  return condFn(context, _event.data, guardMeta);
}

function toInvokeSource(src) {
  if (typeof src === 'string') {
    return {
      type: src
    };
  }

  return src;
}

function toObserver(nextHandler, errorHandler, completionHandler) {
  if (typeof nextHandler === 'object') {
    return nextHandler;
  }

  var noop = function () {
    return void 0;
  };

  return {
    next: nextHandler,
    error: errorHandler || noop,
    complete: completionHandler || noop
  };
}

function createInvokeId(stateNodeId, index) {
  return "".concat(stateNodeId, ":invocation[").concat(index, "]");
}
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./constants.js":"node_modules/xstate/es/constants.js","./environment.js":"node_modules/xstate/es/environment.js"}],"node_modules/xstate/es/actionTypes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.stop = exports.start = exports.send = exports.raise = exports.pure = exports.nullEvent = exports.log = exports.invoke = exports.init = exports.errorPlatform = exports.errorExecution = exports.error = exports.doneState = exports.choose = exports.cancel = exports.assign = exports.after = void 0;

var _types = require("./types.js");

var start = _types.ActionTypes.Start;
exports.start = start;
var stop = _types.ActionTypes.Stop;
exports.stop = stop;
var raise = _types.ActionTypes.Raise;
exports.raise = raise;
var send = _types.ActionTypes.Send;
exports.send = send;
var cancel = _types.ActionTypes.Cancel;
exports.cancel = cancel;
var nullEvent = _types.ActionTypes.NullEvent;
exports.nullEvent = nullEvent;
var assign = _types.ActionTypes.Assign;
exports.assign = assign;
var after = _types.ActionTypes.After;
exports.after = after;
var doneState = _types.ActionTypes.DoneState;
exports.doneState = doneState;
var log = _types.ActionTypes.Log;
exports.log = log;
var init = _types.ActionTypes.Init;
exports.init = init;
var invoke = _types.ActionTypes.Invoke;
exports.invoke = invoke;
var errorExecution = _types.ActionTypes.ErrorExecution;
exports.errorExecution = errorExecution;
var errorPlatform = _types.ActionTypes.ErrorPlatform;
exports.errorPlatform = errorPlatform;
var error = _types.ActionTypes.ErrorCustom;
exports.error = error;
var update = _types.ActionTypes.Update;
exports.update = update;
var choose = _types.ActionTypes.Choose;
exports.choose = choose;
var pure = _types.ActionTypes.Pure;
exports.pure = pure;
},{"./types.js":"node_modules/xstate/es/types.js"}],"node_modules/xstate/es/actions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionTypes = void 0;
exports.after = after;
exports.cancel = exports.assign = void 0;
exports.choose = choose;
exports.done = done;
exports.doneInvoke = doneInvoke;
exports.error = error;
exports.escalate = escalate;
exports.forwardTo = forwardTo;
exports.getActionFunction = getActionFunction;
exports.initEvent = void 0;
exports.isActionObject = isActionObject;
exports.log = log;
exports.pure = pure;
exports.raise = raise;
exports.resolveActions = resolveActions;
exports.resolveLog = void 0;
exports.resolveRaise = resolveRaise;
exports.resolveSend = resolveSend;
exports.resolveStop = resolveStop;
exports.respond = respond;
exports.send = send;
exports.sendParent = sendParent;
exports.sendTo = sendTo;
exports.sendUpdate = sendUpdate;
exports.start = start;
exports.stop = stop;
exports.toActionObject = toActionObject;
exports.toActionObjects = void 0;
exports.toActivityDefinition = toActivityDefinition;

var _tslib = require("./_virtual/_tslib.js");

var _types = require("./types.js");

var actionTypes = _interopRequireWildcard(require("./actionTypes.js"));

exports.actionTypes = actionTypes;

var _environment = require("./environment.js");

var _utils = require("./utils.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var initEvent = /*#__PURE__*/(0, _utils.toSCXMLEvent)({
  type: actionTypes.init
});
exports.initEvent = initEvent;

function getActionFunction(actionType, actionFunctionMap) {
  return actionFunctionMap ? actionFunctionMap[actionType] || undefined : undefined;
}

function toActionObject(action, actionFunctionMap) {
  var actionObject;

  if ((0, _utils.isString)(action) || typeof action === 'number') {
    var exec = getActionFunction(action, actionFunctionMap);

    if ((0, _utils.isFunction)(exec)) {
      actionObject = {
        type: action,
        exec: exec
      };
    } else if (exec) {
      actionObject = exec;
    } else {
      actionObject = {
        type: action,
        exec: undefined
      };
    }
  } else if ((0, _utils.isFunction)(action)) {
    actionObject = {
      // Convert action to string if unnamed
      type: action.name || action.toString(),
      exec: action
    };
  } else {
    var exec = getActionFunction(action.type, actionFunctionMap);

    if ((0, _utils.isFunction)(exec)) {
      actionObject = (0, _tslib.__assign)((0, _tslib.__assign)({}, action), {
        exec: exec
      });
    } else if (exec) {
      var actionType = exec.type || action.type;
      actionObject = (0, _tslib.__assign)((0, _tslib.__assign)((0, _tslib.__assign)({}, exec), action), {
        type: actionType
      });
    } else {
      actionObject = action;
    }
  }

  return actionObject;
}

var toActionObjects = function (action, actionFunctionMap) {
  if (!action) {
    return [];
  }

  var actions = (0, _utils.isArray)(action) ? action : [action];
  return actions.map(function (subAction) {
    return toActionObject(subAction, actionFunctionMap);
  });
};

exports.toActionObjects = toActionObjects;

function toActivityDefinition(action) {
  var actionObject = toActionObject(action);
  return (0, _tslib.__assign)((0, _tslib.__assign)({
    id: (0, _utils.isString)(action) ? action : actionObject.id
  }, actionObject), {
    type: actionObject.type
  });
}
/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */


function raise(event) {
  if (!(0, _utils.isString)(event)) {
    return send(event, {
      to: _types.SpecialTargets.Internal
    });
  }

  return {
    type: actionTypes.raise,
    event: event
  };
}

function resolveRaise(action) {
  return {
    type: actionTypes.raise,
    _event: (0, _utils.toSCXMLEvent)(action.event)
  };
}
/**
 * Sends an event. This returns an action that will be read by an interpreter to
 * send the event in the next step, after the current step is finished executing.
 *
 * @param event The event to send.
 * @param options Options to pass into the send event:
 *  - `id` - The unique send event identifier (used with `cancel()`).
 *  - `delay` - The number of milliseconds to delay the sending of the event.
 *  - `to` - The target of this event (by default, the machine the event was sent from).
 */


function send(event, options) {
  return {
    to: options ? options.to : undefined,
    type: actionTypes.send,
    event: (0, _utils.isFunction)(event) ? event : (0, _utils.toEventObject)(event),
    delay: options ? options.delay : undefined,
    id: options && options.id !== undefined ? options.id : (0, _utils.isFunction)(event) ? event.name : (0, _utils.getEventType)(event)
  };
}

function resolveSend(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  }; // TODO: helper function for resolving Expr

  var resolvedEvent = (0, _utils.toSCXMLEvent)((0, _utils.isFunction)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0, _utils.isString)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0, _utils.isFunction)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0, _utils.isFunction)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  var resolvedTarget = (0, _utils.isFunction)(action.to) ? action.to(ctx, _event.data, meta) : action.to;
  return (0, _tslib.__assign)((0, _tslib.__assign)({}, action), {
    to: resolvedTarget,
    _event: resolvedEvent,
    event: resolvedEvent.data,
    delay: resolvedDelay
  });
}
/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */


function sendParent(event, options) {
  return send(event, (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
    to: _types.SpecialTargets.Parent
  }));
}
/**
 * Sends an event to an actor.
 *
 * @param actor The `ActorRef` to send the event to.
 * @param event The event to send, or an expression that evaluates to the event to send
 * @param options Send action options
 * @returns An XState send action object
 */


function sendTo(actor, event, options) {
  return send(event, (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
    to: actor
  }));
}
/**
 * Sends an update event to this machine's parent.
 */


function sendUpdate() {
  return sendParent(actionTypes.update);
}
/**
 * Sends an event back to the sender of the original event.
 *
 * @param event The event to send back to the sender
 * @param options Options to pass into the send event
 */


function respond(event, options) {
  return send(event, (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
    to: function (_, __, _a) {
      var _event = _a._event;
      return _event.origin; // TODO: handle when _event.origin is undefined
    }
  }));
}

var defaultLogExpr = function (context, event) {
  return {
    context: context,
    event: event
  };
};
/**
 *
 * @param expr The expression function to evaluate which will be logged.
 *  Takes in 2 arguments:
 *  - `ctx` - the current state context
 *  - `event` - the event that caused this action to be executed.
 * @param label The label to give to the logged expression.
 */


function log(expr, label) {
  if (expr === void 0) {
    expr = defaultLogExpr;
  }

  return {
    type: actionTypes.log,
    label: label,
    expr: expr
  };
}

var resolveLog = function (action, ctx, _event) {
  return (0, _tslib.__assign)((0, _tslib.__assign)({}, action), {
    value: (0, _utils.isString)(action.expr) ? action.expr : action.expr(ctx, _event.data, {
      _event: _event
    })
  });
};
/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */


exports.resolveLog = resolveLog;

var cancel = function (sendId) {
  return {
    type: actionTypes.cancel,
    sendId: sendId
  };
};
/**
 * Starts an activity.
 *
 * @param activity The activity to start.
 */


exports.cancel = cancel;

function start(activity) {
  var activityDef = toActivityDefinition(activity);
  return {
    type: _types.ActionTypes.Start,
    activity: activityDef,
    exec: undefined
  };
}
/**
 * Stops an activity.
 *
 * @param actorRef The activity to stop.
 */


function stop(actorRef) {
  var activity = (0, _utils.isFunction)(actorRef) ? actorRef : toActivityDefinition(actorRef);
  return {
    type: _types.ActionTypes.Stop,
    activity: activity,
    exec: undefined
  };
}

function resolveStop(action, context, _event) {
  var actorRefOrString = (0, _utils.isFunction)(action.activity) ? action.activity(context, _event.data) : action.activity;
  var resolvedActorRef = typeof actorRefOrString === 'string' ? {
    id: actorRefOrString
  } : actorRefOrString;
  var actionObject = {
    type: _types.ActionTypes.Stop,
    activity: resolvedActorRef
  };
  return actionObject;
}
/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */


var assign = function (assignment) {
  return {
    type: actionTypes.assign,
    assignment: assignment
  };
};

exports.assign = assign;

function isActionObject(action) {
  return typeof action === 'object' && 'type' in action;
}
/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */


function after(delayRef, id) {
  var idSuffix = id ? "#".concat(id) : '';
  return "".concat(_types.ActionTypes.After, "(").concat(delayRef, ")").concat(idSuffix);
}
/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param data The data to pass into the event
 */


function done(id, data) {
  var type = "".concat(_types.ActionTypes.DoneState, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param id The final state node ID
 * @param data The data to pass into the event
 */


function doneInvoke(id, data) {
  var type = "".concat(_types.ActionTypes.DoneInvoke, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}

function error(id, data) {
  var type = "".concat(_types.ActionTypes.ErrorPlatform, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}

function pure(getActions) {
  return {
    type: _types.ActionTypes.Pure,
    get: getActions
  };
}
/**
 * Forwards (sends) an event to a specified service.
 *
 * @param target The target service to forward the event to.
 * @param options Options to pass into the send action creator.
 */


function forwardTo(target, options) {
  return send(function (_, event) {
    return event;
  }, (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
    to: target
  }));
}
/**
 * Escalates an error by sending it as an event to this machine's parent.
 *
 * @param errorData The error data to send, or the expression function that
 * takes in the `context`, `event`, and `meta`, and returns the error data to send.
 * @param options Options to pass into the send action creator.
 */


function escalate(errorData, options) {
  return sendParent(function (context, event, meta) {
    return {
      type: actionTypes.error,
      data: (0, _utils.isFunction)(errorData) ? errorData(context, event, meta) : errorData
    };
  }, (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
    to: _types.SpecialTargets.Parent
  }));
}

function choose(conds) {
  return {
    type: _types.ActionTypes.Choose,
    conds: conds
  };
}

function resolveActions(machine, currentState, currentContext, _event, actions, preserveActionOrder) {
  if (preserveActionOrder === void 0) {
    preserveActionOrder = false;
  }

  var _a = (0, _tslib.__read)(preserveActionOrder ? [[], actions] : (0, _utils.partition)(actions, function (action) {
    return action.type === actionTypes.assign;
  }), 2),
      assignActions = _a[0],
      otherActions = _a[1];

  var updatedContext = assignActions.length ? (0, _utils.updateContext)(currentContext, _event, assignActions, currentState) : currentContext;
  var preservedContexts = preserveActionOrder ? [currentContext] : undefined;
  var resolvedActions = (0, _utils.flatten)(otherActions.map(function (actionObject) {
    var _a;

    switch (actionObject.type) {
      case actionTypes.raise:
        return resolveRaise(actionObject);

      case actionTypes.send:
        var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays); // TODO: fix ActionTypes.Init

        if (!_environment.IS_PRODUCTION) {
          // warn after resolving as we can create better contextual message here
          (0, _utils.warn)(!(0, _utils.isString)(actionObject.delay) || typeof sendAction.delay === 'number', // tslint:disable-next-line:max-line-length
          "No delay reference for delay expression '".concat(actionObject.delay, "' was found on machine '").concat(machine.id, "'"));
        }

        return sendAction;

      case actionTypes.log:
        return resolveLog(actionObject, updatedContext, _event);

      case actionTypes.choose:
        {
          var chooseAction = actionObject;
          var matchedActions = (_a = chooseAction.conds.find(function (condition) {
            var guard = (0, _utils.toGuard)(condition.cond, machine.options.guards);
            return !guard || (0, _utils.evaluateGuard)(machine, guard, updatedContext, _event, currentState);
          })) === null || _a === void 0 ? void 0 : _a.actions;

          if (!matchedActions) {
            return [];
          }

          var _b = (0, _tslib.__read)(resolveActions(machine, currentState, updatedContext, _event, toActionObjects((0, _utils.toArray)(matchedActions), machine.options.actions), preserveActionOrder), 2),
              resolvedActionsFromChoose = _b[0],
              resolvedContextFromChoose = _b[1];

          updatedContext = resolvedContextFromChoose;
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          return resolvedActionsFromChoose;
        }

      case actionTypes.pure:
        {
          var matchedActions = actionObject.get(updatedContext, _event.data);

          if (!matchedActions) {
            return [];
          }

          var _c = (0, _tslib.__read)(resolveActions(machine, currentState, updatedContext, _event, toActionObjects((0, _utils.toArray)(matchedActions), machine.options.actions), preserveActionOrder), 2),
              resolvedActionsFromPure = _c[0],
              resolvedContext = _c[1];

          updatedContext = resolvedContext;
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          return resolvedActionsFromPure;
        }

      case actionTypes.stop:
        {
          return resolveStop(actionObject, updatedContext, _event);
        }

      case actionTypes.assign:
        {
          updatedContext = (0, _utils.updateContext)(updatedContext, _event, [actionObject], currentState);
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          break;
        }

      default:
        var resolvedActionObject = toActionObject(actionObject, machine.options.actions);
        var exec_1 = resolvedActionObject.exec;

        if (exec_1 && preservedContexts) {
          var contextIndex_1 = preservedContexts.length - 1;
          resolvedActionObject = (0, _tslib.__assign)((0, _tslib.__assign)({}, resolvedActionObject), {
            exec: function (_ctx) {
              var args = [];

              for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
              }

              exec_1.apply(void 0, (0, _tslib.__spreadArray)([preservedContexts[contextIndex_1]], (0, _tslib.__read)(args), false));
            }
          });
        }

        return resolvedActionObject;
    }
  }).filter(function (a) {
    return !!a;
  }));
  return [resolvedActions, updatedContext];
}
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./types.js":"node_modules/xstate/es/types.js","./actionTypes.js":"node_modules/xstate/es/actionTypes.js","./environment.js":"node_modules/xstate/es/environment.js","./utils.js":"node_modules/xstate/es/utils.js"}],"node_modules/xstate/es/serviceScope.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.provide = exports.consume = void 0;

/**
 * Maintains a stack of the current service in scope.
 * This is used to provide the correct service to spawn().
 */
var serviceStack = [];

var provide = function (service, fn) {
  serviceStack.push(service);
  var result = fn(service);
  serviceStack.pop();
  return result;
};

exports.provide = provide;

var consume = function (fn) {
  return fn(serviceStack[serviceStack.length - 1]);
};

exports.consume = consume;
},{}],"node_modules/xstate/es/Actor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDeferredActor = createDeferredActor;
exports.createInvocableActor = createInvocableActor;
exports.createNullActor = createNullActor;
exports.isActor = isActor;
exports.isSpawnedActor = isSpawnedActor;
exports.toActorRef = toActorRef;

var _tslib = require("./_virtual/_tslib.js");

var _utils = require("./utils.js");

var _serviceScope = require("./serviceScope.js");

function createNullActor(id) {
  var _a;

  return _a = {
    id: id,
    send: function () {
      return void 0;
    },
    subscribe: function () {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    },
    getSnapshot: function () {
      return undefined;
    },
    toJSON: function () {
      return {
        id: id
      };
    }
  }, _a[_utils.symbolObservable] = function () {
    return this;
  }, _a;
}
/**
 * Creates a deferred actor that is able to be invoked given the provided
 * invocation information in its `.meta` value.
 *
 * @param invokeDefinition The meta information needed to invoke the actor.
 */


function createInvocableActor(invokeDefinition, machine, context, _event) {
  var _a;

  var invokeSrc = (0, _utils.toInvokeSource)(invokeDefinition.src);
  var serviceCreator = (_a = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a === void 0 ? void 0 : _a[invokeSrc.type];
  var resolvedData = invokeDefinition.data ? (0, _utils.mapContext)(invokeDefinition.data, context, _event) : undefined;
  var tempActor = serviceCreator ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData) : createNullActor(invokeDefinition.id); // @ts-ignore

  tempActor.meta = invokeDefinition;
  return tempActor;
}

function createDeferredActor(entity, id, data) {
  var tempActor = createNullActor(id); // @ts-ignore

  tempActor.deferred = true;

  if ((0, _utils.isMachine)(entity)) {
    // "mute" the existing service scope so potential spawned actors within the `.initialState` stay deferred here
    var initialState_1 = tempActor.state = (0, _serviceScope.provide)(undefined, function () {
      return (data ? entity.withContext(data) : entity).initialState;
    });

    tempActor.getSnapshot = function () {
      return initialState_1;
    };
  }

  return tempActor;
}

function isActor(item) {
  try {
    return typeof item.send === 'function';
  } catch (e) {
    return false;
  }
}

function isSpawnedActor(item) {
  return isActor(item) && 'id' in item;
} // TODO: refactor the return type, this could be written in a better way but it's best to avoid unneccessary breaking changes now


function toActorRef(actorRefLike) {
  var _a;

  return (0, _tslib.__assign)((_a = {
    subscribe: function () {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    },
    id: 'anonymous',
    getSnapshot: function () {
      return undefined;
    }
  }, _a[_utils.symbolObservable] = function () {
    return this;
  }, _a), actorRefLike);
}
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./utils.js":"node_modules/xstate/es/utils.js","./serviceScope.js":"node_modules/xstate/es/serviceScope.js"}],"node_modules/xstate/es/stateUtils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAdjList = getAdjList;
exports.getAllStateNodes = getAllStateNodes;
exports.getChildren = getChildren;
exports.getConfiguration = getConfiguration;
exports.getMeta = getMeta;
exports.getTagsFromConfiguration = getTagsFromConfiguration;
exports.getValue = getValue;
exports.has = has;
exports.isInFinalState = isInFinalState;
exports.isLeafNode = void 0;
exports.nextEvents = nextEvents;

var _tslib = require("./_virtual/_tslib.js");

var _utils = require("./utils.js");

var isLeafNode = function (stateNode) {
  return stateNode.type === 'atomic' || stateNode.type === 'final';
};

exports.isLeafNode = isLeafNode;

function getChildren(stateNode) {
  return Object.keys(stateNode.states).map(function (key) {
    return stateNode.states[key];
  });
}

function getAllStateNodes(stateNode) {
  var stateNodes = [stateNode];

  if (isLeafNode(stateNode)) {
    return stateNodes;
  }

  return stateNodes.concat((0, _utils.flatten)(getChildren(stateNode).map(getAllStateNodes)));
}

function getConfiguration(prevStateNodes, stateNodes) {
  var e_1, _a, e_2, _b, e_3, _c, e_4, _d;

  var prevConfiguration = new Set(prevStateNodes);
  var prevAdjList = getAdjList(prevConfiguration);
  var configuration = new Set(stateNodes);

  try {
    // add all ancestors
    for (var configuration_1 = (0, _tslib.__values)(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
      var s = configuration_1_1.value;
      var m = s.parent;

      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (configuration_1_1 && !configuration_1_1.done && (_a = configuration_1.return)) _a.call(configuration_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  var adjList = getAdjList(configuration);

  try {
    // add descendants
    for (var configuration_2 = (0, _tslib.__values)(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
      var s = configuration_2_1.value; // if previously active, add existing child nodes

      if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
        if (prevAdjList.get(s)) {
          prevAdjList.get(s).forEach(function (sn) {
            return configuration.add(sn);
          });
        } else {
          s.initialStateNodes.forEach(function (sn) {
            return configuration.add(sn);
          });
        }
      } else {
        if (s.type === 'parallel') {
          try {
            for (var _e = (e_3 = void 0, (0, _tslib.__values)(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
              var child = _f.value;

              if (child.type === 'history') {
                continue;
              }

              if (!configuration.has(child)) {
                configuration.add(child);

                if (prevAdjList.get(child)) {
                  prevAdjList.get(child).forEach(function (sn) {
                    return configuration.add(sn);
                  });
                } else {
                  child.initialStateNodes.forEach(function (sn) {
                    return configuration.add(sn);
                  });
                }
              }
            }
          } catch (e_3_1) {
            e_3 = {
              error: e_3_1
            };
          } finally {
            try {
              if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
            } finally {
              if (e_3) throw e_3.error;
            }
          }
        }
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (configuration_2_1 && !configuration_2_1.done && (_b = configuration_2.return)) _b.call(configuration_2);
    } finally {
      if (e_2) throw e_2.error;
    }
  }

  try {
    // add all ancestors
    for (var configuration_3 = (0, _tslib.__values)(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
      var s = configuration_3_1.value;
      var m = s.parent;

      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_4_1) {
    e_4 = {
      error: e_4_1
    };
  } finally {
    try {
      if (configuration_3_1 && !configuration_3_1.done && (_d = configuration_3.return)) _d.call(configuration_3);
    } finally {
      if (e_4) throw e_4.error;
    }
  }

  return configuration;
}

function getValueFromAdj(baseNode, adjList) {
  var childStateNodes = adjList.get(baseNode);

  if (!childStateNodes) {
    return {}; // todo: fix?
  }

  if (baseNode.type === 'compound') {
    var childStateNode = childStateNodes[0];

    if (childStateNode) {
      if (isLeafNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }

  var stateValue = {};
  childStateNodes.forEach(function (csn) {
    stateValue[csn.key] = getValueFromAdj(csn, adjList);
  });
  return stateValue;
}

function getAdjList(configuration) {
  var e_5, _a;

  var adjList = new Map();

  try {
    for (var configuration_4 = (0, _tslib.__values)(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
      var s = configuration_4_1.value;

      if (!adjList.has(s)) {
        adjList.set(s, []);
      }

      if (s.parent) {
        if (!adjList.has(s.parent)) {
          adjList.set(s.parent, []);
        }

        adjList.get(s.parent).push(s);
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (configuration_4_1 && !configuration_4_1.done && (_a = configuration_4.return)) _a.call(configuration_4);
    } finally {
      if (e_5) throw e_5.error;
    }
  }

  return adjList;
}

function getValue(rootNode, configuration) {
  var config = getConfiguration([rootNode], configuration);
  return getValueFromAdj(rootNode, getAdjList(config));
}

function has(iterable, item) {
  if (Array.isArray(iterable)) {
    return iterable.some(function (member) {
      return member === item;
    });
  }

  if (iterable instanceof Set) {
    return iterable.has(item);
  }

  return false; // TODO: fix
}

function nextEvents(configuration) {
  return (0, _tslib.__spreadArray)([], (0, _tslib.__read)(new Set((0, _utils.flatten)((0, _tslib.__spreadArray)([], (0, _tslib.__read)(configuration.map(function (sn) {
    return sn.ownEvents;
  })), false)))), false);
}

function isInFinalState(configuration, stateNode) {
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(function (s) {
      return s.type === 'final' && has(configuration, s);
    });
  }

  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(function (sn) {
      return isInFinalState(configuration, sn);
    });
  }

  return false;
}

function getMeta(configuration) {
  if (configuration === void 0) {
    configuration = [];
  }

  return configuration.reduce(function (acc, stateNode) {
    if (stateNode.meta !== undefined) {
      acc[stateNode.id] = stateNode.meta;
    }

    return acc;
  }, {});
}

function getTagsFromConfiguration(configuration) {
  return new Set((0, _utils.flatten)(configuration.map(function (sn) {
    return sn.tags;
  })));
}
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./utils.js":"node_modules/xstate/es/utils.js"}],"node_modules/xstate/es/State.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = void 0;
exports.bindActionToState = bindActionToState;
exports.isStateConfig = isStateConfig;
exports.stateValuesEqual = stateValuesEqual;

var _tslib = require("./_virtual/_tslib.js");

var _constants = require("./constants.js");

var _environment = require("./environment.js");

var _utils = require("./utils.js");

var _actions = require("./actions.js");

var _stateUtils = require("./stateUtils.js");

function stateValuesEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  if ((0, _utils.isString)(a) || (0, _utils.isString)(b)) {
    return a === b;
  }

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  return aKeys.length === bKeys.length && aKeys.every(function (key) {
    return stateValuesEqual(a[key], b[key]);
  });
}

function isStateConfig(state) {
  if (typeof state !== 'object' || state === null) {
    return false;
  }

  return 'value' in state && '_event' in state;
}

function bindActionToState(action, state) {
  var exec = action.exec;
  var boundAction = (0, _tslib.__assign)((0, _tslib.__assign)({}, action), {
    exec: exec !== undefined ? function () {
      return exec(state.context, state.event, {
        action: action,
        state: state,
        _event: state._event
      });
    } : undefined
  });
  return boundAction;
}

var State =
/*#__PURE__*/

/** @class */
function () {
  /**
   * Creates a new State instance.
   * @param value The state value
   * @param context The extended state
   * @param historyValue The tree representing historical values of the state nodes
   * @param history The previous state
   * @param actions An array of action objects to execute as side-effects
   * @param activities A mapping of activities and whether they are started (`true`) or stopped (`false`).
   * @param meta
   * @param events Internal event queue. Should be empty with run-to-completion semantics.
   * @param configuration
   */
  function State(config) {
    var _this = this;

    var _a;

    this.actions = [];
    this.activities = _constants.EMPTY_ACTIVITY_MAP;
    this.meta = {};
    this.events = [];
    this.value = config.value;
    this.context = config.context;
    this._event = config._event;
    this._sessionid = config._sessionid;
    this.event = this._event.data;
    this.historyValue = config.historyValue;
    this.history = config.history;
    this.actions = config.actions || [];
    this.activities = config.activities || _constants.EMPTY_ACTIVITY_MAP;
    this.meta = (0, _stateUtils.getMeta)(config.configuration);
    this.events = config.events || [];
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = config.configuration;
    this.transitions = config.transitions;
    this.children = config.children;
    this.done = !!config.done;
    this.tags = (_a = Array.isArray(config.tags) ? new Set(config.tags) : config.tags) !== null && _a !== void 0 ? _a : new Set();
    this.machine = config.machine;
    Object.defineProperty(this, 'nextEvents', {
      get: function () {
        return (0, _stateUtils.nextEvents)(_this.configuration);
      }
    });
  }
  /**
   * Creates a new State instance for the given `stateValue` and `context`.
   * @param stateValue
   * @param context
   */


  State.from = function (stateValue, context) {
    if (stateValue instanceof State) {
      if (stateValue.context !== context) {
        return new State({
          value: stateValue.value,
          context: context,
          _event: stateValue._event,
          _sessionid: null,
          historyValue: stateValue.historyValue,
          history: stateValue.history,
          actions: [],
          activities: stateValue.activities,
          meta: {},
          events: [],
          configuration: [],
          transitions: [],
          children: {}
        });
      }

      return stateValue;
    }

    var _event = _actions.initEvent;
    return new State({
      value: stateValue,
      context: context,
      _event: _event,
      _sessionid: null,
      historyValue: undefined,
      history: undefined,
      actions: [],
      activities: undefined,
      meta: undefined,
      events: [],
      configuration: [],
      transitions: [],
      children: {}
    });
  };
  /**
   * Creates a new State instance for the given `config`.
   * @param config The state config
   */


  State.create = function (config) {
    return new State(config);
  };
  /**
   * Creates a new `State` instance for the given `stateValue` and `context` with no actions (side-effects).
   * @param stateValue
   * @param context
   */


  State.inert = function (stateValue, context) {
    if (stateValue instanceof State) {
      if (!stateValue.actions.length) {
        return stateValue;
      }

      var _event = _actions.initEvent;
      return new State({
        value: stateValue.value,
        context: context,
        _event: _event,
        _sessionid: null,
        historyValue: stateValue.historyValue,
        history: stateValue.history,
        activities: stateValue.activities,
        configuration: stateValue.configuration,
        transitions: [],
        children: {}
      });
    }

    return State.from(stateValue, context);
  };
  /**
   * Returns an array of all the string leaf state node paths.
   * @param stateValue
   * @param delimiter The character(s) that separate each subpath in the string state node path.
   */


  State.prototype.toStrings = function (stateValue, delimiter) {
    var _this = this;

    if (stateValue === void 0) {
      stateValue = this.value;
    }

    if (delimiter === void 0) {
      delimiter = '.';
    }

    if ((0, _utils.isString)(stateValue)) {
      return [stateValue];
    }

    var valueKeys = Object.keys(stateValue);
    return valueKeys.concat.apply(valueKeys, (0, _tslib.__spreadArray)([], (0, _tslib.__read)(valueKeys.map(function (key) {
      return _this.toStrings(stateValue[key], delimiter).map(function (s) {
        return key + delimiter + s;
      });
    })), false));
  };

  State.prototype.toJSON = function () {
    var _a = this,
        configuration = _a.configuration,
        transitions = _a.transitions,
        tags = _a.tags,
        machine = _a.machine,
        jsonValues = (0, _tslib.__rest)(_a, ["configuration", "transitions", "tags", "machine"]);

    return (0, _tslib.__assign)((0, _tslib.__assign)({}, jsonValues), {
      tags: Array.from(tags)
    });
  };

  State.prototype.matches = function (parentStateValue) {
    return (0, _utils.matchesState)(parentStateValue, this.value);
  };
  /**
   * Whether the current state configuration has a state node with the specified `tag`.
   * @param tag
   */


  State.prototype.hasTag = function (tag) {
    return this.tags.has(tag);
  };
  /**
   * Determines whether sending the `event` will cause a non-forbidden transition
   * to be selected, even if the transitions have no actions nor
   * change the state value.
   *
   * @param event The event to test
   * @returns Whether the event will cause a transition
   */


  State.prototype.can = function (event) {
    var _a;

    if (_environment.IS_PRODUCTION) {
      (0, _utils.warn)(!!this.machine, "state.can(...) used outside of a machine-created State object; this will always return false.");
    }

    var transitionData = (_a = this.machine) === null || _a === void 0 ? void 0 : _a.getTransitionData(this, event);
    return !!(transitionData === null || transitionData === void 0 ? void 0 : transitionData.transitions.length) && // Check that at least one transition is not forbidden
    transitionData.transitions.some(function (t) {
      return t.target !== undefined || t.actions.length;
    });
  };

  return State;
}();

exports.State = State;
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./constants.js":"node_modules/xstate/es/constants.js","./environment.js":"node_modules/xstate/es/environment.js","./utils.js":"node_modules/xstate/es/utils.js","./actions.js":"node_modules/xstate/es/actions.js","./stateUtils.js":"node_modules/xstate/es/stateUtils.js"}],"node_modules/xstate/es/behaviors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spawnBehavior = spawnBehavior;

require("./types.js");

require("./actionTypes.js");

require("./environment.js");

var _utils = require("./utils.js");

var _Actor = require("./Actor.js");

function spawnBehavior(behavior, options) {
  if (options === void 0) {
    options = {};
  }

  var state = behavior.initialState;
  var observers = new Set();
  var mailbox = [];
  var flushing = false;

  var flush = function () {
    if (flushing) {
      return;
    }

    flushing = true;

    while (mailbox.length > 0) {
      var event_1 = mailbox.shift();
      state = behavior.transition(state, event_1, actorCtx);
      observers.forEach(function (observer) {
        return observer.next(state);
      });
    }

    flushing = false;
  };

  var actor = (0, _Actor.toActorRef)({
    id: options.id,
    send: function (event) {
      mailbox.push(event);
      flush();
    },
    getSnapshot: function () {
      return state;
    },
    subscribe: function (next, handleError, complete) {
      var observer = (0, _utils.toObserver)(next, handleError, complete);
      observers.add(observer);
      observer.next(state);
      return {
        unsubscribe: function () {
          observers.delete(observer);
        }
      };
    }
  });
  var actorCtx = {
    parent: options.parent,
    self: actor,
    id: options.id || 'anonymous',
    observers: observers
  };
  state = behavior.start ? behavior.start(actorCtx) : state;
  return actor;
}
},{"./types.js":"node_modules/xstate/es/types.js","./actionTypes.js":"node_modules/xstate/es/actionTypes.js","./environment.js":"node_modules/xstate/es/environment.js","./utils.js":"node_modules/xstate/es/utils.js","./Actor.js":"node_modules/xstate/es/Actor.js"}],"node_modules/xstate/es/scheduler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scheduler = void 0;

var _tslib = require("./_virtual/_tslib.js");

var defaultOptions = {
  deferEvents: false
};

var Scheduler =
/*#__PURE__*/

/** @class */
function () {
  function Scheduler(options) {
    this.processingEvent = false;
    this.queue = [];
    this.initialized = false;
    this.options = (0, _tslib.__assign)((0, _tslib.__assign)({}, defaultOptions), options);
  }

  Scheduler.prototype.initialize = function (callback) {
    this.initialized = true;

    if (callback) {
      if (!this.options.deferEvents) {
        this.schedule(callback);
        return;
      }

      this.process(callback);
    }

    this.flushEvents();
  };

  Scheduler.prototype.schedule = function (task) {
    if (!this.initialized || this.processingEvent) {
      this.queue.push(task);
      return;
    }

    if (this.queue.length !== 0) {
      throw new Error('Event queue should be empty when it is not processing events');
    }

    this.process(task);
    this.flushEvents();
  };

  Scheduler.prototype.clear = function () {
    this.queue = [];
  };

  Scheduler.prototype.flushEvents = function () {
    var nextCallback = this.queue.shift();

    while (nextCallback) {
      this.process(nextCallback);
      nextCallback = this.queue.shift();
    }
  };

  Scheduler.prototype.process = function (callback) {
    this.processingEvent = true;

    try {
      callback();
    } catch (e) {
      // there is no use to keep the future events
      // as the situation is not anymore the same
      this.clear();
      throw e;
    } finally {
      this.processingEvent = false;
    }
  };

  return Scheduler;
}();

exports.Scheduler = Scheduler;
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js"}],"node_modules/xstate/es/registry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registry = void 0;
var children = /*#__PURE__*/new Map();
var sessionIdIndex = 0;
var registry = {
  bookId: function () {
    return "x:".concat(sessionIdIndex++);
  },
  register: function (id, actor) {
    children.set(id, actor);
    return id;
  },
  get: function (id) {
    return children.get(id);
  },
  free: function (id) {
    children.delete(id);
  }
};
exports.registry = registry;
},{}],"node_modules/xstate/es/devTools.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobal = getGlobal;
exports.registerService = registerService;

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return undefined;
}

function getDevTools() {
  var global = getGlobal();

  if (global && '__xstate__' in global) {
    return global.__xstate__;
  }

  return undefined;
}

function registerService(service) {
  if (!getGlobal()) {
    return;
  }

  var devTools = getDevTools();

  if (devTools) {
    devTools.register(service);
  }
}
},{}],"node_modules/xstate/es/interpreter.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InterpreterStatus = exports.Interpreter = void 0;
exports.interpret = interpret;
exports.spawn = spawn;

var _tslib = require("./_virtual/_tslib.js");

var _types = require("./types.js");

var _actionTypes = require("./actionTypes.js");

var _environment = require("./environment.js");

var _utils = require("./utils.js");

var _actions = require("./actions.js");

var _serviceScope = require("./serviceScope.js");

var _Actor = require("./Actor.js");

var _stateUtils = require("./stateUtils.js");

var _State = require("./State.js");

var _scheduler = require("./scheduler.js");

var _registry = require("./registry.js");

var _devTools = require("./devTools.js");

var _behaviors = require("./behaviors.js");

var DEFAULT_SPAWN_OPTIONS = {
  sync: false,
  autoForward: false
};
var InterpreterStatus;
exports.InterpreterStatus = InterpreterStatus;

(function (InterpreterStatus) {
  InterpreterStatus[InterpreterStatus["NotStarted"] = 0] = "NotStarted";
  InterpreterStatus[InterpreterStatus["Running"] = 1] = "Running";
  InterpreterStatus[InterpreterStatus["Stopped"] = 2] = "Stopped";
})(InterpreterStatus || (exports.InterpreterStatus = InterpreterStatus = {}));
/** @ts-ignore [symbolObservable] creates problems for people without `skipLibCheck` who are on older versions of TS, remove this comment when we drop support for TS@<4.3 */


var Interpreter =
/*#__PURE__*/

/** @class */
function () {
  /**
   * Creates a new Interpreter instance (i.e., service) for the given machine with the provided options, if any.
   *
   * @param machine The machine to be interpreted
   * @param options Interpreter options
   */
  function Interpreter(machine, options) {
    var _this = this;

    if (options === void 0) {
      options = Interpreter.defaultOptions;
    }

    this.machine = machine;
    this.scheduler = new _scheduler.Scheduler();
    this.delayedEventsMap = {};
    this.listeners = new Set();
    this.contextListeners = new Set();
    this.stopListeners = new Set();
    this.doneListeners = new Set();
    this.eventListeners = new Set();
    this.sendListeners = new Set();
    /**
     * Whether the service is started.
     */

    this.initialized = false;
    this.status = InterpreterStatus.NotStarted;
    this.children = new Map();
    this.forwardTo = new Set();
    /**
     * Alias for Interpreter.prototype.start
     */

    this.init = this.start;
    /**
     * Sends an event to the running interpreter to trigger a transition.
     *
     * An array of events (batched) can be sent as well, which will send all
     * batched events to the running interpreter. The listeners will be
     * notified only **once** when all events are processed.
     *
     * @param event The event(s) to send
     */

    this.send = function (event, payload) {
      if ((0, _utils.isArray)(event)) {
        _this.batch(event);

        return _this.state;
      }

      var _event = (0, _utils.toSCXMLEvent)((0, _utils.toEventObject)(event, payload));

      if (_this.status === InterpreterStatus.Stopped) {
        // do nothing
        if (!_environment.IS_PRODUCTION) {
          (0, _utils.warn)(false, "Event \"".concat(_event.name, "\" was sent to stopped service \"").concat(_this.machine.id, "\". This service has already reached its final state, and will not transition.\nEvent: ").concat(JSON.stringify(_event.data)));
        }

        return _this.state;
      }

      if (_this.status !== InterpreterStatus.Running && !_this.options.deferEvents) {
        throw new Error("Event \"".concat(_event.name, "\" was sent to uninitialized service \"").concat(_this.machine.id // tslint:disable-next-line:max-line-length
        , "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: ").concat(JSON.stringify(_event.data)));
      }

      _this.scheduler.schedule(function () {
        // Forward copy of event to child actors
        _this.forward(_event);

        var nextState = _this.nextState(_event);

        _this.update(nextState, _event);
      });

      return _this._state; // TODO: deprecate (should return void)
      // tslint:disable-next-line:semicolon
    };

    this.sendTo = function (event, to) {
      var isParent = _this.parent && (to === _types.SpecialTargets.Parent || _this.parent.id === to);
      var target = isParent ? _this.parent : (0, _utils.isString)(to) ? _this.children.get(to) || _registry.registry.get(to) : (0, _utils.isActor)(to) ? to : undefined;

      if (!target) {
        if (!isParent) {
          throw new Error("Unable to send event to child '".concat(to, "' from service '").concat(_this.id, "'."));
        } // tslint:disable-next-line:no-console


        if (!_environment.IS_PRODUCTION) {
          (0, _utils.warn)(false, "Service '".concat(_this.id, "' has no parent: unable to send event ").concat(event.type));
        }

        return;
      }

      if ('machine' in target) {
        // Send SCXML events to machines
        target.send((0, _tslib.__assign)((0, _tslib.__assign)({}, event), {
          name: event.name === _actionTypes.error ? "".concat((0, _actions.error)(_this.id)) : event.name,
          origin: _this.sessionId
        }));
      } else {
        // Send normal events to other targets
        target.send(event.data);
      }
    };

    var resolvedOptions = (0, _tslib.__assign)((0, _tslib.__assign)({}, Interpreter.defaultOptions), options);
    var clock = resolvedOptions.clock,
        logger = resolvedOptions.logger,
        parent = resolvedOptions.parent,
        id = resolvedOptions.id;
    var resolvedId = id !== undefined ? id : machine.id;
    this.id = resolvedId;
    this.logger = logger;
    this.clock = clock;
    this.parent = parent;
    this.options = resolvedOptions;
    this.scheduler = new _scheduler.Scheduler({
      deferEvents: this.options.deferEvents
    });
    this.sessionId = _registry.registry.bookId();
  }

  Object.defineProperty(Interpreter.prototype, "initialState", {
    get: function () {
      var _this = this;

      if (this._initialState) {
        return this._initialState;
      }

      return (0, _serviceScope.provide)(this, function () {
        _this._initialState = _this.machine.initialState;
        return _this._initialState;
      });
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Interpreter.prototype, "state", {
    get: function () {
      if (!_environment.IS_PRODUCTION) {
        (0, _utils.warn)(this.status !== InterpreterStatus.NotStarted, "Attempted to read state from uninitialized service '".concat(this.id, "'. Make sure the service is started first."));
      }

      return this._state;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Executes the actions of the given state, with that state's `context` and `event`.
   *
   * @param state The state whose actions will be executed
   * @param actionsConfig The action implementations to use
   */

  Interpreter.prototype.execute = function (state, actionsConfig) {
    var e_1, _a;

    try {
      for (var _b = (0, _tslib.__values)(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var action = _c.value;
        this.exec(action, state, actionsConfig);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  Interpreter.prototype.update = function (state, _event) {
    var e_2, _a, e_3, _b, e_4, _c, e_5, _d;

    var _this = this; // Attach session ID to state


    state._sessionid = this.sessionId; // Update state

    this._state = state; // Execute actions

    if (this.options.execute) {
      this.execute(this.state);
    } // Update children


    this.children.forEach(function (child) {
      _this.state.children[child.id] = child;
    }); // Dev tools

    if (this.devTools) {
      this.devTools.send(_event.data, state);
    } // Execute listeners


    if (state.event) {
      try {
        for (var _e = (0, _tslib.__values)(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
          var listener = _f.value;
          listener(state.event);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    }

    try {
      for (var _g = (0, _tslib.__values)(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
        var listener = _h.value;
        listener(state, state.event);
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    try {
      for (var _j = (0, _tslib.__values)(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
        var contextListener = _k.value;
        contextListener(this.state.context, this.state.history ? this.state.history.context : undefined);
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    var isDone = (0, _stateUtils.isInFinalState)(state.configuration || [], this.machine);

    if (this.state.configuration && isDone) {
      // get final child state node
      var finalChildStateNode = state.configuration.find(function (sn) {
        return sn.type === 'final' && sn.parent === _this.machine;
      });
      var doneData = finalChildStateNode && finalChildStateNode.doneData ? (0, _utils.mapContext)(finalChildStateNode.doneData, state.context, _event) : undefined;

      try {
        for (var _l = (0, _tslib.__values)(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
          var listener = _m.value;
          listener((0, _actions.doneInvoke)(this.id, doneData));
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
        } finally {
          if (e_5) throw e_5.error;
        }
      }

      this.stop();
    }
  };
  /*
   * Adds a listener that is notified whenever a state transition happens. The listener is called with
   * the next state and the event object that caused the state transition.
   *
   * @param listener The state listener
   */


  Interpreter.prototype.onTransition = function (listener) {
    this.listeners.add(listener); // Send current state to listener

    if (this.status === InterpreterStatus.Running) {
      listener(this.state, this.state.event);
    }

    return this;
  };

  Interpreter.prototype.subscribe = function (nextListenerOrObserver, _, // TODO: error listener
  completeListener) {
    var _this = this;

    if (!nextListenerOrObserver) {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    }

    var listener;
    var resolvedCompleteListener = completeListener;

    if (typeof nextListenerOrObserver === 'function') {
      listener = nextListenerOrObserver;
    } else {
      listener = nextListenerOrObserver.next.bind(nextListenerOrObserver);
      resolvedCompleteListener = nextListenerOrObserver.complete.bind(nextListenerOrObserver);
    }

    this.listeners.add(listener); // Send current state to listener

    if (this.status === InterpreterStatus.Running) {
      listener(this.state);
    }

    if (resolvedCompleteListener) {
      this.onDone(resolvedCompleteListener);
    }

    return {
      unsubscribe: function () {
        listener && _this.listeners.delete(listener);
        resolvedCompleteListener && _this.doneListeners.delete(resolvedCompleteListener);
      }
    };
  };
  /**
   * Adds an event listener that is notified whenever an event is sent to the running interpreter.
   * @param listener The event listener
   */


  Interpreter.prototype.onEvent = function (listener) {
    this.eventListeners.add(listener);
    return this;
  };
  /**
   * Adds an event listener that is notified whenever a `send` event occurs.
   * @param listener The event listener
   */


  Interpreter.prototype.onSend = function (listener) {
    this.sendListeners.add(listener);
    return this;
  };
  /**
   * Adds a context listener that is notified whenever the state context changes.
   * @param listener The context listener
   */


  Interpreter.prototype.onChange = function (listener) {
    this.contextListeners.add(listener);
    return this;
  };
  /**
   * Adds a listener that is notified when the machine is stopped.
   * @param listener The listener
   */


  Interpreter.prototype.onStop = function (listener) {
    this.stopListeners.add(listener);
    return this;
  };
  /**
   * Adds a state listener that is notified when the statechart has reached its final state.
   * @param listener The state listener
   */


  Interpreter.prototype.onDone = function (listener) {
    this.doneListeners.add(listener);
    return this;
  };
  /**
   * Removes a listener.
   * @param listener The listener to remove
   */


  Interpreter.prototype.off = function (listener) {
    this.listeners.delete(listener);
    this.eventListeners.delete(listener);
    this.sendListeners.delete(listener);
    this.stopListeners.delete(listener);
    this.doneListeners.delete(listener);
    this.contextListeners.delete(listener);
    return this;
  };
  /**
   * Starts the interpreter from the given state, or the initial state.
   * @param initialState The state to start the statechart from
   */


  Interpreter.prototype.start = function (initialState) {
    var _this = this;

    if (this.status === InterpreterStatus.Running) {
      // Do not restart the service if it is already started
      return this;
    }

    _registry.registry.register(this.sessionId, this);

    this.initialized = true;
    this.status = InterpreterStatus.Running;
    var resolvedState = initialState === undefined ? this.initialState : (0, _serviceScope.provide)(this, function () {
      return (0, _State.isStateConfig)(initialState) ? _this.machine.resolveState(initialState) : _this.machine.resolveState(_State.State.from(initialState, _this.machine.context));
    });

    if (this.options.devTools) {
      this.attachDev();
    }

    this.scheduler.initialize(function () {
      _this.update(resolvedState, _actions.initEvent);
    });
    return this;
  };
  /**
   * Stops the interpreter and unsubscribe all listeners.
   *
   * This will also notify the `onStop` listeners.
   */


  Interpreter.prototype.stop = function () {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;

    var _this = this;

    try {
      for (var _f = (0, _tslib.__values)(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
        var listener = _g.value;
        this.listeners.delete(listener);
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    try {
      for (var _h = (0, _tslib.__values)(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
        var listener = _j.value; // call listener, then remove

        listener();
        this.stopListeners.delete(listener);
      }
    } catch (e_7_1) {
      e_7 = {
        error: e_7_1
      };
    } finally {
      try {
        if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
      } finally {
        if (e_7) throw e_7.error;
      }
    }

    try {
      for (var _k = (0, _tslib.__values)(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
        var listener = _l.value;
        this.contextListeners.delete(listener);
      }
    } catch (e_8_1) {
      e_8 = {
        error: e_8_1
      };
    } finally {
      try {
        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
      } finally {
        if (e_8) throw e_8.error;
      }
    }

    try {
      for (var _m = (0, _tslib.__values)(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
        var listener = _o.value;
        this.doneListeners.delete(listener);
      }
    } catch (e_9_1) {
      e_9 = {
        error: e_9_1
      };
    } finally {
      try {
        if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
      } finally {
        if (e_9) throw e_9.error;
      }
    }

    if (!this.initialized) {
      // Interpreter already stopped; do nothing
      return this;
    }

    (0, _tslib.__spreadArray)([], (0, _tslib.__read)(this.state.configuration), false).sort(function (a, b) {
      return b.order - a.order;
    }).forEach(function (stateNode) {
      var e_11, _a;

      try {
        for (var _b = (0, _tslib.__values)(stateNode.definition.exit), _c = _b.next(); !_c.done; _c = _b.next()) {
          var action = _c.value;

          _this.exec(action, _this.state);
        }
      } catch (e_11_1) {
        e_11 = {
          error: e_11_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_11) throw e_11.error;
        }
      }
    }); // Stop all children

    this.children.forEach(function (child) {
      if ((0, _utils.isFunction)(child.stop)) {
        child.stop();
      }
    });

    try {
      // Cancel all delayed events
      for (var _p = (0, _tslib.__values)(Object.keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
        var key = _q.value;
        this.clock.clearTimeout(this.delayedEventsMap[key]);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
      } finally {
        if (e_10) throw e_10.error;
      }
    }

    this.scheduler.clear();
    this.initialized = false;
    this.status = InterpreterStatus.Stopped;

    _registry.registry.free(this.sessionId);

    return this;
  };

  Interpreter.prototype.batch = function (events) {
    var _this = this;

    if (this.status === InterpreterStatus.NotStarted && this.options.deferEvents) {
      // tslint:disable-next-line:no-console
      if (!_environment.IS_PRODUCTION) {
        (0, _utils.warn)(false, "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\" and are deferred. Make sure .start() is called for this service.\nEvent: ").concat(JSON.stringify(event)));
      }
    } else if (this.status !== InterpreterStatus.Running) {
      throw new Error( // tslint:disable-next-line:max-line-length
      "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options."));
    }

    this.scheduler.schedule(function () {
      var e_12, _a;

      var nextState = _this.state;
      var batchChanged = false;
      var batchedActions = [];

      var _loop_1 = function (event_1) {
        var _event = (0, _utils.toSCXMLEvent)(event_1);

        _this.forward(_event);

        nextState = (0, _serviceScope.provide)(_this, function () {
          return _this.machine.transition(nextState, _event);
        });
        batchedActions.push.apply(batchedActions, (0, _tslib.__spreadArray)([], (0, _tslib.__read)(nextState.actions.map(function (a) {
          return (0, _State.bindActionToState)(a, nextState);
        })), false));
        batchChanged = batchChanged || !!nextState.changed;
      };

      try {
        for (var events_1 = (0, _tslib.__values)(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
          var event_1 = events_1_1.value;

          _loop_1(event_1);
        }
      } catch (e_12_1) {
        e_12 = {
          error: e_12_1
        };
      } finally {
        try {
          if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
        } finally {
          if (e_12) throw e_12.error;
        }
      }

      nextState.changed = batchChanged;
      nextState.actions = batchedActions;

      _this.update(nextState, (0, _utils.toSCXMLEvent)(events[events.length - 1]));
    });
  };
  /**
   * Returns a send function bound to this interpreter instance.
   *
   * @param event The event to be sent by the sender.
   */


  Interpreter.prototype.sender = function (event) {
    return this.send.bind(this, event);
  };
  /**
   * Returns the next state given the interpreter's current state and the event.
   *
   * This is a pure method that does _not_ update the interpreter's state.
   *
   * @param event The event to determine the next state
   */


  Interpreter.prototype.nextState = function (event) {
    var _this = this;

    var _event = (0, _utils.toSCXMLEvent)(event);

    if (_event.name.indexOf(_actionTypes.errorPlatform) === 0 && !this.state.nextEvents.some(function (nextEvent) {
      return nextEvent.indexOf(_actionTypes.errorPlatform) === 0;
    })) {
      throw _event.data.data;
    }

    var nextState = (0, _serviceScope.provide)(this, function () {
      return _this.machine.transition(_this.state, _event);
    });
    return nextState;
  };

  Interpreter.prototype.forward = function (event) {
    var e_13, _a;

    try {
      for (var _b = (0, _tslib.__values)(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
        var id = _c.value;
        var child = this.children.get(id);

        if (!child) {
          throw new Error("Unable to forward event '".concat(event, "' from interpreter '").concat(this.id, "' to nonexistant child '").concat(id, "'."));
        }

        child.send(event);
      }
    } catch (e_13_1) {
      e_13 = {
        error: e_13_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_13) throw e_13.error;
      }
    }
  };

  Interpreter.prototype.defer = function (sendAction) {
    var _this = this;

    this.delayedEventsMap[sendAction.id] = this.clock.setTimeout(function () {
      if (sendAction.to) {
        _this.sendTo(sendAction._event, sendAction.to);
      } else {
        _this.send(sendAction._event);
      }
    }, sendAction.delay);
  };

  Interpreter.prototype.cancel = function (sendId) {
    this.clock.clearTimeout(this.delayedEventsMap[sendId]);
    delete this.delayedEventsMap[sendId];
  };

  Interpreter.prototype.exec = function (action, state, actionFunctionMap) {
    if (actionFunctionMap === void 0) {
      actionFunctionMap = this.machine.options.actions;
    }

    var context = state.context,
        _event = state._event;
    var actionOrExec = action.exec || (0, _actions.getActionFunction)(action.type, actionFunctionMap);
    var exec = (0, _utils.isFunction)(actionOrExec) ? actionOrExec : actionOrExec ? actionOrExec.exec : action.exec;

    if (exec) {
      try {
        return exec(context, _event.data, {
          action: action,
          state: this.state,
          _event: _event
        });
      } catch (err) {
        if (this.parent) {
          this.parent.send({
            type: 'xstate.error',
            data: err
          });
        }

        throw err;
      }
    }

    switch (action.type) {
      case _actionTypes.send:
        var sendAction = action;

        if (typeof sendAction.delay === 'number') {
          this.defer(sendAction);
          return;
        } else {
          if (sendAction.to) {
            this.sendTo(sendAction._event, sendAction.to);
          } else {
            this.send(sendAction._event);
          }
        }

        break;

      case _actionTypes.cancel:
        this.cancel(action.sendId);
        break;

      case _actionTypes.start:
        {
          if (this.status !== InterpreterStatus.Running) {
            return;
          }

          var activity = action.activity; // If the activity will be stopped right after it's started
          // (such as in transient states)
          // don't bother starting the activity.

          if (!this.state.activities[activity.id || activity.type]) {
            break;
          } // Invoked services


          if (activity.type === _types.ActionTypes.Invoke) {
            var invokeSource = (0, _utils.toInvokeSource)(activity.src);
            var serviceCreator = this.machine.options.services ? this.machine.options.services[invokeSource.type] : undefined;
            var id = activity.id,
                data = activity.data;

            if (!_environment.IS_PRODUCTION) {
              (0, _utils.warn)(!('forward' in activity), // tslint:disable-next-line:max-line-length
              "`forward` property is deprecated (found in invocation of '".concat(activity.src, "' in in machine '").concat(this.machine.id, "'). ") + "Please use `autoForward` instead.");
            }

            var autoForward = 'autoForward' in activity ? activity.autoForward : !!activity.forward;

            if (!serviceCreator) {
              // tslint:disable-next-line:no-console
              if (!_environment.IS_PRODUCTION) {
                (0, _utils.warn)(false, "No service found for invocation '".concat(activity.src, "' in machine '").concat(this.machine.id, "'."));
              }

              return;
            }

            var resolvedData = data ? (0, _utils.mapContext)(data, context, _event) : undefined;

            if (typeof serviceCreator === 'string') {
              // TODO: warn
              return;
            }

            var source = (0, _utils.isFunction)(serviceCreator) ? serviceCreator(context, _event.data, {
              data: resolvedData,
              src: invokeSource,
              meta: activity.meta
            }) : serviceCreator;

            if (!source) {
              // TODO: warn?
              return;
            }

            var options = void 0;

            if ((0, _utils.isMachine)(source)) {
              source = resolvedData ? source.withContext(resolvedData) : source;
              options = {
                autoForward: autoForward
              };
            }

            this.spawn(source, id, options);
          } else {
            this.spawnActivity(activity);
          }

          break;
        }

      case _actionTypes.stop:
        {
          this.stopChild(action.activity.id);
          break;
        }

      case _actionTypes.log:
        var label = action.label,
            value = action.value;

        if (label) {
          this.logger(label, value);
        } else {
          this.logger(value);
        }

        break;

      default:
        if (!_environment.IS_PRODUCTION) {
          (0, _utils.warn)(false, "No implementation found for action type '".concat(action.type, "'"));
        }

        break;
    }

    return undefined;
  };

  Interpreter.prototype.removeChild = function (childId) {
    var _a;

    this.children.delete(childId);
    this.forwardTo.delete(childId); // this.state might not exist at the time this is called,
    // such as when a child is added then removed while initializing the state

    (_a = this.state) === null || _a === void 0 ? true : delete _a.children[childId];
  };

  Interpreter.prototype.stopChild = function (childId) {
    var child = this.children.get(childId);

    if (!child) {
      return;
    }

    this.removeChild(childId);

    if ((0, _utils.isFunction)(child.stop)) {
      child.stop();
    }
  };

  Interpreter.prototype.spawn = function (entity, name, options) {
    if ((0, _utils.isPromiseLike)(entity)) {
      return this.spawnPromise(Promise.resolve(entity), name);
    } else if ((0, _utils.isFunction)(entity)) {
      return this.spawnCallback(entity, name);
    } else if ((0, _Actor.isSpawnedActor)(entity)) {
      return this.spawnActor(entity, name);
    } else if ((0, _utils.isObservable)(entity)) {
      return this.spawnObservable(entity, name);
    } else if ((0, _utils.isMachine)(entity)) {
      return this.spawnMachine(entity, (0, _tslib.__assign)((0, _tslib.__assign)({}, options), {
        id: name
      }));
    } else if ((0, _utils.isBehavior)(entity)) {
      return this.spawnBehavior(entity, name);
    } else {
      throw new Error("Unable to spawn entity \"".concat(name, "\" of type \"").concat(typeof entity, "\"."));
    }
  };

  Interpreter.prototype.spawnMachine = function (machine, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var childService = new Interpreter(machine, (0, _tslib.__assign)((0, _tslib.__assign)({}, this.options), {
      parent: this,
      id: options.id || machine.id
    }));
    var resolvedOptions = (0, _tslib.__assign)((0, _tslib.__assign)({}, DEFAULT_SPAWN_OPTIONS), options);

    if (resolvedOptions.sync) {
      childService.onTransition(function (state) {
        _this.send(_actionTypes.update, {
          state: state,
          id: childService.id
        });
      });
    }

    var actor = childService;
    this.children.set(childService.id, actor);

    if (resolvedOptions.autoForward) {
      this.forwardTo.add(childService.id);
    }

    childService.onDone(function (doneEvent) {
      _this.removeChild(childService.id);

      _this.send((0, _utils.toSCXMLEvent)(doneEvent, {
        origin: childService.id
      }));
    }).start();
    return actor;
  };

  Interpreter.prototype.spawnBehavior = function (behavior, id) {
    var actorRef = (0, _behaviors.spawnBehavior)(behavior, {
      id: id,
      parent: this
    });
    this.children.set(id, actorRef);
    return actorRef;
  };

  Interpreter.prototype.spawnPromise = function (promise, id) {
    var _a;

    var _this = this;

    var canceled = false;
    var resolvedData;
    promise.then(function (response) {
      if (!canceled) {
        resolvedData = response;

        _this.removeChild(id);

        _this.send((0, _utils.toSCXMLEvent)((0, _actions.doneInvoke)(id, response), {
          origin: id
        }));
      }
    }, function (errorData) {
      if (!canceled) {
        _this.removeChild(id);

        var errorEvent = (0, _actions.error)(id, errorData);

        try {
          // Send "error.platform.id" to this (parent).
          _this.send((0, _utils.toSCXMLEvent)(errorEvent, {
            origin: id
          }));
        } catch (error) {
          (0, _utils.reportUnhandledExceptionOnInvocation)(errorData, error, id);

          if (_this.devTools) {
            _this.devTools.send(errorEvent, _this.state);
          }

          if (_this.machine.strict) {
            // it would be better to always stop the state machine if unhandled
            // exception/promise rejection happens but because we don't want to
            // break existing code so enforce it on strict mode only especially so
            // because documentation says that onError is optional
            _this.stop();
          }
        }
      }
    });
    var actor = (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function (next, handleError, complete) {
        var observer = (0, _utils.toObserver)(next, handleError, complete);
        var unsubscribed = false;
        promise.then(function (response) {
          if (unsubscribed) {
            return;
          }

          observer.next(response);

          if (unsubscribed) {
            return;
          }

          observer.complete();
        }, function (err) {
          if (unsubscribed) {
            return;
          }

          observer.error(err);
        });
        return {
          unsubscribe: function () {
            return unsubscribed = true;
          }
        };
      },
      stop: function () {
        canceled = true;
      },
      toJSON: function () {
        return {
          id: id
        };
      },
      getSnapshot: function () {
        return resolvedData;
      }
    }, _a[_utils.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnCallback = function (callback, id) {
    var _a;

    var _this = this;

    var canceled = false;
    var receivers = new Set();
    var listeners = new Set();
    var emitted;

    var receive = function (e) {
      emitted = e;
      listeners.forEach(function (listener) {
        return listener(e);
      });

      if (canceled) {
        return;
      }

      _this.send((0, _utils.toSCXMLEvent)(e, {
        origin: id
      }));
    };

    var callbackStop;

    try {
      callbackStop = callback(receive, function (newListener) {
        receivers.add(newListener);
      });
    } catch (err) {
      this.send((0, _actions.error)(id, err));
    }

    if ((0, _utils.isPromiseLike)(callbackStop)) {
      // it turned out to be an async function, can't reliably check this before calling `callback`
      // because transpiled async functions are not recognizable
      return this.spawnPromise(callbackStop, id);
    }

    var actor = (_a = {
      id: id,
      send: function (event) {
        return receivers.forEach(function (receiver) {
          return receiver(event);
        });
      },
      subscribe: function (next) {
        var observer = (0, _utils.toObserver)(next);
        listeners.add(observer.next);
        return {
          unsubscribe: function () {
            listeners.delete(observer.next);
          }
        };
      },
      stop: function () {
        canceled = true;

        if ((0, _utils.isFunction)(callbackStop)) {
          callbackStop();
        }
      },
      toJSON: function () {
        return {
          id: id
        };
      },
      getSnapshot: function () {
        return emitted;
      }
    }, _a[_utils.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnObservable = function (source, id) {
    var _a;

    var _this = this;

    var emitted;
    var subscription = source.subscribe(function (value) {
      emitted = value;

      _this.send((0, _utils.toSCXMLEvent)(value, {
        origin: id
      }));
    }, function (err) {
      _this.removeChild(id);

      _this.send((0, _utils.toSCXMLEvent)((0, _actions.error)(id, err), {
        origin: id
      }));
    }, function () {
      _this.removeChild(id);

      _this.send((0, _utils.toSCXMLEvent)((0, _actions.doneInvoke)(id), {
        origin: id
      }));
    });
    var actor = (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function (next, handleError, complete) {
        return source.subscribe(next, handleError, complete);
      },
      stop: function () {
        return subscription.unsubscribe();
      },
      getSnapshot: function () {
        return emitted;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[_utils.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnActor = function (actor, name) {
    this.children.set(name, actor);
    return actor;
  };

  Interpreter.prototype.spawnActivity = function (activity) {
    var implementation = this.machine.options && this.machine.options.activities ? this.machine.options.activities[activity.type] : undefined;

    if (!implementation) {
      if (!_environment.IS_PRODUCTION) {
        (0, _utils.warn)(false, "No implementation found for activity '".concat(activity.type, "'"));
      } // tslint:disable-next-line:no-console


      return;
    } // Start implementation


    var dispose = implementation(this.state.context, activity);
    this.spawnEffect(activity.id, dispose);
  };

  Interpreter.prototype.spawnEffect = function (id, dispose) {
    var _a;

    this.children.set(id, (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function () {
        return {
          unsubscribe: function () {
            return void 0;
          }
        };
      },
      stop: dispose || undefined,
      getSnapshot: function () {
        return undefined;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[_utils.symbolObservable] = function () {
      return this;
    }, _a));
  };

  Interpreter.prototype.attachDev = function () {
    var global = (0, _devTools.getGlobal)();

    if (this.options.devTools && global) {
      if (global.__REDUX_DEVTOOLS_EXTENSION__) {
        var devToolsOptions = typeof this.options.devTools === 'object' ? this.options.devTools : undefined;
        this.devTools = global.__REDUX_DEVTOOLS_EXTENSION__.connect((0, _tslib.__assign)((0, _tslib.__assign)({
          name: this.id,
          autoPause: true,
          stateSanitizer: function (state) {
            return {
              value: state.value,
              context: state.context,
              actions: state.actions
            };
          }
        }, devToolsOptions), {
          features: (0, _tslib.__assign)({
            jump: false,
            skip: false
          }, devToolsOptions ? devToolsOptions.features : undefined)
        }), this.machine);
        this.devTools.init(this.state);
      } // add XState-specific dev tooling hook


      (0, _devTools.registerService)(this);
    }
  };

  Interpreter.prototype.toJSON = function () {
    return {
      id: this.id
    };
  };
  /** @ts-ignore this creates problems for people without `skipLibCheck` who are on older versions of TS, remove this comment when we drop support for TS@<4.3 */


  Interpreter.prototype[_utils.symbolObservable] = function () {
    return this;
  };

  Interpreter.prototype.getSnapshot = function () {
    if (this.status === InterpreterStatus.NotStarted) {
      return this.initialState;
    }

    return this._state;
  };
  /**
   * The default interpreter options:
   *
   * - `clock` uses the global `setTimeout` and `clearTimeout` functions
   * - `logger` uses the global `console.log()` method
   */


  Interpreter.defaultOptions = /*#__PURE__*/function (global) {
    return {
      execute: true,
      deferEvents: true,
      clock: {
        setTimeout: function (fn, ms) {
          return setTimeout(fn, ms);
        },
        clearTimeout: function (id) {
          return clearTimeout(id);
        }
      },
      logger: global.console.log.bind(console),
      devTools: false
    };
  }(typeof self !== 'undefined' ? self : global);

  Interpreter.interpret = interpret;
  return Interpreter;
}();

exports.Interpreter = Interpreter;

var resolveSpawnOptions = function (nameOrOptions) {
  if ((0, _utils.isString)(nameOrOptions)) {
    return (0, _tslib.__assign)((0, _tslib.__assign)({}, DEFAULT_SPAWN_OPTIONS), {
      name: nameOrOptions
    });
  }

  return (0, _tslib.__assign)((0, _tslib.__assign)((0, _tslib.__assign)({}, DEFAULT_SPAWN_OPTIONS), {
    name: (0, _utils.uniqueId)()
  }), nameOrOptions);
};

function spawn(entity, nameOrOptions) {
  var resolvedOptions = resolveSpawnOptions(nameOrOptions);
  return (0, _serviceScope.consume)(function (service) {
    if (!_environment.IS_PRODUCTION) {
      var isLazyEntity = (0, _utils.isMachine)(entity) || (0, _utils.isFunction)(entity);
      (0, _utils.warn)(!!service || isLazyEntity, "Attempted to spawn an Actor (ID: \"".concat((0, _utils.isMachine)(entity) ? entity.id : 'undefined', "\") outside of a service. This will have no effect."));
    }

    if (service) {
      return service.spawn(entity, resolvedOptions.name, resolvedOptions);
    } else {
      return (0, _Actor.createDeferredActor)(entity, resolvedOptions.name);
    }
  });
}
/**
 * Creates a new Interpreter instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to interpret
 * @param options Interpreter options
 */


function interpret(machine, options) {
  var interpreter = new Interpreter(machine, options);
  return interpreter;
}
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./types.js":"node_modules/xstate/es/types.js","./actionTypes.js":"node_modules/xstate/es/actionTypes.js","./environment.js":"node_modules/xstate/es/environment.js","./utils.js":"node_modules/xstate/es/utils.js","./actions.js":"node_modules/xstate/es/actions.js","./serviceScope.js":"node_modules/xstate/es/serviceScope.js","./Actor.js":"node_modules/xstate/es/Actor.js","./stateUtils.js":"node_modules/xstate/es/stateUtils.js","./State.js":"node_modules/xstate/es/State.js","./scheduler.js":"node_modules/xstate/es/scheduler.js","./registry.js":"node_modules/xstate/es/registry.js","./devTools.js":"node_modules/xstate/es/devTools.js","./behaviors.js":"node_modules/xstate/es/behaviors.js"}],"node_modules/xstate/es/invokeUtils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toInvokeDefinition = toInvokeDefinition;
exports.toInvokeSource = toInvokeSource;

var _tslib = require("./_virtual/_tslib.js");

require("./types.js");

var _actionTypes = require("./actionTypes.js");

require("./environment.js");

require("./utils.js");

function toInvokeSource(src) {
  if (typeof src === 'string') {
    var simpleSrc = {
      type: src
    };

    simpleSrc.toString = function () {
      return src;
    }; // v4 compat - TODO: remove in v5


    return simpleSrc;
  }

  return src;
}

function toInvokeDefinition(invokeConfig) {
  return (0, _tslib.__assign)((0, _tslib.__assign)({
    type: _actionTypes.invoke
  }, invokeConfig), {
    toJSON: function () {
      var onDone = invokeConfig.onDone,
          onError = invokeConfig.onError,
          invokeDef = (0, _tslib.__rest)(invokeConfig, ["onDone", "onError"]);
      return (0, _tslib.__assign)((0, _tslib.__assign)({}, invokeDef), {
        type: _actionTypes.invoke,
        src: toInvokeSource(invokeConfig.src)
      });
    }
  });
}
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./types.js":"node_modules/xstate/es/types.js","./actionTypes.js":"node_modules/xstate/es/actionTypes.js","./environment.js":"node_modules/xstate/es/environment.js","./utils.js":"node_modules/xstate/es/utils.js"}],"node_modules/xstate/es/StateNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StateNode = void 0;

var _tslib = require("./_virtual/_tslib.js");

var _types = require("./types.js");

var _actionTypes = require("./actionTypes.js");

var _constants = require("./constants.js");

var _environment = require("./environment.js");

var _utils = require("./utils.js");

var _actions = require("./actions.js");

var _Actor = require("./Actor.js");

var _stateUtils = require("./stateUtils.js");

var _State = require("./State.js");

var _invokeUtils = require("./invokeUtils.js");

var NULL_EVENT = '';
var STATE_IDENTIFIER = '#';
var WILDCARD = '*';
var EMPTY_OBJECT = {};

var isStateId = function (str) {
  return str[0] === STATE_IDENTIFIER;
};

var createDefaultOptions = function () {
  return {
    actions: {},
    guards: {},
    services: {},
    activities: {},
    delays: {}
  };
};

var validateArrayifiedTransitions = function (stateNode, event, transitions) {
  var hasNonLastUnguardedTarget = transitions.slice(0, -1).some(function (transition) {
    return !('cond' in transition) && !('in' in transition) && ((0, _utils.isString)(transition.target) || (0, _utils.isMachine)(transition.target));
  });
  var eventText = event === NULL_EVENT ? 'the transient event' : "event '".concat(event, "'");
  (0, _utils.warn)(!hasNonLastUnguardedTarget, "One or more transitions for ".concat(eventText, " on state '").concat(stateNode.id, "' are unreachable. ") + "Make sure that the default transition is the last one defined.");
};

var StateNode =
/*#__PURE__*/

/** @class */
function () {
  function StateNode(
  /**
   * The raw config used to create the machine.
   */
  config, options,
  /**
   * The initial extended state
   */
  _context, // TODO: this is unsafe, but we're removing it in v5 anyway
  _stateInfo) {
    var _this = this;

    if (_context === void 0) {
      _context = 'context' in config ? config.context : undefined;
    }

    var _a;

    this.config = config;
    this._context = _context;
    /**
     * The order this state node appears. Corresponds to the implicit SCXML document order.
     */

    this.order = -1;
    this.__xstatenode = true;
    this.__cache = {
      events: undefined,
      relativeValue: new Map(),
      initialStateValue: undefined,
      initialState: undefined,
      on: undefined,
      transitions: undefined,
      candidates: {},
      delayedTransitions: undefined
    };
    this.idMap = {};
    this.tags = [];
    this.options = Object.assign(createDefaultOptions(), options);
    this.parent = _stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.parent;
    this.key = this.config.key || (_stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.key) || this.config.id || '(machine)';
    this.machine = this.parent ? this.parent.machine : this;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.delimiter = this.config.delimiter || (this.parent ? this.parent.delimiter : _constants.STATE_DELIMITER);
    this.id = this.config.id || (0, _tslib.__spreadArray)([this.machine.key], (0, _tslib.__read)(this.path), false).join(this.delimiter);
    this.version = this.parent ? this.parent.version : this.config.version;
    this.type = this.config.type || (this.config.parallel ? 'parallel' : this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
    this.schema = this.parent ? this.machine.schema : (_a = this.config.schema) !== null && _a !== void 0 ? _a : {};
    this.description = this.config.description;

    if (!_environment.IS_PRODUCTION) {
      (0, _utils.warn)(!('parallel' in this.config), "The \"parallel\" property is deprecated and will be removed in version 4.1. ".concat(this.config.parallel ? "Replace with `type: 'parallel'`" : "Use `type: '".concat(this.type, "'`"), " in the config for state node '").concat(this.id, "' instead."));
    }

    this.initial = this.config.initial;
    this.states = this.config.states ? (0, _utils.mapValues)(this.config.states, function (stateConfig, key) {
      var _a;

      var stateNode = new StateNode(stateConfig, {}, undefined, {
        parent: _this,
        key: key
      });
      Object.assign(_this.idMap, (0, _tslib.__assign)((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
      return stateNode;
    }) : EMPTY_OBJECT; // Document order

    var order = 0;

    function dfs(stateNode) {
      var e_1, _a;

      stateNode.order = order++;

      try {
        for (var _b = (0, _tslib.__values)((0, _stateUtils.getChildren)(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var child = _c.value;
          dfs(child);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    dfs(this); // History config

    this.history = this.config.history === true ? 'shallow' : this.config.history || false;
    this._transient = !!this.config.always || (!this.config.on ? false : Array.isArray(this.config.on) ? this.config.on.some(function (_a) {
      var event = _a.event;
      return event === NULL_EVENT;
    }) : NULL_EVENT in this.config.on);
    this.strict = !!this.config.strict; // TODO: deprecate (entry)

    this.onEntry = (0, _utils.toArray)(this.config.entry || this.config.onEntry).map(function (action) {
      return (0, _actions.toActionObject)(action);
    }); // TODO: deprecate (exit)

    this.onExit = (0, _utils.toArray)(this.config.exit || this.config.onExit).map(function (action) {
      return (0, _actions.toActionObject)(action);
    });
    this.meta = this.config.meta;
    this.doneData = this.type === 'final' ? this.config.data : undefined;
    this.invoke = (0, _utils.toArray)(this.config.invoke).map(function (invokeConfig, i) {
      var _a, _b;

      if ((0, _utils.isMachine)(invokeConfig)) {
        var invokeId = (0, _utils.createInvokeId)(_this.id, i);
        _this.machine.options.services = (0, _tslib.__assign)((_a = {}, _a[invokeId] = invokeConfig, _a), _this.machine.options.services);
        return (0, _invokeUtils.toInvokeDefinition)({
          src: invokeId,
          id: invokeId
        });
      } else if ((0, _utils.isString)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0, _utils.createInvokeId)(_this.id, i);
        return (0, _invokeUtils.toInvokeDefinition)((0, _tslib.__assign)((0, _tslib.__assign)({}, invokeConfig), {
          id: invokeId,
          src: invokeConfig.src
        }));
      } else if ((0, _utils.isMachine)(invokeConfig.src) || (0, _utils.isFunction)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0, _utils.createInvokeId)(_this.id, i);
        _this.machine.options.services = (0, _tslib.__assign)((_b = {}, _b[invokeId] = invokeConfig.src, _b), _this.machine.options.services);
        return (0, _invokeUtils.toInvokeDefinition)((0, _tslib.__assign)((0, _tslib.__assign)({
          id: invokeId
        }, invokeConfig), {
          src: invokeId
        }));
      } else {
        var invokeSource = invokeConfig.src;
        return (0, _invokeUtils.toInvokeDefinition)((0, _tslib.__assign)((0, _tslib.__assign)({
          id: (0, _utils.createInvokeId)(_this.id, i)
        }, invokeConfig), {
          src: invokeSource
        }));
      }
    });
    this.activities = (0, _utils.toArray)(this.config.activities).concat(this.invoke).map(function (activity) {
      return (0, _actions.toActivityDefinition)(activity);
    });
    this.transition = this.transition.bind(this);
    this.tags = (0, _utils.toArray)(this.config.tags); // TODO: this is the real fix for initialization once
    // state node getters are deprecated
    // if (!this.parent) {
    //   this._init();
    // }
  }

  StateNode.prototype._init = function () {
    if (this.__cache.transitions) {
      return;
    }

    (0, _stateUtils.getAllStateNodes)(this).forEach(function (stateNode) {
      return stateNode.on;
    });
  };
  /**
   * Clones this state machine with custom options and context.
   *
   * @param options Options (actions, guards, activities, services) to recursively merge with the existing options.
   * @param context Custom context (will override predefined context)
   */


  StateNode.prototype.withConfig = function (options, context) {
    var _a = this.options,
        actions = _a.actions,
        activities = _a.activities,
        guards = _a.guards,
        services = _a.services,
        delays = _a.delays;
    return new StateNode(this.config, {
      actions: (0, _tslib.__assign)((0, _tslib.__assign)({}, actions), options.actions),
      activities: (0, _tslib.__assign)((0, _tslib.__assign)({}, activities), options.activities),
      guards: (0, _tslib.__assign)((0, _tslib.__assign)({}, guards), options.guards),
      services: (0, _tslib.__assign)((0, _tslib.__assign)({}, services), options.services),
      delays: (0, _tslib.__assign)((0, _tslib.__assign)({}, delays), options.delays)
    }, context !== null && context !== void 0 ? context : this.context);
  };
  /**
   * Clones this state machine with custom context.
   *
   * @param context Custom context (will override predefined context, not recursive)
   */


  StateNode.prototype.withContext = function (context) {
    return new StateNode(this.config, this.options, context);
  };

  Object.defineProperty(StateNode.prototype, "context", {
    get: function () {
      return (0, _utils.isFunction)(this._context) ? this._context() : this._context;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "definition", {
    /**
     * The well-structured state node definition.
     */
    get: function () {
      return {
        id: this.id,
        key: this.key,
        version: this.version,
        context: this.context,
        type: this.type,
        initial: this.initial,
        history: this.history,
        states: (0, _utils.mapValues)(this.states, function (state) {
          return state.definition;
        }),
        on: this.on,
        transitions: this.transitions,
        entry: this.onEntry,
        exit: this.onExit,
        activities: this.activities || [],
        meta: this.meta,
        order: this.order || -1,
        data: this.doneData,
        invoke: this.invoke,
        description: this.description,
        tags: this.tags
      };
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.toJSON = function () {
    return this.definition;
  };

  Object.defineProperty(StateNode.prototype, "on", {
    /**
     * The mapping of events to transitions.
     */
    get: function () {
      if (this.__cache.on) {
        return this.__cache.on;
      }

      var transitions = this.transitions;
      return this.__cache.on = transitions.reduce(function (map, transition) {
        map[transition.eventType] = map[transition.eventType] || [];
        map[transition.eventType].push(transition);
        return map;
      }, {});
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "after", {
    get: function () {
      return this.__cache.delayedTransitions || (this.__cache.delayedTransitions = this.getDelayedTransitions(), this.__cache.delayedTransitions);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "transitions", {
    /**
     * All the transitions that can be taken from this state node.
     */
    get: function () {
      return this.__cache.transitions || (this.__cache.transitions = this.formatTransitions(), this.__cache.transitions);
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.getCandidates = function (eventName) {
    if (this.__cache.candidates[eventName]) {
      return this.__cache.candidates[eventName];
    }

    var transient = eventName === NULL_EVENT;
    var candidates = this.transitions.filter(function (transition) {
      var sameEventType = transition.eventType === eventName; // null events should only match against eventless transitions

      return transient ? sameEventType : sameEventType || transition.eventType === WILDCARD;
    });
    this.__cache.candidates[eventName] = candidates;
    return candidates;
  };
  /**
   * All delayed transitions from the config.
   */


  StateNode.prototype.getDelayedTransitions = function () {
    var _this = this;

    var afterConfig = this.config.after;

    if (!afterConfig) {
      return [];
    }

    var mutateEntryExit = function (delay, i) {
      var delayRef = (0, _utils.isFunction)(delay) ? "".concat(_this.id, ":delay[").concat(i, "]") : delay;
      var eventType = (0, _actions.after)(delayRef, _this.id);

      _this.onEntry.push((0, _actions.send)(eventType, {
        delay: delay
      }));

      _this.onExit.push((0, _actions.cancel)(eventType));

      return eventType;
    };

    var delayedTransitions = (0, _utils.isArray)(afterConfig) ? afterConfig.map(function (transition, i) {
      var eventType = mutateEntryExit(transition.delay, i);
      return (0, _tslib.__assign)((0, _tslib.__assign)({}, transition), {
        event: eventType
      });
    }) : (0, _utils.flatten)(Object.keys(afterConfig).map(function (delay, i) {
      var configTransition = afterConfig[delay];
      var resolvedTransition = (0, _utils.isString)(configTransition) ? {
        target: configTransition
      } : configTransition;
      var resolvedDelay = !isNaN(+delay) ? +delay : delay;
      var eventType = mutateEntryExit(resolvedDelay, i);
      return (0, _utils.toArray)(resolvedTransition).map(function (transition) {
        return (0, _tslib.__assign)((0, _tslib.__assign)({}, transition), {
          event: eventType,
          delay: resolvedDelay
        });
      });
    }));
    return delayedTransitions.map(function (delayedTransition) {
      var delay = delayedTransition.delay;
      return (0, _tslib.__assign)((0, _tslib.__assign)({}, _this.formatTransition(delayedTransition)), {
        delay: delay
      });
    });
  };
  /**
   * Returns the state nodes represented by the current state value.
   *
   * @param state The state value or State instance
   */


  StateNode.prototype.getStateNodes = function (state) {
    var _a;

    var _this = this;

    if (!state) {
      return [];
    }

    var stateValue = state instanceof _State.State ? state.value : (0, _utils.toStateValue)(state, this.delimiter);

    if ((0, _utils.isString)(stateValue)) {
      var initialStateValue = this.getStateNode(stateValue).initial;
      return initialStateValue !== undefined ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a)) : [this, this.states[stateValue]];
    }

    var subStateKeys = Object.keys(stateValue);
    var subStateNodes = [this];
    subStateNodes.push.apply(subStateNodes, (0, _tslib.__spreadArray)([], (0, _tslib.__read)((0, _utils.flatten)(subStateKeys.map(function (subStateKey) {
      return _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
    }))), false));
    return subStateNodes;
  };
  /**
   * Returns `true` if this state node explicitly handles the given event.
   *
   * @param event The event in question
   */


  StateNode.prototype.handles = function (event) {
    var eventType = (0, _utils.getEventType)(event);
    return this.events.includes(eventType);
  };
  /**
   * Resolves the given `state` to a new `State` instance relative to this machine.
   *
   * This ensures that `.events` and `.nextEvents` represent the correct values.
   *
   * @param state The state to resolve
   */


  StateNode.prototype.resolveState = function (state) {
    var stateFromConfig = state instanceof _State.State ? state : _State.State.create(state);
    var configuration = Array.from((0, _stateUtils.getConfiguration)([], this.getStateNodes(stateFromConfig.value)));
    return new _State.State((0, _tslib.__assign)((0, _tslib.__assign)({}, stateFromConfig), {
      value: this.resolve(stateFromConfig.value),
      configuration: configuration,
      done: (0, _stateUtils.isInFinalState)(configuration, this),
      tags: (0, _stateUtils.getTagsFromConfiguration)(configuration)
    }));
  };

  StateNode.prototype.transitionLeafNode = function (stateValue, state, _event) {
    var stateNode = this.getStateNode(stateValue);
    var next = stateNode.next(state, _event);

    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }

    return next;
  };

  StateNode.prototype.transitionCompoundNode = function (stateValue, state, _event) {
    var subStateKeys = Object.keys(stateValue);
    var stateNode = this.getStateNode(subStateKeys[0]);

    var next = stateNode._transition(stateValue[subStateKeys[0]], state, _event);

    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }

    return next;
  };

  StateNode.prototype.transitionParallelNode = function (stateValue, state, _event) {
    var e_2, _a;

    var transitionMap = {};

    try {
      for (var _b = (0, _tslib.__values)(Object.keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var subStateKey = _c.value;
        var subStateValue = stateValue[subStateKey];

        if (!subStateValue) {
          continue;
        }

        var subStateNode = this.getStateNode(subStateKey);

        var next = subStateNode._transition(subStateValue, state, _event);

        if (next) {
          transitionMap[subStateKey] = next;
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    var stateTransitions = Object.keys(transitionMap).map(function (key) {
      return transitionMap[key];
    });
    var enabledTransitions = (0, _utils.flatten)(stateTransitions.map(function (st) {
      return st.transitions;
    }));
    var willTransition = stateTransitions.some(function (st) {
      return st.transitions.length > 0;
    });

    if (!willTransition) {
      return this.next(state, _event);
    }

    var entryNodes = (0, _utils.flatten)(stateTransitions.map(function (t) {
      return t.entrySet;
    }));
    var configuration = (0, _utils.flatten)(Object.keys(transitionMap).map(function (key) {
      return transitionMap[key].configuration;
    }));
    return {
      transitions: enabledTransitions,
      entrySet: entryNodes,
      exitSet: (0, _utils.flatten)(stateTransitions.map(function (t) {
        return t.exitSet;
      })),
      configuration: configuration,
      source: state,
      actions: (0, _utils.flatten)(Object.keys(transitionMap).map(function (key) {
        return transitionMap[key].actions;
      }))
    };
  };

  StateNode.prototype._transition = function (stateValue, state, _event) {
    // leaf node
    if ((0, _utils.isString)(stateValue)) {
      return this.transitionLeafNode(stateValue, state, _event);
    } // hierarchical node


    if (Object.keys(stateValue).length === 1) {
      return this.transitionCompoundNode(stateValue, state, _event);
    } // orthogonal node


    return this.transitionParallelNode(stateValue, state, _event);
  };

  StateNode.prototype.getTransitionData = function (state, event) {
    return this._transition(state.value, state, (0, _utils.toSCXMLEvent)(event));
  };

  StateNode.prototype.next = function (state, _event) {
    var e_3, _a;

    var _this = this;

    var eventName = _event.name;
    var actions = [];
    var nextStateNodes = [];
    var selectedTransition;

    try {
      for (var _b = (0, _tslib.__values)(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var candidate = _c.value;
        var cond = candidate.cond,
            stateIn = candidate.in;
        var resolvedContext = state.context;
        var isInState = stateIn ? (0, _utils.isString)(stateIn) && isStateId(stateIn) ? // Check if in state by ID
        state.matches((0, _utils.toStateValue)(this.getStateNodeById(stateIn).path, this.delimiter)) : // Check if in state by relative grandparent
        (0, _utils.matchesState)((0, _utils.toStateValue)(stateIn, this.delimiter), (0, _utils.path)(this.path.slice(0, -2))(state.value)) : true;
        var guardPassed = false;

        try {
          guardPassed = !cond || (0, _utils.evaluateGuard)(this.machine, cond, resolvedContext, _event, state);
        } catch (err) {
          throw new Error("Unable to evaluate guard '".concat(cond.name || cond.type, "' in transition for event '").concat(eventName, "' in state node '").concat(this.id, "':\n").concat(err.message));
        }

        if (guardPassed && isInState) {
          if (candidate.target !== undefined) {
            nextStateNodes = candidate.target;
          }

          actions.push.apply(actions, (0, _tslib.__spreadArray)([], (0, _tslib.__read)(candidate.actions), false));
          selectedTransition = candidate;
          break;
        }
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    if (!selectedTransition) {
      return undefined;
    }

    if (!nextStateNodes.length) {
      return {
        transitions: [selectedTransition],
        entrySet: [],
        exitSet: [],
        configuration: state.value ? [this] : [],
        source: state,
        actions: actions
      };
    }

    var allNextStateNodes = (0, _utils.flatten)(nextStateNodes.map(function (stateNode) {
      return _this.getRelativeStateNodes(stateNode, state.historyValue);
    }));
    var isInternal = !!selectedTransition.internal;
    var reentryNodes = isInternal ? [] : (0, _utils.flatten)(allNextStateNodes.map(function (n) {
      return _this.nodesFromChild(n);
    }));
    return {
      transitions: [selectedTransition],
      entrySet: reentryNodes,
      exitSet: isInternal ? [] : [this],
      configuration: allNextStateNodes,
      source: state,
      actions: actions
    };
  };

  StateNode.prototype.nodesFromChild = function (childStateNode) {
    if (childStateNode.escapes(this)) {
      return [];
    }

    var nodes = [];
    var marker = childStateNode;

    while (marker && marker !== this) {
      nodes.push(marker);
      marker = marker.parent;
    }

    nodes.push(this); // inclusive

    return nodes;
  };
  /**
   * Whether the given state node "escapes" this state node. If the `stateNode` is equal to or the parent of
   * this state node, it does not escape.
   */


  StateNode.prototype.escapes = function (stateNode) {
    if (this === stateNode) {
      return false;
    }

    var parent = this.parent;

    while (parent) {
      if (parent === stateNode) {
        return false;
      }

      parent = parent.parent;
    }

    return true;
  };

  StateNode.prototype.getActions = function (transition, currentContext, _event, prevState) {
    var e_4, _a, e_5, _b;

    var prevConfig = (0, _stateUtils.getConfiguration)([], prevState ? this.getStateNodes(prevState.value) : [this]);
    var resolvedConfig = transition.configuration.length ? (0, _stateUtils.getConfiguration)(prevConfig, transition.configuration) : prevConfig;

    try {
      for (var resolvedConfig_1 = (0, _tslib.__values)(resolvedConfig), resolvedConfig_1_1 = resolvedConfig_1.next(); !resolvedConfig_1_1.done; resolvedConfig_1_1 = resolvedConfig_1.next()) {
        var sn = resolvedConfig_1_1.value;

        if (!(0, _stateUtils.has)(prevConfig, sn)) {
          transition.entrySet.push(sn);
        }
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (resolvedConfig_1_1 && !resolvedConfig_1_1.done && (_a = resolvedConfig_1.return)) _a.call(resolvedConfig_1);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    try {
      for (var prevConfig_1 = (0, _tslib.__values)(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
        var sn = prevConfig_1_1.value;

        if (!(0, _stateUtils.has)(resolvedConfig, sn) || (0, _stateUtils.has)(transition.exitSet, sn.parent)) {
          transition.exitSet.push(sn);
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (prevConfig_1_1 && !prevConfig_1_1.done && (_b = prevConfig_1.return)) _b.call(prevConfig_1);
      } finally {
        if (e_5) throw e_5.error;
      }
    }

    var doneEvents = (0, _utils.flatten)(transition.entrySet.map(function (sn) {
      var events = [];

      if (sn.type !== 'final') {
        return events;
      }

      var parent = sn.parent;

      if (!parent.parent) {
        return events;
      }

      events.push((0, _actions.done)(sn.id, sn.doneData), // TODO: deprecate - final states should not emit done events for their own state.
      (0, _actions.done)(parent.id, sn.doneData ? (0, _utils.mapContext)(sn.doneData, currentContext, _event) : undefined));
      var grandparent = parent.parent;

      if (grandparent.type === 'parallel') {
        if ((0, _stateUtils.getChildren)(grandparent).every(function (parentNode) {
          return (0, _stateUtils.isInFinalState)(transition.configuration, parentNode);
        })) {
          events.push((0, _actions.done)(grandparent.id));
        }
      }

      return events;
    }));
    transition.exitSet.sort(function (a, b) {
      return b.order - a.order;
    });
    transition.entrySet.sort(function (a, b) {
      return a.order - b.order;
    });
    var entryStates = new Set(transition.entrySet);
    var exitStates = new Set(transition.exitSet);

    var _c = (0, _tslib.__read)([(0, _utils.flatten)(Array.from(entryStates).map(function (stateNode) {
      return (0, _tslib.__spreadArray)((0, _tslib.__spreadArray)([], (0, _tslib.__read)(stateNode.activities.map(function (activity) {
        return (0, _actions.start)(activity);
      })), false), (0, _tslib.__read)(stateNode.onEntry), false);
    })).concat(doneEvents.map(_actions.raise)), (0, _utils.flatten)(Array.from(exitStates).map(function (stateNode) {
      return (0, _tslib.__spreadArray)((0, _tslib.__spreadArray)([], (0, _tslib.__read)(stateNode.onExit), false), (0, _tslib.__read)(stateNode.activities.map(function (activity) {
        return (0, _actions.stop)(activity);
      })), false);
    }))], 2),
        entryActions = _c[0],
        exitActions = _c[1];

    var actions = (0, _actions.toActionObjects)(exitActions.concat(transition.actions).concat(entryActions), this.machine.options.actions);
    return actions;
  };
  /**
   * Determines the next state given the current `state` and sent `event`.
   *
   * @param state The current State instance or state value
   * @param event The event that was sent at the current state
   * @param context The current context (extended state) of the current state
   */


  StateNode.prototype.transition = function (state, event, context) {
    if (state === void 0) {
      state = this.initialState;
    }

    var _event = (0, _utils.toSCXMLEvent)(event);

    var currentState;

    if (state instanceof _State.State) {
      currentState = context === undefined ? state : this.resolveState(_State.State.from(state, context));
    } else {
      var resolvedStateValue = (0, _utils.isString)(state) ? this.resolve((0, _utils.pathToStateValue)(this.getResolvedPath(state))) : this.resolve(state);
      var resolvedContext = context !== null && context !== void 0 ? context : this.machine.context;
      currentState = this.resolveState(_State.State.from(resolvedStateValue, resolvedContext));
    }

    if (!_environment.IS_PRODUCTION && _event.name === WILDCARD) {
      throw new Error("An event cannot have the wildcard type ('".concat(WILDCARD, "')"));
    }

    if (this.strict) {
      if (!this.events.includes(_event.name) && !(0, _utils.isBuiltInEvent)(_event.name)) {
        throw new Error("Machine '".concat(this.id, "' does not accept event '").concat(_event.name, "'"));
      }
    }

    var stateTransition = this._transition(currentState.value, currentState, _event) || {
      transitions: [],
      configuration: [],
      entrySet: [],
      exitSet: [],
      source: currentState,
      actions: []
    };
    var prevConfig = (0, _stateUtils.getConfiguration)([], this.getStateNodes(currentState.value));
    var resolvedConfig = stateTransition.configuration.length ? (0, _stateUtils.getConfiguration)(prevConfig, stateTransition.configuration) : prevConfig;
    stateTransition.configuration = (0, _tslib.__spreadArray)([], (0, _tslib.__read)(resolvedConfig), false);
    return this.resolveTransition(stateTransition, currentState, currentState.context, _event);
  };

  StateNode.prototype.resolveRaisedTransition = function (state, _event, originalEvent) {
    var _a;

    var currentActions = state.actions;
    state = this.transition(state, _event); // Save original event to state
    // TODO: this should be the raised event! Delete in V5 (breaking)

    state._event = originalEvent;
    state.event = originalEvent.data;

    (_a = state.actions).unshift.apply(_a, (0, _tslib.__spreadArray)([], (0, _tslib.__read)(currentActions), false));

    return state;
  };

  StateNode.prototype.resolveTransition = function (stateTransition, currentState, context, _event) {
    var e_6, _a;

    var _this = this;

    if (_event === void 0) {
      _event = _actions.initEvent;
    }

    var configuration = stateTransition.configuration; // Transition will "apply" if:
    // - this is the initial state (there is no current state)
    // - OR there are transitions

    var willTransition = !currentState || stateTransition.transitions.length > 0;
    var resolvedStateValue = willTransition ? (0, _stateUtils.getValue)(this.machine, configuration) : undefined;
    var historyValue = currentState ? currentState.historyValue ? currentState.historyValue : stateTransition.source ? this.machine.historyValue(currentState.value) : undefined : undefined;
    var actions = this.getActions(stateTransition, context, _event, currentState);
    var activities = currentState ? (0, _tslib.__assign)({}, currentState.activities) : {};

    try {
      for (var actions_1 = (0, _tslib.__values)(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {
        var action = actions_1_1.value;

        if (action.type === _actionTypes.start) {
          activities[action.activity.id || action.activity.type] = action;
        } else if (action.type === _actionTypes.stop) {
          activities[action.activity.id || action.activity.type] = false;
        }
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    var _b = (0, _tslib.__read)((0, _actions.resolveActions)(this, currentState, context, _event, actions, this.machine.config.preserveActionOrder), 2),
        resolvedActions = _b[0],
        updatedContext = _b[1];

    var _c = (0, _tslib.__read)((0, _utils.partition)(resolvedActions, function (action) {
      return action.type === _actionTypes.raise || action.type === _actionTypes.send && action.to === _types.SpecialTargets.Internal;
    }), 2),
        raisedEvents = _c[0],
        nonRaisedActions = _c[1];

    var invokeActions = resolvedActions.filter(function (action) {
      var _a;

      return action.type === _actionTypes.start && ((_a = action.activity) === null || _a === void 0 ? void 0 : _a.type) === _actionTypes.invoke;
    });
    var children = invokeActions.reduce(function (acc, action) {
      acc[action.activity.id] = (0, _Actor.createInvocableActor)(action.activity, _this.machine, updatedContext, _event);
      return acc;
    }, currentState ? (0, _tslib.__assign)({}, currentState.children) : {});
    var resolvedConfiguration = willTransition ? stateTransition.configuration : currentState ? currentState.configuration : [];
    var isDone = (0, _stateUtils.isInFinalState)(resolvedConfiguration, this);
    var nextState = new _State.State({
      value: resolvedStateValue || currentState.value,
      context: updatedContext,
      _event: _event,
      // Persist _sessionid between states
      _sessionid: currentState ? currentState._sessionid : null,
      historyValue: resolvedStateValue ? historyValue ? (0, _utils.updateHistoryValue)(historyValue, resolvedStateValue) : undefined : currentState ? currentState.historyValue : undefined,
      history: !resolvedStateValue || stateTransition.source ? currentState : undefined,
      actions: resolvedStateValue ? nonRaisedActions : [],
      activities: resolvedStateValue ? activities : currentState ? currentState.activities : {},
      events: [],
      configuration: resolvedConfiguration,
      transitions: stateTransition.transitions,
      children: children,
      done: isDone,
      tags: currentState === null || currentState === void 0 ? void 0 : currentState.tags,
      machine: this
    });
    var didUpdateContext = context !== updatedContext;
    nextState.changed = _event.name === _actionTypes.update || didUpdateContext; // Dispose of penultimate histories to prevent memory leaks

    var history = nextState.history;

    if (history) {
      delete history.history;
    } // There are transient transitions if the machine is not in a final state
    // and if some of the state nodes have transient ("always") transitions.


    var isTransient = !isDone && (this._transient || configuration.some(function (stateNode) {
      return stateNode._transient;
    })); // If there are no enabled transitions, check if there are transient transitions.
    // If there are transient transitions, continue checking for more transitions
    // because an transient transition should be triggered even if there are no
    // enabled transitions.
    //
    // If we're already working on an transient transition (by checking
    // if the event is a NULL_EVENT), then stop to prevent an infinite loop.
    //
    // Otherwise, if there are no enabled nor transient transitions, we are done.

    if (!willTransition && (!isTransient || _event.name === NULL_EVENT)) {
      return nextState;
    }

    var maybeNextState = nextState;

    if (!isDone) {
      if (isTransient) {
        maybeNextState = this.resolveRaisedTransition(maybeNextState, {
          type: _actionTypes.nullEvent
        }, _event);
      }

      while (raisedEvents.length) {
        var raisedEvent = raisedEvents.shift();
        maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event);
      }
    } // Detect if state changed


    var changed = maybeNextState.changed || (history ? !!maybeNextState.actions.length || didUpdateContext || typeof history.value !== typeof maybeNextState.value || !(0, _State.stateValuesEqual)(maybeNextState.value, history.value) : undefined);
    maybeNextState.changed = changed; // Preserve original history after raised events

    maybeNextState.history = history;
    maybeNextState.tags = (0, _stateUtils.getTagsFromConfiguration)(maybeNextState.configuration);
    return maybeNextState;
  };
  /**
   * Returns the child state node from its relative `stateKey`, or throws.
   */


  StateNode.prototype.getStateNode = function (stateKey) {
    if (isStateId(stateKey)) {
      return this.machine.getStateNodeById(stateKey);
    }

    if (!this.states) {
      throw new Error("Unable to retrieve child state '".concat(stateKey, "' from '").concat(this.id, "'; no child states exist."));
    }

    var result = this.states[stateKey];

    if (!result) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }

    return result;
  };
  /**
   * Returns the state node with the given `stateId`, or throws.
   *
   * @param stateId The state ID. The prefix "#" is removed.
   */


  StateNode.prototype.getStateNodeById = function (stateId) {
    var resolvedStateId = isStateId(stateId) ? stateId.slice(STATE_IDENTIFIER.length) : stateId;

    if (resolvedStateId === this.id) {
      return this;
    }

    var stateNode = this.machine.idMap[resolvedStateId];

    if (!stateNode) {
      throw new Error("Child state node '#".concat(resolvedStateId, "' does not exist on machine '").concat(this.id, "'"));
    }

    return stateNode;
  };
  /**
   * Returns the relative state node from the given `statePath`, or throws.
   *
   * @param statePath The string or string array relative path to the state node.
   */


  StateNode.prototype.getStateNodeByPath = function (statePath) {
    if (typeof statePath === 'string' && isStateId(statePath)) {
      try {
        return this.getStateNodeById(statePath.slice(1));
      } catch (e) {// try individual paths
        // throw e;
      }
    }

    var arrayStatePath = (0, _utils.toStatePath)(statePath, this.delimiter).slice();
    var currentStateNode = this;

    while (arrayStatePath.length) {
      var key = arrayStatePath.shift();

      if (!key.length) {
        break;
      }

      currentStateNode = currentStateNode.getStateNode(key);
    }

    return currentStateNode;
  };
  /**
   * Resolves a partial state value with its full representation in this machine.
   *
   * @param stateValue The partial state value to resolve.
   */


  StateNode.prototype.resolve = function (stateValue) {
    var _a;

    var _this = this;

    if (!stateValue) {
      return this.initialStateValue || EMPTY_OBJECT; // TODO: type-specific properties
    }

    switch (this.type) {
      case 'parallel':
        return (0, _utils.mapValues)(this.initialStateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue) : EMPTY_OBJECT;
        });

      case 'compound':
        if ((0, _utils.isString)(stateValue)) {
          var subStateNode = this.getStateNode(stateValue);

          if (subStateNode.type === 'parallel' || subStateNode.type === 'compound') {
            return _a = {}, _a[stateValue] = subStateNode.initialStateValue, _a;
          }

          return stateValue;
        }

        if (!Object.keys(stateValue).length) {
          return this.initialStateValue || {};
        }

        return (0, _utils.mapValues)(stateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(subStateValue) : EMPTY_OBJECT;
        });

      default:
        return stateValue || EMPTY_OBJECT;
    }
  };

  StateNode.prototype.getResolvedPath = function (stateIdentifier) {
    if (isStateId(stateIdentifier)) {
      var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];

      if (!stateNode) {
        throw new Error("Unable to find state node '".concat(stateIdentifier, "'"));
      }

      return stateNode.path;
    }

    return (0, _utils.toStatePath)(stateIdentifier, this.delimiter);
  };

  Object.defineProperty(StateNode.prototype, "initialStateValue", {
    get: function () {
      var _a;

      if (this.__cache.initialStateValue) {
        return this.__cache.initialStateValue;
      }

      var initialStateValue;

      if (this.type === 'parallel') {
        initialStateValue = (0, _utils.mapFilterValues)(this.states, function (state) {
          return state.initialStateValue || EMPTY_OBJECT;
        }, function (stateNode) {
          return !(stateNode.type === 'history');
        });
      } else if (this.initial !== undefined) {
        if (!this.states[this.initial]) {
          throw new Error("Initial state '".concat(this.initial, "' not found on '").concat(this.key, "'"));
        }

        initialStateValue = (0, _stateUtils.isLeafNode)(this.states[this.initial]) ? this.initial : (_a = {}, _a[this.initial] = this.states[this.initial].initialStateValue, _a);
      } else {
        // The finite state value of a machine without child states is just an empty object
        initialStateValue = {};
      }

      this.__cache.initialStateValue = initialStateValue;
      return this.__cache.initialStateValue;
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.getInitialState = function (stateValue, context) {
    this._init(); // TODO: this should be in the constructor (see note in constructor)


    var configuration = this.getStateNodes(stateValue);
    return this.resolveTransition({
      configuration: configuration,
      entrySet: configuration,
      exitSet: [],
      transitions: [],
      source: undefined,
      actions: []
    }, undefined, context !== null && context !== void 0 ? context : this.machine.context, undefined);
  };

  Object.defineProperty(StateNode.prototype, "initialState", {
    /**
     * The initial State instance, which includes all actions to be executed from
     * entering the initial state.
     */
    get: function () {
      var initialStateValue = this.initialStateValue;

      if (!initialStateValue) {
        throw new Error("Cannot retrieve initial state from simple state '".concat(this.id, "'."));
      }

      return this.getInitialState(initialStateValue);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "target", {
    /**
     * The target state value of the history state node, if it exists. This represents the
     * default state value to transition to if no history value exists yet.
     */
    get: function () {
      var target;

      if (this.type === 'history') {
        var historyConfig = this.config;

        if ((0, _utils.isString)(historyConfig.target)) {
          target = isStateId(historyConfig.target) ? (0, _utils.pathToStateValue)(this.machine.getStateNodeById(historyConfig.target).path.slice(this.path.length - 1)) : historyConfig.target;
        } else {
          target = historyConfig.target;
        }
      }

      return target;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Returns the leaf nodes from a state path relative to this state node.
   *
   * @param relativeStateId The relative state path to retrieve the state nodes
   * @param history The previous state to retrieve history
   * @param resolve Whether state nodes should resolve to initial child state nodes
   */

  StateNode.prototype.getRelativeStateNodes = function (relativeStateId, historyValue, resolve) {
    if (resolve === void 0) {
      resolve = true;
    }

    return resolve ? relativeStateId.type === 'history' ? relativeStateId.resolveHistory(historyValue) : relativeStateId.initialStateNodes : [relativeStateId];
  };

  Object.defineProperty(StateNode.prototype, "initialStateNodes", {
    get: function () {
      var _this = this;

      if ((0, _stateUtils.isLeafNode)(this)) {
        return [this];
      } // Case when state node is compound but no initial state is defined


      if (this.type === 'compound' && !this.initial) {
        if (!_environment.IS_PRODUCTION) {
          (0, _utils.warn)(false, "Compound state node '".concat(this.id, "' has no initial state."));
        }

        return [this];
      }

      var initialStateNodePaths = (0, _utils.toStatePaths)(this.initialStateValue);
      return (0, _utils.flatten)(initialStateNodePaths.map(function (initialPath) {
        return _this.getFromRelativePath(initialPath);
      }));
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Retrieves state nodes from a relative path to this state node.
   *
   * @param relativePath The relative path from this state node
   * @param historyValue
   */

  StateNode.prototype.getFromRelativePath = function (relativePath) {
    if (!relativePath.length) {
      return [this];
    }

    var _a = (0, _tslib.__read)(relativePath),
        stateKey = _a[0],
        childStatePath = _a.slice(1);

    if (!this.states) {
      throw new Error("Cannot retrieve subPath '".concat(stateKey, "' from node with no states"));
    }

    var childStateNode = this.getStateNode(stateKey);

    if (childStateNode.type === 'history') {
      return childStateNode.resolveHistory();
    }

    if (!this.states[stateKey]) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }

    return this.states[stateKey].getFromRelativePath(childStatePath);
  };

  StateNode.prototype.historyValue = function (relativeStateValue) {
    if (!Object.keys(this.states).length) {
      return undefined;
    }

    return {
      current: relativeStateValue || this.initialStateValue,
      states: (0, _utils.mapFilterValues)(this.states, function (stateNode, key) {
        if (!relativeStateValue) {
          return stateNode.historyValue();
        }

        var subStateValue = (0, _utils.isString)(relativeStateValue) ? undefined : relativeStateValue[key];
        return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
      }, function (stateNode) {
        return !stateNode.history;
      })
    };
  };
  /**
   * Resolves to the historical value(s) of the parent state node,
   * represented by state nodes.
   *
   * @param historyValue
   */


  StateNode.prototype.resolveHistory = function (historyValue) {
    var _this = this;

    if (this.type !== 'history') {
      return [this];
    }

    var parent = this.parent;

    if (!historyValue) {
      var historyTarget = this.target;
      return historyTarget ? (0, _utils.flatten)((0, _utils.toStatePaths)(historyTarget).map(function (relativeChildPath) {
        return parent.getFromRelativePath(relativeChildPath);
      })) : parent.initialStateNodes;
    }

    var subHistoryValue = (0, _utils.nestedPath)(parent.path, 'states')(historyValue).current;

    if ((0, _utils.isString)(subHistoryValue)) {
      return [parent.getStateNode(subHistoryValue)];
    }

    return (0, _utils.flatten)((0, _utils.toStatePaths)(subHistoryValue).map(function (subStatePath) {
      return _this.history === 'deep' ? parent.getFromRelativePath(subStatePath) : [parent.states[subStatePath[0]]];
    }));
  };

  Object.defineProperty(StateNode.prototype, "stateIds", {
    /**
     * All the state node IDs of this state node and its descendant state nodes.
     */
    get: function () {
      var _this = this;

      var childStateIds = (0, _utils.flatten)(Object.keys(this.states).map(function (stateKey) {
        return _this.states[stateKey].stateIds;
      }));
      return [this.id].concat(childStateIds);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "events", {
    /**
     * All the event types accepted by this state node and its descendants.
     */
    get: function () {
      var e_7, _a, e_8, _b;

      if (this.__cache.events) {
        return this.__cache.events;
      }

      var states = this.states;
      var events = new Set(this.ownEvents);

      if (states) {
        try {
          for (var _c = (0, _tslib.__values)(Object.keys(states)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var stateId = _d.value;
            var state = states[stateId];

            if (state.states) {
              try {
                for (var _e = (e_8 = void 0, (0, _tslib.__values)(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
                  var event_1 = _f.value;
                  events.add("".concat(event_1));
                }
              } catch (e_8_1) {
                e_8 = {
                  error: e_8_1
                };
              } finally {
                try {
                  if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                } finally {
                  if (e_8) throw e_8.error;
                }
              }
            }
          }
        } catch (e_7_1) {
          e_7 = {
            error: e_7_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
          } finally {
            if (e_7) throw e_7.error;
          }
        }
      }

      return this.__cache.events = Array.from(events);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "ownEvents", {
    /**
     * All the events that have transitions directly from this state node.
     *
     * Excludes any inert events.
     */
    get: function () {
      var events = new Set(this.transitions.filter(function (transition) {
        return !(!transition.target && !transition.actions.length && transition.internal);
      }).map(function (transition) {
        return transition.eventType;
      }));
      return Array.from(events);
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.resolveTarget = function (_target) {
    var _this = this;

    if (_target === undefined) {
      // an undefined target signals that the state node should not transition from that state when receiving that event
      return undefined;
    }

    return _target.map(function (target) {
      if (!(0, _utils.isString)(target)) {
        return target;
      }

      var isInternalTarget = target[0] === _this.delimiter; // If internal target is defined on machine,
      // do not include machine key on target

      if (isInternalTarget && !_this.parent) {
        return _this.getStateNodeByPath(target.slice(1));
      }

      var resolvedTarget = isInternalTarget ? _this.key + target : target;

      if (_this.parent) {
        try {
          var targetStateNode = _this.parent.getStateNodeByPath(resolvedTarget);

          return targetStateNode;
        } catch (err) {
          throw new Error("Invalid transition definition for state node '".concat(_this.id, "':\n").concat(err.message));
        }
      } else {
        return _this.getStateNodeByPath(resolvedTarget);
      }
    });
  };

  StateNode.prototype.formatTransition = function (transitionConfig) {
    var _this = this;

    var normalizedTarget = (0, _utils.normalizeTarget)(transitionConfig.target);
    var internal = 'internal' in transitionConfig ? transitionConfig.internal : normalizedTarget ? normalizedTarget.some(function (_target) {
      return (0, _utils.isString)(_target) && _target[0] === _this.delimiter;
    }) : true;
    var guards = this.machine.options.guards;
    var target = this.resolveTarget(normalizedTarget);
    var transition = (0, _tslib.__assign)((0, _tslib.__assign)({}, transitionConfig), {
      actions: (0, _actions.toActionObjects)((0, _utils.toArray)(transitionConfig.actions)),
      cond: (0, _utils.toGuard)(transitionConfig.cond, guards),
      target: target,
      source: this,
      internal: internal,
      eventType: transitionConfig.event,
      toJSON: function () {
        return (0, _tslib.__assign)((0, _tslib.__assign)({}, transition), {
          target: transition.target ? transition.target.map(function (t) {
            return "#".concat(t.id);
          }) : undefined,
          source: "#".concat(_this.id)
        });
      }
    });
    return transition;
  };

  StateNode.prototype.formatTransitions = function () {
    var e_9, _a;

    var _this = this;

    var onConfig;

    if (!this.config.on) {
      onConfig = [];
    } else if (Array.isArray(this.config.on)) {
      onConfig = this.config.on;
    } else {
      var _b = this.config.on,
          _c = WILDCARD,
          _d = _b[_c],
          wildcardConfigs = _d === void 0 ? [] : _d,
          strictTransitionConfigs_1 = (0, _tslib.__rest)(_b, [typeof _c === "symbol" ? _c : _c + ""]);
      onConfig = (0, _utils.flatten)(Object.keys(strictTransitionConfigs_1).map(function (key) {
        if (!_environment.IS_PRODUCTION && key === NULL_EVENT) {
          (0, _utils.warn)(false, "Empty string transition configs (e.g., `{ on: { '': ... }}`) for transient transitions are deprecated. Specify the transition in the `{ always: ... }` property instead. " + "Please check the `on` configuration for \"#".concat(_this.id, "\"."));
        }

        var transitionConfigArray = (0, _utils.toTransitionConfigArray)(key, strictTransitionConfigs_1[key]);

        if (!_environment.IS_PRODUCTION) {
          validateArrayifiedTransitions(_this, key, transitionConfigArray);
        }

        return transitionConfigArray;
      }).concat((0, _utils.toTransitionConfigArray)(WILDCARD, wildcardConfigs)));
    }

    var eventlessConfig = this.config.always ? (0, _utils.toTransitionConfigArray)('', this.config.always) : [];
    var doneConfig = this.config.onDone ? (0, _utils.toTransitionConfigArray)(String((0, _actions.done)(this.id)), this.config.onDone) : [];

    if (!_environment.IS_PRODUCTION) {
      (0, _utils.warn)(!(this.config.onDone && !this.parent), "Root nodes cannot have an \".onDone\" transition. Please check the config of \"".concat(this.id, "\"."));
    }

    var invokeConfig = (0, _utils.flatten)(this.invoke.map(function (invokeDef) {
      var settleTransitions = [];

      if (invokeDef.onDone) {
        settleTransitions.push.apply(settleTransitions, (0, _tslib.__spreadArray)([], (0, _tslib.__read)((0, _utils.toTransitionConfigArray)(String((0, _actions.doneInvoke)(invokeDef.id)), invokeDef.onDone)), false));
      }

      if (invokeDef.onError) {
        settleTransitions.push.apply(settleTransitions, (0, _tslib.__spreadArray)([], (0, _tslib.__read)((0, _utils.toTransitionConfigArray)(String((0, _actions.error)(invokeDef.id)), invokeDef.onError)), false));
      }

      return settleTransitions;
    }));
    var delayedTransitions = this.after;
    var formattedTransitions = (0, _utils.flatten)((0, _tslib.__spreadArray)((0, _tslib.__spreadArray)((0, _tslib.__spreadArray)((0, _tslib.__spreadArray)([], (0, _tslib.__read)(doneConfig), false), (0, _tslib.__read)(invokeConfig), false), (0, _tslib.__read)(onConfig), false), (0, _tslib.__read)(eventlessConfig), false).map(function (transitionConfig) {
      return (0, _utils.toArray)(transitionConfig).map(function (transition) {
        return _this.formatTransition(transition);
      });
    }));

    try {
      for (var delayedTransitions_1 = (0, _tslib.__values)(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
        var delayedTransition = delayedTransitions_1_1.value;
        formattedTransitions.push(delayedTransition);
      }
    } catch (e_9_1) {
      e_9 = {
        error: e_9_1
      };
    } finally {
      try {
        if (delayedTransitions_1_1 && !delayedTransitions_1_1.done && (_a = delayedTransitions_1.return)) _a.call(delayedTransitions_1);
      } finally {
        if (e_9) throw e_9.error;
      }
    }

    return formattedTransitions;
  };

  return StateNode;
}();

exports.StateNode = StateNode;
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./types.js":"node_modules/xstate/es/types.js","./actionTypes.js":"node_modules/xstate/es/actionTypes.js","./constants.js":"node_modules/xstate/es/constants.js","./environment.js":"node_modules/xstate/es/environment.js","./utils.js":"node_modules/xstate/es/utils.js","./actions.js":"node_modules/xstate/es/actions.js","./Actor.js":"node_modules/xstate/es/Actor.js","./stateUtils.js":"node_modules/xstate/es/stateUtils.js","./State.js":"node_modules/xstate/es/State.js","./invokeUtils.js":"node_modules/xstate/es/invokeUtils.js"}],"node_modules/xstate/es/Machine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Machine = Machine;
exports.createMachine = createMachine;

var _StateNode = require("./StateNode.js");

function Machine(config, options, initialContext) {
  if (initialContext === void 0) {
    initialContext = config.context;
  }

  return new _StateNode.StateNode(config, options, initialContext);
}

function createMachine(config, options) {
  return new _StateNode.StateNode(config, options);
}
},{"./StateNode.js":"node_modules/xstate/es/StateNode.js"}],"node_modules/xstate/es/mapState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapState = mapState;

var _tslib = require("./_virtual/_tslib.js");

var _utils = require("./utils.js");

function mapState(stateMap, stateId) {
  var e_1, _a;

  var foundStateId;

  try {
    for (var _b = (0, _tslib.__values)(Object.keys(stateMap)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var mappedStateId = _c.value;

      if ((0, _utils.matchesState)(mappedStateId, stateId) && (!foundStateId || stateId.length > foundStateId.length)) {
        foundStateId = mappedStateId;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return stateMap[foundStateId];
}
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./utils.js":"node_modules/xstate/es/utils.js"}],"node_modules/xstate/es/match.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchState = matchState;

var _tslib = require("./_virtual/_tslib.js");

var _State = require("./State.js");

function matchState(state, patterns, defaultValue) {
  var e_1, _a;

  var resolvedState = _State.State.from(state, state instanceof _State.State ? state.context : undefined);

  try {
    for (var patterns_1 = (0, _tslib.__values)(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
      var _b = (0, _tslib.__read)(patterns_1_1.value, 2),
          stateValue = _b[0],
          getValue = _b[1];

      if (resolvedState.matches(stateValue)) {
        return getValue(resolvedState);
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (patterns_1_1 && !patterns_1_1.done && (_a = patterns_1.return)) _a.call(patterns_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return defaultValue(resolvedState);
}
},{"./_virtual/_tslib.js":"node_modules/xstate/es/_virtual/_tslib.js","./State.js":"node_modules/xstate/es/State.js"}],"node_modules/xstate/es/schema.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSchema = createSchema;
exports.t = void 0;

function createSchema(schema) {
  return schema;
}

var t = createSchema;
exports.t = t;
},{}],"node_modules/xstate/es/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ActionTypes", {
  enumerable: true,
  get: function () {
    return _types.ActionTypes;
  }
});
Object.defineProperty(exports, "Interpreter", {
  enumerable: true,
  get: function () {
    return _interpreter.Interpreter;
  }
});
Object.defineProperty(exports, "InterpreterStatus", {
  enumerable: true,
  get: function () {
    return _interpreter.InterpreterStatus;
  }
});
Object.defineProperty(exports, "Machine", {
  enumerable: true,
  get: function () {
    return _Machine.Machine;
  }
});
Object.defineProperty(exports, "SpecialTargets", {
  enumerable: true,
  get: function () {
    return _types.SpecialTargets;
  }
});
Object.defineProperty(exports, "State", {
  enumerable: true,
  get: function () {
    return _State.State;
  }
});
Object.defineProperty(exports, "StateNode", {
  enumerable: true,
  get: function () {
    return _StateNode.StateNode;
  }
});
exports.assign = exports.actions = void 0;
Object.defineProperty(exports, "createMachine", {
  enumerable: true,
  get: function () {
    return _Machine.createMachine;
  }
});
Object.defineProperty(exports, "createSchema", {
  enumerable: true,
  get: function () {
    return _schema.createSchema;
  }
});
exports.forwardTo = exports.doneInvoke = void 0;
Object.defineProperty(exports, "interpret", {
  enumerable: true,
  get: function () {
    return _interpreter.interpret;
  }
});
Object.defineProperty(exports, "mapState", {
  enumerable: true,
  get: function () {
    return _mapState.mapState;
  }
});
Object.defineProperty(exports, "matchState", {
  enumerable: true,
  get: function () {
    return _match.matchState;
  }
});
Object.defineProperty(exports, "matchesState", {
  enumerable: true,
  get: function () {
    return _utils.matchesState;
  }
});
exports.sendUpdate = exports.sendParent = exports.send = void 0;
Object.defineProperty(exports, "spawn", {
  enumerable: true,
  get: function () {
    return _interpreter.spawn;
  }
});
Object.defineProperty(exports, "spawnBehavior", {
  enumerable: true,
  get: function () {
    return _behaviors.spawnBehavior;
  }
});
Object.defineProperty(exports, "t", {
  enumerable: true,
  get: function () {
    return _schema.t;
  }
});
Object.defineProperty(exports, "toActorRef", {
  enumerable: true,
  get: function () {
    return _Actor.toActorRef;
  }
});
Object.defineProperty(exports, "toEventObject", {
  enumerable: true,
  get: function () {
    return _utils.toEventObject;
  }
});
Object.defineProperty(exports, "toObserver", {
  enumerable: true,
  get: function () {
    return _utils.toObserver;
  }
});
Object.defineProperty(exports, "toSCXMLEvent", {
  enumerable: true,
  get: function () {
    return _utils.toSCXMLEvent;
  }
});

var _types = require("./types.js");

var _utils = require("./utils.js");

var actions = _interopRequireWildcard(require("./actions.js"));

exports.actions = actions;

var _Actor = require("./Actor.js");

var _State = require("./State.js");

var _behaviors = require("./behaviors.js");

var _interpreter = require("./interpreter.js");

var _StateNode = require("./StateNode.js");

var _Machine = require("./Machine.js");

var _mapState = require("./mapState.js");

var _match = require("./match.js");

var _schema = require("./schema.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var assign = actions.assign,
    send = actions.send,
    sendParent = actions.sendParent,
    sendUpdate = actions.sendUpdate,
    forwardTo = actions.forwardTo,
    doneInvoke = actions.doneInvoke;
exports.doneInvoke = doneInvoke;
exports.forwardTo = forwardTo;
exports.sendUpdate = sendUpdate;
exports.sendParent = sendParent;
exports.send = send;
exports.assign = assign;
},{"./types.js":"node_modules/xstate/es/types.js","./utils.js":"node_modules/xstate/es/utils.js","./actions.js":"node_modules/xstate/es/actions.js","./Actor.js":"node_modules/xstate/es/Actor.js","./State.js":"node_modules/xstate/es/State.js","./behaviors.js":"node_modules/xstate/es/behaviors.js","./interpreter.js":"node_modules/xstate/es/interpreter.js","./StateNode.js":"node_modules/xstate/es/StateNode.js","./Machine.js":"node_modules/xstate/es/Machine.js","./mapState.js":"node_modules/xstate/es/mapState.js","./match.js":"node_modules/xstate/es/match.js","./schema.js":"node_modules/xstate/es/schema.js"}],"node_modules/farmbot/dist/corpus.js":[function(require,module,exports) {
"use strict"; // THIS INTERFACE WAS AUTO GENERATED ON 2022-02-08
// DO NOT EDIT THIS FILE.
// IT WILL BE OVERWRITTEN ON EVERY CELERYSCRIPT UPGRADE.

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ANALOG = exports.DIGITAL = exports.LATEST_VERSION = void 0;
exports.LATEST_VERSION = 20180209;
exports.DIGITAL = 0;
exports.ANALOG = 1;
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter;
module.exports.once = once; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }

    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });

    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }

      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
},{}],"node_modules/xtend/immutable.js":[function(require,module,exports) {
module.exports = extend;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
  var target = {};

  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
}
},{}],"node_modules/readable-stream/lib/internal/streams/stream-browser.js":[function(require,module,exports) {
module.exports = require('events').EventEmitter;
},{"events":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/events/events.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/base64-js/index.js","ieee754":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/ieee754/index.js","isarray":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/isarray/index.js","buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/readable-stream/lib/internal/streams/buffer_list.js":[function(require,module,exports) {

'use strict';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var _require = require('buffer'),
    Buffer = _require.Buffer;

var _require2 = require('util'),
    inspect = _require2.inspect;

var custom = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}

module.exports = /*#__PURE__*/function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();
},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js","util":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/readable-stream/lib/internal/streams/destroy.js":[function(require,module,exports) {
var process = require("process");
'use strict'; // undocumented cb() API, needed for core, not for public API

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};
},{"process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/readable-stream/errors-browser.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError = /*#__PURE__*/function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(_typeof(actual));
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;
},{}],"node_modules/readable-stream/lib/internal/streams/state.js":[function(require,module,exports) {
'use strict';

var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

module.exports = {
  getHighWaterMark: getHighWaterMark
};
},{"../../../errors":"node_modules/readable-stream/errors-browser.js"}],"node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],"node_modules/util-deprecate/browser.js":[function(require,module,exports) {
var global = arguments[3];

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

},{}],"node_modules/readable-stream/lib/_stream_writable.js":[function(require,module,exports) {

var global = arguments[3];
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
'use strict';

module.exports = Writable;
/* <replacement> */

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
} // It seems a linked list but it is not
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;
/*<replacement>*/

var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/

var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;

var errorOrDestroy = destroyImpl.errorOrDestroy;

require('inherits')(Writable, Stream);

function nop() {}

function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

  this.autoDestroy = !!options.autoDestroy; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex'); // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};

function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var er;

  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }

  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }

  return true;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  this._writableState.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending) endWritable(this, state, cb);
  return this;
};

Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      errorOrDestroy(stream, err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');

      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;

        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  } // reuse the free corkReq.


  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;

Writable.prototype._destroy = function (err, cb) {
  cb(err);
};
},{"util-deprecate":"node_modules/util-deprecate/browser.js","./internal/streams/stream":"node_modules/readable-stream/lib/internal/streams/stream-browser.js","buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js","./internal/streams/destroy":"node_modules/readable-stream/lib/internal/streams/destroy.js","./internal/streams/state":"node_modules/readable-stream/lib/internal/streams/state.js","../errors":"node_modules/readable-stream/errors-browser.js","inherits":"node_modules/inherits/inherits_browser.js","./_stream_duplex":"node_modules/readable-stream/lib/_stream_duplex.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/readable-stream/lib/_stream_duplex.js":[function(require,module,exports) {
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.
'use strict';
/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


module.exports = Duplex;

var Readable = require('./_stream_readable');

var Writable = require('./_stream_writable');

require('inherits')(Duplex, Readable);

{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);

  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;

  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
}); // the no-half-open enforcer

function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  process.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});
},{"./_stream_readable":"node_modules/readable-stream/lib/_stream_readable.js","./_stream_writable":"node_modules/readable-stream/lib/_stream_writable.js","inherits":"node_modules/inherits/inherits_browser.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/safe-buffer/index.js":[function(require,module,exports) {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"node_modules/string_decoder/lib/string_decoder.js":[function(require,module,exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":"node_modules/safe-buffer/index.js"}],"node_modules/readable-stream/lib/internal/streams/end-of-stream.js":[function(require,module,exports) {
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var ERR_STREAM_PREMATURE_CLOSE = require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
  };
}

function noop() {}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };

  var writableEnded = stream._writableState && stream._writableState.finished;

  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };

  var readableEnded = stream._readableState && stream._readableState.endEmitted;

  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };

  var onerror = function onerror(err) {
    callback.call(stream, err);
  };

  var onclose = function onclose() {
    var err;

    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }

    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };

  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };

  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}

module.exports = eos;
},{"../../../errors":"node_modules/readable-stream/errors-browser.js"}],"node_modules/readable-stream/lib/internal/streams/async_iterator.js":[function(require,module,exports) {
var process = require("process");
'use strict';

var _Object$setPrototypeO;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var finished = require('./end-of-stream');

var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this; // if we have detected an error in the meanwhile
    // reject straight away


    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this; // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to


  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

module.exports = createReadableStreamAsyncIterator;
},{"./end-of-stream":"node_modules/readable-stream/lib/internal/streams/end-of-stream.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/readable-stream/lib/internal/streams/from-browser.js":[function(require,module,exports) {
module.exports = function () {
  throw new Error('Readable.from is not available in the browser');
};
},{}],"node_modules/readable-stream/lib/_stream_readable.js":[function(require,module,exports) {

var global = arguments[3];
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

module.exports = Readable;
/*<replacement>*/

var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = require('events').EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*<replacement>*/


var debugUtil = require('util');

var debug;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/


var BufferList = require('./internal/streams/buffer_list');

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.


var StringDecoder;
var createReadableStreamAsyncIterator;
var from;

require('inherits')(Readable, Stream);

var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

  this.autoDestroy = !!options.autoDestroy; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');
  if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;

Readable.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

  var p = this._readableState.buffer.head;
  var content = '';

  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }

  this._readableState.buffer.clear();

  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
}; // Don't raise the hwm > 1GB


var MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
    ;
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
    }

    return createReadableStreamAsyncIterator(this);
  };
}

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');

    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;

      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}

if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = require('./internal/streams/from');
    }

    return from(Readable, iterable, opts);
  };
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}
},{"events":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/events/events.js","./internal/streams/stream":"node_modules/readable-stream/lib/internal/streams/stream-browser.js","buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js","util":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js","./internal/streams/buffer_list":"node_modules/readable-stream/lib/internal/streams/buffer_list.js","./internal/streams/destroy":"node_modules/readable-stream/lib/internal/streams/destroy.js","./internal/streams/state":"node_modules/readable-stream/lib/internal/streams/state.js","../errors":"node_modules/readable-stream/errors-browser.js","inherits":"node_modules/inherits/inherits_browser.js","./_stream_duplex":"node_modules/readable-stream/lib/_stream_duplex.js","string_decoder/":"node_modules/string_decoder/lib/string_decoder.js","./internal/streams/async_iterator":"node_modules/readable-stream/lib/internal/streams/async_iterator.js","./internal/streams/from":"node_modules/readable-stream/lib/internal/streams/from-browser.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/readable-stream/lib/_stream_transform.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
'use strict';

module.exports = Transform;

var _require$codes = require('../errors').codes,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;

var Duplex = require('./_stream_duplex');

require('inherits')(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}
},{"../errors":"node_modules/readable-stream/errors-browser.js","./_stream_duplex":"node_modules/readable-stream/lib/_stream_duplex.js","inherits":"node_modules/inherits/inherits_browser.js"}],"node_modules/readable-stream/lib/_stream_passthrough.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.
'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

require('inherits')(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":"node_modules/readable-stream/lib/_stream_transform.js","inherits":"node_modules/inherits/inherits_browser.js"}],"node_modules/readable-stream/lib/internal/streams/pipeline.js":[function(require,module,exports) {
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var eos;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes = require('../../../errors').codes,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;

function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = require('./end-of-stream');
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}

function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}

module.exports = pipeline;
},{"../../../errors":"node_modules/readable-stream/errors-browser.js","./end-of-stream":"node_modules/readable-stream/lib/internal/streams/end-of-stream.js"}],"node_modules/readable-stream/readable-browser.js":[function(require,module,exports) {
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');
exports.finished = require('./lib/internal/streams/end-of-stream.js');
exports.pipeline = require('./lib/internal/streams/pipeline.js');
},{"./lib/_stream_readable.js":"node_modules/readable-stream/lib/_stream_readable.js","./lib/_stream_writable.js":"node_modules/readable-stream/lib/_stream_writable.js","./lib/_stream_duplex.js":"node_modules/readable-stream/lib/_stream_duplex.js","./lib/_stream_transform.js":"node_modules/readable-stream/lib/_stream_transform.js","./lib/_stream_passthrough.js":"node_modules/readable-stream/lib/_stream_passthrough.js","./lib/internal/streams/end-of-stream.js":"node_modules/readable-stream/lib/internal/streams/end-of-stream.js","./lib/internal/streams/pipeline.js":"node_modules/readable-stream/lib/internal/streams/pipeline.js"}],"node_modules/mqtt/lib/store.js":[function(require,module,exports) {
'use strict';
/**
 * Module dependencies
 */

var xtend = require('xtend');

var Readable = require('readable-stream').Readable;

var streamsOpts = {
  objectMode: true
};
var defaultStoreOptions = {
  clean: true
};
/**
 * In-memory implementation of the message store
 * This can actually be saved into files.
 *
 * @param {Object} [options] - store options
 */

function Store(options) {
  if (!(this instanceof Store)) {
    return new Store(options);
  }

  this.options = options || {}; // Defaults

  this.options = xtend(defaultStoreOptions, options);
  this._inflights = new Map();
}
/**
 * Adds a packet to the store, a packet is
 * anything that has a messageId property.
 *
 */


Store.prototype.put = function (packet, cb) {
  this._inflights.set(packet.messageId, packet);

  if (cb) {
    cb();
  }

  return this;
};
/**
 * Creates a stream with all the packets in the store
 *
 */


Store.prototype.createStream = function () {
  var stream = new Readable(streamsOpts);
  var values = [];
  var destroyed = false;
  var i = 0;

  this._inflights.forEach(function (value, key) {
    values.push(value);
  });

  stream._read = function () {
    if (!destroyed && i < values.length) {
      this.push(values[i++]);
    } else {
      this.push(null);
    }
  };

  stream.destroy = function () {
    if (destroyed) {
      return;
    }

    var self = this;
    destroyed = true;
    setTimeout(function () {
      self.emit('close');
    }, 0);
  };

  return stream;
};
/**
 * deletes a packet from the store.
 */


Store.prototype.del = function (packet, cb) {
  packet = this._inflights.get(packet.messageId);

  if (packet) {
    this._inflights.delete(packet.messageId);

    cb(null, packet);
  } else if (cb) {
    cb(new Error('missing packet'));
  }

  return this;
};
/**
 * get a packet from the store.
 */


Store.prototype.get = function (packet, cb) {
  packet = this._inflights.get(packet.messageId);

  if (packet) {
    cb(null, packet);
  } else if (cb) {
    cb(new Error('missing packet'));
  }

  return this;
};
/**
 * Close the store
 */


Store.prototype.close = function (cb) {
  if (this.options.clean) {
    this._inflights = null;
  }

  if (cb) {
    cb();
  }
};

module.exports = Store;
},{"xtend":"node_modules/xtend/immutable.js","readable-stream":"node_modules/readable-stream/readable-browser.js"}],"node_modules/mqtt/lib/topic-alias-recv.js":[function(require,module,exports) {
'use strict';
/**
 * Topic Alias receiving manager
 * This holds alias to topic map
 * @param {Number} [max] - topic alias maximum entries
 */

function TopicAliasRecv(max) {
  if (!(this instanceof TopicAliasRecv)) {
    return new TopicAliasRecv(max);
  }

  this.aliasToTopic = {};
  this.max = max;
}
/**
 * Insert or update topic - alias entry.
 * @param {String} [topic] - topic
 * @param {Number} [alias] - topic alias
 * @returns {Boolean} - if success return true otherwise false
 */


TopicAliasRecv.prototype.put = function (topic, alias) {
  if (alias === 0 || alias > this.max) {
    return false;
  }

  this.aliasToTopic[alias] = topic;
  this.length = Object.keys(this.aliasToTopic).length;
  return true;
};
/**
 * Get topic by alias
 * @param {String} [topic] - topic
 * @returns {Number} - if mapped topic exists return topic alias, otherwise return undefined
 */


TopicAliasRecv.prototype.getTopicByAlias = function (alias) {
  return this.aliasToTopic[alias];
};
/**
 * Clear all entries
 */


TopicAliasRecv.prototype.clear = function () {
  this.aliasToTopic = {};
};

module.exports = TopicAliasRecv;
},{}],"node_modules/yallist/iterator.js":[function(require,module,exports) {
'use strict'
module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}

},{}],"node_modules/yallist/yallist.js":[function(require,module,exports) {
'use strict'
module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  require('./iterator.js')(Yallist)
} catch (er) {}

},{"./iterator.js":"node_modules/yallist/iterator.js"}],"node_modules/lru-cache/index.js":[function(require,module,exports) {
'use strict'; // A linked list to keep track of recently-used-ness

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Yallist = require('yallist');

var MAX = Symbol('max');
var LENGTH = Symbol('length');
var LENGTH_CALCULATOR = Symbol('lengthCalculator');
var ALLOW_STALE = Symbol('allowStale');
var MAX_AGE = Symbol('maxAge');
var DISPOSE = Symbol('dispose');
var NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
var LRU_LIST = Symbol('lruList');
var CACHE = Symbol('cache');
var UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

var naiveLength = function naiveLength() {
  return 1;
}; // lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.


var LRUCache = /*#__PURE__*/function () {
  function LRUCache(options) {
    _classCallCheck(this, LRUCache);

    if (typeof options === 'number') options = {
      max: options
    };
    if (!options) options = {};
    if (options.max && (typeof options.max !== 'number' || options.max < 0)) throw new TypeError('max must be a non-negative number'); // Kind of weird to have a default max of Infinity, but oh well.

    var max = this[MAX] = options.max || Infinity;
    var lc = options.length || naiveLength;
    this[LENGTH_CALCULATOR] = typeof lc !== 'function' ? naiveLength : lc;
    this[ALLOW_STALE] = options.stale || false;
    if (options.maxAge && typeof options.maxAge !== 'number') throw new TypeError('maxAge must be a number');
    this[MAX_AGE] = options.maxAge || 0;
    this[DISPOSE] = options.dispose;
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
    this.reset();
  } // resize the cache when the max changes.


  _createClass(LRUCache, [{
    key: "max",
    get: function get() {
      return this[MAX];
    },
    set: function set(mL) {
      if (typeof mL !== 'number' || mL < 0) throw new TypeError('max must be a non-negative number');
      this[MAX] = mL || Infinity;
      trim(this);
    }
  }, {
    key: "allowStale",
    get: function get() {
      return this[ALLOW_STALE];
    },
    set: function set(allowStale) {
      this[ALLOW_STALE] = !!allowStale;
    }
  }, {
    key: "maxAge",
    get: function get() {
      return this[MAX_AGE];
    } // resize the cache when the lengthCalculator changes.
    ,
    set: function set(mA) {
      if (typeof mA !== 'number') throw new TypeError('maxAge must be a non-negative number');
      this[MAX_AGE] = mA;
      trim(this);
    }
  }, {
    key: "lengthCalculator",
    get: function get() {
      return this[LENGTH_CALCULATOR];
    },
    set: function set(lC) {
      var _this = this;

      if (typeof lC !== 'function') lC = naiveLength;

      if (lC !== this[LENGTH_CALCULATOR]) {
        this[LENGTH_CALCULATOR] = lC;
        this[LENGTH] = 0;
        this[LRU_LIST].forEach(function (hit) {
          hit.length = _this[LENGTH_CALCULATOR](hit.value, hit.key);
          _this[LENGTH] += hit.length;
        });
      }

      trim(this);
    }
  }, {
    key: "length",
    get: function get() {
      return this[LENGTH];
    }
  }, {
    key: "itemCount",
    get: function get() {
      return this[LRU_LIST].length;
    }
  }, {
    key: "rforEach",
    value: function rforEach(fn, thisp) {
      thisp = thisp || this;

      for (var walker = this[LRU_LIST].tail; walker !== null;) {
        var prev = walker.prev;
        forEachStep(this, fn, walker, thisp);
        walker = prev;
      }
    }
  }, {
    key: "forEach",
    value: function forEach(fn, thisp) {
      thisp = thisp || this;

      for (var walker = this[LRU_LIST].head; walker !== null;) {
        var next = walker.next;
        forEachStep(this, fn, walker, thisp);
        walker = next;
      }
    }
  }, {
    key: "keys",
    value: function keys() {
      return this[LRU_LIST].toArray().map(function (k) {
        return k.key;
      });
    }
  }, {
    key: "values",
    value: function values() {
      return this[LRU_LIST].toArray().map(function (k) {
        return k.value;
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this2 = this;

      if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
        this[LRU_LIST].forEach(function (hit) {
          return _this2[DISPOSE](hit.key, hit.value);
        });
      }

      this[CACHE] = new Map(); // hash of items by key

      this[LRU_LIST] = new Yallist(); // list of items in order of use recency

      this[LENGTH] = 0; // length of items in the list
    }
  }, {
    key: "dump",
    value: function dump() {
      var _this3 = this;

      return this[LRU_LIST].map(function (hit) {
        return isStale(_this3, hit) ? false : {
          k: hit.key,
          v: hit.value,
          e: hit.now + (hit.maxAge || 0)
        };
      }).toArray().filter(function (h) {
        return h;
      });
    }
  }, {
    key: "dumpLru",
    value: function dumpLru() {
      return this[LRU_LIST];
    }
  }, {
    key: "set",
    value: function set(key, value, maxAge) {
      maxAge = maxAge || this[MAX_AGE];
      if (maxAge && typeof maxAge !== 'number') throw new TypeError('maxAge must be a number');
      var now = maxAge ? Date.now() : 0;
      var len = this[LENGTH_CALCULATOR](value, key);

      if (this[CACHE].has(key)) {
        if (len > this[MAX]) {
          _del(this, this[CACHE].get(key));

          return false;
        }

        var node = this[CACHE].get(key);
        var item = node.value; // dispose of the old one before overwriting
        // split out into 2 ifs for better coverage tracking

        if (this[DISPOSE]) {
          if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
        }

        item.now = now;
        item.maxAge = maxAge;
        item.value = value;
        this[LENGTH] += len - item.length;
        item.length = len;
        this.get(key);
        trim(this);
        return true;
      }

      var hit = new Entry(key, value, len, now, maxAge); // oversized objects fall out of cache automatically.

      if (hit.length > this[MAX]) {
        if (this[DISPOSE]) this[DISPOSE](key, value);
        return false;
      }

      this[LENGTH] += hit.length;
      this[LRU_LIST].unshift(hit);
      this[CACHE].set(key, this[LRU_LIST].head);
      trim(this);
      return true;
    }
  }, {
    key: "has",
    value: function has(key) {
      if (!this[CACHE].has(key)) return false;
      var hit = this[CACHE].get(key).value;
      return !isStale(this, hit);
    }
  }, {
    key: "get",
    value: function get(key) {
      return _get(this, key, true);
    }
  }, {
    key: "peek",
    value: function peek(key) {
      return _get(this, key, false);
    }
  }, {
    key: "pop",
    value: function pop() {
      var node = this[LRU_LIST].tail;
      if (!node) return null;

      _del(this, node);

      return node.value;
    }
  }, {
    key: "del",
    value: function del(key) {
      _del(this, this[CACHE].get(key));
    }
  }, {
    key: "load",
    value: function load(arr) {
      // reset the cache
      this.reset();
      var now = Date.now(); // A previous serialized cache has the most recent items first

      for (var l = arr.length - 1; l >= 0; l--) {
        var hit = arr[l];
        var expiresAt = hit.e || 0;
        if (expiresAt === 0) // the item was created without expiration in a non aged cache
          this.set(hit.k, hit.v);else {
          var maxAge = expiresAt - now; // dont add already expired items

          if (maxAge > 0) {
            this.set(hit.k, hit.v, maxAge);
          }
        }
      }
    }
  }, {
    key: "prune",
    value: function prune() {
      var _this4 = this;

      this[CACHE].forEach(function (value, key) {
        return _get(_this4, key, false);
      });
    }
  }]);

  return LRUCache;
}();

var _get = function _get(self, key, doUse) {
  var node = self[CACHE].get(key);

  if (node) {
    var hit = node.value;

    if (isStale(self, hit)) {
      _del(self, node);

      if (!self[ALLOW_STALE]) return undefined;
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
        self[LRU_LIST].unshiftNode(node);
      }
    }

    return hit.value;
  }
};

var isStale = function isStale(self, hit) {
  if (!hit || !hit.maxAge && !self[MAX_AGE]) return false;
  var diff = Date.now() - hit.now;
  return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
};

var trim = function trim(self) {
  if (self[LENGTH] > self[MAX]) {
    for (var walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      var prev = walker.prev;

      _del(self, walker);

      walker = prev;
    }
  }
};

var _del = function _del(self, node) {
  if (node) {
    var hit = node.value;
    if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
    self[LENGTH] -= hit.length;
    self[CACHE].delete(hit.key);
    self[LRU_LIST].removeNode(node);
  }
};

var Entry = /*#__PURE__*/_createClass(function Entry(key, value, length, now, maxAge) {
  _classCallCheck(this, Entry);

  this.key = key;
  this.value = value;
  this.length = length;
  this.now = now;
  this.maxAge = maxAge || 0;
});

var forEachStep = function forEachStep(self, fn, node, thisp) {
  var hit = node.value;

  if (isStale(self, hit)) {
    _del(self, node);

    if (!self[ALLOW_STALE]) hit = undefined;
  }

  if (hit) fn.call(thisp, hit.value, hit.key, self);
};

module.exports = LRUCache;
},{"yallist":"node_modules/yallist/yallist.js"}],"node_modules/js-sdsl/dist/esm/Vector/Vector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __read = void 0 && (void 0).__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};

var __values = void 0 && (void 0).__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

function Vector(container) {
  var _this = this;

  if (container === void 0) {
    container = [];
  }

  var len = 0;
  var vector = [];

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    len = 0;
    vector.length = 0;
  };

  this.front = function () {
    if (this.empty()) return undefined;
    return vector[0];
  };

  this.back = function () {
    if (this.empty()) return undefined;
    return vector[len - 1];
  };

  this.forEach = function (callback) {
    vector.forEach(callback);
  };

  this.getElementByPos = function (pos) {
    if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");
    return vector[pos];
  };

  this.eraseElementByPos = function (pos) {
    if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");

    for (var i = pos; i < len - 1; ++i) vector[i] = vector[i + 1];

    this.popBack();
  };

  this.eraseElementByValue = function (value) {
    var newArr = [];
    this.forEach(function (element) {
      if (element !== value) newArr.push(element);
    });
    newArr.forEach(function (element, index) {
      vector[index] = element;
    });
    var newLen = newArr.length;

    while (len > newLen) this.popBack();
  };

  this.pushBack = function (element) {
    vector.push(element);
    ++len;
  };

  this.popBack = function () {
    vector.pop();
    if (len > 0) --len;
  };

  this.setElementByPos = function (pos, element) {
    if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");
    vector[pos] = element;
  };

  this.insert = function (pos, element, num) {
    if (num === void 0) {
      num = 1;
    }

    if (pos < 0 || pos > len) throw new Error("pos must more than 0 and less than or equal to vector's size");
    vector.splice.apply(vector, __spreadArray([pos, 0], __read(new Array(num).fill(element)), false));
    len += num;
  };

  this.find = function (element) {
    return vector.includes(element);
  };

  this.reverse = function () {
    vector.reverse();
  };

  this.unique = function () {
    var pre;
    var newArr = [];
    this.forEach(function (element, index) {
      if (index === 0 || element !== pre) {
        newArr.push(element);
        pre = element;
      }
    });
    newArr.forEach(function (element, index) {
      vector[index] = element;
    });
    var newLen = newArr.length;

    while (len > newLen) this.popBack();
  };

  this.sort = function (cmp) {
    vector.sort(cmp);
  };

  this[Symbol.iterator] = function () {
    return function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [5
            /*yield**/
            , __values(vector)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    }();
  };

  container.forEach(function (element) {
    return _this.pushBack(element);
  });
  Object.freeze(this);
}

Object.freeze(Vector);
var _default = Vector;
exports.default = _default;
},{}],"node_modules/js-sdsl/dist/esm/Stack/Stack.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function Stack(container) {
  var _this = this;

  if (container === void 0) {
    container = [];
  }

  var len = 0;
  var stack = [];

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    len = 0;
    stack.length = 0;
  };

  this.push = function (element) {
    stack.push(element);
    ++len;
  };

  this.pop = function () {
    stack.pop();
    if (len > 0) --len;
  };

  this.top = function () {
    return stack[len - 1];
  };

  container.forEach(function (element) {
    return _this.push(element);
  });
  Object.freeze(this);
}

Object.freeze(Stack);
var _default = Stack;
exports.default = _default;
},{}],"node_modules/js-sdsl/dist/esm/LinkList/LinkList.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var LinkNode =
/** @class */
function () {
  function LinkNode(element) {
    this.value = undefined;
    this.pre = undefined;
    this.next = undefined;
    this.value = element;
  }

  return LinkNode;
}();

function LinkList(container) {
  var _this = this;

  if (container === void 0) {
    container = [];
  }

  var len = 0;
  var head = undefined;
  var tail = undefined;

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    head = tail = undefined;
    len = 0;
  };

  this.front = function () {
    return head === null || head === void 0 ? void 0 : head.value;
  };

  this.back = function () {
    return tail === null || tail === void 0 ? void 0 : tail.value;
  };

  this.forEach = function (callback) {
    var curNode = head;
    var index = 0;

    while (curNode) {
      if (curNode.value === undefined) throw new Error("unknown error");
      callback(curNode.value, index++);
      curNode = curNode.next;
    }
  };

  this.getElementByPos = function (pos) {
    if (pos < 0 || pos >= len) throw new Error("pos must more then 0 and less then the list length");
    var curNode = head;

    while (pos--) {
      if (!curNode) break;
      curNode = curNode.next;
    }

    if (!curNode || curNode.value === undefined) throw new Error("unknown error");
    return curNode.value;
  };

  this.eraseElementByPos = function (pos) {
    if (pos < 0 || pos >= len) throw new Error("erase pos must more then 0 and less then the list length");
    if (pos === 0) this.popFront();else if (pos === len - 1) this.popBack();else {
      var curNode = head;

      while (pos--) {
        if (!(curNode === null || curNode === void 0 ? void 0 : curNode.next)) throw new Error("unknown error");
        curNode = curNode.next;
      }

      if (!curNode || !curNode.pre || !curNode.next) {
        throw new Error("unknown error");
      }

      var pre = curNode.pre;
      var next = curNode.next;
      next.pre = pre;
      pre.next = next;
      if (len > 0) --len;
    }
  };

  this.eraseElementByValue = function (value) {
    while (head && head.value === value) this.popFront();

    while (tail && tail.value === value) this.popBack();

    if (!head) return;
    var curNode = head;

    while (curNode) {
      if (curNode.value === value) {
        var pre = curNode.pre;
        var next = curNode.next;
        if (next) next.pre = pre;
        if (pre) pre.next = next;
        if (len > 0) --len;
      }

      curNode = curNode.next;
    }
  };

  this.pushBack = function (element) {
    if (element === null || element === undefined) {
      throw new Error("you can't push null or undefined here");
    }

    ++len;
    var newTail = new LinkNode(element);

    if (!tail) {
      head = tail = newTail;
    } else {
      tail.next = newTail;
      newTail.pre = tail;
      tail = newTail;
    }
  };

  this.popBack = function () {
    if (!tail) return;
    if (len > 0) --len;
    if (!tail) return;

    if (head === tail) {
      head = tail = undefined;
    } else {
      tail = tail.pre;
      if (tail) tail.next = undefined;
    }
  };

  this.setElementByPos = function (pos, element) {
    if (element === null || element === undefined) {
      throw new Error("you can't set null or undefined here");
    }

    if (pos < 0 || pos >= len) throw new Error("pos must more then 0 and less then the list length");
    var curNode = head;

    while (pos--) {
      if (!curNode) throw new Error("unknown error");
      curNode = curNode.next;
    }

    if (curNode) curNode.value = element;
  };
  /**
   * @param {number} pos insert element before pos, should in [0, list.size]
   * @param {any} element the element you want to insert
   * @param {number} [num = 1] the nums you want to insert
   */


  this.insert = function (pos, element, num) {
    if (num === void 0) {
      num = 1;
    }

    if (element === null || element === undefined) {
      throw new Error("you can't insert null or undefined here");
    }

    if (pos < 0 || pos > len) throw new Error("insert pos must more then 0 and less then or equal to the list length");
    if (num < 0) throw new Error("insert size must more than 0");

    if (pos === 0) {
      while (num--) this.pushFront(element);
    } else if (pos === len) {
      while (num--) this.pushBack(element);
    } else {
      var curNode = head;

      for (var i = 1; i < pos; ++i) {
        if (!(curNode === null || curNode === void 0 ? void 0 : curNode.next)) throw new Error("unknown error");
        curNode = curNode === null || curNode === void 0 ? void 0 : curNode.next;
      }

      if (!curNode) {
        throw new Error("unknown error");
      }

      var next = curNode.next;
      len += num;

      while (num--) {
        curNode.next = new LinkNode(element);
        curNode.next.pre = curNode;
        curNode = curNode.next;
      }

      curNode.next = next;
      if (next) next.pre = curNode;
    }
  };

  this.find = function (element) {
    var curNode = head;

    while (curNode) {
      if (curNode.value === element) return true;
      curNode = curNode.next;
    }

    return false;
  };

  this.reverse = function () {
    var pHead = head;
    var pTail = tail;
    var cnt = 0;

    while (pHead && pTail && cnt * 2 < len) {
      var tmp = pHead.value;
      pHead.value = pTail.value;
      pTail.value = tmp;
      pHead = pHead.next;
      pTail = pTail.pre;
      ++cnt;
    }
  };

  this.unique = function () {
    var curNode = head;

    while (curNode) {
      var tmpNode = curNode;

      while (tmpNode && tmpNode.next && tmpNode.value === tmpNode.next.value) {
        tmpNode = tmpNode.next;
        if (len > 0) --len;
      }

      curNode.next = tmpNode.next;
      if (curNode.next) curNode.next.pre = curNode;
      curNode = curNode.next;
    }
  };

  this.sort = function (cmp) {
    var arr = [];
    this.forEach(function (element) {
      arr.push(element);
    });
    arr.sort(cmp);
    var curNode = head;
    arr.forEach(function (element) {
      if (curNode) {
        curNode.value = element;
        curNode = curNode.next;
      }
    });
  };

  this.pushFront = function (element) {
    if (element === null || element === undefined) {
      throw new Error("you can't push null or undefined here");
    }

    ++len;
    var newHead = new LinkNode(element);

    if (!head) {
      head = tail = newHead;
    } else {
      newHead.next = head;
      head.pre = newHead;
      head = newHead;
    }
  };

  this.popFront = function () {
    if (!head) return;
    if (len > 0) --len;
    if (!head) return;

    if (head === tail) {
      head = tail = undefined;
    } else {
      head = head.next;
      if (head) head.pre = undefined;
    }
  };
  /**
   * merge two sorted lists
   * @param list other list
   */


  this.merge = function (list) {
    var _this = this;

    var curNode = head;
    list.forEach(function (element) {
      while (curNode && curNode.value !== undefined && curNode.value <= element) {
        curNode = curNode.next;
      }

      if (curNode === undefined) {
        _this.pushBack(element);

        curNode = tail;
      } else if (curNode === head) {
        _this.pushFront(element);

        curNode = head;
      } else {
        ++len;
        var pre = curNode.pre;

        if (pre) {
          pre.next = new LinkNode(element);
          pre.next.pre = pre;
          pre.next.next = curNode;
          if (curNode) curNode.pre = pre.next;
        }
      }
    });
  };

  this[Symbol.iterator] = function () {
    return function () {
      var curNode;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            curNode = head;
            _a.label = 1;

          case 1:
            if (!(curNode !== undefined)) return [3
            /*break*/
            , 3];
            if (!curNode.value) throw new Error("unknown error");
            return [4
            /*yield*/
            , curNode.value];

          case 2:
            _a.sent();

            curNode = curNode.next;
            return [3
            /*break*/
            , 1];

          case 3:
            return [2
            /*return*/
            ];
        }
      });
    }();
  };

  container.forEach(function (element) {
    return _this.pushBack(element);
  });
  Object.freeze(this);
}

Object.freeze(LinkList);
var _default = LinkList;
exports.default = _default;
},{}],"node_modules/js-sdsl/dist/esm/Queue/Queue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _LinkList = _interopRequireDefault(require("../LinkList/LinkList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Queue(container) {
  if (container === void 0) {
    container = [];
  }

  var queue = new _LinkList.default(container);

  this.size = function () {
    return queue.size();
  };

  this.empty = function () {
    return queue.empty();
  };

  this.clear = function () {
    queue.clear();
  };

  this.push = function (element) {
    queue.pushBack(element);
  };

  this.pop = function () {
    queue.popFront();
  };

  this.front = function () {
    return queue.front();
  };

  Object.freeze(this);
}

Object.freeze(Queue);
var _default = Queue;
exports.default = _default;
},{"../LinkList/LinkList":"node_modules/js-sdsl/dist/esm/LinkList/LinkList.js"}],"node_modules/js-sdsl/dist/esm/Deque/Deque.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Deque.sigma = 3; // growth factor

Deque.bucketSize = 5000;

function Deque(container) {
  var _this = this;

  if (container === void 0) {
    container = [];
  }

  var map = [];
  var first = 0;
  var curFirst = 0;
  var last = 0;
  var curLast = 0;
  var bucketNum = 0;
  var len = 0;

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    first = last = curFirst = curLast = bucketNum = len = 0;
    reAllocate.call(this, Deque.bucketSize);
    len = 0;
  };

  this.front = function () {
    return map[first][curFirst];
  };

  this.back = function () {
    return map[last][curLast];
  };

  this.forEach = function (callback) {
    if (this.empty()) return;
    var index = 0;

    if (first === last) {
      for (var i = curFirst; i <= curLast; ++i) {
        callback(map[first][i], index++);
      }

      return;
    }

    for (var i = curFirst; i < Deque.bucketSize; ++i) {
      callback(map[first][i], index++);
    }

    for (var i = first + 1; i < last; ++i) {
      for (var j = 0; j < Deque.bucketSize; ++j) {
        callback(map[i][j], index++);
      }
    }

    for (var i = 0; i <= curLast; ++i) {
      callback(map[last][i], index++);
    }
  };

  var getElementIndex = function (pos) {
    var curFirstIndex = first * Deque.bucketSize + curFirst;
    var curNodeIndex = curFirstIndex + pos;
    var curLastIndex = last * Deque.bucketSize + curLast;
    if (curNodeIndex < curFirstIndex || curNodeIndex > curLastIndex) throw new Error("pos should more than 0 and less than queue's size");
    var curNodeBucketIndex = Math.floor(curNodeIndex / Deque.bucketSize);
    var curNodePointerIndex = curNodeIndex % Deque.bucketSize;
    return {
      curNodeBucketIndex: curNodeBucketIndex,
      curNodePointerIndex: curNodePointerIndex
    };
  };
  /**
   * @param pos index from 0 to size - 1
   */


  this.getElementByPos = function (pos) {
    var _a = getElementIndex(pos),
        curNodeBucketIndex = _a.curNodeBucketIndex,
        curNodePointerIndex = _a.curNodePointerIndex;

    return map[curNodeBucketIndex][curNodePointerIndex];
  };

  this.eraseElementByPos = function (pos) {
    var _this = this;

    if (pos < 0 || pos > len) throw new Error("pos should more than 0 and less than queue's size");
    if (pos === 0) this.popFront();else if (pos === this.size()) this.popBack();else {
      var arr = [];

      for (var i = pos + 1; i < len; ++i) {
        arr.push(this.getElementByPos(i));
      }

      this.cut(pos);
      this.popBack();
      arr.forEach(function (element) {
        return _this.pushBack(element);
      });
    }
  };

  this.eraseElementByValue = function (value) {
    if (this.empty()) return;
    var arr = [];
    this.forEach(function (element) {
      if (element !== value) {
        arr.push(element);
      }
    });
    var _len = arr.length;

    for (var i = 0; i < _len; ++i) this.setElementByPos(i, arr[i]);

    this.cut(_len - 1);
  };

  var reAllocate = function (originalSize) {
    var newMap = [];
    var needSize = originalSize * Deque.sigma;
    var newBucketNum = Math.max(Math.ceil(needSize / Deque.bucketSize), 2);

    for (var i = 0; i < newBucketNum; ++i) {
      newMap.push(new Array(Deque.bucketSize));
    }

    var needBucketNum = Math.ceil(originalSize / Deque.bucketSize);
    var newFirst = Math.floor(newBucketNum / 2) - Math.floor(needBucketNum / 2);
    var newLast = newFirst,
        newCurLast = 0;

    if (this.size()) {
      for (var i = 0; i < needBucketNum; ++i) {
        for (var j = 0; j < Deque.bucketSize; ++j) {
          newMap[newFirst + i][j] = this.front();
          this.popFront();

          if (this.empty()) {
            newLast = newFirst + i;
            newCurLast = j;
            break;
          }
        }

        if (this.empty()) break;
      }
    }

    map = newMap;
    first = newFirst;
    curFirst = 0;
    last = newLast;
    curLast = newCurLast;
    bucketNum = newBucketNum;
    len = originalSize;
  };

  this.pushBack = function (element) {
    if (!this.empty()) {
      if (last === bucketNum - 1 && curLast === Deque.bucketSize - 1) {
        reAllocate.call(this, this.size());
      }

      if (curLast < Deque.bucketSize - 1) {
        ++curLast;
      } else if (last < bucketNum - 1) {
        ++last;
        curLast = 0;
      }
    }

    ++len;
    map[last][curLast] = element;
  };

  this.popBack = function () {
    if (this.empty()) return;

    if (this.size() !== 1) {
      if (curLast > 0) {
        --curLast;
      } else if (first < last) {
        --last;
        curLast = Deque.bucketSize - 1;
      }
    }

    if (len > 0) --len;
  };

  this.setElementByPos = function (pos, element) {
    var _a = getElementIndex(pos),
        curNodeBucketIndex = _a.curNodeBucketIndex,
        curNodePointerIndex = _a.curNodePointerIndex;

    map[curNodeBucketIndex][curNodePointerIndex] = element;
  };
  /**
   * @param {number} pos insert element before pos, should in [0, queue.size]
   * @param {any} element the element you want to insert
   * @param {number} [num = 1] the nums you want to insert
   */


  this.insert = function (pos, element, num) {
    var _this = this;

    if (num === void 0) {
      num = 1;
    }

    if (pos === 0) {
      while (num--) this.pushFront(element);
    } else if (pos === this.size()) {
      while (num--) this.pushBack(element);
    } else {
      var arr = [];

      for (var i = pos; i < len; ++i) {
        arr.push(this.getElementByPos(i));
      }

      this.cut(pos - 1);

      for (var i = 0; i < num; ++i) this.pushBack(element);

      arr.forEach(function (element) {
        return _this.pushBack(element);
      });
    }
  };

  this.find = function (element) {
    if (first === last) {
      for (var i = curFirst; i <= curLast; ++i) {
        if (map[first][i] === element) return true;
      }

      return false;
    }

    for (var i = curFirst; i < Deque.bucketSize; ++i) {
      if (map[first][i] === element) return true;
    }

    for (var i = first + 1; i < last; ++i) {
      for (var j = 0; j < Deque.bucketSize; ++j) {
        if (map[i][j] === element) return true;
      }
    }

    for (var i = 0; i <= curLast; ++i) {
      if (map[last][i] === element) return true;
    }

    return false;
  };

  this.reverse = function () {
    var l = 0,
        r = len - 1;

    while (l < r) {
      var tmp = this.getElementByPos(l);
      this.setElementByPos(l, this.getElementByPos(r));
      this.setElementByPos(r, tmp);
      ++l;
      --r;
    }
  };

  this.unique = function () {
    if (this.empty()) return;
    var arr = [];
    var pre = this.front();
    this.forEach(function (element, index) {
      if (index === 0 || element !== pre) {
        arr.push(element);
        pre = element;
      }
    });

    for (var i = 0; i < len; ++i) {
      this.setElementByPos(i, arr[i]);
    }

    this.cut(arr.length - 1);
  };

  this.sort = function (cmp) {
    var arr = [];
    this.forEach(function (element) {
      arr.push(element);
    });
    arr.sort(cmp);

    for (var i = 0; i < len; ++i) this.setElementByPos(i, arr[i]);
  };

  this.pushFront = function (element) {
    if (!this.empty()) {
      if (first === 0 && curFirst === 0) {
        reAllocate.call(this, this.size());
      }

      if (curFirst > 0) {
        --curFirst;
      } else if (first > 0) {
        --first;
        curFirst = Deque.bucketSize - 1;
      }
    }

    ++len;
    map[first][curFirst] = element;
  };

  this.popFront = function () {
    if (this.empty()) return;

    if (this.size() !== 1) {
      if (curFirst < Deque.bucketSize - 1) {
        ++curFirst;
      } else if (first < last) {
        ++first;
        curFirst = 0;
      }
    }

    if (len > 0) --len;
  };
  /**
   * reduces memory usage by freeing unused memory
   */


  this.shrinkToFit = function () {
    var _this = this;

    var arr = [];
    this.forEach(function (element) {
      arr.push(element);
    });
    var _len = arr.length;
    map = [];
    var bucketNum = Math.ceil(_len / Deque.bucketSize);

    for (var i = 0; i < bucketNum; ++i) {
      map.push(new Array(Deque.bucketSize));
    }

    this.clear();
    arr.forEach(function (element) {
      return _this.pushBack(element);
    });
  };
  /**
   * @param pos cut elements after pos
   */


  this.cut = function (pos) {
    if (pos < 0) {
      this.clear();
      return;
    }

    var _a = getElementIndex(pos),
        curNodeBucketIndex = _a.curNodeBucketIndex,
        curNodePointerIndex = _a.curNodePointerIndex;

    last = curNodeBucketIndex;
    curLast = curNodePointerIndex;
    len = pos + 1;
  };

  this[Symbol.iterator] = function () {
    return function () {
      var i, i, i, j, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (len === 0) return [2
            /*return*/
            ];
            if (!(first === last)) return [3
            /*break*/
            , 5];
            i = curFirst;
            _a.label = 1;

          case 1:
            if (!(i <= curLast)) return [3
            /*break*/
            , 4];
            return [4
            /*yield*/
            , map[first][i]];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            ++i;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];

          case 5:
            i = curFirst;
            _a.label = 6;

          case 6:
            if (!(i < Deque.bucketSize)) return [3
            /*break*/
            , 9];
            return [4
            /*yield*/
            , map[first][i]];

          case 7:
            _a.sent();

            _a.label = 8;

          case 8:
            ++i;
            return [3
            /*break*/
            , 6];

          case 9:
            i = first + 1;
            _a.label = 10;

          case 10:
            if (!(i < last)) return [3
            /*break*/
            , 15];
            j = 0;
            _a.label = 11;

          case 11:
            if (!(j < Deque.bucketSize)) return [3
            /*break*/
            , 14];
            return [4
            /*yield*/
            , map[i][j]];

          case 12:
            _a.sent();

            _a.label = 13;

          case 13:
            ++j;
            return [3
            /*break*/
            , 11];

          case 14:
            ++i;
            return [3
            /*break*/
            , 10];

          case 15:
            i = 0;
            _a.label = 16;

          case 16:
            if (!(i <= curLast)) return [3
            /*break*/
            , 19];
            return [4
            /*yield*/
            , map[last][i]];

          case 17:
            _a.sent();

            _a.label = 18;

          case 18:
            ++i;
            return [3
            /*break*/
            , 16];

          case 19:
            return [2
            /*return*/
            ];
        }
      });
    }();
  };

  (function () {
    var _len = Deque.bucketSize;

    if (container.size) {
      _len = container.size();
    } else if (container.length) {
      _len = container.length;
    }

    var needSize = _len * Deque.sigma;
    bucketNum = Math.ceil(needSize / Deque.bucketSize);
    bucketNum = Math.max(bucketNum, 3);

    for (var i = 0; i < bucketNum; ++i) {
      map.push(new Array(Deque.bucketSize));
    }

    var needBucketNum = Math.ceil(_len / Deque.bucketSize);
    first = Math.floor(bucketNum / 2) - Math.floor(needBucketNum / 2);
    last = first;
    container.forEach(function (element) {
      return _this.pushBack(element);
    });
  })();

  Object.freeze(this);
}

Object.freeze(Deque);
var _default = Deque;
exports.default = _default;
},{}],"node_modules/js-sdsl/dist/esm/PriorityQueue/PriorityQueue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @param container
 * @param cmp default cmp will generate a max heap
 * @constructor
 */
function PriorityQueue(container, cmp) {
  if (container === void 0) {
    container = [];
  }

  cmp = cmp || function (x, y) {
    if (x > y) return -1;
    if (x < y) return 1;
    return 0;
  };

  var priorityQueue = [];
  container.forEach(function (element) {
    return priorityQueue.push(element);
  });
  var len = priorityQueue.length;

  var swap = function (x, y) {
    if (x < 0 || x >= len) throw new Error("unknown error");
    if (y < 0 || y >= len) throw new Error("unknown error");
    var tmp = priorityQueue[x];
    priorityQueue[x] = priorityQueue[y];
    priorityQueue[y] = tmp;
  };

  var adjust = function (parent) {
    if (parent < 0 || parent >= len) throw new Error("unknown error");
    var leftChild = parent * 2 + 1;
    var rightChild = parent * 2 + 2;
    if (leftChild < len && cmp(priorityQueue[parent], priorityQueue[leftChild]) > 0) swap(parent, leftChild);
    if (rightChild < len && cmp(priorityQueue[parent], priorityQueue[rightChild]) > 0) swap(parent, rightChild);
  };

  (function () {
    for (var parent_1 = Math.floor((len - 1) / 2); parent_1 >= 0; --parent_1) {
      var curParent = parent_1;
      var curChild = curParent * 2 + 1;

      while (curChild < len) {
        var leftChild = curChild;
        var rightChild = leftChild + 1;
        var minChild = leftChild;
        if (rightChild < len && cmp(priorityQueue[leftChild], priorityQueue[rightChild]) > 0) minChild = rightChild;
        if (cmp(priorityQueue[curParent], priorityQueue[minChild]) <= 0) break;
        swap(curParent, minChild);
        curParent = minChild;
        curChild = curParent * 2 + 1;
      }
    }
  })();

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    len = 0;
    priorityQueue.length = 0;
  };

  this.push = function (element) {
    priorityQueue.push(element);
    ++len;
    if (len === 1) return;
    var curNode = len - 1;

    while (curNode > 0) {
      var parent_2 = Math.floor((curNode - 1) / 2);
      if (cmp(priorityQueue[parent_2], element) <= 0) break;
      adjust(parent_2);
      curNode = parent_2;
    }
  };

  this.pop = function () {
    if (this.empty()) return;

    if (this.size() === 1) {
      --len;
      return;
    }

    var last = priorityQueue[len - 1];
    --len;
    var parent = 0;

    while (parent < this.size()) {
      var leftChild = parent * 2 + 1;
      var rightChild = parent * 2 + 2;
      if (leftChild >= this.size()) break;
      var minChild = leftChild;
      if (rightChild < this.size() && cmp(priorityQueue[leftChild], priorityQueue[rightChild]) > 0) minChild = rightChild;
      if (cmp(priorityQueue[minChild], last) >= 0) break;
      priorityQueue[parent] = priorityQueue[minChild];
      parent = minChild;
    }

    priorityQueue[parent] = last;
  };

  this.top = function () {
    return priorityQueue[0];
  };

  Object.freeze(this);
}

Object.freeze(PriorityQueue);
var _default = PriorityQueue;
exports.default = _default;
},{}],"node_modules/js-sdsl/dist/esm/Base/TreeNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var TreeNode =
/** @class */
function () {
  function TreeNode(key, value) {
    this.color = true;
    this.key = undefined;
    this.value = undefined;
    this.parent = undefined;
    this.brother = undefined;
    this.leftChild = undefined;
    this.rightChild = undefined;
    this.key = key;
    this.value = value;
  }

  TreeNode.prototype.rotateLeft = function () {
    var PP = this.parent;
    var PB = this.brother;
    var F = this.leftChild;
    var V = this.rightChild;
    if (!V) throw new Error("unknown error");
    var R = V.leftChild;
    var X = V.rightChild;

    if (PP) {
      if (PP.leftChild === this) PP.leftChild = V;else if (PP.rightChild === this) PP.rightChild = V;
    }

    V.parent = PP;
    V.brother = PB;
    V.leftChild = this;
    V.rightChild = X;
    if (PB) PB.brother = V;
    this.parent = V;
    this.brother = X;
    this.leftChild = F;
    this.rightChild = R;

    if (X) {
      X.parent = V;
      X.brother = this;
    }

    if (F) {
      F.parent = this;
      F.brother = R;
    }

    if (R) {
      R.parent = this;
      R.brother = F;
    }

    return V;
  };

  TreeNode.prototype.rotateRight = function () {
    var PP = this.parent;
    var PB = this.brother;
    var F = this.leftChild;
    if (!F) throw new Error("unknown error");
    var V = this.rightChild;
    var D = F.leftChild;
    var K = F.rightChild;

    if (PP) {
      if (PP.leftChild === this) PP.leftChild = F;else if (PP.rightChild === this) PP.rightChild = F;
    }

    F.parent = PP;
    F.brother = PB;
    F.leftChild = D;
    F.rightChild = this;
    if (PB) PB.brother = F;

    if (D) {
      D.parent = F;
      D.brother = this;
    }

    this.parent = F;
    this.brother = D;
    this.leftChild = K;
    this.rightChild = V;

    if (K) {
      K.parent = this;
      K.brother = V;
    }

    if (V) {
      V.parent = this;
      V.brother = K;
    }

    return F;
  };

  TreeNode.prototype.remove = function () {
    if (this.leftChild || this.rightChild) throw new Error("can only remove leaf node");

    if (this.parent) {
      if (this === this.parent.leftChild) this.parent.leftChild = undefined;else if (this === this.parent.rightChild) this.parent.rightChild = undefined;
    }

    if (this.brother) this.brother.brother = undefined;
    this.key = undefined;
    this.value = undefined;
    this.parent = undefined;
    this.brother = undefined;
  };

  TreeNode.TreeNodeColorType = {
    red: true,
    black: false
  };
  return TreeNode;
}();

Object.freeze(TreeNode);
var _default = TreeNode;
exports.default = _default;
},{}],"node_modules/js-sdsl/dist/esm/Set/Set.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TreeNode = _interopRequireDefault(require("../Base/TreeNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __values = void 0 && (void 0).__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

function Set(container, cmp) {
  var _this = this;

  if (container === void 0) {
    container = [];
  }

  cmp = cmp || function (x, y) {
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  };

  var len = 0;
  var root = new _TreeNode.default();
  root.color = _TreeNode.default.TreeNodeColorType.black;

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    len = 0;
    root.key = undefined;
    root.leftChild = root.rightChild = root.brother = root.parent = undefined;
    root.color = _TreeNode.default.TreeNodeColorType.black;
  };

  var findSubTreeMinNode = function (curNode) {
    if (!curNode || curNode.key === undefined) throw new Error("unknown error");
    return curNode.leftChild ? findSubTreeMinNode(curNode.leftChild) : curNode;
  };

  var findSubTreeMaxNode = function (curNode) {
    if (!curNode || curNode.key === undefined) throw new Error("unknown error");
    return curNode.rightChild ? findSubTreeMaxNode(curNode.rightChild) : curNode;
  };

  this.front = function () {
    if (this.empty()) return undefined;
    var minNode = findSubTreeMinNode(root);
    return minNode.key;
  };

  this.back = function () {
    if (this.empty()) return undefined;
    var maxNode = findSubTreeMaxNode(root);
    return maxNode.key;
  };

  this.forEach = function (callback) {
    var e_1, _a;

    var index = 0;

    try {
      for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
        var element = _c.value;
        callback(element, index++);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  this.getElementByPos = function (pos) {
    var e_2, _a;

    if (pos < 0 || pos >= this.size()) throw new Error("pos must more than 0 and less than set's size");
    var index = 0;

    try {
      for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
        var element = _c.value;
        if (index === pos) return element;
        ++index;
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    throw new Error("unknown error");
  };

  var eraseNodeSelfBalance = function (curNode) {
    var parentNode = curNode.parent;

    if (!parentNode) {
      if (curNode === root) return;
      throw new Error("unknown error");
    }

    if (curNode.color === _TreeNode.default.TreeNodeColorType.red) {
      curNode.color = _TreeNode.default.TreeNodeColorType.black;
      return;
    }

    var brotherNode = curNode.brother;
    if (!brotherNode) throw new Error("unknown error");

    if (curNode === parentNode.leftChild) {
      if (brotherNode.color === _TreeNode.default.TreeNodeColorType.red) {
        brotherNode.color = _TreeNode.default.TreeNodeColorType.black;
        parentNode.color = _TreeNode.default.TreeNodeColorType.red;
        var newRoot = parentNode.rotateLeft();
        if (root === parentNode) root = newRoot;
        eraseNodeSelfBalance(curNode);
      } else if (brotherNode.color === _TreeNode.default.TreeNodeColorType.black) {
        if (brotherNode.rightChild && brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.red) {
          brotherNode.color = parentNode.color;
          parentNode.color = _TreeNode.default.TreeNodeColorType.black;
          if (brotherNode.rightChild) brotherNode.rightChild.color = _TreeNode.default.TreeNodeColorType.black;
          var newRoot = parentNode.rotateLeft();
          if (root === parentNode) root = newRoot;
          curNode.color = _TreeNode.default.TreeNodeColorType.black;
        } else if ((!brotherNode.rightChild || brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.black) && brotherNode.leftChild && brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.red) {
          brotherNode.color = _TreeNode.default.TreeNodeColorType.red;
          if (brotherNode.leftChild) brotherNode.leftChild.color = _TreeNode.default.TreeNodeColorType.black;
          var newRoot = brotherNode.rotateRight();
          if (root === brotherNode) root = newRoot;
          eraseNodeSelfBalance(curNode);
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.black)) {
          brotherNode.color = _TreeNode.default.TreeNodeColorType.red;
          eraseNodeSelfBalance(parentNode);
        }
      }
    } else if (curNode === parentNode.rightChild) {
      if (brotherNode.color === _TreeNode.default.TreeNodeColorType.red) {
        brotherNode.color = _TreeNode.default.TreeNodeColorType.black;
        parentNode.color = _TreeNode.default.TreeNodeColorType.red;
        var newRoot = parentNode.rotateRight();
        if (root === parentNode) root = newRoot;
        eraseNodeSelfBalance(curNode);
      } else if (brotherNode.color === _TreeNode.default.TreeNodeColorType.black) {
        if (brotherNode.leftChild && brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.red) {
          brotherNode.color = parentNode.color;
          parentNode.color = _TreeNode.default.TreeNodeColorType.black;
          if (brotherNode.leftChild) brotherNode.leftChild.color = _TreeNode.default.TreeNodeColorType.black;
          var newRoot = parentNode.rotateRight();
          if (root === parentNode) root = newRoot;
          curNode.color = _TreeNode.default.TreeNodeColorType.black;
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.black) && brotherNode.rightChild && brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.red) {
          brotherNode.color = _TreeNode.default.TreeNodeColorType.red;
          if (brotherNode.rightChild) brotherNode.rightChild.color = _TreeNode.default.TreeNodeColorType.black;
          var newRoot = brotherNode.rotateLeft();
          if (root === brotherNode) root = newRoot;
          eraseNodeSelfBalance(curNode);
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.black)) {
          brotherNode.color = _TreeNode.default.TreeNodeColorType.red;
          eraseNodeSelfBalance(parentNode);
        }
      }
    }
  };

  var eraseNode = function (curNode) {
    var swapNode = curNode;

    while (swapNode.leftChild || swapNode.rightChild) {
      if (swapNode.rightChild) {
        swapNode = findSubTreeMinNode(swapNode.rightChild);
        var tmpKey = curNode.key;
        curNode.key = swapNode.key;
        swapNode.key = tmpKey;
        curNode = swapNode;
      }

      if (swapNode.leftChild) {
        swapNode = findSubTreeMaxNode(swapNode.leftChild);
        var tmpKey = curNode.key;
        curNode.key = swapNode.key;
        swapNode.key = tmpKey;
        curNode = swapNode;
      }
    }

    eraseNodeSelfBalance(swapNode);
    if (swapNode) swapNode.remove();
    --len;
    root.color = _TreeNode.default.TreeNodeColorType.black;
  };

  var inOrderTraversal = function (curNode, callback) {
    if (!curNode || curNode.key === undefined) return false;
    var ifReturn = inOrderTraversal(curNode.leftChild, callback);
    if (ifReturn) return true;
    if (callback(curNode)) return true;
    return inOrderTraversal(curNode.rightChild, callback);
  };

  this.eraseElementByPos = function (pos) {
    if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than set's size");
    var index = 0;
    inOrderTraversal(root, function (curNode) {
      if (pos === index) {
        eraseNode(curNode);
        return true;
      }

      ++index;
      return false;
    });
  };

  this.eraseElementByValue = function (value) {
    if (this.empty()) return;
    var curNode = findElementPos(root, value);
    if (curNode === undefined || curNode.key === undefined || cmp(curNode.key, value) !== 0) return;
    eraseNode(curNode);
  };

  var findInsertPos = function (curNode, element) {
    if (!curNode || curNode.key === undefined) throw new Error("unknown error");
    var cmpResult = cmp(element, curNode.key);

    if (cmpResult < 0) {
      if (!curNode.leftChild) {
        curNode.leftChild = new _TreeNode.default();
        curNode.leftChild.parent = curNode;
        curNode.leftChild.brother = curNode.rightChild;
        if (curNode.rightChild) curNode.rightChild.brother = curNode.leftChild;
        return curNode.leftChild;
      }

      return findInsertPos(curNode.leftChild, element);
    } else if (cmpResult > 0) {
      if (!curNode.rightChild) {
        curNode.rightChild = new _TreeNode.default();
        curNode.rightChild.parent = curNode;
        curNode.rightChild.brother = curNode.leftChild;
        if (curNode.leftChild) curNode.leftChild.brother = curNode.rightChild;
        return curNode.rightChild;
      }

      return findInsertPos(curNode.rightChild, element);
    }

    return curNode;
  };

  var insertNodeSelfBalance = function (curNode) {
    var parentNode = curNode.parent;

    if (!parentNode) {
      if (curNode === root) return;
      throw new Error("unknown error");
    }

    if (parentNode.color === _TreeNode.default.TreeNodeColorType.black) return;

    if (parentNode.color === _TreeNode.default.TreeNodeColorType.red) {
      var uncleNode = parentNode.brother;
      var grandParent = parentNode.parent;
      if (!grandParent) throw new Error("unknown error");

      if (uncleNode && uncleNode.color === _TreeNode.default.TreeNodeColorType.red) {
        uncleNode.color = parentNode.color = _TreeNode.default.TreeNodeColorType.black;
        grandParent.color = _TreeNode.default.TreeNodeColorType.red;
        insertNodeSelfBalance(grandParent);
      } else if (!uncleNode || uncleNode.color === _TreeNode.default.TreeNodeColorType.black) {
        if (parentNode === grandParent.leftChild) {
          if (curNode === parentNode.leftChild) {
            parentNode.color = _TreeNode.default.TreeNodeColorType.black;
            grandParent.color = _TreeNode.default.TreeNodeColorType.red;
            var newRoot = grandParent.rotateRight();
            if (grandParent === root) root = newRoot;
          } else if (curNode === parentNode.rightChild) {
            var newRoot = parentNode.rotateLeft();
            if (grandParent === root) root = newRoot;
            insertNodeSelfBalance(parentNode);
          }
        } else if (parentNode === grandParent.rightChild) {
          if (curNode === parentNode.leftChild) {
            var newRoot = parentNode.rotateRight();
            if (grandParent === root) root = newRoot;
            insertNodeSelfBalance(parentNode);
          } else if (curNode === parentNode.rightChild) {
            parentNode.color = _TreeNode.default.TreeNodeColorType.black;
            grandParent.color = _TreeNode.default.TreeNodeColorType.red;
            var newRoot = grandParent.rotateLeft();
            if (grandParent === root) root = newRoot;
          }
        }
      }
    }
  };

  this.insert = function (element) {
    if (element === null || element === undefined) {
      throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
    }

    if (this.empty()) {
      ++len;
      root.key = element;
      root.color = _TreeNode.default.TreeNodeColorType.black;
      return;
    }

    var curNode = findInsertPos(root, element);
    if (curNode.key !== undefined && cmp(curNode.key, element) === 0) return;
    ++len;
    curNode.key = element;
    insertNodeSelfBalance(curNode);
    root.color = _TreeNode.default.TreeNodeColorType.black;
  };

  var findElementPos = function (curNode, element) {
    if (!curNode || curNode.key === undefined) return undefined;
    var cmpResult = cmp(element, curNode.key);
    if (cmpResult < 0) return findElementPos(curNode.leftChild, element);else if (cmpResult > 0) return findElementPos(curNode.rightChild, element);
    return curNode;
  };

  this.find = function (element) {
    var curNode = findElementPos(root, element);
    return curNode !== undefined && curNode.key !== undefined && cmp(curNode.key, element) === 0;
  };

  var _lowerBound = function (curNode, key) {
    if (!curNode || curNode.key === undefined) return undefined;
    var cmpResult = cmp(curNode.key, key);
    if (cmpResult === 0) return curNode.key;
    if (cmpResult < 0) return _lowerBound(curNode.rightChild, key);

    var res = _lowerBound(curNode.leftChild, key);

    if (res !== undefined) return res;
    return curNode.key;
  };

  this.lowerBound = function (key) {
    return _lowerBound(root, key);
  };

  var _upperBound = function (curNode, key) {
    if (!curNode || curNode.key === undefined) return undefined;
    var cmpResult = cmp(curNode.key, key);
    if (cmpResult <= 0) return _upperBound(curNode.rightChild, key);

    var res = _upperBound(curNode.leftChild, key);

    if (res !== undefined) return res;
    return curNode.key;
  };

  this.upperBound = function (key) {
    return _upperBound(root, key);
  };

  var _reverseLowerBound = function (curNode, key) {
    if (!curNode || curNode.key === undefined) return undefined;
    var cmpResult = cmp(curNode.key, key);
    if (cmpResult === 0) return curNode.key;
    if (cmpResult > 0) return _reverseLowerBound(curNode.leftChild, key);

    var res = _reverseLowerBound(curNode.rightChild, key);

    if (res !== undefined) return res;
    return curNode.key;
  };

  this.reverseLowerBound = function (key) {
    return _reverseLowerBound(root, key);
  };

  var _reverseUpperBound = function (curNode, key) {
    if (!curNode || curNode.key === undefined) return undefined;
    var cmpResult = cmp(curNode.key, key);
    if (cmpResult >= 0) return _reverseUpperBound(curNode.leftChild, key);

    var res = _reverseUpperBound(curNode.rightChild, key);

    if (res !== undefined) return res;
    return curNode.key;
  };

  this.reverseUpperBound = function (key) {
    return _reverseUpperBound(root, key);
  }; // waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
  // (https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations)


  this.union = function (other) {
    var _this = this;

    other.forEach(function (element) {
      return _this.insert(element);
    });
  };

  this.getHeight = function () {
    if (this.empty()) return 0;

    var traversal = function (curNode) {
      if (!curNode) return 1;
      return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
    };

    return traversal(root);
  };

  var iterationFunc = function (curNode) {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!curNode || curNode.key === undefined) return [2
          /*return*/
          ];
          return [5
          /*yield**/
          , __values(iterationFunc(curNode.leftChild))];

        case 1:
          _a.sent();

          return [4
          /*yield*/
          , curNode.key];

        case 2:
          _a.sent();

          return [5
          /*yield**/
          , __values(iterationFunc(curNode.rightChild))];

        case 3:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  };

  this[Symbol.iterator] = function () {
    return iterationFunc(root);
  };

  container.forEach(function (element) {
    return _this.insert(element);
  });
  Object.freeze(this);
}

Object.freeze(Set);
var _default = Set;
exports.default = _default;
},{"../Base/TreeNode":"node_modules/js-sdsl/dist/esm/Base/TreeNode.js"}],"node_modules/js-sdsl/dist/esm/Map/Map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TreeNode = _interopRequireDefault(require("../Base/TreeNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __values = void 0 && (void 0).__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

function Map(container, cmp) {
  var _this = this;

  if (container === void 0) {
    container = [];
  }

  cmp = cmp || function (x, y) {
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  };

  var len = 0;
  var root = new _TreeNode.default();
  root.color = _TreeNode.default.TreeNodeColorType.black;

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    len = 0;
    root.key = root.value = undefined;
    root.leftChild = root.rightChild = root.brother = undefined;
  };

  var findSubTreeMinNode = function (curNode) {
    if (!curNode || curNode.key === undefined) throw new Error("unknown error");
    return curNode.leftChild ? findSubTreeMinNode(curNode.leftChild) : curNode;
  };

  var findSubTreeMaxNode = function (curNode) {
    if (!curNode || curNode.key === undefined) throw new Error("unknown error");
    return curNode.rightChild ? findSubTreeMaxNode(curNode.rightChild) : curNode;
  };

  this.front = function () {
    if (this.empty()) return undefined;
    var minNode = findSubTreeMinNode(root);
    if (minNode.key === undefined || minNode.value === undefined) throw new Error("unknown error");
    return {
      key: minNode.key,
      value: minNode.value
    };
  };

  this.back = function () {
    if (this.empty()) return undefined;
    var maxNode = findSubTreeMaxNode(root);
    if (maxNode.key === undefined || maxNode.value === undefined) throw new Error("unknown error");
    return {
      key: maxNode.key,
      value: maxNode.value
    };
  };

  this.forEach = function (callback) {
    var e_1, _a;

    var index = 0;

    try {
      for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
        var pair = _c.value;
        callback(pair, index++);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  this.getElementByPos = function (pos) {
    var e_2, _a;

    if (pos < 0 || pos >= this.size()) throw new Error("pos must more than 0 and less than set's size");
    var index = 0;

    try {
      for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
        var pair = _c.value;
        if (index === pos) return pair;
        ++index;
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    throw new Error("unknown Error");
  };

  var _lowerBound = function (curNode, key) {
    if (!curNode || curNode.key === undefined || curNode.value === undefined) return undefined;
    var cmpResult = cmp(curNode.key, key);
    if (cmpResult === 0) return {
      key: curNode.key,
      value: curNode.value
    };
    if (cmpResult < 0) return _lowerBound(curNode.rightChild, key);
    return _lowerBound(curNode.leftChild, key) || {
      key: curNode.key,
      value: curNode.value
    };
  };

  this.lowerBound = function (key) {
    return _lowerBound(root, key);
  };

  var _upperBound = function (curNode, key) {
    if (!curNode || curNode.key === undefined || curNode.value === undefined) return undefined;
    var cmpResult = cmp(curNode.key, key);
    if (cmpResult <= 0) return _upperBound(curNode.rightChild, key);
    return _upperBound(curNode.leftChild, key) || {
      key: curNode.key,
      value: curNode.value
    };
  };

  this.upperBound = function (key) {
    return _upperBound(root, key);
  };

  var _reverseLowerBound = function (curNode, key) {
    if (!curNode || curNode.key === undefined || curNode.value === undefined) return undefined;
    var cmpResult = cmp(curNode.key, key);
    if (cmpResult === 0) return {
      key: curNode.key,
      value: curNode.value
    };
    if (cmpResult > 0) return _reverseLowerBound(curNode.leftChild, key);
    return _reverseLowerBound(curNode.rightChild, key) || {
      key: curNode.key,
      value: curNode.value
    };
  };

  this.reverseLowerBound = function (key) {
    return _reverseLowerBound(root, key);
  };

  var _reverseUpperBound = function (curNode, key) {
    if (!curNode || curNode.key === undefined || curNode.value === undefined) return undefined;
    var cmpResult = cmp(curNode.key, key);
    if (cmpResult >= 0) return _reverseUpperBound(curNode.leftChild, key);
    return _reverseUpperBound(curNode.rightChild, key) || {
      key: curNode.key,
      value: curNode.value
    };
  };

  this.reverseUpperBound = function (key) {
    return _reverseUpperBound(root, key);
  };

  var eraseNodeSelfBalance = function (curNode) {
    var parentNode = curNode.parent;

    if (!parentNode) {
      if (curNode === root) return;
      throw new Error("unknown error");
    }

    if (curNode.color === _TreeNode.default.TreeNodeColorType.red) {
      curNode.color = _TreeNode.default.TreeNodeColorType.black;
      return;
    }

    var brotherNode = curNode.brother;
    if (!brotherNode) throw new Error("unknown error");

    if (curNode === parentNode.leftChild) {
      if (brotherNode.color === _TreeNode.default.TreeNodeColorType.red) {
        brotherNode.color = _TreeNode.default.TreeNodeColorType.black;
        parentNode.color = _TreeNode.default.TreeNodeColorType.red;
        var newRoot = parentNode.rotateLeft();
        if (root === parentNode) root = newRoot;
        eraseNodeSelfBalance(curNode);
      } else if (brotherNode.color === _TreeNode.default.TreeNodeColorType.black) {
        if (brotherNode.rightChild && brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.red) {
          brotherNode.color = parentNode.color;
          parentNode.color = _TreeNode.default.TreeNodeColorType.black;
          if (brotherNode.rightChild) brotherNode.rightChild.color = _TreeNode.default.TreeNodeColorType.black;
          var newRoot = parentNode.rotateLeft();
          if (root === parentNode) root = newRoot;
          curNode.color = _TreeNode.default.TreeNodeColorType.black;
        } else if ((!brotherNode.rightChild || brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.black) && brotherNode.leftChild && brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.red) {
          brotherNode.color = _TreeNode.default.TreeNodeColorType.red;
          if (brotherNode.leftChild) brotherNode.leftChild.color = _TreeNode.default.TreeNodeColorType.black;
          var newRoot = brotherNode.rotateRight();
          if (root === brotherNode) root = newRoot;
          eraseNodeSelfBalance(curNode);
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.black)) {
          brotherNode.color = _TreeNode.default.TreeNodeColorType.red;
          eraseNodeSelfBalance(parentNode);
        }
      }
    } else if (curNode === parentNode.rightChild) {
      if (brotherNode.color === _TreeNode.default.TreeNodeColorType.red) {
        brotherNode.color = _TreeNode.default.TreeNodeColorType.black;
        parentNode.color = _TreeNode.default.TreeNodeColorType.red;
        var newRoot = parentNode.rotateRight();
        if (root === parentNode) root = newRoot;
        eraseNodeSelfBalance(curNode);
      } else if (brotherNode.color === _TreeNode.default.TreeNodeColorType.black) {
        if (brotherNode.leftChild && brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.red) {
          brotherNode.color = parentNode.color;
          parentNode.color = _TreeNode.default.TreeNodeColorType.black;
          if (brotherNode.leftChild) brotherNode.leftChild.color = _TreeNode.default.TreeNodeColorType.black;
          var newRoot = parentNode.rotateRight();
          if (root === parentNode) root = newRoot;
          curNode.color = _TreeNode.default.TreeNodeColorType.black;
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.black) && brotherNode.rightChild && brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.red) {
          brotherNode.color = _TreeNode.default.TreeNodeColorType.red;
          if (brotherNode.rightChild) brotherNode.rightChild.color = _TreeNode.default.TreeNodeColorType.black;
          var newRoot = brotherNode.rotateLeft();
          if (root === brotherNode) root = newRoot;
          eraseNodeSelfBalance(curNode);
        } else if ((!brotherNode.leftChild || brotherNode.leftChild.color === _TreeNode.default.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === _TreeNode.default.TreeNodeColorType.black)) {
          brotherNode.color = _TreeNode.default.TreeNodeColorType.red;
          eraseNodeSelfBalance(parentNode);
        }
      }
    }
  };

  var eraseNode = function (curNode) {
    var swapNode = curNode;

    while (swapNode.leftChild || swapNode.rightChild) {
      if (swapNode.rightChild) {
        swapNode = findSubTreeMinNode(swapNode.rightChild);
        var tmpKey = curNode.key;
        curNode.key = swapNode.key;
        swapNode.key = tmpKey;
        var tmpValue = curNode.value;
        curNode.value = swapNode.value;
        swapNode.value = tmpValue;
        curNode = swapNode;
      }

      if (swapNode.leftChild) {
        swapNode = findSubTreeMaxNode(swapNode.leftChild);
        var tmpKey = curNode.key;
        curNode.key = swapNode.key;
        swapNode.key = tmpKey;
        var tmpValue = curNode.value;
        curNode.value = swapNode.value;
        swapNode.value = tmpValue;
        curNode = swapNode;
      }
    }

    eraseNodeSelfBalance(swapNode);
    if (swapNode) swapNode.remove();
    --len;
    root.color = _TreeNode.default.TreeNodeColorType.black;
  };

  var inOrderTraversal = function (curNode, callback) {
    if (!curNode || curNode.key === undefined) return false;
    var ifReturn = inOrderTraversal(curNode.leftChild, callback);
    if (ifReturn) return true;
    if (callback(curNode)) return true;
    return inOrderTraversal(curNode.rightChild, callback);
  };

  this.eraseElementByPos = function (pos) {
    if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than set's size");
    var index = 0;
    inOrderTraversal(root, function (curNode) {
      if (pos === index) {
        eraseNode(curNode);
        return true;
      }

      ++index;
      return false;
    });
  };

  this.eraseElementByKey = function (key) {
    if (this.empty()) return;
    var curNode = findElementPos(root, key);
    if (curNode === undefined || curNode.key === undefined || cmp(curNode.key, key) !== 0) return;
    eraseNode(curNode);
  };

  var findInsertPos = function (curNode, element) {
    if (!curNode || curNode.key === undefined) throw new Error("unknown error");
    var cmpResult = cmp(element, curNode.key);

    if (cmpResult < 0) {
      if (!curNode.leftChild) {
        curNode.leftChild = new _TreeNode.default();
        curNode.leftChild.parent = curNode;
        curNode.leftChild.brother = curNode.rightChild;
        if (curNode.rightChild) curNode.rightChild.brother = curNode.leftChild;
        return curNode.leftChild;
      }

      return findInsertPos(curNode.leftChild, element);
    } else if (cmpResult > 0) {
      if (!curNode.rightChild) {
        curNode.rightChild = new _TreeNode.default();
        curNode.rightChild.parent = curNode;
        curNode.rightChild.brother = curNode.leftChild;
        if (curNode.leftChild) curNode.leftChild.brother = curNode.rightChild;
        return curNode.rightChild;
      }

      return findInsertPos(curNode.rightChild, element);
    }

    return curNode;
  };

  var insertNodeSelfBalance = function (curNode) {
    var parentNode = curNode.parent;

    if (!parentNode) {
      if (curNode === root) return;
      throw new Error("unknown error");
    }

    if (parentNode.color === _TreeNode.default.TreeNodeColorType.black) return;

    if (parentNode.color === _TreeNode.default.TreeNodeColorType.red) {
      var uncleNode = parentNode.brother;
      var grandParent = parentNode.parent;
      if (!grandParent) throw new Error("unknown error");

      if (uncleNode && uncleNode.color === _TreeNode.default.TreeNodeColorType.red) {
        uncleNode.color = parentNode.color = _TreeNode.default.TreeNodeColorType.black;
        grandParent.color = _TreeNode.default.TreeNodeColorType.red;
        insertNodeSelfBalance(grandParent);
      } else if (!uncleNode || uncleNode.color === _TreeNode.default.TreeNodeColorType.black) {
        if (parentNode === grandParent.leftChild) {
          if (curNode === parentNode.leftChild) {
            parentNode.color = _TreeNode.default.TreeNodeColorType.black;
            grandParent.color = _TreeNode.default.TreeNodeColorType.red;
            var newRoot = grandParent.rotateRight();
            if (grandParent === root) root = newRoot;
          } else if (curNode === parentNode.rightChild) {
            var newRoot = parentNode.rotateLeft();
            if (grandParent === root) root = newRoot;
            insertNodeSelfBalance(parentNode);
          }
        } else if (parentNode === grandParent.rightChild) {
          if (curNode === parentNode.leftChild) {
            var newRoot = parentNode.rotateRight();
            if (grandParent === root) root = newRoot;
            insertNodeSelfBalance(parentNode);
          } else if (curNode === parentNode.rightChild) {
            parentNode.color = _TreeNode.default.TreeNodeColorType.black;
            grandParent.color = _TreeNode.default.TreeNodeColorType.red;
            var newRoot = grandParent.rotateLeft();
            if (grandParent === root) root = newRoot;
          }
        }
      }
    }
  };

  this.setElement = function (key, value) {
    if (key === null || key === undefined) {
      throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
    }

    if (value === null || value === undefined) {
      this.eraseElementByKey(key);
      return;
    }

    if (this.empty()) {
      ++len;
      root.key = key;
      root.value = value;
      root.color = _TreeNode.default.TreeNodeColorType.black;
      return;
    }

    var curNode = findInsertPos(root, key);

    if (curNode.key !== undefined && cmp(curNode.key, key) === 0) {
      curNode.value = value;
      return;
    }

    ++len;
    curNode.key = key;
    curNode.value = value;
    insertNodeSelfBalance(curNode);
    root.color = _TreeNode.default.TreeNodeColorType.black;
  };

  var findElementPos = function (curNode, element) {
    if (!curNode || curNode.key === undefined) return undefined;
    var cmpResult = cmp(element, curNode.key);
    if (cmpResult < 0) return findElementPos(curNode.leftChild, element);else if (cmpResult > 0) return findElementPos(curNode.rightChild, element);
    return curNode;
  };

  this.find = function (element) {
    return !!findElementPos(root, element);
  };

  this.getElementByKey = function (element) {
    var curNode = findElementPos(root, element);
    if ((curNode === null || curNode === void 0 ? void 0 : curNode.key) === undefined || (curNode === null || curNode === void 0 ? void 0 : curNode.value) === undefined) throw new Error("unknown error");
    return curNode.value;
  }; // waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
  // (https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations)


  this.union = function (other) {
    var _this = this;

    other.forEach(function (_a) {
      var key = _a.key,
          value = _a.value;
      return _this.setElement(key, value);
    });
  };

  this.getHeight = function () {
    if (this.empty()) return 0;

    var traversal = function (curNode) {
      if (!curNode) return 1;
      return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
    };

    return traversal(root);
  };

  var iterationFunc = function (curNode) {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!curNode || curNode.key === undefined || curNode.value === undefined) return [2
          /*return*/
          ];
          return [5
          /*yield**/
          , __values(iterationFunc(curNode.leftChild))];

        case 1:
          _a.sent();

          return [4
          /*yield*/
          , {
            key: curNode.key,
            value: curNode.value
          }];

        case 2:
          _a.sent();

          return [5
          /*yield**/
          , __values(iterationFunc(curNode.rightChild))];

        case 3:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  };

  this[Symbol.iterator] = function () {
    return iterationFunc(root);
  };

  container.forEach(function (_a) {
    var key = _a.key,
        value = _a.value;
    return _this.setElement(key, value);
  });
  Object.freeze(this);
}

Object.freeze(Map);
var _default = Map;
exports.default = _default;
},{"../Base/TreeNode":"node_modules/js-sdsl/dist/esm/Base/TreeNode.js"}],"node_modules/js-sdsl/dist/esm/HashSet/HashSet.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Set = _interopRequireDefault(require("../Set/Set"));

var _LinkList = _interopRequireDefault(require("../LinkList/LinkList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __values = void 0 && (void 0).__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

HashSet.initSize = 1 << 4;
HashSet.maxSize = 1 << 30;
HashSet.sigma = 0.75; // default load factor

HashSet.treeifyThreshold = 8;
HashSet.untreeifyThreshold = 6;
HashSet.minTreeifySize = 64;
/**
 * Note that resize is a time-consuming operation, please try to determine the number of buckets before use.
 * @param container Initialize the container
 * @param initBucketNum Initialize the bucket num
 * @param hashFunc Function to map elements to numbers
 * @constructor
 */

function HashSet(container, initBucketNum, hashFunc) {
  var _this = this;

  if (container === void 0) {
    container = [];
  }

  if (initBucketNum === void 0) {
    initBucketNum = HashSet.initSize;
  }

  hashFunc = hashFunc || function (x) {
    var hashCode = 0;
    var str = '';

    if (typeof x === "number") {
      hashCode = Math.floor(x);
      hashCode = (hashCode << 5) - hashCode;
      hashCode = hashCode & hashCode;
    } else {
      if (typeof x !== "string") {
        str = JSON.stringify(x);
      } else str = x;

      for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hashCode = (hashCode << 5) - hashCode + character;
        hashCode = hashCode & hashCode;
      }
    }

    hashCode ^= hashCode >>> 16;
    return hashCode;
  };

  if ((initBucketNum & initBucketNum - 1) !== 0) {
    throw new Error("initBucketNum must be 2 to the power of n");
  }

  var len = 0;
  var hashTable = [];
  var bucketNum = Math.max(HashSet.initSize, Math.min(HashSet.maxSize, initBucketNum));

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    len = 0;
    bucketNum = initBucketNum;
    hashTable = [];
  };

  this.forEach = function (callback) {
    var index = 0;
    hashTable.forEach(function (container) {
      container.forEach(function (element) {
        callback(element, index++);
      });
    });
  };

  var reAllocate = function (originalBucketNum) {
    if (originalBucketNum >= HashSet.maxSize) return;
    bucketNum = originalBucketNum * 2;
    var newHashTable = [];
    hashTable.forEach(function (container, index) {
      if (container.empty()) return;

      if (container instanceof _LinkList.default && container.size() === 1) {
        var element = container.front();
        if (element === undefined) throw new Error("unknown error");
        newHashTable[hashFunc(element) & bucketNum - 1] = new _LinkList.default([element]);
      } else if (container instanceof _Set.default) {
        var lowList_1 = new _LinkList.default();
        var highList_1 = new _LinkList.default();
        container.forEach(function (element) {
          var hashCode = hashFunc(element);

          if ((hashCode & originalBucketNum) === 0) {
            lowList_1.pushBack(element);
          } else highList_1.pushBack(element);
        });
        if (lowList_1.size() > HashSet.untreeifyThreshold) newHashTable[index] = new _Set.default(lowList_1);else if (lowList_1.size()) newHashTable[index] = lowList_1;
        if (highList_1.size() > HashSet.untreeifyThreshold) newHashTable[index + originalBucketNum] = new _Set.default(highList_1);else if (highList_1.size()) newHashTable[index + originalBucketNum] = highList_1;
      } else {
        var lowList_2 = new _LinkList.default();
        var highList_2 = new _LinkList.default();
        container.forEach(function (element) {
          var hashCode = hashFunc(element);

          if ((hashCode & originalBucketNum) === 0) {
            lowList_2.pushBack(element);
          } else highList_2.pushBack(element);
        });
        if (lowList_2.size()) newHashTable[index] = lowList_2;
        if (highList_2.size()) newHashTable[index + originalBucketNum] = highList_2;
      }

      hashTable[index].clear();
    });
    hashTable = newHashTable;
  };

  this.insert = function (element) {
    if (element === null || element === undefined) {
      throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
    }

    var index = hashFunc(element) & bucketNum - 1;

    if (!hashTable[index]) {
      hashTable[index] = new _LinkList.default([element]);
      ++len;
    } else {
      var preSize = hashTable[index].size();

      if (hashTable[index] instanceof _LinkList.default) {
        if (hashTable[index].find(element)) return;
        hashTable[index].pushBack(element);

        if (hashTable[index].size() >= HashSet.treeifyThreshold) {
          hashTable[index] = new _Set.default(hashTable[index]);
        }
      } else hashTable[index].insert(element);

      var curSize = hashTable[index].size();
      len += curSize - preSize;
    }

    if (len > bucketNum * HashSet.sigma) {
      reAllocate.call(this, bucketNum);
    }
  };

  this.eraseElementByValue = function (element) {
    var index = hashFunc(element) & bucketNum - 1;
    if (!hashTable[index]) return;
    var preSize = hashTable[index].size();
    hashTable[index].eraseElementByValue(element);

    if (hashTable[index] instanceof _Set.default) {
      if (hashTable[index].size() <= HashSet.untreeifyThreshold) {
        hashTable[index] = new _LinkList.default(hashTable[index]);
      }
    }

    var curSize = hashTable[index].size();
    len += curSize - preSize;
  };

  this.find = function (element) {
    var index = hashFunc(element) & bucketNum - 1;
    if (!hashTable[index]) return false;
    return hashTable[index].find(element);
  };

  this[Symbol.iterator] = function () {
    return function () {
      var index, _a, _b, element, e_1_1;

      var e_1, _c;

      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            index = 0;
            _d.label = 1;

          case 1:
            if (!(index < bucketNum)) return [3
            /*break*/
            , 10];

            while (index < bucketNum && !hashTable[index]) ++index;

            if (index >= bucketNum) return [3
            /*break*/
            , 10];
            _d.label = 2;

          case 2:
            _d.trys.push([2, 7, 8, 9]);

            _a = (e_1 = void 0, __values(hashTable[index])), _b = _a.next();
            _d.label = 3;

          case 3:
            if (!!_b.done) return [3
            /*break*/
            , 6];
            element = _b.value;
            return [4
            /*yield*/
            , element];

          case 4:
            _d.sent();

            _d.label = 5;

          case 5:
            _b = _a.next();
            return [3
            /*break*/
            , 3];

          case 6:
            return [3
            /*break*/
            , 9];

          case 7:
            e_1_1 = _d.sent();
            e_1 = {
              error: e_1_1
            };
            return [3
            /*break*/
            , 9];

          case 8:
            try {
              if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            } finally {
              if (e_1) throw e_1.error;
            }

            return [7
            /*endfinally*/
            ];

          case 9:
            ++index;
            return [3
            /*break*/
            , 1];

          case 10:
            return [2
            /*return*/
            ];
        }
      });
    }();
  };

  container.forEach(function (element) {
    return _this.insert(element);
  });
  Object.freeze(this);
}

Object.freeze(HashSet);
var _default = HashSet;
exports.default = _default;
},{"../Set/Set":"node_modules/js-sdsl/dist/esm/Set/Set.js","../LinkList/LinkList":"node_modules/js-sdsl/dist/esm/LinkList/LinkList.js"}],"node_modules/js-sdsl/dist/esm/HashMap/HashMap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _LinkList = _interopRequireDefault(require("../LinkList/LinkList"));

var _Map = _interopRequireDefault(require("../Map/Map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __values = void 0 && (void 0).__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

HashMap.initSize = 1 << 4;
HashMap.maxSize = 1 << 30;
HashMap.sigma = 0.75; // default load factor

HashMap.treeifyThreshold = 8;
HashMap.untreeifyThreshold = 6;
HashMap.minTreeifySize = 64;
/**
 * Note that resize is a time-consuming operation, please try to determine the number of buckets before use.
 * @param container Initialize the container
 * @param initBucketNum Initialize the bucket num, must be 2 to the power of n
 * @param hashFunc Function to map elements to numbers
 * @constructor
 */

function HashMap(container, initBucketNum, hashFunc) {
  var _this = this;

  if (container === void 0) {
    container = [];
  }

  if (initBucketNum === void 0) {
    initBucketNum = HashMap.initSize;
  }

  hashFunc = hashFunc || function (x) {
    var e_1, _a;

    var hashCode = 0;
    var str = '';

    if (typeof x === "number") {
      hashCode = Math.floor(x);
      hashCode = (hashCode << 5) - hashCode;
      hashCode = hashCode & hashCode;
    } else {
      if (typeof x !== "string") {
        str = JSON.stringify(x);
      } else str = x;

      try {
        for (var str_1 = __values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
          var ch = str_1_1.value;
          var character = ch.charCodeAt(0);
          hashCode = (hashCode << 5) - hashCode + character;
          hashCode = hashCode & hashCode;
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (str_1_1 && !str_1_1.done && (_a = str_1.return)) _a.call(str_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    hashCode ^= hashCode >>> 16;
    return hashCode;
  };

  if ((initBucketNum & initBucketNum - 1) !== 0) {
    throw new Error("initBucketNum must be 2 to the power of n");
  }

  var len = 0;
  var hashTable = [];
  var bucketNum = Math.max(HashMap.initSize, Math.min(HashMap.maxSize, initBucketNum));

  this.size = function () {
    return len;
  };

  this.empty = function () {
    return len === 0;
  };

  this.clear = function () {
    len = 0;
    bucketNum = initBucketNum;
    hashTable = [];
  };

  this.forEach = function (callback) {
    var index = 0;
    hashTable.forEach(function (container) {
      container.forEach(function (element) {
        callback(element, index++);
      });
    });
  };

  var reAllocate = function (originalBucketNum) {
    if (originalBucketNum >= HashMap.maxSize) return;
    bucketNum = originalBucketNum * 2;
    var newHashTable = [];
    hashTable.forEach(function (container, index) {
      if (container.empty()) return;

      if (container instanceof _LinkList.default && container.size() === 1) {
        var _a = container.front(),
            key = _a.key,
            value = _a.value;

        newHashTable[hashFunc(key) & bucketNum - 1] = new _LinkList.default([{
          key: key,
          value: value
        }]);
      } else if (container instanceof _Map.default) {
        var lowList_1 = new _LinkList.default();
        var highList_1 = new _LinkList.default();
        container.forEach(function (pair) {
          var hashCode = hashFunc(pair.key);

          if ((hashCode & originalBucketNum) === 0) {
            lowList_1.pushBack(pair);
          } else highList_1.pushBack(pair);
        });
        if (lowList_1.size() > HashMap.untreeifyThreshold) newHashTable[index] = new _Map.default(lowList_1);else if (lowList_1.size()) newHashTable[index] = lowList_1;
        if (highList_1.size() > HashMap.untreeifyThreshold) newHashTable[index + originalBucketNum] = new _Map.default(highList_1);else if (highList_1.size()) newHashTable[index + originalBucketNum] = highList_1;
      } else {
        var lowList_2 = new _LinkList.default();
        var highList_2 = new _LinkList.default();
        container.forEach(function (pair) {
          var hashCode = hashFunc(pair.key);

          if ((hashCode & originalBucketNum) === 0) {
            lowList_2.pushBack(pair);
          } else highList_2.pushBack(pair);
        });
        if (lowList_2.size()) newHashTable[index] = lowList_2;
        if (highList_2.size()) newHashTable[index + originalBucketNum] = highList_2;
      }

      hashTable[index].clear();
    });
    hashTable = newHashTable;
  };

  this.setElement = function (key, value) {
    var e_2, _a;

    if (key === null || key === undefined) {
      throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
    }

    if (value === null || value === undefined) {
      this.eraseElementByKey(key);
      return;
    }

    var index = hashFunc(key) & bucketNum - 1;

    if (!hashTable[index]) {
      ++len;
      hashTable[index] = new _LinkList.default([{
        key: key,
        value: value
      }]);
    } else {
      var preSize = hashTable[index].size();

      if (hashTable[index] instanceof _LinkList.default) {
        try {
          for (var _b = __values(hashTable[index]), _c = _b.next(); !_c.done; _c = _b.next()) {
            var pair = _c.value;

            if (pair.key === key) {
              pair.value = value;
              return;
            }
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_2) throw e_2.error;
          }
        }

        hashTable[index].pushBack({
          key: key,
          value: value
        });

        if (hashTable[index].size() >= HashMap.treeifyThreshold) {
          hashTable[index] = new _Map.default(hashTable[index]);
        }
      } else hashTable[index].setElement(key, value);

      var curSize = hashTable[index].size();
      len += curSize - preSize;
    }

    if (len > bucketNum * HashMap.sigma) {
      reAllocate.call(this, bucketNum);
    }
  };

  this.getElementByKey = function (key) {
    var e_3, _a;

    var index = hashFunc(key) & bucketNum - 1;
    if (!hashTable[index]) return undefined;
    if (hashTable[index] instanceof _Map.default) return hashTable[index].getElementByKey(key);else {
      try {
        for (var _b = __values(hashTable[index]), _c = _b.next(); !_c.done; _c = _b.next()) {
          var pair = _c.value;
          if (pair.key === key) return pair.value;
        }
      } catch (e_3_1) {
        e_3 = {
          error: e_3_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_3) throw e_3.error;
        }
      }

      return undefined;
    }
  };

  this.eraseElementByKey = function (key) {
    var e_4, _a;

    var index = hashFunc(key) & bucketNum - 1;
    if (!hashTable[index]) return;
    var preSize = hashTable[index].size();

    if (hashTable[index] instanceof _Map.default) {
      hashTable[index].eraseElementByKey(key);

      if (hashTable[index].size() <= HashMap.untreeifyThreshold) {
        hashTable[index] = new _LinkList.default(hashTable[index]);
      }
    } else {
      var pos = -1;

      try {
        for (var _b = __values(hashTable[index]), _c = _b.next(); !_c.done; _c = _b.next()) {
          var pair = _c.value;
          ++pos;

          if (pair.key === key) {
            hashTable[index].eraseElementByPos(pos);
            break;
          }
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_4) throw e_4.error;
        }
      }
    }

    var curSize = hashTable[index].size();
    len += curSize - preSize;
  };

  this.find = function (key) {
    var e_5, _a;

    var index = hashFunc(key) & bucketNum - 1;
    if (!hashTable[index]) return false;
    if (hashTable[index] instanceof _Map.default) return hashTable[index].find(key);

    try {
      for (var _b = __values(hashTable[index]), _c = _b.next(); !_c.done; _c = _b.next()) {
        var pair = _c.value;
        if (pair.key === key) return true;
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_5) throw e_5.error;
      }
    }

    return false;
  };

  this[Symbol.iterator] = function () {
    return function () {
      var index, _a, _b, pair, e_6_1;

      var e_6, _c;

      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            index = 0;
            _d.label = 1;

          case 1:
            if (!(index < bucketNum)) return [3
            /*break*/
            , 10];

            while (index < bucketNum && !hashTable[index]) ++index;

            if (index >= bucketNum) return [3
            /*break*/
            , 10];
            _d.label = 2;

          case 2:
            _d.trys.push([2, 7, 8, 9]);

            _a = (e_6 = void 0, __values(hashTable[index])), _b = _a.next();
            _d.label = 3;

          case 3:
            if (!!_b.done) return [3
            /*break*/
            , 6];
            pair = _b.value;
            return [4
            /*yield*/
            , pair];

          case 4:
            _d.sent();

            _d.label = 5;

          case 5:
            _b = _a.next();
            return [3
            /*break*/
            , 3];

          case 6:
            return [3
            /*break*/
            , 9];

          case 7:
            e_6_1 = _d.sent();
            e_6 = {
              error: e_6_1
            };
            return [3
            /*break*/
            , 9];

          case 8:
            try {
              if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            } finally {
              if (e_6) throw e_6.error;
            }

            return [7
            /*endfinally*/
            ];

          case 9:
            ++index;
            return [3
            /*break*/
            , 1];

          case 10:
            return [2
            /*return*/
            ];
        }
      });
    }();
  };

  container.forEach(function (_a) {
    var key = _a.key,
        value = _a.value;
    return _this.setElement(key, value);
  });
  Object.freeze(this);
}

Object.freeze(HashMap);
var _default = HashMap;
exports.default = _default;
},{"../LinkList/LinkList":"node_modules/js-sdsl/dist/esm/LinkList/LinkList.js","../Map/Map":"node_modules/js-sdsl/dist/esm/Map/Map.js"}],"node_modules/js-sdsl/dist/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Deque", {
  enumerable: true,
  get: function () {
    return _Deque.default;
  }
});
Object.defineProperty(exports, "HashMap", {
  enumerable: true,
  get: function () {
    return _HashMap.default;
  }
});
Object.defineProperty(exports, "HashSet", {
  enumerable: true,
  get: function () {
    return _HashSet.default;
  }
});
Object.defineProperty(exports, "LinkList", {
  enumerable: true,
  get: function () {
    return _LinkList.default;
  }
});
Object.defineProperty(exports, "Map", {
  enumerable: true,
  get: function () {
    return _Map.default;
  }
});
Object.defineProperty(exports, "PriorityQueue", {
  enumerable: true,
  get: function () {
    return _PriorityQueue.default;
  }
});
Object.defineProperty(exports, "Queue", {
  enumerable: true,
  get: function () {
    return _Queue.default;
  }
});
Object.defineProperty(exports, "Set", {
  enumerable: true,
  get: function () {
    return _Set.default;
  }
});
Object.defineProperty(exports, "Stack", {
  enumerable: true,
  get: function () {
    return _Stack.default;
  }
});
Object.defineProperty(exports, "Vector", {
  enumerable: true,
  get: function () {
    return _Vector.default;
  }
});

var _Vector = _interopRequireDefault(require("./Vector/Vector"));

var _Stack = _interopRequireDefault(require("./Stack/Stack"));

var _Queue = _interopRequireDefault(require("./Queue/Queue"));

var _LinkList = _interopRequireDefault(require("./LinkList/LinkList"));

var _Deque = _interopRequireDefault(require("./Deque/Deque"));

var _PriorityQueue = _interopRequireDefault(require("./PriorityQueue/PriorityQueue"));

var _Set = _interopRequireDefault(require("./Set/Set"));

var _Map = _interopRequireDefault(require("./Map/Map"));

var _HashSet = _interopRequireDefault(require("./HashSet/HashSet"));

var _HashMap = _interopRequireDefault(require("./HashMap/HashMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./Vector/Vector":"node_modules/js-sdsl/dist/esm/Vector/Vector.js","./Stack/Stack":"node_modules/js-sdsl/dist/esm/Stack/Stack.js","./Queue/Queue":"node_modules/js-sdsl/dist/esm/Queue/Queue.js","./LinkList/LinkList":"node_modules/js-sdsl/dist/esm/LinkList/LinkList.js","./Deque/Deque":"node_modules/js-sdsl/dist/esm/Deque/Deque.js","./PriorityQueue/PriorityQueue":"node_modules/js-sdsl/dist/esm/PriorityQueue/PriorityQueue.js","./Set/Set":"node_modules/js-sdsl/dist/esm/Set/Set.js","./Map/Map":"node_modules/js-sdsl/dist/esm/Map/Map.js","./HashSet/HashSet":"node_modules/js-sdsl/dist/esm/HashSet/HashSet.js","./HashMap/HashMap":"node_modules/js-sdsl/dist/esm/HashMap/HashMap.js"}],"node_modules/ms/index.js":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],"node_modules/debug/src/common.js":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = require('ms');
  createDebug.destroy = destroy;
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;
    var enableOverride = null;
    var namespacesCache;
    var enabledCache;

    function debug() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // Disabled?
      if (!debug.enabled) {
        return;
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return '%';
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

    Object.defineProperty(debug, 'enabled', {
      enumerable: true,
      configurable: false,
      get: function () {
        if (enableOverride !== null) {
          return enableOverride;
        }

        if (namespacesCache !== createDebug.namespaces) {
          namespacesCache = createDebug.namespaces;
          enabledCache = createDebug.enabled(namespace);
        }

        return enabledCache;
      },
      set: function (v) {
        enableOverride = v;
      }
    }); // Env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    return debug;
  }

  function extend(namespace, delimiter) {
    var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.namespaces = namespaces;
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }
  /**
  * Disable debug output.
  *
  * @return {String} namespaces
  * @api public
  */


  function disable() {
    var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
      return '-' + namespace;
    }))).join(',');
    createDebug.enable('');
    return namespaces;
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Convert regexp to namespace
  *
  * @param {RegExp} regxep
  * @return {String} namespace
  * @api private
  */


  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }
  /**
  * XXX DO NOT USE. This is a temporary stub function.
  * XXX It WILL be removed in the next major release.
  */


  function destroy() {
    console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;
},{"ms":"node_modules/ms/index.js"}],"node_modules/debug/src/browser.js":[function(require,module,exports) {
var process = require("process");
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

exports.destroy = function () {
  var warned = false;
  return function () {
    if (!warned) {
      warned = true;
      console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
  };
}();
/**
 * Colors.
 */


exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */


exports.log = console.debug || console.log || function () {};
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
var {
  formatters: formatters
} = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
},{"./common":"node_modules/debug/src/common.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/number-allocator/lib/number-allocator.js":[function(require,module,exports) {
// Copyright Takatoshi Kondo 2021
//
// Distributed under the MIT License

'use strict'

const SortedSet = require('js-sdsl').Set
const debugTrace = require('debug')('number-allocator:trace')
const debugError = require('debug')('number-allocator:error')
/**
 * Interval constructor
 * @constructor
 * @param {Number} low  - The lowest value of the interval
 * @param {Number} high - The highest value of the interval
 */
function Interval (low, high) {
  this.low = low
  this.high = high
}

Interval.prototype.equals = function (other) {
  return this.low === other.low && this.high === other.high
}

Interval.prototype.compare = function (other) {
  if (this.low < other.low && this.high < other.low) return -1
  if (other.low < this.low && other.high < this.low) return 1
  return 0
}

/**
 * NumberAllocator constructor.
 * The all numbers are set to vacant status.
 * Time Complexity O(1)
 * @constructor
 * @param {Number} min  - The maximum number of allocatable. The number must be integer.
 * @param {Number} maxh - The minimum number of allocatable. The number must be integer.
 */
function NumberAllocator (min, max) {
  if (!(this instanceof NumberAllocator)) {
    return new NumberAllocator(min, max)
  }

  this.min = min
  this.max = max

  this.ss = new SortedSet(
    [],
    (lhs, rhs) => {
      return lhs.compare(rhs)
    }
  )
  debugTrace('Create')
  this.clear()
}

/**
 * Get the first vacant number. The status of the number is not updated.
 * Time Complexity O(1)
 * @return {Number} - The first vacant number. If all numbers are occupied, return null.
 *                    When alloc() is called then the same value will be allocated.
 */
NumberAllocator.prototype.firstVacant = function () {
  if (this.ss.size() === 0) return null
  return this.ss.front().low
}

/**
 * Allocate the first vacant number. The number become occupied status.
 * Time Complexity O(1)
 * @return {Number} - The first vacant number. If all numbers are occupied, return null.
 */
NumberAllocator.prototype.alloc = function () {
  if (this.ss.size() === 0) {
    debugTrace('alloc():empty')
    return null
  }
  const it = this.ss.front()
  const num = it.low
  if (num + 1 <= it.high) {
    // Overwrite the interval in the ss but it is safe,
    // because no order violation is happened.
    // x|----|
    ++it.low
  } else {
    this.ss.eraseElementByPos(0)
  }
  debugTrace('alloc():' + num)
  return num
}

/**
 * Use the number. The number become occupied status.
 * If the number has already been occupied, then return false.
 * Time Complexity O(logN) : N is the number of intervals (not numbers)
 * @param {Number} num - The number to request use.
 * @return {Boolean} - If `num` was not occupied, then return true, otherwise return false.
 */
NumberAllocator.prototype.use = function (num) {
  const key = new Interval(num, num)
  const it = this.ss.lowerBound(key)
  if (it) {
    if (it.equals(key)) {
      // |x|
      this.ss.eraseElementByValue(it)
      debugTrace('use():' + num)
      return true
    }

    // x |-----|
    if (it.low > num) return false

    // |x----|
    if (it.low === num) {
      // Overwrite the interval in the ss but it is safe,
      // because no order violation is happened.
      // x|----|
      ++it.low
      debugTrace('use():' + num)
      return true
    }

    // |----x|
    if (it.high === num) {
      // Overwrite the interval in the ss but it is safe,
      // because no order violation is happened.
      // |----|x
      --it.high
      debugTrace('use():' + num)
      return true
    }

    const low = it.low

    // |--x--|
    // Overwrite the interval in the ss but it is safe,
    // because no order violation is happened.
    // x|--|
    it.low = num + 1

    // |--|x|--|
    this.ss.insert(new Interval(low, num - 1))
    debugTrace('use():' + num)
    return true
  }

  debugTrace('use():failed')
  return false
}

/**
 * Deallocate the number. The number become vacant status.
 * Time Complexity O(logN) : N is the number of intervals (not numbers)
 * @param {Number} num - The number to deallocate. The number must be occupied status.
 *                       In other words, the number must be allocated by alloc() or occupied be use().
 */
NumberAllocator.prototype.free = function (num) {
  if (num < this.min || num > this.max) {
    debugError('free():' + num + ' is out of range')
    return
  }
  const key = new Interval(num, num)
  const it = this.ss.lowerBound(key)
  if (it) {
    if (it.low <= num && num <= it.high) {
      debugError('free():' + num + ' has already been vacant')
      return
    }
    if (it === this.ss.front()) {
      // v....
      if (num + 1 === it.low) {
        // Concat to right
        // Overwrite the interval in the ss but it is safe,
        // because no order violation is happened.
        --it.low
      } else {
        // Insert new interval
        this.ss.insert(key)
      }
    } else {
      // ..v..
      const itl = this.ss.reverseLowerBound(key)
      if (itl.high + 1 === num) {
        if (num + 1 === it.low) {
          // Concat to left and right
          this.ss.eraseElementByValue(itl)
          // Overwrite the interval in the ss but it is safe,
          // because no order violation is happened.
          it.low = itl.low
        } else {
          // Concat to left
          // Overwrite the interval in the ss but it is safe,
          // because no order violation is happened.
          itl.high = num
        }
      } else {
        if (num + 1 === it.low) {
          // Concat to right
          // Overwrite the interval in the ss but it is safe,
          // because no order violation is happened.
          it.low = num
        } else {
          // Insert new interval
          this.ss.insert(key)
        }
      }
    }
  } else {
    // ....v
    if (it === this.ss.front()) {
      // Insert new interval
      this.ss.insert(key)
      return
    }
    const itl = this.ss.reverseLowerBound(key)
    if (itl.high + 1 === num) {
      // Concat to left
      // Overwrite the interval in the ss but it is safe,
      // because no order violation is happened.
      itl.high = num
    } else {
      // Insert new interval
      this.ss.insert(key)
    }
  }
  debugTrace('free():' + num)
}

/**
 * Clear all occupied numbers.
 * The all numbers are set to vacant status.
 * Time Complexity O(1)
 */
NumberAllocator.prototype.clear = function () {
  debugTrace('clear()')
  this.ss.clear()
  this.ss.insert(new Interval(this.min, this.max))
}

/**
 * Get the number of intervals. Interval is internal structure of this library.
 * This function is for debugging.
 * Time Complexity O(1)
 * @return {Number} - The number of intervals.
 */
NumberAllocator.prototype.intervalCount = function () {
  return this.ss.size()
}

/**
 * Dump the internal structor of the library.
 * This function is for debugging.
 * Time Complexity O(N) : N is the number of intervals (not numbers)
 */
NumberAllocator.prototype.dump = function () {
  console.log('length:' + this.ss.size())
  for (const element of this.ss) {
    console.log(element)
  }
}

module.exports = NumberAllocator

},{"js-sdsl":"node_modules/js-sdsl/dist/esm/index.js","debug":"node_modules/debug/src/browser.js"}],"node_modules/number-allocator/index.js":[function(require,module,exports) {
// Copyright Takatoshi Kondo 2021
//
// Distributed under the MIT License

const NumberAllocator = require('./lib/number-allocator.js')

module.exports.NumberAllocator = NumberAllocator

},{"./lib/number-allocator.js":"node_modules/number-allocator/lib/number-allocator.js"}],"node_modules/mqtt/lib/topic-alias-send.js":[function(require,module,exports) {
'use strict';
/**
 * Module dependencies
 */

var LruMap = require('lru-cache');

var NumberAllocator = require('number-allocator').NumberAllocator;
/**
 * Topic Alias sending manager
 * This holds both topic to alias and alias to topic map
 * @param {Number} [max] - topic alias maximum entries
 */


function TopicAliasSend(max) {
  if (!(this instanceof TopicAliasSend)) {
    return new TopicAliasSend(max);
  }

  if (max > 0) {
    this.aliasToTopic = new LruMap({
      max: max
    });
    this.topicToAlias = {};
    this.numberAllocator = new NumberAllocator(1, max);
    this.max = max;
    this.length = 0;
  }
}
/**
 * Insert or update topic - alias entry.
 * @param {String} [topic] - topic
 * @param {Number} [alias] - topic alias
 * @returns {Boolean} - if success return true otherwise false
 */


TopicAliasSend.prototype.put = function (topic, alias) {
  if (alias === 0 || alias > this.max) {
    return false;
  }

  var entry = this.aliasToTopic.get(alias);

  if (entry) {
    delete this.topicToAlias[entry];
  }

  this.aliasToTopic.set(alias, topic);
  this.topicToAlias[topic] = alias;
  this.numberAllocator.use(alias);
  this.length = this.aliasToTopic.length;
  return true;
};
/**
 * Get topic by alias
 * @param {Number} [alias] - topic alias
 * @returns {String} - if mapped topic exists return topic, otherwise return undefined
 */


TopicAliasSend.prototype.getTopicByAlias = function (alias) {
  return this.aliasToTopic.get(alias);
};
/**
 * Get topic by alias
 * @param {String} [topic] - topic
 * @returns {Number} - if mapped topic exists return topic alias, otherwise return undefined
 */


TopicAliasSend.prototype.getAliasByTopic = function (topic) {
  var alias = this.topicToAlias[topic];

  if (typeof alias !== 'undefined') {
    this.aliasToTopic.get(alias); // LRU update
  }

  return alias;
};
/**
 * Clear all entries
 */


TopicAliasSend.prototype.clear = function () {
  this.aliasToTopic.reset();
  this.topicToAlias = {};
  this.numberAllocator.clear();
  this.length = 0;
};
/**
 * Get Least Recently Used (LRU) topic alias
 * @returns {Number} - if vacant alias exists then return it, otherwise then return LRU alias
 */


TopicAliasSend.prototype.getLruAlias = function () {
  var alias = this.numberAllocator.firstVacant();
  if (alias) return alias;
  return this.aliasToTopic.keys()[this.aliasToTopic.length - 1];
};

module.exports = TopicAliasSend;
},{"lru-cache":"node_modules/lru-cache/index.js","number-allocator":"node_modules/number-allocator/index.js"}],"node_modules/bl/BufferList.js":[function(require,module,exports) {

'use strict'

const { Buffer } = require('buffer')
const symbol = Symbol.for('BufferList')

function BufferList (buf) {
  if (!(this instanceof BufferList)) {
    return new BufferList(buf)
  }

  BufferList._init.call(this, buf)
}

BufferList._init = function _init (buf) {
  Object.defineProperty(this, symbol, { value: true })

  this._bufs = []
  this.length = 0

  if (buf) {
    this.append(buf)
  }
}

BufferList.prototype._new = function _new (buf) {
  return new BufferList(buf)
}

BufferList.prototype._offset = function _offset (offset) {
  if (offset === 0) {
    return [0, 0]
  }

  let tot = 0

  for (let i = 0; i < this._bufs.length; i++) {
    const _t = tot + this._bufs[i].length
    if (offset < _t || i === this._bufs.length - 1) {
      return [i, offset - tot]
    }
    tot = _t
  }
}

BufferList.prototype._reverseOffset = function (blOffset) {
  const bufferId = blOffset[0]
  let offset = blOffset[1]

  for (let i = 0; i < bufferId; i++) {
    offset += this._bufs[i].length
  }

  return offset
}

BufferList.prototype.get = function get (index) {
  if (index > this.length || index < 0) {
    return undefined
  }

  const offset = this._offset(index)

  return this._bufs[offset[0]][offset[1]]
}

BufferList.prototype.slice = function slice (start, end) {
  if (typeof start === 'number' && start < 0) {
    start += this.length
  }

  if (typeof end === 'number' && end < 0) {
    end += this.length
  }

  return this.copy(null, 0, start, end)
}

BufferList.prototype.copy = function copy (dst, dstStart, srcStart, srcEnd) {
  if (typeof srcStart !== 'number' || srcStart < 0) {
    srcStart = 0
  }

  if (typeof srcEnd !== 'number' || srcEnd > this.length) {
    srcEnd = this.length
  }

  if (srcStart >= this.length) {
    return dst || Buffer.alloc(0)
  }

  if (srcEnd <= 0) {
    return dst || Buffer.alloc(0)
  }

  const copy = !!dst
  const off = this._offset(srcStart)
  const len = srcEnd - srcStart
  let bytes = len
  let bufoff = (copy && dstStart) || 0
  let start = off[1]

  // copy/slice everything
  if (srcStart === 0 && srcEnd === this.length) {
    if (!copy) {
      // slice, but full concat if multiple buffers
      return this._bufs.length === 1
        ? this._bufs[0]
        : Buffer.concat(this._bufs, this.length)
    }

    // copy, need to copy individual buffers
    for (let i = 0; i < this._bufs.length; i++) {
      this._bufs[i].copy(dst, bufoff)
      bufoff += this._bufs[i].length
    }

    return dst
  }

  // easy, cheap case where it's a subset of one of the buffers
  if (bytes <= this._bufs[off[0]].length - start) {
    return copy
      ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes)
      : this._bufs[off[0]].slice(start, start + bytes)
  }

  if (!copy) {
    // a slice, we need something to copy in to
    dst = Buffer.allocUnsafe(len)
  }

  for (let i = off[0]; i < this._bufs.length; i++) {
    const l = this._bufs[i].length - start

    if (bytes > l) {
      this._bufs[i].copy(dst, bufoff, start)
      bufoff += l
    } else {
      this._bufs[i].copy(dst, bufoff, start, start + bytes)
      bufoff += l
      break
    }

    bytes -= l

    if (start) {
      start = 0
    }
  }

  // safeguard so that we don't return uninitialized memory
  if (dst.length > bufoff) return dst.slice(0, bufoff)

  return dst
}

BufferList.prototype.shallowSlice = function shallowSlice (start, end) {
  start = start || 0
  end = typeof end !== 'number' ? this.length : end

  if (start < 0) {
    start += this.length
  }

  if (end < 0) {
    end += this.length
  }

  if (start === end) {
    return this._new()
  }

  const startOffset = this._offset(start)
  const endOffset = this._offset(end)
  const buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1)

  if (endOffset[1] === 0) {
    buffers.pop()
  } else {
    buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(0, endOffset[1])
  }

  if (startOffset[1] !== 0) {
    buffers[0] = buffers[0].slice(startOffset[1])
  }

  return this._new(buffers)
}

BufferList.prototype.toString = function toString (encoding, start, end) {
  return this.slice(start, end).toString(encoding)
}

BufferList.prototype.consume = function consume (bytes) {
  // first, normalize the argument, in accordance with how Buffer does it
  bytes = Math.trunc(bytes)
  // do nothing if not a positive number
  if (Number.isNaN(bytes) || bytes <= 0) return this

  while (this._bufs.length) {
    if (bytes >= this._bufs[0].length) {
      bytes -= this._bufs[0].length
      this.length -= this._bufs[0].length
      this._bufs.shift()
    } else {
      this._bufs[0] = this._bufs[0].slice(bytes)
      this.length -= bytes
      break
    }
  }

  return this
}

BufferList.prototype.duplicate = function duplicate () {
  const copy = this._new()

  for (let i = 0; i < this._bufs.length; i++) {
    copy.append(this._bufs[i])
  }

  return copy
}

BufferList.prototype.append = function append (buf) {
  if (buf == null) {
    return this
  }

  if (buf.buffer) {
    // append a view of the underlying ArrayBuffer
    this._appendBuffer(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength))
  } else if (Array.isArray(buf)) {
    for (let i = 0; i < buf.length; i++) {
      this.append(buf[i])
    }
  } else if (this._isBufferList(buf)) {
    // unwrap argument into individual BufferLists
    for (let i = 0; i < buf._bufs.length; i++) {
      this.append(buf._bufs[i])
    }
  } else {
    // coerce number arguments to strings, since Buffer(number) does
    // uninitialized memory allocation
    if (typeof buf === 'number') {
      buf = buf.toString()
    }

    this._appendBuffer(Buffer.from(buf))
  }

  return this
}

BufferList.prototype._appendBuffer = function appendBuffer (buf) {
  this._bufs.push(buf)
  this.length += buf.length
}

BufferList.prototype.indexOf = function (search, offset, encoding) {
  if (encoding === undefined && typeof offset === 'string') {
    encoding = offset
    offset = undefined
  }

  if (typeof search === 'function' || Array.isArray(search)) {
    throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.')
  } else if (typeof search === 'number') {
    search = Buffer.from([search])
  } else if (typeof search === 'string') {
    search = Buffer.from(search, encoding)
  } else if (this._isBufferList(search)) {
    search = search.slice()
  } else if (Array.isArray(search.buffer)) {
    search = Buffer.from(search.buffer, search.byteOffset, search.byteLength)
  } else if (!Buffer.isBuffer(search)) {
    search = Buffer.from(search)
  }

  offset = Number(offset || 0)

  if (isNaN(offset)) {
    offset = 0
  }

  if (offset < 0) {
    offset = this.length + offset
  }

  if (offset < 0) {
    offset = 0
  }

  if (search.length === 0) {
    return offset > this.length ? this.length : offset
  }

  const blOffset = this._offset(offset)
  let blIndex = blOffset[0] // index of which internal buffer we're working on
  let buffOffset = blOffset[1] // offset of the internal buffer we're working on

  // scan over each buffer
  for (; blIndex < this._bufs.length; blIndex++) {
    const buff = this._bufs[blIndex]

    while (buffOffset < buff.length) {
      const availableWindow = buff.length - buffOffset

      if (availableWindow >= search.length) {
        const nativeSearchResult = buff.indexOf(search, buffOffset)

        if (nativeSearchResult !== -1) {
          return this._reverseOffset([blIndex, nativeSearchResult])
        }

        buffOffset = buff.length - search.length + 1 // end of native search window
      } else {
        const revOffset = this._reverseOffset([blIndex, buffOffset])

        if (this._match(revOffset, search)) {
          return revOffset
        }

        buffOffset++
      }
    }

    buffOffset = 0
  }

  return -1
}

BufferList.prototype._match = function (offset, search) {
  if (this.length - offset < search.length) {
    return false
  }

  for (let searchOffset = 0; searchOffset < search.length; searchOffset++) {
    if (this.get(offset + searchOffset) !== search[searchOffset]) {
      return false
    }
  }
  return true
}

;(function () {
  const methods = {
    readDoubleBE: 8,
    readDoubleLE: 8,
    readFloatBE: 4,
    readFloatLE: 4,
    readInt32BE: 4,
    readInt32LE: 4,
    readUInt32BE: 4,
    readUInt32LE: 4,
    readInt16BE: 2,
    readInt16LE: 2,
    readUInt16BE: 2,
    readUInt16LE: 2,
    readInt8: 1,
    readUInt8: 1,
    readIntBE: null,
    readIntLE: null,
    readUIntBE: null,
    readUIntLE: null
  }

  for (const m in methods) {
    (function (m) {
      if (methods[m] === null) {
        BufferList.prototype[m] = function (offset, byteLength) {
          return this.slice(offset, offset + byteLength)[m](0, byteLength)
        }
      } else {
        BufferList.prototype[m] = function (offset = 0) {
          return this.slice(offset, offset + methods[m])[m](0)
        }
      }
    }(m))
  }
}())

// Used internally by the class and also as an indicator of this object being
// a `BufferList`. It's not possible to use `instanceof BufferList` in a browser
// environment because there could be multiple different copies of the
// BufferList class and some `BufferList`s might be `BufferList`s.
BufferList.prototype._isBufferList = function _isBufferList (b) {
  return b instanceof BufferList || BufferList.isBufferList(b)
}

BufferList.isBufferList = function isBufferList (b) {
  return b != null && b[symbol]
}

module.exports = BufferList

},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"node_modules/bl/bl.js":[function(require,module,exports) {
'use strict'

const DuplexStream = require('readable-stream').Duplex
const inherits = require('inherits')
const BufferList = require('./BufferList')

function BufferListStream (callback) {
  if (!(this instanceof BufferListStream)) {
    return new BufferListStream(callback)
  }

  if (typeof callback === 'function') {
    this._callback = callback

    const piper = function piper (err) {
      if (this._callback) {
        this._callback(err)
        this._callback = null
      }
    }.bind(this)

    this.on('pipe', function onPipe (src) {
      src.on('error', piper)
    })
    this.on('unpipe', function onUnpipe (src) {
      src.removeListener('error', piper)
    })

    callback = null
  }

  BufferList._init.call(this, callback)
  DuplexStream.call(this)
}

inherits(BufferListStream, DuplexStream)
Object.assign(BufferListStream.prototype, BufferList.prototype)

BufferListStream.prototype._new = function _new (callback) {
  return new BufferListStream(callback)
}

BufferListStream.prototype._write = function _write (buf, encoding, callback) {
  this._appendBuffer(buf)

  if (typeof callback === 'function') {
    callback()
  }
}

BufferListStream.prototype._read = function _read (size) {
  if (!this.length) {
    return this.push(null)
  }

  size = Math.min(size, this.length)
  this.push(this.slice(0, size))
  this.consume(size)
}

BufferListStream.prototype.end = function end (chunk) {
  DuplexStream.prototype.end.call(this, chunk)

  if (this._callback) {
    this._callback(null, this.slice())
    this._callback = null
  }
}

BufferListStream.prototype._destroy = function _destroy (err, cb) {
  this._bufs.length = 0
  this.length = 0
  cb(err)
}

BufferListStream.prototype._isBufferList = function _isBufferList (b) {
  return b instanceof BufferListStream || b instanceof BufferList || BufferListStream.isBufferList(b)
}

BufferListStream.isBufferList = BufferList.isBufferList

module.exports = BufferListStream
module.exports.BufferListStream = BufferListStream
module.exports.BufferList = BufferList

},{"readable-stream":"node_modules/readable-stream/readable-browser.js","inherits":"node_modules/inherits/inherits_browser.js","./BufferList":"node_modules/bl/BufferList.js"}],"node_modules/mqtt-packet/packet.js":[function(require,module,exports) {
class Packet {
  constructor () {
    this.cmd = null
    this.retain = false
    this.qos = 0
    this.dup = false
    this.length = -1
    this.topic = null
    this.payload = null
  }
}

module.exports = Packet

},{}],"node_modules/mqtt-packet/constants.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
/* Protocol - protocol constants */
const protocol = module.exports

/* Command code => mnemonic */
protocol.types = {
  0: 'reserved',
  1: 'connect',
  2: 'connack',
  3: 'publish',
  4: 'puback',
  5: 'pubrec',
  6: 'pubrel',
  7: 'pubcomp',
  8: 'subscribe',
  9: 'suback',
  10: 'unsubscribe',
  11: 'unsuback',
  12: 'pingreq',
  13: 'pingresp',
  14: 'disconnect',
  15: 'auth'
}

/* Mnemonic => Command code */
protocol.codes = {}
for (const k in protocol.types) {
  const v = protocol.types[k]
  protocol.codes[v] = k
}

/* Header */
protocol.CMD_SHIFT = 4
protocol.CMD_MASK = 0xF0
protocol.DUP_MASK = 0x08
protocol.QOS_MASK = 0x03
protocol.QOS_SHIFT = 1
protocol.RETAIN_MASK = 0x01

/* Length */
protocol.VARBYTEINT_MASK = 0x7F
protocol.VARBYTEINT_FIN_MASK = 0x80
protocol.VARBYTEINT_MAX = 268435455

/* Connack */
protocol.SESSIONPRESENT_MASK = 0x01
protocol.SESSIONPRESENT_HEADER = Buffer.from([protocol.SESSIONPRESENT_MASK])
protocol.CONNACK_HEADER = Buffer.from([protocol.codes.connack << protocol.CMD_SHIFT])

/* Connect */
protocol.USERNAME_MASK = 0x80
protocol.PASSWORD_MASK = 0x40
protocol.WILL_RETAIN_MASK = 0x20
protocol.WILL_QOS_MASK = 0x18
protocol.WILL_QOS_SHIFT = 3
protocol.WILL_FLAG_MASK = 0x04
protocol.CLEAN_SESSION_MASK = 0x02
protocol.CONNECT_HEADER = Buffer.from([protocol.codes.connect << protocol.CMD_SHIFT])

/* Properties */
protocol.properties = {
  sessionExpiryInterval: 17,
  willDelayInterval: 24,
  receiveMaximum: 33,
  maximumPacketSize: 39,
  topicAliasMaximum: 34,
  requestResponseInformation: 25,
  requestProblemInformation: 23,
  userProperties: 38,
  authenticationMethod: 21,
  authenticationData: 22,
  payloadFormatIndicator: 1,
  messageExpiryInterval: 2,
  contentType: 3,
  responseTopic: 8,
  correlationData: 9,
  maximumQoS: 36,
  retainAvailable: 37,
  assignedClientIdentifier: 18,
  reasonString: 31,
  wildcardSubscriptionAvailable: 40,
  subscriptionIdentifiersAvailable: 41,
  sharedSubscriptionAvailable: 42,
  serverKeepAlive: 19,
  responseInformation: 26,
  serverReference: 28,
  topicAlias: 35,
  subscriptionIdentifier: 11
}
protocol.propertiesCodes = {}
for (const prop in protocol.properties) {
  const id = protocol.properties[prop]
  protocol.propertiesCodes[id] = prop
}
protocol.propertiesTypes = {
  sessionExpiryInterval: 'int32',
  willDelayInterval: 'int32',
  receiveMaximum: 'int16',
  maximumPacketSize: 'int32',
  topicAliasMaximum: 'int16',
  requestResponseInformation: 'byte',
  requestProblemInformation: 'byte',
  userProperties: 'pair',
  authenticationMethod: 'string',
  authenticationData: 'binary',
  payloadFormatIndicator: 'byte',
  messageExpiryInterval: 'int32',
  contentType: 'string',
  responseTopic: 'string',
  correlationData: 'binary',
  maximumQoS: 'int8',
  retainAvailable: 'byte',
  assignedClientIdentifier: 'string',
  reasonString: 'string',
  wildcardSubscriptionAvailable: 'byte',
  subscriptionIdentifiersAvailable: 'byte',
  sharedSubscriptionAvailable: 'byte',
  serverKeepAlive: 'int16',
  responseInformation: 'string',
  serverReference: 'string',
  topicAlias: 'int16',
  subscriptionIdentifier: 'var'
}

function genHeader (type) {
  return [0, 1, 2].map(qos => {
    return [0, 1].map(dup => {
      return [0, 1].map(retain => {
        const buf = Buffer.alloc(1)
        buf.writeUInt8(
          protocol.codes[type] << protocol.CMD_SHIFT |
          (dup ? protocol.DUP_MASK : 0) |
          qos << protocol.QOS_SHIFT | retain, 0, true)
        return buf
      })
    })
  })
}

/* Publish */
protocol.PUBLISH_HEADER = genHeader('publish')

/* Subscribe */
protocol.SUBSCRIBE_HEADER = genHeader('subscribe')
protocol.SUBSCRIBE_OPTIONS_QOS_MASK = 0x03
protocol.SUBSCRIBE_OPTIONS_NL_MASK = 0x01
protocol.SUBSCRIBE_OPTIONS_NL_SHIFT = 2
protocol.SUBSCRIBE_OPTIONS_RAP_MASK = 0x01
protocol.SUBSCRIBE_OPTIONS_RAP_SHIFT = 3
protocol.SUBSCRIBE_OPTIONS_RH_MASK = 0x03
protocol.SUBSCRIBE_OPTIONS_RH_SHIFT = 4
protocol.SUBSCRIBE_OPTIONS_RH = [0x00, 0x10, 0x20]
protocol.SUBSCRIBE_OPTIONS_NL = 0x04
protocol.SUBSCRIBE_OPTIONS_RAP = 0x08
protocol.SUBSCRIBE_OPTIONS_QOS = [0x00, 0x01, 0x02]

/* Unsubscribe */
protocol.UNSUBSCRIBE_HEADER = genHeader('unsubscribe')

/* Confirmations */
protocol.ACKS = {
  unsuback: genHeader('unsuback'),
  puback: genHeader('puback'),
  pubcomp: genHeader('pubcomp'),
  pubrel: genHeader('pubrel'),
  pubrec: genHeader('pubrec')
}

protocol.SUBACK_HEADER = Buffer.from([protocol.codes.suback << protocol.CMD_SHIFT])

/* Protocol versions */
protocol.VERSION3 = Buffer.from([3])
protocol.VERSION4 = Buffer.from([4])
protocol.VERSION5 = Buffer.from([5])
protocol.VERSION131 = Buffer.from([131])
protocol.VERSION132 = Buffer.from([132])

/* QoS */
protocol.QOS = [0, 1, 2].map(qos => {
  return Buffer.from([qos])
})

/* Empty packets */
protocol.EMPTY = {
  pingreq: Buffer.from([protocol.codes.pingreq << 4, 0]),
  pingresp: Buffer.from([protocol.codes.pingresp << 4, 0]),
  disconnect: Buffer.from([protocol.codes.disconnect << 4, 0])
}

},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"node_modules/mqtt-packet/parser.js":[function(require,module,exports) {
const bl = require('bl')
const EventEmitter = require('events')
const Packet = require('./packet')
const constants = require('./constants')
const debug = require('debug')('mqtt-packet:parser')

class Parser extends EventEmitter {
  constructor () {
    super()
    this.parser = this.constructor.parser
  }

  static parser (opt) {
    if (!(this instanceof Parser)) return (new Parser()).parser(opt)

    this.settings = opt || {}

    this._states = [
      '_parseHeader',
      '_parseLength',
      '_parsePayload',
      '_newPacket'
    ]

    this._resetState()
    return this
  }

  _resetState () {
    debug('_resetState: resetting packet, error, _list, and _stateCounter')
    this.packet = new Packet()
    this.error = null
    this._list = bl()
    this._stateCounter = 0
  }

  parse (buf) {
    if (this.error) this._resetState()

    this._list.append(buf)
    debug('parse: current state: %s', this._states[this._stateCounter])
    while ((this.packet.length !== -1 || this._list.length > 0) &&
      this[this._states[this._stateCounter]]() &&
      !this.error) {
      this._stateCounter++
      debug('parse: state complete. _stateCounter is now: %d', this._stateCounter)
      debug('parse: packet.length: %d, buffer list length: %d', this.packet.length, this._list.length)
      if (this._stateCounter >= this._states.length) this._stateCounter = 0
    }
    debug('parse: exited while loop. packet: %d, buffer list length: %d', this.packet.length, this._list.length)
    return this._list.length
  }

  _parseHeader () {
    // There is at least one byte in the buffer
    const zero = this._list.readUInt8(0)
    this.packet.cmd = constants.types[zero >> constants.CMD_SHIFT]
    this.packet.retain = (zero & constants.RETAIN_MASK) !== 0
    this.packet.qos = (zero >> constants.QOS_SHIFT) & constants.QOS_MASK
    this.packet.dup = (zero & constants.DUP_MASK) !== 0
    debug('_parseHeader: packet: %o', this.packet)

    this._list.consume(1)

    return true
  }

  _parseLength () {
    // There is at least one byte in the list
    const result = this._parseVarByteNum(true)

    if (result) {
      this.packet.length = result.value
      this._list.consume(result.bytes)
    }
    debug('_parseLength %d', result.value)
    return !!result
  }

  _parsePayload () {
    debug('_parsePayload: payload %O', this._list)
    let result = false

    // Do we have a payload? Do we have enough data to complete the payload?
    // PINGs have no payload
    if (this.packet.length === 0 || this._list.length >= this.packet.length) {
      this._pos = 0

      switch (this.packet.cmd) {
        case 'connect':
          this._parseConnect()
          break
        case 'connack':
          this._parseConnack()
          break
        case 'publish':
          this._parsePublish()
          break
        case 'puback':
        case 'pubrec':
        case 'pubrel':
        case 'pubcomp':
          this._parseConfirmation()
          break
        case 'subscribe':
          this._parseSubscribe()
          break
        case 'suback':
          this._parseSuback()
          break
        case 'unsubscribe':
          this._parseUnsubscribe()
          break
        case 'unsuback':
          this._parseUnsuback()
          break
        case 'pingreq':
        case 'pingresp':
          // These are empty, nothing to do
          break
        case 'disconnect':
          this._parseDisconnect()
          break
        case 'auth':
          this._parseAuth()
          break
        default:
          this._emitError(new Error('Not supported'))
      }

      result = true
    }
    debug('_parsePayload complete result: %s', result)
    return result
  }

  _parseConnect () {
    debug('_parseConnect')
    let topic // Will topic
    let payload // Will payload
    let password // Password
    let username // Username
    const flags = {}
    const packet = this.packet

    // Parse protocolId
    const protocolId = this._parseString()

    if (protocolId === null) return this._emitError(new Error('Cannot parse protocolId'))
    if (protocolId !== 'MQTT' && protocolId !== 'MQIsdp') {
      return this._emitError(new Error('Invalid protocolId'))
    }

    packet.protocolId = protocolId

    // Parse constants version number
    if (this._pos >= this._list.length) return this._emitError(new Error('Packet too short'))

    packet.protocolVersion = this._list.readUInt8(this._pos)

    if (packet.protocolVersion >= 128) {
      packet.bridgeMode = true
      packet.protocolVersion = packet.protocolVersion - 128
    }

    if (packet.protocolVersion !== 3 && packet.protocolVersion !== 4 && packet.protocolVersion !== 5) {
      return this._emitError(new Error('Invalid protocol version'))
    }

    this._pos++

    if (this._pos >= this._list.length) {
      return this._emitError(new Error('Packet too short'))
    }

    // Parse connect flags
    flags.username = (this._list.readUInt8(this._pos) & constants.USERNAME_MASK)
    flags.password = (this._list.readUInt8(this._pos) & constants.PASSWORD_MASK)
    flags.will = (this._list.readUInt8(this._pos) & constants.WILL_FLAG_MASK)

    if (flags.will) {
      packet.will = {}
      packet.will.retain = (this._list.readUInt8(this._pos) & constants.WILL_RETAIN_MASK) !== 0
      packet.will.qos = (this._list.readUInt8(this._pos) &
        constants.WILL_QOS_MASK) >> constants.WILL_QOS_SHIFT
    }

    packet.clean = (this._list.readUInt8(this._pos) & constants.CLEAN_SESSION_MASK) !== 0
    this._pos++

    // Parse keepalive
    packet.keepalive = this._parseNum()
    if (packet.keepalive === -1) return this._emitError(new Error('Packet too short'))

    // parse properties
    if (packet.protocolVersion === 5) {
      const properties = this._parseProperties()
      if (Object.getOwnPropertyNames(properties).length) {
        packet.properties = properties
      }
    }
    // Parse clientId
    const clientId = this._parseString()
    if (clientId === null) return this._emitError(new Error('Packet too short'))
    packet.clientId = clientId
    debug('_parseConnect: packet.clientId: %s', packet.clientId)

    if (flags.will) {
      if (packet.protocolVersion === 5) {
        const willProperties = this._parseProperties()
        if (Object.getOwnPropertyNames(willProperties).length) {
          packet.will.properties = willProperties
        }
      }
      // Parse will topic
      topic = this._parseString()
      if (topic === null) return this._emitError(new Error('Cannot parse will topic'))
      packet.will.topic = topic
      debug('_parseConnect: packet.will.topic: %s', packet.will.topic)

      // Parse will payload
      payload = this._parseBuffer()
      if (payload === null) return this._emitError(new Error('Cannot parse will payload'))
      packet.will.payload = payload
      debug('_parseConnect: packet.will.paylaod: %s', packet.will.payload)
    }

    // Parse username
    if (flags.username) {
      username = this._parseString()
      if (username === null) return this._emitError(new Error('Cannot parse username'))
      packet.username = username
      debug('_parseConnect: packet.username: %s', packet.username)
    }

    // Parse password
    if (flags.password) {
      password = this._parseBuffer()
      if (password === null) return this._emitError(new Error('Cannot parse password'))
      packet.password = password
    }
    // need for right parse auth packet and self set up
    this.settings = packet
    debug('_parseConnect: complete')
    return packet
  }

  _parseConnack () {
    debug('_parseConnack')
    const packet = this.packet

    if (this._list.length < 1) return null
    packet.sessionPresent = !!(this._list.readUInt8(this._pos++) & constants.SESSIONPRESENT_MASK)

    if (this.settings.protocolVersion === 5) {
      if (this._list.length >= 2) {
        packet.reasonCode = this._list.readUInt8(this._pos++)
      } else {
        packet.reasonCode = 0
      }
    } else {
      if (this._list.length < 2) return null
      packet.returnCode = this._list.readUInt8(this._pos++)
    }

    if (packet.returnCode === -1 || packet.reasonCode === -1) return this._emitError(new Error('Cannot parse return code'))
    // mqtt 5 properties
    if (this.settings.protocolVersion === 5) {
      const properties = this._parseProperties()
      if (Object.getOwnPropertyNames(properties).length) {
        packet.properties = properties
      }
    }
    debug('_parseConnack: complete')
  }

  _parsePublish () {
    debug('_parsePublish')
    const packet = this.packet
    packet.topic = this._parseString()

    if (packet.topic === null) return this._emitError(new Error('Cannot parse topic'))

    // Parse messageId
    if (packet.qos > 0) if (!this._parseMessageId()) { return }

    // Properties mqtt 5
    if (this.settings.protocolVersion === 5) {
      const properties = this._parseProperties()
      if (Object.getOwnPropertyNames(properties).length) {
        packet.properties = properties
      }
    }

    packet.payload = this._list.slice(this._pos, packet.length)
    debug('_parsePublish: payload from buffer list: %o', packet.payload)
  }

  _parseSubscribe () {
    debug('_parseSubscribe')
    const packet = this.packet
    let topic
    let options
    let qos
    let rh
    let rap
    let nl
    let subscription

    if (packet.qos !== 1) {
      return this._emitError(new Error('Wrong subscribe header'))
    }

    packet.subscriptions = []

    if (!this._parseMessageId()) { return }

    // Properties mqtt 5
    if (this.settings.protocolVersion === 5) {
      const properties = this._parseProperties()
      if (Object.getOwnPropertyNames(properties).length) {
        packet.properties = properties
      }
    }

    while (this._pos < packet.length) {
      // Parse topic
      topic = this._parseString()
      if (topic === null) return this._emitError(new Error('Cannot parse topic'))
      if (this._pos >= packet.length) return this._emitError(new Error('Malformed Subscribe Payload'))

      options = this._parseByte()
      qos = options & constants.SUBSCRIBE_OPTIONS_QOS_MASK
      nl = ((options >> constants.SUBSCRIBE_OPTIONS_NL_SHIFT) & constants.SUBSCRIBE_OPTIONS_NL_MASK) !== 0
      rap = ((options >> constants.SUBSCRIBE_OPTIONS_RAP_SHIFT) & constants.SUBSCRIBE_OPTIONS_RAP_MASK) !== 0
      rh = (options >> constants.SUBSCRIBE_OPTIONS_RH_SHIFT) & constants.SUBSCRIBE_OPTIONS_RH_MASK

      subscription = { topic, qos }

      // mqtt 5 options
      if (this.settings.protocolVersion === 5) {
        subscription.nl = nl
        subscription.rap = rap
        subscription.rh = rh
      } else if (this.settings.bridgeMode) {
        subscription.rh = 0
        subscription.rap = true
        subscription.nl = true
      }

      // Push pair to subscriptions
      debug('_parseSubscribe: push subscription `%s` to subscription', subscription)
      packet.subscriptions.push(subscription)
    }
  }

  _parseSuback () {
    debug('_parseSuback')
    const packet = this.packet
    this.packet.granted = []

    if (!this._parseMessageId()) { return }

    // Properties mqtt 5
    if (this.settings.protocolVersion === 5) {
      const properties = this._parseProperties()
      if (Object.getOwnPropertyNames(properties).length) {
        packet.properties = properties
      }
    }

    // Parse granted QoSes
    while (this._pos < this.packet.length) {
      this.packet.granted.push(this._list.readUInt8(this._pos++))
    }
  }

  _parseUnsubscribe () {
    debug('_parseUnsubscribe')
    const packet = this.packet

    packet.unsubscriptions = []

    // Parse messageId
    if (!this._parseMessageId()) { return }

    // Properties mqtt 5
    if (this.settings.protocolVersion === 5) {
      const properties = this._parseProperties()
      if (Object.getOwnPropertyNames(properties).length) {
        packet.properties = properties
      }
    }

    while (this._pos < packet.length) {
      // Parse topic
      const topic = this._parseString()
      if (topic === null) return this._emitError(new Error('Cannot parse topic'))

      // Push topic to unsubscriptions
      debug('_parseUnsubscribe: push topic `%s` to unsubscriptions', topic)
      packet.unsubscriptions.push(topic)
    }
  }

  _parseUnsuback () {
    debug('_parseUnsuback')
    const packet = this.packet
    if (!this._parseMessageId()) return this._emitError(new Error('Cannot parse messageId'))
    // Properties mqtt 5
    if (this.settings.protocolVersion === 5) {
      const properties = this._parseProperties()
      if (Object.getOwnPropertyNames(properties).length) {
        packet.properties = properties
      }
      // Parse granted QoSes
      packet.granted = []
      while (this._pos < this.packet.length) {
        this.packet.granted.push(this._list.readUInt8(this._pos++))
      }
    }
  }

  // parse packets like puback, pubrec, pubrel, pubcomp
  _parseConfirmation () {
    debug('_parseConfirmation: packet.cmd: `%s`', this.packet.cmd)
    const packet = this.packet

    this._parseMessageId()

    if (this.settings.protocolVersion === 5) {
      if (packet.length > 2) {
        // response code
        packet.reasonCode = this._parseByte()
        debug('_parseConfirmation: packet.reasonCode `%d`', packet.reasonCode)
      } else {
        packet.reasonCode = 0
      }

      if (packet.length > 3) {
        // properies mqtt 5
        const properties = this._parseProperties()
        if (Object.getOwnPropertyNames(properties).length) {
          packet.properties = properties
        }
      }
    }

    return true
  }

  // parse disconnect packet
  _parseDisconnect () {
    const packet = this.packet
    debug('_parseDisconnect')

    if (this.settings.protocolVersion === 5) {
      // response code
      if (this._list.length > 0) {
        packet.reasonCode = this._parseByte()
      } else {
        packet.reasonCode = 0
      }
      // properies mqtt 5
      const properties = this._parseProperties()
      if (Object.getOwnPropertyNames(properties).length) {
        packet.properties = properties
      }
    }

    debug('_parseDisconnect result: true')
    return true
  }

  // parse auth packet
  _parseAuth () {
    debug('_parseAuth')
    const packet = this.packet

    if (this.settings.protocolVersion !== 5) {
      return this._emitError(new Error('Not supported auth packet for this version MQTT'))
    }

    // response code
    packet.reasonCode = this._parseByte()
    // properies mqtt 5
    const properties = this._parseProperties()
    if (Object.getOwnPropertyNames(properties).length) {
      packet.properties = properties
    }

    debug('_parseAuth: result: true')
    return true
  }

  _parseMessageId () {
    const packet = this.packet

    packet.messageId = this._parseNum()

    if (packet.messageId === null) {
      this._emitError(new Error('Cannot parse messageId'))
      return false
    }

    debug('_parseMessageId: packet.messageId %d', packet.messageId)
    return true
  }

  _parseString (maybeBuffer) {
    const length = this._parseNum()
    const end = length + this._pos

    if (length === -1 || end > this._list.length || end > this.packet.length) return null

    const result = this._list.toString('utf8', this._pos, end)
    this._pos += length
    debug('_parseString: result: %s', result)
    return result
  }

  _parseStringPair () {
    debug('_parseStringPair')
    return {
      name: this._parseString(),
      value: this._parseString()
    }
  }

  _parseBuffer () {
    const length = this._parseNum()
    const end = length + this._pos

    if (length === -1 || end > this._list.length || end > this.packet.length) return null

    const result = this._list.slice(this._pos, end)

    this._pos += length
    debug('_parseBuffer: result: %o', result)
    return result
  }

  _parseNum () {
    if (this._list.length - this._pos < 2) return -1

    const result = this._list.readUInt16BE(this._pos)
    this._pos += 2
    debug('_parseNum: result: %s', result)
    return result
  }

  _parse4ByteNum () {
    if (this._list.length - this._pos < 4) return -1

    const result = this._list.readUInt32BE(this._pos)
    this._pos += 4
    debug('_parse4ByteNum: result: %s', result)
    return result
  }

  _parseVarByteNum (fullInfoFlag) {
    debug('_parseVarByteNum')
    const maxBytes = 4
    let bytes = 0
    let mul = 1
    let value = 0
    let result = false
    let current
    const padding = this._pos ? this._pos : 0

    while (bytes < maxBytes && (padding + bytes) < this._list.length) {
      current = this._list.readUInt8(padding + bytes++)
      value += mul * (current & constants.VARBYTEINT_MASK)
      mul *= 0x80

      if ((current & constants.VARBYTEINT_FIN_MASK) === 0) {
        result = true
        break
      }
      if (this._list.length <= bytes) {
        break
      }
    }

    if (!result && bytes === maxBytes && this._list.length >= bytes) {
      this._emitError(new Error('Invalid variable byte integer'))
    }

    if (padding) {
      this._pos += bytes
    }

    result = result
      ? fullInfoFlag ? {
        bytes,
        value
      } : value
      : false

    debug('_parseVarByteNum: result: %o', result)
    return result
  }

  _parseByte () {
    let result
    if (this._pos < this._list.length) {
      result = this._list.readUInt8(this._pos)
      this._pos++
    }
    debug('_parseByte: result: %o', result)
    return result
  }

  _parseByType (type) {
    debug('_parseByType: type: %s', type)
    switch (type) {
      case 'byte': {
        return this._parseByte() !== 0
      }
      case 'int8': {
        return this._parseByte()
      }
      case 'int16': {
        return this._parseNum()
      }
      case 'int32': {
        return this._parse4ByteNum()
      }
      case 'var': {
        return this._parseVarByteNum()
      }
      case 'string': {
        return this._parseString()
      }
      case 'pair': {
        return this._parseStringPair()
      }
      case 'binary': {
        return this._parseBuffer()
      }
    }
  }

  _parseProperties () {
    debug('_parseProperties')
    const length = this._parseVarByteNum()
    const start = this._pos
    const end = start + length
    const result = {}
    while (this._pos < end) {
      const type = this._parseByte()
      if (!type) {
        this._emitError(new Error('Cannot parse property code type'))
        return false
      }
      const name = constants.propertiesCodes[type]
      if (!name) {
        this._emitError(new Error('Unknown property'))
        return false
      }
      // user properties process
      if (name === 'userProperties') {
        if (!result[name]) {
          result[name] = Object.create(null)
        }
        const currentUserProperty = this._parseByType(constants.propertiesTypes[name])
        if (result[name][currentUserProperty.name]) {
          if (Array.isArray(result[name][currentUserProperty.name])) {
            result[name][currentUserProperty.name].push(currentUserProperty.value)
          } else {
            const currentValue = result[name][currentUserProperty.name]
            result[name][currentUserProperty.name] = [currentValue]
            result[name][currentUserProperty.name].push(currentUserProperty.value)
          }
        } else {
          result[name][currentUserProperty.name] = currentUserProperty.value
        }
        continue
      }
      if (result[name]) {
        if (Array.isArray(result[name])) {
          result[name].push(this._parseByType(constants.propertiesTypes[name]))
        } else {
          result[name] = [result[name]]
          result[name].push(this._parseByType(constants.propertiesTypes[name]))
        }
      } else {
        result[name] = this._parseByType(constants.propertiesTypes[name])
      }
    }
    return result
  }

  _newPacket () {
    debug('_newPacket')
    if (this.packet) {
      this._list.consume(this.packet.length)
      debug('_newPacket: parser emit packet: packet.cmd: %s, packet.payload: %s, packet.length: %d', this.packet.cmd, this.packet.payload, this.packet.length)
      this.emit('packet', this.packet)
    }
    debug('_newPacket: new packet')
    this.packet = new Packet()

    this._pos = 0

    return true
  }

  _emitError (err) {
    debug('_emitError')
    this.error = err
    this.emit('error', err)
  }
}

module.exports = Parser

},{"bl":"node_modules/bl/bl.js","events":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/events/events.js","./packet":"node_modules/mqtt-packet/packet.js","./constants":"node_modules/mqtt-packet/constants.js","debug":"node_modules/debug/src/browser.js"}],"node_modules/mqtt-packet/numbers.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
const max = 65536
const cache = {}

// in node 6 Buffer.subarray returns a Uint8Array instead of a Buffer
// later versions return a Buffer
// alternative is Buffer.slice but that creates a new buffer
// creating new buffers takes time
// SubOk is only false on node < 8
const SubOk = Buffer.isBuffer(Buffer.from([1, 2]).subarray(0, 1))

function generateBuffer (i) {
  const buffer = Buffer.allocUnsafe(2)
  buffer.writeUInt8(i >> 8, 0)
  buffer.writeUInt8(i & 0x00FF, 0 + 1)

  return buffer
}

function generateCache () {
  for (let i = 0; i < max; i++) {
    cache[i] = generateBuffer(i)
  }
}

function genBufVariableByteInt (num) {
  const maxLength = 4 // max 4 bytes
  let digit = 0
  let pos = 0
  const buffer = Buffer.allocUnsafe(maxLength)

  do {
    digit = num % 128 | 0
    num = num / 128 | 0
    if (num > 0) digit = digit | 0x80

    buffer.writeUInt8(digit, pos++)
  } while (num > 0 && pos < maxLength)

  if (num > 0) {
    pos = 0
  }

  return SubOk ? buffer.subarray(0, pos) : buffer.slice(0, pos)
}

function generate4ByteBuffer (num) {
  const buffer = Buffer.allocUnsafe(4)
  buffer.writeUInt32BE(num, 0)
  return buffer
}

module.exports = {
  cache,
  generateCache,
  generateNumber: generateBuffer,
  genBufVariableByteInt,
  generate4ByteBuffer
}

},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"node_modules/process-nextick-args/index.js":[function(require,module,exports) {
var process = require("process");
'use strict';

if (typeof process === 'undefined' ||
    !process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


},{"process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/mqtt-packet/writeToStream.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
const protocol = require('./constants')
const empty = Buffer.allocUnsafe(0)
const zeroBuf = Buffer.from([0])
const numbers = require('./numbers')
const nextTick = require('process-nextick-args').nextTick
const debug = require('debug')('mqtt-packet:writeToStream')

const numCache = numbers.cache
const generateNumber = numbers.generateNumber
const generateCache = numbers.generateCache
const genBufVariableByteInt = numbers.genBufVariableByteInt
const generate4ByteBuffer = numbers.generate4ByteBuffer
let writeNumber = writeNumberCached
let toGenerate = true

function generate (packet, stream, opts) {
  debug('generate called')
  if (stream.cork) {
    stream.cork()
    nextTick(uncork, stream)
  }

  if (toGenerate) {
    toGenerate = false
    generateCache()
  }
  debug('generate: packet.cmd: %s', packet.cmd)
  switch (packet.cmd) {
    case 'connect':
      return connect(packet, stream, opts)
    case 'connack':
      return connack(packet, stream, opts)
    case 'publish':
      return publish(packet, stream, opts)
    case 'puback':
    case 'pubrec':
    case 'pubrel':
    case 'pubcomp':
      return confirmation(packet, stream, opts)
    case 'subscribe':
      return subscribe(packet, stream, opts)
    case 'suback':
      return suback(packet, stream, opts)
    case 'unsubscribe':
      return unsubscribe(packet, stream, opts)
    case 'unsuback':
      return unsuback(packet, stream, opts)
    case 'pingreq':
    case 'pingresp':
      return emptyPacket(packet, stream, opts)
    case 'disconnect':
      return disconnect(packet, stream, opts)
    case 'auth':
      return auth(packet, stream, opts)
    default:
      stream.emit('error', new Error('Unknown command'))
      return false
  }
}
/**
 * Controls numbers cache.
 * Set to "false" to allocate buffers on-the-flight instead of pre-generated cache
 */
Object.defineProperty(generate, 'cacheNumbers', {
  get () {
    return writeNumber === writeNumberCached
  },
  set (value) {
    if (value) {
      if (!numCache || Object.keys(numCache).length === 0) toGenerate = true
      writeNumber = writeNumberCached
    } else {
      toGenerate = false
      writeNumber = writeNumberGenerated
    }
  }
})

function uncork (stream) {
  stream.uncork()
}

function connect (packet, stream, opts) {
  const settings = packet || {}
  const protocolId = settings.protocolId || 'MQTT'
  let protocolVersion = settings.protocolVersion || 4
  const will = settings.will
  let clean = settings.clean
  const keepalive = settings.keepalive || 0
  const clientId = settings.clientId || ''
  const username = settings.username
  const password = settings.password
  /* mqtt5 new oprions */
  const properties = settings.properties

  if (clean === undefined) clean = true

  let length = 0

  // Must be a string and non-falsy
  if (!protocolId ||
     (typeof protocolId !== 'string' && !Buffer.isBuffer(protocolId))) {
    stream.emit('error', new Error('Invalid protocolId'))
    return false
  } else length += protocolId.length + 2

  // Must be 3 or 4 or 5
  if (protocolVersion !== 3 && protocolVersion !== 4 && protocolVersion !== 5) {
    stream.emit('error', new Error('Invalid protocol version'))
    return false
  } else length += 1

  // ClientId might be omitted in 3.1.1 and 5, but only if cleanSession is set to 1
  if ((typeof clientId === 'string' || Buffer.isBuffer(clientId)) &&
     (clientId || protocolVersion >= 4) && (clientId || clean)) {
    length += Buffer.byteLength(clientId) + 2
  } else {
    if (protocolVersion < 4) {
      stream.emit('error', new Error('clientId must be supplied before 3.1.1'))
      return false
    }
    if ((clean * 1) === 0) {
      stream.emit('error', new Error('clientId must be given if cleanSession set to 0'))
      return false
    }
  }

  // Must be a two byte number
  if (typeof keepalive !== 'number' ||
      keepalive < 0 ||
      keepalive > 65535 ||
      keepalive % 1 !== 0) {
    stream.emit('error', new Error('Invalid keepalive'))
    return false
  } else length += 2

  // Connect flags
  length += 1

  // Properties
  if (protocolVersion === 5) {
    var propertiesData = getProperties(stream, properties)
    if (!propertiesData) { return false }
    length += propertiesData.length
  }

  // If will exists...
  if (will) {
    // It must be an object
    if (typeof will !== 'object') {
      stream.emit('error', new Error('Invalid will'))
      return false
    }
    // It must have topic typeof string
    if (!will.topic || typeof will.topic !== 'string') {
      stream.emit('error', new Error('Invalid will topic'))
      return false
    } else {
      length += Buffer.byteLength(will.topic) + 2
    }

    // Payload
    length += 2 // payload length
    if (will.payload) {
      if (will.payload.length >= 0) {
        if (typeof will.payload === 'string') {
          length += Buffer.byteLength(will.payload)
        } else {
          length += will.payload.length
        }
      } else {
        stream.emit('error', new Error('Invalid will payload'))
        return false
      }
    }
    // will properties
    var willProperties = {}
    if (protocolVersion === 5) {
      willProperties = getProperties(stream, will.properties)
      if (!willProperties) { return false }
      length += willProperties.length
    }
  }

  // Username
  let providedUsername = false
  if (username != null) {
    if (isStringOrBuffer(username)) {
      providedUsername = true
      length += Buffer.byteLength(username) + 2
    } else {
      stream.emit('error', new Error('Invalid username'))
      return false
    }
  }

  // Password
  if (password != null) {
    if (!providedUsername) {
      stream.emit('error', new Error('Username is required to use password'))
      return false
    }

    if (isStringOrBuffer(password)) {
      length += byteLength(password) + 2
    } else {
      stream.emit('error', new Error('Invalid password'))
      return false
    }
  }

  // Generate header
  stream.write(protocol.CONNECT_HEADER)

  // Generate length
  writeVarByteInt(stream, length)

  // Generate protocol ID
  writeStringOrBuffer(stream, protocolId)

  if (settings.bridgeMode) {
    protocolVersion += 128
  }

  stream.write(
    protocolVersion === 131
      ? protocol.VERSION131
      : protocolVersion === 132
        ? protocol.VERSION132
        : protocolVersion === 4
          ? protocol.VERSION4
          : protocolVersion === 5
            ? protocol.VERSION5
            : protocol.VERSION3
  )

  // Connect flags
  let flags = 0
  flags |= (username != null) ? protocol.USERNAME_MASK : 0
  flags |= (password != null) ? protocol.PASSWORD_MASK : 0
  flags |= (will && will.retain) ? protocol.WILL_RETAIN_MASK : 0
  flags |= (will && will.qos) ? will.qos << protocol.WILL_QOS_SHIFT : 0
  flags |= will ? protocol.WILL_FLAG_MASK : 0
  flags |= clean ? protocol.CLEAN_SESSION_MASK : 0

  stream.write(Buffer.from([flags]))

  // Keepalive
  writeNumber(stream, keepalive)

  // Properties
  if (protocolVersion === 5) {
    propertiesData.write()
  }

  // Client ID
  writeStringOrBuffer(stream, clientId)

  // Will
  if (will) {
    if (protocolVersion === 5) {
      willProperties.write()
    }
    writeString(stream, will.topic)
    writeStringOrBuffer(stream, will.payload)
  }

  // Username and password
  if (username != null) {
    writeStringOrBuffer(stream, username)
  }
  if (password != null) {
    writeStringOrBuffer(stream, password)
  }
  // This is a small packet that happens only once on a stream
  // We assume the stream is always free to receive more data after this
  return true
}

function connack (packet, stream, opts) {
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const rc = version === 5 ? settings.reasonCode : settings.returnCode
  const properties = settings.properties
  let length = 2 // length of rc and sessionHeader

  // Check return code
  if (typeof rc !== 'number') {
    stream.emit('error', new Error('Invalid return code'))
    return false
  }
  // mqtt5 properties
  let propertiesData = null
  if (version === 5) {
    propertiesData = getProperties(stream, properties)
    if (!propertiesData) { return false }
    length += propertiesData.length
  }

  stream.write(protocol.CONNACK_HEADER)
  // length
  writeVarByteInt(stream, length)
  stream.write(settings.sessionPresent ? protocol.SESSIONPRESENT_HEADER : zeroBuf)

  stream.write(Buffer.from([rc]))
  if (propertiesData != null) {
    propertiesData.write()
  }
  return true
}

function publish (packet, stream, opts) {
  debug('publish: packet: %o', packet)
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const qos = settings.qos || 0
  const retain = settings.retain ? protocol.RETAIN_MASK : 0
  const topic = settings.topic
  const payload = settings.payload || empty
  const id = settings.messageId
  const properties = settings.properties

  let length = 0

  // Topic must be a non-empty string or Buffer
  if (typeof topic === 'string') length += Buffer.byteLength(topic) + 2
  else if (Buffer.isBuffer(topic)) length += topic.length + 2
  else {
    stream.emit('error', new Error('Invalid topic'))
    return false
  }

  // Get the payload length
  if (!Buffer.isBuffer(payload)) length += Buffer.byteLength(payload)
  else length += payload.length

  // Message ID must a number if qos > 0
  if (qos && typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'))
    return false
  } else if (qos) length += 2

  // mqtt5 properties
  let propertiesData = null
  if (version === 5) {
    propertiesData = getProperties(stream, properties)
    if (!propertiesData) { return false }
    length += propertiesData.length
  }

  // Header
  stream.write(protocol.PUBLISH_HEADER[qos][settings.dup ? 1 : 0][retain ? 1 : 0])

  // Remaining length
  writeVarByteInt(stream, length)

  // Topic
  writeNumber(stream, byteLength(topic))
  stream.write(topic)

  // Message ID
  if (qos > 0) writeNumber(stream, id)

  // Properties
  if (propertiesData != null) {
    propertiesData.write()
  }

  // Payload
  debug('publish: payload: %o', payload)
  return stream.write(payload)
}

/* Puback, pubrec, pubrel and pubcomp */
function confirmation (packet, stream, opts) {
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const type = settings.cmd || 'puback'
  const id = settings.messageId
  const dup = (settings.dup && type === 'pubrel') ? protocol.DUP_MASK : 0
  let qos = 0
  const reasonCode = settings.reasonCode
  const properties = settings.properties
  let length = version === 5 ? 3 : 2

  if (type === 'pubrel') qos = 1

  // Check message ID
  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'))
    return false
  }

  // properies mqtt 5
  let propertiesData = null
  if (version === 5) {
    // Confirm should not add empty property length with no properties (rfc 3.4.2.2.1)
    if (typeof properties === 'object') {
      propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length)
      if (!propertiesData) { return false }
      length += propertiesData.length
    }
  }

  // Header
  stream.write(protocol.ACKS[type][qos][dup][0])

  // Length
  writeVarByteInt(stream, length)

  // Message ID
  writeNumber(stream, id)

  // reason code in header
  if (version === 5) {
    stream.write(Buffer.from([reasonCode]))
  }

  // properies mqtt 5
  if (propertiesData !== null) {
    propertiesData.write()
  }
  return true
}

function subscribe (packet, stream, opts) {
  debug('subscribe: packet: ')
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const dup = settings.dup ? protocol.DUP_MASK : 0
  const id = settings.messageId
  const subs = settings.subscriptions
  const properties = settings.properties

  let length = 0

  // Check message ID
  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'))
    return false
  } else length += 2

  // properies mqtt 5
  let propertiesData = null
  if (version === 5) {
    propertiesData = getProperties(stream, properties)
    if (!propertiesData) { return false }
    length += propertiesData.length
  }

  // Check subscriptions
  if (typeof subs === 'object' && subs.length) {
    for (let i = 0; i < subs.length; i += 1) {
      const itopic = subs[i].topic
      const iqos = subs[i].qos

      if (typeof itopic !== 'string') {
        stream.emit('error', new Error('Invalid subscriptions - invalid topic'))
        return false
      }
      if (typeof iqos !== 'number') {
        stream.emit('error', new Error('Invalid subscriptions - invalid qos'))
        return false
      }

      if (version === 5) {
        const nl = subs[i].nl || false
        if (typeof nl !== 'boolean') {
          stream.emit('error', new Error('Invalid subscriptions - invalid No Local'))
          return false
        }
        const rap = subs[i].rap || false
        if (typeof rap !== 'boolean') {
          stream.emit('error', new Error('Invalid subscriptions - invalid Retain as Published'))
          return false
        }
        const rh = subs[i].rh || 0
        if (typeof rh !== 'number' || rh > 2) {
          stream.emit('error', new Error('Invalid subscriptions - invalid Retain Handling'))
          return false
        }
      }

      length += Buffer.byteLength(itopic) + 2 + 1
    }
  } else {
    stream.emit('error', new Error('Invalid subscriptions'))
    return false
  }

  // Generate header
  debug('subscribe: writing to stream: %o', protocol.SUBSCRIBE_HEADER)
  stream.write(protocol.SUBSCRIBE_HEADER[1][dup ? 1 : 0][0])

  // Generate length
  writeVarByteInt(stream, length)

  // Generate message ID
  writeNumber(stream, id)

  // properies mqtt 5
  if (propertiesData !== null) {
    propertiesData.write()
  }

  let result = true

  // Generate subs
  for (const sub of subs) {
    const jtopic = sub.topic
    const jqos = sub.qos
    const jnl = +sub.nl
    const jrap = +sub.rap
    const jrh = sub.rh
    let joptions

    // Write topic string
    writeString(stream, jtopic)

    // options process
    joptions = protocol.SUBSCRIBE_OPTIONS_QOS[jqos]
    if (version === 5) {
      joptions |= jnl ? protocol.SUBSCRIBE_OPTIONS_NL : 0
      joptions |= jrap ? protocol.SUBSCRIBE_OPTIONS_RAP : 0
      joptions |= jrh ? protocol.SUBSCRIBE_OPTIONS_RH[jrh] : 0
    }
    // Write options
    result = stream.write(Buffer.from([joptions]))
  }

  return result
}

function suback (packet, stream, opts) {
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const id = settings.messageId
  const granted = settings.granted
  const properties = settings.properties
  let length = 0

  // Check message ID
  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'))
    return false
  } else length += 2

  // Check granted qos vector
  if (typeof granted === 'object' && granted.length) {
    for (let i = 0; i < granted.length; i += 1) {
      if (typeof granted[i] !== 'number') {
        stream.emit('error', new Error('Invalid qos vector'))
        return false
      }
      length += 1
    }
  } else {
    stream.emit('error', new Error('Invalid qos vector'))
    return false
  }

  // properies mqtt 5
  let propertiesData = null
  if (version === 5) {
    propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length)
    if (!propertiesData) { return false }
    length += propertiesData.length
  }

  // header
  stream.write(protocol.SUBACK_HEADER)

  // Length
  writeVarByteInt(stream, length)

  // Message ID
  writeNumber(stream, id)

  // properies mqtt 5
  if (propertiesData !== null) {
    propertiesData.write()
  }

  return stream.write(Buffer.from(granted))
}

function unsubscribe (packet, stream, opts) {
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const id = settings.messageId
  const dup = settings.dup ? protocol.DUP_MASK : 0
  const unsubs = settings.unsubscriptions
  const properties = settings.properties

  let length = 0

  // Check message ID
  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'))
    return false
  } else {
    length += 2
  }
  // Check unsubs
  if (typeof unsubs === 'object' && unsubs.length) {
    for (let i = 0; i < unsubs.length; i += 1) {
      if (typeof unsubs[i] !== 'string') {
        stream.emit('error', new Error('Invalid unsubscriptions'))
        return false
      }
      length += Buffer.byteLength(unsubs[i]) + 2
    }
  } else {
    stream.emit('error', new Error('Invalid unsubscriptions'))
    return false
  }
  // properies mqtt 5
  let propertiesData = null
  if (version === 5) {
    propertiesData = getProperties(stream, properties)
    if (!propertiesData) { return false }
    length += propertiesData.length
  }

  // Header
  stream.write(protocol.UNSUBSCRIBE_HEADER[1][dup ? 1 : 0][0])

  // Length
  writeVarByteInt(stream, length)

  // Message ID
  writeNumber(stream, id)

  // properies mqtt 5
  if (propertiesData !== null) {
    propertiesData.write()
  }

  // Unsubs
  let result = true
  for (let j = 0; j < unsubs.length; j++) {
    result = writeString(stream, unsubs[j])
  }

  return result
}

function unsuback (packet, stream, opts) {
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const id = settings.messageId
  const dup = settings.dup ? protocol.DUP_MASK : 0
  const granted = settings.granted
  const properties = settings.properties
  const type = settings.cmd
  const qos = 0

  let length = 2

  // Check message ID
  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'))
    return false
  }

  // Check granted
  if (version === 5) {
    if (typeof granted === 'object' && granted.length) {
      for (let i = 0; i < granted.length; i += 1) {
        if (typeof granted[i] !== 'number') {
          stream.emit('error', new Error('Invalid qos vector'))
          return false
        }
        length += 1
      }
    } else {
      stream.emit('error', new Error('Invalid qos vector'))
      return false
    }
  }

  // properies mqtt 5
  let propertiesData = null
  if (version === 5) {
    propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length)
    if (!propertiesData) { return false }
    length += propertiesData.length
  }

  // Header
  stream.write(protocol.ACKS[type][qos][dup][0])

  // Length
  writeVarByteInt(stream, length)

  // Message ID
  writeNumber(stream, id)

  // properies mqtt 5
  if (propertiesData !== null) {
    propertiesData.write()
  }

  // payload
  if (version === 5) {
    stream.write(Buffer.from(granted))
  }
  return true
}

function emptyPacket (packet, stream, opts) {
  return stream.write(protocol.EMPTY[packet.cmd])
}

function disconnect (packet, stream, opts) {
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const reasonCode = settings.reasonCode
  const properties = settings.properties
  let length = version === 5 ? 1 : 0

  // properies mqtt 5
  let propertiesData = null
  if (version === 5) {
    propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length)
    if (!propertiesData) { return false }
    length += propertiesData.length
  }

  // Header
  stream.write(Buffer.from([protocol.codes.disconnect << 4]))

  // Length
  writeVarByteInt(stream, length)

  // reason code in header
  if (version === 5) {
    stream.write(Buffer.from([reasonCode]))
  }

  // properies mqtt 5
  if (propertiesData !== null) {
    propertiesData.write()
  }

  return true
}

function auth (packet, stream, opts) {
  const version = opts ? opts.protocolVersion : 4
  const settings = packet || {}
  const reasonCode = settings.reasonCode
  const properties = settings.properties
  let length = version === 5 ? 1 : 0

  if (version !== 5) stream.emit('error', new Error('Invalid mqtt version for auth packet'))

  // properies mqtt 5
  const propertiesData = getPropertiesByMaximumPacketSize(stream, properties, opts, length)
  if (!propertiesData) { return false }
  length += propertiesData.length

  // Header
  stream.write(Buffer.from([protocol.codes.auth << 4]))

  // Length
  writeVarByteInt(stream, length)

  // reason code in header
  stream.write(Buffer.from([reasonCode]))

  // properies mqtt 5
  if (propertiesData !== null) {
    propertiesData.write()
  }
  return true
}

/**
 * writeVarByteInt - write an MQTT style variable byte integer to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <Number> length - length (>0)
 * @returns <Number> number of bytes written
 *
 * @api private
 */

const varByteIntCache = {}
function writeVarByteInt (stream, num) {
  if (num > protocol.VARBYTEINT_MAX) {
    stream.emit('error', new Error(`Invalid variable byte integer: ${num}`))
    return false
  }

  let buffer = varByteIntCache[num]

  if (!buffer) {
    buffer = genBufVariableByteInt(num)
    if (num < 16384) varByteIntCache[num] = buffer
  }
  debug('writeVarByteInt: writing to stream: %o', buffer)
  return stream.write(buffer)
}

/**
 * writeString - write a utf8 string to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> string - string to write
 * @return <Number> number of bytes written
 *
 * @api private
 */

function writeString (stream, string) {
  const strlen = Buffer.byteLength(string)
  writeNumber(stream, strlen)

  debug('writeString: %s', string)
  return stream.write(string, 'utf8')
}

/**
 * writeStringPair - write a utf8 string pairs to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <String> name - string name to write
 * @param <String> value - string value to write
 * @return <Number> number of bytes written
 *
 * @api private
 */
function writeStringPair (stream, name, value) {
  writeString(stream, name)
  writeString(stream, value)
}

/**
 * writeNumber - write a two byte number to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> number - number to write
 * @return <Number> number of bytes written
 *
 * @api private
 */
function writeNumberCached (stream, number) {
  debug('writeNumberCached: number: %d', number)
  debug('writeNumberCached: %o', numCache[number])
  return stream.write(numCache[number])
}
function writeNumberGenerated (stream, number) {
  const generatedNumber = generateNumber(number)
  debug('writeNumberGenerated: %o', generatedNumber)
  return stream.write(generatedNumber)
}
function write4ByteNumber (stream, number) {
  const generated4ByteBuffer = generate4ByteBuffer(number)
  debug('write4ByteNumber: %o', generated4ByteBuffer)
  return stream.write(generated4ByteBuffer)
}
/**
 * writeStringOrBuffer - write a String or Buffer with the its length prefix
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> toWrite - String or Buffer
 * @return <Number> number of bytes written
 */
function writeStringOrBuffer (stream, toWrite) {
  if (typeof toWrite === 'string') {
    writeString(stream, toWrite)
  } else if (toWrite) {
    writeNumber(stream, toWrite.length)
    stream.write(toWrite)
  } else writeNumber(stream, 0)
}

function getProperties (stream, properties) {
  /* connect properties */
  if (typeof properties !== 'object' || properties.length != null) {
    return {
      length: 1,
      write () {
        writeProperties(stream, {}, 0)
      }
    }
  }
  let propertiesLength = 0
  function getLengthProperty (name, value) {
    const type = protocol.propertiesTypes[name]
    let length = 0
    switch (type) {
      case 'byte': {
        if (typeof value !== 'boolean') {
          stream.emit('error', new Error(`Invalid ${name}: ${value}`))
          return false
        }
        length += 1 + 1
        break
      }
      case 'int8': {
        if (typeof value !== 'number' || value < 0 || value > 0xff) {
          stream.emit('error', new Error(`Invalid ${name}: ${value}`))
          return false
        }
        length += 1 + 1
        break
      }
      case 'binary': {
        if (value && value === null) {
          stream.emit('error', new Error(`Invalid ${name}: ${value}`))
          return false
        }
        length += 1 + Buffer.byteLength(value) + 2
        break
      }
      case 'int16': {
        if (typeof value !== 'number' || value < 0 || value > 0xffff) {
          stream.emit('error', new Error(`Invalid ${name}: ${value}`))
          return false
        }
        length += 1 + 2
        break
      }
      case 'int32': {
        if (typeof value !== 'number' || value < 0 || value > 0xffffffff) {
          stream.emit('error', new Error(`Invalid ${name}: ${value}`))
          return false
        }
        length += 1 + 4
        break
      }
      case 'var': {
        // var byte integer is max 24 bits packed in 32 bits
        if (typeof value !== 'number' || value < 0 || value > 0x0fffffff) {
          stream.emit('error', new Error(`Invalid ${name}: ${value}`))
          return false
        }
        length += 1 + Buffer.byteLength(genBufVariableByteInt(value))
        break
      }
      case 'string': {
        if (typeof value !== 'string') {
          stream.emit('error', new Error(`Invalid ${name}: ${value}`))
          return false
        }
        length += 1 + 2 + Buffer.byteLength(value.toString())
        break
      }
      case 'pair': {
        if (typeof value !== 'object') {
          stream.emit('error', new Error(`Invalid ${name}: ${value}`))
          return false
        }
        length += Object.getOwnPropertyNames(value).reduce((result, name) => {
          const currentValue = value[name]
          if (Array.isArray(currentValue)) {
            result += currentValue.reduce((currentLength, value) => {
              currentLength += 1 + 2 + Buffer.byteLength(name.toString()) + 2 + Buffer.byteLength(value.toString())
              return currentLength
            }, 0)
          } else {
            result += 1 + 2 + Buffer.byteLength(name.toString()) + 2 + Buffer.byteLength(value[name].toString())
          }
          return result
        }, 0)
        break
      }
      default: {
        stream.emit('error', new Error(`Invalid property ${name}: ${value}`))
        return false
      }
    }
    return length
  }
  if (properties) {
    for (const propName in properties) {
      let propLength = 0
      let propValueLength = 0
      const propValue = properties[propName]
      if (Array.isArray(propValue)) {
        for (let valueIndex = 0; valueIndex < propValue.length; valueIndex++) {
          propValueLength = getLengthProperty(propName, propValue[valueIndex])
          if (!propValueLength) { return false }
          propLength += propValueLength
        }
      } else {
        propValueLength = getLengthProperty(propName, propValue)
        if (!propValueLength) { return false }
        propLength = propValueLength
      }
      if (!propLength) return false
      propertiesLength += propLength
    }
  }
  const propertiesLengthLength = Buffer.byteLength(genBufVariableByteInt(propertiesLength))

  return {
    length: propertiesLengthLength + propertiesLength,
    write () {
      writeProperties(stream, properties, propertiesLength)
    }
  }
}

function getPropertiesByMaximumPacketSize (stream, properties, opts, length) {
  const mayEmptyProps = ['reasonString', 'userProperties']
  const maximumPacketSize = opts && opts.properties && opts.properties.maximumPacketSize ? opts.properties.maximumPacketSize : 0

  let propertiesData = getProperties(stream, properties)
  if (maximumPacketSize) {
    while (length + propertiesData.length > maximumPacketSize) {
      const currentMayEmptyProp = mayEmptyProps.shift()
      if (currentMayEmptyProp && properties[currentMayEmptyProp]) {
        delete properties[currentMayEmptyProp]
        propertiesData = getProperties(stream, properties)
      } else {
        return false
      }
    }
  }
  return propertiesData
}

function writeProperty (stream, propName, value) {
  const type = protocol.propertiesTypes[propName]
  switch (type) {
    case 'byte': {
      stream.write(Buffer.from([protocol.properties[propName]]))
      stream.write(Buffer.from([+value]))
      break
    }
    case 'int8': {
      stream.write(Buffer.from([protocol.properties[propName]]))
      stream.write(Buffer.from([value]))
      break
    }
    case 'binary': {
      stream.write(Buffer.from([protocol.properties[propName]]))
      writeStringOrBuffer(stream, value)
      break
    }
    case 'int16': {
      stream.write(Buffer.from([protocol.properties[propName]]))
      writeNumber(stream, value)
      break
    }
    case 'int32': {
      stream.write(Buffer.from([protocol.properties[propName]]))
      write4ByteNumber(stream, value)
      break
    }
    case 'var': {
      stream.write(Buffer.from([protocol.properties[propName]]))
      writeVarByteInt(stream, value)
      break
    }
    case 'string': {
      stream.write(Buffer.from([protocol.properties[propName]]))
      writeString(stream, value)
      break
    }
    case 'pair': {
      Object.getOwnPropertyNames(value).forEach(name => {
        const currentValue = value[name]
        if (Array.isArray(currentValue)) {
          currentValue.forEach(value => {
            stream.write(Buffer.from([protocol.properties[propName]]))
            writeStringPair(stream, name.toString(), value.toString())
          })
        } else {
          stream.write(Buffer.from([protocol.properties[propName]]))
          writeStringPair(stream, name.toString(), currentValue.toString())
        }
      })
      break
    }
    default: {
      stream.emit('error', new Error(`Invalid property ${propName} value: ${value}`))
      return false
    }
  }
}

function writeProperties (stream, properties, propertiesLength) {
  /* write properties to stream */
  writeVarByteInt(stream, propertiesLength)
  for (const propName in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, propName) && properties[propName] !== null) {
      const value = properties[propName]
      if (Array.isArray(value)) {
        for (let valueIndex = 0; valueIndex < value.length; valueIndex++) {
          writeProperty(stream, propName, value[valueIndex])
        }
      } else {
        writeProperty(stream, propName, value)
      }
    }
  }
}

function byteLength (bufOrString) {
  if (!bufOrString) return 0
  else if (bufOrString instanceof Buffer) return bufOrString.length
  else return Buffer.byteLength(bufOrString)
}

function isStringOrBuffer (field) {
  return typeof field === 'string' || field instanceof Buffer
}

module.exports = generate

},{"./constants":"node_modules/mqtt-packet/constants.js","./numbers":"node_modules/mqtt-packet/numbers.js","process-nextick-args":"node_modules/process-nextick-args/index.js","debug":"node_modules/debug/src/browser.js","buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"node_modules/mqtt-packet/generate.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
const writeToStream = require('./writeToStream')
const EventEmitter = require('events')

function generate (packet, opts) {
  const stream = new Accumulator()
  writeToStream(packet, stream, opts)
  return stream.concat()
}

class Accumulator extends EventEmitter {
  constructor () {
    super()
    this._array = new Array(20)
    this._i = 0
  }

  write (chunk) {
    this._array[this._i++] = chunk
    return true
  }

  concat () {
    let length = 0
    const lengths = new Array(this._array.length)
    const list = this._array
    let pos = 0
    let i

    for (i = 0; i < list.length && list[i] !== undefined; i++) {
      if (typeof list[i] !== 'string') lengths[i] = list[i].length
      else lengths[i] = Buffer.byteLength(list[i])

      length += lengths[i]
    }

    const result = Buffer.allocUnsafe(length)

    for (i = 0; i < list.length && list[i] !== undefined; i++) {
      if (typeof list[i] !== 'string') {
        list[i].copy(result, pos)
        pos += lengths[i]
      } else {
        result.write(list[i], pos)
        pos += lengths[i]
      }
    }

    return result
  }
}

module.exports = generate

},{"./writeToStream":"node_modules/mqtt-packet/writeToStream.js","events":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/events/events.js","buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"node_modules/mqtt-packet/mqtt.js":[function(require,module,exports) {
exports.parser = require('./parser').parser
exports.generate = require('./generate')
exports.writeToStream = require('./writeToStream')

},{"./parser":"node_modules/mqtt-packet/parser.js","./generate":"node_modules/mqtt-packet/generate.js","./writeToStream":"node_modules/mqtt-packet/writeToStream.js"}],"node_modules/mqtt/lib/default-message-id-provider.js":[function(require,module,exports) {
'use strict';
/**
 * DefaultMessageAllocator constructor
 * @constructor
 */

function DefaultMessageIdProvider() {
  if (!(this instanceof DefaultMessageIdProvider)) {
    return new DefaultMessageIdProvider();
  }
  /**
   * MessageIDs starting with 1
   * ensure that nextId is min. 1, see https://github.com/mqttjs/MQTT.js/issues/810
   */


  this.nextId = Math.max(1, Math.floor(Math.random() * 65535));
}
/**
 * allocate
 *
 * Get the next messageId.
 * @return unsigned int
 */


DefaultMessageIdProvider.prototype.allocate = function () {
  // id becomes current state of this.nextId and increments afterwards
  var id = this.nextId++; // Ensure 16 bit unsigned int (max 65535, nextId got one higher)

  if (this.nextId === 65536) {
    this.nextId = 1;
  }

  return id;
};
/**
 * getLastAllocated
 * Get the last allocated messageId.
 * @return unsigned int
 */


DefaultMessageIdProvider.prototype.getLastAllocated = function () {
  return this.nextId === 1 ? 65535 : this.nextId - 1;
};
/**
 * register
 * Register messageId. If success return true, otherwise return false.
 * @param { unsigned int } - messageId to register,
 * @return boolean
 */


DefaultMessageIdProvider.prototype.register = function (messageId) {
  return true;
};
/**
 * deallocate
 * Deallocate messageId.
 * @param { unsigned int } - messageId to deallocate,
 */


DefaultMessageIdProvider.prototype.deallocate = function (messageId) {};
/**
 * clear
 * Deallocate all messageIds.
 */


DefaultMessageIdProvider.prototype.clear = function () {};

module.exports = DefaultMessageIdProvider;
},{}],"node_modules/reinterval/index.js":[function(require,module,exports) {
'use strict'

function ReInterval (callback, interval, args) {
  var self = this;

  this._callback = callback;
  this._args = args;

  this._interval = setInterval(callback, interval, this._args);

  this.reschedule = function (interval) {
    // if no interval entered, use the interval passed in on creation
    if (!interval)
      interval = self._interval;

    if (self._interval)
      clearInterval(self._interval);
    self._interval = setInterval(self._callback, interval, self._args);
  };

  this.clear = function () {
    if (self._interval) {
      clearInterval(self._interval);
      self._interval = undefined;
    }
  };
  
  this.destroy = function () {
    if (self._interval) {
      clearInterval(self._interval);
    }
    self._callback = undefined;
    self._interval = undefined;
    self._args = undefined;
  };
}

function reInterval () {
  if (typeof arguments[0] !== 'function')
    throw new Error('callback needed');
  if (typeof arguments[1] !== 'number')
    throw new Error('interval needed');

  var args;

  if (arguments.length > 0) {
    args = new Array(arguments.length - 2);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 2];
    }
  }

  return new ReInterval(arguments[0], arguments[1], args);
}

module.exports = reInterval;

},{}],"node_modules/rfdc/index.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
'use strict'
module.exports = rfdc

function copyBuffer (cur) {
  if (cur instanceof Buffer) {
    return Buffer.from(cur)
  }

  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length)
}

function rfdc (opts) {
  opts = opts || {}

  if (opts.circles) return rfdcCircles(opts)
  return opts.proto ? cloneProto : clone

  function cloneArray (a, fn) {
    var keys = Object.keys(a)
    var a2 = new Array(keys.length)
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      var cur = a[k]
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur)
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur)
      } else {
        a2[k] = fn(cur)
      }
    }
    return a2
  }

  function clone (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone))
    var o2 = {}
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        o2[k] = clone(cur)
      }
    }
    return o2
  }

  function cloneProto (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), cloneProto))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), cloneProto))
    var o2 = {}
    for (var k in o) {
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), cloneProto))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), cloneProto))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        o2[k] = cloneProto(cur)
      }
    }
    return o2
  }
}

function rfdcCircles (opts) {
  var refs = []
  var refsNew = []

  return opts.proto ? cloneProto : clone

  function cloneArray (a, fn) {
    var keys = Object.keys(a)
    var a2 = new Array(keys.length)
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      var cur = a[k]
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur)
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur)
      } else {
        var index = refs.indexOf(cur)
        if (index !== -1) {
          a2[k] = refsNew[index]
        } else {
          a2[k] = fn(cur)
        }
      }
    }
    return a2
  }

  function clone (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone))
    var o2 = {}
    refs.push(o)
    refsNew.push(o2)
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        var i = refs.indexOf(cur)
        if (i !== -1) {
          o2[k] = refsNew[i]
        } else {
          o2[k] = clone(cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return o2
  }

  function cloneProto (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), cloneProto))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), cloneProto))
    var o2 = {}
    refs.push(o)
    refsNew.push(o2)
    for (var k in o) {
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), cloneProto))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), cloneProto))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        var i = refs.indexOf(cur)
        if (i !== -1) {
          o2[k] = refsNew[i]
        } else {
          o2[k] = cloneProto(cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return o2
  }
}

},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js"}],"node_modules/rfdc/default.js":[function(require,module,exports) {
'use strict'

module.exports = require('./index.js')()

},{"./index.js":"node_modules/rfdc/index.js"}],"node_modules/mqtt/lib/validations.js":[function(require,module,exports) {
'use strict';
/**
 * Validate a topic to see if it's valid or not.
 * A topic is valid if it follow below rules:
 * - Rule #1: If any part of the topic is not `+` or `#`, then it must not contain `+` and '#'
 * - Rule #2: Part `#` must be located at the end of the mailbox
 *
 * @param {String} topic - A topic
 * @returns {Boolean} If the topic is valid, returns true. Otherwise, returns false.
 */

function validateTopic(topic) {
  var parts = topic.split('/');

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === '+') {
      continue;
    }

    if (parts[i] === '#') {
      // for Rule #2
      return i === parts.length - 1;
    }

    if (parts[i].indexOf('+') !== -1 || parts[i].indexOf('#') !== -1) {
      return false;
    }
  }

  return true;
}
/**
 * Validate an array of topics to see if any of them is valid or not
  * @param {Array} topics - Array of topics
 * @returns {String} If the topics is valid, returns null. Otherwise, returns the invalid one
 */


function validateTopics(topics) {
  if (topics.length === 0) {
    return 'empty_topic_list';
  }

  for (var i = 0; i < topics.length; i++) {
    if (!validateTopic(topics[i])) {
      return topics[i];
    }
  }

  return null;
}

module.exports = {
  validateTopics: validateTopics
};
},{}],"node_modules/mqtt/lib/client.js":[function(require,module,exports) {
var process = require("process");
var global = arguments[3];
'use strict';
/**
 * Module dependencies
 */

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EventEmitter = require('events').EventEmitter;

var Store = require('./store');

var TopicAliasRecv = require('./topic-alias-recv');

var TopicAliasSend = require('./topic-alias-send');

var mqttPacket = require('mqtt-packet');

var DefaultMessageIdProvider = require('./default-message-id-provider');

var Writable = require('readable-stream').Writable;

var inherits = require('inherits');

var reInterval = require('reinterval');

var clone = require('rfdc/default');

var validations = require('./validations');

var xtend = require('xtend');

var debug = require('debug')('mqttjs:client');

var nextTick = process ? process.nextTick : function (callback) {
  setTimeout(callback, 0);
};

var setImmediate = global.setImmediate || function (callback) {
  // works in node v0.8
  nextTick(callback);
};

var defaultConnectOptions = {
  keepalive: 60,
  reschedulePings: true,
  protocolId: 'MQTT',
  protocolVersion: 4,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  clean: true,
  resubscribe: true
};
var socketErrors = ['ECONNREFUSED', 'EADDRINUSE', 'ECONNRESET', 'ENOTFOUND']; // Other Socket Errors: EADDRINUSE, ECONNRESET, ENOTFOUND.

var errors = {
  0: '',
  1: 'Unacceptable protocol version',
  2: 'Identifier rejected',
  3: 'Server unavailable',
  4: 'Bad username or password',
  5: 'Not authorized',
  16: 'No matching subscribers',
  17: 'No subscription existed',
  128: 'Unspecified error',
  129: 'Malformed Packet',
  130: 'Protocol Error',
  131: 'Implementation specific error',
  132: 'Unsupported Protocol Version',
  133: 'Client Identifier not valid',
  134: 'Bad User Name or Password',
  135: 'Not authorized',
  136: 'Server unavailable',
  137: 'Server busy',
  138: 'Banned',
  139: 'Server shutting down',
  140: 'Bad authentication method',
  141: 'Keep Alive timeout',
  142: 'Session taken over',
  143: 'Topic Filter invalid',
  144: 'Topic Name invalid',
  145: 'Packet identifier in use',
  146: 'Packet Identifier not found',
  147: 'Receive Maximum exceeded',
  148: 'Topic Alias invalid',
  149: 'Packet too large',
  150: 'Message rate too high',
  151: 'Quota exceeded',
  152: 'Administrative action',
  153: 'Payload format invalid',
  154: 'Retain not supported',
  155: 'QoS not supported',
  156: 'Use another server',
  157: 'Server moved',
  158: 'Shared Subscriptions not supported',
  159: 'Connection rate exceeded',
  160: 'Maximum connect time',
  161: 'Subscription Identifiers not supported',
  162: 'Wildcard Subscriptions not supported'
};

function defaultId() {
  return 'mqttjs_' + Math.random().toString(16).substr(2, 8);
}

function applyTopicAlias(client, packet) {
  if (client.options.protocolVersion === 5) {
    if (packet.cmd === 'publish') {
      var alias;

      if (packet.properties) {
        alias = packet.properties.topicAlias;
      }

      var topic = packet.topic.toString();

      if (client.topicAliasSend) {
        if (alias) {
          if (topic.length !== 0) {
            // register topic alias
            debug('applyTopicAlias :: register topic: %s - alias: %d', topic, alias);

            if (!client.topicAliasSend.put(topic, alias)) {
              debug('applyTopicAlias :: error out of range. topic: %s - alias: %d', topic, alias);
              return new Error('Sending Topic Alias out of range');
            }
          }
        } else {
          if (topic.length !== 0) {
            if (client.options.autoAssignTopicAlias) {
              alias = client.topicAliasSend.getAliasByTopic(topic);

              if (alias) {
                packet.topic = '';
                packet.properties = _objectSpread(_objectSpread({}, packet.properties), {}, {
                  topicAlias: alias
                });
                debug('applyTopicAlias :: auto assign(use) topic: %s - alias: %d', topic, alias);
              } else {
                alias = client.topicAliasSend.getLruAlias();
                client.topicAliasSend.put(topic, alias);
                packet.properties = _objectSpread(_objectSpread({}, packet.properties), {}, {
                  topicAlias: alias
                });
                debug('applyTopicAlias :: auto assign topic: %s - alias: %d', topic, alias);
              }
            } else if (client.options.autoUseTopicAlias) {
              alias = client.topicAliasSend.getAliasByTopic(topic);

              if (alias) {
                packet.topic = '';
                packet.properties = _objectSpread(_objectSpread({}, packet.properties), {}, {
                  topicAlias: alias
                });
                debug('applyTopicAlias :: auto use topic: %s - alias: %d', topic, alias);
              }
            }
          }
        }
      } else if (alias) {
        debug('applyTopicAlias :: error out of range. topic: %s - alias: %d', topic, alias);
        return new Error('Sending Topic Alias out of range');
      }
    }
  }
}

function removeTopicAliasAndRecoverTopicName(client, packet) {
  var alias;

  if (packet.properties) {
    alias = packet.properties.topicAlias;
  }

  var topic = packet.topic.toString();

  if (topic.length === 0) {
    // restore topic from alias
    if (typeof alias === 'undefined') {
      return new Error('Unregistered Topic Alias');
    } else {
      topic = client.topicAliasSend.getTopicByAlias(alias);

      if (typeof topic === 'undefined') {
        return new Error('Unregistered Topic Alias');
      } else {
        packet.topic = topic;
      }
    }
  }

  if (alias) {
    delete packet.properties.topicAlias;
  }
}

function sendPacket(client, packet, cb) {
  debug('sendPacket :: packet: %O', packet);
  debug('sendPacket :: emitting `packetsend`');
  client.emit('packetsend', packet);
  debug('sendPacket :: writing to stream');
  var result = mqttPacket.writeToStream(packet, client.stream, client.options);
  debug('sendPacket :: writeToStream result %s', result);

  if (!result && cb && cb !== nop) {
    debug('sendPacket :: handle events on `drain` once through callback.');
    client.stream.once('drain', cb);
  } else if (cb) {
    debug('sendPacket :: invoking cb');
    cb();
  }
}

function flush(queue) {
  if (queue) {
    debug('flush: queue exists? %b', !!queue);
    Object.keys(queue).forEach(function (messageId) {
      if (typeof queue[messageId].cb === 'function') {
        queue[messageId].cb(new Error('Connection closed')); // This is suspicious.  Why do we only delete this if we have a callbck?
        // If this is by-design, then adding no as callback would cause this to get deleted unintentionally.

        delete queue[messageId];
      }
    });
  }
}

function flushVolatile(queue) {
  if (queue) {
    debug('flushVolatile :: deleting volatile messages from the queue and setting their callbacks as error function');
    Object.keys(queue).forEach(function (messageId) {
      if (queue[messageId].volatile && typeof queue[messageId].cb === 'function') {
        queue[messageId].cb(new Error('Connection closed'));
        delete queue[messageId];
      }
    });
  }
}

function storeAndSend(client, packet, cb, cbStorePut) {
  debug('storeAndSend :: store packet with cmd %s to outgoingStore', packet.cmd);
  var storePacket = packet;
  var err;

  if (storePacket.cmd === 'publish') {
    // The original packet is for sending.
    // The cloned storePacket is for storing to resend on reconnect.
    // Topic Alias must not be used after disconnected.
    storePacket = clone(packet);
    err = removeTopicAliasAndRecoverTopicName(client, storePacket);

    if (err) {
      return cb && cb(err);
    }
  }

  client.outgoingStore.put(storePacket, function storedPacket(err) {
    if (err) {
      return cb && cb(err);
    }

    cbStorePut();
    sendPacket(client, packet, cb);
  });
}

function nop(error) {
  debug('nop ::', error);
}
/**
 * MqttClient constructor
 *
 * @param {Stream} stream - stream
 * @param {Object} [options] - connection options
 * (see Connection#connect)
 */


function MqttClient(streamBuilder, options) {
  var k;
  var that = this;

  if (!(this instanceof MqttClient)) {
    return new MqttClient(streamBuilder, options);
  }

  this.options = options || {}; // Defaults

  for (k in defaultConnectOptions) {
    if (typeof this.options[k] === 'undefined') {
      this.options[k] = defaultConnectOptions[k];
    } else {
      this.options[k] = options[k];
    }
  }

  debug('MqttClient :: options.protocol', options.protocol);
  debug('MqttClient :: options.protocolVersion', options.protocolVersion);
  debug('MqttClient :: options.username', options.username);
  debug('MqttClient :: options.keepalive', options.keepalive);
  debug('MqttClient :: options.reconnectPeriod', options.reconnectPeriod);
  debug('MqttClient :: options.rejectUnauthorized', options.rejectUnauthorized);
  debug('MqttClient :: options.topicAliasMaximum', options.topicAliasMaximum);
  this.options.clientId = typeof options.clientId === 'string' ? options.clientId : defaultId();
  debug('MqttClient :: clientId', this.options.clientId);
  this.options.customHandleAcks = options.protocolVersion === 5 && options.customHandleAcks ? options.customHandleAcks : function () {
    arguments[3](0);
  };
  this.streamBuilder = streamBuilder;
  this.messageIdProvider = typeof this.options.messageIdProvider === 'undefined' ? new DefaultMessageIdProvider() : this.options.messageIdProvider; // Inflight message storages

  this.outgoingStore = options.outgoingStore || new Store();
  this.incomingStore = options.incomingStore || new Store(); // Should QoS zero messages be queued when the connection is broken?

  this.queueQoSZero = options.queueQoSZero === undefined ? true : options.queueQoSZero; // map of subscribed topics to support reconnection

  this._resubscribeTopics = {}; // map of a subscribe messageId and a topic

  this.messageIdToTopic = {}; // Ping timer, setup in _setupPingTimer

  this.pingTimer = null; // Is the client connected?

  this.connected = false; // Are we disconnecting?

  this.disconnecting = false; // Packet queue

  this.queue = []; // connack timer

  this.connackTimer = null; // Reconnect timer

  this.reconnectTimer = null; // Is processing store?

  this._storeProcessing = false; // Packet Ids are put into the store during store processing

  this._packetIdsDuringStoreProcessing = {}; // Store processing queue

  this._storeProcessingQueue = []; // Inflight callbacks

  this.outgoing = {}; // True if connection is first time.

  this._firstConnection = true;

  if (options.topicAliasMaximum > 0) {
    if (options.topicAliasMaximum > 0xffff) {
      debug('MqttClient :: options.topicAliasMaximum is out of range');
    } else {
      this.topicAliasRecv = new TopicAliasRecv(options.topicAliasMaximum);
    }
  } // Send queued packets


  this.on('connect', function () {
    var queue = this.queue;

    function deliver() {
      var entry = queue.shift();
      debug('deliver :: entry %o', entry);
      var packet = null;

      if (!entry) {
        that._resubscribe();

        return;
      }

      packet = entry.packet;
      debug('deliver :: call _sendPacket for %o', packet);
      var send = true;

      if (packet.messageId && packet.messageId !== 0) {
        if (!that.messageIdProvider.register(packet.messageId)) {
          send = false;
        }
      }

      if (send) {
        that._sendPacket(packet, function (err) {
          if (entry.cb) {
            entry.cb(err);
          }

          deliver();
        });
      } else {
        debug('messageId: %d has already used. The message is skipped and removed.', packet.messageId);
        deliver();
      }
    }

    debug('connect :: sending queued packets');
    deliver();
  });
  this.on('close', function () {
    debug('close :: connected set to `false`');
    this.connected = false;
    debug('close :: clearing connackTimer');
    clearTimeout(this.connackTimer);
    debug('close :: clearing ping timer');

    if (that.pingTimer !== null) {
      that.pingTimer.clear();
      that.pingTimer = null;
    }

    if (this.topicAliasRecv) {
      this.topicAliasRecv.clear();
    }

    debug('close :: calling _setupReconnect');

    this._setupReconnect();
  });
  EventEmitter.call(this);
  debug('MqttClient :: setting up stream');

  this._setupStream();
}

inherits(MqttClient, EventEmitter);
/**
 * setup the event handlers in the inner stream.
 *
 * @api private
 */

MqttClient.prototype._setupStream = function () {
  var _this = this;

  var that = this;
  var writable = new Writable();
  var parser = mqttPacket.parser(this.options);
  var completeParse = null;
  var packets = [];
  debug('_setupStream :: calling method to clear reconnect');

  this._clearReconnect();

  debug('_setupStream :: using streamBuilder provided to client to create stream');
  this.stream = this.streamBuilder(this);
  parser.on('packet', function (packet) {
    debug('parser :: on packet push to packets array.');
    packets.push(packet);
  });

  function nextTickWork() {
    if (packets.length) {
      nextTick(work);
    } else {
      var done = completeParse;
      completeParse = null;
      done();
    }
  }

  function work() {
    debug('work :: getting next packet in queue');
    var packet = packets.shift();

    if (packet) {
      debug('work :: packet pulled from queue');

      that._handlePacket(packet, nextTickWork);
    } else {
      debug('work :: no packets in queue');
      var done = completeParse;
      completeParse = null;
      debug('work :: done flag is %s', !!done);
      if (done) done();
    }
  }

  writable._write = function (buf, enc, done) {
    completeParse = done;
    debug('writable stream :: parsing buffer');
    parser.parse(buf);
    work();
  };

  function streamErrorHandler(error) {
    debug('streamErrorHandler :: error', error.message);

    if (socketErrors.includes(error.code)) {
      // handle error
      debug('streamErrorHandler :: emitting error');
      that.emit('error', error);
    } else {
      nop(error);
    }
  }

  debug('_setupStream :: pipe stream to writable stream');
  this.stream.pipe(writable); // Suppress connection errors

  this.stream.on('error', streamErrorHandler); // Echo stream close

  this.stream.on('close', function () {
    debug('(%s)stream :: on close', that.options.clientId);
    flushVolatile(that.outgoing);
    debug('stream: emit close to MqttClient');
    that.emit('close');
  }); // Send a connect packet

  debug('_setupStream: sending packet `connect`');
  var connectPacket = Object.create(this.options);
  connectPacket.cmd = 'connect';

  if (this.topicAliasRecv) {
    if (!connectPacket.properties) {
      connectPacket.properties = {};
    }

    if (this.topicAliasRecv) {
      connectPacket.properties.topicAliasMaximum = this.topicAliasRecv.max;
    }
  } // avoid message queue


  sendPacket(this, connectPacket); // Echo connection errors

  parser.on('error', this.emit.bind(this, 'error')); // auth

  if (this.options.properties) {
    if (!this.options.properties.authenticationMethod && this.options.properties.authenticationData) {
      that.end(function () {
        return _this.emit('error', new Error('Packet has no Authentication Method'));
      });
      return this;
    }

    if (this.options.properties.authenticationMethod && this.options.authPacket && _typeof(this.options.authPacket) === 'object') {
      var authPacket = xtend({
        cmd: 'auth',
        reasonCode: 0
      }, this.options.authPacket);
      sendPacket(this, authPacket);
    }
  } // many drain listeners are needed for qos 1 callbacks if the connection is intermittent


  this.stream.setMaxListeners(1000);
  clearTimeout(this.connackTimer);
  this.connackTimer = setTimeout(function () {
    debug('!!connectTimeout hit!! Calling _cleanUp with force `true`');

    that._cleanUp(true);
  }, this.options.connectTimeout);
};

MqttClient.prototype._handlePacket = function (packet, done) {
  var options = this.options;

  if (options.protocolVersion === 5 && options.properties && options.properties.maximumPacketSize && options.properties.maximumPacketSize < packet.length) {
    this.emit('error', new Error('exceeding packets size ' + packet.cmd));
    this.end({
      reasonCode: 149,
      properties: {
        reasonString: 'Maximum packet size was exceeded'
      }
    });
    return this;
  }

  debug('_handlePacket :: emitting packetreceive');
  this.emit('packetreceive', packet);

  switch (packet.cmd) {
    case 'publish':
      this._handlePublish(packet, done);

      break;

    case 'puback':
    case 'pubrec':
    case 'pubcomp':
    case 'suback':
    case 'unsuback':
      this._handleAck(packet);

      done();
      break;

    case 'pubrel':
      this._handlePubrel(packet, done);

      break;

    case 'connack':
      this._handleConnack(packet);

      done();
      break;

    case 'auth':
      this._handleAuth(packet);

      done();
      break;

    case 'pingresp':
      this._handlePingresp(packet);

      done();
      break;

    case 'disconnect':
      this._handleDisconnect(packet);

      done();
      break;

    default:
      // do nothing
      // maybe we should do an error handling
      // or just log it
      break;
  }
};

MqttClient.prototype._checkDisconnecting = function (callback) {
  if (this.disconnecting) {
    if (callback && callback !== nop) {
      callback(new Error('client disconnecting'));
    } else {
      this.emit('error', new Error('client disconnecting'));
    }
  }

  return this.disconnecting;
};
/**
 * publish - publish <message> to <topic>
 *
 * @param {String} topic - topic to publish to
 * @param {String, Buffer} message - message to publish
 * @param {Object} [opts] - publish options, includes:
 *    {Number} qos - qos level to publish on
 *    {Boolean} retain - whether or not to retain the message
 *    {Boolean} dup - whether or not mark a message as duplicate
 *    {Function} cbStorePut - function(){} called when message is put into `outgoingStore`
 * @param {Function} [callback] - function(err){}
 *    called when publish succeeds or fails
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example client.publish('topic', 'message');
 * @example
 *     client.publish('topic', 'message', {qos: 1, retain: true, dup: true});
 * @example client.publish('topic', 'message', console.log);
 */


MqttClient.prototype.publish = function (topic, message, opts, callback) {
  debug('publish :: message `%s` to topic `%s`', message, topic);
  var options = this.options; // .publish(topic, payload, cb);

  if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  } // default opts


  var defaultOpts = {
    qos: 0,
    retain: false,
    dup: false
  };
  opts = xtend(defaultOpts, opts);

  if (this._checkDisconnecting(callback)) {
    return this;
  }

  var that = this;

  var publishProc = function publishProc() {
    var messageId = 0;

    if (opts.qos === 1 || opts.qos === 2) {
      messageId = that._nextId();

      if (messageId === null) {
        debug('No messageId left');
        return false;
      }
    }

    var packet = {
      cmd: 'publish',
      topic: topic,
      payload: message,
      qos: opts.qos,
      retain: opts.retain,
      messageId: messageId,
      dup: opts.dup
    };

    if (options.protocolVersion === 5) {
      packet.properties = opts.properties;
    }

    debug('publish :: qos', opts.qos);

    switch (opts.qos) {
      case 1:
      case 2:
        // Add to callbacks
        that.outgoing[packet.messageId] = {
          volatile: false,
          cb: callback || nop
        };
        debug('MqttClient:publish: packet cmd: %s', packet.cmd);

        that._sendPacket(packet, undefined, opts.cbStorePut);

        break;

      default:
        debug('MqttClient:publish: packet cmd: %s', packet.cmd);

        that._sendPacket(packet, callback, opts.cbStorePut);

        break;
    }

    return true;
  };

  if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !publishProc()) {
    this._storeProcessingQueue.push({
      invoke: publishProc,
      cbStorePut: opts.cbStorePut,
      callback: callback
    });
  }

  return this;
};
/**
 * subscribe - subscribe to <topic>
 *
 * @param {String, Array, Object} topic - topic(s) to subscribe to, supports objects in the form {'topic': qos}
 * @param {Object} [opts] - optional subscription options, includes:
 *    {Number} qos - subscribe qos level
 * @param {Function} [callback] - function(err, granted){} where:
 *    {Error} err - subscription error (none at the moment!)
 *    {Array} granted - array of {topic: 't', qos: 0}
 * @returns {MqttClient} this - for chaining
 * @api public
 * @example client.subscribe('topic');
 * @example client.subscribe('topic', {qos: 1});
 * @example client.subscribe({'topic': {qos: 0}, 'topic2': {qos: 1}}, console.log);
 * @example client.subscribe('topic', console.log);
 */


MqttClient.prototype.subscribe = function () {
  var that = this;
  var args = new Array(arguments.length);

  for (var i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }

  var subs = [];
  var obj = args.shift();
  var resubscribe = obj.resubscribe;
  var callback = args.pop() || nop;
  var opts = args.pop();
  var version = this.options.protocolVersion;
  delete obj.resubscribe;

  if (typeof obj === 'string') {
    obj = [obj];
  }

  if (typeof callback !== 'function') {
    opts = callback;
    callback = nop;
  }

  var invalidTopic = validations.validateTopics(obj);

  if (invalidTopic !== null) {
    setImmediate(callback, new Error('Invalid topic ' + invalidTopic));
    return this;
  }

  if (this._checkDisconnecting(callback)) {
    debug('subscribe: discconecting true');
    return this;
  }

  var defaultOpts = {
    qos: 0
  };

  if (version === 5) {
    defaultOpts.nl = false;
    defaultOpts.rap = false;
    defaultOpts.rh = 0;
  }

  opts = xtend(defaultOpts, opts);

  if (Array.isArray(obj)) {
    obj.forEach(function (topic) {
      debug('subscribe: array topic %s', topic);

      if (!Object.prototype.hasOwnProperty.call(that._resubscribeTopics, topic) || that._resubscribeTopics[topic].qos < opts.qos || resubscribe) {
        var currentOpts = {
          topic: topic,
          qos: opts.qos
        };

        if (version === 5) {
          currentOpts.nl = opts.nl;
          currentOpts.rap = opts.rap;
          currentOpts.rh = opts.rh;
          currentOpts.properties = opts.properties;
        }

        debug('subscribe: pushing topic `%s` and qos `%s` to subs list', currentOpts.topic, currentOpts.qos);
        subs.push(currentOpts);
      }
    });
  } else {
    Object.keys(obj).forEach(function (k) {
      debug('subscribe: object topic %s', k);

      if (!Object.prototype.hasOwnProperty.call(that._resubscribeTopics, k) || that._resubscribeTopics[k].qos < obj[k].qos || resubscribe) {
        var currentOpts = {
          topic: k,
          qos: obj[k].qos
        };

        if (version === 5) {
          currentOpts.nl = obj[k].nl;
          currentOpts.rap = obj[k].rap;
          currentOpts.rh = obj[k].rh;
          currentOpts.properties = opts.properties;
        }

        debug('subscribe: pushing `%s` to subs list', currentOpts);
        subs.push(currentOpts);
      }
    });
  }

  if (!subs.length) {
    callback(null, []);
    return this;
  }

  var subscribeProc = function subscribeProc() {
    var messageId = that._nextId();

    if (messageId === null) {
      debug('No messageId left');
      return false;
    }

    var packet = {
      cmd: 'subscribe',
      subscriptions: subs,
      qos: 1,
      retain: false,
      dup: false,
      messageId: messageId
    };

    if (opts.properties) {
      packet.properties = opts.properties;
    } // subscriptions to resubscribe to in case of disconnect


    if (that.options.resubscribe) {
      debug('subscribe :: resubscribe true');
      var topics = [];
      subs.forEach(function (sub) {
        if (that.options.reconnectPeriod > 0) {
          var topic = {
            qos: sub.qos
          };

          if (version === 5) {
            topic.nl = sub.nl || false;
            topic.rap = sub.rap || false;
            topic.rh = sub.rh || 0;
            topic.properties = sub.properties;
          }

          that._resubscribeTopics[sub.topic] = topic;
          topics.push(sub.topic);
        }
      });
      that.messageIdToTopic[packet.messageId] = topics;
    }

    that.outgoing[packet.messageId] = {
      volatile: true,
      cb: function cb(err, packet) {
        if (!err) {
          var granted = packet.granted;

          for (var _i = 0; _i < granted.length; _i += 1) {
            subs[_i].qos = granted[_i];
          }
        }

        callback(err, subs);
      }
    };
    debug('subscribe :: call _sendPacket');

    that._sendPacket(packet);

    return true;
  };

  if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !subscribeProc()) {
    this._storeProcessingQueue.push({
      invoke: subscribeProc,
      callback: callback
    });
  }

  return this;
};
/**
 * unsubscribe - unsubscribe from topic(s)
 *
 * @param {String, Array} topic - topics to unsubscribe from
 * @param {Object} [opts] - optional subscription options, includes:
 *    {Object} properties - properties of unsubscribe packet
 * @param {Function} [callback] - callback fired on unsuback
 * @returns {MqttClient} this - for chaining
 * @api public
 * @example client.unsubscribe('topic');
 * @example client.unsubscribe('topic', console.log);
 */


MqttClient.prototype.unsubscribe = function () {
  var that = this;
  var args = new Array(arguments.length);

  for (var i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }

  var topic = args.shift();
  var callback = args.pop() || nop;
  var opts = args.pop();

  if (typeof topic === 'string') {
    topic = [topic];
  }

  if (typeof callback !== 'function') {
    opts = callback;
    callback = nop;
  }

  var invalidTopic = validations.validateTopics(topic);

  if (invalidTopic !== null) {
    setImmediate(callback, new Error('Invalid topic ' + invalidTopic));
    return this;
  }

  if (that._checkDisconnecting(callback)) {
    return this;
  }

  var unsubscribeProc = function unsubscribeProc() {
    var messageId = that._nextId();

    if (messageId === null) {
      debug('No messageId left');
      return false;
    }

    var packet = {
      cmd: 'unsubscribe',
      qos: 1,
      messageId: messageId
    };

    if (typeof topic === 'string') {
      packet.unsubscriptions = [topic];
    } else if (Array.isArray(topic)) {
      packet.unsubscriptions = topic;
    }

    if (that.options.resubscribe) {
      packet.unsubscriptions.forEach(function (topic) {
        delete that._resubscribeTopics[topic];
      });
    }

    if (_typeof(opts) === 'object' && opts.properties) {
      packet.properties = opts.properties;
    }

    that.outgoing[packet.messageId] = {
      volatile: true,
      cb: callback
    };
    debug('unsubscribe: call _sendPacket');

    that._sendPacket(packet);

    return true;
  };

  if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !unsubscribeProc()) {
    this._storeProcessingQueue.push({
      invoke: unsubscribeProc,
      callback: callback
    });
  }

  return this;
};
/**
 * end - close connection
 *
 * @returns {MqttClient} this - for chaining
 * @param {Boolean} force - do not wait for all in-flight messages to be acked
 * @param {Object} opts - added to the disconnect packet
 * @param {Function} cb - called when the client has been closed
 *
 * @api public
 */


MqttClient.prototype.end = function (force, opts, cb) {
  var that = this;
  debug('end :: (%s)', this.options.clientId);

  if (force == null || typeof force !== 'boolean') {
    cb = opts || nop;
    opts = force;
    force = false;

    if (_typeof(opts) !== 'object') {
      cb = opts;
      opts = null;

      if (typeof cb !== 'function') {
        cb = nop;
      }
    }
  }

  if (_typeof(opts) !== 'object') {
    cb = opts;
    opts = null;
  }

  debug('end :: cb? %s', !!cb);
  cb = cb || nop;

  function closeStores() {
    debug('end :: closeStores: closing incoming and outgoing stores');
    that.disconnected = true;
    that.incomingStore.close(function (e1) {
      that.outgoingStore.close(function (e2) {
        debug('end :: closeStores: emitting end');
        that.emit('end');

        if (cb) {
          var err = e1 || e2;
          debug('end :: closeStores: invoking callback with args');
          cb(err);
        }
      });
    });

    if (that._deferredReconnect) {
      that._deferredReconnect();
    }
  }

  function finish() {
    // defer closesStores of an I/O cycle,
    // just to make sure things are
    // ok for websockets
    debug('end :: (%s) :: finish :: calling _cleanUp with force %s', that.options.clientId, force);

    that._cleanUp(force, function () {
      debug('end :: finish :: calling process.nextTick on closeStores'); // const boundProcess = nextTick.bind(null, closeStores)

      nextTick(closeStores.bind(that));
    }, opts);
  }

  if (this.disconnecting) {
    cb();
    return this;
  }

  this._clearReconnect();

  this.disconnecting = true;

  if (!force && Object.keys(this.outgoing).length > 0) {
    // wait 10ms, just to be sure we received all of it
    debug('end :: (%s) :: calling finish in 10ms once outgoing is empty', that.options.clientId);
    this.once('outgoingEmpty', setTimeout.bind(null, finish, 10));
  } else {
    debug('end :: (%s) :: immediately calling finish', that.options.clientId);
    finish();
  }

  return this;
};
/**
 * removeOutgoingMessage - remove a message in outgoing store
 * the outgoing callback will be called withe Error('Message removed') if the message is removed
 *
 * @param {Number} messageId - messageId to remove message
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example client.removeOutgoingMessage(client.getLastAllocated());
 */


MqttClient.prototype.removeOutgoingMessage = function (messageId) {
  var cb = this.outgoing[messageId] ? this.outgoing[messageId].cb : null;
  delete this.outgoing[messageId];
  this.outgoingStore.del({
    messageId: messageId
  }, function () {
    cb(new Error('Message removed'));
  });
  return this;
};
/**
 * reconnect - connect again using the same options as connect()
 *
 * @param {Object} [opts] - optional reconnect options, includes:
 *    {Store} incomingStore - a store for the incoming packets
 *    {Store} outgoingStore - a store for the outgoing packets
 *    if opts is not given, current stores are used
 * @returns {MqttClient} this - for chaining
 *
 * @api public
 */


MqttClient.prototype.reconnect = function (opts) {
  debug('client reconnect');
  var that = this;

  var f = function f() {
    if (opts) {
      that.options.incomingStore = opts.incomingStore;
      that.options.outgoingStore = opts.outgoingStore;
    } else {
      that.options.incomingStore = null;
      that.options.outgoingStore = null;
    }

    that.incomingStore = that.options.incomingStore || new Store();
    that.outgoingStore = that.options.outgoingStore || new Store();
    that.disconnecting = false;
    that.disconnected = false;
    that._deferredReconnect = null;

    that._reconnect();
  };

  if (this.disconnecting && !this.disconnected) {
    this._deferredReconnect = f;
  } else {
    f();
  }

  return this;
};
/**
 * _reconnect - implement reconnection
 * @api privateish
 */


MqttClient.prototype._reconnect = function () {
  var _this2 = this;

  debug('_reconnect: emitting reconnect to client');
  this.emit('reconnect');

  if (this.connected) {
    this.end(function () {
      _this2._setupStream();
    });
    debug('client already connected. disconnecting first.');
  } else {
    debug('_reconnect: calling _setupStream');

    this._setupStream();
  }
};
/**
 * _setupReconnect - setup reconnect timer
 */


MqttClient.prototype._setupReconnect = function () {
  var that = this;

  if (!that.disconnecting && !that.reconnectTimer && that.options.reconnectPeriod > 0) {
    if (!this.reconnecting) {
      debug('_setupReconnect :: emit `offline` state');
      this.emit('offline');
      debug('_setupReconnect :: set `reconnecting` to `true`');
      this.reconnecting = true;
    }

    debug('_setupReconnect :: setting reconnectTimer for %d ms', that.options.reconnectPeriod);
    that.reconnectTimer = setInterval(function () {
      debug('reconnectTimer :: reconnect triggered!');

      that._reconnect();
    }, that.options.reconnectPeriod);
  } else {
    debug('_setupReconnect :: doing nothing...');
  }
};
/**
 * _clearReconnect - clear the reconnect timer
 */


MqttClient.prototype._clearReconnect = function () {
  debug('_clearReconnect : clearing reconnect timer');

  if (this.reconnectTimer) {
    clearInterval(this.reconnectTimer);
    this.reconnectTimer = null;
  }
};
/**
 * _cleanUp - clean up on connection end
 * @api private
 */


MqttClient.prototype._cleanUp = function (forced, done) {
  var opts = arguments[2];

  if (done) {
    debug('_cleanUp :: done callback provided for on stream close');
    this.stream.on('close', done);
  }

  debug('_cleanUp :: forced? %s', forced);

  if (forced) {
    if (this.options.reconnectPeriod === 0 && this.options.clean) {
      flush(this.outgoing);
    }

    debug('_cleanUp :: (%s) :: destroying stream', this.options.clientId);
    this.stream.destroy();
  } else {
    var packet = xtend({
      cmd: 'disconnect'
    }, opts);
    debug('_cleanUp :: (%s) :: call _sendPacket with disconnect packet', this.options.clientId);

    this._sendPacket(packet, setImmediate.bind(null, this.stream.end.bind(this.stream)));
  }

  if (!this.disconnecting) {
    debug('_cleanUp :: client not disconnecting. Clearing and resetting reconnect.');

    this._clearReconnect();

    this._setupReconnect();
  }

  if (this.pingTimer !== null) {
    debug('_cleanUp :: clearing pingTimer');
    this.pingTimer.clear();
    this.pingTimer = null;
  }

  if (done && !this.connected) {
    debug('_cleanUp :: (%s) :: removing stream `done` callback `close` listener', this.options.clientId);
    this.stream.removeListener('close', done);
    done();
  }
};
/**
 * _sendPacket - send or queue a packet
 * @param {Object} packet - packet options
 * @param {Function} cb - callback when the packet is sent
 * @param {Function} cbStorePut - called when message is put into outgoingStore
 * @api private
 */


MqttClient.prototype._sendPacket = function (packet, cb, cbStorePut) {
  debug('_sendPacket :: (%s) ::  start', this.options.clientId);
  cbStorePut = cbStorePut || nop;
  cb = cb || nop;
  var err = applyTopicAlias(this, packet);

  if (err) {
    cb(err);
    return;
  }

  if (!this.connected) {
    // allow auth packets to be sent while authenticating with the broker (mqtt5 enhanced auth)
    if (packet.cmd === 'auth') {
      this._shiftPingInterval();

      sendPacket(this, packet, cb);
      return;
    }

    debug('_sendPacket :: client not connected. Storing packet offline.');

    this._storePacket(packet, cb, cbStorePut);

    return;
  } // When sending a packet, reschedule the ping timer


  this._shiftPingInterval();

  switch (packet.cmd) {
    case 'publish':
      break;

    case 'pubrel':
      storeAndSend(this, packet, cb, cbStorePut);
      return;

    default:
      sendPacket(this, packet, cb);
      return;
  }

  switch (packet.qos) {
    case 2:
    case 1:
      storeAndSend(this, packet, cb, cbStorePut);
      break;

    /**
     * no need of case here since it will be caught by default
     * and jshint comply that before default it must be a break
     * anyway it will result in -1 evaluation
     */

    case 0:
    /* falls through */

    default:
      sendPacket(this, packet, cb);
      break;
  }

  debug('_sendPacket :: (%s) ::  end', this.options.clientId);
};
/**
 * _storePacket - queue a packet
 * @param {Object} packet - packet options
 * @param {Function} cb - callback when the packet is sent
 * @param {Function} cbStorePut - called when message is put into outgoingStore
 * @api private
 */


MqttClient.prototype._storePacket = function (packet, cb, cbStorePut) {
  debug('_storePacket :: packet: %o', packet);
  debug('_storePacket :: cb? %s', !!cb);
  cbStorePut = cbStorePut || nop;
  var storePacket = packet;

  if (storePacket.cmd === 'publish') {
    // The original packet is for sending.
    // The cloned storePacket is for storing to resend on reconnect.
    // Topic Alias must not be used after disconnected.
    storePacket = clone(packet);
    var err = removeTopicAliasAndRecoverTopicName(this, storePacket);

    if (err) {
      return cb && cb(err);
    }
  } // check that the packet is not a qos of 0, or that the command is not a publish


  if ((storePacket.qos || 0) === 0 && this.queueQoSZero || storePacket.cmd !== 'publish') {
    this.queue.push({
      packet: storePacket,
      cb: cb
    });
  } else if (storePacket.qos > 0) {
    cb = this.outgoing[storePacket.messageId] ? this.outgoing[storePacket.messageId].cb : null;
    this.outgoingStore.put(storePacket, function (err) {
      if (err) {
        return cb && cb(err);
      }

      cbStorePut();
    });
  } else if (cb) {
    cb(new Error('No connection to broker'));
  }
};
/**
 * _setupPingTimer - setup the ping timer
 *
 * @api private
 */


MqttClient.prototype._setupPingTimer = function () {
  debug('_setupPingTimer :: keepalive %d (seconds)', this.options.keepalive);
  var that = this;

  if (!this.pingTimer && this.options.keepalive) {
    this.pingResp = true;
    this.pingTimer = reInterval(function () {
      that._checkPing();
    }, this.options.keepalive * 1000);
  }
};
/**
 * _shiftPingInterval - reschedule the ping interval
 *
 * @api private
 */


MqttClient.prototype._shiftPingInterval = function () {
  if (this.pingTimer && this.options.keepalive && this.options.reschedulePings) {
    this.pingTimer.reschedule(this.options.keepalive * 1000);
  }
};
/**
 * _checkPing - check if a pingresp has come back, and ping the server again
 *
 * @api private
 */


MqttClient.prototype._checkPing = function () {
  debug('_checkPing :: checking ping...');

  if (this.pingResp) {
    debug('_checkPing :: ping response received. Clearing flag and sending `pingreq`');
    this.pingResp = false;

    this._sendPacket({
      cmd: 'pingreq'
    });
  } else {
    // do a forced cleanup since socket will be in bad shape
    debug('_checkPing :: calling _cleanUp with force true');

    this._cleanUp(true);
  }
};
/**
 * _handlePingresp - handle a pingresp
 *
 * @api private
 */


MqttClient.prototype._handlePingresp = function () {
  this.pingResp = true;
};
/**
 * _handleConnack
 *
 * @param {Object} packet
 * @api private
 */


MqttClient.prototype._handleConnack = function (packet) {
  debug('_handleConnack');
  var options = this.options;
  var version = options.protocolVersion;
  var rc = version === 5 ? packet.reasonCode : packet.returnCode;
  clearTimeout(this.connackTimer);
  delete this.topicAliasSend;

  if (packet.properties) {
    if (packet.properties.topicAliasMaximum) {
      if (packet.properties.topicAliasMaximum > 0xffff) {
        this.emit('error', new Error('topicAliasMaximum from broker is out of range'));
        return;
      }

      if (packet.properties.topicAliasMaximum > 0) {
        this.topicAliasSend = new TopicAliasSend(packet.properties.topicAliasMaximum);
      }
    }

    if (packet.properties.serverKeepAlive && options.keepalive) {
      options.keepalive = packet.properties.serverKeepAlive;

      this._shiftPingInterval();
    }

    if (packet.properties.maximumPacketSize) {
      if (!options.properties) {
        options.properties = {};
      }

      options.properties.maximumPacketSize = packet.properties.maximumPacketSize;
    }
  }

  if (rc === 0) {
    this.reconnecting = false;

    this._onConnect(packet);
  } else if (rc > 0) {
    var err = new Error('Connection refused: ' + errors[rc]);
    err.code = rc;
    this.emit('error', err);
  }
};

MqttClient.prototype._handleAuth = function (packet) {
  var options = this.options;
  var version = options.protocolVersion;
  var rc = version === 5 ? packet.reasonCode : packet.returnCode;

  if (version !== 5) {
    var err = new Error('Protocol error: Auth packets are only supported in MQTT 5. Your version:' + version);
    err.code = rc;
    this.emit('error', err);
    return;
  }

  var that = this;
  this.handleAuth(packet, function (err, packet) {
    if (err) {
      that.emit('error', err);
      return;
    }

    if (rc === 24) {
      that.reconnecting = false;

      that._sendPacket(packet);
    } else {
      var error = new Error('Connection refused: ' + errors[rc]);
      err.code = rc;
      that.emit('error', error);
    }
  });
};
/**
 * @param packet the packet received by the broker
 * @return the auth packet to be returned to the broker
 * @api public
 */


MqttClient.prototype.handleAuth = function (packet, callback) {
  callback();
};
/**
 * _handlePublish
 *
 * @param {Object} packet
 * @api private
 */

/*
those late 2 case should be rewrite to comply with coding style:

case 1:
case 0:
  // do not wait sending a puback
  // no callback passed
  if (1 === qos) {
    this._sendPacket({
      cmd: 'puback',
      messageId: messageId
    });
  }
  // emit the message event for both qos 1 and 0
  this.emit('message', topic, message, packet);
  this.handleMessage(packet, done);
  break;
default:
  // do nothing but every switch mus have a default
  // log or throw an error about unknown qos
  break;

for now i just suppressed the warnings
*/


MqttClient.prototype._handlePublish = function (packet, done) {
  debug('_handlePublish: packet %o', packet);
  done = typeof done !== 'undefined' ? done : nop;
  var topic = packet.topic.toString();
  var message = packet.payload;
  var qos = packet.qos;
  var messageId = packet.messageId;
  var that = this;
  var options = this.options;
  var validReasonCodes = [0, 16, 128, 131, 135, 144, 145, 151, 153];

  if (this.options.protocolVersion === 5) {
    var alias;

    if (packet.properties) {
      alias = packet.properties.topicAlias;
    }

    if (typeof alias !== 'undefined') {
      if (topic.length === 0) {
        if (alias > 0 && alias <= 0xffff) {
          var gotTopic = this.topicAliasRecv.getTopicByAlias(alias);

          if (gotTopic) {
            topic = gotTopic;
            debug('_handlePublish :: topic complemented by alias. topic: %s - alias: %d', topic, alias);
          } else {
            debug('_handlePublish :: unregistered topic alias. alias: %d', alias);
            this.emit('error', new Error('Received unregistered Topic Alias'));
            return;
          }
        } else {
          debug('_handlePublish :: topic alias out of range. alias: %d', alias);
          this.emit('error', new Error('Received Topic Alias is out of range'));
          return;
        }
      } else {
        if (this.topicAliasRecv.put(topic, alias)) {
          debug('_handlePublish :: registered topic: %s - alias: %d', topic, alias);
        } else {
          debug('_handlePublish :: topic alias out of range. alias: %d', alias);
          this.emit('error', new Error('Received Topic Alias is out of range'));
          return;
        }
      }
    }
  }

  debug('_handlePublish: qos %d', qos);

  switch (qos) {
    case 2:
      {
        options.customHandleAcks(topic, message, packet, function (error, code) {
          if (!(error instanceof Error)) {
            code = error;
            error = null;
          }

          if (error) {
            return that.emit('error', error);
          }

          if (validReasonCodes.indexOf(code) === -1) {
            return that.emit('error', new Error('Wrong reason code for pubrec'));
          }

          if (code) {
            that._sendPacket({
              cmd: 'pubrec',
              messageId: messageId,
              reasonCode: code
            }, done);
          } else {
            that.incomingStore.put(packet, function () {
              that._sendPacket({
                cmd: 'pubrec',
                messageId: messageId
              }, done);
            });
          }
        });
        break;
      }

    case 1:
      {
        // emit the message event
        options.customHandleAcks(topic, message, packet, function (error, code) {
          if (!(error instanceof Error)) {
            code = error;
            error = null;
          }

          if (error) {
            return that.emit('error', error);
          }

          if (validReasonCodes.indexOf(code) === -1) {
            return that.emit('error', new Error('Wrong reason code for puback'));
          }

          if (!code) {
            that.emit('message', topic, message, packet);
          }

          that.handleMessage(packet, function (err) {
            if (err) {
              return done && done(err);
            }

            that._sendPacket({
              cmd: 'puback',
              messageId: messageId,
              reasonCode: code
            }, done);
          });
        });
        break;
      }

    case 0:
      // emit the message event
      this.emit('message', topic, message, packet);
      this.handleMessage(packet, done);
      break;

    default:
      // do nothing
      debug('_handlePublish: unknown QoS. Doing nothing.'); // log or throw an error about unknown qos

      break;
  }
};
/**
 * Handle messages with backpressure support, one at a time.
 * Override at will.
 *
 * @param Packet packet the packet
 * @param Function callback call when finished
 * @api public
 */


MqttClient.prototype.handleMessage = function (packet, callback) {
  callback();
};
/**
 * _handleAck
 *
 * @param {Object} packet
 * @api private
 */


MqttClient.prototype._handleAck = function (packet) {
  /* eslint no-fallthrough: "off" */
  var messageId = packet.messageId;
  var type = packet.cmd;
  var response = null;
  var cb = this.outgoing[messageId] ? this.outgoing[messageId].cb : null;
  var that = this;
  var err;

  if (!cb || cb === nop) {
    debug('_handleAck :: Server sent an ack in error. Ignoring.'); // Server sent an ack in error, ignore it.

    return;
  } // Process


  debug('_handleAck :: packet type', type);

  switch (type) {
    case 'pubcomp': // same thing as puback for QoS 2

    case 'puback':
      {
        var pubackRC = packet.reasonCode; // Callback - we're done

        if (pubackRC && pubackRC > 0 && pubackRC !== 16) {
          err = new Error('Publish error: ' + errors[pubackRC]);
          err.code = pubackRC;
          cb(err, packet);
        }

        delete this.outgoing[messageId];
        this.outgoingStore.del(packet, cb);
        this.messageIdProvider.deallocate(messageId);

        this._invokeStoreProcessingQueue();

        break;
      }

    case 'pubrec':
      {
        response = {
          cmd: 'pubrel',
          qos: 2,
          messageId: messageId
        };
        var pubrecRC = packet.reasonCode;

        if (pubrecRC && pubrecRC > 0 && pubrecRC !== 16) {
          err = new Error('Publish error: ' + errors[pubrecRC]);
          err.code = pubrecRC;
          cb(err, packet);
        } else {
          this._sendPacket(response);
        }

        break;
      }

    case 'suback':
      {
        delete this.outgoing[messageId];
        this.messageIdProvider.deallocate(messageId);

        for (var grantedI = 0; grantedI < packet.granted.length; grantedI++) {
          if ((packet.granted[grantedI] & 0x80) !== 0) {
            // suback with Failure status
            var topics = this.messageIdToTopic[messageId];

            if (topics) {
              topics.forEach(function (topic) {
                delete that._resubscribeTopics[topic];
              });
            }
          }
        }

        this._invokeStoreProcessingQueue();

        cb(null, packet);
        break;
      }

    case 'unsuback':
      {
        delete this.outgoing[messageId];
        this.messageIdProvider.deallocate(messageId);

        this._invokeStoreProcessingQueue();

        cb(null);
        break;
      }

    default:
      that.emit('error', new Error('unrecognized packet type'));
  }

  if (this.disconnecting && Object.keys(this.outgoing).length === 0) {
    this.emit('outgoingEmpty');
  }
};
/**
 * _handlePubrel
 *
 * @param {Object} packet
 * @api private
 */


MqttClient.prototype._handlePubrel = function (packet, callback) {
  debug('handling pubrel packet');
  callback = typeof callback !== 'undefined' ? callback : nop;
  var messageId = packet.messageId;
  var that = this;
  var comp = {
    cmd: 'pubcomp',
    messageId: messageId
  };
  that.incomingStore.get(packet, function (err, pub) {
    if (!err) {
      that.emit('message', pub.topic, pub.payload, pub);
      that.handleMessage(pub, function (err) {
        if (err) {
          return callback(err);
        }

        that.incomingStore.del(pub, nop);

        that._sendPacket(comp, callback);
      });
    } else {
      that._sendPacket(comp, callback);
    }
  });
};
/**
 * _handleDisconnect
 *
 * @param {Object} packet
 * @api private
 */


MqttClient.prototype._handleDisconnect = function (packet) {
  this.emit('disconnect', packet);
};
/**
 * _nextId
 * @return unsigned int
 */


MqttClient.prototype._nextId = function () {
  return this.messageIdProvider.allocate();
};
/**
 * getLastMessageId
 * @return unsigned int
 */


MqttClient.prototype.getLastMessageId = function () {
  return this.messageIdProvider.getLastAllocated();
};
/**
 * _resubscribe
 * @api private
 */


MqttClient.prototype._resubscribe = function () {
  debug('_resubscribe');

  var _resubscribeTopicsKeys = Object.keys(this._resubscribeTopics);

  if (!this._firstConnection && (this.options.clean || this.options.protocolVersion === 5 && !this.connackPacket.sessionPresent) && _resubscribeTopicsKeys.length > 0) {
    if (this.options.resubscribe) {
      if (this.options.protocolVersion === 5) {
        debug('_resubscribe: protocolVersion 5');

        for (var topicI = 0; topicI < _resubscribeTopicsKeys.length; topicI++) {
          var resubscribeTopic = {};
          resubscribeTopic[_resubscribeTopicsKeys[topicI]] = this._resubscribeTopics[_resubscribeTopicsKeys[topicI]];
          resubscribeTopic.resubscribe = true;
          this.subscribe(resubscribeTopic, {
            properties: resubscribeTopic[_resubscribeTopicsKeys[topicI]].properties
          });
        }
      } else {
        this._resubscribeTopics.resubscribe = true;
        this.subscribe(this._resubscribeTopics);
      }
    } else {
      this._resubscribeTopics = {};
    }
  }

  this._firstConnection = false;
};
/**
 * _onConnect
 *
 * @api private
 */


MqttClient.prototype._onConnect = function (packet) {
  if (this.disconnected) {
    this.emit('connect', packet);
    return;
  }

  var that = this;
  this.connackPacket = packet;
  this.messageIdProvider.clear();

  this._setupPingTimer();

  this.connected = true;

  function startStreamProcess() {
    var outStore = that.outgoingStore.createStream();

    function clearStoreProcessing() {
      that._storeProcessing = false;
      that._packetIdsDuringStoreProcessing = {};
    }

    that.once('close', remove);
    outStore.on('error', function (err) {
      clearStoreProcessing();

      that._flushStoreProcessingQueue();

      that.removeListener('close', remove);
      that.emit('error', err);
    });

    function remove() {
      outStore.destroy();
      outStore = null;

      that._flushStoreProcessingQueue();

      clearStoreProcessing();
    }

    function storeDeliver() {
      // edge case, we wrapped this twice
      if (!outStore) {
        return;
      }

      that._storeProcessing = true;
      var packet = outStore.read(1);

      var _cb;

      if (!packet) {
        // read when data is available in the future
        outStore.once('readable', storeDeliver);
        return;
      } // Skip already processed store packets


      if (that._packetIdsDuringStoreProcessing[packet.messageId]) {
        storeDeliver();
        return;
      } // Avoid unnecessary stream read operations when disconnected


      if (!that.disconnecting && !that.reconnectTimer) {
        _cb = that.outgoing[packet.messageId] ? that.outgoing[packet.messageId].cb : null;
        that.outgoing[packet.messageId] = {
          volatile: false,
          cb: function cb(err, status) {
            // Ensure that the original callback passed in to publish gets invoked
            if (_cb) {
              _cb(err, status);
            }

            storeDeliver();
          }
        };
        that._packetIdsDuringStoreProcessing[packet.messageId] = true;

        if (that.messageIdProvider.register(packet.messageId)) {
          that._sendPacket(packet);
        } else {
          debug('messageId: %d has already used.', packet.messageId);
        }
      } else if (outStore.destroy) {
        outStore.destroy();
      }
    }

    outStore.on('end', function () {
      var allProcessed = true;

      for (var id in that._packetIdsDuringStoreProcessing) {
        if (!that._packetIdsDuringStoreProcessing[id]) {
          allProcessed = false;
          break;
        }
      }

      if (allProcessed) {
        clearStoreProcessing();
        that.removeListener('close', remove);

        that._invokeAllStoreProcessingQueue();

        that.emit('connect', packet);
      } else {
        startStreamProcess();
      }
    });
    storeDeliver();
  } // start flowing


  startStreamProcess();
};

MqttClient.prototype._invokeStoreProcessingQueue = function () {
  if (this._storeProcessingQueue.length > 0) {
    var f = this._storeProcessingQueue[0];

    if (f && f.invoke()) {
      this._storeProcessingQueue.shift();

      return true;
    }
  }

  return false;
};

MqttClient.prototype._invokeAllStoreProcessingQueue = function () {
  while (this._invokeStoreProcessingQueue()) {
    /* empty */
  }
};

MqttClient.prototype._flushStoreProcessingQueue = function () {
  var _iterator = _createForOfIteratorHelper(this._storeProcessingQueue),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var f = _step.value;
      if (f.cbStorePut) f.cbStorePut(new Error('Connection closed'));
      if (f.callback) f.callback(new Error('Connection closed'));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  this._storeProcessingQueue.splice(0);
};

module.exports = MqttClient;
},{"events":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/events/events.js","./store":"node_modules/mqtt/lib/store.js","./topic-alias-recv":"node_modules/mqtt/lib/topic-alias-recv.js","./topic-alias-send":"node_modules/mqtt/lib/topic-alias-send.js","mqtt-packet":"node_modules/mqtt-packet/mqtt.js","./default-message-id-provider":"node_modules/mqtt/lib/default-message-id-provider.js","readable-stream":"node_modules/readable-stream/readable-browser.js","inherits":"node_modules/inherits/inherits_browser.js","reinterval":"node_modules/reinterval/index.js","rfdc/default":"node_modules/rfdc/default.js","./validations":"node_modules/mqtt/lib/validations.js","xtend":"node_modules/xtend/immutable.js","debug":"node_modules/debug/src/browser.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/punycode/punycode.js":[function(require,module,exports) {
var global = arguments[3];
var define;
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/url/util.js":[function(require,module,exports) {
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/querystring-es3/decode.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict'; // If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1000;

  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length; // maxKeys <= 0 means that we should not limit keys count

  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/querystring-es3/encode.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var stringifyPrimitive = function (v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';

  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;

      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];

  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }

  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }

  return res;
};
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/querystring-es3/index.js":[function(require,module,exports) {
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');
},{"./decode":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/querystring-es3/decode.js","./encode":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/querystring-es3/encode.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/url/url.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"punycode":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/punycode/punycode.js","./util":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/url/util.js","querystring":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/querystring-es3/index.js"}],"node_modules/mqtt/lib/connect/tcp.js":[function(require,module,exports) {
'use strict';

var net = require('net');

var debug = require('debug')('mqttjs:tcp');
/*
  variables port and host can be removed since
  you have all required information in opts object
*/


function streamBuilder(client, opts) {
  opts.port = opts.port || 1883;
  opts.hostname = opts.hostname || opts.host || 'localhost';
  var port = opts.port;
  var host = opts.hostname;
  debug('port %d and host %s', port, host);
  return net.createConnection(port, host);
}

module.exports = streamBuilder;
},{"net":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js","debug":"node_modules/debug/src/browser.js"}],"node_modules/mqtt/lib/connect/tls.js":[function(require,module,exports) {
'use strict';

var tls = require('tls');

var net = require('net');

var debug = require('debug')('mqttjs:tls');

function buildBuilder(mqttClient, opts) {
  opts.port = opts.port || 8883;
  opts.host = opts.hostname || opts.host || 'localhost';

  if (net.isIP(opts.host) === 0) {
    opts.servername = opts.host;
  }

  opts.rejectUnauthorized = opts.rejectUnauthorized !== false;
  delete opts.path;
  debug('port %d host %s rejectUnauthorized %b', opts.port, opts.host, opts.rejectUnauthorized);
  var connection = tls.connect(opts);
  /* eslint no-use-before-define: [2, "nofunc"] */

  connection.on('secureConnect', function () {
    if (opts.rejectUnauthorized && !connection.authorized) {
      connection.emit('error', new Error('TLS not authorized'));
    } else {
      connection.removeListener('error', handleTLSerrors);
    }
  });

  function handleTLSerrors(err) {
    // How can I get verify this error is a tls error?
    if (opts.rejectUnauthorized) {
      mqttClient.emit('error', err);
    } // close this connection to match the behaviour of net
    // otherwise all we get is an error from the connection
    // and close event doesn't fire. This is a work around
    // to enable the reconnect code to work the same as with
    // net.createConnection


    connection.end();
  }

  connection.on('error', handleTLSerrors);
  return connection;
}

module.exports = buildBuilder;
},{"tls":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js","net":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js","debug":"node_modules/debug/src/browser.js"}],"node_modules/wrappy/wrappy.js":[function(require,module,exports) {
// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}

},{}],"node_modules/once/once.js":[function(require,module,exports) {
var wrappy = require('wrappy')
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}

},{"wrappy":"node_modules/wrappy/wrappy.js"}],"node_modules/end-of-stream/index.js":[function(require,module,exports) {
var process = require("process");
var once = require('once');

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;

},{"once":"node_modules/once/once.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/stream-shift/index.js":[function(require,module,exports) {
module.exports = shift

function shift (stream) {
  var rs = stream._readableState
  if (!rs) return null
  return (rs.objectMode || typeof stream._duplexState === 'number') ? stream.read() : stream.read(getStateLength(rs))
}

function getStateLength (state) {
  if (state.buffer.length) {
    // Since node 6.3.0 state.buffer is a BufferList not an array
    if (state.buffer.head) {
      return state.buffer.head.data.length
    }

    return state.buffer[0].length
  }

  return state.length
}

},{}],"node_modules/duplexify/index.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
var process = require("process");
var stream = require('readable-stream')
var eos = require('end-of-stream')
var inherits = require('inherits')
var shift = require('stream-shift')

var SIGNAL_FLUSH = (Buffer.from && Buffer.from !== Uint8Array.from)
  ? Buffer.from([0])
  : new Buffer([0])

var onuncork = function(self, fn) {
  if (self._corked) self.once('uncork', fn)
  else fn()
}

var autoDestroy = function (self, err) {
  if (self._autoDestroy) self.destroy(err)
}

var destroyer = function(self, end) {
  return function(err) {
    if (err) autoDestroy(self, err.message === 'premature close' ? null : err)
    else if (end && !self._ended) self.end()
  }
}

var end = function(ws, fn) {
  if (!ws) return fn()
  if (ws._writableState && ws._writableState.finished) return fn()
  if (ws._writableState) return ws.end(fn)
  ws.end()
  fn()
}

var noop = function() {}

var toStreams2 = function(rs) {
  return new (stream.Readable)({objectMode:true, highWaterMark:16}).wrap(rs)
}

var Duplexify = function(writable, readable, opts) {
  if (!(this instanceof Duplexify)) return new Duplexify(writable, readable, opts)
  stream.Duplex.call(this, opts)

  this._writable = null
  this._readable = null
  this._readable2 = null

  this._autoDestroy = !opts || opts.autoDestroy !== false
  this._forwardDestroy = !opts || opts.destroy !== false
  this._forwardEnd = !opts || opts.end !== false
  this._corked = 1 // start corked
  this._ondrain = null
  this._drained = false
  this._forwarding = false
  this._unwrite = null
  this._unread = null
  this._ended = false

  this.destroyed = false

  if (writable) this.setWritable(writable)
  if (readable) this.setReadable(readable)
}

inherits(Duplexify, stream.Duplex)

Duplexify.obj = function(writable, readable, opts) {
  if (!opts) opts = {}
  opts.objectMode = true
  opts.highWaterMark = 16
  return new Duplexify(writable, readable, opts)
}

Duplexify.prototype.cork = function() {
  if (++this._corked === 1) this.emit('cork')
}

Duplexify.prototype.uncork = function() {
  if (this._corked && --this._corked === 0) this.emit('uncork')
}

Duplexify.prototype.setWritable = function(writable) {
  if (this._unwrite) this._unwrite()

  if (this.destroyed) {
    if (writable && writable.destroy) writable.destroy()
    return
  }

  if (writable === null || writable === false) {
    this.end()
    return
  }

  var self = this
  var unend = eos(writable, {writable:true, readable:false}, destroyer(this, this._forwardEnd))

  var ondrain = function() {
    var ondrain = self._ondrain
    self._ondrain = null
    if (ondrain) ondrain()
  }

  var clear = function() {
    self._writable.removeListener('drain', ondrain)
    unend()
  }

  if (this._unwrite) process.nextTick(ondrain) // force a drain on stream reset to avoid livelocks

  this._writable = writable
  this._writable.on('drain', ondrain)
  this._unwrite = clear

  this.uncork() // always uncork setWritable
}

Duplexify.prototype.setReadable = function(readable) {
  if (this._unread) this._unread()

  if (this.destroyed) {
    if (readable && readable.destroy) readable.destroy()
    return
  }

  if (readable === null || readable === false) {
    this.push(null)
    this.resume()
    return
  }

  var self = this
  var unend = eos(readable, {writable:false, readable:true}, destroyer(this))

  var onreadable = function() {
    self._forward()
  }

  var onend = function() {
    self.push(null)
  }

  var clear = function() {
    self._readable2.removeListener('readable', onreadable)
    self._readable2.removeListener('end', onend)
    unend()
  }

  this._drained = true
  this._readable = readable
  this._readable2 = readable._readableState ? readable : toStreams2(readable)
  this._readable2.on('readable', onreadable)
  this._readable2.on('end', onend)
  this._unread = clear

  this._forward()
}

Duplexify.prototype._read = function() {
  this._drained = true
  this._forward()
}

Duplexify.prototype._forward = function() {
  if (this._forwarding || !this._readable2 || !this._drained) return
  this._forwarding = true

  var data

  while (this._drained && (data = shift(this._readable2)) !== null) {
    if (this.destroyed) continue
    this._drained = this.push(data)
  }

  this._forwarding = false
}

Duplexify.prototype.destroy = function(err, cb) {
  if (!cb) cb = noop
  if (this.destroyed) return cb(null)
  this.destroyed = true

  var self = this
  process.nextTick(function() {
    self._destroy(err)
    cb(null)
  })
}

Duplexify.prototype._destroy = function(err) {
  if (err) {
    var ondrain = this._ondrain
    this._ondrain = null
    if (ondrain) ondrain(err)
    else this.emit('error', err)
  }

  if (this._forwardDestroy) {
    if (this._readable && this._readable.destroy) this._readable.destroy()
    if (this._writable && this._writable.destroy) this._writable.destroy()
  }

  this.emit('close')
}

Duplexify.prototype._write = function(data, enc, cb) {
  if (this.destroyed) return
  if (this._corked) return onuncork(this, this._write.bind(this, data, enc, cb))
  if (data === SIGNAL_FLUSH) return this._finish(cb)
  if (!this._writable) return cb()

  if (this._writable.write(data) === false) this._ondrain = cb
  else if (!this.destroyed) cb()
}

Duplexify.prototype._finish = function(cb) {
  var self = this
  this.emit('preend')
  onuncork(this, function() {
    end(self._forwardEnd && self._writable, function() {
      // haxx to not emit prefinish twice
      if (self._writableState.prefinished === false) self._writableState.prefinished = true
      self.emit('prefinish')
      onuncork(self, cb)
    })
  })
}

Duplexify.prototype.end = function(data, enc, cb) {
  if (typeof data === 'function') return this.end(null, null, data)
  if (typeof enc === 'function') return this.end(data, null, enc)
  this._ended = true
  if (data) this.write(data)
  if (!this._writableState.ending && !this._writableState.destroyed) this.write(SIGNAL_FLUSH)
  return stream.Writable.prototype.end.call(this, cb)
}

module.exports = Duplexify

},{"readable-stream":"node_modules/readable-stream/readable-browser.js","end-of-stream":"node_modules/end-of-stream/index.js","inherits":"node_modules/inherits/inherits_browser.js","stream-shift":"node_modules/stream-shift/index.js","buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/mqtt/lib/connect/wx.js":[function(require,module,exports) {

'use strict';

var _require = require('buffer'),
    Buffer = _require.Buffer;

var Transform = require('readable-stream').Transform;

var duplexify = require('duplexify');
/* global wx */


var socketTask, proxy, stream;

function buildProxy() {
  var proxy = new Transform();

  proxy._write = function (chunk, encoding, next) {
    socketTask.send({
      data: chunk.buffer,
      success: function success() {
        next();
      },
      fail: function fail(errMsg) {
        next(new Error(errMsg));
      }
    });
  };

  proxy._flush = function socketEnd(done) {
    socketTask.close({
      success: function success() {
        done();
      }
    });
  };

  return proxy;
}

function setDefaultOpts(opts) {
  if (!opts.hostname) {
    opts.hostname = 'localhost';
  }

  if (!opts.path) {
    opts.path = '/';
  }

  if (!opts.wsOptions) {
    opts.wsOptions = {};
  }
}

function buildUrl(opts, client) {
  var protocol = opts.protocol === 'wxs' ? 'wss' : 'ws';
  var url = protocol + '://' + opts.hostname + opts.path;

  if (opts.port && opts.port !== 80 && opts.port !== 443) {
    url = protocol + '://' + opts.hostname + ':' + opts.port + opts.path;
  }

  if (typeof opts.transformWsUrl === 'function') {
    url = opts.transformWsUrl(url, opts, client);
  }

  return url;
}

function bindEventHandler() {
  socketTask.onOpen(function () {
    stream.setReadable(proxy);
    stream.setWritable(proxy);
    stream.emit('connect');
  });
  socketTask.onMessage(function (res) {
    var data = res.data;
    if (data instanceof ArrayBuffer) data = Buffer.from(data);else data = Buffer.from(data, 'utf8');
    proxy.push(data);
  });
  socketTask.onClose(function () {
    stream.end();
    stream.destroy();
  });
  socketTask.onError(function (res) {
    stream.destroy(new Error(res.errMsg));
  });
}

function buildStream(client, opts) {
  opts.hostname = opts.hostname || opts.host;

  if (!opts.hostname) {
    throw new Error('Could not determine host. Specify host manually.');
  }

  var websocketSubProtocol = opts.protocolId === 'MQIsdp' && opts.protocolVersion === 3 ? 'mqttv3.1' : 'mqtt';
  setDefaultOpts(opts);
  var url = buildUrl(opts, client);
  socketTask = wx.connectSocket({
    url: url,
    protocols: [websocketSubProtocol]
  });
  proxy = buildProxy();
  stream = duplexify.obj();

  stream._destroy = function (err, cb) {
    socketTask.close({
      success: function success() {
        cb && cb(err);
      }
    });
  };

  var destroyRef = stream.destroy;

  stream.destroy = function () {
    stream.destroy = destroyRef;
    var self = this;
    setTimeout(function () {
      socketTask.close({
        fail: function fail() {
          self._destroy(new Error());
        }
      });
    }, 0);
  }.bind(stream);

  bindEventHandler();
  return stream;
}

module.exports = buildStream;
},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js","readable-stream":"node_modules/readable-stream/readable-browser.js","duplexify":"node_modules/duplexify/index.js"}],"node_modules/mqtt/lib/connect/ali.js":[function(require,module,exports) {

'use strict';

var _require = require('buffer'),
    Buffer = _require.Buffer;

var Transform = require('readable-stream').Transform;

var duplexify = require('duplexify');
/* global FileReader */


var my;
var proxy;
var stream;
var isInitialized = false;

function buildProxy() {
  var proxy = new Transform();

  proxy._write = function (chunk, encoding, next) {
    my.sendSocketMessage({
      data: chunk.buffer,
      success: function success() {
        next();
      },
      fail: function fail() {
        next(new Error());
      }
    });
  };

  proxy._flush = function socketEnd(done) {
    my.closeSocket({
      success: function success() {
        done();
      }
    });
  };

  return proxy;
}

function setDefaultOpts(opts) {
  if (!opts.hostname) {
    opts.hostname = 'localhost';
  }

  if (!opts.path) {
    opts.path = '/';
  }

  if (!opts.wsOptions) {
    opts.wsOptions = {};
  }
}

function buildUrl(opts, client) {
  var protocol = opts.protocol === 'alis' ? 'wss' : 'ws';
  var url = protocol + '://' + opts.hostname + opts.path;

  if (opts.port && opts.port !== 80 && opts.port !== 443) {
    url = protocol + '://' + opts.hostname + ':' + opts.port + opts.path;
  }

  if (typeof opts.transformWsUrl === 'function') {
    url = opts.transformWsUrl(url, opts, client);
  }

  return url;
}

function bindEventHandler() {
  if (isInitialized) return;
  isInitialized = true;
  my.onSocketOpen(function () {
    stream.setReadable(proxy);
    stream.setWritable(proxy);
    stream.emit('connect');
  });
  my.onSocketMessage(function (res) {
    if (typeof res.data === 'string') {
      var buffer = Buffer.from(res.data, 'base64');
      proxy.push(buffer);
    } else {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var data = reader.result;
        if (data instanceof ArrayBuffer) data = Buffer.from(data);else data = Buffer.from(data, 'utf8');
        proxy.push(data);
      });
      reader.readAsArrayBuffer(res.data);
    }
  });
  my.onSocketClose(function () {
    stream.end();
    stream.destroy();
  });
  my.onSocketError(function (res) {
    stream.destroy(res);
  });
}

function buildStream(client, opts) {
  opts.hostname = opts.hostname || opts.host;

  if (!opts.hostname) {
    throw new Error('Could not determine host. Specify host manually.');
  }

  var websocketSubProtocol = opts.protocolId === 'MQIsdp' && opts.protocolVersion === 3 ? 'mqttv3.1' : 'mqtt';
  setDefaultOpts(opts);
  var url = buildUrl(opts, client);
  my = opts.my;
  my.connectSocket({
    url: url,
    protocols: websocketSubProtocol
  });
  proxy = buildProxy();
  stream = duplexify.obj();
  bindEventHandler();
  return stream;
}

module.exports = buildStream;
},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js","readable-stream":"node_modules/readable-stream/readable-browser.js","duplexify":"node_modules/duplexify/index.js"}],"node_modules/ws/browser.js":[function(require,module,exports) {
'use strict';

module.exports = function () {
  throw new Error('ws does not work in the browser. Browser clients must use the native ' + 'WebSocket object');
};
},{}],"node_modules/mqtt/lib/connect/ws.js":[function(require,module,exports) {

var process = require("process");
'use strict';

var _require = require('buffer'),
    Buffer = _require.Buffer;

var WS = require('ws');

var debug = require('debug')('mqttjs:ws');

var duplexify = require('duplexify');

var Transform = require('readable-stream').Transform;

var WSS_OPTIONS = ['rejectUnauthorized', 'ca', 'cert', 'key', 'pfx', 'passphrase']; // eslint-disable-next-line camelcase

var IS_BROWSER = typeof process !== 'undefined' && process.title === 'browser' || typeof __webpack_require__ === 'function';

function buildUrl(opts, client) {
  var url = opts.protocol + '://' + opts.hostname + ':' + opts.port + opts.path;

  if (typeof opts.transformWsUrl === 'function') {
    url = opts.transformWsUrl(url, opts, client);
  }

  return url;
}

function setDefaultOpts(opts) {
  var options = opts;

  if (!opts.hostname) {
    options.hostname = 'localhost';
  }

  if (!opts.port) {
    if (opts.protocol === 'wss') {
      options.port = 443;
    } else {
      options.port = 80;
    }
  }

  if (!opts.path) {
    options.path = '/';
  }

  if (!opts.wsOptions) {
    options.wsOptions = {};
  }

  if (!IS_BROWSER && opts.protocol === 'wss') {
    // Add cert/key/ca etc options
    WSS_OPTIONS.forEach(function (prop) {
      if (Object.prototype.hasOwnProperty.call(opts, prop) && !Object.prototype.hasOwnProperty.call(opts.wsOptions, prop)) {
        options.wsOptions[prop] = opts[prop];
      }
    });
  }

  return options;
}

function setDefaultBrowserOpts(opts) {
  var options = setDefaultOpts(opts);

  if (!options.hostname) {
    options.hostname = options.host;
  }

  if (!options.hostname) {
    // Throwing an error in a Web Worker if no `hostname` is given, because we
    // can not determine the `hostname` automatically.  If connecting to
    // localhost, please supply the `hostname` as an argument.
    if (typeof document === 'undefined') {
      throw new Error('Could not determine host. Specify host manually.');
    }

    var parsed = new URL(document.URL);
    options.hostname = parsed.hostname;

    if (!options.port) {
      options.port = parsed.port;
    }
  } // objectMode should be defined for logic


  if (options.objectMode === undefined) {
    options.objectMode = !(options.binary === true || options.binary === undefined);
  }

  return options;
}

function createWebSocket(client, url, opts) {
  debug('createWebSocket');
  debug('protocol: ' + opts.protocolId + ' ' + opts.protocolVersion);
  var websocketSubProtocol = opts.protocolId === 'MQIsdp' && opts.protocolVersion === 3 ? 'mqttv3.1' : 'mqtt';
  debug('creating new Websocket for url: ' + url + ' and protocol: ' + websocketSubProtocol);
  var socket = new WS(url, [websocketSubProtocol], opts.wsOptions);
  return socket;
}

function createBrowserWebSocket(client, opts) {
  var websocketSubProtocol = opts.protocolId === 'MQIsdp' && opts.protocolVersion === 3 ? 'mqttv3.1' : 'mqtt';
  var url = buildUrl(opts, client);
  /* global WebSocket */

  var socket = new WebSocket(url, [websocketSubProtocol]);
  socket.binaryType = 'arraybuffer';
  return socket;
}

function streamBuilder(client, opts) {
  debug('streamBuilder');
  var options = setDefaultOpts(opts);
  var url = buildUrl(options, client);
  var socket = createWebSocket(client, url, options);
  var webSocketStream = WS.createWebSocketStream(socket, options.wsOptions);
  webSocketStream.url = url;
  socket.on('close', function () {
    webSocketStream.destroy();
  });
  return webSocketStream;
}

function browserStreamBuilder(client, opts) {
  debug('browserStreamBuilder');
  var stream;
  var options = setDefaultBrowserOpts(opts); // sets the maximum socket buffer size before throttling

  var bufferSize = options.browserBufferSize || 1024 * 512;
  var bufferTimeout = opts.browserBufferTimeout || 1000;
  var coerceToBuffer = !opts.objectMode;
  var socket = createBrowserWebSocket(client, opts);
  var proxy = buildProxy(opts, socketWriteBrowser, socketEndBrowser);

  if (!opts.objectMode) {
    proxy._writev = writev;
  }

  proxy.on('close', function () {
    socket.close();
  });
  var eventListenerSupport = typeof socket.addEventListener !== 'undefined'; // was already open when passed in

  if (socket.readyState === socket.OPEN) {
    stream = proxy;
  } else {
    stream = stream = duplexify(undefined, undefined, opts);

    if (!opts.objectMode) {
      stream._writev = writev;
    }

    if (eventListenerSupport) {
      socket.addEventListener('open', onopen);
    } else {
      socket.onopen = onopen;
    }
  }

  stream.socket = socket;

  if (eventListenerSupport) {
    socket.addEventListener('close', onclose);
    socket.addEventListener('error', onerror);
    socket.addEventListener('message', onmessage);
  } else {
    socket.onclose = onclose;
    socket.onerror = onerror;
    socket.onmessage = onmessage;
  } // methods for browserStreamBuilder


  function buildProxy(options, socketWrite, socketEnd) {
    var proxy = new Transform({
      objectModeMode: options.objectMode
    });
    proxy._write = socketWrite;
    proxy._flush = socketEnd;
    return proxy;
  }

  function onopen() {
    stream.setReadable(proxy);
    stream.setWritable(proxy);
    stream.emit('connect');
  }

  function onclose() {
    stream.end();
    stream.destroy();
  }

  function onerror(err) {
    stream.destroy(err);
  }

  function onmessage(event) {
    var data = event.data;
    if (data instanceof ArrayBuffer) data = Buffer.from(data);else data = Buffer.from(data, 'utf8');
    proxy.push(data);
  } // this is to be enabled only if objectMode is false


  function writev(chunks, cb) {
    var buffers = new Array(chunks.length);

    for (var i = 0; i < chunks.length; i++) {
      if (typeof chunks[i].chunk === 'string') {
        buffers[i] = Buffer.from(chunks[i], 'utf8');
      } else {
        buffers[i] = chunks[i].chunk;
      }
    }

    this._write(Buffer.concat(buffers), 'binary', cb);
  }

  function socketWriteBrowser(chunk, enc, next) {
    if (socket.bufferedAmount > bufferSize) {
      // throttle data until buffered amount is reduced.
      setTimeout(socketWriteBrowser, bufferTimeout, chunk, enc, next);
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, 'utf8');
    }

    try {
      socket.send(chunk);
    } catch (err) {
      return next(err);
    }

    next();
  }

  function socketEndBrowser(done) {
    socket.close();
    done();
  } // end methods for browserStreamBuilder


  return stream;
}

if (IS_BROWSER) {
  module.exports = browserStreamBuilder;
} else {
  module.exports = streamBuilder;
}
},{"buffer":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/buffer/index.js","ws":"node_modules/ws/browser.js","debug":"node_modules/debug/src/browser.js","duplexify":"node_modules/duplexify/index.js","readable-stream":"node_modules/readable-stream/readable-browser.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/mqtt/lib/connect/index.js":[function(require,module,exports) {
var process = require("process");
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var MqttClient = require('../client');

var Store = require('../store');

var url = require('url');

var xtend = require('xtend');

var debug = require('debug')('mqttjs');

var protocols = {}; // eslint-disable-next-line camelcase

if (typeof process !== 'undefined' && process.title !== 'browser' || typeof __webpack_require__ !== 'function') {
  protocols.mqtt = require('./tcp');
  protocols.tcp = require('./tcp');
  protocols.ssl = require('./tls');
  protocols.tls = require('./tls');
  protocols.mqtts = require('./tls');
} else {
  protocols.wx = require('./wx');
  protocols.wxs = require('./wx');
  protocols.ali = require('./ali');
  protocols.alis = require('./ali');
}

protocols.ws = require('./ws');
protocols.wss = require('./ws');
/**
 * Parse the auth attribute and merge username and password in the options object.
 *
 * @param {Object} [opts] option object
 */

function parseAuthOptions(opts) {
  var matches;

  if (opts.auth) {
    matches = opts.auth.match(/^(.+):(.+)$/);

    if (matches) {
      opts.username = matches[1];
      opts.password = matches[2];
    } else {
      opts.username = opts.auth;
    }
  }
}
/**
 * connect - connect to an MQTT broker.
 *
 * @param {String} [brokerUrl] - url of the broker, optional
 * @param {Object} opts - see MqttClient#constructor
 */


function connect(brokerUrl, opts) {
  debug('connecting to an MQTT broker...');

  if (_typeof(brokerUrl) === 'object' && !opts) {
    opts = brokerUrl;
    brokerUrl = null;
  }

  opts = opts || {};

  if (brokerUrl) {
    // eslint-disable-next-line
    var parsed = url.parse(brokerUrl, true);

    if (parsed.port != null) {
      parsed.port = Number(parsed.port);
    }

    opts = xtend(parsed, opts);

    if (opts.protocol === null) {
      throw new Error('Missing protocol');
    }

    opts.protocol = opts.protocol.replace(/:$/, '');
  } // merge in the auth options if supplied


  parseAuthOptions(opts); // support clientId passed in the query string of the url

  if (opts.query && typeof opts.query.clientId === 'string') {
    opts.clientId = opts.query.clientId;
  }

  if (opts.cert && opts.key) {
    if (opts.protocol) {
      if (['mqtts', 'wss', 'wxs', 'alis'].indexOf(opts.protocol) === -1) {
        switch (opts.protocol) {
          case 'mqtt':
            opts.protocol = 'mqtts';
            break;

          case 'ws':
            opts.protocol = 'wss';
            break;

          case 'wx':
            opts.protocol = 'wxs';
            break;

          case 'ali':
            opts.protocol = 'alis';
            break;

          default:
            throw new Error('Unknown protocol for secure connection: "' + opts.protocol + '"!');
        }
      }
    } else {
      // A cert and key was provided, however no protocol was specified, so we will throw an error.
      throw new Error('Missing secure protocol key');
    }
  }

  if (!protocols[opts.protocol]) {
    var isSecure = ['mqtts', 'wss'].indexOf(opts.protocol) !== -1;
    opts.protocol = ['mqtt', 'mqtts', 'ws', 'wss', 'wx', 'wxs', 'ali', 'alis'].filter(function (key, index) {
      if (isSecure && index % 2 === 0) {
        // Skip insecure protocols when requesting a secure one.
        return false;
      }

      return typeof protocols[key] === 'function';
    })[0];
  }

  if (opts.clean === false && !opts.clientId) {
    throw new Error('Missing clientId for unclean clients');
  }

  if (opts.protocol) {
    opts.defaultProtocol = opts.protocol;
  }

  function wrapper(client) {
    if (opts.servers) {
      if (!client._reconnectCount || client._reconnectCount === opts.servers.length) {
        client._reconnectCount = 0;
      }

      opts.host = opts.servers[client._reconnectCount].host;
      opts.port = opts.servers[client._reconnectCount].port;
      opts.protocol = !opts.servers[client._reconnectCount].protocol ? opts.defaultProtocol : opts.servers[client._reconnectCount].protocol;
      opts.hostname = opts.host;
      client._reconnectCount++;
    }

    debug('calling streambuilder for', opts.protocol);
    return protocols[opts.protocol](client, opts);
  }

  var client = new MqttClient(wrapper, opts);
  client.on('error', function () {
    /* Automatically set up client error handling */
  });
  return client;
}

module.exports = connect;
module.exports.connect = connect;
module.exports.MqttClient = MqttClient;
module.exports.Store = Store;
},{"../client":"node_modules/mqtt/lib/client.js","../store":"node_modules/mqtt/lib/store.js","url":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/url/url.js","xtend":"node_modules/xtend/immutable.js","debug":"node_modules/debug/src/browser.js","./tcp":"node_modules/mqtt/lib/connect/tcp.js","./tls":"node_modules/mqtt/lib/connect/tls.js","./wx":"node_modules/mqtt/lib/connect/wx.js","./ali":"node_modules/mqtt/lib/connect/ali.js","./ws":"node_modules/mqtt/lib/connect/ws.js","process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/farmbot/dist/util/coordinate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coordinate = void 0;

function coordinate(x, y, z) {
  return {
    kind: "coordinate",
    args: {
      x: x,
      y: y,
      z: z
    }
  };
}

exports.coordinate = coordinate;
},{}],"node_modules/farmbot/dist/util/is_celery_script.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasLabel = exports.isCeleryScript = void 0;

var isObj = function (o) {
  return !!(o && typeof o === "object");
};

var hasKind = function (o) {
  return typeof o.kind === "string";
};

var hasArgs = function (o) {
  return isObj(o) && !!o.args;
};

function isCeleryScript(x) {
  return isObj(x) && hasKind(x) && hasArgs(x);
}

exports.isCeleryScript = isCeleryScript;

function hasLabel(x) {
  if (isCeleryScript(x)) {
    return typeof x.args.label === "string";
  } else {
    return false;
  }
}

exports.hasLabel = hasLabel;
},{}],"node_modules/farmbot/dist/util/is_node.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNode = void 0;

function isNode() {
  return typeof window === "undefined";
}

exports.isNode = isNode;
},{}],"node_modules/farmbot/dist/util/pick.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pick = void 0;

function pick(target, value, fallback) {
  var result = target[value];
  return typeof result === undefined ? fallback : result;
}

exports.pick = pick;
},{}],"node_modules/farmbot/dist/util/uuid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uuid = void 0;

function uuid() {
  var template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

  var replaceChar = function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  };

  return template.replace(/[xy]/g, replaceChar);
}

exports.uuid = uuid;
},{}],"node_modules/farmbot/dist/util/rpc_request.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpcRequest = exports.Priority = void 0;

var uuid_1 = require("./uuid");

var Priority;

(function (Priority) {
  Priority[Priority["HIGHEST"] = 9000] = "HIGHEST";
  Priority[Priority["NORMAL"] = 600] = "NORMAL";
  Priority[Priority["LOWEST"] = 300] = "LOWEST";
})(Priority = exports.Priority || (exports.Priority = {}));

var rpcRequest = function (body, priority) {
  if (priority === void 0) {
    priority = Priority.NORMAL;
  }

  return {
    kind: "rpc_request",
    args: {
      label: (0, uuid_1.uuid)(),
      priority: priority
    },
    body: body
  };
};

exports.rpcRequest = rpcRequest;
},{"./uuid":"node_modules/farmbot/dist/util/uuid.js"}],"node_modules/farmbot/dist/util.js":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferToString = exports.stringToBuffer = void 0;

__exportStar(require("./util/coordinate"), exports);

__exportStar(require("./util/is_celery_script"), exports);

__exportStar(require("./util/is_node"), exports);

__exportStar(require("./util/pick"), exports);

__exportStar(require("./util/rpc_request"), exports);

__exportStar(require("./util/uuid"), exports);

function stringToBuffer(str) {
  var regular_array = str.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  var data16 = new Uint8Array(regular_array);
  return data16;
}

exports.stringToBuffer = stringToBuffer;

function newDecoder() {
  if (typeof util !== "undefined" && util.TextDecoder) {
    return new util.TextDecoder();
  }

  if (typeof window !== "undefined" && window.TextDecoder) {
    return new window.TextDecoder();
  }

  return {
    decode: function (buffer) {
      var chars = [];
      buffer.forEach(function (x) {
        return chars.push(String.fromCharCode(x));
      });
      return chars.join("");
    }
  };
}

var td = newDecoder();
/** We originally called buffer.toString(),
 *  but that suffers from inconsistent behavior
 * between environments, leading to testing
 * difficulty. */

var bufferToString = function (b) {
  return td.decode(b);
};

exports.bufferToString = bufferToString;
},{"./util/coordinate":"node_modules/farmbot/dist/util/coordinate.js","./util/is_celery_script":"node_modules/farmbot/dist/util/is_celery_script.js","./util/is_node":"node_modules/farmbot/dist/util/is_node.js","./util/pick":"node_modules/farmbot/dist/util/pick.js","./util/rpc_request":"node_modules/farmbot/dist/util/rpc_request.js","./util/uuid":"node_modules/farmbot/dist/util/uuid.js"}],"node_modules/farmbot/dist/config.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateConfig = exports.FIX_ATOB_FIRST = exports.CONFIG_DEFAULTS = void 0;

var util_1 = require("./util");

var ERR_TOKEN_PARSE = "Unable to parse token. Is it properly formatted?";
exports.CONFIG_DEFAULTS = {
  speed: 100,
  interim_flag_is_legacy_fbos: true
};
var ERR_MISSING_MQTT_USERNAME = "MISSING_MQTT_USERNAME";
exports.FIX_ATOB_FIRST = "NOTE TO NODEJS USERS:\n\nThis library requires an 'atob()' function.\nPlease fix this first.\nSOLUTION: https://github.com/FarmBot/farmbot-js/issues/33";

var parseToken = function (input) {
  try {
    return JSON.parse(atob(input.split(".")[1]));
  } catch (e) {
    console.warn(e);
    throw new Error(ERR_TOKEN_PARSE);
  }
};

var generateConfig = function (input) {
  if ((0, util_1.isNode)() && !global.atob) {
    throw new Error(exports.FIX_ATOB_FIRST);
  }

  var t = parseToken(input.token);
  return {
    speed: input.speed || exports.CONFIG_DEFAULTS.speed,
    token: input.token,
    secure: input.secure === false ? false : true,
    mqttServer: (0, util_1.isNode)() ? "mqtt://".concat(t.mqtt, ":1883") : t.mqtt_ws,
    mqttUsername: t.bot || ERR_MISSING_MQTT_USERNAME,
    LAST_PING_OUT: 0,
    LAST_PING_IN: 0,
    interim_flag_is_legacy_fbos: true
  };
};

exports.generateConfig = generateConfig;
},{"./util":"node_modules/farmbot/dist/util.js"}],"node_modules/farmbot/dist/resources/support.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveOrReject = exports.internalError = exports.outboundChanFor = void 0;

var outboundChanFor = function (username, op, kind, uuid, id) {
  if (id === void 0) {
    id = 0;
  }

  var segments = ["bot", username, "resources_v0", op, kind, uuid, id];
  return segments.join("/");
};

exports.outboundChanFor = outboundChanFor; // Auto-reject if client is not connected yet.

exports.internalError = {
  kind: "rpc_error",
  args: {
    label: "BROWSER_LEVEL_FAILURE"
  },
  body: [{
    kind: "explanation",
    args: {
      message: "Tried to perform batch operation before connect."
    }
  }]
};

var resolveOrReject = function (res, rej) {
  return function (m) {
    return (m.kind == "rpc_ok" ? res : rej)(m);
  };
};

exports.resolveOrReject = resolveOrReject;
},{}],"node_modules/farmbot/dist/resources/reject_rpc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rejectRpc = void 0;

var support_1 = require("./support");

var rejectRpc = function () {
  return Promise.reject(support_1.internalError);
};

exports.rejectRpc = rejectRpc;
},{"./support":"node_modules/farmbot/dist/resources/support.js"}],"node_modules/farmbot/dist/resources/resource_adapter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceAdapter = void 0;

var __1 = require("..");

var support_1 = require("./support");

var reject_rpc_1 = require("./reject_rpc");

var ResourceAdapter =
/** @class */
function () {
  function ResourceAdapter(parent, username) {
    var _this = this;

    this.parent = parent;
    this.username = username;

    this.destroy = function (r) {
      var client = _this.parent.client;
      return client ? _this.doDestroy(client, r.kind, r.id) : (0, reject_rpc_1.rejectRpc)();
    };

    this.save = function (resource) {
      var client = _this.parent.client;
      return client ? _this.doSave(client, resource) : (0, reject_rpc_1.rejectRpc)();
    };

    this.destroyAll = function (req) {
      return Promise.all(req.map(function (r) {
        return _this.destroy(r);
      }));
    };

    this.doDestroy = function (client, kind, id) {
      return new Promise(function (res, rej) {
        var requestId = (0, __1.uuid)();

        _this.parent.on(requestId, (0, support_1.resolveOrReject)(res, rej));

        client.publish((0, support_1.outboundChanFor)(_this.username, "destroy", kind, requestId, id), "");
      });
    };

    this.doSave = function (client, r) {
      return new Promise(function (res, rej) {
        var uid = (0, __1.uuid)();

        _this.parent.on(uid, (0, support_1.resolveOrReject)(res, rej));

        var chan = (0, support_1.outboundChanFor)(_this.username, "save", r.kind, uid, r.body.id);
        client.publish(chan, JSON.stringify(r.body));
      });
    };
  }

  return ResourceAdapter;
}();

exports.ResourceAdapter = ResourceAdapter;
},{"..":"node_modules/farmbot/dist/index.js","./support":"node_modules/farmbot/dist/resources/support.js","./reject_rpc":"node_modules/farmbot/dist/resources/reject_rpc.js"}],"node_modules/farmbot/dist/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Misc = exports.FbjsEventName = exports.MqttChanName = void 0;
var MqttChanName;

(function (MqttChanName) {
  MqttChanName["fromApi"] = "from_api";
  MqttChanName["fromClients"] = "from_clients";
  MqttChanName["fromDevice"] = "from_device";
  MqttChanName["logs"] = "logs";
  MqttChanName["status"] = "status";
  MqttChanName["sync"] = "sync";
  /** THIS ONE IS SPECIAL. */

  MqttChanName["publicBroadcast"] = "public_broadcast";
  MqttChanName["pong"] = "pong";
})(MqttChanName = exports.MqttChanName || (exports.MqttChanName = {}));
/** Not to be confused with MqttChanNames or
 * MQTT.js event names */


var FbjsEventName;

(function (FbjsEventName) {
  /** State tree update. */
  FbjsEventName["status"] = "status";
  /** When a log is received */

  FbjsEventName["logs"] = "logs";
  /** When an unexpected message is received */

  FbjsEventName["malformed"] = "malformed";
  /** Unreliable. */

  FbjsEventName["offline"] = "offline";
  /** Fired on connect. */

  FbjsEventName["online"] = "online";
  /** Fires when the API sends an MQTT message to users. */

  FbjsEventName["publicBroadcast"] = "public_broadcast";
  /** Fires after any message is sent from current client. */

  FbjsEventName["sent"] = "sent";
  /** Used by resource auto-sync. */

  FbjsEventName["sync"] = "sync";
  /** When a key is removed from the device state tree. */

  FbjsEventName["remove"] = "remove";
})(FbjsEventName = exports.FbjsEventName || (exports.FbjsEventName = {}));

var Misc;

(function (Misc) {
  /** Channel delimiter for MQTT channels. */
  Misc["MQTT_DELIM"] = "/";
  /** Namespace delimiter used by `sync_v7` */

  Misc["PATH_DELIM"] = ".";
  /** A null value when dealing with empty `pair` nodes in CeleryScript. */

  Misc["NULL"] = "null";
  /** Reconnect internval for MQTT.js */

  Misc[Misc["RECONNECT_THROTTLE_MS"] = 1000] = "RECONNECT_THROTTLE_MS";
})(Misc = exports.Misc || (exports.Misc = {}));
},{}],"node_modules/farmbot/dist/util/time.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timestamp = void 0;
/** Returns a timestamp in ms. */

function timestamp() {
  return Math.round(new Date().getTime() / 100);
}

exports.timestamp = timestamp; // type RejectFn = (reason?: any) => void;
// type ResolveFn<T> = (value?: T | PromiseLike<T>) => void;
// interface Executor<T> {
//   (x: (resolve: ResolveFn<T>, reject: RejectFn) => void): Promise<T>;
// }
// export function timeoutPromise<T>(time: number, executor: Executor<T>): Promise<T> {
//   return new Promise(executor);
// }
},{}],"node_modules/farmbot/dist/farmbot.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Farmbot = void 0;

var mqtt_1 = require("mqtt");

var util_1 = require("./util");

var _1 = require(".");

var config_1 = require("./config");

var resource_adapter_1 = require("./resources/resource_adapter");

var constants_1 = require("./constants");

var is_celery_script_1 = require("./util/is_celery_script");

var time_1 = require("./util/time");

var rpc_request_1 = require("./util/rpc_request");

var Farmbot =
/** @class */
function () {
  function Farmbot(input) {
    var _this = this;
    /** Get a Farmbot Constructor Parameter. */


    this.getConfig = function (key) {
      return _this.config[key];
    };
    /** Set a Farmbot Constructor Parameter. */


    this.setConfig = function (key, value) {
      _this.config[key] = value;
    };
    /**
     * Installs a "Farmware" (plugin) onto the bot's SD card.
     * URL must point to a valid Farmware manifest JSON document.
     */


    this.installFarmware = function (url) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "install_farmware",
        args: {
          url: url
        }
      }]));
    };
    /**
     * Checks for updates on a particular Farmware plugin when given the name of
     * a Farmware. `updateFarmware("take-photo")`
     */


    this.updateFarmware = function (pkg) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "update_farmware",
        args: {
          package: pkg
        }
      }]));
    };
    /** Uninstall a Farmware plugin. */


    this.removeFarmware = function (pkg) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "remove_farmware",
        args: {
          package: pkg
        }
      }]));
    };
    /**
     * Installs "Farmware" (plugins) authored by FarmBot, Inc.
     * onto the bot's SD card.
     */


    this.installFirstPartyFarmware = function () {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "install_first_party_farmware",
        args: {}
      }]));
    };
    /**
     * Deactivate FarmBot OS completely (shutdown).
     * Useful before unplugging the power.
     */


    this.powerOff = function () {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "power_off",
        args: {}
      }]));
    };
    /** Restart FarmBot OS. */


    this.reboot = function () {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "reboot",
        args: {
          package: "farmbot_os"
        }
      }]));
    };
    /** Reinitialize the FarmBot microcontroller firmware. */


    this.rebootFirmware = function () {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "reboot",
        args: {
          package: "arduino_firmware"
        }
      }]));
    };
    /** Check for new versions of FarmBot OS.
     * Downloads and installs if available. */


    this.checkUpdates = function () {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "check_updates",
        args: {
          package: "farmbot_os"
        }
      }]));
    };
    /** THIS WILL RESET THE SD CARD, deleting all non-factory data!
     * Be careful!! */


    this.resetOS = function () {
      return _this.publish((0, util_1.rpcRequest)([{
        kind: "factory_reset",
        args: {
          package: "farmbot_os"
        }
      }]));
    };
    /** WARNING: will reset all firmware (hardware) settings! */


    this.resetMCU = function () {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "factory_reset",
        args: {
          package: "arduino_firmware"
        }
      }]));
    };

    this.flashFirmware = function (
    /** one of: "arduino"|"express_k10"|"farmduino_k14"|"farmduino" */
    firmware_name) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "flash_firmware",
        args: {
          package: firmware_name
        }
      }]));
    };
    /**
     * Lock the bot from moving (E-STOP). Turns off peripherals and motors. This
     * also will pause running regimens and cause any running sequences to exit.
     */


    this.emergencyLock = function () {
      var body = [{
        kind: "emergency_lock",
        args: {}
      }];
      var rpc = (0, util_1.rpcRequest)(body, rpc_request_1.Priority.HIGHEST);
      return _this.send(rpc);
    };
    /** Unlock the bot when the user says it is safe. */


    this.emergencyUnlock = function () {
      var body = [{
        kind: "emergency_unlock",
        args: {}
      }];
      var rpc = (0, util_1.rpcRequest)(body, rpc_request_1.Priority.HIGHEST);
      return _this.send(rpc);
    };
    /** Execute a sequence by its ID on the FarmBot API. */


    this.execSequence = function (sequence_id, body) {
      if (body === void 0) {
        body = [];
      }

      return _this.send((0, util_1.rpcRequest)([{
        kind: "execute",
        args: {
          sequence_id: sequence_id
        },
        body: body
      }]));
    };
    /** Run an installed Farmware plugin on the SD Card. */


    this.execScript = function (
    /** Name of the Farmware. */
    label,
    /** Optional ENV vars to pass the Farmware. */
    envVars) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "execute_script",
        args: {
          label: label
        },
        body: envVars
      }]));
    };
    /** Bring a particular axis (or all of them) to position 0 in Z Y X order. */


    this.home = function (args) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "home",
        args: args
      }]));
    };
    /** Use end stops or encoders to figure out where 0,0,0 is in Z Y X axis
     * order. WON'T WORK WITHOUT ENCODERS OR END STOPS! A blockage or stall
     * during this command will set that position as zero. Use carefully. */


    this.findHome = function (args) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "find_home",
        args: args
      }]));
    };
    /** Move FarmBot to an absolute point. */


    this.moveAbsolute = function (args) {
      var x = args.x,
          y = args.y,
          z = args.z;
      var speed = args.speed || config_1.CONFIG_DEFAULTS.speed;
      return _this.send((0, util_1.rpcRequest)([{
        kind: "move_absolute",
        args: {
          location: (0, util_1.coordinate)(x, y, z),
          offset: (0, util_1.coordinate)(0, 0, 0),
          speed: speed
        }
      }]));
    };
    /** Move FarmBot to position relative to its current position. */


    this.moveRelative = function (args) {
      var x = args.x,
          y = args.y,
          z = args.z;
      var speed = args.speed || config_1.CONFIG_DEFAULTS.speed;
      return _this.send((0, util_1.rpcRequest)([{
        kind: "move_relative",
        args: {
          x: x,
          y: y,
          z: z,
          speed: speed
        }
      }]));
    };
    /** Set a GPIO pin to a particular value. */


    this.writePin = function (args) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "write_pin",
        args: args
      }]));
    };
    /** Read the value of a GPIO pin. Will create a SensorReading if it's
     * a sensor. */


    this.readPin = function (args) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "read_pin",
        args: args
      }]));
    };
    /** Reverse the value of a digital pin. */


    this.togglePin = function (args) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "toggle_pin",
        args: args
      }]));
    };
    /** Read the status of the bot. Should not be needed unless you are first
     * logging in to the device, since the device pushes new states out on
     * every update. */


    this.readStatus = function (args) {
      if (args === void 0) {
        args = {};
      }

      return _this.send((0, util_1.rpcRequest)([{
        kind: "read_status",
        args: args
      }]));
    };
    /** Snap a photo and send to the API for post processing. */


    this.takePhoto = function (args) {
      if (args === void 0) {
        args = {};
      }

      return _this.send((0, util_1.rpcRequest)([{
        kind: "take_photo",
        args: args
      }]));
    };
    /** Download/apply all of the latest FarmBot API JSON resources (plants,
     * account info, etc.) to the device. */


    this.sync = function (args) {
      if (args === void 0) {
        args = {};
      }

      return _this.send((0, util_1.rpcRequest)([{
        kind: "sync",
        args: args
      }]));
    };
    /**
     * Set the current position of the given axis to 0.
     * Example: Sending `bot.setZero("x")` at x: 255 will translate position
     * 255 to 0, causing that position to be x: 0.
     */


    this.setZero = function (axis) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "zero",
        args: {
          axis: axis
        }
      }]));
    };
    /**
     * Set user ENV vars (usually used by 3rd-party Farmware plugins).
     * Set value to `undefined` to unset.
     */


    this.setUserEnv = function (configs) {
      var body = Object.keys(configs).map(function (label) {
        return {
          kind: "pair",
          args: {
            label: label,
            value: configs[label] || constants_1.Misc.NULL
          }
        };
      });
      return _this.send((0, util_1.rpcRequest)([{
        kind: "set_user_env",
        args: {},
        body: body
      }]));
    };

    this.sendMessage = function (message_type, message, channels) {
      if (channels === void 0) {
        channels = [];
      }

      _this.send((0, util_1.rpcRequest)([{
        kind: "send_message",
        args: {
          message_type: message_type,
          message: message
        },
        body: channels.map(function (channel_name) {
          return {
            kind: "channel",
            args: {
              channel_name: channel_name
            }
          };
        })
      }]));
    };
    /** Control servos on pins 4 and 5. */


    this.setServoAngle = function (args) {
      var result = _this.send((0, util_1.rpcRequest)([{
        kind: "set_servo_angle",
        args: args
      }])); // Celery script can't validate `pin_number` and `pin_value` the way we need
      // for `set_servo_angle`. We will send the RPC command off, but also
      // crash the client to aid debugging.


      if (![4, 5, 6, 11].includes(args.pin_number)) {
        throw new Error("Servos only work on pins 4 and 5");
      }

      if (args.pin_value > 180 || args.pin_value < 0) {
        throw new Error("Pin value outside of 0...180 range");
      }

      return result;
    };
    /**
     * Find the axis extents using encoder, motor, or end-stop feedback.
     * Will set a new home position and a new axis length for the given axis.
     */


    this.calibrate = function (args) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "calibrate",
        args: args
      }]));
    };

    this.lua = function (lua) {
      return _this.send((0, util_1.rpcRequest)([{
        kind: "lua",
        args: {
          lua: lua
        }
      }]));
    };
    /**
     * Retrieves all of the event handlers for a particular event.
     * Returns an empty array if the event did not exist.
     */


    this.event = function (name) {
      _this._events[name] = _this._events[name] || [];
      return _this._events[name];
    };

    this.on = function (event, value, once) {
      if (once === void 0) {
        once = false;
      }

      _this.event(event).push({
        value: value,
        once: once,
        event: event
      });
    };

    this.emit = function (event, data) {
      var nextArray = [];

      _this.event(event).concat(_this.event("*")).forEach(function (handler) {
        try {
          handler.value(data, event);

          if (!handler.once && handler.event === event) {
            nextArray.push(handler);
          }
        } catch (e) {
          var msg = "Exception thrown while handling '".concat(event, "' event.");
          console.warn(msg);
          console.dir(e);
        }
      });

      if (nextArray.length === 0) {
        delete _this._events[event];
      } else {
        _this._events[event] = nextArray;
      }
    };
    /** Low-level means of sending MQTT packets. Does not check format. Does not
     * acknowledge confirmation. Probably not the one you want. */


    this.publish = function (msg, important) {
      if (important === void 0) {
        important = true;
      }

      if (_this.client) {
        _this.emit(constants_1.FbjsEventName.sent, msg);
        /** SEE: https://github.com/mqttjs/MQTT.js#client */


        _this.client.publish(_this.channel.toDevice, JSON.stringify(msg));
      } else {
        if (important) {
          throw new Error("Not connected to server");
        }
      }
    };
    /** Low-level means of sending MQTT RPC commands to the bot. Acknowledges
     * receipt of message, but does not check formatting. Consider using higher
     * level methods like .moveRelative(), .calibrate(), etc....
    */


    this.send = function (input) {
      return new Promise(function (resolve, reject) {
        _this.publish(input);

        function handler(response) {
          switch (response.kind) {
            case "rpc_ok":
              return resolve(response);

            case "rpc_error":
              var reason = (response.body || []).map(function (x) {
                return x.args.message;
              }).join(", ");
              return reject(new Error("Problem sending RPC command: " + reason));

            default:
              console.dir(response);
              throw new Error("Got a bad CeleryScript node.");
          }
        }

        _this.on(input.args.label, handler, true);
      });
    };
    /** Main entry point for all MQTT packets. */


    this._onmessage = function (chan, buffer) {
      var original = (0, _1.bufferToString)(buffer);
      var segments = chan.split(constants_1.Misc.MQTT_DELIM);
      var emit = _this.emit;

      try {
        var msg = JSON.parse(original);

        if (segments[0] == constants_1.MqttChanName.publicBroadcast) {
          return emit(constants_1.MqttChanName.publicBroadcast, msg);
        }

        switch (segments[2]) {
          case constants_1.MqttChanName.logs:
            return emit(constants_1.FbjsEventName.logs, msg);

          case constants_1.MqttChanName.status:
            return emit(constants_1.FbjsEventName.status, msg);

          case constants_1.MqttChanName.sync:
            return emit(constants_1.FbjsEventName.sync, msg);

          case constants_1.MqttChanName.pong:
            return emit(segments[3], msg);

          default:
            var ev = (0, is_celery_script_1.hasLabel)(msg) ? msg.args.label : constants_1.FbjsEventName.malformed;
            return emit(ev, msg);
        }
      } catch (error) {
        console.dir({
          text: "Could not parse inbound message from MQTT.",
          error: error
        });
        emit(constants_1.FbjsEventName.malformed, original);
      }
    };

    this.ping = function (timeout, now) {
      if (timeout === void 0) {
        timeout = 10000;
      }

      if (now === void 0) {
        now = (0, time_1.timestamp)();
      }

      _this.setConfig("LAST_PING_OUT", now);

      return _this.doPing(now, timeout);
    }; // STEP 0: Subscribe to `bot/device_23/pong/#`
    // STEP 0: Send         `bot/device_23/ping/3123123`
    // STEP 0: Receive      `bot/device_23/pong/3123123`


    this.doPing = function (startedAt, timeout) {
      var timeoutPromise = new Promise(function (_, rej) {
        return setTimeout(function () {
          return rej(-0);
        }, timeout);
      });
      var pingPromise = new Promise(function (res, _) {
        var ok = function () {
          var t = (0, time_1.timestamp)();

          _this.setConfig("LAST_PING_IN", t);

          res(t - startedAt);
        };

        _this.on("" + startedAt, ok, true);

        var chan = _this.channel.ping(startedAt);

        if (_this.client) {
          _this.client.publish(chan, JSON.stringify(startedAt));
        }
      });
      return Promise.race([timeoutPromise, pingPromise]);
    };
    /** Bootstrap the device onto the MQTT broker. */


    this.connect = function () {
      var _a = _this.config,
          mqttUsername = _a.mqttUsername,
          token = _a.token,
          mqttServer = _a.mqttServer;
      var reconnectPeriod = constants_1.Misc.RECONNECT_THROTTLE_MS;
      var client = (0, mqtt_1.connect)(mqttServer, {
        clean: true,
        clientId: "FBJS-".concat(Farmbot.VERSION, "-").concat((0, util_1.uuid)()),
        password: token,
        protocolId: "MQIsdp",
        protocolVersion: 3,
        reconnectPeriod: reconnectPeriod,
        username: mqttUsername
      });
      _this.client = client;
      _this.resources = new resource_adapter_1.ResourceAdapter(_this, _this.config.mqttUsername);
      client.on("message", _this._onmessage);
      client.on("offline", function () {
        return _this.emit(constants_1.FbjsEventName.offline, {});
      });
      client.on("connect", function () {
        return _this.emit(constants_1.FbjsEventName.online, {});
      });
      var channels = [_this.channel.logs, _this.channel.status, _this.channel.sync, _this.channel.toClient, _this.channel.pong];
      client.subscribe(channels);
      return new Promise(function (resolve, _reject) {
        if (_this.client) {
          _this.client.once("connect", function () {
            return resolve(_this);
          });
        } else {
          throw new Error("Please connect first.");
        }
      });
    };

    this._events = {};
    this.config = (0, config_1.generateConfig)(input);
    this.resources = new resource_adapter_1.ResourceAdapter(this, this.config.mqttUsername);
  }

  Object.defineProperty(Farmbot.prototype, "channel", {
    /** Dictionary of all relevant MQTT channels the bot uses. */
    get: function () {
      var deviceName = this.config.mqttUsername;
      return {
        /** From the browser, usually. */
        toDevice: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.fromClients),

        /** From farmbot */
        toClient: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.fromDevice),
        status: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.status),
        logs: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.logs),
        sync: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.sync, "/#"),

        /** Read only */
        pong: "bot/".concat(deviceName, "/pong/#"),

        /** Write only: bot/${deviceName}/ping/${timestamp} */
        ping: function (tStamp) {
          return "bot/".concat(deviceName, "/ping/").concat(tStamp);
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  Farmbot.VERSION = "15.0.0";
  return Farmbot;
}();

exports.Farmbot = Farmbot;
},{"mqtt":"node_modules/mqtt/lib/connect/index.js","./util":"node_modules/farmbot/dist/util.js",".":"node_modules/farmbot/dist/index.js","./config":"node_modules/farmbot/dist/config.js","./resources/resource_adapter":"node_modules/farmbot/dist/resources/resource_adapter.js","./constants":"node_modules/farmbot/dist/constants.js","./util/is_celery_script":"node_modules/farmbot/dist/util/is_celery_script.js","./util/time":"node_modules/farmbot/dist/util/time.js","./util/rpc_request":"node_modules/farmbot/dist/util/rpc_request.js"}],"node_modules/farmbot/dist/interfaces.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Encoder = void 0;
var Encoder;

(function (Encoder) {
  Encoder[Encoder["unknown"] = -1] = "unknown";
  Encoder[Encoder["quadrature"] = 0] = "quadrature";
  Encoder[Encoder["differential"] = 1] = "differential";
})(Encoder = exports.Encoder || (exports.Encoder = {}));
},{}],"node_modules/farmbot/dist/resources/tagged_resource.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpecialStatus = void 0;
/** Denotes special status of resource */

var SpecialStatus;

(function (SpecialStatus) {
  /** The local copy is different than the one on the remote end. */
  SpecialStatus["DIRTY"] = "DIRTY";
  /** The local copy is being saved on the remote end right now? */

  SpecialStatus["SAVING"] = "SAVING";
  /** API and FE are in sync. Using "" for now because its falsey like old
   * `undefined` value */

  SpecialStatus["SAVED"] = "";
})(SpecialStatus = exports.SpecialStatus || (exports.SpecialStatus = {}));
},{}],"node_modules/farmbot/dist/index.js":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__exportStar(require("./corpus"), exports);

__exportStar(require("./farmbot"), exports);

__exportStar(require("./interfaces"), exports);

__exportStar(require("./util"), exports);

__exportStar(require("./resources/tagged_resource"), exports);
},{"./corpus":"node_modules/farmbot/dist/corpus.js","./farmbot":"node_modules/farmbot/dist/farmbot.js","./interfaces":"node_modules/farmbot/dist/interfaces.js","./util":"node_modules/farmbot/dist/util.js","./resources/tagged_resource":"node_modules/farmbot/dist/resources/tagged_resource.js"}],"plantingExecution.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plantingSeeds = plantingSeeds;

var _xstate = require("xstate");

var _farmbot = require("farmbot");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fb = new _farmbot.Farmbot({
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoxMzc4NSwiaWF0IjoxNjQ2MjQxMjc1LCJqdGkiOiI2NTU0OTJkNy0wNDhmLTQzOWMtOWQzYi1jMDIzOGU3YjEzNWUiLCJpc3MiOiIvL215LmZhcm0uYm90OjQ0MyIsImV4cCI6MTY1MTQyNTI3NSwibXF0dCI6ImNsZXZlci1vY3RvcHVzLnJtcS5jbG91ZGFtcXAuY29tIiwiYm90IjoiZGV2aWNlXzEzODA5Iiwidmhvc3QiOiJ4aWNvbmZ1bSIsIm1xdHRfd3MiOiJ3c3M6Ly9jbGV2ZXItb2N0b3B1cy5ybXEuY2xvdWRhbXFwLmNvbTo0NDMvd3MvbXF0dCJ9.mBmqYXMAZJe3ah0AJpl3O7w1NWUsWl9QCfdSMHwt31AHJutJwva3a8OLIlJcyd87xhDhS98b40venizb5YR3W5uwNyo05HfnwW8F0FOrRCmI9_97o-c0ERW196SDMNoWEpGoziUIxbsYPBfuLbqtaSm8Rc7cnOx_R38RXa6RTXTQl2rrtYN8179xCswYPKR0kUeNxxFTLm5EVZrIFMxeWe0DXmy-ts1-2tmchNhkFVD1WqsMcXC2_hYuRKq7dNhzy1no93RRB3aHUhb4A8zUTjO3Bqzm959u_J-RrdHDq65399tr_3QMfcQzxY11zayJRBpnWAiIeomcXPfWaKFElA"
}); //Moving the farmBot

/*function moveBot(dir){
    console.log("Moving by " + dir);
    return fb.moveRelative({x: dir, y: 0, z: 0, speed: 100});
}*/

function moveToBase(x, y) {
  console.log("Moving to (" + x + "," + y + ")");
  return fb.moveAbsolute({
    x: x,
    y: y,
    z: 0,
    speed: 100
  }); //return new Promise(resolve => setTimeout(resolve, 2000));
}

function moveToPosition(x, y) {
  console.log("Moving to (" + x + "," + y + ")");
  return fb.moveAbsolute({
    x: x,
    y: y,
    z: 0,
    speed: 100
  }); //return new Promise(resolve => setTimeout(resolve, 2000));
}

function pickUpSeed() {
  return _pickUpSeed.apply(this, arguments);
}

function _pickUpSeed() {
  _pickUpSeed = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Picking up a seed");
            _context.next = 3;
            return fb.moveRelative({
              x: 0,
              y: 0,
              z: -50,
              speed: 100
            });

          case 3:
            _context.next = 5;
            return fb.writePin({
              pin_mode: 0,
              pin_number: 9,
              pin_value: 1
            });

          case 5:
            return _context.abrupt("return", fb.moveRelative({
              x: 0,
              y: 0,
              z: 50,
              speed: 100
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _pickUpSeed.apply(this, arguments);
}

function _plantSeed2(_x) {
  return _plantSeed.apply(this, arguments);
} //toggling on light

/*function toggleLight() {
    console.log("Switching Lights");
    return fb.togglePin({ pin_number: 7 });
}*/


function _plantSeed() {
  _plantSeed = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(depth) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("Planting seed at depth " + depth);
            _context2.next = 3;
            return fb.moveRelative({
              x: 0,
              y: 0,
              z: -(100 + depth),
              speed: 100
            });

          case 3:
            _context2.next = 5;
            return fb.writePin({
              pin_mode: 0,
              pin_number: 9,
              pin_value: 0
            });

          case 5:
            return _context2.abrupt("return", fb.moveRelative({
              x: 0,
              y: 0,
              z: 100 + depth,
              speed: 100
            }));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _plantSeed.apply(this, arguments);
}

function convertToDistance(density) {
  return Math.ceil(1000 / Math.floor(Math.sqrt(density)));
}

function createGrid(x1, x2, y1, y2, minDistance) {
  var startX = Math.min(x1, x2);
  var startY = Math.min(y1, y2);
  var grid = [];
  var x = startY + Math.floor(minDistance / 2);

  while (x + Math.ceil(minDistance / 2) <= Math.max(x1, x2)) {
    var y = startX + Math.floor(minDistance / 2);

    while (y + Math.ceil(minDistance / 2) <= Math.max(y1, y2)) {
      grid.push({
        xVal: x,
        yVal: y
      });
      y = y + minDistance;
    }

    x = x + minDistance;
  }

  return grid;
}

function plantingSeeds(_x2, _x3, _x4, _x5, _x6, _x7) {
  return _plantingSeeds.apply(this, arguments);
}
/*
let testGrid=createGrid(0,1000,0,1000, 200);
console.log("Das erstellte Grid:")
console.log(testGrid);
console.log("Die Anzahl Pflanzen beträgt: " + testGrid.length);
 */
//plantingSeeds(0, 500, 0, 500, 200, 50);
//await fb.connect();
//moveToBase(100,100);


function _plantingSeeds() {
  _plantingSeeds = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(x1, x2, y1, y2, minDistance, depth) {
    var grid, counter, plantMachine, farmMachine;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            grid = createGrid(x1, x2, y1, y2, minDistance);
            counter = 0;
            plantMachine = (0, _xstate.createMachine)({
              id: 'planting',
              initial: 'start',
              states: {
                start: {
                  entry: ['moveHome'],
                  on: {
                    TRIGGER: {
                      target: 'grabSeed'
                    }
                  }
                },
                grabSeed: {
                  // entry actions
                  entry: ['pickSeed'],
                  on: {
                    TRIGGER: {
                      target: 'moveToPos'
                    }
                  }
                },
                moveToPos: {
                  entry: ['movePos'],
                  on: {
                    TRIGGER: {
                      target: 'plantSeed'
                    }
                  }
                },
                plantSeed: {
                  entry: ['plantSeed'],
                  on: {
                    TRIGGER: {
                      target: 'moveBack'
                    },
                    COMPLETE: {
                      target: 'done'
                    }
                  }
                },
                moveBack: {
                  entry: ['moveToSeed'],
                  on: {
                    TRIGGER: {
                      target: 'grabSeed'
                    }
                  }
                },
                done: {
                  entry: ['closeMachine']
                }
              }
            }, {
              actions: {
                // action implementations
                moveHome: function moveHome() {
                  moveToBase(grid[0].xVal, 0).then(function () {
                    return farmMachine.send("TRIGGER");
                  });
                },
                movePos: function movePos() {
                  moveToPosition(grid[counter].xVal, grid[counter].yVal).then(function () {
                    return farmMachine.send("TRIGGER");
                  });
                },
                moveToSeed: function moveToSeed() {
                  moveToPosition(grid[counter].xVal, 0).then(function () {
                    return farmMachine.send("TRIGGER");
                  });
                },
                pickSeed: function pickSeed() {
                  pickUpSeed().then(function () {
                    return farmMachine.send("TRIGGER");
                  });
                },
                plantSeed: function plantSeed() {
                  counter = counter + 1;

                  _plantSeed2(depth).then(function () {
                    if (counter === grid.length) {
                      farmMachine.send("COMPLETE");
                    } else {
                      farmMachine.send("TRIGGER");
                    }
                  });
                },
                closeMachine: function closeMachine() {
                  fb.client.end();
                  farmMachine.stop();
                }
              }
            });
            _context3.next = 5;
            return fb.connect();

          case 5:
            farmMachine = (0, _xstate.interpret)(plantMachine).start();

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _plantingSeeds.apply(this, arguments);
}
},{"xstate":"node_modules/xstate/es/index.js","farmbot":"node_modules/farmbot/dist/index.js"}],"app.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _plantingExecution = require("./plantingExecution.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var btnExecute = document.querySelector(".button");
var btnRUN = document.getElementById("button");
var endpoint = "http://localhost:3001/seedingjob"; // making the table of existing seedingjobs

function draw(t) {
  var table = document.getElementById('myTable');

  for (var i = 0; i < t.length; i++) {
    var row = "<tr>\n                <td><input type=\"radio\" class=\"class_radio\" name=\"checker\"\"></input></td>\n                <td>".concat(t[i]._id, "</td>\n                <td>").concat(t[i].top_left, "</td>\n                <td>").concat(t[i].bottom_right, "</td>\n                <td>").concat(t[i].density, "</td>\n                <td>").concat(t[i].depth, "</td>\n                <td>").concat(t[i].createdAt, "</td>\n                </tr>");
    table.innerHTML += row;
  }
}

function updateTable() {
  $("#myTable tr").remove();
  $.ajax({
    type: "GET",
    url: endpoint,
    dataType: "json",
    async: true,
    success: function success() {
      loadTable();
    }
  });
}

function loadTable() {
  fetch(endpoint).then(function (response) {
    return response.json();
  }).then(function (myJson) {
    draw(myJson);
  });
}

function select_row() {
  var radios = document.getElementsByName("checker");

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked == true) {
      // const row = radios[i].parentNode.parentNode.textContent
      var selected_job_ID = radios[i].parentNode.parentNode.children[1].textContent;
      return selected_job_ID; //alert('selected_job_ID:' + selected_job_ID);
    }
  }
}

function fetchID() {
  return _fetchID.apply(this, arguments);
} // load records on load


function _fetchID() {
  _fetchID = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var id, response, data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = select_row();
            _context3.prev = 1;
            _context3.next = 4;
            return fetch(endpoint + "/" + id);

          case 4:
            response = _context3.sent;

            if (!response.ok) {
              _context3.next = 11;
              break;
            }

            _context3.next = 8;
            return response.json();

          case 8:
            data = _context3.sent;
            console.log(data);
            return _context3.abrupt("return", data);

          case 11:
            _context3.next = 15;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](1);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 13]]);
  }));
  return _fetchID.apply(this, arguments);
}

window.onload = function () {
  loadTable();
}; //Runs when we press the save button


var handleSubmit = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    var myData, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            event.preventDefault(); //getting data from the form and make data onject

            myData = {
              top_left: [parseInt(document.getElementById("tl-x").value), parseInt(document.getElementById("tl-y").value)],
              bottom_right: [parseInt(document.getElementById("br-x").value), parseInt(document.getElementById("br-y").value)],
              density: parseInt(document.getElementById("density").value),
              depth: parseInt(document.getElementById("depth").value)
            };
            _context.prev = 2;
            _context.next = 5;
            return fetch(endpoint, {
              method: "POST",
              body: JSON.stringify(myData),
              headers: {
                "Content-type": "application/json"
              }
            });

          case 5:
            response = _context.sent;

            if (response.ok) {
              console.log(response.body);
              updateTable();
            }

            _context.next = 11;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));

  return function handleSubmit(_x) {
    return _ref.apply(this, arguments);
  };
}(); ////////////////handleRUN to run seeding job


var handleRUN = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
    var _yield$fetchID, top_left, bottom_right, density, depth;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fetchID();

          case 2:
            _yield$fetchID = _context2.sent;
            top_left = _yield$fetchID.top_left;
            bottom_right = _yield$fetchID.bottom_right;
            density = _yield$fetchID.density;
            depth = _yield$fetchID.depth;
            (0, _plantingExecution.plantingSeeds)(top_left[0], bottom_right[0], top_left[1], bottom_right[1], density, depth); //EDIT THIS to call for SEEDING FUNCTION

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function handleRUN(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

btnExecute.addEventListener("click", handleSubmit);
btnRUN.addEventListener("click", handleRUN);
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","./plantingExecution.js":"plantingExecution.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58188" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map