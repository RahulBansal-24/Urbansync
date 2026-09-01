'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import {
  LayerCategory,
  GeoJsonFeatureCollection,
  GeoJsonFeature,
  SmartRouteResponse,
  SimulationResult
} from '../../types/city';

const TOMTOM_TOKEN = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || 'placeholder_tomtom_api_key_here';

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

export const CityMap: React.FC<CityMapProps> = ({
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
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre GL JS map with TomTom dark vector style
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // TomTom Orbis vector map style URL or standalone dark vector spec
    const hasValidKey = TOMTOM_TOKEN && !TOMTOM_TOKEN.includes('placeholder');
    const styleUrl = hasValidKey
      ? `https://api.tomtom.com/style/1/style/22.2.1-*?map=basic_street-dark&key=${TOMTOM_TOKEN}`
      : {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors | TomTom Orbis Fallback'
            }
          },
          layers: [
            {
              id: 'background',
              type: 'background',
              paint: { 'background-color': '#080B10' }
            },
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              paint: {
                'raster-brightness-max': 0.35,
                'raster-contrast': 0.4,
                'raster-saturation': -0.8
              }
            }
          ]
        };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl as any,
      center: [77.2090, 28.6139], // Delhi Center
      zoom: 11.5,
      pitch: 45, // 2.5D perspective camera view
      bearing: -15,
      antialias: true
    });

    map.current.on('load', () => {
      setMapLoaded(true);

      // Add 2.5D building extrusion layer if building data source exists
      if (map.current) {
        try {
          map.current.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 12,
            paint: {
              'fill-extrusion-color': '#161C28',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.6
            }
          });
        } catch (e) {
          // Extrusion fallback for raster basemap
        }
      }
    });

    return () => {
      map.current?.remove();
    };
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

      // Hover preview & Click locking listeners
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

  return <div ref={mapContainer} className="absolute inset-0 w-full h-full bg-dark-bg" />;
};
