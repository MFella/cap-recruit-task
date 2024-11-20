import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCardComponent } from './game-card.component';
import { By } from '@angular/platform-browser';

describe('GameCardComponent', () => {
  let component: GameCardComponent;
  let fixture: ComponentFixture<GameCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display blurred overlay, when there is no data', () => {
    component.entity = undefined;
    const overlayClass = 'before-start-overlay-container';
    fixture.detectChanges();

    const overlayElement = fixture.debugElement.query(
      By.css(`.${overlayClass}`)
    );
    expect(overlayElement).toBeDefined();

    expect(overlayElement.classes?.['backdrop-blur']).toBe(true);
  });

  it('should display card, when data is defined', () => {
    const matCardClass = 'mat-mdc-card';
    const entityEntryContainerClass = 'entity-entry-container';
    component.entity = {
      height: 'height',
      mass: '60',
      hair_color: 'pink',
      skin_color: 'black',
      eye_color: 'white',
      birth_year: '1994',
      gender: 'female',
      homeworld: 'Dune',
      created: new Date().toString(),
      edited: new Date().toString(),
      name: 'John Doe',
      url: 'http://example.com',
      kind: 'people',
      battleResult: 1,
    };

    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css(`.${matCardClass}`));
    const cardEntityEntries = cardElement.queryAll(
      By.css(`.${entityEntryContainerClass}`)
    );
    expect(cardElement).toBeDefined();
    expect(cardEntityEntries.length).toEqual(
      Object.keys(component.entity).length
    );
  });
});
