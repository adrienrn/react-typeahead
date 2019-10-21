import React, { useCallback, useEffect, useReducer, useState, } from 'react';
import cx from 'classnames';
import debounce from 'lodash.debounce';

import reducer, { initialState, } from './Reducer.js';

import s from './style.module.css';

export { createLocalDataSource } from './LocalDataSource.js';

const CONTROL_KEYS = {
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
  const [state, setState] = useReducer(reducer, initialState);

  /**
   * Building a debounced callback that will actually make the query when required.
   */
  const debouncedQuery = useCallback(debounce((value) => {
    if (value) {
      dataSource.query(value).then((matches) => {
        if (0 === matches.length) {
          // We want to do nothing and allow the user to hit search. However, if you
          // want to display an error or not found message, you could dispatch an
          // action here.
          return matches;
        }

        setState({
          type: 'MATCHES_SET',
          payload: matches,
        });
      });
    }

    // Reset everything.
    setState({
      type: 'MATCHES_RESET',
    });
  }, 350), [dataSource]);

  /**
   * Make the call to the data source after the value has changed.
   */
  useEffect(() => {
    //setFieldValue(name, value);

    debouncedQuery(value);
  }, [debouncedQuery, value]);

  return (
    <div className={s['typeahead']}>
      <input
        name={name}
        placeholder={placeholder}
        onChange={(event) => setValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (undefined === CONTROL_KEYS[event.keyCode]) {
            return;
          }

          setState(CONTROL_KEYS[event.keyCode]);
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
