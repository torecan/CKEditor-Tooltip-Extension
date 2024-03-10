import {
  Plugin,
} from 'ckeditor5/src/core';
import TooltipEditing from './tooltipediting';
import TooltipUI from './tooltipui';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

export default class Tooltip extends Plugin {
  static get requires() {
    return [TooltipEditing, TooltipUI];
  }

}
