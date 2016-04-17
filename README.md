# laughter
Use return and throw when working with Promises in hapi.js route handlers

## Usage
```
const Laughter = require('laughter');

const route = {
    method: ...,
    path: ...,
    config: {
        handler: Laughter(request => {
            const response = { ... };
            return Promise.resolve(response);
        }),
        ...
    }
};
```

## Errors
```
const Laughter = require('laughter');
const boom = require('boom');

Laughter(request => {
    if (...){
        throw new Boom.badRequest('Something is wrong');
    }
    ...
});
```

## Status Codes
```
const Laughter = require('laughter');

Laughter(request => Promise.resolve({ code: 201, object: { ... }}));
```

## Headers
```
const Laughter = require('laughter');

Laughter(request => Promise.resolve({
   code: 303,
   object: { ... },
   headers: {
     'location': 'http://resource-location.io'
   }
 }));
```

## Contributing
Feel free to open issues with questions/bugs/features. PRs are also welcome.

## License
MIT