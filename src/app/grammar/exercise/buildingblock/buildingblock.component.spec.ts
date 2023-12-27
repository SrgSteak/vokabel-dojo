import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingblockComponent } from './buildingblock.component';

describe('BuildingblockComponent', () => {
  let component: BuildingblockComponent;
  let fixture: ComponentFixture<BuildingblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BuildingblockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
