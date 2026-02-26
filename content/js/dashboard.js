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

    var data = {"OkPercent": 98.98832684824903, "KoPercent": 1.0116731517509727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8324378777703156, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4642857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5020b76-6a85-49ae-9a4f-de1bb047ccf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c73ceeca-6a46-46af-9af5-7fe12d80d2c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66f0951f-430c-404a-9324-b295ec92654a"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/000dfba7-996f-4a9e-a69b-6f61f709a45c"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3914f502-f45b-4367-a676-8acfc485cbe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a24a7385-9993-4b15-bd56-79cb20b19b7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63855ae2-2f57-4ce3-96fe-4eedf084aac7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b02c4567-ced8-4465-999a-387b96c266ea"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d01df344-aa0d-4c18-861d-57106b8b4318"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3717e4d9-6e60-4ef2-a172-39e9258bde6f"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c73ceeca-6a46-46af-9af5-7fe12d80d2c5"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=737903b3-58f1-402c-9ac5-5de74873649a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca444ded-c17e-44fd-9cb5-594482974f4c"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3914f502-f45b-4367-a676-8acfc485cbe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93015eb8-ec76-41fb-92c9-08deec512bd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66f0951f-430c-404a-9324-b295ec92654a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/737903b3-58f1-402c-9ac5-5de74873649a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d01df344-aa0d-4c18-861d-57106b8b4318"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a24a7385-9993-4b15-bd56-79cb20b19b7d"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63855ae2-2f57-4ce3-96fe-4eedf084aac7"], "isController": false}, {"data": [0.9558823529411765, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5020b76-6a85-49ae-9a4f-de1bb047ccf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c9bc8ee-ec29-48e0-9f6c-c96d0c13ccf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/791f40fa-64ba-4762-a16e-de3f5d34b5c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3717e4d9-6e60-4ef2-a172-39e9258bde6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=000dfba7-996f-4a9e-a69b-6f61f709a45c"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca444ded-c17e-44fd-9cb5-594482974f4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93015eb8-ec76-41fb-92c9-08deec512bd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 13, 1.0116731517509727, 284.9891050583659, 80, 3418, 108.0, 657.4000000000001, 830.1000000000001, 1442.940000000002, 5.128942001045745, 738.6886334001393, 3.7554657159164844], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1241.3214285714282, 993, 3778, 1167.0, 1458.3000000000002, 1565.9999999999995, 3778.0, 0.2538243626062323, 305.4346627124646, 1.2480524079320112], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5020b76-6a85-49ae-9a4f-de1bb047ccf3", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c73ceeca-6a46-46af-9af5-7fe12d80d2c5", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66f0951f-430c-404a-9324-b295ec92654a", 3, 0, 0.0, 335.3333333333333, 210, 419, 377.0, 419.0, 419.0, 419.0, 0.02818250993433475, 0.028265075881408, 0.0180727684149217], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 637.4166666666666, 363, 1291, 519.5, 1258.9, 1291.0, 1291.0, 0.07653061224489796, 0.01382633131377551, 0.05201690051020408], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 637.4166666666666, 363, 1291, 519.5, 1258.9, 1291.0, 1291.0, 0.07486337434182616, 0.01352512134105258, 0.05088369974795997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 129.62500000000003, 82, 335, 84.0, 273.4000000000001, 335.0, 335.0, 0.10043879197242955, 0.055160415659663155, 0.055699881827483824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 114.75, 83, 252, 84.0, 247.8, 252.0, 252.0, 0.10043753099439433, 0.07464156356126375, 0.05041493254992059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 186.9375, 81, 579, 84.0, 460.0000000000001, 579.0, 579.0, 0.10044068349885121, 5.5594139011475345, 0.05752779382038695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 224.9375, 81, 737, 84.5, 730.7, 737.0, 737.0, 0.10043942247332077, 16.967414812853107, 0.05742898618957941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/000dfba7-996f-4a9e-a69b-6f61f709a45c", 3, 0, 0.0, 363.33333333333337, 196, 658, 236.0, 658.0, 658.0, 658.0, 0.03005048481448834, 0.03013852334421829, 0.01927065595199936], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 222.16666666666666, 166, 413, 207.0, 361.4000000000002, 413.0, 413.0, 0.07638446849140676, 0.16819750556970084, 0.04938136537237429], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 84.53333333333335, 83, 90, 84.0, 88.2, 90.0, 90.0, 0.12082450643189122, 0.08979243104948166, 0.060648238580070395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 83.93333333333335, 80, 90, 83.0, 90.0, 90.0, 90.0, 0.12082742621471838, 0.032330776155110194, 0.06890939151308158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 441.1666666666667, 405, 603, 410.0, 603.0, 603.0, 603.0, 0.09659813565598184, 28.403059242831613, 0.05509112424130214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 685.0, 571, 753, 735.5, 753.0, 753.0, 753.0, 0.0966448142003447, 86.96117370093262, 0.055023365897266564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 172.5, 84, 283, 165.5, 283.0, 283.0, 283.0, 0.09709994821336095, 0.17182139273692387, 0.05376530335642154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 99.72727272727272, 83, 254, 84.0, 220.6000000000001, 254.0, 254.0, 0.06806804329127554, 0.05058572357877019, 0.03416696704269104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3914f502-f45b-4367-a676-8acfc485cbe8", 3, 0, 0.0, 747.0, 413, 942, 886.0, 942.0, 942.0, 942.0, 0.042999656002751976, 0.027644635613748424, 0.02757464919447311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 111.9090909090909, 81, 246, 83.0, 245.4, 246.0, 246.0, 0.06807014938303692, 0.018214082940382924, 0.038821257070013236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a24a7385-9993-4b15-bd56-79cb20b19b7d", 3, 0, 0.0, 506.0, 166, 1145, 207.0, 1145.0, 1145.0, 1145.0, 0.07618080243778567, 0.03536257300660233, 0.04885292343829355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 165.5454545454545, 82, 333, 87.0, 316.4000000000001, 333.0, 333.0, 0.06806972815425838, 0.018346918916577457, 0.04001755502818706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 142.8181818181818, 82, 249, 86.0, 248.4, 249.0, 249.0, 0.06806972815425838, 0.018346918916577457, 0.0400840293720877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 112.0, 82, 246, 84.5, 246.0, 246.0, 246.0, 0.0974010162172692, 0.07238493490365416, 0.05469295344231425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63855ae2-2f57-4ce3-96fe-4eedf084aac7", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.5221504696531792, 1.9926390895953758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 116.19999999999999, 82, 245, 84.0, 245.0, 245.0, 245.0, 0.12067093037287317, 0.03252458670206347, 0.07094130867623989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 442.5294117647059, 81, 812, 569.0, 760.0, 812.0, 812.0, 0.12327058618789337, 65.26020460651304, 0.0662381125460452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 116.26666666666667, 83, 245, 84.0, 245.0, 245.0, 245.0, 0.12066898887431923, 0.032524063407531355, 0.07105800809688916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 370.94117647058823, 81, 653, 410.0, 652.2, 653.0, 653.0, 0.12341556197639132, 21.359740028748565, 0.06643653672338942], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 475.33333333333337, 188, 963, 451.0, 915.3000000000002, 963.0, 963.0, 0.07477893477407414, 0.013509866145706753, 0.05155657026415658], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 280.6363636363636, 166, 500, 329.0, 483.4000000000001, 500.0, 500.0, 0.06803310119614561, 0.10543801913894833, 0.15300803911594077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 505.8095238095238, 86, 1465, 461.0, 791.6, 1399.199999999999, 1465.0, 0.09538040886401933, 0.05858816130416813, 0.043126102835977495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 93.82352941176471, 83, 249, 84.0, 119.39999999999989, 249.0, 249.0, 0.12341287414064712, 0.09171601291116452, 0.061947477840129515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 161.17647058823533, 82, 252, 91.0, 251.2, 252.0, 252.0, 0.12327326782930279, 0.1418973886008484, 0.06421426888075124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b02c4567-ced8-4465-999a-387b96c266ea", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["login", 21, 0, 0.0, 2389.571428571429, 1573, 4277, 2363.0, 3467.2000000000003, 4199.0999999999985, 4277.0, 0.09597981681566391, 32.93773437928481, 0.19028587845527342], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 98.6, 84, 250, 86.0, 162.40000000000003, 250.0, 250.0, 0.11878647734741876, 0.09616600558692398, 0.04222488061959027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d01df344-aa0d-4c18-861d-57106b8b4318", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3717e4d9-6e60-4ef2-a172-39e9258bde6f", 3, 0, 0.0, 317.3333333333333, 238, 426, 288.0, 426.0, 426.0, 426.0, 0.059135439869113564, 0.03801838988981096, 0.037922140801482325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 548.7058823529413, 166, 896, 660.0, 844.0, 896.0, 896.0, 0.12319376204762526, 86.77424522307129, 0.25852431763337536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c73ceeca-6a46-46af-9af5-7fe12d80d2c5", 3, 0, 0.0, 314.3333333333333, 241, 422, 280.0, 422.0, 422.0, 422.0, 0.023042536522420387, 0.02311004395363842, 0.014776626611057346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 363.75000000000006, 167, 980, 259.5, 868.7000000000002, 980.0, 980.0, 0.10038396868020177, 22.64405369091462, 0.2209501146573142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 802.1666666666667, 654, 850, 824.5, 850.0, 850.0, 850.0, 0.09645526886906197, 115.39403484446588, 0.21749532794791415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=737903b3-58f1-402c-9ac5-5de74873649a", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca444ded-c17e-44fd-9cb5-594482974f4c", 3, 0, 0.0, 422.0, 171, 843, 252.0, 843.0, 843.0, 843.0, 0.019513337366089723, 0.023064104158942635, 0.012513435745832276], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 815.5454545454546, 230, 1382, 903.0, 1158.7, 1348.9999999999995, 1382.0, 0.08934917250482281, 0.027969210072088538, 0.04031183368869936], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 23, 0, 0.0, 101.7391304347826, 84, 250, 88.0, 128.20000000000002, 226.19999999999965, 250.0, 0.10661623255318063, 0.08277334460915879, 0.03789873891538843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 224.6, 168, 330, 175.0, 329.4, 330.0, 330.0, 0.12058556349633821, 0.18688407155145387, 0.2711997585274091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3914f502-f45b-4367-a676-8acfc485cbe8", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 269.22222222222223, 167, 491, 330.0, 353.30000000000024, 491.0, 491.0, 0.0817579782160409, 0.1267088978797431, 0.18387560921049045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93015eb8-ec76-41fb-92c9-08deec512bd7", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 90.375, 82, 137, 84.0, 137.0, 137.0, 137.0, 0.049778176003185806, 0.03699335150236758, 0.024986311001599124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66f0951f-430c-404a-9324-b295ec92654a", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 107.625, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.04977445948047908, 0.013318556540675066, 0.028386996422460727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/737903b3-58f1-402c-9ac5-5de74873649a", 3, 0, 0.0, 295.0, 203, 463, 219.0, 463.0, 463.0, 463.0, 0.020979314396005536, 0.02104077723115009, 0.013453531692750948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 87.75, 83, 104, 84.0, 104.0, 104.0, 104.0, 0.04977445948047908, 0.013415772281847878, 0.029261938093016023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 128.25, 83, 247, 90.0, 247.0, 247.0, 247.0, 0.049774769169507974, 0.013415855752718947, 0.029310728329309876], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 806.4464285714287, 647, 3418, 659.5, 1101.5, 1201.8999999999996, 3418.0, 0.24340100750631322, 291.19222485906647, 0.4806219113064114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 815.5454545454546, 230, 1382, 903.0, 1158.7, 1348.9999999999995, 1382.0, 0.08879381672149012, 0.027795365568179527, 0.040061272778641056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 82.4, 81, 83, 83.0, 83.0, 83.0, 83.0, 0.03825496166852841, 0.010310907637220548, 0.02252709168566663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 83.0, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.0382546689823493, 0.010310828749148833, 0.022489561257201442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 23, 0, 0.0, 148.13043478260866, 81, 727, 84.0, 447.6000000000005, 697.5999999999996, 727.0, 0.10938057305908928, 8.585251084888835, 0.06348643145880395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 23, 0, 0.0, 151.82608695652172, 82, 574, 84.0, 374.8000000000001, 539.9999999999995, 574.0, 0.10938161342635526, 2.823598666971033, 0.0635938532883442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 23, 0, 0.0, 86.7391304347826, 83, 106, 85.0, 97.80000000000001, 104.99999999999999, 106.0, 0.10938057305908928, 0.08128771103317084, 0.05490392046130067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 82.4, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.03825437630064879, 0.01023603428357204, 0.021816948983963764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 23, 0, 0.0, 112.52173913043477, 82, 248, 84.0, 246.0, 247.6, 248.0, 0.10938161342635526, 0.04355387103907777, 0.06158288867329614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 92.0, 83, 119, 85.0, 119.0, 119.0, 119.0, 0.03825262030449086, 0.02842797270675541, 0.019201022301277636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 86.6, 86, 89, 86.0, 89.0, 89.0, 89.0, 0.03695600756859035, 0.029088420019808423, 0.013136705815397352], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 579.9166666666666, 370, 1145, 444.5, 1067.3000000000002, 1145.0, 1145.0, 0.07624953932569992, 0.013775551538334457, 0.051900321201184416], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1430.8095238095236, 735, 2947, 1350.0, 1991.0, 2851.4999999999986, 2947.0, 0.09675858732462506, 0.05008012820512821, 0.04450517053701016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 175.8, 167, 203, 169.0, 203.0, 203.0, 203.0, 0.038228053274615044, 0.05924601615899811, 0.08597578778460785], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 868.6140350877193, 426, 2180, 760.0, 1357.8000000000002, 1485.5999999999992, 2180.0, 0.2824662774909065, 90.02586641575071, 1.0268632553495147], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d01df344-aa0d-4c18-861d-57106b8b4318", 3, 0, 0.0, 381.0, 198, 527, 418.0, 527.0, 527.0, 527.0, 0.06897185948133162, 0.03201623425142542, 0.04423000103457789], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 149.48214285714283, 82, 578, 85.0, 339.90000000000003, 349.94999999999993, 578.0, 0.24400233545092503, 0.18133376687319722, 0.11795034770332802], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 475.75, 400, 672, 412.0, 585.3, 607.2499999999999, 672.0, 0.24421728360604264, 71.80799015717126, 0.1228241221260859], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 175.33928571428567, 82, 2843, 86.0, 256.8, 341.79999999999995, 2843.0, 0.24457779757693282, 0.4327880558685569, 0.11894506171221927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a24a7385-9993-4b15-bd56-79cb20b19b7d", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 653.7857142857144, 559, 3332, 571.0, 747.0, 816.3, 3332.0, 0.24406614192446152, 219.61114352614558, 0.12250976264567698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 107.77777777777777, 83, 270, 86.5, 252.00000000000003, 270.0, 270.0, 0.08535619614853875, 0.06376708013050014, 0.030341460349675883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63855ae2-2f57-4ce3-96fe-4eedf084aac7", 3, 0, 0.0, 352.3333333333333, 174, 513, 370.0, 513.0, 513.0, 513.0, 0.01641550937325585, 0.022630104881425306, 0.010526872872823577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, 3.5294117647058822, 159.81176470588235, 84, 1187, 91.0, 295.9, 411.7999999999995, 1065.5899999999986, 0.7218561043549154, 1.5785584785714892, 0.3461450959962464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5020b76-6a85-49ae-9a4f-de1bb047ccf3", 3, 0, 0.0, 265.3333333333333, 204, 376, 216.0, 376.0, 376.0, 376.0, 0.04196449803466268, 0.026979128782050384, 0.026910827190197092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 115.375, 85, 260, 89.0, 260.0, 260.0, 260.0, 0.052422578404518826, 0.04059678190896819, 0.018634588417231302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c9bc8ee-ec29-48e0-9f6c-c96d0c13ccf1", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/791f40fa-64ba-4762-a16e-de3f5d34b5c6", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 102.9375, 83, 252, 86.0, 190.40000000000006, 252.0, 252.0, 0.09670478446921162, 0.07847819911515122, 0.034375528854290065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3717e4d9-6e60-4ef2-a172-39e9258bde6f", 1, 0, 0.0, 804.0, 804, 804, 804.0, 804.0, 804.0, 804.0, 1.243781094527363, 0.22470654539800994, 0.8575287624378108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 219.625, 168, 331, 184.5, 331.0, 331.0, 331.0, 0.04974814999067222, 0.07709991604999689, 0.11188475530128723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=000dfba7-996f-4a9e-a69b-6f61f709a45c", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 23, 0, 0.0, 268.65217391304344, 167, 811, 178.0, 566.2000000000004, 781.7999999999996, 811.0, 0.1093363757368321, 11.529003664848354, 0.24346748579815553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 102.81818181818181, 83, 250, 86.0, 220.8000000000001, 250.0, 250.0, 0.07014679811751502, 0.05815881992360376, 0.024934994643335418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca444ded-c17e-44fd-9cb5-594482974f4c", 1, 0, 0.0, 963.0, 963, 963, 963.0, 963.0, 963.0, 963.0, 1.0384215991692627, 0.18760546469366562, 0.7159430166147456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 90.47058823529412, 85, 105, 87.0, 103.4, 105.0, 105.0, 0.1167831062932355, 0.09066657178039281, 0.041512744815173565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93015eb8-ec76-41fb-92c9-08deec512bd7", 3, 0, 0.0, 277.6666666666667, 173, 424, 236.0, 424.0, 424.0, 424.0, 0.017393724344256595, 0.023978653189429253, 0.011154178697326005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 93.44444444444443, 83, 245, 84.0, 105.50000000000023, 245.0, 245.0, 0.081789555473766, 0.060783058315953056, 0.0410545229624177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 138.22222222222223, 81, 251, 85.0, 250.1, 251.0, 251.0, 0.0817906704108618, 0.02188539423103138, 0.046646241718694616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 146.5, 81, 251, 84.5, 248.3, 251.0, 251.0, 0.08179029876178576, 0.022045041463137568, 0.048083749858002955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 137.72222222222223, 81, 247, 84.5, 246.1, 247.0, 247.0, 0.081789555473766, 0.022044841123788492, 0.04816318549871181], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 53.84615384615385, 0.5447470817120622], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.4669260700389105], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 13, "406/Not Acceptable", 7, "401/Unauthorized", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
