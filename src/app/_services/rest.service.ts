import { Injectable } from '@angular/core';
import {
  CompoundEntityDTO,
  EntityType,
  SwapiRawResponse,
} from '../types/entity.types';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private static readonly SWAPI_URL = 'https://www.swapi.tech/api/';
  private static readonly PEOPLE_ENTITY_NUMBER_THRESHOLD = 83;
  private static readonly STARSHIP_ENTITY_NUMBER_THRESHOLD = 17;

  constructor(private readonly httpClient: HttpClient) {}

  fetchRandomEntity<T extends EntityType>(
    entityType: T
  ): Observable<CompoundEntityDTO<T>> {
    const randomEntityNumber = this.generateRandomEntityNumber(entityType);
    return this.httpClient
      .get<SwapiRawResponse<typeof entityType>>(
        `${RestService.SWAPI_URL}${entityType}/${randomEntityNumber}`
      )
      .pipe(
        map((swapiRawResponse: SwapiRawResponse<typeof entityType>) => {
          swapiRawResponse.result.properties['kind'] = entityType;
          return swapiRawResponse.result.properties;
        })
      );
  }

  private generateRandomEntityNumber(entityType: EntityType): number {
    return Math.ceil(
      Math.random() *
        (entityType === 'people'
          ? RestService.PEOPLE_ENTITY_NUMBER_THRESHOLD
          : RestService.STARSHIP_ENTITY_NUMBER_THRESHOLD)
    );
  }
}
