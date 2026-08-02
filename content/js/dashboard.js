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

    var data = {"OkPercent": 98.29721362229103, "KoPercent": 1.7027863777089782};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7788461538461539, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21a7b486-e631-42e9-937b-d2cea7e67ba1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0262d8f9-342a-4450-8a77-7c38328f59d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/420e6b9a-cb4f-4452-b80b-6a379a042506"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d3f5040b-1a75-4890-972d-d78ae7910325"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82e7638c-8aa8-4667-94df-5bc783d64d5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47b31191-729e-484b-94a6-ebabf2613c88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f939bb5-2ec0-4372-be99-a0952e8bf0f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7369d0a-accb-444e-8596-89ea400c502d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15c9b2b8-5724-4c8e-9742-2ce8978a62d4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7aacc585-4cb1-46e8-9d21-e09a2127a0a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ab6a4d2-e1c3-4b32-8434-a5126561fe64"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98646637-c970-4b38-a58c-f69909c7b68f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7369d0a-accb-444e-8596-89ea400c502d"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47b31191-729e-484b-94a6-ebabf2613c88"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3f5040b-1a75-4890-972d-d78ae7910325"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8374c4c-dc30-4eb3-87ed-2f3314c532f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0262d8f9-342a-4450-8a77-7c38328f59d5"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=420e6b9a-cb4f-4452-b80b-6a379a042506"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7aacc585-4cb1-46e8-9d21-e09a2127a0a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6f939bb5-2ec0-4372-be99-a0952e8bf0f6"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42727272727272725, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/075e3247-5f71-4ee1-a017-e01cefe3182b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fef8970a-3829-4a66-b81d-9beedbb8fac3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82e7638c-8aa8-4667-94df-5bc783d64d5d"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5727272727272728, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9421965317919075, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ab6a4d2-e1c3-4b32-8434-a5126561fe64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6270823b-e11c-495a-8911-b5e429324d4f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fef8970a-3829-4a66-b81d-9beedbb8fac3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21a7b486-e631-42e9-937b-d2cea7e67ba1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98646637-c970-4b38-a58c-f69909c7b68f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd8cbc18-c379-4dba-a075-6c2bec6fec13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 22, 1.7027863777089782, 360.647832817338, 96, 2324, 117.5, 1015.7, 1245.2499999999986, 1581.8899999999983, 4.98516412070888, 686.4151662681976, 3.6374446427813516], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1677.8000000000002, 1289, 2152, 1649.0, 1980.6, 2088.6, 2152.0, 0.24278487494371806, 292.1515581822917, 1.1937713333414262], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 621.9333333333333, 106, 1132, 579.0, 1073.2, 1132.0, 1132.0, 0.0728279076542131, 0.014821617143689462, 0.048803232648751], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 621.9333333333333, 106, 1132, 579.0, 1073.2, 1132.0, 1132.0, 0.07235994732195834, 0.01472637990419543, 0.048489644387038885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21a7b486-e631-42e9-937b-d2cea7e67ba1", 1, 0, 0.0, 975.0, 975, 975, 975.0, 975.0, 975.0, 975.0, 1.0256410256410255, 0.18529647435897437, 0.7071314102564102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0262d8f9-342a-4450-8a77-7c38328f59d5", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 132.23076923076923, 96, 304, 101.0, 302.0, 304.0, 304.0, 0.06525350988590675, 0.04007757638425282, 0.03595021345426984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 101.53846153846153, 98, 105, 101.0, 105.0, 105.0, 105.0, 0.06525187222679543, 0.04849284644979621, 0.032753381176340676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 304.1538461538462, 99, 907, 106.0, 871.4, 907.0, 907.0, 0.06525187222679543, 4.441117322238842, 0.03713062891511233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 360.0, 99, 1308, 103.0, 1218.3999999999999, 1308.0, 1308.0, 0.06525154470483714, 13.562787475405186, 0.03706672033187939], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/420e6b9a-cb4f-4452-b80b-6a379a042506", 3, 0, 0.0, 296.3333333333333, 202, 468, 219.0, 468.0, 468.0, 468.0, 0.05333333333333333, 0.03428819444444445, 0.03420138888888889], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 208.99999999999997, 101, 348, 207.0, 321.0, 348.0, 348.0, 0.07300691132093838, 0.1378243103888835, 0.0471835682736299], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d3f5040b-1a75-4890-972d-d78ae7910325", 3, 0, 0.0, 932.6666666666666, 303, 1255, 1240.0, 1255.0, 1255.0, 1255.0, 0.030879764490329486, 0.025743189081944604, 0.019802453139957387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82e7638c-8aa8-4667-94df-5bc783d64d5d", 3, 0, 0.0, 404.0, 241, 674, 297.0, 674.0, 674.0, 674.0, 0.019142175316803, 0.02262540318206761, 0.0122754184160488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47b31191-729e-484b-94a6-ebabf2613c88", 3, 0, 0.0, 344.6666666666667, 219, 467, 348.0, 467.0, 467.0, 467.0, 0.02632271650434325, 0.026399833837852067, 0.016880127445819074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 132.4444444444444, 98, 414, 103.0, 306.90000000000015, 414.0, 414.0, 0.11494252873563218, 0.0854211566091954, 0.05769576149425287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 157.88888888888886, 97, 310, 103.0, 302.8, 310.0, 310.0, 0.11479884690935993, 0.040296687256052455, 0.06493558907752749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 747.5, 604, 806, 790.0, 806.0, 806.0, 806.0, 0.06619886137958426, 19.46466325466702, 0.037754038130544156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1085.0, 997, 1212, 1065.5, 1212.0, 1212.0, 1212.0, 0.06595000989250148, 59.341934829024595, 0.03754771071028161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 200.5, 102, 307, 196.5, 307.0, 307.0, 307.0, 0.06672226855713094, 0.11806713928273561, 0.03694484987489575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f939bb5-2ec0-4372-be99-a0952e8bf0f6", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7369d0a-accb-444e-8596-89ea400c502d", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 120.28571428571428, 98, 305, 105.0, 212.5, 305.0, 305.0, 0.08597554609824548, 0.06389393611402815, 0.04315569403759588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 101.57142857142857, 98, 103, 102.0, 103.0, 103.0, 103.0, 0.08597343420882947, 0.023004610325409448, 0.049031724197223056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 158.07142857142856, 98, 306, 103.5, 306.0, 306.0, 306.0, 0.08597396217145664, 0.023172669491525424, 0.050543286354704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 157.21428571428575, 98, 304, 103.0, 303.0, 304.0, 304.0, 0.0859744901405683, 0.02317281179570005, 0.05062755620582293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15c9b2b8-5724-4c8e-9742-2ce8978a62d4", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7aacc585-4cb1-46e8-9d21-e09a2127a0a1", 3, 0, 0.0, 406.6666666666667, 252, 618, 350.0, 618.0, 618.0, 618.0, 0.04977600796416127, 0.03200117699518832, 0.031920161357225814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 109.0, 104, 122, 105.0, 122.0, 122.0, 122.0, 0.06694784762669881, 0.04975323441788847, 0.03759278553257013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 847.7857142857143, 99, 1413, 1096.5, 1361.5, 1413.0, 1413.0, 0.06697410972272719, 43.05045878760118, 0.035262317256357756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ab6a4d2-e1c3-4b32-8434-a5126561fe64", 3, 0, 0.0, 346.33333333333337, 207, 620, 212.0, 620.0, 620.0, 620.0, 0.026583018767611252, 0.026660898705406985, 0.017047053050844453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 192.61111111111111, 98, 951, 103.0, 367.8000000000009, 951.0, 951.0, 0.11479884690935993, 5.767900897105156, 0.0669410810862522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 606.7142857142859, 102, 919, 786.0, 866.5, 919.0, 919.0, 0.06697250778555403, 14.070972470711487, 0.03532687666534316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 161.33333333333334, 97, 779, 102.0, 350.6000000000007, 779.0, 779.0, 0.11494252873563218, 1.9068661198914432, 0.06713711286717752], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 579.1428571428571, 105, 1622, 468.0, 1305.0, 1622.0, 1622.0, 0.06886069972308162, 0.01356463560393293, 0.0467749367957149], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 294.9285714285714, 198, 597, 215.0, 506.0, 597.0, 597.0, 0.0859206706722065, 0.1331602581609294, 0.1932376021075113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98646637-c970-4b38-a58c-f69909c7b68f", 1, 0, 0.0, 1622.0, 1622, 1622, 1622.0, 1622.0, 1622.0, 1622.0, 0.6165228113440198, 0.11138351572133168, 0.4250635789149198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7369d0a-accb-444e-8596-89ea400c502d", 3, 0, 0.0, 438.0, 223, 791, 300.0, 791.0, 791.0, 791.0, 0.04917468487222778, 0.031166377423902176, 0.03153454726506794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 608.3333333333333, 110, 1624, 530.0, 1185.2000000000003, 1584.6999999999994, 1624.0, 0.08794706424323645, 0.05402217129784739, 0.03976512768029148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 116.78571428571429, 100, 294, 104.0, 200.5, 294.0, 294.0, 0.06697122629098998, 0.04977060860101892, 0.03361641632184458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 161.50000000000003, 99, 310, 104.0, 309.5, 310.0, 310.0, 0.06697314855122728, 0.08977092791297318, 0.03417798233822397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47b31191-729e-484b-94a6-ebabf2613c88", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["login", 21, 0, 0.0, 2614.190476190476, 1682, 3752, 2560.0, 3353.8, 3714.1999999999994, 3752.0, 0.08931267516980042, 20.47636782627834, 0.1629632364042717], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3f5040b-1a75-4890-972d-d78ae7910325", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 106.16666666666667, 100, 115, 105.5, 113.2, 115.0, 115.0, 0.11213486085932681, 0.09078105434802924, 0.039860438821088834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8374c4c-dc30-4eb3-87ed-2f3314c532f2", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0262d8f9-342a-4450-8a77-7c38328f59d5", 3, 0, 0.0, 325.3333333333333, 190, 487, 299.0, 487.0, 487.0, 487.0, 0.01989046981289698, 0.027420618378131093, 0.0127552817485049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 981.142857142857, 204, 1516, 1200.0, 1465.5, 1516.0, 1516.0, 0.06693792463745941, 57.23037538429541, 0.13831160739472817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 508.15384615384613, 202, 1408, 394.0, 1320.0, 1408.0, 1408.0, 0.06521782754399695, 18.08310264094576, 0.14282567055214418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 5, 55.55555555555556, 587.7777777777778, 101, 1317, 103.0, 1317.0, 1317.0, 1317.0, 0.0991801110817244, 52.7498073219717, 0.13571618715837963], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1086.0, 275, 1769, 1075.0, 1587.8000000000002, 1736.5999999999995, 1769.0, 0.0909026235287608, 0.028777596850816937, 0.041012707099890126], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=420e6b9a-cb4f-4452-b80b-6a379a042506", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7aacc585-4cb1-46e8-9d21-e09a2127a0a1", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 122.0, 104, 313, 109.0, 160.19999999999987, 313.0, 313.0, 0.08663479865053561, 0.06726041496794513, 0.03079596358280758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 361.33333333333337, 203, 1366, 227.5, 674.8000000000011, 1366.0, 1366.0, 0.11472640938207082, 7.793073940772491, 0.25639161541158095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f939bb5-2ec0-4372-be99-a0952e8bf0f6", 3, 0, 0.0, 698.0, 197, 1347, 550.0, 1347.0, 1347.0, 1347.0, 0.016452058700945446, 0.02268049108024217, 0.010550311081009936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 319.66666666666663, 203, 603, 304.5, 439.2000000000003, 603.0, 603.0, 0.13125560570816044, 0.20342055298715883, 0.29519693354091164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 123.8, 99, 295, 104.0, 276.9000000000001, 295.0, 295.0, 0.04973070821501569, 0.036958075148073186, 0.0249624843969903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 162.20000000000002, 99, 304, 103.5, 304.0, 304.0, 304.0, 0.04968524397939056, 0.013294684424172865, 0.02833611570699618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 101.3, 98, 108, 101.5, 107.5, 108.0, 108.0, 0.04973342882151667, 0.013404713237049415, 0.029237816553274447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 182.70000000000002, 99, 311, 104.5, 310.7, 311.0, 311.0, 0.04968771272552011, 0.013392391320550341, 0.029259463645984984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 0.22138587558113793, 0.06529153752490591, 0.13685279222935576], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1138.7636363636366, 772, 1684, 1113.0, 1518.6, 1635.9999999999998, 1684.0, 0.25383287643415575, 303.6723668011981, 0.5012207774901005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1086.0, 275, 1769, 1075.0, 1587.8000000000002, 1736.5999999999995, 1769.0, 0.08939572377498708, 0.028300548423331504, 0.040332836312542995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 180.89999999999998, 100, 304, 108.0, 303.1, 304.0, 304.0, 0.05367888219095726, 0.014468136215531448, 0.03160973238393284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 162.9, 99, 306, 105.0, 305.9, 306.0, 306.0, 0.053620452985586826, 0.014452387718771447, 0.03152296161847975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 179.41176470588235, 97, 1221, 102.0, 481.79999999999933, 1221.0, 1221.0, 0.08715535185128222, 4.6351997796123126, 0.05079723115137347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 162.64705882352942, 97, 608, 103.0, 451.1999999999999, 608.0, 608.0, 0.08715669235225658, 1.5295779212872531, 0.0508831264002748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 116.00000000000001, 98, 306, 104.0, 153.19999999999987, 306.0, 306.0, 0.08715490502678731, 0.06477039328650894, 0.0437476769372741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 122.4, 97, 303, 102.0, 283.50000000000006, 303.0, 303.0, 0.05362102802234925, 0.014347814138792669, 0.030580742543996054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 139.1764705882353, 98, 316, 103.0, 308.8, 316.0, 316.0, 0.08715579868035866, 0.031021216028464058, 0.049275469359609955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 143.0, 97, 305, 104.5, 303.9, 305.0, 305.0, 0.05367772964674686, 0.03989135963005309, 0.026943704139089735], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 554.5, 103, 1255, 556.5, 1023.0, 1255.0, 1255.0, 0.06896755569130122, 0.01331628028414633, 0.046934115047735404], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 108.10000000000001, 102, 131, 106.0, 128.9, 131.0, 131.0, 0.0520648936834871, 0.040980765926650974, 0.018507442676552053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1427.2380952380952, 1057, 2324, 1382.0, 1881.8000000000002, 2285.3999999999996, 2324.0, 0.0881208850693847, 0.04560944246755263, 0.040532164909843946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/075e3247-5f71-4ee1-a017-e01cefe3182b", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.5449418728668942, 1.0182247226962458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fef8970a-3829-4a66-b81d-9beedbb8fac3", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5772014776357828, 2.2027256389776357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 346.5, 206, 601, 308.0, 601.0, 601.0, 601.0, 0.053589706489177553, 0.08305357831867655, 0.12052450590290617], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 1078.593220338983, 525, 2211, 849.0, 1943.0, 2069.0, 2211.0, 0.28268483515641096, 87.0681036504075, 1.02833533668243], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82e7638c-8aa8-4667-94df-5bc783d64d5d", 1, 0, 0.0, 988.0, 988, 988, 988.0, 988.0, 988.0, 988.0, 1.0121457489878543, 0.18285836285425103, 0.6978270495951417], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 181.16363636363633, 98, 546, 105.0, 405.0, 413.4, 546.0, 0.25473458971520674, 0.18930959255202376, 0.1231383026455345], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 631.4909090909091, 483, 974, 588.0, 905.6, 917.6, 974.0, 0.25467915057557483, 74.88412641289047, 0.12808570561173932], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 152.01818181818177, 98, 322, 105.0, 306.0, 310.2, 322.0, 0.2551588479809976, 0.4515115552163747, 0.12409092411575862], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 953.8727272727272, 667, 1309, 957.0, 1213.6, 1267.8, 1309.0, 0.25437878388441026, 228.89047688939843, 0.1276862255044794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 122.66666666666666, 102, 347, 107.0, 148.1000000000003, 347.0, 347.0, 0.12577561630051987, 0.09396322897450948, 0.04470930110682542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 7, 4.046242774566474, 181.8612716763006, 99, 1567, 110.0, 321.0, 460.0999999999997, 883.2399999999916, 0.7585057874430025, 1.6136830415862855, 0.36559009585452473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 117.6, 102, 158, 110.5, 155.8, 158.0, 158.0, 0.05100869698283557, 0.03950185225330919, 0.018131997755617333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ab6a4d2-e1c3-4b32-8434-a5126561fe64", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 115.46153846153848, 101, 140, 111.0, 139.2, 140.0, 140.0, 0.06330624150844165, 0.05137449872413575, 0.022503390536203864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 309.2, 204, 605, 218.5, 585.8000000000001, 605.0, 605.0, 0.04965687102124321, 0.07695845147530564, 0.11167946675969054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6270823b-e11c-495a-8911-b5e429324d4f", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fef8970a-3829-4a66-b81d-9beedbb8fac3", 3, 0, 0.0, 458.6666666666667, 239, 574, 563.0, 574.0, 574.0, 574.0, 0.07902431314701155, 0.035756443774201195, 0.0506763987303427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 328.47058823529414, 201, 1528, 209.0, 727.9999999999993, 1528.0, 1528.0, 0.08710801393728224, 6.257145579268292, 0.1945969412917606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21a7b486-e631-42e9-937b-d2cea7e67ba1", 3, 0, 0.0, 290.3333333333333, 206, 444, 221.0, 444.0, 444.0, 444.0, 0.02005240361477996, 0.027630802246537616, 0.012859126015988449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 106.49999999999999, 100, 126, 105.5, 117.0, 126.0, 126.0, 0.09213617727000507, 0.07639024853733818, 0.032751531763947114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98646637-c970-4b38-a58c-f69909c7b68f", 3, 0, 0.0, 414.3333333333333, 206, 620, 417.0, 620.0, 620.0, 620.0, 0.03734641287704316, 0.024010144997447996, 0.02394935982023927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd8cbc18-c379-4dba-a075-6c2bec6fec13", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 107.85714285714286, 100, 119, 106.0, 118.5, 119.0, 119.0, 0.06721720760514692, 0.05218523442001152, 0.023893616765892068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 114.22222222222221, 98, 296, 103.5, 128.60000000000025, 296.0, 296.0, 0.1315472144877332, 0.09776116232926269, 0.06603053539716297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 136.0, 97, 315, 103.0, 307.8, 315.0, 315.0, 0.1315433691180017, 0.0351981280647778, 0.07502082770011036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 155.72222222222217, 97, 307, 103.0, 304.3, 307.0, 307.0, 0.13154529177476523, 0.035455566923667185, 0.07733424379727409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 191.16666666666669, 99, 316, 105.0, 308.8, 316.0, 316.0, 0.13135330390046338, 0.03540382019192177, 0.07734965063669866], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.38699690402476783], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 13.636363636363637, 0.23219814241486067], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15479876160990713], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9287925696594427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 22, "401/Unauthorized", 12, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
