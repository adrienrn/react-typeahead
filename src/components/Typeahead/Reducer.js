export const initialState = {
  matches: [],
  highlightedMatch: null,
  selectedMatch: null,
};

export default function reducer(state, action)
{
  switch (action.type) {
    case 'HIGHLIGHT_MATCH_DECREMENT':
      return {
        ...state,
        highlightedMatch: Math.max(-1, state.highlightedMatch - 1),
      };
    case 'HIGHLIGHT_MATCH_INCREMENT':
      return {
        ...state,
        highlightedMatch: Math.min(state.matches.length - 1, state.highlightedMatch + 1),
      };
    case 'HIGHLIGHT_MATCH_SET':
      return {
        ...state,
        highlightedMatch: action.payload,
      };
    case 'MATCH_SET':
      if (!state.matches.length) {
        return state;
      }

      if (!state.matches[state.highlightedMatch]) {
        return state;
      }

      return {
        ...state,
        selectedMatch: state.matches[state.highlightedMatch].item,
      };
    case 'MATCH_UNSET':
      return {
        ...state,
        selectedMatch: null,
      };
    case 'MATCHES_SET':
      return {
        ...state,
        matches: action.payload,
        highlightedMatch: 0,
      };
    case 'MATCHES_RESET':
      return initialState;
    default:
      return state;
  }
}
