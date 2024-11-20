import { TestBed } from '@angular/core/testing';

import { RestService } from './rest.service';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TypeUtil } from '../_helpers/type-util';

describe('RestService', () => {
  let service: RestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(RestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return PersonDTO and StarshipDTO, when id is appropriate', async () => {
    const appropriateEntityId = 2;
    jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(service as any, 'generateRandomEntityNumber')
      .mockReturnValue(appropriateEntityId);

    const personEntityDTOResult = await firstValueFrom(
      service.fetchRandomEntity('people')
    );
    const starshipEntityDTOResult = await firstValueFrom(
      service.fetchRandomEntity('starships')
    );

    expect(TypeUtil.isPersonDTO(personEntityDTOResult)).toBeTruthy();
    expect(TypeUtil.isStarshipDTO(starshipEntityDTOResult)).toBeTruthy();
  });

  it('should throw an Error, when id of entity is inappropriate', async () => {
    const inappropriateEntityId = 1e5;
    const expectedErrorMessage = 'not found';
    const expectedErrorStatusCode = 404;
    jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(service as any, 'generateRandomEntityNumber')
      .mockReturnValue(inappropriateEntityId);
    try {
      await firstValueFrom(service.fetchRandomEntity('people'));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.error.message).toBe(expectedErrorMessage);
      expect(error.status).toBe(expectedErrorStatusCode);
    }
  });
});
