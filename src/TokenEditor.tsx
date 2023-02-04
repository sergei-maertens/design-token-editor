import set from 'lodash.set';
import React, {useReducer} from 'react';
import clsx from 'clsx';

import TokenEditorContext from './Context';
import TokenFilter from './TokenFilter';
import {DesignToken} from './TokenRow';
import TokensTable from './TokensTable';
import {TopLevelContainer} from './types';
import {isDesignToken} from './util';

type ValueMap = {
  [key: string]: string;
};

type StyleDictValue = {
  value: string;
};

type StyleDictValueMap = {
  [key: string]: StyleDictValue | StyleDictValueMap;
};

interface TokenEditorState {
  searchValue: string;
  values: ValueMap;
  valuesState: 'collapsed' | 'expanded';
}

interface ReducerAction {
  type: 'search' | 'changeValue' | 'toggleValuesState';
  payload?: any;
}

const initialState: TokenEditorState = {
  searchValue: '',
  values: {},
  valuesState: 'collapsed',
};

const reducer = (state: TokenEditorState, action: ReducerAction): TokenEditorState => {
  switch (action.type) {
    case 'search': {
      return {...state, searchValue: action.payload};
    }
    case 'changeValue': {
      const {token, value} = action.payload;
      const {values} = state;
      const newValues = {...values, [token]: value};
      if (value === '') {
        delete newValues[token];
      }
      return {...state, values: newValues};
    }
    case 'toggleValuesState': {
      const nextState = state.valuesState === 'expanded' ? 'collapsed' : 'expanded';
      return {...state, valuesState: nextState};
    }
    default:
      throw new Error();
  }
};

const toStyleDictValues = (values: ValueMap): StyleDictValueMap => {
  let styleDictValues = {};
  for (const [key, value] of Object.entries(values)) {
    if (value === '') continue;
    set(styleDictValues, key, {value: value});
  }
  return styleDictValues;
};

const fromStyleDictValues = (values: TopLevelContainer): ValueMap => {
  const flatMap = {};
  Object.entries(values).forEach(([k, v]) => {
    if (isDesignToken(v)) {
      flatMap[k] = (v as DesignToken).value;
    } else {
      const nested = fromStyleDictValues(v);
      Object.entries(nested).forEach(([nk, nv]) => {
        flatMap[`${k}.${nk}`] = nv;
      });
    }
  });
  return flatMap;
};

interface TokenEditorProps {
  tokens: TopLevelContainer;
  initialValues?: TopLevelContainer;
}

const TokenEditor = ({tokens, initialValues = {}}: TokenEditorProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    values: fromStyleDictValues(initialValues),
  });

  return (
    <div className="dte-editor">
      <div className="dte-editor__tokens">
        <h2 className="dte-editor__section-title">Tokens</h2>
        <TokenFilter
          text={state.searchValue}
          onChange={e => dispatch({type: 'search', payload: e.target.value})}
        />
        <TokenEditorContext.Provider
          value={{
            mode: 'edit',
            onValueChange: (token, value) =>
              dispatch({type: 'changeValue', payload: {token, value}}),
            tokenValues: state.values,
          }}
        >
          <TokensTable container={tokens} limitTo={state.searchValue} autoExpand />
        </TokenEditorContext.Provider>
      </div>
      <div
        className={clsx(
          'dte-editor__values',
          state.valuesState && `dte-editor__values--${state.valuesState}`
        )}
      >
        <header className="dte-editor__values-meta">
          <h2 className="dte-editor__section-title">Values</h2>
          <button type="button" onClick={() => dispatch({type: 'toggleValuesState'})}>
            {state.valuesState === 'expanded' ? 'Collapse' : 'Expand'}
          </button>
        </header>
        <code className="dte-code dte-code--block">
          {JSON.stringify(toStyleDictValues(state.values), null, 2)}
        </code>
      </div>
    </div>
  );
};

export default TokenEditor;
