import type { Tenant, Pet, Booking, Sitter } from '../types/index.js';

export const tenants: Tenant[] = [
  { id: 'tenant_portland', name: 'PawTrack Portland', timezone: 'America/Los_Angeles' },
  { id: 'tenant_seattle', name: 'PawTrack Seattle', timezone: 'America/Los_Angeles' },
  { id: 'tenant_austin', name: 'PawTrack Austin', timezone: 'America/Chicago' },
];

export const sitters: Sitter[] = [
  { id: 'sitter_001', tenantId: 'tenant_portland', name: 'Maria Chen', email: 'maria@pawtrack.com', phone: '503-555-0101' },
  { id: 'sitter_002', tenantId: 'tenant_portland', name: 'Jake Wilson', email: 'jake@pawtrack.com', phone: '503-555-0102' },
  { id: 'sitter_003', tenantId: 'tenant_seattle', name: 'Aisha Patel', email: 'aisha@pawtrack.com', phone: '206-555-0201' },
  { id: 'sitter_004', tenantId: 'tenant_seattle', name: 'Tom Nguyen', email: 'tom@pawtrack.com', phone: '206-555-0202' },
  { id: 'sitter_005', tenantId: 'tenant_austin', name: 'Rosa Garcia', email: 'rosa@pawtrack.com', phone: '512-555-0301' },
  { id: 'sitter_006', tenantId: 'tenant_austin', name: 'Dev Sharma', email: 'dev@pawtrack.com', phone: '512-555-0302' },
];

export const pets: Pet[] = [
  // Portland pets
  { id: 'pet_001', tenantId: 'tenant_portland', name: 'Biscuit', species: 'dog', breed: 'Golden Retriever', ownerName: 'Sarah Johnson', ownerPhone: '503-555-1001', notes: 'Loves belly rubs. Allergic to chicken.' },
  { id: 'pet_002', tenantId: 'tenant_portland', name: 'Whiskers', species: 'cat', breed: 'Maine Coon', ownerName: 'Mike Torres', ownerPhone: '503-555-1002', notes: 'Indoor only. Needs medication at 6pm.' },
  { id: 'pet_003', tenantId: 'tenant_portland', name: 'Ziggy', species: 'dog', breed: 'Beagle Mix', ownerName: 'Lisa Park', ownerPhone: '503-555-1003', notes: 'Anxious around other dogs. Use harness, not collar.' },
  { id: 'pet_004', tenantId: 'tenant_portland', name: 'Mochi', species: 'rabbit', breed: 'Holland Lop', ownerName: 'James Liu', ownerPhone: '503-555-1004', notes: 'Free roam supervised only. Check water bottle.' },
  { id: 'pet_005', tenantId: 'tenant_portland', name: 'Captain', species: 'bird', breed: 'African Grey', ownerName: 'Emma Davis', ownerPhone: '503-555-1005', notes: '<img src=x onerror="alert(1)">Talks a lot. Cover cage at 8pm.' },

  // Seattle pets
  { id: 'pet_006', tenantId: 'tenant_seattle', name: 'Luna', species: 'dog', breed: 'Husky', ownerName: 'Chris Kim', ownerPhone: '206-555-2001', notes: 'High energy. Needs 2+ mile walk.' },
  { id: 'pet_007', tenantId: 'tenant_seattle', name: 'Shadow', species: 'cat', breed: 'Russian Blue', ownerName: 'Amy Chen', ownerPhone: '206-555-2002', notes: 'Shy at first. Favorite toy in top drawer.' },
  { id: 'pet_008', tenantId: 'tenant_seattle', name: 'Bear', species: 'dog', breed: 'Bernese Mountain Dog', ownerName: 'Ryan Miller', ownerPhone: '206-555-2003', notes: 'Gentle giant. Drools. Bring extra towels.' },
  { id: 'pet_009', tenantId: 'tenant_seattle', name: 'Pixel', species: 'cat', breed: 'Siamese', ownerName: 'Jen Park', ownerPhone: '206-555-2004', notes: 'Very vocal. Indoor only.' },

  // Austin pets
  { id: 'pet_010', tenantId: 'tenant_austin', name: 'Bandit', species: 'dog', breed: 'Border Collie', ownerName: 'Carlos Ruiz', ownerPhone: '512-555-3001', notes: 'Needs mental stimulation. Puzzle toys in closet.' },
  { id: 'pet_011', tenantId: 'tenant_austin', name: 'Peaches', species: 'cat', breed: 'Tabby', ownerName: 'Nina Okafor', ownerPhone: '512-555-3002', notes: 'Outdoor cat. Comes to whistle.' },
  { id: 'pet_012', tenantId: 'tenant_austin', name: 'Tank', species: 'dog', breed: 'Bulldog', ownerName: 'Ben Walsh', ownerPhone: '512-555-3003', notes: 'Keep cool. No exercise in heat. AC must be on.' },
  { id: 'pet_013', tenantId: 'tenant_austin', name: 'Cleo', species: 'cat', breed: 'Bengal', ownerName: 'Diana Flores', ownerPhone: '512-555-3004', notes: 'Climber. Check all windows are closed before leaving.' },
];

