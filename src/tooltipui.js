import {
  Plugin, icons,
} from 'ckeditor5/src/core';

import {
  ButtonView,
  ContextualBalloon,
  clickOutsideHandler,
} from 'ckeditor5/src/ui';

import FormView from "./tooltipview";

import listIcon from "./theme/infoIcon.svg";
import "./theme/tooltip.css";


export default class TooltipUI extends Plugin {

  static get requires() {
    return [ContextualBalloon];
  }

  init() {

    const editor = this.editor;
    this._balloon = editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();
    this.selection = editor.model.document.selection;

    editor.ui.componentFactory.add('Tooltip', (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: 'Tooltip',
        icon: listIcon,
        withText: false,
        tooltip: true,
      });

      this._commandFunctions(button);

      return button;
    });
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView(editor.locale, editor);

    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });

    return formView;
  }

  _hideUI() {
    this.formView.element.reset();
    this._balloon.remove(this.formView);
    this.editor.editing.view.focus();
  }

  _showUI() {
    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData(),
    });

  }

  _getBalloonPositionData() {
    const {
      view,
    } = this.editor.editing;
    const viewDocument = view.document;
    let target;

    // Set a target position by converting view selection range to DOM
    target = () =>
      view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

    return {
      target,
    };
  }


  _commandFunctions(button) {

    this.listenTo( button, 'execute', () => {
      this.editor.model.change( writer => {
        this._showUI();
      } );
    });

    this._buttonListener();

  }


  _buttonListener() {

    const iconTypeDropdown = this.formView.iconTypeList;
    const iconColorDropdown = this.formView.iconColorList;
    const iconFilledButton = this.formView.iconFilled;
    const popupIdDropdown = this.formView.paragraphList;
    const popupPlacementDropdown = this.formView.popupPlacementList;
    const popupDistanceInput = this.formView.popupDistance;

    let iconFilled,
        popupDistance;

    const handleDropdownExecute = (dropdown, property) => {
      this.listenTo(dropdown, 'execute', (evt) => {
        this.editor.model.change(() => {
          this[property] = evt.source.value;
          dropdown.buttonView.label = evt.source.label;
        });
      });
    }

    handleDropdownExecute(iconTypeDropdown, 'iconType');
    handleDropdownExecute(iconColorDropdown, 'iconColor');
    handleDropdownExecute(popupIdDropdown, 'popupId');
    handleDropdownExecute(popupPlacementDropdown, 'popupPlacement');

    // iconFilled
    this.listenTo(iconFilledButton, 'execute', (evt) => {
      this.editor.model.change(() => {
        iconFilled = evt.source.isOn;
      });
    });


    this.listenTo(this.formView, 'cancel', () => {
      this._hideUI();
    });

    this.listenTo(this.formView, 'submit', () => {
      // popupDistance
      popupDistance = popupDistanceInput.fieldView.element.value;

      this.editor.model.change((writer) => {
        const tooltip = writer.createElement("tooltip", {
          'data-icon-type': this.iconType,
          'data-icon-color': this.iconColor,
          'data-icon-filled': iconFilled,
          'data-popup-id': this.popupId,
          'data-popup-placement': this.popupPlacement,
          'data-popup-distance': popupDistance,
        });

        this.editor.model.insertContent(tooltip);

        this._hideUI();
      });
    });
  }
}

