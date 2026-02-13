// src/utils/calculator.js

/**
 * دالة حساب الرسوم الجمركية والودائع
 * @param {Object} inputs - المدخلات (قيمة الوديعة بدون تطبيق، قيمة الوديعة مع تطبيق، نسبة خصم المحرك)
 * @returns {Object} - النتائج النهائية والقيم الوصفية
 */
export function calculateFees(inputs) {
  const {
    depositNoAgreement, // الوديعة الكاملة (عدم تطبيق)
    depositAgreement,   // الوديعة الكاملة (تطبيق)
    rangeDiscount       // نسبة خصم سعة المحرك (مثلاً 0.50)
  } = inputs;

  // تحويل المدخلات لأرقام لضمان سلامة العمليات
  const valNoAg = Number(depositNoAgreement);
  const valAg = Number(depositAgreement);

  // ---------------------------------------------------------
  // 1. تحديد شريحة التخفيض بناءً على قيمة "عدم تطبيق الاتفاقية"
  // ---------------------------------------------------------
  let ratioInter = 0; // نسبة الفئة المتوسطة
  let ratioBasic = 0; // نسبة الفئة الأساسية
  let tierDescription = "";

  if (valNoAg <= 10000) {
    ratioInter = 0.20;
    ratioBasic = 0.25;
    tierDescription = "شريحة أقل من أو تساوي 10,000 (20% متوسط - 25% أساسي)";
  } else if (valNoAg > 10000 && valNoAg <= 20000) {
    ratioInter = 0.25;
    ratioBasic = 0.30;
    tierDescription = "شريحة من 10,001 إلى 20,000 (25% متوسط - 30% أساسي)";
  } else { // أكبر من 20000
    ratioInter = 0.30;
    ratioBasic = 0.35;
    tierDescription = "شريحة أكبر من 20,000 (30% متوسط - 35% أساسي)";
  }

  // ---------------------------------------------------------
  // 2. التحقق من حالة الاتفاقية (التساوي vs الاختلاف)
  // ---------------------------------------------------------
  const isEqual = valAg === valNoAg;
  
  // نص الحالة للعرض في الجدول والرسالة
  const agreementStatusText = isEqual ? "السيارة لاتطبق اتفاقية" : "السيارة تطبق اتفاقية";

  // ---------------------------------------------------------
  // 3. الحسابات الأولية (قبل خصم سعة المحرك)
  // ---------------------------------------------------------

  // أ) جانب عدم تطبيق الاتفاقية (القواعد ثابتة في الحالتين)
  // ========================================================
  // الفئة المتوسطة = القيمة - (القيمة * نسبة المتوسط)
  const rawInterNoAg = valNoAg - (valNoAg * ratioInter);
  // الفئة الأساسية = القيمة - (القيمة * نسبة الأساسي)
  const rawBasicNoAg = valNoAg - (valNoAg * ratioBasic);


  // ب) جانب تطبيق الاتفاقية (يعتمد على التساوي)
  // ========================================================
  let rawFullAg, rawInterAg, rawBasicAg;
  let logicUsed = "";
  // كائن لتخزين شرح العمليات الحسابية (للعرض في الرسالة التأكيدية)
  let agreementCalcDescription = null; 

  if (isEqual) {
    // الحالة الأولى: القيم متساوية (ليس لها وديعة اتفاقية)
    // ----------------------------------------------------
    logicUsed = "تساوي القيمتين (تطبيق نفس نسب الخصم)";
    
    rawFullAg = valAg;
    rawInterAg = valAg - (valAg * ratioInter);
    rawBasicAg = valAg - (valAg * ratioBasic);

  } else {
    // الحالة الثانية: القيم مختلفة (لها وديعة اتفاقية)
    // ----------------------------------------------------
    logicUsed = "اختلاف القيمتين (استخدام معادلات الاتفاقية 1.06 و 1.03)";
    
    rawFullAg = valAg;

    // معادلة الفئة الأساسية في حالة الاتفاقية: القسمة على 1.06
    rawBasicAg = valAg / 1.06;

    // معادلة الفئة المتوسطة في حالة الاتفاقية: الأساسية مضروبة في 1.03
    rawInterAg = rawBasicAg * 1.03;

    // تعبئة وصف العمليات (كما طلبت لإظهاره في الرسالة)
    agreementCalcDescription = {
      basicFactor: "القسمة على 1.06 (الوديعة الكاملة / 1.06)",
      interFactor: "الضرب في 1.03 (الوديعة الأساسية * 1.03)"
    };
  }

  // ---------------------------------------------------------
  // 4. تطبيق خصم سعة المحرك (Range Discount) والقيم النهائية
  // ---------------------------------------------------------
  
  // دالة مساعدة لتطبيق الخصم
  const applyDisc = (val, disc) => val - (val * disc);

  let finalFullNoAg, finalInterNoAg, finalBasicNoAg;
  let finalFullAg, finalInterAg, finalBasicAg;

  // -- حسابات عدم تطبيق الاتفاقية (دائماً يطبق عليها خصم المحرك) --
  finalFullNoAg = applyDisc(valNoAg, rangeDiscount);
  finalInterNoAg = applyDisc(rawInterNoAg, rangeDiscount);
  finalBasicNoAg = applyDisc(rawBasicNoAg, rangeDiscount);

  // -- حسابات تطبيق الاتفاقية --
  if (isEqual) {
    // في حالة التساوي: نعاملها معاملة العادية ونطبق الخصم
    finalFullAg = applyDisc(rawFullAg, rangeDiscount);
    finalInterAg = applyDisc(rawInterAg, rangeDiscount);
    finalBasicAg = applyDisc(rawBasicAg, rangeDiscount);
  } else {
    // في حالة الاختلاف (لها اتفاقية): القيم المحسوبة (بالـ 1.06 و 1.03) هي النهائية
    // لا يتم تطبيق خصم سعة المحرك عليها مرة أخرى
    finalFullAg = rawFullAg;
    finalInterAg = rawInterAg;
    finalBasicAg = rawBasicAg;
  }

  // ---------------------------------------------------------
  // 5. إرجاع النتائج
  // ---------------------------------------------------------
  return {
    // النتائج الرقمية النهائية
    fullNoAg: finalFullNoAg,
    fullAg: finalFullAg,
    interNoAg: finalInterNoAg,
    interAg: finalInterAg,
    basicNoAg: finalBasicNoAg,
    basicAg: finalBasicAg,
    
    // البيانات الوصفية (Meta Data) للعرض في الواجهة والتحقق
    meta: {
      tierDescription,          // وصف الشريحة (أقل من 10 آلاف.. إلخ)
      logicUsed,                // وصف المنطق المستخدم
      agreementStatusText,      // "لها وديعة.." أو "ليس لها وديعة.."
      isEqual,                  // هل القيم متساوية؟ (boolean)
      agreementCalcDescription, // وصف معادلات الاتفاقية (null في حالة التساوي)
      
      // نسب مئوية منسقة للعرض
      rangeDiscountPercent: (rangeDiscount * 100).toFixed(0) + '%',
      ratioInterPercent: (ratioInter * 100).toFixed(0) + '%',
      ratioBasicPercent: (ratioBasic * 100).toFixed(0) + '%'
    }
  };
}