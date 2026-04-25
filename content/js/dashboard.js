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

    var data = {"OkPercent": 99.68487394957984, "KoPercent": 0.31512605042016806};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7878649635036497, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63fb48b5-f227-49e0-aaa9-55913526d983"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=773930f6-915e-4cba-8c42-0ac98dde56e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc251f5f-1a56-4d65-9907-e4dff17e8042"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e759ef9c-91e7-4a7b-8c15-6b65fab76960"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc3663b9-e75d-4a9c-9ae3-91ffa42122d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.40789473684210525, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63fb48b5-f227-49e0-aaa9-55913526d983"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/773930f6-915e-4cba-8c42-0ac98dde56e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8647540983606558, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e05cb4c7-6534-442a-9fb4-cc7c2fe32e45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ecb75e20-c755-46fd-98a6-9b5e96e51cb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/679c489d-ce46-4bed-a0f7-269b9fb86680"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c602d20-521f-4365-933a-e64ef2ecf37c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e05cb4c7-6534-442a-9fb4-cc7c2fe32e45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d6e297e-c822-45bc-8a84-edfa5766df14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54e01c9f-2d95-4ef6-8cc1-d92d59f03a81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d6e297e-c822-45bc-8a84-edfa5766df14"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26e92623-462b-4aef-bd65-80d958920ced"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=357901f1-c1d9-46fb-aab9-9b519f9c49c6"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42646644-6866-408c-a651-ff45f396b937"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/26e92623-462b-4aef-bd65-80d958920ced"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/357901f1-c1d9-46fb-aab9-9b519f9c49c6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c480f3f5-2f29-4065-a394-e00cb09a46c1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c480f3f5-2f29-4065-a394-e00cb09a46c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.21875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 952, 3, 0.31512605042016806, 1345.728991596638, 76, 51356, 164.0, 1007.2000000000003, 1919.1499999999864, 36100.93000000002, 3.827920498273013, 570.1354615041677, 2.7933058951282472], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63fb48b5-f227-49e0-aaa9-55913526d983", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["see books", 46, 0, 0.0, 9876.760869565222, 977, 43285, 1421.0, 36052.5, 40268.149999999994, 43285.0, 0.20984731327010542, 252.5170718344989, 1.0318175999169734], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 165.99999999999997, 161, 175, 165.0, 172.0, 175.0, 175.0, 0.07588404917286387, 0.11760545511458492, 0.17066500512217334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 5, 0, 0.0, 86.0, 81, 93, 84.0, 93.0, 93.0, 93.0, 0.04653586984847921, 0.03612892239212985, 0.01654204748520159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 10, 0, 0.0, 230.20000000000002, 163, 336, 169.0, 335.0, 336.0, 336.0, 0.08811193740527967, 0.136556293615409, 0.1981658123480069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=773930f6-915e-4cba-8c42-0ac98dde56e9", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 128.85714285714286, 80, 243, 83.0, 243.0, 243.0, 243.0, 0.04448709556463657, 0.033061210668641046, 0.022330436640842968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 125.28571428571428, 79, 239, 82.0, 239.0, 239.0, 239.0, 0.04449133690111483, 0.011904908506743615, 0.025373965576417048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 103.42857142857143, 79, 232, 81.0, 232.0, 232.0, 232.0, 0.04449133690111483, 0.011991805649128605, 0.02615603985788196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 102.0, 78, 233, 81.0, 233.0, 233.0, 233.0, 0.044491902473749775, 0.01199195808862787, 0.026199821476241326], "isController": false}, {"data": ["https://demoqa.com/books", 46, 0, 0.0, 970.9347826086956, 622, 1472, 957.0, 1245.5000000000002, 1343.6999999999998, 1472.0, 0.209414549758718, 250.5326057884913, 0.4135119332149686], "isController": false}, {"data": ["deleteBook", 7, 0, 0.0, 583.1428571428572, 374, 1040, 549.0, 1040.0, 1040.0, 1040.0, 0.07436523956230745, 0.013435126288112186, 0.05054512376500585], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 7, 0, 0.0, 583.1428571428572, 374, 1040, 549.0, 1040.0, 1040.0, 1040.0, 0.07095145906607608, 0.01281837883517976, 0.04822481983397358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 16, 1, 6.25, 15604.312499999998, 139, 51356, 1525.5, 47307.9, 51356.0, 51356.0, 0.07330672909956429, 0.0236063417193177, 0.03307393441796748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 110.87499999999999, 81, 237, 86.5, 237.0, 237.0, 237.0, 0.037986704653371325, 0.01023860398860399, 0.022369123931623932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 130.57894736842107, 79, 243, 81.0, 241.0, 243.0, 243.0, 0.12515974335665256, 0.05327780604850928, 0.07027369636246261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 107.12500000000001, 80, 241, 85.5, 241.0, 241.0, 241.0, 0.037965072133637055, 0.010232773348519362, 0.022319309984813972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 116.10526315789475, 80, 250, 83.0, 241.0, 250.0, 250.0, 0.12528601478374976, 0.09310806372112652, 0.06288770663949939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 146.73684210526315, 77, 634, 81.0, 469.0, 634.0, 634.0, 0.12516056783373405, 3.904011313856592, 0.07257074248213168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 199.94736842105263, 78, 944, 81.0, 855.0, 944.0, 944.0, 0.12529097179634283, 11.897271603625526, 0.07252399899107796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 5, 0, 0.0, 82.8, 77, 94, 81.0, 94.0, 94.0, 94.0, 0.044162198924208834, 0.011903092678790663, 0.02596254272692746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 5, 0, 0.0, 113.0, 80, 235, 81.0, 235.0, 235.0, 235.0, 0.04416180886769122, 0.0119029875463699, 0.026005440182829888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 119.75, 78, 240, 81.5, 240.0, 240.0, 240.0, 0.037965252302829836, 0.01015867102634314, 0.02165205795395764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 5, 0, 0.0, 92.4, 79, 134, 82.0, 134.0, 134.0, 134.0, 0.044161418818063784, 0.03281917941459623, 0.022166962180160923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 123.75, 80, 242, 86.5, 242.0, 242.0, 242.0, 0.03799175578899379, 0.028234107573656516, 0.019070080542522273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 5, 0, 0.0, 114.2, 80, 237, 82.0, 237.0, 237.0, 237.0, 0.044162198924208834, 0.011816838384016818, 0.02518625407396285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 14120.125, 85, 35716, 3710.5, 35716.0, 35716.0, 35716.0, 0.03821315296725133, 0.030077930948832588, 0.01358358171882762], "isController": false}, {"data": ["deleteAccount", 7, 0, 0.0, 3081.142857142857, 353, 18867, 469.0, 18867.0, 18867.0, 18867.0, 0.060598190711163055, 0.010947915314028481, 0.04124701066961001], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc251f5f-1a56-4d65-9907-e4dff17e8042", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 16, 0, 0.0, 6355.187499999999, 879, 40493, 1582.5, 22463.800000000017, 40493.0, 40493.0, 0.07625438462711606, 0.039467601418331555, 0.03507403824157389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e759ef9c-91e7-4a7b-8c15-6b65fab76960", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["goToProfile", 7, 0, 0.0, 269.85714285714283, 164, 547, 186.0, 547.0, 547.0, 547.0, 0.0748398960794586, 0.13004058393828916, 0.04838282344199373], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 251.375, 164, 481, 178.0, 481.0, 481.0, 481.0, 0.03794814386141338, 0.05881221123834281, 0.08534626495394045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc3663b9-e75d-4a9c-9ae3-91ffa42122d9", 1, 0, 0.0, 37824.0, 37824, 37824, 37824.0, 37824.0, 37824.0, 37824.0, 0.02643824027072758, 0.008442680242703046, 0.01577516094278765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 82.60000000000001, 79, 85, 82.0, 85.0, 85.0, 85.0, 0.07591554142964146, 0.056417702175739416, 0.038106043256675506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 80.6, 77, 83, 81.0, 82.4, 83.0, 83.0, 0.07591630986001033, 0.020313543849260575, 0.043296020467037136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 640.5952137799565, 1.2425108932461872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 1025.999723845496, 0.6491857896237172], "isController": false}, {"data": ["addBook", 38, 2, 5.2631578947368425, 2918.9736842105267, 423, 42215, 773.0, 9912.000000000002, 19943.19999999993, 42215.0, 0.21763782774538665, 83.05835714045372, 0.7885623893913013], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 7.312112603305786, 2.2880617252066116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63fb48b5-f227-49e0-aaa9-55913526d983", 3, 0, 0.0, 438.6666666666667, 311, 547, 458.0, 547.0, 547.0, 547.0, 0.024648552719146174, 0.029133754857818932, 0.015806526320546212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 3, 0, 0.0, 82.0, 80, 85, 81.0, 85.0, 85.0, 85.0, 0.031935957759373204, 0.023733656108284186, 0.016030353797185377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/773930f6-915e-4cba-8c42-0ac98dde56e9", 3, 0, 0.0, 6402.0, 164, 18867, 175.0, 18867.0, 18867.0, 18867.0, 0.043261327257520264, 0.020081592665762985, 0.027742452700948862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 3, 0, 0.0, 81.0, 78, 83, 82.0, 83.0, 83.0, 83.0, 0.03193527783691718, 0.008545181764956356, 0.01821308814136683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 3, 0, 0.0, 80.66666666666667, 79, 84, 79.0, 84.0, 84.0, 84.0, 0.03193629773145832, 0.008607830247932125, 0.018775050033533112], "isController": false}, {"data": ["https://demoqa.com/books-0", 46, 0, 0.0, 168.41304347826085, 80, 335, 85.0, 328.6, 332.95, 335.0, 0.21010994231111801, 0.1561461582995711, 0.1015668178164096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 3, 0, 0.0, 81.33333333333333, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.031935957759373204, 0.008607738614831058, 0.0188060376258809], "isController": false}, {"data": ["https://demoqa.com/books-3", 46, 0, 0.0, 546.7608695652174, 385, 737, 489.5, 723.9, 727.0, 737.0, 0.21007348004986962, 61.76857823067895, 0.10565218967351842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 9.28955078125, 7.01904296875], "isController": false}, {"data": ["https://demoqa.com/books-1", 46, 0, 0.0, 132.86956521739134, 78, 338, 85.0, 245.0, 248.6, 338.0, 0.21035591305898654, 0.3722313617801598, 0.10230199678063995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 82.0, 78, 93, 81.0, 90.0, 93.0, 93.0, 0.07591746253473224, 0.020462128573814548, 0.04463116449795782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 547.1176470588235, 79, 1025, 704.0, 956.1999999999999, 1025.0, 1025.0, 0.11470985155195682, 60.72809916919704, 0.061638094635627534], "isController": false}, {"data": ["https://demoqa.com/books-2", 46, 0, 0.0, 799.6521739130437, 539, 1109, 794.5, 973.5, 1031.1499999999999, 1109.0, 0.2097611914435674, 188.74348878176627, 0.10529028554882192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 81.6, 76, 92, 81.0, 87.8, 92.0, 92.0, 0.07591823100399331, 0.02046233570029507, 0.04470575517129684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 403.35294117647055, 79, 807, 480.0, 724.5999999999999, 807.0, 807.0, 0.11470830353166625, 19.85276008420939, 0.06174928265138122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 10, 0, 0.0, 100.9, 82, 239, 85.0, 224.50000000000006, 239.0, 239.0, 0.0807898010955097, 0.060355661951235276, 0.028718249608169464], "isController": false}, {"data": ["deleteBooks", 7, 0, 0.0, 390.8571428571429, 172, 566, 429.0, 566.0, 566.0, 566.0, 0.07158122935648475, 0.012932155694286795, 0.04935190227117015], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 122, 2, 1.639344262295082, 2596.6147540983598, 80, 37564, 94.0, 5673.0000000000055, 28769.79999999999, 36954.95999999999, 0.514748385082423, 1.2218805179866588, 0.2418775170457662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 2044.8571428571427, 90, 13583, 96.0, 13583.0, 13583.0, 13583.0, 0.04135453836519602, 0.03202553605820356, 0.014700246059503272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 3, 0, 0.0, 165.33333333333334, 162, 170, 164.0, 170.0, 170.0, 170.0, 0.031907765286478554, 0.04945080420863424, 0.07176131196753917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 128.68421052631578, 81, 691, 87.0, 241.0, 691.0, 691.0, 0.12394968947340954, 0.10058807807851886, 0.04406024118000104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 16, 0, 0.0, 5227.187499999999, 272, 36535, 836.0, 20463.700000000015, 36535.0, 36535.0, 0.07728087250105053, 0.047470379690586706, 0.03494242574998672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 101.76470588235293, 80, 243, 83.0, 242.2, 243.0, 243.0, 0.1145830524925184, 0.08515400678399072, 0.05751532127065865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 128.17647058823528, 78, 246, 81.0, 242.0, 246.0, 246.0, 0.11470830353166625, 0.13203842981201333, 0.05975269395824618], "isController": false}, {"data": ["login", 16, 0, 0.0, 19227.8125, 2056, 61656, 9332.0, 56196.00000000001, 61656.0, 61656.0, 0.06668611678406201, 5.081678282467803, 0.10752647907723085], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 256.7142857142857, 162, 478, 170.0, 478.0, 478.0, 478.0, 0.044463923877762324, 0.06891039765039922, 0.10000040692430334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 1499.2666666666667, 83, 14844, 87.0, 9667.200000000003, 14844.0, 14844.0, 0.06919234086914806, 0.056016065020042714, 0.024595714918329972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e05cb4c7-6534-442a-9fb4-cc7c2fe32e45", 3, 0, 0.0, 4735.666666666666, 404, 13334, 469.0, 13334.0, 13334.0, 13334.0, 0.019262874020803906, 0.019319308222036726, 0.012352819603184795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 5, 0, 0.0, 208.0, 160, 323, 165.0, 323.0, 323.0, 323.0, 0.04412945817851248, 0.06839204114189386, 0.09924818572765064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecb75e20-c755-46fd-98a6-9b5e96e51cb9", 1, 0, 0.0, 20326.0, 20326, 20326, 20326.0, 20326.0, 20326.0, 20326.0, 0.049198071435599726, 0.015710712265079207, 0.02935548988979632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/679c489d-ce46-4bed-a0f7-269b9fb86680", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c602d20-521f-4365-933a-e64ef2ecf37c", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e05cb4c7-6534-442a-9fb4-cc7c2fe32e45", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d6e297e-c822-45bc-8a84-edfa5766df14", 3, 0, 0.0, 324.6666666666667, 186, 408, 380.0, 408.0, 408.0, 408.0, 0.044850423836505254, 0.028834501001659466, 0.028761502264946406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54e01c9f-2d95-4ef6-8cc1-d92d59f03a81", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 3, 0, 0.0, 85.66666666666667, 84, 88, 85.0, 88.0, 88.0, 88.0, 0.03611368588316019, 0.029941913393362305, 0.012837286778779598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d6e297e-c822-45bc-8a84-edfa5766df14", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 650.1176470588235, 160, 1183, 789.0, 1123.0, 1183.0, 1183.0, 0.11451975802648776, 80.66451905280371, 0.24032176473263006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26e92623-462b-4aef-bd65-80d958920ced", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=357901f1-c1d9-46fb-aab9-9b519f9c49c6", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 1306.0, 81, 12721, 86.0, 6492.9999999999945, 12721.0, 12721.0, 0.10545578611085264, 0.08187241206848422, 0.037486236469092146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42646644-6866-408c-a651-ff45f396b937", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26e92623-462b-4aef-bd65-80d958920ced", 3, 0, 0.0, 11969.666666666668, 181, 35192, 536.0, 35192.0, 35192.0, 35192.0, 0.03334963760060474, 0.015089842534127795, 0.021386323591533637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/357901f1-c1d9-46fb-aab9-9b519f9c49c6", 3, 0, 0.0, 375.6666666666667, 226, 548, 353.0, 548.0, 548.0, 548.0, 0.05435767349157456, 0.03494674646675122, 0.03485827369088603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c480f3f5-2f29-4065-a394-e00cb09a46c1", 3, 0, 0.0, 4053.666666666667, 181, 11475, 505.0, 11475.0, 11475.0, 11475.0, 0.03188165529554294, 0.02657842422261897, 0.020444941709706902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 342.4736842105263, 162, 1026, 172.0, 937.0, 1026.0, 1026.0, 0.12508970248401813, 15.926170689425312, 0.2779606860347223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 958.0, 958, 958, 958.0, 958.0, 958.0, 958.0, 1.04384133611691, 1248.7971359603341, 2.3537398877870563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c480f3f5-2f29-4065-a394-e00cb09a46c1", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 10, 0, 0.0, 82.8, 81, 85, 82.0, 85.0, 85.0, 85.0, 0.08830178016388811, 0.065622709672577, 0.04432335449632664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 10, 0, 0.0, 145.79999999999998, 78, 253, 85.5, 252.0, 253.0, 253.0, 0.08817642338791454, 0.02359408203934432, 0.05028811646342001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 10, 0, 0.0, 112.39999999999999, 77, 241, 81.0, 240.5, 241.0, 241.0, 0.08830255989121125, 0.023800299345678032, 0.051912247123544114], "isController": false}, {"data": ["register", 16, 1, 6.25, 15604.312499999998, 139, 51356, 1525.5, 47307.9, 51356.0, 51356.0, 0.07221748294990364, 0.023255581057354223, 0.03258249719028856], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 10, 0, 0.0, 129.2, 80, 242, 83.0, 241.7, 242.0, 242.0, 0.08817720090293454, 0.023766511180869074, 0.05192466029733352], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 33.333333333333336, 0.10504201680672269], "isController": false}, {"data": ["401/Unauthorized", 2, 66.66666666666667, 0.21008403361344538], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 952, 3, "401/Unauthorized", 2, "406/Not Acceptable", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 16, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 122, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
