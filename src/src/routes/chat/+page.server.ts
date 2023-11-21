import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { powmod } from '$lib/utils';
import crypto from 'crypto';

export const load: PageServerLoad = async () => {
	const parameters = await fetch(`${API_URL}/parameters`);
	const { generator: genHex, modulus: modHex } = await parameters.json();

	const generator = BigInt(genHex);
	const modulus = BigInt(modHex);

	const clientPrivateKey = crypto.generatePrimeSync(2048, { bigint: true });
	const clientPublicKey = powmod(generator, clientPrivateKey, modulus);

	const serverKey = await fetch(`${API_URL}/key-exchange`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			public_key: clientPublicKey.toString(16),
			private_key: clientPrivateKey.toString(16)
		})
	});
	const { public_key: pubKeyHex } = await serverKey.json();
	const serverPublicKey = BigInt(pubKeyHex);

	const sharedKey = powmod(serverPublicKey, clientPrivateKey, modulus);

	const sharedKeyBytes = Buffer.from(sharedKey.toString(16), 'hex');
	const derivedKey = crypto.pbkdf2Sync(sharedKeyBytes, '', 100000, 16, 'sha512');

	return {
		derivedKey: derivedKey.toString('hex'),
		publicKey: clientPublicKey.toString(16)
	};
};
