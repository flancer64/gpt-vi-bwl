// IMPORT
import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_AUTHORIZATION,
} = H2;
const WEIGHT_TYPE = 'c';

// FUNCS
/**
 * @param {Date|string} dateIn
 * @return {string}
 */
function formatUtcDate(dateIn = null) {
    /** @type {Date} */
    const date = (dateIn) ?
        (dateIn instanceof Date) ? dateIn : new Date(dateIn) :
        new Date();
    const y = date.getUTCFullYear();
    const m = `${date.getUTCMonth() + 1}`.padStart(2, '0');
    const d = `${date.getUTCDate()}`.padStart(2, '0');
    return `${y}/${m}/${d}`;
}

// MAIN
/**
 * Service for handling weight update requests.
 *
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Vi_Bwl_Back_Web_Api_Weight_Update {
    /**
     * @param {Vi_Bwl_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Vi_Bwl_Shared_Web_Api_Weight_Update} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Vi_Bwl_Back_Store_RDb_Schema_Weight} rdbWeight
     */
    constructor(
        {
            Vi_Bwl_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Vi_Bwl_Shared_Web_Api_Weight_Update$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Vi_Bwl_Back_Store_RDb_Schema_Weight$: rdbWeight,
        }
    ) {
        // VARS
        const ATTR = rdbWeight.getAttributes();
        const RESULT_CODE = endpoint.getResultCodes();
        /**
         * @type {string[]}
         * List of authorized Bearer tokens from local config.
         */
        let BEARERS;
        /**
         * Users map
         * @type {Object<string, number>}
         */
        let USERS;

        // FUNCS
        /**
         * Retrieves the authorized Bearer tokens from the local configuration.
         * Initializes the BEARERS array if it hasn't been loaded yet.
         * @returns {string[]} Authorized Bearer tokens.
         */
        function getAllowedBearers() {
            if (!Array.isArray(BEARERS)) {
                /** @type {Vi_Bwl_Back_Plugin_Dto_Config_Local.Dto} */
                const cfg = config.getLocal(DEF.NAME);
                BEARERS = cfg?.authBearerTokens ?? [];
            }
            return BEARERS;
        }

        /**
         * @param {string} userCode
         * @return {number}
         */
        function getUserId(userCode) {
            if (!USERS) {
                /** @type {Vi_Bwl_Back_Plugin_Dto_Config_Local.Dto} */
                const cfg = config.getLocal(DEF.NAME);
                USERS = cfg?.users ?? {};
            }
            return USERS[userCode.trim().toLowerCase()];
        }

        // Instance Methods

        /**
         * Retrieve the endpoint definition.
         * @return {Vi_Bwl_Shared_Web_Api_Weight_Update}
         */
        this.getEndpoint = () => endpoint;

        /**
         * Initialize the service. Reserved for future use.
         * @return {Promise<void>}
         */
        this.init = async function () {};

        /**
         * Process the weight update request.
         *
         * @param {Vi_Bwl_Shared_Web_Api_Weight_Update.Request} req - The incoming request.
         * @param {Vi_Bwl_Shared_Web_Api_Weight_Update.Response} res - The outgoing response.
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} [context] - Optional context for the request.
         * @return {Promise<void>}
         */
        this.process = async function (req, res, context) {
            debugger

            const authHeader = context.request?.headers[HTTP2_HEADER_AUTHORIZATION];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const bearerToken = authHeader.slice(7); // Remove 'Bearer ' prefix
                    const allowed = getAllowedBearers();
                    if (allowed.includes(bearerToken)) {
                        const {userCode, weight} = req;
                        const date = formatUtcDate(req.date);
                        const userId = getUserId(userCode);
                        if (userId > 0) {
                            const trx = await conn.startTransaction();
                            try {
                                logger.info(`Starting weight update for user ${userCode}/${userId} on date ${date}.`);
                                const key = {
                                    [ATTR.TYPE]: WEIGHT_TYPE,
                                    [ATTR.DATE]: date,
                                    [ATTR.USER_REF]: userId,
                                };
                                const found = await crud.readOne(trx, rdbWeight, key);
                                if (found) await crud.deleteOne(trx, rdbWeight, key);
                                const dto = rdbWeight.createDto();
                                dto.date = date;
                                dto.type = WEIGHT_TYPE;
                                dto.user_ref = userId;
                                dto.value = weight;
                                await crud.create(trx, rdbWeight, dto);
                                await trx.commit();

                                res.instructions = `The weight record for ${date} has been updated successfully. Graphs can be viewed under the user named Be.`;
                                res.resultCode = RESULT_CODE.SUCCESS;
                            } catch (error) {
                                logger.exception(error);
                                await trx.rollback();
                                res.instructions = 'An unexpected error occurred. Please try again later.';
                                res.resultCode = RESULT_CODE.SERVER_ERROR;
                            }
                        }
                    }
                }
            }
        };
    }
}
