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

    var data = {"OkPercent": 98.82260596546311, "KoPercent": 1.1773940345368916};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7708613728129206, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.009433962264150943, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de2e086c-d563-4252-9438-11e762c457f6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b13d592-cc1a-4222-ab6c-9457a1548b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3df72355-403e-45d5-9312-612d8d66a68c"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=940afabe-095a-47ef-be09-b3332f766661"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b0ab3e9f-e9d4-464d-9bd3-6f4c52de3e03"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a963598a-b252-4190-b3f2-bd4b13e52a5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45356015-b07d-4cc5-9875-6a94ae853f10"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef0a358c-582a-49ea-86d3-1743a638116f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ce29529-2db6-4133-8ae0-ebd338fc1447"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7045e7cc-134e-4cac-947e-28fbb86318e3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f23f09c-f6fe-46a9-b6e0-222cc6cf17f8"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95a0652d-6e5e-47ae-95e4-0f8746035932"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c8ce53b-e498-48be-83f2-7617f64c5b44"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3df72355-403e-45d5-9312-612d8d66a68c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36792452830188677, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8146841d-0ab1-4d2f-bc17-710e1b75393b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bbab18e-cc49-4dfd-ae94-f0227ff1db0e"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/940afabe-095a-47ef-be09-b3332f766661"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de2e086c-d563-4252-9438-11e762c457f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9428571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e6cfad6-e8b7-427a-804f-1be2ae583101"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef0a358c-582a-49ea-86d3-1743a638116f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7045e7cc-134e-4cac-947e-28fbb86318e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa70723b-6bf2-44f9-a304-c17fdb13d1cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9bbab18e-cc49-4dfd-ae94-f0227ff1db0e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95a0652d-6e5e-47ae-95e4-0f8746035932"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a963598a-b252-4190-b3f2-bd4b13e52a5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c8ce53b-e498-48be-83f2-7617f64c5b44"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f23f09c-f6fe-46a9-b6e0-222cc6cf17f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8146841d-0ab1-4d2f-bc17-710e1b75393b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45356015-b07d-4cc5-9875-6a94ae853f10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ce29529-2db6-4133-8ae0-ebd338fc1447"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 15, 1.1773940345368916, 395.19387755101997, 103, 3303, 127.5, 1091.0, 1348.75, 1821.0, 5.045584519481342, 685.549810512113, 3.6787265394181343], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1932.188679245283, 1424, 2723, 1890.0, 2304.8, 2464.7, 2723.0, 0.2424952301645765, 291.8035781129181, 1.192347152225237], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 727.0, 116, 1621, 617.0, 1574.0, 1621.0, 1621.0, 0.08787015301959504, 0.016592111064735196, 0.059423907193427314], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 727.0, 116, 1621, 617.0, 1574.0, 1621.0, 1621.0, 0.08906022379561951, 0.016816826577479214, 0.0602287157992837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 138.8125, 108, 329, 113.0, 326.2, 329.0, 329.0, 0.10169513071002269, 0.04630405731791805, 0.056930403983906745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 127.43750000000001, 111, 328, 114.5, 180.30000000000015, 328.0, 328.0, 0.10169125264556149, 0.07557328443678936, 0.05104424205060411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 269.62499999999994, 105, 960, 114.5, 918.0, 960.0, 960.0, 0.10169965549241702, 3.7618692635038076, 0.05879511333155359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 268.4375, 106, 1240, 114.5, 1105.6000000000001, 1240.0, 1240.0, 0.1016964234639073, 11.462311643128183, 0.058693931901532444], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 224.14285714285714, 114, 294, 227.5, 274.0, 294.0, 294.0, 0.08793030894942123, 0.18612814978928127, 0.056839437293128244], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 128.2941176470588, 105, 344, 116.0, 164.79999999999984, 344.0, 344.0, 0.09034047731656898, 0.0671377961307705, 0.045346684903043416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 151.23529411764707, 106, 333, 115.0, 329.8, 333.0, 333.0, 0.09034479826537987, 0.03215627125759959, 0.051078441206793924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 832.6666666666666, 682, 912, 904.0, 912.0, 912.0, 912.0, 0.08094762688540515, 23.80129001848304, 0.04616544345808262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de2e086c-d563-4252-9438-11e762c457f6", 1, 0, 0.0, 1838.0, 1838, 1838, 1838.0, 1838.0, 1838.0, 1838.0, 0.544069640914037, 0.09829383161044614, 0.37511051414581065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1111.0, 962, 1239, 1132.0, 1239.0, 1239.0, 1239.0, 0.07974905630283374, 71.75834104517784, 0.045404003734914135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b13d592-cc1a-4222-ab6c-9457a1548b61", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.8607437668463612, 1.6083010444743935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 264.0, 122, 344, 326.0, 344.0, 344.0, 344.0, 0.08218952905399853, 0.14543694008383332, 0.045509241185173015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 131.66666666666669, 109, 346, 112.0, 277.30000000000024, 346.0, 346.0, 0.07719970921442863, 0.05737204952361346, 0.03875063528927374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 130.58333333333334, 107, 343, 111.5, 274.60000000000025, 343.0, 343.0, 0.07720268922700808, 0.03998355421880529, 0.04294902209926979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3df72355-403e-45d5-9312-612d8d66a68c", 3, 0, 0.0, 316.3333333333333, 216, 479, 254.0, 479.0, 479.0, 479.0, 0.05357142857142857, 0.034755161830357144, 0.03435407366071429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 350.99999999999994, 107, 1514, 112.0, 1432.1000000000004, 1514.0, 1514.0, 0.07720169586391915, 11.59504383206701, 0.04428039977611508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 295.33333333333337, 108, 860, 116.0, 830.3000000000001, 860.0, 860.0, 0.07708762936267802, 3.795035034721553, 0.0442902558024501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 113.33333333333333, 109, 116, 115.0, 116.0, 116.0, 116.0, 0.08221655841486475, 0.061100391556359455, 0.04616652450053441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 778.3529411764705, 111, 1538, 973.0, 1479.6, 1538.0, 1538.0, 0.0829179307586503, 43.89726125428003, 0.044555050799426406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 230.76470588235293, 108, 1252, 115.0, 519.9999999999993, 1252.0, 1252.0, 0.09034095740158149, 4.804620450070678, 0.05265391508481422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=940afabe-095a-47ef-be09-b3332f766661", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 579.7647058823528, 109, 1025, 826.0, 948.9999999999999, 1025.0, 1025.0, 0.08301186581376044, 14.367004004101764, 0.04468659205771766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 171.64705882352942, 108, 890, 114.0, 438.7999999999996, 890.0, 890.0, 0.09034047731656898, 1.5854525426858757, 0.05274185839661595], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 1094.4285714285713, 209, 3303, 605.5, 3281.5, 3303.0, 3303.0, 0.08922084708821391, 0.016847156324483477, 0.06105927251551806], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 524.2500000000001, 225, 1624, 232.0, 1542.4000000000003, 1624.0, 1624.0, 0.07703072241979177, 15.45873951660012, 0.1699590613806473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0ab3e9f-e9d4-464d-9bd3-6f4c52de3e03", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.5692262700534759, 1.0636001559714794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 567.4000000000001, 131, 1073, 502.5, 1051.7000000000003, 1072.4, 1073.0, 0.08764933255033264, 0.05383928727945237, 0.03963050876055079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 141.47058823529412, 111, 342, 116.0, 332.4, 342.0, 342.0, 0.08300983910740008, 0.06168992925852682, 0.04166704814570669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 223.76470588235296, 103, 466, 118.0, 367.5999999999999, 466.0, 466.0, 0.08292521121539091, 0.09545354907709118, 0.04319656567676729], "isController": false}, {"data": ["login", 20, 0, 0.0, 2446.2500000000005, 1726, 3528, 2348.5, 3104.9, 3507.0999999999995, 3528.0, 0.08685456203587093, 15.70811828912798, 0.15264858915620794], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 170.23529411764707, 112, 475, 120.0, 373.3999999999999, 475.0, 475.0, 0.08953730282042503, 0.07248674222473862, 0.03182771311194796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a963598a-b252-4190-b3f2-bd4b13e52a5f", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45356015-b07d-4cc5-9875-6a94ae853f10", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef0a358c-582a-49ea-86d3-1743a638116f", 3, 0, 0.0, 331.0, 225, 510, 258.0, 510.0, 510.0, 510.0, 0.019499512512187196, 0.02304776364965876, 0.012504570198245045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ce29529-2db6-4133-8ae0-ebd338fc1447", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7045e7cc-134e-4cac-947e-28fbb86318e3", 1, 0, 0.0, 3260.0, 3260, 3260, 3260.0, 3260.0, 3260.0, 3260.0, 0.3067484662576687, 0.05541842407975461, 0.21148868865030676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f23f09c-f6fe-46a9-b6e0-222cc6cf17f8", 1, 0, 0.0, 3303.0, 3303, 3303, 3303.0, 3303.0, 3303.0, 3303.0, 0.3027550711474417, 0.05469696109597336, 0.20873542991220104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 947.4705882352944, 230, 1653, 1086.0, 1597.8, 1653.0, 1653.0, 0.08287185086966695, 58.37261716769606, 0.17390806434511738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95a0652d-6e5e-47ae-95e4-0f8746035932", 1, 0, 0.0, 1609.0, 1609, 1609, 1609.0, 1609.0, 1609.0, 1609.0, 0.6215040397762585, 0.11228344468614046, 0.42849790242386576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c8ce53b-e498-48be-83f2-7617f64c5b44", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 454.1875, 222, 1354, 337.5, 1219.6000000000001, 1354.0, 1354.0, 0.10161827096511952, 15.334149951254986, 0.22529187466656506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 780.2, 112, 1355, 1072.0, 1355.0, 1355.0, 1355.0, 0.06326871488586323, 45.42159899023131, 0.10236680353798652], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1046.8636363636365, 385, 1872, 1072.0, 1658.5, 1842.8999999999996, 1872.0, 0.0859680589584579, 0.027185566939810637, 0.038786370350397996], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3df72355-403e-45d5-9312-612d8d66a68c", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 387.2352941176471, 223, 1370, 236.0, 819.5999999999995, 1370.0, 1370.0, 0.09028482205923746, 6.485342159559835, 0.20169384450032662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 133.25, 111, 343, 118.0, 193.20000000000016, 343.0, 343.0, 0.09141081161374362, 0.07096835471965447, 0.03249368694082293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 539.5714285714284, 226, 1461, 455.0, 1149.0, 1461.0, 1461.0, 0.0744130669345537, 6.465938041487942, 0.16599678296365983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 114.14285714285715, 109, 120, 115.0, 118.5, 120.0, 120.0, 0.07210028119109664, 0.05358233787736772, 0.03619096145724968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 112.5, 106, 119, 114.0, 117.5, 119.0, 119.0, 0.07209656820335351, 0.019291464538787953, 0.041117574053475055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 126.85714285714286, 106, 331, 110.5, 225.5, 331.0, 331.0, 0.0720183132282209, 0.01941118598729391, 0.042338891175184544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 127.64285714285714, 109, 325, 112.0, 222.0, 325.0, 325.0, 0.07202053614144832, 0.019411785131874745, 0.04241053055985678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.8937026515151515, 1.8732244318181817], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1319.5660377358492, 876, 2274, 1249.0, 1830.4, 1970.8999999999999, 2274.0, 0.24184679689888522, 289.3328486415511, 0.4775529524702597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1046.8636363636365, 385, 1872, 1072.0, 1658.5, 1842.8999999999996, 1872.0, 0.08712940300517233, 0.027552817250037626, 0.03931033612147423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 167.25, 111, 327, 115.5, 327.0, 327.0, 327.0, 0.038146281452801134, 0.010281614922825305, 0.022463093472694415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 111.125, 105, 117, 111.5, 117.0, 117.0, 117.0, 0.03818579297572338, 0.010292264512987943, 0.022449069698618627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8146841d-0ab1-4d2f-bc17-710e1b75393b", 3, 0, 0.0, 361.33333333333337, 216, 624, 244.0, 624.0, 624.0, 624.0, 0.0481000481000481, 0.030923696288279623, 0.030845408449575118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 140.0, 105, 329, 114.5, 326.9, 329.0, 329.0, 0.08910819405536961, 0.02401744292898634, 0.05238587189583253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 156.0, 104, 343, 115.0, 340.2, 343.0, 343.0, 0.08909975831690556, 0.02401516923385345, 0.05246792408700591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 137.25, 108, 311, 113.0, 311.0, 311.0, 311.0, 0.03818469939095404, 0.010217390266720125, 0.02177721137140348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 115.1875, 107, 123, 116.0, 119.5, 123.0, 123.0, 0.08921551680876097, 0.06630176590963582, 0.04478200746064759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 112.875, 107, 117, 113.5, 117.0, 117.0, 117.0, 0.03818488165073244, 0.02837763177364002, 0.019167020672340305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 141.6875, 107, 352, 112.5, 338.0, 352.0, 352.0, 0.08921452189380126, 0.023871854491114793, 0.05088015701755853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 173.5, 112, 353, 118.5, 353.0, 353.0, 353.0, 0.03889991053020578, 0.03061848426498619, 0.013827702571284085], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 547.6428571428572, 112, 698, 592.0, 691.0, 698.0, 698.0, 0.08841788820189593, 0.01652284615603231, 0.06017671143874851], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1340.1999999999998, 873, 2377, 1278.5, 1787.7, 2347.8499999999995, 2377.0, 0.08817953353026763, 0.045639797627970546, 0.04055914091089458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 281.625, 225, 442, 230.5, 442.0, 442.0, 442.0, 0.03812537529666307, 0.05908688534746514, 0.08574486260567878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bbab18e-cc49-4dfd-ae94-f0227ff1db0e", 1, 0, 0.0, 932.0, 932, 932, 932.0, 932.0, 932.0, 932.0, 1.0729613733905579, 0.1938455606223176, 0.7397565718884119], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 1180.0819672131154, 585, 3270, 926.0, 2116.2000000000003, 2247.9, 3270.0, 0.30490852744176744, 96.83374284589623, 1.1089348976557032], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/940afabe-095a-47ef-be09-b3332f766661", 3, 0, 0.0, 302.3333333333333, 232, 439, 236.0, 439.0, 439.0, 439.0, 0.028008589300718888, 0.028090645714685836, 0.01796123727943236], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 197.35849056603774, 110, 505, 118.0, 450.2, 468.0, 505.0, 0.24298551256189255, 0.18057810064414084, 0.11745881710755547], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 710.9056603773586, 516, 1037, 661.0, 917.6, 989.8999999999999, 1037.0, 0.2429120108531253, 71.4241966286792, 0.12216766170835892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de2e086c-d563-4252-9438-11e762c457f6", 3, 0, 0.0, 369.66666666666663, 212, 642, 255.0, 642.0, 642.0, 642.0, 0.023623349318466373, 0.0279219991456222, 0.015149087941855063], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 163.0188679245283, 107, 449, 116.0, 340.0, 349.3, 449.0, 0.24342745861733203, 0.43075249513145086, 0.1183856195228822], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1120.6226415094343, 760, 1824, 1132.0, 1401.0, 1493.4999999999998, 1824.0, 0.24240428461007213, 218.11580139342445, 0.12167558817341512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 120.21428571428572, 112, 139, 118.0, 134.5, 139.0, 139.0, 0.07369157968428422, 0.055052791463356864, 0.026195053715897906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, 3.4285714285714284, 197.04, 107, 1618, 121.0, 339.20000000000005, 428.1999999999999, 1200.760000000005, 0.7510536209368, 1.5435534988905866, 0.3647178412251187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 135.5, 112, 345, 119.0, 238.5, 345.0, 345.0, 0.06886984582993083, 0.05333377709290542, 0.024481078009858225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e6cfad6-e8b7-427a-804f-1be2ae583101", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 133.99999999999997, 110, 355, 119.0, 195.40000000000015, 355.0, 355.0, 0.09563200803308868, 0.07760761589403974, 0.03399419035551199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef0a358c-582a-49ea-86d3-1743a638116f", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7045e7cc-134e-4cac-947e-28fbb86318e3", 3, 0, 0.0, 858.6666666666666, 294, 1684, 598.0, 1684.0, 1684.0, 1684.0, 0.02173141420799861, 0.025685795894935855, 0.013935835283124108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa70723b-6bf2-44f9-a304-c17fdb13d1cf", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 244.5, 220, 452, 230.0, 345.0, 452.0, 452.0, 0.0719772140705171, 0.11155062375967836, 0.16187844141054775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bbab18e-cc49-4dfd-ae94-f0227ff1db0e", 3, 0, 0.0, 373.0, 210, 684, 225.0, 684.0, 684.0, 684.0, 0.03471780213167305, 0.028942803144275612, 0.022263694726365857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a0652d-6e5e-47ae-95e4-0f8746035932", 3, 0, 0.0, 438.6666666666667, 207, 672, 437.0, 672.0, 672.0, 672.0, 0.02543623136796052, 0.030064764354513236, 0.016311645766563226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a963598a-b252-4190-b3f2-bd4b13e52a5f", 3, 0, 0.0, 347.0, 230, 501, 310.0, 501.0, 501.0, 501.0, 0.06888633754305397, 0.031169273823191734, 0.044175157864523536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 288.625, 224, 468, 233.0, 462.4, 468.0, 468.0, 0.0890447171438907, 0.1380019200267134, 0.20026365584216824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c8ce53b-e498-48be-83f2-7617f64c5b44", 3, 0, 0.0, 380.33333333333337, 209, 698, 234.0, 698.0, 698.0, 698.0, 0.028126494220005436, 0.028392011255285437, 0.018036846879365465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f23f09c-f6fe-46a9-b6e0-222cc6cf17f8", 3, 0, 0.0, 514.6666666666666, 242, 857, 445.0, 857.0, 857.0, 857.0, 0.02251035476319107, 0.026606477260789966, 0.014435351199051564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8146841d-0ab1-4d2f-bc17-710e1b75393b", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45356015-b07d-4cc5-9875-6a94ae853f10", 3, 0, 0.0, 382.3333333333333, 216, 586, 345.0, 586.0, 586.0, 586.0, 0.0331107554770708, 0.026913267065835217, 0.021233134208928865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 139.58333333333334, 111, 335, 118.5, 278.0000000000002, 335.0, 335.0, 0.0791394899459873, 0.0656146747696711, 0.028131615566737673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ce29529-2db6-4133-8ae0-ebd338fc1447", 3, 0, 0.0, 382.33333333333337, 222, 677, 248.0, 677.0, 677.0, 677.0, 0.04592633416000735, 0.029526207671228683, 0.029451457778390127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 121.35294117647061, 111, 182, 118.0, 136.39999999999995, 182.0, 182.0, 0.08232046874243377, 0.06391091079124497, 0.02926235412328701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 175.2142857142857, 108, 508, 115.5, 428.0, 508.0, 508.0, 0.0745489786789921, 0.05540212185030565, 0.03742009281347846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 238.57142857142858, 109, 346, 318.5, 346.0, 346.0, 346.0, 0.07446808510638298, 0.02791514295212766, 0.04202335438829787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 262.07142857142856, 108, 1345, 117.0, 843.0, 1345.0, 1345.0, 0.07455096357120417, 4.810164832513273, 0.043370189465948845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 268.3571428571429, 108, 969, 221.0, 657.0, 969.0, 969.0, 0.0744613518990304, 1.5825011002994411, 0.04339077383959961], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.3924646781789639], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07849293563579278], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07849293563579278], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.6279434850863422], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 15, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
