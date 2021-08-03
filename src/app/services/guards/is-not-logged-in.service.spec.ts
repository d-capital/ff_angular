import { TestBed } from '@angular/core/testing';

import { IsNotLoggedInService } from './is-not-logged-in.service';

describe('IsNotLoggedInService', () => {
  let service: IsNotLoggedInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsNotLoggedInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
