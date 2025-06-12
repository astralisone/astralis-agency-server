/**
 * Utility functions for error handling
 */
/**
 * Type guard to check if an error is an instance of Error
 * @param error The error object to check
 * @returns True if the error is an instance of Error
 */
const isError = (error) => {
    return error instanceof Error;
};
/**
 * Formats an error response with consistent structure
 * @param error The error object
 * @param message A user-friendly error message
 * @returns A formatted error response object
 */
export const formatErrorResponse = (error, message) => {
    let errorMessage;
    if (isError(error)) {
        errorMessage = error.message;
    }
    else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
    }
    else if (typeof error === 'string') {
        errorMessage = error;
    }
    else {
        errorMessage = 'Unknown error';
    }
    console.error(message, errorMessage);
    return {
        status: 'error',
        message,
        error: errorMessage
    };
};
/**
 * Extracts the error message from an error object
 * @param error The error object
 * @returns The error message string
 */
export const getErrorMessage = (error) => {
    if (isError(error)) {
        return error.message;
    }
    else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        return error.message;
    }
    else if (typeof error === 'string') {
        return error;
    }
    return 'Unknown error';
};
/**
 * Creates a not found error response
 * @param resourceType The type of resource that was not found (e.g., 'Post', 'User')
 * @param id The ID of the resource that was not found
 * @returns A formatted error response object
 */
export const createNotFoundError = (resourceType, id) => {
    return {
        status: 'error',
        message: `${resourceType} not found`,
        error: `${resourceType} with ID ${id} does not exist`
    };
};
