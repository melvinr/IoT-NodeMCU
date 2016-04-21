d3.json("/api/data", function(error, data) {
    var time = [];
    var sensor = ['Amount of movements during sleep'];

    data.forEach(function(element, index) {
        time.push(element.time);
        sensor.push(element.input.motion);
    });

    //console.log(sensor);

    var newArr = sensor.slice(Math.max(sensor.length - 10, 1));
    var text = 'Amount of movements during sleep';

    newArr.unshift(text);

    console.log(newArr);

    var chart = c3.generate({
        data: {
            columns: [
                newArr
            ],
            xFormat: '%H:%M:%S'
        },
        axis: {
            x: {
                type: 'category',
                categories: time
            }

        }
    });
});
