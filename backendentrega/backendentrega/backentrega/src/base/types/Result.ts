type nullableString = string | null;

export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    public error?: T | nullableString;
    private _value?: T | null;
   

    public constructor(isSuccess: boolean, error?: T | nullableString, value?: T | null) {
        if (isSuccess && error) {
            throw new Error("InvalidOperation: A result cannot be successful and contain an error");
        }
        if (!isSuccess && !error) {
            throw new Error("InvalidOperation: A failing result needs to contain an error message");
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;

        Object.freeze(this);
    }

    public getValue(): T {
        if (!this.isSuccess || this._value === undefined || this._value === null) {
            console.log(this.error);
            throw new Error("Value not set / Can't get the value of an error result. Use 'errorValue' instead.");
        }

        return this._value;
    }

    public errorValue(): T {
        return this.error as T;
    }

    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, null, value);
    }

    public static fail<U>(error: any): Result<U> {
        console.log(`\x1b[31m[fail] ${error}\x1b[0m`);
        return new Result<U>(false, error);
    }
}
