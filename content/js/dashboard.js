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

    var data = {"OkPercent": 97.90732436472346, "KoPercent": 2.092675635276532};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8121387283236994, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39285714285714285, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38ab1d92-ba86-4ded-a622-0c4ea15f7192"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fad03b7b-332e-445d-8432-b87a8a4f33fd"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/018284e8-36c3-4d5d-8edb-b564e1ca5651"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bf11bb4-5066-4881-ad8f-fad0bdbc5b38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/563372bf-1917-418a-b4fb-2e399d30c234"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae6ced6-4ede-4a83-8ddf-e0279ca38a5a"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd0b3d77-6390-4444-b3d3-ebceade262f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da2ac38d-4413-4f57-bf5e-9cd869357b3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1ff8062-dc3b-40d2-b0e1-4aee82a93469"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49be1bc2-273d-44f4-8025-23af31b9176c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b8233db-987b-4b3a-8d7f-4bdc7e97c0d5"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69b80ef9-9e09-44e5-ad4f-a24df3d6a8ca"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38ab1d92-ba86-4ded-a622-0c4ea15f7192"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16cf8542-c9d1-4cab-9697-195c79bd4daa"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c960cf2-0d8f-466b-bb19-c16a031b0f9b"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3770491803278688, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8660714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9325842696629213, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bf11bb4-5066-4881-ad8f-fad0bdbc5b38"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fad03b7b-332e-445d-8432-b87a8a4f33fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd0b3d77-6390-4444-b3d3-ebceade262f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1ff8062-dc3b-40d2-b0e1-4aee82a93469"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c960cf2-0d8f-466b-bb19-c16a031b0f9b"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cae6ced6-4ede-4a83-8ddf-e0279ca38a5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49be1bc2-273d-44f4-8025-23af31b9176c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/16cf8542-c9d1-4cab-9697-195c79bd4daa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da2ac38d-4413-4f57-bf5e-9cd869357b3d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b8233db-987b-4b3a-8d7f-4bdc7e97c0d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69b80ef9-9e09-44e5-ad4f-a24df3d6a8ca"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 28, 2.092675635276532, 302.70852017937193, 77, 3281, 94.5, 853.1000000000001, 1021.1499999999999, 1643.3699999999983, 5.195430506263251, 728.051961251961, 3.8070178051732975], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1335.6250000000002, 984, 1761, 1285.0, 1645.0, 1690.05, 1761.0, 0.26288611397990796, 316.34083562429583, 1.2926089686414421], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/38ab1d92-ba86-4ded-a622-0c4ea15f7192", 3, 0, 0.0, 482.33333333333337, 225, 793, 429.0, 793.0, 793.0, 793.0, 0.0828225940036442, 0.03844564422174369, 0.05311214524322235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fad03b7b-332e-445d-8432-b87a8a4f33fd", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.22005366930572473, 0.8397723812423874], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 520.7142857142858, 83, 1721, 467.5, 1209.0, 1721.0, 1721.0, 0.08972863497109457, 0.017675339366515837, 0.060374052241293115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 520.7142857142858, 83, 1721, 467.5, 1209.0, 1721.0, 1721.0, 0.0891299642206858, 0.017557409246597145, 0.05997123569145753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 120.8125, 77, 244, 82.0, 242.6, 244.0, 244.0, 0.10252138532021914, 0.04668026943901579, 0.05739295325665588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 84.1875, 79, 104, 83.0, 92.80000000000001, 104.0, 104.0, 0.1026239665445869, 0.0762664438871393, 0.051512420706950855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 200.93749999999997, 77, 650, 87.5, 644.4, 650.0, 650.0, 0.10225144909475514, 3.782280103465685, 0.059114119007905315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 170.25, 79, 739, 81.0, 708.2, 739.0, 739.0, 0.10222139877206546, 11.521482166358938, 0.058996920580361996], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 185.71428571428572, 80, 283, 183.0, 266.5, 283.0, 283.0, 0.08983515249517136, 0.1835554748108649, 0.05806448960799789], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 81.26666666666665, 79, 87, 81.0, 84.6, 87.0, 87.0, 0.09151586885165888, 0.06801130487901602, 0.04593667635718034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 80.33333333333334, 78, 84, 80.0, 83.4, 84.0, 84.0, 0.09151363553169423, 0.02448704700750412, 0.05219137026416936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 518.0, 407, 636, 469.5, 636.0, 636.0, 636.0, 0.06250683668526245, 18.379085407778977, 0.03564843029706374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 820.75, 563, 943, 880.0, 943.0, 943.0, 943.0, 0.06246779004575765, 56.20862728983493, 0.0355651578092546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/018284e8-36c3-4d5d-8edb-b564e1ca5651", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 167.125, 78, 289, 160.0, 289.0, 289.0, 289.0, 0.06269445075742733, 0.11093978981685385, 0.034714603104942676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 83.0625, 79, 94, 81.0, 91.9, 94.0, 94.0, 0.11186151544388048, 0.08313145825468071, 0.05614923724429157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 128.56250000000003, 78, 242, 80.5, 237.1, 242.0, 242.0, 0.11185995134092117, 0.0404318012598227, 0.063207972992813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 172.3125, 79, 930, 81.0, 444.2000000000005, 930.0, 930.0, 0.11186073338693327, 6.319045873824589, 0.0651610619778376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 126.0625, 78, 656, 81.0, 363.4000000000003, 656.0, 656.0, 0.11186151544388048, 2.0839532689780054, 0.06527075730245956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bf11bb4-5066-4881-ad8f-fad0bdbc5b38", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 101.875, 79, 236, 82.5, 236.0, 236.0, 236.0, 0.06276922111242751, 0.04664782936187241, 0.035246388808247875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/563372bf-1917-418a-b4fb-2e399d30c234", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 547.157894736842, 79, 1123, 855.0, 1049.0, 1123.0, 1123.0, 0.0953753018126327, 45.18000009725771, 0.05175639579244327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 102.33333333333334, 78, 247, 81.0, 242.8, 247.0, 247.0, 0.0915147521780511, 0.024666085547990338, 0.05380066485467458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 369.00000000000006, 78, 742, 457.0, 694.0, 742.0, 742.0, 0.0953753018126327, 14.771916554140544, 0.051849535735619665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 97.00000000000001, 79, 326, 81.0, 180.2000000000001, 326.0, 326.0, 0.09151642719868217, 0.024666537018394802, 0.053891021094536466], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 485.0, 85, 904, 452.0, 876.0, 904.0, 904.0, 0.08903756749365609, 0.017539208328828458, 0.06048045704891342], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 286.0, 160, 1011, 245.0, 530.1000000000005, 1011.0, 1011.0, 0.11179664190836867, 8.521662182427665, 0.24964550420285503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae6ced6-4ede-4a83-8ddf-e0279ca38a5a", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 470.27272727272725, 88, 1281, 387.5, 1141.3999999999999, 1273.6499999999999, 1281.0, 0.09378183786825357, 0.057606226581183105, 0.042403311458009185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 90.6842105263158, 78, 249, 82.0, 86.0, 249.0, 249.0, 0.09537338680935864, 0.07087807359562688, 0.047872969550791344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 123.42105263157897, 78, 247, 82.0, 242.0, 247.0, 247.0, 0.0953748230546046, 0.10091417081630809, 0.05017766698123626], "isController": false}, {"data": ["login", 22, 0, 0.0, 2821.8181818181815, 1586, 5510, 2564.0, 4370.099999999999, 5351.749999999998, 5510.0, 0.09305512670301457, 40.60651785072265, 0.1965112126140454], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 98.86666666666667, 80, 239, 87.0, 156.20000000000005, 239.0, 239.0, 0.09389259938531645, 0.07601266102580795, 0.033375884937749206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd0b3d77-6390-4444-b3d3-ebceade262f9", 1, 0, 0.0, 848.0, 848, 848, 848.0, 848.0, 848.0, 848.0, 1.1792452830188678, 0.21304724351415094, 0.813034345518868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da2ac38d-4413-4f57-bf5e-9cd869357b3d", 3, 0, 0.0, 542.0, 221, 986, 419.0, 986.0, 986.0, 986.0, 0.02672701031662598, 0.026805312104662974, 0.017139391381430075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1ff8062-dc3b-40d2-b0e1-4aee82a93469", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 648.0526315789475, 163, 1206, 934.0, 1130.0, 1206.0, 1206.0, 0.09533414618236921, 60.09776669570595, 0.20157076333799967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49be1bc2-273d-44f4-8025-23af31b9176c", 3, 0, 0.0, 274.0, 175, 417, 230.0, 417.0, 417.0, 417.0, 0.02257081593499605, 0.026677940319000868, 0.014474123499981192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b8233db-987b-4b3a-8d7f-4bdc7e97c0d5", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 305.06250000000006, 160, 825, 252.0, 790.0, 825.0, 825.0, 0.10216787458893395, 15.417084883145494, 0.22651036844289776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69b80ef9-9e09-44e5-ad4f-a24df3d6a8ca", 3, 0, 0.0, 304.0, 166, 559, 187.0, 559.0, 559.0, 559.0, 0.043019387403923366, 0.027657321003498908, 0.027587302469312836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 647.5, 80, 1032, 895.5, 1026.3, 1032.0, 1032.0, 0.09364099602806109, 74.69314284543773, 0.16144841649174008], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1047.5416666666665, 94, 2213, 1195.0, 1733.0, 2110.5, 2213.0, 0.09576174477898987, 0.029644993256777136, 0.04320500594520832], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 88.16666666666667, 81, 109, 86.0, 98.20000000000002, 109.0, 109.0, 0.08172605426610004, 0.06344942689604446, 0.029051058352402747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 202.0, 160, 408, 165.0, 360.0, 408.0, 408.0, 0.09146899201170804, 0.14175907258064516, 0.20571590683883162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 275.76923076923083, 162, 505, 317.0, 434.99999999999994, 505.0, 505.0, 0.0747156494801515, 0.11579466379394573, 0.16803724682889543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 96.61538461538463, 78, 244, 80.0, 195.59999999999997, 244.0, 244.0, 0.07475904584454719, 0.05555823621845744, 0.03752553668368873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 92.46153846153845, 77, 243, 81.0, 178.99999999999994, 243.0, 243.0, 0.0747599056875036, 0.02000411538903905, 0.042636508712404396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 105.23076923076923, 78, 246, 80.0, 245.2, 246.0, 246.0, 0.07468774776224017, 0.020130682014041296, 0.04390822671178573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 79.69230769230771, 78, 82, 79.0, 81.6, 82.0, 82.0, 0.074758615930486, 0.0201497832000138, 0.04402289590437798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 0.03596152117234559, 0.010605839252000359, 0.022230120021576913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38ab1d92-ba86-4ded-a622-0c4ea15f7192", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 929.2857142857141, 615, 1374, 853.5, 1299.9, 1340.7, 1374.0, 0.26575046031776167, 317.9299403485128, 0.5247533503540176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16cf8542-c9d1-4cab-9697-195c79bd4daa", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1047.5416666666665, 94, 2213, 1195.0, 1733.0, 2110.5, 2213.0, 0.09319157858768162, 0.02884934610575691, 0.042045419245614175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 123.57142857142857, 78, 234, 81.0, 234.0, 234.0, 234.0, 0.04058676871339943, 0.01093940250478344, 0.023900216341972518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 101.42857142857143, 77, 236, 79.0, 236.0, 236.0, 236.0, 0.040587004041305975, 0.010939465933008251, 0.023860719172720896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 152.05555555555554, 78, 898, 81.0, 309.40000000000094, 898.0, 898.0, 0.07993782613522815, 4.016359671644277, 0.04661305096036416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 111.49999999999999, 77, 473, 81.0, 264.20000000000033, 473.0, 473.0, 0.07993747113369098, 1.3261414821073294, 0.0466909078898284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 92.44444444444444, 79, 246, 83.0, 108.30000000000021, 246.0, 246.0, 0.0799371161353069, 0.05940639197164897, 0.04012468524760522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 123.42857142857144, 77, 236, 80.0, 236.0, 236.0, 236.0, 0.04058653338822179, 0.010860068504270282, 0.023147007322970238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 115.72222222222221, 77, 243, 81.0, 242.1, 243.0, 243.0, 0.07993782613522815, 0.028059772954368824, 0.04521656766959031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 125.28571428571426, 79, 240, 80.0, 240.0, 240.0, 240.0, 0.04058629806577299, 0.03016227815239575, 0.02037241914629621], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 109.42857142857143, 82, 245, 86.0, 245.0, 245.0, 245.0, 0.03980438985556693, 0.031330408421471626, 0.014149216706471056], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 579.0714285714287, 80, 1182, 451.5, 1094.5, 1182.0, 1182.0, 0.09003794456235127, 0.017384558492507557, 0.061273032027783135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c960cf2-0d8f-466b-bb19-c16a031b0f9b", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1594.0, 909, 3281, 1469.0, 2293.4, 3135.199999999998, 3281.0, 0.0949356163910657, 0.04913659832740705, 0.043666675117374945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 272.99999999999994, 159, 477, 166.0, 477.0, 477.0, 477.0, 0.0405672460055751, 0.06287130801840594, 0.09123668706136666], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 844.9344262295083, 423, 1679, 701.0, 1469.0000000000002, 1544.3999999999999, 1679.0, 0.25943426318542745, 72.2675646100299, 0.9446856113929918], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 153.82142857142856, 79, 420, 84.0, 325.3, 330.5, 420.0, 0.26645223605764884, 0.1980177262108113, 0.1288025945786486], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 485.05357142857144, 387, 745, 465.5, 626.0, 658.3999999999999, 745.0, 0.26633691619899175, 78.31189658042425, 0.1339487420336726], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 125.62500000000001, 78, 246, 84.5, 240.0, 243.3, 246.0, 0.266821677355416, 0.47214929625782603, 0.12976288605761443], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 773.7499999999999, 534, 1021, 739.0, 954.2, 1004.9, 1021.0, 0.26622296173044924, 239.54788893510815, 0.1336314475873544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 90.76923076923077, 81, 112, 85.0, 110.4, 112.0, 112.0, 0.0720513005259745, 0.05382738759997118, 0.025611985733842497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 10, 5.617977528089888, 143.95505617977523, 80, 781, 88.0, 274.1999999999999, 405.1999999999996, 644.3300000000014, 0.7541062781465931, 1.6209321487050978, 0.36328848192686863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 105.23076923076924, 81, 240, 86.0, 208.79999999999995, 240.0, 240.0, 0.07614807872539832, 0.05897014299730553, 0.02706826235941893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bf11bb4-5066-4881-ad8f-fad0bdbc5b38", 3, 0, 0.0, 534.0, 174, 1182, 246.0, 1182.0, 1182.0, 1182.0, 0.04078802463596688, 0.026461762076654294, 0.026156382985955323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fad03b7b-332e-445d-8432-b87a8a4f33fd", 3, 0, 0.0, 572.0, 176, 1007, 533.0, 1007.0, 1007.0, 1007.0, 0.017558234812126886, 0.024205444150181433, 0.011259675318974599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 90.93750000000001, 81, 117, 88.0, 108.60000000000001, 117.0, 117.0, 0.1003631892912477, 0.08144708037209653, 0.03567597744337321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd0b3d77-6390-4444-b3d3-ebceade262f9", 3, 0, 0.0, 470.33333333333337, 250, 881, 280.0, 881.0, 881.0, 881.0, 0.027029949183695536, 0.027109138487944644, 0.01733365881897142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1ff8062-dc3b-40d2-b0e1-4aee82a93469", 3, 0, 0.0, 606.0, 207, 1173, 438.0, 1173.0, 1173.0, 1173.0, 0.022626482034573264, 0.02674373576417172, 0.01450982083597309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 203.69230769230768, 159, 489, 164.0, 423.79999999999995, 489.0, 489.0, 0.0746530070805506, 0.115697580309408, 0.16789636260401172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c960cf2-0d8f-466b-bb19-c16a031b0f9b", 3, 0, 0.0, 302.6666666666667, 216, 409, 283.0, 409.0, 409.0, 409.0, 0.018648946023733893, 0.02570907760758888, 0.011959122287355394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 263.3888888888889, 159, 986, 169.0, 536.9000000000007, 986.0, 986.0, 0.0799083717337453, 5.427972972935478, 0.1785799505455966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae6ced6-4ede-4a83-8ddf-e0279ca38a5a", 3, 0, 0.0, 370.3333333333333, 196, 493, 422.0, 493.0, 493.0, 493.0, 0.0819224467504096, 0.03706777375750956, 0.05253490237575096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 94.9375, 78, 243, 84.5, 135.9000000000001, 243.0, 243.0, 0.11075730305967049, 0.09182905302505884, 0.03937076007199224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49be1bc2-273d-44f4-8025-23af31b9176c", 1, 0, 0.0, 838.0, 838, 838, 838.0, 838.0, 838.0, 838.0, 1.1933174224343677, 0.2155895733890215, 0.8227364260143198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 85.73684210526315, 80, 93, 85.0, 92.0, 93.0, 93.0, 0.09465073877392421, 0.07348372785670874, 0.03364537979854337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16cf8542-c9d1-4cab-9697-195c79bd4daa", 3, 0, 0.0, 1253.3333333333333, 180, 3115, 465.0, 3115.0, 3115.0, 3115.0, 0.021053961302819127, 0.02902458532468717, 0.013501400965675025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da2ac38d-4413-4f57-bf5e-9cd869357b3d", 1, 0, 0.0, 904.0, 904, 904, 904.0, 904.0, 904.0, 904.0, 1.1061946902654867, 0.19984962665929204, 0.7626693860619469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b8233db-987b-4b3a-8d7f-4bdc7e97c0d5", 3, 0, 0.0, 643.6666666666666, 186, 1359, 386.0, 1359.0, 1359.0, 1359.0, 0.0504116955133591, 0.03240986283817846, 0.032327812552512186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 96.38461538461539, 79, 269, 81.0, 196.59999999999994, 269.0, 269.0, 0.07475130814789258, 0.05555248584037721, 0.037521652722672647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 127.99999999999999, 78, 237, 82.0, 236.6, 237.0, 237.0, 0.07475130814789258, 0.02000181487551032, 0.04263160542809499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 129.23076923076925, 78, 244, 81.0, 243.6, 244.0, 244.0, 0.07475173797790798, 0.020147929376858012, 0.043945845959668564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 164.76923076923077, 78, 242, 232.0, 241.6, 242.0, 242.0, 0.07475302749761364, 0.02014827694271618, 0.044019605059629915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69b80ef9-9e09-44e5-ad4f-a24df3d6a8ca", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 35.714285714285715, 0.7473841554559043], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.14947683109118087], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.14947683109118087], "isController": false}, {"data": ["401/Unauthorized", 14, 50.0, 1.046337817638266], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 28, "401/Unauthorized", 14, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
