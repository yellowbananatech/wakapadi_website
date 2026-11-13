export interface Package {
  id: string;
  title: string;
  location: string;
  priceUsd: number;
  priceNgn?: number;
  duration: string;
  includes: string[];
  activities: string[];
  image: string;
  description?: string;
  highlights?: string[];
}

export const PACKAGES_LIST: Package[] = [
  {
    id: 'morocco-tour',
    title: 'Morocco Tour Package',
    location: 'Marrakech, Essaouira & Fes, Morocco',
    priceUsd: 1950,
    priceNgn: 2730000,
    duration: '8 nights / 9 days',
    includes: [
      'Airport shuttle and transfers',
      '3 nights in Marrakech (culture, food, wellness)',
      '2 nights in Essaouira (coastal escape and relaxation)',
      '3 nights in Fes (history and heritage)',
      'Local transportation',
      'Traditional riad stays throughout',
      'Street food tours and local culinary experiences',
      'Pottery and artisan workshop',
      'Hammam spa experience',
      'Guided Medina tour in Fes'
    ],
    activities: [
      'Explore the Medina in Marrakech',
      'Relax in a traditional riad setting',
      'Coastal discovery in Essaouira',
      'Street food tasting experiences',
      'Hands-on pottery and artisan workshop',
      'Traditional Hammam spa treatment',
      'Guided heritage walk in Fes',
      'Local culture and market exploration'
    ],
    image: '/packages/morocco-tour.png',
    description: 'Experience Morocco through a curated journey across Marrakech, Essaouira, and Fes with culture, culinary discovery, relaxation, and heritage in one package.',
    highlights: ['Marrakech, Essaouira and Fes', 'Traditional riad stays', 'Hammam and Medina experiences']
  },
  {
    id: 'turkey-tour',
    title: 'Turkey Tour Package',
    location: 'Istanbul, Cappadocia & Antalya, Turkey',
    priceUsd: 2100,
    priceNgn: 2940000,
    duration: '7 nights / 8 days',
    includes: [
      'Airport shuttle and transfers',
      '2 nights in Istanbul (history, food, Bosphorus)',
      '2 nights in Cappadocia (cave hotel and balloon experience)',
      '3 nights in Antalya (yoga and relaxation)',
      'Local transportation and domestic flights',
      '4/5-star stays throughout',
      'Street food tours and local culinary experiences',
      'Pottery and artisan workshop',
      'Hammam spa experience',
      'Hot air balloon and yoga activities'
    ],
    activities: [
      'Historic city exploration in Istanbul',
      'Bosphorus and culinary experiences',
      'Cappadocia cave stay and balloon adventure',
      'Pottery and local artisan sessions',
      'Wellness-focused yoga in Antalya',
      'Hammam spa experience',
      'Mediterranean relaxation in Antalya',
      'Culture and landscape photography moments'
    ],
    image: '/packages/turkey-tour.png',
    description: 'Discover Turkey with a balanced route through Istanbul, Cappadocia, and Antalya, combining iconic sights, local culture, scenic adventure, and wellness experiences.',
    highlights: ['Istanbul, Cappadocia and Antalya', 'Hot air balloon experience', '4/5-star comfort and wellness']
  },
  {
    id: 'mombasa-7',
    title: '7 Nights in Mombasa',
    location: 'Mombasa, Kenya',
    priceUsd: 1337,
    priceNgn: 2004800,
    duration: '7 nights',
    includes: [
      'Luxury beachfront resort accommodation',
      'Daily breakfast and dinner',
      'Private beach access',
      'Airport transfers',
      '24/7 concierge service'
    ],
    activities: [
      'Snorkeling and diving excursions',
      'Old Town cultural tour',
      'Haller Park wildlife experience',
      'Beach volleyball and water sports',
      'Spa and wellness treatments',
      'Local market shopping tour'
    ],
    image: '/packages/mombasa-7.png',
    description: 'Experience the pristine beaches and rich culture of Mombasa with luxury accommodations and exciting activities.',
    highlights: ['Beachfront luxury resort', 'Water sports included', 'Cultural immersion']
  },
  {
    id: 'zanzibar-6',
    title: '6 Nights in Zanzibar',
    location: 'Zanzibar City & Nungwi, Tanzania',
    priceUsd: 1267,
    priceNgn: 1900000,
    duration: '6 nights / 7 days',
    includes: [
      'Private airport arrival and departure transfers',
      'Luxury air-conditioned transportation throughout',
      '3 nights — Zanzibar City private villa (single occupancy)',
      '3 nights — Nungwi Garden Boutique Hotel (single occupancy)',
      'Complimentary buffet breakfast at Nungwi Hotel (3 mornings)',
      'Guided Stone Town exploration tour',
      'Full-day Nakupenda Sandbank excursion',
      'Traditional dhow cruise and snorkeling',
      'Prison Island guided visit',
      'Included seafood lunch on Day 4',
      'Transparent kayaking experience',
      'Professional drone photography session',
      'Nungwi Turtle Aquarium guided visit',
      'All entrance fees to included attractions'
    ],
    activities: [
      'Stone Town heritage walk',
      'Nakupenda Sandbank excursion',
      'Traditional dhow cruise',
      'Snorkeling at Nakupenda Sandbank',
      'Prison Island visit',
      'Transparent kayaking',
      'Professional drone photography',
      'Nungwi Turtle Aquarium visit',
      'Leisure beach time in Nungwi'
    ],
    image: '/packages/zanzibar-6.jpg',
    description:
      "Discover Zanzibar's UNESCO Stone Town, turquoise sandbanks, and Nungwi's northern coast. A 6-night, 7-day single-occupancy package with villa and boutique hotel stays, curated excursions, and island transfers. Flights, visa, and travel insurance are arranged separately.",
    highlights: ['Single occupancy', 'Stone Town & Nungwi', 'Land package — flights not included']
  },
  {
    id: 'rwanda-7',
    title: '7 Nights in Rwanda',
    location: 'Kigali & Volcanoes National Park, Rwanda',
    priceUsd: 2548,
    priceNgn: 3822000,
    duration: '7 nights',
    includes: [
      '5-star hotel in Kigali',
      'Luxury lodge near Volcanoes National Park',
      'All meals included',
      'Private guide and driver',
      'Gorilla trekking permit'
    ],
    activities: [
      'Mountain gorilla trekking',
      'Golden monkey tracking',
      'Kigali city tour and genocide memorial',
      'Nyungwe Forest canopy walk',
      'Lake Kivu boat cruise',
      'Traditional dance performances',
      'Coffee plantation tour'
    ],
    image: '/packages/rwanda-7.png',
    description: 'Discover the land of a thousand hills with unforgettable wildlife encounters and cultural experiences.',
    highlights: ['Gorilla trekking included', 'Luxury accommodations', 'Private guide']
  },
  {
    id: 'vietnam-honeymoon',
    title: '7 Nights in Vietnam (Honeymoon)',
    location: 'Hanoi, Ha Long Bay, Lan Ha Bay, Cat Ba Island',
    priceUsd: 2800,
    duration: '7 nights',
    includes: [
      'Luxury hotels in Hanoi',
      'Premium cruise in Ha Long Bay',
      'Beachfront resort on Cat Ba Island',
      'All meals and drinks',
      'Private transfers'
    ],
    activities: [
      'Ha Long Bay luxury cruise',
      'Kayaking in Lan Ha Bay',
      'Cat Ba Island exploration',
      'Hanoi Old Quarter food tour',
      'Couples spa treatments',
      'Sunset dinner cruise',
      'Traditional water puppet show',
      'Bike tour through rice paddies'
    ],
    image: '/packages/vietnam-honeymoon.png',
    description: 'A romantic honeymoon experience through Vietnam\'s most stunning landscapes and cultural treasures.',
    highlights: ['Honeymoon package', 'Luxury cruise', 'Romantic activities']
  },
  {
    id: 'doha-5',
    title: '5 Nights in Doha',
    location: 'Doha, Qatar',
    priceUsd: 2200,
    duration: '5 nights',
    includes: [
      '5-star hotel in West Bay',
      'Daily breakfast',
      'Airport transfers',
      'Desert safari experience',
      'City tour'
    ],
    activities: [
      'Souq Waqif exploration',
      'Desert dune bashing and camel ride',
      'Museum of Islamic Art visit',
      'Pearl-Qatar shopping',
      'Dhow cruise in the bay',
      'Katara Cultural Village tour',
      'Luxury spa experience'
    ],
    image: '/packages/doha-5.png',
    description: 'Experience the perfect blend of modern luxury and traditional Qatari culture in Doha.',
    highlights: ['Desert safari included', 'Cultural immersion', 'Luxury shopping']
  },
  {
    id: 'johannesburg-7',
    title: '7 Nights in Johannesburg',
    location: 'Johannesburg, South Africa',
    priceUsd: 2400,
    duration: '7 nights',
    includes: [
      'Boutique hotel in Sandton',
      'Daily breakfast',
      'Private guide',
      'Safari day trip',
      'Airport transfers'
    ],
    activities: [
      'Soweto township tour',
      'Apartheid Museum visit',
      'Lion Park safari experience',
      'Cradle of Humankind tour',
      'Gold Reef City theme park',
      'Constitution Hill visit',
      'Neighborhood food tours',
      'Sunset rooftop dining'
    ],
    image: '/packages/johannesburg-7.png',
    description: 'Explore the vibrant city of Johannesburg with its rich history, culture, and exciting adventures.',
    highlights: ['Safari included', 'Historical tours', 'City exploration']
  },
  {
    id: 'mauritius-honeymoon',
    title: '7 Nights in Mauritius (Honeymoon)',
    location: 'Mauritius',
    priceUsd: 3500,
    duration: '7 nights',
    includes: [
      'Luxury beachfront resort',
      'All-inclusive meals and drinks',
      'Private villa with pool',
      'Airport transfers',
      'Honeymoon amenities'
    ],
    activities: [
      'Private beach dinners',
      'Couples spa treatments',
      'Snorkeling and diving',
      'Catamaran cruise',
      'Seven Colored Earths visit',
      'Chamarel Waterfall tour',
      'Dolphin watching',
      'Sunset photography sessions'
    ],
    image: '/packages/mauritius-honeymoon.png',
    description: 'A romantic paradise escape with pristine beaches, crystal-clear waters, and unforgettable moments.',
    highlights: ['All-inclusive', 'Honeymoon package', 'Private villa']
  },
  {
    id: 'zambia-7',
    title: '7 Nights in Zambia',
    location: 'Livingstone & Victoria Falls, Zambia',
    priceUsd: 2900,
    duration: '7 nights',
    includes: [
      'Luxury lodge near Victoria Falls',
      'All meals',
      'Victoria Falls entry',
      'Private guide',
      'Airport transfers'
    ],
    activities: [
      'Victoria Falls tour',
      'White water rafting',
      'Bungee jumping',
      'Devil\'s Pool swim',
      'Sunset cruise on Zambezi',
      'Game drive in Mosi-oa-Tunya',
      'Helicopter flight over falls',
      'Traditional village visit'
    ],
    image: '/packages/zambia-7.png',
    description: 'Adventure and natural wonder await at one of the world\'s most spectacular waterfalls.',
    highlights: ['Adventure activities', 'Victoria Falls access', 'Luxury lodge']
  },
  {
    id: 'accra-7',
    title: '7 Nights in Accra',
    location: 'Accra, Ghana',
    priceUsd: 2100,
    duration: '7 nights',
    includes: [
      '4-star hotel in Osu',
      'Daily breakfast',
      'City tour',
      'Cultural experiences',
      'Airport transfers'
    ],
    activities: [
      'Jamestown walking tour',
      'Kwame Nkrumah Mausoleum',
      'Cape Coast Castle visit',
      'Kakum National Park canopy walk',
      'Beach day at Labadi Beach',
      'Art Center shopping',
      'Traditional drumming lessons',
      'Local cuisine cooking class'
    ],
    image: '/packages/accra-7.png',
    description: 'Immerse yourself in Ghana\'s rich history, vibrant culture, and warm hospitality.',
    highlights: ['Cultural immersion', 'Historical sites', 'Beach access']
  },
  {
    id: 'explore-naija-13',
    title: 'Explore Naija in 13 Days',
    location: 'Lagos, Abuja, Calabar, Nigeria',
    priceUsd: 3800,
    duration: '13 days',
    includes: [
      'Luxury hotels in each city',
      'All meals',
      'Private guide and driver',
      'Domestic flights',
      'All entrance fees'
    ],
    activities: [
      'Lagos Island and Mainland tour',
      'Nike Art Gallery visit',
      'Tarkwa Bay beach',
      'Abuja city tour and Aso Rock',
      'Calabar Carnival experience',
      'Obudu Cattle Ranch visit',
      'Tinapa Business Resort',
      'Local market tours',
      'Traditional festivals',
      'Nigerian cuisine experiences'
    ],
    image: '/packages/explore-naija-13.png',
    description: 'A comprehensive journey through Nigeria\'s most vibrant cities, cultures, and natural wonders.',
    highlights: ['Multi-city tour', 'All-inclusive', 'Cultural experiences']
  }
];

export const PACKAGES_BY_ID: Record<string, Package> = PACKAGES_LIST.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, Package>
);
