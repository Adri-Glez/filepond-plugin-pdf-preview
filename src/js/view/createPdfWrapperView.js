import { createPdfView } from './createPdfView';

export const createPdfWrapperView = _ => {

    /**
     * Write handler for when preview container has been created
     */
    const didCreatePreviewContainer = ({ root, props }) => {
        const { id } = props;
        const item = root.query('GET_ITEM', id);
        if (!item) return;

        // the preview is now ready to be drawn
        root.dispatch('DID_PDF_PREVIEW_LOAD', {
            id
        });
    };

    /**
     * Constructor
     */
    const create = ({ root, props }) => {
        const pdf = createPdfView(_);

        // append pdf presenter
        root.ref.pdf = root.appendChildView(
            root.createChildView(pdf, {
                id: props.id
            })
        );
    };

    return _.utils.createView({
        name: 'pdf-preview-wrapper',
        create,
        write: _.utils.createRoute({
            // pdf preview stated
            DID_PDF_PREVIEW_CONTAINER_CREATE: didCreatePreviewContainer
        })
    });
};
