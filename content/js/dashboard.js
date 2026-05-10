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

    var data = {"OkPercent": 98.75872769588828, "KoPercent": 1.2412723041117144};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7481678880746169, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6a9c23a-2362-42f1-8443-78ea54b841dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88c82f2b-d3bc-4d1a-9df6-65a0d7c34fe9"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfad394d-5a29-4af7-b7e8-787a5e8afe6e"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6078e1b-e73f-472f-966f-98be03d3fbbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/83462777-c7eb-4620-958d-80ac2ec774aa"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c69b855-8aa1-472c-9e08-e06557f6e600"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6b885af-c85c-4c99-aadd-8b062ed72f30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33d7e6fa-fc95-427f-b4a4-b3ecae5709e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/654c5d08-dbd0-485c-b803-17caeb29bf86"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=654c5d08-dbd0-485c-b803-17caeb29bf86"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36bbfdf0-cd1b-4155-9cab-cfdda4cacc63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/500650da-92ee-4f27-bd9b-199119512dd4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97b36b80-b565-4c82-8524-67d9c66e1953"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef1c412d-f2c2-450e-a662-93eb1a55145d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b09c5df5-e6cc-4688-ad01-e3b76db39aca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31b08df3-f14b-4fc9-b0b6-70e48828e24a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/edcc3ae9-fd4b-45b3-bf59-ff6ea3b1af87"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36bbfdf0-cd1b-4155-9cab-cfdda4cacc63"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83462777-c7eb-4620-958d-80ac2ec774aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6078e1b-e73f-472f-966f-98be03d3fbbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88c82f2b-d3bc-4d1a-9df6-65a0d7c34fe9"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6b885af-c85c-4c99-aadd-8b062ed72f30"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6a9c23a-2362-42f1-8443-78ea54b841dd"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c69b855-8aa1-472c-9e08-e06557f6e600"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9441176470588235, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b09c5df5-e6cc-4688-ad01-e3b76db39aca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97b36b80-b565-4c82-8524-67d9c66e1953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edcc3ae9-fd4b-45b3-bf59-ff6ea3b1af87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef1c412d-f2c2-450e-a662-93eb1a55145d"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33d7e6fa-fc95-427f-b4a4-b3ecae5709e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 16, 1.2412723041117144, 466.42901474010927, 127, 2609, 155.0, 1311.0, 1579.5, 2077.2999999999943, 5.034625254367703, 722.8372192251696, 3.677308386908412], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/c6a9c23a-2362-42f1-8443-78ea54b841dd", 3, 0, 0.0, 373.0, 241, 577, 301.0, 577.0, 577.0, 577.0, 0.03444514610482806, 0.0221449100120558, 0.022088846948734142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88c82f2b-d3bc-4d1a-9df6-65a0d7c34fe9", 3, 0, 0.0, 295.6666666666667, 220, 431, 236.0, 431.0, 431.0, 431.0, 0.08532908584106036, 0.040109114568519254, 0.0547194984071904], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2242.8749999999995, 1604, 3185, 2240.5, 2765.7000000000003, 2893.95, 3185.0, 0.2561803509670808, 308.27222453893256, 1.2596367842961445], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dfad394d-5a29-4af7-b7e8-787a5e8afe6e", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 618.4999999999999, 144, 1552, 520.5, 1332.0, 1552.0, 1552.0, 0.07394730726162557, 0.013963125052819504, 0.05000831081901924], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 618.4999999999999, 144, 1552, 520.5, 1332.0, 1552.0, 1552.0, 0.07407564181252513, 0.013987357867362271, 0.05009509956559927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6078e1b-e73f-472f-966f-98be03d3fbbd", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 191.15, 131, 417, 140.5, 400.0, 416.15, 417.0, 0.13854349226580956, 0.05787979100714191, 0.07784953657201836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 140.24999999999997, 132, 146, 140.5, 146.0, 146.0, 146.0, 0.13879539476880157, 0.10314774943267382, 0.0696687821398086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 279.65000000000003, 132, 1156, 141.5, 1043.2000000000014, 1153.8, 1156.0, 0.1378217275953554, 4.085848938772697, 0.07997428763394548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83462777-c7eb-4620-958d-80ac2ec774aa", 3, 0, 0.0, 656.6666666666667, 225, 1501, 244.0, 1501.0, 1501.0, 1501.0, 0.029640168356156262, 0.03503367555377715, 0.019007529837769477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 281.29999999999995, 128, 1325, 141.0, 1187.0000000000018, 1322.3, 1325.0, 0.13771259381670453, 12.424809461715899, 0.07977647524616127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c69b855-8aa1-472c-9e08-e06557f6e600", 3, 0, 0.0, 404.0, 218, 766, 228.0, 766.0, 766.0, 766.0, 0.032127481847972754, 0.02611403716614192, 0.020602584388185654], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 326.71428571428567, 139, 1227, 238.0, 843.5, 1227.0, 1227.0, 0.07340911951004657, 0.14213799800222326, 0.047452728131947654], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6b885af-c85c-4c99-aadd-8b062ed72f30", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 171.8235294117647, 133, 421, 142.0, 403.4, 421.0, 421.0, 0.11526283316043909, 0.08565919534677162, 0.05785653930123602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 215.5294117647059, 128, 432, 140.0, 407.2, 432.0, 432.0, 0.1150701250879948, 0.04095671501868198, 0.06505745468267721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1021.6, 666, 1146, 1116.0, 1146.0, 1146.0, 1146.0, 0.04170176565275774, 12.261703730848463, 0.0237830382238384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1428.8, 1092, 1677, 1393.0, 1677.0, 1677.0, 1677.0, 0.04151065578534009, 37.351361043598644, 0.023633508127786404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 253.4, 140, 419, 146.0, 419.0, 419.0, 419.0, 0.042047193770287775, 0.07440382335132953, 0.0232819910817902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33d7e6fa-fc95-427f-b4a4-b3ecae5709e5", 3, 0, 0.0, 352.6666666666667, 309, 431, 318.0, 431.0, 431.0, 431.0, 0.01548594908219942, 0.021348630977576347, 0.009930768128884392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 176.06249999999997, 134, 429, 142.0, 424.8, 429.0, 429.0, 0.08225375282747276, 0.06112803310713551, 0.04128752827472753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 202.6875, 131, 405, 139.5, 400.8, 405.0, 405.0, 0.08225332997465569, 0.029730482184442814, 0.04647835259432144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 240.93749999999997, 134, 1245, 139.0, 668.9000000000005, 1245.0, 1245.0, 0.08213552361396304, 4.639859992620636, 0.04784554671457905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/654c5d08-dbd0-485c-b803-17caeb29bf86", 3, 0, 0.0, 335.3333333333333, 259, 451, 296.0, 451.0, 451.0, 451.0, 0.019174597493240957, 0.023000778568552382, 0.012296209981017148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 309.875, 132, 1053, 143.0, 720.5000000000003, 1053.0, 1053.0, 0.08225671291893087, 1.5324228811184857, 0.04799647067291132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 195.6, 134, 423, 140.0, 423.0, 423.0, 423.0, 0.04194701253376734, 0.03117351224433296, 0.023554230670816627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1008.1249999999998, 134, 1795, 1415.0, 1697.7, 1795.0, 1795.0, 0.0849315504785362, 47.772058399066815, 0.045368709093514946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 257.17647058823525, 132, 1578, 140.0, 677.9999999999992, 1578.0, 1578.0, 0.11526830392861502, 6.130336297395615, 0.06718245701170313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 695.3750000000001, 134, 1357, 820.5, 1257.6000000000001, 1357.0, 1357.0, 0.0849315504785362, 15.616519286097237, 0.04545165006077914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 245.00000000000003, 131, 1123, 141.0, 564.5999999999995, 1123.0, 1123.0, 0.11506700961147963, 2.019396934648707, 0.06717750566874238], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 522.5, 149, 1484, 451.5, 1195.0, 1484.0, 1484.0, 0.07421464997190445, 0.014013606129599983, 0.05078961571389192], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=654c5d08-dbd0-485c-b803-17caeb29bf86", 1, 0, 0.0, 1484.0, 1484, 1484, 1484.0, 1484.0, 1484.0, 1484.0, 0.6738544474393532, 0.12174128200808626, 0.46459105458221023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 533.8125000000001, 271, 1386, 542.5, 1012.9000000000003, 1386.0, 1386.0, 0.08207527328501152, 6.256160654973504, 0.18327673024935492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36bbfdf0-cd1b-4155-9cab-cfdda4cacc63", 3, 0, 0.0, 614.0, 270, 1301, 271.0, 1301.0, 1301.0, 1301.0, 0.05448205724248148, 0.024651712098648845, 0.03493803801031527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/500650da-92ee-4f27-bd9b-199119512dd4", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97b36b80-b565-4c82-8524-67d9c66e1953", 3, 0, 0.0, 316.3333333333333, 219, 510, 220.0, 510.0, 510.0, 510.0, 0.019672647151400692, 0.027120332254616512, 0.012615597294355262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 680.2857142857142, 219, 1295, 655.0, 1183.2, 1287.8, 1295.0, 0.08567372182966432, 0.0526257529598231, 0.03873723946009236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 140.06249999999997, 134, 152, 137.0, 151.3, 152.0, 152.0, 0.08492569002123143, 0.06311372080679405, 0.04262871549893843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 255.25, 132, 431, 145.5, 423.3, 431.0, 431.0, 0.08493019799352407, 0.10245119831201233, 0.043978747544986464], "isController": false}, {"data": ["login", 21, 0, 0.0, 2808.1428571428564, 1524, 4651, 2486.0, 4358.2, 4622.299999999999, 4651.0, 0.08720350807255332, 24.959372346262292, 0.16600053957170618], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef1c412d-f2c2-450e-a662-93eb1a55145d", 1, 0, 0.0, 862.0, 862, 862, 862.0, 862.0, 862.0, 862.0, 1.160092807424594, 0.20958707946635732, 0.7998296113689095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 181.1176470588235, 136, 427, 147.0, 408.59999999999997, 427.0, 427.0, 0.110441245257523, 0.08940995343602204, 0.039258411400135126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b09c5df5-e6cc-4688-ad01-e3b76db39aca", 3, 0, 0.0, 418.0, 297, 497, 460.0, 497.0, 497.0, 497.0, 0.025801346830304543, 0.02150952123450844, 0.016545785565006493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31b08df3-f14b-4fc9-b0b6-70e48828e24a", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edcc3ae9-fd4b-45b3-bf59-ff6ea3b1af87", 3, 0, 0.0, 691.6666666666666, 349, 1227, 499.0, 1227.0, 1227.0, 1227.0, 0.03329079509515619, 0.027753166093325198, 0.021348589302557845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1150.4374999999998, 270, 1932, 1559.5, 1835.4, 1932.0, 1932.0, 0.08486127832908144, 63.5015640497128, 0.1772846578764526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 466.35, 274, 1460, 288.0, 1331.3000000000018, 1457.75, 1460.0, 0.13758091477550233, 16.65136168560697, 0.305902565196156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 1386.1666666666667, 139, 1817, 1632.5, 1817.0, 1817.0, 1817.0, 0.04963805584281283, 49.48919014994829, 0.09861362461220269], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1209.7391304347827, 318, 2071, 1220.0, 1914.4000000000003, 2060.0, 2071.0, 0.09060147562229427, 0.028682260624992614, 0.0408768376342773], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 511.1764705882354, 271, 1978, 291.0, 1050.7999999999993, 1978.0, 1978.0, 0.11495263275338603, 8.257281108210998, 0.25680106474876085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 165.84615384615384, 136, 422, 144.0, 315.19999999999993, 422.0, 422.0, 0.11345685584870091, 0.08808418007784885, 0.040330366727467905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36bbfdf0-cd1b-4155-9cab-cfdda4cacc63", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 568.4705882352941, 265, 1944, 294.0, 1873.6, 1944.0, 1944.0, 0.08052979128572918, 11.444431520366932, 0.17868935248126497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 138.5, 134, 146, 136.5, 146.0, 146.0, 146.0, 0.04203770782391805, 0.031240913724610974, 0.021100958810052615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83462777-c7eb-4620-958d-80ac2ec774aa", 1, 0, 0.0, 906.0, 906, 906, 906.0, 906.0, 906.0, 906.0, 1.1037527593818985, 0.19940845750551875, 0.7609857891832229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6078e1b-e73f-472f-966f-98be03d3fbbd", 3, 0, 0.0, 341.3333333333333, 223, 427, 374.0, 427.0, 427.0, 427.0, 0.06324443975967113, 0.028616462000632444, 0.04055714398650785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 137.83333333333334, 132, 153, 134.5, 153.0, 153.0, 153.0, 0.04203829688846539, 0.011248528659608903, 0.023974966194202918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 136.83333333333331, 132, 142, 136.5, 142.0, 142.0, 142.0, 0.04203623523477237, 0.01133007902812224, 0.024712708604817352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 135.5, 133, 141, 135.0, 141.0, 141.0, 141.0, 0.04203800235412813, 0.011330555322011097, 0.024754800214393812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 1.9793414429530203, 4.148752097315437], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1548.9642857142856, 1012, 2609, 1445.0, 2196.4, 2298.5, 2609.0, 0.25822159101388864, 308.9227952026117, 0.5098867744434402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88c82f2b-d3bc-4d1a-9df6-65a0d7c34fe9", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1209.7391304347827, 318, 2071, 1220.0, 1914.4000000000003, 2060.0, 2071.0, 0.09147129590964227, 0.028957624927916644, 0.041269276084233135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 217.0, 133, 451, 142.0, 451.0, 451.0, 451.0, 0.039333300555582866, 0.010601553665371946, 0.023162090073258274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 171.625, 133, 420, 135.0, 420.0, 420.0, 420.0, 0.03933291378225299, 0.010601449417872876, 0.023123451266519823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 203.46153846153845, 132, 429, 141.0, 425.8, 429.0, 429.0, 0.1208470448249577, 0.03257205505047688, 0.0710448447115474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 221.76923076923077, 133, 421, 144.0, 420.6, 421.0, 421.0, 0.1208852519992561, 0.032582353077924495, 0.07118535835503068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 136.625, 127, 141, 138.5, 141.0, 141.0, 141.0, 0.039334074125062686, 0.01052493780299529, 0.022432714149449817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 140.38461538461542, 129, 150, 142.0, 148.8, 150.0, 150.0, 0.12118387322302493, 0.09005949953390817, 0.060828623863901185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 138.625, 127, 145, 141.5, 145.0, 145.0, 145.0, 0.039334654322140984, 0.029232101503075477, 0.019744152657793425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 160.23076923076923, 127, 422, 140.0, 312.39999999999986, 422.0, 422.0, 0.12117257771356667, 0.03242313114601296, 0.0691062357272685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 180.99999999999997, 139, 405, 152.0, 405.0, 405.0, 405.0, 0.04136376327518278, 0.032557805859177065, 0.014703525226725127], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 693.0, 427, 1501, 499.0, 1421.0, 1501.0, 1501.0, 0.07349490906418367, 0.013277888844603495, 0.05002534337669533], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b6b885af-c85c-4c99-aadd-8b062ed72f30", 3, 0, 0.0, 580.0, 235, 1186, 319.0, 1186.0, 1186.0, 1186.0, 0.034082775701253114, 0.028413407737926177, 0.021856467490712444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6a9c23a-2362-42f1-8443-78ea54b841dd", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1529.142857142857, 961, 2328, 1350.0, 2278.8, 2325.9, 2328.0, 0.08606663196678647, 0.0445462059984344, 0.03958728872691057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 357.75, 270, 594, 284.5, 594.0, 594.0, 594.0, 0.03930663102865453, 0.060917601018041743, 0.08840153443260879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c69b855-8aa1-472c-9e08-e06557f6e600", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1396.6315789473679, 715, 2851, 1108.0, 2359.6000000000004, 2565.2999999999993, 2851.0, 0.2562707657999919, 87.02878019751957, 0.9303996910700878], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 249.01785714285714, 134, 619, 146.0, 547.5, 555.4, 619.0, 0.25974387398711485, 0.19303231260175233, 0.1255597828355682], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 887.3928571428567, 657, 1435, 820.5, 1180.4, 1234.4999999999998, 1435.0, 0.25962224962679303, 76.33756166028428, 0.13057173687285], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 224.82142857142858, 132, 572, 142.0, 424.0, 433.2, 572.0, 0.25994039937985647, 0.45997265984013663, 0.12641632704215677], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1298.5357142857144, 877, 2211, 1255.0, 1704.9, 1845.35, 2211.0, 0.2589152376240828, 232.97238593859086, 0.12996331263552593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 147.41176470588238, 131, 167, 148.0, 159.79999999999998, 167.0, 167.0, 0.08145039192012113, 0.06084916974501236, 0.028953069002855554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, 4.705882352941177, 209.00588235294123, 129, 2263, 147.0, 348.70000000000005, 420.4999999999999, 1075.8799999999867, 0.7198418041776231, 1.5553842843713874, 0.34510062964986044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 245.5, 143, 460, 155.5, 460.0, 460.0, 460.0, 0.04332880788006586, 0.03355443813368381, 0.015402037176117161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 171.35, 131, 422, 145.0, 377.2000000000005, 421.0, 422.0, 0.13812917840764682, 0.11209506568042434, 0.04910060638709321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b09c5df5-e6cc-4688-ad01-e3b76db39aca", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 280.0, 270, 290, 281.0, 290.0, 290.0, 290.0, 0.041996220340169386, 0.06508593914047736, 0.09445048383145517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97b36b80-b565-4c82-8524-67d9c66e1953", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edcc3ae9-fd4b-45b3-bf59-ff6ea3b1af87", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef1c412d-f2c2-450e-a662-93eb1a55145d", 3, 0, 0.0, 320.6666666666667, 222, 432, 308.0, 432.0, 432.0, 432.0, 0.044980883124672015, 0.0289183737536547, 0.028845162680860636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 387.7692307692308, 276, 571, 291.0, 567.8, 571.0, 571.0, 0.12070118101463269, 0.18706325612326377, 0.271459785035839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33d7e6fa-fc95-427f-b4a4-b3ecae5709e5", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 144.50000000000003, 137, 153, 144.0, 152.3, 153.0, 153.0, 0.08513445923655674, 0.07058511317562176, 0.03026263980674478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 145.1875, 133, 164, 143.5, 158.4, 164.0, 164.0, 0.08386095853075601, 0.06510689651557718, 0.029809950102729674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 156.52941176470588, 127, 427, 141.0, 206.19999999999982, 427.0, 427.0, 0.0805874349967528, 0.05988968557864149, 0.04045111483235443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 185.70588235294116, 133, 403, 141.0, 400.6, 403.0, 403.0, 0.08059278362733896, 0.03580564042818472, 0.045166773728648836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 360.52941176470586, 127, 1802, 141.0, 1730.0, 1802.0, 1802.0, 0.08059163743244525, 8.55051903088556, 0.046564262942068835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 283.11764705882354, 128, 840, 141.0, 836.0, 840.0, 840.0, 0.08058819904337068, 2.8068840098791648, 0.04664097572161992], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.3878975950349108], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07757951900698215], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.7757951900698216], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 16, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
