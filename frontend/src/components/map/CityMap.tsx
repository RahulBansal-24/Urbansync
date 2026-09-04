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
  selectedRouteCandidateId?: string;
  simulationResult: SimulationResult | null;
  searchedLocation?: { name: string; coords: [number, number] } | null;
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
  selectedRouteCandidateId,
  simulationResult,
  searchedLocation,
  onHoverFeature,
  onClickFeature
}, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const routeMarkersRef = useRef<maplibregl.Marker[]>([]);
  const searchMarkerRef = useRef<maplibregl.Marker | null>(null);
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
      // Constrain map view strictly to Delhi NCR region
      const DELHI_NCR_BOUNDS: maplibregl.LngLatBoundsLike = [
        [76.70, 28.20], // Southwest [Longitude, Latitude]
        [77.60, 29.10]  // Northeast [Longitude, Latitude]
      ];

      const mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: styleObject,
        center: [77.2090, 28.6139], // Delhi Center [Longitude, Latitude]
        zoom: 11.5,
        minZoom: 10,
        maxBounds: DELHI_NCR_BOUNDS,
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
          visibility: activeCategory === 'WEATHER' ? 'visible' : 'none'
        },
        paint: {
          'fill-color': [
            'coalesce',
            ['get', 'color_hex', ['get', 'extra_metadata']],
            ['get', 'color_hex'],
            '#3B82F6'
          ],
          'fill-opacity': 0.32,
          'fill-outline-color': [
            'coalesce',
            ['get', 'color_hex', ['get', 'extra_metadata']],
            ['get', 'color_hex'],
            '#00F0FF'
          ]
        }
      });

      // Attach click and cursor pointer handlers to weather fill layer
      map.current.on('click', layerId, (e) => {
        if (e.features && e.features.length > 0) {
          const rawFeat = e.features[0];
          const props = { ...(rawFeat.properties || {}) };

          if (typeof props.extra_metadata === 'string') {
            try { props.extra_metadata = JSON.parse(props.extra_metadata); } catch (err) {}
          }
          if (typeof props.impact_scores === 'string') {
            try { props.impact_scores = JSON.parse(props.impact_scores); } catch (err) {}
          }

          const feat: GeoJsonFeature = {
            type: 'Feature',
            geometry: rawFeat.geometry as any,
            properties: props as any
          };
          onClickFeature(feat);
        }
      });

      map.current.on('mouseenter', layerId, () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', layerId, () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    }

    if (map.current.getLayer(layerId)) {
      map.current.setLayoutProperty(
        layerId,
        'visibility',
        activeCategory === 'WEATHER' ? 'visible' : 'none'
      );
    }
  }, [weatherGrid, activeCategory, mapLoaded]);

  // Update Public Transit Route Lines Overlay (Metro & Bus Corridors)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const sourceId = 'transit-routes-source';
    const layerId = 'transit-routes-layer';

    // Filter features that are LineString (transit routes)
    const lineFeatures = (transitStops?.features || []).filter(
      (f) => f.geometry?.type === 'LineString' || f.properties?.type === 'TRANSIT_ROUTE'
    );

    const routesGeoJSON = {
      type: 'FeatureCollection',
      features: lineFeatures
    };

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(routesGeoJSON as any);
    } else if (lineFeatures.length > 0) {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: routesGeoJSON as any
      });

      map.current.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeCategory === 'PUBLIC TRANSIT' ? 'visible' : 'none'
        },
        paint: {
          'line-color': [
            'coalesce',
            ['get', 'line_color', ['get', 'extra_metadata']],
            ['get', 'line_color'],
            '#00F0FF'
          ],
          'line-width': 4.5,
          'line-opacity': 0.9
        }
      });
    }

    if (map.current.getLayer(layerId)) {
      map.current.setLayoutProperty(
        layerId,
        'visibility',
        activeCategory === 'PUBLIC TRANSIT' ? 'visible' : 'none'
      );
    }
  }, [transitStops, activeCategory, mapLoaded]);

  // Update Smart Route Lines Overlay & Waypoint Markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing route start/end markers
    routeMarkersRef.current.forEach((m) => m.remove());
    routeMarkersRef.current = [];

    const sourceId = 'smart-route-source';
    const recLayerId = 'smart-route-recommended-layer';
    const altLayerId = 'smart-route-alt-layer';

    if (!smartRouteResult) {
      if (map.current.getLayer(recLayerId)) map.current.removeLayer(recLayerId);
      if (map.current.getLayer(altLayerId)) map.current.removeLayer(altLayerId);
      if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
      routeMarkersRef.current.forEach((m) => m.remove());
      routeMarkersRef.current = [];
      return;
    }

    const activeRouteId = selectedRouteCandidateId || smartRouteResult.recommended_route_id;
    const selectedRoute = smartRouteResult.routes.find((r) => r.id === activeRouteId);
    const unselectedRoutes = smartRouteResult.routes.filter((r) => r.id !== activeRouteId);

    // Create Start & End HTML Markers
    if (selectedRoute && selectedRoute.geometry?.coordinates?.length) {
      const coords = selectedRoute.geometry.coordinates;
      const startCoord = coords[0];
      const endCoord = coords[coords.length - 1];

      if (startCoord && startCoord.length >= 2) {
        const elStart = document.createElement('div');
        elStart.className = 'custom-route-marker cursor-pointer transition-transform hover:scale-110';
        elStart.innerHTML = `
          <div class="px-2.5 py-1 rounded-full bg-emerald-600 border-2 border-white text-white font-mono text-[11px] font-extrabold shadow-glow-cyan flex items-center space-x-1">
            <span>🟢</span><span>START</span>
          </div>
        `;
        const startMarker = new maplibregl.Marker({ element: elStart })
          .setLngLat([Number(startCoord[0]), Number(startCoord[1])])
          .addTo(map.current!);
        routeMarkersRef.current.push(startMarker);
      }

      if (endCoord && endCoord.length >= 2) {
        const elEnd = document.createElement('div');
        elEnd.className = 'custom-route-marker cursor-pointer transition-transform hover:scale-110';
        elEnd.innerHTML = `
          <div class="px-2.5 py-1 rounded-full bg-red-600 border-2 border-white text-white font-mono text-[11px] font-extrabold shadow-glow-red flex items-center space-x-1">
            <span>🔴</span><span>END</span>
          </div>
        `;
        const endMarker = new maplibregl.Marker({ element: elEnd })
          .setLngLat([Number(endCoord[0]), Number(endCoord[1])])
          .addTo(map.current!);
        routeMarkersRef.current.push(endMarker);
      }

      // Smoothly fit map view bounds to the selected route candidate
      try {
        const bounds = new maplibregl.LngLatBounds();
        coords.forEach((c: any) => bounds.extend([Number(c[0]), Number(c[1])]));
        map.current.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 800 });
      } catch (e) {
        console.warn('[UrbanSync Map] Could not fit map bounds:', e);
      }
    }

    const geojsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: selectedRoute?.geometry,
          properties: { type: 'SELECTED' }
        },
        ...unselectedRoutes.map((alt) => ({
          type: 'Feature',
          geometry: alt.geometry,
          properties: { type: 'UNSELECTED' }
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
        filter: ['==', ['get', 'type'], 'UNSELECTED'],
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#64748B',
          'line-width': 4,
          'line-dasharray': [2, 2],
          'line-opacity': 0.6
        }
      });

      map.current.addLayer({
        id: recLayerId,
        type: 'line',
        source: sourceId,
        filter: ['==', ['get', 'type'], 'SELECTED'],
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00F0FF',
          'line-width': 7,
          'line-opacity': 0.95
        }
      });
    }
  }, [smartRouteResult, selectedRouteCandidateId, mapLoaded]);

  // Update Simulation AI Reroute Line & Markers Overlay
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const sourceId = 'sim-route-source';
    const layerId = 'sim-route-layer';

    if (!simulationResult || !simulationResult.optimal_reroute) {
      if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
      if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
      routeMarkersRef.current.forEach((m) => m.remove());
      routeMarkersRef.current = [];
      return;
    }

    const reroute = simulationResult.optimal_reroute;
    const coords = reroute.geometry?.coordinates;

    if (coords && coords.length >= 2) {
      const startCoord = coords[0];
      const endCoord = coords[coords.length - 1];

      // Add Start & End Markers
      if (startCoord && startCoord.length >= 2) {
        const elStart = document.createElement('div');
        elStart.className = 'custom-route-marker cursor-pointer transition-transform hover:scale-110';
        elStart.innerHTML = `
          <div class="px-2.5 py-1 rounded-full bg-emerald-600 border-2 border-white text-white font-mono text-[11px] font-extrabold shadow-glow-cyan flex items-center space-x-1">
            <span>🟢</span><span>START</span>
          </div>
        `;
        const startMarker = new maplibregl.Marker({ element: elStart })
          .setLngLat([Number(startCoord[0]), Number(startCoord[1])])
          .addTo(map.current!);
        routeMarkersRef.current.push(startMarker);
      }

      if (endCoord && endCoord.length >= 2) {
        const elEnd = document.createElement('div');
        elEnd.className = 'custom-route-marker cursor-pointer transition-transform hover:scale-110';
        elEnd.innerHTML = `
          <div class="px-2.5 py-1 rounded-full bg-red-600 border-2 border-white text-white font-mono text-[11px] font-extrabold shadow-glow-red flex items-center space-x-1">
            <span>🔴</span><span>END</span>
          </div>
        `;
        const endMarker = new maplibregl.Marker({ element: elEnd })
          .setLngLat([Number(endCoord[0]), Number(endCoord[1])])
          .addTo(map.current!);
        routeMarkersRef.current.push(endMarker);
      }

      // Smoothly fit map view bounds
      try {
        const bounds = new maplibregl.LngLatBounds();
        coords.forEach((c: any) => bounds.extend([Number(c[0]), Number(c[1])]));
        map.current.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 800 });
      } catch (e) {
        console.warn('[UrbanSync Map] Could not fit simulation map bounds:', e);
      }
    }

    const geojsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: reroute.geometry,
          properties: {}
        }
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
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00F0FF',
          'line-width': 7,
          'line-opacity': 0.95
        }
      });
    }
  }, [simulationResult, mapLoaded]);

  // Update Searched Location Red Pin Needle Marker Overlay
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove();
      searchMarkerRef.current = null;
    }

    if (!searchedLocation || !searchedLocation.coords) return;

    const [lng, lat] = searchedLocation.coords;
    if (isNaN(lng) || isNaN(lat)) return;

    // Create classic Google Maps Red Drop Pin Needle HTML element
    const el = document.createElement('div');
    el.className = 'custom-search-pin cursor-pointer transition-transform hover:scale-125';
    el.innerHTML = `
      <div class="relative flex flex-col items-center -translate-y-full">
        <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white text-white font-extrabold text-sm flex items-center justify-center shadow-glow-red animate-pulse">
          📍
        </div>
        <div class="w-1 h-3 bg-red-600 shadow-md"></div>
        <div class="w-3 h-1 bg-black/40 rounded-full blur-[1px]"></div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map.current);

    searchMarkerRef.current = marker;

    try {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14.5,
        duration: 1000,
        essential: true
      });
    } catch (e) {
      console.warn('[UrbanSync Map] Could not fly to searched location:', e);
    }
  }, [searchedLocation, mapLoaded]);

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
    if (trafficIncidents) {
      const filteredIncidents = trafficIncidents.features.filter((f) => {
        const type = f.properties.type;
        if (activeCategory === 'ALL') return true;
        if (activeCategory === 'TRAFFIC') return type === 'TRAFFIC' || type === 'CONGESTION';
        if (activeCategory === 'ACCIDENTS') return type === 'ACCIDENT';
        if (activeCategory === 'ROAD BLOCKS') return type === 'ROAD_BLOCK' || type === 'ROAD_WORK' || type === 'LANE_CLOSURE';
        return false;
      });
      allFeatures.push(...filteredIncidents);
    }
    if (['ALL', 'ROAD BLOCKS'].includes(activeCategory) && roadBlocks) {
      allFeatures.push(...roadBlocks.features);
    }
    if (['ALL', 'HOSPITALS'].includes(activeCategory) && hospitals) {
      allFeatures.push(...hospitals.features);
    }
    if (activeCategory === 'PUBLIC TRANSIT' && transitStops) {
      const pointStops = transitStops.features.filter(
        (f) => f.geometry?.type === 'Point' || f.properties?.type === 'TRANSIT'
      );
      allFeatures.push(...pointStops);
    }

    console.log(`[UrbanSync Map] Rendering ${allFeatures.length} markers for category: ${activeCategory}`);

    allFeatures.forEach((feat) => {
      const { type } = feat.properties;
      const coords = feat.geometry?.coordinates;
      if (!coords || coords.length === 0) return;

      let lng: number;
      let lat: number;

      if (Array.isArray(coords[0])) {
        // Geometry is LineString or MultiPoint
        lng = Number(coords[0][0]);
        lat = Number(coords[0][1]);
      } else {
        // Geometry is Point
        lng = Number(coords[0]);
        lat = Number(coords[1]);
      }

      if (isNaN(lng) || isNaN(lat)) return;

      const el = document.createElement('div');
      el.className = 'custom-city-marker cursor-pointer transition-transform hover:scale-125';

      let colorBg = 'bg-cyan-brand border-cyan-glow';
      let iconSymbol = '●';
      let customStyle = '';

      if (type === 'EVENT') {
        colorBg = 'bg-pink-500 border-pink-300 shadow-glow-purple';
        iconSymbol = '★';
      } else if (type === 'ACCIDENT') {
        colorBg = 'bg-red-600 border-red-400 pulse-marker-red shadow-glow-red';
        iconSymbol = '⚠';
      } else if (type === 'ROAD_BLOCK' || type === 'ROAD_WORK' || type === 'LANE_CLOSURE') {
        colorBg = 'bg-amber-600 border-amber-300 shadow-glow-orange';
        iconSymbol = '🚧';
      } else if (type === 'TRAFFIC' || type === 'CONGESTION') {
        colorBg = 'bg-yellow-500 border-yellow-300';
        iconSymbol = '🚗';
      } else if (type === 'HOSPITAL') {
        colorBg = 'bg-cyan-500 border-cyan-300 shadow-glow-cyan';
        iconSymbol = '✚';
      } else if (type === 'TRANSIT') {
        const transitType = feat.properties.extra_metadata?.transit_type || 'METRO';
        const lineColor = feat.properties.extra_metadata?.line_color;
        if (transitType === 'BUS') {
          colorBg = 'bg-sky-500 border-sky-300 shadow-glow-cyan';
          iconSymbol = '🚌';
        } else {
          colorBg = 'border-white text-black font-extrabold';
          customStyle = `background-color: ${lineColor || '#10B981'}; color: #ffffff;`;
          iconSymbol = '🚅';
        }
      }

      el.innerHTML = `
        <div class="w-7 h-7 rounded-full ${colorBg} border-2 flex items-center justify-center font-bold text-xs shadow-lg" style="${customStyle}">
          ${iconSymbol}
        </div>
      `;

      el.addEventListener('mouseenter', () => onHoverFeature(feat));
      el.addEventListener('mouseleave', () => onHoverFeature(null));
      el.addEventListener('click', () => onClickFeature(feat));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [
    activeCategory,
    events,
    trafficIncidents,
    roadBlocks,
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
