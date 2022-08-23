export interface State {
    currentAllowedTraffic: number;
    currentTotalTraffic: number;
    currentRejectedTraffic: number;
}
let state: State = {
    currentAllowedTraffic: 100,
    currentTotalTraffic: 0,
    currentRejectedTraffic: 0,
};

// basic state management switch to some library later 
export const getState = () => state;

export const setState = (s: Partial<State>) => {
    state = Object.assign(state, s);
};
