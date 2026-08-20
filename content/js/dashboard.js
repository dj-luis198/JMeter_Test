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

    var data = {"OkPercent": 96.28787878787878, "KoPercent": 3.712121212121212};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7411233053582956, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87a33ec6-05a2-46b4-92bb-85de84a585a1"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "see books"], "isController": true}, {"data": [0.3235294117647059, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3235294117647059, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5745d54-8a40-4937-9913-ca71ef82dc01"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a408aced-ef6a-4712-97ed-76c31fc6fc80"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe973887-d93a-4e4f-a09a-723bea446e3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/654e1526-8772-48b3-8609-1699873bc3cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ab3e88d-ac68-4e59-8bd4-327713dc7a0c"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1aa5ebe8-b7cd-4513-a640-04cb3ca6b4c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=654e1526-8772-48b3-8609-1699873bc3cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6a15f382-0437-4bea-a610-172ccd0c9e85"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8248441-0d54-4746-affd-9589711b1a0e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/428202b6-e7c9-4343-ab39-d4a0d94441ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88598204-2bdf-4bff-8117-d05adc9bb9b2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87a33ec6-05a2-46b4-92bb-85de84a585a1"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c708322-655a-4e3d-9172-a4c258b3bad1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a408aced-ef6a-4712-97ed-76c31fc6fc80"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a15f382-0437-4bea-a610-172ccd0c9e85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5745d54-8a40-4937-9913-ca71ef82dc01"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b001d6f-703a-451b-b300-7078f2877f57"], "isController": false}, {"data": [0.21551724137931033, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ab3e88d-ac68-4e59-8bd4-327713dc7a0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fe973887-d93a-4e4f-a09a-723bea446e3b"], "isController": false}, {"data": [0.5636363636363636, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8654970760233918, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8248441-0d54-4746-affd-9589711b1a0e"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b846175a-6b3e-42a3-8a79-db70cbe78f10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7decad7-a3ed-42e8-bad2-343f31589eea"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d86784cc-4e04-4f60-8b8a-2ab3dfc4f0e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=428202b6-e7c9-4343-ab39-d4a0d94441ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1aa5ebe8-b7cd-4513-a640-04cb3ca6b4c8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/88598204-2bdf-4bff-8117-d05adc9bb9b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 49, 3.712121212121212, 377.2818181818181, 89, 3640, 115.0, 1043.9, 1308.8000000000002, 1960.359999999997, 5.190046120637118, 727.7392913522823, 3.7875802220907238], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87a33ec6-05a2-46b4-92bb-85de84a585a1", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 0.18799590270551508, 0.7174330124869928], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1699.1636363636364, 1124, 2307, 1691.0, 2101.2, 2230.0, 2307.0, 0.23803856224708403, 286.44150608080326, 1.1704337508926446], "isController": true}, {"data": ["deleteBook", 17, 6, 35.294117647058826, 644.1176470588235, 102, 3053, 559.0, 1578.5999999999988, 3053.0, 3053.0, 0.08281371784879189, 0.018301032431313327, 0.05488882562840998], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 6, 35.294117647058826, 644.1176470588235, 102, 3053, 559.0, 1578.5999999999988, 3053.0, 3053.0, 0.08036229212165906, 0.017759291003677756, 0.05326402381087444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 166.05263157894737, 97, 315, 104.0, 310.0, 315.0, 315.0, 0.11009833519727882, 0.0555697806145805, 0.06133047681271114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 133.6315789473684, 96, 307, 104.0, 297.0, 307.0, 307.0, 0.11010024917424814, 0.08182254845859652, 0.055265164136292524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 269.15789473684214, 94, 895, 104.0, 809.0, 895.0, 895.0, 0.11010471537931076, 5.136744895342571, 0.06334303450044332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5745d54-8a40-4937-9913-ca71ef82dc01", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 272.0, 94, 1122, 102.0, 1089.0, 1122.0, 1122.0, 0.10997661549859925, 15.649775262424463, 0.06316193984279132], "isController": false}, {"data": ["goToProfile", 17, 6, 35.294117647058826, 196.76470588235296, 96, 346, 210.0, 317.2, 346.0, 346.0, 0.08270493797129652, 0.1081796551933836, 0.053438944295791775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a408aced-ef6a-4712-97ed-76c31fc6fc80", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe973887-d93a-4e4f-a09a-723bea446e3b", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.2831725117554859, 1.0806475313479624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/654e1526-8772-48b3-8609-1699873bc3cb", 3, 0, 0.0, 368.6666666666667, 203, 490, 413.0, 490.0, 490.0, 490.0, 0.0354739916517873, 0.0295732072331469, 0.022748620948574536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 102.36842105263156, 93, 110, 103.0, 105.0, 110.0, 110.0, 0.11161501045656415, 0.08294826460688018, 0.056025503295580044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 123.8421052631579, 94, 296, 102.0, 288.0, 296.0, 296.0, 0.11161501045656415, 0.038688920154146204, 0.06316207160396645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 739.0, 589, 817, 777.0, 817.0, 817.0, 817.0, 0.05222886689473272, 15.357021028647534, 0.029786775650902254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1010.5, 861, 1225, 985.5, 1225.0, 1225.0, 1225.0, 0.0521464794608054, 46.92149388256613, 0.029688864771142142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 226.375, 98, 333, 286.0, 333.0, 333.0, 333.0, 0.05233581274246201, 0.09260985614193472, 0.028978911938453082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 132.07692307692307, 92, 307, 101.0, 307.0, 307.0, 307.0, 0.06913937434184635, 0.05138189831459479, 0.03470472501143459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 196.46153846153845, 99, 317, 116.0, 315.4, 317.0, 317.0, 0.0690585722937008, 0.026457235479107125, 0.03893882539336825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 193.46153846153845, 90, 914, 102.0, 671.1999999999998, 914.0, 914.0, 0.06906040660642473, 4.797234039409586, 0.04014343647239443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 172.69230769230768, 94, 816, 104.0, 611.5999999999998, 816.0, 816.0, 0.06913790352603308, 1.580958241371058, 0.04025600136946232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 127.24999999999999, 99, 298, 103.5, 298.0, 298.0, 298.0, 0.05240575153123055, 0.038946071206314894, 0.029427057744587468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 666.8666666666667, 95, 1648, 825.0, 1442.2, 1648.0, 1648.0, 0.11976908520372721, 57.49156251746633, 0.06492170595092661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 163.36842105263156, 93, 754, 100.0, 414.0, 754.0, 754.0, 0.11161435478091276, 5.314331402478426, 0.06511219812722861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ab3e88d-ac68-4e59-8bd4-327713dc7a0c", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 470.66666666666674, 92, 910, 603.0, 884.8000000000001, 910.0, 910.0, 0.11977004152028106, 18.797128263733633, 0.06503918726045992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 132.10526315789474, 93, 519, 102.0, 282.0, 519.0, 519.0, 0.11161697752974005, 1.7558217983551183, 0.06522272910853283], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 395.5625, 110, 961, 445.0, 734.9000000000002, 961.0, 961.0, 0.08348726297444245, 0.01806410810817862, 0.05570063913413273], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 377.38461538461536, 195, 1221, 217.0, 977.7999999999997, 1221.0, 1221.0, 0.06902447183005113, 6.450842961362224, 0.1538791504282172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 667.7916666666665, 122, 1130, 726.5, 1100.0, 1129.0, 1130.0, 0.10733164584134594, 0.06592930198652988, 0.04852983596146794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1aa5ebe8-b7cd-4513-a640-04cb3ca6b4c8", 3, 0, 0.0, 407.33333333333337, 210, 683, 329.0, 683.0, 683.0, 683.0, 0.1169773064025579, 0.05292918486313655, 0.07501474401466116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 115.86666666666667, 93, 302, 103.0, 189.80000000000007, 302.0, 302.0, 0.11976717261643366, 0.08900665855576759, 0.0601175065672333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=654e1526-8772-48b3-8609-1699873bc3cb", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 177.53333333333333, 96, 306, 104.0, 302.4, 306.0, 306.0, 0.11976717261643366, 0.12798557104987904, 0.0629401443593654], "isController": false}, {"data": ["login", 24, 0, 0.0, 3238.6666666666665, 1905, 5133, 3160.5, 4283.5, 4954.25, 5133.0, 0.10604453870625662, 42.431312687787205, 0.21861330196182396], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 128.31578947368422, 100, 307, 106.0, 297.0, 307.0, 307.0, 0.10808904261552728, 0.08750568000807823, 0.03842227686723821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a15f382-0437-4bea-a610-172ccd0c9e85", 3, 0, 0.0, 981.6666666666666, 201, 2265, 479.0, 2265.0, 2265.0, 2265.0, 0.03550674036287889, 0.029600508486110948, 0.022769621912393036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 784.2, 203, 1751, 919.0, 1546.4, 1751.0, 1751.0, 0.11966780218114513, 76.44083929262368, 0.25280602298020693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8248441-0d54-4746-affd-9589711b1a0e", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/428202b6-e7c9-4343-ab39-d4a0d94441ec", 3, 0, 0.0, 442.3333333333333, 230, 564, 533.0, 564.0, 564.0, 564.0, 0.07230657989877079, 0.03356418715353097, 0.04636847734393829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88598204-2bdf-4bff-8117-d05adc9bb9b2", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87a33ec6-05a2-46b4-92bb-85de84a585a1", 3, 0, 0.0, 341.3333333333333, 223, 512, 289.0, 512.0, 512.0, 512.0, 0.023742441989300072, 0.028480110263857675, 0.01522545921839881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 483.31578947368416, 199, 1397, 409.0, 1225.0, 1397.0, 1397.0, 0.10990918030890265, 20.90495657864291, 0.24274811816683056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 11, 57.89473684210526, 538.5263157894736, 96, 1406, 106.0, 1327.0, 1406.0, 1406.0, 0.10762006717757877, 54.22762555792509, 0.14336435552572402], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 1074.6153846153848, 130, 2220, 1131.5, 1855.3000000000002, 2178.35, 2220.0, 0.1059611285675278, 0.032921816988829254, 0.04780668105292758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 110.71428571428571, 100, 140, 107.0, 130.5, 140.0, 140.0, 0.06695873428861127, 0.05198456421820895, 0.02380173757915479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 279.05263157894734, 192, 860, 208.0, 519.0, 860.0, 860.0, 0.1115462065483494, 7.187357356619093, 0.249367920118239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 390.08333333333337, 197, 1222, 307.5, 1042.3000000000006, 1222.0, 1222.0, 0.0852000426000213, 8.615112413024956, 0.1898002902126451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 117.33333333333334, 94, 306, 99.5, 246.3000000000002, 306.0, 306.0, 0.05543314070316939, 0.041195918042101466, 0.02782483820452057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c708322-655a-4e3d-9172-a4c258b3bad1", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 118.83333333333333, 95, 309, 102.5, 249.00000000000023, 309.0, 309.0, 0.05543109222347969, 0.014832147723860774, 0.031613044783703255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 119.08333333333333, 97, 300, 102.5, 242.70000000000022, 300.0, 300.0, 0.055431604329208295, 0.014940549604356923, 0.03258772051385097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 101.0, 93, 109, 102.0, 108.10000000000001, 109.0, 109.0, 0.05543288463492826, 0.014940894686758008, 0.03264260686998217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 138.0, 110, 190, 132.0, 190.0, 190.0, 190.0, 0.059047214152436286, 0.017414315111363047, 0.036500865779777514], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1182.5272727272732, 728, 1871, 1124.0, 1651.1999999999998, 1792.1999999999998, 1871.0, 0.2428910214229881, 290.58210420356033, 0.4796148880051581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a408aced-ef6a-4712-97ed-76c31fc6fc80", 3, 0, 0.0, 601.6666666666666, 310, 1071, 424.0, 1071.0, 1071.0, 1071.0, 0.033943179118156204, 0.028297031810416033, 0.02176694754647387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 1074.6153846153848, 130, 2220, 1131.5, 1855.3000000000002, 2178.35, 2220.0, 0.10408201662910373, 0.0323379823300761, 0.04695887859633391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 143.88888888888889, 94, 303, 103.0, 303.0, 303.0, 303.0, 0.049927051030993604, 0.013456900473197494, 0.02940040212079018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 153.44444444444446, 95, 381, 102.0, 381.0, 381.0, 381.0, 0.049927051030993604, 0.013456900473197494, 0.029351645235017723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a15f382-0437-4bea-a610-172ccd0c9e85", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 143.0, 93, 306, 101.0, 301.5, 306.0, 306.0, 0.06781335826281551, 0.01827781921927449, 0.03986683757247553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 156.35714285714283, 96, 302, 101.5, 300.0, 302.0, 302.0, 0.06781302978929522, 0.018277730685395982, 0.039932868127876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 116.99999999999999, 97, 294, 103.5, 202.5, 294.0, 294.0, 0.06781138746942433, 0.05039498619553898, 0.03403813785086338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 100.77777777777777, 94, 104, 102.0, 104.0, 104.0, 104.0, 0.049926774064705096, 0.013359312591532418, 0.028473863333777126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 101.42857142857144, 98, 106, 101.0, 105.0, 106.0, 106.0, 0.06781368673951793, 0.018145459147097573, 0.038674993218631326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 126.0, 96, 308, 104.0, 308.0, 308.0, 308.0, 0.04992566623027936, 0.03710296093871347, 0.025060344181995695], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 474.37499999999994, 100, 1978, 479.0, 1071.500000000001, 1978.0, 1978.0, 0.084277504753778, 0.017514947734778692, 0.05733894930971457], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 130.88888888888886, 100, 309, 105.0, 309.0, 309.0, 309.0, 0.05038629492777964, 0.039659525109170306, 0.01791075327510917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5745d54-8a40-4937-9913-ca71ef82dc01", 3, 0, 0.0, 323.6666666666667, 236, 479, 256.0, 479.0, 479.0, 479.0, 0.07272198385571958, 0.0329048038930502, 0.046634865949143095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1818.3750000000002, 1233, 3640, 1588.0, 2664.0, 3462.0, 3640.0, 0.10795590001484394, 0.0558756123123704, 0.04965549697948388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 281.6666666666667, 200, 603, 209.0, 603.0, 603.0, 603.0, 0.049897709695125, 0.07733170438101891, 0.11222111858190709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b001d6f-703a-451b-b300-7078f2877f57", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.8725025614754098, 1.6302723702185793], "isController": false}, {"data": ["addBook", 58, 17, 29.310344827586206, 1090.1206896551726, 510, 2943, 854.5, 1863.3000000000004, 2515.999999999999, 2943.0, 0.2740088438716505, 80.25748194730527, 0.9951828477550172], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9ab3e88d-ac68-4e59-8bd4-327713dc7a0c", 3, 0, 0.0, 338.3333333333333, 225, 527, 263.0, 527.0, 527.0, 527.0, 0.021518024932218223, 0.025433576995079542, 0.013798993853017544], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 186.00000000000003, 95, 429, 105.0, 400.8, 419.79999999999995, 429.0, 0.24385053292425557, 0.18122095269077979, 0.11787696659912746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe973887-d93a-4e4f-a09a-723bea446e3b", 3, 0, 0.0, 891.6666666666666, 283, 1978, 414.0, 1978.0, 1978.0, 1978.0, 0.045466945530599254, 0.029230865046527842, 0.029156862856536632], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 654.5454545454543, 465, 990, 603.0, 849.0, 914.8, 990.0, 0.2437889231178387, 71.68203795073248, 0.12260868691961616], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 130.10909090909092, 92, 306, 102.0, 284.4, 302.59999999999997, 306.0, 0.24421325589552997, 0.4321429879713871, 0.1187677748398183], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 993.4545454545455, 620, 1507, 1008.0, 1268.6, 1370.1999999999996, 1507.0, 0.24336067822408652, 218.97636604847523, 0.12215565293669967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 108.25, 103, 126, 106.5, 123.30000000000001, 126.0, 126.0, 0.08281230590865803, 0.061866615254026744, 0.02943718686596828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 17, 9.941520467836257, 193.16374269005834, 92, 2174, 108.0, 374.0000000000003, 540.6, 1956.5600000000004, 0.6977484351665211, 1.5552421475248293, 0.33360459493867156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 110.16666666666667, 103, 122, 108.5, 120.2, 122.0, 122.0, 0.0559570995570063, 0.0433339647936582, 0.01989100023315458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 122.0, 98, 309, 108.0, 154.0, 309.0, 309.0, 0.10497527556009835, 0.08518989647504074, 0.03731542998425371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8248441-0d54-4746-affd-9589711b1a0e", 3, 0, 0.0, 624.6666666666666, 346, 1104, 424.0, 1104.0, 1104.0, 1104.0, 0.027718491005349667, 0.027799697521966905, 0.01777520419288374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 239.41666666666666, 195, 615, 206.5, 494.70000000000044, 615.0, 615.0, 0.05540652227111335, 0.08586928793384462, 0.12461056717809965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b846175a-6b3e-42a3-8a79-db70cbe78f10", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7decad7-a3ed-42e8-bad2-343f31589eea", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 290.2857142857143, 202, 591, 209.5, 502.5, 591.0, 591.0, 0.067777901499344, 0.10504250945259662, 0.15243408901659108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 122.07692307692307, 105, 302, 106.0, 225.99999999999994, 302.0, 302.0, 0.07018604701385364, 0.05819136124488451, 0.024948946399455788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d86784cc-4e04-4f60-8b8a-2ab3dfc4f0e7", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 107.46666666666665, 98, 120, 107.0, 118.2, 120.0, 120.0, 0.1194695551750229, 0.0927522425431086, 0.04246769344112142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=428202b6-e7c9-4343-ab39-d4a0d94441ec", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5846733414239482, 2.2312398867313914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1aa5ebe8-b7cd-4513-a640-04cb3ca6b4c8", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88598204-2bdf-4bff-8117-d05adc9bb9b2", 3, 0, 0.0, 508.0, 227, 748, 549.0, 748.0, 748.0, 748.0, 0.03780718336483932, 0.03073064350976686, 0.024244840894770008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 135.58333333333331, 94, 308, 102.5, 307.7, 308.0, 308.0, 0.08526360665056132, 0.06336484830183316, 0.042798333807020035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 183.58333333333334, 89, 315, 105.0, 312.6, 315.0, 315.0, 0.08525936609661307, 0.03348483893084755, 0.04802777767909795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 217.5, 96, 914, 103.0, 729.5000000000007, 914.0, 914.0, 0.08526300083131425, 6.414382458292182, 0.049514711420268434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 194.5, 94, 814, 103.0, 662.8000000000005, 814.0, 814.0, 0.0852575488454707, 2.1101104573712255, 0.04959480461811723], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 20.408163265306122, 0.7575757575757576], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 12.244897959183673, 0.45454545454545453], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.204081632653061, 0.3787878787878788], "isController": false}, {"data": ["401/Unauthorized", 28, 57.142857142857146, 2.121212121212121], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 49, "401/Unauthorized", 28, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
