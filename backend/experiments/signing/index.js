import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SignPdf, plainAddPlaceholder  } from 'node-signpdf';

console.log('Example signing');

const signer = new SignPdf()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sigBuffer = fs.readFileSync(
    // `${__dirname}//certificate.p12`,
    `${__dirname}//certificate.pfx`,
);

let pdfBuffer = fs.readFileSync(
    `${__dirname}//contributing.pdf`,
);

pdfBuffer = plainAddPlaceholder({
    pdfBuffer,
    reason: 'I have reviewed it.',
    contactInfo: 'emailfromp1289@gmail.com',
    name: 'Name from p12',
    location: 'Location from p12',

});
pdfBuffer = signer.sign(pdfBuffer, sigBuffer);


await fs.writeFile('out.pdf', pdfBuffer, (err) => { if (err) throw err; });

