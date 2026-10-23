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

    var data = {"OkPercent": 98.93778452200303, "KoPercent": 1.062215477996965};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7284876140808344, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f31c656-2bfb-4965-8e8c-3efa51016037"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d9a5dce-29cc-4ea3-9262-b08c0a3cf47b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68036ffe-f33b-4dd4-b02c-ba6a5ff0c5ea"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87065659-7532-4f47-9f22-92519fac4c3b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a336755b-be13-46d0-bd31-bbfe713e4de4"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2c79cb7-298c-4915-a642-2c530b5ff621"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15ff0179-2c0e-4f60-8500-49f95643c242"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76102564-35db-4834-868a-4aab5cae079f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.64, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a30d17dc-10d7-4d22-aa57-c5567044ae6d"], "isController": false}, {"data": [0.78, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba3a289c-0f06-43b0-8b83-6e2e14985206"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c4c62bd-0a2b-45d0-bf0b-cd10f213e081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bdcaad9-fdef-46c9-b92d-ba42f2c5c666"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dd35e8a2-7c37-44c8-bc87-5569e747a8fa"], "isController": false}, {"data": [0.52, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d9a5dce-29cc-4ea3-9262-b08c0a3cf47b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf917b0e-3070-4087-8b54-a3692723e23c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15ff0179-2c0e-4f60-8500-49f95643c242"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23275862068965517, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a336755b-be13-46d0-bd31-bbfe713e4de4"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68036ffe-f33b-4dd4-b02c-ba6a5ff0c5ea"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87065659-7532-4f47-9f22-92519fac4c3b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76102564-35db-4834-868a-4aab5cae079f"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba3a289c-0f06-43b0-8b83-6e2e14985206"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e2c79cb7-298c-4915-a642-2c530b5ff621"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18b92191-69e0-4654-9291-2c2cac50e8c6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3448275862068966, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9568965517241379, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18b92191-69e0-4654-9291-2c2cac50e8c6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a30d17dc-10d7-4d22-aa57-c5567044ae6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7c4c62bd-0a2b-45d0-bf0b-cd10f213e081"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd35e8a2-7c37-44c8-bc87-5569e747a8fa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf917b0e-3070-4087-8b54-a3692723e23c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46db8d09-6eb5-4c24-b532-fd1712efa165"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89c9b8a7-666d-45b8-8d3f-296088097bb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1318, 14, 1.062215477996965, 484.682852807284, 133, 3046, 153.0, 1352.4000000000005, 1651.3999999999996, 2241.0699999999974, 5.287715089245237, 752.1872191653595, 3.8617348885888862], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2327.0344827586205, 1668, 3114, 2263.0, 2837.2, 3037.45, 3114.0, 0.243656528314569, 293.20090307826416, 1.1980572461561083], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7f31c656-2bfb-4965-8e8c-3efa51016037", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d9a5dce-29cc-4ea3-9262-b08c0a3cf47b", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68036ffe-f33b-4dd4-b02c-ba6a5ff0c5ea", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 889.3571428571428, 141, 2435, 652.0, 2024.0, 2435.0, 2435.0, 0.07181512734360974, 0.01356051546590064, 0.04856638250532202], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 889.3571428571428, 141, 2435, 652.0, 2024.0, 2435.0, 2435.0, 0.07092881280366398, 0.01339315682613828, 0.047966994986852834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 157.75, 136, 415, 141.5, 225.30000000000018, 415.0, 415.0, 0.08772843662442907, 0.02347421058114606, 0.05003262401236971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 176.56249999999997, 139, 420, 142.5, 417.9, 420.0, 420.0, 0.08772555061490128, 0.06519447658001941, 0.04403411427349537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 243.00000000000003, 135, 425, 143.0, 424.3, 425.0, 425.0, 0.08772555061490128, 0.02364477731417261, 0.051658698262485814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 236.56249999999997, 136, 558, 142.0, 473.30000000000007, 558.0, 558.0, 0.08772795560965446, 0.02364542553541468, 0.05157444265333202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87065659-7532-4f47-9f22-92519fac4c3b", 3, 0, 0.0, 408.0, 254, 498, 472.0, 498.0, 498.0, 498.0, 0.07438631291842301, 0.03365786945202083, 0.04770216030250434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a336755b-be13-46d0-bd31-bbfe713e4de4", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 328.4285714285714, 139, 1023, 263.5, 714.5, 1023.0, 1023.0, 0.07159623812908802, 0.15492375160452285, 0.04628085510199907], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2c79cb7-298c-4915-a642-2c530b5ff621", 1, 0, 0.0, 2203.0, 2203, 2203, 2203.0, 2203.0, 2203.0, 2203.0, 0.45392646391284613, 0.08200819904675444, 0.3129610190649115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 141.8125, 137, 147, 142.5, 145.6, 147.0, 147.0, 0.09255884717955838, 0.06878640889027728, 0.04646020258817676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 193.375, 135, 428, 142.0, 423.8, 428.0, 428.0, 0.0925572408686497, 0.04214337261231242, 0.05181488117964203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1065.5, 797, 1250, 1107.5, 1250.0, 1250.0, 1250.0, 0.062438537065076564, 18.359003051683498, 0.035609478169926476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1618.0, 1406, 1825, 1620.5, 1825.0, 1825.0, 1825.0, 0.061751265900950966, 55.56389760482278, 0.035157214863529705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 140.75, 135, 144, 142.0, 144.0, 144.0, 144.0, 0.06339847526666985, 0.11218558318672435, 0.035104429175978315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15ff0179-2c0e-4f60-8500-49f95643c242", 3, 0, 0.0, 373.3333333333333, 292, 535, 293.0, 535.0, 535.0, 535.0, 0.044686080285990915, 0.02901976893572652, 0.02865611268339912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76102564-35db-4834-868a-4aab5cae079f", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 140.25000000000003, 134, 146, 140.0, 145.3, 146.0, 146.0, 0.09286775631500742, 0.06901597905832095, 0.04661526049405646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 213.1875, 134, 441, 142.5, 431.90000000000003, 441.0, 441.0, 0.09286560026002368, 0.03356628935179811, 0.05247495893599238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 262.18750000000006, 137, 1525, 142.5, 752.2000000000007, 1525.0, 1525.0, 0.09286560026002368, 5.24600519213022, 0.05409602593271887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 287.3125, 134, 1129, 144.0, 633.4000000000005, 1129.0, 1129.0, 0.092727283264464, 1.7274871014900115, 0.054106007568864495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 141.25, 136, 145, 142.0, 145.0, 145.0, 145.0, 0.06339646564704017, 0.04711397495839607, 0.035598601315476666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 25, 0, 0.0, 750.8000000000001, 136, 1984, 150.0, 1738.6000000000001, 1922.7999999999997, 1984.0, 0.12294013798801087, 44.26858263236965, 0.06804928731602009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 338.62500000000006, 135, 1651, 141.5, 1560.0, 1651.0, 1651.0, 0.09256259545517656, 10.432828210331143, 0.053422357337899753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a30d17dc-10d7-4d22-aa57-c5567044ae6d", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 25, 0, 0.0, 560.72, 138, 1262, 427.0, 1128.4, 1225.6999999999998, 1262.0, 0.12294013798801087, 14.47927475153798, 0.068169346044524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 297.56250000000006, 137, 1111, 143.0, 1021.4000000000001, 1111.0, 1111.0, 0.09255991808447249, 3.4237904660391876, 0.053511202642585666], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 698.0714285714287, 140, 2203, 523.0, 1689.0, 2203.0, 2203.0, 0.0710050768629957, 0.013407557412676433, 0.04859310889389305], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba3a289c-0f06-43b0-8b83-6e2e14985206", 1, 0, 0.0, 1175.0, 1175, 1175, 1175.0, 1175.0, 1175.0, 1175.0, 0.851063829787234, 0.15375664893617022, 0.5867686170212766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 509.06250000000006, 282, 1660, 548.5, 902.6000000000008, 1660.0, 1660.0, 0.0926526452330214, 7.062417345516192, 0.2068963426815992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 571.1904761904764, 188, 1201, 528.0, 1055.6000000000001, 1191.4999999999998, 1201.0, 0.09743061548311667, 0.05984751673718787, 0.0440531005553545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 25, 0, 0.0, 153.44000000000003, 136, 424, 141.0, 159.4000000000001, 351.0999999999998, 424.0, 0.12294134714210546, 0.09136559099134985, 0.06171079338968965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 25, 0, 0.0, 192.92, 136, 576, 143.0, 429.6, 532.8, 576.0, 0.12293711520682939, 0.10675359652530537, 0.06598265480241547], "isController": false}, {"data": ["login", 21, 0, 0.0, 3142.9999999999995, 1695, 6225, 2950.0, 5096.200000000001, 6126.699999999999, 6225.0, 0.09640722411466032, 22.102907323391147, 0.17590821487104386], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 164.06249999999997, 141, 413, 146.5, 238.70000000000016, 413.0, 413.0, 0.09196935121370803, 0.07445565640250386, 0.032692230314247776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c4c62bd-0a2b-45d0-bf0b-cd10f213e081", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bdcaad9-fdef-46c9-b92d-ba42f2c5c666", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd35e8a2-7c37-44c8-bc87-5569e747a8fa", 3, 0, 0.0, 798.6666666666666, 319, 1054, 1023.0, 1054.0, 1054.0, 1054.0, 0.024720045484883692, 0.024792467493140187, 0.01585237291836617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 25, 0, 0.0, 946.0799999999999, 280, 2122, 572.0, 1878.8000000000002, 2062.0, 2122.0, 0.12285434879823875, 58.90484504534554, 0.2637289350862192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d9a5dce-29cc-4ea3-9262-b08c0a3cf47b", 3, 0, 0.0, 347.3333333333333, 241, 551, 250.0, 551.0, 551.0, 551.0, 0.02471882338400692, 0.024791241811889755, 0.0158515892143534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf917b0e-3070-4087-8b54-a3692723e23c", 3, 0, 0.0, 417.6666666666667, 321, 511, 421.0, 511.0, 511.0, 511.0, 0.018910145292949668, 0.02606916188660216, 0.01212662312080431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 466.0000000000001, 279, 841, 416.0, 838.2, 841.0, 841.0, 0.08765538286227696, 0.135848723244564, 0.19713901048029672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1219.5, 139, 1968, 1616.0, 1968.0, 1968.0, 1968.0, 0.08548957027242676, 68.19112306579848, 0.14739437140231393], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 984.3913043478262, 200, 1936, 955.0, 1822.2, 1917.7999999999997, 1936.0, 0.09358038555118847, 0.029625312273677873, 0.042220838012352616], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 143.86666666666665, 140, 152, 144.0, 149.0, 152.0, 152.0, 0.0887820873260611, 0.06892749943771345, 0.03155925760418578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 562.5000000000001, 280, 1791, 291.5, 1698.6000000000001, 1791.0, 1791.0, 0.09248073799628921, 13.95530046486021, 0.20503358929304258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15ff0179-2c0e-4f60-8500-49f95643c242", 1, 0, 0.0, 806.0, 806, 806, 806.0, 806.0, 806.0, 806.0, 1.2406947890818858, 0.22414896091811412, 0.855400899503722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 611.9999999999999, 284, 1775, 563.5, 1490.1000000000004, 1775.0, 1775.0, 0.09776544846844315, 14.752760823704454, 0.2167500091655108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 174.25000000000003, 136, 409, 142.5, 409.0, 409.0, 409.0, 0.04191971326916124, 0.03115322441194502, 0.02104173107455945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 175.5, 134, 426, 141.0, 426.0, 426.0, 426.0, 0.041919273958175046, 0.011216680727089808, 0.023907085929271706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 246.75, 138, 426, 143.0, 426.0, 426.0, 426.0, 0.041856109160732693, 0.011281529422228733, 0.02460681417457137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 172.74999999999997, 136, 411, 139.5, 411.0, 411.0, 411.0, 0.041919273958175046, 0.011298554309039368, 0.024684884957792533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 2.106584821428571, 4.4154575892857135], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1589.8103448275858, 1101, 2533, 1511.0, 2250.7, 2393.3999999999996, 2533.0, 0.25122254419134493, 300.54950194047757, 0.4960663909715815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 984.3913043478262, 200, 1936, 955.0, 1822.2, 1917.7999999999997, 1936.0, 0.09227423903842219, 0.029211817521674417, 0.041631541441163135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 140.25, 139, 142, 140.0, 142.0, 142.0, 142.0, 0.02608837436817218, 0.007031632153921409, 0.015362587640632645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 279.25, 147, 415, 277.5, 415.0, 415.0, 415.0, 0.02608701323263746, 0.007031265285359316, 0.015336310513718508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 303.93333333333334, 138, 1647, 142.0, 994.8000000000004, 1647.0, 1647.0, 0.0865461175411671, 5.213395004053242, 0.05038381400085392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 231.73333333333332, 135, 842, 141.0, 663.2, 842.0, 842.0, 0.08655360841993502, 1.7184159571675044, 0.05047269990998425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 158.73333333333335, 135, 412, 141.0, 251.8000000000001, 412.0, 412.0, 0.08675484815009746, 0.06447308539279703, 0.04354686713784189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 280.0, 143, 414, 281.5, 414.0, 414.0, 414.0, 0.02608650284342881, 0.006980177518651849, 0.014877458652892993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 176.60000000000002, 134, 418, 142.0, 415.6, 418.0, 418.0, 0.08675534991324466, 0.03190066512434933, 0.048991920908039326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 217.25, 141, 428, 150.0, 428.0, 428.0, 428.0, 0.026039293293580013, 0.019351466988685926, 0.013070504641504029], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 644.6428571428571, 139, 1054, 571.5, 1038.5, 1054.0, 1054.0, 0.07162993926804435, 0.013385645040394169, 0.04875092895077488], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 142.75, 140, 145, 143.0, 145.0, 145.0, 145.0, 0.028550423616910417, 0.022472306089091596, 0.010148783395073625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a336755b-be13-46d0-bd31-bbfe713e4de4", 3, 0, 0.0, 629.6666666666666, 273, 1016, 600.0, 1016.0, 1016.0, 1016.0, 0.01931807205640877, 0.022833307173444093, 0.01238821678096526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1588.5238095238094, 907, 3046, 1438.0, 2906.0000000000005, 3045.1, 3046.0, 0.09743468396364294, 0.05043006103586988, 0.044816148580933426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68036ffe-f33b-4dd4-b02c-ba6a5ff0c5ea", 3, 0, 0.0, 367.6666666666667, 262, 558, 283.0, 558.0, 558.0, 558.0, 0.0549964252323599, 0.03600189164787622, 0.035267889878824545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 501.0, 296, 844, 432.0, 844.0, 844.0, 844.0, 0.0260137222384808, 0.04031618866452054, 0.058505471010958286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87065659-7532-4f47-9f22-92519fac4c3b", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 0.6124205508474576, 2.337129237288136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76102564-35db-4834-868a-4aab5cae079f", 3, 0, 0.0, 418.6666666666667, 244, 585, 427.0, 585.0, 585.0, 585.0, 0.030564215416590254, 0.03065375901644355, 0.01960009907899831], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 1454.448275862069, 724, 2695, 1145.5, 2482.7, 2594.15, 2695.0, 0.288281840232216, 96.2474783105193, 1.0473466809689251], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ba3a289c-0f06-43b0-8b83-6e2e14985206", 3, 0, 0.0, 449.3333333333333, 297, 645, 406.0, 645.0, 645.0, 645.0, 0.028165840468679586, 0.02824835757942767, 0.018062078685969655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2c79cb7-298c-4915-a642-2c530b5ff621", 3, 0, 0.0, 1306.0, 385, 2510, 1023.0, 2510.0, 2510.0, 2510.0, 0.06971232049077473, 0.031543009597062785, 0.04470484093972208], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 237.13793103448285, 138, 667, 144.0, 561.6, 577.05, 667.0, 0.2524164523302826, 0.1875868361556104, 0.12201771865575184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18b92191-69e0-4654-9291-2c2cac50e8c6", 3, 0, 0.0, 471.33333333333337, 243, 821, 350.0, 821.0, 821.0, 821.0, 0.03152353231687455, 0.02627987183057152, 0.020215286023516556], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 910.0517241379308, 665, 1376, 845.0, 1210.7, 1243.3999999999999, 1376.0, 0.25224849085816675, 74.16943175047406, 0.12686325467964443], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 218.58620689655177, 136, 539, 143.0, 428.0, 467.79999999999995, 539.0, 0.2530265023448577, 0.44773830297742395, 0.12305390446068273], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1347.7586206896547, 955, 1968, 1345.0, 1705.5, 1837.0999999999997, 1968.0, 0.25198766129382627, 226.7389405792458, 0.12648599404787766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 146.0, 139, 174, 145.0, 155.10000000000002, 174.0, 174.0, 0.0986679822397632, 0.07371192032560435, 0.03507338431179082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, 2.8735632183908044, 216.39080459770116, 137, 1752, 146.0, 348.5, 428.5, 1429.5, 0.7494766585401573, 1.6432659360705024, 0.35901065985174146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 144.62499999999997, 142, 147, 145.0, 147.0, 147.0, 147.0, 0.04209595773565843, 0.032599701644899545, 0.014963797476347334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18b92191-69e0-4654-9291-2c2cac50e8c6", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a30d17dc-10d7-4d22-aa57-c5567044ae6d", 3, 0, 0.0, 1254.6666666666667, 247, 3026, 491.0, 3026.0, 3026.0, 3026.0, 0.015255607707133014, 0.02103108679678005, 0.009783055723649752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 165.0, 140, 424, 146.0, 244.1000000000002, 424.0, 424.0, 0.08890914041531682, 0.07215185125500809, 0.03160442100700715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 423.375, 277, 836, 287.0, 836.0, 836.0, 836.0, 0.04182612878265052, 0.06482233044733045, 0.09406794393207436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 501.93333333333334, 278, 1788, 287.0, 1214.4000000000003, 1788.0, 1788.0, 0.08647427102189528, 7.021969779404135, 0.19300764540648674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c4c62bd-0a2b-45d0-bf0b-cd10f213e081", 3, 0, 0.0, 1357.6666666666667, 238, 2821, 1014.0, 2821.0, 2821.0, 2821.0, 0.02095894143373132, 0.024772759227173966, 0.013440467000146712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd35e8a2-7c37-44c8-bc87-5569e747a8fa", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf917b0e-3070-4087-8b54-a3692723e23c", 1, 0, 0.0, 714.0, 714, 714, 714.0, 714.0, 714.0, 714.0, 1.4005602240896358, 0.253030899859944, 0.9656206232492998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46db8d09-6eb5-4c24-b532-fd1712efa165", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 195.5, 134, 433, 144.5, 422.5, 433.0, 433.0, 0.09672232230295849, 0.08019262855001148, 0.03438176300612978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89c9b8a7-666d-45b8-8d3f-296088097bb3", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 25, 0, 0.0, 155.39999999999998, 140, 427, 145.0, 148.4, 343.5999999999998, 427.0, 0.1248807388943559, 0.09695330802833294, 0.04439120015385307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 158.87499999999997, 137, 403, 142.0, 231.50000000000017, 403.0, 403.0, 0.09785573618093525, 0.07272286643915209, 0.049118992575196016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 194.3125, 136, 428, 142.5, 427.3, 428.0, 428.0, 0.09785274385209557, 0.04455453302835895, 0.05477938028634159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 412.56250000000006, 133, 1637, 274.5, 1348.6000000000004, 1637.0, 1637.0, 0.09785274385209557, 11.029086441432074, 0.05647555821932469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 384.5, 137, 1129, 412.0, 1108.0, 1129.0, 1129.0, 0.09785513770052658, 3.619660587925899, 0.056572501483116926], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.37936267071320184], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07587253414264036], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07587253414264036], "isController": false}, {"data": ["401/Unauthorized", 7, 50.0, 0.5311077389984825], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1318, 14, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
