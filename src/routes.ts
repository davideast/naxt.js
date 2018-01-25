import * as fs from 'fs-extra';
import * as path from 'path';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { renderModuleFactory } from "@angular/platform-server";
import createDocument from './document';

/**
 * Using the provided source directory get an array
 * of routes. Routes are created from the "pages" directory.
 * @param srcDir
 */
export const getRoutes = async (srcDir: string) => {
  if(srcDir === undefined || srcDir === null) {
    throw new Error('No source directory provided');
  }
  const pagesDir = path.resolve(srcDir, 'pages');
  const pages = await fs.readdir(pagesDir);
  const routes = pages.map(file => {
    // split on a period and select the
    // first array element as the route name
    // Ex: index.ts -> index
    //     about.page.ts -> about
    const pieces = file.split('.');
    const name = pieces[0];
    const component = getPageComponent({ srcDir, file });
    return { name, file, component };
  });
  return routes;
};

const getPageComponent = ({ srcDir, file }) => {
  const pagePath = path.resolve(srcDir, 'pages', file);
  const comp = require(pagePath);
  return comp.default;
}

export const getComponents = async (srcDir: string) => {
  const componentDir = path.resolve(srcDir, 'components');
  const componentFiles = await fs.readdir(componentDir);
  const components = componentFiles.map(file => {
    const compPath = path.resolve(componentDir, file);
    const comp = require(compPath);
    return comp.default;
  });
  return components;
};

export const createAppRoutes = (routes: any[]) => {
  const ngRoutes: any = routes
    .map(({ name, component }) => {
      // handle 'index' to '/'
      const routeName = name === 'index' ? '' : name;
      // TODO(davideast): Think of somthing clever for route params
      // and lazy routing
      const route = { path: routeName, component };
      console.log(route);
      return route;
    });
    return RouterModule.forRoot(ngRoutes);
};

export const renderPage = async (name: any, ngModuleFactory: any, extraProviders = []) => {
  const document = createDocument();
  const url = name === 'index' ? '/' : name;
  const html = await renderModuleFactory(ngModuleFactory, { 
    document, url, extraProviders
  });
  return { url, html};
};
