import { useRef, useState } from "react";
import { usePdf } from "@pvanwweel/react-pdf-scrolling-pages";
import "./index.css";
import clsx from "clsx";

function App() {
  const [page, setPage] = useState(1);

  const { pdfDocument } = usePdf({
    file: "udm_se_ds.pdf",
    pdfLocation: "pdfdoc",
  });

  const previousDisabled = page === 1;
  const nextDisabled = Boolean(page === pdfDocument?.numPages);

  return (
    <div className="w-full flex flex-col">
      <div className="bg-gradient-to-r from-sky-800 to-indigo-800">
        <div className="container text-center py-12 mx-auto">
          <div className="text-4xl font-bold text-white">
            react-pdf-scrolling-pages
          </div>
          <div className="text-xl text-gray-200 mt-4">
            The easiest way to render PDFs in React.{" "}
            <a
              href="https://bundlephobia.com/package/react-pdf-scrolling-pages"
              className="text-blue-400"
            >
              Under 1kB in size.
            </a>{" "}
            Modern React hook architecture.
          </div>
        </div>
      </div>
      <div>
        {!pdfDocument && <span>Loading...</span>}
        <div id="pdfdoc" />
      </div>
      <div className="bg-gray-200">
        <div className="container text-center py-12 mx-auto">
          <div className="flex flex-row gap-4 px-4 justify-center">
            <a
              href="https://www.npmjs.com/package/@pvanweel2997/react-pdf-scrolling-pages"
              className="text-blue-400 underline"
            >
              NPM
            </a>
            <a
              href="https://github.com/pvanweel/react-pdf-scrolling-pages"
              className="text-blue-400 underline"
            >
              Github
            </a>
            <a
              href="https://bundlephobia.com/package/react-pdf-scrolling-pages"
              className="text-blue-400 underline"
            >
              Bundlephobia
            </a>
            <a
              href="https://opencollective.com/react-pdf-scrolling-pages"
              className="text-blue-400 underline"
            >
              Open Collective
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
