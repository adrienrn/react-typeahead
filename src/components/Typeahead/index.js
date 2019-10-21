import React, { useEffect, useReducer, useState, } from 'react';
import cx from 'classnames';

import s from './style.module.css';

export { createLocalDataSource } from './LocalDataSource.js';

const CONTROL_KEYS = {
  37: false,
  38: {
    type: 'HIGHLIGHT_MATCH_DECREMENT'
  },
  39: false,
  40: {
    type: 'HIGHLIGHT_MATCH_INCREMENT'
  },
};

const initialState = {
  matches: [],
  highlightedMatch: null,
};

function highlightedReducer(state, action)
{
  switch (action.type) {
    case 'HIGHLIGHT_MATCH_DECREMENT':
      return {
        ...state,
        highlightedMatch: Math.max(0, state.highlightedMatch - 1),
      };
    case 'HIGHLIGHT_MATCH_INCREMENT':
      return {
        ...state,
        highlightedMatch: Math.min(state.matches.length - 1, state.highlightedMatch + 1),
      };
    case 'MATCHES_SET':
      return {
        matches: action.payload,
        highlightedMatch: 0,
      };

    case 'MATCHES_RESET':
      return initialState;
    default:
      return state;
  }
}

export default function Typeahead({
  dataSource,
  name,
  placeholder,
  setFieldValue,
})
{
  const [value, setValue] = useState('');
  const [state, dispatchHighlightedMatch] = useReducer(highlightedReducer, initialState);

  useEffect(() => {
    //setFieldValue(name, value);

    // Mock a query.
    if (value) {
      dataSource.query(value).then((matches) => {
        if (0 === matches.length) {
          // We want to do nothing and allow the user to hit search. However, if you
          // want to display an error or not found message, you could dispatch an
          // action here.
          return matches;
        }

        dispatchHighlightedMatch({
          type: 'MATCHES_SET',
          payload: matches,
        });
      });

      return;
    }

    // Reset everything.;
    dispatchHighlightedMatch({
      type: 'MATCHES_RESET',
    });
  }, [dataSource, value]);

  return (
    <div className={s['typeahead']}>
      <input
        name={name}
        placeholder={placeholder}
        onChange={(event) => {
          setValue(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (undefined === CONTROL_KEYS[event.keyCode]) {
            return;
          }

          dispatchHighlightedMatch(CONTROL_KEYS[event.keyCode]);
        }}
        type="text"
        value={value}
      />
      {state.matches.length ? (
        <div className={s['typeahead__sheet']}>
          <ul className={s['typeahead__match']}>
            {state.matches.map((match, matchIndex) => (
              <li key={match.item.id} className={cx(s['typeahead__match__entry'], {
                [s['typeahead__match__entry--highlighted']]: (state.highlightedMatch === matchIndex),
              })}>
                {match.item.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
