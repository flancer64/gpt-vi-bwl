/**
 * Data Transfer Objects (DTOs) and supporting logic for updating weight records.
 * This script contains:
 * - The request DTO defining the input structure required to update a weight record.
 * - The response DTO defining the output structure returned by the API.
 * - Result codes indicating the outcome of the operation.
 * - Factory functions for creating and validating DTOs.
 *
 * The API allows users to submit or update their weight for a specific date.
 *
 * @namespace Vi_Bwl_Shared_Web_Api_Weight_Update
 */

// VARS
/**
 * Enumeration of possible result codes for the weight update process.
 * These codes indicate the outcome of the operation and help the application
 * handle the response appropriately.
 *
 * @memberOf Vi_Bwl_Shared_Web_Api_Weight_Update
 */
const RESULT_CODE = {
    /**
     * Indicates that an internal server error occurred while processing the request.
     */
    SERVER_ERROR: 'SERVER_ERROR',

    /**
     * Indicates that the weight record was successfully updated.
     */
    SUCCESS: 'SUCCESS',
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request DTO for updating weight records.
 * Defines the input data required by the API to update a weight entry.
 *
 * @memberOf Vi_Bwl_Shared_Web_Api_Weight_Update
 */
class Request {
    /**
     * The unique user code for identifying the weight record.
     *
     * @type {string}
     * @example "user123"
     */
    userCode;

    /**
     * The date for the weight record to be updated.
     *
     * @type {Date}
     * @example "2024-01-01"
     */
    date;

    /**
     * The weight value to record, in kilograms.
     *
     * @type {number}
     * @example 56.0
     */
    weight;
}

/**
 * Response DTO for the weight update process.
 * Defines the structure of the data returned by the API after processing a request
 * to update a weight record.
 *
 * @memberOf Vi_Bwl_Shared_Web_Api_Weight_Update
 */
class Response {
    /**
     * A human-readable message describing the result of the operation.
     *
     * @type {string}
     * @example "The weight record was successfully updated."
     */
    instructions;

    /**
     * A code representing the result of the weight update process.
     *
     * @type {string}
     * @see Vi_Bwl_Shared_Web_Api_Weight_Update.RESULT_CODE
     * @example "SUCCESS"
     */
    resultCode;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Vi_Bwl_Shared_Web_Api_Weight_Update {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a request DTO for updating weight records.
         * @param {Vi_Bwl_Shared_Web_Api_Weight_Update.Request} [data]
         * @returns {Vi_Bwl_Shared_Web_Api_Weight_Update.Request}
         */
        this.createReq = function (data) {
            const req = new Request();
            req.userCode = cast.string(data?.userCode);
            req.date = cast.date(data?.date);
            req.weight = cast.decimal(data?.weight);
            return req;
        };

        /**
         * Creates a response DTO for the weight update process.
         * @param {Vi_Bwl_Shared_Web_Api_Weight_Update.Response} [data]
         * @returns {Vi_Bwl_Shared_Web_Api_Weight_Update.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            res.instructions = cast.string(data?.instructions);
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            return res;
        };

        /**
         * Returns the available result codes for the weight update process.
         * @returns {typeof Vi_Bwl_Shared_Web_Api_Weight_Update.RESULT_CODE} A frozen object containing result codes.
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
