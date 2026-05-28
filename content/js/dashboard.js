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

    var data = {"OkPercent": 97.60299625468164, "KoPercent": 2.397003745318352};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7664958360025624, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/faa6655b-9444-4f84-b56f-15a9925365d5"], "isController": false}, {"data": [0.14655172413793102, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbb0eb3a-399c-4238-b933-7ac8a383ad29"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e0fc865-b9f6-4a36-8176-7b224e6e1daf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/852fa921-fa1f-4e2b-9220-3f3ae2412f36"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/63f51178-431d-47eb-b406-14294da2d5d3"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/037627f3-3c0a-4e8b-b4cb-b4e8779f1386"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e53b61d0-ec1e-47da-b552-e2a95ee0fe79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76d84ced-09b5-4662-803a-a014256d0f60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e53b61d0-ec1e-47da-b552-e2a95ee0fe79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da00de09-383c-4f8c-b2dd-a59724161d72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4140a5cd-36fa-422c-a9e4-c563a6ff2823"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=852fa921-fa1f-4e2b-9220-3f3ae2412f36"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09d83b80-29e5-4467-af26-fe5681348884"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/adbd3857-1e98-4212-ac9f-935bd0a37337"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3af64c4f-0c82-4648-be89-975420ddc948"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fe5e1aa-784d-4a37-ac37-c6107cbc3d2d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63f51178-431d-47eb-b406-14294da2d5d3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=037627f3-3c0a-4e8b-b4cb-b4e8779f1386"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39655172413793105, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09d83b80-29e5-4467-af26-fe5681348884"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8e0fc865-b9f6-4a36-8176-7b224e6e1daf"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac6830f2-8536-4f1d-9df0-05795bad2e73"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbb0eb3a-399c-4238-b933-7ac8a383ad29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5431034482758621, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8982558139534884, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac6830f2-8536-4f1d-9df0-05795bad2e73"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76d84ced-09b5-4662-803a-a014256d0f60"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4140a5cd-36fa-422c-a9e4-c563a6ff2823"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3af64c4f-0c82-4648-be89-975420ddc948"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faa6655b-9444-4f84-b56f-15a9925365d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adbd3857-1e98-4212-ac9f-935bd0a37337"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fe5e1aa-784d-4a37-ac37-c6107cbc3d2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 32, 2.397003745318352, 372.3176029962553, 98, 3202, 114.0, 1013.8000000000002, 1270.4, 1721.1200000000008, 5.232688033802773, 753.6474443059241, 3.826024177419481], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/faa6655b-9444-4f84-b56f-15a9925365d5", 3, 0, 0.0, 428.3333333333333, 193, 584, 508.0, 584.0, 584.0, 584.0, 0.051553478141325264, 0.032069888257836125, 0.03306001039661809], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1670.6034482758619, 1224, 2221, 1641.0, 2076.3, 2157.35, 2221.0, 0.2565316042513479, 308.69473081182304, 1.2613638939507195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbb0eb3a-399c-4238-b933-7ac8a383ad29", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e0fc865-b9f6-4a36-8176-7b224e6e1daf", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/852fa921-fa1f-4e2b-9220-3f3ae2412f36", 3, 0, 0.0, 314.6666666666667, 210, 436, 298.0, 436.0, 436.0, 436.0, 0.02211834790686701, 0.026531937511980776, 0.01418396659392188], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 655.625, 104, 2258, 501.0, 1315.1000000000008, 2258.0, 2258.0, 0.09517238097504103, 0.018553502492326724, 0.06411820930191058], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 655.625, 104, 2258, 501.0, 1315.1000000000008, 2258.0, 2258.0, 0.09480357883510102, 0.018481605883747112, 0.06386974506725128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 130.28571428571428, 98, 310, 102.5, 303.0, 310.0, 310.0, 0.09804608165837944, 0.04727221794243295, 0.054740571818754816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 117.64285714285714, 100, 305, 103.0, 205.5, 305.0, 305.0, 0.09804196195971876, 0.07286126274545505, 0.04921246918681196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 244.92857142857147, 101, 788, 104.5, 697.0, 788.0, 788.0, 0.09804470838702448, 4.1409937619054284, 0.05653163780183764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 296.28571428571433, 100, 1194, 105.0, 1151.0, 1194.0, 1194.0, 0.09804264855212018, 12.625357264785183, 0.056434705346825875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63f51178-431d-47eb-b406-14294da2d5d3", 3, 0, 0.0, 477.0, 205, 674, 552.0, 674.0, 674.0, 674.0, 0.0297498041471227, 0.024801187636973056, 0.019077836643825428], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 217.43749999999997, 102, 324, 216.5, 305.8, 324.0, 324.0, 0.09540220975368342, 0.16054286652336458, 0.0616643921686711], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/037627f3-3c0a-4e8b-b4cb-b4e8779f1386", 3, 0, 0.0, 363.6666666666667, 216, 480, 395.0, 480.0, 480.0, 480.0, 0.028406400909004828, 0.028489622786667928, 0.018216344332923018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e53b61d0-ec1e-47da-b552-e2a95ee0fe79", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 26, 0, 0.0, 104.76923076923079, 100, 118, 104.0, 111.4, 117.65, 118.0, 0.1296118126211995, 0.09632284121555941, 0.06505905438212553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 26, 0, 0.0, 110.84615384615387, 99, 302, 103.0, 109.5, 235.84999999999974, 302.0, 0.12961052038623935, 0.042168206414723755, 0.07349983611746701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 646.5714285714286, 507, 812, 603.0, 812.0, 812.0, 812.0, 0.05262603936427744, 15.473802922060834, 0.030013288074939477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1031.7142857142856, 789, 1199, 1017.0, 1199.0, 1199.0, 1199.0, 0.052507613603972575, 47.246443019394064, 0.02989447141710548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 216.28571428571428, 102, 309, 296.0, 309.0, 309.0, 309.0, 0.05290605396417505, 0.09361891580379411, 0.029294660739928955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 103.81818181818181, 102, 107, 104.0, 106.8, 107.0, 107.0, 0.05028663381273257, 0.0373712190737202, 0.02524153298803178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 140.27272727272728, 100, 307, 104.0, 306.2, 307.0, 307.0, 0.050286403927825296, 0.013455541676000127, 0.028678964740087864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 139.1818181818182, 100, 305, 104.0, 304.8, 305.0, 305.0, 0.050286403927825296, 0.01355375730867166, 0.029562905434131665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 123.2727272727273, 101, 302, 104.0, 266.20000000000016, 302.0, 302.0, 0.050286403927825296, 0.01355375730867166, 0.029612013250467435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 103.85714285714286, 101, 109, 103.0, 109.0, 109.0, 109.0, 0.05290325506170787, 0.039315797951132506, 0.029706417637189474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 26, 0, 0.0, 180.69230769230768, 100, 1105, 103.5, 305.9, 826.0499999999988, 1105.0, 0.12948142688532427, 4.514619145634235, 0.0756929435112375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 940.6153846153845, 102, 1418, 1089.0, 1379.6, 1418.0, 1418.0, 0.13600033477005483, 94.14179783942545, 0.07096291506256015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 26, 0, 0.0, 162.26923076923075, 99, 507, 104.0, 338.70000000000005, 474.79999999999984, 507.0, 0.12941246739801304, 1.497060765997372, 0.0757790101688335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 659.7692307692307, 100, 925, 791.0, 879.4, 925.0, 925.0, 0.13600887196334038, 30.77086297629261, 0.07110019080475403], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 504.875, 104, 959, 490.5, 916.3000000000001, 959.0, 959.0, 0.09498029158949518, 0.018516055379446266, 0.0646380768568647], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 265.0, 205, 409, 208.0, 408.8, 409.0, 409.0, 0.05026273703449852, 0.07789742546264565, 0.11304207362348641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 681.818181818182, 127, 1518, 611.5, 1297.8999999999999, 1493.3999999999996, 1518.0, 0.10110154731322638, 0.062102415292987684, 0.04571290664650763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76d84ced-09b5-4662-803a-a014256d0f60", 3, 0, 0.0, 313.6666666666667, 191, 440, 310.0, 440.0, 440.0, 440.0, 0.050430338891877355, 0.0324218487341985, 0.03233976810449166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 120.46153846153847, 99, 307, 103.0, 235.79999999999995, 307.0, 307.0, 0.13596477466453308, 0.10104413429659147, 0.0682479435327832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 150.61538461538458, 100, 308, 103.0, 308.0, 308.0, 308.0, 0.13600318038206433, 0.19352255429665433, 0.0687780506559538], "isController": false}, {"data": ["login", 22, 0, 0.0, 3072.1818181818185, 1769, 5288, 2972.5, 4225.9, 5133.949999999998, 5288.0, 0.10016116842555749, 38.26213099003624, 0.2039681180171731], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e53b61d0-ec1e-47da-b552-e2a95ee0fe79", 3, 0, 0.0, 387.0, 218, 620, 323.0, 620.0, 620.0, 620.0, 0.08817823761095761, 0.03989835621068721, 0.05654659117629769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 26, 0, 0.0, 130.53846153846155, 103, 307, 107.0, 302.5, 306.65, 307.0, 0.12667540402145686, 0.1025526464197146, 0.045029147523252246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da00de09-383c-4f8c-b2dd-a59724161d72", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4140a5cd-36fa-422c-a9e4-c563a6ff2823", 3, 0, 0.0, 325.6666666666667, 189, 464, 324.0, 464.0, 464.0, 464.0, 0.06793478260869565, 0.030738719995471016, 0.043564948482789856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=852fa921-fa1f-4e2b-9220-3f3ae2412f36", 1, 0, 0.0, 872.0, 872, 872, 872.0, 872.0, 872.0, 872.0, 1.146788990825688, 0.20718355791284404, 0.790657253440367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1062.076923076923, 204, 1520, 1194.0, 1493.2, 1520.0, 1520.0, 0.13581420616596496, 125.03396375393078, 0.27871907288521613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09d83b80-29e5-4467-af26-fe5681348884", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 959.0, 1.0427528675703859, 0.18838796923879042, 0.7189292231491137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adbd3857-1e98-4212-ac9f-935bd0a37337", 3, 0, 0.0, 664.6666666666666, 275, 1270, 449.0, 1270.0, 1270.0, 1270.0, 0.04338771259979174, 0.02789411861477496, 0.027823500592965403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 456.49999999999994, 203, 1298, 402.0, 1256.5, 1298.0, 1298.0, 0.09797129441073765, 16.874106667996276, 0.21675875530969427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 760.6363636363637, 102, 1300, 1101.0, 1282.4, 1300.0, 1300.0, 0.0821944421612655, 62.583624672156255, 0.13774720211986938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3af64c4f-0c82-4648-be89-975420ddc948", 3, 0, 0.0, 327.6666666666667, 217, 492, 274.0, 492.0, 492.0, 492.0, 0.01988981045010641, 0.023509082599067834, 0.012754858914944541], "isController": false}, {"data": ["register", 25, 9, 36.0, 1123.2800000000002, 290, 3202, 1024.0, 1750.4000000000003, 2792.7999999999993, 3202.0, 0.10063520944199789, 0.031354157441772466, 0.045403776134963894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5fe5e1aa-784d-4a37-ac37-c6107cbc3d2d", 3, 0, 0.0, 325.0, 273, 411, 291.0, 411.0, 411.0, 411.0, 0.06533954785032887, 0.029564443851548546, 0.04190068660974866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63f51178-431d-47eb-b406-14294da2d5d3", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 26, 0, 0.0, 306.96153846153845, 206, 1208, 214.5, 446.20000000000005, 966.849999999999, 1208.0, 0.12934422478036356, 6.14431220431164, 0.2896253494781458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 107.14285714285715, 103, 124, 105.0, 119.0, 124.0, 124.0, 0.09744689144416292, 0.07565456904112258, 0.03463932469304229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 375.47058823529414, 204, 1223, 209.0, 738.1999999999996, 1223.0, 1223.0, 0.10870677307141396, 7.808628320352466, 0.242847983569291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 165.42857142857142, 103, 316, 111.0, 316.0, 316.0, 316.0, 0.04394886863055326, 0.03266121975376077, 0.022060271949320674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 131.42857142857144, 100, 311, 102.0, 311.0, 311.0, 311.0, 0.04394886863055326, 0.011759755864034757, 0.0250645891408624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 161.0, 100, 315, 101.0, 315.0, 315.0, 315.0, 0.04394914456129336, 0.011845667870036101, 0.025837290064354104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 132.57142857142858, 101, 305, 105.0, 305.0, 305.0, 305.0, 0.04394942049549832, 0.011845742242927282, 0.025880371639438952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=037627f3-3c0a-4e8b-b4cb-b4e8779f1386", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 109.5, 104, 115, 109.5, 115.0, 115.0, 115.0, 0.021168277219758468, 0.006242988008170956, 0.013085468242292102], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1155.8103448275858, 803, 1785, 1062.5, 1641.7, 1716.4, 1785.0, 0.24379479203883903, 291.66332806162126, 0.4813994819360669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09d83b80-29e5-4467-af26-fe5681348884", 3, 0, 0.0, 357.0, 199, 488, 384.0, 488.0, 488.0, 488.0, 0.020669555811245615, 0.024551825896886478, 0.013254890933643838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1123.2800000000002, 290, 3202, 1024.0, 1750.4000000000003, 2792.7999999999993, 3202.0, 0.0987205812667825, 0.03075763110093192, 0.044539949751224134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 118.3076923076923, 99, 305, 104.0, 224.99999999999994, 305.0, 305.0, 0.055509297807382736, 0.014961490424646128, 0.03268760407993339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 133.0, 100, 303, 103.0, 299.4, 303.0, 303.0, 0.055509297807382736, 0.014961490424646128, 0.032633395781293366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e0fc865-b9f6-4a36-8176-7b224e6e1daf", 3, 0, 0.0, 1328.0, 202, 2946, 836.0, 2946.0, 2946.0, 2946.0, 0.04345684735058088, 0.027938565598111073, 0.02786783505229307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 225.07142857142856, 99, 1203, 103.5, 755.0, 1203.0, 1203.0, 0.09298186189536883, 5.999360178940272, 0.054092405706429696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 194.28571428571433, 100, 781, 103.5, 543.0, 781.0, 781.0, 0.09298247944423044, 1.9761241540254773, 0.05418356816944064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 118.23076923076923, 100, 301, 102.0, 226.19999999999993, 301.0, 301.0, 0.055506690691101, 0.014852376220079759, 0.03165615953476854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 103.21428571428572, 100, 106, 103.0, 105.5, 106.0, 106.0, 0.09298000929800093, 0.06909940144119014, 0.04667160622966063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 135.23076923076923, 101, 305, 104.0, 302.2, 305.0, 305.0, 0.05550953483009812, 0.041252691411820974, 0.027863184475264098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 145.50000000000003, 99, 306, 102.5, 304.5, 306.0, 306.0, 0.09298124435471017, 0.03485499491923914, 0.05247058222862759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 125.92307692307692, 105, 314, 107.0, 239.59999999999994, 314.0, 314.0, 0.05642091740411699, 0.044409433034881145, 0.02005587298349471], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 459.4375, 102, 836, 472.0, 684.8000000000002, 836.0, 836.0, 0.09482268158543523, 0.018161228931585435, 0.06453081663071307], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1635.4545454545453, 1190, 2537, 1514.0, 2409.6, 2524.5499999999997, 2537.0, 0.10373395070751269, 0.05369042370603685, 0.04771356521800633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 271.1538461538461, 205, 611, 209.0, 606.6, 611.0, 611.0, 0.05548229047966574, 0.0859867138586226, 0.12478097165495138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac6830f2-8536-4f1d-9df0-05795bad2e73", 1, 0, 0.0, 898.0, 898, 898, 898.0, 898.0, 898.0, 898.0, 1.1135857461024499, 0.20118492483296213, 0.7677651726057906], "isController": false}, {"data": ["addBook", 57, 15, 26.31578947368421, 1077.649122807018, 520, 3027, 855.0, 1866.8000000000002, 2106.0999999999995, 3027.0, 0.2569315164819314, 81.9077848277432, 0.9323759840589771], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dbb0eb3a-399c-4238-b933-7ac8a383ad29", 3, 0, 0.0, 288.0, 186, 459, 219.0, 459.0, 459.0, 459.0, 0.026992253223324904, 0.027071332090190116, 0.01730948530271812], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 189.94827586206893, 100, 423, 105.0, 414.0, 418.05, 423.0, 0.24498002145687084, 0.1820603479772253, 0.11842295959096784], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 657.0344827586207, 490, 1011, 605.5, 830.4000000000001, 906.75, 1011.0, 0.24460704721337745, 71.92259359909748, 0.12302014581532167], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 129.4655172413793, 99, 373, 103.0, 300.3, 307.05, 373.0, 0.24534375621290763, 0.4341434436111217, 0.11931756893948046], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 964.6034482758621, 700, 1370, 915.0, 1307.0, 1315.05, 1370.0, 0.24425680655282056, 219.78270389389567, 0.12260546735170874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 119.23529411764706, 104, 298, 106.0, 158.79999999999987, 298.0, 298.0, 0.10491560465331563, 0.07837933355447897, 0.037294218841608294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 15, 8.720930232558139, 170.50581395348846, 100, 1353, 108.0, 307.80000000000007, 387.69999999999965, 1100.4200000000035, 0.7099956657241336, 1.5920119360281522, 0.3377687638026047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 106.42857142857142, 103, 110, 107.0, 110.0, 110.0, 110.0, 0.04415846580873076, 0.034196936900706534, 0.01569695464294726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 107.42857142857143, 101, 118, 106.0, 115.0, 118.0, 118.0, 0.0948374553755902, 0.07696281779015181, 0.033711751715541825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 329.1428571428571, 205, 624, 215.0, 624.0, 624.0, 624.0, 0.043920190739114066, 0.06806771748337308, 0.09877753835173798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac6830f2-8536-4f1d-9df0-05795bad2e73", 3, 0, 0.0, 376.0, 225, 509, 394.0, 509.0, 509.0, 509.0, 0.0328493528677485, 0.026700792353765632, 0.021065502978341328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76d84ced-09b5-4662-803a-a014256d0f60", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 372.2142857142857, 204, 1305, 310.0, 858.0, 1305.0, 1305.0, 0.09291644820239857, 8.073743253187367, 0.20727315942471444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4140a5cd-36fa-422c-a9e4-c563a6ff2823", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 0.6251351643598616, 2.3856509515570936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3af64c4f-0c82-4648-be89-975420ddc948", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 108.0909090909091, 103, 124, 104.0, 122.4, 124.0, 124.0, 0.053584302722082575, 0.04442682911235167, 0.01904754510824029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 111.07692307692307, 102, 136, 105.0, 131.6, 136.0, 136.0, 0.13874362312962923, 0.1077159964727102, 0.04931902228436039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faa6655b-9444-4f84-b56f-15a9925365d5", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adbd3857-1e98-4212-ac9f-935bd0a37337", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fe5e1aa-784d-4a37-ac37-c6107cbc3d2d", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 126.29411764705883, 99, 306, 103.0, 304.4, 306.0, 306.0, 0.10877841836179702, 0.08084021130207766, 0.05460166702926139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 162.23529411764707, 98, 328, 102.0, 310.4, 328.0, 328.0, 0.10877981046717729, 0.03871781397372648, 0.06150108539855003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 197.47058823529414, 100, 1121, 102.0, 469.7999999999994, 1121.0, 1121.0, 0.10877981046717729, 5.7852575062068485, 0.06340073282398787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 194.29411764705884, 99, 820, 103.0, 431.99999999999966, 820.0, 820.0, 0.10877841836179702, 1.9090337477044554, 0.06350615037976465], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 28.125, 0.6741573033707865], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.25, 0.149812734082397], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.149812734082397], "isController": false}, {"data": ["401/Unauthorized", 19, 59.375, 1.4232209737827715], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 32, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
