import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { createBootstrapComponent } from './bootstrap.component';
import { createAppRoutes } from './routes';

export const createAppModule = (routes: any[], components: any[]) => {
  const BootstrapComponent = createBootstrapComponent();
  const pageComponents = routes.map(({ component }) => component);
  const declarations = [...components, ...pageComponents, BootstrapComponent];
  const exports = declarations;
  const bootstrap = [BootstrapComponent];
  const AppRoutes = createAppRoutes(routes);
  @NgModule({
    imports: [
      BrowserModule.withServerTransition({ appId: 'naxt-app' }),
      ServerModule,
      AppRoutes
    ],
    declarations,
    exports,
    bootstrap
  })
  class AppModule { }
  return AppModule as any; // lame TypeScript hack
};
