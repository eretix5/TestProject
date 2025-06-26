import { LightningElement, track, api } from 'lwc';
import getAccount from '@salesforce/apex/PurchaseController.getAccount';
import getItems from '@salesforce/apex/ItemController.getItems';
import createPurchase from '@salesforce/apex/PurchaseController.createPurchase';
import { NavigationMixin } from 'lightning/navigation'
import checkIsManager from '@salesforce/apex/UserController.checkIsManager';

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
  @track showCreateItemModal = false;
  @track isManager = false;

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
	// return this.items;
  }

  connectedCallback() {
    const accountId = '001Au00000rtZJfIAM';
 
    if (accountId) {
      getAccount({ accountId })
        .then(result => {
          console.log('Loaded account:', result);
          this.account = result;
        })
        .catch(error => {
          console.error('Error loading account:', error);
        });

      getItems()
        .then(data => {
          console.log('Items:', data);
          this.items = data;
        })
        .catch(error => {
          console.error('Error loading items:', error);
        });

      checkIsManager()
        .then(val => {
          this.isManager = val;
          console.log('IsManager:', val);
        })
        .catch(err => console.error('Manager check failed', err));
    } else {
      console.warn('accountId is missing from URL');
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
    const item = JSON.parse(JSON.stringify(event.detail));
	console.log('Adding item to cart:', item);
    this.cart = [...this.cart, { ...item, quantity: 1 }];
	console.log('Cart length:', this.cart.length);
	console.log('cart before send:', JSON.stringify(this.cart));
	console.log('Current cart:', this.cart);
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
  openCreateItemModal() {
    this.showCreateItemModal = true;
  }
  closeCreateItemModal() {
    this.showCreateItemModal = false;
  }

  async handleCheckout() {
    if (!this.account || this.cart.length === 0) return;

    try {
      const cartToSend = this.cart.map(item => {
        console.log('Preparing item:', item); 
        return { 
            Id: item.Id + '',
            price: Number(item.Price__c),
            quantity: Number(item.quantity)
        };
    });

	  console.log('Cart:', cartToSend);
	  console.log('Account ID:', this.account.Id);
	  console.log('Cart sending to Apex:', JSON.stringify(cartToSend, null, 2));
      const purchaseId = await createPurchase({
        accountId: this.account.Id,
        cartRaw: cartToSend
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
