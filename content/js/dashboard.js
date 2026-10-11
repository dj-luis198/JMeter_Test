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

    var data = {"OkPercent": 98.01429706115965, "KoPercent": 1.9857029388403495};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7239618788291354, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/679d2fd5-b749-4a90-a701-a51dc2ad3475"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f82b601-e132-479b-b536-97b7bc855752"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab4dd08e-f644-4811-9e25-8c82931ebca8"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b02b170-68da-4733-8646-6b90bb056175"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e5d736c1-8462-441b-a8f8-13eae5cf200b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/858fafb8-2066-4519-a66d-a147d514814f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35ce23a3-8e52-4e32-bb1c-1115a18b2bf8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62f895e2-cd31-4ebd-8b56-aaa7cbf4a0e2"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=423f79b4-97ca-4ddd-a065-ed9b002368d9"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae8dde2f-6734-4273-9e50-64697ac9dd3e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f79bf5e-3799-47ad-b5dd-cb73ab590829"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65699b5d-4b4f-4825-92d9-ee4dc84ac357"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/35ce23a3-8e52-4e32-bb1c-1115a18b2bf8"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f79bf5e-3799-47ad-b5dd-cb73ab590829"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32407407407407407, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15d3a611-e4bc-4860-8048-a93dd3128f3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=858fafb8-2066-4519-a66d-a147d514814f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2909090909090909, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7b02b170-68da-4733-8646-6b90bb056175"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f82b601-e132-479b-b536-97b7bc855752"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9237804878048781, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5d736c1-8462-441b-a8f8-13eae5cf200b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/423f79b4-97ca-4ddd-a065-ed9b002368d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bbf21ca-6d4d-4e18-b9ef-93e00cb30b18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62f895e2-cd31-4ebd-8b56-aaa7cbf4a0e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/65699b5d-4b4f-4825-92d9-ee4dc84ac357"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae8dde2f-6734-4273-9e50-64697ac9dd3e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/15d3a611-e4bc-4860-8048-a93dd3128f3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab4dd08e-f644-4811-9e25-8c82931ebca8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1259, 25, 1.9857029388403495, 463.78554408260595, 125, 3795, 155.0, 1276.0, 1531.0, 2038.6000000000022, 5.058195361245144, 724.2234510971643, 3.7008722398886316], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/679d2fd5-b749-4a90-a701-a51dc2ad3475", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f82b601-e132-479b-b536-97b7bc855752", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 0.5681259827044025, 2.168091588050314], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2205.0370370370365, 1592, 3212, 2212.0, 2733.5, 2872.25, 3212.0, 0.24638858217059217, 296.4879859900715, 1.2114907336220033], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab4dd08e-f644-4811-9e25-8c82931ebca8", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 723.9285714285714, 132, 1873, 594.5, 1537.0, 1873.0, 1873.0, 0.08456148828219376, 0.01665748067165982, 0.056897329517999515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 723.9285714285714, 132, 1873, 594.5, 1537.0, 1873.0, 1873.0, 0.0847544844203096, 0.016695498326098932, 0.05702718727108722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 165.92857142857142, 125, 386, 129.5, 385.0, 386.0, 386.0, 0.08392580958432745, 0.02245671076768137, 0.04786393827856175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 130.7142857142857, 127, 140, 129.0, 140.0, 140.0, 140.0, 0.0839243002811464, 0.06236952393940665, 0.04212606478955982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 186.00000000000003, 127, 418, 128.0, 401.5, 418.0, 418.0, 0.0839278220730172, 0.022621170793117918, 0.04942234053713806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b02b170-68da-4733-8646-6b90bb056175", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 221.21428571428572, 126, 390, 135.0, 388.0, 390.0, 390.0, 0.08392882835355618, 0.02262144201716944, 0.04934097135628987], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 307.4285714285715, 128, 592, 302.0, 512.5, 592.0, 592.0, 0.08433582525617006, 0.1684128072986633, 0.05451002768022265], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 172.47619047619048, 126, 428, 132.0, 391.2, 424.4, 428.0, 0.09706224925585609, 0.07213317547236961, 0.04872069933350589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 144.61904761904762, 127, 382, 132.0, 141.8, 357.99999999999966, 382.0, 0.09695067057547148, 0.03981000842547495, 0.05451671821980102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5d736c1-8462-441b-a8f8-13eae5cf200b", 3, 0, 0.0, 504.3333333333333, 360, 617, 536.0, 617.0, 617.0, 617.0, 0.07152223149362259, 0.03236194719275241, 0.0458654935033973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 948.8571428571429, 755, 1015, 1009.0, 1015.0, 1015.0, 1015.0, 0.13222765824817242, 38.87932189642797, 0.07541108634466083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1293.7142857142856, 1123, 1420, 1276.0, 1420.0, 1420.0, 1420.0, 0.13127789655301753, 118.12408208033268, 0.07474122430704024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 328.85714285714283, 127, 489, 387.0, 489.0, 489.0, 489.0, 0.13448348734894622, 0.23797273347293998, 0.0744649778582544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/858fafb8-2066-4519-a66d-a147d514814f", 3, 0, 0.0, 346.6666666666667, 266, 467, 307.0, 467.0, 467.0, 467.0, 0.018778167250876315, 0.02588721950112669, 0.012041988764396596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 158.0909090909091, 128, 384, 134.0, 337.00000000000017, 384.0, 384.0, 0.05522615108870826, 0.04104209079932323, 0.027720939120699263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 154.36363636363635, 126, 384, 129.0, 335.8000000000002, 384.0, 384.0, 0.05522781473578511, 0.01477775511484875, 0.031497113091502445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35ce23a3-8e52-4e32-bb1c-1115a18b2bf8", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 180.8181818181818, 125, 420, 131.0, 413.0, 420.0, 420.0, 0.05522670562659718, 0.014885323000918771, 0.032467262487511236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 180.63636363636365, 128, 386, 137.0, 384.8, 386.0, 386.0, 0.05522615108870826, 0.014885173535628397, 0.032520868268057695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 169.28571428571428, 128, 382, 130.0, 382.0, 382.0, 382.0, 0.1344318334581629, 0.09990490748209176, 0.07548662523285514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 301.1904761904762, 126, 1517, 130.0, 1211.8000000000006, 1503.9999999999998, 1517.0, 0.09693321762892118, 8.33036968194365, 0.05619277766750983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1045.7857142857142, 127, 1664, 1379.0, 1599.0, 1664.0, 1664.0, 0.09983669569062034, 64.17428422883283, 0.052564688830413105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 269.1904761904762, 126, 1007, 129.0, 621.2, 970.9999999999995, 1007.0, 0.09705686608001182, 2.7415676070398582, 0.0563592395247911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 754.8571428571429, 128, 1249, 1007.5, 1219.0, 1249.0, 1249.0, 0.09983669569062034, 20.97576219077366, 0.052662185603548475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62f895e2-cd31-4ebd-8b56-aaa7cbf4a0e2", 3, 0, 0.0, 400.3333333333333, 227, 550, 424.0, 550.0, 550.0, 550.0, 0.026274533845978682, 0.021647410535212255, 0.01684922906138607], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 560.2142857142858, 132, 1104, 572.5, 1010.0, 1104.0, 1104.0, 0.08498703947647984, 0.016741308557587826, 0.057729059041710426], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=423f79b4-97ca-4ddd-a065-ed9b002368d9", 1, 0, 0.0, 1104.0, 1104, 1104, 1104.0, 1104.0, 1104.0, 1104.0, 0.9057971014492754, 0.16364498414855072, 0.6245046422101449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 367.8181818181818, 259, 769, 278.0, 728.2000000000002, 769.0, 769.0, 0.055189299296587294, 0.08553263474969144, 0.1241220276172271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 751.142857142857, 233, 1554, 684.0, 1375.4, 1537.0999999999997, 1554.0, 0.10342738658694549, 0.06353108023748898, 0.04676453123999586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 129.7857142857143, 127, 134, 129.0, 134.0, 134.0, 134.0, 0.09983598374099693, 0.07419451526064323, 0.050112984026242605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 202.2857142857143, 126, 391, 128.5, 390.5, 391.0, 391.0, 0.09983598374099693, 0.1338203308849747, 0.05094866469371747], "isController": false}, {"data": ["login", 21, 0, 0.0, 3280.761904761905, 1832, 4888, 2901.0, 4813.8, 4881.5, 4888.0, 0.09737640152463622, 38.96295454637667, 0.20074373400244833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 178.38095238095235, 128, 417, 142.0, 386.0, 413.9, 417.0, 0.09520096470310899, 0.07707187474499741, 0.033840967921808275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae8dde2f-6734-4273-9e50-64697ac9dd3e", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f79bf5e-3799-47ad-b5dd-cb73ab590829", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1182.2857142857142, 257, 1795, 1508.5, 1731.0, 1795.0, 1795.0, 0.09974422730284485, 85.2790044190255, 0.20609817948973702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 412.0, 260, 558, 510.0, 541.5, 558.0, 558.0, 0.08385794464177683, 0.12996343568994123, 0.1885984829199336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 979.4545454545457, 128, 1781, 1286.0, 1736.2000000000003, 1781.0, 1781.0, 0.19892580067634774, 151.46398369260538, 0.33337378723077205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65699b5d-4b4f-4825-92d9-ee4dc84ac357", 1, 0, 0.0, 837.0, 837, 837, 837.0, 837.0, 837.0, 837.0, 1.194743130227001, 0.21584714755077658, 0.823719384707288], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1162.8333333333335, 262, 2097, 1186.0, 1763.5, 2015.0, 2097.0, 0.098405825624877, 0.030463522190513678, 0.0443979408580988], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 519.8095238095239, 255, 1648, 279.0, 1406.8000000000004, 1636.2999999999997, 1648.0, 0.09687374583096915, 11.173425232208675, 0.21551074808443701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 140.21428571428572, 128, 184, 136.5, 167.0, 184.0, 184.0, 0.10596186886461857, 0.08226531811266775, 0.037666133072969885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35ce23a3-8e52-4e32-bb1c-1115a18b2bf8", 3, 0, 0.0, 446.0, 265, 546, 527.0, 546.0, 546.0, 546.0, 0.022475277195085405, 0.022541122733742886, 0.014412856795025472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 426.66666666666674, 258, 807, 284.0, 788.8, 805.5, 807.0, 0.12498437695288088, 0.19370137326584178, 0.281092793088364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f79bf5e-3799-47ad-b5dd-cb73ab590829", 3, 0, 0.0, 365.3333333333333, 230, 549, 317.0, 549.0, 549.0, 549.0, 0.03169471649076099, 0.02642258103282516, 0.020325062332942432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 185.5, 135, 383, 143.5, 383.0, 383.0, 383.0, 0.03177091055429649, 0.023610998956855103, 0.015947507836824602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 133.5, 127, 145, 130.0, 145.0, 145.0, 145.0, 0.03177158349572142, 0.008501380740066084, 0.018119731212403626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 179.5, 130, 395, 140.0, 395.0, 395.0, 395.0, 0.03177158349572142, 0.008563434614081164, 0.018678216078539353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 175.5, 127, 381, 136.0, 381.0, 381.0, 381.0, 0.031773265974009465, 0.00856388809455724, 0.018710233771804405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 133.0, 132, 134, 133.0, 134.0, 134.0, 134.0, 0.24860161591050342, 0.0733180546923555, 0.15367658483530144], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1496.111111111111, 1013, 2625, 1386.5, 2168.5, 2300.75, 2625.0, 0.24244927646850178, 290.0536236626004, 0.47874261427667053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1162.8333333333335, 262, 2097, 1186.0, 1763.5, 2015.0, 2097.0, 0.09835057883413585, 0.03044641942423932, 0.04437301505993238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15d3a611-e4bc-4860-8048-a93dd3128f3d", 1, 0, 0.0, 916.0, 916, 916, 916.0, 916.0, 916.0, 916.0, 1.0917030567685588, 0.19723150927947597, 0.7526780840611353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 161.5, 126, 388, 129.0, 388.0, 388.0, 388.0, 0.04445679355376493, 0.011982495137538206, 0.02617914698527369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 168.5, 127, 416, 134.0, 416.0, 416.0, 416.0, 0.04444987720721422, 0.011980630966006956, 0.026131666092522418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 330.2142857142857, 129, 1387, 133.5, 1265.0, 1387.0, 1387.0, 0.10431568907963758, 13.433162632816225, 0.060045554288865044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=858fafb8-2066-4519-a66d-a147d514814f", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.2614530571635311, 0.9977613965267729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 296.7142857142857, 127, 1010, 141.0, 884.5, 1010.0, 1010.0, 0.10431568907963758, 4.4058534606729856, 0.06014742507898188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 131.75, 126, 141, 128.5, 141.0, 141.0, 141.0, 0.04452161524420106, 0.011913010329014737, 0.025391233693958418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 187.35714285714283, 128, 401, 131.5, 392.0, 401.0, 401.0, 0.1045119292902147, 0.0776695099510287, 0.0524600895070023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 165.0, 129, 378, 133.5, 378.0, 378.0, 378.0, 0.04451963315822278, 0.03308539143887455, 0.02234676898762354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 187.14285714285717, 126, 430, 128.5, 413.0, 430.0, 430.0, 0.104514269930498, 0.05039080871649011, 0.05835185662135226], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 558.6428571428571, 129, 1170, 549.5, 1043.0, 1170.0, 1170.0, 0.08375710439724798, 0.01617185163027221, 0.05699876607837272], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 186.125, 133, 428, 141.5, 428.0, 428.0, 428.0, 0.0469191699998827, 0.03693051857412642, 0.016678298710895805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1744.3809523809525, 1144, 3795, 1586.0, 2600.2000000000007, 3688.5999999999985, 3795.0, 0.10055015297987561, 0.05204255964778718, 0.046249142630392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 337.75, 264, 794, 270.0, 794.0, 794.0, 794.0, 0.044416807319889846, 0.0688373761881496, 0.09989444068135382], "isController": false}, {"data": ["addBook", 55, 7, 12.727272727272727, 1386.254545454546, 665, 4957, 1066.0, 2320.6, 2655.2, 4957.0, 0.2696078431372549, 83.1456849341299, 0.9805884267769608], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7b02b170-68da-4733-8646-6b90bb056175", 3, 0, 0.0, 463.3333333333333, 224, 635, 531.0, 635.0, 635.0, 635.0, 0.027742072702725197, 0.027823348306346463, 0.0177903265704325], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 231.0185185185185, 126, 599, 140.5, 525.0, 573.5, 599.0, 0.24370320559975808, 0.181111464317789, 0.11780574880066433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f82b601-e132-479b-b536-97b7bc855752", 3, 0, 0.0, 399.6666666666667, 301, 568, 330.0, 568.0, 568.0, 568.0, 0.07574418663367587, 0.034272271946878076, 0.048572932183704905], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 839.9444444444443, 627, 1256, 766.0, 1140.0, 1178.75, 1256.0, 0.24350539544825284, 71.59867140186958, 0.12246609243735374], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 202.64814814814815, 128, 524, 136.5, 421.5, 439.5, 524.0, 0.24417043096081065, 0.43206720791112196, 0.11874694786961298], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1263.5000000000002, 881, 2053, 1254.0, 1624.5, 1734.5, 2053.0, 0.24305711842282937, 218.70322240570286, 0.12200328014583428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 168.14285714285714, 129, 452, 139.0, 388.8000000000002, 451.7, 452.0, 0.126363674655659, 0.09440254991365148, 0.044918337475253776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 7, 4.2682926829268295, 231.7621951219512, 127, 3023, 142.0, 350.5, 518.75, 2265.7499999999936, 0.6945356140075976, 1.5122287168772155, 0.33295822940003134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 142.5, 131, 151, 143.0, 151.0, 151.0, 151.0, 0.03151757104585806, 0.024407650233755317, 0.011203511582707359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5d736c1-8462-441b-a8f8-13eae5cf200b", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/423f79b4-97ca-4ddd-a065-ed9b002368d9", 3, 0, 0.0, 362.0, 227, 556, 303.0, 556.0, 556.0, 556.0, 0.02513657539296846, 0.02521021770369005, 0.01611948356905855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bbf21ca-6d4d-4e18-b9ef-93e00cb30b18", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62f895e2-cd31-4ebd-8b56-aaa7cbf4a0e2", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 138.07142857142858, 131, 163, 135.0, 155.0, 163.0, 163.0, 0.0894048827838126, 0.07255415780600417, 0.03178064192705839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65699b5d-4b4f-4825-92d9-ee4dc84ac357", 3, 0, 0.0, 620.3333333333334, 353, 916, 592.0, 916.0, 916.0, 916.0, 0.023159406192825215, 0.023227256015655756, 0.014851572330685441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 368.3333333333333, 266, 779, 285.5, 779.0, 779.0, 779.0, 0.03174720756853429, 0.049201971104749914, 0.07140021389681099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 558.5, 260, 1770, 280.0, 1657.0, 1770.0, 1770.0, 0.10421474191963555, 17.94944817363665, 0.23057220871979633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae8dde2f-6734-4273-9e50-64697ac9dd3e", 3, 0, 0.0, 356.6666666666667, 240, 515, 315.0, 515.0, 515.0, 515.0, 0.028665615594094883, 0.028749596889780706, 0.01838257250011944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15d3a611-e4bc-4860-8048-a93dd3128f3d", 3, 0, 0.0, 1096.0, 433, 1685, 1170.0, 1685.0, 1685.0, 1685.0, 0.02479912707072711, 0.029311728643818407, 0.01590308604470456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 146.0909090909091, 132, 176, 144.0, 171.8, 176.0, 176.0, 0.05542203882565738, 0.0459504989872882, 0.019700802863807897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab4dd08e-f644-4811-9e25-8c82931ebca8", 3, 0, 0.0, 419.0, 322, 596, 339.0, 596.0, 596.0, 596.0, 0.026133087101579307, 0.02620964888019722, 0.016758522653031002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 172.85714285714286, 129, 397, 136.5, 389.5, 397.0, 397.0, 0.10224052814535682, 0.07937619128472527, 0.03634331273916981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 167.7142857142857, 128, 383, 131.0, 378.0, 382.5, 383.0, 0.12508115384386298, 0.09295581843279271, 0.06278487605053279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 191.85714285714286, 126, 392, 132.0, 388.6, 391.7, 392.0, 0.12508264388971282, 0.033469379322052066, 0.07133619534335185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 228.52380952380955, 128, 428, 134.0, 387.6, 423.99999999999994, 428.0, 0.12508338892595064, 0.03371388217144763, 0.0735353516927952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 204.95238095238093, 127, 413, 133.0, 385.8, 410.29999999999995, 413.0, 0.12508338892595064, 0.03371388217144763, 0.07365750343979319], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 40.0, 0.7942811755361397], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15885623510722796], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15885623510722796], "isController": false}, {"data": ["401/Unauthorized", 11, 44.0, 0.8737092930897538], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1259, 25, "401/Unauthorized", 11, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
