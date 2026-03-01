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

    var data = {"OkPercent": 98.07098765432099, "KoPercent": 1.9290123456790123};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8147291941875826, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4824561403508772, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79db5f78-4b2a-4ec3-a0da-83c0eec6aea9"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e45aef31-a6ee-4b4a-8f26-99f70df6fb50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f60feffe-bd00-4a9b-9ba9-c19b909b33f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/744ec308-7bac-4f96-84a0-536615ab44dd"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7305f344-2058-4c68-8b75-5cc5e0d8c23e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1f676b0-3b2f-40e9-9aca-42e11e9af1c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7306c16c-18d8-4dc1-9459-bb0b9490ab6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7da7c122-051d-4a78-a093-0adab1220a39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a1b3033-4dd0-48ff-8097-a294417c2efc"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d748a54-f998-4cd2-ae67-1c929717ff4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e45aef31-a6ee-4b4a-8f26-99f70df6fb50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0745ebff-d85b-49e3-9574-1a00cbeff49b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfe7541f-1608-4cc0-90e4-80b02387101e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f01f187c-a343-4a45-bc0a-1ac6f6ce5cf1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8d57d86-c587-47da-be06-36ce8449be28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab111a35-32e5-46a8-b149-27a785adc38e"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7305f344-2058-4c68-8b75-5cc5e0d8c23e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f60feffe-bd00-4a9b-9ba9-c19b909b33f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d748a54-f998-4cd2-ae67-1c929717ff4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=744ec308-7bac-4f96-84a0-536615ab44dd"], "isController": false}, {"data": [0.41509433962264153, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8596491228070176, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9447852760736196, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1f676b0-3b2f-40e9-9aca-42e11e9af1c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7306c16c-18d8-4dc1-9459-bb0b9490ab6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0745ebff-d85b-49e3-9574-1a00cbeff49b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dfe7541f-1608-4cc0-90e4-80b02387101e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a1b3033-4dd0-48ff-8097-a294417c2efc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab111a35-32e5-46a8-b149-27a785adc38e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79db5f78-4b2a-4ec3-a0da-83c0eec6aea9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f01f187c-a343-4a45-bc0a-1ac6f6ce5cf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4378853a-0f79-46c6-962e-eb0d11687d22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 25, 1.9290123456790123, 286.7584876543213, 81, 2662, 102.0, 717.3999999999996, 869.0999999999981, 1405.6199999999985, 5.065606641573153, 751.4410197061773, 3.7018208860023534], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1217.3157894736842, 987, 1825, 1171.0, 1433.0, 1490.599999999999, 1825.0, 0.24334743609995177, 292.83064966294245, 1.1965374421516182], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 506.5333333333334, 93, 1216, 455.0, 1069.6000000000001, 1216.0, 1216.0, 0.07870214909335124, 0.01541762803527955, 0.05299073085439053], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 506.5333333333334, 93, 1216, 455.0, 1069.6000000000001, 1216.0, 1216.0, 0.07815593672495362, 0.015310625885767282, 0.0526229620839499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 120.45, 82, 335, 83.0, 248.9, 330.69999999999993, 335.0, 0.12026892130804478, 0.041213246569329016, 0.06808583367409528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 110.44999999999999, 82, 249, 85.0, 246.9, 248.9, 249.0, 0.12025445843404643, 0.08936879186358335, 0.06036210120615222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 123.89999999999999, 81, 567, 84.0, 244.9, 550.8999999999997, 567.0, 0.12026964454306555, 1.7989590474343478, 0.07030606369480374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79db5f78-4b2a-4ec3-a0da-83c0eec6aea9", 3, 0, 0.0, 258.6666666666667, 172, 402, 202.0, 402.0, 402.0, 402.0, 0.022079279332322593, 0.022143964720991508, 0.014158912853084476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 164.65000000000003, 81, 732, 84.0, 249.0, 707.8499999999997, 732.0, 0.12027326084864813, 5.441901108693952, 0.07019072332339074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e45aef31-a6ee-4b4a-8f26-99f70df6fb50", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f60feffe-bd00-4a9b-9ba9-c19b909b33f7", 3, 0, 0.0, 286.0, 168, 416, 274.0, 416.0, 416.0, 416.0, 0.0637213254035684, 0.02883224033559898, 0.04086295932455395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/744ec308-7bac-4f96-84a0-536615ab44dd", 3, 0, 0.0, 344.0, 196, 492, 344.0, 492.0, 492.0, 492.0, 0.029167557897602427, 0.024030953463161375, 0.018704456073657807], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 385.00000000000006, 84, 2290, 184.0, 1535.2000000000005, 2290.0, 2290.0, 0.07799054754563747, 0.13604171486915786, 0.05040951536673755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7305f344-2058-4c68-8b75-5cc5e0d8c23e", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 94.33333333333331, 82, 249, 83.0, 120.30000000000021, 249.0, 249.0, 0.08082513482081517, 0.06006633554554721, 0.04057042900185449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 120.16666666666669, 81, 256, 84.0, 248.8, 256.0, 256.0, 0.08082840130403154, 0.03511685317071857, 0.045343189533620126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 488.0, 404, 570, 488.5, 570.0, 570.0, 570.0, 0.07762317828103472, 22.82379174671557, 0.04426946886340261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 653.0, 570, 736, 654.5, 736.0, 736.0, 736.0, 0.07749910391661097, 69.73382993306015, 0.04412302498377362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 167.25, 82, 263, 167.0, 263.0, 263.0, 263.0, 0.07786721692833296, 0.1377884737052142, 0.04311592968590311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 95.79999999999998, 82, 247, 84.0, 154.00000000000006, 247.0, 247.0, 0.06621025729305983, 0.04920508378908061, 0.03323444555530543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 104.93333333333332, 81, 248, 83.0, 246.2, 248.0, 248.0, 0.06621054954756124, 0.017716494703156036, 0.03776070403884352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 93.33333333333331, 81, 245, 82.0, 149.00000000000006, 245.0, 245.0, 0.0662108418046427, 0.017845890955157602, 0.03892473317030753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 127.66666666666667, 81, 251, 84.0, 249.8, 251.0, 251.0, 0.0662108418046427, 0.017845890955157602, 0.03898939219550737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1f676b0-3b2f-40e9-9aca-42e11e9af1c2", 3, 0, 0.0, 316.6666666666667, 178, 536, 236.0, 536.0, 536.0, 536.0, 0.030365294492747757, 0.02531429661325749, 0.019472535856351916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 84.25, 82, 88, 83.5, 88.0, 88.0, 88.0, 0.07787100667743882, 0.05787093367337007, 0.043726395351100907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 164.8888888888889, 82, 735, 83.5, 581.1000000000003, 735.0, 735.0, 0.08082767539605562, 8.100352119593527, 0.046746040566512194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 556.8571428571428, 84, 867, 724.5, 843.5, 867.0, 867.0, 0.08139676854828863, 52.321236435083165, 0.04285594370832049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 128.44444444444446, 81, 570, 84.0, 420.60000000000025, 570.0, 570.0, 0.08082767539605562, 2.660033885880303, 0.04682497384326616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 394.0, 82, 654, 410.0, 623.0, 654.0, 654.0, 0.08147398070230571, 17.11774245056275, 0.042976160858735755], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 445.46666666666664, 85, 1010, 415.0, 840.2, 1010.0, 1010.0, 0.07861758832686049, 0.015401062713250209, 0.05345586539620644], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7306c16c-18d8-4dc1-9459-bb0b9490ab6c", 3, 0, 0.0, 290.3333333333333, 202, 371, 298.0, 371.0, 371.0, 371.0, 0.01973346664386355, 0.02332428951297804, 0.012654599377738017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7da7c122-051d-4a78-a093-0adab1220a39", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 224.66666666666666, 166, 499, 172.0, 398.80000000000007, 499.0, 499.0, 0.06618571712224501, 0.10257493464160435, 0.1488532290356741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a1b3033-4dd0-48ff-8097-a294417c2efc", 1, 0, 0.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 0.1788753094059406, 0.6826268564356436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 533.2083333333334, 111, 1977, 431.0, 925.0, 1762.0, 1977.0, 0.10146704434955398, 0.062326924702997506, 0.04587816556039403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 86.28571428571428, 82, 95, 85.0, 92.0, 95.0, 95.0, 0.08146686917002718, 0.0605432494515534, 0.0408925495638613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 173.2142857142857, 83, 337, 164.0, 297.5, 337.0, 337.0, 0.08139724179632085, 0.10910500825600594, 0.04153893840554431], "isController": false}, {"data": ["login", 24, 0, 0.0, 2427.0833333333335, 1631, 4913, 2213.0, 3650.5, 4796.75, 4913.0, 0.09792920534530246, 39.18414643476487, 0.2018833520350913], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d748a54-f998-4cd2-ae67-1c929717ff4c", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 97.77777777777777, 85, 252, 89.0, 110.70000000000022, 252.0, 252.0, 0.0810679349294709, 0.06563019341458141, 0.028817117494460358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e45aef31-a6ee-4b4a-8f26-99f70df6fb50", 3, 0, 0.0, 1650.3333333333335, 525, 2290, 2136.0, 2290.0, 2290.0, 2290.0, 0.08191797280323303, 0.03706574941292119, 0.05253203334061493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0745ebff-d85b-49e3-9574-1a00cbeff49b", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfe7541f-1608-4cc0-90e4-80b02387101e", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f01f187c-a343-4a45-bc0a-1ac6f6ce5cf1", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.2485062757909216, 0.9483536795048143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 644.5714285714286, 170, 955, 810.5, 932.5, 955.0, 955.0, 0.08135088963008588, 69.55312667059863, 0.16809263759921902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8d57d86-c587-47da-be06-36ce8449be28", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.858429939516129, 1.6039776545698925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab111a35-32e5-46a8-b149-27a785adc38e", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 297.45000000000005, 166, 815, 185.0, 497.8, 799.1499999999997, 815.0, 0.12019086309058785, 7.366461612916312, 0.2687744701085324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 520.25, 83, 819, 658.0, 818.7, 819.0, 819.0, 0.11615188795214543, 92.64905251517234, 0.2002599200971804], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 897.2916666666667, 151, 2093, 890.0, 1678.0, 2044.25, 2093.0, 0.09796958044527175, 0.03061549388914742, 0.04420111930245659], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 270.3333333333334, 166, 826, 169.5, 670.3000000000003, 826.0, 826.0, 0.08079502302658156, 10.85118538642464, 0.1794129932985017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 86.54545454545455, 84, 96, 85.0, 94.60000000000001, 96.0, 96.0, 0.09550020402316314, 0.07414322480313935, 0.03394733814885877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 251.2941176470588, 168, 732, 172.0, 539.1999999999998, 732.0, 732.0, 0.09054690329590728, 6.50416798714234, 0.20227932687698405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7305f344-2058-4c68-8b75-5cc5e0d8c23e", 3, 0, 0.0, 592.6666666666666, 210, 1032, 536.0, 1032.0, 1032.0, 1032.0, 0.04749916876454662, 0.030104453640811286, 0.03046007892778543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 83.85714285714285, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.03525773403580171, 0.02620228086059092, 0.01769772977968953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 107.0, 82, 244, 84.0, 244.0, 244.0, 244.0, 0.035229343023080256, 0.009426601551097645, 0.020091734692850454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 106.57142857142856, 82, 244, 84.0, 244.0, 244.0, 244.0, 0.035229343023080256, 0.009495408861689598, 0.02071100048817804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 84.57142857142858, 82, 89, 84.0, 89.0, 89.0, 89.0, 0.035257911623526095, 0.009503108992278518, 0.02076222725486937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.5, 85, 90, 87.5, 90.0, 90.0, 90.0, 0.035921475654219874, 0.010594028952709377, 0.022205365321407402], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 784.7192982456143, 646, 1306, 664.0, 1071.4, 1083.6999999999998, 1306.0, 0.24418036789842096, 292.1246108375387, 0.4821608436431711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 897.2916666666667, 151, 2093, 890.0, 1678.0, 2044.25, 2093.0, 0.0981217854894233, 0.03066305796544478, 0.0442697899376109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 126.62499999999999, 81, 248, 86.0, 248.0, 248.0, 248.0, 0.03989607073573341, 0.010753237815490648, 0.023493486966452395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 106.25, 81, 243, 85.5, 243.0, 243.0, 243.0, 0.03989567281558724, 0.010753130563576248, 0.023454292026351093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 187.1818181818182, 82, 734, 84.0, 637.0000000000003, 734.0, 734.0, 0.10165888822143154, 8.340622617369807, 0.0589700972690726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 142.0, 82, 403, 84.0, 372.2000000000001, 403.0, 403.0, 0.10150972647742793, 2.7382573144679045, 0.05898270239655236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 126.12500000000001, 82, 247, 86.0, 247.0, 247.0, 247.0, 0.039895871774668114, 0.010675262564706118, 0.022753114371490413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f60feffe-bd00-4a9b-9ba9-c19b909b33f7", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 99.81818181818181, 82, 246, 84.0, 216.4000000000001, 246.0, 246.0, 0.10165888822143154, 0.07554923235987246, 0.05102799662677326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 104.875, 82, 247, 84.5, 247.0, 247.0, 247.0, 0.039896468663817394, 0.02964962173160648, 0.020026157122267716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 126.63636363636364, 81, 244, 85.0, 244.0, 244.0, 244.0, 0.10165794872742731, 0.04108194092749016, 0.057200646221096794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 89.75, 85, 102, 88.5, 102.0, 102.0, 102.0, 0.040953604685092376, 0.03223496618768013, 0.014557726665403932], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 458.6, 83, 770, 440.0, 748.4, 770.0, 770.0, 0.07914022064293515, 0.015214913512928873, 0.053857599373737054], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1385.0416666666665, 881, 2662, 1275.5, 2308.0, 2605.0, 2662.0, 0.09826520961197525, 0.05085992294369813, 0.04519815793675815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 253.625, 168, 496, 180.0, 496.0, 496.0, 496.0, 0.03987896733414088, 0.06180461050711092, 0.08968873219777974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d748a54-f998-4cd2-ae67-1c929717ff4c", 3, 0, 0.0, 386.0, 183, 734, 241.0, 734.0, 734.0, 734.0, 0.03323841918078376, 0.027709502448563544, 0.021315001883510418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=744ec308-7bac-4f96-84a0-536615ab44dd", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["addBook", 53, 9, 16.9811320754717, 805.0, 426, 1445, 694.0, 1333.6, 1419.3, 1445.0, 0.252343701644043, 86.46246900755126, 0.9149272532983226], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 149.85964912280704, 82, 428, 85.0, 336.0, 344.99999999999983, 428.0, 0.24478332381398185, 0.18191416935785173, 0.11832787625773536], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 458.5789473684211, 403, 660, 413.0, 575.0, 587.2999999999996, 660.0, 0.24484010223148128, 71.9911195125749, 0.12313735610274693], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 131.82456140350882, 82, 337, 86.0, 249.0, 262.09999999999957, 337.0, 0.24518027202105971, 0.4338541532247658, 0.11923806197899192], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 631.6842105263156, 560, 841, 575.0, 736.4, 739.1, 841.0, 0.2446677454940357, 220.1524674755547, 0.12281173943743588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 99.17647058823529, 83, 272, 88.0, 132.79999999999987, 272.0, 272.0, 0.08942332475921454, 0.0668055111726554, 0.03178719747300204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 9, 5.521472392638037, 134.1411042944786, 84, 423, 89.0, 251.79999999999998, 300.79999999999995, 417.8799999999999, 0.6802749479360124, 1.5820411130737992, 0.32228612552116154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 172.42857142857142, 84, 505, 92.0, 505.0, 505.0, 505.0, 0.037775966929839234, 0.029254240015002455, 0.013428175744591292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1f676b0-3b2f-40e9-9aca-42e11e9af1c2", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7306c16c-18d8-4dc1-9459-bb0b9490ab6c", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 104.59999999999998, 84, 255, 87.0, 234.8000000000003, 254.7, 255.0, 0.1264846131468107, 0.10264522805175749, 0.04496132732953036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0745ebff-d85b-49e3-9574-1a00cbeff49b", 3, 0, 0.0, 284.0, 186, 440, 226.0, 440.0, 440.0, 440.0, 0.029242331198643157, 0.024378128320223024, 0.018752406400171555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 192.57142857142856, 168, 329, 169.0, 329.0, 329.0, 329.0, 0.035214278887027564, 0.0545752544860476, 0.0791977385515864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 302.0, 165, 817, 172.0, 751.4000000000002, 817.0, 817.0, 0.10143110061965181, 11.174440313560417, 0.22576164094773532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfe7541f-1608-4cc0-90e4-80b02387101e", 3, 0, 0.0, 406.66666666666663, 187, 770, 263.0, 770.0, 770.0, 770.0, 0.028011727576612074, 0.023352224714747242, 0.0179632497805748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a1b3033-4dd0-48ff-8097-a294417c2efc", 3, 0, 0.0, 482.0, 160, 917, 369.0, 917.0, 917.0, 917.0, 0.021222711130604564, 0.02508452607917486, 0.013609616187269203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab111a35-32e5-46a8-b149-27a785adc38e", 3, 0, 0.0, 330.0, 256, 437, 297.0, 437.0, 437.0, 437.0, 0.04499100179964007, 0.02892487908668266, 0.02885165154469106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79db5f78-4b2a-4ec3-a0da-83c0eec6aea9", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 93.60000000000001, 84, 144, 88.0, 131.4, 144.0, 144.0, 0.06579841996060869, 0.05455357279937185, 0.023389282095372617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 104.21428571428571, 85, 251, 90.5, 185.0, 251.0, 251.0, 0.07954274286103882, 0.06175437556106042, 0.028274959376384894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f01f187c-a343-4a45-bc0a-1ac6f6ce5cf1", 3, 0, 0.0, 344.66666666666663, 169, 681, 184.0, 681.0, 681.0, 681.0, 0.025355183867341678, 0.02542946663257803, 0.016259671946179395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4378853a-0f79-46c6-962e-eb0d11687d22", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 1.9121912425149699, 3.5729322604790417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 94.29411764705883, 83, 244, 84.0, 121.5999999999999, 244.0, 244.0, 0.09066666666666667, 0.06738020833333333, 0.045510416666666664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 112.41176470588236, 82, 246, 84.0, 245.2, 246.0, 246.0, 0.09058888101416916, 0.03224314721758916, 0.05121643881786839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 131.2941176470588, 81, 577, 84.0, 312.9999999999998, 577.0, 577.0, 0.09066666666666667, 4.821942708333333, 0.05284375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 146.05882352941174, 81, 646, 84.0, 326.7999999999997, 646.0, 646.0, 0.09058791557206268, 1.5897950215279517, 0.05288631582943894], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 32.0, 0.6172839506172839], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15432098765432098], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15432098765432098], "isController": false}, {"data": ["401/Unauthorized", 13, 52.0, 1.0030864197530864], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 25, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
