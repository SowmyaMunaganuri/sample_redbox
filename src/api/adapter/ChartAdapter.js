class ChartAdapter  {
    adaptedString(data) {
        return data.replace(/_/g," ");
    }

    getData(tableData, chartData) {
       const chart = chartData;
       let crews = [];
       let rigs = [];
       let waterOut = [];
       let production = [];
       const arr = {table: {}, chart: {}};

        let header = [];
        let body = tableData;
        for(const currentItem in tableData[0]) {
           header.push({title: this.adaptedString(currentItem), field: currentItem, editable: 'onUpdate'});
        }
       arr.table['header'] = header;
       arr.table['body'] = body;

        chart.forEach(items => {
          let curCrews = [];
          let curRigs = [];
          let totalProduction = [];
          let totalWaterout = [];

           for(let key in items) {
               if(key === "frac_date") {
                   const dat = Date.parse(new Date(items['frac_date']));
                   curCrews.push(dat);
                   curRigs.push(dat);
               }

               if(key === "date") {
                   const dat = Date.parse(new Date(items['date']));
                   totalProduction.push(dat);

                   totalWaterout.push(dat);
               }

               if(key === "total_production_with_waterout") {
                   totalProduction.push(items['total_production_with_waterout']);
               }
               if(key === "total_waterout") {
                   totalWaterout.push(items['total_waterout']);
               }

               if(key === "total_crews") {
                   curCrews.push(items['total_crews']);
               }
               if(key === "total_rigs") {
                   curRigs.push(items['total_rigs']);
               }

           }
           crews.push(curCrews);
           rigs.push(curRigs);
           waterOut.push(totalWaterout);
           production.push(totalProduction);

        });


        arr.chart = {rigs: rigs, crews: crews, waterOut: waterOut, production: production};

       return arr;
    }
}

export default new ChartAdapter();
