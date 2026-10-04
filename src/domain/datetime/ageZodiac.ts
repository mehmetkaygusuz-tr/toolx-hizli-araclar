/**
 * @file ageZodiac.ts
 * Detailed age breakdown (years, months, days, hours, total days lived) & Zodiac astrological calculator.
 */

export interface ZodiacSign {
  nameTr: string;
  symbol: string;
  elementTr: string;
  dateRangeTr: string;
  descriptionTr: string;
}

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  totalDaysLived: number;
  totalHoursLived: number;
  daysUntilNextBirthday: number;
  nextBirthdayDayNameTr: string;
  zodiac: ZodiacSign;
}

const TR_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export function getZodiacSign(month: number, day: number): ZodiacSign {
  // month: 1 (Jan) to 12 (Dec)
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { nameTr: 'Koç', symbol: '♈', elementTr: 'Ateş', dateRangeTr: '21 Mart - 19 Nisan', descriptionTr: 'Cesur, enerjik, öncü ve lider ruhlu.' };
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { nameTr: 'Boğa', symbol: '♉', elementTr: 'Toprak', dateRangeTr: '20 Nisan - 20 Mayıs', descriptionTr: 'Sabırlı, güvenilir, kararlı ve estetik düşkünü.' };
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { nameTr: 'İkizler', symbol: '♊', elementTr: 'Hava', dateRangeTr: '21 Mayıs - 20 Haziran', descriptionTr: 'Meraklı, konuşkan, uyumlu ve hızlı öğrenen.' };
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { nameTr: 'Yengeç', symbol: '♋', elementTr: 'Su', dateRangeTr: '21 Haziran - 22 Temmuz', descriptionTr: 'Duygusal, koruyucu, sezgisel ve aileye bağlı.' };
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { nameTr: 'Aslan', symbol: '♌', elementTr: 'Ateş', dateRangeTr: '23 Temmuz - 22 Ağustos', descriptionTr: 'Cömert, sıcakkanlı, yaratıcı ve kendine güvenen.' };
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { nameTr: 'Başak', symbol: '♍', elementTr: 'Toprak', dateRangeTr: '23 Ağustos - 22 Eylül', descriptionTr: 'Titiz, analitik, yardımsever ve pratik.' };
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { nameTr: 'Terazi', symbol: '♎', elementTr: 'Hava', dateRangeTr: '23 Eylül - 22 Ekim', descriptionTr: 'Adil, diplomatik, dengeli ve sosyal.' };
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { nameTr: 'Akrep', symbol: '♏', elementTr: 'Su', dateRangeTr: '23 Ekim - 21 Kasım', descriptionTr: 'Tutkulu, sezgisel, odaklanmış ve sadık.' };
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { nameTr: 'Yay', symbol: '♐', elementTr: 'Ateş', dateRangeTr: '22 Kasım - 21 Aralık', descriptionTr: 'İyimser, özgürlükçü, felsefi ve maceracı.' };
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { nameTr: 'Oğlak', symbol: '♑', elementTr: 'Toprak', dateRangeTr: '22 Aralık - 19 Ocak', descriptionTr: 'Disiplinli, sorumluluk sahibi, çalışkan ve gerçekçi.' };
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { nameTr: 'Kova', symbol: '♒', elementTr: 'Hava', dateRangeTr: '20 Ocak - 18 Şubat', descriptionTr: 'Özgün, yenilikçi, hümanist ve bağımsız.' };
  } else {
    return { nameTr: 'Balık', symbol: '♓', elementTr: 'Su', dateRangeTr: '19 Şubat - 20 Mart', descriptionTr: 'Empatik, hayal gücü geniş, şefkatli ve sanatçı ruhlu.' };
  }
}

export function calculateAge(birthDateStr: string, referenceDateStr?: string): AgeCalculationResult | null {
  const birth = new Date(birthDateStr);
  const now = referenceDateStr ? new Date(referenceDateStr) : new Date();

  if (isNaN(birth.getTime()) || isNaN(now.getTime()) || birth > now) {
    return null;
  }

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    // Days in previous month
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = now.getTime() - birth.getTime();
  const totalDaysLived = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHoursLived = Math.floor(diffMs / (1000 * 60 * 60));

  // Next birthday calculation
  let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < now) {
    nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const nextDiffMs = nextBday.getTime() - now.getTime();
  const daysUntilNextBirthday = Math.ceil(nextDiffMs / (1000 * 60 * 60 * 24));
  const nextBirthdayDayNameTr = TR_DAYS[nextBday.getDay()];

  const zodiac = getZodiacSign(birth.getMonth() + 1, birth.getDate());

  return {
    years,
    months,
    days,
    totalDaysLived,
    totalHoursLived,
    daysUntilNextBirthday,
    nextBirthdayDayNameTr,
    zodiac,
  };
}
