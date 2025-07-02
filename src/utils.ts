/* eslint-disable @typescript-eslint/no-explicit-any */

export const isNumber = (val: any) => typeof val === "number";

export function arrayFrom<U>(
	length: number,
	mapfn: (index: number) => U = (): any => undefined,
	thisArg?: any,
): U[] {
	return Array.from({ length }, (_, index) => mapfn(index), thisArg);
}

export type Result<T = void, E = Error> =
	| { success: true; data?: T }
	| { success: false; error: E };

export function Ok<T = void>(data?: T): Result<T, any> {
	return { success: true, data };
}

export function Err<E>(error: E): Result<any, E> {
	return { success: false, error };
}
