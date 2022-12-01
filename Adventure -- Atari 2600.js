/*
@title: Adventure -- Atari 2600
@author: jacob mclemore

Instructions:
  - Add manual text here.

TODO:
  - Add debug mode
  - make travelDirection a part of playerStatus
  - organize code
*/
const DEBUG = true;

const colors = {
  'black': '0',
  'gray__dark': 'L',
  'gray__light': '1',
  'white': '2',
  'red': '3',
  'brown': 'C',
  'blue__light': '7',
  'blue__dark': '5',
  'yellow': '6',
  'olive': 'F',
  'green__light': '4',
  'green__dark': 'D',
  'pink': '8',
  'purple': 'H',
  'orange': '9',
  'transparent': '.'
};
let travelDirection = null;

const player = "p";
const box = "b";
const goal = "g";
const wall = "w";
const wall__black = "B";
const teleporter = "T";

const player__bitmap = bitmap`
................
................
................
................
....00000000....
....00000000....
....00000000....
....00000000....
....00000000....
....00000000....
....00000000....
....00000000....
................
................
................
................`;
const wall__bitmap = bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
`;

let teleporter__bitmap = null;
if (DEBUG) {
  teleporter__bitmap = bitmap`
.33333333333333.
.33333333333333.
.33....33....33.
.33....33....33.
.......33.......
.......33.......
.......33.......
.......33.......
.......33.......
.......33.......
.......33.......
.......33.......
.......33.......
.......33.......
.....333333.....
.....333333.....`;
} else {
  teleporter__bitmap = bitmap`
................
................
................
................
................
................
................
................
................
................
................
................
................
................
................
................`;
}
Object.freeze(teleporter__bitmap);

const playerStatus = {
  touchingLevelExit: false,
  exitTouched: null
};


setLegend(
  [ player, player__bitmap],
  [ wall, wall__bitmap],
  [ wall__black, wall__bitmap],
  [ teleporter, teleporter__bitmap],
);



let level = 0;


/**
 * Level:
 *   color: string
 *   exits: Exit
 *   map: map
 *
 *  Exit:
 *    @key position
 *    room: number
 *    position: point
 *    direction: string
 */
const levels = [
  {
    'color': 'purple',
    'exits': {
      '10,11': {
          'level': 1,
          'position': [10, 0],
          'direction': 's',
          'bidirectional': true,
        },
      '11,11': {
          'level': 1,
          'position': [11, 0],
          'direction': 's',
          'bidirectional': true,
        },
      '12,11': {
          'level': 1,
          'position': [12, 0],
          'direction': 's',
          'bidirectional': true,
        },
      '13,11': {
          'level': 1,
          'position': [13, 0],
          'direction': 's',
          'bidirectional': true,
        },
    },
    'map': map`
wwwwwwwwwwwwwwwwwwwwwwww
w......................w
w.......p..............w
w......................w
w......................w
w......................w
w......................w
w......................w
w......................w
w......................w
w......................w
wwwwwwwwwwTTTTwwwwwwwwww`
  },
  {
    'color': 'blue__light',
    'exits': {
      '10,0': {
        'level': 0,
        'position': [10, 11],
        'direction': 'n',
        'bidirectional': true,
      },
      '11,0': {
        'level': 0,
        'position': [11, 11],
        'direction': 'n',
        'bidirectional': true,
      },
      '12,0': {
        'level': 0,
        'position': [12, 11],
        'direction': 'n',
        'bidirectional': true,
      },
      '13,0': {
        'level': 0,
        'position': [13, 11],
        'direction': 'n',
        'bidirectional': true,
      },

      '10,11': {
        'level': 2,
        'position': [10, 0],
        'direction': 's',
        'bidirectional': true
      },
      '11,11': {
        'level': 2,
        'position': [11, 0],
        'direction': 's',
        'bidirectional': true
      },
      '12,11': {
        'level': 2,
        'position': [12, 0],
        'direction': 's',
        'bidirectional': true
      },
      '13,11': {
        'level': 2,
        'position': [12, 0],
        'direction': 's',
        'bidirectional': true
      },

      '0,1': {
        'level': 3,
        'direction': 'w',
        'bidirectional': true,
      },
    },
    'map': map`
