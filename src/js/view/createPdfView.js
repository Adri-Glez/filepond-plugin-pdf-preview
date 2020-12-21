import { isPreviewablePdf } from "./../utils/isPreviewablePdf";


export const createPdfView = (_) =>
  _.utils.createView({
    name: "pdf-preview",
    tag: "div",
    ignoreRect: true,
    create: ({ root, props }) => {
      // get item
      const item = root.query("GET_ITEM", { id: props.id });
      if (isPreviewablePdf(item.file)) {
          const numPdfPreviewHeight = root.query('GET_PDF_PREVIEW_HEIGHT');          
          root.ref.pdf = document.createElement('object');
          root.ref.pdf.setAttribute('height', numPdfPreviewHeight);
          root.ref.pdf.setAttribute('width', "100%");//320
          root.ref.pdf.setAttribute( 
            'style',
            'position:absolute;left:0;right:0;margin:auto;padding-top:unset;' +
            ((numPdfPreviewHeight) ? ('height:' + numPdfPreviewHeight + 'px;') : '') 
                 
          );
          root.element.appendChild(root.ref.pdf);
      } 
    },
    write: _.utils.createRoute({
      DID_PDF_PREVIEW_LOAD: ({ root, props }) => {
        const { id } = props;

        // get item
        const item = root.query("GET_ITEM", { id: id });
        if (!item) return;

        let URL = window.URL || window.webkitURL;
        let blob = new Blob([item.file], { type: item.file.type });

        root.ref.pdf.type = item.file.type;
        if (isPreviewablePdf(item.file)) {
            const sPdfComponentExtraParams = root.query('GET_PDF_COMPONENT_EXTRA_PARAMS');
            root.ref.pdf.data = URL.createObjectURL(blob) + ((!sPdfComponentExtraParams)?"":("#?"+sPdfComponentExtraParams));
        }
        //else root.ref.pdf.src = URL.createObjectURL(blob);

        root.ref.pdf.addEventListener(
          "load",
          () => {
            if (isPreviewablePdf(item.file)) {
              root.dispatch("DID_UPDATE_PANEL_HEIGHT", {
                id: id,
                height: root.ref.pdf.scrollHeight,
              });
            }
          },
          false
        );
      },
    }),
  });
