import { LightningElement, api } from 'lwc';

export default class ItemTile extends LightningElement {
  @api item;

  handleDetails() {
    alert(`Item Details:\n\nName: ${this.item.Name}\nDescription: ${this.item.Description__c}`);
	this.dispatchEvent(new CustomEvent('details', {
      detail: this.item
    }));
  }

  handleAddToCart() {
    const event = new CustomEvent('addtocart', {
      detail: this.item
    });
    this.dispatchEvent(event);
  }
}
