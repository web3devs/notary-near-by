import { useRef, useState } from 'react'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'

import { Button } from 'primereact/Button'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function download(reportName, byte) {
  var blob = new Blob([byte], { type: 'application/pdf' })
  var link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  var fileName = reportName
  link.download = fileName
  link.click()
}

const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
async function modifyPdf(img) {
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const res = await fetch(url)
  const blob = await res.arrayBuffer()

  console.log(blob)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()

  const jpg = await pdfDoc.embedJpg(blob)
  console.log(jpg)
  // firstPage.drawText('This text was added with JavaScript!', {
  //   x: 5,
  //   y: height / 2 + 300,
  //   size: 50,
  //   font: helveticaFont,
  //   color: rgb(0.95, 0.1, 0.1),
  //   rotate: degrees(-45)
  // })

  firstPage.drawImage(jpg)

  const pdfBytes = await pdfDoc.save()

  console.log(pdfBytes)
  download('pdf-lib_creation_example.pdf', pdfBytes)
}

export default () => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [image, setImage] = useState(null)
  const signRef = useRef()
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  const handleAddImage = () => {
    modifyPdf(image)
  }
  return (
    <div>
      <h1>Notary session</h1>
      <input
        type="file"
        ref={signRef}
        onChange={(e) => {
          console.log(e.target)
          const reader = new FileReader()
          reader.readAsDataURL(e.target.files[0])
          reader.onload = function () {
            console.log(reader.result)
            setImage(reader.result)
          }
          reader.onerror = function (error) {
            console.log('Error: ', error)
          }
        }}
      />

      <Button label="Add image to pdf" onClick={handleAddImage} />

      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  )
}
