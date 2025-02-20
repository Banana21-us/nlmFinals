import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedesignationComponent } from './createdesignation.component';

describe('CreatedesignationComponent', () => {
  let component: CreatedesignationComponent;
  let fixture: ComponentFixture<CreatedesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedesignationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
