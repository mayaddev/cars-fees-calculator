// src/utils/calculator.js

// export function calculateFees(inputs) {
//   const {
//     depositNoAgreement, // قيمة الوديعة عدم تطبيق اتفاقية (الفئة الكاملة)
//     depositAgreement,   // قيمة الوديعة تطبيق اتفاقية (الفئة الكاملة)
//     rangeDiscount       // نسبة الخصم الخاصة بسعة المحرك (مثلاً 0.50)
//   } = inputs;

//   const valNoAg = Number(depositNoAgreement);
//   const valAg = Number(depositAgreement);

//   // 1. تحديد نسب التخفيض للفئات المتوسطة والأساسية (بناء على قيمة الوديعة الكاملة بدون اتفاقية)
//   let ratioInter = 0;
//   let ratioBasic = 0;

//   if (valNoAg <= 10000) {
//     ratioInter = 0.20;
//     ratioBasic = 0.25;
//   } else if (valNoAg > 10000 && valNoAg <= 20000) {
//     ratioInter = 0.25;
//     ratioBasic = 0.30;
//   } else if (valNoAg > 20000) {
//     ratioInter = 0.30;
//     ratioBasic = 0.35;
//   }

//   // القيم الأولية قبل تطبيق خصم المحرك (Pre-Engine-Discount Values)
  
//   // الفئة المتوسطة (بدون اتفاقية)
//   const rawInterNoAg = valNoAg - (valNoAg * ratioInter);
//   // الفئة الأساسية (بدون اتفاقية)
//   const rawBasicNoAg = valNoAg - (valNoAg * ratioBasic);

//   let rawFullAg, rawInterAg, rawBasicAg;
  
//   // السيناريو الأول: القيم متساوية (تطبيق = عدم تطبيق)
//   const isEqual = valAg === valNoAg;

//   if (isEqual) {
//     // في حالة التساوي: الحسابات تعتمد على نفس المنطق
//     rawFullAg = valAg;
//     rawInterAg = valAg - (valAg * ratioInter);
//     rawBasicAg = valAg - (valAg * ratioBasic);
//   } else {
//     // السيناريو الثاني: القيم غير متساوية
//     rawFullAg = valAg; // قيمة مدخلة
//     // القوانين الخاصة بالسيناريو الثاني
//     // الفئة الأساسية (تطبيق) = الكاملة (تطبيق) / 1.06
//     rawBasicAg = valAg / 1.06;
//     // الفئة المتوسطة (تطبيق) = الأساسية (تطبيق) * 1.03
//     rawInterAg = rawBasicAg * 1.03;
//   }

//   // 2. تطبيق نسب التخفيض النهائية (Engine Capacity Discount)
  
//   // دالة مساعدة للخصم
//   const applyDisc = (val, disc) => val - (val * disc);

//   let finalFullNoAg, finalInterNoAg, finalBasicNoAg;
//   let finalFullAg, finalInterAg, finalBasicAg;

//   // حسابات عدم تطبيق الاتفاقية (دائماً يطبق عليها الخصم في كل الحالات)
//   finalFullNoAg = applyDisc(valNoAg, rangeDiscount);
//   finalInterNoAg = applyDisc(rawInterNoAg, rangeDiscount);
//   finalBasicNoAg = applyDisc(rawBasicNoAg, rangeDiscount);

//   if (isEqual) {
//     // في حالة التساوي: يطبق الخصم أيضاً على "تطبيق الاتفاقية"
//     finalFullAg = applyDisc(rawFullAg, rangeDiscount);
//     finalInterAg = applyDisc(rawInterAg, rangeDiscount);
//     finalBasicAg = applyDisc(rawBasicAg, rangeDiscount);
//   } else {
//     // في حالة عدم التساوي: لا يطبق الخصم، تؤخذ القيم المحسوبة كما هي
//     finalFullAg = rawFullAg;
//     finalInterAg = rawInterAg;
//     finalBasicAg = rawBasicAg;
//   }

