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

    var data = {"OkPercent": 98.91891891891892, "KoPercent": 1.0810810810810811};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8163672654690619, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3181818181818182, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ae1ddc2e-eb93-45b7-bc56-409c13aef25d"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c893723-895f-41cc-8ed6-439ad25c451c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fd1113c-2293-4dbd-a463-f125309c193d"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/183bb8f0-0cb3-4d4b-9dc5-4d0725f517ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43f1a7dc-3c92-4a6e-b749-41c2b04ba80a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2233fef5-a265-474c-be38-fbe524cc6e3c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fdd77592-4f4d-4f22-a072-a98fc70c501f"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2648486c-1e7b-4ef5-8a38-8356d7d41efa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6a47ae2-889f-46c3-b332-164b7b9c75c5"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/109045fa-3422-42ca-a6b3-f4568b7503e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6540904b-790f-4273-96a4-a8fcb0b558ea"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c893723-895f-41cc-8ed6-439ad25c451c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfe52d39-6a11-4640-af39-31209329d8c0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ccefe2a-2fd0-44c3-9e7d-04e8fe2ad119"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6745fff4-7ef6-44ff-b0c4-ed27e8b72ed3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2233fef5-a265-474c-be38-fbe524cc6e3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae1ddc2e-eb93-45b7-bc56-409c13aef25d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fd1113c-2293-4dbd-a463-f125309c193d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f37153e-c7cf-4678-8cf8-d1fb43cb1174"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43f1a7dc-3c92-4a6e-b749-41c2b04ba80a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=183bb8f0-0cb3-4d4b-9dc5-4d0725f517ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9428571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31528b54-b24d-48be-8a63-0b8f1cc190bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6540904b-790f-4273-96a4-a8fcb0b558ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f37153e-c7cf-4678-8cf8-d1fb43cb1174"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=109045fa-3422-42ca-a6b3-f4568b7503e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6a47ae2-889f-46c3-b332-164b7b9c75c5"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2ccefe2a-2fd0-44c3-9e7d-04e8fe2ad119"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfe52d39-6a11-4640-af39-31209329d8c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 14, 1.0810810810810811, 315.3884169884176, 81, 2920, 103.0, 882.0000000000005, 1060.6000000000001, 1799.3599999999988, 5.181720331149942, 721.4177138059836, 3.7892463110252605], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1400.909090909091, 1004, 1833, 1412.0, 1678.0, 1760.8, 1833.0, 0.2445042121407455, 294.2212523477961, 1.2022253009068884], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ae1ddc2e-eb93-45b7-bc56-409c13aef25d", 3, 0, 0.0, 414.3333333333333, 180, 535, 528.0, 535.0, 535.0, 535.0, 0.02289307408198773, 0.0229601436349623, 0.014680779928878849], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 707.9230769230769, 85, 1594, 546.0, 1528.3999999999999, 1594.0, 1594.0, 0.073291876441172, 0.013885375028893913, 0.04954579297581932], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 707.9230769230769, 85, 1594, 546.0, 1528.3999999999999, 1594.0, 1594.0, 0.07367150442879082, 0.013957296737485761, 0.049802424005009664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c893723-895f-41cc-8ed6-439ad25c451c", 3, 0, 0.0, 368.66666666666663, 181, 700, 225.0, 700.0, 700.0, 700.0, 0.02967241652160152, 0.02975934742937965, 0.019028209813657226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 120.16666666666664, 82, 249, 84.0, 247.2, 249.0, 249.0, 0.13090433075160904, 0.04595003363514054, 0.07404560288716774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 86.1111111111111, 83, 96, 85.0, 92.4, 96.0, 96.0, 0.13090147482328301, 0.09728127181691246, 0.06570640435465573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 160.7777777777778, 82, 655, 84.0, 288.70000000000056, 655.0, 655.0, 0.13090433075160904, 2.1716681893385696, 0.07646028780771609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 142.22222222222223, 82, 979, 83.5, 319.30000000000103, 979.0, 979.0, 0.13090433075160904, 6.577097480546162, 0.07633245154721646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fd1113c-2293-4dbd-a463-f125309c193d", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 269.84615384615387, 83, 654, 197.0, 606.4, 654.0, 654.0, 0.07347206366071732, 0.1722718992669749, 0.04749302192010761], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/183bb8f0-0cb3-4d4b-9dc5-4d0725f517ee", 3, 0, 0.0, 691.3333333333333, 170, 1563, 341.0, 1563.0, 1563.0, 1563.0, 0.03141361256544503, 0.0261882362565445, 0.020144797120418848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43f1a7dc-3c92-4a6e-b749-41c2b04ba80a", 3, 0, 0.0, 349.6666666666667, 186, 492, 371.0, 492.0, 492.0, 492.0, 0.019928655413619243, 0.02355499603087613, 0.012779769259384736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 94.05555555555554, 83, 249, 84.0, 109.50000000000023, 249.0, 249.0, 0.08118384080750861, 0.06033291294386137, 0.04075048259283147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 101.44444444444444, 81, 246, 83.0, 243.3, 246.0, 246.0, 0.0811853054597118, 0.028497663103533816, 0.045922200234535325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 629.4, 482, 794, 653.0, 794.0, 794.0, 794.0, 0.0839503685421179, 24.684195765963164, 0.04787794455917661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 876.6, 657, 1132, 894.0, 1132.0, 1132.0, 1132.0, 0.08339170752860336, 75.03600502122319, 0.047477895985523204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 184.0, 83, 255, 247.0, 255.0, 255.0, 255.0, 0.08487667419239844, 0.15019192737951756, 0.046997142838955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 127.79999999999998, 82, 249, 85.0, 248.4, 249.0, 249.0, 0.08484066922319884, 0.06305053640513117, 0.04258603904367598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 171.2, 82, 251, 245.0, 249.8, 251.0, 251.0, 0.0847615657156419, 0.03965472729378924, 0.047391427497782065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 236.7333333333333, 82, 1063, 84.0, 968.8000000000001, 1063.0, 1063.0, 0.08484258871706693, 10.198686760455434, 0.04890600784511137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 192.9333333333333, 83, 490, 93.0, 488.8, 490.0, 490.0, 0.08476204468654996, 3.342847284224088, 0.04894235509928461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 120.0, 83, 247, 85.0, 247.0, 247.0, 247.0, 0.08487523340689186, 0.06307622326430148, 0.04765943282125276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 147.16666666666666, 82, 1051, 84.0, 326.50000000000114, 1051.0, 1051.0, 0.0811849392917065, 4.079019056191253, 0.04734026299410056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 554.8333333333334, 81, 1056, 772.0, 1001.1000000000001, 1056.0, 1056.0, 0.08374702814365408, 41.87432282676462, 0.04523575369999023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 142.2777777777778, 82, 490, 84.0, 272.20000000000033, 490.0, 490.0, 0.08112566365299849, 1.3458532814204203, 0.04738492268273556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 396.44444444444446, 83, 819, 488.0, 747.0000000000001, 819.0, 819.0, 0.08374624886593621, 13.690130882592412, 0.045317116221183146], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 525.2500000000001, 274, 1103, 499.0, 949.4000000000005, 1103.0, 1103.0, 0.08132726089785297, 0.014692913345803514, 0.05607133417371503], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2233fef5-a265-474c-be38-fbe524cc6e3c", 3, 0, 0.0, 513.3333333333334, 169, 989, 382.0, 989.0, 989.0, 989.0, 0.020532897123341113, 0.028306256288199744, 0.013167254991205076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdd77592-4f4d-4f22-a072-a98fc70c501f", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.5672041518650089, 1.0598218250444051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 419.8, 168, 1154, 332.0, 1149.8, 1154.0, 1154.0, 0.08471991595784337, 13.627722465674314, 0.18764689197928316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2648486c-1e7b-4ef5-8a38-8356d7d41efa", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6a47ae2-889f-46c3-b332-164b7b9c75c5", 3, 0, 0.0, 300.6666666666667, 198, 432, 272.0, 432.0, 432.0, 432.0, 0.05408036342004219, 0.034768462810736755, 0.03468044138589945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 546.7619047619047, 179, 2046, 416.0, 1205.8000000000002, 1969.599999999999, 2046.0, 0.08833996584187988, 0.05426351417435785, 0.03994277752420936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 84.94444444444444, 83, 89, 84.0, 88.1, 89.0, 89.0, 0.08374507997655137, 0.06223633384976133, 0.042036104597604894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/109045fa-3422-42ca-a6b3-f4568b7503e7", 3, 0, 0.0, 366.66666666666663, 203, 654, 243.0, 654.0, 654.0, 654.0, 0.017923074165680897, 0.02470840465223262, 0.01149363805546594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 120.61111111111111, 83, 251, 84.0, 251.0, 251.0, 251.0, 0.08374624886593621, 0.09228807546467536, 0.04385410123990974], "isController": false}, {"data": ["login", 21, 0, 0.0, 2597.52380952381, 1451, 4894, 2281.0, 4289.200000000001, 4854.4, 4894.0, 0.09125594250006518, 26.11925939691772, 0.173714751034234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 93.61111111111111, 85, 151, 87.0, 128.50000000000003, 151.0, 151.0, 0.08373378239450706, 0.06778838437992808, 0.02976474296054743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6540904b-790f-4273-96a4-a8fcb0b558ea", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 641.5, 168, 1146, 861.0, 1089.3000000000002, 1146.0, 1146.0, 0.08371197499802346, 55.695786032191904, 0.1763710306571855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c893723-895f-41cc-8ed6-439ad25c451c", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfe52d39-6a11-4640-af39-31209329d8c0", 3, 0, 0.0, 321.3333333333333, 197, 435, 332.0, 435.0, 435.0, 435.0, 0.029546461811198108, 0.02434312983207761, 0.018947438075540456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ccefe2a-2fd0-44c3-9e7d-04e8fe2ad119", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6745fff4-7ef6-44ff-b0c4-ed27e8b72ed3", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 293.72222222222223, 168, 1064, 253.5, 416.000000000001, 1064.0, 1064.0, 0.13082251019325392, 8.886441234800968, 0.2923633268164342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 867.6666666666667, 83, 1380, 937.0, 1380.0, 1380.0, 1380.0, 0.09992838465766202, 99.62869709000216, 0.19852308970237997], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1149.0909090909088, 321, 2295, 974.0, 1936.3, 2247.899999999999, 2295.0, 0.09278941863211526, 0.02934267659513446, 0.041863975984411377], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 278.8333333333333, 168, 1136, 172.5, 559.1000000000009, 1136.0, 1136.0, 0.08109386615006871, 5.508500601164598, 0.18122930416957628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 87.06666666666666, 84, 93, 86.0, 92.4, 93.0, 93.0, 0.10076649715502589, 0.0782318019904742, 0.03581934078557561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 310.66666666666663, 168, 972, 256.5, 545.4000000000007, 972.0, 972.0, 0.10534447643795211, 7.155783036832526, 0.23542478697005875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2233fef5-a265-474c-be38-fbe524cc6e3c", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 86.125, 83, 96, 84.0, 96.0, 96.0, 96.0, 0.04133277534086623, 0.030717033236717973, 0.020747115747270745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 84.12500000000001, 81, 87, 84.0, 87.0, 87.0, 87.0, 0.04133298889175924, 0.011059803668302764, 0.023572720227331437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 104.0, 82, 246, 84.5, 246.0, 246.0, 246.0, 0.04133320244485893, 0.011140589721465881, 0.02429940221855964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 84.0, 83, 86, 83.5, 86.0, 86.0, 86.0, 0.04133341600016533, 0.011140647281294562, 0.02433989242978486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae1ddc2e-eb93-45b7-bc56-409c13aef25d", 1, 0, 0.0, 1103.0, 1103, 1103, 1103.0, 1103.0, 1103.0, 1103.0, 0.9066183136899365, 0.16379334768812331, 0.625070829555757], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 957.0181818181817, 654, 1462, 898.0, 1318.4, 1410.0, 1462.0, 0.24653064151755297, 294.9363551733334, 0.48680171596532434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1149.0909090909088, 321, 2295, 974.0, 1936.3, 2247.899999999999, 2295.0, 0.09459964998129507, 0.02991512368904235, 0.04268070145640461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 83.4, 82, 84, 84.0, 84.0, 84.0, 84.0, 0.026157604800443632, 0.007050291918869573, 0.015403355170573741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 117.6, 83, 250, 85.0, 250.0, 250.0, 250.0, 0.026157467957101752, 0.007050255035312582, 0.015377730185718022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fd1113c-2293-4dbd-a463-f125309c193d", 3, 0, 0.0, 303.0, 205, 498, 206.0, 498.0, 498.0, 498.0, 0.07366482504604051, 0.033331414978514426, 0.047239487415592384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 116.93333333333334, 82, 261, 83.0, 252.0, 261.0, 261.0, 0.10365558703614125, 0.027938419943334944, 0.06093814784741897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 132.4, 82, 332, 84.0, 282.20000000000005, 332.0, 332.0, 0.10365487074237618, 0.027938226879781078, 0.061038952204739094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 115.4, 82, 245, 83.0, 245.0, 245.0, 245.0, 0.02615774164521732, 0.0069992394636616655, 0.014918087032038002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 106.26666666666667, 83, 250, 85.0, 247.6, 250.0, 250.0, 0.10353610303912975, 0.07694431094997825, 0.05197027047081317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 86.0, 84, 90, 85.0, 90.0, 90.0, 90.0, 0.02615678376186864, 0.019438781682404333, 0.01312947934921922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 104.60000000000001, 81, 247, 83.0, 244.6, 247.0, 247.0, 0.1036563033398061, 0.02773615929209655, 0.05911648549848316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 87.0, 86, 88, 87.0, 88.0, 88.0, 88.0, 0.026334084732551034, 0.020727804975035288, 0.009360944182274001], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 609.5833333333333, 382, 1563, 513.0, 1304.1000000000008, 1563.0, 1563.0, 0.08080481596703164, 0.014598526322168801, 0.05500093430568462], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1505.0000000000002, 712, 2920, 1276.0, 2404.4, 2875.4999999999995, 2920.0, 0.0897965466813762, 0.04647672826282166, 0.04130290379582831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 204.2, 168, 337, 171.0, 337.0, 337.0, 337.0, 0.026145021203612197, 0.04051967641614507, 0.05880076546085829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f37153e-c7cf-4678-8cf8-d1fb43cb1174", 3, 0, 0.0, 340.0, 173, 668, 179.0, 668.0, 668.0, 668.0, 0.02761235929201911, 0.027873022840023194, 0.017707144467863815], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 929.3500000000003, 427, 2330, 716.5, 1523.6, 2269.449999999997, 2330.0, 0.2770351696147826, 83.91876852672696, 1.0081798601780412], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43f1a7dc-3c92-4a6e-b749-41c2b04ba80a", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 150.74545454545455, 83, 344, 86.0, 338.0, 341.2, 344.0, 0.24718212378880758, 0.18369687129226814, 0.11948745241744116], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 521.4363636363636, 404, 816, 491.0, 673.2, 750.5999999999999, 816.0, 0.24704888872918052, 72.64057608151266, 0.12424822040578903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=183bb8f0-0cb3-4d4b-9dc5-4d0725f517ee", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.30569215313028764, 1.1665873519458545], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 135.90909090909088, 82, 272, 90.0, 251.0, 255.39999999999998, 272.0, 0.2474957925715263, 0.4379515391988336, 0.12036416474669931], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 804.4181818181819, 568, 1134, 807.0, 1060.4, 1072.3999999999999, 1134.0, 0.24695570961600635, 222.21118161431582, 0.12396019017834693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 97.38888888888889, 85, 247, 86.5, 119.2000000000002, 247.0, 247.0, 0.11308663692906955, 0.08448366919017404, 0.04019876547088019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, 4.0, 163.06285714285704, 84, 1967, 90.0, 275.8, 307.39999999999986, 1837.0400000000016, 0.7342236319315955, 1.546114357428455, 0.3545374168229514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 113.75, 86, 247, 92.5, 247.0, 247.0, 247.0, 0.043485350872424854, 0.03367566722835245, 0.015457683317932272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31528b54-b24d-48be-8a63-0b8f1cc190bb", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.8725025614754098, 1.6302723702185793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 101.11111111111111, 83, 255, 88.0, 130.80000000000018, 255.0, 255.0, 0.12482230158454978, 0.10129622325855552, 0.044370427516382926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6540904b-790f-4273-96a4-a8fcb0b558ea", 3, 0, 0.0, 717.0, 393, 1279, 479.0, 1279.0, 1279.0, 1279.0, 0.023393819352926955, 0.02765070249690032, 0.01500189587411006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f37153e-c7cf-4678-8cf8-d1fb43cb1174", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 191.49999999999997, 168, 330, 171.0, 330.0, 330.0, 330.0, 0.04131463157677291, 0.06402960968001818, 0.09291757472783986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=109045fa-3422-42ca-a6b3-f4568b7503e7", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6a47ae2-889f-46c3-b332-164b7b9c75c5", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 262.73333333333335, 167, 583, 171.0, 530.8000000000001, 583.0, 583.0, 0.10347539355141347, 0.16036664996688788, 0.23271858530166528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 88.86666666666667, 84, 99, 88.0, 96.6, 99.0, 99.0, 0.0866831557291787, 0.07186913985749288, 0.03081315301310649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ccefe2a-2fd0-44c3-9e7d-04e8fe2ad119", 3, 0, 0.0, 482.6666666666667, 224, 654, 570.0, 654.0, 654.0, 654.0, 0.02164314777941304, 0.025581467964534095, 0.0138792321371887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfe52d39-6a11-4640-af39-31209329d8c0", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 120.05555555555554, 85, 362, 87.0, 262.10000000000014, 362.0, 362.0, 0.08412984038699726, 0.06531564756607698, 0.029905529200065433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 103.38888888888887, 82, 250, 84.5, 249.1, 250.0, 250.0, 0.10549697868374937, 0.07840156326009108, 0.052954538128366375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 138.94444444444443, 82, 254, 84.5, 253.1, 254.0, 254.0, 0.10539752432926186, 0.03699663533042124, 0.05961776197140214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 196.1111111111111, 83, 888, 85.0, 380.4000000000008, 888.0, 888.0, 0.10539937580147442, 5.295638158453323, 0.06146009608909761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 133.33333333333334, 81, 489, 84.0, 276.60000000000036, 489.0, 489.0, 0.10549821532185746, 1.7501874608044825, 0.061620756627339277], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.3861003861003861], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07722007722007722], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6177606177606177], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 14, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
