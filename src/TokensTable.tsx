import React from 'react';

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
}


const ScopeRow = ({ scope=[] }: ScopeRowProps): JSX.Element => {
  return (
    <tr>
      <td colSpan={3} style={{border: 'solid 1px grey', padding: '.5em'}}>
        {scope.join(' / ')}
      </td>
    </tr>
  );
};


interface TokensTableProps {
  container: DesignTokenContainer;
  parentScopes?: string[];
}

const TokensTableRows = ({ container, parentScopes=[] }: TokensTableProps): JSX.Element => {
  if ('value' in container) {
    return (
      <TokenRow designToken={container as DesignToken} />
    );
  }

  const nested = Object.entries(container).map(
    ([key, child]) => {
      const allScopes = parentScopes.concat(key);
      return (
        <React.Fragment key={allScopes.join('-')}>
          { 'value' in child ? null : <ScopeRow scope={allScopes} /> }
          <TokensTableRows container={child} parentScopes={allScopes} />
        </React.Fragment>
      );
    }
  );
  return <>{nested}</>;
};


const TokensTable = ({ container }: TokensTableProps): JSX.Element => {
  return (
    <table style={{borderCollapse: 'collapse'}}>
      <tbody>
        <tr>
          <th>Token</th>
          <th>(Default) value</th>
          <th>Value source</th>
        </tr>
        <TokensTableRows container={container} />
      </tbody>
    </table>
  );
};

export default TokensTable;
