import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'joinDate',
  standalone:true
})
export class JoinDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    return formatDate(value, 'd MMMM, y', 'en-US');
  }
}
