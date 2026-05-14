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

    var data = {"OkPercent": 96.94189602446484, "KoPercent": 3.058103975535168};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8047900262467191, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1db10b84-7e7d-4f7e-bb22-5557f90b6319"], "isController": false}, {"data": [0.4, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fda0e316-a0b8-4c70-81c7-a502896c2224"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52e7afa8-bf28-4545-aa5b-2866d1b536a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/242bbf4e-6e5a-4a37-9d52-174233aa05ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8410cab-45a9-434f-a95c-59f0b27d82d3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90820a3a-dd6c-4705-aa5b-c02e4297919c"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3833f72b-38d0-454c-9468-8e80e7c32261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59b74493-d679-4039-9d70-1320c1acaa0d"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba09c488-7901-46bc-a126-cb9367c6b847"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bd7e3c0-0315-4dce-bdec-e23769a80231"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52e7afa8-bf28-4545-aa5b-2866d1b536a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7c9f00c-4705-4617-bb45-112d7c8cc150"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12ea5a05-d871-427e-8884-404aa16fb5bb"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=242bbf4e-6e5a-4a37-9d52-174233aa05ce"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59b74493-d679-4039-9d70-1320c1acaa0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3833f72b-38d0-454c-9468-8e80e7c32261"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7c9f00c-4705-4617-bb45-112d7c8cc150"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1db10b84-7e7d-4f7e-bb22-5557f90b6319"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/350faf89-a754-4cd1-8f2a-2ac77e6a9a56"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8410cab-45a9-434f-a95c-59f0b27d82d3"], "isController": false}, {"data": [0.32786885245901637, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90820a3a-dd6c-4705-aa5b-c02e4297919c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8454545454545455, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.884180790960452, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73475634-11de-49ec-86fa-e6b0abba2633"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/616a34fb-1f99-4ef1-a256-99f8337e66a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12ea5a05-d871-427e-8884-404aa16fb5bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bd7e3c0-0315-4dce-bdec-e23769a80231"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 40, 3.058103975535168, 289.27675840978617, 76, 2344, 89.5, 843.1000000000001, 1023.1499999999994, 1497.3900000000024, 5.12770253052904, 697.4153032016288, 3.7483752352157125], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/1db10b84-7e7d-4f7e-bb22-5557f90b6319", 3, 0, 0.0, 350.3333333333333, 190, 443, 418.0, 443.0, 443.0, 443.0, 0.018013257757709674, 0.021291060845782493, 0.011551470632385435], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1326.109090909091, 935, 1752, 1324.0, 1587.2, 1649.6, 1752.0, 0.23904624892972476, 287.65248366336203, 1.1753885384386369], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fda0e316-a0b8-4c70-81c7-a502896c2224", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52e7afa8-bf28-4545-aa5b-2866d1b536a0", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/242bbf4e-6e5a-4a37-9d52-174233aa05ce", 3, 0, 0.0, 278.3333333333333, 225, 380, 230.0, 380.0, 380.0, 380.0, 0.08762194053390969, 0.039646646270226064, 0.05618985118873766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8410cab-45a9-434f-a95c-59f0b27d82d3", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 483.35714285714295, 79, 1870, 426.5, 1296.0, 1870.0, 1870.0, 0.08174466470090212, 0.01743688509035705, 0.05444322395118676], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 483.35714285714295, 79, 1870, 426.5, 1296.0, 1870.0, 1870.0, 0.08299247139723753, 0.017703053678344894, 0.05527428270792578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 79.66666666666667, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.14639573695613983, 0.05383093244324725, 0.08267165510140344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 82.06666666666668, 79, 88, 82.0, 86.8, 88.0, 88.0, 0.1463914507392768, 0.10879286524666959, 0.07348164617186356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 154.59999999999994, 78, 642, 82.0, 453.60000000000014, 642.0, 642.0, 0.14639716575087106, 2.9065365419525477, 0.0853697534915724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 137.86666666666667, 77, 951, 80.0, 430.20000000000033, 951.0, 951.0, 0.14639573695613983, 8.818637107537429, 0.08522595572016943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90820a3a-dd6c-4705-aa5b-c02e4297919c", 3, 0, 0.0, 383.0, 184, 637, 328.0, 637.0, 637.0, 637.0, 0.05355517075173608, 0.03443081452951782, 0.03434364791045575], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 172.64285714285714, 78, 328, 182.5, 293.0, 328.0, 328.0, 0.0814048145133155, 0.11745665375334342, 0.05260422723572509], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3833f72b-38d0-454c-9468-8e80e7c32261", 3, 0, 0.0, 323.0, 183, 598, 188.0, 598.0, 598.0, 598.0, 0.03110645666352146, 0.025932173019296373, 0.01994782539945875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 81.2777777777778, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.16551724137931034, 0.12300646551724138, 0.08308189655172414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 601.8, 467, 733, 618.0, 733.0, 733.0, 733.0, 0.02242172575538794, 6.592731843447027, 0.012787390469869686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 89.33333333333333, 77, 234, 80.5, 102.60000000000021, 234.0, 234.0, 0.16552789604848128, 0.07191554858703549, 0.0928579885601832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 902.2, 786, 1078, 890.0, 1078.0, 1078.0, 1078.0, 0.02240474622143955, 20.159830033394275, 0.012755827194432868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 173.0, 80, 236, 231.0, 236.0, 236.0, 236.0, 0.02246009963300197, 0.039743848178710524, 0.012436402824132928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 92.53846153846155, 78, 235, 81.0, 174.99999999999994, 235.0, 235.0, 0.06517989651437968, 0.048439356686955995, 0.03271725274256949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 103.30769230769229, 77, 240, 79.0, 236.8, 240.0, 240.0, 0.06512830275643017, 0.017426909135997915, 0.037143485165776584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 103.46153846153847, 78, 236, 80.0, 234.8, 236.0, 236.0, 0.06518087693349044, 0.017568283235979844, 0.038319226478477776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 103.38461538461539, 78, 234, 80.0, 233.2, 234.0, 234.0, 0.06518120374641503, 0.017568371322275927, 0.03838307212801589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 82.6, 81, 88, 81.0, 88.0, 88.0, 88.0, 0.022474738394045096, 0.016702417888543278, 0.01262009235993743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 504.5882352941176, 77, 1042, 690.0, 1015.6, 1042.0, 1042.0, 0.07928364891334763, 37.77806207589078, 0.043002999370394555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59b74493-d679-4039-9d70-1320c1acaa0d", 3, 0, 0.0, 384.0, 183, 714, 255.0, 714.0, 714.0, 714.0, 0.01745302228169178, 0.024060400183256735, 0.01119220504392344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 184.83333333333334, 78, 959, 80.0, 929.3000000000001, 959.0, 959.0, 0.16552637386890312, 16.588648712802545, 0.09573085641506658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba09c488-7901-46bc-a126-cb9367c6b847", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 371.0, 80, 729, 459.0, 728.2, 729.0, 729.0, 0.07922637772340672, 12.34279425900035, 0.04304930531282768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 153.5, 78, 622, 80.0, 551.8000000000001, 622.0, 622.0, 0.16552637386890312, 5.447462905999411, 0.09589250326454793], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 284.7142857142858, 79, 511, 310.5, 498.5, 511.0, 511.0, 0.08314131648335986, 0.017734803697413117, 0.055628592892605175], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 221.53846153846152, 160, 471, 164.0, 409.79999999999995, 471.0, 471.0, 0.06510155843115259, 0.10089470042015544, 0.14641493072943793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bd7e3c0-0315-4dce-bdec-e23769a80231", 3, 0, 0.0, 272.0, 181, 405, 230.0, 405.0, 405.0, 405.0, 0.07044237813468582, 0.031873341669014746, 0.045173009415797875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 570.2500000000001, 139, 1716, 431.5, 1211.0000000000005, 1691.6499999999996, 1716.0, 0.09000130501892278, 0.05528400474306878, 0.04069394943726684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 83.82352941176471, 79, 121, 81.0, 97.79999999999998, 121.0, 121.0, 0.07928253965292903, 0.058919934253788074, 0.039796118536724136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 125.17647058823529, 78, 237, 79.0, 237.0, 237.0, 237.0, 0.07922711617957524, 0.08419701570095026, 0.041661593606837764], "isController": false}, {"data": ["login", 20, 0, 0.0, 2418.3999999999996, 1583, 4498, 2227.0, 3543.3, 4451.049999999999, 4498.0, 0.09065320164444908, 27.237502500045327, 0.17435691468627193], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 95.55555555555554, 80, 238, 83.0, 140.80000000000015, 238.0, 238.0, 0.17173442225678112, 0.13903108989342924, 0.06104622041159016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52e7afa8-bf28-4545-aa5b-2866d1b536a0", 3, 0, 0.0, 286.6666666666667, 191, 408, 261.0, 408.0, 408.0, 408.0, 0.02335139174294788, 0.023419804023444797, 0.0149746880643253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7c9f00c-4705-4617-bb45-112d7c8cc150", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 610.470588235294, 160, 1125, 812.0, 1096.2, 1125.0, 1125.0, 0.07919648181276087, 50.217684778203264, 0.16738718723212953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12ea5a05-d871-427e-8884-404aa16fb5bb", 3, 0, 0.0, 352.6666666666667, 171, 528, 359.0, 528.0, 528.0, 528.0, 0.026544444247818932, 0.026622211174326213, 0.017022316135482843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 8, 61.53846153846154, 428.2307692307692, 78, 1169, 82.0, 1101.0, 1169.0, 1169.0, 0.05617880416933156, 25.859012403631745, 0.0716288193484123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 258.33333333333337, 159, 1031, 164.0, 660.2000000000003, 1031.0, 1031.0, 0.1462743912547417, 11.877918631213005, 0.32647948928296294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=242bbf4e-6e5a-4a37-9d52-174233aa05ce", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1023.0000000000001, 197, 1611, 1041.5, 1433.5, 1576.0, 1611.0, 0.09748013842179656, 0.030605336428327728, 0.043980296827021495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59b74493-d679-4039-9d70-1320c1acaa0d", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 100.25000000000001, 81, 252, 88.0, 155.4000000000001, 252.0, 252.0, 0.08955608169753553, 0.06952840327103589, 0.03183438841592083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 285.22222222222223, 160, 1040, 165.0, 1010.3000000000001, 1040.0, 1040.0, 0.16539709084894652, 22.213676386808665, 0.36727988978121645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3833f72b-38d0-454c-9468-8e80e7c32261", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 296.5263157894737, 159, 960, 314.0, 496.0, 960.0, 960.0, 0.10700969845793393, 6.8950524382723, 0.23922629699978598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 136.57142857142856, 78, 311, 82.0, 311.0, 311.0, 311.0, 0.04359252201422362, 0.03239639575471111, 0.02188140265167084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 148.14285714285714, 79, 251, 83.0, 251.0, 251.0, 251.0, 0.043591979075850044, 0.011664260026155187, 0.024861050566695728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 125.85714285714286, 77, 251, 80.0, 251.0, 251.0, 251.0, 0.04359279348848216, 0.011749620119942458, 0.02562779460943971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 102.57142857142857, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.04359252201422362, 0.01174954694914621, 0.025670205834547696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 84.75, 79, 90, 85.0, 90.0, 90.0, 90.0, 0.04467626461751533, 0.013176007728993779, 0.027617261233288285], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 908.1272727272727, 615, 1418, 855.0, 1236.8, 1321.1999999999998, 1418.0, 0.24873146950552183, 297.5693105785494, 0.49114749154313003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1023.0000000000001, 197, 1611, 1041.5, 1433.5, 1576.0, 1611.0, 0.09727665887102331, 0.030541451002962884, 0.04388849257657497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7c9f00c-4705-4617-bb45-112d7c8cc150", 3, 0, 0.0, 473.66666666666663, 258, 886, 277.0, 886.0, 886.0, 886.0, 0.06259780907668232, 0.02832387845592071, 0.04014247522170058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 94.18181818181819, 77, 243, 79.0, 211.0000000000001, 243.0, 243.0, 0.07174724099246, 0.01933812354874899, 0.04224959601411464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 108.54545454545456, 78, 239, 80.0, 238.4, 239.0, 239.0, 0.0717467730258223, 0.01933799741711617, 0.04217925523588382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1db10b84-7e7d-4f7e-bb22-5557f90b6319", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 182.68749999999997, 76, 930, 83.0, 451.2000000000005, 930.0, 930.0, 0.08592772404311423, 4.854082515117909, 0.05005457753097426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/350faf89-a754-4cd1-8f2a-2ac77e6a9a56", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 153.12500000000003, 78, 618, 82.0, 354.8000000000003, 618.0, 618.0, 0.0859272625722326, 1.6008043429518162, 0.0501382220575283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 109.8125, 79, 236, 81.5, 234.6, 236.0, 236.0, 0.08592864699974759, 0.06385908238946085, 0.043132152888545175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 93.54545454545455, 78, 232, 79.0, 202.2000000000001, 232.0, 232.0, 0.07174490122031554, 0.019197366146842247, 0.04091701397721121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 110.6875, 78, 249, 80.5, 244.1, 249.0, 249.0, 0.0859272625722326, 0.031058425839401944, 0.04855435772056454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 94.72727272727273, 79, 233, 80.0, 203.6000000000001, 233.0, 233.0, 0.0717467730258223, 0.05331962331313553, 0.03601351692897722], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 393.3571428571429, 78, 886, 394.0, 800.0, 886.0, 886.0, 0.08548574219942602, 0.01756703379739879, 0.05816322052268425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 114.72727272727272, 83, 238, 88.0, 237.4, 238.0, 238.0, 0.0740930339076666, 0.058319321610917275, 0.026337758146865866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1327.0, 821, 1811, 1213.0, 1782.9, 1809.6, 1811.0, 0.09052354291042243, 0.04685300560793348, 0.04163729366289937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 205.36363636363635, 159, 473, 163.0, 443.0000000000001, 473.0, 473.0, 0.07170795306388526, 0.11113332178943937, 0.1612728670958279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8410cab-45a9-434f-a95c-59f0b27d82d3", 3, 0, 0.0, 688.3333333333334, 182, 1500, 383.0, 1500.0, 1500.0, 1500.0, 0.057420663782873325, 0.03691595409217931, 0.03682249598055353], "isController": false}, {"data": ["addBook", 61, 17, 27.868852459016395, 883.0327868852457, 402, 3347, 692.0, 1473.0000000000002, 1937.1999999999998, 3347.0, 0.27394061326770736, 76.2689058668761, 0.9968677164355387], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90820a3a-dd6c-4705-aa5b-c02e4297919c", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 140.00000000000003, 78, 395, 83.0, 324.0, 329.59999999999997, 395.0, 0.24944102533867288, 0.1853756057448536, 0.12057940189711239], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 500.74545454545466, 383, 725, 465.0, 655.8, 705.1999999999999, 725.0, 0.24941161532566353, 73.3352961507852, 0.1254365057546062], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 131.4909090909091, 78, 331, 83.0, 241.8, 246.59999999999997, 331.0, 0.24975592035056648, 0.44195090593283837, 0.12146332845174035], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 766.1636363636366, 537, 1097, 771.0, 951.4, 1010.9999999999997, 1097.0, 0.24914159396261967, 224.17804419177332, 0.1250574016570181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 95.0, 80, 237, 84.0, 110.0, 237.0, 237.0, 0.10788160277993857, 0.08059514270180958, 0.03834853848818129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 17, 9.6045197740113, 160.86440677966104, 79, 2344, 86.0, 248.20000000000002, 355.29999999999984, 2109.9999999999995, 0.7365087819309846, 1.536018712316341, 0.3548162590035078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 85.14285714285714, 80, 99, 82.0, 99.0, 99.0, 99.0, 0.04452189841374836, 0.034478384220803175, 0.015826143576762115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 99.53333333333332, 81, 243, 84.0, 178.20000000000005, 243.0, 243.0, 0.1514616044832635, 0.1229146419195234, 0.05383986721866007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 286.85714285714283, 158, 546, 172.0, 546.0, 546.0, 546.0, 0.043569730241127334, 0.06752457216080965, 0.0979893444778479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 314.625, 161, 1165, 244.0, 679.2000000000005, 1165.0, 1165.0, 0.08588897776012283, 6.546859021630602, 0.1917928552448641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73475634-11de-49ec-86fa-e6b0abba2633", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 95.84615384615384, 80, 236, 85.0, 179.19999999999993, 236.0, 236.0, 0.06545359340227778, 0.0542676765610682, 0.023266707029715932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/616a34fb-1f99-4ef1-a256-99f8337e66a9", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.8821434737569062, 1.648286429558011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 85.4705882352941, 79, 98, 84.0, 96.4, 98.0, 98.0, 0.07560730455511772, 0.05869903039191269, 0.026876034041077003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12ea5a05-d871-427e-8884-404aa16fb5bb", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bd7e3c0-0315-4dce-bdec-e23769a80231", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 99.26315789473682, 79, 260, 81.0, 243.0, 260.0, 260.0, 0.10754331448495243, 0.07992232648735234, 0.05398170277857964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 121.52631578947368, 78, 243, 80.0, 242.0, 243.0, 243.0, 0.10744661599710459, 0.037244036712812165, 0.06080320940214441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 179.15789473684208, 78, 880, 81.0, 239.0, 880.0, 880.0, 0.1070603482278695, 5.097499973587085, 0.062455538259987606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 132.94736842105263, 77, 468, 82.0, 235.0, 468.0, 468.0, 0.10730946921347807, 1.6880613450112394, 0.06270566177467271], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 17.5, 0.5351681957186545], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.0, 0.3058103975535168], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.0, 0.3058103975535168], "isController": false}, {"data": ["401/Unauthorized", 25, 62.5, 1.9113149847094801], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 40, "401/Unauthorized", 25, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
