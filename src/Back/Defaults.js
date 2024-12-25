/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Vi_Bwl_Back_Defaults {
    NAME;
    /** @type {Vi_Bwl_Shared_Defaults} */
    SHARED;

    /**
     * @param {Vi_Bwl_Shared_Defaults} SHARED
     */
    constructor(
        {
            Vi_Bwl_Shared_Defaults$: SHARED,
        }
    ) {
        this.SHARED = SHARED;
        this.NAME = SHARED.NAME;
        Object.freeze(this);
    }
}
