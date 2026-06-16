import { X, Download, Share2, Trash2 } from "lucide-react";

interface PreviewScreenProps {
  dataUrl: string;
  onClose: () => void;
}

export function PreviewScreen({ dataUrl, onClose }: PreviewScreenProps) {
  function handleDownload() {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `timo-${Date.now()}.jpg`;
    a.click();
  }

  function handleShare() {
    if (navigator.share) {
      fetch(dataUrl)
        .then((r) => r.blob())
        .then((blob) => {
          const file = new File([blob], "timo.jpg", { type: "image/jpeg" });
          navigator.share({ files: [file], title: "Timo photo" }).catch(() => {});
        });
    } else {
      handleDownload();
    }
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 px-5 pt-12 pb-4 flex items-center justify-between z-10"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }}>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity active:opacity-50"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
          <X size={18} className="text-white" />
        </button>
        <span className="text-white/60 text-sm font-medium">미리보기</span>
        <div className="w-9" />
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img
          src={dataUrl}
          alt="Captured photo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-0 inset-x-0 px-6 pb-12 pt-6 flex items-center justify-around z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
        <button
          onClick={onClose}
          className="flex flex-col items-center gap-2 transition-opacity active:opacity-50">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <Trash2 size={20} className="text-white/70" />
          </div>
          <span className="text-white/50 text-xs">재촬영</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-2 transition-opacity active:opacity-50">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <Share2 size={20} className="text-white/80" />
          </div>
          <span className="text-white/60 text-xs">공유</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex flex-col items-center gap-2 transition-opacity active:opacity-50">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "#3b82f6", boxShadow: "0 4px 20px rgba(59,130,246,0.35)" }}>
            <Download size={22} className="text-white" />
          </div>
          <span className="text-white/80 text-xs font-medium">저장</span>
        </button>
      </div>
    </div>
  );
}
