/* eslint-disable @typescript-eslint/no-explicit-any */

import { Result } from "typescript-result";

export const isNumber = (val: any) => typeof val === "number";

export function arrayFrom<U>(
	length: number,
	mapfn: (index: number) => U = (): any => undefined,
	thisArg?: any,
): U[] {
	return Array.from({ length }, (_, index) => mapfn(index), thisArg);
}

export function err(message: string) { return Result.error(new Error(message)) }

export function selectUniqueRandomFromArray<T>(array: T[], count: number): T[] {
	const clone = [...array];
	return arrayFrom(count, () => clone.splice(Math.random() * clone.length, 1)[0]);
}
