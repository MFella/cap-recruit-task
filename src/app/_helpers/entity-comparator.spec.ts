import { MockEntityGenerator } from '../../test/test-helpers';
import { PersonDTO, StarshipDTO } from '../types/entity.types';
import { EntityComparator } from './entity-comparator';

describe('EntityComparator', () => {
  let personEntityDTO: PersonDTO =
    MockEntityGenerator.generateMockEntity('people');
  let starshipEntityDTO: StarshipDTO =
    MockEntityGenerator.generateMockEntity('starships');

  beforeAll(() => {
    personEntityDTO = MockEntityGenerator.generateMockEntity('people');
    starshipEntityDTO = MockEntityGenerator.generateMockEntity('starships');
  });

  it('should return [0, 0], when entities contain falsy property to compare', () => {
    const expectedComparisonResult = [0, 0];

    personEntityDTO.mass = undefined;
    starshipEntityDTO.crew = undefined;
    const comparisonResult = EntityComparator.compareValues(
      personEntityDTO,
      starshipEntityDTO
    );
    expect(comparisonResult).toEqual(expectedComparisonResult);
  });

  it('should return [1, -1], when second entity has falsy property to compare', () => {
    const expectedComparisonResult = [1, -1];

    starshipEntityDTO.crew = '70';
    personEntityDTO.mass = undefined;

    const comparisonResult = EntityComparator.compareValues(
      starshipEntityDTO,
      personEntityDTO
    );
    expect(comparisonResult).toEqual(expectedComparisonResult);
  });

  it('should return [-1, 1], when first entity has falsy property to compare', () => {
    const expectedComparisonResult = [-1, 1];

    starshipEntityDTO.crew = '70';
    personEntityDTO.mass = undefined;

    const comparisonResult = EntityComparator.compareValues(
      personEntityDTO,
      starshipEntityDTO
    );
    expect(comparisonResult).toEqual(expectedComparisonResult);
  });

  it('should return [0, 0], when both entities have same not falsy numer-like value to compare', () => {
    const expectedComparisonResult = [0, -0];
    personEntityDTO.mass = '70';
    starshipEntityDTO.crew = '70';

    const comparisonResult = EntityComparator.compareValues(
      personEntityDTO,
      starshipEntityDTO
    );
    expect(comparisonResult).toEqual(expectedComparisonResult);
  });

  it('should return [0, -0], when both entities have same not falsy string value to compare', () => {
    const expectedComparisonResult = [0, -0];
    personEntityDTO.mass = 'example_string';
    starshipEntityDTO.crew = 'example_string';

    const comparisonResult = EntityComparator.compareValues(
      personEntityDTO,
      starshipEntityDTO
    );
    expect(comparisonResult).toEqual(expectedComparisonResult);
  });
});
