import { useFilter } from '@/context/FilterContext';
import type { RiskLevel } from '@/types/transaction';

const OPTIONS: { value: RiskLevel; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'low', label: 'Low Risk' },
];

export function FilterBar() {
  const { riskFilter, setRiskFilter } = useFilter();

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-sm font-medium text-gray-700">Filter by risk:</span>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRiskFilter(value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              riskFilter === value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
