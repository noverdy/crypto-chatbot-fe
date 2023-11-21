export function powmod(base: bigint, exp: bigint, mod: bigint) {
	let result = 1n;
	while (exp !== 0n) {
		if (exp % 2n === 1n) result = (result * base) % mod;
		base = (base * base) % mod;
		exp >>= 1n;
	}
	return result;
}
