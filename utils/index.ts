import { Player } from "../types/types";

export function uniqueId(length: number = 6) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomDieValue() {
  return getRandomInt(1, 7);
}

// LANGUAGE
// ==================================================

export function pluralizeName(name: string) {
  const lastLetter = name.slice(-1);
  if (lastLetter === "s" || lastLetter === "S") return name + "'";
  return name + "'s";
}

// SCORING
// ==================================================
const SCORE_MAP = {
  STRAIGHT: 1500,
  PAIRS: 1000,
  TRIPLE_ONES: [1, 1, 1], // 1000
  TRIPLES: [2, 2, 2, 2], // 400 (200 * 2)
  ONE_HUNDRED: 1, // 100
  FIFTY: 5, // 50
};

// creates a map of each die value and counts the number of occurences
// e.g [{value: 1, count 2}, {value: 2, count 0}]
function createValueMap(roll: number[]) {
  // create map of same numbers e.g. {value: 1, count: 3}
  const pairMap: { value: number; count: number }[] = [];
  roll.forEach((v) => {
    const matchIndex = pairMap.findIndex((e) => e.value === v);
    if (matchIndex >= 0) {
      pairMap[matchIndex] = { value: v, count: pairMap[matchIndex].count + 1 };
    } else {
      pairMap.push({ value: v, count: 1 });
    }
  });
  return pairMap;
}

function scoreForStraight(roll: number[]) {
  // [1,2,3,4,5,6]
  if (roll.length < 6) return 0;
  if (![...roll].sort().every((n, i) => n === i + 1)) return 0;
  return 1500;
}

function scoreForPairs(roll: number[]) {
  // [1,1,2,2,3,3]
  if (roll.length < 6) return 0;
  const valueMap = createValueMap(roll);
  if (valueMap.length !== 3 || !valueMap.every((item) => item.count === 2))
    return 0;
  return 1000;
}

function scoreForTriples(roll: number[]) {
  // [1,1,1] || [2,2,2,2,2,2]
  if (roll.length < 3) return 0;
  const pairMap = createValueMap(roll);

  // Calculate score for triples or better
  let score = 0;

  pairMap.forEach((item) => {
    if (item.count >= 3) {
      if (item.value === 1) {
        score += 1000 * (item.count - 2);
      } else {
        score += item.value * 100 * (item.count - 2);
      }
    }
  });
  return score;
}

export function scoreForOnes(roll: number[]) {
  return roll.filter((v) => v === 1).length * 100;
}

export function scoreForFives(roll: number[]) {
  return roll.filter((v) => v === 5).length * 50;
}

export function rollHasPoints(roll: number[]) {
  return [
    scoreForStraight(roll),
    scoreForPairs(roll),
    scoreForTriples(roll),
    scoreForOnes(roll),
    scoreForFives(roll),
  ].some((v) => v > 0);
}

function scoreForTriplesOnesAndFives(roll: number[]) {
  let score = 0;
  const valueMap = createValueMap(roll);

  valueMap.forEach((item) => {
    // score for triples
    if (item.count >= 3) {
      if (item.value === 1) {
        score += 1000 * (item.count - 2);
      } else {
        score += item.value * 100 * (item.count - 2);
      }
    } else if (item.value === 1) {
      score += item.count * 100;
    } else if (item.value === 5) {
      score += item.count * 50;
    }
  });

  return score;
}

export function scoreForKeeps(roll: number[]) {
  let score = 0;

  score += scoreForStraight(roll);
  if (score > 0) return score;

  score += scoreForPairs(roll);
  if (score > 0) return score;

  score += scoreForTriplesOnesAndFives(roll);
  return score;
}

export function scoreFromArray(arr: number[]) {
  return arr.reduce((partialSum, a) => partialSum + a, 0);
}

export function scoreForTurn(turnKeeps: number[][]) {
  return scoreFromArray(
    turnKeeps.map((keeps) => {
      return scoreForKeeps(keeps);
    })
  );
}

export function canKeepDie({ roll, die }: { roll: number[]; die: number }) {
  // if the die is part of a scorable combination, return true
  if (
    die === 1 ||
    die === 5 ||
    scoreForStraight(roll) > 0 ||
    scoreForPairs(roll) > 0 ||
    findTriplesMatch({ roll, die })
  ) {
    return true;
  } else {
    return false;
  }
}

export function findTriplesMatch({
  roll,
  die,
}: {
  roll: number[];
  die: number;
}) {
  const triplesMap = createValueMap(roll); // [{ value: 1, count: 3 }, { value: 2, count: 3 }]
  return triplesMap.find((item) => item.count >= 3 && item.value === die);
}

export function mergeRollAndKeeps(roll: number[], keeps: number[]) {
  return [...roll, ...keeps];
}
