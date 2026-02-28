interface WhisperCardProps {
  message: string;
  type?: 'info' | 'success' | 'warning';
  timestamp?: string;
}

export function WhisperCard({ message, type = 'info', timestamp }: WhisperCardProps) {
  const colors = {
    info: 'border-l-[#4C7DFF]',
    success: 'border-l-[#22C55E]',
    warning: 'border-l-[#F59E0B]',
  };

  return (
    <div className={`bg-white rounded-[16px] border border-[#E6E8EC] border-l-[4px] ${colors[type]} p-5 mb-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)]`}>
      <p className="text-[#111318] leading-relaxed">{message}</p>
      {timestamp && (
        <span className="text-[#6B7280] text-xs mt-2 block">{timestamp}</span>
      )}
    </div>
  );
}