import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { getRoutes, getComponents, renderPage } from './routes';
import { createAppModule } from './app.module';
import compiler from './compiler';
import * as express from 'express';

/**
 *  / components
 *    hello.component.ts
 *  / pages 
 *    index.page.ts
 * 
 *  const app = naxt({ });
 *  app.listen(3000);
 * 
 *  What makes a route?
 *    - each "page" in "pages"
 *    - if it's named "index.ts" the route is /
 *    - if it's named "index.component.ts" the route is /
 *    - if it's named "about.ts" the route is /about
 *    - if it's named "about.component.ts" the route is /about
 *    - Route params will work if implemented in the page component
 *    - Custom routing should be available
 */

export const naxt = async (config: any) => {
  const { srcDir } = config;
  const routes = await getRoutes(srcDir);
  const components = await getComponents(srcDir);
  const AppModule = createAppModule(routes, components);
  const { ngModuleFactory } = compiler.compileModuleAndAllComponentsSync(AppModule);
  const app = express();
  app.get('/favicon.ico', (req, res) => res.status(204).end());
  app.get('**', async (req, res) => {
    const path = req.path;
    console.log('path: ', path);
    const result = await renderPage(path, ngModuleFactory);
    res.send(result.html);
  });
  app.listen(3000, () => console.log('Naxt is running...'));
};


