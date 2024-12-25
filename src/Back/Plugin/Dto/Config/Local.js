/**
 * Local configuration DTO for the plugin (the `@flancer64/gpt-vi-bwl` node in the `./etc/local.json` file).
 * @see TeqFw_Core_Back_Config
 *
 * @memberOf Vi_Bwl_Back_Plugin_Dto_Config_Local
 */
class Dto {
    /**
     * List of authorization bearer tokens.
     * @type {string[]}
     */
    authBearerTokens;

    /**
     * Mapping of user codes to user IDs.
     * @type {Object<string, number>}
     */
    users;
}

/**
 * Factory class to create instances of the local plugin configuration DTO.
 *
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Vi_Bwl_Back_Plugin_Dto_Config_Local {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        /**
         * Creates and initializes a DTO with the provided data.
         * @param {Vi_Bwl_Back_Plugin_Dto_Config_Local.Dto} data
         * @returns {Vi_Bwl_Back_Plugin_Dto_Config_Local.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // Cast known attributes to ensure proper types
            res.authBearerTokens = cast.arrayOfStr(data?.authBearerTokens);
            res.users = cast.object(data?.users);
            return res;
        };
    }
}
