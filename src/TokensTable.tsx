import React, {useState} from 'react';
import isEqual from 'lodash.isequal';

import TokensBlock from './TokensBlock';
import {DesignToken} from './TokenRow';

export type TopLevelContainer = {
  [key: string]: DesignTokenContainer;
};

/**
 * Key-value mapping, where the value may be a design token (leaf node) or another
 * container.
 */
type DesignTokenContainer = DesignToken | {[key: string]: DesignTokenContainer};

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
    // it's a leaf node if the 'value' key is present, 'DesignToken' type
    if ('value' in node) {
      leafNodes.push(node as DesignToken);
    } else {
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
      />
      {branchNodesToRender}
    </>
  );
};

interface TokensTableProps {
  container: TopLevelContainer;
  limitTo?: string;
  autoExpand?: boolean;
}

const TokensTable = ({
  container,
  limitTo = '',
  autoExpand = false,
}: TokensTableProps): JSX.Element => {
  const namespaces = Object.keys(container).map(namespace => [namespace]);
  const [closedScopes, setClosedScopes] = useState(autoExpand ? [] : namespaces);

  const onToggle = (scope: string[]) => {
    const isClosed = closedScopes.some(_scope => isEqual(_scope, scope));
    if (!isClosed) {
      setClosedScopes([...closedScopes, scope]);
      return;
    }

    // remove the scope from the list, but include all the child scopes
    let nestedContainer = container as DesignTokenContainer;
    for (const bit of scope) {
      nestedContainer = nestedContainer[bit];
    }
    const nestedScopes = Object.entries(nestedContainer)
      .filter(([, container]) => !('value' in container))
      .map(([key]) => [...scope, key]);

    const newClosedScopes = [
      ...closedScopes.filter(_scope => !isEqual(_scope, scope)),
      ...nestedScopes,
    ];
    setClosedScopes(newClosedScopes);
    return;
  };

  const children = Object.entries(container)
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

  return <>{children}</>;
};

export default TokensTable;
