import { createPdfWrapperView } from "./view/createPdfWrapperView";
import { isPreviewablePdf } from "./utils/isPreviewablePdf";

/**
 * Pdf Preview Plugin
 */
const plugin = (fpAPI) => {
  const { addFilter, utils } = fpAPI;
  const { Type, createRoute } = utils;
  const pdfWrapperView = createPdfWrapperView(fpAPI);
     
  // called for each view that is created right after the 'create' method
  addFilter("CREATE_VIEW", (viewAPI) => {
    // get reference to created view
    const { is, view, query } = viewAPI;

    // only hook up to item view
    if (!is("file")) {
      return;
    }

    // create the pdf preview plugin, but only do so if is a PDF
    const didLoadItem = ({ root, props }) => {
      const { id } = props;
      const item = query("GET_ITEM", id);

      if (
        !item ||
        item.archived ||
        ( !isPreviewablePdf(item.file) )
      ) {
        return;
      }

      // set preview view
      root.ref.pdfPreview = view.appendChildView(
        view.createChildView(pdfWrapperView, { id })
      );

      // now ready
      root.dispatch("DID_PDF_PREVIEW_CONTAINER_CREATE", { id });
    };

    // start writing
    view.registerWriter(
      createRoute(
        {
          DID_LOAD_ITEM: didLoadItem,
        },
        ({ root, props }) => {
          const { id } = props;
          const item = query("GET_ITEM", id);

          // don't do anything while not an PDF
          if (
            ( !isPreviewablePdf(item.file) ) ||
            root.rect.element.hidden
          )
            return;
        }
      )
    );
  });

  // expose plugin
  return {
    options: {
        
        allowPdfPreview: [true, Type.BOOLEAN],

        // Fixed PDF preview height
        pdfPreviewHeight: [320, Type.INT],

        // Extra params to pass to the pdf visulizer
        pdfComponentExtraParams: ['toolbar=0&navpanes=0&scrollbar=0&statusbar=0&zoom=0&messages=0&view=fitH&page=1', Type.STRING],
    },
  };
};

// fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";
if (isBrowser) {
  document.dispatchEvent(
    new CustomEvent("FilePond:pluginloaded", { detail: plugin })
  );
}

export default plugin;
