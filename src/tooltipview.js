import {
  View,
  ButtonView,
  createDropdown,
  addListToDropdown,
  LabelView,
  createLabeledInputText,
  LabeledFieldView,
  SwitchButtonView,
  submitHandler,
  Model,
} from 'ckeditor5/src/ui';

import {
  icons,
} from 'ckeditor5/src/core';

import {
  Collection,
} from 'ckeditor5/src/utils';

import {
  SearchFieldView
} from './tooltipsearchfieldview';

export default class FormView extends View {

  constructor(locale, editor) {
    super(locale);

    this.editor = editor;
    this.locale = locale;

    this.iconTypeList = [
      ['Info', 'info'],
      ['Question', 'question'],
    ];

    this.popupPlacementList = [
      ['Left', 'left'],
      ['Center', 'center'],
      ['Right', 'right'],
    ];

    this.iconColorList = [
      ['White', '#FFFFFF'],
      ['Red', '#FF0000'],
      ['Lime', '#00FF00'],
      ['Yellow', '#FFFF00'],
      ['Blue', '#0000FF'],
      ['Black', '#000000'],
    ];

    this._prepareTooltipForm();
  }


  _prepareTooltipForm() {

    this.iconTypeList = this._getList('Select an icon type', this.iconTypeList);
    this.iconColorList = this._getList('Select a color', this.iconColorList);
    this.iconFilled = new SwitchButtonView(this.locale);
    this.iconFilled.set( {
      label: 'Filled Icon',
      withText: true,
      isToggleable: true,
      isEnabled: true,
    } );

    this.popupPlacementList = this._getList('Select popup placement', this.popupPlacementList);
    this.paragraphList = this._getParagraphLibraryItemList();
    this.popupDistance = new LabeledFieldView(this.locale, createLabeledInputText);
    this.popupDistance.label='Provide popup distance';

    this.popupLabel = this._setLabel( "Popup Features" );
    this.iconLabel = this._setLabel( "Icon Features" );

    this.saveButtonView = this._createButton(
      'Save',
      icons.check,
      'ck-list-button-save',
      'submit'
    );

    this.cancelButtonView = this._createButton(
      'Cancel',
      icons.cancel,
      'ck-list-button-cancel',
    );

    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    this.childViews = this.createCollection([
      this.iconLabel,
      this.iconTypeList,
      this.iconFilled,
      this.iconColorList,
      this.popupLabel,
      this.paragraphList,
      this.popupPlacementList,
      this.popupDistance,
      this.saveButtonView,
      this.cancelButtonView,
    ]);

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-advanced-form'],
        tabindex: '-1',
      },
      children: this.childViews,
    });
  }

  _setLabel(title) {
    let labelView = new LabelView( this.locale )
    labelView.set('text', title);

    return labelView
  }

  _createButton(label, icon, className, type='') {
    const button = new ButtonView();

    button.set({
      label,
      icon: icon,
      tooltip: true,
      withText: true,
      class: className,
    });

    if(type !== ''){
      button.set('type', type)
    }

    return button;
  }

  _getList(label, iconLists) {
    const list = new createDropdown(this.locale);
    const itemDefinitions = new Collection();

    addListToDropdown(list, itemDefinitions);

    list.buttonView.set({
      label: label,
      withText: true,
      tooltip: false,
    });

    for (const [key, value] of iconLists) {
      const definition = {
        type: 'button',
        model: new Model({
          label: key,
          value: value,
          withText: true,
        }),
      };
      itemDefinitions.add(definition);
    }

    return list;
  }

  _getParagraphLibraryItemList() {
    const paragraphList = new createDropdown(this.locale);
    const itemDefinitions = new Collection();
    const items = this.editor.config.get('tooltip');
    const searchFieldView = new SearchFieldView(this.locale);

    searchFieldView.render();
    searchFieldView.element.addEventListener('input', (event) => {
    const searchText = event.target.value.toLowerCase();
      updateDropdownItems(searchText);
    });

    paragraphList.buttonView.set({
      label: 'Paragraph Library Items',
      withText: true,
      tooltip: false,
    });

    paragraphList.panelView.children.add(searchFieldView);

    function updateDropdownItems(searchText) {
      itemDefinitions.clear();
      for (const item in items) {
        const libraryItemLabel = items[item]['label'];
        const libraryItemId = items[item]['paragraphId'];

        if (libraryItemLabel.toLowerCase().includes(searchText)) {
          if(searchText.length > 2) {
            const definition = {
              type: 'button',
              model: new Model({
                label: libraryItemLabel ?? 'No Label',
                value: libraryItemId ?? 'No Paragraph id',
                withText: true,
              }),
            };
            itemDefinitions.add(definition);
          }
        }
      }
    }

    addListToDropdown(paragraphList, itemDefinitions);
    updateDropdownItems('');

    return paragraphList;
  }

  render() {
    super.render();
    submitHandler({
      view: this,
    });
  }
}
