import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { departmentAction, departmentActionCreate, departmentActionDelete, departmentActionUpdate } from '../../constants/urlconstants';
import { DepartmentModel } from '../../models/department.model';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { SwalService } from '../../services/swal.service';
import { DepartmentPipe } from '../../pipes/department.pipe';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, FormValidateDirective, DepartmentPipe],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  departments: DepartmentModel[] = [];


  createModel: DepartmentModel = new DepartmentModel();
  updateModel: DepartmentModel = new DepartmentModel();
  departmentModel: DepartmentModel = new DepartmentModel();

  @ViewChild("createModalCloseButton") createModalCloseButton: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild("updateModalCloseButton") updateModalCloseButton: ElementRef<HTMLButtonElement> | undefined;

  search: string = "";

    constructor(
      private http: HttpService,
      private swal: SwalService
    ) {}

    ngOnInit(): void {
      this.getAll();
    }

    getAll() {
      return this.http.get<DepartmentModel[]>(departmentAction, (res)=> {
        this.departments = res.data;
      })
    }

    get(data: DepartmentModel) {
      this.departmentModel.id = data.id;
      this.departmentModel.name = data.name;
    }

    create(form: NgForm) {
      if(form.valid) {
        this.http.post<string>(departmentActionCreate, this.createModel, res => {
          this.swal.callToast(res.data, "success");
          this.getAll();
          this.createModalCloseButton?.nativeElement.click();
          this.createModel = new DepartmentModel();
        })
      }
    }

    update(form: NgForm) {
      if(form.valid) {
        this.http.put<string>(departmentActionUpdate, this.updateModel, res => {
          this.swal.callToast(res.data, "success")
          this.getAll();
          this.updateModalCloseButton?.nativeElement.click();
        })
      }
    }

    delete(id: string, name: string) {
      this.swal.deleteToast("Delete department ?", `You want to delete ${name}?`, () => {
        this.http.delete<string>(departmentActionDelete, {id:id}, res => {
          this.swal.callToast(res.data, "info")
          this.getAll();
        })
      })
    }
}
