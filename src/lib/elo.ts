export function calculateElo(
  ratingA: number,
  ratingB: number,
  scoreA: number,
  scoreB: number,
  kFactor: number = 32
): [number, number] {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));
  return [
    ratingA + kFactor * (scoreA - expectedA),
    ratingB + kFactor * (scoreB - expectedB),
  ];
}
