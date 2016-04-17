'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const Laughter = require('..');

describe('asynchronous request handler (smile)', { timeout: 1000 }, () => {

    it('should call reply with synchronous result', (done) => {

        const handler = Laughter(() => 'value');

        const reply = function (param){

            expect(param).to.equal('value');
            done();
        };

        handler(null, reply);
    });

    it('should call reply with synchronous error', (done) => {

        const handler = Laughter(() => {

            throw new Error('message');
        });

        const reply = function (err) {

            expect(err.message).to.equal('message');
            done();
        };

        handler(null, reply);
    });

    it('should call reply with asynchronous result if it is promise', (done) => {

        const handler = Laughter(() => Promise.resolve('value'));

        const reply = function (param){

            expect(param).to.equal('value');
            done();
        };

        handler(null, reply);
    });

    it('should call reply with asynchronous error if it is promise', (done) => {

        const handler = Laughter(() => Promise.reject(new Error('message')));

        const reply = function (err){

            expect(err.message).to.equal('message');
            done();
        };

        handler(null, reply);
    });

    it('should reply with error if handler does not return result', (done) => {

        const handler = Laughter(() => {

            return;
        });

        const reply = function (err){

            expect(err.message).to.equal('An endpoint did not return a result: POST /api/users');
            done();
        };

        handler({
            method: 'POST',
            path: '/api/users'
        }, reply);
    });

    it('should reply with error if handler returns null result', (done) => {

        const handler = Laughter(() => {

            return null;
        });

        const reply = function (err){

            expect(err.message).to.equal('An endpoint did not return a result: POST /api/users');
            done();
        };

        handler({
            method: 'POST',
            path: '/api/users'
        }, reply);
    });

    it('should use code and reply object if code and object are provided', (done) => {

        const handler = Laughter(() => {

            return {
                object: 'value',
                code: 202
            };
        });

        const reply = function (param){

            expect(param).to.equal('value');

            return {
                code: (code) => {

                    expect(code).to.equal(202);
                    done();
                    return {
                        headers: {}
                    };
                }
            };
        };

        handler(null, reply);
    });

    it('should use headers object if code, object and headers are provided', (done) => {

        const handler = Laughter(() => {

            return {
                object: 'value',
                code: 202,
                headers: {
                    'h1': 'h1val',
                    'h2': 'h2val'
                }
            };
        });

        const reply = function (param){

            expect(param).to.equal('value');

            return {
                code: function (code){

                    expect(code).to.equal(202);
                    return {
                        get headers(){

                            return {};
                        },
                        set headers(h) {

                            expect(h.h1).to.equal('h1val');
                            expect(h.h2).to.equal('h2val');
                            done();
                        }
                    };
                }
            };
        };

        handler(null, reply);
    });
});
