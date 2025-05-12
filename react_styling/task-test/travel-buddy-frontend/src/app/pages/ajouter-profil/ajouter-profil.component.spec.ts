import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterProfilComponent } from './ajouter-profil.component';

describe('AjouterProfilComponent', () => {
  let component: AjouterProfilComponent;
  let fixture: ComponentFixture<AjouterProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterProfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
