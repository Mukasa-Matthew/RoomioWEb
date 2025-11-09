const DEFAULT_API_BASE = 'http://localhost:5000/api/public';

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || DEFAULT_API_BASE;

export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/public$/, '');

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

interface ApiHostelSummary {
  id: number;
  name: string;
  address: string;
  description: string | null;
  price_per_room: number | null;
  booking_fee: number | null;
  amenities: string | null;
  distance_from_campus: number | null;
  available_rooms: number;
  occupancy_type: 'male' | 'female' | 'mixed' | null;
  primary_image: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface ApiUniversitySummary {
  id: number;
  name: string;
  code: string;
  address: string;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  hostels: ApiHostelSummary[];
}

interface ApiHostelDetail {
  id: number;
  name: string;
  address: string;
  description: string | null;
  total_rooms: number;
  available_rooms: number;
  contact_phone: string | null;
  contact_email: string | null;
  price_per_room: number | null;
  booking_fee: number | null;
  occupancy_type: 'male' | 'female' | 'mixed' | null;
  distance_from_campus: number | null;
  amenities: string | null;
  latitude: number | null;
  longitude: number | null;
  university_id: number | null;
  university_name: string | null;
  university_code: string | null;
  university_address: string | null;
  images: Array<{
    id: number;
    image_url: string;
    caption: string | null;
    is_primary: boolean;
  }>;
  room_stats: {
    total_rooms: number;
    available_rooms: number;
    min_price: number | null;
    max_price: number | null;
    avg_price: number | null;
  } | null;
}

export interface HostelSummary {
  id: number;
  name: string;
  address: string;
  description: string;
  pricePerRoom: number | null;
  bookingFee: number | null;
  amenities: string[];
  distanceFromCampus: number | null;
  availableRooms: number;
  occupancyType: 'male' | 'female' | 'mixed' | null;
  primaryImage?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UniversitySummary {
  id: number;
  name: string;
  code: string;
  address: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  hostels: HostelSummary[];
}

export interface HostelDetail extends HostelSummary {
  totalRooms: number;
  contactPhone?: string | null;
  contactEmail?: string | null;
  universityId?: number | null;
  universityName?: string | null;
  universityCode?: string | null;
  universityAddress?: string | null;
  gallery: Array<{
    id: number;
    url: string;
    caption?: string | null;
    isPrimary: boolean;
  }>;
  roomStats?: {
    totalRooms: number;
    availableRooms: number;
    minPrice: number | null;
    maxPrice: number | null;
    avgPrice: number | null;
  };
}

function resolveImageUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_BASE_URL}${url}`;
}

function normalizeAmenities(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapHostel(apiHostel: ApiHostelSummary): HostelSummary {
  return {
    id: apiHostel.id,
    name: apiHostel.name,
    address: apiHostel.address,
    description: apiHostel.description || 'No description provided yet.',
    pricePerRoom: apiHostel.price_per_room,
    bookingFee: apiHostel.booking_fee,
    amenities: normalizeAmenities(apiHostel.amenities),
    distanceFromCampus:
      apiHostel.distance_from_campus !== null ? Number(apiHostel.distance_from_campus) : null,
    availableRooms: apiHostel.available_rooms,
    occupancyType: apiHostel.occupancy_type,
    primaryImage: resolveImageUrl(apiHostel.primary_image),
    latitude: apiHostel.latitude,
    longitude: apiHostel.longitude,
  };
}

export async function fetchUniversitiesWithHostels(): Promise<UniversitySummary[]> {
  const response = await fetch(`${API_BASE_URL}/universities-with-hostels`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to load universities (${response.status})`);
  }

  const json: ApiResponse<ApiUniversitySummary[]> = await response.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Unexpected response loading universities');
  }

  return json.data.map((uni) => ({
    id: uni.id,
    name: uni.name,
    code: uni.code,
    address: uni.address,
    contactEmail: uni.contact_email,
    contactPhone: uni.contact_phone,
    website: uni.website,
    hostels: Array.isArray(uni.hostels) ? uni.hostels.map(mapHostel) : [],
  }));
}