export const bookings: Booking[] = [
  // Portland bookings
  {
    id: 'booking_001', tenantId: 'tenant_portland', petId: 'pet_001', sitterId: 'sitter_001',
    status: 'confirmed', scheduledDate: '2026-04-10T09:00:00-07:00', startTime: '09:00', endTime: '11:00',
    notes: 'Morning walk and feeding. Key under mat.', createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-02T14:00:00Z', statusChangedAt: '2026-04-02T14:00:00Z', statusChangedBy: 'user_admin_portland', statusHistory: []
  },
  {
    id: 'booking_002', tenantId: 'tenant_portland', petId: 'pet_002', sitterId: 'sitter_002',
    status: 'requested', scheduledDate: '2026-04-11T17:00:00-07:00', startTime: '17:00', endTime: '19:00',
    notes: 'Evening medication and feeding.', createdAt: '2026-04-03T09:00:00Z',
    updatedAt: '2026-04-03T09:00:00Z', statusChangedAt: '2026-04-03T09:00:00Z', statusChangedBy: 'user_staff_portland', statusHistory: []
  },
  {
    id: 'booking_003', tenantId: 'tenant_portland', petId: 'pet_003', sitterId: 'sitter_001',
    status: 'in_progress', scheduledDate: '2026-04-08T14:00:00-07:00', startTime: '14:00', endTime: '16:00',
    notes: 'Afternoon walk. Avoid dog park on Oak Street.', createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-04-08T14:05:00Z', statusChangedAt: '2026-04-08T14:05:00Z', statusChangedBy: 'sitter_001', statusHistory: []
  },
  {
    id: 'booking_004', tenantId: 'tenant_portland', petId: 'pet_004', sitterId: 'sitter_002',
    status: 'completed', scheduledDate: '2026-04-07T10:00:00-07:00', startTime: '10:00', endTime: '11:30',
    notes: 'Quick check-in. Refill water and hay.', createdAt: '2026-03-30T12:00:00Z',
    updatedAt: '2026-04-07T11:45:00Z', statusChangedAt: '2026-04-07T11:45:00Z', statusChangedBy: 'sitter_002', statusHistory: []
  },
  {
    id: 'booking_005', tenantId: 'tenant_portland', petId: 'pet_005', sitterId: 'sitter_001',
    status: 'requested', scheduledDate: '2026-04-12T08:00:00-07:00', startTime: '08:00', endTime: '09:00',
    notes: 'Feed and cover cage check. <b>Owner traveling until 4/15</b>', createdAt: '2026-04-05T16:00:00Z',
    updatedAt: '2026-04-05T16:00:00Z', statusChangedAt: '2026-04-05T16:00:00Z', statusChangedBy: 'user_staff_portland', statusHistory: []
  },
  // Timezone edge case: This booking is at 11:30 PM Pacific = April 9 06:30 UTC
  // String prefix match on "2026-04-08" would MISS this if filtering by April 8 in Pacific time
  // but the ISO string starts with "2026-04-09" in UTC
  {
    id: 'booking_006', tenantId: 'tenant_portland', petId: 'pet_001', sitterId: 'sitter_002',
    status: 'confirmed', scheduledDate: '2026-04-09T06:30:00Z', startTime: '23:30', endTime: '00:30',
    notes: 'Late night check-in. Dog needs final walk before bed.', createdAt: '2026-04-02T10:00:00Z',
    updatedAt: '2026-04-03T08:00:00Z', statusChangedAt: '2026-04-03T08:00:00Z', statusChangedBy: 'user_admin_portland', statusHistory: []
  },

  // Seattle bookings
  {
    id: 'booking_007', tenantId: 'tenant_seattle', petId: 'pet_006', sitterId: 'sitter_003',
    status: 'confirmed', scheduledDate: '2026-04-10T07:00:00-07:00', startTime: '07:00', endTime: '09:00',
    notes: 'Morning run. Luna needs at least 2 miles.', createdAt: '2026-04-02T11:00:00Z',
    updatedAt: '2026-04-03T09:00:00Z', statusChangedAt: '2026-04-03T09:00:00Z', statusChangedBy: 'user_admin_seattle', statusHistory: []
  },
  {
    id: 'booking_008', tenantId: 'tenant_seattle', petId: 'pet_007', sitterId: 'sitter_004',
    status: 'requested', scheduledDate: '2026-04-11T15:00:00-07:00', startTime: '15:00', endTime: '16:30',
    notes: 'Check on Shadow. Play session and feeding.', createdAt: '2026-04-04T10:00:00Z',
    updatedAt: '2026-04-04T10:00:00Z', statusChangedAt: '2026-04-04T10:00:00Z', statusChangedBy: 'user_staff_seattle', statusHistory: []
  },
  {
    id: 'booking_009', tenantId: 'tenant_seattle', petId: 'pet_008', sitterId: 'sitter_003',
    status: 'in_progress', scheduledDate: '2026-04-08T10:00:00-07:00', startTime: '10:00', endTime: '12:00',
    notes: 'Walk and grooming. Bring lint roller.', createdAt: '2026-04-01T14:00:00Z',
    updatedAt: '2026-04-08T10:10:00Z', statusChangedAt: '2026-04-08T10:10:00Z', statusChangedBy: 'sitter_003', statusHistory: []
  },
  {
    id: 'booking_010', tenantId: 'tenant_seattle', petId: 'pet_009', sitterId: 'sitter_004',
    status: 'completed', scheduledDate: '2026-04-07T13:00:00-07:00', startTime: '13:00', endTime: '14:00',
    notes: 'Quick visit. Fresh water and litter box.', createdAt: '2026-03-31T09:00:00Z',
    updatedAt: '2026-04-07T14:15:00Z', statusChangedAt: '2026-04-07T14:15:00Z', statusChangedBy: 'sitter_004', statusHistory: []
  },
  // Timezone edge case: 11:45 PM Pacific on April 10 = April 11 06:45 UTC
  {
    id: 'booking_011', tenantId: 'tenant_seattle', petId: 'pet_006', sitterId: 'sitter_004',
    status: 'requested', scheduledDate: '2026-04-11T06:45:00Z', startTime: '23:45', endTime: '00:45',
    notes: 'Late night potty break. Luna gets restless if skipped.', createdAt: '2026-04-05T08:00:00Z',
    updatedAt: '2026-04-05T08:00:00Z', statusChangedAt: '2026-04-05T08:00:00Z', statusChangedBy: 'user_admin_seattle', statusHistory: []
  },

  // Austin bookings
  {
    id: 'booking_012', tenantId: 'tenant_austin', petId: 'pet_010', sitterId: 'sitter_005',
    status: 'confirmed', scheduledDate: '2026-04-10T08:00:00-05:00', startTime: '08:00', endTime: '10:00',
    notes: 'Morning agility session. Set up cones in backyard.', createdAt: '2026-04-02T15:00:00Z',
    updatedAt: '2026-04-03T10:00:00Z', statusChangedAt: '2026-04-03T10:00:00Z', statusChangedBy: 'user_admin_austin', statusHistory: []
  },
  {
    id: 'booking_013', tenantId: 'tenant_austin', petId: 'pet_011', sitterId: 'sitter_006',
    status: 'requested', scheduledDate: '2026-04-11T16:00:00-05:00', startTime: '16:00', endTime: '17:00',
    notes: 'Evening feeding. Peaches should be in the yard.', createdAt: '2026-04-04T11:00:00Z',
    updatedAt: '2026-04-04T11:00:00Z', statusChangedAt: '2026-04-04T11:00:00Z', statusChangedBy: 'user_staff_austin', statusHistory: []
  },
  {
    id: 'booking_014', tenantId: 'tenant_austin', petId: 'pet_012', sitterId: 'sitter_005',
    status: 'in_progress', scheduledDate: '2026-04-08T07:00:00-05:00', startTime: '07:00', endTime: '08:30',
    notes: 'Early walk before it gets hot. Bring water bowl.', createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-04-08T07:05:00Z', statusChangedAt: '2026-04-08T07:05:00Z', statusChangedBy: 'sitter_005', statusHistory: []
  },
  {
    id: 'booking_015', tenantId: 'tenant_austin', petId: 'pet_013', sitterId: 'sitter_006',
    status: 'completed', scheduledDate: '2026-04-07T09:00:00-05:00', startTime: '09:00', endTime: '10:00',
    notes: 'Morning check. All windows were secure.', createdAt: '2026-03-30T14:00:00Z',
    updatedAt: '2026-04-07T10:10:00Z', statusChangedAt: '2026-04-07T10:10:00Z', statusChangedBy: 'sitter_006', statusHistory: []
  },
  {
    id: 'booking_016', tenantId: 'tenant_austin', petId: 'pet_010', sitterId: 'sitter_006',
    status: 'cancelled', scheduledDate: '2026-04-06T14:00:00-05:00', startTime: '14:00', endTime: '16:00',
    notes: 'Cancelled - owner returned early from trip.', createdAt: '2026-03-29T10:00:00Z',
    updatedAt: '2026-04-05T18:00:00Z', statusChangedAt: '2026-04-05T18:00:00Z', statusChangedBy: 'user_admin_austin', statusHistory: []
  },
  // Extra bookings for pagination testing (Portland)
  {
    id: 'booking_017', tenantId: 'tenant_portland', petId: 'pet_001', sitterId: 'sitter_001',
    status: 'completed', scheduledDate: '2026-04-05T09:00:00-07:00', startTime: '09:00', endTime: '11:00',
    notes: 'Regular morning walk.', createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-04-05T11:10:00Z', statusChangedAt: '2026-04-05T11:10:00Z', statusChangedBy: 'sitter_001', statusHistory: []
  },
  {
    id: 'booking_018', tenantId: 'tenant_portland', petId: 'pet_002', sitterId: 'sitter_002',
    status: 'completed', scheduledDate: '2026-04-04T17:00:00-07:00', startTime: '17:00', endTime: '19:00',
    notes: 'Medication administered. Cat seemed happy.', createdAt: '2026-03-27T09:00:00Z',
    updatedAt: '2026-04-04T19:10:00Z', statusChangedAt: '2026-04-04T19:10:00Z', statusChangedBy: 'sitter_002', statusHistory: []
  },
  {
    id: 'booking_019', tenantId: 'tenant_portland', petId: 'pet_003', sitterId: 'sitter_001',
    status: 'completed', scheduledDate: '2026-04-03T14:00:00-07:00', startTime: '14:00', endTime: '16:00',
    notes: 'Good walk. No issues with other dogs today.', createdAt: '2026-03-26T08:00:00Z',
    updatedAt: '2026-04-03T16:05:00Z', statusChangedAt: '2026-04-03T16:05:00Z', statusChangedBy: 'sitter_001', statusHistory: []
  },
  {
    id: 'booking_020', tenantId: 'tenant_portland', petId: 'pet_004', sitterId: 'sitter_002',
    status: 'completed', scheduledDate: '2026-04-02T10:00:00-07:00', startTime: '10:00', endTime: '11:30',
    notes: 'Hay refilled. Water bottle was almost empty.', createdAt: '2026-03-25T12:00:00Z',
    updatedAt: '2026-04-02T11:40:00Z', statusChangedAt: '2026-04-02T11:40:00Z', statusChangedBy: 'sitter_002', statusHistory: []
  },
];
