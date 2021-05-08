import { TestBed } from '@angular/core/testing';

import { portfoliosGuard } from './portfolios.guard';

describe('Portfolios Guards', () => {
    let tablesGuard: portfoliosGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [portfoliosGuard],
        });
        tablesGuard = TestBed.inject(portfoliosGuard);
    });

    describe('canActivate', () => {
        it('should return an Observable<boolean>', () => {
            tablesGuard.canActivate().subscribe(response => {
                expect(response).toEqual(true);
            });
        });
    });
});
