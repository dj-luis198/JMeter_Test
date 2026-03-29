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

    var data = {"OkPercent": 98.3399209486166, "KoPercent": 1.6600790513833992};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7387907608695652, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1efe417-0af6-438b-9b96-24956298be1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bcef94c5-a303-4e1e-b19b-2840eff9395d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b694cb62-3877-4286-a71b-c54811f9a1af"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c3a1e1e-2d60-4a5b-8b8b-f2795917e9a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1341f254-fd6b-4bda-95a0-ab4fc8fe3361"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=330fe3a2-09fe-4ae9-ab1e-129026c80579"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca3093f9-d7da-4029-bffe-9b319344589b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/47ccc9d8-dbcc-4fcb-b50a-3bbd02e80e6e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68fbe363-d3c6-4140-bc42-96b8bb8b744a"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47ccc9d8-dbcc-4fcb-b50a-3bbd02e80e6e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3339cb01-bbd0-48b3-b91a-3d059d8958eb"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f4f1c3e-ac25-4aa6-a70e-9128dc0f862c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5582a7a-8964-4fbc-8d10-d6a6b5dc4049"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b694cb62-3877-4286-a71b-c54811f9a1af"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e64f194d-6913-4a9f-8a01-e3be144ea713"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2802b36b-3459-49f2-b5f5-219af4372657"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1efe417-0af6-438b-9b96-24956298be1f"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1341f254-fd6b-4bda-95a0-ab4fc8fe3361"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3313a410-53ec-4074-b21b-668145d766a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/330fe3a2-09fe-4ae9-ab1e-129026c80579"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9515151515151515, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e64f194d-6913-4a9f-8a01-e3be144ea713"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c3a1e1e-2d60-4a5b-8b8b-f2795917e9a2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3339cb01-bbd0-48b3-b91a-3d059d8958eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2802b36b-3459-49f2-b5f5-219af4372657"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0f4f1c3e-ac25-4aa6-a70e-9128dc0f862c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/546b86af-6aaf-4ace-afde-7e028d36a42e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5582a7a-8964-4fbc-8d10-d6a6b5dc4049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 21, 1.6600790513833992, 464.6426877470349, 127, 2821, 151.0, 1265.0, 1594.4, 2143.1399999999985, 4.934274681124936, 712.5212210074794, 3.6048172258357063], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2270.218181818182, 1562, 3396, 2193.0, 2764.2, 2871.2, 3396.0, 0.24417856112233344, 293.8308537994739, 1.2006240773935049], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f1efe417-0af6-438b-9b96-24956298be1f", 3, 0, 0.0, 445.33333333333337, 225, 873, 238.0, 873.0, 873.0, 873.0, 0.024232633279483037, 0.024303627322294023, 0.015539807148626818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcef94c5-a303-4e1e-b19b-2840eff9395d", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b694cb62-3877-4286-a71b-c54811f9a1af", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 547.2307692307692, 135, 969, 482.0, 925.4, 969.0, 969.0, 0.08774238834781083, 0.01739424300254453, 0.058991464521702744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 547.2307692307692, 135, 969, 482.0, 925.4, 969.0, 969.0, 0.08870571537747694, 0.01758521506018342, 0.05963913406163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 160.95454545454547, 128, 398, 138.0, 321.89999999999986, 397.7, 398.0, 0.0990375352258506, 0.026500277980354554, 0.056482344308492916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c3a1e1e-2d60-4a5b-8b8b-f2795917e9a2", 3, 0, 0.0, 324.3333333333333, 229, 412, 332.0, 412.0, 412.0, 412.0, 0.04112969564025226, 0.034288134939676446, 0.02637548841513573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 153.27272727272725, 133, 405, 141.5, 161.1, 368.9999999999995, 405.0, 0.09903441445902451, 0.07359881777667739, 0.04971063382025254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 136.77272727272728, 132, 144, 134.0, 143.0, 143.85, 144.0, 0.09903842690964093, 0.02669395100298916, 0.05832047990870458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 185.86363636363635, 132, 418, 139.5, 410.9, 417.7, 418.0, 0.09903530608661988, 0.026693109843659264, 0.05822192799232927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1341f254-fd6b-4bda-95a0-ab4fc8fe3361", 3, 0, 0.0, 311.0, 262, 399, 272.0, 399.0, 399.0, 399.0, 0.018523092121511483, 0.02189366780377871, 0.011878415195109904], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 283.9230769230769, 133, 947, 229.0, 685.3999999999997, 947.0, 947.0, 0.08862588966758475, 0.1844885838775872, 0.05728193770281694], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=330fe3a2-09fe-4ae9-ab1e-129026c80579", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 136.82352941176467, 129, 143, 136.0, 142.2, 143.0, 143.0, 0.10039626998328698, 0.07461089986062636, 0.05039422145645459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca3093f9-d7da-4029-bffe-9b319344589b", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47ccc9d8-dbcc-4fcb-b50a-3bbd02e80e6e", 3, 0, 0.0, 1129.3333333333333, 232, 2611, 545.0, 2611.0, 2611.0, 2611.0, 0.01639415930751071, 0.022600672092222614, 0.010513181587173211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 969.5, 798, 1076, 1019.5, 1076.0, 1076.0, 1076.0, 0.03319355159937596, 9.76000629985948, 0.018930697396519102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 223.94117647058823, 131, 534, 142.0, 434.7999999999999, 534.0, 534.0, 0.10023939526162483, 0.03567803843296343, 0.056672571700649786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1333.8333333333335, 1185, 1571, 1257.0, 1571.0, 1571.0, 1571.0, 0.033169329426723425, 29.84582092362762, 0.01888449126540992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 311.6666666666667, 137, 400, 398.0, 400.0, 400.0, 400.0, 0.03331464011860012, 0.058951296772366615, 0.018446680612545185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 138.23076923076923, 133, 144, 137.0, 143.6, 144.0, 144.0, 0.06737392007380036, 0.050069876148595774, 0.03381854972454432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 175.92307692307693, 132, 400, 135.0, 398.4, 400.0, 400.0, 0.06728395381215355, 0.03355099800218414, 0.037503525937964195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 376.2307692307692, 128, 1571, 141.0, 1565.8, 1571.0, 1571.0, 0.06687724424598479, 9.273138803077382, 0.03843231058306668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 278.0769230769231, 133, 1058, 140.0, 948.8, 1058.0, 1058.0, 0.06714876033057851, 3.0528473657024793, 0.03865391754907025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 136.33333333333334, 133, 143, 135.5, 143.0, 143.0, 143.0, 0.0333628038100322, 0.024794036815854004, 0.018733996280047373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 981.9333333333334, 133, 1868, 1251.0, 1824.2, 1868.0, 1868.0, 0.07447384230412138, 40.215045740903015, 0.0399424162045151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 246.82352941176467, 132, 1454, 140.0, 629.1999999999992, 1454.0, 1454.0, 0.10039804873439401, 5.339488665724697, 0.05851554471847206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 619.1333333333333, 132, 1129, 798.0, 1088.2, 1129.0, 1129.0, 0.07447606091148769, 13.147090297879418, 0.04001633663427785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 228.88235294117644, 133, 753, 137.0, 578.5999999999998, 753.0, 753.0, 0.10039804873439401, 1.7619603789435763, 0.05861358968793924], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 534.2307692307693, 136, 1169, 445.0, 1147.4, 1169.0, 1169.0, 0.08851425419932049, 0.017547259377404353, 0.06005564482634184], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/68fbe363-d3c6-4140-bc42-96b8bb8b744a", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 557.0769230769231, 268, 1709, 283.0, 1702.2, 1709.0, 1709.0, 0.06682945636807608, 12.387832741614188, 0.147670407081352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47ccc9d8-dbcc-4fcb-b50a-3bbd02e80e6e", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3339cb01-bbd0-48b3-b91a-3d059d8958eb", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 0.20437111142533937, 0.7799243495475113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 574.1818181818182, 182, 1593, 379.0, 1064.1, 1514.2499999999989, 1593.0, 0.09982938250989218, 0.06132097812375213, 0.04513769931843758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 137.8666666666667, 128, 148, 137.0, 145.0, 148.0, 148.0, 0.07447569113441373, 0.05534765718094614, 0.03738330590145377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 265.0, 127, 424, 144.0, 424.0, 424.0, 424.0, 0.07447569113441373, 0.08704346401334605, 0.03872154097652526], "isController": false}, {"data": ["login", 22, 0, 0.0, 2674.818181818182, 1296, 5248, 2355.0, 4900.499999999999, 5236.599999999999, 5248.0, 0.09523479706330518, 31.20279688636324, 0.18675793966009835], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f4f1c3e-ac25-4aa6-a70e-9128dc0f862c", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 140.29411764705878, 134, 147, 138.0, 146.2, 147.0, 147.0, 0.09449694274596998, 0.07650191946914953, 0.033590710116731516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1121.9333333333334, 274, 2011, 1395.0, 1964.2, 2011.0, 2011.0, 0.0744243278242792, 53.46855936518529, 0.1559567603958382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5582a7a-8964-4fbc-8d10-d6a6b5dc4049", 3, 0, 0.0, 326.3333333333333, 228, 451, 300.0, 451.0, 451.0, 451.0, 0.034934497816593885, 0.02912345342066958, 0.022402656477438138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b694cb62-3877-4286-a71b-c54811f9a1af", 3, 0, 0.0, 566.0, 268, 1137, 293.0, 1137.0, 1137.0, 1137.0, 0.024044434114243122, 0.024114876792312192, 0.015419119532896793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e64f194d-6913-4a9f-8a01-e3be144ea713", 3, 0, 0.0, 675.6666666666666, 415, 947, 665.0, 947.0, 947.0, 947.0, 0.04967051889135402, 0.030898555208781747, 0.03185251374217689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 354.04545454545456, 269, 821, 284.5, 558.0, 781.9999999999994, 821.0, 0.0989720403985874, 0.15338733214117012, 0.2225904385136199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 937.8000000000002, 133, 1709, 1320.0, 1706.3, 1709.0, 1709.0, 0.05524007335881742, 39.65771179044126, 0.08937671244227413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2802b36b-3459-49f2-b5f5-219af4372657", 3, 0, 0.0, 512.6666666666666, 254, 952, 332.0, 952.0, 952.0, 952.0, 0.03997175329433866, 0.02486524106298216, 0.025632927731070045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1efe417-0af6-438b-9b96-24956298be1f", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1160.521739130435, 166, 2807, 1195.0, 1972.4000000000005, 2668.399999999998, 2807.0, 0.09335286978898193, 0.029267900412782037, 0.04211818929932583], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 162.66666666666666, 135, 406, 144.0, 259.0000000000001, 406.0, 406.0, 0.06961235201574166, 0.054044745949721314, 0.02474501575559567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 496.764705882353, 267, 1583, 533.0, 857.3999999999994, 1583.0, 1583.0, 0.100159076179815, 7.194629890119602, 0.22375266047546105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 654.2307692307693, 269, 1824, 533.0, 1810.4, 1824.0, 1824.0, 0.16181229773462782, 29.99431371748195, 0.35755023571695294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 231.5, 133, 515, 139.0, 515.0, 515.0, 515.0, 0.023160344857534928, 0.017211935973226643, 0.011625407477317337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 263.25, 128, 398, 263.5, 398.0, 398.0, 398.0, 0.02316088127153238, 0.0061973451839842505, 0.01320894010017081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 201.75, 134, 397, 138.0, 397.0, 397.0, 397.0, 0.023160344857534928, 0.0062424366998824615, 0.013615749613511745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 135.25, 131, 139, 135.5, 139.0, 139.0, 139.0, 0.0231602107579179, 0.006242400555845058, 0.013638288170922355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 140.5, 136, 145, 140.5, 145.0, 145.0, 145.0, 0.016486007501133413, 0.004862084243498331, 0.010191057371306104], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1592.1454545454546, 1020, 2821, 1447.0, 2184.4, 2279.1999999999994, 2821.0, 0.2386914500722584, 285.55795686086026, 0.4713223750450259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1160.521739130435, 166, 2807, 1195.0, 1972.4000000000005, 2668.399999999998, 2807.0, 0.09102962420596442, 0.028539518730334633, 0.04107000623355035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 187.36363636363637, 127, 454, 134.0, 443.80000000000007, 454.0, 454.0, 0.06179011582838076, 0.016654367156868254, 0.03638617172315781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 217.54545454545453, 128, 482, 140.0, 469.6, 482.0, 482.0, 0.06178907456817863, 0.016654086504704395, 0.03632521766605814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 250.39999999999995, 133, 1541, 136.0, 871.4000000000003, 1541.0, 1541.0, 0.07020795596557003, 4.229211168272088, 0.04087236603151869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 235.06666666666663, 127, 1066, 139.0, 680.8000000000002, 1066.0, 1066.0, 0.07020992768377449, 1.393932180135271, 0.04094207827236771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 156.4, 127, 419, 137.0, 254.0000000000001, 419.0, 419.0, 0.07020927043206784, 0.05217700663945667, 0.03524176269734656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 214.18181818181816, 131, 446, 136.0, 440.8, 446.0, 446.0, 0.061698273009249134, 0.01650910820755299, 0.0351872963255874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 209.19999999999996, 132, 421, 140.0, 410.2, 421.0, 421.0, 0.07020992768377449, 0.025816775492054574, 0.03964849692246483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 184.0, 128, 422, 135.0, 417.40000000000003, 422.0, 422.0, 0.0617862980458679, 0.045917356262603, 0.03101382538630479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 189.54545454545453, 136, 401, 145.0, 400.4, 401.0, 401.0, 0.06141545882930969, 0.04834068341447618, 0.02183127638073118], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 685.6153846153845, 133, 2561, 448.0, 1991.3999999999996, 2561.0, 2561.0, 0.08826724606192288, 0.017126975403992394, 0.06006708098519826], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1341f254-fd6b-4bda-95a0-ab4fc8fe3361", 1, 0, 0.0, 1169.0, 1169, 1169, 1169.0, 1169.0, 1169.0, 1169.0, 0.8554319931565441, 0.15454581907613343, 0.589780260906758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1363.9090909090912, 885, 2408, 1228.5, 2232.2, 2397.2, 2408.0, 0.09957229174681481, 0.05153644006426939, 0.04579936466088846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 428.27272727272725, 263, 842, 277.0, 834.2, 842.0, 842.0, 0.061648480364959006, 0.09554310384686517, 0.13864887722705135], "isController": false}, {"data": ["addBook", 55, 6, 10.909090909090908, 1373.345454545455, 684, 2888, 1100.0, 2394.6, 2647.6, 2888.0, 0.2892468537830859, 95.53264294546645, 1.0503122304745227], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3313a410-53ec-4074-b21b-668145d766a3", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/330fe3a2-09fe-4ae9-ab1e-129026c80579", 3, 0, 0.0, 307.6666666666667, 226, 448, 249.0, 448.0, 448.0, 448.0, 0.03445147509732542, 0.02872077725398776, 0.022092905579990586], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 250.090909090909, 128, 887, 142.0, 549.1999999999999, 575.1999999999999, 887.0, 0.23994625203954315, 0.1783194314473558, 0.11598964331989635], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 869.4000000000001, 636, 1265, 798.0, 1150.1999999999998, 1218.9999999999998, 1265.0, 0.24017991659206533, 70.6208702018603, 0.12079361039542348], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 220.4363636363636, 128, 422, 141.0, 418.4, 420.0, 422.0, 0.24048762144624883, 0.4255503613873075, 0.11695589402366398], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1340.4545454545453, 877, 1902, 1302.0, 1668.0, 1830.8, 1902.0, 0.23964723926380369, 215.63500714448332, 0.12029168064608896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 165.3076923076923, 136, 422, 144.0, 315.9999999999999, 422.0, 422.0, 0.15796252642834577, 0.11800911398211378, 0.05615074181632603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 6, 3.6363636363636362, 195.79999999999995, 129, 1138, 144.0, 334.80000000000007, 399.1999999999998, 835.0600000000015, 0.695586189452384, 1.5625247012141141, 0.3325771468319211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 147.25, 136, 153, 150.0, 153.0, 153.0, 153.0, 0.022769966414299538, 0.017633382193886264, 0.008094011498833039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 166.72727272727278, 129, 424, 142.5, 327.3999999999998, 420.84999999999997, 424.0, 0.0945756562260874, 0.07675036164441273, 0.03361869029911701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e64f194d-6913-4a9f-8a01-e3be144ea713", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 500.5, 270, 913, 409.5, 913.0, 913.0, 913.0, 0.023141987665320576, 0.03586556096178101, 0.052046872649641876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 498.3333333333333, 270, 1961, 286.0, 1122.2000000000005, 1961.0, 1961.0, 0.07016296518045916, 5.697442896116714, 0.15660136297406776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c3a1e1e-2d60-4a5b-8b8b-f2795917e9a2", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3339cb01-bbd0-48b3-b91a-3d059d8958eb", 3, 0, 0.0, 460.3333333333333, 227, 711, 443.0, 711.0, 711.0, 711.0, 0.020863324362103856, 0.02465974308554658, 0.013379150062937694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2802b36b-3459-49f2-b5f5-219af4372657", 1, 0, 0.0, 1115.0, 1115, 1115, 1115.0, 1115.0, 1115.0, 1115.0, 0.8968609865470852, 0.16203054932735425, 0.6183436098654709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f4f1c3e-ac25-4aa6-a70e-9128dc0f862c", 3, 0, 0.0, 1023.0, 225, 2561, 283.0, 2561.0, 2561.0, 2561.0, 0.019225223493223108, 0.022723563315069372, 0.012328675221891123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 160.53846153846155, 136, 389, 141.0, 295.79999999999995, 389.0, 389.0, 0.06474264797430214, 0.05367823059588137, 0.02301398814711522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/546b86af-6aaf-4ace-afde-7e028d36a42e", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 141.33333333333337, 136, 149, 142.0, 148.4, 149.0, 149.0, 0.07426330798479087, 0.05765559555459838, 0.02639828526021863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5582a7a-8964-4fbc-8d10-d6a6b5dc4049", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 136.53846153846155, 128, 152, 135.0, 148.0, 152.0, 152.0, 0.1620988054564952, 0.12046600678944613, 0.08136600195765481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 258.92307692307696, 132, 422, 140.0, 417.2, 422.0, 422.0, 0.16209678424918017, 0.08082921077569546, 0.09035142271100638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 451.7692307692307, 127, 1671, 143.0, 1664.6, 1671.0, 1671.0, 0.16208263720918634, 22.474233341333566, 0.09314394340822382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 340.46153846153845, 132, 791, 397.0, 790.2, 791.0, 791.0, 0.16209476309226933, 7.369466957605985, 0.09330920745012468], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 33.333333333333336, 0.5533596837944664], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15810276679841898], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.15810276679841898], "isController": false}, {"data": ["401/Unauthorized", 10, 47.61904761904762, 0.7905138339920948], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 21, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
