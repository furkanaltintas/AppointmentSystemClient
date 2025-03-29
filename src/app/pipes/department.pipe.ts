import { Pipe, PipeTransform } from '@angular/core';
import { DepartmentModel } from '../models/department.model';

@Pipe({
  name: 'department'
})
export class DepartmentPipe implements PipeTransform {

  transform(value: DepartmentModel[], search: string): DepartmentModel[] {
    if(!search) return value;

    return value.filter(d =>
      d.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )
  }

}
