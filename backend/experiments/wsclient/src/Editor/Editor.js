import { useState, useRef } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';


const Editor = () => {
    const [page, setPage] = useState(1);
    const canvasRef = useRef(null);

    const { pdfDocument } = usePdf({
      file: 'http://localhost:3000/sample.pdf',
      page,
      canvasRef,
    });

    
    return (
      <div className="grid">
        <div className="col-12">
          {!pdfDocument && <ProgressSpinner />}
          <canvas ref={canvasRef} />
        </div>

        {Boolean(pdfDocument && pdfDocument.numPages) && (
          <div className="col-12">
            <span className="p-buttonset">
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}  label="Previous" icon="pi pi-check" />
              <Button disabled={page === pdfDocument.numPages} onClick={() => setPage(page + 1)}  label="Next" icon="pi pi-trash" />
            </span>
          </div>
        )}
      </div>

    );
};

export default Editor;