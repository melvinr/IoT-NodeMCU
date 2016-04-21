d3.json("/api/data", function(error, data) {
    var time = [];
    var sensor1 = ['sensor1'];

    data.forEach(function(element, index) {
        time.push(element.time);
        sensor1.push(element.matthias.value1);
    });

    var chart = c3.generate({
        data: {
            columns: [
                sensor1
            ]
        },
        axis: {

            x: {
                type: 'category',
                categories: time
            }

        }
    });




});
