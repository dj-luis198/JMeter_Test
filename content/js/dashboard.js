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

    var data = {"OkPercent": 98.37157660991858, "KoPercent": 1.6284233900814211};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8336532309660909, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49122807017543857, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ed62f8c-0ca4-4062-84fa-2fa4fc68174c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/daa0b4e1-7034-4cd6-ab64-7643a8fc9b01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/751889e5-646e-4638-9f02-ba4030d1dbfa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/16d545d9-66db-4024-ba70-539854533db8"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b5964b7-a869-490c-b46f-a730cdefc11d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d02f8a1-3777-4fb7-b795-3563f9ec1e94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29ec33c6-7718-4a0b-9f1f-fecba6890cbc"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.075, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16d545d9-66db-4024-ba70-539854533db8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53395392-ead6-4bca-a98b-5e6d2cd84f6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=751889e5-646e-4638-9f02-ba4030d1dbfa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cba64eed-8236-416e-92dc-4702da0f675d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0db48ccf-8e16-46e3-9f15-dc17040d63d7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bd54947-d5c7-4956-ba2d-eadf21e14d7a"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6952ae6-b7dd-4400-85ea-3fa412e7ea2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0516cb6d-0f2f-4139-b3a7-8d8aefc9815b"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/abb539cd-13d3-4bf4-8009-5a066d2ca43b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bd54947-d5c7-4956-ba2d-eadf21e14d7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b5964b7-a869-490c-b46f-a730cdefc11d"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daa0b4e1-7034-4cd6-ab64-7643a8fc9b01"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/53395392-ead6-4bca-a98b-5e6d2cd84f6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4140625, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ed62f8c-0ca4-4062-84fa-2fa4fc68174c"], "isController": false}, {"data": [0.8508771929824561, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d02f8a1-3777-4fb7-b795-3563f9ec1e94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9324324324324325, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0db48ccf-8e16-46e3-9f15-dc17040d63d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29ec33c6-7718-4a0b-9f1f-fecba6890cbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6952ae6-b7dd-4400-85ea-3fa412e7ea2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 22, 1.6284233900814211, 264.9467061435978, 80, 2226, 91.0, 658.0, 820.7999999999997, 1376.7200000000003, 5.381183780769537, 737.3359455906955, 3.9478898532721263], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1199.1403508771928, 991, 1586, 1170.0, 1422.2, 1483.7, 1586.0, 0.26289208971538475, 316.3490125980657, 1.292638351286096], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ed62f8c-0ca4-4062-84fa-2fa4fc68174c", 1, 0, 0.0, 938.0, 938, 938, 938.0, 938.0, 938.0, 938.0, 1.0660980810234542, 0.1926056103411514, 0.7350246535181237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daa0b4e1-7034-4cd6-ab64-7643a8fc9b01", 3, 0, 0.0, 263.3333333333333, 169, 392, 229.0, 392.0, 392.0, 392.0, 0.02107111501316945, 0.024905344600526777, 0.013512401229148376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/751889e5-646e-4638-9f02-ba4030d1dbfa", 3, 0, 0.0, 297.6666666666667, 179, 429, 285.0, 429.0, 429.0, 429.0, 0.017411087380443866, 0.024002589536516853, 0.011165313196443495], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 402.0833333333333, 86, 640, 388.5, 622.6, 640.0, 640.0, 0.1047166106723679, 0.019915585867620753, 0.07075700019634365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 402.0833333333333, 86, 640, 388.5, 622.6, 640.0, 640.0, 0.10311050008592543, 0.01961012684739646, 0.06967175148221344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 123.25, 81, 247, 83.0, 246.0, 246.95, 247.0, 0.09275233272116794, 0.031783978077986164, 0.052508327420372126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 113.44999999999999, 82, 298, 84.0, 289.10000000000014, 297.8, 298.0, 0.09275147242962482, 0.06892956105365673, 0.046556891434401525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 131.74999999999997, 82, 563, 84.0, 245.0, 547.0999999999998, 563.0, 0.09275190257340153, 1.3873565099082221, 0.054220008672302894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 148.14999999999998, 81, 720, 83.5, 249.9, 696.4999999999997, 720.0, 0.09275233272116794, 4.196685270755654, 0.0541296816739941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16d545d9-66db-4024-ba70-539854533db8", 3, 0, 0.0, 674.6666666666667, 230, 1558, 236.0, 1558.0, 1558.0, 1558.0, 0.01791900609246207, 0.024702796484888306, 0.011491029297574963], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 217.76923076923075, 85, 359, 229.0, 337.0, 359.0, 359.0, 0.09769147529157148, 0.22517767637068653, 0.0631486737442888], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5b5964b7-a869-490c-b46f-a730cdefc11d", 3, 0, 0.0, 527.3333333333334, 234, 985, 363.0, 985.0, 985.0, 985.0, 0.028391346317642382, 0.02366869723941476, 0.0182066901841652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 94.6875, 82, 249, 83.5, 137.0000000000001, 249.0, 249.0, 0.0881955736846457, 0.0655437808339994, 0.04427004382217568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 94.3125, 81, 247, 83.0, 137.1000000000001, 247.0, 247.0, 0.08819703216986749, 0.023599596498577822, 0.05029986990937755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 465.0, 401, 578, 416.5, 578.0, 578.0, 578.0, 0.07167174341515857, 21.073872289912202, 0.04087529116645762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 696.6666666666666, 577, 820, 730.0, 820.0, 820.0, 820.0, 0.07140222060906094, 64.24784361574895, 0.04065185021004153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 168.83333333333334, 84, 254, 170.0, 254.0, 254.0, 254.0, 0.07195193610668074, 0.1273211994387749, 0.039840573996570296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 94.94117647058823, 82, 248, 85.0, 123.99999999999989, 248.0, 248.0, 0.08994375869676785, 0.0668429691096097, 0.045147550752088546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 121.58823529411765, 80, 250, 83.0, 249.2, 250.0, 250.0, 0.08994708994708994, 0.024067873677248677, 0.05129794973544974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 131.82352941176472, 83, 256, 84.0, 248.0, 256.0, 256.0, 0.08986863320381677, 0.024222405043216242, 0.0528329269420876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 111.64705882352942, 81, 247, 83.0, 245.4, 247.0, 247.0, 0.08986863320381677, 0.024222405043216242, 0.0529206892792007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 111.16666666666667, 82, 249, 83.5, 249.0, 249.0, 249.0, 0.0719527989638797, 0.05347273438624262, 0.04040318301194416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 410.0999999999999, 81, 748, 406.5, 743.0, 747.75, 748.0, 0.09566265521265808, 43.05160469619932, 0.052128673445960165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 125.43750000000001, 82, 249, 85.0, 248.3, 249.0, 249.0, 0.08819654600276716, 0.023771725289808338, 0.051849922552408036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 322.95, 82, 649, 325.5, 577.9, 645.4499999999999, 649.0, 0.09566174008705218, 14.076755841345005, 0.052221594442052904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 93.87500000000001, 81, 245, 83.0, 136.5000000000001, 245.0, 245.0, 0.08819654600276716, 0.023771725289808338, 0.051936051991863866], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 461.58333333333326, 87, 938, 394.0, 882.2000000000002, 938.0, 938.0, 0.10337965316126364, 0.019661315872222748, 0.07066127172049588], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4d02f8a1-3777-4fb7-b795-3563f9ec1e94", 3, 0, 0.0, 315.3333333333333, 183, 498, 265.0, 498.0, 498.0, 498.0, 0.01804435301972248, 0.024875597343269756, 0.011571411278923594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 256.64705882352933, 168, 498, 180.0, 373.9999999999999, 498.0, 498.0, 0.08982684554538106, 0.13921406628957006, 0.20202268094825446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29ec33c6-7718-4a0b-9f1f-fecba6890cbc", 3, 0, 0.0, 284.3333333333333, 179, 486, 188.0, 486.0, 486.0, 486.0, 0.04134851283182181, 0.034470553828872284, 0.02651581063759407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 427.04999999999995, 117, 1082, 400.5, 945.1000000000006, 1076.6499999999999, 1082.0, 0.08853827731073836, 0.054385328543412534, 0.040032443744992055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 84.35000000000001, 82, 89, 84.0, 87.0, 88.9, 89.0, 0.09566082497895462, 0.0710916873134614, 0.04801725003826433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 133.15, 82, 248, 85.0, 247.0, 247.95, 248.0, 0.09566174008705218, 0.09743671378007367, 0.05054004041708519], "isController": false}, {"data": ["login", 20, 0, 0.0, 2299.7, 1048, 4038, 2230.5, 3423.100000000001, 4008.8499999999995, 4038.0, 0.09277814889037334, 33.424225114001146, 0.1861361612113115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 88.5625, 83, 116, 86.0, 102.00000000000001, 116.0, 116.0, 0.09469416743112478, 0.07666158671914301, 0.03366081732903264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16d545d9-66db-4024-ba70-539854533db8", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53395392-ead6-4bca-a98b-5e6d2cd84f6c", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 0.24024476396276595, 0.9168259640957447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=751889e5-646e-4638-9f02-ba4030d1dbfa", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cba64eed-8236-416e-92dc-4702da0f675d", 2, 0, 0.0, 358.5, 304, 413, 358.5, 413.0, 413.0, 413.0, 0.06460783046905284, 0.03795079104212431, 0.04015906649760951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0db48ccf-8e16-46e3-9f15-dc17040d63d7", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 504.3499999999998, 167, 834, 492.5, 828.9, 833.75, 834.0, 0.09562240624223067, 57.27291882315114, 0.20282408824035647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bd54947-d5c7-4956-ba2d-eadf21e14d7a", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 302.95000000000005, 166, 804, 250.5, 544.7, 791.0499999999998, 804.0, 0.09271535458987362, 5.6824960146884305, 0.20733290085483558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 628.1250000000001, 85, 903, 814.5, 903.0, 903.0, 903.0, 0.09341320162071905, 83.82224744865192, 0.17345070921054168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6952ae6-b7dd-4400-85ea-3fa412e7ea2f", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0516cb6d-0f2f-4139-b3a7-8d8aefc9815b", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 970.7272727272729, 198, 2042, 852.0, 1617.1, 1978.849999999999, 2042.0, 0.08609017554569431, 0.027086610629788767, 0.03884146592003006], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 231.43749999999997, 166, 496, 172.5, 383.3000000000001, 496.0, 496.0, 0.0881552413800703, 0.13662340631852693, 0.19826320400224798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 98.5, 84, 266, 86.0, 107.60000000000001, 258.0999999999999, 266.0, 0.14825247396315924, 0.11509835625069494, 0.05269912160409177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abb539cd-13d3-4bf4-8009-5a066d2ca43b", 1, 0, 0.0, 1384.0, 1384, 1384, 1384.0, 1384.0, 1384.0, 1384.0, 0.722543352601156, 0.23073405888728327, 0.4311269418352601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bd54947-d5c7-4956-ba2d-eadf21e14d7a", 3, 0, 0.0, 267.0, 172, 380, 249.0, 380.0, 380.0, 380.0, 0.0233172703248873, 0.027560224137261, 0.014952806816415358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 286.27272727272725, 167, 333, 329.0, 332.8, 333.0, 333.0, 0.06298527289800968, 0.09761487118080209, 0.1416553549649573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 101.5, 81, 262, 84.0, 244.50000000000006, 262.0, 262.0, 0.049657610773715236, 0.03690375175663798, 0.02492579290790003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 99.5, 81, 243, 83.0, 227.80000000000007, 243.0, 243.0, 0.04965785736277051, 0.028204111174011066, 0.027486399954314775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 215.0, 81, 744, 83.5, 743.0, 744.0, 744.0, 0.0494953944535461, 8.917881031013815, 0.028247176287746426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 198.8, 82, 577, 84.0, 576.9, 577.0, 577.0, 0.0495363398589205, 2.9237470092434807, 0.028318919290441467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 771.6842105263158, 643, 1197, 660.0, 1069.2, 1090.1999999999996, 1197.0, 0.25573152676207994, 305.94381267104853, 0.5049698702274665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b5964b7-a869-490c-b46f-a730cdefc11d", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 970.7272727272729, 198, 2042, 852.0, 1617.1, 1978.849999999999, 2042.0, 0.08762845534931889, 0.027570600653230304, 0.039535494503305985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 83.28571428571429, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.041138719763040975, 0.011088170561132137, 0.024225242204212603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 129.57142857142856, 83, 245, 85.0, 245.0, 245.0, 245.0, 0.041100072805843255, 0.01107775399844994, 0.024162347489372696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daa0b4e1-7034-4cd6-ab64-7643a8fc9b01", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 141.3, 80, 746, 84.0, 248.70000000000002, 721.1499999999996, 746.0, 0.15844219632572545, 7.168898205345047, 0.09246587551196635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 112.0, 81, 409, 83.0, 308.2000000000005, 405.19999999999993, 409.0, 0.15845223853399987, 2.370083400345426, 0.09262647459614486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 105.85714285714286, 81, 246, 83.0, 246.0, 246.0, 246.0, 0.04113920330994275, 0.011007950885668277, 0.02346220188770173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 84.45, 82, 98, 84.0, 86.80000000000001, 97.44999999999999, 98.0, 0.15845223853399987, 0.1177560093011464, 0.07953559629538666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 83.14285714285715, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.0411382362275062, 0.030572458758918186, 0.02064946623138495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 91.60000000000001, 81, 248, 83.0, 89.60000000000001, 240.09999999999988, 248.0, 0.15844345153214817, 0.05429473353772539, 0.08969694223943975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 113.57142857142857, 84, 282, 86.0, 282.0, 282.0, 282.0, 0.03926495994974086, 0.030905818085440552, 0.013957466232134442], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 544.25, 90, 1558, 492.0, 1284.400000000001, 1558.0, 1558.0, 0.10658424151989128, 0.02002791452387931, 0.07253938898363044], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1286.6000000000001, 702, 2226, 1231.0, 1881.3000000000006, 2210.1, 2226.0, 0.09062362648566108, 0.046904806677148796, 0.041683328197994494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53395392-ead6-4bca-a98b-5e6d2cd84f6c", 3, 0, 0.0, 722.0, 359, 1192, 615.0, 1192.0, 1192.0, 1192.0, 0.02297160709363227, 0.027151661900058195, 0.014731141267726422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 213.85714285714286, 166, 330, 170.0, 330.0, 330.0, 330.0, 0.041079571129277404, 0.06366531189664379, 0.09238891827219323], "isController": false}, {"data": ["addBook", 64, 12, 18.75, 773.9687499999998, 426, 1437, 699.5, 1215.5, 1405.5, 1437.0, 0.31045957719286327, 82.42501863060647, 1.1318443982056408], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 146.14035087719293, 82, 342, 85.0, 335.2, 337.0, 342.0, 0.2563929559408947, 0.1905420307334188, 0.12393995428783483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ed62f8c-0ca4-4062-84fa-2fa4fc68174c", 3, 0, 0.0, 355.0, 158, 646, 261.0, 646.0, 646.0, 646.0, 0.025777846518701828, 0.025853367553424586, 0.01653071537820397], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 462.29824561403507, 401, 664, 412.0, 574.8, 604.5999999999997, 664.0, 0.25635605607451417, 75.3771923080815, 0.12892907117028787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d02f8a1-3777-4fb7-b795-3563f9ec1e94", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 118.3684210526316, 80, 339, 85.0, 249.0, 251.39999999999998, 339.0, 0.2567290022700249, 0.45428999229812994, 0.12485453430710193], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 623.7894736842105, 559, 819, 573.0, 738.2, 753.6999999999996, 819.0, 0.25616595958869637, 230.4985807296348, 0.12858330393416983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 86.0, 84, 92, 85.0, 91.4, 92.0, 92.0, 0.06471501859085989, 0.048346669162117, 0.023004166764719725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 12, 6.486486486486487, 135.95135135135126, 83, 640, 89.0, 252.20000000000002, 342.49999999999994, 512.719999999998, 0.7720879762948124, 1.5848548487646592, 0.3734380542861316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 119.49999999999999, 84, 250, 86.5, 249.8, 250.0, 250.0, 0.050906647390016185, 0.03942282361355746, 0.018095722314419818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 97.9, 83, 275, 87.0, 110.40000000000003, 266.8499999999999, 275.0, 0.09196543938787803, 0.07463210950324868, 0.03269083978240977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 349.8, 166, 1006, 174.0, 987.2, 1006.0, 1006.0, 0.049474824735433375, 11.899159175353622, 0.1087383208491859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 239.35, 165, 830, 170.0, 408.00000000000017, 809.2499999999998, 830.0, 0.1583380834758376, 9.704493201853348, 0.354080446632149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 89.64705882352943, 84, 103, 88.0, 99.8, 103.0, 103.0, 0.09214541630757056, 0.07639790863781973, 0.03275481595308172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 90.0, 84, 122, 86.0, 112.10000000000004, 121.6, 122.0, 0.09579278105601961, 0.07437037201126523, 0.034051340141006976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0db48ccf-8e16-46e3-9f15-dc17040d63d7", 3, 0, 0.0, 546.0, 175, 899, 564.0, 899.0, 899.0, 899.0, 0.08994423457456377, 0.040697423847214725, 0.0576790827187144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 84.09090909090908, 81, 86, 84.0, 86.0, 86.0, 86.0, 0.06301522104020944, 0.046830647667577524, 0.031630687123698875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29ec33c6-7718-4a0b-9f1f-fecba6890cbc", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 142.1818181818182, 81, 247, 85.0, 246.6, 247.0, 247.0, 0.06301738706997793, 0.01686207427458394, 0.03593960356334679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 186.0909090909091, 82, 246, 243.0, 246.0, 246.0, 246.0, 0.06301702605467586, 0.01698505780379935, 0.03704711883292468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6952ae6-b7dd-4400-85ea-3fa412e7ea2f", 3, 0, 0.0, 325.3333333333333, 225, 510, 241.0, 510.0, 510.0, 510.0, 0.04424713499800888, 0.02844664440789959, 0.028374627586613767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 142.54545454545453, 82, 248, 84.0, 248.0, 248.0, 248.0, 0.06301702605467586, 0.01698505780379935, 0.037108658897431195], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.44411547002220575], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07401924500370097], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07401924500370097], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0362694300518134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