wwwwwwwwwwTTTTwwwwwwwwBw
T........p............Bw
T.....................Bw
T.....................Bw
T.....................Bw
T.....................Bw
T.....................Bw
T.....................Bw
T.....................Bw
T.....................Bw
T.....................Bw
wwwwwwwwwwTTTTwwwwwwwwBw`,
  },
  {
    'color': 'brown',
    'exits': {
      '10,0': {
        'level': 1,
        'position': [10, 11],
        'direction': 'n',
        'bidirectional': true,
      },
      '11,0': {
        'level': 1,
        'position': [11, 11],
        'direction': 'n',
        'bidirectional': true,
      },
      '12,0':{
        'level': 1,
        'position': [12, 11],
        'direction': 'n',
        'bidirectional': true,
      },
      '13,0':{
        'level': 1,
        'position': [13, 11],
        'direction': 'n',
        'bidirectional': true,
      },
    },
    'map': map`
wwwwwwwwwwTTTTwwwwwwwwww
w...........p..........w
w......................w
w......................w
w......................w
w......................w
w......................w
w......................w
w......................w
w......................w
w......................w
wwwwwwwwwwwwwwwwwwwwwwww
    `,
  },
  {
    'color': 'olive',
    'exits': {
    },
    'map': map`
....................w.ww
....................w...
....................w...
....................w...
....................w...
........................
........................
........................
........................
........................
........................
........................`,
  },
]
const blackScreen = map`
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBB`;

function changeLevel(level /* Level */) {
  const colored_wall__bitmap = wall__bitmap.replace(/0/g, colors[level['color']]);
  const colored_player__bitmap = player__bitmap.replace(/0/g, colors[level['color']]);
  setMap(blackScreen);
  setLegend(
    [player, colored_player__bitmap],
    [wall, colored_wall__bitmap],
    [wall__black, wall__bitmap],
    [teleporter, teleporter__bitmap],
  );
  setMap(level['map']);
  return;
}

changeLevel(levels[0]);

setSolids([ player, box, wall ]);

setPushables({
  [player]: []
});

// START - PLAYER MOVEMENT CONTROLS
function teleportPlayer(level, position) {
    changeLevel(levels[level]);
    getFirst(player).x = position[0];
    getFirst(player).y = position[1];

    travelDirection = null;
}


onInput("w", () => { 
  getFirst(player).y -= 1;
  travelDirection = 'n';
});

onInput("s", () => {

  getFirst(player).y += 1;
  travelDirection = 's';
});

onInput("a", () => {
  getFirst(player).x -= 1;
  travelDirection = 'w';
});

onInput("d", () => {
  getFirst(player).x += 1;
  travelDirection = 'e';
});

afterInput(() => {
  if (playerStatus.touchingLevelExit && playerStatus.exitTouched['direction'] === travelDirection) {
    teleportPlayer(playerStatus.exitTouched['level'], playerStatus.exitTouched['position']);
    level = playerStatus.exitTouched['level'];
    playerStatus.touchingLevelExit = playerStatus.exitTouched['bidirectional'];
    if (playerStatus.exitTouched['bidirectional']) {
      const playerPosition = `${getFirst(player).x},${getFirst(player).y}`;
      playerStatus.exitTouched = levels[level]['exits'][playerPosition];
    }
    return;
  }

  if (tilesWith(player, teleporter).length) {
    const playerPosition = `${getFirst(player).x},${getFirst(player).y}`;
    playerStatus.touchingLevelExit = true;
    playerStatus.exitTouched = levels[level]['exits'][playerPosition];
  } else {
    playerStatus.touchingLevelExit = false;
    playerStatus.exitTouched = null;
  }
});