import React, {useState} from 'react';
import isEqual from 'lodash.isequal';

import TokenRow from "./TokenRow";
import { DesignToken } from "./TokenRow";

/**
 * Key-value mapping, where the value may be a design token (leaf node) or another
 * container.
 */
export type DesignTokenContainer = {
  [key: string]: DesignToken | DesignTokenContainer;
} | DesignToken;



interface ScopeRowProps {
  scope: string[];
  onToggle: (scope: string[]) => void;
}


const ScopeRow = ({ scope=[], onToggle }: ScopeRowProps): JSX.Element => {
  return (
    <tr>
      <td colSpan={3} style={{border: 'solid 1px grey', padding: '.5em'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span>{scope.join(' / ')}</span>
          <button onClick={() => onToggle(scope)}>toggle children</button>
        </div>
      </td>
    </tr>
  );
};


type ContainerNode = [string, DesignTokenContainer];

interface TokensTableRowsProps {
  container: DesignTokenContainer;
  limitTo?: string[] | null;
  parentScopes?: string[];
  closedScopes?: string[][];
  onToggle: (scope: string[]) => void;
}

const TokensTableRows = ({
    container,
    limitTo=null,
    parentScopes=[],
    closedScopes=[],
    onToggle,
  }: TokensTableRowsProps): JSX.Element | null => {

  // split the items to render into two sets:
  // 1. design tokens (leaf nodes, having a value key)
  // 2. nested scopes/containers, having more nested scopes or leaf nodes
  const leafNodes: DesignToken[] = [];
  const branchNodes: ContainerNode[] = [];

  Object.entries(container).forEach(([key, node]): void => {
    // it's a leaf node if the 'value' key is present, 'DesignToken' type
    if ('value' in node) {
      leafNodes.push((node as DesignToken));
    } else {
      branchNodes.push([key, (node as DesignTokenContainer)]);
    }
  });

  const leafNodesToRender = leafNodes.map((token: DesignToken) => {
    const tokenPath = token.path.join('.');
    const isHidden = closedScopes.some(closedScope => tokenPath.startsWith(closedScope.join('.')));
    if (isHidden) return false;
    return (<TokenRow key={tokenPath} designToken={token} />);
  }).filter(Boolean);

  const branchNodesToRender = branchNodes.map((node: ContainerNode) => {
    const [key, container] = node;
    const containerScope = [...parentScopes, key];
    const containerPath = containerScope.join('.');

    const isExcluded = limitTo !== null
      ? (
        limitTo.some( limitPath => {
          if (containerPath.length < limitPath.length) {
            return !limitPath.startsWith(containerPath);
          }
          return !containerPath.startsWith(limitPath);
        })
      )
      : false
    ;

    if (isExcluded) return null;

    const isHidden = closedScopes.some(closedScope => containerPath.startsWith(closedScope.join('.')));
    return (
      <React.Fragment key={containerPath}>
        <ScopeRow scope={containerScope} onToggle={onToggle} />
        {isHidden ? null : (
          <TokensTableRows
            container={container}
            limitTo={limitTo}
            parentScopes={containerScope}
            closedScopes={closedScopes}
            onToggle={onToggle}
          />
        )}
      </React.Fragment>
    );
  }).filter(Boolean);

  return (
    <>
      {leafNodesToRender}
      {branchNodesToRender}
    </>
  );
};

interface TokensTableProps {
  container: DesignTokenContainer;
  limitTo?: string[] | null;
  autoExpand?: boolean;
}


const TokensTable = ({ container, limitTo=null, autoExpand = false }: TokensTableProps): JSX.Element => {
  const namespaces = Object.keys(container).map(namespace => [namespace]);
  const [closedScopes, setClosedScopes] = useState(autoExpand ? [] : namespaces);

  const onToggle = (scope: string[]) => {
    const isClosed = closedScopes.some(_scope => isEqual(_scope, scope));
    if (!isClosed) {
      setClosedScopes([...closedScopes, scope]);
      return;
    }

    // remove the scope from the list, but include all the child scopes
    let nestedContainer = container;
    for (const bit of scope) {
      nestedContainer = nestedContainer[bit];
    }
    const nestedScopes = Object
      .entries(nestedContainer)
      .filter(([, container]) => !('value' in container))
      .map(([key]) => [...scope, key]);

    const newClosedScopes = [
      ...closedScopes.filter(_scope => !isEqual(_scope, scope)),
      ...nestedScopes,
    ];
    setClosedScopes(newClosedScopes);
    return;
  };

  return (
    <table style={{borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed'}}>
      <tbody>
        <tr>
          <th style={{textAlign: 'left'}}>Token</th>
          <th style={{textAlign: 'left'}}>(Default) value</th>
          <th style={{textAlign: 'left'}}>Value source</th>
        </tr>
        <TokensTableRows
          container={container}
          limitTo={limitTo}
          closedScopes={closedScopes}
          onToggle={onToggle}
        />
      </tbody>
    </table>
  );
};

export default TokensTable;
