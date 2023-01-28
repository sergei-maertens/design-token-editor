import React from 'react';

import TokenRow, {DesignToken} from './TokenRow';

interface TokensBlockProps {
  path: string[];
  tokens: DesignToken[];
}

const TokensBlock = ({path, tokens}: TokensBlockProps): JSX.Element => {
  return (
    <section className="dte-tokens-block">
      <header className="dte-tokens-block__context-row">{path.join(' ➡️ ')}</header>

      <div className="dte-tokens-block__tokens">
        <div className="dte-token-row dte-token-row--header">
          <div className="dte-token-row__token-name">Token</div>
          <div className="dte-token-row__token-value">Value</div>
          <div className="dte-token-row__token-source">Source / default</div>
        </div>

        {tokens.map(token => (
          <TokenRow key={token.path.join('.')} designToken={token} noWrap />
        ))}
      </div>
    </section>
  );
};

export default TokensBlock;
