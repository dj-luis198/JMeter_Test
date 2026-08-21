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

    var data = {"OkPercent": 97.95918367346938, "KoPercent": 2.0408163265306123};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7221860767729343, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7080611-35cd-42ef-9bfb-6b411528eaec"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2cd16d56-d928-4e16-9073-ae76fe5324d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c78d6ff7-1287-479b-8022-23b7070ef86a"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/421e246b-2f72-478b-8ef1-6564252d0737"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2049406e-251b-49ad-a3bb-8489c4332818"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b541f08f-ebf9-4aa8-aadb-8d0ac7eae75f"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82253713-4115-4c53-99bf-b56df25ace41"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e25e45ff-70c8-4ac7-ba32-22e724166378"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/24ad1478-99a5-4129-8c4d-3d318022cf76"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8ef21865-73e2-44ab-b368-3b41bc804315"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8076c52d-6db7-487d-ba95-966310d3772b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/333e6c75-6f53-475c-aade-000a4c83151d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/bb69a8e4-b9bd-47f6-a86e-e68a55cdc49f"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23275862068965517, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cd16d56-d928-4e16-9073-ae76fe5324d6"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9215116279069767, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82253713-4115-4c53-99bf-b56df25ace41"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=421e246b-2f72-478b-8ef1-6564252d0737"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2bac16fc-2592-43ef-bffd-ce251d5a7ee9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b541f08f-ebf9-4aa8-aadb-8d0ac7eae75f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/630d5ab7-8d45-421e-ba01-788aaad86394"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=333e6c75-6f53-475c-aade-000a4c83151d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e25e45ff-70c8-4ac7-ba32-22e724166378"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7080611-35cd-42ef-9bfb-6b411528eaec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8076c52d-6db7-487d-ba95-966310d3772b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ef21865-73e2-44ab-b368-3b41bc804315"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24ad1478-99a5-4129-8c4d-3d318022cf76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 27, 2.0408163265306123, 488.4928193499626, 139, 3221, 157.0, 1403.8000000000004, 1679.0, 2146.04, 5.211492858324601, 747.9891303210504, 3.8175422325909354], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2365.6206896551726, 1716, 3296, 2402.0, 2901.3, 3077.85, 3296.0, 0.2506189856844707, 301.57947771462494, 1.2322915946497168], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7080611-35cd-42ef-9bfb-6b411528eaec", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 544.2857142857142, 146, 986, 546.0, 895.0, 986.0, 986.0, 0.094167025398192, 0.019318165575898622, 0.0630385702250592], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 544.2857142857142, 146, 986, 546.0, 895.0, 986.0, 986.0, 0.09558662879615469, 0.019609394202670962, 0.06398890042945707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 213.54999999999998, 141, 433, 145.0, 425.5, 432.65, 433.0, 0.10030039969709278, 0.034370517825888534, 0.056781388383207704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 159.1, 141, 427, 144.5, 153.0, 413.2999999999998, 427.0, 0.10029687876113295, 0.07453703587619354, 0.05034433172189682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 221.2, 140, 1121, 144.0, 430.7, 1086.4999999999995, 1121.0, 0.10029889069426892, 1.500242206149325, 0.058631753876552124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 213.39999999999998, 139, 1259, 143.0, 407.30000000000064, 1217.8499999999995, 1259.0, 0.10030039969709278, 4.538206185337586, 0.058534686385725246], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 279.14285714285717, 141, 475, 266.5, 460.5, 475.0, 475.0, 0.09438987061845591, 0.1930725841249722, 0.06100182416852637], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2cd16d56-d928-4e16-9073-ae76fe5324d6", 3, 0, 0.0, 686.0, 446, 1051, 561.0, 1051.0, 1051.0, 1051.0, 0.017959232542129368, 0.02475825189320243, 0.011516825555987908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 197.22222222222223, 140, 428, 145.5, 426.2, 428.0, 428.0, 0.08754097403923781, 0.06505730590220701, 0.04394146548453929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 173.66666666666666, 140, 421, 143.0, 417.4, 421.0, 421.0, 0.08754012255617158, 0.023423821855850596, 0.0499252261453166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 995.8571428571429, 838, 1283, 862.0, 1283.0, 1283.0, 1283.0, 0.07355181725525632, 21.62667642322766, 0.04194752077838837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c78d6ff7-1287-479b-8022-23b7070ef86a", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.5295786691542289, 0.9895185530679934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1381.7142857142856, 1015, 1708, 1441.0, 1708.0, 1708.0, 1708.0, 0.07333067946112426, 65.9830742807046, 0.041749791138511176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 304.5714285714286, 141, 429, 423.0, 429.0, 429.0, 429.0, 0.07412113511224057, 0.13115966486658195, 0.041041683211562895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 145.55555555555554, 140, 156, 143.0, 156.0, 156.0, 156.0, 0.045973958306728034, 0.03416619362443363, 0.023076772040681846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 205.11111111111111, 141, 429, 143.0, 429.0, 429.0, 429.0, 0.045974897705852606, 0.012301876925198843, 0.026220058847869064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 143.66666666666666, 141, 148, 143.0, 148.0, 148.0, 148.0, 0.04597442800149161, 0.012391545047277037, 0.027027935211814406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 238.11111111111114, 139, 439, 143.0, 439.0, 439.0, 439.0, 0.04597419315291017, 0.012391481748245317, 0.02707269381953597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 149.0, 142, 169, 144.0, 169.0, 169.0, 169.0, 0.07434154630416313, 0.05524796556393373, 0.041744520629779104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1166.0, 142, 1836, 1542.0, 1776.0, 1836.0, 1836.0, 0.06722056411497405, 40.32949384875821, 0.03566716129798428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 175.0, 140, 425, 143.0, 418.7, 425.0, 425.0, 0.08754054829563417, 0.023594913407807644, 0.05146426765036305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 801.2, 141, 1292, 1111.0, 1275.2, 1292.0, 1292.0, 0.0672208653566067, 13.182816946380155, 0.035732966512805574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 222.44444444444446, 141, 432, 144.0, 428.4, 432.0, 432.0, 0.0875413997869826, 0.023595142911335153, 0.051550257882373544], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 464.99999999999994, 144, 860, 485.0, 849.6, 860.0, 860.0, 0.10240010082471467, 0.021200020873866705, 0.06891545247059935], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 417.1111111111111, 284, 586, 300.0, 586.0, 586.0, 586.0, 0.04594016548668501, 0.07119828381579014, 0.10332050890218317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/421e246b-2f72-478b-8ef1-6564252d0737", 3, 0, 0.0, 436.3333333333333, 327, 593, 389.0, 593.0, 593.0, 593.0, 0.019585569352501078, 0.02700028847911525, 0.01255975638815987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2049406e-251b-49ad-a3bb-8489c4332818", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 726.6363636363636, 230, 1339, 800.0, 1256.9, 1327.8999999999999, 1339.0, 0.09819850381188737, 0.06031919814226285, 0.04440030006338267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 147.66666666666666, 142, 157, 146.0, 157.0, 157.0, 157.0, 0.06721845549914185, 0.04995434046371772, 0.033740513795467685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 200.46666666666664, 140, 430, 145.0, 425.2, 430.0, 430.0, 0.0672208653566067, 0.08529522563803804, 0.03457323153106724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b541f08f-ebf9-4aa8-aadb-8d0ac7eae75f", 3, 0, 0.0, 347.0, 267, 504, 270.0, 504.0, 504.0, 504.0, 0.0482889611434826, 0.031045149172649132, 0.030966553858287997], "isController": false}, {"data": ["login", 22, 0, 0.0, 3166.181818181818, 1806, 5413, 3177.0, 4140.2, 5230.899999999998, 5413.0, 0.10124624928667415, 38.676637996049095, 0.20617777575796623], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/82253713-4115-4c53-99bf-b56df25ace41", 3, 0, 0.0, 401.3333333333333, 266, 470, 468.0, 470.0, 470.0, 470.0, 0.05923351827354039, 0.026801624479238652, 0.03798503613244615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e25e45ff-70c8-4ac7-ba32-22e724166378", 1, 0, 0.0, 714.0, 714, 714, 714.0, 714.0, 714.0, 714.0, 1.4005602240896358, 0.253030899859944, 0.9656206232492998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 165.5, 144, 429, 149.0, 186.90000000000038, 429.0, 429.0, 0.08685372385341021, 0.070314196361794, 0.030873784651016912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24ad1478-99a5-4129-8c4d-3d318022cf76", 3, 0, 0.0, 1272.3333333333335, 256, 3221, 340.0, 3221.0, 3221.0, 3221.0, 0.020626779059693897, 0.024380154546142105, 0.013227459227733392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1314.8, 286, 1979, 1692.0, 1928.6000000000001, 1979.0, 1979.0, 0.06717570926353031, 53.611704632604855, 0.13962138790613315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ef21865-73e2-44ab-b368-3b41bc804315", 3, 0, 0.0, 690.0, 475, 1026, 569.0, 1026.0, 1026.0, 1026.0, 0.021516944593867673, 0.029662845167652857, 0.013798301057916441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8076c52d-6db7-487d-ba95-966310d3772b", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/333e6c75-6f53-475c-aade-000a4c83151d", 3, 0, 0.0, 784.3333333333334, 346, 1512, 495.0, 1512.0, 1512.0, 1512.0, 0.023964149632150305, 0.024034357101775743, 0.015367635018013052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb69a8e4-b9bd-47f6-a86e-e68a55cdc49f", 2, 0, 0.0, 382.5, 258, 507, 382.5, 507.0, 507.0, 507.0, 0.03193459794341189, 0.028223448377722424, 0.019849972256818036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 444.40000000000003, 285, 1402, 293.5, 834.8000000000006, 1375.0999999999997, 1402.0, 0.10022400064143361, 6.142698658063272, 0.22412396393439338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 891.2307692307692, 141, 1851, 1171.0, 1801.8, 1851.0, 1851.0, 0.12216782099594968, 78.71403391096786, 0.1856928853689938], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1180.5652173913045, 184, 1866, 1267.0, 1745.2, 1847.5999999999997, 1866.0, 0.09478751112722957, 0.029572801960040883, 0.04276545912185553], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 23, 0, 0.0, 163.30434782608697, 144, 468, 150.0, 164.20000000000002, 408.59999999999917, 468.0, 0.101225711330678, 0.07858832080848535, 0.035982577074576944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 422.22222222222223, 285, 854, 293.5, 852.2, 854.0, 854.0, 0.08747885927567504, 0.13557514616259403, 0.19674200479675744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 584.25, 286, 1822, 566.0, 1533.400000000001, 1822.0, 1822.0, 0.07514371234986912, 7.598253583807157, 0.1673977849825291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 143.42857142857142, 143, 146, 143.0, 146.0, 146.0, 146.0, 0.04962568058076225, 0.03688002238472663, 0.024909765447765426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 183.0, 141, 424, 142.0, 424.0, 424.0, 424.0, 0.04962603239870972, 0.0239268370493779, 0.027706944985998367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 342.57142857142856, 142, 1539, 143.0, 1539.0, 1539.0, 1539.0, 0.04962568058076225, 6.390504092789388, 0.028565228526259073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 322.99999999999994, 142, 843, 144.0, 843.0, 843.0, 843.0, 0.04962603239870972, 2.095993694835348, 0.028613893959802912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 147.66666666666666, 144, 153, 146.0, 153.0, 153.0, 153.0, 0.04761602437940448, 0.014043007190019682, 0.029434515070471717], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1646.5862068965516, 1117, 2692, 1553.0, 2304.7000000000003, 2458.6, 2692.0, 0.2538915445360788, 303.74255424743046, 0.5013366240741713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1180.5652173913045, 184, 1866, 1267.0, 1745.2, 1847.5999999999997, 1866.0, 0.09383235829274064, 0.02927480336001436, 0.04233452102660759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 221.90909090909093, 142, 435, 145.0, 433.0, 435.0, 435.0, 0.050463113757621074, 0.013601386129983807, 0.02971607187094288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 195.63636363636365, 139, 439, 143.0, 437.6, 439.0, 439.0, 0.050463345261033125, 0.013601448527387835, 0.02966692758509955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 23, 0, 0.0, 262.8260869565217, 141, 1678, 145.0, 427.40000000000003, 1428.5999999999965, 1678.0, 0.10225767154835899, 4.026869071555917, 0.05973424953984048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 23, 0, 0.0, 224.43478260869568, 140, 855, 143.0, 424.6, 768.9999999999987, 855.0, 0.10225539841815345, 1.3336010822400157, 0.05983278046877431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 23, 0, 0.0, 157.21739130434784, 141, 430, 144.0, 152.60000000000002, 374.9999999999992, 430.0, 0.10238057083845235, 0.07608556094537329, 0.051390247471645036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 194.36363636363637, 140, 426, 144.0, 425.4, 426.0, 426.0, 0.050463345261033125, 0.013502887306174879, 0.028779876594182952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 23, 0, 0.0, 181.2173913043478, 139, 428, 143.0, 421.8, 427.0, 428.0, 0.10238603988603988, 0.034082309472934474, 0.05801817630430912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 194.27272727272728, 140, 426, 144.0, 424.2, 426.0, 426.0, 0.050462882256333094, 0.037502200583075664, 0.025330001445073448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 175.54545454545453, 144, 447, 149.0, 388.4000000000002, 447.0, 447.0, 0.050864464697749474, 0.04003589701795516, 0.018080727685528136], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 777.1538461538462, 143, 3221, 504.0, 2417.7999999999993, 3221.0, 3221.0, 0.10406160446984615, 0.0208873653202696, 0.07080754306549478], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1594.227272727273, 967, 2592, 1500.0, 2221.9, 2541.2999999999993, 2592.0, 0.10096235480924999, 0.052255906297756345, 0.04643873937027026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 444.45454545454544, 286, 865, 294.0, 860.6, 865.0, 865.0, 0.050429105846108706, 0.07815526462673293, 0.11341624098006675], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1496.9999999999998, 738, 4299, 1153.0, 2561.0, 3131.499999999995, 4299.0, 0.2648452746027321, 78.87872093816792, 0.9635897642528576], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 262.7241379310343, 140, 800, 147.0, 572.0, 578.15, 800.0, 0.255313154790203, 0.1897395613235786, 0.12341798009877979], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 928.0000000000001, 695, 1450, 843.0, 1265.0, 1309.8999999999996, 1450.0, 0.2550033414230945, 74.97944928621047, 0.12824875081337272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cd16d56-d928-4e16-9073-ae76fe5324d6", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 0.21007449127906977, 0.8016896802325582], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 199.551724137931, 141, 591, 147.0, 427.2, 437.2499999999999, 591.0, 0.25577477707905205, 0.45260146100316634, 0.12439046775914836], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1382.1379310344828, 974, 1967, 1403.5, 1840.1, 1869.6499999999999, 1967.0, 0.2548218443829357, 229.28914350478888, 0.12790862110627826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 148.41666666666666, 144, 168, 145.5, 163.8, 168.0, 168.0, 0.07315333548729266, 0.05465068520290907, 0.026003724723998565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, 4.069767441860465, 242.4999999999999, 141, 3047, 151.0, 398.4000000000004, 596.7, 2702.440000000005, 0.7161295694895495, 1.6052129197372804, 0.34185786441418936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 273.4285714285714, 144, 463, 157.0, 463.0, 463.0, 463.0, 0.04667569063352248, 0.03614631120349934, 0.016591749404884944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 177.29999999999998, 142, 428, 149.0, 396.40000000000055, 427.7, 428.0, 0.10237143427497991, 0.08307681824463702, 0.03638984577743427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82253713-4115-4c53-99bf-b56df25ace41", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 567.5714285714286, 287, 1683, 290.0, 1683.0, 1683.0, 1683.0, 0.049575070821529746, 8.538572835516998, 0.10968346095963173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=421e246b-2f72-478b-8ef1-6564252d0737", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 23, 0, 0.0, 433.82608695652164, 285, 2108, 292.0, 573.0, 1800.9999999999957, 2108.0, 0.10218679746576742, 5.466742015545722, 0.2286837438021486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bac16fc-2592-43ef-bffd-ce251d5a7ee9", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.5651963495575222, 1.056070243362832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b541f08f-ebf9-4aa8-aadb-8d0ac7eae75f", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/630d5ab7-8d45-421e-ba01-788aaad86394", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=333e6c75-6f53-475c-aade-000a4c83151d", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 149.77777777777777, 145, 156, 150.0, 156.0, 156.0, 156.0, 0.04442338446958479, 0.03683149747527098, 0.015791124948172718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e25e45ff-70c8-4ac7-ba32-22e724166378", 3, 0, 0.0, 378.0, 240, 624, 270.0, 624.0, 624.0, 624.0, 0.03533069530808366, 0.029453746967448652, 0.022656728436498963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 150.2, 142, 168, 146.0, 166.8, 168.0, 168.0, 0.06935165449930417, 0.053842348952096504, 0.02465234593529953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7080611-35cd-42ef-9bfb-6b411528eaec", 3, 0, 0.0, 743.3333333333334, 273, 1213, 744.0, 1213.0, 1213.0, 1213.0, 0.016201328508937733, 0.022334839269320086, 0.010389523815952909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8076c52d-6db7-487d-ba95-966310d3772b", 3, 0, 0.0, 455.3333333333333, 323, 570, 473.0, 570.0, 570.0, 570.0, 0.034583727203559816, 0.02883103039333226, 0.022177715687178662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ef21865-73e2-44ab-b368-3b41bc804315", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24ad1478-99a5-4129-8c4d-3d318022cf76", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 0.21662357613908872, 0.8266824040767387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 168.00000000000003, 142, 423, 144.0, 341.4000000000003, 423.0, 423.0, 0.07594215739012118, 0.05643748220105687, 0.038119403221213176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 191.33333333333334, 141, 437, 143.5, 433.1, 437.0, 437.0, 0.07581165856956036, 0.029774337911515156, 0.04270575363106256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 365.50000000000006, 140, 1679, 146.0, 1304.6000000000013, 1679.0, 1679.0, 0.07521530380714797, 5.658488683622494, 0.043679720700505194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 319.99999999999994, 141, 837, 283.5, 716.1000000000004, 837.0, 837.0, 0.07561436672967864, 1.8714432695337115, 0.043985310333963454], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6046863189720333], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.22675736961451248], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.22675736961451248], "isController": false}, {"data": ["401/Unauthorized", 13, 48.148148148148145, 0.982615268329554], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 27, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
