function eventEmitter () {
  // Keep this empty so it's easier to inherit from
}

eventEmitter.prototype = {
  // Creating a prototype will allow objects to inherit features from one another.
  // The methods and properties are not copied from one object to another in the prototype chain, but accessed by walking up the chain.
  on: function (name, callback, context) {
    // This function registers handler functions for named events that pass the appropriate arguments
    var event = this.event || (this.event = {});
    // the variable event equals one value or multiple (in an array)
    (event[name] || (event[name] = [])).push({
      // The push() method adds the event name to the end of an array
      fn: callback,
      context: context
    });

    return this;
    // The object instance on which the method is currently being called will be return. 
  },

  once: function (name, callback, context) {
    // This function registers a "one-time" handler that can be called at most once
    var self = this;
    // Reference to the object vs an event
    function listener () {
      self.off(name, listener);
      // The off() function removes the event handlers
      callback.apply(context, arguments);
      // The apply() method calls a function with a given this value, and arguments provided as an array
    };

    listener._ = callback
    // TODO
    return this.on(name, listener, context);
    // The on() method attaches event handlers to the currently selected set of elements
  },

  emit: function (name) {
    // This function emits named events with any number of arguments
    var data = [].slice.call(arguments, 1);
    // What slice() does in this case is create an empty array, then iterate through the object it's running on 
    // and keep appending the elements of that object to the empty array it created, which is eventually returned. 
    var eventArray = ((this.event || (this.event = {}))[name] || []).slice();
    var i = 0; // starts the counter at 0
    var counter = eventArray.length; // Finds the number of elements in an array

    for (i; i < counter; i++) {
    // The for loop repeats until i is greater than the original length of the eventArray 
      eventArray[i].fn.apply(eventArray[i].context, data);
      // TODO
    }

    return this;
  },

  off: function (name, callback) {
    // This function removes either some or all previously-registered event handlers
    var event = this.event || (this.event = {});
    var events = event[name];
    var liveEvents = [];

    if (events && callback) {
      for (var i = 0, counter = events.length; i < counter; i++) {
        if (events[i].fn !== callback && events[i].fn._ !== callback)
          liveEvents.push(events[i]);
      }
    }

    return this;
  }
};

module.exports = eventEmitter;
// Exporting the module will allow this to be used in other code