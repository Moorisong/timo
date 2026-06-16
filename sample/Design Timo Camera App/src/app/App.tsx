import { useState } from "react";
import { CameraScreen } from "./components/CameraScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { PreviewScreen } from "./components/PreviewScreen";
import { motion, AnimatePresence } from "motion/react";

type Screen = "camera" | "settings" | "preview";

export default function App() {
  const [screen, setScreen] = useState<Screen>("camera");
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [agencyName, setAgencyName] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [notes, setNotes] = useState("");
  const [capturedDataUrl, setCapturedDataUrl] = useState<string>("");

  function handleCapture(dataUrl: string) {
    setCapturedDataUrl(dataUrl);
    setScreen("preview");
  }

  function handleSaveSettings() {
    setScreen("camera");
  }

  return (
    /* MARKER-MAKE-KIT-INVOKED */
    <div
      className="flex items-center justify-center w-full min-h-screen bg-black"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Mobile frame */}
      <div
        className="relative overflow-hidden bg-black"
        style={{
          width: "min(390px, 100vw)",
          height: "min(844px, 100dvh)",
          borderRadius: "min(44px, 5vw)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.8)",
        }}>
        <AnimatePresence mode="wait">
          {screen === "camera" && (
            <motion.div
              key="camera"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <CameraScreen
                locationEnabled={locationEnabled}
                onToggleLocation={() => setLocationEnabled((v) => !v)}
                onOpenSettings={() => setScreen("settings")}
                onCapture={handleCapture}
                agencyName={agencyName}
                inspectorName={inspectorName}
                notes={notes}
              />
            </motion.div>
          )}

          {screen === "settings" && (
            <motion.div
              key="settings"
              className="absolute inset-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}>
              <SettingsScreen
                agencyName={agencyName}
                inspectorName={inspectorName}
                notes={notes}
                onAgencyName={setAgencyName}
                onInspectorName={setInspectorName}
                onNotes={setNotes}
                onSave={handleSaveSettings}
                onBack={() => setScreen("camera")}
              />
            </motion.div>
          )}

          {screen === "preview" && (
            <motion.div
              key="preview"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}>
              <PreviewScreen
                dataUrl={capturedDataUrl}
                onClose={() => setScreen("camera")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
