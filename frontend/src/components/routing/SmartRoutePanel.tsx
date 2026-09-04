'use client';

import React, { useState } from 'react';
import { Navigation, ShieldCheck, AlertTriangle, CheckCircle2, Sliders, MapPin, Zap } from 'lucide-react';
import { SmartRouteResponse, RouteCandidate } from '../../types/city';
import { calculateSmartRoute } from '../../services/api';

interface SmartRoutePanelProps {
  onRouteCalculated: (result: SmartRouteResponse) => void;
  onSelectRouteCandidate: (route: RouteCandidate) => void;
  onHighlightFactor?: (factorTitle: string) => void;
  onClose: () => void;
}

export interface LocationItem {
  name: string;
  coords: [number, number];
}

export const DELHI_LOCATIONS: LocationItem[] = [
  // --- Central Delhi ---
  { name: 'Connaught Place (Rajiv Chowk)', coords: [77.2197, 28.6315] },
  { name: 'Janpath Market', coords: [77.2185, 28.6270] },
  { name: 'Mandi House Cultural Hub', coords: [77.2340, 28.6250] },
  { name: 'ITO Expressway Junction', coords: [77.2415, 28.6285] },
  { name: 'Central Secretariat', coords: [77.2110, 28.6140] },
  { name: 'Khan Market', coords: [77.2270, 28.6010] },
  { name: 'India Gate C-Hexagon', coords: [77.2290, 28.6130] },
  { name: 'Bharat Mandapam (Pragati Maidan)', coords: [77.2415, 28.6183] },
  { name: 'Supreme Court of India', coords: [77.2385, 28.6230] },
  { name: 'New Delhi Railway Station (NDLS)', coords: [77.2210, 28.6430] },
  { name: 'Old Delhi Railway Station (DLI)', coords: [77.2300, 28.6560] },
  { name: 'Chandni Chowk Red Fort', coords: [77.2300, 28.6560] },
  { name: 'Jama Masjid', coords: [77.2335, 28.6507] },
  { name: 'Chawri Bazar Market', coords: [77.2260, 28.6490] },
  { name: 'Sadar Bazar Wholesale Market', coords: [77.2120, 28.6540] },
  { name: 'Paharganj Main Bazaar', coords: [77.2140, 28.6450] },
  { name: 'Karol Bagh Ajmal Khan Road', coords: [77.1900, 28.6440] },
  { name: 'Patel Nagar East', coords: [77.1740, 28.6500] },
  { name: 'Patel Nagar West', coords: [77.1650, 28.6540] },
  { name: 'Rajendra Place Bus Terminal', coords: [77.1780, 28.6430] },
  { name: 'Jhandewalan Temple & Metro', coords: [77.2000, 28.6440] },
  { name: 'Barakhamba Road Financial District', coords: [77.2240, 28.6300] },
  { name: 'Kasturba Gandhi Marg', coords: [77.2220, 28.6250] },
  { name: 'Gole Market Historic Hub', coords: [77.2070, 28.6330] },
  { name: 'Lodhi Garden & Colony Art District', coords: [77.2200, 28.5930] },
  { name: 'Jor Bagh Metro Station', coords: [77.2160, 28.5860] },
  { name: 'Shastri Bhawan', coords: [77.2150, 28.6180] },
  { name: 'Krishi Bhawan', coords: [77.2140, 28.6190] },
  { name: 'Udyog Bhawan', coords: [77.2130, 28.6110] },
  { name: 'Nirman Bhawan', coords: [77.2180, 28.6115] },
  { name: 'Sardar Patel Marg Embassy Row', coords: [77.1850, 28.6010] },
  { name: 'Chanakyapuri Diplomatic Enclave', coords: [77.1900, 28.5900] },

  // --- South Delhi ---
  { name: 'AIIMS Hospital Ansari Nagar', coords: [77.2090, 28.5672] },
  { name: 'Safdarjung Hospital', coords: [77.2065, 28.5695] },
  { name: 'Hauz Khas Village & Lake', coords: [77.1950, 28.5530] },
  { name: 'Hauz Khas Metro Interchange', coords: [77.2060, 28.5430] },
  { name: 'Green Park Main Market', coords: [77.2070, 28.5580] },
  { name: 'Saket District Centre & Malls', coords: [77.2188, 28.5285] },
  { name: 'Max Super Speciality Hospital Saket', coords: [77.2120, 28.5270] },
  { name: 'Malviya Nagar Market', coords: [77.2070, 28.5280] },
  { name: 'Dilli Haat INA', coords: [77.2090, 28.5750] },
  { name: 'Lajpat Nagar 1 Market', coords: [77.2400, 28.5750] },
  { name: 'Lajpat Nagar Central Market', coords: [77.2370, 28.5710] },
  { name: 'Lajpat Nagar 4 Amar Colony', coords: [77.2450, 28.5620] },
  { name: 'South Extension 1 Market', coords: [77.2200, 28.5700] },
  { name: 'South Extension 2 Market', coords: [77.2230, 28.5680] },
  { name: 'Moolchand Hospital', coords: [77.2350, 28.5640] },
  { name: 'Nehru Place District Centre', coords: [77.2510, 28.5490] },
  { name: 'Greater Kailash 1 M-Block Market', coords: [77.2400, 28.5430] },
  { name: 'Greater Kailash 1 N-Block Market', coords: [77.2350, 28.5470] },
  { name: 'Greater Kailash 2 M-Block Market', coords: [77.2450, 28.5350] },
  { name: 'Kalkaji Mandir Metro Hub', coords: [77.2590, 28.5490] },
  { name: 'Kalkaji Main Market', coords: [77.2550, 28.5420] },
  { name: 'Okhla Industrial Area Phase 1', coords: [77.2750, 28.5320] },
  { name: 'Okhla Industrial Area Phase 2', coords: [77.2700, 28.5400] },
  { name: 'Okhla Industrial Area Phase 3', coords: [77.2680, 28.5520] },
  { name: 'Vasant Kunj Fortis Hospital', coords: [77.1600, 28.5280] },
  { name: 'Vasant Kunj Sector A', coords: [77.1550, 28.5380] },
  { name: 'Vasant Kunj Sector B Promenade Mall', coords: [77.1560, 28.5420] },
  { name: 'Vasant Kunj Sector C Ambience Mall', coords: [77.1580, 28.5410] },
  { name: 'Vasant Vihar Priya Complex', coords: [77.1610, 28.5580] },
  { name: 'Vasant Vihar Paschimi Marg', coords: [77.1650, 28.5620] },
  { name: 'Chhatarpur Temple Complex', coords: [77.1740, 28.5060] },
  { name: 'Chhatarpur Metro Station', coords: [77.1720, 28.5020] },
  { name: 'Mehrauli Archeological Park', coords: [77.1850, 28.5200] },
  { name: 'Qutub Minar Complex', coords: [77.1855, 28.5245] },
  { name: 'Munirka DDA Flats', coords: [77.1720, 28.5550] },
  { name: 'RK Puram Sector 1', coords: [77.1800, 28.5680] },
  { name: 'RK Puram Sector 5 Hyderpur', coords: [77.1750, 28.5620] },
  { name: 'RK Puram Sector 8 Sangam Cinema', coords: [77.1690, 28.5640] },
  { name: 'IIT Delhi Main Gate', coords: [77.1920, 28.5450] },
  { name: 'Jawaharlal Nehru University (JNU)', coords: [77.1670, 28.5400] },
  { name: 'Sarojini Nagar Market', coords: [77.1980, 28.5770] },
  { name: 'Andrews Ganj', coords: [77.2260, 28.5610] },
  { name: 'Defence Colony Flyover Market', coords: [77.2300, 28.5740] },
  { name: 'Gulmohar Park', coords: [77.2080, 28.5500] },
  { name: 'Panchsheel Park Enclave', coords: [77.2150, 28.5400] },
  { name: 'East of Kailash Community Centre', coords: [77.2480, 28.5550] },
  { name: 'Jasola Vihar Apollo Metro', coords: [77.2840, 28.5410] },
  { name: 'Indraprastha Apollo Hospital Sarita Vihar', coords: [77.2840, 28.5380] },
  { name: 'Badarpur Border Terminal', coords: [77.3000, 28.5000] },
  { name: 'Sangam Vihar Main Road', coords: [77.2350, 28.5050] },
  { name: 'Sainik Farm Complex', coords: [77.2100, 28.5100] },
  { name: 'Neb Sarai IGNOU Road', coords: [77.2000, 28.5150] },
  { name: 'Sultanpur Metro Station', coords: [77.1600, 28.4900] },
  { name: 'Ghitorni Metro Station', coords: [77.1480, 28.4830] },
  { name: 'Arjan Garh Border Metro', coords: [77.1260, 28.4800] },

  // --- West & North-West Delhi ---
  { name: 'Dwarka Sector 21 Hub & ISBT', coords: [77.0580, 28.5520] },
  { name: 'Dwarka Sector 10 District Court', coords: [77.0570, 28.5810] },
  { name: 'Dwarka Sector 6/7 Market', coords: [77.0700, 28.5850] },
  { name: 'Dwarka Sector 12 Metro', coords: [77.0420, 28.5920] },
  { name: 'Dwarka Sector 14 GGSIPU', coords: [77.0250, 28.5950] },
  { name: 'Dwarka Sector 1', coords: [77.0820, 28.5980] },
  { name: 'Dwarka Sector 3', coords: [77.0600, 28.6050] },
  { name: 'Dwarka Sector 19', coords: [77.0480, 28.5680] },
  { name: 'Dwarka Sector 23 Golf Course', coords: [77.0500, 28.5450] },
  { name: 'Dwarka Mor Metro Interchange', coords: [77.0320, 28.6180] },
  { name: 'Uttam Nagar East Metro', coords: [77.0650, 28.6250] },
  { name: 'Uttam Nagar West Bus Terminal', coords: [77.0550, 28.6240] },
  { name: 'Janakpuri District Centre & West Metro', coords: [77.0780, 28.6290] },
  { name: 'Janakpuri East Metro', coords: [77.0880, 28.6320] },
  { name: 'Janakpuri South Block A', coords: [77.0850, 28.6180] },
  { name: 'Tilak Nagar Central Market', coords: [77.0960, 28.6360] },
  { name: 'Subhash Nagar Pacific Mall', coords: [77.1040, 28.6410] },
  { name: 'Tagore Garden Metro', coords: [77.1120, 28.6440] },
  { name: 'Rajouri Garden Metro & City Centre Malls', coords: [77.1230, 28.6490] },
  { name: 'Ramesh Nagar', coords: [77.1320, 28.6510] },
  { name: 'Moti Nagar Junction', coords: [77.1420, 28.6530] },
  { name: 'Kirti Nagar Industrial Area', coords: [77.1550, 28.6550] },
  { name: 'Kirti Nagar Timber Market', coords: [77.1480, 28.6580] },
  { name: 'Punjabi Bagh Club Road Market', coords: [77.1420, 28.6740] },
  { name: 'Punjabi Bagh East Metro', coords: [77.1320, 28.6700] },
  { name: 'Paschim Vihar Outer Ring Road', coords: [77.1110, 28.6740] },
  { name: 'Paschim Vihar East Metro', coords: [77.1180, 28.6780] },
  { name: 'Peera Garhi Chowk & Flyover', coords: [77.0910, 28.6780] },
  { name: 'Nangloi Bus Depot & Chowk', coords: [77.0600, 28.6820] },
  { name: 'Mundka Industrial Area & Metro', coords: [77.0250, 28.6830] },
  { name: 'Tikri Border Terminal', coords: [76.9720, 28.6890] },
  { name: 'Vikaspuri PVR Complex', coords: [77.0680, 28.6380] },
  { name: 'Hari Nagar Clock Tower', coords: [77.1020, 28.6280] },
  { name: 'Naraina Vihar Ring Road', coords: [77.1350, 28.6250] },
  { name: 'Naraina Industrial Area Phase 1', coords: [77.1400, 28.6200] },
  { name: 'Najafgarh Dhansa Stand', coords: [76.9850, 28.6120] },
  { name: 'Chhawla BSF Camp', coords: [77.0050, 28.5600] },
  { name: 'Maya Puri Industrial Area Phase 2', coords: [77.1250, 28.6300] },

  // --- North & North-East Delhi ---
  { name: 'Kashmere Gate ISBT', coords: [77.2280, 28.6675] },
  { name: 'Civil Lines Mall Road', coords: [77.2250, 28.6700] },
  { name: 'Vishwavidyalaya DU North Campus', coords: [77.2100, 28.6890] },
  { name: 'GTB Nagar Hudson Lane Food Street', coords: [77.2070, 28.6970] },
  { name: 'Model Town 1 Market', coords: [77.1940, 28.6900] },
  { name: 'Model Town 3 Grand Trunk Road', coords: [77.1880, 28.7000] },
  { name: 'Azadpur Wholesale Fruit Mandi', coords: [77.1930, 28.6980] },
  { name: 'Jahangirpuri Metro Station', coords: [77.1700, 28.7180] },
  { name: 'Pitampura TV Tower Landmark', coords: [77.1380, 28.7030] },
  { name: 'Pitampura Netaji Subhash Place (NSP)', coords: [77.1520, 28.6960] },
  { name: 'Rohini Sector 3 Market', coords: [77.1150, 28.7020] },
  { name: 'Rohini Sector 7/8 Shopping Complex', coords: [77.1280, 28.7120] },
  { name: 'Rohini West Metro Station', coords: [77.1180, 28.7150] },
  { name: 'Rohini Sector 11 DDA Complex', coords: [77.1100, 28.7250] },
  { name: 'Rohini Sector 16 Engineering College', coords: [77.1000, 28.7350] },
  { name: 'Rohini Sector 22 Outer Ring', coords: [77.0750, 28.7280] },
  { name: 'Rithala Metro Terminal', coords: [77.1070, 28.7200] },
  { name: 'Shalimar Bagh Club', coords: [77.1670, 28.7010] },
  { name: 'Wazirpur Industrial Area', coords: [77.1600, 28.6920] },
  { name: 'Ashok Vihar Deep Cinema Complex', coords: [77.1750, 28.6880] },
  { name: 'Kamla Nagar Spark Mall & Market', coords: [77.2020, 28.6800] },
  { name: 'Kingsway Camp Market', coords: [77.2050, 28.6920] },
  { name: 'Burari Chowk', coords: [77.1980, 28.7520] },
  { name: 'Timarpur Police Colony', coords: [77.2200, 28.6950] },
  { name: 'Shastri Park IT Park', coords: [77.2520, 28.6750] },
  { name: 'Seelampur Market Junction', coords: [77.2680, 28.6690] },
  { name: 'Shahdara Metro & Railway Hub', coords: [77.2880, 28.6730] },
  { name: 'Mansarovar Park Metro', coords: [77.3000, 28.6740] },
  { name: 'GTB Hospital & UCMS Dilshad Garden', coords: [77.3100, 28.6820] },
  { name: 'Dilshad Garden Metro Terminal', coords: [77.3220, 28.6760] },
  { name: 'Vivek Vihar Block D', coords: [77.3120, 28.6650] },
  { name: 'Seemapuri Border Flyover', coords: [77.3320, 28.6820] },
  { name: 'Yamuna Vihar C-Block', coords: [77.2720, 28.7020] },
  { name: 'Karawal Nagar Main Road', coords: [77.2650, 28.7250] },
  { name: 'Bhajanpura Chowk', coords: [77.2600, 28.6980] },
  { name: 'Nand Nagri Bus Depot', coords: [77.2950, 28.6920] },

  // --- East Delhi ---
  { name: 'Laxmi Nagar Vikas Marg Hub', coords: [77.2775, 28.6315] },
  { name: 'Nirman Vihar Metro Station', coords: [77.2880, 28.6370] },
  { name: 'Preet Vihar Market', coords: [77.2960, 28.6410] },
  { name: 'Anand Vihar ISBT & Railway Station', coords: [77.3160, 28.6470] },
  { name: 'Mayur Vihar Phase 1 Pocket 1', coords: [77.2920, 28.6040] },
  { name: 'Mayur Vihar Phase 1 Extension Metro', coords: [77.3020, 28.5950] },
  { name: 'Mayur Vihar Phase 2 Shopping Complex', coords: [77.3080, 28.6120] },
  { name: 'Mayur Vihar Phase 3 Bus Terminal', coords: [77.3280, 28.6100] },
  { name: 'IP Extension DDA Societies', coords: [77.3150, 28.6320] },
  { name: 'Karkarduma District Court Complex', coords: [77.3050, 28.6490] },
  { name: 'Geeta Colony Shastri Nagar Bridge', coords: [77.2650, 28.6500] },
  { name: 'Krishna Nagar Lal Quarter Market', coords: [77.2820, 28.6580] },
  { name: 'Gandhi Nagar Wholesale Garment Market', coords: [77.2680, 28.6550] },
  { name: 'Patparganj Industrial Area', coords: [77.3080, 28.6250] },
  { name: 'Ghazipur Flower & Poultry Mandi', coords: [77.3320, 28.6220] },
  { name: 'Vasundhara Enclave', coords: [77.3200, 28.5980] },
  { name: 'Akshardham Temple Complex', coords: [77.2770, 28.6126] },
  { name: 'Commonwealth Games Village', coords: [77.2780, 28.6080] },

  // --- Gurgaon / Gurugram (NCR) ---
  { name: 'Gurgaon Cyber City Building 10', coords: [77.0890, 28.4950] },
  { name: 'Gurgaon Cyber Hub Food Street', coords: [77.0880, 28.4920] },
  { name: 'DLF Phase 1 Golf Course Road', coords: [77.0980, 28.4750] },
  { name: 'DLF Phase 2 Rapid Metro', coords: [77.0850, 28.4850] },
  { name: 'DLF Phase 3 Ambience Island', coords: [77.0920, 28.5020] },
  { name: 'DLF Phase 4 Galleria Market', coords: [77.0800, 28.4680] },
  { name: 'DLF Phase 5 Horizon Centre', coords: [77.0950, 28.4550] },
  { name: 'Gurgaon IFFCO Chowk Expressway', coords: [77.0720, 28.4720] },
  { name: 'Gurgaon MG Road Mall Mile', coords: [77.0800, 28.4800] },
  { name: 'Golf Course Extension Road Sec 56', coords: [77.1020, 28.4350] },
  { name: 'Sohna Road Subhash Chowk', coords: [77.0420, 28.4280] },
  { name: 'Rajiv Chowk Gurgaon Flyover', coords: [77.0350, 28.4550] },
  { name: 'Hero Honda Chowk NH-48', coords: [77.0150, 28.4380] },
  { name: 'Manesar IMT Technology Park', coords: [76.9350, 28.3520] },
  { name: 'Gurgaon Sector 14 Main Market', coords: [77.0450, 28.4750] },
  { name: 'Gurgaon Sector 29 Leisure Valley Park', coords: [77.0650, 28.4680] },
  { name: 'Gurgaon Sector 45 Huda Colony', coords: [77.0750, 28.4420] },
  { name: 'Gurgaon Sector 50 Baani Square', coords: [77.0620, 28.4250] },
  { name: 'Sheetla Mata Mandir Gurgaon', coords: [77.0250, 28.4820] },
  { name: 'Palam Vihar Block C', coords: [77.0320, 28.5120] },
  { name: 'Ambience Mall Gurgaon', coords: [77.0970, 28.5040] },
  { name: 'Millennium City Centre Metro (HUDA)', coords: [77.0720, 28.4590] },
  { name: 'Gurgaon Sector 54 Rapid Metro', coords: [77.1050, 28.4450] },
  { name: 'Gurgaon Sector 44 Institutional Area', coords: [77.0680, 28.4500] },
  { name: 'Medanta The Medicity Hospital Gurgaon', coords: [77.0420, 28.4380] },
  { name: 'Artemis Hospital Gurgaon Sec 51', coords: [77.0800, 28.4320] },
  { name: 'Fortis Memorial Research Institute Gurgaon', coords: [77.0750, 28.4580] },

  // --- Noida & Greater Noida (NCR) ---
  { name: 'Noida Sector 18 Wave Mall & Atta Market', coords: [77.3255, 28.5705] },
  { name: 'Noida Sector 18 DLF Mall of India', coords: [77.3210, 28.5680] },
  { name: 'Noida Sector 16 Film City', coords: [77.3150, 28.5780] },
  { name: 'Noida Sector 15 Metro', coords: [77.3080, 28.5850] },
  { name: 'Noida Sector 62 IT Park & Fortis', coords: [77.3710, 28.5910] },
  { name: 'Noida Sector 63 Commercial Hub', coords: [77.3820, 28.6180] },
  { name: 'Noida Sector 125 Amity University Campus', coords: [77.3320, 28.5450] },
  { name: 'Noida Sector 137 Expressway Apartments', coords: [77.4020, 28.5080] },
  { name: 'Noida Sector 50 Market', coords: [77.3620, 28.5750] },
  { name: 'Botanical Garden Noida Metro Hub', coords: [77.3340, 28.5640] },
  { name: 'Noida Electronic City Metro Terminal', coords: [77.3750, 28.6270] },
  { name: 'Noida Sector 52 Aqua Line Interchange', coords: [77.3680, 28.5800] },
  { name: 'Noida Sector 76 Metro', coords: [77.3820, 28.5680] },
  { name: 'Jaypee Hospital Noida Sector 128', coords: [77.3520, 28.5180] },
  { name: 'Greater Noida Pari Chowk Junction', coords: [77.5020, 28.4680] },
  { name: 'Greater Noida Knowledge Park 2', coords: [77.4920, 28.4600] },
  { name: 'Greater Noida Knowledge Park 3', coords: [77.4800, 28.4550] },
  { name: 'Greater Noida West Gaur City 1', coords: [77.4280, 28.6080] },
  { name: 'Greater Noida West Gaur City 2', coords: [77.4380, 28.6150] },
  { name: 'Greater Noida Delta 1 Metro', coords: [77.5180, 28.4800] },
  { name: 'Greater Noida Alpha 1 Commercial Belt', coords: [77.5100, 28.4750] },
  { name: 'Buddh International Circuit Expressway', coords: [77.5350, 28.3580] },

  // --- Ghaziabad (NCR) ---
  { name: 'Vaishali Sector 4 Metro Station', coords: [77.3400, 28.6500] },
  { name: 'Kaushambi ISBT & Metro', coords: [77.3250, 28.6450] },
  { name: 'Indirapuram Shipra Sun City', coords: [77.3680, 28.6400] },
  { name: 'Indirapuram Habitat Centre', coords: [77.3620, 28.6450] },
  { name: 'Vasundhara Sector 10 Ghaziabad', coords: [77.3600, 28.6600] },
  { name: 'Mohan Nagar Junction Ghaziabad', coords: [77.3820, 28.6750] },
  { name: 'Sahibabad Industrial Area Site 4', coords: [77.3520, 28.6680] },
  { name: 'Raj Nagar Extension Ghaziabad', coords: [77.4250, 28.7050] },
  { name: 'Crossings Republik City', coords: [77.4350, 28.6320] },
  { name: 'Ghaziabad Junction Railway Station', coords: [77.4320, 28.6650] },
  { name: 'Old Bus Stand Ghaziabad', coords: [77.4180, 28.6700] },
  { name: 'Loni Border Junction', coords: [77.2880, 28.7520] },
  { name: 'Muradnagar Ordnance Factory', coords: [77.5020, 28.7800] },
  { name: 'Modinagar Central', coords: [77.5780, 28.8350] },

  // --- Faridabad (NCR) ---
  { name: 'Faridabad Sector 15 Market', coords: [77.3180, 28.4050] },
  { name: 'Faridabad Sector 16 Metro', coords: [77.3150, 28.4120] },
  { name: 'Faridabad Sector 21C DDA Societies', coords: [77.2980, 28.4200] },
  { name: 'Faridabad Sector 28 Metro', coords: [77.3080, 28.4350] },
  { name: 'Faridabad Sector 31 Commercial Belt', coords: [77.3020, 28.4480] },
  { name: 'Old Faridabad Railway Station', coords: [77.3120, 28.3980] },
  { name: 'NIT Faridabad 1 Central Market', coords: [77.2950, 28.3900] },
  { name: 'NIT Faridabad 3 ESI Hospital', coords: [77.2880, 28.3850] },
  { name: 'Ballabhgarh Metro Terminal', coords: [77.3220, 28.3420] },
  { name: 'Mathura Road Faridabad NH-44', coords: [77.3100, 28.4250] },
  { name: 'Surajkund Lake & Craft Mela Grounds', coords: [77.2820, 28.4880] },
  { name: 'Sarai Khwaja Metro Station', coords: [77.3020, 28.4680] },
  { name: 'Mewla Maharajpur Metro', coords: [77.3050, 28.4550] },
  { name: 'Neelam Chowk Ajronda Metro', coords: [77.3120, 28.3800] },
  { name: 'Escorts Mujesar Metro', coords: [77.3150, 28.3650] },

  // --- Airports, Expressways & Special Transit Hubs ---
  { name: 'IGI Airport Terminal 3 International', coords: [77.1000, 28.5562] },
  { name: 'IGI Airport Terminal 1 Domestic', coords: [77.1200, 28.5630] },
  { name: 'IGI Airport Terminal 2 Arrivals', coords: [77.1080, 28.5580] },
  { name: 'Delhi Aerocity Metro & Hospitality District', coords: [77.1213, 28.5504] },
  { name: 'Dhaula Kuan Junction Flyover', coords: [77.1680, 28.5920] },
  { name: 'Delhi Gate Stadium Complex', coords: [77.2400, 28.6380] },
  { name: 'Sarai Kale Khan ISBT & RRTS Hub', coords: [77.2580, 28.5910] },
  { name: 'Hazrat Nizamuddin Railway Station (NZM)', coords: [77.2530, 28.5880] },
  { name: 'Nizamuddin Dargah Heritage Complex', coords: [77.2450, 28.5900] },
  { name: 'Humayun Tomb World Heritage Site', coords: [77.2500, 28.5840] },
  { name: 'Delhi Cantt Railway Station', coords: [77.1250, 28.5950] },
  { name: 'Subroto Park Air Force Station', coords: [77.1420, 28.5800] },
  { name: 'Vikas Puri Flyover Junction', coords: [77.0750, 28.6420] },
  { name: 'Delhi Noida Direct (DND) Flyway Toll Plaza', coords: [77.2750, 28.5780] },
  { name: 'Eastern Peripheral Expressway Kundli Interchange', coords: [77.1200, 28.8800] },
  { name: 'Dwarka Expressway Sector 110 Junction', coords: [77.0120, 28.5200] },
  { name: 'Sohna Elevated Expressway Toll', coords: [77.0380, 28.3800] },
  { name: 'Yamuna Expressway Zero Point Noida', coords: [77.3880, 28.5000] }
];

