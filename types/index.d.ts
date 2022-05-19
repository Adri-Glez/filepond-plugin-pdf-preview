// @ts-ignore
import { FilePondOptions } from "filepond";

declare module "filepond" {
  export interface FilePondOptions {
    /** Enable or disable preview mode */
    allowPdfPreview?: boolean;

    // Fixed PDF preview height
    pdfPreviewHeight?: number,

    // Extra params to pass to the pdf visulizer
    pdfComponentExtraParams?: string,
  }
}
