export interface BurgerDTO {
  id: number;
  name: string;
  nameEn: string | null;
  imageUrl: string;
  eloRating: number;
}

export interface Match {
  burgerA: BurgerDTO;
  burgerB: BurgerDTO;
  winner?: BurgerDTO;
}

export interface Round {
  matches: Match[];
}

export interface TournamentState {
  rounds: Round[];
  currentRound: number;
  currentMatch: number;
  totalRounds: number;
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createTournament(burgers: BurgerDTO[], size: number): TournamentState {
  const shuffled = shuffle(burgers).slice(0, size);
  const matches: Match[] = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({ burgerA: shuffled[i], burgerB: shuffled[i + 1] });
  }
  const totalRounds = Math.log2(size);
  return { rounds: [{ matches }], currentRound: 0, currentMatch: 0, totalRounds };
}

export function advanceWinner(state: TournamentState, winnerId: number): TournamentState {
  const newState = JSON.parse(JSON.stringify(state)) as TournamentState;
  const round = newState.rounds[newState.currentRound];
  const match = round.matches[newState.currentMatch];
  match.winner = match.burgerA.id === winnerId ? match.burgerA : match.burgerB;

  if (newState.currentMatch < round.matches.length - 1) {
    newState.currentMatch++;
  } else {
    // All matches in this round done — create next round
    const winners = round.matches.map(m => m.winner!);
    if (winners.length > 1) {
      const nextMatches: Match[] = [];
      for (let i = 0; i < winners.length; i += 2) {
        nextMatches.push({ burgerA: winners[i], burgerB: winners[i + 1] });
      }
      newState.rounds.push({ matches: nextMatches });
      newState.currentRound++;
      newState.currentMatch = 0;
    }
  }
  return newState;
}

export function isTournamentComplete(state: TournamentState): boolean {
  const lastRound = state.rounds[state.rounds.length - 1];
  return lastRound.matches.length === 1 && lastRound.matches[0].winner !== undefined;
}

export function getWinner(state: TournamentState): BurgerDTO | null {
  if (!isTournamentComplete(state)) return null;
  return state.rounds[state.rounds.length - 1].matches[0].winner!;
}

export function getCurrentMatch(state: TournamentState): Match | null {
  if (isTournamentComplete(state)) return null;
  return state.rounds[state.currentRound].matches[state.currentMatch];
}

export function getRoundLabel(state: TournamentState): string {
  const round = state.rounds[state.currentRound];
  const totalInRound = round.matches.length * 2;
  return `${totalInRound}강`;
}
