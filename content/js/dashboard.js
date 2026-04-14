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

    var data = {"OkPercent": 97.88011695906432, "KoPercent": 2.1198830409356724};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.812107904642409, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8ddc200-baba-4b6c-b841-8e6e5949853d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cc415f4-c096-40cb-8576-337da552aeff"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f21dd9e-51e9-45d6-a86b-952fb58b8223"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/103757a8-d7f0-4390-8e5a-6c351db96ccb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/162e1ea3-e944-413a-a5b2-458e7e2674bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f3b2ad8-8a13-46e3-9179-a6268f39309d"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3a1d144-f28b-40c4-97d8-607ecde54a4c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c52633f-af58-439f-8126-792d98d39a4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3b34adf-0c5d-401b-9c44-a59749213094"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c52633f-af58-439f-8126-792d98d39a4e"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a4793a2-4cd2-4d65-9334-0e1a2af460cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb4babe5-3889-4efc-a004-0b1480274be3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6b1cbfc-2697-4f74-8efc-9663302d3731"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=113d25d5-23be-4d00-a662-35b0355aeb4e"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ea3b8a8-84c4-4a57-aaaa-bb2424da71f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6cc415f4-c096-40cb-8576-337da552aeff"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f3b2ad8-8a13-46e3-9179-a6268f39309d"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=162e1ea3-e944-413a-a5b2-458e7e2674bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f21dd9e-51e9-45d6-a86b-952fb58b8223"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=103757a8-d7f0-4390-8e5a-6c351db96ccb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4032258064516129, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a4793a2-4cd2-4d65-9334-0e1a2af460cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3b34adf-0c5d-401b-9c44-a59749213094"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8ddc200-baba-4b6c-b841-8e6e5949853d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9423076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3a1d144-f28b-40c4-97d8-607ecde54a4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/113d25d5-23be-4d00-a662-35b0355aeb4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb4babe5-3889-4efc-a004-0b1480274be3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6b1cbfc-2697-4f74-8efc-9663302d3731"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1368, 29, 2.1198830409356724, 293.44371345029293, 79, 2176, 92.0, 810.1000000000001, 1004.1999999999998, 1416.269999999999, 5.302880534009374, 736.1824467519372, 3.8870876869866224], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1332.5689655172414, 977, 1745, 1335.0, 1623.9, 1686.55, 1745.0, 0.24953964238387805, 300.2805194982425, 1.226984472073072], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8ddc200-baba-4b6c-b841-8e6e5949853d", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cc415f4-c096-40cb-8576-337da552aeff", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 547.4375000000001, 83, 1591, 455.0, 1079.3000000000006, 1591.0, 1591.0, 0.10061311114604622, 0.02033264227322748, 0.06748275624901745], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 547.4375000000001, 83, 1591, 455.0, 1079.3000000000006, 1591.0, 1591.0, 0.10115186688414318, 0.020441518020837286, 0.0678441079827789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 98.1, 80, 246, 81.5, 223.30000000000032, 245.6, 246.0, 0.0916157817345616, 0.031394509580720376, 0.05186491081203648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 83.39999999999999, 81, 89, 83.0, 86.9, 88.9, 89.0, 0.09161368341975558, 0.06808399715081445, 0.045985774685307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 118.3, 80, 484, 83.0, 241.9, 471.89999999999986, 484.0, 0.09161494239710496, 1.370350183802478, 0.05355537550674515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 174.3, 80, 961, 83.5, 244.9, 925.1999999999995, 961.0, 0.09161536206391087, 4.145241734290256, 0.05346615270448549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f21dd9e-51e9-45d6-a86b-952fb58b8223", 3, 0, 0.0, 745.3333333333334, 182, 1265, 789.0, 1265.0, 1265.0, 1265.0, 0.036969943435986544, 0.023768111421247858, 0.023707938987270014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/103757a8-d7f0-4390-8e5a-6c351db96ccb", 3, 0, 0.0, 275.0, 166, 412, 247.0, 412.0, 412.0, 412.0, 0.041372462488967345, 0.03449051967260591, 0.026531168978927627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/162e1ea3-e944-413a-a5b2-458e7e2674bf", 3, 0, 0.0, 393.33333333333337, 170, 742, 268.0, 742.0, 742.0, 742.0, 0.042668183757644716, 0.03557070918077087, 0.02736208398520836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f3b2ad8-8a13-46e3-9179-a6268f39309d", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 192.43750000000003, 82, 392, 180.0, 352.1, 392.0, 392.0, 0.10135884197523044, 0.20295895560799468, 0.06550834824680879], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 97.2, 81, 243, 83.0, 171.60000000000005, 243.0, 243.0, 0.10558398502115199, 0.07846622324325846, 0.05299821123132043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 103.53333333333333, 80, 246, 82.0, 244.2, 246.0, 246.0, 0.10546594856074136, 0.02822038076722962, 0.060148548788547807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 669.4285714285714, 635, 731, 653.0, 731.0, 731.0, 731.0, 0.10663904207671918, 31.355419119999393, 0.060817578684378905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3a1d144-f28b-40c4-97d8-607ecde54a4c", 2, 0, 0.0, 218.0, 196, 240, 218.0, 240.0, 240.0, 240.0, 0.048375783082988656, 0.0427539879786179, 0.030069517512033475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 881.5714285714287, 634, 1196, 875.0, 1196.0, 1196.0, 1196.0, 0.10641047079032577, 95.74832866679081, 0.060583305147226485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 127.14285714285714, 80, 245, 81.0, 245.0, 245.0, 245.0, 0.10770722099983074, 0.19059129340985675, 0.05963866631533597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 85.66666666666667, 81, 121, 83.0, 100.60000000000001, 121.0, 121.0, 0.08035183389668897, 0.05971459530798858, 0.040332854123923956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 124.73333333333335, 80, 247, 82.0, 245.8, 247.0, 247.0, 0.08028431351559656, 0.021482326077415487, 0.045787147551863666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c52633f-af58-439f-8126-792d98d39a4e", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 104.66666666666667, 79, 249, 82.0, 247.2, 249.0, 249.0, 0.08035312520088282, 0.021657678276800447, 0.04723884899505025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 102.73333333333332, 80, 242, 82.0, 242.0, 242.0, 242.0, 0.08028388381316336, 0.021639015559016685, 0.04727654486263428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.85714285714286, 80, 243, 83.0, 243.0, 243.0, 243.0, 0.10770390657455418, 0.08004167275706615, 0.06047826785192252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 688.5, 82, 1078, 838.0, 1057.0, 1078.0, 1078.0, 0.06843623209659284, 43.990300157036714, 0.03603213447719607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 92.53333333333333, 80, 243, 82.0, 147.00000000000006, 243.0, 243.0, 0.10558621466381349, 0.02845878442110598, 0.06207314573009348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 491.1428571428572, 81, 766, 634.5, 749.5, 766.0, 766.0, 0.06843656663521844, 14.378572297122243, 0.03609914319862736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 92.53333333333333, 80, 242, 82.0, 147.20000000000005, 242.0, 242.0, 0.10546669010370892, 0.028426568817015295, 0.06210587317630515], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 433.0, 86, 780, 468.0, 680.6000000000001, 780.0, 780.0, 0.1013671899747849, 0.020485032104889698, 0.06853298116154129], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3b34adf-0c5d-401b-9c44-a59749213094", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 234.46666666666664, 165, 332, 185.0, 330.8, 332.0, 332.0, 0.08024780522252715, 0.12436842469545958, 0.1804791947533985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c52633f-af58-439f-8126-792d98d39a4e", 3, 0, 0.0, 298.3333333333333, 183, 457, 255.0, 457.0, 457.0, 457.0, 0.02698302767559205, 0.026903975836698717, 0.017303569179985788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 543.4285714285714, 114, 1699, 346.0, 1551.2000000000003, 1693.3999999999999, 1699.0, 0.09990200089436077, 0.06136558453374309, 0.04517053360750883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 94.5, 80, 244, 83.0, 165.5, 244.0, 244.0, 0.06848845969454147, 0.05089816194096295, 0.03437799637011164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 151.28571428571428, 80, 247, 84.0, 246.5, 247.0, 247.0, 0.06849114018179506, 0.09180564660528556, 0.03495264938406896], "isController": false}, {"data": ["login", 21, 0, 0.0, 2459.714285714286, 1413, 4763, 2287.0, 3431.2000000000007, 4642.999999999998, 4763.0, 0.09848197076492353, 39.405322957847375, 0.20302289090307968], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a4793a2-4cd2-4d65-9334-0e1a2af460cf", 3, 0, 0.0, 499.0, 200, 847, 450.0, 847.0, 847.0, 847.0, 0.02060368806016277, 0.028403847309501736, 0.013212651522955943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 89.19999999999999, 83, 105, 86.0, 100.2, 105.0, 105.0, 0.11638462791834454, 0.09422153959405041, 0.04137109820534903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb4babe5-3889-4efc-a004-0b1480274be3", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 784.2142857142858, 167, 1162, 921.0, 1140.0, 1162.0, 1162.0, 0.06840647125218047, 58.485948730571344, 0.14134601642243927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6b1cbfc-2697-4f74-8efc-9663302d3731", 3, 0, 0.0, 342.6666666666667, 187, 506, 335.0, 506.0, 506.0, 506.0, 0.035842722135270434, 0.02988060266550377, 0.02298507897346444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=113d25d5-23be-4d00-a662-35b0355aeb4e", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 275.15000000000003, 165, 1043, 175.0, 329.9, 1007.3499999999995, 1043.0, 0.0915788654294362, 5.612840938099556, 0.2047914491668613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 610.0833333333334, 81, 1279, 835.0, 1206.1000000000004, 1279.0, 1279.0, 0.13686287480468529, 95.52768033822238, 0.21761286197379076], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 929.2608695652174, 184, 1892, 879.0, 1570.0000000000002, 1842.3999999999992, 1892.0, 0.09279020135473695, 0.028807827458637757, 0.0418643291268442], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 96.2, 83, 242, 85.0, 113.50000000000003, 235.64999999999992, 242.0, 0.0930068173997154, 0.07220744124294311, 0.03306101712255508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 212.73333333333332, 163, 486, 167.0, 397.80000000000007, 486.0, 486.0, 0.10540369615627855, 0.16335514238282622, 0.2370553830545991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 348.1333333333333, 164, 957, 324.0, 908.4, 957.0, 957.0, 0.15527146628021324, 24.976375689017132, 0.3439121454634853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ea3b8a8-84c4-4a57-aaaa-bb2424da71f4", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 83.64285714285714, 82, 90, 82.5, 90.0, 90.0, 90.0, 0.07173564390426367, 0.05331135254994594, 0.036007930631632344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 92.78571428571429, 80, 244, 81.0, 164.0, 244.0, 244.0, 0.07173601147776183, 0.019194987446197992, 0.04091194404591105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 105.78571428571428, 81, 248, 82.5, 246.5, 248.0, 248.0, 0.07173601147776183, 0.019335096843615496, 0.04217292862266858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 94.42857142857142, 80, 252, 82.0, 169.5, 252.0, 252.0, 0.07173637905502693, 0.019335195917175228, 0.04224319977556762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 87.66666666666667, 86, 91, 86.0, 91.0, 91.0, 91.0, 0.06030150753768844, 0.01778423366834171, 0.037276224874371856], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 932.6551724137931, 637, 1368, 891.0, 1275.0, 1343.15, 1368.0, 0.24204688197710572, 289.5722199559308, 0.4779480423415115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cc415f4-c096-40cb-8576-337da552aeff", 3, 0, 0.0, 407.0, 167, 852, 202.0, 852.0, 852.0, 852.0, 0.026644403787057926, 0.02672246356377782, 0.01708641779313285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 929.2608695652174, 184, 1892, 879.0, 1570.0000000000002, 1842.3999999999992, 1892.0, 0.08915661716536227, 0.027679737802018038, 0.04022495813515368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 104.14285714285714, 80, 240, 82.0, 240.0, 240.0, 240.0, 0.035496057402195684, 0.009567296721685555, 0.020902463489769527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 105.14285714285714, 80, 246, 82.0, 246.0, 246.0, 246.0, 0.03549587740738112, 0.009567248207458192, 0.020867693553948664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f3b2ad8-8a13-46e3-9179-a6268f39309d", 3, 0, 0.0, 359.0, 167, 514, 396.0, 514.0, 514.0, 514.0, 0.03455982305370597, 0.028811102487155266, 0.022162386528580973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 121.75, 80, 723, 82.0, 225.20000000000033, 698.8999999999996, 723.0, 0.09293032548846501, 4.204738756882652, 0.054233557140533885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 125.5, 79, 634, 82.0, 241.8, 614.3999999999997, 634.0, 0.09299989770011252, 1.3910659502962046, 0.054364979261022815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=162e1ea3-e944-413a-a5b2-458e7e2674bf", 1, 0, 0.0, 780.0, 780, 780, 780.0, 780.0, 780.0, 780.0, 1.2820512820512822, 0.23162059294871795, 0.8839142628205128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 84.5, 80, 92, 84.0, 91.0, 91.95, 92.0, 0.09299687065530246, 0.0691119321959816, 0.04668006984064986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 104.14285714285715, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.03549623739883572, 0.009498016647735339, 0.0202439478915235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f21dd9e-51e9-45d6-a86b-952fb58b8223", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=103757a8-d7f0-4390-8e5a-6c351db96ccb", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.2831725117554859, 1.0806475313479624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 101.75000000000001, 80, 317, 82.0, 226.40000000000032, 313.24999999999994, 317.0, 0.09299903281005877, 0.031868516223681274, 0.05264798761717878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 84.71428571428571, 82, 93, 83.0, 93.0, 93.0, 93.0, 0.035494617494789896, 0.026378324134311633, 0.017816634172189462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 86.42857142857143, 81, 92, 87.0, 92.0, 92.0, 92.0, 0.035992122866824, 0.02832973733462905, 0.012794074925316345], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 528.7857142857143, 81, 1257, 453.5, 1054.5, 1257.0, 1257.0, 0.09879470460383323, 0.019075316848731195, 0.06723222224574477], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1317.5238095238096, 834, 2163, 1390.0, 1837.4, 2133.7, 2163.0, 0.10049000842201974, 0.05201143014030319, 0.0462214784831751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 213.85714285714283, 165, 328, 174.0, 328.0, 328.0, 328.0, 0.03547968534587625, 0.054986582660064065, 0.07979464389800098], "isController": false}, {"data": ["addBook", 62, 9, 14.516129032258064, 836.951612903226, 427, 2511, 693.5, 1415.2000000000003, 1593.8499999999992, 2511.0, 0.29690500476484644, 81.38466976501405, 1.0816914142375527], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a4793a2-4cd2-4d65-9334-0e1a2af460cf", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 156.43103448275858, 82, 388, 84.0, 328.1, 336.59999999999997, 388.0, 0.242703211633016, 0.18036830473898943, 0.11732235327963177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3b34adf-0c5d-401b-9c44-a59749213094", 3, 0, 0.0, 645.6666666666667, 227, 1257, 453.0, 1257.0, 1257.0, 1257.0, 0.04806613900727401, 0.030463793179414875, 0.030823663360784438], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 531.8965517241379, 398, 732, 481.5, 715.7, 727.05, 732.0, 0.242600679281902, 71.33265480955846, 0.12201108381853469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8ddc200-baba-4b6c-b841-8e6e5949853d", 3, 0, 0.0, 324.6666666666667, 178, 400, 396.0, 400.0, 400.0, 400.0, 0.016054628549410796, 0.022132601532146717, 0.010295448646594813], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 131.2931034482759, 80, 254, 84.0, 245.0, 246.14999999999998, 254.0, 0.24298485952961482, 0.42996930221451374, 0.11817037113842596], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 772.9310344827585, 554, 1040, 759.5, 961.2, 1000.4499999999999, 1040.0, 0.24242626897612518, 218.1355829646434, 0.1216866232946566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 108.66666666666669, 83, 249, 86.0, 244.8, 249.0, 249.0, 0.16253643525090206, 0.12142614547552742, 0.0577766234680941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 9, 4.945054945054945, 142.26923076923086, 82, 2176, 88.0, 233.2000000000001, 281.25, 795.7099999999792, 0.7439046821033701, 1.6037011940283257, 0.3579777837669371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 120.5, 81, 254, 86.5, 250.0, 254.0, 254.0, 0.07020394245282546, 0.054366920278408774, 0.024955307668777797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 88.85, 83, 110, 85.5, 108.00000000000003, 109.95, 110.0, 0.09507646524717504, 0.07715677990273678, 0.03379671225583175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3a1d144-f28b-40c4-97d8-607ecde54a4c", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/113d25d5-23be-4d00-a662-35b0355aeb4e", 3, 0, 0.0, 280.3333333333333, 171, 412, 258.0, 412.0, 412.0, 412.0, 0.019095630919645584, 0.026324868797102555, 0.01224557060927793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 190.78571428571428, 163, 335, 166.5, 332.0, 335.0, 335.0, 0.07170478117237317, 0.11112840597710569, 0.161265733437476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 243.45, 161, 806, 172.0, 393.50000000000017, 785.7499999999998, 806.0, 0.09289234241975264, 5.693343545201414, 0.20772868643260894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb4babe5-3889-4efc-a004-0b1480274be3", 3, 0, 0.0, 456.6666666666667, 392, 530, 448.0, 530.0, 530.0, 530.0, 0.022180818028568892, 0.02621697599665809, 0.014224027186289297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 97.33333333333333, 81, 249, 85.0, 162.00000000000006, 249.0, 249.0, 0.08147745790331341, 0.06755308765616513, 0.02896269011406844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 94.5, 83, 198, 86.0, 148.5, 198.0, 198.0, 0.06704178139590566, 0.05204903926732911, 0.02383125823057584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6b1cbfc-2697-4f74-8efc-9663302d3731", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 93.66666666666666, 81, 242, 83.0, 148.40000000000006, 242.0, 242.0, 0.15540498539193137, 0.11549140027662087, 0.0780060180580593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 136.6, 80, 253, 83.0, 248.8, 253.0, 253.0, 0.15540498539193137, 0.0727044417334908, 0.08688919365533246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 242.59999999999997, 79, 792, 85.0, 745.8000000000001, 792.0, 792.0, 0.15540659545591115, 18.680985711658604, 0.08958137995876544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 192.7333333333333, 80, 642, 84.0, 641.4, 642.0, 642.0, 0.15540820555325321, 6.12899204828015, 0.08973407389660175], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 31.03448275862069, 0.6578947368421053], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.21929824561403508], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.14619883040935672], "isController": false}, {"data": ["401/Unauthorized", 15, 51.724137931034484, 1.0964912280701755], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1368, 29, "401/Unauthorized", 15, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
