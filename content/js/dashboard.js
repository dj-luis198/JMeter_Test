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

    var data = {"OkPercent": 97.76119402985074, "KoPercent": 2.2388059701492535};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7350674373795761, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31f17f51-e08a-4257-8eec-3c05ab0d5e87"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ee9e1b3-8cf9-45f7-a02c-93c7c9c455d6"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f40d5d8e-3d6b-42cf-bcb5-7c289e53fa5b"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4544d53c-7d22-4f5c-9833-78df42fce1a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d237c8a3-3021-4195-b862-deee76cc50eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29a0444d-6002-4f33-bff6-ff0a39f096b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca5a1ebf-0789-472f-a00d-f6db0d66d8ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/210d07ac-cc3c-4a7c-8dfe-7c7ed8b62bdf"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47ce1eeb-f029-43b2-8346-09278270f663"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29a0444d-6002-4f33-bff6-ff0a39f096b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41da87f6-568f-4725-b3f8-8f2f0220a41c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9db82465-6dbf-4a2a-88db-115e2c3fdf4f"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74d77f0d-bef3-4a5d-8cd2-5beec3d36de2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31f17f51-e08a-4257-8eec-3c05ab0d5e87"], "isController": false}, {"data": [0.10714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2543859649122807, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4544d53c-7d22-4f5c-9833-78df42fce1a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f40d5d8e-3d6b-42cf-bcb5-7c289e53fa5b"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9db82465-6dbf-4a2a-88db-115e2c3fdf4f"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=210d07ac-cc3c-4a7c-8dfe-7c7ed8b62bdf"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ee9e1b3-8cf9-45f7-a02c-93c7c9c455d6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca5a1ebf-0789-472f-a00d-f6db0d66d8ca"], "isController": false}, {"data": [0.9265536723163842, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41da87f6-568f-4725-b3f8-8f2f0220a41c"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47ce1eeb-f029-43b2-8346-09278270f663"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0c127d20-c423-4398-8ddc-898320b3367d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1216cc6b-d673-4686-b96d-348082580d7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74d77f0d-bef3-4a5d-8cd2-5beec3d36de2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 30, 2.2388059701492535, 455.38805970149275, 127, 2451, 151.0, 1250.0, 1562.4500000000005, 1994.4399999999987, 5.368374664476583, 760.7434668395196, 3.935753056017387], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2279.9473684210525, 1624, 3019, 2252.0, 2788.2, 2981.8999999999996, 3019.0, 0.24877576138476445, 299.36138092506394, 1.223228475168251], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/31f17f51-e08a-4257-8eec-3c05ab0d5e87", 3, 0, 0.0, 500.33333333333337, 222, 924, 355.0, 924.0, 924.0, 924.0, 0.023664531600037862, 0.027970675208247878, 0.015175497152368031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ee9e1b3-8cf9-45f7-a02c-93c7c9c455d6", 1, 0, 0.0, 1008.0, 1008, 1008, 1008.0, 1008.0, 1008.0, 1008.0, 0.992063492063492, 0.17923022073412698, 0.6839812748015873], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 496.4285714285714, 148, 1057, 520.5, 869.5, 1057.0, 1057.0, 0.08755034144633164, 0.017960766894089104, 0.05860913970845737], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 496.4285714285714, 148, 1057, 520.5, 869.5, 1057.0, 1057.0, 0.08784148376814868, 0.01802049412403218, 0.058804040159244064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 215.94444444444443, 131, 423, 141.0, 420.3, 423.0, 423.0, 0.10005002501250626, 0.04346791451281196, 0.056126153354455005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 155.05555555555557, 133, 396, 142.0, 172.80000000000035, 396.0, 396.0, 0.1000478006158498, 0.07435192994986493, 0.05021930616850273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 257.88888888888886, 133, 835, 140.0, 791.8000000000001, 835.0, 835.0, 0.10004835670574111, 3.2925853398587095, 0.05795987157681768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 308.05555555555554, 132, 1541, 138.5, 1531.1, 1541.0, 1541.0, 0.10005169337491036, 10.026936226077918, 0.057864097839439264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f40d5d8e-3d6b-42cf-bcb5-7c289e53fa5b", 3, 0, 0.0, 696.6666666666666, 233, 972, 885.0, 972.0, 972.0, 972.0, 0.0231728229132873, 0.027389492186896545, 0.014860176152075515], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 251.2857142857143, 140, 513, 238.5, 417.0, 513.0, 513.0, 0.08812291888285317, 0.17230563192000956, 0.05695164923616313], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4544d53c-7d22-4f5c-9833-78df42fce1a9", 3, 0, 0.0, 1043.3333333333333, 230, 2451, 449.0, 2451.0, 2451.0, 2451.0, 0.05791170395536938, 0.037231645609327645, 0.03713738827867112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d237c8a3-3021-4195-b862-deee76cc50eb", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29a0444d-6002-4f33-bff6-ff0a39f096b9", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 156.4375, 132, 425, 139.5, 229.0000000000002, 425.0, 425.0, 0.08401022824528886, 0.062433382514321116, 0.04216919659968601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 1046.3750000000002, 833, 1256, 1082.5, 1256.0, 1256.0, 1256.0, 0.036735499809434594, 10.80145667736588, 0.02095071473506817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 172.1875, 132, 401, 140.5, 398.2, 401.0, 401.0, 0.08401419839952952, 0.022480361681124113, 0.047914347524731685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1415.625, 1118, 1671, 1506.5, 1671.0, 1671.0, 1671.0, 0.03671223572926562, 33.03373424242007, 0.020901595146642436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 323.375, 135, 566, 390.0, 566.0, 566.0, 566.0, 0.03681800400395794, 0.06515060864762869, 0.020386531513910303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 171.94117647058823, 133, 414, 141.0, 398.0, 414.0, 414.0, 0.08972112563068674, 0.06667751621577403, 0.0450357993888408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 170.17647058823533, 132, 421, 139.0, 407.4, 421.0, 421.0, 0.08972491396964132, 0.031935636888551104, 0.050727975832330525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 266.64705882352945, 131, 1392, 141.0, 700.7999999999994, 1392.0, 1392.0, 0.08972017859593198, 4.771605451886234, 0.05229210317292773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 229.8235294117647, 127, 1045, 140.0, 640.1999999999996, 1045.0, 1045.0, 0.08972065211081029, 1.5745747669901888, 0.0523799969785251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 139.5, 134, 143, 140.5, 143.0, 143.0, 143.0, 0.036891180241083864, 0.02741619937838361, 0.020715262342405488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1076.7857142857144, 133, 1718, 1450.0, 1702.5, 1718.0, 1718.0, 0.07187374862669803, 41.58185637860267, 0.03828319925456655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 234.75, 135, 538, 146.5, 456.1000000000001, 538.0, 538.0, 0.08401155158834339, 0.02264373851404568, 0.04938960357049094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 759.0714285714284, 134, 1246, 1073.5, 1215.0, 1246.0, 1246.0, 0.07196907386083237, 13.61061895652554, 0.038404256071105446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 141.06249999999997, 131, 170, 139.5, 153.9, 170.0, 170.0, 0.08401463955094174, 0.022644570816464767, 0.04947346450118933], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 578.0000000000001, 145, 1168, 505.5, 1088.0, 1168.0, 1168.0, 0.08766876236755755, 0.017985060694962803, 0.059104254204969564], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 441.52941176470586, 270, 1535, 284.0, 1070.1999999999996, 1535.0, 1535.0, 0.08965393580778197, 6.440024318630088, 0.2002844617204063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca5a1ebf-0789-472f-a00d-f6db0d66d8ca", 3, 0, 0.0, 435.0, 273, 727, 305.0, 727.0, 727.0, 727.0, 0.018963337547408345, 0.02241402299304678, 0.012160734039190898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/210d07ac-cc3c-4a7c-8dfe-7c7ed8b62bdf", 2, 0, 0.0, 276.0, 241, 311, 276.0, 311.0, 311.0, 311.0, 0.020123153700647968, 0.02827853337425041, 0.012508190752404716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 529.2272727272727, 190, 1174, 459.5, 1087.4999999999998, 1169.8, 1174.0, 0.09513266682810392, 0.05843598382312243, 0.04301408666153527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 162.92857142857147, 136, 439, 142.0, 295.5, 439.0, 439.0, 0.07196574430571048, 0.053482354899068045, 0.03612343024720233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 197.3571428571429, 134, 419, 141.5, 414.5, 419.0, 419.0, 0.07186710745159236, 0.08862072583211844, 0.03710660779552781], "isController": false}, {"data": ["login", 22, 0, 0.0, 2646.272727272727, 1387, 4487, 2541.5, 3758.6, 4384.8499999999985, 4487.0, 0.09546083719154218, 41.656299086396395, 0.20159152470483074], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 145.31250000000003, 137, 154, 144.0, 153.3, 154.0, 154.0, 0.08304139094329831, 0.06722784481640066, 0.029518619436875566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47ce1eeb-f029-43b2-8346-09278270f663", 3, 0, 0.0, 511.0, 321, 838, 374.0, 838.0, 838.0, 838.0, 0.031082607209092696, 0.025912290710444794, 0.019932531315726764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29a0444d-6002-4f33-bff6-ff0a39f096b9", 3, 0, 0.0, 338.3333333333333, 275, 414, 326.0, 414.0, 414.0, 414.0, 0.04606950352431702, 0.029618251777515012, 0.02954326886162257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41da87f6-568f-4725-b3f8-8f2f0220a41c", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9db82465-6dbf-4a2a-88db-115e2c3fdf4f", 3, 0, 0.0, 441.0, 239, 592, 492.0, 592.0, 592.0, 592.0, 0.03280445265770741, 0.02666429631715345, 0.02103670954937617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1243.0, 279, 1858, 1591.5, 1844.0, 1858.0, 1858.0, 0.071814022200792, 55.27052306095728, 0.1496993749615282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74d77f0d-bef3-4a5d-8cd2-5beec3d36de2", 3, 0, 0.0, 324.0, 249, 444, 279.0, 444.0, 444.0, 444.0, 0.02072667730636102, 0.02857339791420537, 0.013291521579925521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31f17f51-e08a-4257-8eec-3c05ab0d5e87", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 987.1428571428572, 140, 1815, 1293.0, 1746.0, 1815.0, 1815.0, 0.06420634083477415, 43.90056601902342, 0.10096285863827524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 527.7777777777777, 272, 1678, 288.0, 1673.5, 1678.0, 1678.0, 0.09996889856489093, 13.426335070755764, 0.22199039812613852], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1095.9565217391305, 464, 2246, 991.0, 1820.6000000000004, 2185.399999999999, 2246.0, 0.09725323049861309, 0.030342082952777214, 0.04387792235386645], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 393.0625, 275, 829, 287.5, 721.2000000000002, 829.0, 829.0, 0.08394807811368668, 0.13010312496720777, 0.18880119521076216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 144.5, 135, 151, 144.0, 150.7, 151.0, 151.0, 0.07963685593692761, 0.061827441865095166, 0.028308413633829736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 482.1000000000001, 274, 1348, 426.0, 812.2000000000003, 1321.7999999999997, 1348.0, 0.09288716531593247, 5.693026242075564, 0.20771710923530642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 164.45454545454544, 138, 395, 141.0, 345.00000000000017, 395.0, 395.0, 0.05549921544290897, 0.041245022414114964, 0.027858004626616417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 165.18181818181816, 132, 425, 140.0, 369.20000000000016, 425.0, 425.0, 0.055498095406271285, 0.014850076309881183, 0.03165125753638909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 161.72727272727275, 134, 380, 140.0, 333.20000000000016, 380.0, 380.0, 0.055498375411192506, 0.01495854649754798, 0.032626974606970595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 164.1818181818182, 133, 414, 139.0, 360.4000000000002, 414.0, 414.0, 0.055498095406271285, 0.014958471027471556, 0.03268100735349764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 154.66666666666666, 145, 167, 152.0, 167.0, 167.0, 167.0, 0.022011401906187403, 0.006491643921551363, 0.01360665762364905], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1583.3157894736846, 1071, 2442, 1468.0, 2191.2000000000003, 2386.3999999999996, 2442.0, 0.25083832809653317, 300.08984591595595, 0.49530771426874026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1095.9565217391305, 464, 2246, 991.0, 1820.6000000000004, 2185.399999999999, 2246.0, 0.09521483364312652, 0.029706122520792022, 0.04295825502258248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 167.66666666666666, 132, 419, 135.0, 419.0, 419.0, 419.0, 0.041216717500618255, 0.011109193388838513, 0.024271172512571097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 168.77777777777777, 133, 422, 140.0, 422.0, 422.0, 422.0, 0.04121539624023996, 0.011108837267877177, 0.024230145055297324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 299.66666666666674, 134, 1540, 139.5, 1201.300000000001, 1540.0, 1540.0, 0.08160767112108538, 6.139389993284369, 0.047391954843755316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 261.75, 129, 1112, 140.5, 899.0000000000007, 1112.0, 1112.0, 0.08161377640545724, 2.0199276825428134, 0.0474752013139818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 137.22222222222223, 133, 141, 137.0, 141.0, 141.0, 141.0, 0.041215962484315034, 0.01102848996162336, 0.02350597860433592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 183.75, 133, 406, 141.0, 403.0, 406.0, 406.0, 0.08145975887911372, 0.06053796533887259, 0.04088898053111763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4544d53c-7d22-4f5c-9833-78df42fce1a9", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 170.44444444444446, 134, 421, 140.0, 421.0, 421.0, 421.0, 0.04121483001172333, 0.030629380506759233, 0.020687912720728313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 255.0, 135, 421, 140.0, 421.0, 421.0, 421.0, 0.0816082261091918, 0.03205088697940752, 0.04597104013084519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 143.88888888888889, 136, 150, 144.0, 150.0, 150.0, 150.0, 0.04355189934672151, 0.034280108274860874, 0.015481339220904911], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 543.3076923076924, 141, 924, 455.0, 908.4, 924.0, 924.0, 0.09540094080004698, 0.01914898691539404, 0.06491449232022427], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f40d5d8e-3d6b-42cf-bcb5-7c289e53fa5b", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1203.090909090909, 795, 1945, 1149.5, 1748.2999999999997, 1934.35, 1945.0, 0.0973972790741946, 0.05041070108332337, 0.04479894379291568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9db82465-6dbf-4a2a-88db-115e2c3fdf4f", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 341.77777777777777, 269, 843, 280.0, 843.0, 843.0, 843.0, 0.04118823480955018, 0.06383371937769154, 0.0926333054359317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=210d07ac-cc3c-4a7c-8dfe-7c7ed8b62bdf", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 1326.1833333333334, 713, 3455, 1088.0, 2434.0, 2594.6, 3455.0, 0.28033453254216695, 79.35685673445312, 1.0206476603747139], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 267.6140350877193, 134, 573, 142.0, 565.2, 569.3, 573.0, 0.2526069480205808, 0.18772840570670118, 0.12210980397479249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ee9e1b3-8cf9-45f7-a02c-93c7c9c455d6", 3, 0, 0.0, 481.6666666666667, 450, 513, 482.0, 513.0, 513.0, 513.0, 0.024985633260875, 0.025058833358318967, 0.016022687996068926], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 883.5614035087721, 656, 1271, 835.0, 1119.0, 1202.6999999999998, 1271.0, 0.2523664892722105, 74.204127202119, 0.1269225995851449], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 206.56140350877195, 128, 426, 143.0, 418.4, 421.5, 426.0, 0.2527996451934804, 0.44733687215877593, 0.1229435774476106], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1314.4561403508776, 931, 1871, 1259.0, 1657.8, 1815.3999999999999, 1871.0, 0.2515001764913519, 226.30030089707247, 0.12624129952788565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 160.15, 141, 417, 145.0, 153.9, 403.8499999999998, 417.0, 0.09060597274572339, 0.06768903237351406, 0.03220759187445636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca5a1ebf-0789-472f-a00d-f6db0d66d8ca", 1, 0, 0.0, 845.0, 845, 845, 845.0, 845.0, 845.0, 845.0, 1.183431952662722, 0.21380362426035504, 0.8159208579881657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, 5.649717514124294, 211.3220338983051, 134, 1498, 146.0, 363.4000000000004, 465.4999999999999, 1273.3599999999997, 0.7499555111137475, 1.6199383299295804, 0.36023915689323516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 177.27272727272725, 143, 427, 147.0, 378.4000000000002, 427.0, 427.0, 0.05788498779152985, 0.04482694855340153, 0.020576304254020374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 146.11111111111111, 138, 158, 144.0, 157.1, 158.0, 158.0, 0.09852270674716337, 0.07995348565126245, 0.03502174341403073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41da87f6-568f-4725-b3f8-8f2f0220a41c", 3, 0, 0.0, 336.0, 238, 455, 315.0, 455.0, 455.0, 455.0, 0.02780197579374641, 0.023177363283784034, 0.017828740987526178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 357.0909090909091, 280, 809, 284.0, 760.6000000000001, 809.0, 809.0, 0.05545920219416771, 0.0859509315255314, 0.1247290455597346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47ce1eeb-f029-43b2-8346-09278270f663", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.21254595588235295, 0.8111213235294118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 557.3333333333334, 282, 1673, 421.5, 1419.500000000001, 1673.0, 1673.0, 0.08138241597265551, 8.22908816301237, 0.18129575641564713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 160.0588235294118, 136, 418, 143.0, 216.3999999999998, 418.0, 418.0, 0.09327846364883402, 0.07733731995884774, 0.03315757887517147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c127d20-c423-4398-8ddc-898320b3367d", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.6129288627639156, 1.145258517274472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1216cc6b-d673-4686-b96d-348082580d7e", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 141.85714285714283, 135, 156, 142.0, 151.5, 156.0, 156.0, 0.06894310224262062, 0.053525162385628315, 0.02450711837530655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74d77f0d-bef3-4a5d-8cd2-5beec3d36de2", 1, 0, 0.0, 1168.0, 1168, 1168, 1168.0, 1168.0, 1168.0, 1168.0, 0.8561643835616438, 0.1546781357020548, 0.590285209760274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 155.04999999999998, 133, 405, 142.0, 158.60000000000002, 392.74999999999983, 405.0, 0.09295062462819749, 0.0690775638106038, 0.046656856502825694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 222.6, 132, 421, 141.0, 417.8, 420.85, 421.0, 0.09294889669659621, 0.03185133579183165, 0.05261960489747737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 275.4, 128, 1206, 141.5, 420.9, 1166.7499999999995, 1206.0, 0.09295062462819749, 4.205657214653201, 0.05424540359161213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 236.05, 133, 1089, 141.0, 548.4000000000003, 1062.6999999999996, 1089.0, 0.09295105662113613, 1.3903353993642147, 0.05433642821622275], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.5970149253731343], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22388059701492538], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22388059701492538], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.1940298507462686], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 30, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
