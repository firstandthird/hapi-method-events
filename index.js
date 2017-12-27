'use strict';
const str2fn = require('str2fn');

const register = function(server, options) {
  Object.keys(options.events).forEach(eventName => {
    server.events.on(eventName, (data) => {
      const methods = options.events[eventName];
      methods.forEach(methodName => {
        // todo: str2fn currently uses a callback instead of async/await:
        str2fn.execute(methodName, server.methods, data, (err, result) => {
          if (err) {
            return server.log(err);
          }
          server.log(['hapi-method-events', eventName, methodName], result);
        });
      });
    });
  });
};

exports.plugin = {
  name: 'hapi-method-events',
  register,
  once: true,
  pkg: require('./package.json')
};
