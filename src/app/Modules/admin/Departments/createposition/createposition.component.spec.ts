import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepositionComponent } from './createposition.component';

describe('CreatepositionComponent', () => {
  let component: CreatepositionComponent;
  let fixture: ComponentFixture<CreatepositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatepositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatepositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
