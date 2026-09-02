'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  LayerCategory,
  GeoJsonFeatureCollection,
  GeoJsonFeature,
  SmartRouteResponse,
  SimulationResult
} from '../../types/city';

const TOMTOM_TOKEN = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || '';

export interface CityMapRef {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  locateMe: () => void;
  togglePitch: () => void;
}

interface CityMapProps {
  activeCategory: LayerCategory;
  events: GeoJsonFeatureCollection | null;
  trafficIncidents: GeoJsonFeatureCollection | null;
  roadBlocks: GeoJsonFeatureCollection | null;
  weatherGrid: GeoJsonFeatureCollection | null;
  hospitals: GeoJsonFeatureCollection | null;
  transitStops: GeoJsonFeatureCollection | null;
  smartRouteResult: SmartRouteResponse | null;
  simulationResult: SimulationResult | null;
  onHoverFeature: (feature: GeoJsonFeature | null) => void;
  onClickFeature: (feature: GeoJsonFeature) => void;
}

export const CityMap = forwardRef<CityMapRef, CityMapProps>(({
  activeCategory,
  events,
  trafficIncidents,
  roadBlocks,
  weatherGrid,
  hospitals,
  transitStops,
  smartRouteResult,
  simulationResult,
  onHoverFeature,
  onClickFeature
}, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3DPitched, setIs3DPitched] = useState(true);

  // Expose control methods to parent component via ref
  useImperativeHandle(ref, () => ({
    zoomIn: () => map.current?.zoomIn(),
    zoomOut: () => map.current?.zoomOut(),
    resetView: () => {
      map.current?.flyTo({
        center: [77.2090, 28.6139],
        zoom: 11.5,
        pitch: 45,
        bearing: -15,
        essential: true
      });
    },
    locateMe: () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          map.current?.flyTo({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 14,
            essential: true
          });
        });
      }
    },
    togglePitch: () => {
      const nextPitch = is3DPitched ? 0 : 45;
      setIs3DPitched(!is3DPitched);
      map.current?.easeTo({ pitch: nextPitch, duration: 600 });
    }
  }));

  // Initialize MapLibre GL JS map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const hasValidKey = TOMTOM_TOKEN && !TOMTOM_TOKEN.includes('placeholder');
    
    // Construct TomTom Night Raster Basemap with automatic fallback to CartoDB Dark Matter
    const styleObject: any = hasValidKey
      ? {
          version: 8,
          sources: {
            'tomtom-basemap-source': {
              type: 'raster',
              tiles: [
                `https://api.tomtom.com/map/1/tile/basic/night/{z}/{x}/{y}.png?key=${TOMTOM_TOKEN}`
              ],
              tileSize: 256,
              maxzoom: 22
            }
          },
          layers: [
            {
              id: 'background',
              type: 'background',
              paint: { 'background-color': '#080B10' }
            },
            {
              id: 'tomtom-basemap-layer',
              type: 'raster',
              source: 'tomtom-basemap-source',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        }
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    console.log(`[UrbanSync Map] Initializing MapLibre GL JS with ${hasValidKey ? 'TomTom Night Map API' : 'CartoDB Dark Vector Basemap'}`);

    try {
      const mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: styleObject,
        center: [77.2090, 28.6139], // Delhi Center [Longitude, Latitude]
        zoom: 11.5,
        pitch: 45,
        bearing: -15,
        antialias: true
      });

      map.current = mapInstance;

      // Attach ResizeObserver to dynamically resize WebGL canvas whenever container bounds change
      const resizeObserver = new ResizeObserver(() => {
        if (map.current) {
          map.current.resize();
        }
      });
      if (mapContainer.current) {
        resizeObserver.observe(mapContainer.current);
      }

      mapInstance.on('style.load', () => {
        console.log('[UrbanSync Map] Map style loaded successfully!');
      });

      mapInstance.on('error', (e) => {
        console.warn('[UrbanSync Map Event Notice]:', e.error?.message || e);
        // Fallback to CartoDB vector basemap if primary style tiles fail
        if (hasValidKey && e.error?.message?.includes('401') && map.current) {
          console.warn('[UrbanSync Map Fallback] Switching to CartoDB dark vector basemap...');
          map.current.setStyle('https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json');
        }
      });

      mapInstance.on('load', () => {
        console.log('[UrbanSync Map] Map rendering active and fully loaded!');
        setMapLoaded(true);
        mapInstance.resize();
      });

      // Force initial container resize
      requestAnimationFrame(() => mapInstance.resize());
      setTimeout(() => mapInstance.resize(), 200);

      return () => {
        resizeObserver.disconnect();
        mapInstance.remove();
        map.current = null;
      };
    } catch (err) {
      console.error('[UrbanSync Map Fatal Error]:', err);
    }
  }, []);

  // Update Weather Polygons Overlay
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const sourceId = 'weather-source';
    const layerId = 'weather-layer';

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(
        (weatherGrid as any) || { type: 'FeatureCollection', features: [] }
      );
    } else if (weatherGrid) {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: weatherGrid as any
      });

      map.current.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        layout: {
          visibility: ['WEATHER', 'ALL'].includes(activeCategory) ? 'visible' : 'none'
        },
        paint: {
          'fill-color': '#3B82F6',
          'fill-opacity': 0.18,
          'fill-outline-color': '#00F0FF'
        }
      });
    }

    if (map.current.getLayer(layerId)) {
      map.current.setLayoutProperty(
        layerId,
        'visibility',
        ['WEATHER', 'ALL'].includes(activeCategory) ? 'visible' : 'none'
      );
    }
  }, [weatherGrid, activeCategory, mapLoaded]);

  // Update Smart Route Lines Overlay
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const sourceId = 'smart-route-source';
    const recLayerId = 'smart-route-recommended-layer';
    const altLayerId = 'smart-route-alt-layer';

    if (!smartRouteResult) {
      if (map.current.getLayer(recLayerId)) map.current.removeLayer(recLayerId);
      if (map.current.getLayer(altLayerId)) map.current.removeLayer(altLayerId);
      if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
      return;
    }

    const recRoute = smartRouteResult.routes.find((r) => r.id === smartRouteResult.recommended_route_id);
    const altRoutes = smartRouteResult.routes.filter((r) => r.id !== smartRouteResult.recommended_route_id);

    const geojsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: recRoute?.geometry,
          properties: { type: 'RECOMMENDED' }
        },
        ...altRoutes.map((alt) => ({
          type: 'Feature',
          geometry: alt.geometry,
          properties: { type: 'ALTERNATIVE' }
        }))
      ]
    };

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojsonData as any);
    } else {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData as any
      });

      map.current.addLayer({
        id: altLayerId,
        type: 'line',
        source: sourceId,
        filter: ['==', 'type', 'ALTERNATIVE'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#64748B',
          'line-width': 4,
          'line-opacity': 0.6,
          'line-dasharray': [2, 2]
        }
      });

      map.current.addLayer({
        id: recLayerId,
        type: 'line',
        source: sourceId,
        filter: ['==', 'type', 'RECOMMENDED'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#00F0FF',
          'line-width': 7,
          'line-opacity': 0.95
        }
      });
    }
  }, [smartRouteResult, mapLoaded]);

  // Update Category HTML Markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const allFeatures: GeoJsonFeature[] = [];

    if (['ALL', 'EVENTS'].includes(activeCategory) && events) {
      allFeatures.push(...events.features);
    }
    if (['ALL', 'TRAFFIC', 'ACCIDENTS'].includes(activeCategory) && trafficIncidents) {
      allFeatures.push(...trafficIncidents.features);
    }
    if (['ALL', 'HOSPITALS'].includes(activeCategory) && hospitals) {
      allFeatures.push(...hospitals.features);
    }
    if (['ALL', 'PUBLIC TRANSIT'].includes(activeCategory) && transitStops) {
      allFeatures.push(...transitStops.features);
    }

    console.log(`[UrbanSync Map] Rendering ${allFeatures.length} markers for category: ${activeCategory}`);

    allFeatures.forEach((feat) => {
      const { type } = feat.properties;
      const coords = feat.geometry.coordinates;
      if (!coords || coords.length < 2) return;

      const el = document.createElement('div');
      el.className = 'custom-city-marker cursor-pointer transition-transform hover:scale-125';

      let colorBg = 'bg-cyan-brand border-cyan-glow';
      let iconSymbol = '●';

      if (type === 'EVENT') {
        colorBg = 'bg-pink-500 border-pink-300 shadow-glow-purple';
        iconSymbol = '★';
      } else if (type === 'ACCIDENT') {
        colorBg = 'bg-red-600 border-red-400 pulse-marker-red shadow-glow-red';
        iconSymbol = '⚠';
      } else if (type === 'TRAFFIC') {
        colorBg = 'bg-amber-500 border-amber-300';
        iconSymbol = '🚗';
      } else if (type === 'HOSPITAL') {
        colorBg = 'bg-cyan-500 border-cyan-300 shadow-glow-cyan';
        iconSymbol = '✚';
      } else if (type === 'TRANSIT') {
        colorBg = 'bg-emerald-500 border-emerald-300';
        iconSymbol = 'Ⓜ';
      }

      el.innerHTML = `
        <div class="w-7 h-7 rounded-full ${colorBg} border-2 text-white flex items-center justify-center font-bold text-xs shadow-lg">
          ${iconSymbol}
        </div>
      `;

      el.addEventListener('mouseenter', () => onHoverFeature(feat));
      el.addEventListener('mouseleave', () => onHoverFeature(null));
      el.addEventListener('click', () => onClickFeature(feat));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([coords[0], coords[1]])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [
    activeCategory,
    events,
    trafficIncidents,
    hospitals,
    transitStops,
    mapLoaded
  ]);

  return (
    <div className="absolute inset-0 w-full h-full min-h-screen overflow-hidden bg-dark-bg z-0">
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-screen bg-dark-bg"
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
});

CityMap.displayName = 'CityMap';
