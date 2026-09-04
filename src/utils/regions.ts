import type { Coordinates } from "../entities/Coordinates";

export type Region = {
  name: string;
  center: Coordinates;
  radiusKm: number;
};

type Place = { name: string; lat: number; lng: number };

function toRegions(places: Place[], radiusKm: number): Region[] {
  return places.map(({ name, lat, lng }) => ({
    name,
    center: { latitude: lat, longitude: lng },
    radiusKm,
  }));
}

const BIG_CITIES: Place[] = [
  { name: "Skopje", lat: 41.9965, lng: 21.4314 },
  { name: "Bitola", lat: 41.0294, lng: 21.335 },
  { name: "Kumanovo", lat: 42.1322, lng: 21.7144 },
  { name: "Prilep", lat: 41.3453, lng: 21.5544 },
  { name: "Tetovo", lat: 42.0092, lng: 20.9714 },
  { name: "Veles", lat: 41.715, lng: 21.7758 },
  { name: "Ohrid", lat: 41.116, lng: 20.8016 },
  { name: "Gostivar", lat: 41.7994, lng: 20.9089 },
  { name: "Štip", lat: 41.7414, lng: 22.19 },
  { name: "Strumica", lat: 41.4375, lng: 22.643 },
];

const MONUMENTS: Place[] = [
  // Skopje
  { name: "Skopje – Macedonia Square", lat: 41.9962, lng: 21.4319 },
  { name: "Skopje – Stone Bridge", lat: 41.9975, lng: 21.4335 },
  { name: "Skopje – Old Bazaar", lat: 42.0006, lng: 21.4368 },
  { name: "Skopje – Kale Fortress", lat: 42.0016, lng: 21.4308 },
  // Ohrid
  { name: "Ohrid – Old Town Waterfront", lat: 41.114, lng: 20.7998 },
  { name: "Ohrid – Sveta Sofija", lat: 41.1146, lng: 20.7975 },
  { name: "Ohrid – Samuel's Fortress", lat: 41.115, lng: 20.793 },
  // Other cities
  { name: "Bitola – Širok Sokak", lat: 41.0294, lng: 21.3345 },
  { name: "Bitola – Clock Tower", lat: 41.0316, lng: 21.3356 },
  { name: "Tetovo – Painted Mosque", lat: 42.0113, lng: 20.9756 },
  { name: "Struga – Old Bridge", lat: 41.1776, lng: 20.6784 },
  { name: "Prilep – Clock Tower", lat: 41.3447, lng: 21.5556 },
  { name: "Kruševo – Makedonium", lat: 41.3729, lng: 21.247 },
];

const LAKE_SHORES: Place[] = [
  { name: "Peštani", lat: 40.9836, lng: 20.7503 },
  { name: "Trpejca", lat: 40.9483, lng: 20.7856 },
  { name: "Sveti Naum", lat: 40.9142, lng: 20.7472 },
  { name: "Oteševo", lat: 40.9231, lng: 20.9147 },
  { name: "Star Dojran", lat: 41.1869, lng: 22.7186 },
  { name: "Nov Dojran", lat: 41.2072, lng: 22.7175 },
];

const TOWNS: Place[] = [
  { name: "Kavadarci", lat: 41.4331, lng: 22.0117 },
  { name: "Kočani", lat: 41.9167, lng: 22.4128 },
  { name: "Kičevo", lat: 41.5147, lng: 20.9592 },
  { name: "Struga", lat: 41.1778, lng: 20.6781 },
  { name: "Radoviš", lat: 41.6383, lng: 22.4644 },
  { name: "Gevgelija", lat: 41.1406, lng: 22.5011 },
  { name: "Debar", lat: 41.525, lng: 20.5272 },
  { name: "Kriva Palanka", lat: 42.2011, lng: 22.3322 },
  { name: "Sveti Nikole", lat: 41.8656, lng: 21.9428 },
  { name: "Negotino", lat: 41.4842, lng: 22.0894 },
  { name: "Delčevo", lat: 41.9681, lng: 22.7767 },
  { name: "Vinica", lat: 41.8828, lng: 22.5089 },
  { name: "Resen", lat: 41.0892, lng: 21.0119 },
  { name: "Probištip", lat: 41.995, lng: 22.1786 },
  { name: "Bogdanci", lat: 41.2033, lng: 22.5719 },
  { name: "Valandovo", lat: 41.3169, lng: 22.5619 },
  { name: "Berovo", lat: 41.7072, lng: 22.8564 },
  { name: "Kratovo", lat: 42.0783, lng: 22.1792 },
];

