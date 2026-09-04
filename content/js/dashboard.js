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

    var data = {"OkPercent": 97.38058551617874, "KoPercent": 2.6194144838212634};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7662721893491125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d44c0ca5-0dc4-4829-9fb4-9c5867b95add"], "isController": false}, {"data": [0.3090909090909091, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ecbf8f7-a5e3-4eff-9056-79499a446bfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a92f7366-6a63-43a5-98c3-3be2bb709f63"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a379daaf-466f-4a7f-9ea4-e9a921afc968"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/37858a3d-569f-4d52-81a5-b4351c518f96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f625cacc-de69-4318-9e25-66ddfc76b379"], "isController": false}, {"data": [0.5434782608695652, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba8086be-9738-4d38-b54a-cf0ed4d51aef"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1865760-ed62-4385-9b4f-45c573c82948"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6fc894e-a5cf-4c6a-a5c5-9dcb1d567248"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/16e96dd9-f90d-4784-bb07-d0cf0c56a2b5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a24e7193-dc95-483a-9d20-9e9136bb52e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09b44e6a-d86b-41db-99f8-78e948252b5a"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d44c0ca5-0dc4-4829-9fb4-9c5867b95add"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d5f9ee9-7aa3-468f-9f82-771b1a3d7ab8"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37858a3d-569f-4d52-81a5-b4351c518f96"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c65e6db9-bbc9-4fb1-8c1f-19e5ca2cec19"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a92f7366-6a63-43a5-98c3-3be2bb709f63"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a379daaf-466f-4a7f-9ea4-e9a921afc968"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6fc894e-a5cf-4c6a-a5c5-9dcb1d567248"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1865760-ed62-4385-9b4f-45c573c82948"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7545454545454545, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f625cacc-de69-4318-9e25-66ddfc76b379"], "isController": false}, {"data": [0.8652694610778443, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5dad78e-961b-483b-810d-33b677f858f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16e96dd9-f90d-4784-bb07-d0cf0c56a2b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d5f9ee9-7aa3-468f-9f82-771b1a3d7ab8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a24e7193-dc95-483a-9d20-9e9136bb52e2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba8086be-9738-4d38-b54a-cf0ed4d51aef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c65e6db9-bbc9-4fb1-8c1f-19e5ca2cec19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09b44e6a-d86b-41db-99f8-78e948252b5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ecbf8f7-a5e3-4eff-9056-79499a446bfb"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 34, 2.6194144838212634, 364.1016949152548, 81, 5102, 106.5, 947.8000000000011, 1207.05, 2511.1499999999996, 5.081527590189285, 733.9130773545618, 3.711082779131677], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d44c0ca5-0dc4-4829-9fb4-9c5867b95add", 1, 0, 0.0, 1402.0, 1402, 1402, 1402.0, 1402.0, 1402.0, 1402.0, 0.7132667617689016, 0.12886167082738945, 0.49176399786019975], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1452.8727272727276, 1027, 1937, 1421.0, 1743.0, 1843.7999999999997, 1937.0, 0.24363665358411665, 293.17647274204194, 1.1979595222617454], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ecbf8f7-a5e3-4eff-9056-79499a446bfb", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a92f7366-6a63-43a5-98c3-3be2bb709f63", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 642.75, 87, 1080, 586.5, 1073.7, 1080.0, 1080.0, 0.08709284096847239, 0.01697842615071416, 0.058674974280395406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 642.75, 87, 1080, 586.5, 1073.7, 1080.0, 1080.0, 0.08624500048512813, 0.01681314279476924, 0.05810377901335719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 99.69230769230771, 83, 258, 87.0, 190.39999999999992, 258.0, 258.0, 0.06556616382462564, 0.0402696030220958, 0.03612246435470286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 90.15384615384616, 85, 108, 89.0, 103.19999999999999, 108.0, 108.0, 0.06556517178075007, 0.048725679419092574, 0.032910642866509306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 253.30769230769232, 85, 746, 87.0, 718.4, 746.0, 746.0, 0.06556649451258877, 4.462530876144892, 0.037309660151206424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 312.1538461538461, 85, 925, 251.0, 887.8, 925.0, 925.0, 0.06556682520388761, 13.62831975396049, 0.037245818223542525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a379daaf-466f-4a7f-9ea4-e9a921afc968", 3, 0, 0.0, 1149.0, 463, 2496, 488.0, 2496.0, 2496.0, 2496.0, 0.02119197812987857, 0.025048200712756867, 0.0135899078502151], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 287.75, 86, 477, 270.5, 467.2, 477.0, 477.0, 0.08760594844389935, 0.1297085630708075, 0.05662518274053308], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 88.54545454545455, 83, 102, 87.0, 100.5, 102.0, 102.0, 0.11431006084412784, 0.08495112920154423, 0.057378292259650104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 137.3181818181818, 81, 339, 86.0, 291.79999999999995, 333.8999999999999, 339.0, 0.11431184270690443, 0.04619562393482147, 0.06432070836970528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 545.625, 415, 696, 503.0, 696.0, 696.0, 696.0, 0.05634755169887868, 16.568051114272834, 0.03213571307826675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 892.875, 748, 1132, 914.0, 1132.0, 1132.0, 1132.0, 0.056326921452108034, 50.683062934773425, 0.03206894063142479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 176.0, 85, 280, 174.0, 280.0, 280.0, 280.0, 0.05651313930488838, 0.10000176603560328, 0.03129194334557785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 86.22222222222221, 84, 87, 87.0, 87.0, 87.0, 87.0, 0.05733214422219391, 0.04260718921200153, 0.028778048955280928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 85.77777777777777, 83, 92, 85.0, 92.0, 92.0, 92.0, 0.057332874670335966, 0.015341023105148491, 0.032697655085425985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37858a3d-569f-4d52-81a5-b4351c518f96", 3, 0, 0.0, 708.3333333333333, 211, 1568, 346.0, 1568.0, 1568.0, 1568.0, 0.05206525511975008, 0.033472942337729954, 0.033388200711558486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 105.88888888888889, 84, 252, 86.0, 252.0, 252.0, 252.0, 0.05733323990138683, 0.015453099817170668, 0.03370567423890124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 129.22222222222223, 85, 299, 87.0, 299.0, 299.0, 299.0, 0.05733214422219391, 0.015452804497388204, 0.033761018521467706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 108.0, 85, 253, 87.5, 253.0, 253.0, 253.0, 0.05659029334993315, 0.04205587230400306, 0.03177677605098786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 575.4444444444446, 85, 1177, 755.0, 1096.9, 1177.0, 1177.0, 0.08563395291084078, 42.81780343261322, 0.04625497152671065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 158.13636363636368, 82, 777, 86.5, 529.4999999999998, 757.6499999999997, 777.0, 0.11431124874647323, 9.378687917950504, 0.0663094548392628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 405.22222222222234, 84, 776, 496.5, 757.1, 776.0, 776.0, 0.08570693940519383, 14.010648045643707, 0.04637809318725061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 138.77272727272725, 84, 664, 86.0, 422.0999999999998, 638.6499999999996, 664.0, 0.11431243667350809, 3.0836145137824427, 0.06642177716868879], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 775.9375000000001, 89, 2918, 624.0, 1894.600000000001, 2918.0, 2918.0, 0.08539481760200679, 0.016647402796680276, 0.05811475929335788], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 217.88888888888889, 173, 386, 177.0, 386.0, 386.0, 386.0, 0.05730002292000917, 0.08880384411528763, 0.12886909451638778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f625cacc-de69-4318-9e25-66ddfc76b379", 1, 0, 0.0, 1456.0, 1456, 1456, 1456.0, 1456.0, 1456.0, 1456.0, 0.6868131868131868, 0.12408246050824176, 0.47352549793956045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 916.3913043478259, 112, 3298, 758.0, 1932.4000000000005, 3053.1999999999966, 3298.0, 0.09525545026837187, 0.05851140451055265, 0.043069603002203305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 88.0, 85, 106, 87.0, 90.70000000000002, 106.0, 106.0, 0.0856971462850287, 0.06368703937783872, 0.0430159503813523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 151.72222222222223, 85, 346, 90.0, 281.2000000000001, 346.0, 346.0, 0.08570653131383352, 0.09444829991572191, 0.04488061199224832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba8086be-9738-4d38-b54a-cf0ed4d51aef", 3, 0, 0.0, 529.0, 268, 955, 364.0, 955.0, 955.0, 955.0, 0.04395797617477692, 0.028260743146218882, 0.028189196961038582], "isController": false}, {"data": ["login", 23, 0, 0.0, 3826.0869565217395, 2490, 7280, 3615.0, 5614.4000000000015, 7014.7999999999965, 7280.0, 0.09693638865591375, 40.46716391785273, 0.20216620560418766], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1865760-ed62-4385-9b4f-45c573c82948", 1, 0, 0.0, 1138.0, 1138, 1138, 1138.0, 1138.0, 1138.0, 1138.0, 0.8787346221441125, 0.15875576669595784, 0.6058463312829526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 118.86363636363635, 86, 271, 92.5, 259.9, 269.65, 271.0, 0.11386338464086453, 0.0921804158860124, 0.04047487500905732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6fc894e-a5cf-4c6a-a5c5-9dcb1d567248", 1, 0, 0.0, 2918.0, 2918, 2918, 2918.0, 2918.0, 2918.0, 2918.0, 0.3427004797806717, 0.061913660897875256, 0.2362759167237834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 664.8888888888888, 174, 1265, 843.5, 1186.7, 1265.0, 1265.0, 0.08558997646275647, 56.945269965050755, 0.18032775314424287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16e96dd9-f90d-4784-bb07-d0cf0c56a2b5", 3, 0, 0.0, 425.0, 208, 561, 506.0, 561.0, 561.0, 561.0, 0.06500682571670025, 0.02941389575072049, 0.04168731987692041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a24e7193-dc95-483a-9d20-9e9136bb52e2", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.2831725117554859, 1.0806475313479624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09b44e6a-d86b-41db-99f8-78e948252b5a", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 403.6923076923077, 173, 1012, 338.0, 974.4, 1012.0, 1012.0, 0.06553674594932497, 18.17152990807211, 0.14352409515179318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 696.75, 86, 1217, 920.5, 1181.6000000000001, 1217.0, 1217.0, 0.08443865883263553, 67.3528590402139, 0.14558247282130668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d44c0ca5-0dc4-4829-9fb4-9c5867b95add", 3, 0, 0.0, 408.0, 316, 472, 436.0, 472.0, 472.0, 472.0, 0.04857434303201049, 0.031228622229238515, 0.031149562426126518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d5f9ee9-7aa3-468f-9f82-771b1a3d7ab8", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["register", 25, 8, 32.0, 1267.44, 102, 2526, 1376.0, 2368.8000000000006, 2521.5, 2526.0, 0.1008219001298586, 0.031554104056266685, 0.045488005722651055], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 274.9090909090909, 168, 874, 178.0, 641.2999999999997, 852.9999999999997, 874.0, 0.11425781757181364, 12.587531388440226, 0.2543108792918093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 114.33333333333334, 87, 256, 91.0, 253.6, 256.0, 256.0, 0.0827540549486925, 0.06424753289473685, 0.029416480470043034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37858a3d-569f-4d52-81a5-b4351c518f96", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c65e6db9-bbc9-4fb1-8c1f-19e5ca2cec19", 3, 0, 0.0, 700.3333333333333, 182, 1595, 324.0, 1595.0, 1595.0, 1595.0, 0.09108574204517852, 0.04121392625091086, 0.058411104111003156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a92f7366-6a63-43a5-98c3-3be2bb709f63", 3, 0, 0.0, 519.0, 433, 620, 504.0, 620.0, 620.0, 620.0, 0.07290046656298602, 0.03383986501263608, 0.04674932263316485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 270.74999999999994, 175, 502, 264.5, 396.3000000000001, 502.0, 502.0, 0.08214859654257094, 0.12731427999322273, 0.18475411898197353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 89.08333333333333, 84, 98, 88.0, 96.2, 98.0, 98.0, 0.054924684526343255, 0.04081805168412814, 0.02756961703763714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 114.16666666666666, 83, 268, 85.0, 262.3, 268.0, 268.0, 0.054925690118410635, 0.014696913176215345, 0.031324807645656066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 127.33333333333334, 84, 251, 86.5, 250.7, 251.0, 251.0, 0.05488449101495145, 0.014793085468873634, 0.03226607772558669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 85.83333333333333, 84, 88, 85.5, 87.7, 88.0, 88.0, 0.054925690118410635, 0.014804189914727865, 0.03234393666152501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 90.0, 89, 91, 90.0, 91.0, 91.0, 91.0, 0.027619731536209467, 0.008145663011655526, 0.01707352545158261], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1017.4181818181822, 668, 1569, 1001.0, 1358.6, 1473.5999999999997, 1569.0, 0.24629549189687833, 294.65503447577123, 0.48633738731981246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1267.44, 102, 2526, 1376.0, 2368.8000000000006, 2521.5, 2526.0, 0.10122236123426498, 0.03167943586753637, 0.04566868250999065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 86.16666666666667, 85, 88, 86.0, 88.0, 88.0, 88.0, 0.034064006267777155, 0.00918131418936181, 0.020059175565888303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 114.0, 84, 254, 87.0, 254.0, 254.0, 254.0, 0.03406381287612127, 0.009181262064267061, 0.02002579624162598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 142.9333333333333, 84, 256, 86.0, 256.0, 256.0, 256.0, 0.08207844510593591, 0.022122705907459288, 0.04825314839235685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 131.66666666666669, 83, 256, 86.0, 256.0, 256.0, 256.0, 0.08207844510593591, 0.022122705907459288, 0.048333303123905616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 114.66666666666667, 86, 255, 86.0, 255.0, 255.0, 255.0, 0.034064006267777155, 0.009114782927120058, 0.019427128574591657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 110.00000000000001, 85, 260, 86.0, 257.0, 260.0, 260.0, 0.08207799598365006, 0.06099741693706807, 0.041199306577730604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 87.83333333333333, 86, 90, 88.0, 90.0, 90.0, 90.0, 0.034063426099397075, 0.025314714122696463, 0.017098243178798923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 108.26666666666667, 84, 256, 85.0, 255.4, 256.0, 256.0, 0.08207889423313688, 0.02196251662097608, 0.04681061936733588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a379daaf-466f-4a7f-9ea4-e9a921afc968", 1, 0, 0.0, 726.0, 726, 726, 726.0, 726.0, 726.0, 726.0, 1.3774104683195594, 0.24884857093663912, 0.9496599517906337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 152.83333333333331, 91, 266, 101.5, 266.0, 266.0, 266.0, 0.03214400514304082, 0.02530084779813565, 0.011426189328190292], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 651.1875, 86, 1595, 520.5, 1576.1, 1595.0, 1595.0, 0.08338066923409644, 0.015969759524938638, 0.05674404675049898], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f6fc894e-a5cf-4c6a-a5c5-9dcb1d567248", 3, 0, 0.0, 398.6666666666667, 195, 543, 458.0, 543.0, 543.0, 543.0, 0.023260321767784455, 0.023328467241713512, 0.014916287071137818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 2204.086956521739, 1209, 5102, 1883.0, 3471.8000000000006, 4816.199999999996, 5102.0, 0.09533402139627037, 0.049342804042991496, 0.04384992585707358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1865760-ed62-4385-9b4f-45c573c82948", 3, 0, 0.0, 353.6666666666667, 243, 535, 283.0, 535.0, 535.0, 535.0, 0.02690317547147815, 0.026981993368367246, 0.017252361874613268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 203.66666666666669, 172, 344, 176.0, 344.0, 344.0, 344.0, 0.034046416614651305, 0.05276529606196448, 0.0765711889292402], "isController": false}, {"data": ["addBook", 56, 18, 32.142857142857146, 1035.1785714285709, 440, 4431, 770.0, 1705.7000000000003, 2207.5499999999965, 4431.0, 0.2463682677671116, 79.97005102930243, 0.8927068943520075], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 162.32727272727274, 84, 381, 89.0, 347.6, 361.2, 381.0, 0.24759718189389335, 0.18400532755981724, 0.11968809085691134], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 542.490909090909, 406, 763, 500.0, 728.4, 758.8, 763.0, 0.2472043436050484, 72.68628497660548, 0.1243264032779296], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 146.10909090909092, 84, 353, 89.0, 260.4, 264.0, 353.0, 0.24794766951731348, 0.43875114957555866, 0.12058392521447474], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 852.9818181818181, 581, 1208, 840.0, 1091.8, 1187.8, 1208.0, 0.24673635099367455, 222.01380234035037, 0.1238500824323718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 90.31249999999999, 86, 95, 90.5, 93.6, 95.0, 95.0, 0.0795560770898387, 0.059433983372779886, 0.0282796992780286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f625cacc-de69-4318-9e25-66ddfc76b379", 3, 0, 0.0, 589.3333333333334, 252, 1039, 477.0, 1039.0, 1039.0, 1039.0, 0.041783893701774426, 0.027352672602300898, 0.026795009958494664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 18, 10.778443113772456, 195.73652694610786, 85, 3811, 93.0, 378.0000000000002, 492.79999999999995, 3536.279999999997, 0.6836081410770717, 1.5564989208611006, 0.3253662625055262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 108.41666666666667, 87, 258, 91.5, 219.00000000000014, 258.0, 258.0, 0.05308184335548026, 0.041107325957906095, 0.01886893650526837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5dad78e-961b-483b-810d-33b677f858f1", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.6680668148535566, 1.2482838650627615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16e96dd9-f90d-4784-bb07-d0cf0c56a2b5", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 93.46153846153845, 86, 106, 92.0, 103.6, 106.0, 106.0, 0.06656153357773363, 0.054016244534274074, 0.02366054513896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d5f9ee9-7aa3-468f-9f82-771b1a3d7ab8", 3, 0, 0.0, 605.6666666666666, 192, 1154, 471.0, 1154.0, 1154.0, 1154.0, 0.058215124289290356, 0.026340827722042187, 0.03733196446936914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 218.91666666666669, 170, 354, 180.0, 349.5, 354.0, 354.0, 0.05486165718779145, 0.08502485347365726, 0.12338515283543332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a24e7193-dc95-483a-9d20-9e9136bb52e2", 3, 0, 0.0, 341.6666666666667, 181, 571, 273.0, 571.0, 571.0, 571.0, 0.041775166056285076, 0.026857406562878588, 0.026789413128542185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 265.8666666666666, 171, 515, 177.0, 512.6, 515.0, 515.0, 0.08203894115073289, 0.12714433555294247, 0.18450750143568145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba8086be-9738-4d38-b54a-cf0ed4d51aef", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 98.55555555555556, 90, 113, 94.0, 113.0, 113.0, 113.0, 0.05872412060629392, 0.04868826015111674, 0.020874589746768545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 96.83333333333334, 88, 122, 95.0, 112.10000000000002, 122.0, 122.0, 0.08165153845107032, 0.06339157526230556, 0.0290245703087789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c65e6db9-bbc9-4fb1-8c1f-19e5ca2cec19", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09b44e6a-d86b-41db-99f8-78e948252b5a", 3, 0, 0.0, 297.0, 205, 457, 229.0, 457.0, 457.0, 457.0, 0.018217259031206166, 0.021532183444762234, 0.011682291761548225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 98.875, 84, 252, 88.0, 140.7000000000001, 252.0, 252.0, 0.08218530732168357, 0.061077166866993354, 0.04125317183920445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 118.12499999999999, 85, 253, 88.0, 252.3, 253.0, 253.0, 0.08218615163344976, 0.021991216355044176, 0.04687178960345181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 139.1875, 84, 261, 87.0, 256.8, 261.0, 261.0, 0.08218572947539822, 0.022151622397665924, 0.04831621986737278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 147.9375, 84, 255, 87.0, 253.6, 255.0, 255.0, 0.08218615163344976, 0.022151736182453256, 0.04839672796383809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ecbf8f7-a5e3-4eff-9056-79499a446bfb", 3, 0, 0.0, 446.3333333333333, 338, 543, 458.0, 543.0, 543.0, 543.0, 0.04934454002664605, 0.03127402976298173, 0.03164347130614997], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 23.529411764705884, 0.6163328197226502], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.882352941176471, 0.15408320493066255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.15408320493066255], "isController": false}, {"data": ["401/Unauthorized", 22, 64.70588235294117, 1.694915254237288], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 34, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
