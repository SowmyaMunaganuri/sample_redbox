class FinancialAdapter  {
    adaptedString(data) {
        return data.replace(/_/g," ");
    }

    getRevenue(data) {
        console.log(data);
        let header = [];
        //let body = data;
        data.forEach( item => {
            header.push({title: this.adaptedString(item.Month), field: item.Month, editable: 'onUpdate'});
        });

    }

    getData(data) {
        return data;
    }
}

export default new FinancialAdapter();
