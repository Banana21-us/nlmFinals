import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateworkstatusComponent } from './updateworkstatus.component';

describe('UpdateworkstatusComponent', () => {
  let component: UpdateworkstatusComponent;
  let fixture: ComponentFixture<UpdateworkstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateworkstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateworkstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
