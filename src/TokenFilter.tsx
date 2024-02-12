import React, {ChangeEvent} from 'react';

import {TopLevelContainer, DesignToken, DesignTokenContainer} from './types';
import {isContainer, isDesignToken} from './util';

type FILTER_MODE = 'all' | 'curated';

export interface TokenFilterState {
  mode: FILTER_MODE;
  query: string;
}

interface FilterModeInputProps {
  value: FILTER_MODE;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FilterModeInput: React.FC<FilterModeInputProps> = ({value, onChange}) => {
  return (
    <div className="dte-radio">
      <label>Tokens to show:</label>
      <label>
        <input
          type="radio"
          name="mode"
          value="all"
          checked={value === 'all'}
          onChange={onChange}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          name="mode"
          value="curated"
          checked={value === 'curated'}
          onChange={onChange}
        />
        Pre-selected
      </label>
    </div>
  );
};

export interface TokenFilterProps {
  filters: TokenFilterState;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TokenFilter: React.FC<TokenFilterProps> = ({
  filters = {},
  onChange,
}): JSX.Element => {
  const {mode = 'curated', query = ''} = filters;
  return (
    <div className="dte-token-filters">
      <div className="dte-token-filters__filter">
        <FilterModeInput value={mode} onChange={onChange} />
      </div>

      <div className="dte-token-filters__filter dte-token-filters__filter--expand">
        <input
          className="dte-token-filters__query"
          type="search"
          name="query"
          value={query}
          onChange={onChange}
          placeholder="Filter... e.g. 'color'"
        />
      </div>
    </div>
  );
};

const shouldIncludeToken = (filters: TokenFilterState, token: DesignToken): boolean => {
  const {mode, query} = filters;

  // check for curated tokens mode
  const isCurated = token?.$extensions?.['dte.metadata']?.isCurated;
  if (mode === 'curated' && !isCurated) {
    return false;
  }

  // check if there is a query and if it matches
  if (query) {
    const normalizedQuery = query.toLocaleLowerCase();
    if (token.path.join('.').includes(normalizedQuery)) {
      return true;
    }
    const normalizedComment = (token?.comment || '').toLocaleLowerCase();
    return normalizedComment.includes(normalizedQuery);
  }

  return true;
};

export const applyFilters = (
  filterEnabled: boolean,
  filters: TokenFilterState,
  container: TopLevelContainer
): DesignTokenContainer => {
  if (!filterEnabled) return container;

  const filteredContainer: TopLevelContainer = {};
  Object.entries(container).forEach(([key, nested]) => {
    if (key === '$extensions') {
      filteredContainer[key] = nested;
      return;
    }

    if (isDesignToken(nested)) {
      if (shouldIncludeToken(filters, nested as DesignToken)) {
        filteredContainer[key] = nested;
      }
    } else if (isContainer(nested)) {
      const nestedFilteredContainer = applyFilters(filterEnabled, filters, nested);
      if (!Object.entries(nestedFilteredContainer).length) {
        return;
      }
      filteredContainer[key] = nestedFilteredContainer;
    }
  });

  return filteredContainer;
};

export default TokenFilter;
