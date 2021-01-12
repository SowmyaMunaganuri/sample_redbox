class DrillsAdapter  {
    getData(data) {
        return data;
    }

  // need mark from drilling datasets on , because for now datasets without marks
    getParsedDataSet(data) {
        const header = [];
        let body = [];

        const part1 = [];
        const part2= [];
        const part3 = [];

        for(const currentItem in data[0]) {
            header.push(currentItem);
        }

        data.map((el, i) => {
            if(i < 81) {
               part1.push(el);
            }
            if(81 < i && i < 160) {
                part2.push(el);
            }
            if(i > 120) {
                part3.push(el);
            }
        });

        body = [part1, part2, part3];

        return {header: header, body: body};
    }
}

export default new DrillsAdapter();
