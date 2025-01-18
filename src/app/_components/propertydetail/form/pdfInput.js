import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Image from "next/image";
import SvgIcon from "../../utils/SvgIcon";

// @ts-expect-error This does not exist outside of polyfill which this is doing
if (typeof Promise.withResolvers === "undefined") {
  if (window)
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
}

// Legacy build
// if (process.env.NEXT_PUBLIC_TURBO !== true) {
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
// }

export default function CoolPDFInput({
  documentImage,
  pdfThumbnail,
  pdfName,
  pdfSize,
  removeDocumentImage,
  field,
  getDocumentImageRootProps,
  getDocumentImageInputProps,
  title,
  slug,
}) {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col justify-center">
        <h1 className="font-semibold mb-1">
          {title}
          <span className="text-[#F60000]"> *</span>
        </h1>
        <p className="text-[#6D6D6D] text-xs font-normal">
          Supported format: PDF, maximum file up to 10mb
        </p>
      </div>
      {documentImage ? (
        pdfThumbnail ? (
          <div className="pdf-thumbnail relative w-full max-w-[300px] h-full max-h-[80px] text-black mt-4">
            <SvgIcon
              src="/assets/icons/trash-bin-icon.svg"
              className="w-6 h-6 bg-[#F60000] mb-4 absolute translate-y-6 right-4"
              onClick={() => removeDocumentImage({ field, slug })}
            />
            <div className="w-full h-[80px] max-w-[244px] rounded-lg border bg-white border-[#DFE3EC] px-2 flex items-center">
              {/* <img src={pdfThumbnail} alt="PDF Thumbnail" className="w-16 h-16 rounded-lg border border-[#DFE3EC]" /> */}
              <div className="w-full h-full text-black overflow-hidden flex flex-col justify-center items-start ml-4 pr-2">
                <p className="font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {pdfName}
                </p>
                <p className="text-xs text-left w-full">{pdfSize}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-[192px] w-[192px]">
            <button
              onClick={() => removeDocumentImage({ field, slug })}
              className="absolute top-2 right-2 bg-gray-300 text-black rounded-full w-6 h-6 flex items-center justify-center text-2xl"
            >
              &times;
            </button>
            <img
              src={documentImage}
              alt="Document Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )
      ) : (
        <div className="w-full max-w-[628px] h-[225px] flex flex-col justify-center items-start">
          <div className="w-full h-full -mt-6 max-h-[166px] border border-dashed border-[#D1D1D1] rounded-lg bg-[#F7F8F9]">
            <div
              {...getDocumentImageRootProps()}
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
            >
              <input {...getDocumentImageInputProps()} />
              <SvgIcon
                src="/assets/icons/upload-file-icon.svg"
                className="w-12 h-12 bg-mossgreen mb-4"
              />
              <p className="text-center text-black font-semibold">
                Drag or Upload File
              </p>
              <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-lightgreen rounded-2xl px-2 py-1">
                  <div className="relative w-4 h-4">
                    <Image
                      src={"/assets/logo/propex-coin.png"}
                      alt="propex-coin"
                      fill
                      sizes="350px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-green-600 font-semibold text-xs">
                    +10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
