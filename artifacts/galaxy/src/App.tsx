import { AppStateProvider, useAppState } from "@/lib/store";
import { Scene } from "@/components/Scene";
import { Overlay } from "@/components/Overlay";
import { Sidebar } from "@/components/Sidebar";
import { FlyCockpit } from "@/components/FlyCockpit";
import { DatasetLoadingOverlay } from "@/components/DatasetLoadingOverlay";

// Everything that reads the (swappable) dataset lives under a key={datasetVersion}
// wrapper so loading a new scientist fully remounts the 3D scene and panels,
// re-registering all object refs against the freshly rebuilt galaxy.
function GalaxyView() {
  const { datasetVersion } = useAppState();
  return (
    <div key={datasetVersion} className="flex h-full w-full">
      {/* Galaxy display — the console is a separate column to the right, so the
          3D viewport never extends underneath it. */}
      <div className="relative flex-1 overflow-hidden">
        <Scene />
        <FlyCockpit />
        <Overlay />
      </div>
      <Sidebar />
    </div>
  );
}

function App() {
  return (
    <AppStateProvider>
      <div className="w-screen h-[100dvh] bg-black text-foreground overflow-hidden relative font-sans">
        <GalaxyView />
        <DatasetLoadingOverlay />
      </div>
    </AppStateProvider>
  );
}

export default App;
