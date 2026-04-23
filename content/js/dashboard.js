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

    var data = {"OkPercent": 98.78234398782344, "KoPercent": 1.21765601217656};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8299409061063691, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4017857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eadec592-a464-4c1c-9cba-b7c45161a112"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a778fb7a-909e-44c4-9421-b5847e1c12dd"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=441bd22d-c74d-430b-a67c-df356c43fa9a"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b51ff8e4-8c32-44eb-803e-56cf78835256"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39a3e2a5-fbf4-4724-9247-92d3079d5495"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6cb8f4f-8112-46ac-8ebc-41440b54ad73"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45c11ead-58ee-444f-9b44-2325747c3667"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6cb8f4f-8112-46ac-8ebc-41440b54ad73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a621847-20b1-4de0-b14a-0bb7f41468a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bedb9141-7448-4416-a99d-fc30f612c9c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/833d3371-cd82-42f5-b7f9-aa97e4022eb2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75f8a9b0-e370-4958-bb68-4ce813a4e342"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=475101a9-430c-45fb-84c4-588762fa14ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d996de1-1496-4899-91a4-50f06bf2e555"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e955a823-cb5b-44ed-8e98-57aec36190c9"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a778fb7a-909e-44c4-9421-b5847e1c12dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45c11ead-58ee-444f-9b44-2325747c3667"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/599bd86d-0ae1-45f9-bb7f-490f4486c5e1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/441bd22d-c74d-430b-a67c-df356c43fa9a"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eadec592-a464-4c1c-9cba-b7c45161a112"], "isController": false}, {"data": [0.4016393442622951, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8392857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d4d25a1-4711-45ef-bece-68b45e82d951"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9550561797752809, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d4d25a1-4711-45ef-bece-68b45e82d951"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a621847-20b1-4de0-b14a-0bb7f41468a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bedb9141-7448-4416-a99d-fc30f612c9c1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/475101a9-430c-45fb-84c4-588762fa14ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75f8a9b0-e370-4958-bb68-4ce813a4e342"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e955a823-cb5b-44ed-8e98-57aec36190c9"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 16, 1.21765601217656, 288.0327245053272, 77, 1825, 90.0, 796.0, 996.5, 1327.199999999999, 5.061535794765124, 712.9622933759942, 3.701322532067949], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1338.3214285714287, 991, 1818, 1333.0, 1649.0, 1703.1499999999999, 1818.0, 0.25411115547972557, 305.78154193713243, 1.2494625662504084], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eadec592-a464-4c1c-9cba-b7c45161a112", 3, 0, 0.0, 364.6666666666667, 301, 405, 388.0, 405.0, 405.0, 405.0, 0.031223330072229966, 0.026029605571282866, 0.020022773516371432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a778fb7a-909e-44c4-9421-b5847e1c12dd", 3, 0, 0.0, 641.3333333333334, 180, 1050, 694.0, 1050.0, 1050.0, 1050.0, 0.021642054840966967, 0.02558017614829136, 0.013878531261948218], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 497.0000000000001, 83, 835, 496.5, 767.2000000000003, 835.0, 835.0, 0.10244677036556422, 0.019483895047552376, 0.06922326939658852], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 497.0000000000001, 83, 835, 496.5, 767.2000000000003, 835.0, 835.0, 0.1049501486793773, 0.01996000142119993, 0.07091480179727129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 132.35294117647055, 77, 350, 80.0, 262.7999999999999, 350.0, 350.0, 0.13349247730627886, 0.035719666779219145, 0.07613242846373716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 90.05882352941177, 78, 237, 80.0, 117.7999999999999, 237.0, 237.0, 0.13349038084020415, 0.09920525372987829, 0.0670059138201806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 104.41176470588235, 77, 351, 80.0, 257.3999999999999, 351.0, 351.0, 0.13349247730627886, 0.03598039427395797, 0.07860933966375601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 125.64705882352939, 77, 242, 80.0, 239.6, 242.0, 242.0, 0.13349352556401015, 0.03598067681217461, 0.0784795921772794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=441bd22d-c74d-430b-a67c-df356c43fa9a", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 228.07692307692307, 79, 427, 180.0, 398.2, 427.0, 427.0, 0.08901183172655565, 0.2012528629286262, 0.057538071815430546], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b51ff8e4-8c32-44eb-803e-56cf78835256", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39a3e2a5-fbf4-4724-9247-92d3079d5495", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 80.5, 78, 83, 80.5, 82.0, 82.95, 83.0, 0.10288277536574827, 0.07645878130208442, 0.05164233060351037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 90.85, 78, 238, 80.0, 141.30000000000013, 233.49999999999994, 238.0, 0.1028843631200712, 0.0275296049754878, 0.058676238341915606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 479.2, 393, 620, 460.0, 620.0, 620.0, 620.0, 0.0751156781443423, 22.08650344968752, 0.04283941019169522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 861.8, 839, 928, 847.0, 928.0, 928.0, 928.0, 0.07486935297905155, 67.36757541683512, 0.04262581326834673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 174.2, 79, 240, 234.0, 240.0, 240.0, 240.0, 0.07555380942307112, 0.1336948268306688, 0.04183497064734504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 81.07142857142857, 78, 87, 81.0, 85.0, 87.0, 87.0, 0.07548146390907719, 0.05609511136211693, 0.03788815668873601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 79.35714285714285, 78, 84, 79.0, 82.5, 84.0, 84.0, 0.07548349876800146, 0.020197733068781643, 0.04304918289112584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 90.28571428571428, 78, 235, 79.0, 158.0, 235.0, 235.0, 0.07548309178743962, 0.020345052083333332, 0.04437580200785024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 101.42857142857143, 78, 236, 79.0, 234.0, 236.0, 236.0, 0.07548309178743962, 0.020345052083333332, 0.04444951596467391], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 79.8, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.07572774361615121, 0.05627813758973738, 0.04252290290945991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 516.8947368421053, 79, 1101, 694.0, 1006.0, 1101.0, 1101.0, 0.08695055259364345, 41.189132825549734, 0.04718461833283757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 98.6, 78, 238, 79.5, 226.2000000000002, 237.85, 238.0, 0.10280186482582794, 0.027708315128836435, 0.0604362525636215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 375.73684210526324, 78, 716, 464.0, 715.0, 716.0, 716.0, 0.0869497567694962, 13.4669513699163, 0.04726909834246306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 114.05000000000001, 78, 240, 80.0, 234.9, 239.75, 240.0, 0.10280292165903356, 0.027708599978411387, 0.06053726734413792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6cb8f4f-8112-46ac-8ebc-41440b54ad73", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 414.5, 104, 820, 390.0, 763.3000000000002, 820.0, 820.0, 0.10526962181888361, 0.020020760594948814, 0.07195308867649769], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/45c11ead-58ee-444f-9b44-2325747c3667", 3, 0, 0.0, 342.3333333333333, 180, 483, 364.0, 483.0, 483.0, 483.0, 0.06708707902857909, 0.030355156201082336, 0.043021336486426046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6cb8f4f-8112-46ac-8ebc-41440b54ad73", 3, 0, 0.0, 290.6666666666667, 158, 456, 258.0, 456.0, 456.0, 456.0, 0.030366216571856588, 0.03045518009696945, 0.01947312716359293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 183.6428571428571, 158, 315, 163.0, 314.0, 315.0, 315.0, 0.07544892108042855, 0.11693109155726572, 0.1696863918439716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a621847-20b1-4de0-b14a-0bb7f41468a4", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bedb9141-7448-4416-a99d-fc30f612c9c1", 3, 0, 0.0, 407.3333333333333, 386, 427, 409.0, 427.0, 427.0, 427.0, 0.025858502275548197, 0.025934259606433595, 0.01658243798269204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/833d3371-cd82-42f5-b7f9-aa97e4022eb2", 2, 0, 0.0, 181.5, 181, 182, 181.5, 182.0, 182.0, 182.0, 0.018694034733516537, 0.026644476263249395, 0.011619876081917259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 546.5238095238095, 143, 1118, 518.0, 1018.0, 1109.1999999999998, 1118.0, 0.09460823181719888, 0.05811384552052548, 0.04277696419078426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 97.42105263157895, 78, 241, 80.0, 240.0, 241.0, 241.0, 0.0869497567694962, 0.06461793447420566, 0.04364470212843852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75f8a9b0-e370-4958-bb68-4ce813a4e342", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 147.1578947368421, 78, 244, 82.0, 243.0, 244.0, 244.0, 0.08695055259364345, 0.09200062066677345, 0.04574557238633504], "isController": false}, {"data": ["login", 21, 0, 0.0, 2237.9523809523807, 1375, 3717, 2326.0, 2804.8, 3631.3999999999987, 3717.0, 0.09179766047105313, 26.274309816830883, 0.1747459650010491], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 93.15, 81, 250, 83.0, 103.60000000000002, 242.7499999999999, 250.0, 0.1004893832966547, 0.08135322143840502, 0.035720835468732726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=475101a9-430c-45fb-84c4-588762fa14ff", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d996de1-1496-4899-91a4-50f06bf2e555", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 628.2105263157895, 162, 1183, 775.0, 1087.0, 1183.0, 1183.0, 0.08691753812935159, 54.79201458699301, 0.1837750188130724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 269.8235294117647, 159, 475, 313.0, 442.2, 475.0, 475.0, 0.13340552926681892, 0.2067525145961344, 0.3000321620131679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 695.5714285714286, 79, 1008, 926.0, 1008.0, 1008.0, 1008.0, 0.10468855155911164, 89.46793445748898, 0.18843355081133628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e955a823-cb5b-44ed-8e98-57aec36190c9", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 908.6818181818182, 136, 1531, 981.5, 1328.6, 1509.5499999999997, 1531.0, 0.09143009130541391, 0.028766711966120993, 0.04125068572568479], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 89.8, 80, 159, 83.0, 126.00000000000003, 159.0, 159.0, 0.07570519388100153, 0.05877502845253536, 0.02691083063738726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 204.3, 161, 321, 163.5, 317.8, 320.85, 321.0, 0.10275802540178387, 0.15925486944592873, 0.2311052075198323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 313.72222222222223, 159, 1330, 166.5, 900.7000000000007, 1330.0, 1330.0, 0.07780015732920705, 10.448959584979383, 0.17276261064911266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a778fb7a-909e-44c4-9421-b5847e1c12dd", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45c11ead-58ee-444f-9b44-2325747c3667", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.038299209770115, 3.9623742816091956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.625, 78, 91, 80.5, 91.0, 91.0, 91.0, 0.04033233846898444, 0.0299735445067355, 0.020244943333064452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 79.625, 78, 82, 79.5, 82.0, 82.0, 82.0, 0.04033254180720037, 0.010792105913254786, 0.02300215274941896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 99.25, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.04033254180720037, 0.010870880408971974, 0.023711123210873652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 79.25, 77, 82, 79.5, 82.0, 82.0, 82.0, 0.04033294848978316, 0.010870990022636869, 0.023750749940760985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 924.4999999999999, 622, 1477, 857.5, 1320.6000000000001, 1367.25, 1477.0, 0.23575969351239842, 282.0505567717762, 0.46553330105670865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 908.6818181818182, 136, 1531, 981.5, 1328.6, 1509.5499999999997, 1531.0, 0.09146544269274264, 0.028777834597219453, 0.041266635277389746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 130.5, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.032703963720402913, 0.008814740221514848, 0.0192582911361357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 157.66666666666666, 79, 238, 157.0, 238.0, 238.0, 238.0, 0.03267582315844507, 0.008807155460674647, 0.019209810099007744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/599bd86d-0ae1-45f9-bb7f-490f4486c5e1", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/441bd22d-c74d-430b-a67c-df356c43fa9a", 3, 0, 0.0, 348.6666666666667, 244, 515, 287.0, 515.0, 515.0, 515.0, 0.01879899488040706, 0.025915932069832, 0.012055345024219372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 271.0, 77, 852, 80.0, 851.4, 852.0, 852.0, 0.07628191762569989, 18.318705216157525, 0.04309729695024893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 224.60000000000002, 77, 627, 81.0, 625.2, 627.0, 627.0, 0.07628230555640314, 5.996285846326753, 0.04317201056001383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 80.6, 79, 86, 80.0, 83.6, 86.0, 86.0, 0.07628075385726346, 0.05668911492712646, 0.038289362776009195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 157.16666666666666, 78, 237, 157.0, 237.0, 237.0, 237.0, 0.03267635702187682, 0.008743478343744384, 0.018635734864039126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 137.93333333333337, 78, 317, 82.0, 271.40000000000003, 317.0, 317.0, 0.07628230555640314, 0.05096412888149798, 0.04179634658611255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 158.5, 80, 241, 157.5, 241.0, 241.0, 241.0, 0.032703607207875025, 0.024304145591008686, 0.016415677836765393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 85.33333333333333, 84, 88, 85.0, 88.0, 88.0, 88.0, 0.033653980985500744, 0.026489363939759373, 0.011962938553439717], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 465.75, 79, 729, 432.5, 718.5, 729.0, 729.0, 0.10132482204828128, 0.019039633309690874, 0.06895991917234508], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1204.047619047619, 707, 1825, 1209.0, 1805.8, 1824.2, 1825.0, 0.09350038735874763, 0.0483937551759143, 0.04300652582614271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 343.1666666666667, 161, 478, 394.0, 478.0, 478.0, 478.0, 0.03266123764316509, 0.05061853919892871, 0.07345588895723555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eadec592-a464-4c1c-9cba-b7c45161a112", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 869.4262295081969, 408, 2380, 688.0, 1504.2, 1646.3, 2380.0, 0.29735355337496283, 94.4346786448965, 1.0814578885216655], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 140.9464285714286, 78, 430, 81.5, 323.8, 329.45, 430.0, 0.2364575284276841, 0.17572673743502695, 0.11430319977705433], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 495.14285714285717, 386, 732, 465.5, 629.6, 691.65, 732.0, 0.23619323981205764, 69.44865485841059, 0.11878859228829072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d4d25a1-4711-45ef-bece-68b45e82d951", 3, 0, 0.0, 407.66666666666663, 159, 729, 335.0, 729.0, 729.0, 729.0, 0.024345511499196597, 0.0244168362399169, 0.01561219324655511], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 131.96428571428572, 78, 326, 82.0, 242.0, 255.69999999999987, 326.0, 0.23657939984875817, 0.41863464113862286, 0.11505521594207185], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 780.6250000000001, 541, 1235, 721.5, 1007.7, 1050.7, 1235.0, 0.23612352633620617, 212.46436405820447, 0.11852294193047849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 93.72222222222223, 81, 239, 84.0, 107.60000000000021, 239.0, 239.0, 0.0773242377118899, 0.057766642431245865, 0.027486350124148358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 6, 3.3707865168539324, 151.23033707865164, 78, 1257, 87.0, 265.69999999999993, 331.4499999999998, 1211.9700000000005, 0.7167563954401407, 1.5044169043271147, 0.34627837202676964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 83.375, 81, 87, 82.5, 87.0, 87.0, 87.0, 0.04109180937509631, 0.03182207503364392, 0.014606854113803766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d4d25a1-4711-45ef-bece-68b45e82d951", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 84.47058823529412, 80, 102, 83.0, 91.6, 102.0, 102.0, 0.12758165225744475, 0.10353550100189121, 0.04535129045088857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 182.5, 158, 327, 162.5, 327.0, 327.0, 327.0, 0.040315874879682315, 0.062481731869195145, 0.09067134750772302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a621847-20b1-4de0-b14a-0bb7f41468a4", 3, 0, 0.0, 437.6666666666667, 311, 641, 361.0, 641.0, 641.0, 641.0, 0.02515195975686439, 0.025225647138964576, 0.01612934919304129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bedb9141-7448-4416-a99d-fc30f612c9c1", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 384.26666666666665, 160, 935, 170.0, 933.2, 935.0, 935.0, 0.07625012072935783, 24.412434242213592, 0.16628582643693351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/475101a9-430c-45fb-84c4-588762fa14ff", 3, 0, 0.0, 346.3333333333333, 179, 451, 409.0, 451.0, 451.0, 451.0, 0.02567833604382436, 0.025753565543952753, 0.016466901694770178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 136.71428571428575, 79, 332, 84.5, 291.0, 332.0, 332.0, 0.07719793550663902, 0.06400492895032864, 0.02744145363712559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 92.31578947368419, 81, 240, 83.0, 98.0, 240.0, 240.0, 0.08627540015892837, 0.06698138977182427, 0.03066820865024407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 89.61111111111111, 78, 234, 81.0, 101.70000000000022, 234.0, 234.0, 0.07782740475871343, 0.0578385302943173, 0.03906570902927607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 96.94444444444444, 77, 236, 79.5, 234.2, 236.0, 236.0, 0.0778294238460707, 0.03381391200951248, 0.043660820451843045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75f8a9b0-e370-4958-bb68-4ce813a4e342", 3, 0, 0.0, 296.3333333333333, 168, 518, 203.0, 518.0, 518.0, 518.0, 0.0414696856597827, 0.034571570629786295, 0.02659351586906638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 209.38888888888889, 79, 1095, 80.0, 805.2000000000005, 1095.0, 1095.0, 0.07782908732423598, 7.799840950314775, 0.04501183110223283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e955a823-cb5b-44ed-8e98-57aec36190c9", 3, 0, 0.0, 303.0, 184, 370, 355.0, 370.0, 370.0, 370.0, 0.03028467595396729, 0.03037340059055118, 0.019420837118917827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 179.11111111111114, 78, 620, 82.5, 478.7000000000002, 620.0, 620.0, 0.0778294238460707, 2.5613616095557235, 0.04508803102367311], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.45662100456621], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.076103500761035], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.076103500761035], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.60882800608828], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
