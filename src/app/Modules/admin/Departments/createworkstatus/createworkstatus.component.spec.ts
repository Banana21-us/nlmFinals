import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateworkstatusComponent } from './createworkstatus.component';

describe('CreateworkstatusComponent', () => {
  let component: CreateworkstatusComponent;
  let fixture: ComponentFixture<CreateworkstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateworkstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateworkstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
