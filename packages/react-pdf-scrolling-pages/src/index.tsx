import { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFPageProxy } from 'pdfjs-dist/types/web/interfaces';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { type DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';

function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

const pdfStyleDefault = {
  display: 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  'margin-bottom': '1em',
  'border-radius': '10px',
  border: '2px solid',
  'align-content': 'center',
  'align-items': 'center',
  'box-shadow':
    'rgba(22, 31, 39, 0.42) 0px 60px 123px -25px, rgba(19, 26, 32, 0.08) 0px 35px 75px -35px',
  'border-color': 'rgb(213, 220, 226) rgb(213, 220, 226) rgb(184, 194, 204)',
};

type HookProps = {
  pdfLocation: string;
  file: string;
  onDocumentLoadSuccess?: (document: PDFDocumentProxy) => void;
  onDocumentLoadFail?: () => void;
  onInvalidLocation?: () => void;
  scale?: number;
  rotate?: number;
  cMapUrl?: string;
  cMapPacked?: boolean;
  workerSrc?: string;
  withCredentials?: boolean;
  useDefaultStyle?: boolean;
  className?: string;
};

type HookReturnValues = {
  pdfDocument: PDFDocumentProxy | undefined;
  allPdfPages: PDFPageProxy[] | undefined;
};

export const usePdf = ({
  pdfLocation,
  file,
  onDocumentLoadSuccess,
  onDocumentLoadFail,
  onInvalidLocation,
  scale = 0.9,
  rotate = 0,
  cMapUrl,
  cMapPacked,
  workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`,
  withCredentials = false,
  className = '',
  useDefaultStyle = true,
}: HookProps): HookReturnValues => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
  const [allPdfPages, setAllPdfPages] = useState<PDFPageProxy[] | undefined>();
  const [pdfLocationDisplay, setPdfLocationDisplay] = useState<HTMLElement>();
  const onDocumentLoadSuccessRef = useRef(onDocumentLoadSuccess);
  const onDocumentLoadFailRef = useRef(onDocumentLoadFail);
  const onInvalidLocationRef = useRef(onInvalidLocation);

  // assign callbacks to refs to avoid redrawing
  useEffect(() => {
    onDocumentLoadSuccessRef.current = onDocumentLoadSuccess;
  }, [onDocumentLoadSuccess]);

  useEffect(() => {
    onDocumentLoadFailRef.current = onDocumentLoadFail;
  }, [onDocumentLoadFail]);

  useEffect(() => {
    onInvalidLocationRef.current = onInvalidLocation;
  }, [onInvalidLocation]);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }, [workerSrc]);

  useEffect(() => {
    const config: DocumentInitParameters = { url: file, withCredentials };
    if (cMapUrl) {
      config.cMapUrl = cMapUrl;
      config.cMapPacked = cMapPacked;
    }

    pdfjs.getDocument(config).promise.then(
      (loadedPdfDocument) => {
        setPdfDocument(loadedPdfDocument);

        if (isFunction(onDocumentLoadSuccessRef.current)) {
          onDocumentLoadSuccessRef.current(loadedPdfDocument);
        }
      },
      () => {
        if (isFunction(onDocumentLoadFailRef.current)) {
          onDocumentLoadFailRef.current();
        }
      }
    );
  }, [file, withCredentials, cMapUrl, cMapPacked]);

  useEffect(() => {
    const getPages = async (pdf: PDFDocumentProxy) => {
      if (!pdf) {
        return [];
      }
      let pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        pages.push(page);
      }
      return pages;
    };

    const processPages = (pages: PDFPageProxy[]) => {
      /* pdfDisplayLocation is a div where the pdf will be displayed */
      if (!pdfLocationDisplay) {
        return;
      }
      for (const page of pages) {
        const rotation = rotate === 0 ? page.rotate : page.rotate + rotate;
        const viewport = page.getViewport({ scale, rotation });

        /* create a new canvas for this page in pdfdoc div */
        let canvas = pdfLocationDisplay?.appendChild(
          document.createElement('canvas')
        );
        if (!canvas) {
          continue;
        }

        if (useDefaultStyle) {
          for (const [key, value] of Object.entries(pdfStyleDefault)) {
            canvas.style.setProperty(key, value);
          }
        }
        if (className) {
          canvas.className = className;
        }

        const canvasContext = canvas?.getContext('2d');
        if (!canvasContext) {
          return;
        }
        canvas.height = viewport.height * window.devicePixelRatio;
        canvas.width = viewport.width * window.devicePixelRatio;
        canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);

        //Draw it on the canvas
        page.render({ canvasContext: canvasContext, viewport: viewport });
      }
    };

    // draw a page of the pdf
    const drawPDFPages = async () => {
      if (!pdfDocument) {
        return;
      }

      if (!pdfLocationDisplay) {
        return;
      }
      // clear out area where the pdf pages will print
      pdfLocationDisplay.innerHTML = '';

      const allPages = await getPages(pdfDocument);
      setAllPdfPages(allPages);
      processPages(allPages);
    };
    if (pdfDocument) {
      const element = document.getElementById(pdfLocation);
      if (element) {
        setPdfLocationDisplay(element);
      } else {
        if (pdfDocument) {
          if (isFunction(onInvalidLocationRef.current)) {
            onInvalidLocationRef.current();
            return;
          }
        }
      }
      drawPDFPages();
    }
  }, [
    pdfLocation,
    pdfDocument,
    rotate,
    scale,
    useDefaultStyle,
    className,
    pdfLocationDisplay,
  ]);

  return { allPdfPages, pdfDocument };
};
