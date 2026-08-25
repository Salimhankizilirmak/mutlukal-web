import React from 'react';
import OpenPositionsManager from './OpenPositionsManager';
import LeadsManager from './LeadsManager';

export default function JobApplicationsManager() {
  return (
    <div>
      <OpenPositionsManager />
      <LeadsManager table="job_applications" title="Gelen Başvurular" />
    </div>
  );
}
