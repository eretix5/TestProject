import { LightningElement, track, api } from 'lwc';
import getAccount from '@salesforce/apex/PurchaseController.getAccount';
import getItems from '@salesforce/apex/ItemController.getItems';
import createPurchase from '@salesforce/apex/PurchaseController.createPurchase';
import { NavigationMixin } from 'lightning/navigation';

export default class ItemPurchaseTool extends NavigationMixin(LightningElement) {
  @track account;
  @track items = [];
  @track cart = [];
  @track selectedFamily = '';
  @track selectedType = '';
  @track searchText = '';
  @track isCartOpen = false;
  @track selectedItem = null;
  @track showItemModal = false;

  get familyOptions() {
    return [
      { label: 'All', value: '' },
      { label: 'Electronics', value: 'Electronics' },
      { label: 'Books', value: 'Books' }
    ];
  }

  get typeOptions() {
    return [
      { label: 'All', value: '' },
      { label: 'Retail', value: 'Retail' },
      { label: 'Wholesale', value: 'Wholesale' }
    ];
  }

  get filteredItems() {
    return this.items.filter(item => {
      return (!this.selectedFamily || item.Family__c === this.selectedFamily) &&
             (!this.selectedType || item.Type__c === this.selectedType) &&
             (!this.searchText || 
              item.Name.toLowerCase().includes(this.searchText.toLowerCase()) || 
              (item.Description__c && item.Description__c.toLowerCase().includes(this.searchText.toLowerCase())));
    });
  }

  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');
    if (accountId) {
      getAccount({ accountId })
        .then(result => { this.account = result; });

      getItems()
        .then(data => { this.items = data; });
    }
  }

  handleFamilyChange(event) {
    this.selectedFamily = event.detail.value;
  }

  handleTypeChange(event) {
    this.selectedType = event.detail.value;
  }

  handleSearchChange(event) {
    this.searchText = event.detail.value;
  }

  handleAddToCart(event) {
    const item = event.detail;
    this.cart.push({ ...item, quantity: 1 });
  }
  
  handleItemDetails(event) {
  this.selectedItem = event.detail;
  this.showItemModal = true;
  }

  closeItemModal() {
  this.selectedItem = null;
  this.showItemModal = false;
  }

  openCart() {
    this.isCartOpen = true;
  }

  closeCart() {
    this.isCartOpen = false;
  }

  async handleCheckout() {
    if (!this.account || this.cart.length === 0) return;

    try {
      const cartToSend = this.cart.map(item => ({
        Id: item.Id,
        Price__c: item.Price__c,
        quantity: item.quantity
      }));

      const purchaseId = await createPurchase({
        accountId: this.account.Id,
        cart: cartToSend
      });

      this.isCartOpen = false;
      this.cart = [];

      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
          recordId: purchaseId,
          objectApiName: 'Purchase__c',
          actionName: 'view'
        }
      });
    } catch (error) {
      console.error(error);
      alert('Error while creating purchase');
    }
  }
}
