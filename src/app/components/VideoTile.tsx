interface VideoTileProps {
  name: string;
  isActive?: boolean;
  isSelf?: boolean;
}

export function VideoTile({ name, isActive = false, isSelf = false }: VideoTileProps) {
  return (
    <div 
      className={`relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden ${
        isActive ? 'ring-4 ring-[#4C7DFF]' : ''
      }`}
    >
      {/* Placeholder avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-[#4C7DFF] flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
      
      {/* Name label */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        <span className="text-white text-sm font-medium">
          {isSelf ? `${name} (You)` : name}
        </span>
      </div>

      {/* Active speaker indicator */}
      {isActive && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-[#22C55E] rounded-full animate-pulse" />
      )}
    </div>
  );
}
