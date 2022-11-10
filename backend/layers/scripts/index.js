import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SignPdf, plainAddPlaceholder  } from 'node-signpdf';

console.log('Example signing');

//{"pfx": "/tmp/ORDER_ID.pfx", "pdf": "/tmp/ORDER_ID.pdf"}
const { pfx, pdf } = JSON.parse(process.argv[2])
const signed = pdf.replace('.pdf', '.signed.pdf')
 
console.log('PAYLOAD: ', pfx, pdf, signed)

const signer = new SignPdf()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sigBuffer = fs.readFileSync(pfx);
let pdfBuffer = fs.readFileSync(pdf);

pdfBuffer = plainAddPlaceholder({
    pdfBuffer,
    reason: 'I have reviewed it.',
    contactInfo: 'emailfromp1289@gmail.com',
    name: 'Name from p12',
    location: 'Location from p12',

});
pdfBuffer = signer.sign(pdfBuffer, sigBuffer);

await fs.writeFile(signed, pdfBuffer, (err) => { if (err) throw err; });