const LARGE_VILLAGES: Place[] = [
  { name: "Bogovinje", lat: 41.9203, lng: 20.9142 },
  { name: "Čegrane", lat: 41.7353, lng: 20.9469 },
  { name: "Vrapčište", lat: 41.8339, lng: 20.8869 },
  { name: "Želino", lat: 41.9233, lng: 21.0028 },
  { name: "Tearce", lat: 42.0708, lng: 21.0517 },
  { name: "Studeničani", lat: 41.9331, lng: 21.4778 },
  { name: "Saraj", lat: 42.0, lng: 21.3178 },
  { name: "Labuništa", lat: 41.3486, lng: 20.5842 },
  { name: "Velešta", lat: 41.2506, lng: 20.6222 },
  { name: "Lipkovo", lat: 42.1567, lng: 21.5808 },
  { name: "Vevčani", lat: 41.2411, lng: 20.5947 },

];

const TOURIST: Place[] = [
  { name: "Mavrovo", lat: 41.6597, lng: 20.7433 },
  { name: "Matka Canyon", lat: 41.9508, lng: 21.3006 },
  { name: "Stobi", lat: 41.5556, lng: 21.9744 },
  { name: "Kokino", lat: 42.2606, lng: 21.9539 },
  { name: "Popova Šapka", lat: 41.9797, lng: 20.8358 },
  { name: "Nižepole (Pelister)", lat: 41.0061, lng: 21.1836 },
  { name: "Galičnik", lat: 41.6222, lng: 20.665 },
  { name: "Demir Kapija", lat: 41.4114, lng: 22.2436 },
  { name: "Kolešino Falls", lat: 41.3881, lng: 22.8419 },
];

const CITY_CENTERS: Place[] = [
  { name: "Skopje", lat: 41.9962, lng: 21.4319 },
  { name: "Bitola", lat: 41.031, lng: 21.3348 },
  { name: "Kumanovo", lat: 42.1322, lng: 21.7144 },
  { name: "Prilep", lat: 41.3453, lng: 21.5544 },
  { name: "Tetovo", lat: 42.01, lng: 20.9714 },
  { name: "Veles", lat: 41.7156, lng: 21.7756 },
  { name: "Štip", lat: 41.7414, lng: 22.19 },
  { name: "Ohrid", lat: 41.118, lng: 20.801 },
  { name: "Gostivar", lat: 41.7994, lng: 20.9089 },
  { name: "Strumica", lat: 41.4375, lng: 22.643 },
  { name: "Kavadarci", lat: 41.4331, lng: 22.0117 },
  { name: "Kočani", lat: 41.9167, lng: 22.4128 },
  { name: "Kičevo", lat: 41.5147, lng: 20.9592 },
  { name: "Struga", lat: 41.1778, lng: 20.6781 },
  { name: "Radoviš", lat: 41.6383, lng: 22.4644 },
  { name: "Gevgelija", lat: 41.1406, lng: 22.5011 },
  { name: "Debar", lat: 41.525, lng: 20.5272 },
  { name: "Kriva Palanka", lat: 42.2011, lng: 22.3322 },
  { name: "Sveti Nikole", lat: 41.8656, lng: 21.9428 },
  { name: "Negotino", lat: 41.4842, lng: 22.0894 },
  { name: "Delčevo", lat: 41.9681, lng: 22.7767 },
  { name: "Vinica", lat: 41.8828, lng: 22.5089 },
  { name: "Resen", lat: 41.0892, lng: 21.0119 },
  { name: "Probištip", lat: 41.995, lng: 22.1786 },
  { name: "Bogdanci", lat: 41.2033, lng: 22.5719 },
  { name: "Valandovo", lat: 41.3169, lng: 22.5619 },
  { name: "Berovo", lat: 41.7072, lng: 22.8564 },
  { name: "Kratovo", lat: 42.0783, lng: 22.1792 },
  { name: "Kruševo", lat: 41.3697, lng: 21.2478 },
  { name: "Demir Hisar", lat: 41.2203, lng: 21.2033 },
  { name: "Demir Kapija", lat: 41.4114, lng: 22.2436 },
  { name: "Makedonski Brod", lat: 41.5133, lng: 21.2153 },
  { name: "Makedonska Kamenica", lat: 42.0253, lng: 22.5964 },
  { name: "Pehčevo", lat: 41.7592, lng: 22.8908 },
];

export const EASY_REGIONS: Region[] = [
  ...toRegions(CITY_CENTERS, 0.1),
  ...toRegions(MONUMENTS, 0.1),
  ...toRegions(LAKE_SHORES, 0.1),
];

export const MEDIUM_REGIONS: Region[] = [
  ...toRegions(CITY_CENTERS, 1),
  ...toRegions(MONUMENTS, 1),
  ...toRegions(LAKE_SHORES, 1),

  ...toRegions(BIG_CITIES, 3),
  ...toRegions(TOWNS, 1.2),
  ...toRegions(LARGE_VILLAGES, 0.5),
  ...toRegions(TOURIST, 0.8),
];
