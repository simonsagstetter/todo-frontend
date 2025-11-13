export class ApiError extends Error {
    status: string;

    constructor( status: string, message: string ) {
        super( message );
        this.name = 'ApiError';
        this.status = status;
    }
}

export class ValidationError extends ApiError {
    fieldErrors: { field: string; message: string }[];

    constructor( status: string, message: string, fieldErrors: { field: string; message: string }[] ) {
        super( status, message );
        this.name = 'ValidationError';
        this.fieldErrors = fieldErrors;
    }
}


export function isValidationError( err: unknown ): err is ValidationError {
    return err instanceof ValidationError;
}

export function isApiError( err: unknown ): err is ApiError {
    return err instanceof ApiError;
}