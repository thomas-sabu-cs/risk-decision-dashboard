import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { RiskLevel } from '@/types/transaction';

interface FilterContextValue {
  riskFilter: RiskLevel;
  setRiskFilter: (level: RiskLevel) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [riskFilter, setRiskFilterState] = useState<RiskLevel>('all');
  const setRiskFilter = useCallback((level: RiskLevel) => {
    setRiskFilterState(level);
  }, []);
  return (
    <FilterContext.Provider value={{ riskFilter, setRiskFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- context module exports provider + hook
export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilter must be used within FilterProvider');
  }
  return ctx;
}
