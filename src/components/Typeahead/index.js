import React, { useEffect, useReducer, useRef, useState } from 'react';
import cx from 'classnames';

import reducer, { initialState } from './Reducer.js';
import { highlightMatch } from './Utils.js';
import { ClearIcon, SearchIcon } from '../Icon';
import { useDebounce } from 'use-debounce';

import s from './style.module.css';

export { createLocalDataSource } from './LocalDataSource.js';

const CONTROL_KEYS = {
  13: {
    type: 'MATCH_SET',
  },
  27: true,
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
  id,
  name,
  placeholder,
  setFieldValue,
}) {
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Debouncing the value change to go easy on the data source that could call an API.
  const [debouncedValue] = useDebounce(value, 250);

  // Manage the focus / blur through a ref to the HTMLElement.
  const inputRef = useRef();

  useEffect(() => {
    if (!state.selectedMatch) {
      return;
    }

    // Synchronize with the value.
    setValue(state.selectedMatch.label);

    // Ensure the field is focused feels nice when using with the mouse.
    inputRef.current.focus();
  }, [state.selectedMatch]);

  useEffect(() => {
    if (!value) {
      dispatch({ type: 'MATCHES_RESET' });

      return;
    }

    if (state.selectedMatch && value !== state.selectedMatch.label) {
      dispatch({ type: 'MATCH_UNSET' });
    }
  }, [value]);

  useEffect(() => {
    // Let the value travel upwards, usually to a form.
    setFieldValue(name, debouncedValue);

    if (!state.selectedMatch && debouncedValue) {
      dataSource.query(debouncedValue).then(matches => {
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
  }, [debouncedValue]);

  return (
    <div className={s['typeahead']}>
      <div className={s['typeahead__control']}>
        <label htmlFor={id}>
          <SearchIcon />
        </label>
        <input
          ref={inputRef}
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={event => setValue(event.currentTarget.value)}
          onFocus={event => setFocus(true)}
          onBlur={event => setFocus(false)}
          onKeyDown={event => {
            if (undefined === CONTROL_KEYS[event.keyCode]) {
              return;
            }

            if (true === CONTROL_KEYS[event.keyCode]) {
              // This feels a bit hacky, should be able to refactor this.
              inputRef.current.blur();

              return;
            }

            dispatch(CONTROL_KEYS[event.keyCode]);
          }}
          type="text"
          value={value}
        />
        {value ? (
          <button
            className={s['typeahead__button-clear']}
            onClick={event => setValue('')}
            tabIndex="-1"
            type="button">
            <ClearIcon />
          </button>
        ) : null}
      </div>

      {focus && !state.selectedMatch && state.matches.length ? (
        <div
          className={s['typeahead__sheet']}
          style={{
            overflowY: 5 < state.matches.length ? 'scroll' : 'auto',
          }}>
          <div className={s['typeahead__sheet__body']}>
            <ul className={s['typeahead__match']}>
              {state.matches.map((match, matchIndex) => (
                <li
                  key={match.item.id}
                  className={cx(s['typeahead__match__entry'], {
                    [s['typeahead__match__entry--highlighted']]:
                      state.highlightedMatch === matchIndex,
                  })}
                  onMouseEnter={event =>
                    dispatch({
                      type: 'HIGHLIGHT_MATCH_SET',
                      payload: matchIndex,
                    })
                  }
                  onClick={event => dispatch({ type: 'MATCH_SET' })}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(match.item.label, match.matches),
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
