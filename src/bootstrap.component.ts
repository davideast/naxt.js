import { Component } from '@angular/core';

export const createBootstrapComponent = () => {
  @Component({ 
    selector: 'ngs-bootstrap-component',
    template: `<router-outlet></router-outlet>`
  }) class BootstrapComponent { }
  return BootstrapComponent as any;
};