//   return {
//     fullNoAg: finalFullNoAg,
//     fullAg: finalFullAg,
//     interNoAg: finalInterNoAg,
//     interAg: finalInterAg,
//     basicNoAg: finalBasicNoAg,
//     basicAg: finalBasicAg
//   };
// }

// src/utils/calculator.js

export function calculateFees(inputs) {
  const {
    depositNoAgreement,
    depositAgreement,
    rangeDiscount
  } = inputs;

  const valNoAg = Number(depositNoAgreement);
  const valAg = Number(depositAgreement);
// التحقق من التساوي (Logic Identification)
  // 1. تحديد نسب التخفيض للفئات (Logic Identification)
  let ratioInter = 0;
  let ratioBasic = 0;
  let tierDescription = "";

  if (valNoAg <= 10000) {
    ratioInter = 0.20;
    ratioBasic = 0.25;
    tierDescription = "شريحة أقل من 10,000 (20% متوسط - 25% أساسي)";
  } else if (valNoAg > 10000 && valNoAg <= 20000) {
    ratioInter = 0.25;
    ratioBasic = 0.30;
    tierDescription = "شريحة 10,001 - 20,000 (25% متوسط - 30% أساسي)";
  } else if (valNoAg > 20000) {
    ratioInter = 0.30;
    ratioBasic = 0.35;
    tierDescription = "شريحة أكبر من 20,000 (30% متوسط - 35% أساسي)";
  }

  // القيم الأولية
  const rawInterNoAg = valNoAg - (valNoAg * ratioInter);
  const rawBasicNoAg = valNoAg - (valNoAg * ratioBasic);

  let rawFullAg, rawInterAg, rawBasicAg;
  const isEqual = valAg === valNoAg;
const agreementStatusText = isEqual ? "ليس لها وديعة اتفاقية" : "لها وديعة اتفاقية";
  // منطق الاتفاقية
  let logicUsed = "";
  if (isEqual) {
    logicUsed = "تساوي القيمتين (تطبيق نفس نسب الخصم)";
    rawFullAg = valAg;
    rawInterAg = valAg - (valAg * ratioInter);
    rawBasicAg = valAg - (valAg * ratioBasic);
  } else {
    logicUsed = "اختلاف القيمتين (استخدام معادلات 1.06 و 1.03)";
    rawFullAg = valAg;
    rawBasicAg = valAg / 1.06;
    rawInterAg = rawBasicAg * 1.03;
  }

  // دالة مساعدة
  const applyDisc = (val, disc) => val - (val * disc);

  let finalFullNoAg, finalInterNoAg, finalBasicNoAg;
  let finalFullAg, finalInterAg, finalBasicAg;

  // الحساب النهائي
  finalFullNoAg = applyDisc(valNoAg, rangeDiscount);
  finalInterNoAg = applyDisc(rawInterNoAg, rangeDiscount);
  finalBasicNoAg = applyDisc(rawBasicNoAg, rangeDiscount);

  if (isEqual) {
    finalFullAg = applyDisc(rawFullAg, rangeDiscount);
    finalInterAg = applyDisc(rawInterAg, rangeDiscount);
    finalBasicAg = applyDisc(rawBasicAg, rangeDiscount);
  } else {
    finalFullAg = rawFullAg;
    finalInterAg = rawInterAg;
    finalBasicAg = rawBasicAg;
  }

  return {
    fullNoAg: finalFullNoAg,
    fullAg: finalFullAg,
    interNoAg: finalInterNoAg,
    interAg: finalInterAg,
    basicNoAg: finalBasicNoAg,
    basicAg: finalBasicAg,
    // معلومات إضافية للعرض (Debug Info)
    meta: {
      tierDescription,
      logicUsed,
      agreementStatusText, // <--- نضيف المتغير الجديد هنا
      isEqual,             // <--- نحتاج هذا لتلوين الحالة (اختياري)
      rangeDiscountPercent: (rangeDiscount * 100).toFixed(0) + '%',
      ratioInterPercent: (ratioInter * 100).toFixed(0) + '%',
      ratioBasicPercent: (ratioBasic * 100).toFixed(0) + '%',
      isEqual
    }
  };
}