import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedeptComponent } from './createdept.component';

describe('CreatedeptComponent', () => {
  let component: CreatedeptComponent;
  let fixture: ComponentFixture<CreatedeptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedeptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
