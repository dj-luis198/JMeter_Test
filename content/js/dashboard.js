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

    var data = {"OkPercent": 99.46112394149345, "KoPercent": 0.5388760585065435};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7453764861294584, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86725267-ff58-4aab-8790-657942f17ac0"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fe441e6-1963-4102-bda6-b451d56113b9"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88264891-51c0-477d-9950-bdacd425b2f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=618a33f1-5b11-4af0-a863-d22e2185c22c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67ad8ab2-df0b-4fdc-97fe-b7a34bc72985"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/087b737c-cc95-485c-b4bb-95eb765b4277"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f0e7719-d703-432b-8628-34c516513935"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7904f99-56f2-4a9a-9017-359c1a7bb8ca"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0509509-684a-4443-822b-8596512c0d13"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35a30702-89c4-4111-8aeb-b050e61e87c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29d2c86b-0e3e-4a84-bd57-fda713f23dab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/618a33f1-5b11-4af0-a863-d22e2185c22c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee1dce8c-5cf0-47be-8521-81f85f3d4184"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0f1bccb-8313-43c9-8b1a-dd48502ba42d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ea1fe67-66cf-446f-b36d-2d939a250f35"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd49507c-a4ba-482a-8438-3df8fa97433c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/948d5baa-2b22-42f2-be06-07e907d7ef5a"], "isController": false}, {"data": [0.7291666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/62ce3d02-402e-41ff-91b4-c8d657402964"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=701a6183-e229-4427-ae00-f0d96f82e6af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fe441e6-1963-4102-bda6-b451d56113b9"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.19090909090909092, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86725267-ff58-4aab-8790-657942f17ac0"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=087b737c-cc95-485c-b4bb-95eb765b4277"], "isController": false}, {"data": [0.3305084745762712, 500, 1500, "addBook"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67ad8ab2-df0b-4fdc-97fe-b7a34bc72985"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.976878612716763, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7904f99-56f2-4a9a-9017-359c1a7bb8ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62ce3d02-402e-41ff-91b4-c8d657402964"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f0e7719-d703-432b-8628-34c516513935"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0f1bccb-8313-43c9-8b1a-dd48502ba42d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29d2c86b-0e3e-4a84-bd57-fda713f23dab"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/35a30702-89c4-4111-8aeb-b050e61e87c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee1dce8c-5cf0-47be-8521-81f85f3d4184"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/701a6183-e229-4427-ae00-f0d96f82e6af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 7, 0.5388760585065435, 496.953040800616, 137, 2678, 223.0, 1382.0, 1686.0, 2143.0, 5.007401239707651, 713.4230446042747, 3.6508498596366454], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2477.763636363636, 1891, 3167, 2481.0, 2882.8, 3081.5999999999995, 3167.0, 0.25246613511069493, 303.8033888773175, 1.2413740139476064], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86725267-ff58-4aab-8790-657942f17ac0", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 686.642857142857, 420, 1097, 631.0, 1040.0, 1097.0, 1097.0, 0.06522883673688085, 0.011784506637034139, 0.044335224969598706], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 686.642857142857, 420, 1097, 631.0, 1040.0, 1097.0, 1097.0, 0.06644896719319562, 0.012004940362051944, 0.045164532389125156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 24, 0, 0.0, 241.75000000000003, 138, 673, 147.5, 445.5, 616.5, 673.0, 0.1144584921047486, 0.04495252953267552, 0.06447604836825112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 24, 0, 0.0, 171.5416666666667, 141, 443, 147.0, 301.5, 439.25, 443.0, 0.11445303372072506, 0.08505738150534352, 0.05745005794184832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 24, 0, 0.0, 311.45833333333337, 139, 1147, 150.0, 770.0, 1135.0, 1147.0, 0.11445303372072506, 2.832693956164488, 0.06657798543585146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 24, 0, 0.0, 285.5416666666667, 139, 1481, 146.0, 872.5, 1436.0, 1481.0, 0.11445521701186043, 8.610528941074639, 0.06646748279595019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fe441e6-1963-4102-bda6-b451d56113b9", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 294.06666666666666, 228, 580, 251.0, 477.4000000000001, 580.0, 580.0, 0.06944669503178344, 0.16233617090600158, 0.04489620323343812], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/88264891-51c0-477d-9950-bdacd425b2f6", 2, 0, 0.0, 283.5, 240, 327, 283.5, 327.0, 327.0, 327.0, 0.01306378392501388, 0.025821385414285247, 0.008120213347921226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=618a33f1-5b11-4af0-a863-d22e2185c22c", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67ad8ab2-df0b-4fdc-97fe-b7a34bc72985", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 147.6, 139, 157, 148.5, 156.70000000000002, 157.0, 157.0, 0.11136539543067783, 0.08276275969018147, 0.05590020825328946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 159.7, 137, 426, 148.5, 150.9, 412.24999999999983, 426.0, 0.11137097672346585, 0.03816413645728923, 0.06304858906893863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 998.8, 824, 1176, 983.0, 1176.0, 1176.0, 1176.0, 0.10732607809045441, 31.557430519780194, 0.06120940391096228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1336.0, 1215, 1636, 1286.0, 1636.0, 1636.0, 1636.0, 0.1070251295004067, 96.30139965457639, 0.06093325244017295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 369.6, 145, 436, 418.0, 436.0, 436.0, 436.0, 0.10972612359550561, 0.19416380464360955, 0.06075655476430829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/087b737c-cc95-485c-b4bb-95eb765b4277", 3, 0, 0.0, 906.0, 243, 1712, 763.0, 1712.0, 1712.0, 1712.0, 0.019727108334703272, 0.027195411392405066, 0.012650521946408023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 169.25, 140, 418, 147.5, 338.5000000000003, 418.0, 418.0, 0.06782995031456139, 0.050408781434942596, 0.03404745552898882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 241.75, 142, 441, 147.5, 440.1, 441.0, 441.0, 0.06783071714025696, 0.01815001610979532, 0.0386847058690528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 266.0833333333333, 140, 453, 148.5, 448.5, 453.0, 453.0, 0.06772352997612745, 0.018253607688878102, 0.03981402836487181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 266.0, 139, 456, 151.5, 453.3, 456.0, 456.0, 0.06771474037039962, 0.018251238615459277, 0.03987498871420994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f0e7719-d703-432b-8628-34c516513935", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 310.4, 145, 432, 409.0, 432.0, 432.0, 432.0, 0.10972612359550561, 0.08154451177361306, 0.061613790104898175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1118.75, 144, 2070, 1356.0, 1930.0000000000002, 2070.0, 2070.0, 0.09152218554979093, 51.47914018124253, 0.04888929247630434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 217.9, 139, 1296, 146.5, 391.00000000000057, 1252.0499999999993, 1296.0, 0.11136353512405898, 5.038770388227204, 0.0649910630763063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 852.3749999999999, 141, 1329, 1137.5, 1329.0, 1329.0, 1329.0, 0.09152270907218854, 16.82844765330054, 0.048978949776913396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 225.8, 139, 1176, 146.5, 428.7, 1138.6499999999996, 1176.0, 0.11136601554669577, 1.6657811038321046, 0.0651012665100118], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 691.6153846153845, 253, 2358, 498.0, 1779.9999999999995, 2358.0, 2358.0, 0.07288548009105078, 0.013167786930512106, 0.05025112201590025], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7904f99-56f2-4a9a-9017-359c1a7bb8ca", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 509.3333333333333, 286, 857, 575.0, 779.0000000000002, 857.0, 857.0, 0.06765861717062939, 0.10485764204080943, 0.15216581576558547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0509509-684a-4443-822b-8596512c0d13", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 577.3913043478262, 172, 1139, 553.0, 969.2, 1105.9999999999995, 1139.0, 0.09917640463973093, 0.06091988136561597, 0.04484245639472209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 168.12499999999997, 141, 443, 149.0, 257.50000000000017, 443.0, 443.0, 0.09152585033235323, 0.06801872275675862, 0.045941686592607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 218.375, 144, 436, 150.0, 431.8, 436.0, 436.0, 0.09152270907218854, 0.11040373670060634, 0.047392496567898415], "isController": false}, {"data": ["login", 23, 0, 0.0, 2624.043478260869, 1618, 4748, 2493.0, 3849.600000000001, 4622.799999999998, 4748.0, 0.09718214045777014, 25.40898281856728, 0.18165946559329696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35a30702-89c4-4111-8aeb-b050e61e87c8", 1, 0, 0.0, 2358.0, 2358, 2358, 2358.0, 2358.0, 2358.0, 2358.0, 0.42408821034775235, 0.07661749893977947, 0.29238894189991516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29d2c86b-0e3e-4a84-bd57-fda713f23dab", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/618a33f1-5b11-4af0-a863-d22e2185c22c", 3, 0, 0.0, 338.0, 258, 405, 351.0, 405.0, 405.0, 405.0, 0.03711585094274261, 0.0309419577683476, 0.023801505975652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 154.14999999999995, 143, 181, 151.5, 169.9, 180.45, 181.0, 0.11151815236725159, 0.09028178546137848, 0.03964121822429646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee1dce8c-5cf0-47be-8521-81f85f3d4184", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.1978795865279299, 0.7551512869660459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0f1bccb-8313-43c9-8b1a-dd48502ba42d", 3, 0, 0.0, 343.6666666666667, 235, 428, 368.0, 428.0, 428.0, 428.0, 0.03743262128169295, 0.031206036166150926, 0.02400464320473148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ea1fe67-66cf-446f-b36d-2d939a250f35", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1305.8750000000002, 292, 2221, 1502.0, 2076.8, 2221.0, 2221.0, 0.09144790612872436, 68.430327501386, 0.19104485662682968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd49507c-a4ba-482a-8438-3df8fa97433c", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.6666721033402923, 1.245677844467641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/948d5baa-2b22-42f2-be06-07e907d7ef5a", 2, 0, 0.0, 250.5, 248, 253, 250.5, 253.0, 253.0, 253.0, 0.018562690847665278, 0.026430081304585913, 0.011538235082557568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 0, 0.0, 554.9166666666666, 288, 1656, 437.5, 1164.5, 1602.75, 1656.0, 0.11437067535883799, 11.564738642157984, 0.25478376198509367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1647.2, 1394, 2054, 1624.0, 2054.0, 2054.0, 2054.0, 0.10669170365312394, 127.64036960673438, 0.24057728880377263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62ce3d02-402e-41ff-91b4-c8d657402964", 3, 0, 0.0, 531.6666666666666, 455, 580, 560.0, 580.0, 580.0, 580.0, 0.04435704463797259, 0.028517305716144487, 0.028445110005470703], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1093.5652173913045, 312, 2432, 1084.0, 1692.6, 2284.999999999998, 2432.0, 0.0991353671887796, 0.0313838866236218, 0.04472708949337517], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=701a6183-e229-4427-ae00-f0d96f82e6af", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 153.20000000000002, 144, 162, 153.0, 160.8, 162.0, 162.0, 0.07313220352204691, 0.05677744316408916, 0.025996212970727618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 396.09999999999997, 284, 1443, 300.0, 576.6, 1399.6999999999994, 1443.0, 0.11127245617256133, 6.81985515281881, 0.24883085682573064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fe441e6-1963-4102-bda6-b451d56113b9", 3, 0, 0.0, 341.0, 258, 442, 323.0, 442.0, 442.0, 442.0, 0.02711864406779661, 0.032053319209039546, 0.017390536723163843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 627.0, 286, 1936, 436.0, 1738.5, 1936.0, 1936.0, 0.06452207576735183, 11.112973401926446, 0.14275329235413403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 245.16666666666666, 146, 446, 150.5, 446.0, 446.0, 446.0, 0.03146468089569458, 0.023383420079710525, 0.015793794902721696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 193.83333333333334, 142, 433, 146.5, 433.0, 433.0, 433.0, 0.031465835968597096, 0.01629627116733007, 0.01750491981456134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 447.0, 140, 1660, 146.0, 1660.0, 1660.0, 1660.0, 0.03121764421250891, 4.688626965085666, 0.01790543265053408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 401.6666666666667, 144, 1096, 290.0, 1096.0, 1096.0, 1096.0, 0.031309520703420565, 1.5413721886659535, 0.017988705742687922], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1700.963636363636, 1178, 2454, 1618.0, 2182.0, 2306.6, 2454.0, 0.24083934701884677, 288.12758833877774, 0.47556363249229316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1093.5652173913045, 312, 2432, 1084.0, 1692.6, 2284.999999999998, 2432.0, 0.09779909514576318, 0.030960854849134266, 0.04412420113021737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 186.57142857142858, 142, 428, 148.0, 428.0, 428.0, 428.0, 0.03605255432347382, 0.009717290032498802, 0.02123016626665499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 183.71428571428572, 142, 414, 144.0, 414.0, 414.0, 414.0, 0.03605292569492014, 0.009717390128708946, 0.021195177019865164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 283.26666666666665, 140, 1185, 149.0, 835.8000000000002, 1185.0, 1185.0, 0.07143503459836842, 4.303128355958396, 0.041586723917878286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 326.73333333333335, 138, 699, 418.0, 640.8000000000001, 699.0, 699.0, 0.07160075419461084, 1.421545338194229, 0.04175312209121936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 149.28571428571428, 138, 168, 147.0, 168.0, 168.0, 168.0, 0.03605144025503819, 0.00964657678699264, 0.020560587020451465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 164.59999999999997, 140, 414, 146.0, 256.80000000000007, 414.0, 414.0, 0.0717916319673779, 0.053352960866381416, 0.03603603401487523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 185.0, 141, 414, 147.0, 414.0, 414.0, 414.0, 0.036051997280649346, 0.026792548760326326, 0.018096412697513442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 222.66666666666666, 139, 451, 146.0, 446.2, 451.0, 451.0, 0.07168835637715722, 0.02636040604285052, 0.040483385626006625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 169.71428571428572, 147, 277, 153.0, 277.0, 277.0, 277.0, 0.03486767716515823, 0.027444675581169465, 0.012394369617302338], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 602.9230769230769, 405, 1049, 557.0, 994.1999999999999, 1049.0, 1049.0, 0.07501399299484711, 0.013552332718795622, 0.05105932921621918], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/86725267-ff58-4aab-8790-657942f17ac0", 3, 0, 0.0, 397.0, 220, 720, 251.0, 720.0, 720.0, 720.0, 0.023725355287195427, 0.023794863164013382, 0.015214501925708003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1358.3043478260868, 841, 2104, 1325.0, 1787.4, 2044.1999999999991, 2104.0, 0.097686943078243, 0.05056062483541874, 0.044932177919777785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 378.1428571428571, 297, 842, 298.0, 842.0, 842.0, 842.0, 0.036023981679232174, 0.05583013566888815, 0.08101877910866377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=087b737c-cc95-485c-b4bb-95eb765b4277", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 0.21662357613908872, 0.8266824040767387], "isController": false}, {"data": ["addBook", 59, 2, 3.389830508474576, 1499.050847457627, 758, 4884, 1183.0, 2568.0, 2770.0, 4884.0, 0.2773938145880937, 96.65195087337914, 1.0077518568342314], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 252.65454545454554, 138, 617, 150.0, 575.8, 598.4, 617.0, 0.24269595492032955, 0.18036291181090897, 0.11731884539605773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67ad8ab2-df0b-4fdc-97fe-b7a34bc72985", 3, 0, 0.0, 372.6666666666667, 243, 557, 318.0, 557.0, 557.0, 557.0, 0.017311321026907564, 0.023865053564112476, 0.011101335424156217], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 939.8363636363633, 683, 1327, 877.0, 1186.8, 1215.3999999999996, 1327.0, 0.24241996835317503, 71.2795197963452, 0.12192019892762222], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 224.30909090909088, 139, 583, 150.0, 443.4, 451.79999999999995, 583.0, 0.24293178917054253, 0.4298753925556866, 0.11814456153020525], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1442.3818181818183, 1028, 2116, 1418.0, 1762.6, 1875.2, 2116.0, 0.2415140736837483, 217.3147880370944, 0.12122874401703773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 175.07142857142858, 146, 452, 153.5, 311.5, 452.0, 452.0, 0.06680855531271176, 0.04991068829514111, 0.023748353646315508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 2, 1.1560693641618498, 228.15028901734112, 140, 2678, 154.0, 369.19999999999993, 441.59999999999997, 1653.0999999999874, 0.7155353900495084, 1.5034515276473777, 0.3458200247542157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 153.0, 145, 158, 153.5, 158.0, 158.0, 158.0, 0.03065650914330385, 0.02374083178773433, 0.010897430984533791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7904f99-56f2-4a9a-9017-359c1a7bb8ca", 3, 0, 0.0, 391.0, 253, 511, 409.0, 511.0, 511.0, 511.0, 0.04384042086804034, 0.02727182430951337, 0.028113811559257632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 24, 0, 0.0, 176.70833333333331, 141, 456, 152.5, 309.0, 455.25, 456.0, 0.11804052724768836, 0.09579265443635648, 0.04195971867007673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62ce3d02-402e-41ff-91b4-c8d657402964", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f0e7719-d703-432b-8628-34c516513935", 3, 0, 0.0, 336.6666666666667, 224, 558, 228.0, 558.0, 558.0, 558.0, 0.056719352643121834, 0.03646507860356953, 0.03637276194887695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 745.3333333333333, 298, 1807, 589.0, 1807.0, 1807.0, 1807.0, 0.03119297534195299, 6.259893006469943, 0.06882356343351477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0f1bccb-8313-43c9-8b1a-dd48502ba42d", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 566.8000000000001, 288, 1328, 578.0, 1041.2000000000003, 1328.0, 1328.0, 0.07138675918390658, 5.796818634204728, 0.15933282975923627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29d2c86b-0e3e-4a84-bd57-fda713f23dab", 3, 0, 0.0, 356.3333333333333, 229, 596, 244.0, 596.0, 596.0, 596.0, 0.09491568323472648, 0.04201996393204037, 0.0608671536368526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35a30702-89c4-4111-8aeb-b050e61e87c8", 3, 0, 0.0, 789.6666666666666, 375, 1049, 945.0, 1049.0, 1049.0, 1049.0, 0.0694428369713664, 0.0314210753223305, 0.0445320276151015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 178.91666666666669, 143, 459, 154.5, 372.9000000000003, 459.0, 459.0, 0.07071552323594234, 0.05863035080792486, 0.02513715865027638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 170.4375, 142, 415, 152.5, 245.60000000000016, 415.0, 415.0, 0.09012916636154188, 0.06997332739982988, 0.03203810210507934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee1dce8c-5cf0-47be-8521-81f85f3d4184", 3, 0, 0.0, 348.0, 223, 442, 379.0, 442.0, 442.0, 442.0, 0.024835876251107267, 0.02507032950998816, 0.015926652413633238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/701a6183-e229-4427-ae00-f0d96f82e6af", 3, 0, 0.0, 458.66666666666663, 230, 912, 234.0, 912.0, 912.0, 912.0, 0.016633676541525973, 0.022930865935339356, 0.010666778250913465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 166.64285714285717, 139, 436, 146.5, 294.0, 436.0, 436.0, 0.06465736216435901, 0.048051027936598836, 0.03245496499265677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 229.21428571428572, 138, 448, 145.0, 447.5, 448.0, 448.0, 0.06456998694763835, 0.03113195799261135, 0.03605037496713849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 393.0714285714286, 139, 1787, 145.5, 1590.5, 1787.0, 1787.0, 0.06456403137811925, 8.314177295712486, 0.037163949981322546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 368.99999999999994, 140, 1186, 150.0, 1138.0, 1186.0, 1186.0, 0.06465706355327511, 2.7308408708844625, 0.03728064225246736], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 71.42857142857143, 0.3849114703618168], "isController": false}, {"data": ["401/Unauthorized", 2, 28.571428571428573, 0.15396458814472672], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 7, "406/Not Acceptable", 5, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
