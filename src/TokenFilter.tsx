import React, {ChangeEvent} from 'react';

interface TokenFilterProps {
  text: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TokenFilter = ({text, onChange}: TokenFilterProps): JSX.Element => {
  return (
    <input
      className="dte-token-filter"
      type="search"
      name="filter"
      value={text}
      onChange={onChange}
      placeholder="Filter... e.g. 'of.button'"
    />
  );
};

export default TokenFilter;
