import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const server = fastify({
  logger: true,
});

server.register(fastifyCors);
server.register(fastifySwagger, {
  refResolver: {
    buildLocalReference(json, baseUri, fragment, i) {
      if (!json.title && json.$id) {
        json.title = json.$id;
      }
      if (!json.$id) {
        return `def-${i}`;
      }

      return `${json.$id}`;
    },
  },
  swagger: {
    info: {
      title: 'Users API',
      description: '',
      version: '0.1.0',
    },
  },
  openapi: {},
});
server.register(fastifySwaggerUi);

let users = [
  {
    id: crypto.randomUUID(),
    name: 'Bohdan',
    age: 27,
  },
];

server.register(
  (instance, opts, done) => {
    instance.get(
      '/users',
      {
        schema: {
          operationId: 'getUsers',
          tags: ['Users'],
          description: 'Get all users',
          summary: 'Get all users',
          response: {
            200: {
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                  age: {
                    type: 'number',
                  },
                },
                required: ['id', 'name', 'age'],
              },
            },
          },
        },
      },
      (request, reply) => {
        reply.send(users);
      },
    );

    instance.post(
      '/users',
      {
        schema: {
          tags: ['Users'],
          operationId: 'createUser',
          description: 'Create user',
          summary: 'Create user',
          body: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 4,
                maxLength: 30,
              },
              age: {
                type: 'number',
                minimum: 1,
                maximum: 120,
              },
            },
            required: ['name', 'age'],
          },
          response: {
            201: {
              type: 'string',
              default: 'User successful created',
            },
          },
        },
      },
      (request, reply) => {
        const { name, age } = request.body;

        const user = {
          id: crypto.randomUUID(),
          name,
          age,
        };

        users.push(user);

        reply.status(201).send('User successful created');
      },
    );

    instance.delete(
      '/users/:id',
      {
        schema: {
          tags: ['Users'],
          operationId: 'deleteUser',
          description: 'Delete user',
          summary: 'Delete user',
          params: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
            },
            required: ['id'],
          },
          response: {
            200: {
              type: 'string',
              default: 'Successful removed',
            },
            400: {
              type: 'string',
              default: 'Not existed user',
            },
          },
        },
      },
      (request, reply) => {
        const currentUser = users.find((user) => user.id === request.params.id);

        if (!currentUser) {
          return reply.status(400).send('Not existed user');
        }

        users = users.filter((user) => user.id !== request.params.id);

        return reply.send('Successful removed');
      },
    );

    done();
  },
  {
    prefix: '/v1/api',
  },
);

server.listen({
  port: 4400,
});
