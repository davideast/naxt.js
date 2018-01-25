import { INITIAL_CONFIG, renderModuleFactory, platformDynamicServer } from '@angular/platform-server';
import { ResourceLoader } from '@angular/compiler';
import { Compiler, CompilerFactory } from '@angular/core';
import * as fs from 'fs-extra';

export class FileLoader implements ResourceLoader {
  get(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(url, (err: NodeJS.ErrnoException, buffer: Buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(buffer.toString());
      });
    });
  }
}

const compilerFactory: CompilerFactory = platformDynamicServer().injector.get(CompilerFactory);
const compiler: Compiler = compilerFactory.createCompiler([
  {
    providers: [
      { provide: ResourceLoader, useClass: FileLoader, deps: [] }
    ]
  }
]);

export default compiler;
