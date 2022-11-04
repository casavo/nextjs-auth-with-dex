// FIXME: add types

export class Session {
  user: any;
  createdAt: number;

  constructor(user: any, createdAt: number) {
    this.user = user;

    if (createdAt) {
      this.createdAt = createdAt;
    } else {
      this.createdAt = Date.now();
    }
  }
}
