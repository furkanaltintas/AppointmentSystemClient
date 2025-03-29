import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `<h2>Yetkisiz Erişim</h2><p>Bu sayfaya erişim yetkiniz yok.</p>`,
  styles: ['h2 { color: red; }']
})
export class UnauthorizedComponent {}
