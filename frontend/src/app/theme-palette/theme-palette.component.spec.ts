import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemePaletteComponent } from './theme-palette.component';

describe('ThemePaletteComponent', () => {
  let component: ThemePaletteComponent;
  let fixture: ComponentFixture<ThemePaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemePaletteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemePaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
