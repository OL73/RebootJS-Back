export class DatabaseError extends Error {

    err: any;
    constructor(err: any) {
        super();
        this.err = err;
    }

}