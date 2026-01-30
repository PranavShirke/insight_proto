
import selfsigned from 'selfsigned';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const attrs = [{ name: 'commonName', value: 'localhost' }];
const options = { days: 365 };

console.log('Imported selfsigned:', selfsigned);
let generate = selfsigned.generate;
if (!generate && typeof selfsigned === 'function') generate = selfsigned;
if (!generate && selfsigned.default && typeof selfsigned.default.generate === 'function') generate = selfsigned.default.generate;

try {
    if (!generate) throw new Error('Could not find generate function');
    const pems = await generate(attrs, options);
    console.log('Certs generated. Keys:', Object.keys(pems));

    const certDir = path.join(__dirname, 'backend', 'certs');
    if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
    }

    if (pems.private) fs.writeFileSync(path.join(certDir, 'key.pem'), pems.private);
    if (pems.cert) fs.writeFileSync(path.join(certDir, 'cert.pem'), pems.cert);

    console.log('Certificates successfully written to:', certDir);
} catch (error) {
    console.error('Error generating certificates:', error);
}
