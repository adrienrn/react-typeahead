import React, { useEffect, useReducer, useRef, useState, } from 'react';
import cx from 'classnames';

import reducer, { initialState, } from './Reducer.js';
import { highlightMatch } from './Utils.js';

import s from './style.module.css';

export { createLocalDataSource } from './LocalDataSource.js';

const CONTROL_KEYS = {
  13: {
    'type': 'MATCH_SET',
  },
  37: false,
  38: {
    type: 'HIGHLIGHT_MATCH_DECREMENT',
  },
  39: false,
  40: {
    type: 'HIGHLIGHT_MATCH_INCREMENT',
  },
};

export default function Typeahead({
  dataSource,
  name,
  placeholder,
  setFieldValue,
})
{
  const [value, setValue] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);

  const inputRef = useRef();

  useEffect(() => {
    if (!state.selectedMatch) {
      return;
    }

    // Synchronize with the value.
    setValue(state.selectedMatch.label);

    // Ensure the field is focused.
    inputRef.current.focus();
  }, [state.selectedMatch])

  /**
   * Make the call to the data source after the value has changed.
   */
  useEffect(() => {
    if (!value) {
      dispatch({type: 'MATCHES_RESET'});

      return;
    }

    if (state.selectedMatch && value !== state.selectedMatch.label) {
      dispatch({type: 'MATCH_UNSET'});
    }

    if (!state.selectedMatch && value) {
      dataSource.query(value).then((matches) => {
        if (0 === matches.length) {
          // We want to do nothing and allow the user to hit search. However, if you
          // want to display an error or not found message, you could dispatch an
          // action here.
          return matches;
        }

        dispatch({
          type: 'MATCHES_SET',
          payload: matches,
        });

        return matches;
      });

      return;
    }

  }, [value]);

  return (
    <div className={s['typeahead']}>
      <input
        ref={inputRef}
        name={name}
        placeholder={placeholder}
        onChange={(event) => setValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (undefined === CONTROL_KEYS[event.keyCode]) {
            return;
          }

          dispatch(CONTROL_KEYS[event.keyCode]);
        }}
        type="text"
        value={value}
      />

      {!state.selectedMatch && state.matches.length ? (
        <div className={s['typeahead__sheet']} style={{
          overflowY: (5 < state.matches.length) ? 'scroll' : 'none',
        }}>
          <div className={s['typeahead__sheet__body']}>
            <ul className={s['typeahead__match']}>
              {state.matches.map((match, matchIndex) => (
                <li key={match.item.id}
                  className={cx(s['typeahead__match__entry'], {
                    [s['typeahead__match__entry--highlighted']]: (state.highlightedMatch === matchIndex),
                  })}
                  onMouseEnter={(event) => dispatch({
                    type: 'HIGHLIGHT_MATCH_SET',
                    payload: matchIndex,
                  })}
                  onClick={(event) => dispatch({type: 'MATCH_SET'})}
                >
                  <span dangerouslySetInnerHTML={{
                    __html: highlightMatch(match.item.label, match.matches)
                  }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
