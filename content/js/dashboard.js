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

    var data = {"OkPercent": 98.1651376146789, "KoPercent": 1.834862385321101};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.738173455978975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b13785e4-6c48-4aa4-b944-06c0f3fff434"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11cc9aac-91de-4be0-9b14-75db0b0dd070"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab6d64b9-39bd-4ef4-a74a-31a7eb62f096"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2faf048e-8016-4781-ba82-48fe421f66b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ed6708a-3bae-4798-80f2-aeabbcf73977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c7adb89-1366-487c-a2a2-d7f85d060446"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c695ddf-8344-4f2c-913c-90c5702cf65d"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cf27cf30-b32c-482c-bbba-430405e4eda5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fadcaeff-424f-468f-b483-6fffd041bdbf"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd356026-2251-40f2-bb45-adbc87e4bbf0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da781e6d-960b-412a-a8bd-fd02f2485fa8"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f88d5fb-f58d-4327-9b91-8562749fe570"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6c45731-1c5d-4aff-ab4a-fed784b21437"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11cc9aac-91de-4be0-9b14-75db0b0dd070"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/2faf048e-8016-4781-ba82-48fe421f66b3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b13785e4-6c48-4aa4-b944-06c0f3fff434"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c7adb89-1366-487c-a2a2-d7f85d060446"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/41f653f3-e761-49ea-8569-3af5e6cbf3ec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9418604651162791, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ed6708a-3bae-4798-80f2-aeabbcf73977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fadcaeff-424f-468f-b483-6fffd041bdbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd356026-2251-40f2-bb45-adbc87e4bbf0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/da781e6d-960b-412a-a8bd-fd02f2485fa8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87004b5b-5ef5-421d-b4a9-466a6ae1413f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf27cf30-b32c-482c-bbba-430405e4eda5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f88d5fb-f58d-4327-9b91-8562749fe570"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c695ddf-8344-4f2c-913c-90c5702cf65d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6c45731-1c5d-4aff-ab4a-fed784b21437"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 24, 1.834862385321101, 458.63302752293527, 127, 4777, 146.5, 1311.0, 1572.7499999999998, 2041.750000000002, 5.181901377482499, 742.7325275486595, 3.791538716191857], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2206.946428571429, 1608, 3274, 2147.0, 2650.8, 2946.95, 3274.0, 0.24716314091388572, 297.4199536927718, 1.2152992329115377], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b13785e4-6c48-4aa4-b944-06c0f3fff434", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11cc9aac-91de-4be0-9b14-75db0b0dd070", 3, 0, 0.0, 389.0, 220, 720, 227.0, 720.0, 720.0, 720.0, 0.021589723291713145, 0.021652974434169334, 0.013844972293188441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab6d64b9-39bd-4ef4-a74a-31a7eb62f096", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 517.2142857142857, 136, 830, 571.0, 744.5, 830.0, 830.0, 0.07539285060368132, 0.014851381843247495, 0.05072819733001605], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 517.2142857142857, 136, 830, 571.0, 744.5, 830.0, 830.0, 0.07650315029043873, 0.015070096011453616, 0.05147526420909404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 184.46666666666667, 129, 400, 132.0, 395.2, 400.0, 400.0, 0.10215548064153641, 0.03756342152756495, 0.057688583273742634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 132.93333333333334, 131, 135, 133.0, 135.0, 135.0, 135.0, 0.10215687209278568, 0.07591931607676748, 0.051277961187199066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 273.3999999999999, 131, 1191, 135.0, 717.0000000000002, 1191.0, 1191.0, 0.10215548064153641, 2.0281720340858786, 0.05957074479858344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 262.33333333333337, 130, 1291, 134.0, 755.2000000000003, 1291.0, 1291.0, 0.10215687209278568, 6.153761043583527, 0.05947179363630792], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 296.2857142857143, 133, 1012, 252.5, 682.0, 1012.0, 1012.0, 0.0757284809407641, 0.1606747492170216, 0.0489467148714509], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2faf048e-8016-4781-ba82-48fe421f66b3", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ed6708a-3bae-4798-80f2-aeabbcf73977", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 133.60000000000002, 131, 136, 134.0, 136.0, 136.0, 136.0, 0.10648039695891987, 0.07913240438060352, 0.05344816800477032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 168.13333333333333, 131, 392, 133.0, 391.4, 392.0, 392.0, 0.1064773735581189, 0.03915261756876664, 0.06012921472937001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 879.7142857142857, 657, 1048, 793.0, 1048.0, 1048.0, 1048.0, 0.06259053273484862, 18.403694825327708, 0.035696163200343356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1367.2857142857142, 928, 1714, 1320.0, 1714.0, 1714.0, 1714.0, 0.062295869783833335, 56.05393313595184, 0.03546727742575667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 246.14285714285714, 131, 400, 132.0, 400.0, 400.0, 400.0, 0.06281012499214873, 0.11114447899001319, 0.03477865319389486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 195.30769230769232, 132, 400, 134.0, 398.8, 400.0, 400.0, 0.07126255317282813, 0.05295976852004122, 0.03577046126057975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 213.9230769230769, 130, 399, 133.0, 398.6, 399.0, 399.0, 0.07126294381739146, 0.027301758824271063, 0.040181765046074236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 313.53846153846155, 131, 1426, 133.0, 1015.5999999999997, 1426.0, 1426.0, 0.07115996212100477, 4.943078231141241, 0.04136386620284968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 264.0, 131, 1055, 133.0, 792.1999999999998, 1055.0, 1055.0, 0.07116113069562742, 1.6272228445019816, 0.04143403876365746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 133.57142857142858, 132, 135, 134.0, 135.0, 135.0, 135.0, 0.06296039790971479, 0.04678990508720015, 0.035353739060630864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 814.7142857142859, 128, 1950, 533.0, 1583.2, 1913.3999999999994, 1950.0, 0.10840723953870138, 46.46531702342113, 0.05929529164128561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 221.4, 131, 1199, 133.0, 716.0000000000002, 1199.0, 1199.0, 0.10647812939222284, 6.414066437472493, 0.06198746308758181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 606.2857142857141, 131, 1199, 532.0, 1167.6, 1195.8999999999999, 1199.0, 0.10840779916680862, 15.194111262537879, 0.05940146473132934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 211.46666666666667, 131, 1043, 134.0, 651.8000000000002, 1043.0, 1043.0, 0.10647964109262309, 2.1140229472499854, 0.062092327165795894], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 418.2857142857143, 136, 651, 431.5, 636.5, 651.0, 651.0, 0.076568003325239, 0.015082871190741835, 0.052010268999803114], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 551.0, 264, 1560, 531.0, 1255.5999999999997, 1560.0, 1560.0, 0.07110780490206267, 6.645545711378889, 0.1585236122354653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c7adb89-1366-487c-a2a2-d7f85d060446", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c695ddf-8344-4f2c-913c-90c5702cf65d", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 625.4545454545455, 176, 2232, 490.5, 1231.6, 2085.449999999998, 2232.0, 0.09726465269887305, 0.05974557280038198, 0.043978060741775606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 146.52380952380952, 128, 394, 134.0, 144.20000000000002, 369.19999999999965, 394.0, 0.10863099086982386, 0.08073064848821872, 0.054527665338954555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 182.90476190476193, 129, 399, 133.0, 395.8, 398.7, 399.0, 0.10863155281045346, 0.10676242732031824, 0.05760947862027582], "isController": false}, {"data": ["login", 22, 0, 0.0, 3194.136363636364, 1821, 7264, 2958.5, 4548.5, 6864.549999999994, 7264.0, 0.09689410355337104, 37.01409379101484, 0.19731506989588288], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cf27cf30-b32c-482c-bbba-430405e4eda5", 3, 0, 0.0, 1000.3333333333334, 330, 1841, 830.0, 1841.0, 1841.0, 1841.0, 0.03509182360510001, 0.029254609457246464, 0.022503545736343434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 137.33333333333331, 132, 151, 137.0, 145.6, 151.0, 151.0, 0.10559587753694097, 0.08548728757629302, 0.037536034593209484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fadcaeff-424f-468f-b483-6fffd041bdbf", 3, 0, 0.0, 311.6666666666667, 255, 421, 259.0, 421.0, 421.0, 421.0, 0.018045872608169967, 0.02132961049487798, 0.011572385754588164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 963.3333333333336, 265, 2088, 928.0, 1719.6, 2051.2999999999993, 2088.0, 0.10833174274822156, 61.80338518157174, 0.23044172751729441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd356026-2251-40f2-bb45-adbc87e4bbf0", 3, 0, 0.0, 409.3333333333333, 222, 613, 393.0, 613.0, 613.0, 613.0, 0.02493869238122948, 0.02501175495656511, 0.015992585934577495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da781e6d-960b-412a-a8bd-fd02f2485fa8", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 466.8, 263, 1422, 524.0, 891.0000000000003, 1422.0, 1422.0, 0.10206233967707476, 8.287767637222816, 0.22779968692377306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 1004.3636363636364, 133, 1848, 1320.0, 1840.4, 1848.0, 1848.0, 0.09705653984612127, 73.89976623711794, 0.16265414618920732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f88d5fb-f58d-4327-9b91-8562749fe570", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6c45731-1c5d-4aff-ab4a-fed784b21437", 3, 0, 0.0, 377.0, 248, 479, 404.0, 479.0, 479.0, 479.0, 0.03782291312076856, 0.031531406413505304, 0.024254928010388695], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1134.130434782609, 208, 1998, 1219.0, 1866.6000000000004, 1986.9999999999998, 1998.0, 0.0892247532741605, 0.02797365736143008, 0.04025569923111538], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 140.70588235294122, 132, 180, 138.0, 165.6, 180.0, 180.0, 0.07810633488320805, 0.060639195539209385, 0.027764361228015365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 392.0, 266, 1330, 269.0, 850.0000000000002, 1330.0, 1330.0, 0.106377697561114, 8.638187621004631, 0.23743141962810357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11cc9aac-91de-4be0-9b14-75db0b0dd070", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 441.375, 265, 672, 528.0, 577.5000000000001, 672.0, 672.0, 0.08174609662388621, 0.12669048373252675, 0.1838488872312597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 213.42857142857144, 131, 431, 134.0, 431.0, 431.0, 431.0, 0.03938403371273286, 0.02926879849159151, 0.019768938797211612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 207.42857142857144, 131, 394, 134.0, 394.0, 394.0, 394.0, 0.03938492007674433, 0.010538543067410104, 0.02246171223126825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 169.28571428571428, 131, 391, 133.0, 391.0, 391.0, 391.0, 0.03938447688975159, 0.01061534728669086, 0.02315376473401412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 170.28571428571428, 130, 389, 134.0, 389.0, 389.0, 389.0, 0.03938447688975159, 0.01061534728669086, 0.023192226137226768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2faf048e-8016-4781-ba82-48fe421f66b3", 2, 0, 0.0, 628.5, 245, 1012, 628.5, 1012.0, 1012.0, 1012.0, 0.01383728733819022, 0.023647707853352427, 0.008601009170662184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 138.0, 136, 140, 138.0, 140.0, 140.0, 140.0, 0.030324165327349367, 0.008943259696151864, 0.018745309230675928], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1552.1428571428569, 1041, 2738, 1461.0, 2108.2000000000003, 2389.85, 2738.0, 0.24959663401110704, 298.604348107077, 0.49285585348677585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1134.130434782609, 208, 1998, 1219.0, 1866.6000000000004, 1986.9999999999998, 1998.0, 0.09171165854553284, 0.028753349469268618, 0.04137772094534783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 133.10000000000002, 130, 141, 132.0, 140.3, 141.0, 141.0, 0.054174996072312784, 0.014601854410115555, 0.03190187756992638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 159.89999999999998, 132, 392, 134.0, 366.80000000000007, 392.0, 392.0, 0.05417411560756271, 0.014601617097350885, 0.0318484546833523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b13785e4-6c48-4aa4-b944-06c0f3fff434", 3, 0, 0.0, 307.3333333333333, 241, 423, 258.0, 423.0, 423.0, 423.0, 0.060410793395086586, 0.03883831932138542, 0.03873999446234394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 363.6470588235294, 131, 1585, 134.0, 1465.0, 1585.0, 1585.0, 0.07834967922719564, 8.312654322943551, 0.04526890358841531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 279.1764705882353, 129, 1179, 133.0, 869.3999999999997, 1179.0, 1179.0, 0.07835112364729088, 2.7289667560791253, 0.04534625291512269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 150.17647058823533, 131, 396, 134.0, 193.59999999999982, 396.0, 396.0, 0.07834823486035579, 0.05822559250852614, 0.03932714132638953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 158.69999999999996, 130, 394, 132.5, 368.2000000000001, 394.0, 394.0, 0.054174996072312784, 0.01449604387091182, 0.030896677447490885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 163.35294117647058, 130, 400, 133.0, 392.8, 400.0, 400.0, 0.07835076253727423, 0.034809558677807835, 0.04391027339807257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 159.89999999999998, 132, 389, 134.5, 363.80000000000007, 389.0, 389.0, 0.054174702580882826, 0.04026069205473812, 0.027193161256419702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 188.60000000000002, 134, 402, 136.0, 401.5, 402.0, 402.0, 0.05212106681399555, 0.04102498032429728, 0.01852741046903748], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 516.8461538461539, 133, 998, 479.0, 930.8, 998.0, 998.0, 0.07268823457052435, 0.014104094793844984, 0.049465348330407166], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1779.6363636363637, 991, 4777, 1432.0, 3437.2999999999997, 4589.949999999997, 4777.0, 0.0980274209431129, 0.05073684873032211, 0.04508878443770135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 321.3, 266, 784, 270.0, 733.2000000000002, 784.0, 784.0, 0.05413511040855768, 0.08389884786951272, 0.12175113210049641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c7adb89-1366-487c-a2a2-d7f85d060446", 3, 0, 0.0, 511.0, 215, 998, 320.0, 998.0, 998.0, 998.0, 0.018235751799260843, 0.02513945601232737, 0.011694150730645789], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 1339.2758620689656, 666, 3299, 1112.5, 2353.6, 2531.2999999999997, 3299.0, 0.27246932371234756, 85.3766422295742, 0.9901969765300562], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 250.9642857142857, 129, 571, 136.0, 535.9, 549.65, 571.0, 0.2506086209365602, 0.18624332083273665, 0.121143815784763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41f653f3-e761-49ea-8569-3af5e6cbf3ec", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.5682134119217082, 1.0617076290035585], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 860.8749999999999, 647, 1208, 785.0, 1132.9000000000003, 1194.4, 1208.0, 0.2505211735127542, 73.66154309858904, 0.12599453550690276], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 202.55357142857142, 127, 455, 136.0, 398.90000000000003, 405.05, 455.0, 0.25111431979408627, 0.4443546361981292, 0.12212395630610835], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1296.9642857142858, 906, 2207, 1300.0, 1620.6000000000004, 1854.3, 2207.0, 0.2502480136563916, 225.1736025771077, 0.12561277247986843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 157.50000000000003, 132, 405, 138.0, 244.70000000000016, 405.0, 405.0, 0.07851373499651595, 0.05865528053938936, 0.02790917923704278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 9, 5.232558139534884, 199.45930232558143, 132, 1461, 140.0, 352.1, 403.35, 793.7800000000093, 0.7338666666666667, 1.6074041666666667, 0.35191666666666666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 142.7142857142857, 134, 164, 138.0, 164.0, 164.0, 164.0, 0.04191315594089047, 0.032458137364381, 0.01489881715086341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ed6708a-3bae-4798-80f2-aeabbcf73977", 3, 0, 0.0, 339.0, 257, 474, 286.0, 474.0, 474.0, 474.0, 0.02628028803195683, 0.026357281063300455, 0.01685291908299315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 157.6, 132, 395, 137.0, 252.2000000000001, 395.0, 395.0, 0.0951124863672103, 0.07718601188589037, 0.033809516638344285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fadcaeff-424f-468f-b483-6fffd041bdbf", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd356026-2251-40f2-bb45-adbc87e4bbf0", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 422.57142857142856, 266, 824, 269.0, 824.0, 824.0, 824.0, 0.039354363555610526, 0.060991577112064356, 0.08850888600446391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 530.7647058823529, 265, 1721, 274.0, 1600.1999999999998, 1721.0, 1721.0, 0.07829987932606833, 11.127529237232514, 0.1737413510298737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da781e6d-960b-412a-a8bd-fd02f2485fa8", 3, 0, 0.0, 491.3333333333333, 280, 649, 545.0, 649.0, 649.0, 649.0, 0.02667425401002952, 0.026926061746452325, 0.01710556002596294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87004b5b-5ef5-421d-b4a9-466a6ae1413f", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf27cf30-b32c-482c-bbba-430405e4eda5", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 163.76923076923077, 135, 394, 141.0, 307.5999999999999, 394.0, 394.0, 0.07264517859537753, 0.060230231081519064, 0.02582309082882561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 150.42857142857142, 133, 399, 137.0, 146.2, 373.7999999999996, 399.0, 0.1051903946142518, 0.08166637081868182, 0.037391898085534815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f88d5fb-f58d-4327-9b91-8562749fe570", 3, 0, 0.0, 364.0, 223, 441, 428.0, 441.0, 441.0, 441.0, 0.021763732915469663, 0.025723995513043732, 0.013956560495922928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c695ddf-8344-4f2c-913c-90c5702cf65d", 3, 0, 0.0, 436.6666666666667, 352, 508, 450.0, 508.0, 508.0, 508.0, 0.06879471656576774, 0.031127817716932675, 0.044116403526875805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6c45731-1c5d-4aff-ab4a-fed784b21437", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 133.8125, 132, 137, 133.5, 135.6, 137.0, 137.0, 0.08191475745552285, 0.06087610392934852, 0.041117368488416746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 215.43750000000003, 131, 403, 134.0, 398.1, 403.0, 403.0, 0.08180335496009529, 0.02188878833893175, 0.04665347587567935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 206.9375, 130, 536, 133.0, 439.4000000000001, 536.0, 536.0, 0.08191559621754735, 0.022078813043010806, 0.04815741105758154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 230.1875, 129, 398, 134.5, 395.9, 398.0, 398.0, 0.08191559621754735, 0.022078813043010806, 0.04823740675701274], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5351681957186545], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1529051987767584], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1529051987767584], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 0.9938837920489296], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 24, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
