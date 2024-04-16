// Using the Error class to handle errors or bad requests
class ApiError extends Error {
    
    // required fields when handling error
    constructor(
        statusCode,
        message= "Something Went Wrong!",
        errors = [],
        stack = ""
    ) {
        
        // overwriting all the fields when handling error
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message
        this.success = false;
        this.errors = errors;

        // trace the error stack
        if (stack) this.stack = stack;
        else Error.captureStackTrace(this, this.constructor);
    }
}

// export the error response
export { ApiError }