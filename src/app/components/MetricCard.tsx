import * as Progress from '@radix-ui/react-progress';

interface MetricCardProps {
  title: string;
  value: string | number;
  showProgress?: boolean;
  progressValue?: number;
  subtitle?: string;
}

export function MetricCard({ title, value, showProgress, progressValue = 0, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6E8EC] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="text-[#6B7280] text-sm mb-2">{title}</div>
      <div className="text-[#111318] text-3xl font-semibold mb-2">{value}</div>
      
      {subtitle && (
        <div className="text-[#6B7280] text-xs">{subtitle}</div>
      )}
      
      {showProgress && (
        <Progress.Root 
          value={progressValue} 
          max={100}
          className="h-2 bg-[#E6E8EC] rounded-full overflow-hidden mt-3"
        >
          <Progress.Indicator
            className="h-full bg-[#4C7DFF] transition-transform duration-300"
            style={{ transform: `translateX(-${100 - progressValue}%)` }}
          />
        </Progress.Root>
      )}
    </div>
  );
}