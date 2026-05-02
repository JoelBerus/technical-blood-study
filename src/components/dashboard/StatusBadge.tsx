import type { ClassificationStatus } from '@/types';

interface StatusBadgeProps {
  status: ClassificationStatus;
}

const statusConfig = {
  normal: {
    bg: '#dcfce7',
    text: '#166534',
    label: 'Normal',
  },
  low: {
    bg: '#fef3c7',
    text: '#92400e',
    label: 'Low',
  },
  high: {
    bg: '#ffedd5',
    text: '#9a3412',
    label: 'High',
  },
  critical: {
    bg: '#fee2e2',
    text: '#991b1b',
    label: 'Critical',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-label-caps"
      style={{ 
        backgroundColor: config.bg, 
        color: config.text 
      }}
    >
      {config.label}
    </span>
  );
}