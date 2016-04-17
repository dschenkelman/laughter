'use strict';

const Boom = require('boom');
const Xtend = require('xtend');

module.exports = function (handler){

    return function (request, reply){

        let resultingPromise;
        try {
            resultingPromise = Promise.resolve(handler(request));
        }
        catch (err) {
            resultingPromise = Promise.reject(err);
        }

        resultingPromise.then((result) => {

            if (result === null || typeof result === 'undefined'){
                return reply(Boom.internal(`An endpoint did not return a result: ${request && request.method} ${request && request.path}`));
            }

            if (result.code && result.object){
                const response = reply(result.object).code(result.code);
                response.headers = Xtend(response.headers, result.headers || {});
                return;
            }

            reply(result);
        },(err) => {

            reply(err);
        });
    };
};
