import {
  Plugin,
} from 'ckeditor5/src/core';
import {toWidget, viewToModelPositionOutsideModelElement} from "ckeditor5/src/widget";

export default class TooltipEditing extends Plugin {

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
        viewElement.hasClass("tooltip"),
      ),
    );
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("tooltip", {
      allowWhere: "$text",
      isInline: true,
      isObject: true,
      allowAttributes:
        [
            "data-popup-id",
            "data-popup-distance",
            "data-popup-placement",
            "data-icon-filled",
            "data-icon-type",
            "data-icon-color",
          ],
    });
  }


  _defineConverters() {

    const conversion = this.editor.conversion;

    conversion.for("upcast").elementToElement({
      view: {
        name: "tooltip",
        classes: ["tooltip"],
      },
      model: (viewElement, writer) => {

        const modelWriter = writer.writer || writer;

        const iconType = viewElement.getAttribute('data-icon-type');
        const iconFilled = viewElement.getAttribute('data-icon-filled');
        const iconColor = viewElement.getAttribute('data-icon-color');
        const popupId = viewElement.getAttribute('data-popup-id');
        const popupDistance = viewElement.getAttribute('data-popup-distance');
        const popupPlacement = viewElement.getAttribute('data-popup-placement');


        return modelWriter.createElement("tooltip",
          {
            'data-icon-type': iconType,
            'data-icon-filled': iconFilled,
            'data-icon-color': iconColor,
            'data-popup-id': popupId,
            'data-popup-distance': popupDistance,
            'data-popup-placement': popupPlacement,
          }
          );
      },
    });


    conversion.for("editingDowncast").elementToElement({
      model: "tooltip",
      view: (modelItem, writer) => {
        const viewWriter = writer.writer || writer;

        const widgetElement = createTooltipView(modelItem, viewWriter);
        return toWidget(widgetElement, viewWriter);
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "tooltip",
      view: (modelItem, writer) => {
        const viewWriter = writer.writer || writer;
        return createTooltipView(modelItem, viewWriter)
      },
    });

    this.editor.conversion.for('downcast').add(dispatcher => {
      dispatcher.on('insert:tooltip', (evt, data, conversionApi) => {
        const viewWriter = conversionApi.writer;
        const viewElement = conversionApi.mapper.toViewElement(data.item);

        const iconType = data.item.getAttribute('data-icon-type');
        if (iconType) {
          viewWriter.addClass(iconType, viewElement);
        }
      });
    });
  }
}


function createTooltipView(modelItem, viewWriter) {

  const popupId = modelItem.getAttribute("data-popup-id");
  const popupDistance = modelItem.getAttribute("data-popup-distance");
  const popupPlacement = modelItem.getAttribute("data-popup-placement");
  const iconType = modelItem.getAttribute("data-icon-type");
  const iconFilled = modelItem.getAttribute("data-icon-filled");
  const iconColor = modelItem.getAttribute("data-icon-color");

  const tooltipText = "[[TOOLTIP::" + iconType +"]]";

  const tooltipView = viewWriter.createContainerElement("tooltip", {
    class: "tooltip " + iconType,
    "data-popup-id": popupId,
    "data-popup-distance": popupDistance,
    "data-popup-placement": popupPlacement,
    "data-icon-type": iconType,
    "data-icon-filled": iconFilled,
    "data-icon-color": iconColor,
  });

  const innerText = viewWriter.createText(
    tooltipText
  );
  viewWriter.insert(
    viewWriter.createPositionAt(tooltipView, 0),
    innerText,
  );

  return tooltipView;
}

