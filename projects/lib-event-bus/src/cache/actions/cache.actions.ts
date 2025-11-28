export namespace CacheActions {

  export class UpdateKey {
    static readonly type = '[Cache] UpdateKey';
    constructor(public key: string, public data: any) {}
  }

}
