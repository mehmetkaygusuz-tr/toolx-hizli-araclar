/**
 * @file dateDifference.ts
 * Date calculation: days, business days, weeks, months, years, day names.
 */

export interface DateDifferenceResult {
  totalDays: number;
  businessDays: number; // Pazartesi-Cuma arası iş günleri
  weekendDays: number;  // Cumartesi & Pazar
  weeks: number;
  remainingDaysAfterWeeks: number;
  approxMonths: number;
  approxYears: number;
  startDateFormattedTr: string;
  endDateFormattedTr: string;
  startDayNameTr: string;
  endDayNameTr: string;
}

const TR_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export function calculateDateDifference(startDateStr: string, endDateStr: string): DateDifferenceResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      totalDays: 0,
      businessDays: 0,
      weekendDays: 0,
      weeks: 0,
      remainingDaysAfterWeeks: 0,
      approxMonths: 0,
      approxYears: 0,
      startDateFormattedTr: '-',
      endDateFormattedTr: '-',
      startDayNameTr: '-',
      endDayNameTr: '-',
    };
  }

  // Normalize to UTC midnight to avoid DST skew
  const d1 = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
  const d2 = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

  const isReversed = d1.getTime() > d2.getTime();
  const minDate = isReversed ? d2 : d1;
  const maxDate = isReversed ? d1 : d2;

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((maxDate.getTime() - minDate.getTime()) / msPerDay);

  let businessDays = 0;
  let weekendDays = 0;

  const current = new Date(minDate);
  for (let i = 0; i < totalDays; i++) {
    current.setUTCDate(current.getUTCDate() + 1);
    const day = current.getUTCDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
  }

  const weeks = Math.floor(totalDays / 7);
  const remainingDaysAfterWeeks = totalDays % 7;
  const approxMonths = Math.floor((totalDays / 30.4375) * 10) / 10;
  const approxYears = Math.floor((totalDays / 365.25) * 10) / 10;

  const formatTr = (d: Date) =>
    d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  return {
    totalDays: isReversed ? -totalDays : totalDays,
    businessDays: isReversed ? -businessDays : businessDays,
    weekendDays,
    weeks,
    remainingDaysAfterWeeks,
    approxMonths,
    approxYears,
    startDateFormattedTr: formatTr(start),
    endDateFormattedTr: formatTr(end),
    startDayNameTr: TR_DAYS[start.getDay()] || '',
    endDayNameTr: TR_DAYS[end.getDay()] || '',
  };
}
