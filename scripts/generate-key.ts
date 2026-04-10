import crypto from 'crypto';

console.log("= GERADOR DE CHAVE DE CRIPTOGRAFIA =");
console.log("Sua chave foi gerada. Copie a linha abaixo e cole no seu arquivo '.env.local':");
console.log("----------------------------------------------------------------------------------");

// O sistema de AES-256 processa keys the 32 bytes (256-bit). Hex string de 32 bytes tem tamanho 64.
const key = crypto.randomBytes(32).toString('hex');
console.log(`ENCRYPTION_KEY='${key}'`);

console.log("----------------------------------------------------------------------------------");
console.log("⚠ MUITA ATENÇÃO: Nunca comite esta chave. Perder esta chave fará o aplicativo crachar, e se vazar, abrirá seu banco.");
