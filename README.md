# class-event
Objects of this class can trigger events and other objects can bind to those events.

##### Sources of inspiration :beer:

* Original idea and implementation of the **Simple JavaScript Inheritance** by [John Resig](http://ejohn.org/)
* Original idea and implementation of `Q.Evented` Class by [Pascal Rettig](https://github.com/cykod)

I just extracted the class code and made it standalone.


# Using class-event

The `ClassEvent` class adds an event system into the base class. 
It provides a mechanism for listening for and triggering events. 

`ClassEvent` provides two methods, `on` and `off` to add and remove listeners respectively.

The syntax is:

```javascript
srcObj.on("eventName",[ targetObj, ] [ callback ]);
srcObj.off("eventName",[ targetObj, ] [ callback ]);
```

The only required parameter to each method is the event name, in the form of a string. 
If no other parameters are provided, then the method will assume the target object is the same as the source object and the callback is the same as the event name. 
If you provide a string for a `callback` instead of a function, the system will look up a property of that name on the `targetObj`.

For the `off` method, the more parameters you provide the more specific the event unbound will be. 
If you only provide an event name, all events on that source object with that name will be removed. 
If you provide all three parameters, only 1 specific event will be unbound.

`ClassEvent` also provides a `debind` method that will remove all the events an object is listening to.
 
To trigger events, you call the `trigger` method with the name of the event you are triggering and up to 3 arguments. 
It's important to be consistent with what arguments you pass to events as these provide much of the external API to your objects.

Some more examples of how `on`, `off`, `unbind` and `trigger` can be called are shown below:

```javascript
/* on / off / trigger */

ClassEvent.extend("Eventum", {
    init: function () {
        this.on("event1");

        this.on("event2");

        this.on("event3", function () {
            console.log("event3 callback")
        });

        this.on("event4", function (param) {
            console.log("event4 callback with " + param)
        });
    },
    event1: function () {
        console.log("event1 callback")
    },
    event2: function (param) {
        console.log("event2 callback with " + param)
    }
});

var eventum = new Eventum;

eventum.trigger("event1");          // > event1 callback
eventum.trigger("event2", "param"); // > event2 callback with param
eventum.trigger("event3");          // > event3 callback
eventum.trigger("event4", "param"); // > event4 callback with param

eventum.off("event4");              // > event4 callback with param
eventum.trigger("event4", "param"); // nothing will happen

/* debind */

ClassEvent.extend("Eventum2", {
    event1: function () {
        console.log(this.className + " event1 callback")
    }
});

var eventum2 = new Eventum2;

eventum.on("event5", eventum2, "event1");
eventum.trigger("event5"); // > Eventum2 event1 callback
eventum2.debind();
eventum.trigger("event5"); // nothing will happen
```

## Methods

### extend

`extend (className, properties, [classMethods])`

*Inherited from [Class](https://github.com/pointofpresence/js-inherit)*

Create a new Class that inherits from this class

##### Parameters:

* `className` String
* `properties` Object - *hash of properties (`init()` will be the constructor)*
* `[classMethods]` Object, optional - *optional class methods to add to the class*

### isA

`isA (className)`

*Inherited from [Class](https://github.com/pointofpresence/js-inherit)*

See if a object is a specific class

##### Parameters:
* `className` String - *class to check against*

### debind

`debind ()`

`debind` is called to remove any listeners an object had on other objects. 
The most common case is when an object is destroyed you'll want all the event listeners to be removed for you.

### off

`off ( event  [target]  [callback] )`

Unbinds an event. 
Can be called with 1, 2, or 3 parameters, each of which unbinds a more specific listener.

##### Parameters:

* `event` String - *name of event*
* `[target]` Object, optional - *optionally limit to a specific target*
* `[callback]` Function, optional - *optionally limit to one specific callback*

### on

`on ( event  [target]  [callback] )`

Binds a callback to an event on this object. 
If you provide a target object, that object will add this event to it's list of binds, allowing it to automatically remove it when it is destroyed.

##### Parameters:

* `event` String - *name or comma separated list of events*
* `[target]` Object, optional - *optional context for callback, defaults to the `ClassEvent`*
* `[callback]` Function, optional - *callback (optional - defaults to name of event on context*

### trigger

`trigger ( event  [data] )`

Triggers an event, passing in some optional additional data about the event.

##### Parameters:

* `event` String - *name of event*
* `[data]` Object, optional - *optional data to pass to the callback*


# Requirements

* [Underscore.js](http://underscorejs.org/)
* [js-inherit](https://github.com/pointofpresence/js-inherit)
* [rs-mixins](https://github.com/pointofpresence/rs-mixins)


# Changelog

### v0.1 

* Initial Release