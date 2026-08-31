import { useState } from "react";

import PositionsSection from "../../components/hr/Candidates/PositionsSection";
import ApplicationsSection from "../../components/hr/Candidates/ApplicationsSection";

export default function Candidates() {
  const [selectedPosition, setSelectedPosition] = useState(null);

  return (
    <div className="p-16 flex flex-col">

      {/* POSITIONS */}
      {!selectedPosition && (
        <PositionsSection
          onSelectPosition={setSelectedPosition}
        />
      )}

      {/* APPLICATIONS */}
      {selectedPosition && (
        <ApplicationsSection
          position={selectedPosition}
          onBack={() => setSelectedPosition(null)}
        />
      )}

    </div>
  );
}

