import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedesignationComponent } from './updatedesignation.component';

describe('UpdatedesignationComponent', () => {
  let component: UpdatedesignationComponent;
  let fixture: ComponentFixture<UpdatedesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedesignationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatedesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
