export const getSwapiMockResponse = (entityType: 'people' | 'starships') => {
  if (entityType === 'people') {
    return {
      message: 'ok',
      result: {
        properties: {
          height: '172',
          mass: '77',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'blue',
          birth_year: '19BBY',
          gender: 'male',
          created: '2024-11-20T00:36:27.990Z',
          edited: '2024-11-20T00:36:27.990Z',
          name: 'Luke Skywalker',
          homeworld: 'https://www.swapi.tech/api/planets/1',
          url: 'https://www.swapi.tech/api/people/1',
        },
        description: 'A person within the Star Wars universe',
        _id: '5f63a36eee9fd7000499be42',
        uid: '1',
        __v: 0,
      },
    };
  }

  return {
    message: 'ok',
    result: {
      properties: {
        model: 'DS-1 Orbital Battle Station',
        starship_class: 'Deep Space Mobile Battlestation',
        manufacturer:
          'Imperial Department of Military Research, Sienar Fleet Systems',
        cost_in_credits: '1000000000000',
        length: '120000',
        crew: '342,953',
        passengers: '843,342',
        max_atmosphering_speed: 'n/a',
        hyperdrive_rating: '4.0',
        MGLT: '10',
        cargo_capacity: '1000000000000',
        consumables: '3 years',
        pilots: [],
        created: '2020-09-17T17:55:06.604Z',
        edited: '2020-09-17T17:55:06.604Z',
        name: 'Death Star',
        url: 'https://www.swapi.tech/api/starships/9',
      },
      description: 'A Starship',
      _id: '5f63a34fee9fd7000499be21',
      uid: '9',
      __v: 0,
    },
  };
};
