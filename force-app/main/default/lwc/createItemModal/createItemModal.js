import { LightningElement, api, track } from 'lwc';
import getImageUrl from '@salesforce/apex/Unsplash.getImageUrl';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import createItem from '@salesforce/apex/Workaround.createItem';

export default class CreateItemModal extends LightningElement {
  @track name = '';
  @track description = '';
  @track type = '';
  @track family = '';
  @track price = '';
  @track imageUrl = '';

  get typeOptions() {
    return [
      { label: 'Retail', value: 'Retail' },
      { label: 'Wholesale', value: 'Wholesale' }
    ];
  }

  get familyOptions() {
    return [
      { label: 'Electronics', value: 'Electronics' },
      { label: 'Books', value: 'Books' }
    ];
  }

  async handleNameChange(e) {
    this.name = e.target.value;

    if (this.name.length > 2) {
      this.imageUrl = await getImageUrl({ query: this.name });
    }
  }

  async handleCreate() {
	await createItem({
	  name: this.name,
	  description: this.description,
	  type: this.type,
	  family: this.family,
	  price: parseFloat(this.price),
	  imageUrl: this.imageUrl
	});
	// Unfortunately the following code does not work since i don't have permission as user
	// to create any record of any item (ui does not allow me to edit my user profile directly
	// i tried tho create permission set allowind CRUD but still was getting error)
	/*
    const fields = {
      Name: this.name,
      Description__c: this.description,
      Type__c: this.type,
      Family__c: this.family,
      Price__c: parseFloat(this.price),
      Image__c: this.imageUrl
    };

    try {
      await createRecord({ apiName: 'Item__c', fields });
      this.dispatchEvent(new ShowToastEvent({
        title: 'Success',
        message: 'Item created',
        variant: 'success'
      }));
      this.dispatchEvent(new CustomEvent('close'));
    } catch (err) {
      console.error(err);
      this.dispatchEvent(new ShowToastEvent({
        title: 'Error',
        message: 'Failed to create item',
        variant: 'error'
      }));
    }
	*/
  }

  handleDescriptionChange(e) {
	this.description = e.target.value;
  }

  handleTypeChange(e) {
    this.type = e.detail.value;
  }

  handleFamilyChange(e) {
    this.family = e.detail.value;
  }

  handlePriceChange(e) {
    this.price = e.target.value;
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }
}
