![Node.js CI](https://github.com/19shubham11/snowy-winter/workflows/Node.js%20CI/badge.svg?branch=main)

# Unnamed-URL-Shortener

This is a simple url-shortener inspired by [Cutt.ly](https://cutt.ly/). It returns a unique shortened url for every input which redirects to the original url.

## Internal Details

### Technologies used

This project is written in typescript and uses express as a web framework. I am using Redis as a database here to store the key/value pair of the input urls and the corresponding redirect-code. Tests are powered by jest.
Other dependencies can be found in [package.json](./package.json)

### Project structure

The structure of the project is pretty much straight forward and intuitive. All of the application code is under `src/`. The `src/` folder is further broken down into `server`, `helpers` and `store`.

- **server/** houses all of the code relevant to the web server, including [routes](/src/server/routes.ts), [handlers](/src/server/handlers.ts) and [controllers](/src/server/controllers.ts). The reason for this abstraction was to make the code more intuitive and separation of concerns. In this design, the `routes` are only responsible for routing the requests to appropriate handlers. The `handlers` are responsible for handling the response and there is no application logic here except for input/output validations. The main application logic sits inside the `controllers`.

- **helpers/** contain all application specific helpers. In this case [createUniqueHash](/src/helpers/hash.ts)

- **store/** contains setup and implementation details for external database. It is further divided into [datastore](/src/store/datastore.ts), [redis](/src/store/redis.ts) and [setup](/src/store/setup.ts). Datastore acts as the API for the rest of the application, so that the database details are abstracted, the main db logic is in `redis.ts`, and the setup details are in `setup.ts`. Another advantage of this design is that if another database has to be used in the future, that can be done without affecting the application code, the function signature for `datastore.ts` would remain the same in that scenario, only the underlying db implementation would change.

The test are broken down similarly and can be found under `tests/`. 

### Unique hashes

The [createUniqueHash](/src/helpers/hash.ts) function is responsible for creating a unique hash, that is used as a key for every incoming request and then saved in redis. The underlying implementation relies on Node's [crypto.randomBytes](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback) to generate random bytes of data that is returned as a `hex` string of length 8.

### API

The current implementation has the following 3 endpoints 
- `POST /shorten`
- `GET /:id`
- `GET /:id/stats`

More details can be found in the [Swagger](./swagger.yaml)


## Running locally

This was developed on Node v14.15.1, but other LTS versions should also work fine.

In order to run this locally, make sure you have redis installed and running locally, also ensure that the redis user requires a password (the default user 'default' has no auth). Alternatively, a docker image for redis can be used, this is how I am using running the test in the CI. To get a redis instance for docker running with password - 
```
docker run -d -p 6379:6379 redis redis-server --requirepass 'yourPassword' --port 6379
```

The following 4 environment variables are required for redis - `REDIS_PORT`, `REDIS_HOST`, `REDS_USER` and `REDIS_PASS`. If either of these are not set, the default values from the [config](/src/config.ts) are applied.

Once redis is setup with auth, the server can be started with `npm run start`. This basically compiles the project into `/dest` and runs the compiled js code.

For running tests, simply `npm run tests`. Make sure redis is up and running, otherwise tests may misbehave. Tests are run on a different redis database (database#2) and the db is cleaned up after the tests.

## Further improvements

- Use better logging. Right now I am using `console.log` and `console.error`, for more control over logs a custom logger with multiple log levels should be used.
- Add access logs for every endpoint.
- Add a retention policy for redis keys, right now the keys do not expire. Ideally this could use the [Expire](https://redis.io/commands/expire) command from redis.
- Add more tests. Currently my tests only test a behaviour for a user. Need more tests for the scenario when redis returns an error and the user gets a 500 - Internal Server Error.
- Host this somewhere so that we can also leverage a base url for every redirect.
