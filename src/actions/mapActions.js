export const CHANGE_CLOCK = "CHANGE_CLOCK";

export default function setClock(year) {
    return { type: CHANGE_CLOCK, year };
}
