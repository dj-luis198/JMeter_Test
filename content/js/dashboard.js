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

    var data = {"OkPercent": 98.57357357357357, "KoPercent": 1.4264264264264264};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7976113621691414, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08181818181818182, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58d70b23-171b-4022-be1a-86f044bb21e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fce31c79-3880-4e34-80ce-2d0774e8a983"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d89ba8c-f830-4426-be8a-52d2eb3e1271"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8ead0a2-d105-4f2f-9e9a-925b156df7fc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff23df48-fc9e-43df-8cc8-94bcee41e4f3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d29054c9-15fd-4655-b46d-f0d2f1c02a7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff50f43c-192e-4209-b60a-ac584e2eeb32"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee0e57a3-31d3-40f9-92b7-9341296fd62d"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff23df48-fc9e-43df-8cc8-94bcee41e4f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d89ba8c-f830-4426-be8a-52d2eb3e1271"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6312241e-0d2b-4c71-a642-2727d4ac8e6a"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97ea500f-80e6-410c-8ee4-42ece4ff52a9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6edae793-7ccc-4dce-a7f2-34c59006d13c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4cb0acb-a4a4-48ab-8eac-7a063315ab9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51902e05-e266-44c1-a0c9-074fed272aa9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=735b7495-a5e0-4c8a-b5ea-06c619bb8404"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97ea500f-80e6-410c-8ee4-42ece4ff52a9"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.44545454545454544, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eee55de7-86a5-46a8-aa6a-4d7298480b08"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fce31c79-3880-4e34-80ce-2d0774e8a983"], "isController": false}, {"data": [0.3359375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5636363636363636, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.953551912568306, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff50f43c-192e-4209-b60a-ac584e2eeb32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d29054c9-15fd-4655-b46d-f0d2f1c02a7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee0e57a3-31d3-40f9-92b7-9341296fd62d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eee55de7-86a5-46a8-aa6a-4d7298480b08"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6edae793-7ccc-4dce-a7f2-34c59006d13c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b5f86a9-1756-4875-b53d-9088840572bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/735b7495-a5e0-4c8a-b5ea-06c619bb8404"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51902e05-e266-44c1-a0c9-074fed272aa9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4cb0acb-a4a4-48ab-8eac-7a063315ab9f"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1332, 19, 1.4264264264264264, 334.3903903903906, 91, 1932, 106.0, 945.3000000000009, 1186.35, 1494.3600000000006, 5.176735780493966, 700.7687063686578, 3.786039883358271], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1671.5636363636363, 1175, 2090, 1659.0, 2002.4, 2065.2, 2090.0, 0.24306921285349997, 292.49460103227074, 1.195169420622434], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/58d70b23-171b-4022-be1a-86f044bb21e5", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.7884837962962963, 1.4732831790123455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fce31c79-3880-4e34-80ce-2d0774e8a983", 3, 0, 0.0, 350.0, 279, 402, 369.0, 402.0, 402.0, 402.0, 0.018348287187391055, 0.021687054289523743, 0.011766316978893354], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 573.7142857142857, 97, 1351, 484.5, 1260.0, 1351.0, 1351.0, 0.06544930950978467, 0.012892637420175216, 0.04403767016820472], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 573.7142857142857, 97, 1351, 484.5, 1260.0, 1351.0, 1351.0, 0.06434651517658523, 0.012675401706101888, 0.04329565327799533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 119.9, 91, 302, 101.0, 281.2000000000004, 301.95, 302.0, 0.11934313538285278, 0.031933612397364905, 0.06806288189803322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 99.75, 93, 104, 100.5, 102.9, 103.95, 104.0, 0.11934099900350266, 0.0886899416422515, 0.05990358739043005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 148.04999999999998, 95, 304, 101.0, 300.6, 303.85, 304.0, 0.1193438475263004, 0.032166896403573154, 0.07027767583824135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 118.54999999999998, 94, 293, 101.0, 267.60000000000036, 292.65, 293.0, 0.11933957479309501, 0.03216574476845139, 0.07015861721234687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d89ba8c-f830-4426-be8a-52d2eb3e1271", 2, 0, 0.0, 234.5, 206, 263, 234.5, 263.0, 263.0, 263.0, 0.011829209867926871, 0.023381172629574207, 0.007352824297788529], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 266.0714285714286, 95, 917, 200.0, 643.0, 917.0, 917.0, 0.06587553288600709, 0.155420490290417, 0.04257831248059025], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d8ead0a2-d105-4f2f-9e9a-925b156df7fc", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff23df48-fc9e-43df-8cc8-94bcee41e4f3", 3, 0, 0.0, 402.0, 274, 503, 429.0, 503.0, 503.0, 503.0, 0.02029769959404601, 0.027982017506765898, 0.01301642845060893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d29054c9-15fd-4655-b46d-f0d2f1c02a7d", 3, 0, 0.0, 504.3333333333333, 194, 917, 402.0, 917.0, 917.0, 917.0, 0.06130581383467865, 0.039812857617247364, 0.0393139496270563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 115.14285714285715, 98, 290, 102.0, 196.5, 290.0, 290.0, 0.11850347045877771, 0.08806752052649398, 0.05948318732012866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 155.85714285714286, 95, 306, 101.0, 305.0, 306.0, 306.0, 0.11850748290106318, 0.04442377323593147, 0.06687538620742196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 678.2, 598, 800, 599.0, 800.0, 800.0, 800.0, 0.056058839357789936, 16.483160099840795, 0.031971056821239574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1123.4, 896, 1302, 1092.0, 1302.0, 1302.0, 1302.0, 0.05587341319506526, 50.27499540790385, 0.03181074208273735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 222.2, 101, 303, 303.0, 303.0, 303.0, 303.0, 0.05637042131252889, 0.09974922208818589, 0.031212918832230353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 131.73333333333335, 96, 364, 101.0, 326.20000000000005, 364.0, 364.0, 0.10608878924401129, 0.07884137560028574, 0.053251599288497854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 145.66666666666666, 95, 388, 101.0, 335.8, 388.0, 388.0, 0.10609179061724204, 0.049633828605175866, 0.05931746730604653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 264.6666666666667, 95, 1177, 101.0, 1129.6000000000001, 1177.0, 1177.0, 0.1060910402580134, 12.752902805577559, 0.06115430146122726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 221.79999999999998, 92, 803, 101.0, 798.8, 803.0, 803.0, 0.10595764519729314, 4.1787598187417885, 0.06118088250356724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 101.4, 101, 102, 101.0, 102.0, 102.0, 102.0, 0.05649972880130175, 0.041988567986123666, 0.03172592193432472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 811.2, 99, 1406, 1052.0, 1398.2, 1406.0, 1406.0, 0.12640200894926223, 75.83585632620988, 0.06706877427971922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 199.07142857142856, 96, 1084, 102.0, 692.0, 1084.0, 1084.0, 0.11850347045877771, 7.64606114831979, 0.06893965845606907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 505.4666666666667, 95, 818, 596.0, 807.8, 818.0, 818.0, 0.12640626975097966, 24.789783739940166, 0.06719447867947584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 146.3571428571429, 93, 478, 101.0, 424.5, 478.0, 478.0, 0.11850547664595643, 2.5185554975960316, 0.06905655356447545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff50f43c-192e-4209-b60a-ac584e2eeb32", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 439.35714285714283, 99, 745, 419.5, 698.5, 745.0, 745.0, 0.06444841364833263, 0.012695474340324451, 0.04377780776419246], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 442.73333333333335, 199, 1282, 214.0, 1229.2, 1282.0, 1282.0, 0.10588285121341748, 17.03191149208349, 0.23452086465701016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 441.3809523809525, 197, 1186, 336.0, 741.2, 1142.4999999999993, 1186.0, 0.09107468123861566, 0.055943334471766845, 0.041179274817850636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 100.86666666666666, 95, 104, 102.0, 103.4, 104.0, 104.0, 0.12639668335102885, 0.09393347268567673, 0.06344521019768441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 201.93333333333337, 98, 406, 103.0, 345.40000000000003, 406.0, 406.0, 0.1263998786561165, 0.16038630436248114, 0.06501035425672658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee0e57a3-31d3-40f9-92b7-9341296fd62d", 3, 0, 0.0, 349.66666666666663, 195, 622, 232.0, 622.0, 622.0, 622.0, 0.018136751103319023, 0.025002975560727888, 0.011630663956229975], "isController": false}, {"data": ["login", 21, 0, 0.0, 1962.571428571429, 1164, 3370, 2040.0, 2625.4, 3296.099999999999, 3370.0, 0.08989841479128584, 25.730708061051725, 0.1711305621968604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 116.35714285714286, 95, 304, 103.5, 205.0, 304.0, 304.0, 0.11602370198483404, 0.09392934467326897, 0.041242800314921474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff23df48-fc9e-43df-8cc8-94bcee41e4f3", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d89ba8c-f830-4426-be8a-52d2eb3e1271", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6312241e-0d2b-4c71-a642-2727d4ac8e6a", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 913.6, 204, 1507, 1151.0, 1501.0, 1507.0, 1507.0, 0.12628813901798344, 100.78825340083435, 0.26248364831700005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97ea500f-80e6-410c-8ee4-42ece4ff52a9", 3, 0, 0.0, 729.6666666666666, 199, 1498, 492.0, 1498.0, 1498.0, 1498.0, 0.08753756820635523, 0.0396084699892037, 0.05613574523649733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6edae793-7ccc-4dce-a7f2-34c59006d13c", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4cb0acb-a4a4-48ab-8eac-7a063315ab9f", 3, 0, 0.0, 271.3333333333333, 201, 394, 219.0, 394.0, 394.0, 394.0, 0.03930096680378337, 0.03276359895328425, 0.02520276842560327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 270.50000000000006, 195, 407, 204.5, 403.6, 406.85, 407.0, 0.11926840758785609, 0.18484273715031996, 0.2682374440183912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 724.4444444444445, 95, 1404, 999.0, 1404.0, 1404.0, 1404.0, 0.10045876167833105, 66.78061585406691, 0.1554298483909855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51902e05-e266-44c1-a0c9-074fed272aa9", 3, 0, 0.0, 306.6666666666667, 202, 422, 296.0, 422.0, 422.0, 422.0, 0.035664186024394307, 0.029731764455883405, 0.022870588042987233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=735b7495-a5e0-4c8a-b5ea-06c619bb8404", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 717.0454545454544, 249, 1932, 695.0, 1076.8, 1808.3999999999983, 1932.0, 0.09524180595780787, 0.030118191834313888, 0.04297042417237035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 115.625, 98, 306, 103.0, 166.70000000000016, 306.0, 306.0, 0.08862154722143754, 0.0688028613682059, 0.03150219061387038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 363.0714285714286, 201, 1375, 207.0, 925.0, 1375.0, 1375.0, 0.11840124490451785, 10.288181163947666, 0.2641233127822601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97ea500f-80e6-410c-8ee4-42ece4ff52a9", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 0.6124205508474576, 2.337129237288136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 308.53333333333336, 199, 588, 206.0, 480.00000000000006, 588.0, 588.0, 0.10586641070521145, 0.1640722595597369, 0.23809603892002149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 131.6923076923077, 94, 303, 102.0, 302.2, 303.0, 303.0, 0.07476764516425877, 0.05556462692382902, 0.037529853139090824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 161.0, 96, 304, 101.0, 302.4, 304.0, 304.0, 0.07476850520503825, 0.02864478489676195, 0.04215838341864611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 191.46153846153848, 91, 1102, 101.0, 781.1999999999997, 1102.0, 1102.0, 0.07476850520503825, 5.193743215117617, 0.04346144030022431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 212.23076923076923, 97, 572, 102.0, 506.79999999999995, 572.0, 572.0, 0.0747693652656038, 1.7097313946499644, 0.043534957194538385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 100.5, 99, 102, 100.5, 102.0, 102.0, 102.0, 0.0703358537014243, 0.020743581853349746, 0.04347909706347811], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1147.1272727272726, 767, 1681, 1156.0, 1540.1999999999998, 1649.6, 1681.0, 0.2451920076321585, 293.3348836619649, 0.48415843694553173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 717.0454545454544, 249, 1932, 695.0, 1076.8, 1808.3999999999983, 1932.0, 0.09084677452656442, 0.028728356788318758, 0.04098750960085231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 134.63636363636363, 96, 301, 101.0, 298.2, 301.0, 301.0, 0.05028065748816119, 0.013552208463605947, 0.029608629360704297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 118.45454545454545, 96, 300, 101.0, 260.60000000000014, 300.0, 300.0, 0.05027973817969064, 0.013551960681244743, 0.029558986703294692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eee55de7-86a5-46a8-aa6a-4d7298480b08", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 179.62500000000003, 92, 1136, 101.0, 548.7000000000006, 1136.0, 1136.0, 0.08564760293771279, 4.838258391123161, 0.049891401515962566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 177.06250000000003, 97, 693, 101.0, 421.40000000000026, 693.0, 693.0, 0.08564393533882882, 1.595526024381758, 0.0499729017235842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 146.63636363636363, 97, 426, 100.0, 398.2000000000001, 426.0, 426.0, 0.05027950835782555, 0.01345369657230879, 0.028675032110322386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 125.5625, 98, 299, 102.0, 290.6, 299.0, 299.0, 0.08564485220910191, 0.06364817629992826, 0.04298970120652185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 119.9090909090909, 98, 302, 102.0, 262.20000000000016, 302.0, 302.0, 0.050278818904835904, 0.03736541131501966, 0.025237610270591463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 152.875, 96, 303, 102.0, 300.9, 303.0, 303.0, 0.0856434769110539, 0.030955851456742015, 0.04839400080826031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 120.09090909090911, 97, 292, 104.0, 255.00000000000014, 292.0, 292.0, 0.049319392385085814, 0.038819756115604655, 0.017531502761885972], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 508.2307692307693, 96, 1509, 429.0, 1190.9999999999998, 1509.0, 1509.0, 0.0625541333846598, 0.012137719841689924, 0.042568952398710426], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 935.0952380952382, 726, 1648, 838.0, 1521.4, 1641.1999999999998, 1648.0, 0.08855042946958293, 0.04583176525281148, 0.040729738554856995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 286.72727272727275, 195, 590, 206.0, 577.8000000000001, 590.0, 590.0, 0.05025538874827532, 0.07788603705421186, 0.113025547155545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fce31c79-3880-4e34-80ce-2d0774e8a983", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["addBook", 64, 6, 9.375, 1025.6250000000002, 508, 2986, 805.0, 1822.5, 2375.75, 2986.0, 0.2960249401012035, 84.0977512511679, 1.0792515714761468], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 169.8909090909091, 97, 495, 103.0, 408.0, 420.99999999999983, 495.0, 0.2462899773413221, 0.18303386011400988, 0.1190561902187055], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 660.0, 480, 982, 599.0, 815.4, 906.4, 982.0, 0.24609822451317295, 72.36104923698365, 0.12377010314871492], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 154.18181818181824, 93, 412, 102.0, 303.4, 321.5999999999996, 412.0, 0.24667769988742524, 0.43650389862892053, 0.11996630326556425], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 974.6545454545457, 668, 1293, 994.0, 1205.0, 1251.6, 1293.0, 0.24568268517774028, 221.0657119870257, 0.1233211915833579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 130.93333333333337, 102, 307, 104.0, 304.6, 307.0, 307.0, 0.10406982391385794, 0.07774747587314583, 0.03699357021937919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, 3.278688524590164, 167.55737704918027, 94, 1277, 104.0, 242.7999999999999, 315.1999999999998, 1200.5599999999997, 0.757227801432526, 1.5139626160151611, 0.36854403817586723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 103.92307692307692, 101, 108, 104.0, 107.2, 108.0, 108.0, 0.07306326154399533, 0.056581217191785445, 0.025971706251967087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff50f43c-192e-4209-b60a-ac584e2eeb32", 3, 0, 0.0, 370.33333333333337, 197, 714, 200.0, 714.0, 714.0, 714.0, 0.026023820470337182, 0.026100062131871375, 0.0166884525802618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d29054c9-15fd-4655-b46d-f0d2f1c02a7d", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 122.64999999999999, 98, 294, 103.0, 273.00000000000034, 293.8, 294.0, 0.11817607052747889, 0.0959026509847021, 0.04200790007031476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 402.46153846153845, 202, 1201, 206.0, 961.7999999999997, 1201.0, 1201.0, 0.07472380930483864, 6.983487834389047, 0.1665849225315277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 357.4375, 196, 1436, 205.5, 841.0000000000006, 1436.0, 1436.0, 0.0855981168414295, 6.524688243968008, 0.19114335343997432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee0e57a3-31d3-40f9-92b7-9341296fd62d", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eee55de7-86a5-46a8-aa6a-4d7298480b08", 3, 0, 0.0, 660.6666666666667, 195, 1509, 278.0, 1509.0, 1509.0, 1509.0, 0.01649811096629436, 0.022743977845786658, 0.010579843295442672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6edae793-7ccc-4dce-a7f2-34c59006d13c", 3, 0, 0.0, 591.6666666666666, 284, 903, 588.0, 903.0, 903.0, 903.0, 0.021465829976316034, 0.025371884324219895, 0.013765522478301623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 128.73333333333332, 95, 301, 103.0, 295.0, 301.0, 301.0, 0.1021346134204882, 0.08467996757226023, 0.036305663364314164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 116.73333333333333, 99, 304, 103.0, 185.20000000000007, 304.0, 304.0, 0.1175226231049477, 0.09124070836761076, 0.04177561993183688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b5f86a9-1756-4875-b53d-9088840572bb", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/735b7495-a5e0-4c8a-b5ea-06c619bb8404", 3, 0, 0.0, 309.3333333333333, 196, 437, 295.0, 437.0, 437.0, 437.0, 0.023578788521845747, 0.027869329792585256, 0.015120512170584676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 113.00000000000001, 96, 286, 102.0, 176.20000000000005, 286.0, 286.0, 0.10594342621040363, 0.07873334701769255, 0.053178633859519014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 151.7333333333333, 95, 301, 101.0, 301.0, 301.0, 301.0, 0.10594641936418023, 0.02834894424393104, 0.06042256729363404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 137.66666666666669, 95, 304, 101.0, 302.2, 304.0, 304.0, 0.10594267794838472, 0.028554862415775567, 0.06228270715324961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51902e05-e266-44c1-a0c9-074fed272aa9", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 193.33333333333334, 92, 303, 103.0, 303.0, 303.0, 303.0, 0.1059456710598805, 0.028555669152858416, 0.06238792934483197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4cb0acb-a4a4-48ab-8eac-7a063315ab9f", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.2831725117554859, 1.0806475313479624], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 26.31578947368421, 0.37537537537537535], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.15015015015015015], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.526315789473685, 0.15015015015015015], "isController": false}, {"data": ["401/Unauthorized", 10, 52.63157894736842, 0.7507507507507507], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1332, 19, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
