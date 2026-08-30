import { useState } from "react";
import PositionsSection from "../../components/hr/Candidates/PositionsSection";
import ApplicationsSection from "../../components/hr/Candidates/ApplicationsSection";


export default function Candidates() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleSelectPosition = (position) => {
    setSelectedPosition(position);
    setSelectedApplication(null);
  };

  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
  };

  const handleBackToPositions = () => {
    setSelectedPosition(null);
    setSelectedApplication(null);
  };

  const handleBackToApplications = () => {
    setSelectedApplication(null);
  };

  return (
    <div className="flex flex-col gap-14 p-14">
      {!selectedPosition && (
        <PositionsSection
          onSelectPosition={handleSelectPosition}
        />
      )}

      {selectedPosition && !selectedApplication && (
        <ApplicationsSection
          position={selectedPosition}
          onBack={handleBackToPositions}
          onSelectApplication={handleSelectApplication}
        />
      )}

      {/* {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          position={selectedPosition}
          onBack={handleBackToApplications}
        />
      )} */}
    </div>
  );
}