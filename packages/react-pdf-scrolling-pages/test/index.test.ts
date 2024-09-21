import React, { ReactNode } from 'react';
import { render, waitFor } from '@testing-library/react';
import Pdf from '../src';
import { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';

jest.mock('pdfjs-dist', () => ({
  version: '1.0',
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  getDocument: jest.fn((config: DocumentInitParameters) => ({
    promise:
      typeof config.url === 'string' && config.url?.includes('fail_document')
        ? Promise.reject()
        : Promise.resolve({
            drawPDFPages: jest.fn(() =>
              typeof config.url === 'string' &&
              config.url?.includes('fail_page')
                ? Promise.reject()
                : Promise.resolve({
                    getViewport: jest.fn(() => ({ width: 0, height: 0 })),
                    render: jest.fn(() => ({
                      promise:
                        typeof config.url === 'string' &&
                        config.url?.includes('fail_render')
                          ? Promise.reject()
                          : Promise.resolve(),
                    })),
                  })
            ),
          }),
  })),
}));

describe('Pdf', () => {
  it('renders children', async () => {
    const { getByText } = render(
      <Pdf file="basic.pdf">
        {({ canvas }: { canvas: ReactNode }) => (
          <div>
            {canvas}
            <div>Test</div>
          </div>
        )}
      </Pdf>
    );

    await waitFor(() => {
      getByText('Test');
    });
  });

  it('calls render function with proper params', async () => {
    const renderFunc = jest.fn(({ canvas }) => canvas);

    render(<Pdf file="basic.pdf">{renderFunc}</Pdf>);

    expect(renderFunc).toBeCalledWith({
      canvas: expect.any(Object),
      pdfDocument: undefined,
      pdfPage: undefined,
    });

    await waitFor(() => {
      expect(renderFunc).toBeCalledWith({
        canvas: expect.any(Object),
        pdfDocument: expect.any(Object),
        pdfPage: expect.any(Object),
      });
    });
  });

  describe('callbacks', () => {
    const onDocLoadSuccess = jest.fn();
    const onDocLoadFail = jest.fn();
    const onInvalidLocation = jest.fn();

    beforeEach(() => {
      onDocLoadSuccess.mockClear();
      onDocLoadFail.mockClear();
      onInvalidLocation.mockClear();
    });

    const renderPdf = (file: string) =>
      render(
        <Pdf
          file={file}
          onDocumentLoadSuccess={onDocLoadSuccess}
          onDocumentLoadFail={onDocLoadFail}
          onInvalidLocation={onInvalidLocation}
        >
          {({ canvas }: { canvas: ReactNode }) => canvas}
        </Pdf>
      );

    it('calls proper callbacks when fully successful', async () => {
      renderPdf('basic.33e35a62.pdf');

      await waitFor(() => {
        expect(onDocLoadSuccess).toBeCalledWith(expect.any(Object));
        expect(onDocLoadFail).not.toBeCalled();
        expect(onInvalidLocation).not.toBeCalled();
      });
    });

    it('calls proper callbacks when render failed', async () => {
      renderPdf('fail_render');

      await waitFor(() => {
        expect(onDocLoadSuccess).toBeCalledWith(expect.any(Object));
        expect(onDocLoadFail).not.toBeCalled();
        expect(onInvalidLocation).not.toBeCalled();
      });
    });

    it('calls proper callbacks when page load failed', async () => {
      renderPdf('fail_page');

      await waitFor(() => {
        expect(onDocLoadSuccess).toBeCalledWith(expect.any(Object));
        expect(onDocLoadFail).not.toBeCalled();
        expect(onInvalidLocation).not.toBeCalled();
      });
    });

    it('calls proper callbacks when document load failed', async () => {
      renderPdf('fail_document');

      // await wait();
      await waitFor(() => {
        expect(onDocLoadSuccess).not.toBeCalled();
        expect(onDocLoadFail).toBeCalled();
        expect(onInvalidLocation).not.toBeCalled();
      });
    });
  });
});
