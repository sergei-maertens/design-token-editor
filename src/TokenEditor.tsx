import set from 'lodash.set';
import React, {useReducer} from 'react';
import TokensTable, {TopLevelContainer} from './TokensTable';
import TokenEditorContext from './Context';

interface TokenEditorProps {
  tokens: TopLevelContainer;
  initialValues?: {
    [key: string]: string;
  };
}

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
}

interface ReducerAction {
  type: 'search' | 'changeValue';
  payload: any;
}

const initialState: TokenEditorState = {
  searchValue: '',
  values: {},
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

const TokenEditor = ({tokens, initialValues = {}}: TokenEditorProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    values: initialValues,
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: '2em',
        fontFamily: 'calibri, sans-serif',
      }}
    >
      <div style={{width: '50%'}}>
        <h2>Available tokens</h2>
        <div>
          <input
            type="text"
            name="search"
            value={state.searchValue}
            onChange={e => dispatch({type: 'search', payload: e.target.value})}
            placeholder="Filter... e.g. 'of.button'"
            style={{
              padding: '.5em',
              width: 'calc(100% - 1em)',
              marginBottom: '1em',
            }}
          />
        </div>

        <TokenEditorContext.Provider
          value={{
            onValueChange: (token, value) =>
              dispatch({type: 'changeValue', payload: {token, value}}),
            tokenValues: state.values,
          }}
        >
          <TokensTable container={tokens} limitTo={state.searchValue} autoExpand />
        </TokenEditorContext.Provider>
      </div>

      <div style={{width: '50%'}}>
        <h2>Theme values</h2>
        <div style={{padding: '1em'}}>
          <pre>
            <code>{JSON.stringify(toStyleDictValues(state.values), null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TokenEditor;
