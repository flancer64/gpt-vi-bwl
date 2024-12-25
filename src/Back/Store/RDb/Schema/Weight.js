/**
 * Persistent DTO with metadata for the RDB entity: Weight.
 * @namespace Vi_Bwl_Back_Store_RDb_Schema_Weight
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/weight/stat';

/**
 * Attribute mappings for the entity.
 * @memberOf Vi_Bwl_Back_Store_RDb_Schema_Weight
 * @type {Object}
 */
const ATTR = {
    USER_REF: 'user_ref',
    DATE: 'date',
    TYPE: 'type',
    VALUE: 'value',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the Weight entity.
 * @memberOf Vi_Bwl_Back_Store_RDb_Schema_Weight
 */
class Dto {
    /**
     * Reference to the user.
     *
     * @type {number}
     */
    user_ref;

    /**
     * Date of the weight record.
     *
     * @type {Date}
     */
    date;

    /**
     * Type of the weight (e.g., current or target).
     *
     * @type {string}
     */
    type;

    /**
     * Weight value in kilograms.
     *
     * @type {number}
     */
    value;
}

/**
 * Implements metadata and utility methods for the Weight entity.
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Vi_Bwl_Back_Store_RDb_Schema_Weight {
    /**
     * Constructor for the Weight persistent DTO class.
     *
     * @param {Vi_Bwl_Back_Defaults} DEF - Default settings for the plugin.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor(
        {
            Vi_Bwl_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {Vi_Bwl_Back_Store_RDb_Schema_Weight.Dto} [data] - Input data for the DTO.
         * @returns {Vi_Bwl_Back_Store_RDb_Schema_Weight.Dto} - Casted DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.date = cast.date(data?.date);
            res.type = cast.string(data?.type);
            res.user_ref = cast.int(data?.user_ref);
            res.value = cast.decimal(data?.value);
            return res;
        };

        /**
         * Returns the attribute map for the entity.
         *
         * @returns {Object}
         */
        this.getAttributes = () => ATTR;

        /**
         * Returns the entity's path in the DEM.
         *
         * @returns {string}
         */
        this.getEntityName = () => `${DEF.NAME}${ENTITY}`;

        /**
         * Returns the primary key attributes for the entity.
         *
         * @returns {Array<string>}
         */
        this.getPrimaryKey = () => [ATTR.USER_REF, ATTR.DATE, ATTR.TYPE];
    }
}
