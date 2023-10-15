export class User {
  id : Number;
  username : string;

  constructor(id : Number, username : string) {
    this.id = id;
    this.username = username;
  }

  getId() {
    return this.id;
  }

  getNome() {
    return this.username;
  }

}
