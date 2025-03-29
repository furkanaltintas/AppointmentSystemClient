import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { userAction, userActionCreate, userActionDelete, userActionGetAllRoles, userActionUpdate } from '../../constants/urlconstants';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { UserPipe } from '../../pipes/user.pipe';
import { RouterLink } from '@angular/router';
import { RoleModel } from '../../models/role.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, FormValidateDirective, UserPipe, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: UserModel[] = [];
  roles: RoleModel[] = [];

  createModel: UserModel = new UserModel();
  updateModel: UserModel = new UserModel();

  @ViewChild("createModalCloseButton") createModalCloseButton: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild("updateModalCloseButton") updateModalCloseButton: ElementRef<HTMLButtonElement> | undefined;

  search: string = "";

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.getAllRoles();
  }

  getAll() {
    return this.http.get<UserModel[]>(userAction, (res)=> {
      this.users = res.data;
    })
  }

  getAllRoles() {
    this.http.get<RoleModel[]>(userActionGetAllRoles, res => {
      this.roles = res.data;
    })
  }

  get(data: UserModel) {
    this.updateModel = {...data};
  }

  create(form: NgForm) {
    if(form.valid) {
      this.http.post<string>(userActionCreate, this.createModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.createModalCloseButton?.nativeElement.click();
        this.createModel = new UserModel();
      });
    }
  }

  update(form: NgForm) {
    if(form.valid) {
      this.http.put<string>(userActionUpdate, this.updateModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.updateModalCloseButton?.nativeElement.click();
      });
    }
  }

  delete(id: string, fullName: string) {
      this.swal.deleteToast("Delete user ?", `You want to delete ${fullName}?`, () => {
        this.http.delete<string>(userActionDelete, {id:id}, (res) => {
          this.swal.callToast(res.data, "info");
          this.getAll();
        })
      })
  }
}
