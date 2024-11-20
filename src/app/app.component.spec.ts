import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { of, throwError } from 'rxjs';
import { PersonDTO, StarshipDTO } from './types/entity.types';
import { MockEntityGenerator } from '../test/test-helpers';
import { By, provideClientHydration } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { PlayerState } from './infrastructure/states/player.state';

describe('AppComponent', () => {
  let componentInstance: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let personDTO: PersonDTO;
  let starshipDTO: StarshipDTO;
  const gameCardSelector = 'app-game-card';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideClientHydration(),
        provideNoopAnimations(),
        provideHttpClient(),
        provideStore([PlayerState]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    componentInstance = fixture.componentInstance;
    fixture.detectChanges();

    personDTO = MockEntityGenerator.generateMockEntity('people');
    starshipDTO = MockEntityGenerator.generateMockEntity('starships');
  });

  it('should create the app', () => {
    expect(componentInstance).toBeTruthy();
  });

  it('should fetch random entities twice and display them, when rollUntilSuccess is turned on and first randomized entity fetch failed', async () => {
    personDTO.battleResult = 1;
    starshipDTO.battleResult = -1;

    componentInstance.rollUntilSuccess = true;
    const selectRandomEntitiesSpy = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(componentInstance as any, 'selectRandomEntities')
      .mockImplementationOnce(() => {
        return throwError(() => new HttpErrorResponse({ status: 404 }));
      })
      .mockReturnValueOnce(of([personDTO, starshipDTO]));

    await componentInstance.playGame();
    fixture.detectChanges();

    const gameCardComponents = fixture.debugElement.queryAll(
      By.css(gameCardSelector)
    );

    expect(selectRandomEntitiesSpy).toHaveBeenCalledTimes(2);
    expect(gameCardComponents.length).toEqual(2);
    gameCardComponents.forEach(component =>
      expect(component.nativeElement).toBeTruthy()
    );
    expect(gameCardComponents[0].classes['overall-winner']).toEqual(true);
    expect(gameCardComponents[0].classes['won']).toEqual(true);
    expect(gameCardComponents[1].classes['lost']).toEqual(true);
  });

  it('should display error snackbar, when randomized entity fetch failed', async () => {
    const snackBarLabelClass = 'mat-mdc-snack-bar-label.mdc-snackbar__label';
    const expectedNotFoundErrorMessage =
      'Random entity cannot be found. Origin error message: Http failure response for (unknown url): 404 undefined';

    const expectedDefaultErrorMessage = 'Cannot be found';
    jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(componentInstance as any, 'selectRandomEntities')
      .mockImplementationOnce(() => {
        return throwError(() => new HttpErrorResponse({ status: 404 }));
      })
      .mockImplementationOnce(() => {
        return throwError(() => new Error(expectedDefaultErrorMessage));
      });

    componentInstance.rollUntilSuccess = false;

    await componentInstance.playGame();

    fixture.detectChanges();

    let snackBarLabelElement: HTMLElement = document.querySelector(
      `.${snackBarLabelClass}`
    ) as unknown as HTMLElement;
    expect(snackBarLabelElement).toBeDefined();
    expect(snackBarLabelElement.innerHTML.trim()).toEqual(
      expectedNotFoundErrorMessage
    );

    await componentInstance.playGame();

    fixture.detectChanges();

    snackBarLabelElement = document.querySelector(
      `.${snackBarLabelClass}`
    ) as unknown as HTMLElement;
    expect(snackBarLabelElement.innerHTML.trim()).toEqual(
      expectedDefaultErrorMessage
    );
  });

  it('should modify game card classes, when battle is done', async () => {
    starshipDTO.crew = '40';
    personDTO.mass = '40';

    jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(componentInstance as any, 'selectRandomEntities')
      .mockReturnValue(of([personDTO, starshipDTO]));

    await componentInstance.playGame();
    fixture.detectChanges();

    let gameCardComponents = fixture.debugElement.queryAll(
      By.css(gameCardSelector)
    );
    expect(gameCardComponents[0].classes['draw']).toEqual(true);
    expect(gameCardComponents[1].classes['draw']).toEqual(true);

    starshipDTO.battleResult = -1;
    personDTO.battleResult = 1;

    await componentInstance.playGame();
    fixture.detectChanges();

    gameCardComponents = fixture.debugElement.queryAll(
      By.css(gameCardSelector)
    );
    expect(gameCardComponents[0].classes['won']).toEqual(true);
    expect(gameCardComponents[0].classes['overall-winner']).toEqual(true);
    expect(gameCardComponents[1].classes['lost']).toEqual(true);
  });
});
