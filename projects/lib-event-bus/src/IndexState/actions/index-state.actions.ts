export namespace IndexStateActions {
    export class Update {
      static readonly type = '[IndexState] Update';
      constructor(public key: string, public data: any) {}
    }
  
    export class Clear {
      static readonly type = '[IndexState] Clear';
    }
  }
  