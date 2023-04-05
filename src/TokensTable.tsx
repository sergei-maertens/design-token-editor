import React, {useState, useReducer} from 'react';
import isEqual from 'lodash.isequal';

import TokensBlock from './TokensBlock';
import {isDesignToken, isContainer} from './util';
import {
  DesignTokenContainer,
  DesignToken,
  TopLevelContainer,
  DesignTokenGroup,
} from './types';
import TokenFilter, {applyFilters, TokenFilterState} from './TokenFilter';

type ContainerNode = [string, DesignTokenContainer];

interface TokensTableRowsProps {
  container: DesignTokenContainer;
  parentScopes: string[];
  limitTo?: string;
  closedScopes?: string[][];
  onToggle: (scope: string[]) => void;
}

const TokensTableRows = ({
  container,
  parentScopes,
  limitTo = '',
  closedScopes = [],
  onToggle,
}: TokensTableRowsProps): JSX.Element => {
  // split the items to render into two sets:
  // 1. design tokens (leaf nodes, having a value key)
  // 2. nested scopes/containers, having more nested scopes or leaf nodes
  const leafNodes: DesignToken[] = [];
  const branchNodes: ContainerNode[] = [];

  Object.entries(container).forEach(([key, node]): void => {
    if (isDesignToken(node)) {
      leafNodes.push(node as DesignToken);
    } else if (isContainer(node)) {
      branchNodes.push([key, node as DesignTokenContainer]);
    }
  });

  const leafNodesToRender = leafNodes.filter((token: DesignToken) => {
    const tokenPath = token.path.join('.');
    const isHidden = closedScopes.some(closedScope =>
      tokenPath.startsWith(closedScope.join('.'))
    );
    return !isHidden;
  });

  const branchNodesToRender = branchNodes.map((node: ContainerNode) => {
    const [key, container] = node;
    const containerScope = [...parentScopes, key];
    const containerPath = containerScope.join('.');

    const isExcluded = limitTo
      ? containerPath.length < limitTo.length
        ? !limitTo.startsWith(containerPath)
        : !containerPath.startsWith(limitTo)
      : false;
    if (isExcluded) return null;

    const isHidden = closedScopes.some(closedScope =>
      containerPath.startsWith(`${closedScope.join('.')}.`)
    );
    if (isHidden) return null;
    return (
      <TokensTableRows
        key={containerPath}
        container={container}
        limitTo={limitTo}
        parentScopes={containerScope}
        closedScopes={closedScopes}
        onToggle={onToggle}
      />
    );
  });

  return (
    <>
      <TokensBlock
        path={parentScopes}
        tokens={leafNodesToRender}
        onClick={() => onToggle(parentScopes)}
        container={container as DesignTokenGroup}
      />
      {branchNodesToRender}
    </>
  );
};

interface TokenTableState {
  filters: TokenFilterState;
}

type UpdateFilterAction = {
  type: 'updateFilter';
  payload: React.ChangeEvent<HTMLInputElement>;
};

type ReducerAction = UpdateFilterAction;

const initialState = {
  filters: {
    mode: 'curated',
    query: '',
  },
} satisfies TokenTableState;

const reducer = (state: TokenTableState, action: ReducerAction): TokenTableState => {
  switch (action.type) {
    case 'updateFilter': {
      const {name, value} = action.payload.target;
      const filters = {...state.filters, [name]: value};
      return {...state, filters};
    }
  }
};

interface TokensTableProps {
  container: TopLevelContainer;
  limitTo?: string;
  autoExpand?: boolean;
  filterEnabled?: boolean;
}

const TokensTable = ({
  container,
  limitTo = '',
  autoExpand = false,
  filterEnabled = false,
}: TokensTableProps): JSX.Element => {
  const namespaces = Object.keys(container).map(namespace => [namespace]);
  const [closedScopes, setClosedScopes] = useState(autoExpand ? [] : namespaces);
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredContainer = applyFilters(filterEnabled, state.filters, container);

  const onToggle = (scope: string[]) => {
    const isClosed = closedScopes.some(_scope => isEqual(_scope, scope));
    if (!isClosed) {
      setClosedScopes([...closedScopes, scope]);
      return;
    }

    // remove the scope from the list, but include all the child scopes
    let nestedContainer = container as DesignTokenContainer;
    for (const bit of scope) {
      nestedContainer = nestedContainer[bit] as DesignTokenContainer;
    }
    const nestedScopes = Object.entries(nestedContainer)
      .filter(([, container]) => !isDesignToken(container))
      .map(([key]) => [...scope, key]);

    const newClosedScopes = [
      ...closedScopes.filter(_scope => !isEqual(_scope, scope)),
      ...nestedScopes,
    ];
    setClosedScopes(newClosedScopes);
    return;
  };

  const children = (
    Object.entries(filteredContainer) as [string, DesignTokenContainer][]
  )
    .filter(([key]) => {
      if (!limitTo) return true;
      if (key.length < limitTo.length) {
        return limitTo.startsWith(key);
      }
      return key.startsWith(limitTo);
    })
    .map(([key, nested]) => (
      <TokensTableRows
        key={key}
        container={nested}
        limitTo={limitTo}
        parentScopes={[key]}
        closedScopes={closedScopes}
        onToggle={onToggle}
      />
    ));

  return (
    <>
      {filterEnabled ? (
        <TokenFilter
          filters={state.filters}
          onChange={event => dispatch({type: 'updateFilter', payload: event})}
        />
      ) : null}

      {children}
    </>
  );
};

export default TokensTable;
