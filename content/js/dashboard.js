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

    var data = {"OkPercent": 97.37434358589647, "KoPercent": 2.625656414103526};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8188265635074146, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "see books"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4fed9c6f-aab9-4ace-b536-8e36d12e7184"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f885222-2ae4-4bdb-853f-e25aa6ad0148"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/32bcf3a3-d695-4819-96c9-515d04cd2710"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e11158e-0a15-488d-ba73-5353f29dc6ee"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f885222-2ae4-4bdb-853f-e25aa6ad0148"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e11158e-0a15-488d-ba73-5353f29dc6ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b643a1a-ab0c-4976-9b41-06dd0d350e2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38d37687-3c33-42c8-8081-d949fa8c8dd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/143abb85-8a3e-4763-a3ee-b11cbdf3f01a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32bcf3a3-d695-4819-96c9-515d04cd2710"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b643a1a-ab0c-4976-9b41-06dd0d350e2c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=143abb85-8a3e-4763-a3ee-b11cbdf3f01a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9281609195402298, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/38d37687-3c33-42c8-8081-d949fa8c8dd0"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab5aef9e-50e3-4faa-8e1c-54d0f8591b4d"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6251559f-1a28-4169-9ce4-b2e7efe880e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28a88b90-cea4-402b-8cfb-2cd6099bab04"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f435cc3f-b7ed-4c7f-8ada-65d280cdcbff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28a88b90-cea4-402b-8cfb-2cd6099bab04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab5aef9e-50e3-4faa-8e1c-54d0f8591b4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f435cc3f-b7ed-4c7f-8ada-65d280cdcbff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6251559f-1a28-4169-9ce4-b2e7efe880e5"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fabf26a1-e7c2-4b22-8fcb-892d84fb147b"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fabf26a1-e7c2-4b22-8fcb-892d84fb147b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b3c3b16-8fc3-4a78-a07b-fc18409ddd63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 35, 2.625656414103526, 260.76519129782497, 78, 1776, 95.0, 649.6000000000001, 808.3, 1143.9800000000002, 5.151372282293655, 733.8126932851494, 3.780042526355858], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1181.5714285714287, 969, 1489, 1152.5, 1423.3, 1482.6, 1489.0, 0.2509511496699544, 301.9787995292425, 1.233924842371309], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 229.70588235294122, 164, 639, 168.0, 519.7999999999998, 639.0, 639.0, 0.08914104735487051, 6.403182499252789, 0.19913868282304453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 97.78571428571428, 83, 241, 85.0, 169.5, 241.0, 241.0, 0.1521854923744198, 0.118151822693031, 0.054097186742469536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fed9c6f-aab9-4ace-b536-8e36d12e7184", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 241.64705882352942, 165, 490, 168.0, 359.5999999999999, 490.0, 490.0, 0.07983394539358135, 0.1237270227925914, 0.1795484142982596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f885222-2ae4-4bdb-853f-e25aa6ad0148", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 82.0, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.040040841658491665, 0.029756914552843898, 0.02009862559811007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 85.16666666666667, 79, 111, 80.5, 111.0, 111.0, 111.0, 0.04004191053302457, 0.010714339341844464, 0.022836402100865575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 90.66666666666667, 82, 123, 82.5, 123.0, 123.0, 123.0, 0.040041376088624916, 0.010792402148887183, 0.023539949614601756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32bcf3a3-d695-4819-96c9-515d04cd2710", 3, 0, 0.0, 424.0, 158, 736, 378.0, 736.0, 736.0, 736.0, 0.046405865701424666, 0.02983450024749795, 0.029758969867124535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 89.83333333333333, 79, 133, 81.5, 133.0, 133.0, 133.0, 0.040040841658491665, 0.01079225810326533, 0.02357873781256882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 85.66666666666667, 83, 89, 85.0, 89.0, 89.0, 89.0, 0.04971908715755979, 0.014663246407795953, 0.030734552901108738], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 758.9107142857146, 634, 1145, 648.0, 1054.1000000000001, 1111.5, 1145.0, 0.24552357903228636, 293.73155832938744, 0.48481316094070603], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 382.57142857142856, 85, 670, 418.5, 617.5, 670.0, 670.0, 0.08266414737836561, 0.016958374542394898, 0.05533815725377893], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 382.57142857142856, 85, 670, 418.5, 617.5, 670.0, 670.0, 0.08078150334377723, 0.016572154110913007, 0.054077852091952434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e11158e-0a15-488d-ba73-5353f29dc6ee", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 731.3750000000001, 108, 1389, 854.0, 1180.5, 1369.5, 1389.0, 0.09664247920173312, 0.02977607635561211, 0.043602368546094436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 140.73684210526315, 80, 246, 83.0, 244.0, 246.0, 246.0, 0.10382683869134467, 0.035989319497040935, 0.05875480540664601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 81.5, 79, 83, 81.5, 83.0, 83.0, 83.0, 0.03779956152508631, 0.01018816306730842, 0.022258921484010787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 100.42105263157895, 80, 243, 83.0, 242.0, 243.0, 243.0, 0.10391144557227862, 0.07722325203174221, 0.05215867482827266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 108.16666666666666, 81, 239, 82.0, 239.0, 239.0, 239.0, 0.037799085262136656, 0.01018803469956027, 0.022221727859185806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 128.8421052631579, 80, 653, 82.0, 244.0, 653.0, 653.0, 0.10382456926464882, 1.6332411605674286, 0.06066928083726318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 172.21052631578948, 78, 818, 83.0, 252.0, 818.0, 818.0, 0.10391542378350588, 4.947759639864691, 0.060620891238835926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 208.28571428571428, 80, 725, 84.0, 722.0, 725.0, 725.0, 0.15773403787870252, 20.31206429492885, 0.09079389512939824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f885222-2ae4-4bdb-853f-e25aa6ad0148", 3, 0, 0.0, 375.6666666666667, 280, 454, 393.0, 454.0, 454.0, 454.0, 0.0380705828606236, 0.031737878485044606, 0.024413752680803542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 162.2857142857143, 78, 567, 82.0, 485.0, 567.0, 567.0, 0.15774647887323942, 6.662544014084507, 0.09095510563380281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 134.33333333333331, 79, 240, 82.5, 240.0, 240.0, 240.0, 0.03779860901118839, 0.010114080926821893, 0.021557019201693377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 82.42857142857142, 79, 85, 82.5, 85.0, 85.0, 85.0, 0.1577429241031188, 0.11722887230710294, 0.07917955370019832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e11158e-0a15-488d-ba73-5353f29dc6ee", 3, 0, 0.0, 301.6666666666667, 175, 529, 201.0, 529.0, 529.0, 529.0, 0.021411136645874074, 0.029516980369556217, 0.013730448955850235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 109.16666666666666, 81, 241, 83.5, 241.0, 241.0, 241.0, 0.03779837089021463, 0.028090390866653648, 0.018973010388252266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 105.21428571428571, 79, 246, 82.0, 244.0, 246.0, 246.0, 0.15774825631838105, 0.07605719501064802, 0.08807317547239969], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 428.71428571428567, 83, 842, 437.0, 798.5, 842.0, 842.0, 0.08111897836440964, 0.016166079881913945, 0.055197798126731014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 156.0, 84, 331, 96.0, 331.0, 331.0, 331.0, 0.04024387790007445, 0.031676333581503915, 0.01430544097229209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1136.4782608695652, 795, 1776, 1103.0, 1463.4, 1717.7999999999993, 1776.0, 0.09844583980721736, 0.050953413181469925, 0.045281240770702516], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 180.35714285714286, 80, 393, 178.0, 305.5, 393.0, 393.0, 0.08295706379398206, 0.16622081874177835, 0.05361308566205662], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 245.16666666666666, 165, 482, 167.0, 482.0, 482.0, 482.0, 0.03777837943345024, 0.05854910953211477, 0.08496446077659756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b643a1a-ab0c-4976-9b41-06dd0d350e2c", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 95.17647058823529, 81, 244, 83.0, 140.7999999999999, 244.0, 244.0, 0.0892018532996815, 0.06629161168072033, 0.04477514901956669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38d37687-3c33-42c8-8081-d949fa8c8dd0", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 95.23529411764706, 80, 246, 82.0, 152.39999999999992, 246.0, 246.0, 0.08918173138462508, 0.03174230282968388, 0.05042087547607306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 443.9, 395, 568, 404.5, 566.9, 568.0, 568.0, 0.045378845289902756, 13.342887234703927, 0.025880122704397664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 669.5, 553, 723, 717.0, 723.0, 723.0, 723.0, 0.04531591993583266, 40.77534441515274, 0.025799981760342226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 210.90000000000003, 81, 248, 242.0, 247.9, 248.0, 248.0, 0.04540934251812968, 0.08035325062778416, 0.025143649616972196], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 756.2542372881353, 428, 1824, 677.0, 1202.0, 1251.0, 1824.0, 0.27299016772700985, 73.06752458068247, 0.9941440138808559], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/143abb85-8a3e-4763-a3ee-b11cbdf3f01a", 3, 0, 0.0, 416.0, 179, 842, 227.0, 842.0, 842.0, 842.0, 0.019198771278638168, 0.026467056108409062, 0.012311712050428773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 97.35714285714286, 79, 240, 83.0, 187.0, 240.0, 240.0, 0.0874896106087402, 0.06501913444653447, 0.0439156834500903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 116.49999999999999, 80, 245, 82.0, 244.0, 245.0, 245.0, 0.08740276442457766, 0.023387067824545194, 0.049846889085891945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 93.21428571428572, 80, 242, 82.0, 163.0, 242.0, 242.0, 0.0874896106087402, 0.023581184109387008, 0.05143432186177891], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 145.96428571428567, 80, 542, 83.0, 327.0, 333.0, 542.0, 0.2461235540241201, 0.18291018028550332, 0.1189757414472065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 127.07142857142857, 79, 244, 82.0, 243.5, 244.0, 244.0, 0.08749234441986325, 0.023581920956916268, 0.0515213707863062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32bcf3a3-d695-4819-96c9-515d04cd2710", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 477.0892857142856, 388, 658, 407.5, 641.5, 650.45, 658.0, 0.24610516601111868, 72.3630902678591, 0.12377359423410754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 85.5, 81, 105, 83.0, 103.4, 105.0, 105.0, 0.04544277164552821, 0.03377143478735055, 0.02551718134392453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b643a1a-ab0c-4976-9b41-06dd0d350e2c", 3, 0, 0.0, 430.33333333333337, 218, 755, 318.0, 755.0, 755.0, 755.0, 0.021891258820353032, 0.02587472681533264, 0.014038339803416497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=143abb85-8a3e-4763-a3ee-b11cbdf3f01a", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 130.26785714285714, 80, 331, 86.0, 245.0, 248.15, 331.0, 0.24643006446786508, 0.43606570001540185, 0.11984587119628594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 123.05882352941178, 79, 557, 83.0, 303.39999999999975, 557.0, 557.0, 0.08918126354112567, 4.74294422925093, 0.051978004359390005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 327.6818181818182, 79, 725, 83.5, 723.1, 724.85, 725.0, 0.14687719063991722, 54.08899239952265, 0.08118407217011049], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 605.7857142857146, 548, 811, 562.0, 727.8000000000001, 745.7499999999999, 811.0, 0.24592251684130093, 221.28151293947673, 0.12344157583635613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 120.70588235294116, 81, 556, 82.0, 302.39999999999975, 556.0, 556.0, 0.08920372556736193, 1.565502836809655, 0.05207820903843632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 87.41176470588235, 81, 97, 85.0, 96.2, 97.0, 97.0, 0.07696068667040908, 0.05749504424107709, 0.027357119089871974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 275.90909090909093, 80, 656, 83.0, 568.8, 643.0999999999998, 656.0, 0.14687621005968515, 17.69059013776321, 0.08132696396859519], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 356.28571428571433, 83, 853, 380.5, 715.5, 853.0, 853.0, 0.08075913587724612, 0.016567565472585158, 0.05444594365608146], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 132.8103448275863, 81, 831, 88.0, 244.0, 285.75, 556.5, 0.7083392700848786, 1.553924839453276, 0.3396868766410877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 113.16666666666667, 83, 248, 85.0, 248.0, 248.0, 248.0, 0.03860507013254407, 0.029896309194440873, 0.013722896023677777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 249.07142857142856, 164, 486, 192.5, 406.0, 486.0, 486.0, 0.08735695298947972, 0.1353862152288128, 0.1964678347019256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 99.3157894736842, 82, 247, 86.0, 136.0, 247.0, 247.0, 0.10696511811200937, 0.08680470034285136, 0.03802275682887833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38d37687-3c33-42c8-8081-d949fa8c8dd0", 3, 0, 0.0, 768.3333333333334, 196, 1739, 370.0, 1739.0, 1739.0, 1739.0, 0.07686985932815743, 0.0347816095267379, 0.04929479911343429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 417.65217391304344, 98, 991, 342.0, 849.6, 963.9999999999997, 991.0, 0.10067275663893059, 0.06183902727137436, 0.04551902961311022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 83.77272727272728, 81, 95, 82.5, 88.7, 94.1, 95.0, 0.1468732683975459, 0.10915093481497307, 0.0737234960511119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 118.63636363636363, 81, 251, 82.0, 245.1, 250.25, 251.0, 0.14672144267193085, 0.12941029234247453, 0.07863612832123994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab5aef9e-50e3-4faa-8e1c-54d0f8591b4d", 3, 0, 0.0, 321.0, 190, 514, 259.0, 514.0, 514.0, 514.0, 0.0976944118796405, 0.045349033639442496, 0.06264908574312883], "isController": false}, {"data": ["login", 23, 0, 0.0, 2108.6956521739125, 1290, 3050, 2204.0, 2730.8000000000006, 3021.9999999999995, 3050.0, 0.09953047579894844, 51.901508779237076, 0.22192777414154963], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 175.0, 164, 217, 165.5, 217.0, 217.0, 217.0, 0.040018408467895235, 0.06202071702983372, 0.09000233857574484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6251559f-1a28-4169-9ce4-b2e7efe880e5", 3, 0, 0.0, 269.3333333333333, 183, 420, 205.0, 420.0, 420.0, 420.0, 0.018329229622478967, 0.02526832273802032, 0.011754095819102722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 97.1764705882353, 83, 245, 86.0, 128.9999999999999, 245.0, 245.0, 0.0849787553111722, 0.06879627749312671, 0.030207291927018244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28a88b90-cea4-402b-8cfb-2cd6099bab04", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 303.2142857142857, 161, 807, 169.5, 803.5, 807.0, 807.0, 0.15758667266996848, 27.14197398412877, 0.34865611633273297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f435cc3f-b7ed-4c7f-8ada-65d280cdcbff", 3, 0, 0.0, 377.0, 168, 693, 270.0, 693.0, 693.0, 693.0, 0.02793062033907773, 0.028012448328352372, 0.017911237652338256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28a88b90-cea4-402b-8cfb-2cd6099bab04", 3, 0, 0.0, 253.0, 177, 337, 245.0, 337.0, 337.0, 337.0, 0.019805902158843335, 0.0273040350399419, 0.012701050538060341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab5aef9e-50e3-4faa-8e1c-54d0f8591b4d", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f435cc3f-b7ed-4c7f-8ada-65d280cdcbff", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 88.28571428571426, 83, 105, 85.0, 103.0, 105.0, 105.0, 0.08598927590887594, 0.07129384301429265, 0.03056650042073324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6251559f-1a28-4169-9ce4-b2e7efe880e5", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 428.1363636363637, 163, 817, 246.0, 810.1, 816.1, 817.0, 0.14663831659212553, 71.90127486810883, 0.31444441574628906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 101.86363636363637, 82, 413, 85.5, 101.0, 366.64999999999935, 413.0, 0.15153393671391768, 0.11764597625738729, 0.05386557906627544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fabf26a1-e7c2-4b22-8fcb-892d84fb147b", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, 37.5, 504.87500000000006, 80, 826, 644.0, 814.1, 826.0, 826.0, 0.07247755460730755, 54.19999289380226, 0.120151541790105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 316.2105263157894, 165, 900, 325.0, 495.0, 900.0, 900.0, 0.10377636739018822, 6.686716300672908, 0.23199800059807957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fabf26a1-e7c2-4b22-8fcb-892d84fb147b", 3, 0, 0.0, 293.3333333333333, 197, 461, 222.0, 461.0, 461.0, 461.0, 0.027683704448771305, 0.022808416653593806, 0.01775289640757795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b3c3b16-8fc3-4a78-a07b-fc18409ddd63", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 92.52941176470588, 81, 246, 83.0, 117.99999999999989, 246.0, 246.0, 0.07992364940785979, 0.0593963839837708, 0.04011792558167962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 119.94117647058823, 81, 243, 83.0, 242.2, 243.0, 243.0, 0.07992364940785979, 0.02138582025171248, 0.045581456302920036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 110.41176470588236, 81, 243, 82.0, 243.0, 243.0, 243.0, 0.07986545020624078, 0.021526234625900836, 0.04695214943765327], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 731.3750000000001, 108, 1389, 854.0, 1180.5, 1369.5, 1389.0, 0.10190909708539982, 0.031398750127386375, 0.04597851841157687], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 129.35294117647058, 79, 244, 83.0, 244.0, 244.0, 244.0, 0.0799251524454746, 0.021542326245069323, 0.047065299731075365], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 31.428571428571427, 0.8252063015753939], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.2250562640660165], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.2250562640660165], "isController": false}, {"data": ["401/Unauthorized", 18, 51.42857142857143, 1.350337584396099], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 35, "401/Unauthorized", 18, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
