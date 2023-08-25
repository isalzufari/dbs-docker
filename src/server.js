const Hapi = require('@hapi/hapi');

const CompanyService = require('./services/postgres/companyService');
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const companyService = new CompanyService();
  const cacheService = new CacheService();

  const server = Hapi.server({
    port: '8081',
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => {
        return ({
          status: 'success'
        });
      }
    },
    {
      method: 'GET',
      path: '/company',
      handler: async (request, h) => {
        const songs = await companyService.getCompany();

        const response = h.response({
          status: 'success',
          data: songs,
        });
        response.code(201);
        return response;
      }
    },
    {
      method: 'DELETE',
      path: '/company',
      handler: () => {
        cacheService.delete('company');
        return ({
          status: 'success'
        });
      }
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();