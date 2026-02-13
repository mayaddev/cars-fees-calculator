// src/data/lookups.js

// تم تحديث الهيكل ليشمل نوع المحرك وحدود السعة للمقارنة
export const engineRanges = [
  { 
    id: 1, 
    label: "سيارات حتى 1000 سى سى بنزين", 
    discount: 0.53, 
    engType: "محرك بنزين",
    min: 0, max: 1000 
  },
  { 
    id: 2, 
    label: "سيارات حتى 1000 سى سى بنزين بمعزز كهربائى اقل من 20 %", 
    discount: 0.47, 
    engType: "محرك بنزين وكهربائي",
    min: 0, max: 1000 
  },
  { 
    id: 3, 
    label: "سيارات من 1001 سى سى حتى 1600 سى سى بنزين", 
    discount: 0.50, 
    engType: "محرك بنزين",
    min: 1001, max: 1600 
  },
  { 
    id: 4, 
    label: "سيارات من 1001 سى سى حتى 1600 سى سى بنزين بمعزز كهربائى أقل من 20%", 
    discount: 0.47, 
    engType: "محرك بنزين وكهربائي",
    min: 1001, max: 1600 
  },
  { 
    id: 5, 
    label: "سيارات من 1001 سى سى حتى 1600 سى سى بنزين+محرك كهربائى للدفع", 
    discount: 0.46, 
    engType: "محرك بنزين وكهربائي",
    min: 1001, max: 1600 
  },
  { 
    id: 6, 
    label: "سيارات من 1601 سى سى حتى 2000 سى سى بنزين", 
    discount: 0.58, 
    engType: "محرك بنزين",
    min: 1601, max: 2000 
  },
  { 
    id: 7, 
    label: "سيارات أعلى من 1600 حتى 2000 سى سى بنزين بمعزز كهربائى أقل من 20%", 
    discount: 0.58, 
    engType: "محرك بنزين وكهربائي",
    min: 1601, max: 2000 
  },
  { 
    id: 8, 
    label: "سيارات أعلى من 1600 حتى 2000 سى سى بنزين + محرك كهربائى للدفع", 
    discount: 0.55, 
    engType: "محرك بنزين وكهربائي",
    min: 1601, max: 2000 
  },
  { 
    id: 9, 
    label: "سيارات أعلى من 2000 سى سى بنزين", 
    discount: 0.54, 
    engType: "محرك بنزين",
    min: 2001, max: 99999 
  },
  { 
    id: 10, 
    label: "سيارات أعلى من 2000 سى سى بنزين بمعزز كهربائى أقل من 20%", 
    discount: 0.54, 
    engType: "محرك بنزين وكهربائي",
    min: 2001, max: 99999 
  },
  { 
    id: 11, 
    label: "سيارات أعلى من 2000 سى سى بنزين + محرك كهربائى للدفع", 
    discount: 0.51, 
    engType: "محرك بنزين وكهربائي",
    min: 2001, max: 99999 
  },
  { 
    id: 12, 
    label: "سيارات تعمل بمحرك كهربائى فقط", 
    discount: 0.0, 
    engType: "محرك كهربائي",
    min: 0, max: 0 // لا ينطبق
  },
  { 
    id: 13, 
    label: "E-POWER", 
    discount: 0.29, 
    engType: "محرك كهربائي", 
    min: 0, max: 0 // لا ينطبق
  },
];

// استخراج أنواع المحركات المتاحة ديناميكياً (بدون تكرار)
export const engineTypes = [...new Set(engineRanges.map(item => item.engType))];

export const carData = [
  { make: "ALFA ROMEO", model: "Stelvio" },
  { make: "ALFA ROMEO", model: "Stelvio QuadriFoglio-2.9" },
  { make: "ASTON MARTIN", model: "DB11" },
  { make: "ASTON MARTIN", model: "DBX" },
  { make: "AUDI", model: "A1" },
  { make: "AUDI", model: "A3" },
  { make: "AUDI", model: "A4" },
  { make: "JETOUR", model: "X50" },
  { make: "MERCEDES", model: "GLE400e" },
];