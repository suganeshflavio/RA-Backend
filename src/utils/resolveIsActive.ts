export const resolveIsActive = (
    value: unknown
): boolean | undefined => {

    // No filter passed -> return everything (active + inactive).
    if (value === undefined || value === "all") {

        return undefined;

    }

    return value === "true";

};
