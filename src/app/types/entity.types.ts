export type EntityType = 'people' | 'starships';

// export type EntityDTO = PersonDTO | StarshipDTO;

export type SwapiRawResponse<T extends EntityType> = {
  message: string;
  result: SwapiRawResult<T>;
};

export type SwapiRawResult<T extends EntityType> = {
  properties: CompoundEntityDTO<T>;
  description: string;
  _id: string;
  uid: string;
  __v: number;
};

export interface EntityTypeMap {
  people: PersonDTO;
  starships: StarshipDTO;
}

export type CompoundEntityDTO<T extends EntityType> = T extends 'starships'
  ? StarshipDTO
  : T extends 'people'
  ? PersonDTO
  : never;

export type EntityBattleResult = -1 | 0 | 1;

type EntityDTO = {
  created: string;
  edited: string;
  name: string;
  url: string;
  kind: EntityType;
  battleResult: EntityBattleResult;
};

export type PersonDTO = {
  height: string;
  mass?: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
} & EntityDTO;

export type StarshipDTO = {
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew?: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  pilots?: null[] | null;
} & EntityDTO;
