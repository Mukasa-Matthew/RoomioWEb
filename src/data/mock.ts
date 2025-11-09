import type { UniversitySummary, HostelSummary } from '../lib/api';

const makeHostel = (overrides: Partial<HostelSummary>): HostelSummary => ({
  id: Math.floor(Math.random() * 10_000),
  name: 'Sample Hostel',
  address: 'Unknown Street',
  description:
    'A modern hostel with spacious rooms, 24/7 security, and fast internet connectivity for every student.',
  amenities: ['High-speed WiFi', 'Reading room', 'Biometric access', 'Laundry services'],
  pricePerRoom: 450_000,
  bookingFee: null,
  distanceFromCampus: 0.4,
  availableRooms: 8,
  occupancyType: 'mixed',
  primaryImage:
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=960&q=80',
  latitude: 0.3322,
  longitude: 32.5704,
  ...overrides,
});

export const mockUniversities: UniversitySummary[] = [
  {
    id: 1,
    name: 'Makerere University',
    code: 'MAK',
    address: 'Kampala, Uganda',
    contactEmail: 'info@mak.ac.ug',
    contactPhone: '+256 414 542803',
    website: 'https://www.mak.ac.ug',
    hostels: [
      makeHostel({
        id: 101,
        name: 'Cedar Heights Hostel',
        availableRooms: 5,
        pricePerRoom: 480_000,
        amenities: ['WiFi', 'CCTV cameras', 'Shuttle to campus', 'Gym'],
        primaryImage:
          'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80',
      }),
      makeHostel({
        id: 102,
        name: 'Lake View Residences',
        availableRooms: 12,
        pricePerRoom: 520_000,
        occupancyType: 'female',
        amenities: ['24/7 security', 'Study lounges', 'On-site cafeteria'],
        primaryImage:
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
      }),
    ],
  },
  {
    id: 2,
    name: 'Kyambogo University',
    code: 'KYU',
    address: 'Kampala, Uganda',
    contactEmail: 'info@kyu.ac.ug',
    contactPhone: '+256 414 286 300',
    website: 'https://kyu.ac.ug',
    hostels: [
      makeHostel({
        id: 201,
        name: 'Hilltop Haven',
        availableRooms: 9,
        pricePerRoom: 430_000,
        distanceFromCampus: 0.6,
        amenities: ['WiFi', 'Power backup', 'Meal plans', 'Parking'],
        primaryImage:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      }),
    ],
  },
  {
    id: 3,
    name: 'Uganda Christian University',
    code: 'UCU',
    address: 'Mukono, Uganda',
    contactEmail: 'admissions@ucu.ac.ug',
    contactPhone: '+256 312 350 800',
    website: 'https://ucu.ac.ug',
    hostels: [
      makeHostel({
        id: 301,
        name: 'Trinity Suites',
        availableRooms: 4,
        pricePerRoom: 600_000,
        amenities: ['Biometric access', 'Dedicated study rooms', 'Daily cleaning'],
        occupancyType: 'female',
      }),
      makeHostel({
        id: 302,
        name: 'Campus Edge Apartments',
        availableRooms: 10,
        pricePerRoom: 550_000,
        amenities: ['Fast WiFi', 'Co-working lounge', 'Outdoor garden'],
        primaryImage:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
      }),
    ],
  },
];

export const mockFeaturedHostels: HostelSummary[] = [
  makeHostel({
    id: 401,
    name: 'Pearl Residences',
    description:
      'Premium en-suite rooms with lake views, high-speed WiFi, and curated wellness programs.',
    amenities: ['Lake view', 'Smart access', 'Concierge', 'Fitness studio', 'Movie lounge'],
    pricePerRoom: 780_000,
    availableRooms: 3,
    primaryImage:
      'https://images.unsplash.com/photo-1542978612-4200b9b67e38?auto=format&fit=crop&w=900&q=80',
  }),
  makeHostel({
    id: 402,
    name: 'The Loft',
    description:
      'Industrial-inspired loft apartments designed for collaborative living and learning.',
    amenities: ['Shared maker lab', 'Podcast studio', 'Co-working loft', 'Cafe'],
    pricePerRoom: 650_000,
    availableRooms: 7,
    primaryImage:
      'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=900&q=80',
  }),
];


