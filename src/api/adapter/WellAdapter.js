class WellAdapter  {
   adaptedString(data) {
       return data.replace(/_/g," ");
   }

   getData(data) {
       let header = [];
       let body = data;
       //console.log(header);
       //console.log(body);
       for(const currentItem in data[0]) {
           if(currentItem !== 'WID' && currentItem !== 'SpudDate' && currentItem !== 'FracDate' && currentItem !== 'DOFP' && currentItem !== 'DIGD' && currentItem !== 'DIOD') {
               header.push({title: this.adaptedString(currentItem), field: currentItem});
           } else {
               header.push({title: this.adaptedString(currentItem), field: currentItem, editable: 'onAdd'});
           }
       }
       //console.log(header);
       //console.log(body);
       //console.log({header: header, body: body});
       return {header: header, body: body};

   }
}

export default new WellAdapter();
