import { Types } from "mongoose";

export function toString(value: string | Types.ObjectId | any): string {
    if (value) return value.toString();
}