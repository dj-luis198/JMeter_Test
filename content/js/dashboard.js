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

    var data = {"OkPercent": 99.53775038520801, "KoPercent": 0.4622496147919877};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8375583722481654, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3728813559322034, 500, 1500, "see books"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df1553b1-cc25-46db-a184-e628d0e4558e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6987d77f-c4b1-4304-975d-faf8b60615df"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb332aab-60df-43d6-8134-3ff277f1046e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44553e05-405c-4637-9d0f-c1c8324da082"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/324fdde4-2c55-46a0-b834-6d2f44477fe3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6e88c81-7741-400f-8c78-1f9b15419ae7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=816731a3-c409-4d4f-9c2d-4af0dc7645ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d53e7c19-6088-4f2c-afb7-0017bcf38b67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31365ec3-4725-4252-801f-1dfb09af54f7"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee6436d0-9e6c-4d2f-8612-c3fd93b4e0f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c081dd0-a6e9-4115-8273-2a489e3e1d24"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92d77eda-8d80-4f56-8ba2-fd278c2438ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10365e94-7861-441e-a977-7adb8386cc2a"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ba4a6aa-8fd5-47f2-83b3-35c86e125ae9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=371bb2b2-5186-48d1-8529-6602d449007b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1522ab60-92d0-499f-abdf-81b7c7eb475b"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97d0dce0-b0e3-46f7-b76e-1bdce6fb2b30"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9012f834-9173-4ece-8d29-0401d2e725ca"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df1553b1-cc25-46db-a184-e628d0e4558e"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.43103448275862066, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44553e05-405c-4637-9d0f-c1c8324da082"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb332aab-60df-43d6-8134-3ff277f1046e"], "isController": false}, {"data": [0.8389830508474576, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9685714285714285, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ba4a6aa-8fd5-47f2-83b3-35c86e125ae9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee6436d0-9e6c-4d2f-8612-c3fd93b4e0f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/816731a3-c409-4d4f-9c2d-4af0dc7645ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=324fdde4-2c55-46a0-b834-6d2f44477fe3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6e88c81-7741-400f-8c78-1f9b15419ae7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31365ec3-4725-4252-801f-1dfb09af54f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d53e7c19-6088-4f2c-afb7-0017bcf38b67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/371bb2b2-5186-48d1-8529-6602d449007b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 6, 0.4622496147919877, 294.68644067796606, 77, 3153, 93.5, 809.2000000000003, 1000.0, 1451.3699999999997, 5.029526186084719, 698.6442954606879, 3.6764961859587872], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1340.1355932203392, 984, 1851, 1297.0, 1670.0, 1797.0, 1851.0, 0.2623166562184609, 315.6554458563416, 1.2898089492772953], "isController": true}, {"data": ["deleteBook", 11, 0, 0.0, 559.4545454545454, 355, 1365, 434.0, 1247.6000000000004, 1365.0, 1365.0, 0.07873339441136051, 0.014224294888771187, 0.0535141040139716], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 559.4545454545454, 355, 1365, 434.0, 1247.6000000000004, 1365.0, 1365.0, 0.08108805425527994, 0.014649697301979285, 0.05511453687663558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 125.2777777777778, 79, 245, 81.0, 243.2, 245.0, 245.0, 0.08050809553627337, 0.028259948899722692, 0.04553913867519456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 91.27777777777779, 79, 241, 82.0, 101.50000000000023, 241.0, 241.0, 0.0805073753701103, 0.05983018814126361, 0.040410928652574896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 130.05555555555551, 77, 641, 82.0, 277.40000000000055, 641.0, 641.0, 0.0805073753701103, 1.3355960425034217, 0.04702378489771091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 132.16666666666669, 79, 992, 82.0, 176.60000000000127, 992.0, 992.0, 0.08050845562418653, 4.045030119387331, 0.04694579432773203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df1553b1-cc25-46db-a184-e628d0e4558e", 3, 0, 0.0, 258.0, 171, 429, 174.0, 429.0, 429.0, 429.0, 0.025417482144218795, 0.025491947423938184, 0.016299622338577808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6987d77f-c4b1-4304-975d-faf8b60615df", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 262.99999999999994, 171, 499, 215.0, 481.80000000000007, 499.0, 499.0, 0.07894982379834779, 0.21526863798993748, 0.051039827494634996], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 94.24999999999999, 81, 242, 83.0, 137.0000000000001, 242.0, 242.0, 0.08005523811429888, 0.059494175981427186, 0.040183976944091426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 102.0625, 78, 245, 82.5, 242.9, 245.0, 245.0, 0.08005523811429888, 0.021421030511052628, 0.04565650298706107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 448.9056536259542, 0.870706106870229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1120.0, 1120, 1120, 1120.0, 1120.0, 1120.0, 1120.0, 0.8928571428571428, 803.3944266183034, 0.5083356584821428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 21.846064814814813, 6.8359375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb332aab-60df-43d6-8134-3ff277f1046e", 1, 0, 0.0, 2095.0, 2095, 2095, 2095.0, 2095.0, 2095.0, 2095.0, 0.47732696897374705, 0.08623582935560858, 0.32909457040572787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 92.0, 81, 241, 82.0, 131.1000000000001, 241.0, 241.0, 0.0745722581878009, 0.05541942234464502, 0.037431778035673505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 81.18749999999999, 79, 86, 81.0, 83.9, 86.0, 86.0, 0.07457364846914283, 0.019954277031782357, 0.042530283892558016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 92.06250000000001, 79, 243, 82.0, 136.6000000000001, 243.0, 243.0, 0.07457260575327654, 0.020099647644437814, 0.04384053580417233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 92.5625, 80, 241, 82.0, 135.30000000000013, 241.0, 241.0, 0.0745705204090193, 0.020099085578993484, 0.043912132623670545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44553e05-405c-4637-9d0f-c1c8324da082", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 9.174864969135802, 6.93238811728395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 690.7142857142857, 81, 1120, 861.0, 1080.5, 1120.0, 1120.0, 0.08042556613853878, 51.69695476133713, 0.04234459913599963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 111.25, 79, 243, 82.5, 240.2, 243.0, 243.0, 0.08005483756373116, 0.021577280437099413, 0.047063488489615384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 449.92857142857144, 82, 652, 550.5, 649.0, 652.0, 652.0, 0.08042510412178658, 16.897372720091916, 0.04242289602182967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 92.3125, 79, 244, 82.0, 133.40000000000012, 244.0, 244.0, 0.08005523811429888, 0.021577388397994616, 0.04714190291300998], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 623.6363636363636, 341, 2095, 406.0, 1826.200000000001, 2095.0, 2095.0, 0.08110539277129755, 0.014652829748720746, 0.055918366500523495], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 186.0, 163, 485, 165.0, 266.60000000000025, 485.0, 485.0, 0.07454064328575156, 0.11552343837352316, 0.16764365379598226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/324fdde4-2c55-46a0-b834-6d2f44477fe3", 3, 0, 0.0, 632.6666666666667, 280, 1199, 419.0, 1199.0, 1199.0, 1199.0, 0.016106604244627107, 0.022204254223956964, 0.010328779414686002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6e88c81-7741-400f-8c78-1f9b15419ae7", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.2405646637816245, 0.9180467709720372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=816731a3-c409-4d4f-9c2d-4af0dc7645ed", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d53e7c19-6088-4f2c-afb7-0017bcf38b67", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31365ec3-4725-4252-801f-1dfb09af54f7", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 497.52631578947376, 111, 975, 536.0, 949.0, 975.0, 975.0, 0.08265541392961238, 0.050771733751685734, 0.037372516259189976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 101.28571428571428, 78, 342, 83.0, 215.5, 342.0, 342.0, 0.08042187015314621, 0.059766643736859644, 0.040368009041715974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 152.35714285714283, 81, 259, 85.0, 252.5, 259.0, 259.0, 0.08042464211034261, 0.10780133390013558, 0.04104259777338634], "isController": false}, {"data": ["login", 19, 0, 0.0, 2199.1052631578946, 1447, 4637, 1981.0, 3635.0, 4637.0, 4637.0, 0.08248353585212004, 5.311942252571099, 0.13164891235690193], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 110.875, 81, 325, 85.0, 269.70000000000005, 325.0, 325.0, 0.08016273034259547, 0.06489736665430824, 0.028495345551469483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee6436d0-9e6c-4d2f-8612-c3fd93b4e0f8", 3, 0, 0.0, 419.3333333333333, 178, 581, 499.0, 581.0, 581.0, 581.0, 0.017539038977590952, 0.024178981142609926, 0.011247365490186907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c081dd0-a6e9-4115-8273-2a489e3e1d24", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 1.9712094907407407, 3.683207947530864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 792.9285714285714, 168, 1203, 942.5, 1167.0, 1203.0, 1203.0, 0.08038308280605859, 68.72567424899235, 0.16609289054694948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92d77eda-8d80-4f56-8ba2-fd278c2438ca", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10365e94-7861-441e-a977-7adb8386cc2a", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 277.66666666666674, 161, 1077, 167.5, 541.5000000000008, 1077.0, 1077.0, 0.08047749983233854, 5.4666324008561915, 0.17985184315829478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1201.0, 1201, 1201, 1201.0, 1201.0, 1201.0, 1201.0, 0.8326394671107411, 996.1262749791839, 1.877504423397169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ba4a6aa-8fd5-47f2-83b3-35c86e125ae9", 3, 0, 0.0, 396.3333333333333, 310, 466, 413.0, 466.0, 466.0, 466.0, 0.03169572107765452, 0.02642341851558373, 0.020325706550449022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=371bb2b2-5186-48d1-8529-6602d449007b", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1140.4761904761904, 488, 2269, 958.0, 1867.8, 2229.6999999999994, 2269.0, 0.08223233375363193, 0.02624826724725305, 0.0371009162052519], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 227.31249999999997, 163, 486, 170.0, 380.3000000000001, 486.0, 486.0, 0.08002200605166421, 0.12401848008202256, 0.17997136712595965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 85.875, 82, 90, 86.0, 88.6, 90.0, 90.0, 0.08912457387313116, 0.06919339475501883, 0.031681000868964596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1522ab60-92d0-499f-abdf-81b7c7eb475b", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 340.2352941176471, 160, 1034, 324.0, 978.0, 1034.0, 1034.0, 0.0844976614029594, 12.008322437173504, 0.18749374810501568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 117.57142857142857, 80, 248, 83.0, 246.0, 248.0, 248.0, 0.08131072895068504, 0.060427211651827455, 0.040814174492824325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 127.28571428571429, 80, 246, 82.0, 243.0, 246.0, 246.0, 0.08131214571136512, 0.02175735148917387, 0.04637333310101292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 116.57142857142857, 81, 246, 82.0, 246.0, 246.0, 246.0, 0.08131167345231942, 0.021916036985195467, 0.04780237052567997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 116.0, 80, 246, 82.0, 245.0, 246.0, 246.0, 0.08131261797589662, 0.021916291563815884, 0.04788233265572818], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 921.050847457627, 625, 1498, 844.0, 1331.0, 1447.0, 1498.0, 0.26009751452578495, 311.1670518993731, 0.5135909905968136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97d0dce0-b0e3-46f7-b76e-1bdce6fb2b30", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1140.4761904761904, 488, 2269, 958.0, 1867.8, 2229.6999999999994, 2269.0, 0.08137137897363567, 0.025973453556316743, 0.036712477622870776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 107.66666666666666, 81, 236, 82.0, 236.0, 236.0, 236.0, 0.044592093821765405, 0.012018962787897707, 0.02625882087355912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 81.83333333333333, 80, 83, 82.5, 83.0, 83.0, 83.0, 0.044592093821765405, 0.012018962787897707, 0.0262152739069363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9012f834-9173-4ece-8d29-0401d2e725ca", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 185.31250000000003, 80, 965, 82.0, 881.0000000000001, 965.0, 965.0, 0.08479202107081724, 9.556998538000075, 0.04893758247348924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 161.6875, 79, 639, 82.5, 525.6000000000001, 639.0, 639.0, 0.08479202107081724, 3.1364560313624485, 0.04902038718156621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 95.125, 80, 247, 84.0, 144.8000000000001, 247.0, 247.0, 0.08479112236948791, 0.06301371496404326, 0.04256116884562186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 108.16666666666666, 78, 241, 82.5, 241.0, 241.0, 241.0, 0.044539461963299484, 0.011917785720648496, 0.025401411900944238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 142.625, 79, 265, 82.5, 251.70000000000002, 265.0, 265.0, 0.08479247042862595, 0.038607899743502774, 0.047468050462118966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 83.0, 81, 86, 83.0, 86.0, 86.0, 86.0, 0.04459176241508985, 0.03313899531043298, 0.022382974493511898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 84.0, 81, 86, 84.5, 86.0, 86.0, 86.0, 0.047788963935261886, 0.03761514153498152, 0.01698748327386262], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 663.5454545454544, 357, 1488, 486.0, 1430.2000000000003, 1488.0, 1488.0, 0.07952228792851669, 0.014366819596460537, 0.05412796356071888], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df1553b1-cc25-46db-a184-e628d0e4558e", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1329.0, 847, 3153, 1174.0, 2166.0, 3153.0, 3153.0, 0.08137881409652384, 0.04211989401480238, 0.03743107562447532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 218.5, 165, 328, 166.5, 328.0, 328.0, 328.0, 0.04451170657883023, 0.06898445150449568, 0.10010787133891214], "isController": false}, {"data": ["addBook", 58, 3, 5.172413793103448, 888.6896551724137, 423, 1627, 707.5, 1490.9, 1596.35, 1627.0, 0.28102000571730357, 87.96897579260967, 1.0232966493209492], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/44553e05-405c-4637-9d0f-c1c8324da082", 3, 0, 0.0, 256.6666666666667, 185, 370, 215.0, 370.0, 370.0, 370.0, 0.0439973014988414, 0.028286025540433517, 0.028214415349191915], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 142.05084745762713, 80, 334, 84.0, 330.0, 332.0, 334.0, 0.2609257113542487, 0.19391061166072582, 0.12613108117221983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb332aab-60df-43d6-8134-3ff277f1046e", 3, 0, 0.0, 289.6666666666667, 171, 357, 341.0, 357.0, 357.0, 357.0, 0.016294163973603455, 0.02246282045189148, 0.010449056975260027], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 502.6610169491525, 385, 727, 479.0, 645.0, 703.0, 727.0, 0.2608784085532745, 76.70691409307169, 0.13120349648919566], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 133.67796610169495, 79, 340, 85.0, 248.0, 252.0, 340.0, 0.2612457436869302, 0.4622825073835132, 0.12705115269149533], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 775.4576271186439, 540, 1131, 723.0, 1000.0, 1116.0, 1131.0, 0.26051900684855894, 234.4154603059001, 0.13076832960953058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 89.05882352941175, 82, 109, 85.0, 104.19999999999999, 109.0, 109.0, 0.079881962652833, 0.059677442802165276, 0.02839554141174923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, 1.7142857142857142, 146.87999999999997, 80, 897, 91.0, 256.8, 321.59999999999997, 805.0400000000011, 0.7133190941255115, 1.5192621949541845, 0.34203491340306197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 118.64285714285715, 82, 364, 86.0, 303.0, 364.0, 364.0, 0.08443042631334544, 0.06538410943992473, 0.030012378103572008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 85.88888888888887, 83, 92, 85.0, 91.1, 92.0, 92.0, 0.08144796380090498, 0.06609693156108597, 0.028952205882352942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ba4a6aa-8fd5-47f2-83b3-35c86e125ae9", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee6436d0-9e6c-4d2f-8612-c3fd93b4e0f8", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 258.3571428571429, 165, 488, 168.5, 487.0, 488.0, 488.0, 0.08127155147391764, 0.1259550314346751, 0.18278162406682844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/816731a3-c409-4d4f-9c2d-4af0dc7645ed", 3, 0, 0.0, 814.3333333333334, 195, 1830, 418.0, 1830.0, 1830.0, 1830.0, 0.02076785689562075, 0.02082870022636964, 0.013317929063923463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=324fdde4-2c55-46a0-b834-6d2f44477fe3", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 342.0625, 165, 1046, 244.5, 971.1000000000001, 1046.0, 1046.0, 0.08475384305707112, 12.789315602785223, 0.1879027462893708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6e88c81-7741-400f-8c78-1f9b15419ae7", 3, 0, 0.0, 636.6666666666667, 197, 1488, 225.0, 1488.0, 1488.0, 1488.0, 0.01628098814744063, 0.022444656511852557, 0.010440607633612643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 107.8125, 84, 245, 87.0, 245.0, 245.0, 245.0, 0.07622931684239113, 0.06320184570233404, 0.02709713997131872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31365ec3-4725-4252-801f-1dfb09af54f7", 3, 0, 0.0, 326.3333333333333, 200, 547, 232.0, 547.0, 547.0, 547.0, 0.04250797024442083, 0.0348006331916401, 0.02725934289762664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 112.21428571428574, 85, 257, 87.0, 246.0, 257.0, 257.0, 0.07961511777350637, 0.0618105650682984, 0.02830068639605109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d53e7c19-6088-4f2c-afb7-0017bcf38b67", 3, 0, 0.0, 435.3333333333333, 165, 958, 183.0, 958.0, 958.0, 958.0, 0.021045099648546835, 0.024874595320271344, 0.013495718199100674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/371bb2b2-5186-48d1-8529-6602d449007b", 3, 0, 0.0, 368.3333333333333, 171, 486, 448.0, 486.0, 486.0, 486.0, 0.034551862345380414, 0.028804465972174235, 0.022157281517057103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 82.64705882352939, 78, 95, 82.0, 88.6, 95.0, 95.0, 0.08453295542129734, 0.06282185456602273, 0.04243158113920589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 156.8235294117647, 77, 249, 83.0, 246.6, 249.0, 249.0, 0.08453337576577294, 0.03755636076358501, 0.047375207604025776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 217.94117647058823, 80, 955, 83.0, 896.5999999999999, 955.0, 955.0, 0.08453337576577294, 8.968725059546303, 0.048841721820550556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 175.11764705882354, 77, 641, 83.0, 495.39999999999986, 641.0, 641.0, 0.08453295542129734, 2.944279729494543, 0.048924030668058976], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 50.0, 0.23112480739599384], "isController": false}, {"data": ["401/Unauthorized", 3, 50.0, 0.23112480739599384], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 6, "406/Not Acceptable", 3, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
