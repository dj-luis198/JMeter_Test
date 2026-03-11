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

    var data = {"OkPercent": 96.80608365019012, "KoPercent": 3.193916349809886};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7444589308996089, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/305e9406-8dd5-4a9f-b710-eb51f6374633"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=defb901a-2ee0-478e-bc38-14de96b5201f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a9192e87-ccd2-44ea-9d11-627f123090d6"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ce572fd-fd8d-4ed0-9d2d-fa2ce0a22cee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf9db08b-993c-4633-9581-ae750c4f8893"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a96ef4e0-f75c-4255-b231-a6c1d5379111"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9192e87-ccd2-44ea-9d11-627f123090d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b05135f5-2718-417e-b2ae-43b3cfc46974"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76e5b5eb-206b-4d98-8084-45f628c47f74"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a6e00e7-97bf-4365-8b0e-2a82e9e3fc1a"], "isController": false}, {"data": [0.21875, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=132b0664-55af-4cf5-9d35-c45b42082e43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/defb901a-2ee0-478e-bc38-14de96b5201f"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ce572fd-fd8d-4ed0-9d2d-fa2ce0a22cee"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48d3f126-bc8d-44d5-9220-aa9623e87889"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/423c6406-8487-4d91-b66e-f6b44792cbf4"], "isController": false}, {"data": [0.22033898305084745, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bc4c9d1-fc67-4fe1-9d03-2238dfa1c24c"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84834b28-9844-4b82-8620-817892b87813"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8959537572254336, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf9db08b-993c-4633-9581-ae750c4f8893"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bc4c9d1-fc67-4fe1-9d03-2238dfa1c24c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/132b0664-55af-4cf5-9d35-c45b42082e43"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76e5b5eb-206b-4d98-8084-45f628c47f74"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a6e00e7-97bf-4365-8b0e-2a82e9e3fc1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5c877cd-886d-439c-85a4-f259f6313c4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b05135f5-2718-417e-b2ae-43b3cfc46974"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a96ef4e0-f75c-4255-b231-a6c1d5379111"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1315, 42, 3.193916349809886, 422.3634980988598, 136, 2125, 156.0, 1128.4, 1277.2, 1704.1999999999996, 5.087532643389109, 725.2879041130669, 3.7188792134152235], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2095.109090909091, 1697, 2721, 2035.0, 2476.6, 2520.9999999999995, 2721.0, 0.24063071497948077, 289.55969381518906, 1.1831793456266462], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/305e9406-8dd5-4a9f-b710-eb51f6374633", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=defb901a-2ee0-478e-bc38-14de96b5201f", 1, 0, 0.0, 862.0, 862, 862, 862.0, 862.0, 862.0, 862.0, 1.160092807424594, 0.20958707946635732, 0.7998296113689095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9192e87-ccd2-44ea-9d11-627f123090d6", 3, 0, 0.0, 902.6666666666666, 518, 1324, 866.0, 1324.0, 1324.0, 1324.0, 0.03231052569225301, 0.02693595582612629, 0.020719966020097146], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 438.93333333333334, 147, 976, 461.0, 758.2000000000002, 976.0, 976.0, 0.08751305403055955, 0.018476877227936502, 0.0583648258781935], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 438.93333333333334, 147, 976, 461.0, 758.2000000000002, 976.0, 976.0, 0.08698627356603128, 0.01836565658689059, 0.05801350171942867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ce572fd-fd8d-4ed0-9d2d-fa2ce0a22cee", 3, 0, 0.0, 365.6666666666667, 230, 523, 344.0, 523.0, 523.0, 523.0, 0.08552856654122476, 0.03869944905348386, 0.054847420600980724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 199.75, 137, 442, 143.0, 430.5, 441.45, 442.0, 0.11402248523408817, 0.03907274420765775, 0.06454964325214932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 144.85, 139, 152, 144.0, 150.0, 151.9, 152.0, 0.11401728502040909, 0.08473354873098761, 0.05723133252001003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 286.6, 136, 985, 148.5, 439.1, 957.7499999999997, 985.0, 0.11402118513619831, 1.70549637341368, 0.06665339982668779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 225.29999999999995, 136, 1224, 144.0, 422.90000000000003, 1183.9999999999995, 1224.0, 0.11402183518143724, 5.159048211638779, 0.06654243037541689], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 300.79999999999995, 143, 1324, 230.0, 814.6000000000004, 1324.0, 1324.0, 0.08779528480790391, 0.12709167693383747, 0.05673541647156603], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 146.7058823529412, 138, 165, 145.0, 158.6, 165.0, 165.0, 0.0959530394536321, 0.07130885060958402, 0.04816392800699893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 843.75, 701, 1145, 727.5, 1145.0, 1145.0, 1145.0, 0.040541430808446806, 11.920526759878172, 0.02312128475794232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 191.76470588235296, 138, 428, 144.0, 426.4, 428.0, 428.0, 0.09596603931220575, 0.03415703007688573, 0.05425653486389758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1187.0, 959, 1415, 1269.5, 1415.0, 1415.0, 1415.0, 0.040483166593290924, 36.42682446245945, 0.023048521605359973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 356.375, 143, 445, 420.0, 445.0, 445.0, 445.0, 0.04060583911966541, 0.07185330125472043, 0.02248389724692411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 143.58333333333334, 137, 155, 144.0, 152.0, 155.0, 155.0, 0.07364583716905401, 0.054730939536767685, 0.03696675811024781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 213.33333333333334, 138, 434, 143.0, 431.6, 434.0, 434.0, 0.07364719312135215, 0.038142149822939876, 0.040971045912887645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 353.50000000000006, 137, 1277, 144.5, 1180.7000000000003, 1277.0, 1277.0, 0.07364990517574709, 11.061594815813862, 0.042243207330620564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf9db08b-993c-4633-9581-ae750c4f8893", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 282.16666666666663, 138, 953, 145.0, 881.6000000000003, 953.0, 953.0, 0.07364945315281035, 3.6257731274626535, 0.04231487135895516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 144.5, 140, 150, 144.0, 150.0, 150.0, 150.0, 0.040663837141332246, 0.030219902406790858, 0.022833697613541055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 832.0714285714287, 140, 1332, 996.0, 1330.5, 1332.0, 1332.0, 0.09758409658037444, 56.45632746826774, 0.051977689835919307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 241.35294117647055, 138, 947, 144.0, 534.9999999999997, 947.0, 947.0, 0.09596766454220601, 5.1038666942103275, 0.05593335963035514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 695.1428571428571, 143, 1143, 834.5, 1140.5, 1143.0, 1143.0, 0.09758817788930713, 18.455642578941863, 0.05207516468005018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 178.94117647058823, 138, 734, 144.0, 265.9999999999996, 734.0, 734.0, 0.09596224732293554, 1.6841131853539033, 0.056023915414923825], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 436.07142857142856, 145, 862, 424.0, 842.5, 862.0, 862.0, 0.09778584899071034, 0.02085861650485437, 0.06542702731019069], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 499.58333333333337, 281, 1422, 292.5, 1323.6000000000004, 1422.0, 1422.0, 0.07358126130545421, 14.766492070852623, 0.1623482386485575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 503.99999999999994, 185, 924, 488.0, 797.2, 904.3999999999997, 924.0, 0.09831286573454671, 0.06038944584670887, 0.044452008628022587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 145.2857142857143, 138, 150, 146.0, 150.0, 150.0, 150.0, 0.09758273621992361, 0.07251998267906433, 0.04898195939164134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 245.5, 137, 442, 148.5, 437.0, 442.0, 442.0, 0.09759157924087693, 0.12034207155554005, 0.050388732529364606], "isController": false}, {"data": ["login", 23, 0, 0.0, 2405.8260869565215, 1396, 3535, 2101.0, 3454.8, 3525.2, 3535.0, 0.0960105528120656, 40.080663539888214, 0.20023532369123007], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 150.23529411764707, 138, 165, 151.0, 157.79999999999998, 165.0, 165.0, 0.09632328360407731, 0.07798047080837898, 0.03423991721863685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a96ef4e0-f75c-4255-b231-a6c1d5379111", 3, 0, 0.0, 810.0, 254, 1686, 490.0, 1686.0, 1686.0, 1686.0, 0.02201996476805637, 0.026026852888285375, 0.014120875844098648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9192e87-ccd2-44ea-9d11-627f123090d6", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b05135f5-2718-417e-b2ae-43b3cfc46974", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 987.0000000000002, 290, 1482, 1170.5, 1481.0, 1482.0, 1482.0, 0.09748217468805705, 75.02560947030622, 0.20320572742591353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76e5b5eb-206b-4d98-8084-45f628c47f74", 3, 0, 0.0, 348.3333333333333, 244, 497, 304.0, 497.0, 497.0, 497.0, 0.020795064637992584, 0.02457906240252314, 0.01333537673725436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a6e00e7-97bf-4365-8b0e-2a82e9e3fc1a", 3, 0, 0.0, 455.6666666666667, 305, 587, 475.0, 587.0, 587.0, 587.0, 0.023282164309994257, 0.02350195036630605, 0.014930294170146055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 762.3125, 143, 1560, 788.0, 1492.8000000000002, 1560.0, 1560.0, 0.0809069671012045, 48.40725470018912, 0.11802224815178146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 487.5, 283, 1369, 567.5, 592.9, 1330.1999999999994, 1369.0, 0.1139237622183235, 6.982352897722094, 0.2547597881872451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=132b0664-55af-4cf5-9d35-c45b42082e43", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/defb901a-2ee0-478e-bc38-14de96b5201f", 3, 0, 0.0, 302.0, 215, 409, 282.0, 409.0, 409.0, 409.0, 0.03715860531368056, 0.030977600328234347, 0.023828923329411035], "isController": false}, {"data": ["register", 24, 9, 37.5, 942.2916666666666, 239, 1562, 913.0, 1342.0, 1517.5, 1562.0, 0.10022090357496315, 0.031172224402954845, 0.04521685298011033], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ce572fd-fd8d-4ed0-9d2d-fa2ce0a22cee", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 406.52941176470586, 287, 1086, 299.0, 680.3999999999996, 1086.0, 1086.0, 0.09587241073996582, 6.886710004286061, 0.21417636611135865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 167.66666666666663, 139, 435, 149.0, 267.6000000000001, 435.0, 435.0, 0.09916503044366434, 0.07698847578389956, 0.03525006941552131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 543.6666666666666, 288, 1430, 570.5, 914.3000000000009, 1430.0, 1430.0, 0.08731463829911085, 5.9310618718196855, 0.19513154192800422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 183.42857142857142, 138, 415, 146.0, 415.0, 415.0, 415.0, 0.040674499413125086, 0.0302278262240119, 0.0204166920882288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 265.2857142857143, 142, 444, 146.0, 444.0, 444.0, 444.0, 0.04067284506551233, 0.010883163621045293, 0.023196231951425002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 183.14285714285714, 138, 427, 142.0, 427.0, 427.0, 427.0, 0.04067402672864614, 0.010962921266705405, 0.023911878994770482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 304.42857142857144, 137, 431, 423.0, 431.0, 431.0, 431.0, 0.040673790390526494, 0.010962857566196594, 0.023951460552233864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 149.5, 145, 155, 149.0, 155.0, 155.0, 155.0, 0.0557607862270858, 0.01644507562556632, 0.034469314142329406], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1358.8727272727272, 1097, 2125, 1168.0, 1872.4, 1917.5999999999997, 2125.0, 0.24726880366856988, 295.819453732635, 0.48825929786899247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 942.2916666666666, 239, 1562, 913.0, 1342.0, 1517.5, 1562.0, 0.0959593132511815, 0.029846719990723934, 0.043294143283247905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 195.8181818181818, 143, 425, 145.0, 424.8, 425.0, 425.0, 0.05598391734738021, 0.01508941522253607, 0.03296709195358424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 170.63636363636363, 137, 423, 144.0, 372.4000000000002, 423.0, 423.0, 0.05598363242164837, 0.015089338426147412, 0.03291225265413312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48d3f126-bc8d-44d5-9220-aa9623e87889", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 236.20000000000002, 137, 1278, 143.0, 756.6000000000004, 1278.0, 1278.0, 0.1066765283190624, 6.426017660743749, 0.062102963296162494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 227.0, 137, 709, 143.0, 617.2, 709.0, 709.0, 0.10667425239128116, 2.1178867163887207, 0.06220581241332716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 223.1818181818182, 138, 438, 144.0, 436.2, 438.0, 438.0, 0.055985057079310466, 0.014980376601299871, 0.03192897786554425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 164.86666666666665, 138, 428, 145.0, 267.2000000000001, 428.0, 428.0, 0.10667501102308447, 0.07927703455914774, 0.0535458551424467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 197.0, 139, 429, 146.0, 428.6, 429.0, 429.0, 0.05598249274772253, 0.04160417673927426, 0.02810058718000916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 180.73333333333335, 138, 425, 145.0, 414.8, 425.0, 425.0, 0.10667425239128116, 0.03922501155637734, 0.060240394872524264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 174.63636363636363, 145, 425, 149.0, 371.4000000000002, 425.0, 425.0, 0.055601890464275786, 0.04376476925215457, 0.019764734500973033], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 433.5, 145, 916, 432.0, 751.5, 916.0, 916.0, 0.09391309014315039, 0.01929882558326737, 0.06389706202959604], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1147.5652173913045, 822, 1873, 1104.0, 1455.0, 1795.399999999999, 1873.0, 0.0964910808679163, 0.049941672714839486, 0.044382128016395093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 422.6363636363636, 283, 858, 292.0, 857.0, 858.0, 858.0, 0.05594149536702707, 0.08669839174557809, 0.12581373420924155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/423c6406-8487-4d91-b66e-f6b44792cbf4", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.5563343858885018, 1.0395116506968642], "isController": false}, {"data": ["addBook", 59, 17, 28.8135593220339, 1258.0000000000005, 737, 2295, 1125.0, 2022.0, 2134.0, 2295.0, 0.28175067453021657, 86.80274915832955, 1.0230110685633103], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9bc4c9d1-fc67-4fe1-9d03-2238dfa1c24c", 3, 0, 0.0, 313.0, 237, 427, 275.0, 427.0, 427.0, 427.0, 0.08295313148071339, 0.03753413175722384, 0.053195855799806444], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 246.0727272727274, 140, 610, 148.0, 576.0, 590.8, 610.0, 0.24838661602590445, 0.18459200663643877, 0.12006970208283468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84834b28-9844-4b82-8620-817892b87813", 2, 0, 0.0, 230.0, 224, 236, 230.0, 236.0, 236.0, 236.0, 0.039506953223767384, 0.034915813151864726, 0.024556812233328066], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 819.6363636363636, 678, 1150, 714.0, 1026.2, 1138.2, 1150.0, 0.2481143310837634, 72.9538515097757, 0.12478406299622867], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 207.70909090909086, 139, 453, 148.0, 427.4, 433.59999999999997, 453.0, 0.24891383055756697, 0.4404608017288197, 0.12105379650162924], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1110.1636363636364, 951, 1505, 1004.0, 1288.4, 1337.1999999999998, 1505.0, 0.24795996573644108, 223.11481303677698, 0.12446427967629954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 150.55555555555557, 145, 170, 149.5, 159.20000000000002, 170.0, 170.0, 0.0862597761079589, 0.06444211789315289, 0.030662654788376015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 17, 9.826589595375722, 199.2774566473989, 139, 1076, 152.0, 331.6, 432.29999999999995, 665.299999999995, 0.7279980474503236, 1.5682704957224853, 0.3491885504422693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 149.0, 146, 156, 147.0, 156.0, 156.0, 156.0, 0.04028452383692825, 0.03119690176043369, 0.014319889332658087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf9db08b-993c-4633-9581-ae750c4f8893", 3, 0, 0.0, 327.0, 220, 395, 366.0, 395.0, 395.0, 395.0, 0.05858574023082781, 0.0376649859882438, 0.03756963159333685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bc4c9d1-fc67-4fe1-9d03-2238dfa1c24c", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 193.15, 144, 433, 149.0, 428.1, 432.8, 433.0, 0.11645781897796618, 0.09450824958075185, 0.04139711533982392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/132b0664-55af-4cf5-9d35-c45b42082e43", 3, 0, 0.0, 494.0, 242, 916, 324.0, 916.0, 916.0, 916.0, 0.0263752494659012, 0.02198796024810318, 0.016913815575463984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76e5b5eb-206b-4d98-8084-45f628c47f74", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 0.21951890947752128, 0.8377316221142164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 492.2857142857143, 283, 839, 572.0, 839.0, 839.0, 839.0, 0.04064002229395508, 0.0629840970512761, 0.0914003626396275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 450.79999999999995, 286, 1706, 293.0, 1112.6000000000004, 1706.0, 1706.0, 0.10656360781750626, 8.65328409058617, 0.23784636502653433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a6e00e7-97bf-4365-8b0e-2a82e9e3fc1a", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 0.24217702747989275, 0.924199899463807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 177.25000000000003, 140, 431, 152.5, 357.8000000000003, 431.0, 431.0, 0.07243795990558918, 0.060058425742036355, 0.02574943106018991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 170.71428571428572, 141, 437, 151.0, 300.5, 437.0, 437.0, 0.10121384316192046, 0.07857910675168629, 0.03597835831146391], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5c877cd-886d-439c-85a4-f259f6313c4c", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b05135f5-2718-417e-b2ae-43b3cfc46974", 3, 0, 0.0, 301.0, 215, 430, 258.0, 430.0, 430.0, 430.0, 0.040261971226111234, 0.02588456808970367, 0.02581903753757784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a96ef4e0-f75c-4255-b231-a6c1d5379111", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 175.38888888888889, 139, 431, 144.5, 414.8, 431.0, 431.0, 0.08750097223302482, 0.06502757799739442, 0.04392138645290503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 205.94444444444443, 137, 431, 145.5, 426.5, 431.0, 431.0, 0.08750097223302482, 0.030714588235008167, 0.049494636311931246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 292.8333333333333, 138, 1291, 145.5, 625.000000000001, 1291.0, 1291.0, 0.08750097223302482, 4.396358934153088, 0.05102324487633196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 284.4444444444444, 138, 684, 148.0, 587.7000000000002, 684.0, 684.0, 0.08737482343004432, 1.4495251876131627, 0.05103501242664156], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 21.428571428571427, 0.6844106463878327], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.523809523809524, 0.3041825095057034], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.523809523809524, 0.3041825095057034], "isController": false}, {"data": ["401/Unauthorized", 25, 59.523809523809526, 1.9011406844106464], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1315, 42, "401/Unauthorized", 25, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
