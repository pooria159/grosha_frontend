import { toJalali } from 'jalaali-js';
import { toPersianDigits } from './toPersianDigits';

export function toJalaliDate(isoDate: string): string {
  const date = new Date(isoDate);
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();
  const { jy, jm, jd } = toJalali(gYear, gMonth, gDay);

  return `${toPersianDigits(jy)}/${toPersianDigits(jm.toString().padStart(2, '0'))}/${toPersianDigits(jd.toString().padStart(2, '0'))}`;
}
