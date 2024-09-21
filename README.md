# react-pdf-all-pages

Display all pages of a PDFs in your React app as easily as if they were images. Comes with built in 3d styling.
Scroll up and down through ALL the pages using your mouse or keyboard.

Uses [PDF.js](http://mozilla.github.io/pdf.js/).

---

[![NPM Version](https://img.shields.io/npm/v/@pvanweel/react-pdf-all-pages.svg?style=flat-square)](https://www.npmjs.com/package/@pvanweel/react-pdf-all-pages)
[![NPM Downloads](https://img.shields.io/npm/dm/@pvanweel/react-pdf-all-pages.svg?style=flat-square)](https://www.npmjs.com/package/@pvanweel/react-pdf-all-pages)
[![codecov](https://codecov.io/gh/pvanweel/react-pdf-all-pages/branch/master/graph/badge.svg)](https://codecov.io/gh/pvanweel/react-pdf-all-pages)

# Demo

Demo can be found [here](https://react-app-all-pages-sample.onrender.com/).

# Usage

Install with `yarn add @pvanweel/react-pdf-all-pages` or
`npm install @pvanweel/react-pdf-all-pages `

## `usePdf` hook

Use the hook in your app (comes with built-in 3d page look out of the box):

```js
import "./App.css";
import { usePdf } from "@pvanweel/react-pdf-all-pages";

function App() {
  const { pdfDocument } = usePdf({
    file: "sample.pdf",
    pdfLocation: "pdfdoc",
  });

  return (
    <>
      <div>{pdfDocument ? <div id="pdfdoc"></div> : <></>}</div>
    </>
  );
}

export default App;
```

## Props

When you call usePdf you'll want to pass in a subset of these props, like this:

> `const { pdfDocument } = usePdf({ pdfLocation: 'pdfdoc', file: 'https://example.com/test.pdf' });`

### pdfLocation

an id of an html element where you want your pages to display.

### file

URL of the PDF file.

### onDocumentLoadSuccess

Allows you to specify a callback that is called when the PDF document data will be fully loaded.
Callback is called with [PDFDocumentProxy](https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L579)
as an only argument.

### onDocumentLoadFail

Allows you to specify a callback that is called after an error occurred during PDF document data loading.

### onInvalidLocation

Allows you to specify a callback that is called if the pdfLocation html element is not found.

### scale

Allows you to scale the PDF. Default = 1.

### rotate

Allows you to rotate the PDF. Number is in degrees. Default = 0.

### cMapUrl

Allows you to specify a cmap url. Default = '../node_modules/pdfjs-dist/cmaps/'.

### cMapPacked

Allows you to specify whether the cmaps are packed or not. Default = false.

### workerSrc

Allows you to specify a custom pdf worker url. Default = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjs.version}/pdf.worker.js'.

### withCredentials

Allows you to add the withCredentials flag. Default = false.

### className

Allows you to style your pdf pages by passing in a className.

### useDefaultStyle (defaults to true)

Specifies whether to use the built-in styling or not to use the built-in styling.

## Returned values

### pdfDocument

`pdfjs`'s `PDFDocumentProxy` [object](https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L579).
This can be undefined if document has not been loaded yet.

This is the equivelant css of the default built in styling:

```css
.pdfClass {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
  border-radius: 10px;
  border: 2px solid;
  align-content: center;
  align-items: center;
  box-shadow: rgba(22, 31, 39, 0.42) 0px 60px 123px -25px, rgba(
        19,
        26,
        32,
        0.08
      ) 0px 35px 75px -35px;
  border-color: rgb(213, 220, 226) rgb(213, 220, 226) rgb(184, 194, 204);


# License

MIT © [pvanweel2997](https://github.com/pvanweel2997)
```
