/**
 The `ClassEvent` class adds event handling onto the base `Class`
 class. ClassEvent objects can trigger events and other objects can
 bind to those events.

 @class ClassEvent
 @extends Class
 */
Class.extend("ClassEvent", {
    /**
     Binds a callback to an event on this object. If you provide a
     `target` object, that object will add this event to it's list of
     binds, allowing it to automatically remove it when it is destroyed.

     @method on
     @for ClassEvent
     @param {String} event - name or comma separated list of events
     @param {Object} [target] - optional context for callback, defaults to the ClassEvent
     @param {Function} [callback] - callback (optional - defaults to name of event on context
     */
    on: function (event, target, callback) {
        if (_.isArray(event) || event.indexOf(",") !== -1) {
            event = _.normalizeArg(event);

            for (var i = 0; i < event.length; i++) {
                this.on(event[i], target, callback);
            }

            return;
        }

        // Handle the case where there is no target provided,
        // swapping the target and callback parameters.
        if (!callback) {
            callback = target;
            target = null;
        }

        // If there's still no callback, default to the event name
        if (!callback) {
            callback = event;
        }

        // Handle case for callback that is a string, this will
        // pull the callback from the target object or from this
        // object.
        if (_.isString(callback)) {
            callback = (target || this)[callback];
        }

        // To keep `ClassEvent` objects from needing a constructor,
        // the `listeners` object is created on the fly as needed.
        // `listeners` keeps a list of callbacks indexed by event name
        // for quick lookup.
        this.listeners = this.listeners || {};
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push([target || this, callback]);

        // With a provided target, the target object keeps track of
        // the events it is bound to, which allows for automatic
        // unbinding on destroy.
        if (target) {
            if (!target.binds) {
                target.binds = [];
            }

            target.binds.push([this, event, callback]);
        }
    },

    /**
     Triggers an event, passing in some optional additional data about
     the event.

     @method trigger
     @for ClassEvent
     @param {String} event - name of event
     @param {Object} [data] - optional data to pass to the callback
     */
    trigger: function (event, data) {
        // First make sure there are any listeners, then check for any listeners
        // on this specific event, if not, early out.
        if (this.listeners && this.listeners[event]) {
            // Call each listener in the context of either the target passed into
            // `on` or the object itself.
            for (var i = 0, len = this.listeners[event].length; i < len; i++) {
                var listener = this.listeners[event][i];
                listener[1].call(listener[0], data);
            }
        }
    },

    /**
     Unbinds an event. Can be called with 1, 2, or 3 parameters, each
     of which unbinds a more specific listener.

     @method off
     @for ClassEvent
     @param {String} event - name of event
     @param {Object} [target] - optionally limit to a specific target
     @param {Function} [callback] - optionally limit to one specific callback
     */
    off: function (event, target, callback) {
        // Without a target, remove all the listeners.
        if (!target) {
            if (this.listeners[event]) {
                delete this.listeners[event];
            }
        } else {
            // If the callback is a string, find a method of the
            // same name on the target.
            if (_.isString(callback) && target[callback]) {
                callback = target[callback];
            }

            var l = this.listeners && this.listeners[event];

            if (l) {
                // Loop from the end to the beginning, which allows us
                // to remove elements without having to affect the loop.
                for (var i = l.length - 1; i >= 0; i--) {
                    if (l[i][0] === target) {
                        if (!callback || callback === l[i][1]) {
                            this.listeners[event].splice(i, 1);
                        }
                    }
                }
            }
        }
    },

    /**
     `debind` is called to remove any listeners an object had
     on other objects. The most common case is when an object is
     destroyed you'll want all the event listeners to be removed
     for you.

     @method debind
     @for ClassEvent
     */
    debind: function () {
        if (this.binds) {
            for (var i = 0, len = this.binds.length; i < len; i++) {
                var boundEvent = this.binds[i],
                    source = boundEvent[0],
                    event = boundEvent[1];

                source.off(event, this);
            }
        }
    }
});