import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpportunity from '@salesforce/apex/ForecastManager.getOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import updateExpectedRevenue from '@salesforce/apex/ForecastManager.updateExpectedRevenue'
import { NavigationMixin } from 'lightning/navigation';

export default class ForecastManager extends NavigationMixin(LightningElement) {

    @wire(getOpportunity) getOpportunity;

    get opportunties() {
        return this.getOpportunity.data;
    }

    async handleExpectedRevenue(event){
        const recordId = event.target.dataset.id;
        try {
            const result = await updateExpectedRevenue({ oppId: recordId });


            this.showToast('Success', 'Expected Revenue updated', 'success');
            await refreshApex(this.getOpportunity);

            this[NavigationMixin.Navigate]({
                    type: 'standard__objectPage',
                    attributes: {
                    objectApiName: 'Opportunity',
                    actionName: 'view'
                },
            });

        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    showToast(title, message, variant){
        this.dispatchEvent(new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
    }));
    }

}