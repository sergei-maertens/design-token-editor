import React from 'react';

export interface TokenRowProps {
    prefix: string;
}

const TokenRow = ({prefix}: TokenRowProps): JSX.Element => {
  return <div>{prefix}: ello</div>;
};


export { TokenRow };