export const SmartRoutePanel: React.FC<SmartRoutePanelProps> = ({
  onRouteCalculated,
  onSelectRouteCandidate,
  onHighlightFactor,
  onClose
}) => {
  const [originName, setOriginName] = useState('Connaught Place (Rajiv Chowk)');
  const [destinationName, setDestinationName] = useState('IGI Airport Terminal 3');
  const [originCoords, setOriginCoords] = useState<[number, number]>([77.2197, 28.6315]);
  const [destCoords, setDestCoords] = useState<[number, number]>([77.1000, 28.5562]);

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const handleUseLiveLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setOriginName('My Live Location (GPS)');
          setOriginCoords([lon, lat]);
          setShowOriginSuggestions(false);
        },
        (err) => {
          alert('Could not retrieve live GPS location. Please select a location from suggestions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const [preference, setPreference] = useState('balanced');
  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<SmartRouteResponse | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');

  const PREFERENCES = [
    { id: 'balanced', label: 'Balanced' },
    { id: 'fastest', label: 'Fastest ETA' },
    { id: 'safer', label: 'Safer & Avoid Closures' },
    { id: 'avoid_events', label: 'Avoid Event Radii' }
  ];

  const filteredOriginSuggestions = DELHI_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(originName.toLowerCase())
  );

  const filteredDestSuggestions = DELHI_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(destinationName.toLowerCase())
  );

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const result = await calculateSmartRoute({
        origin: originCoords,
        destination: destCoords,
        origin_name: originName,
        destination_name: destinationName,
        preference: preference
      });
      setRouteResult(result);
      const firstRoute = result.routes.find((r) => r.id === result.recommended_route_id) || result.routes[0];
      if (firstRoute) {
        setSelectedRouteId(firstRoute.id);
        onSelectRouteCandidate(firstRoute);
      }
      onRouteCalculated(result);
    } catch (err) {
      console.error('Failed to calculate smart route:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-20 left-4 bottom-6 z-30 w-full max-w-md bg-dark-panel/95 backdrop-blur-md border border-dark-border rounded-xl p-5 shadow-panel-dark flex flex-col justify-between text-dark-text overflow-y-auto pointer-events-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-border">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-brand/20 border border-cyan-brand/40 text-cyan-glow">
              <Navigation className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-mono font-bold text-base text-white">AI SMART ROUTE</h2>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-brand/30 text-cyan-glow font-bold border border-cyan-brand/50">
                  FLAGSHIP #1
                </span>
              </div>
              <p className="text-[11px] text-dark-muted">Multi-Candidate Spatial Route Scoring Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-dark-muted hover:text-white px-2 py-1 rounded bg-dark-card">
            Close
          </button>
        </div>

        {/* Inputs */}
        <div className="py-4 space-y-3 border-b border-dark-border">
          {/* Origin Autocomplete Input */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-dark-muted block">ORIGIN LOCATION</label>
              <button
                type="button"
                onClick={handleUseLiveLocation}
                className="text-[10px] font-mono text-cyan-glow hover:text-white flex items-center space-x-1 bg-cyan-brand/10 hover:bg-cyan-brand/20 px-2 py-0.5 rounded border border-cyan-brand/30 transition-colors"
              >
                <MapPin className="w-3 h-3 text-cyan-glow" />
                <span>📍 Live Location</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow" />
              <input
                type="text"
                value={originName}
                onChange={(e) => {
                  setOriginName(e.target.value);
                  setShowOriginSuggestions(true);
                }}
                onFocus={() => setShowOriginSuggestions(true)}
                placeholder="Search origin in Delhi NCR..."
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-cyan-glow focus:outline-none"
              />
            </div>
            {showOriginSuggestions && filteredOriginSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-dark-panel border border-cyan-glow/40 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-dark-border">
                {filteredOriginSuggestions.map((loc) => (
                  <div
                    key={loc.name}
                    onClick={() => {
                      setOriginName(loc.name);
                      setOriginCoords(loc.coords);
                      setShowOriginSuggestions(false);
                    }}
                    className="p-2 text-xs text-slate-200 hover:bg-cyan-brand/20 hover:text-cyan-glow cursor-pointer transition-colors"
                  >
                    📍 {loc.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Destination Autocomplete Input */}
          <div className="relative">
            <label className="text-[11px] font-mono text-dark-muted block mb-1">DESTINATION LOCATION</label>
            <div className="relative">
              <Navigation className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-glow" />
              <input
                type="text"
                value={destinationName}
                onChange={(e) => {
                  setDestinationName(e.target.value);
                  setShowDestSuggestions(true);
                }}
                onFocus={() => setShowDestSuggestions(true)}
                placeholder="Search destination in Delhi NCR..."
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-cyan-glow focus:outline-none"
              />
            </div>
            {showDestSuggestions && filteredDestSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-dark-panel border border-cyan-glow/40 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-dark-border">
                {filteredDestSuggestions.map((loc) => (
                  <div
                    key={loc.name}
                    onClick={() => {
                      setDestinationName(loc.name);
                      setDestCoords(loc.coords);
                      setShowDestSuggestions(false);
                    }}
                    className="p-2 text-xs text-slate-200 hover:bg-purple-brand/20 hover:text-purple-glow cursor-pointer transition-colors"
                  >
                    🎯 {loc.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div>
            <label className="text-[11px] font-mono text-dark-muted block mb-1">ROUTING PREFERENCE</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PREFERENCES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreference(p.id)}
                  className={`py-1 px-2 rounded text-[11px] border transition-all ${
                    preference === p.id
                      ? 'bg-cyan-brand/20 border-cyan-glow text-cyan-glow font-bold'
                      : 'bg-dark-card border-dark-border text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-brand to-purple-brand hover:from-cyan-glow hover:to-purple-glow text-black font-bold text-xs shadow-glow-cyan flex items-center justify-center space-x-2 transition-all mt-2"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>{loading ? 'SCORING CANDIDATE ROUTES...' : 'CALCULATE AI SMART ROUTE'}</span>
          </button>
        </div>

        {/* Results Candidate Cards */}
        {routeResult && (
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-slate-300">CANDIDATE ROUTES</span>
              <span className="text-[11px] text-cyan-glow font-mono font-bold">Confidence: {routeResult.confidence_pct}%</span>
            </div>

            <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
              {routeResult.routes.map((candidate) => {
                const isSelected = selectedRouteId === candidate.id;
                const isRecommended = candidate.id === routeResult.recommended_route_id;

                return (
                  <div
                    key={candidate.id}
                    onClick={() => {
                      setSelectedRouteId(candidate.id);
                      onSelectRouteCandidate(candidate);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-dark-card border-cyan-glow shadow-glow-cyan'
                        : 'bg-dark-card/60 border-dark-border hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-white">{candidate.name}</span>
                        {isRecommended && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 uppercase">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-base text-cyan-glow">{candidate.urbansync_score}</span>
                        <span className="text-[10px] text-dark-muted block">Score / 100</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-300 mt-2">
                      <span>ETA: <strong className="text-white">{candidate.eta_minutes} min</strong></span>
                      <span>Distance: <strong className="text-white">{candidate.distance_km} km</strong></span>
                      <span>Weather Risk: <strong className="text-amber-400">{candidate.weather_risk_level}</strong></span>
                    </div>

                    {/* Reasoning Chips */}
                    <div className="mt-2.5 pt-2 border-t border-dark-border/60 space-y-1">
                      {candidate.factors.map((f, i) => (
                        <div
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onHighlightFactor) onHighlightFactor(f.title);
                          }}
                          className="flex items-center space-x-1.5 text-[11px] text-slate-300 hover:text-cyan-glow cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-cyan-glow shrink-0" />
                          <span className="truncate">{f.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
