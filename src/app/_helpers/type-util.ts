import { PersonDTO, StarshipDTO } from '../types/entity.types';

export class TypeUtil {
  static isStringifiedNumber(value: unknown): value is number {
    return typeof value === 'string' && !isNaN(parseInt(value));
  }

  static isPersonDTO(
    object: Record<string, string | number>
  ): object is PersonDTO {
    return (
      'height' in object &&
      'mass' in object &&
      'hair_color' in object &&
      'skin_color' in object &&
      'eye_color' in object &&
      'birth_year' in object &&
      'gender' in object &&
      'created' in object &&
      'edited' in object &&
      'name' in object &&
      'homeworld' in object &&
      'url' in object
    );
  }

  static isStarshipDTO(
    object: Record<string, string | number | null | null[]>
  ): object is StarshipDTO {
    return (
      'model' in object &&
      'starship_class' in object &&
      'manufacturer' in object &&
      'cost_in_credits' in object &&
      'length' in object &&
      'crew' in object &&
      'passengers' in object &&
      'max_atmosphering_speed' in object &&
      'hyperdrive_rating' in object &&
      'MGLT' in object &&
      'cargo_capacity' in object &&
      'consumables' in object &&
      'created' in object &&
      'edited' in object &&
      'name' in object &&
      'url' in object
    );
  }
}
