export type StringOrNull = string | null;

export const exist = (value: string | StringOrNull[], cb: (arg: string) => void) => {
	if (value && typeof value === 'string') {
		cb(value)
	}
}
