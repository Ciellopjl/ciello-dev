import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Resolve a chave dinamicamente para poder testar e simular.
// Usamos ENCRYPTION_KEY (de 64 caracteres em HEX puro que totalizam 32 bytes).
function getKey(): Buffer {
  if (!process.env.ENCRYPTION_KEY) {
     throw new Error("❌ SEGURANÇA BURLADA: Nenhuma 'ENCRYPTION_KEY' encontrada no .env para desencriptação.");
  }
  return Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
}

export function encrypt(text: string): string {
  if (!text) throw new Error("Null text provided for encryption.");
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return [iv, tag, encrypted].map(b => b.toString('hex')).join(':');
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) throw new Error("Tentativa de descriptografar URL nula ou inexistente (DATABASE_URL_ENCRYPTED vazia).");
  
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error("Formato inválido de Criptografia. Era esperado 'iv:tag:data'.");
  }

  const [ivHex, tagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(tag);
  
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
