import React from 'react';
import RiskAnalysis from '../components/RiskAnalysis';

export default function RiskAnalysisView({ selectedWell, depthBuffer = 150 }) {
  return <RiskAnalysis selectedWell={selectedWell} depthBuffer={depthBuffer} />;
}
