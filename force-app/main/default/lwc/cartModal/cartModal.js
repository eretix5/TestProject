import { LightningElement, api } from 'lwc';

export default class CartModal extends LightningElement {
  @api items = [];

  get isCheckoutDisabled() {
    return this.items.length === 0;
  }

  get columns() {
    return [
      { label: 'Name', fieldName: 'Name' },
      { label: 'Price', fieldName: 'Price__c', type: 'currency' },
      { label: 'Quantity', fieldName: 'quantity', type: 'number' }
    ];
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  handleCheckout() {
    this.dispatchEvent(new CustomEvent('checkout'));
  }
}
