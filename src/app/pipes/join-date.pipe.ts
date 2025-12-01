import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'joinDate',
  standalone: true
})
export class JoinDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }

    const day = date.getDate();
    const suffix = this.getSuffix(day);
    const monthYear = formatDate(date, 'MMMM, y', 'en-US');
    return `${day}${suffix} ${monthYear}`;
  }

  private getSuffix(day: number): string {
    // Rule: if day is > 3 and < 21, always “th”
    if (day > 3 && day < 21) {
      return 'th';
    }

    // Otherwise, use switch on last digit
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
