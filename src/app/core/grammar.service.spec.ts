import { TestBed } from '@angular/core/testing';

import { GrammarService } from './grammar.service';
import { Firestore } from '@angular/fire/firestore';

xdescribe('GrammarService', () => {
  let service: GrammarService;
  let fireStoreStub: Partial<Firestore> = {

  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: fireStoreStub}
      ]
    });
    service = TestBed.inject(GrammarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
