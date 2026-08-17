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

    var data = {"OkPercent": 98.72509960159363, "KoPercent": 1.2749003984063745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.736518771331058, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54082fa4-bcab-422f-b124-efb3fde033c2"], "isController": false}, {"data": [0.0625, 500, 1500, "see books"], "isController": true}, {"data": [0.32142857142857145, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dd0ebd8-0165-4b1d-8be6-228e5b6db646"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1a48686-5264-402b-8ddf-7b9894f9f55f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40d1735c-fadf-4652-ae9e-38eb4950d161"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/61ffa39f-fafd-4d03-a49c-d4313be4883c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6ca32b43-f97d-49c8-9040-4058a7fe06be"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f4198e3e-ee2a-4f0c-b2d4-bb7484e78473"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e53c42aa-9196-4477-b063-c0ac8f673ff0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a04a9fbc-a7cd-4251-b501-cbc14f2d3248"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec82deaf-ada5-4d93-bc4b-23ca9215fbdf"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aece1281-c9f4-4a06-a629-04406ef20ef6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6112fcff-ebb5-41e5-ae4e-3e77d9e10c45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10511de6-1153-4f47-b6d2-96469904d3a6"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff616152-8865-4427-ae8f-53751d292d29"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cd0d6069-3af0-49d4-ba5c-e6ade59cb810"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9dd0ebd8-0165-4b1d-8be6-228e5b6db646"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61ffa39f-fafd-4d03-a49c-d4313be4883c"], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4198e3e-ee2a-4f0c-b2d4-bb7484e78473"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54082fa4-bcab-422f-b124-efb3fde033c2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.45535714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ca32b43-f97d-49c8-9040-4058a7fe06be"], "isController": false}, {"data": [0.8945783132530121, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/40d1735c-fadf-4652-ae9e-38eb4950d161"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10511de6-1153-4f47-b6d2-96469904d3a6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a04a9fbc-a7cd-4251-b501-cbc14f2d3248"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ec82deaf-ada5-4d93-bc4b-23ca9215fbdf"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6112fcff-ebb5-41e5-ae4e-3e77d9e10c45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff616152-8865-4427-ae8f-53751d292d29"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aece1281-c9f4-4a06-a629-04406ef20ef6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e53c42aa-9196-4477-b063-c0ac8f673ff0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/df12561b-a7fe-46e7-a6f1-6b40b82a4291"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1255, 16, 1.2749003984063745, 462.47250996015947, 100, 6432, 161.0, 1203.6000000000004, 1501.0, 2572.76, 4.8908045081136695, 683.8747185595314, 3.5686295200971148], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/54082fa4-bcab-422f-b124-efb3fde033c2", 3, 0, 0.0, 349.6666666666667, 257, 486, 306.0, 486.0, 486.0, 486.0, 0.03527751646284102, 0.029409413952257758, 0.022622626117121354], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1905.982142857143, 1330, 2560, 1872.0, 2449.6, 2512.15, 2560.0, 0.25144694245008103, 302.5762121370296, 1.2363626515978106], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 1687.0714285714287, 122, 6432, 1290.0, 4626.0, 6432.0, 6432.0, 0.08283337475002071, 0.015641039721561528, 0.05601768751405209], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 1687.0714285714287, 122, 6432, 1290.0, 4626.0, 6432.0, 6432.0, 0.08085008085008084, 0.015266543586856087, 0.05467644627800878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dd0ebd8-0165-4b1d-8be6-228e5b6db646", 1, 0, 0.0, 1737.0, 1737, 1737, 1737.0, 1737.0, 1737.0, 1737.0, 0.5757052389176742, 0.1040092472654001, 0.39692177605066203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 202.6470588235294, 107, 344, 114.0, 344.0, 344.0, 344.0, 0.09675197914710285, 0.0344367683131577, 0.054700883430939005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 172.35294117647055, 109, 447, 114.0, 370.19999999999993, 447.0, 447.0, 0.09662110318565462, 0.07180533156668277, 0.04849926468498679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 244.7058823529412, 107, 677, 118.0, 497.79999999999984, 677.0, 677.0, 0.09675583380762665, 1.6980404275754128, 0.05648722075981787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 235.52941176470588, 106, 1366, 112.0, 551.5999999999992, 1366.0, 1366.0, 0.09675087787193598, 5.145520478817249, 0.0563898441457182], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 579.3333333333335, 113, 3361, 377.0, 1813.000000000001, 3361.0, 3361.0, 0.07562923523717328, 0.15147019294278397, 0.048883271317360436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c1a48686-5264-402b-8ddf-7b9894f9f55f", 1, 0, 0.0, 3493.0, 3493, 3493, 3493.0, 3493.0, 3493.0, 3493.0, 0.286286859433152, 0.09142168265101633, 0.17082155382192957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40d1735c-fadf-4652-ae9e-38eb4950d161", 1, 0, 0.0, 1600.0, 1600, 1600, 1600.0, 1600.0, 1600.0, 1600.0, 0.625, 0.1129150390625, 0.430908203125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 126.63157894736842, 103, 339, 115.0, 127.0, 339.0, 339.0, 0.0958013785314153, 0.07119614166250687, 0.04808780133315182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 156.78947368421052, 101, 337, 114.0, 325.0, 337.0, 337.0, 0.09570052786396421, 0.03317251027521457, 0.05415618892795261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 790.0, 671, 909, 790.0, 909.0, 909.0, 909.0, 0.3374388392103931, 99.21822275181374, 0.19244558798717734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1254.5, 1070, 1439, 1254.5, 1439.0, 1439.0, 1439.0, 0.2987303958177745, 268.7981352688573, 0.17007794996265868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 231.0, 122, 340, 231.0, 340.0, 340.0, 340.0, 0.35739814152966404, 0.6324271801286633, 0.19789526000714797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 128.39999999999998, 103, 342, 115.0, 209.4000000000001, 342.0, 342.0, 0.07250334723786414, 0.05388188207813927, 0.03639328171900603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 156.26666666666665, 108, 342, 115.0, 331.8, 342.0, 342.0, 0.07250229590603702, 0.019400028396732563, 0.041348965633911744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 127.66666666666666, 101, 338, 115.0, 206.60000000000008, 338.0, 338.0, 0.07250720238210329, 0.019542956892051277, 0.04262630452541619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61ffa39f-fafd-4d03-a49c-d4313be4883c", 3, 0, 0.0, 983.0, 339, 2233, 377.0, 2233.0, 2233.0, 2233.0, 0.01952769026479548, 0.026920497484182574, 0.012522639915900748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 143.19999999999996, 103, 347, 113.0, 345.2, 347.0, 347.0, 0.07250650141629365, 0.019542767959860402, 0.042696699564477615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 114.0, 113, 115, 114.0, 115.0, 115.0, 115.0, 0.3723701359150996, 0.27673210296034256, 0.20909455874138894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 836.5999999999999, 114, 1357, 994.0, 1355.8, 1357.0, 1357.0, 0.0951342026485362, 57.07649572768152, 0.05047810882718555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 202.78947368421055, 104, 1290, 114.0, 342.0, 1290.0, 1290.0, 0.09580862479325507, 4.561767922831195, 0.055891647378877723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 658.6666666666666, 109, 1028, 855.0, 1026.2, 1028.0, 1028.0, 0.09513480602013052, 18.657075096244714, 0.05057133405952902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 211.8947368421053, 104, 861, 115.0, 336.0, 861.0, 861.0, 0.09570872309451489, 1.5055725931774793, 0.05592683351467618], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 1147.4285714285713, 116, 2757, 677.0, 2663.0, 2757.0, 2757.0, 0.08119425144699755, 0.015331531715054575, 0.0555661831017364], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ca32b43-f97d-49c8-9040-4058a7fe06be", 3, 0, 0.0, 556.0, 261, 759, 648.0, 759.0, 759.0, 759.0, 0.035124692658939236, 0.022581792969207353, 0.022524623873082777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 304.2, 218, 681, 231.0, 553.8000000000001, 681.0, 681.0, 0.07246306798968126, 0.11230360244103921, 0.16297113826194914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4198e3e-ee2a-4f0c-b2d4-bb7484e78473", 3, 0, 0.0, 727.3333333333333, 258, 1421, 503.0, 1421.0, 1421.0, 1421.0, 0.035055738624412816, 0.028699603724087964, 0.02248040530276473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e53c42aa-9196-4477-b063-c0ac8f673ff0", 1, 0, 0.0, 2569.0, 2569, 2569, 2569.0, 2569.0, 2569.0, 2569.0, 0.38925652004671074, 0.07032466426625146, 0.2683741241728299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 1016.7222222222222, 143, 2183, 1012.0, 2069.6000000000004, 2183.0, 2183.0, 0.08077399436377018, 0.049616057084776795, 0.03652183534221249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 127.60000000000001, 103, 328, 116.0, 204.4000000000001, 328.0, 328.0, 0.09526833915528739, 0.0708000059542712, 0.04782024055255637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 215.8666666666667, 108, 357, 117.0, 346.8, 357.0, 357.0, 0.09527317996468541, 0.12089025244216918, 0.04900117979954523], "isController": false}, {"data": ["login", 18, 0, 0.0, 3716.444444444444, 1759, 10003, 2928.0, 7825.000000000004, 10003.0, 10003.0, 0.07818098898951072, 10.503084823658435, 0.13236306111147306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 140.57894736842104, 111, 356, 117.0, 256.0, 356.0, 356.0, 0.09715191491537556, 0.07865130611801402, 0.03453446975507491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a04a9fbc-a7cd-4251-b501-cbc14f2d3248", 1, 0, 0.0, 1230.0, 1230, 1230, 1230.0, 1230.0, 1230.0, 1230.0, 0.8130081300813008, 0.14688135162601626, 0.5605309959349594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec82deaf-ada5-4d93-bc4b-23ca9215fbdf", 1, 0, 0.0, 2309.0, 2309, 2309, 2309.0, 2309.0, 2309.0, 2309.0, 0.43308791684711995, 0.07824342247726288, 0.298593817669987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 977.5333333333332, 233, 1471, 1148.0, 1465.0, 1471.0, 1471.0, 0.09506305849546866, 75.86808787589518, 0.19758386344191647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aece1281-c9f4-4a06-a629-04406ef20ef6", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 0.6294915069686412, 2.4022756968641117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6112fcff-ebb5-41e5-ae4e-3e77d9e10c45", 3, 0, 0.0, 776.0, 461, 1057, 810.0, 1057.0, 1057.0, 1057.0, 0.05786813780332549, 0.02561870684001389, 0.03710945034913776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10511de6-1153-4f47-b6d2-96469904d3a6", 3, 0, 0.0, 616.3333333333333, 325, 1175, 349.0, 1175.0, 1175.0, 1175.0, 0.027473785429735793, 0.027554275035486974, 0.01761828036998031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 511.0, 224, 1480, 452.0, 913.5999999999995, 1480.0, 1480.0, 0.09655744315890515, 6.935917274410573, 0.21570670996132021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 3, 60.0, 616.4, 113, 1553, 116.0, 1553.0, 1553.0, 1553.0, 0.06009326474688717, 28.76662236040335, 0.0778865048555358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff616152-8865-4427-ae8f-53751d292d29", 3, 0, 0.0, 544.6666666666666, 207, 998, 429.0, 998.0, 998.0, 998.0, 0.027894521515974262, 0.023254514844534533, 0.017888088341949642], "isController": false}, {"data": ["register", 24, 6, 25.0, 1373.291666666667, 275, 2575, 1365.5, 2005.0, 2465.5, 2575.0, 0.09816432708353784, 0.030963943015608127, 0.04428898350839305], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 406.5263157894737, 225, 1401, 432.0, 677.0, 1401.0, 1401.0, 0.09563838622807239, 6.162354418870964, 0.21380507858706868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 142.69230769230768, 109, 431, 118.0, 310.19999999999993, 431.0, 431.0, 0.1012603012883426, 0.07861517531663317, 0.03599487272359053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 527.2, 221, 1363, 455.0, 1361.8, 1363.0, 1363.0, 0.0820968633525075, 13.20578823079891, 0.18183706953877982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd0d6069-3af0-49d4-ba5c-e6ade59cb810", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.5957760027985074, 1.1132083722014925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 116.66666666666667, 109, 130, 116.0, 126.10000000000001, 130.0, 130.0, 0.05775200327261352, 0.04291921336958876, 0.02898879851769858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dd0ebd8-0165-4b1d-8be6-228e5b6db646", 3, 0, 0.0, 1114.6666666666665, 250, 2571, 523.0, 2571.0, 2571.0, 2571.0, 0.018179834927098862, 0.02148794942066926, 0.011658292580203372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 134.08333333333331, 107, 340, 115.5, 276.10000000000025, 340.0, 340.0, 0.057752837108122936, 0.022681900381168723, 0.03253297025247615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 216.08333333333331, 112, 1047, 115.0, 848.4000000000008, 1047.0, 1047.0, 0.057678165449817596, 4.339160117290953, 0.0334953929565347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 200.91666666666669, 109, 640, 116.0, 565.0000000000002, 640.0, 640.0, 0.05767650211240189, 1.4274840398304312, 0.03355075171707753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 2.5424299568965516, 5.329000538793103], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1268.3392857142858, 877, 2063, 1135.5, 1958.7, 2037.6, 2063.0, 0.24800598757312856, 296.70138196907897, 0.4897149481180332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1373.291666666667, 275, 2575, 1365.5, 2005.0, 2465.5, 2575.0, 0.097085807673015, 0.030623745974984223, 0.043802385883723566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 156.6, 103, 339, 114.0, 339.0, 339.0, 339.0, 0.045844641678280645, 0.012356563577349081, 0.026996405207034405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 192.6, 100, 341, 116.0, 341.0, 341.0, 341.0, 0.0458442213359006, 0.01235645028194196, 0.026951387933800947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 164.07692307692307, 101, 347, 115.0, 343.4, 347.0, 347.0, 0.0962962962962963, 0.025954861111111113, 0.05661168981481481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 193.6923076923077, 107, 339, 115.0, 334.6, 339.0, 339.0, 0.0964627839159438, 0.025999734727344233, 0.05680376826300207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 165.76923076923077, 108, 355, 116.0, 349.4, 355.0, 355.0, 0.0962898769711649, 0.0715591761475161, 0.04833300465154176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 154.6, 100, 341, 109.0, 341.0, 341.0, 341.0, 0.04594532506317482, 0.012293963932919824, 0.02620319320009189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 216.6153846153846, 112, 341, 116.0, 340.2, 341.0, 341.0, 0.09646349969576896, 0.02581152237953193, 0.05501433967024324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 106.4, 102, 112, 103.0, 112.0, 112.0, 112.0, 0.045940259286823416, 0.03414114972389904, 0.023059856712331284], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 1304.2142857142858, 114, 3452, 1087.5, 3011.5, 3452.0, 3452.0, 0.08327385201046872, 0.015561568745538901, 0.056675709686533425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 123.0, 117, 135, 121.0, 135.0, 135.0, 135.0, 0.048618268800684546, 0.038267895169288815, 0.017282275237743335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 1987.4444444444448, 1065, 5411, 1512.0, 4916.000000000001, 5411.0, 5411.0, 0.0819590022857455, 0.042420186729926875, 0.03769793952791614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 312.6, 217, 445, 230.0, 445.0, 445.0, 445.0, 0.04579635277846472, 0.07097540220646828, 0.1029970707507854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61ffa39f-fafd-4d03-a49c-d4313be4883c", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["addBook", 55, 5, 9.090909090909092, 1548.581818181818, 604, 5547, 1169.0, 2593.6, 4361.7999999999965, 5547.0, 0.2672250861193573, 88.19440374491666, 0.9712720885826868], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4198e3e-ee2a-4f0c-b2d4-bb7484e78473", 1, 0, 0.0, 2757.0, 2757, 2757, 2757.0, 2757.0, 2757.0, 2757.0, 0.3627130939426913, 0.06552922107363075, 0.2500736760972071], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 191.8571428571428, 110, 548, 117.0, 462.0, 465.65, 548.0, 0.24911253658840382, 0.18513148471071805, 0.12042061094849599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54082fa4-bcab-422f-b124-efb3fde033c2", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 704.8035714285713, 508, 1093, 670.5, 924.7000000000002, 1024.45, 1093.0, 0.24911586111790746, 73.24833459374096, 0.12528776218332258], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 140.98214285714292, 103, 345, 116.0, 334.90000000000003, 342.15, 345.0, 0.24954991889627634, 0.4415863799219265, 0.12136314415072816], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1074.7678571428573, 756, 1612, 1018.0, 1484.9, 1595.45, 1612.0, 0.24857182172073844, 223.6653621269758, 0.12477140269966754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 120.4, 114, 137, 119.0, 130.4, 137.0, 137.0, 0.08578929006502829, 0.06409063173803382, 0.03049541170280302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ca32b43-f97d-49c8-9040-4058a7fe06be", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 5, 3.0120481927710845, 308.2831325301204, 103, 5086, 122.5, 673.2, 940.1500000000004, 3853.200000000023, 0.6953636835843903, 1.5159046116016823, 0.33268102625835694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 138.58333333333334, 116, 307, 121.0, 259.60000000000014, 307.0, 307.0, 0.057958134907218684, 0.044883594708422285, 0.020602305767800394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40d1735c-fadf-4652-ae9e-38eb4950d161", 3, 0, 0.0, 2551.3333333333335, 841, 3452, 3361.0, 3452.0, 3452.0, 3452.0, 0.019086397760529332, 0.026312140141875554, 0.012239649605547779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 131.7058823529412, 110, 336, 118.0, 172.79999999999984, 336.0, 336.0, 0.09937045891616056, 0.08064145640559514, 0.03532309281785395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10511de6-1153-4f47-b6d2-96469904d3a6", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a04a9fbc-a7cd-4251-b501-cbc14f2d3248", 3, 0, 0.0, 442.6666666666667, 211, 561, 556.0, 561.0, 561.0, 561.0, 0.036939443938237254, 0.030794894507104688, 0.02368838039008053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 354.0, 231, 1162, 234.0, 965.5000000000007, 1162.0, 1162.0, 0.05764380929506425, 5.828728270985949, 0.12841321904647532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec82deaf-ada5-4d93-bc4b-23ca9215fbdf", 3, 0, 0.0, 799.0, 212, 1404, 781.0, 1404.0, 1404.0, 1404.0, 0.024155367322619088, 0.01990144358513962, 0.015490258341653516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 434.61538461538464, 225, 697, 453.0, 690.2, 697.0, 697.0, 0.09604302727621974, 0.14884793387437573, 0.21600301935267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 118.86666666666667, 111, 125, 119.0, 124.4, 125.0, 125.0, 0.07088578881705795, 0.05877151826726778, 0.02519768274356357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 137.79999999999998, 109, 353, 119.0, 233.00000000000006, 353.0, 353.0, 0.09310235673099004, 0.07228161484486044, 0.03309497836921912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6112fcff-ebb5-41e5-ae4e-3e77d9e10c45", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff616152-8865-4427-ae8f-53751d292d29", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aece1281-c9f4-4a06-a629-04406ef20ef6", 3, 0, 0.0, 520.3333333333334, 206, 1021, 334.0, 1021.0, 1021.0, 1021.0, 0.07326007326007326, 0.033148275335775336, 0.04697992979242979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e53c42aa-9196-4477-b063-c0ac8f673ff0", 3, 0, 0.0, 683.6666666666666, 363, 1118, 570.0, 1118.0, 1118.0, 1118.0, 0.017914832884467245, 0.02469704338076783, 0.011488353119270985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df12561b-a7fe-46e7-a6f1-6b40b82a4291", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.48020441729323304, 0.8972626879699248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 141.66666666666669, 104, 327, 114.0, 324.0, 327.0, 327.0, 0.08224811514736122, 0.06112384338588074, 0.04128469842357779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 188.53333333333333, 106, 344, 116.0, 344.0, 344.0, 344.0, 0.08225037012666557, 0.038479893211602785, 0.04598738142238307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 378.1333333333333, 101, 1249, 319.0, 1246.0, 1249.0, 1249.0, 0.08215576733486692, 9.875711588755614, 0.0473572372384708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 260.46666666666664, 104, 679, 117.0, 671.8, 679.0, 679.0, 0.08214856842428092, 3.2397769529453, 0.04743331076529606], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.47808764940239046], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 12.5, 0.1593625498007968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.0796812749003984], "isController": false}, {"data": ["401/Unauthorized", 7, 43.75, 0.5577689243027888], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1255, 16, "401/Unauthorized", 7, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
