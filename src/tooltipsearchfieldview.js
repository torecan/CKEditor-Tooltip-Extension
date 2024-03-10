import { View } from "ckeditor5/src/ui";

export class SearchFieldView extends View {
  constructor(locale) {
    super(locale);
    this.locale = locale;

    this.setTemplate({
      tag: 'input',
      attributes: {
        type: 'text',
        placeholder: 'Provide at least 3 characters ...',
        class: 'librarySearchInput',
      }
    });
  }

  registerFocusableElement() {
    const editor = this.locale.editor;

    if (editor && editor.ui.focusTracker) {
      editor.ui.focusTracker.add(this.element);
    }
  }

  render(){
    super.render();
    this.registerFocusableElement();
  }

  focus() {
    this.element.focus();
  }

}
