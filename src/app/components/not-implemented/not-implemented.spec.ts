import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotImplemented } from './not-implemented';

describe('NotImplemented', () => {
  let component: NotImplemented;
  let fixture: ComponentFixture<NotImplemented>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotImplemented]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotImplemented);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
