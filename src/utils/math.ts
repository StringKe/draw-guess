import {nanoid} from "nanoid";

export function Round(value, n = 4) {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

export function makeId() {
    return nanoid(32);
}