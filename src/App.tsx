import { FilterProvider } from '@/context/FilterContext';
import { Dashboard } from '@/pages/Dashboard';

export function App() {
  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  );
}
