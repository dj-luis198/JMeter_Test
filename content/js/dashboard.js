/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.77247414478919, "KoPercent": 2.2275258552108195};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7042682926829268, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fba6d01-fef8-4e9a-ab1b-838918e2ce96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4899e536-7d98-4f74-9004-6534be04d3de"], "isController": false}, {"data": [0.375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fab19cd4-c8fe-4e75-afa9-6602e0559b6a"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58745807-9dcb-429c-b263-e0f6128fdd09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/09bd0949-0060-4695-8e26-d15077a23e87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87e26c4d-c4d4-4f66-a022-4e9a4cdc33d4"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5238095238095238, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecda7760-0846-4ba5-8574-ae1d5cec928f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09bd0949-0060-4695-8e26-d15077a23e87"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0587d14e-49a3-469b-93b2-4dd005f43dfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8e14eecf-5924-4e2c-9ce5-600140ec2700"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0126ef27-9f33-42f7-bda7-73dd16ed4e04"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ec98888-4d3a-43f7-8eab-fc65e7abfd77"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8bc1d1eb-24aa-4631-ba16-88e7fe2881b0"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.09615384615384616, 500, 1500, "register"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fba6d01-fef8-4e9a-ab1b-838918e2ce96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25925925925925924, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.09615384615384616, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a0bbfb7-e295-4cc8-993b-9c36fb8c5785"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fab19cd4-c8fe-4e75-afa9-6602e0559b6a"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/34708aa4-ab8c-43f8-b77e-2a11220e1ee1"], "isController": false}, {"data": [0.3055555555555556, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58745807-9dcb-429c-b263-e0f6128fdd09"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9290123456790124, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87e26c4d-c4d4-4f66-a022-4e9a4cdc33d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7ce72b2-8c1c-48e0-8f71-b0c3cf53eac3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bc1d1eb-24aa-4631-ba16-88e7fe2881b0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0587d14e-49a3-469b-93b2-4dd005f43dfc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7ce72b2-8c1c-48e0-8f71-b0c3cf53eac3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e14eecf-5924-4e2c-9ce5-600140ec2700"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ec98888-4d3a-43f7-8eab-fc65e7abfd77"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1a0bbfb7-e295-4cc8-993b-9c36fb8c5785"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ecda7760-0846-4ba5-8574-ae1d5cec928f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0126ef27-9f33-42f7-bda7-73dd16ed4e04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1257, 28, 2.2275258552108195, 529.9291964996023, 135, 7806, 161.0, 1468.4000000000003, 1727.199999999999, 2946.260000000004, 4.924583741429971, 696.8413932419197, 3.594442488981391], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2314.777777777778, 1669, 2918, 2261.0, 2834.5, 2885.0, 2918.0, 0.24378792256573245, 293.3599278610657, 1.1987033106625615], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7fba6d01-fef8-4e9a-ab1b-838918e2ce96", 3, 0, 0.0, 386.3333333333333, 252, 559, 348.0, 559.0, 559.0, 559.0, 0.042803943670010135, 0.02751881144149414, 0.027449143564427066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4899e536-7d98-4f74-9004-6534be04d3de", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 725.4999999999999, 146, 1683, 630.0, 1473.0000000000002, 1683.0, 1683.0, 0.0884588804422944, 0.017876425362819626, 0.05933072736696614], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 725.4999999999999, 146, 1683, 630.0, 1473.0000000000002, 1683.0, 1683.0, 0.09010531058174241, 0.018209148152841134, 0.06043501330461227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 201.26315789473685, 137, 427, 142.0, 425.0, 427.0, 427.0, 0.14760491602057146, 0.06283223244666801, 0.08287603323441214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 144.1052631578947, 139, 152, 144.0, 148.0, 152.0, 152.0, 0.14792784235563408, 0.10993465628187261, 0.0742528427449179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 292.6315789473684, 138, 1143, 143.0, 1141.0, 1143.0, 1143.0, 0.14678842380135662, 4.578627895208517, 0.08511103047404936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 304.5789473684211, 137, 1499, 143.0, 1298.0, 1499.0, 1499.0, 0.14661059454454262, 13.921721878737605, 0.08486474690381574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fab19cd4-c8fe-4e75-afa9-6602e0559b6a", 3, 0, 0.0, 703.6666666666666, 432, 858, 821.0, 858.0, 858.0, 858.0, 0.02568163335188118, 0.02575687251209177, 0.016469016179429013], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 514.375, 144, 3583, 318.5, 1395.5000000000023, 3583.0, 3583.0, 0.08662414864703909, 0.1608129947050989, 0.055985297242645074], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 168.0952380952381, 137, 424, 142.0, 365.20000000000016, 423.6, 424.0, 0.10099844173832746, 0.075058412268425, 0.0506964834506839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 167.4761904761905, 136, 420, 142.0, 351.60000000000014, 418.09999999999997, 420.0, 0.10100038476337053, 0.034249200413620624, 0.05719785554540208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1024.6666666666667, 833, 1141, 1105.0, 1141.0, 1141.0, 1141.0, 0.0928548214866057, 27.302400587306742, 0.052956265379079805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1548.8333333333333, 1488, 1655, 1531.5, 1655.0, 1655.0, 1655.0, 0.09212203098370975, 82.89156541239963, 0.05244838287451444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 243.0, 140, 424, 167.0, 424.0, 424.0, 424.0, 0.09389671361502347, 0.1661531690140845, 0.051991637323943664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58745807-9dcb-429c-b263-e0f6128fdd09", 3, 0, 0.0, 475.66666666666663, 243, 872, 312.0, 872.0, 872.0, 872.0, 0.029060474848159018, 0.024226522163455482, 0.01863578627958114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 167.58333333333331, 141, 424, 144.0, 342.4000000000003, 424.0, 424.0, 0.08611471915837214, 0.06399736453078243, 0.04322555239004227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 272.1666666666667, 137, 577, 147.0, 532.0000000000001, 577.0, 577.0, 0.0861178091629349, 0.02304324190492594, 0.04911406303823631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09bd0949-0060-4695-8e26-d15077a23e87", 3, 0, 0.0, 800.6666666666666, 290, 1156, 956.0, 1156.0, 1156.0, 1156.0, 0.02759686499613644, 0.02767771518655481, 0.017697208347131767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 213.91666666666669, 137, 430, 142.5, 429.7, 430.0, 430.0, 0.08611657313449973, 0.02321110760265813, 0.05062712600289926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 165.25, 139, 421, 141.5, 339.7000000000003, 421.0, 421.0, 0.08611595513358737, 0.02321094103209972, 0.05071086029839178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 284.1666666666667, 139, 437, 281.5, 437.0, 437.0, 437.0, 0.09431737797689224, 0.07009328578165527, 0.052961418297571325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 266.00000000000006, 138, 1641, 143.0, 421.0, 1519.1999999999982, 1641.0, 0.10100135630392751, 4.353602780002213, 0.058964426480631785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1220.5, 139, 1907, 1549.0, 1878.5, 1907.0, 1907.0, 0.0933812690514464, 60.02478407665935, 0.049165863476584644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 247.7619047619048, 137, 1099, 142.0, 544.6000000000001, 1046.4999999999993, 1099.0, 0.1010018420812151, 1.4401122954111496, 0.05906334468802455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 918.2857142857143, 140, 1311, 1183.5, 1302.0, 1311.0, 1311.0, 0.09338313767342582, 19.619864969650482, 0.04925804178895411], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 527.8750000000001, 144, 1060, 531.5, 960.6000000000001, 1060.0, 1060.0, 0.09039037342523021, 0.018266755762386306, 0.061111704494096385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87e26c4d-c4d4-4f66-a022-4e9a4cdc33d4", 3, 0, 0.0, 411.0, 319, 561, 353.0, 561.0, 561.0, 561.0, 0.03191217768700536, 0.025939032449366014, 0.020464514988086123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 442.24999999999994, 284, 853, 292.5, 812.8000000000002, 853.0, 853.0, 0.0860264387921888, 0.13332417808906605, 0.19347547708829183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 1052.8095238095234, 152, 2862, 1024.0, 2386.0000000000005, 2825.9999999999995, 2862.0, 0.09388747809292178, 0.057671116914499804, 0.04245107652053006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 147.07142857142856, 140, 189, 143.5, 170.5, 189.0, 189.0, 0.09338438346295976, 0.06939991778839098, 0.04687458310543097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecda7760-0846-4ba5-8574-ae1d5cec928f", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.2779447115384615, 1.0606971153846154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 162.3571428571429, 137, 412, 143.0, 281.5, 412.0, 412.0, 0.09338376056403791, 0.1251717594167517, 0.04765594254230617], "isController": false}, {"data": ["login", 21, 0, 0.0, 4773.333333333334, 2017, 13089, 4117.0, 9644.2, 12796.999999999996, 13089.0, 0.09159106769016051, 31.43163176574494, 0.18158491391530007], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09bd0949-0060-4695-8e26-d15077a23e87", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0587d14e-49a3-469b-93b2-4dd005f43dfc", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 174.19047619047615, 141, 430, 148.0, 364.6000000000002, 428.59999999999997, 430.0, 0.10520409594613551, 0.0851701128313929, 0.037396768480852854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e14eecf-5924-4e2c-9ce5-600140ec2700", 3, 0, 0.0, 820.0, 220, 1995, 245.0, 1995.0, 1995.0, 1995.0, 0.032248008685463674, 0.02656891601006138, 0.020679875361446432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0126ef27-9f33-42f7-bda7-73dd16ed4e04", 3, 0, 0.0, 705.6666666666667, 244, 1491, 382.0, 1491.0, 1491.0, 1491.0, 0.03868222551737477, 0.0314419001031526, 0.024805984462639416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1368.9285714285713, 286, 2051, 1693.0, 2023.0, 2051.0, 2051.0, 0.0932910413945678, 79.76167991343924, 0.19276417607351332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ec98888-4d3a-43f7-8eab-fc65e7abfd77", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bc1d1eb-24aa-4631-ba16-88e7fe2881b0", 3, 0, 0.0, 1687.3333333333335, 439, 4113, 510.0, 4113.0, 4113.0, 4113.0, 0.03296667069592642, 0.027482956918055843, 0.021140736090812188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 495.63157894736844, 283, 1640, 296.0, 1444.0, 1640.0, 1640.0, 0.1464467396331124, 18.645305936392013, 0.32541796333050715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 1011.3333333333334, 138, 1973, 1021.0, 1967.0, 1973.0, 1973.0, 0.15059673958058808, 90.10317641466811, 0.21968152319189788], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 1647.2307692307686, 205, 3820, 1437.0, 3553.9, 3803.5499999999997, 3820.0, 0.1031230416537763, 0.03204003157151583, 0.04652621605863735], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 483.7142857142857, 281, 2066, 291.0, 821.0000000000001, 1944.0999999999983, 2066.0, 0.10092999783721433, 5.898847715858025, 0.2257642218177012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 156.00000000000003, 142, 199, 150.0, 188.5, 199.0, 199.0, 0.09224119755429054, 0.07161303911685642, 0.03278886319312671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 441.0588235294119, 285, 1671, 290.0, 837.3999999999993, 1671.0, 1671.0, 0.09265921032550635, 6.655899291702095, 0.2069981635080777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 145.5, 140, 153, 143.0, 153.0, 153.0, 153.0, 0.03607590370138772, 0.026810315153082083, 0.018108412600110632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 141.33333333333331, 138, 144, 142.0, 144.0, 144.0, 144.0, 0.036076337530213935, 0.009653238753201775, 0.020574786247700136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 143.0, 138, 147, 143.5, 147.0, 147.0, 147.0, 0.036076337530213935, 0.009723700349940474, 0.021208940618348427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fba6d01-fef8-4e9a-ab1b-838918e2ce96", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 143.5, 139, 149, 143.5, 149.0, 149.0, 149.0, 0.036076337530213935, 0.009723700349940474, 0.021244171416717774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 154.66666666666666, 144, 162, 158.0, 162.0, 162.0, 162.0, 0.13166556945358787, 0.03883105661619486, 0.0813909233048058], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1596.4629629629637, 1094, 2323, 1478.5, 2237.5, 2282.25, 2323.0, 0.24374610683301587, 291.60508362974065, 0.48130334767222466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 1647.2307692307686, 205, 3820, 1437.0, 3553.9, 3803.5499999999997, 3820.0, 0.10186092066601371, 0.03164789422135161, 0.04595678256611165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 141.8, 138, 146, 142.0, 146.0, 146.0, 146.0, 0.03498950314905529, 0.009430764520643807, 0.020604170311406576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 254.0, 142, 428, 144.0, 428.0, 428.0, 428.0, 0.03498950314905529, 0.009430764520643807, 0.02057000087473758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a0bbfb7-e295-4cc8-993b-9c36fb8c5785", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5458128776435045, 2.082939954682779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 161.85714285714286, 138, 426, 141.0, 287.5, 426.0, 426.0, 0.0874852368662788, 0.023580005249114213, 0.0514317505795897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 201.35714285714286, 137, 429, 143.0, 424.5, 429.0, 429.0, 0.08748250349930015, 0.02357926852129574, 0.051515575791091776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 253.8, 140, 425, 145.0, 425.0, 425.0, 425.0, 0.03498999286204146, 0.009362556683788437, 0.01995523030413302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 144.5, 135, 166, 144.5, 157.0, 166.0, 166.0, 0.08748578356017146, 0.06501629032157275, 0.04391376245110169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 251.4, 139, 415, 145.0, 415.0, 415.0, 415.0, 0.03492278572077137, 0.025953359310065444, 0.017529601426246568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 201.64285714285717, 135, 429, 143.0, 425.0, 429.0, 429.0, 0.08748687696845474, 0.0234095745013248, 0.04989485952107184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fab19cd4-c8fe-4e75-afa9-6602e0559b6a", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 694.1875, 138, 1995, 557.5, 1642.2000000000003, 1995.0, 1995.0, 0.09232811102455352, 0.018184986222914683, 0.06282752135087567], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 145.0, 140, 150, 145.0, 150.0, 150.0, 150.0, 0.03402193734520019, 0.02677898584006968, 0.012093735540676628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2347.190476190476, 1264, 7806, 1825.0, 5918.800000000002, 7673.999999999998, 7806.0, 0.09176476757295299, 0.047495436341469806, 0.042208208522325055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 507.0, 285, 843, 289.0, 843.0, 843.0, 843.0, 0.034888183372291805, 0.054069870128737395, 0.07846434209608205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34708aa4-ab8c-43f8-b77e-2a11220e1ee1", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.5340065844481605, 0.9977921195652174], "isController": false}, {"data": ["addBook", 54, 6, 11.11111111111111, 1517.9629629629633, 718, 5198, 1186.5, 2685.5, 2936.25, 5198.0, 0.2831776730136922, 88.93308100258005, 1.029673677062084], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 255.6666666666665, 139, 596, 145.0, 577.5, 585.5, 596.0, 0.2451169525607913, 0.18216211025269743, 0.11848915187264812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58745807-9dcb-429c-b263-e0f6128fdd09", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 891.1111111111113, 682, 1396, 833.5, 1131.5, 1257.0, 1396.0, 0.24489795918367346, 72.00813137755102, 0.12316645408163265], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 211.462962962963, 137, 440, 146.0, 424.0, 430.0, 440.0, 0.24565665388342225, 0.4346971258171496, 0.11946973987689873], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1339.1296296296298, 950, 1851, 1336.5, 1677.0, 1693.25, 1851.0, 0.24443679950750513, 219.94466187091473, 0.12269581537779066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 182.35294117647058, 141, 432, 147.0, 431.2, 432.0, 432.0, 0.08614006374364717, 0.06435268433973641, 0.030620100783874577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 6, 3.7037037037037037, 253.79012345679024, 136, 3224, 151.5, 426.70000000000005, 547.4999999999998, 2516.510000000005, 0.6982879015155433, 1.5371022021931413, 0.33421744071018467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 195.33333333333334, 146, 425, 149.0, 425.0, 425.0, 425.0, 0.03704183875687589, 0.028685720834182207, 0.013167216120608225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87e26c4d-c4d4-4f66-a022-4e9a4cdc33d4", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7ce72b2-8c1c-48e0-8f71-b0c3cf53eac3", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 0.19680181100217864, 0.751038262527233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 160.73684210526318, 143, 417, 146.0, 155.0, 417.0, 417.0, 0.15345599043726882, 0.12453313286461952, 0.0545488091007479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bc1d1eb-24aa-4631-ba16-88e7fe2881b0", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0587d14e-49a3-469b-93b2-4dd005f43dfc", 3, 0, 0.0, 1513.0, 245, 3738, 556.0, 3738.0, 3738.0, 3738.0, 0.018502756910779707, 0.021869632273125363, 0.01186537471166537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7ce72b2-8c1c-48e0-8f71-b0c3cf53eac3", 3, 0, 0.0, 448.0, 257, 595, 492.0, 595.0, 595.0, 595.0, 0.04936077792586011, 0.031734224089704985, 0.03165388428188295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e14eecf-5924-4e2c-9ce5-600140ec2700", 1, 0, 0.0, 1060.0, 1060, 1060, 1060.0, 1060.0, 1060.0, 1060.0, 0.9433962264150944, 0.17043779481132074, 0.6504274764150944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 291.0, 282, 298, 291.5, 298.0, 298.0, 298.0, 0.03604491196030254, 0.055862573516601684, 0.08106585180134447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 408.57142857142856, 279, 592, 292.0, 583.5, 592.0, 592.0, 0.08740712992445526, 0.1354639796778423, 0.1965806838047075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ec98888-4d3a-43f7-8eab-fc65e7abfd77", 3, 0, 0.0, 531.6666666666666, 458, 651, 486.0, 651.0, 651.0, 651.0, 0.020083816460695972, 0.027687162340835757, 0.012879270321474956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a0bbfb7-e295-4cc8-993b-9c36fb8c5785", 3, 0, 0.0, 1539.3333333333335, 485, 3583, 550.0, 3583.0, 3583.0, 3583.0, 0.059678927370745385, 0.027003160496528678, 0.0382706663152241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 177.66666666666666, 145, 425, 151.5, 351.2000000000003, 425.0, 425.0, 0.08944877194290186, 0.0741621165815661, 0.0317962431515784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecda7760-0846-4ba5-8574-ae1d5cec928f", 3, 0, 0.0, 1711.6666666666667, 347, 3932, 856.0, 3932.0, 3932.0, 3932.0, 0.01726559082851815, 0.023802010793871866, 0.011072009743548425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 148.14285714285714, 140, 158, 147.0, 158.0, 158.0, 158.0, 0.09262199640097385, 0.0719086788464592, 0.03292422528315868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0126ef27-9f33-42f7-bda7-73dd16ed4e04", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 145.88235294117646, 139, 164, 145.0, 158.4, 164.0, 164.0, 0.09273249946815185, 0.06891546103053081, 0.04654736789709965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 209.8823529411765, 137, 480, 143.0, 437.59999999999997, 480.0, 480.0, 0.09273300531305573, 0.03300630175319929, 0.05242866718124393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 239.76470588235293, 138, 1528, 142.0, 639.9999999999992, 1528.0, 1528.0, 0.09273300531305573, 4.9318371925491755, 0.05404808547255648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 269.70588235294116, 140, 1141, 143.0, 618.5999999999996, 1141.0, 1141.0, 0.09273351116347826, 1.627449681842233, 0.05413894036962487], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 35.714285714285715, 0.7955449482895783], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.2386634844868735], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.714285714285714, 0.2386634844868735], "isController": false}, {"data": ["401/Unauthorized", 12, 42.857142857142854, 0.954653937947494], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1257, 28, "401/Unauthorized", 12, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
