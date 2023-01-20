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


interface TokensTableProps {
  container: DesignTokenContainer;
  parentScopes?: string[];
  closedScopes?: string[][];
  onToggle: (scope: string[]) => void;
}

const TokensTableRows = ({
    container,
    parentScopes=[],
    closedScopes=[],
    onToggle,
  }: TokensTableProps): JSX.Element | null => {
  if ('value' in (container as DesignToken)) {
    const isHidden = closedScopes.some(closedScope => (
      (container as DesignToken).path.join('.').startsWith(`{closedScope.join('.')}.`)
    ));
    return isHidden ? null : <TokenRow designToken={container as DesignToken} />;
  }

  const nested = Object.entries(container).map(
    ([key, child]) => {
      const allScopes = parentScopes.concat(key);
      const isHidden = allScopes.length >= 1 && closedScopes.some(closedScope => (
        allScopes.join('.').startsWith(`${closedScope.join('.')}.`)
      ));
      if (isHidden) return null;
      return (
        <React.Fragment key={allScopes.join('-')}>
          { 'value' in child ? null : <ScopeRow scope={allScopes} onToggle={onToggle} /> }
          <TokensTableRows
            container={child}
            parentScopes={allScopes}
            closedScopes={closedScopes}
            onToggle={onToggle}
          />
        </React.Fragment>
      );
    }
  );
  return <>{nested}</>;
};


const TokensTable = ({ container }: TokensTableProps): JSX.Element => {
  const namespaces = Object.keys(container).map(namespace => [namespace]);
  const [closedScopes, setClosedScopes] = useState(namespaces);

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
    const nestedScopes = Object.keys(nestedContainer).map(key => [...scope, key]);
    const newClosedScopes = [
      ...closedScopes.filter(_scope => !isEqual(_scope, scope)),
      ...nestedScopes,
    ];
    setClosedScopes(newClosedScopes);
    return;

  };

  console.log(closedScopes);

  return (
    <table style={{borderCollapse: 'collapse', width: '100%'}}>
      <tbody>
        <tr>
          <th>Token</th>
          <th>(Default) value</th>
          <th>Value source</th>
        </tr>
        <TokensTableRows container={container} closedScopes={closedScopes} onToggle={onToggle} />
      </tbody>
    </table>
  );
};

export default TokensTable;
