import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OriginService {

  origin: DOMRect;

  constructor() { }

  setNone() {
    this.origin = null;
  }
}
