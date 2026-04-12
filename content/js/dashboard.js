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

    var data = {"OkPercent": 98.47908745247149, "KoPercent": 1.520912547528517};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8216393442622951, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39285714285714285, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46949dc8-f898-47ca-a366-889bc59e8394"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ed959d5-3fb2-403c-ba5f-02ccaf527414"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40be1f96-78a9-4463-a8d9-f7bf6101adbd"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc1e3411-9d4f-4918-a526-10caee19aff4"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe3d4353-a91e-40e2-b755-819991891bfb"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3d580a96-a2c9-4d26-b9a7-9ef83956d04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ff95251-cfee-4276-a140-719bfc485210"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ff30c11-9956-4d41-b00c-1ff49b8ac1a9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cdb9182d-59be-4f22-a6da-d942d30ceb5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2dbd745c-9b26-47c7-9658-eb89c6b21ed0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=241851df-2f1c-4520-9358-6aa026b78234"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/224ffe18-af94-4f47-a62c-efca4db51de8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83d4b536-b507-4226-b05a-8826aaafc655"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b25329e5-c4ed-4fd8-a9cc-ae79d1b71ab2"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ed959d5-3fb2-403c-ba5f-02ccaf527414"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d68f4cd-6b9f-44c6-8e55-548801000fe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2cefb87-dd34-45da-ab52-fa350bc2900e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d580a96-a2c9-4d26-b9a7-9ef83956d04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40be1f96-78a9-4463-a8d9-f7bf6101adbd"], "isController": false}, {"data": [0.3770491803278688, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46949dc8-f898-47ca-a366-889bc59e8394"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9353932584269663, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc1e3411-9d4f-4918-a526-10caee19aff4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdb9182d-59be-4f22-a6da-d942d30ceb5a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7d68f4cd-6b9f-44c6-8e55-548801000fe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ff95251-cfee-4276-a140-719bfc485210"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/241851df-2f1c-4520-9358-6aa026b78234"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b25329e5-c4ed-4fd8-a9cc-ae79d1b71ab2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83d4b536-b507-4226-b05a-8826aaafc655"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1315, 20, 1.520912547528517, 299.51863117870715, 77, 2901, 94.0, 874.0, 1050.2, 1583.8799999999953, 5.130726222107772, 712.7970796255058, 3.7543049694887616], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1352.9642857142853, 974, 1793, 1339.5, 1644.9, 1704.1, 1793.0, 0.25390492167486567, 305.53335973453335, 1.2484485162431138], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46949dc8-f898-47ca-a366-889bc59e8394", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 483.9230769230769, 85, 993, 437.0, 899.3999999999999, 993.0, 993.0, 0.10679986526786228, 0.021172238915406292, 0.07180429643534911], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 483.9230769230769, 85, 993, 437.0, 899.3999999999999, 993.0, 993.0, 0.11011350160935118, 0.02182914143232255, 0.07403213937828222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 136.0, 78, 240, 82.5, 237.5, 240.0, 240.0, 0.09199873830301755, 0.024616849897487122, 0.05246803043843971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 93.57142857142856, 79, 244, 81.5, 165.5, 244.0, 244.0, 0.09209011675711232, 0.06843806528531492, 0.046224921887847395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 148.2142857142857, 79, 243, 82.5, 242.0, 243.0, 243.0, 0.09209011675711232, 0.024821164282190427, 0.05422884805130735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ed959d5-3fb2-403c-ba5f-02ccaf527414", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 137.71428571428572, 78, 243, 81.5, 242.0, 243.0, 243.0, 0.09199269315180109, 0.024794905576071384, 0.05408164187244556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40be1f96-78a9-4463-a8d9-f7bf6101adbd", 3, 0, 0.0, 495.3333333333333, 165, 949, 372.0, 949.0, 949.0, 949.0, 0.024031336863269706, 0.028404226611501396, 0.015410720579635846], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 184.84615384615387, 81, 326, 177.0, 298.4, 326.0, 326.0, 0.10645179780709296, 0.23095210129707422, 0.06880343061389933], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 91.83333333333333, 80, 242, 83.0, 101.60000000000022, 242.0, 242.0, 0.09426008451987578, 0.07005070734338424, 0.047314143987515773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 576.8, 477, 645, 630.0, 645.0, 645.0, 645.0, 0.020670552730580015, 6.077828829736657, 0.011788674604158916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 89.44444444444444, 78, 240, 80.0, 103.20000000000022, 240.0, 240.0, 0.09426205899757537, 0.0252224650052106, 0.053758830522054706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 910.4, 698, 1066, 969.0, 1066.0, 1066.0, 1066.0, 0.02065688907250568, 18.587105098378434, 0.011760709305928527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 194.0, 79, 323, 242.0, 323.0, 323.0, 323.0, 0.020718947477468143, 0.036662825028488555, 0.011472307831762146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 82.82352941176471, 80, 88, 83.0, 85.6, 88.0, 88.0, 0.08981355762068036, 0.06674620834896265, 0.045082195915068075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 99.47058823529412, 78, 244, 82.0, 234.39999999999998, 244.0, 244.0, 0.08973817567567569, 0.03194035710515203, 0.0507354736328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 138.0, 78, 720, 82.0, 340.79999999999967, 720.0, 720.0, 0.08973722828095143, 4.772512208551958, 0.05230204033424478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 123.11764705882354, 77, 645, 81.0, 316.9999999999997, 645.0, 645.0, 0.08981545565493958, 1.5762385452273653, 0.052435344429064286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 113.0, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.02071577133102974, 0.015395216780189094, 0.01163239112826377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 564.7222222222223, 79, 1509, 518.0, 1184.1000000000006, 1509.0, 1509.0, 0.09754934370969315, 43.9006817699922, 0.05315677127930545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 108.27777777777777, 80, 244, 81.5, 242.2, 244.0, 244.0, 0.09426255262992522, 0.025406703638534534, 0.05541607097970214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 345.22222222222223, 79, 706, 356.5, 651.1000000000001, 706.0, 706.0, 0.09754881505286604, 14.354441502549818, 0.053251745717336055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 98.22222222222223, 79, 236, 81.0, 234.2, 236.0, 236.0, 0.09426255262992522, 0.025406703638534534, 0.055508124253754794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc1e3411-9d4f-4918-a526-10caee19aff4", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 391.0769230769231, 86, 660, 413.0, 590.8, 660.0, 660.0, 0.11038839733029907, 0.021883637361377647, 0.0748969354482618], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fe3d4353-a91e-40e2-b755-819991891bfb", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 230.94117647058823, 161, 803, 166.0, 422.99999999999966, 803.0, 803.0, 0.08969698248798325, 6.4431164491075155, 0.20038062683680954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 457.7619047619047, 130, 1246, 344.0, 1105.2, 1234.7999999999997, 1246.0, 0.08789405836165474, 0.05398961202097738, 0.039741161153756005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 82.22222222222221, 80, 85, 82.0, 83.2, 85.0, 85.0, 0.09754617185467788, 0.07249280935684557, 0.04896360579424261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 117.0, 79, 250, 81.0, 247.3, 250.0, 250.0, 0.09754775775640158, 0.09935772591789731, 0.051536461861536376], "isController": false}, {"data": ["login", 21, 0, 0.0, 2658.4761904761904, 1659, 5168, 2510.0, 3783.6, 5030.299999999998, 5168.0, 0.08785765386594595, 25.146601837218594, 0.16724577106596436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d580a96-a2c9-4d26-b9a7-9ef83956d04f", 3, 0, 0.0, 690.3333333333333, 164, 1272, 635.0, 1272.0, 1272.0, 1272.0, 0.0202322664184842, 0.023913853960128947, 0.012974467722790975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 96.44444444444444, 82, 237, 85.0, 123.60000000000018, 237.0, 237.0, 0.0968778424228072, 0.07842942516455778, 0.03443704554873225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ff95251-cfee-4276-a140-719bfc485210", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ff30c11-9956-4d41-b00c-1ff49b8ac1a9", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdb9182d-59be-4f22-a6da-d942d30ceb5a", 3, 0, 0.0, 883.0, 187, 1660, 802.0, 1660.0, 1660.0, 1660.0, 0.0251454243709453, 0.025219092606407055, 0.016125158206628333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dbd745c-9b26-47c7-9658-eb89c6b21ed0", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=241851df-2f1c-4520-9358-6aa026b78234", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 648.5555555555555, 164, 1593, 600.5, 1267.2000000000005, 1593.0, 1593.0, 0.09750337199161471, 58.399520870799904, 0.206813792935339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/224ffe18-af94-4f47-a62c-efca4db51de8", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.6794381648936171, 1.26953125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83d4b536-b507-4226-b05a-8826aaafc655", 3, 0, 0.0, 268.0, 177, 393, 234.0, 393.0, 393.0, 393.0, 0.03395931673854722, 0.028111504709025258, 0.02177729621580014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b25329e5-c4ed-4fd8-a9cc-ae79d1b71ab2", 3, 0, 0.0, 286.0, 212, 407, 239.0, 407.0, 407.0, 407.0, 0.05655468838366701, 0.036727409936658746, 0.036267166704369795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 675.125, 81, 1184, 912.0, 1184.0, 1184.0, 1184.0, 0.033034917908228996, 24.7040939167231, 0.05469391987174193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 288.14285714285705, 161, 483, 321.0, 405.5, 483.0, 483.0, 0.091943152862059, 0.14249392928914809, 0.2067823057044159], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 954.0952380952381, 136, 1991, 1027.0, 1653.6000000000001, 1960.1999999999996, 1991.0, 0.09123611907616912, 0.02881676528856681, 0.04116317091131849], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 87.76470588235294, 82, 103, 85.0, 101.4, 103.0, 103.0, 0.09089936905143835, 0.07057128749598973, 0.032311885092503476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 218.83333333333334, 161, 487, 167.0, 342.10000000000025, 487.0, 487.0, 0.09421913276522687, 0.1460212536117334, 0.21190103784991937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 219.16666666666669, 163, 330, 167.0, 327.3, 330.0, 330.0, 0.11196745479314013, 0.1735276862858529, 0.25181743006699386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 118.55555555555556, 79, 246, 84.0, 246.0, 246.0, 246.0, 0.05129374216345606, 0.038119665807021544, 0.025747054171891028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 117.11111111111111, 78, 242, 83.0, 242.0, 242.0, 242.0, 0.051293449826457164, 0.013725005129344981, 0.02925329560415135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 117.22222222222223, 79, 243, 82.0, 243.0, 243.0, 243.0, 0.05129315749279046, 0.01382510885547868, 0.03015476641666002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 99.55555555555556, 78, 241, 83.0, 241.0, 241.0, 241.0, 0.05129403450378721, 0.013825345237348897, 0.03020537383377313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 0.01785060825947644, 0.005264534857775279, 0.011034604519774012], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 938.9642857142856, 624, 1440, 923.5, 1284.2, 1347.3, 1440.0, 0.26000798595956875, 311.05994460901303, 0.5134142066506329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 954.0952380952381, 136, 1991, 1027.0, 1653.6000000000001, 1960.1999999999996, 1991.0, 0.08844004396733615, 0.027933629958433178, 0.039901660461825486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 107.66666666666667, 79, 241, 81.5, 241.0, 241.0, 241.0, 0.02929573063552205, 0.007896114897855553, 0.017251294505097457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 135.66666666666666, 80, 256, 82.0, 256.0, 256.0, 256.0, 0.029270720010927738, 0.007889373752945366, 0.017207981881424313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 320.1764705882353, 78, 980, 91.0, 901.5999999999999, 980.0, 980.0, 0.09135904642651778, 24.195331897003424, 0.051399959828889875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 233.47058823529412, 80, 652, 85.0, 633.6, 652.0, 652.0, 0.0913585554600172, 7.918101841277944, 0.05148890094314273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 135.83333333333334, 77, 255, 82.0, 255.0, 255.0, 255.0, 0.029270862807466023, 0.007832242587153994, 0.016693538944882964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 93.58823529411765, 81, 250, 83.0, 121.19999999999989, 250.0, 250.0, 0.0913585554600172, 0.06789439521979793, 0.04585771240864144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 109.16666666666666, 80, 239, 84.0, 239.0, 239.0, 239.0, 0.02929573063552205, 0.021771534193000274, 0.01470508354165853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 131.88235294117646, 79, 245, 93.0, 243.4, 245.0, 245.0, 0.09135806449879354, 0.06480292856336757, 0.049845984410015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 111.33333333333334, 83, 243, 85.0, 243.0, 243.0, 243.0, 0.028741000474226508, 0.02262231092014313, 0.010216527512322705], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 575.5, 82, 1468, 417.5, 1409.2000000000003, 1468.0, 1468.0, 0.1073796676599286, 0.020177380584861255, 0.07308074223958194], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1408.6666666666667, 891, 2901, 1295.0, 1906.8, 2801.8999999999987, 2901.0, 0.08807025490048061, 0.045583237399662815, 0.04050887700988903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 273.6666666666667, 164, 476, 247.5, 476.0, 476.0, 476.0, 0.02925901543413064, 0.045345759271450514, 0.06580421146953405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ed959d5-3fb2-403c-ba5f-02ccaf527414", 3, 0, 0.0, 630.0, 169, 1468, 253.0, 1468.0, 1468.0, 1468.0, 0.023270967141394396, 0.02333914380294145, 0.014923113694188464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d68f4cd-6b9f-44c6-8e55-548801000fe8", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2cefb87-dd34-45da-ab52-fa350bc2900e", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d580a96-a2c9-4d26-b9a7-9ef83956d04f", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40be1f96-78a9-4463-a8d9-f7bf6101adbd", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 898.5573770491804, 416, 2142, 699.0, 1589.2, 1947.5999999999997, 2142.0, 0.26584617530158283, 79.18251994663466, 0.9681271273141692], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 149.64285714285717, 80, 410, 84.0, 330.0, 351.65, 410.0, 0.26115870521244794, 0.19408376432292274, 0.12624371003922044], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 512.8214285714284, 385, 777, 478.5, 645.6, 663.9999999999999, 777.0, 0.2607950523452926, 76.68240460023844, 0.13116157417756416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46949dc8-f898-47ca-a366-889bc59e8394", 3, 0, 0.0, 691.6666666666666, 326, 1359, 390.0, 1359.0, 1359.0, 1359.0, 0.021668628881393148, 0.02561158576443311, 0.013895572557403807], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 121.89285714285714, 78, 395, 83.5, 243.3, 258.89999999999986, 395.0, 0.2614855179047539, 0.46270679535489656, 0.1271677616372729], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 787.5714285714286, 535, 1196, 794.5, 963.9, 1044.45, 1196.0, 0.260431199657719, 234.3364512412337, 0.13072425451569097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 95.88888888888889, 82, 250, 86.0, 119.5000000000002, 250.0, 250.0, 0.11031507210315684, 0.08241311538956542, 0.03921356078666904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, 4.49438202247191, 157.8146067415731, 80, 1818, 88.5, 257.99999999999994, 384.4499999999998, 1670.2700000000016, 0.7586283317848223, 1.5543781418613671, 0.3666489950838327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 107.22222222222223, 83, 247, 88.0, 247.0, 247.0, 247.0, 0.05193576123399369, 0.04021978384624707, 0.018461540126146193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc1e3411-9d4f-4918-a526-10caee19aff4", 3, 0, 0.0, 922.0, 190, 2113, 463.0, 2113.0, 2113.0, 2113.0, 0.02447481133999592, 0.024546514888843563, 0.01569511013665103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 87.57142857142858, 80, 109, 84.0, 104.0, 109.0, 109.0, 0.09503961115221951, 0.07712687194091253, 0.03378361177676553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdb9182d-59be-4f22-a6da-d942d30ceb5a", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d68f4cd-6b9f-44c6-8e55-548801000fe8", 3, 0, 0.0, 866.6666666666666, 257, 1891, 452.0, 1891.0, 1891.0, 1891.0, 0.016910935738444193, 0.023313090121195038, 0.01084457793122886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ff95251-cfee-4276-a140-719bfc485210", 3, 0, 0.0, 337.0, 192, 428, 391.0, 428.0, 428.0, 428.0, 0.03142512962865972, 0.03151719543811868, 0.02015218273712879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 255.33333333333334, 163, 489, 167.0, 489.0, 489.0, 489.0, 0.05126978159073042, 0.07945814783641522, 0.11530694043305875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 425.6470588235294, 166, 1063, 179.0, 1025.3999999999999, 1063.0, 1063.0, 0.09131782362768112, 32.231624638085975, 0.19850400757669354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/241851df-2f1c-4520-9358-6aa026b78234", 3, 0, 0.0, 312.6666666666667, 172, 389, 377.0, 389.0, 389.0, 389.0, 0.04489405004190111, 0.02886254844816234, 0.028789478705255597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b25329e5-c4ed-4fd8-a9cc-ae79d1b71ab2", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 97.76470588235296, 82, 240, 88.0, 133.5999999999999, 240.0, 240.0, 0.0893223064070365, 0.07405726380817772, 0.03175128860562625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83d4b536-b507-4226-b05a-8826aaafc655", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 96.44444444444444, 81, 236, 87.5, 115.40000000000019, 236.0, 236.0, 0.09333679025149079, 0.07246362133782733, 0.03317831215970962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 82.16666666666667, 78, 85, 82.0, 85.0, 85.0, 85.0, 0.11202459562232774, 0.0832526535826088, 0.05623109584948873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 116.83333333333333, 78, 248, 82.5, 242.60000000000002, 248.0, 248.0, 0.11202738447175976, 0.02997607748560759, 0.06389061770655048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 107.44444444444444, 79, 241, 81.5, 240.1, 241.0, 241.0, 0.11202738447175976, 0.030194880970903996, 0.06585984907421814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 126.61111111111113, 78, 245, 82.5, 245.0, 245.0, 245.0, 0.11202668724638402, 0.03019469304687695, 0.06596884024372028], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 25.0, 0.38022813688212925], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.1520912547528517], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07604562737642585], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9125475285171103], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1315, 20, "401/Unauthorized", 12, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
