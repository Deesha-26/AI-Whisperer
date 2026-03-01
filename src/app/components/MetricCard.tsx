import * as Progress from "@radix-ui/react-progress";

type BadgeTone = "info" | "success" | "warning";

interface MetricCardProps {
  title: string;
  value: string | number;
  showProgress?: boolean;
  progressValue?: number;
  subtitle?: string;
  badgeTone?: BadgeTone;
}

export function MetricCard({ title, value, showProgress, progressValue = 0, subtitle, badgeTone }: MetricCardProps) {
  const badge =
    badgeTone === "success"
      ? "bg-green-50 text-green-700 border-green-200"
      : badgeTone === "warning"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : badgeTone === "info"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "";

  return (
    <div className="bg-white rounded-[16px] border border-[#E6E8EC] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="text-[#6B7280] text-sm mb-2">{title}</div>

      {badgeTone ? (
        <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-semibold ${badge}`}>
          {value}
        </div>
      ) : (
        <div className="text-[#111318] text-3xl font-semibold mb-2">{value}</div>
      )}

      {subtitle && <div className="text-[#6B7280] text-xs mt-2">{subtitle}</div>}

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
