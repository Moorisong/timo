import { ArrowLeft, Save, FileText, User, Building2, StickyNote } from "lucide-react";

interface SettingsScreenProps {
  agencyName: string;
  inspectorName: string;
  notes: string;
  onAgencyName: (v: string) => void;
  onInspectorName: (v: string) => void;
  onNotes: (v: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export function SettingsScreen({
  agencyName,
  inspectorName,
  notes,
  onAgencyName,
  onInspectorName,
  onNotes,
  onSave,
  onBack,
}: SettingsScreenProps) {
  return (
    <div className="relative w-full h-full bg-background overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-12 pb-4"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity active:opacity-50"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <h1 className="text-foreground" style={{ fontSize: "20px", fontWeight: 600 }}>설정</h1>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Metadata section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground uppercase tracking-widest" style={{ fontSize: "11px", fontWeight: 600 }}>
              보고서 정보
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Agency Name */}
            <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={14} style={{ color: "#60a5fa" }} />
                <label className="text-xs font-medium text-muted-foreground">기관명</label>
                <span className="ml-auto text-xs text-muted-foreground/60">{agencyName.length}/20</span>
              </div>
              <input
                value={agencyName}
                onChange={(e) => onAgencyName(e.target.value.slice(0, 20))}
                placeholder="예: 환경부 한강유역환경청"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none"
                style={{ fontSize: "15px", fontWeight: 400 }}
              />
            </div>

            {/* Inspector Name */}
            <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2 mb-2">
                <User size={14} style={{ color: "#60a5fa" }} />
                <label className="text-xs font-medium text-muted-foreground">담당자명</label>
                <span className="ml-auto text-xs text-muted-foreground/60">{inspectorName.length}/10</span>
              </div>
              <input
                value={inspectorName}
                onChange={(e) => onInspectorName(e.target.value.slice(0, 10))}
                placeholder="예: 김준호"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none"
                style={{ fontSize: "15px", fontWeight: 400 }}
              />
            </div>

            {/* Notes */}
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote size={14} style={{ color: "#60a5fa" }} />
                <label className="text-xs font-medium text-muted-foreground">메모</label>
                <span className="ml-auto text-xs text-muted-foreground/60">{notes.length}/20</span>
              </div>
              <input
                value={notes}
                onChange={(e) => onNotes(e.target.value.slice(0, 20))}
                placeholder="예: 현장 점검 #047"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none"
                style={{ fontSize: "15px", fontWeight: 400 }}
              />
            </div>
          </div>

          <p className="mt-2.5 px-1 text-muted-foreground/60" style={{ fontSize: "12px" }}>
            입력된 항목은 촬영 사진에 자동으로 표시됩니다.
          </p>
        </div>

        {/* Preview of what gets stamped */}
        {(agencyName || inspectorName || notes) && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-muted-foreground uppercase tracking-widest" style={{ fontSize: "11px", fontWeight: 600 }}>
                사진 미리보기
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden relative" style={{ background: "#111", aspectRatio: "4/3" }}>
              {/* Simulated scene */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }} />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.15) 0%, transparent 60%)" }} />

              {/* Top-right watermark */}
              <div className="absolute top-3 right-4 text-right">
                <div className="text-white/85 tracking-wider" style={{ fontSize: "13px", fontWeight: 600 }}>Timo</div>
                <div className="text-white/50 tabular-nums" style={{ fontSize: "9px" }}>2026-06-16 14:32:10</div>
              </div>

              {/* Bottom overlay */}
              <div className="absolute bottom-0 inset-x-0 px-4 py-3"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}>
                {agencyName && (
                  <div className="text-white/90" style={{ fontSize: "12px", fontWeight: 600 }}>{agencyName}</div>
                )}
                {inspectorName && (
                  <div className="text-white/70" style={{ fontSize: "10px" }}>{inspectorName}</div>
                )}
                {notes && (
                  <div className="text-white/60" style={{ fontSize: "10px" }}>{notes}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={onSave}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-98"
          style={{ background: "#3b82f6", boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}>
          <Save size={16} className="text-white" />
          <span className="text-white" style={{ fontSize: "15px", fontWeight: 600 }}>설정 저장</span>
        </button>

        <div className="h-8" />
      </div>
    </div>
  );
}
