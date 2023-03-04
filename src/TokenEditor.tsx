import set from 'lodash.set';
import React, {useEffect, useReducer} from 'react';
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

type ViewMode = 'tokens' | 'values';

interface TokenEditorState {
  viewMode: ViewMode;
  searchValue: string;
  values: ValueMap;
}

type SetViewModeAction = {
  type: 'setViewMode';
  payload: ViewMode;
};

type SearchAction = {
  type: 'search';
  payload: string;
};

type ChangeValueAction = {
  type: 'changeValue';
  payload: {
    token: string;
    value: string;
  };
};

type ReducerAction = SetViewModeAction | SearchAction | ChangeValueAction;

const initialState: TokenEditorState = {
  viewMode: 'tokens',
  searchValue: '',
  values: {},
};

const reducer = (state: TokenEditorState, action: ReducerAction): TokenEditorState => {
  switch (action.type) {
    case 'setViewMode': {
      return {...state, viewMode: action.payload};
    }
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

type ViewModeItemProps = {
  viewMode: ViewMode;
  currentViewMode: ViewMode;
  label: string;
  onChangeViewMode: (vm: ViewMode) => void;
};

const ViewModeItem = ({
  viewMode,
  label,
  currentViewMode,
  onChangeViewMode,
}: ViewModeItemProps): JSX.Element => (
  <a
    href="#"
    className={clsx('dte-sub-nav__item', {
      'dte-sub-nav__item--active': viewMode === currentViewMode,
    })}
    onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      onChangeViewMode(viewMode);
    }}
  >
    {label}
  </a>
);

interface ViewModePickerProps {
  viewMode: ViewMode;
  onChangeViewMode: (vm: ViewMode) => void;
}

const ViewModePicker = ({
  viewMode,
  onChangeViewMode,
}: ViewModePickerProps): JSX.Element => {
  return (
    <div className="dte-view-mode-selector">
      View
      <nav className="dte-sub-nav">
        <ViewModeItem
          viewMode="tokens"
          label="Tokens"
          currentViewMode={viewMode}
          onChangeViewMode={onChangeViewMode}
        />
        <ViewModeItem
          viewMode="values"
          label="Values"
          currentViewMode={viewMode}
          onChangeViewMode={onChangeViewMode}
        />
      </nav>
    </div>
  );
};

interface TokenEditorProps {
  tokens: TopLevelContainer;
  initialValues?: TopLevelContainer;
  onChange?: (values: StyleDictValueMap) => void;
}

const TokenEditor = ({
  tokens,
  initialValues = {},
  onChange,
}: TokenEditorProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    values: fromStyleDictValues(initialValues),
  });

  const styleDictValues = toStyleDictValues(state.values);

  // call the onChange if tokens value has changed.
  useEffect(() => {
    if (!onChange) return;
    onChange(styleDictValues);
  }, [state.values]);

  let body: JSX.Element;
  switch (state.viewMode) {
    case 'tokens': {
      body = (
        <>
          <TokenFilter
            text={state.searchValue}
            onChange={e => dispatch({type: 'search', payload: e.target.value})}
          />
          <TokenEditorContext.Provider
            value={{
              onValueChange: (token, value) => {
                dispatch({type: 'changeValue', payload: {token, value}});
              },
              tokenValues: state.values,
            }}
          >
            <TokensTable container={tokens} limitTo={state.searchValue} autoExpand />
          </TokenEditorContext.Provider>
        </>
      );
      break;
    }
    case 'values': {
      body = (
        <code className="dte-code dte-code--block">
          {JSON.stringify(styleDictValues, null, 2)}
        </code>
      );
      break;
    }
  }

  return (
    <div className="dte-editor">
      <ViewModePicker
        viewMode={state.viewMode}
        onChangeViewMode={viewMode =>
          dispatch({type: 'setViewMode', payload: viewMode})
        }
      />
      {body}
    </div>
  );
};

export default TokenEditor;
