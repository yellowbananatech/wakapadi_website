export interface Package {
  id: string;
  title: string;
  location: string;
  priceUsd: number;
  duration: string;
  includes: string[];
  activities: string[];
  image: string;
  description?: string;
  highlights?: string[];
}

export const PACKAGES_LIST: Package[] = [
  {
    id: 'mombasa-7',
    title: '7 Nights in Mombasa',
    location: 'Mombasa, Kenya',
    priceUsd: 2500,
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
      'Sunset dhow cruise',
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
    id: 'rwanda-7',
    title: '7 Nights in Rwanda',
    location: 'Kigali & Volcanoes National Park, Rwanda',
    priceUsd: 3200,
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
