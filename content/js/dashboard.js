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

    var data = {"OkPercent": 98.72712808273667, "KoPercent": 1.2728719172633254};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7235133287764867, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09259259259259259, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2f04a37-1637-46c7-afa1-4561a455b8d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/26426c76-1eb7-4f44-9e06-6fe5e9d11efd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58476baf-9a38-4c69-9c31-954a55d20e23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/b2df79de-d69f-4dc3-b52b-72e6749486f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0bc6d15-f77a-47d2-b28b-cf1c0da66435"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f874e955-5a02-4ed3-a51e-c310c0c16475"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65c80dec-9188-4de4-ba1c-4b840300d2d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1beaa495-fb80-4a5c-8908-4ebb367bda6d"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2fc0758-7932-4592-aaa1-23ccc0faefc0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2df79de-d69f-4dc3-b52b-72e6749486f5"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/8fdefe6c-88d2-4679-a73b-267174f7adc7"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a2874d3-881a-41f0-9505-180c92ef9545"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/58476baf-9a38-4c69-9c31-954a55d20e23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fdb9f3ef-4fcf-4a1e-b94b-3915ffb870d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a718cfff-355d-4acc-aa40-78c969f4d493"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f1140571-50a9-46c9-bb20-1b16a7ccc8ed"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4537037037037037, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26426c76-1eb7-4f44-9e06-6fe5e9d11efd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65c80dec-9188-4de4-ba1c-4b840300d2d9"], "isController": false}, {"data": [0.14912280701754385, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1beaa495-fb80-4a5c-8908-4ebb367bda6d"], "isController": false}, {"data": [0.9629629629629629, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5092592592592593, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7648809523809523, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71ae56d1-526b-4b19-8d6e-6f4f1ad9a36d"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f874e955-5a02-4ed3-a51e-c310c0c16475"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44bb533f-4a66-411d-ad43-a649fc49ce7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b29bf3a0-7634-45bc-9bfb-31f5bcc3768c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f2fc0758-7932-4592-aaa1-23ccc0faefc0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f0bc6d15-f77a-47d2-b28b-cf1c0da66435"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fdefe6c-88d2-4679-a73b-267174f7adc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1a2874d3-881a-41f0-9505-180c92ef9545"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2f04a37-1637-46c7-afa1-4561a455b8d7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1140571-50a9-46c9-bb20-1b16a7ccc8ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1257, 16, 1.2728719172633254, 497.11296738265776, 99, 6942, 222.0, 1062.6000000000001, 1550.2999999999997, 4636.880000000005, 4.860469342695956, 687.7851669590069, 3.544919193972167], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2028.592592592592, 1290, 4007, 1746.0, 3476.5, 3916.5, 4007.0, 0.23170794500798103, 278.8215753619364, 1.1393061553859225], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 1052.3076923076924, 103, 3587, 871.0, 2866.1999999999994, 3587.0, 3587.0, 0.06915629322268327, 0.013101875864453666, 0.04675011138152995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 1052.3076923076924, 103, 3587, 871.0, 2866.1999999999994, 3587.0, 3587.0, 0.06896002970585895, 0.01306469312786781, 0.04661743594674164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 199.75, 104, 344, 113.0, 342.5, 344.0, 344.0, 0.12069641833378594, 0.03229572131197007, 0.0688346760809873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 219.3333333333333, 105, 1206, 111.5, 941.4000000000009, 1206.0, 1206.0, 0.12095067228415345, 0.08988619297679763, 0.06071156792388171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2f04a37-1637-46c7-afa1-4561a455b8d7", 3, 0, 0.0, 2987.3333333333335, 2524, 3412, 3026.0, 3412.0, 3412.0, 3412.0, 0.06189778612251635, 0.028007136298925043, 0.03969356727257722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 227.08333333333331, 104, 445, 208.0, 412.3000000000001, 445.0, 445.0, 0.12095676803515809, 0.03260162888447621, 0.07122747180195345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 108.25000000000001, 102, 112, 108.5, 112.0, 112.0, 112.0, 0.12095189138520153, 0.032600314474917604, 0.07110648302137824], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 872.6153846153846, 101, 4674, 311.0, 4169.2, 4674.0, 4674.0, 0.06732297940434699, 0.13270900710257433, 0.04351819694819756], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/26426c76-1eb7-4f44-9e06-6fe5e9d11efd", 3, 0, 0.0, 1393.6666666666667, 203, 3534, 444.0, 3534.0, 3534.0, 3534.0, 0.01523275651961979, 0.020999584590035748, 0.00976840180457389], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58476baf-9a38-4c69-9c31-954a55d20e23", 1, 0, 0.0, 1079.0, 1079, 1079, 1079.0, 1079.0, 1079.0, 1079.0, 0.9267840593141798, 0.1674365732159407, 0.6389741658943466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 117.6875, 103, 230, 111.0, 150.20000000000007, 230.0, 230.0, 0.09916699722332407, 0.07369734852241175, 0.04977718415311384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 131.75, 101, 408, 109.5, 250.50000000000017, 408.0, 408.0, 0.09916945580761126, 0.04515406129911987, 0.05551649466964175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 648.75, 505, 1024, 533.0, 1024.0, 1024.0, 1024.0, 0.02946137245803596, 8.662621712294968, 0.016802188979973633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2df79de-d69f-4dc3-b52b-72e6749486f5", 3, 0, 0.0, 3455.3333333333335, 348, 5344, 4674.0, 5344.0, 5344.0, 5344.0, 0.0686027898467871, 0.031040975874685572, 0.043993325520237825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 814.75, 763, 943, 776.5, 943.0, 943.0, 943.0, 0.0295159386068477, 26.55849344192739, 0.016804484577922076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 220.5, 106, 335, 220.5, 335.0, 335.0, 335.0, 0.02966192817364093, 0.052487708838513045, 0.01642413405708438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0bc6d15-f77a-47d2-b28b-cf1c0da66435", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 142.61538461538458, 103, 328, 111.0, 324.0, 328.0, 328.0, 0.06647916133981079, 0.049404923612886724, 0.03336942278189721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 143.38461538461536, 101, 337, 111.0, 334.6, 337.0, 337.0, 0.06647916133981079, 0.025469029659933518, 0.03748441894656098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 236.61538461538458, 105, 906, 110.0, 676.3999999999999, 906.0, 906.0, 0.06648154114440302, 4.618094909112062, 0.03864439343264653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 241.69230769230768, 106, 782, 112.0, 605.5999999999999, 782.0, 782.0, 0.06647916133981079, 1.5201614836358988, 0.03870793115571465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f874e955-5a02-4ed3-a51e-c310c0c16475", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 0.20437111142533937, 0.7799243495475113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65c80dec-9188-4de4-ba1c-4b840300d2d9", 1, 0, 0.0, 939.0, 939, 939, 939.0, 939.0, 939.0, 939.0, 1.0649627263045793, 0.19240049254526093, 0.734241879659212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 111.25, 107, 113, 112.5, 113.0, 113.0, 113.0, 0.02966038855109002, 0.022042534850956544, 0.01665500333679371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 700.2857142857142, 103, 1128, 908.0, 1067.5, 1128.0, 1128.0, 0.10749468285229463, 69.09678132606209, 0.05659667035219865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 238.87500000000003, 105, 1010, 110.0, 982.0, 1010.0, 1010.0, 0.09916884115011064, 11.177425162388976, 0.057235141718472056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 563.5714285714286, 107, 878, 721.5, 870.0, 878.0, 878.0, 0.10749468285229463, 22.584710848900865, 0.056701645628421594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1beaa495-fb80-4a5c-8908-4ebb367bda6d", 3, 0, 0.0, 1915.6666666666667, 408, 4813, 526.0, 4813.0, 4813.0, 4813.0, 0.11409013120365089, 0.05162281327248526, 0.07316326773150789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 240.06250000000003, 103, 826, 115.0, 779.8000000000001, 826.0, 826.0, 0.09917191451380969, 3.6683681493900924, 0.05733376307829622], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 780.7692307692307, 104, 1630, 884.0, 1409.6, 1630.0, 1630.0, 0.06874051513084493, 0.013023105405648355, 0.04701640551880582], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 415.6153846153846, 216, 1023, 408.0, 878.1999999999998, 1023.0, 1023.0, 0.06644110762437264, 6.2094086358107345, 0.14811994823982172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2fc0758-7932-4592-aaa1-23ccc0faefc0", 1, 0, 0.0, 964.0, 964, 964, 964.0, 964.0, 964.0, 964.0, 1.037344398340249, 0.18741085321576764, 0.7152003371369294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2df79de-d69f-4dc3-b52b-72e6749486f5", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 895.6666666666666, 163, 2404, 630.0, 2277.6, 2393.3999999999996, 2404.0, 0.08870753126940477, 0.054489294109819925, 0.04010897165794376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 110.35714285714285, 105, 116, 110.0, 116.0, 116.0, 116.0, 0.10748808033966233, 0.07988127845554983, 0.05395397782674456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 172.71428571428572, 99, 345, 113.0, 341.5, 345.0, 345.0, 0.10748808033966233, 0.144077214830284, 0.054853710642087716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fdefe6c-88d2-4679-a73b-267174f7adc7", 3, 0, 0.0, 1393.6666666666667, 501, 2868, 812.0, 2868.0, 2868.0, 2868.0, 0.044908835064818416, 0.02939832920421544, 0.028798959986227956], "isController": false}, {"data": ["login", 21, 0, 0.0, 4869.666666666667, 1847, 11996, 4075.0, 10201.0, 11837.299999999997, 11996.0, 0.08806212992938256, 20.18966020860241, 0.16068144494229836], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a2874d3-881a-41f0-9505-180c92ef9545", 1, 0, 0.0, 1065.0, 1065, 1065, 1065.0, 1065.0, 1065.0, 1065.0, 0.9389671361502347, 0.16963761737089203, 0.6473738262910799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 405.24999999999994, 111, 1509, 184.5, 1082.7000000000005, 1509.0, 1509.0, 0.09850882269643274, 0.07974981837435816, 0.03501680806787258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58476baf-9a38-4c69-9c31-954a55d20e23", 3, 0, 0.0, 1332.0, 323, 2742, 931.0, 2742.0, 2742.0, 2742.0, 0.02000733602320851, 0.023647993847744173, 0.012830225249258061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdb9f3ef-4fcf-4a1e-b94b-3915ffb870d2", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.7224794966063348, 1.349954044117647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a718cfff-355d-4acc-aa40-78c969f4d493", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.5260888591433278, 0.9829978377265239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 823.2857142857142, 220, 1243, 1019.5, 1183.0, 1243.0, 1243.0, 0.10739408258604952, 91.81945352712852, 0.22190482103543238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 469.83333333333337, 222, 1550, 433.5, 1315.7000000000007, 1550.0, 1550.0, 0.12055818439374302, 0.1868416392899123, 0.2711381822839748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 693.5, 101, 1137, 885.5, 1137.0, 1137.0, 1137.0, 0.0441549839938183, 35.22041271111602, 0.07612853929793575], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1499.5909090909092, 330, 4979, 1039.0, 2979.2, 4682.899999999996, 4979.0, 0.08848560902231446, 0.02812308951525975, 0.039922218133114536], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 177.6, 106, 780, 114.5, 499.6000000000004, 766.9499999999998, 780.0, 0.09225475227292647, 0.07162356255564115, 0.03279368147201683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 402.75, 214, 1117, 231.0, 1093.9, 1117.0, 1117.0, 0.09909882010467314, 14.953965985104208, 0.21970614877210368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1140571-50a9-46c9-bb20-1b16a7ccc8ed", 3, 0, 0.0, 780.0, 216, 1673, 451.0, 1673.0, 1673.0, 1673.0, 0.017481906227054998, 0.02410021903371677, 0.011210727626073681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 422.5555555555556, 215, 1082, 229.0, 972.2000000000002, 1082.0, 1082.0, 0.10792531568154837, 21.65875237772961, 0.23812428049789544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 176.0, 108, 339, 111.5, 338.3, 339.0, 339.0, 0.05254446575414445, 0.03904915863174211, 0.026374858786748286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 175.0, 105, 338, 111.0, 337.2, 338.0, 338.0, 0.052543085329970575, 0.014059380254308534, 0.029965978352248845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 194.5, 104, 334, 113.5, 333.9, 334.0, 334.0, 0.05254363749093622, 0.014162152292478903, 0.030889911884319925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 174.39999999999998, 104, 338, 110.5, 336.9, 338.0, 338.0, 0.05254557014570887, 0.014162673203335592, 0.030942362107287544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1085.7962962962963, 817, 2638, 899.0, 1499.5, 1592.0, 2638.0, 0.22963577215028386, 274.72421780315113, 0.4534409485233144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1499.5909090909092, 330, 4979, 1039.0, 2979.2, 4682.899999999996, 4979.0, 0.08779350966526729, 0.027903121857391418, 0.03960996236850927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 190.125, 104, 330, 113.5, 330.0, 330.0, 330.0, 0.04276748388200451, 0.011527173390071529, 0.02518436795004758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 140.375, 108, 328, 113.0, 328.0, 328.0, 328.0, 0.04281646721329023, 0.011540375928582133, 0.025171399670313205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 150.75000000000003, 101, 338, 111.5, 324.20000000000005, 337.34999999999997, 338.0, 0.08999401539797604, 0.024256199462735727, 0.05290663795857575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 139.95000000000002, 102, 334, 107.5, 325.0, 333.6, 334.0, 0.08999401539797604, 0.024256199462735727, 0.05299452273923784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 110.54999999999998, 105, 114, 111.0, 113.0, 113.95, 114.0, 0.08999158578672893, 0.06687851248408273, 0.045171557709354174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 166.25, 102, 336, 111.0, 336.0, 336.0, 336.0, 0.042766569372721344, 0.011443398445435203, 0.02439030909538014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26426c76-1eb7-4f44-9e06-6fe5e9d11efd", 1, 0, 0.0, 1630.0, 1630, 1630, 1630.0, 1630.0, 1630.0, 1630.0, 0.6134969325153374, 0.11083684815950921, 0.4229773773006135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 129.5, 105, 318, 108.5, 294.90000000000043, 317.85, 318.0, 0.08999482529754539, 0.02408064661281976, 0.051325173802506355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 136.25, 108, 306, 113.5, 306.0, 306.0, 306.0, 0.04281600890572985, 0.03181931911841838, 0.02149162947025893], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 1621.3846153846155, 101, 5344, 931.0, 5131.599999999999, 5344.0, 5344.0, 0.06764914033553975, 0.012674050180050788, 0.04604125686898963], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 205.5, 109, 653, 119.0, 653.0, 653.0, 653.0, 0.043834655678779644, 0.03450266843466445, 0.015581850260816201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2700.666666666667, 810, 6942, 1168.0, 6517.200000000001, 6920.2, 6942.0, 0.09131506742095812, 0.047262681379988083, 0.0420013640188196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 359.12499999999994, 221, 637, 335.0, 637.0, 637.0, 637.0, 0.04274029394637162, 0.0662391079032146, 0.09612392281102913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65c80dec-9188-4de4-ba1c-4b840300d2d9", 3, 0, 0.0, 491.66666666666663, 217, 821, 437.0, 821.0, 821.0, 821.0, 0.037531902116799284, 0.03128880251338638, 0.02406830962568183], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 2199.6140350877195, 559, 7106, 1618.0, 4970.6, 6554.899999999999, 7106.0, 0.25810190950131995, 87.67081298280905, 0.9368133555285882], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1beaa495-fb80-4a5c-8908-4ebb367bda6d", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.5267173833819242, 2.0100674198250728], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 223.85185185185185, 104, 1663, 114.0, 448.0, 537.75, 1663.0, 0.23059086774759696, 0.17136684605070437, 0.11146726517095751], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 647.9259259259258, 494, 1072, 562.5, 817.0, 944.75, 1072.0, 0.2303351376252447, 67.72617830818841, 0.11584237878613382], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 159.33333333333331, 102, 421, 112.0, 335.5, 360.75, 421.0, 0.23095182088403224, 0.4086764642986977, 0.11231836601586724], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 852.0370370370372, 701, 1404, 780.5, 1024.5, 1102.0, 1404.0, 0.2301005624680416, 207.04489058238877, 0.11549969639509118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 362.11111111111103, 108, 2743, 115.5, 1672.0000000000016, 2743.0, 2743.0, 0.11210762331838565, 0.08375227718609865, 0.039850756726457395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, 4.761904761904762, 559.6964285714286, 103, 5509, 128.0, 1652.2999999999997, 2927.549999999998, 5052.910000000002, 0.695914402528489, 1.5015565194856033, 0.3345876124647383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 391.29999999999995, 111, 1542, 124.5, 1462.6000000000004, 1542.0, 1542.0, 0.05357707329879398, 0.04149083899017932, 0.019044975274180673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71ae56d1-526b-4b19-8d6e-6f4f1ad9a36d", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 233.08333333333334, 110, 1289, 115.0, 998.900000000001, 1289.0, 1289.0, 0.12351270122277574, 0.10023345187121742, 0.04390490551278356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f874e955-5a02-4ed3-a51e-c310c0c16475", 3, 0, 0.0, 622.3333333333333, 247, 1161, 459.0, 1161.0, 1161.0, 1161.0, 0.030825823820141592, 0.02569822096464278, 0.019767862280494448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 398.2, 217, 677, 329.0, 675.6, 677.0, 677.0, 0.05251301009825184, 0.08138490920500555, 0.11810299048464257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44bb533f-4a66-411d-ad43-a649fc49ce7e", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.7257634943181818, 1.3560901988636365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b29bf3a0-7634-45bc-9bfb-31f5bcc3768c", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2fc0758-7932-4592-aaa1-23ccc0faefc0", 3, 0, 0.0, 1143.0, 406, 2004, 1019.0, 2004.0, 2004.0, 2004.0, 0.030450360836775915, 0.02538521292414815, 0.019527086864729346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0bc6d15-f77a-47d2-b28b-cf1c0da66435", 3, 0, 0.0, 1068.6666666666667, 207, 2523, 476.0, 2523.0, 2523.0, 2523.0, 0.04283939510774108, 0.026649115901983465, 0.027471877722086566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 296.55000000000007, 216, 449, 226.0, 443.1, 448.75, 449.0, 0.08994747067712457, 0.13940101168417643, 0.20229396969669713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fdefe6c-88d2-4679-a73b-267174f7adc7", 1, 0, 0.0, 897.0, 897, 897, 897.0, 897.0, 897.0, 897.0, 1.1148272017837235, 0.20140921125975472, 0.7686210981047937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 111.61538461538461, 103, 117, 113.0, 116.2, 117.0, 117.0, 0.06443809977000556, 0.0534257292038425, 0.022905730777619163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a2874d3-881a-41f0-9505-180c92ef9545", 3, 0, 0.0, 1094.6666666666667, 311, 1777, 1196.0, 1777.0, 1777.0, 1777.0, 0.016586315184218672, 0.022865574480848333, 0.01063640654717148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 464.1428571428571, 103, 2024, 171.5, 1759.5, 2024.0, 2024.0, 0.10551305724083355, 0.08191687549459245, 0.03750659456607755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2f04a37-1637-46c7-afa1-4561a455b8d7", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1140571-50a9-46c9-bb20-1b16a7ccc8ed", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 135.55555555555557, 103, 338, 112.5, 331.7, 338.0, 338.0, 0.10813213747199077, 0.08035991857049314, 0.05427726431699537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 155.88888888888886, 100, 338, 111.5, 327.20000000000005, 338.0, 338.0, 0.10813408626697105, 0.056003037516520485, 0.06015662546557731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 251.44444444444446, 100, 966, 111.5, 803.1000000000003, 966.0, 966.0, 0.10813408626697105, 16.24082807994413, 0.06202222005286555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 256.77777777777777, 104, 854, 113.5, 737.0000000000002, 854.0, 854.0, 0.10799654411058847, 5.316685334819286, 0.06204879568853797], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 25.0, 0.31821797931583135], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07955449482895784], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07955449482895784], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.7955449482895783], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1257, 16, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
