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
  const detail = {
    Id: this.item.Id,
    Name: this.item.Name,
    Description__c: this.item.Description__c,
    Price__c: this.item.Price__c  // Запятая здесь не нужна (последнее свойство)
  };  // <- Ошибка была здесь: пропущена закрывающая скобка `}` перед `const event`
  const event = new CustomEvent('addtocart', {
    detail: detail  // Либо просто `detail` (сокращенная запись ES6)
  });
  this.dispatchEvent(event);
  }
}
