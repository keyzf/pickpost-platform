'use strict';

module.exports = app => {
  const { router, controller } = app;

  // github oauth
  app.passport.mount('github');
  // 上面的 mount 是语法糖，等价于
  // const github = app.passport.authenticate('github', {});
  // router.get('/passport/github', github);
  // router.get('/passport/github/callback', github);

  // RESTful APIs
  router.get('/api/spaces', controller.space.index);
  router.post('/api/spaces', controller.space.create);
  router.put('/api/spaces/:id', controller.space.update);
  router.delete('/api/spaces/:id', controller.space.destroy);

  router.get('/api/projects', controller.project.projectsIndex);
  router.get('/api/projects/:id', controller.project.projectsShow);
  router.post('/api/projects', controller.project.projectsNew);
  router.delete('/api/projects/:id', controller.project.projectsDestroy);
  router.put('/api/projects/:id', controller.project.projectsUpdate);
  router.get('/api/projectList', controller.project.projectList);

  router.get('/api/collections', controller.collection.collectionsIndex);
  router.get('/api/collections/:id', controller.collection.collectionsShow);
  router.post('/api/collections', controller.collection.collectionsNew);
  router.delete('/api/collections/:id', controller.collection.collectionsDestroy);
  router.put('/api/collections/:id', controller.collection.collectionsUpdate);

  router.get('/api/collection-apis', controller.collectionApi.getCollectionApis);
  router.post('/api/collection-apis', controller.collectionApi.create);
  router.delete('/api/collection-apis/:id', controller.collectionApi.destroy);
  router.put('/api/collection-apis/:id', controller.collectionApi.update);

  router.get('/api/apis', controller.api.apisIndex);
  router.post('/api/apis', controller.api.apisNew);
  router.delete('/api/apis/:id', controller.api.apisDestroy);
  router.get('/api/apis/:id', controller.api.apisShow);
  router.put('/api/apis/:id', controller.api.apisUpdate);
  router.post('/api/apisUnlink', controller.api.apisUnlink);

  router.get('/api/search', controller.api.searchByKeyWord);
  router.get('/api/getuser', controller.api.getUser);
  router.get('/api/globalsearch', controller.api.globalSearch);

  router.post('/api/login', controller.auth.login);
  router.post('/api/register', controller.auth.register);
  router.post('/api/send_verify_code', controller.auth.sendVerfifyCode);
  router.post('/api/search_pass', 'auth.searchPass');
  router.post('/api/reset_password', 'auth.resetPassword');
  router.post('/api/send_reset_password_code', 'auth.sendResetPasswordCode');

  // MockAPI
  const jsonp = app.jsonp();
  router.all('/mock/:apiType/:projectName/**', jsonp, controller.mock.mockapi);
  router.all('/openapi/sync/spi', controller.sync.spiSync);
  router.post('/openapi/sync/upload', controller.sync.uploadSwagger);

  // ProxyAPI
  router.all('/auth', controller.proxy.auth);
  router.all('/proxy/:apiType', controller.proxy.proxy);

  // SocketIO
  // router.io.of('/socket2').route('ping2', router.io.controller.socket.index);

  // 跨域支持
  router.all('/proxy.html', controller.page.proxy);

  // 页面路由
  router.get('/', controller.page.home);
  router.get('/login', controller.page.login);
  router.get('/logout', controller.auth.logout);
  router.get('/register', controller.page.register);
  router.get('/reset-password', controller.page.resetPassword);
  router.get('*', controller.page.app);
};
