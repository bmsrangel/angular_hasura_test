export class UserModel {
  id: number;
  username: string;
  name: string;
  lastName: string;

  constructor(json?: any) {
    this.id = json['id'];
    this.username = json['username'];
    this.name = json['name'];
    this.lastName = json['last_name'];
  }
}
