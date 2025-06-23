import { LightningElement, api } from 'lwc';

export default class ItemModal extends LightningElement {
  @api item;

  close() {
    this.dispatchEvent(new CustomEvent('close'));
  }
}
