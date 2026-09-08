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

    var data = {"OkPercent": 98.2225656877898, "KoPercent": 1.777434312210201};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7554890219560878, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e812c8e-14d7-46c2-b483-13bd97cd2d49"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8e8dfeb4-167f-4cd1-a275-1770c51ffa44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6bfe489-fa79-41de-8dcc-bd9fd58d3c98"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1374e4fb-5db7-4be5-b795-136786c7d94f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47063e26-c3e6-46ae-beeb-f226d3b0e3db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/18e382f0-2bb6-4f7f-873e-1bec7b1e1ed8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/405fcea1-282b-4f38-b3f5-da2c300717c5"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/837aff4c-cc87-4c2a-a42e-8bd7e07fe8f8"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f2564b9b-7cc4-4804-b2c0-431c3f6eb699"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48b75e9f-8eb2-43f5-bd9d-9324a8f003bd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=706b9942-c7ef-4139-92f2-a850a844a6dd"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e71ce04-0af4-41d6-bbcb-fcb91179f907"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e7d38fd-630e-447d-b482-6aa7eaefe950"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ef40b31-0397-403b-b0eb-472986a8b5dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2564b9b-7cc4-4804-b2c0-431c3f6eb699"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6e812c8e-14d7-46c2-b483-13bd97cd2d49"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5446428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1374e4fb-5db7-4be5-b795-136786c7d94f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/47063e26-c3e6-46ae-beeb-f226d3b0e3db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48b75e9f-8eb2-43f5-bd9d-9324a8f003bd"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=405fcea1-282b-4f38-b3f5-da2c300717c5"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/706b9942-c7ef-4139-92f2-a850a844a6dd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6bfe489-fa79-41de-8dcc-bd9fd58d3c98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ef40b31-0397-403b-b0eb-472986a8b5dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e71ce04-0af4-41d6-bbcb-fcb91179f907"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=837aff4c-cc87-4c2a-a42e-8bd7e07fe8f8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18e382f0-2bb6-4f7f-873e-1bec7b1e1ed8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 23, 1.777434312210201, 402.93663060278203, 96, 4420, 122.5, 1124.0, 1379.75, 2147.5499999999947, 5.136857148528215, 734.7023842383537, 3.764618296083841], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1684.9107142857142, 1224, 2193, 1664.0, 1995.7000000000003, 2170.3, 2193.0, 0.23574778354985645, 283.6850175771548, 1.1591700099350852], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e812c8e-14d7-46c2-b483-13bd97cd2d49", 1, 0, 0.0, 1440.0, 1440, 1440, 1440.0, 1440.0, 1440.0, 1440.0, 0.6944444444444444, 0.1254611545138889, 0.4787868923611111], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 923.7692307692308, 108, 1900, 671.0, 1779.1999999999998, 1900.0, 1900.0, 0.07782939795967239, 0.01474502266032856, 0.052613187517960625], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 923.7692307692308, 108, 1900, 671.0, 1779.1999999999998, 1900.0, 1900.0, 0.0770886578864662, 0.014604687138646917, 0.052112442331754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e8dfeb4-167f-4cd1-a275-1770c51ffa44", 2, 0, 0.0, 605.0, 519, 691, 605.0, 691.0, 691.0, 691.0, 0.036021108369504534, 0.04147352223402914, 0.022390073708193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 130.45454545454547, 98, 306, 101.0, 303.7, 305.7, 306.0, 0.11322463768115942, 0.045756263381093544, 0.06370896250205862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 105.72727272727272, 97, 127, 103.0, 121.5, 126.39999999999999, 127.0, 0.11322114147496269, 0.08414188345942052, 0.05683170577942463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 210.13636363636363, 99, 789, 103.5, 608.0999999999998, 776.3999999999999, 789.0, 0.11322230685303744, 3.054207913467279, 0.06578835212652079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 211.49999999999997, 97, 1104, 102.5, 859.2999999999994, 1102.8, 1104.0, 0.11322463768115942, 9.289536708585516, 0.0656791355298913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6bfe489-fa79-41de-8dcc-bd9fd58d3c98", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 573.6428571428571, 102, 3025, 456.0, 1785.5, 3025.0, 3025.0, 0.07842873628897629, 0.1513921888479939, 0.05069748180733421], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 132.57142857142858, 101, 313, 103.5, 308.0, 313.0, 313.0, 0.11404366243075921, 0.08475315147442163, 0.057244572743564676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 174.92857142857144, 100, 317, 104.5, 314.0, 317.0, 317.0, 0.11386742578283855, 0.042684399145994305, 0.06425693879625864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 709.1428571428571, 505, 861, 782.0, 861.0, 861.0, 861.0, 0.06308465961320091, 18.54898453411979, 0.03597796993565364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1374e4fb-5db7-4be5-b795-136786c7d94f", 3, 0, 0.0, 1048.3333333333335, 498, 2142, 505.0, 2142.0, 2142.0, 2142.0, 0.0176532893962575, 0.020865590428974932, 0.011320631546428152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1116.7142857142856, 877, 1365, 1096.0, 1365.0, 1365.0, 1365.0, 0.0628044896238011, 56.51159016201316, 0.03575685297917583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 218.57142857142856, 98, 308, 305.0, 308.0, 308.0, 308.0, 0.06325167842846686, 0.11192582159412302, 0.035023146161074915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47063e26-c3e6-46ae-beeb-f226d3b0e3db", 1, 0, 0.0, 1241.0, 1241, 1241, 1241.0, 1241.0, 1241.0, 1241.0, 0.8058017727639001, 0.14557942183722802, 0.5555625503626107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 126.88235294117646, 101, 308, 104.0, 301.6, 308.0, 308.0, 0.09537327416450206, 0.07087798988201764, 0.04787291300835357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 125.9411764705882, 98, 305, 103.0, 298.6, 305.0, 305.0, 0.09537327416450206, 0.025519801876048402, 0.05439257042194258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 150.76470588235293, 99, 308, 103.0, 307.2, 308.0, 308.0, 0.09537434430138292, 0.025706366237482115, 0.0560696828803052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 145.76470588235296, 99, 415, 103.0, 327.7999999999999, 415.0, 415.0, 0.0953727391050671, 0.025705933586912616, 0.05616187664097213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 163.57142857142858, 100, 310, 111.0, 310.0, 310.0, 310.0, 0.06336447244550655, 0.047090198760771966, 0.03558063638297487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 791.4375, 99, 1435, 1089.0, 1354.5, 1435.0, 1435.0, 0.07882511170996301, 44.33732598432859, 0.04210677354038063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 180.92857142857142, 100, 1011, 102.5, 654.0, 1011.0, 1011.0, 0.11404366243075921, 7.3583061588668945, 0.06634515518084066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 543.5, 100, 907, 739.5, 900.7, 907.0, 907.0, 0.07882511170996301, 14.493717238312946, 0.04218375118853489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 225.57142857142856, 99, 811, 106.5, 563.0, 811.0, 811.0, 0.11404459143525118, 2.423749862535537, 0.06645706730260104], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 815.5384615384615, 108, 1495, 907.0, 1473.0, 1495.0, 1495.0, 0.07689805093017066, 0.014568576055129987, 0.05259590998491615], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 309.88235294117646, 206, 616, 212.0, 609.6, 616.0, 616.0, 0.09531712568404055, 0.1477229281841527, 0.2143704496585404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18e382f0-2bb6-4f7f-873e-1bec7b1e1ed8", 3, 0, 0.0, 2287.3333333333335, 1584, 3025, 2253.0, 3025.0, 3025.0, 3025.0, 0.017932073306315677, 0.024720810694090784, 0.011499408988750612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/405fcea1-282b-4f38-b3f5-da2c300717c5", 3, 0, 0.0, 525.3333333333334, 207, 907, 462.0, 907.0, 907.0, 907.0, 0.02653951291147303, 0.026790048677889932, 0.017019153787630817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 674.6190476190475, 197, 1867, 565.0, 1169.2, 1798.3999999999992, 1867.0, 0.09822447566839418, 0.06033515155802728, 0.04441204319772119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 117.1875, 101, 302, 103.5, 176.70000000000013, 302.0, 302.0, 0.07881656921326285, 0.05857364176884086, 0.03956222321837609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 140.0625, 98, 311, 103.5, 305.4, 311.0, 311.0, 0.07882472337448641, 0.09508617143392024, 0.04081719684504045], "isController": false}, {"data": ["login", 21, 0, 0.0, 3287.238095238095, 1948, 7571, 3193.0, 4640.6, 7295.199999999996, 7571.0, 0.09457329430308489, 37.84135488206485, 0.19496506276739473], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 128.21428571428572, 100, 299, 107.5, 257.0, 299.0, 299.0, 0.10764924799311044, 0.08714963533817242, 0.03826594362255098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/837aff4c-cc87-4c2a-a42e-8bd7e07fe8f8", 3, 0, 0.0, 351.3333333333333, 282, 485, 287.0, 485.0, 485.0, 485.0, 0.08805917576611483, 0.03984448382646472, 0.05647023966772338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 910.4999999999998, 204, 1542, 1193.0, 1458.0, 1542.0, 1542.0, 0.07877621155351612, 58.948117940912915, 0.16457227594322205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2564b9b-7cc4-4804-b2c0-431c3f6eb699", 3, 0, 0.0, 914.3333333333334, 224, 1813, 706.0, 1813.0, 1813.0, 1813.0, 0.03715584399499635, 0.023887627568397716, 0.023827152561895444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48b75e9f-8eb2-43f5-bd9d-9324a8f003bd", 3, 0, 0.0, 391.0, 367, 423, 383.0, 423.0, 423.0, 423.0, 0.04072987943955686, 0.026185387986043227, 0.02611909586455957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=706b9942-c7ef-4139-92f2-a850a844a6dd", 1, 0, 0.0, 1214.0, 1214, 1214, 1214.0, 1214.0, 1214.0, 1214.0, 0.8237232289950577, 0.1488171849258649, 0.5679185543657331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 368.04545454545456, 199, 1210, 221.0, 986.5999999999995, 1208.8, 1210.0, 0.1131617389873053, 12.466778831810792, 0.2518712675915067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1019.2222222222222, 102, 1503, 1201.0, 1503.0, 1503.0, 1503.0, 0.0806675689483638, 75.06537434233523, 0.15335240971954575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e71ce04-0af4-41d6-bbcb-fcb91179f907", 1, 0, 0.0, 1007.0, 1007, 1007, 1007.0, 1007.0, 1007.0, 1007.0, 0.9930486593843098, 0.1794082050645482, 0.684660501489573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e7d38fd-630e-447d-b482-6aa7eaefe950", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1298.2727272727273, 213, 2571, 1324.0, 2128.0999999999995, 2524.9499999999994, 2571.0, 0.09287834203715979, 0.029073955435282794, 0.0419040957237967], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 111.50000000000001, 104, 133, 107.5, 130.9, 133.0, 133.0, 0.09028275430112684, 0.07009256803651938, 0.03209269781797868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 415.07142857142856, 204, 1116, 399.5, 872.5, 1116.0, 1116.0, 0.11377303904040569, 9.886024747159738, 0.2537989528817085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ef40b31-0397-403b-b0eb-472986a8b5dc", 3, 0, 0.0, 737.0, 407, 1324, 480.0, 1324.0, 1324.0, 1324.0, 0.03164590343779998, 0.02607284557326554, 0.020293759691557927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 298.25, 204, 425, 224.0, 418.7, 425.0, 425.0, 0.08620875449901937, 0.13360673182611693, 0.19388550938597815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 133.57142857142858, 101, 314, 104.0, 314.0, 314.0, 314.0, 0.03166890611074164, 0.02353519292018983, 0.015896306387618363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 130.42857142857142, 99, 296, 103.0, 296.0, 296.0, 296.0, 0.03166890611074164, 0.00847390651791329, 0.01806117301628234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 130.57142857142856, 96, 297, 105.0, 297.0, 297.0, 297.0, 0.03166904938562044, 0.00853579846721801, 0.018617937236468266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 102.28571428571428, 97, 105, 103.0, 105.0, 105.0, 105.0, 0.03166919266179564, 0.008535837084624607, 0.01864894841314724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 2.730758101851852, 5.723741319444445], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1167.1964285714284, 792, 1761, 1111.0, 1521.3, 1714.1, 1761.0, 0.24154693558892162, 288.9741102661761, 0.4769608435164058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1298.2727272727273, 213, 2571, 1324.0, 2128.0999999999995, 2524.9499999999994, 2571.0, 0.09036874555858153, 0.02828836974783012, 0.04077183637506315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 141.2, 99, 299, 103.0, 299.0, 299.0, 299.0, 0.023163054002344103, 0.006243166899069309, 0.01363996246427099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 141.8, 101, 300, 102.0, 300.0, 300.0, 300.0, 0.023162410187754497, 0.006242993370918205, 0.01361696380178536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2564b9b-7cc4-4804-b2c0-431c3f6eb699", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 205.31250000000003, 98, 1314, 102.5, 611.2000000000007, 1314.0, 1314.0, 0.09094784709393208, 5.137670749253943, 0.05297889725735398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 197.75, 97, 780, 103.5, 450.3000000000003, 780.0, 780.0, 0.09084353903717204, 1.6923933972360852, 0.053006850170615516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 101.4, 99, 106, 101.0, 106.0, 106.0, 106.0, 0.023162839393504213, 0.0061978691345899945, 0.013210056841607871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 117.4375, 99, 296, 105.0, 169.30000000000013, 296.0, 296.0, 0.090945262320241, 0.06758725061103849, 0.04565025862558972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 102.8, 100, 106, 103.0, 106.0, 106.0, 106.0, 0.023162517487700703, 0.017213550593886948, 0.011626498035818516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 117.6875, 97, 307, 101.5, 192.90000000000012, 307.0, 307.0, 0.09084250748031274, 0.032835042071436275, 0.05133178309648043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 107.8, 103, 110, 109.0, 110.0, 110.0, 110.0, 0.022091928934683, 0.017388764376322755, 0.007852990363500598], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 1156.3076923076924, 103, 2824, 1183.0, 2551.2, 2824.0, 2824.0, 0.07670974213725143, 0.014371551749572196, 0.05220780226588777], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1762.7619047619046, 1190, 4420, 1452.0, 2772.0, 4258.999999999998, 4420.0, 0.09769032168027353, 0.05056237352592283, 0.04493373194473519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 246.8, 203, 403, 210.0, 403.0, 403.0, 403.0, 0.02315125641868584, 0.03587992571919378, 0.05206771829319677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e812c8e-14d7-46c2-b483-13bd97cd2d49", 3, 0, 0.0, 769.3333333333333, 308, 1472, 528.0, 1472.0, 1472.0, 1472.0, 0.03021452311411018, 0.03030304222479605, 0.019375849783462584], "isController": false}, {"data": ["addBook", 57, 12, 21.05263157894737, 1286.298245614035, 530, 4353, 939.0, 2149.400000000001, 3977.699999999998, 4353.0, 0.2819046865417713, 83.93812018258274, 1.0250438466883618], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 183.73214285714286, 97, 420, 105.0, 407.0, 409.2, 420.0, 0.24253763664397207, 0.18024525535748315, 0.11724231458863885], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 652.8749999999998, 492, 919, 600.0, 820.1, 904.45, 919.0, 0.24220091430845153, 71.21511063391765, 0.1218100301453638], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 163.41071428571428, 99, 415, 106.5, 314.3, 334.6499999999999, 415.0, 0.24289847277585241, 0.4298164381541451, 0.11812835883044386], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 981.6071428571428, 688, 1347, 971.0, 1245.5000000000002, 1324.0, 1347.0, 0.242010415091078, 217.76139690788477, 0.12147788413751377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 110.50000000000001, 105, 121, 110.0, 117.5, 121.0, 121.0, 0.08412507295221171, 0.06284734453949409, 0.029903834525981502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, 7.0588235294117645, 241.56470588235314, 98, 3720, 114.5, 405.00000000000017, 569.05, 3546.049999999998, 0.6908125987963607, 1.5110771609735583, 0.3304019195955089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 107.71428571428571, 102, 113, 107.0, 113.0, 113.0, 113.0, 0.03299521098080622, 0.02555195537869075, 0.01172876640333346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1374e4fb-5db7-4be5-b795-136786c7d94f", 1, 0, 0.0, 907.0, 907, 907, 907.0, 907.0, 907.0, 907.0, 1.1025358324145536, 0.1991886025358324, 0.7601467750826901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47063e26-c3e6-46ae-beeb-f226d3b0e3db", 3, 0, 0.0, 850.0, 396, 1608, 546.0, 1608.0, 1608.0, 1608.0, 0.02856435549292556, 0.023812927870241654, 0.01831763682326281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 130.22727272727275, 103, 320, 107.0, 261.69999999999993, 317.59999999999997, 320.0, 0.11723454369118289, 0.09513857989001269, 0.041673216702725176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48b75e9f-8eb2-43f5-bd9d-9324a8f003bd", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 266.0, 201, 613, 208.0, 613.0, 613.0, 613.0, 0.03165358318561661, 0.04905687159723981, 0.07118965046530767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=405fcea1-282b-4f38-b3f5-da2c300717c5", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 0.18878167450365727, 0.7204316875653083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 350.8125, 200, 1610, 216.0, 774.2000000000008, 1610.0, 1610.0, 0.09078683817813513, 6.920196817708541, 0.20272993539949047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/706b9942-c7ef-4139-92f2-a850a844a6dd", 3, 0, 0.0, 1189.0, 208, 2824, 535.0, 2824.0, 2824.0, 2824.0, 0.02499083669321249, 0.025064052035087134, 0.016026024832561395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6bfe489-fa79-41de-8dcc-bd9fd58d3c98", 3, 0, 0.0, 390.33333333333337, 210, 716, 245.0, 716.0, 716.0, 716.0, 0.0685166152792052, 0.031001984126984128, 0.043938063834646574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 158.35294117647055, 102, 325, 109.0, 313.0, 325.0, 325.0, 0.09435428368447928, 0.07822928403137003, 0.03353999927846724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ef40b31-0397-403b-b0eb-472986a8b5dc", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 113.93749999999999, 102, 144, 109.5, 144.0, 144.0, 144.0, 0.07542935804901967, 0.058560878563447875, 0.026812779618987457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e71ce04-0af4-41d6-bbcb-fcb91179f907", 3, 0, 0.0, 653.3333333333333, 243, 1183, 534.0, 1183.0, 1183.0, 1183.0, 0.03363341816428803, 0.02803879684854872, 0.021568305268114398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=837aff4c-cc87-4c2a-a42e-8bd7e07fe8f8", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18e382f0-2bb6-4f7f-873e-1bec7b1e1ed8", 1, 0, 0.0, 1495.0, 1495, 1495, 1495.0, 1495.0, 1495.0, 1495.0, 0.6688963210702341, 0.12084552675585283, 0.46117265886287623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 103.6875, 97, 115, 103.0, 111.5, 115.0, 115.0, 0.08625662423918962, 0.06410282328713213, 0.04329678208881198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 140.6875, 98, 309, 102.0, 305.5, 309.0, 309.0, 0.08626313491015156, 0.023082127895880395, 0.0491969441284458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 140.5, 98, 299, 103.5, 299.0, 299.0, 299.0, 0.08626313491015156, 0.023250610581251784, 0.05071328829678831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 154.12500000000003, 96, 320, 103.0, 315.1, 320.0, 320.0, 0.08626127461815906, 0.023250109174425687, 0.05079643417456047], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 30.434782608695652, 0.5409582689335394], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.07727975270479134], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07727975270479134], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.0819165378670788], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 23, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
