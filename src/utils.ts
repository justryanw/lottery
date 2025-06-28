/* eslint-disable @typescript-eslint/no-explicit-any */

export const isNumber = (val: any) => typeof val === "number";

export function arrayFrom<U>(
	length: number,
	mapfn: (index: number) => U = (): any => undefined,
	thisArg?: any,
): U[] {
	return Array.from({ length }, (_, index) => mapfn(index), thisArg);
}
