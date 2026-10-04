/**
 * @file bmiCalculator.ts
 * WHO-standard Body Mass Index (BMI) & Ideal Weight Calculator.
 */

import { roundToTwoDecimals } from './vatCalculator';

export type BmiCategory =
  | 'underweight'       // Zayıf (< 18.5)
  | 'normal'            // Normal (18.5 - 24.9)
  | 'overweight'        // Fazla Kilolu (25 - 29.9)
  | 'obese_class_1'     // 1. Derece Obezite (30 - 34.9)
  | 'obese_class_2'     // 2. Derece Obezite (35 - 39.9)
  | 'obese_class_3';    // Morbid Obezite (>= 40)

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  categoryLabelTr: string;
  categoryColor: string;
  idealWeightMin: number;
  idealWeightMax: number;
  weightDifferenceToNormal: number; // Fark (0 ise ideal kiloda)
  healthAdviceTr: string;
}

export function calculateBmi(heightCm: number, weightKg: number): BmiResult {
  const hM = heightCm / 100;
  if (hM <= 0 || weightKg <= 0 || isNaN(hM) || isNaN(weightKg)) {
    return {
      bmi: 0,
      category: 'normal',
      categoryLabelTr: 'Değer girilmedi',
      categoryColor: '#94a3b8',
      idealWeightMin: 0,
      idealWeightMax: 0,
      weightDifferenceToNormal: 0,
      healthAdviceTr: 'Lütfen geçerli boy ve kilo bilgisi giriniz.',
    };
  }

  const rawBmi = weightKg / (hM * hM);
  const bmi = roundToTwoDecimals(rawBmi);

  // WHO Ideal Weight Range: BMI 18.5 to 24.9
  const idealWeightMin = roundToTwoDecimals(18.5 * (hM * hM));
  const idealWeightMax = roundToTwoDecimals(24.9 * (hM * hM));

  let category: BmiCategory = 'normal';
  let categoryLabelTr = 'Normal Kilo';
  let categoryColor = '#10b981'; // emerald
  let healthAdviceTr = 'Kilonuz boyunuza göre sağlıklı ve dengeli aralıkta. Bu seviyeyi korumaya devam edin.';
  let weightDifferenceToNormal = 0;

  if (bmi < 18.5) {
    category = 'underweight';
    categoryLabelTr = 'Zayıf';
    categoryColor = '#38bdf8'; // sky
    weightDifferenceToNormal = roundToTwoDecimals(idealWeightMin - weightKg);
    healthAdviceTr = `İdeal kilonun altındasınız. Dengeli ve besleyici bir diyetle yaklaşık ${weightDifferenceToNormal} kg almanız önerilir.`;
  } else if (bmi < 25) {
    category = 'normal';
    categoryLabelTr = 'İdeal / Normal Kilo';
    categoryColor = '#10b981';
    weightDifferenceToNormal = 0;
  } else if (bmi < 30) {
    category = 'overweight';
    categoryLabelTr = 'Fazla Kilolu';
    categoryColor = '#f59e0b'; // amber
    weightDifferenceToNormal = roundToTwoDecimals(weightKg - idealWeightMax);
    healthAdviceTr = `İdeal kilonun biraz üzerindesiniz. Günlük hafif egzersiz ve dengeli beslenme ile ${weightDifferenceToNormal} kg vermeniz ideal aralığa geçmenizi sağlar.`;
  } else if (bmi < 35) {
    category = 'obese_class_1';
    categoryLabelTr = '1. Derece Obezite';
    categoryColor = '#f97316'; // orange
    weightDifferenceToNormal = roundToTwoDecimals(weightKg - idealWeightMax);
    healthAdviceTr = `Vücut kitle indeksiniz 1. derece obezite aralığında. Sağlıklı bir yaşam tarzı için uzman bir diyetisyen veya doktora danışmanız faydalı olacaktır.`;
  } else if (bmi < 40) {
    category = 'obese_class_2';
    categoryLabelTr = '2. Derece Obezite';
    categoryColor = '#ef4444'; // red
    weightDifferenceToNormal = roundToTwoDecimals(weightKg - idealWeightMax);
    healthAdviceTr = `Kilonuz kalp ve damar sağlığınızı etkileyebilir. Tıbbi takip eşliğinde kilo kontrolü sağlanması tavsiye edilir.`;
  } else {
    category = 'obese_class_3';
    categoryLabelTr = '3. Derece (Morbid) Obezite';
    categoryColor = '#b91c1c'; // dark red
    weightDifferenceToNormal = roundToTwoDecimals(weightKg - idealWeightMax);
    healthAdviceTr = `Yüksek risk grubu. Sağlık kuruluşuna başvurarak profesyonel tıbbi destek almanız önerilir.`;
  }

  return {
    bmi,
    category,
    categoryLabelTr,
    categoryColor,
    idealWeightMin,
    idealWeightMax,
    weightDifferenceToNormal,
    healthAdviceTr,
  };
}
