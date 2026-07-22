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

    var data = {"OkPercent": 98.87976101568334, "KoPercent": 1.1202389843166543};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7406330749354005, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/102a1c02-8616-4252-8063-00d3ed9eb76b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=167973a2-ef7c-431e-b673-b3a8202eabff"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/508ce761-a855-4db1-bb19-dc1db0057855"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d8c216a-fd27-488a-ac32-70ce2247c374"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bed3d7e2-d326-4206-a451-dd91da80b6ac"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36439a24-1326-4a49-b7a8-93f1c9e3277e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d929af02-342c-46bb-b902-a81a066944d0"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37d5732b-f352-465e-9381-60d7838523cf"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28a6ee3c-01a7-48da-9344-d610bdcfa233"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18c15004-3965-4fac-98a2-cebed9d81f1d"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3f8f124-d43a-457d-95f2-58b2c7de8c31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1d8c216a-fd27-488a-ac32-70ce2247c374"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=508ce761-a855-4db1-bb19-dc1db0057855"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37d5732b-f352-465e-9381-60d7838523cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0103690-c5e3-460f-9627-d91c7bbeeea0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e64d2cb-3e2f-4605-8d24-3108fe27972c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d929af02-342c-46bb-b902-a81a066944d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/167973a2-ef7c-431e-b673-b3a8202eabff"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/9fe316af-2709-48f2-9137-df7850228b89"], "isController": false}, {"data": [0.29365079365079366, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36981d7d-e879-4228-84a1-b4b8b3fbc2d7"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=102a1c02-8616-4252-8063-00d3ed9eb76b"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bead2039-4d9a-4281-b83e-351f9b71b34b"], "isController": false}, {"data": [0.9262295081967213, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36439a24-1326-4a49-b7a8-93f1c9e3277e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bead2039-4d9a-4281-b83e-351f9b71b34b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fe316af-2709-48f2-9137-df7850228b89"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28a6ee3c-01a7-48da-9344-d610bdcfa233"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3f8f124-d43a-457d-95f2-58b2c7de8c31"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36981d7d-e879-4228-84a1-b4b8b3fbc2d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1339, 15, 1.1202389843166543, 470.3637042569084, 139, 2569, 155.0, 1266.0, 1602.0, 2102.0, 5.398714630153777, 755.9795839053593, 3.9517388137443454], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2294.701754385965, 1691, 3001, 2283.0, 2709.8, 2851.2, 3001.0, 0.24677354414432356, 296.9509498346184, 1.2133835886393254], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/102a1c02-8616-4252-8063-00d3ed9eb76b", 2, 0, 0.0, 801.0, 247, 1355, 801.0, 1355.0, 1355.0, 1355.0, 0.026574188490718964, 0.030596648662653967, 0.016518038060881465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=167973a2-ef7c-431e-b673-b3a8202eabff", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 700.3333333333333, 458, 1120, 594.5, 1117.3, 1120.0, 1120.0, 0.0753811459190532, 0.01361866405764145, 0.05123562261685648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 700.3333333333333, 458, 1120, 594.5, 1117.3, 1120.0, 1120.0, 0.07488206075431196, 0.013528497304245811, 0.05089640066894641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 272.07692307692304, 139, 437, 144.0, 431.4, 437.0, 437.0, 0.11852338101620123, 0.059101427522952506, 0.06606396387772033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 165.53846153846155, 140, 439, 143.0, 321.39999999999986, 439.0, 439.0, 0.11852230042668029, 0.08808151428193721, 0.059492639081361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/508ce761-a855-4db1-bb19-dc1db0057855", 3, 0, 0.0, 686.3333333333334, 433, 1101, 525.0, 1101.0, 1101.0, 1101.0, 0.024119827302036517, 0.028508819314353707, 0.015467467377933574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 313.84615384615387, 140, 1125, 142.0, 1011.8, 1125.0, 1125.0, 0.11852446162542624, 5.388589285388669, 0.0682281362256341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 345.69230769230774, 140, 1531, 142.0, 1368.6, 1531.0, 1531.0, 0.11852662290299053, 16.434795399115607, 0.0681136317013129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d8c216a-fd27-488a-ac32-70ce2247c374", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bed3d7e2-d326-4206-a451-dd91da80b6ac", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.5313409941763727, 0.9928114600665557], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 331.08333333333337, 233, 617, 294.5, 561.8000000000002, 617.0, 617.0, 0.07472724555372888, 0.16748560138307678, 0.04830999663727395], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 174.66666666666669, 141, 425, 143.0, 424.1, 425.0, 425.0, 0.09638192945913675, 0.07162758624844048, 0.048379210685543246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 173.66666666666669, 140, 424, 142.0, 424.0, 424.0, 424.0, 0.09638296163422666, 0.025789972156033306, 0.05496840780701989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1008.6, 838, 1123, 1117.0, 1123.0, 1123.0, 1123.0, 0.05061753391374772, 14.88323563094756, 0.028867812310184246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1307.2, 1117, 1668, 1250.0, 1668.0, 1668.0, 1668.0, 0.05047955577990914, 45.42159302435639, 0.028739825214538113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 198.8, 141, 427, 141.0, 427.0, 427.0, 427.0, 0.050981911617758016, 0.09021408579236087, 0.028229242077410933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36439a24-1326-4a49-b7a8-93f1c9e3277e", 3, 0, 0.0, 400.3333333333333, 260, 560, 381.0, 560.0, 560.0, 560.0, 0.06929366655887652, 0.03257163232780524, 0.04443636820344621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 165.3076923076923, 141, 424, 143.0, 314.7999999999999, 424.0, 424.0, 0.06677624820217794, 0.04962570789243887, 0.03351854646085885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 219.15384615384616, 140, 567, 143.0, 511.79999999999995, 567.0, 567.0, 0.0667772772335715, 0.0332983448224495, 0.03722110855416921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 338.2307692307693, 140, 1580, 143.0, 1448.0, 1580.0, 1580.0, 0.0667772772335715, 9.259277466649888, 0.03837486259291031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 315.3846153846154, 140, 1118, 144.0, 1008.3999999999999, 1118.0, 1118.0, 0.06677762025108386, 3.035973874540262, 0.03844027223437917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 197.2, 141, 419, 142.0, 419.0, 419.0, 419.0, 0.05083729016908483, 0.03778044708854839, 0.02854632992892947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d929af02-342c-46bb-b902-a81a066944d0", 3, 0, 0.0, 414.6666666666667, 334, 551, 359.0, 551.0, 551.0, 551.0, 0.02437102447663225, 0.02880572587065485, 0.015628554107736177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1014.6874999999999, 141, 1828, 1260.0, 1818.9, 1828.0, 1828.0, 0.07702268799553268, 43.323503789155204, 0.041143955403863654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 173.72222222222223, 141, 429, 142.0, 422.7, 429.0, 429.0, 0.09638192945913675, 0.025977941924532948, 0.056662032748437806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 712.875, 142, 1297, 839.0, 1180.1000000000001, 1297.0, 1297.0, 0.07702231721641345, 14.16223412257139, 0.041218974447846266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 190.0, 141, 426, 143.5, 422.4, 426.0, 426.0, 0.09638192945913675, 0.025977941924532948, 0.05675615572642525], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 585.6666666666666, 325, 1021, 545.0, 951.7000000000003, 1021.0, 1021.0, 0.07485450156258773, 0.013523518348709695, 0.05160867002264349], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/37d5732b-f352-465e-9381-60d7838523cf", 3, 0, 0.0, 598.3333333333334, 371, 1026, 398.0, 1026.0, 1026.0, 1026.0, 0.027508298336664894, 0.02758888905444809, 0.017640412670322212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 559.5384615384614, 285, 2004, 292.0, 1759.6, 2004.0, 2004.0, 0.06672757696769359, 12.368947880950303, 0.14744528819897137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28a6ee3c-01a7-48da-9344-d610bdcfa233", 3, 0, 0.0, 351.0, 257, 512, 284.0, 512.0, 512.0, 512.0, 0.04286081664142641, 0.027555375282167043, 0.02748561483841472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18c15004-3965-4fac-98a2-cebed9d81f1d", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 519.2380952380953, 188, 1019, 427.0, 946.4000000000001, 1012.6999999999999, 1019.0, 0.09492426399793878, 0.05830797075654638, 0.04291985764750552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 142.4375, 140, 145, 142.5, 145.0, 145.0, 145.0, 0.07702194644086399, 0.0572399426186499, 0.03866140670957431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 268.18749999999994, 141, 466, 143.0, 439.40000000000003, 466.0, 466.0, 0.07702268799553268, 0.09291237826804859, 0.03988406280237423], "isController": false}, {"data": ["login", 21, 0, 0.0, 2900.142857142857, 1782, 4577, 2975.0, 4266.200000000001, 4560.9, 4577.0, 0.09548579535120584, 27.329927116772307, 0.18176669608917465], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3f8f124-d43a-457d-95f2-58b2c7de8c31", 1, 0, 0.0, 790.0, 790, 790, 790.0, 790.0, 790.0, 790.0, 1.2658227848101267, 0.22868868670886075, 0.8727254746835442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 145.94444444444443, 144, 151, 145.0, 149.2, 151.0, 151.0, 0.10072071265499799, 0.08154049881932943, 0.03580306582658132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d8c216a-fd27-488a-ac32-70ce2247c374", 3, 0, 0.0, 607.6666666666666, 233, 1077, 513.0, 1077.0, 1077.0, 1077.0, 0.03254713910647254, 0.032642492053073534, 0.02087170053377308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=508ce761-a855-4db1-bb19-dc1db0057855", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1161.8125, 284, 1973, 1423.5, 1962.5, 1973.0, 1973.0, 0.0769685920039254, 57.59547901222838, 0.16079595746523184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 619.7692307692307, 283, 1675, 564.0, 1511.7999999999997, 1675.0, 1675.0, 0.11836797873018474, 21.941263660689085, 0.26155304194323803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1504.8, 1259, 1811, 1392.0, 1811.0, 1811.0, 1811.0, 0.050266411983512616, 60.13610416457223, 0.11334486842766664], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1260.142857142857, 174, 2091, 1285.0, 1913.0, 2074.3999999999996, 2091.0, 0.09424267038850419, 0.02976637915172621, 0.042519642304188414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37d5732b-f352-465e-9381-60d7838523cf", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 151.85, 143, 171, 149.0, 169.5, 170.95, 171.0, 0.10106982408797117, 0.07846729506829793, 0.035927164031271004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 397.66666666666674, 285, 854, 288.0, 850.4, 854.0, 854.0, 0.09630767090598766, 0.14925807981230704, 0.2165982090786031], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0103690-c5e3-460f-9627-d91c7bbeeea0", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 454.875, 283, 844, 431.5, 748.1000000000001, 844.0, 844.0, 0.09053768065096592, 0.14031572186824504, 0.2036213657609126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 188.38461538461542, 142, 427, 146.0, 425.0, 427.0, 427.0, 0.07730410841603882, 0.057449635258403846, 0.038803038794769484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 142.61538461538458, 140, 146, 143.0, 145.6, 146.0, 146.0, 0.07731054456358198, 0.02068661055705221, 0.044091169946417846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 207.6153846153846, 140, 427, 143.0, 425.8, 427.0, 427.0, 0.07718019200056994, 0.020802473625153618, 0.04537351131283506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e64d2cb-3e2f-4605-8d24-3108fe27972c", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 1.0010530956112853, 1.8704692398119123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d929af02-342c-46bb-b902-a81a066944d0", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 229.2307692307692, 141, 426, 143.0, 425.2, 426.0, 426.0, 0.07730962504831851, 0.020837359876304598, 0.045525101468882875], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1563.245614035088, 1118, 2407, 1536.0, 2116.6, 2257.8, 2407.0, 0.24561660540615077, 293.84285021372955, 0.484996851690661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1260.142857142857, 174, 2091, 1285.0, 1913.0, 2074.3999999999996, 2091.0, 0.09590004475335422, 0.030289857885267012, 0.043267403003954735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/167973a2-ef7c-431e-b673-b3a8202eabff", 3, 0, 0.0, 382.6666666666667, 238, 594, 316.0, 594.0, 594.0, 594.0, 0.04856254856254856, 0.03122103952182077, 0.031141998915436415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 207.5454545454545, 141, 570, 143.0, 540.4000000000001, 570.0, 570.0, 0.051039109877923726, 0.013756635084284131, 0.030055257086316418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 219.45454545454547, 141, 422, 144.0, 421.8, 422.0, 422.0, 0.05103863624763946, 0.013756507426121575, 0.03000513576277242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 331.8, 140, 1685, 143.0, 1431.1000000000024, 1677.8999999999999, 1685.0, 0.10357059630770823, 9.344424422593926, 0.05999812278294193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 296.6, 140, 841, 146.0, 796.4000000000009, 840.8, 841.0, 0.10341796370029474, 3.065918448472, 0.06001069729562025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 187.10000000000005, 141, 443, 143.5, 437.50000000000006, 442.8, 443.0, 0.10356791466003833, 0.07696795220340738, 0.05198623841333955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 167.72727272727272, 141, 420, 142.0, 366.20000000000016, 420.0, 420.0, 0.05103934669636229, 0.013657012690237565, 0.029108377412769115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 241.0, 140, 432, 142.5, 425.0, 431.65, 432.0, 0.10341796370029474, 0.04320527819432236, 0.05811200811831015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 194.36363636363637, 141, 424, 144.0, 423.2, 424.0, 424.0, 0.05103839943579369, 0.03792990426820215, 0.025618884091794882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 145.54545454545453, 143, 151, 145.0, 150.2, 151.0, 151.0, 0.05337655216587491, 0.0420131846149367, 0.018973696277713347], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 803.7272727272727, 512, 2102, 560.0, 1886.8000000000006, 2102.0, 2102.0, 0.08816716494473523, 0.01592863819802345, 0.06001222067039106], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1632.4285714285716, 999, 2395, 1518.0, 2355.4, 2394.3, 2395.0, 0.0939345142243693, 0.04861844974503489, 0.04320620722624799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 428.45454545454544, 285, 994, 290.0, 963.4000000000001, 994.0, 994.0, 0.051003848472202906, 0.07904600344275978, 0.1147088506166829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fe316af-2709-48f2-9137-df7850228b89", 3, 0, 0.0, 1100.0, 581, 2102, 617.0, 2102.0, 2102.0, 2102.0, 0.025955823188932435, 0.02603186563968126, 0.01664484755279847], "isController": false}, {"data": ["addBook", 63, 10, 15.873015873015873, 1395.4761904761906, 721, 4827, 1130.0, 2428.4, 2763.0, 4827.0, 0.30596931564863067, 94.13547334029859, 1.1127006330043758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36981d7d-e879-4228-84a1-b4b8b3fbc2d7", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 255.0701754385965, 141, 645, 144.0, 572.8, 579.5999999999999, 645.0, 0.24711268338362294, 0.18364526567864947, 0.11945388503407554], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 916.0350877192984, 698, 1276, 842.0, 1151.8000000000002, 1262.3999999999999, 1276.0, 0.24657605357189208, 72.50154684566502, 0.12401041756789494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=102a1c02-8616-4252-8063-00d3ed9eb76b", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 211.9122807017544, 140, 625, 144.0, 427.2, 527.8999999999996, 625.0, 0.247630136153131, 0.4381892643647201, 0.12042949980884692], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1306.3684210526314, 973, 1951, 1266.0, 1677.8, 1701.7999999999993, 1951.0, 0.24627881354101408, 221.6021093361814, 0.12362042007820433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 186.125, 144, 432, 146.5, 429.9, 432.0, 432.0, 0.08858818122927176, 0.06618160023475868, 0.0314903300463427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bead2039-4d9a-4281-b83e-351f9b71b34b", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, 5.46448087431694, 217.58469945355196, 142, 2569, 150.0, 353.59999999999985, 430.4, 1022.5599999999937, 0.7746097321458806, 1.6242118319520167, 0.3740937753970404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 191.3846153846154, 143, 432, 148.0, 429.2, 432.0, 432.0, 0.08196101177716693, 0.06347176009696619, 0.029134578405164806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36439a24-1326-4a49-b7a8-93f1c9e3277e", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.555889423076923, 2.121394230769231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bead2039-4d9a-4281-b83e-351f9b71b34b", 3, 0, 0.0, 575.3333333333334, 370, 975, 381.0, 975.0, 975.0, 975.0, 0.027898672023211696, 0.027980406413904698, 0.01789074996280177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 146.53846153846155, 143, 159, 145.0, 155.4, 159.0, 159.0, 0.1170506829457155, 0.09498937258582967, 0.041607859953359805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fe316af-2709-48f2-9137-df7850228b89", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 440.7692307692308, 285, 850, 297.0, 850.0, 850.0, 850.0, 0.07710969150191885, 0.11950496134135273, 0.17342150344621005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28a6ee3c-01a7-48da-9344-d610bdcfa233", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.17694815132223313, 0.675272404505387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 590.65, 283, 2110, 427.0, 1603.7000000000016, 2088.7499999999995, 2110.0, 0.10333994708994708, 12.507191410771123, 0.22976991360780424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3f8f124-d43a-457d-95f2-58b2c7de8c31", 3, 0, 0.0, 352.0, 237, 537, 282.0, 537.0, 537.0, 537.0, 0.025704958486492045, 0.02578026598205794, 0.016483974029423608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36981d7d-e879-4228-84a1-b4b8b3fbc2d7", 3, 0, 0.0, 490.66666666666663, 253, 946, 273.0, 946.0, 946.0, 946.0, 0.025465812147192395, 0.02554041901871737, 0.016330615211578456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 145.92307692307696, 143, 150, 145.0, 149.6, 150.0, 150.0, 0.0645154886800131, 0.05348989247004992, 0.022933240116723406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 165.3125, 143, 452, 146.0, 242.70000000000022, 452.0, 452.0, 0.0777707028041199, 0.06037862180593293, 0.027645054512401995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 161.0, 140, 422, 143.0, 233.7000000000002, 422.0, 422.0, 0.09061151445819977, 0.06733922119403322, 0.04548273284327606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 212.0, 140, 426, 142.0, 423.9, 426.0, 426.0, 0.09061254077564335, 0.024245933762232694, 0.0516774646611091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 230.75, 140, 430, 142.5, 427.2, 430.0, 430.0, 0.0906120276140154, 0.024422773067840093, 0.053269961546520785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 275.0, 140, 565, 146.5, 474.7000000000001, 565.0, 565.0, 0.09061151445819977, 0.024422634756311658, 0.05335814767411569], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.37341299477221807], "isController": false}, {"data": ["401/Unauthorized", 10, 66.66666666666667, 0.7468259895444361], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1339, 15, "401/Unauthorized", 10, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
