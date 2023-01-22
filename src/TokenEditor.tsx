import React, {useReducer} from 'react';
import TokensTable, {DesignTokenContainer} from './TokensTable';
import TokenEditorContext from './Context';

interface TokenEditorProps {
  tokens: DesignTokenContainer;
  initialValues?: {
    [key: string]: string;
  }
}

interface TokenEditorState {
  searchValue: string;
  values: {
    [key: string]: string;
  }
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
      return {...state, searchValue: action.payload}
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
      throw new Error()
  }
};

const TokenEditor = ({tokens, initialValues={}}: TokenEditorProps): JSX.Element => {
  const [state, dispatch] = useReducer(
    reducer,
    {...initialState, values: initialValues},
  );

  return (
    <div style={{
      display: 'flex',
      gap: '2em',
      fontFamily: 'calibri, sans-serif',
    }}>

      <div style={{width: '50%'}}>
        <h2>Available tokens</h2>
        <div>
          <input
            type="text"
            name="search"
            value={state.searchValue}
            onChange={ e => dispatch({type: 'search', payload: e.target.value}) }
            placeholder="Filter... e.g. 'of.button'"
            style={{
              padding: '.5em',
              width: 'calc(100% - 1em)',
              marginBottom: '1em',
            }}
          />
        </div>

        <TokenEditorContext.Provider value={{
          onValueChange: (token, value) => dispatch({type: 'changeValue', payload: {token, value}}),
          tokenValues: state.values,
        }}>
          <TokensTable
            container={tokens}
            limitTo={state.searchValue ? [state.searchValue] : null}
            autoExpand
          />
        </TokenEditorContext.Provider>
      </div>

      <div style={{width: '50%'}}>
        <h2>Theme values</h2>
        <div style={{padding: '1em'}}>
          <pre><code>{JSON.stringify(state.values, null, 2)}</code></pre>
        </div>
      </div>

    </div>
  );
};


export default TokenEditor;
