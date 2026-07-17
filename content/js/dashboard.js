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

    var data = {"OkPercent": 99.76798143851508, "KoPercent": 0.23201856148491878};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7493342210386151, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8fc899a-8e00-4d81-b2ed-5da010e32053"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e6cf21c-2d34-45a4-b056-0073a1b6e0f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0843732f-0a5d-42ec-844f-ec37a7e63793"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75e56ab8-5391-4b0c-9479-6e75ab6a90a7"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a33db24f-391a-44bc-87e2-ea31720fbc73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82e2948c-c5f9-45ef-b9cf-04ad2ea49cbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0056514e-d0d4-4427-b4cf-59085316c7c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ce58980-d917-4000-b351-ddf192859f23"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6140ffd8-c5e8-4956-9d8d-e584305cb683"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c5be2d6-258f-4ac4-85ba-3f802e64e75c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11ff3396-f78f-4c49-a6fa-6f41a7d6b127"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=028c5705-1d73-4f2e-9781-d1afc5452235"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8f990dfd-3b46-4afb-ade4-a9feea7a856d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a9d90a6-32cf-4d8c-9743-02de896020f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2de55c94-7e44-422d-94c6-3d9ca321526b"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=468c4048-4fc0-45b3-a483-eec79faf3219"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0056514e-d0d4-4427-b4cf-59085316c7c5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82e2948c-c5f9-45ef-b9cf-04ad2ea49cbf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2de55c94-7e44-422d-94c6-3d9ca321526b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1dd05fe-69ce-4e4a-90ff-66280f9ed44a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8fc899a-8e00-4d81-b2ed-5da010e32053"], "isController": false}, {"data": [0.22807017543859648, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75e56ab8-5391-4b0c-9479-6e75ab6a90a7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/028c5705-1d73-4f2e-9781-d1afc5452235"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a33db24f-391a-44bc-87e2-ea31720fbc73"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6140ffd8-c5e8-4956-9d8d-e584305cb683"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9771428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f990dfd-3b46-4afb-ade4-a9feea7a856d"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c5be2d6-258f-4ac4-85ba-3f802e64e75c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11ff3396-f78f-4c49-a6fa-6f41a7d6b127"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a4279cb-245a-40b9-ae8f-83ca8a077b02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1dd05fe-69ce-4e4a-90ff-66280f9ed44a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e266298d-baf3-41d8-8c8c-3955bca2a831"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/468c4048-4fc0-45b3-a483-eec79faf3219"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 3, 0.23201856148491878, 486.4400618716164, 137, 3349, 170.0, 1336.6000000000008, 1658.6, 2160.059999999997, 5.071861173000282, 725.9978362216399, 3.6918694483615493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2315.701754385965, 1713, 3307, 2273.0, 2761.8, 2956.2999999999997, 3307.0, 0.26067033434400255, 313.67425358107306, 1.2817139974824734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8fc899a-8e00-4d81-b2ed-5da010e32053", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e6cf21c-2d34-45a4-b056-0073a1b6e0f9", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0843732f-0a5d-42ec-844f-ec37a7e63793", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.7128034319196428, 1.3318743024553572], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 634.3846153846154, 439, 1055, 523.0, 989.0, 1055.0, 1055.0, 0.06890922005364318, 0.012449419638597645, 0.0468367355052106], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 634.3846153846154, 439, 1055, 523.0, 989.0, 1055.0, 1055.0, 0.06756475822211135, 0.012206523702236915, 0.04592292160409131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 187.6842105263158, 138, 439, 144.0, 424.0, 439.0, 439.0, 0.0896188369361678, 0.03814880795154923, 0.05031847114980968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 160.42105263157896, 139, 420, 145.0, 176.0, 420.0, 420.0, 0.08961799151930797, 0.06660087065057946, 0.04498403089934013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 328.2631578947368, 138, 1146, 144.0, 833.0, 1146.0, 1146.0, 0.08962010509136534, 2.7954323816307087, 0.05196363104110261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 326.578947368421, 140, 1535, 144.0, 1407.0, 1535.0, 1535.0, 0.08962052781774014, 8.51010847326714, 0.05187635610009198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75e56ab8-5391-4b0c-9479-6e75ab6a90a7", 3, 0, 0.0, 379.66666666666663, 238, 655, 246.0, 655.0, 655.0, 655.0, 0.022898665771074408, 0.023114831561231033, 0.014684365745122585], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 279.2857142857143, 237, 435, 270.0, 387.0, 435.0, 435.0, 0.07051191651389085, 0.14736872506900095, 0.0455848522775349], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a33db24f-391a-44bc-87e2-ea31720fbc73", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 148.66666666666666, 140, 199, 145.0, 165.70000000000005, 199.0, 199.0, 0.11250562528126405, 0.0836101375381269, 0.056472550190009504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 174.72222222222223, 139, 427, 144.5, 416.20000000000005, 427.0, 427.0, 0.11251898757915398, 0.03949641111312534, 0.0636459941677658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 1153.0, 1153, 1153, 1153.0, 1153.0, 1153.0, 1153.0, 0.8673026886383347, 255.01578761925413, 0.4946335646140503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1232.0, 1232, 1232, 1232.0, 1232.0, 1232.0, 1232.0, 0.8116883116883118, 730.3585696530032, 0.46212332589285715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 4.2536808894230775, 1.3310359074519231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82e2948c-c5f9-45ef-b9cf-04ad2ea49cbf", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 192.5, 139, 427, 146.0, 426.1, 427.0, 427.0, 0.09973984523700681, 0.07412306857945525, 0.050064727003731935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 188.91666666666669, 141, 417, 144.0, 417.0, 417.0, 417.0, 0.09974564859607998, 0.03917419434608415, 0.056188100551925926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 289.83333333333337, 138, 1616, 142.0, 1263.5000000000014, 1616.0, 1616.0, 0.09949836242278513, 7.485316542120973, 0.05778160109448199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 249.5, 140, 841, 145.5, 718.0000000000005, 841.0, 841.0, 0.09950661304365853, 2.4627724770927486, 0.05788356689746673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0056514e-d0d4-4427-b4cf-59085316c7c5", 3, 0, 0.0, 360.0, 237, 605, 238.0, 605.0, 605.0, 605.0, 0.04239563607585993, 0.03509508546253639, 0.027187305686667985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 5.270667109929079, 3.982435726950355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 242.16666666666666, 141, 1189, 144.0, 647.2000000000008, 1189.0, 1189.0, 0.11251969094591553, 5.65338802454492, 0.06561206804940864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 901.7222222222224, 140, 1773, 1248.0, 1695.6000000000001, 1773.0, 1773.0, 0.11010117074244889, 55.05164863122837, 0.059470879769521555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 208.11111111111114, 138, 743, 143.5, 468.50000000000045, 743.0, 743.0, 0.11251828422118594, 1.8666485452323505, 0.06572112890219661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 698.5555555555555, 142, 1339, 952.5, 1313.8, 1339.0, 1339.0, 0.11010319115749037, 17.998741650508002, 0.05957949373941021], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 623.6153846153845, 277, 1102, 511.0, 1094.4, 1102.0, 1102.0, 0.06757494321105734, 0.012208363763716415, 0.04658975576856102], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 509.0833333333333, 284, 2040, 295.5, 1683.9000000000012, 2040.0, 2040.0, 0.09937476709038964, 10.048407998116021, 0.22137734979918017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ce58980-d917-4000-b351-ddf192859f23", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6140ffd8-c5e8-4956-9d8d-e584305cb683", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 582.9999999999999, 151, 1356, 515.5, 1183.8000000000002, 1347.9499999999998, 1356.0, 0.09909231440009512, 0.06086822827896469, 0.044804435124261764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 160.05555555555557, 137, 439, 143.0, 181.60000000000042, 439.0, 439.0, 0.11010588515956178, 0.08182673692033839, 0.055267993136733154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 252.8888888888889, 139, 452, 145.0, 429.50000000000006, 452.0, 452.0, 0.11010319115749037, 0.12133333435280733, 0.057656033043191036], "isController": false}, {"data": ["login", 20, 0, 0.0, 2780.65, 1679, 4790, 2576.5, 4015.3, 4751.849999999999, 4790.0, 0.09751340809361288, 5.972948599768406, 0.15521201548025354], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c5be2d6-258f-4ac4-85ba-3f802e64e75c", 1, 0, 0.0, 1102.0, 1102, 1102, 1102.0, 1102.0, 1102.0, 1102.0, 0.9074410163339383, 0.16394198049001812, 0.6256380444646098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 167.0, 141, 420, 149.5, 224.7000000000003, 420.0, 420.0, 0.10992165029037636, 0.0889893047760957, 0.03907371162665722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11ff3396-f78f-4c49-a6fa-6f41a7d6b127", 3, 0, 0.0, 536.0, 249, 965, 394.0, 965.0, 965.0, 965.0, 0.02453907438611416, 0.024610966205604722, 0.015736320488491173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=028c5705-1d73-4f2e-9781-d1afc5452235", 1, 0, 0.0, 854.0, 854, 854, 854.0, 854.0, 854.0, 854.0, 1.17096018735363, 0.21155042447306793, 0.8073221604215457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f990dfd-3b46-4afb-ade4-a9feea7a856d", 3, 0, 0.0, 374.6666666666667, 253, 549, 322.0, 549.0, 549.0, 549.0, 0.04031228584098147, 0.02591691553904245, 0.025851303094639812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a9d90a6-32cf-4d8c-9743-02de896020f3", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.605950545540797, 1.1322195208728651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2de55c94-7e44-422d-94c6-3d9ca321526b", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1067.5555555555554, 286, 1919, 1395.5, 1841.6000000000001, 1919.0, 1919.0, 0.11000562250959493, 73.18964358178307, 0.23176857337986165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 570.9473684210526, 284, 1955, 545.0, 1550.0, 1955.0, 1955.0, 0.08955716339468785, 11.402238892260376, 0.19900415527562396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1373.0, 1373, 1373, 1373.0, 1373.0, 1373.0, 1373.0, 0.7283321194464676, 871.3384240713765, 1.6423035779315367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=468c4048-4fc0-45b3-a483-eec79faf3219", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.2696478544776119, 1.029034514925373], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 1532.095238095238, 627, 2642, 1587.0, 2319.4, 2611.5999999999995, 2642.0, 0.08376345201151947, 0.026877223720214116, 0.03779171370050976], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0056514e-d0d4-4427-b4cf-59085316c7c5", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 441.44444444444446, 286, 1340, 298.0, 790.1000000000008, 1340.0, 1340.0, 0.11240235045803958, 7.63520651395038, 0.25119778754706845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 168.6, 142, 435, 151.0, 268.80000000000007, 435.0, 435.0, 0.0857152653173179, 0.0665465194602224, 0.030469098218265354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 578.4444444444445, 285, 1970, 301.0, 1756.7000000000003, 1970.0, 1970.0, 0.08648731759584477, 11.615689700321445, 0.19205327198339445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82e2948c-c5f9-45ef-b9cf-04ad2ea49cbf", 3, 0, 0.0, 392.6666666666667, 277, 513, 388.0, 513.0, 513.0, 513.0, 0.0558909009613235, 0.03593246399694463, 0.03584149573366122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2de55c94-7e44-422d-94c6-3d9ca321526b", 3, 0, 0.0, 920.3333333333334, 339, 2044, 378.0, 2044.0, 2044.0, 2044.0, 0.024393615377735132, 0.024465081047787093, 0.015643041111373115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 184.75, 143, 442, 146.5, 442.0, 442.0, 442.0, 0.04378906805915903, 0.03254246171193362, 0.02198005955313256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 181.125, 139, 440, 143.5, 440.0, 440.0, 440.0, 0.0437941020293092, 0.01171834370706125, 0.024976323813590405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 218.75, 142, 443, 145.5, 443.0, 443.0, 443.0, 0.043793862290200034, 0.011803814445405476, 0.025746001072949627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 152.50000000000003, 138, 201, 147.0, 201.0, 201.0, 201.0, 0.0437931430886209, 0.011803620598104853, 0.025788345002381252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1dd05fe-69ce-4e4a-90ff-66280f9ed44a", 3, 0, 0.0, 408.6666666666667, 289, 601, 336.0, 601.0, 601.0, 601.0, 0.0705633305892038, 0.03192806950488063, 0.04525057332706103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8fc899a-8e00-4d81-b2ed-5da010e32053", 3, 0, 0.0, 338.6666666666667, 264, 468, 284.0, 468.0, 468.0, 468.0, 0.03426965650380964, 0.02823453795935619, 0.02197630967203939], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1618.8771929824566, 1109, 2714, 1537.0, 2152.2, 2296.6999999999994, 2714.0, 0.2719556473737196, 325.35350133950084, 0.5370061708883408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 1532.095238095238, 627, 2642, 1587.0, 2319.4, 2611.5999999999995, 2642.0, 0.08514261387824607, 0.02731975612722739, 0.03841395274584929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 176.375, 137, 418, 141.0, 418.0, 418.0, 418.0, 0.05177256313016917, 0.01395432365617841, 0.030487163640128916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 182.0, 138, 434, 147.0, 434.0, 434.0, 434.0, 0.05186452984803693, 0.013979111560603705, 0.030490670867693585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 371.73333333333335, 140, 1468, 143.0, 1333.6000000000001, 1468.0, 1468.0, 0.08814611099358297, 15.881811628455328, 0.050305261000634656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 378.6666666666667, 139, 1150, 145.0, 1134.4, 1150.0, 1150.0, 0.08820935019112026, 5.206315697588944, 0.05042749375183769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 182.73333333333338, 139, 445, 145.0, 429.40000000000003, 445.0, 445.0, 0.08871697510601678, 0.0659312676324988, 0.04453176289501233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 178.0, 141, 424, 143.0, 424.0, 424.0, 424.0, 0.05186553859120231, 0.013878083568349055, 0.029579564977795066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 237.46666666666667, 137, 437, 143.0, 434.0, 437.0, 437.0, 0.08856716047779031, 0.05030337942761996, 0.049023307186339404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 179.75, 139, 414, 146.0, 414.0, 414.0, 414.0, 0.05186116765418974, 0.038541356039881236, 0.026031875170169454], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 763.5833333333333, 462, 2044, 575.0, 1840.0000000000007, 2044.0, 2044.0, 0.06766205061121386, 0.012224100940502504, 0.04605512624610943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 187.125, 145, 447, 150.5, 447.0, 447.0, 447.0, 0.05279831045406547, 0.041558045142555435, 0.018768149419218585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75e56ab8-5391-4b0c-9479-6e75ab6a90a7", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/028c5705-1d73-4f2e-9781-d1afc5452235", 2, 0, 0.0, 385.0, 246, 524, 385.0, 524.0, 524.0, 524.0, 0.022453997372882308, 0.025545807558015516, 0.013957001296718348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1778.1999999999998, 1064, 3349, 1540.5, 3075.7000000000007, 3337.6, 3349.0, 0.09779520705690213, 0.05061665990249818, 0.044981975120899326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 397.74999999999994, 283, 848, 297.0, 848.0, 848.0, 848.0, 0.05172068245440498, 0.08015695610853586, 0.11632102704345185], "isController": false}, {"data": ["addBook", 59, 1, 1.694915254237288, 1500.6610169491523, 717, 3032, 1195.0, 2580.0, 2611.0, 3032.0, 0.2787805477328999, 108.46812802258358, 1.0100488353233854], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 273.42105263157896, 141, 615, 151.0, 579.2, 586.0, 615.0, 0.2734678603298886, 0.2032314860459426, 0.13219393638993637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a33db24f-391a-44bc-87e2-ea31720fbc73", 3, 0, 0.0, 513.6666666666666, 250, 829, 462.0, 829.0, 829.0, 829.0, 0.03445266204235381, 0.028721766761220086, 0.022093666739400067], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 953.0877192982456, 699, 1360, 859.0, 1263.0, 1299.1999999999998, 1360.0, 0.2733996527344762, 80.38857562678069, 0.13750080191235864], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 228.12280701754386, 139, 569, 149.0, 429.20000000000005, 438.29999999999995, 569.0, 0.2741399460377159, 0.4850992013870519, 0.13332196594412354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6140ffd8-c5e8-4956-9d8d-e584305cb683", 3, 0, 0.0, 356.3333333333333, 271, 464, 334.0, 464.0, 464.0, 464.0, 0.03220542768807969, 0.026848339944391963, 0.020652569187993818], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1343.5087719298244, 967, 2127, 1300.0, 1701.8, 1811.9999999999995, 2127.0, 0.27280950717201835, 245.47447410134393, 0.13693758465470451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 154.44444444444443, 142, 189, 149.5, 185.4, 189.0, 189.0, 0.08720211998042797, 0.06514611502444081, 0.030997628586792753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 1, 0.5714285714285714, 220.30857142857144, 140, 1239, 155.0, 388.80000000000007, 460.79999999999984, 780.7200000000055, 0.7334819856824316, 1.5998953019954902, 0.35298820560967026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 153.37499999999997, 145, 165, 151.0, 165.0, 165.0, 165.0, 0.043269438795378826, 0.03350846187962442, 0.015380933321794816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 167.73684210526315, 140, 458, 150.0, 167.0, 458.0, 458.0, 0.0899489184826091, 0.07299565552641421, 0.03197402961686495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f990dfd-3b46-4afb-ade4-a9feea7a856d", 1, 0, 0.0, 1083.0, 1083, 1083, 1083.0, 1083.0, 1083.0, 1083.0, 0.9233610341643582, 0.16681815558633425, 0.6366141505078486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 413.625, 289, 885, 307.0, 885.0, 885.0, 885.0, 0.04375362334693342, 0.06780957055818684, 0.09840292438280045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 613.4000000000001, 280, 1913, 293.0, 1596.2000000000003, 1913.0, 1913.0, 0.08806899912518128, 21.181419936472896, 0.1935625873350908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c5be2d6-258f-4ac4-85ba-3f802e64e75c", 3, 0, 0.0, 661.0, 273, 1364, 346.0, 1364.0, 1364.0, 1364.0, 0.022211527782919335, 0.02625327388664717, 0.014243720615999704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11ff3396-f78f-4c49-a6fa-6f41a7d6b127", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a4279cb-245a-40b9-ae8f-83ca8a077b02", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 151.16666666666666, 145, 176, 148.0, 170.60000000000002, 176.0, 176.0, 0.09799358142041696, 0.08124663147063868, 0.03483365589553884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 191.16666666666666, 142, 446, 157.0, 421.70000000000005, 446.0, 446.0, 0.1071007818357074, 0.08314953277283924, 0.03807098104316162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1dd05fe-69ce-4e4a-90ff-66280f9ed44a", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e266298d-baf3-41d8-8c8c-3955bca2a831", 2, 0, 0.0, 340.5, 246, 435, 340.5, 435.0, 435.0, 435.0, 0.02061027009758963, 0.029375673054132873, 0.012810973551870898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/468c4048-4fc0-45b3-a483-eec79faf3219", 3, 0, 0.0, 338.6666666666667, 269, 473, 274.0, 473.0, 473.0, 473.0, 0.026421009987141777, 0.026498415289838477, 0.016943160701389744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 175.94444444444446, 138, 432, 144.5, 420.3, 432.0, 432.0, 0.08667055079135028, 0.06441043862521247, 0.043504553815189494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 175.05555555555554, 140, 436, 143.0, 426.1, 436.0, 436.0, 0.0865542743385811, 0.03760452630769083, 0.04855529495773266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 382.33333333333337, 137, 1582, 146.0, 1554.1000000000001, 1582.0, 1582.0, 0.0866743068463072, 8.686287236847173, 0.05012739317391681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 340.5, 138, 1200, 144.0, 1173.9, 1200.0, 1200.0, 0.08654844789783436, 2.8483041612974573, 0.050139123624841325], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 66.66666666666667, 0.15467904098994587], "isController": false}, {"data": ["401/Unauthorized", 1, 33.333333333333336, 0.07733952049497293], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 3, "406/Not Acceptable", 2, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
