import React from 'react';

export type DesignToken = {
  name: string;
  value: string;
  original: {
    value: string;
  }
  path: string[];
  attributes: {
    [key: string]: string;
  }
}


type DesignTokenContainer = {
  [key: string]: DesignToken | DesignTokenContainer;
} | DesignToken;


export type TokenRowProps =  {
  designToken: DesignToken;
}

const TokenRow = ({designToken}: TokenRowProps): JSX.Element => {
  const { value, original, path } = designToken;
  const tokenPath = path.join('.');
  return (
    <tr>
      <td><code>{tokenPath}</code></td>
      <td>
        <input name={tokenPath} type="text" placeholder={value} defaultValue="" />
      </td>
      <td>
        <code>{original.value}</code>
      </td>
    </tr>
  );
};


interface TokensTableProps {
  container: DesignTokenContainer;
}


const TokensTableRows = ({ container }: TokensTableProps): JSX.Element => {
  if ('value' in container) {
    return (
      <TokenRow designToken={container as DesignToken} />
    );
  }

  const nested = Object.entries(container).map(
    ([key, child]) => <TokensTableRows key={key} container={child} />
  );
  return <>{nested}</>;
};


const TokensTable = ({ container }: TokensTableProps): JSX.Element => {
  return (
    <table>
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



export { TokenRow, TokensTable };
