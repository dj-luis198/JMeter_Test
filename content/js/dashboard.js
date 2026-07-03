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

    var data = {"OkPercent": 99.68944099378882, "KoPercent": 0.3105590062111801};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7513333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10f5f6a9-3091-4e21-a5ec-340370e8ea62"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f29ea935-4a53-422e-b370-32f26fd003c3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c1b859e-a0eb-4581-aa8d-1315df008a0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2543371-5aaf-47bb-9060-6d3d78154bbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/79e0d616-1abe-41ce-858b-f1ce30b50b0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cfd06c65-d90b-48e9-9060-bfc8f9c86c30"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/994bf2ef-b17f-4b49-b805-e7b505f6b4e4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2658e3b-472b-475f-bc7b-29533c3455a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0c32e67-98f5-4fc9-bd91-652c7ee72b9d"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a5870bd-d2b4-4a4f-a075-1ce9f56900d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02579d24-7692-48a0-8ad0-164272733309"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6a924fef-45ed-4772-8b6a-a0b4567137f1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/e2350073-9e3a-45d5-b8d5-17127953885f"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/908a3182-6339-4719-95b0-e354a738686b"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10f5f6a9-3091-4e21-a5ec-340370e8ea62"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79e0d616-1abe-41ce-858b-f1ce30b50b0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=994bf2ef-b17f-4b49-b805-e7b505f6b4e4"], "isController": false}, {"data": [0.3387096774193548, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be08b5ea-c605-45c1-90a3-c0500b7b8c56"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/55cafe24-6538-41d1-84d4-9ce5b1808688"], "isController": false}, {"data": [0.9634831460674157, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f29ea935-4a53-422e-b370-32f26fd003c3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4c1b859e-a0eb-4581-aa8d-1315df008a0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a5870bd-d2b4-4a4f-a075-1ce9f56900d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/737036d9-d0bc-4a1c-ae3d-76f91f6c4141"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2658e3b-472b-475f-bc7b-29533c3455a2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2543371-5aaf-47bb-9060-6d3d78154bbb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfd06c65-d90b-48e9-9060-bfc8f9c86c30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d7898db-0011-4e74-9730-53aad2c9ab00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02579d24-7692-48a0-8ad0-164272733309"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0c32e67-98f5-4fc9-bd91-652c7ee72b9d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a924fef-45ed-4772-8b6a-a0b4567137f1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=908a3182-6339-4719-95b0-e354a738686b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 4, 0.3105590062111801, 474.6234472049688, 137, 3601, 155.0, 1326.6000000000022, 1637.4999999999995, 2088.4299999999985, 5.10969175229103, 696.2687850845003, 3.722846704288491], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2317.999999999999, 1680, 3126, 2266.0, 2785.0, 2941.25, 3126.0, 0.24878257784821498, 299.369025546861, 1.2232619916657836], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 578.1538461538461, 438, 956, 528.0, 884.4, 956.0, 956.0, 0.07208725885425621, 0.01302357703909902, 0.048996808752502265], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 578.1538461538461, 438, 956, 528.0, 884.4, 956.0, 956.0, 0.07315330118339533, 0.013216172577078257, 0.04972138439808901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 175.375, 138, 415, 141.0, 414.3, 415.0, 415.0, 0.08550616980456496, 0.03893286296033048, 0.047867589687955917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 178.125, 139, 422, 143.0, 420.6, 422.0, 422.0, 0.08550754069624515, 0.06354613131820562, 0.04292077726354493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 334.56249999999994, 138, 1125, 144.5, 1101.2, 1125.0, 1125.0, 0.08550936862019945, 3.16299071020875, 0.0494351037335528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 341.4375, 138, 1543, 141.0, 1434.5, 1543.0, 1543.0, 0.08550891163188414, 9.63780003273388, 0.0493513347406675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10f5f6a9-3091-4e21-a5ec-340370e8ea62", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 308.5333333333333, 235, 535, 273.0, 514.0, 535.0, 535.0, 0.075773266181381, 0.18280300466258165, 0.04898623262897873], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f29ea935-4a53-422e-b370-32f26fd003c3", 3, 0, 0.0, 1177.0, 500, 2329, 702.0, 2329.0, 2329.0, 2329.0, 0.021173730458411266, 0.02502663258284222, 0.01357820605568691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c1b859e-a0eb-4581-aa8d-1315df008a0c", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2543371-5aaf-47bb-9060-6d3d78154bbb", 3, 0, 0.0, 361.0, 263, 444, 376.0, 444.0, 444.0, 444.0, 0.05067567567567567, 0.03257957664695946, 0.03249709670608108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 175.8823529411765, 138, 442, 141.0, 421.2, 442.0, 442.0, 0.09979278322072403, 0.0741624101864951, 0.05009129939008999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 192.58823529411762, 138, 442, 142.0, 421.2, 442.0, 442.0, 0.0996173521707793, 0.035456635687623424, 0.05632088580335535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 967.0, 821, 1113, 967.0, 1113.0, 1113.0, 1113.0, 0.15600624024961, 45.87101452808112, 0.08897230889235569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1552.5, 1513, 1592, 1552.5, 1592.0, 1592.0, 1592.0, 0.14715620631300125, 132.41141311345743, 0.083781316680156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 289.0, 140, 438, 289.0, 438.0, 438.0, 438.0, 0.1608104848436118, 0.2845591782584225, 0.08904252432258583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79e0d616-1abe-41ce-858b-f1ce30b50b0c", 3, 0, 0.0, 793.6666666666666, 241, 1513, 627.0, 1513.0, 1513.0, 1513.0, 0.021876253327013526, 0.03015818126298903, 0.014028717140044483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 142.92857142857142, 139, 151, 141.0, 150.5, 151.0, 151.0, 0.06646978948068102, 0.049397958783982676, 0.03336471854791997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 162.42857142857142, 137, 420, 142.5, 284.5, 420.0, 420.0, 0.06647231428110192, 0.0249178443740682, 0.03751123204060509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 278.28571428571433, 138, 1519, 140.5, 969.5, 1519.0, 1519.0, 0.06647231428110192, 4.28891557096157, 0.038670417208732565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 210.14285714285714, 139, 1097, 141.0, 623.0, 1097.0, 1097.0, 0.06647262989464088, 1.4127195822432614, 0.038735515495244836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 142.5, 140, 145, 142.5, 145.0, 145.0, 145.0, 0.1647039446594746, 0.12240205262291032, 0.09248512517499793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 968.6666666666667, 139, 1944, 1404.5, 1802.7000000000003, 1944.0, 1944.0, 0.0898921294446664, 44.946932821239514, 0.04855501523172193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 258.41176470588243, 137, 1545, 142.0, 661.7999999999993, 1545.0, 1545.0, 0.09979571230657243, 5.3074544920545, 0.05816448167868128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 672.8333333333334, 139, 1316, 828.0, 1254.8000000000002, 1316.0, 1316.0, 0.0898912316097522, 14.694660866601414, 0.048642314674244166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 217.05882352941177, 137, 1111, 141.0, 576.5999999999995, 1111.0, 1111.0, 0.09979512647564706, 1.7513792456956014, 0.05826159641383278], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 731.0769230769231, 243, 2877, 516.0, 2056.1999999999994, 2877.0, 2877.0, 0.07300827801552269, 0.013189972102413764, 0.05033578542867091], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 444.92857142857144, 281, 1660, 294.0, 1111.0, 1660.0, 1660.0, 0.06642437584809695, 5.771780634388374, 0.14817602815444617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfd06c65-d90b-48e9-9060-bfc8f9c86c30", 3, 0, 0.0, 388.6666666666667, 292, 553, 321.0, 553.0, 553.0, 553.0, 0.04542288707870272, 0.02878852901765436, 0.02912860922690246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/994bf2ef-b17f-4b49-b805-e7b505f6b4e4", 3, 0, 0.0, 482.33333333333337, 255, 930, 262.0, 930.0, 930.0, 930.0, 0.029999100026999192, 0.025009015354539362, 0.019237704118876434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2658e3b-472b-475f-bc7b-29533c3455a2", 3, 0, 0.0, 426.0, 294, 633, 351.0, 633.0, 633.0, 633.0, 0.02355046865432622, 0.027835856667922692, 0.015102351318041229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0c32e67-98f5-4fc9-bd91-652c7ee72b9d", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 698.05, 152, 1415, 661.5, 1090.0, 1398.7499999999998, 1415.0, 0.09887040561583903, 0.060731919074573, 0.04470409941419285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 159.0, 137, 425, 142.5, 178.40000000000038, 425.0, 425.0, 0.08989033379277282, 0.06680326564091808, 0.045120733954575415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 222.16666666666666, 139, 440, 144.0, 439.1, 440.0, 440.0, 0.08989168052496742, 0.09906031981462338, 0.04707218426795711], "isController": false}, {"data": ["login", 20, 0, 0.0, 3080.1000000000004, 1851, 5042, 3087.0, 4137.5, 4996.9, 5042.0, 0.09795422599019478, 11.857751255650735, 0.16403506516404884], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 148.35294117647055, 140, 157, 149.0, 153.8, 157.0, 157.0, 0.09546217732380209, 0.07728334472796088, 0.03393382084557028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a5870bd-d2b4-4a4f-a075-1ce9f56900d8", 3, 0, 0.0, 438.66666666666663, 273, 769, 274.0, 769.0, 769.0, 769.0, 0.025451552968923652, 0.025526118065512297, 0.016321471142180858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02579d24-7692-48a0-8ad0-164272733309", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a924fef-45ed-4772-8b6a-a0b4567137f1", 3, 0, 0.0, 897.3333333333334, 235, 1713, 744.0, 1713.0, 1713.0, 1713.0, 0.018562633418927697, 0.02559008871391888, 0.011903772081799338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2350073-9e3a-45d5-b8d5-17127953885f", 2, 0, 0.0, 427.5, 320, 535, 427.5, 535.0, 535.0, 535.0, 0.03053668218948011, 0.03451778284601878, 0.018981052942972743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1130.3333333333335, 283, 2087, 1550.5, 1944.8000000000002, 2087.0, 2087.0, 0.08982708286548394, 59.76432866731542, 0.1892548250867081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/908a3182-6339-4719-95b0-e354a738686b", 3, 0, 0.0, 361.0, 235, 473, 375.0, 473.0, 473.0, 473.0, 0.04983057604145904, 0.03203625901102917, 0.031955154557836686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 577.1874999999999, 285, 1686, 297.0, 1576.1000000000001, 1686.0, 1686.0, 0.08544041865805142, 12.892919542493258, 0.18942491255707156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1695.5, 1658, 1733, 1695.5, 1733.0, 1733.0, 1733.0, 0.14560279557367503, 174.19156322801396, 0.32831724119103084], "isController": false}, {"data": ["register", 22, 2, 9.090909090909092, 1207.4999999999995, 210, 1644, 1264.0, 1532.1, 1628.6999999999998, 1644.0, 0.08788504635936195, 0.028213097268772445, 0.03965126115041526], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 180.55555555555557, 141, 432, 150.0, 425.7, 432.0, 432.0, 0.08850732398105943, 0.06871418219232642, 0.031461587821392224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 489.05882352941177, 283, 1987, 291.0, 1063.7999999999993, 1987.0, 1987.0, 0.09953394693084147, 7.149725586372046, 0.22235613868299026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10f5f6a9-3091-4e21-a5ec-340370e8ea62", 3, 0, 0.0, 345.3333333333333, 233, 526, 277.0, 526.0, 526.0, 526.0, 0.020488164670208843, 0.02457646055003893, 0.013138569140726374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 504.6666666666667, 281, 1398, 559.0, 900.3000000000008, 1398.0, 1398.0, 0.10808538745609031, 7.34196616889843, 0.24155019965772961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79e0d616-1abe-41ce-858b-f1ce30b50b0c", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 185.57142857142858, 139, 449, 140.0, 449.0, 449.0, 449.0, 0.039243167484232656, 0.029164111772950245, 0.01969823055360897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 181.7142857142857, 138, 416, 142.0, 416.0, 416.0, 416.0, 0.039245367644997614, 0.018921873685980993, 0.021911266924564795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 385.0, 139, 1578, 141.0, 1578.0, 1578.0, 1578.0, 0.03924602774133504, 5.053873276328479, 0.022590556704903512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 278.2857142857143, 139, 828, 142.0, 828.0, 828.0, 828.0, 0.03924558767464286, 1.657567618045121, 0.022628629165638806], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1597.8148148148148, 1107, 2519, 1521.0, 2197.5, 2357.5, 2519.0, 0.24543557997791082, 293.62628086693303, 0.48463939718294496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 2, 9.090909090909092, 1207.4999999999995, 210, 1644, 1264.0, 1532.1, 1628.6999999999998, 1644.0, 0.0891887070880698, 0.028631601991340586, 0.04023943620575024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 276.625, 137, 417, 275.5, 417.0, 417.0, 417.0, 0.0464134041911304, 0.012509862848390615, 0.027331330788331668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 176.0, 138, 432, 139.5, 432.0, 432.0, 432.0, 0.04641286564635717, 0.012509717693744706, 0.027285688592877944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 241.11111111111111, 137, 1649, 140.5, 541.1000000000017, 1649.0, 1649.0, 0.08887177284374861, 4.465232814729509, 0.051822581083149424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 211.1111111111111, 137, 1115, 141.0, 488.600000000001, 1115.0, 1115.0, 0.08887221163435997, 1.4743664614788334, 0.0519096262182899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 172.88888888888889, 138, 422, 141.5, 417.5, 422.0, 422.0, 0.08887089527552446, 0.06604565557097082, 0.04460902360509724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 209.00000000000003, 139, 417, 140.5, 417.0, 417.0, 417.0, 0.04641286564635717, 0.012419067565529164, 0.026469837438938073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 170.61111111111111, 137, 420, 140.0, 412.8, 420.0, 420.0, 0.08887177284374861, 0.031195766617787193, 0.05027002515564904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 247.12500000000006, 141, 428, 142.5, 428.0, 428.0, 428.0, 0.046337324135374496, 0.03443623404982421, 0.02325916465388915], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 667.8461538461539, 444, 1286, 627.0, 1143.6, 1286.0, 1286.0, 0.07351568994475012, 0.01328164320290896, 0.05003948817528402], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 187.625, 140, 466, 145.0, 466.0, 466.0, 466.0, 0.0470751613795376, 0.03705330085147198, 0.016733748771632508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1647.05, 885, 3601, 1505.5, 2660.5000000000014, 3556.8499999999995, 3601.0, 0.09953219866626854, 0.051515688762814774, 0.045780923409973126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 528.375, 280, 854, 423.5, 854.0, 854.0, 854.0, 0.04630004745754865, 0.07175603058118135, 0.10412989188938919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=994bf2ef-b17f-4b49-b805-e7b505f6b4e4", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["addBook", 62, 2, 3.225806451612903, 1441.693548387096, 716, 3541, 1123.5, 2550.4, 2808.1499999999996, 3541.0, 0.29004491017964074, 96.23009230562313, 1.0547432356965756], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 261.3888888888889, 138, 660, 147.5, 568.5, 591.25, 660.0, 0.24683570341318922, 0.18343942411859085, 0.1193199933491491], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 906.648148148148, 682, 1268, 839.0, 1151.5, 1236.5, 1268.0, 0.24675562054469022, 72.55434549785231, 0.12410072712940962], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 230.68518518518513, 138, 557, 146.0, 436.0, 445.5, 557.0, 0.24738187515461368, 0.4377499587696875, 0.12030876350292735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be08b5ea-c605-45c1-90a3-c0500b7b8c56", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1334.851851851852, 960, 1893, 1266.0, 1720.0, 1792.25, 1893.0, 0.24613589436212058, 221.47351040778793, 0.12354868134973632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 161.7777777777778, 140, 421, 144.5, 183.40000000000038, 421.0, 421.0, 0.10768319603725839, 0.08044691891455338, 0.03827801109136919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55cafe24-6538-41d1-84d4-9ce5b1808688", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.4303718834231806, 0.8041505222371967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 2, 1.1235955056179776, 222.23595505617985, 140, 2064, 151.0, 345.5, 444.4499999999981, 1349.0500000000072, 0.7522260396989405, 1.5412355167433684, 0.36588232971377377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 190.57142857142858, 139, 444, 149.0, 444.0, 444.0, 444.0, 0.040734619771420594, 0.03154546238157864, 0.014479884371872163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f29ea935-4a53-422e-b370-32f26fd003c3", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c1b859e-a0eb-4581-aa8d-1315df008a0c", 3, 0, 0.0, 679.0, 237, 1286, 514.0, 1286.0, 1286.0, 1286.0, 0.022300687604534474, 0.02251120841850957, 0.014300896673480765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 165.18750000000003, 140, 426, 148.5, 236.30000000000018, 426.0, 426.0, 0.08773180387555243, 0.07119641505916413, 0.03118591465888778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a5870bd-d2b4-4a4f-a075-1ce9f56900d8", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/737036d9-d0bc-4a1c-ae3d-76f91f6c4141", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 573.1428571428571, 280, 1718, 283.0, 1718.0, 1718.0, 1718.0, 0.039211951802909525, 6.753678833808545, 0.08675534928046069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2658e3b-472b-475f-bc7b-29533c3455a2", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 431.83333333333326, 281, 2067, 288.0, 965.4000000000017, 2067.0, 2067.0, 0.08880950853804748, 6.03260461482576, 0.1984722914333361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2543371-5aaf-47bb-9060-6d3d78154bbb", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfd06c65-d90b-48e9-9060-bfc8f9c86c30", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d7898db-0011-4e74-9730-53aad2c9ab00", 2, 0, 0.0, 427.5, 386, 469, 427.5, 469.0, 469.0, 469.0, 0.03131556696833996, 0.03622391511132684, 0.019465193725926158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 169.0, 141, 417, 147.5, 292.5, 417.0, 417.0, 0.0652346116210801, 0.05408611842411817, 0.023188865849680815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 164.94444444444449, 140, 454, 147.0, 194.8000000000004, 454.0, 454.0, 0.08931229532598987, 0.06933913553140816, 0.03174772997916046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02579d24-7692-48a0-8ad0-164272733309", 3, 0, 0.0, 410.3333333333333, 237, 501, 493.0, 501.0, 501.0, 501.0, 0.06282327811865224, 0.02842589732582246, 0.040287063116453414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0c32e67-98f5-4fc9-bd91-652c7ee72b9d", 3, 0, 0.0, 465.0, 285, 616, 494.0, 616.0, 616.0, 616.0, 0.017355486647845607, 0.023925939438029342, 0.011129657778729115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a924fef-45ed-4772-8b6a-a0b4567137f1", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=908a3182-6339-4719-95b0-e354a738686b", 1, 0, 0.0, 2877.0, 2877, 2877, 2877.0, 2877.0, 2877.0, 2877.0, 0.3475842891901286, 0.06279598974626348, 0.23964307438303792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 159.11111111111111, 139, 420, 143.0, 176.1000000000004, 420.0, 420.0, 0.10835605800660972, 0.08052632826467773, 0.05438966192909902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 204.50000000000003, 137, 462, 141.0, 419.70000000000005, 462.0, 462.0, 0.10835801488116738, 0.038035826621156295, 0.06129235368658046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 295.6111111111111, 139, 1255, 146.5, 501.7000000000012, 1255.0, 1255.0, 0.1081795780996454, 5.4353253744966645, 0.06308127742051807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 318.49999999999994, 139, 1109, 282.5, 493.400000000001, 1109.0, 1109.0, 0.10835866718839358, 1.7976415999458206, 0.06329152620172772], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 50.0, 0.15527950310559005], "isController": false}, {"data": ["401/Unauthorized", 2, 50.0, 0.15527950310559005], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 4, "406/Not Acceptable", 2, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
