import {
  CompoundEntityDTO,
  EntityBattleResult,
  EntityType,
  PersonDTO,
  StarshipDTO,
} from '../types/entity.types';
import { TypeUtil } from './type-util';

export class EntityComparator {
  static compareValues<T extends EntityType, U extends EntityType>(
    firstEntity: CompoundEntityDTO<T>,
    secondEntity: CompoundEntityDTO<U>
  ): [EntityBattleResult, EntityBattleResult] {
    // presumably we could add empty string
    const falsyPrimitives: Array<number | null | undefined | string> = [
      null,
      undefined,
      NaN,
    ];
    const [firstValueToCompare, anotherValueToCompare] = [
      EntityComparator.getValueToCompare(firstEntity),
      EntityComparator.getValueToCompare(secondEntity),
    ];

    // when both are falsy, return [0, 0]
    if (
      falsyPrimitives.includes(firstValueToCompare) &&
      falsyPrimitives.includes(anotherValueToCompare)
    ) {
      return [0, 0];
    }

    // when first is not 'falsy', and another is falsy - return [1, -1]
    if (
      !falsyPrimitives.includes(firstValueToCompare) &&
      falsyPrimitives.includes(anotherValueToCompare)
    ) {
      return [1, -1];
    }

    // when first is falsy, and another is not - return [-1, 1]
    if (
      falsyPrimitives.includes(firstValueToCompare) &&
      !falsyPrimitives.includes(anotherValueToCompare)
    ) {
      return [-1, 1];
    }

    // values are numbers or stringified numbers
    if (
      (TypeUtil.isStringifiedNumber(firstValueToCompare) &&
        TypeUtil.isStringifiedNumber(anotherValueToCompare)) ||
      (typeof firstValueToCompare === 'number' &&
        typeof anotherValueToCompare === 'number')
    ) {
      const entityBattleResult = Math.sign(
        firstValueToCompare - anotherValueToCompare
      ) as EntityBattleResult;
      return [entityBattleResult, -entityBattleResult as EntityBattleResult];
    }

    // compare strings with 'localeCompare'
    if (
      typeof firstValueToCompare === 'string' &&
      typeof anotherValueToCompare === 'string'
    ) {
      const entityBattleResult = Math.sign(
        firstValueToCompare.localeCompare(anotherValueToCompare)
      ) as EntityBattleResult;
      return [entityBattleResult, -entityBattleResult as EntityBattleResult];
    }

    // cannot compare values - draw
    return [0, 0];
  }

  private static getValueToCompare(
    entity: StarshipDTO | PersonDTO
  ): number | string | undefined {
    if (TypeUtil.isPersonDTO(entity)) {
      // sometimes mass and crew is in format '1,321', which later on can cause some 'NaN' behaviour
      // unknown mass = 0
      return entity.mass === 'unknown' ? '0' : entity?.mass?.replace(',', '');
    } else if (TypeUtil.isStarshipDTO(entity)) {
      const crewCount = entity?.crew?.replace(',', '');
      // also, crew size may be written as a range - take last number
      if (crewCount?.includes('-')) {
        return crewCount.split('-').at(-1);
      }

      return crewCount === 'unknown' ? '0' : crewCount;
    }

    return undefined;
  }
}
