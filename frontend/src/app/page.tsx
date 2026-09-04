'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from '../components/navigation/TopBar';
import { CategoryBar } from '../components/navigation/CategoryBar';
import { SystemStatusModal } from '../components/navigation/SystemStatusModal';
import { CityMap, CityMapRef } from '../components/map/CityMap';
import { MapLegend } from '../components/map/MapLegend';
import { MapControls } from '../components/map/MapControls';
import { DetailPanel } from '../components/panels/DetailPanel';
import { SmartRoutePanel } from '../components/routing/SmartRoutePanel';
import { SimulationPanel } from '../components/simulation/SimulationPanel';
import { SimulationReasoningPanel } from '../components/simulation/SimulationReasoningPanel';
import { HospitalRankerPanel } from '../components/hospitals/HospitalRankerPanel';
import { AIAssistantWidget } from '../components/assistant/AIAssistantWidget';

import {
  LayerCategory,
  GeoJsonFeatureCollection,
  GeoJsonFeature,
  SmartRouteResponse,
  SimulationResult,
  SystemStatusResponse,
  RouteCandidate
} from '../types/city';

import {
  fetchEvents,
  fetchTrafficIncidents,
  fetchRoadBlocks,
  fetchWeatherGrid,
  fetchHospitals,
  fetchTransitStops,
  fetchSystemHealth,
  connectWebSocket
} from '../services/api';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<LayerCategory>('ALL');
  const cityMapRef = useRef<CityMapRef>(null);

  // City Data Collections
  const [eventsData, setEventsData] = useState<GeoJsonFeatureCollection | null>(null);
  const [trafficData, setTrafficData] = useState<GeoJsonFeatureCollection | null>(null);
  const [roadBlocksData, setRoadBlocksData] = useState<GeoJsonFeatureCollection | null>(null);
  const [weatherData, setWeatherData] = useState<GeoJsonFeatureCollection | null>(null);
  const [hospitalsData, setHospitalsData] = useState<GeoJsonFeatureCollection | null>(null);
  const [transitData, setTransitData] = useState<GeoJsonFeatureCollection | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemStatusResponse | null>(null);

  // Flagship AI States
  const [smartRouteResult, setSmartRouteResult] = useState<SmartRouteResponse | null>(null);
  const [selectedRouteCandidateId, setSelectedRouteCandidateId] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Panel & Hover Interaction States
  const [hoveredFeature, setHoveredFeature] = useState<GeoJsonFeature | null>(null);
  const [lockedFeature, setLockedFeature] = useState<GeoJsonFeature | null>(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Initial Data Fetching ONCE on Page Mount (No background polling loops)
  useEffect(() => {
    const loadAllDataOnStart = async () => {
      try {
        const [evs, trf, blks, wth, hsps, trn, hlth] = await Promise.all([
          fetchEvents(),
          fetchTrafficIncidents(),
          fetchRoadBlocks(),
          fetchWeatherGrid(),
          fetchHospitals(),
          fetchTransitStops(),
          fetchSystemHealth()
        ]);
        setEventsData(evs);
        setTrafficData(trf);
        setRoadBlocksData(blks);
        setWeatherData(wth);
        setHospitalsData(hsps);
        setTransitData(trn);
        setSystemHealth(hlth);
      } catch (err) {
        console.warn('Initial backend fetch notice:', err);
      }
    };

    // Single fetch on application start
    loadAllDataOnStart();

    // WebSocket live notification connection
    const ws = connectWebSocket((data) => {
      console.log('Real-Time Live Update Notification received:', data);
    });

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Category Switch Handler
  const handleSelectCategory = (cat: LayerCategory) => {
    setActiveCategory(cat);
    if (cat !== 'SMART ROUTE') {
      setSmartRouteResult(null);
      setSelectedRouteCandidateId('');
    }
    if (cat !== 'SIMULATION') setSimulationResult(null);
  };

  const selectedFeature = lockedFeature || hoveredFeature;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-dark-bg text-dark-text select-none">
      {/* Top Command Center Header */}
      <TopBar
        systemHealth={systemHealth}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
      />

      {/* Category Navigation Pills */}
      <CategoryBar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Central Full-Screen Dark Map Engine */}
      <CityMap
        ref={cityMapRef}
        activeCategory={activeCategory}
        events={eventsData}
        trafficIncidents={trafficData}
        roadBlocks={roadBlocksData}
        weatherGrid={weatherData}
        hospitals={hospitalsData}
        transitStops={transitData}
        smartRouteResult={smartRouteResult}
        selectedRouteCandidateId={selectedRouteCandidateId}
        simulationResult={simulationResult}
        onHoverFeature={(feat) => {
          if (!lockedFeature) setHoveredFeature(feat);
        }}
        onClickFeature={(feat) => setLockedFeature(feat)}
      />

      {/* Map Legend & Interactive Controls */}
      <MapLegend />
      <MapControls
        onZoomIn={() => cityMapRef.current?.zoomIn()}
        onZoomOut={() => cityMapRef.current?.zoomOut()}
        onResetView={() => cityMapRef.current?.resetView()}
        onLocateMe={() => cityMapRef.current?.locateMe()}
        onTogglePitch={() => cityMapRef.current?.togglePitch()}
      />

      {/* FLAGSHIP #1: AI Smart Route Drawer */}
      {activeCategory === 'SMART ROUTE' && (
        <SmartRoutePanel
          onRouteCalculated={(result) => {
            setSmartRouteResult(result);
            if (result.recommended_route_id) {
              setSelectedRouteCandidateId(result.recommended_route_id);
            }
          }}
          onSelectRouteCandidate={(candidate: RouteCandidate) => {
            setSelectedRouteCandidateId(candidate.id);
          }}
          onClose={() => {
            setSmartRouteResult(null);
            setSelectedRouteCandidateId('');
            setActiveCategory('ALL');
          }}
        />
      )}

      {/* FLAGSHIP #2: AI What-If City Simulation Drawer */}
      {activeCategory === 'SIMULATION' && (
        <>
          <SimulationPanel
            onSimulationRun={(result) => setSimulationResult(result)}
            onResetSimulation={() => setSimulationResult(null)}
            onClose={() => {
              setSimulationResult(null);
              setActiveCategory('ALL');
            }}
          />
          {simulationResult && (
            <SimulationReasoningPanel
              simulationResult={simulationResult}
              onClose={() => setSimulationResult(null)}
            />
          )}
        </>
      )}

      {/* Hospitals Suitability Ranker Drawer */}
      {activeCategory === 'HOSPITALS' && (
        <HospitalRankerPanel onClose={() => setActiveCategory('ALL')} />
      )}

      {/* Grounded Right-Side Information Panel */}
      {selectedFeature && (
        <DetailPanel
          feature={selectedFeature}
          onClose={() => {
            setLockedFeature(null);
            setHoveredFeature(null);
          }}
          isLocked={!!lockedFeature}
        />
      )}

      {/* Floating AI City Assistant Widget */}
      <AIAssistantWidget />

      {/* System Status Health Modal */}
      <SystemStatusModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        systemHealth={systemHealth}
      />
    </main>
  );
}
