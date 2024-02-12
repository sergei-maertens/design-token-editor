import React, {useEffect, useReducer} from 'react';
import clsx from 'clsx';

import TokenEditorContext from './Context';
import TokensTable from './TokensTable';
import {TopLevelContainer, DesignTokenContainer} from './types';
import {isContainer, isDesignToken} from './util';

type ValueMap = Map<string[], string>;

type StyleDictValue = {
  value: string;
};

export type StyleDictValueMap = {
  [key: string]: StyleDictValue | StyleDictValueMap;
};

type ViewMode = 'tokens' | 'values';

interface TokenEditorState {
  viewMode: ViewMode;
  values: ValueMap;
}

type SetViewModeAction = {
  type: 'setViewMode';
  payload: ViewMode;
};

type ChangeValueAction = {
  type: 'changeValue';
  payload: {
    token: string[];
    value: string;
  };
};

type ReducerAction = SetViewModeAction | ChangeValueAction;

const initialState: TokenEditorState = {
  viewMode: 'tokens',
  values: new Map(),
};

const reducer = (state: TokenEditorState, action: ReducerAction): TokenEditorState => {
  switch (action.type) {
    case 'setViewMode': {
      return {...state, viewMode: action.payload};
    }
    case 'changeValue': {
      const {token, value} = action.payload;
      const {values} = state;

      // mutate existing object, but then make sure to make a new instance since React
      // does reference comparison, not value (!). We prefer map as a datastructure since
      // we can use arrays as keys.
      if (value === '') {
        values.delete(token);
      } else {
        values.set(token, value);
      }
      const newValues = new Map(values);
      return {...state, values: newValues};
    }
    default:
      throw new Error();
  }
};

const toStyleDictValues = (values: ValueMap): StyleDictValueMap => {
  let styleDictValues = {} satisfies StyleDictValueMap;

  values.forEach((value, tokenPathBits) => {
    if (value === '') return;

    let parent = styleDictValues;

    // deep assign for each bit in tokenPathBits
    for (const bit of tokenPathBits) {
      if (!parent[bit]) {
        parent[bit] = {};
      }
      parent = parent[bit];
    }

    (parent as StyleDictValue).value = value;
  });

  return styleDictValues;
};

const fromStyleDictValues = (
  values: TopLevelContainer | DesignTokenContainer,
  parentPath: string[] = []
): ValueMap => {
  const valueMap = new Map<string[], string>();
  Object.entries(values).forEach(([k, v]) => {
    const path = [...parentPath, k];
    if (isDesignToken<StyleDictValue>(v)) {
      valueMap.set(path, v.value);
    } else if (isContainer(v)) {
      const nested = fromStyleDictValues(v, path);
      nested.forEach((value, key) => {
        valueMap.set(key, value);
      });
    }
  });
  return valueMap;
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

export interface TokenEditorProps {
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
          <TokenEditorContext.Provider
            value={{
              onValueChange: (token, value) => {
                dispatch({type: 'changeValue', payload: {token, value}});
              },
              tokenValues: state.values,
            }}
          >
            <TokensTable container={tokens} filterEnabled autoExpand />
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
