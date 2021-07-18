import { TestBed } from '@angular/core/testing';

import { CantRegisterService } from './cant-register.service';

describe('CantRegisterService', () => {
  let service: CantRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CantRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
