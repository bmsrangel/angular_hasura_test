import { Component, OnInit } from '@angular/core';
import { HasuraService } from './hasura.service';
import { Subscription } from 'rxjs';
import { UserModel } from '../shared/models/user-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  subsc: Subscription;
  users: UserModel[];
  formulario: FormGroup;

  constructor(
    private service: HasuraService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      username: [null, Validators.required],
      name: [null, Validators.required],
      lastName: [null, Validators.required],
    });
    this.getUsers();
  }

  getUsers() {
    this.subsc = this.service
      .getUsers()
      .pipe(take(1), tap(console.log))
      .subscribe((data) => (this.users = data));
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.service
        .addNewUser(
          this.getFieldValue('username'),
          this.getFieldValue('name'),
          this.getFieldValue('lastName')
        )
        .pipe(take(1))
        .subscribe((data) => console.log(data));
      this.getUsers();
      this.resetForm();
    }
  }

  getFieldValue(fieldName: string) {
    return this.formulario.get(fieldName).value;
  }

  resetForm() {
    this.formulario.reset();
  }
}
