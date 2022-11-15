import { ComponentFixture, TestBed } from '@angular/core/testing';

import { W8benComponentComponent } from './w8ben-component.component';

describe('W8benComponentComponent', () => {
  let component: W8benComponentComponent;
  let fixture: ComponentFixture<W8benComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ W8benComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(W8benComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
