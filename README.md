# CapRecruitTask

Project was created on recruitment task purpose.
Main aim is to draw two entites from special [StarWars api](https://www.swapi.tech/) and then - based
on common attribute - emerge the winner.

## Rules of game

There are several rules of that game:

1. There are only two players (second is enemy) represented by left and right side ("game cards")
2. Player has got a score (visible on top of "game card")
3. The cards are compared on the basis of a common attribute - these are numbers, but also strings.
   At this point of time, there are only two entities that can be fetched (and then compared):

- **people** - there are compared based on **mass** attribute;
- **starships** - there are compared based on **crew** attribute;

4. Icons: 🏆, 👎, 🏳 are indicating, how many wins/losts/ties player has
5. The overall winner is determined by the balance of wins and draws - one win is three points, while a draw is one point
6. Overall winner of "war" (series of battles) is indicated by yellow background
7. Winner of single battle is marked with 'tick'(✔) icon (and also **Winner** badge), while Loser - cross (❌) icon

## Issues

1. Not found entities - Handling api calls can cause some unpredictable behaviour. For example, entity with 'randomized id' could not be found. Round won't be started, when at least one of game entity won't be fetched - user should see in that scenario error message on the below of screen.

## Features

Two features to emphasize:

1. **Roll until success** - User can turn on/off "Roll until success" toggle. When turned on, application will try to fetch random entities till success. This is more convenient than constantly clicking the “Play Again” button.
2. **Choose of what the user will play against** - Select allows to change the type of the second card. The default value is "anything" (it can be both - starships and people). It means that second card will be always in that type setted up in that select.

## Included Technologies

| Technology | Version |
| :--------: | :-----: |
|  Angular   | ^17.3.0 |
|    NGXS    | ^18.1.5 |
|    RxJS    | ~7.8.0  |
|  Tailwind  | ^3.4.15 |
|    Jest    | ^29.7.3 |
|  Cypress   | latest  |

... end more can be found within the repo.

## Testing

1. E2E tests can be triggered with command

```sh
npm run cypress:run
```

2. Unit tests can be triggered with command

```sh
npm run unit-test
```

, or with coverage variant

```sh
npm run unit-test:coverage
```
