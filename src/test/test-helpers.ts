import { CompoundEntityDTO, EntityType } from '../app/types/entity.types';

export class MockEntityGenerator {
  static generateMockEntity<T extends EntityType>(
    entityType: T
  ): CompoundEntityDTO<T> {
    const personEntityDTO: CompoundEntityDTO<T> = {
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      created: '2024-11-19T12:47:54.354Z',
      edited: '2024-11-19T12:47:54.354Z',
      name: 'Luke Skywalker',
      homeworld: 'https://www.swapi.tech/api/planets/1',
      url: 'https://www.swapi.tech/api/people/1',
      kind: 'people',
      battleResult: 0,
    } as unknown as CompoundEntityDTO<T>;

    const starshipEntityDTO: CompoundEntityDTO<T> = {
      model: 'CR90 corvette',
      starship_class: 'corvette',
      manufacturer: 'Corellian Engineering Corporation',
      cost_in_credits: '3500000',
      length: '150',
      crew: '30-165',
      passengers: '600',
      max_atmosphering_speed: '950',
      hyperdrive_rating: '2.0',
      MGLT: '60',
      cargo_capacity: '3000000',
      consumables: '1 year',
      pilots: [],
      created: '2020-09-17T17:55:06.604Z',
      edited: '2020-09-17T17:55:06.604Z',
      name: 'CR90 corvette',
      url: 'https://www.swapi.tech/api/starships/2',
      kind: 'people',
      battleResult: 0,
    } as unknown as CompoundEntityDTO<T>;

    switch (entityType) {
      case 'people':
        return personEntityDTO;
      case 'starships':
        return starshipEntityDTO;
      default:
        return personEntityDTO;
    }
  }
}
