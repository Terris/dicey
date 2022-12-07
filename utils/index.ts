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

// SCORING VALUES
const SCORE_MAP = {
  STRAIGHT: 1500,
  PAIRS: 1000,
  TRIPLE_ONES: [1, 1, 1], // 1000
  TRIPLES: [2, 2, 2],
  ONE_HUNDRED: 1, // 100
  FIFTY: 5, // 50
};

function scoreForStraight(roll: number[]) {
  // [1,2,3,4,5,6]
  if (roll.length < 6) return 0;
  [...roll].sort().forEach((n, i) => {
    if (n !== i + 1) return 0;
  });
  return 1500;
}

function scoreForPairs(roll: number[]) {
  // [1,1,2,2,3,3]
  if (roll.length < 6) return 0;
  if (new Set(roll).size !== 3) return 0;
  return 1000;
}

function scoreForTriples(roll: number[]) {
  // [1,1,1] || [2,2,2,2,2,2]
  if (roll.length < 3) return 0;
  const pairMap: { value: number; count: number }[] = [];
  roll.forEach((v) => {
    const matchIndex = pairMap.findIndex((e) => e.value === v);
    if (matchIndex >= 0) {
      pairMap[matchIndex] = { value: v, count: pairMap[matchIndex].count + 1 };
    } else {
      pairMap.push({ value: v, count: 1 });
    }
  });
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