export async function fetchUniversityHostels(
  universityId: number,
): Promise<{ university: UniversitySummary; hostels: HostelSummary[] }> {
  const response = await fetch(`${API_BASE_URL}/universities/${universityId}/hostels`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('University not found');
    }
    throw new Error(`Failed to load university (${response.status})`);
  }

  const json: ApiResponse<{
    university: {
      id: number;
      name: string;
      code: string;
      address: string;
      contact_email: string | null;
      contact_phone: string | null;
      website: string | null;
    };
    hostels: ApiHostelSummary[];
  }> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.message || 'Unexpected response loading university');
  }

  const { university, hostels } = json.data;
  const mappedHostels = hostels.map(mapHostel);

  return {
    university: {
      id: university.id,
      name: university.name,
      code: university.code,
      address: university.address,
      contactEmail: university.contact_email,
      contactPhone: university.contact_phone,
      website: university.website,
      hostels: mappedHostels,
    },
    hostels: mappedHostels,
  };
}

export async function fetchHostelDetail(hostelId: number): Promise<HostelDetail> {
  const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Hostel not found');
    }
    throw new Error(`Failed to load hostel (${response.status})`);
  }

  const json: ApiResponse<ApiHostelDetail> = await response.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Unexpected response loading hostel');
  }

  const data = json.data;

  return {
    id: data.id,
    name: data.name,
    address: data.address,
    description: data.description || 'No description provided yet.',
    pricePerRoom: data.price_per_room,
    bookingFee: data.booking_fee,
    amenities: normalizeAmenities(data.amenities),
    distanceFromCampus:
      data.distance_from_campus !== null ? Number(data.distance_from_campus) : null,
    availableRooms: data.available_rooms,
    occupancyType: data.occupancy_type,
    primaryImage:
      resolveImageUrl(
        data.images.find((image) => image.is_primary)?.image_url || data.images[0]?.image_url || null,
      ) || undefined,
    latitude: data.latitude,
    longitude: data.longitude,
    totalRooms: data.total_rooms,
    contactPhone: data.contact_phone,
    contactEmail: data.contact_email,
    universityId: data.university_id ?? undefined,
    universityName: data.university_name,
    universityCode: data.university_code,
    universityAddress: data.university_address,
    gallery: data.images.map((image) => ({
      id: image.id,
      url: resolveImageUrl(image.image_url) || '',
      caption: image.caption,
      isPrimary: image.is_primary,
    })),
    roomStats: data.room_stats
      ? {
          totalRooms: Number(data.room_stats.total_rooms || 0),
          availableRooms: Number(data.room_stats.available_rooms || 0),
          minPrice: data.room_stats.min_price,
          maxPrice: data.room_stats.max_price,
          avgPrice: data.room_stats.avg_price,
        }
      : undefined,
  };
}

export interface CreatePublicBookingPayload {
  fullName: string;
  email?: string;
  phone: string;
  gender?: string;
  course?: string;
  preferredCheckIn?: string;
  stayDuration?: string;
  notes?: string;
  paymentPhone?: string;
}

export interface PublicBookingConfirmation {
  bookingFee: number;
  paymentReference: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  message: string;
}

interface ApiBookingConfirmation {
  booking_fee?: number | null;
  payment_reference?: string | null;
  payment_status?: string | null;
  status?: string | null;
  created_at?: string | null;
}

export async function createHostelBooking(
  hostelId: number,
  payload: CreatePublicBookingPayload,
): Promise<PublicBookingConfirmation> {
  const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const defaultErrorMessage = 'Failed to submit booking request';
  const contentType = response.headers.get('content-type');

  let json: ApiResponse<ApiBookingConfirmation> | null = null;

  if (contentType && contentType.includes('application/json')) {
    json = await response.json();
  } else {
    const text = await response.text().catch(() => '');
    if (!response.ok) {
      throw new Error(text || defaultErrorMessage);
    }
    throw new Error('Unexpected response format when submitting booking request');
  }

  if (!json) {
    throw new Error(defaultErrorMessage);
  }

  if (!response.ok || !json.success) {
    throw new Error(json.message || defaultErrorMessage);
  }

  return {
    bookingFee: Number(json.data?.booking_fee ?? 0),
    paymentReference: json.data?.payment_reference ?? '',
    paymentStatus: json.data?.payment_status ?? 'pending',
    status: json.data?.status ?? 'pending',
    createdAt: json.data?.created_at ?? new Date().toISOString(),
    message:
      json.message ??
      'Booking request received. Complete the payment via the instructions provided to finalize your reservation.',
  };
}