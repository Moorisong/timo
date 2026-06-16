import { useState, useEffect, useRef } from "react";
import { Settings, MapPin, ZapOff, Zap } from "lucide-react";

interface CameraScreenProps {
  locationEnabled: boolean;
  onToggleLocation: () => void;
  onOpenSettings: () => void;
  onCapture: (dataUrl: string) => void;
  agencyName: string;
  inspectorName: string;
  notes: string;
}

function useCurrentTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatTimestamp(date: Date) {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
}

export function CameraScreen({
  locationEnabled,
  onToggleLocation,
  onOpenSettings,
  onCapture,
  agencyName,
  inspectorName,
  notes,
}: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [location] = useState("서울, 대한민국");
  const now = useCurrentTime();

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraActive(true);
        }
      } catch {
        setCameraError(true);
      }
    }
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function handleCapture() {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 150);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (cameraActive && video.videoWidth > 0) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Watermark top-right
    const padding = 24;
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Timo", canvas.width - padding, padding + 28);
    ctx.font = "18px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText(formatTimestamp(now), canvas.width - padding, padding + 56);

    // Bottom overlay
    const hasMetadata = agencyName || inspectorName || notes || locationEnabled;
    if (hasMetadata) {
      const overlayH = 100;
      const grad = ctx.createLinearGradient(0, canvas.height - overlayH, 0, canvas.height);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, canvas.height - overlayH, canvas.width, overlayH);

      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      let lineY = canvas.height - 60;
      const lineH = 24;

      if (agencyName) {
        ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(agencyName, padding, lineY);
        lineY += lineH;
      }
      ctx.font = "16px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      if (inspectorName) {
        ctx.fillText(inspectorName, padding, lineY);
        lineY += lineH;
      }
      if (notes) {
        ctx.fillText(notes, padding, lineY);
        lineY += lineH;
      }
      if (locationEnabled) {
        ctx.fillText(`📍 ${location}`, padding, lineY);
      }
    }

    onCapture(canvas.toDataURL("image/jpeg", 0.92));
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Placeholder when camera unavailable */}
      {!cameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          {cameraError ? (
            <div className="text-center px-8">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <ZapOff size={28} className="text-white/50" />
              </div>
              <p className="text-white/50 text-sm">카메라 사용 불가</p>
              <p className="text-white/30 text-xs mt-1">미리보기 모드</p>
            </div>
          ) : (
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)" }} />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }} />

      {/* Shutter flash */}
      {shutterFlash && (
        <div className="absolute inset-0 bg-white/30 pointer-events-none z-50" />
      )}

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 px-5 pt-12 pb-2 flex items-start justify-between z-10">
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-white/60" />
          <span className="text-white/60 text-xs tracking-wide">{location}</span>
          <span className="text-white/25 text-xs">·</span>
          <span className="text-xs tracking-wide"
            style={{ color: locationEnabled ? "#60a5fa" : "rgba(255,255,255,0.4)" }}>
            GPS {locationEnabled ? "켜짐" : "꺼짐"}
          </span>
        </div>

        {/* Watermark */}
        <div className="text-right">
          <div className="text-white/80 tracking-wider" style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "0.08em" }}>
            Timo
          </div>
          <div className="text-white/45 tabular-nums" style={{ fontSize: "10px", letterSpacing: "0.02em", marginTop: "2px" }}>
            {formatTimestamp(now)}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 inset-x-0 px-8 pb-12 pt-6 z-10">
        <div className="flex items-center justify-between">
          {/* Location toggle chip */}
          <button
            onClick={onToggleLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200"
            style={{
              background: locationEnabled ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.12)",
              border: `1px solid ${locationEnabled ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.15)"}`,
              backdropFilter: "blur(8px)",
            }}>
            <MapPin size={12} style={{ color: locationEnabled ? "#60a5fa" : "rgba(255,255,255,0.55)" }} />
            <span className="text-xs font-medium" style={{ color: locationEnabled ? "#93c5fd" : "rgba(255,255,255,0.55)" }}>
              {locationEnabled ? "위치 켜짐" : "위치 꺼짐"}
            </span>
          </button>

          {/* Shutter */}
          <button
            onClick={handleCapture}
            className="relative flex items-center justify-center transition-transform duration-100 active:scale-95"
            style={{ width: 76, height: 76 }}>
            <div className="absolute inset-0 rounded-full" style={{ border: "3px solid rgba(255,255,255,0.85)" }} />
            <div className="w-16 h-16 rounded-full bg-white shadow-lg" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }} />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity duration-150 active:opacity-60"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
            <Settings size={18} className="text-white/80" />
          </button>
        </div>
      </div>
    </div>
  );
}
