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

    var data = {"OkPercent": 96.82890855457227, "KoPercent": 3.1710914454277286};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7973651191969887, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/111277f5-c9e7-4f63-b911-953ac0583d79"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cf147df-a6b8-4d9d-a224-33f9d27e4c58"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b335d4e-1ac4-41bc-a878-5e385cf656be"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0205cc4a-a483-47b6-80a5-fad71554bd74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a12e8827-1182-49f1-baf6-e1045f686b33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7d9a615-a197-468f-b304-6d4979f448ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e765d412-0450-4424-a71c-024bfc86958d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc6bcfb3-6b98-4189-b4dc-351af0528588"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=829dcc22-3403-4a26-9356-d5422b0c85df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f76cd9e-bc4b-41b0-9f3d-1a1322e6bcce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1259b80-78ea-4baa-b2ee-b55793af545b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a12e8827-1182-49f1-baf6-e1045f686b33"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cf147df-a6b8-4d9d-a224-33f9d27e4c58"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd774c7b-4f4b-442d-8917-e7c013eedc37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25462bb8-1fed-48e3-94b2-a5fab0800502"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0205cc4a-a483-47b6-80a5-fad71554bd74"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=111277f5-c9e7-4f63-b911-953ac0583d79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b335d4e-1ac4-41bc-a878-5e385cf656be"], "isController": false}, {"data": [0.8050847457627118, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d56a845d-1724-425d-842a-0adcc8be6c7a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9142011834319527, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f1c2c76-eaaf-40fc-80b7-46f115d39f39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e765d412-0450-4424-a71c-024bfc86958d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7d9a615-a197-468f-b304-6d4979f448ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d56a845d-1724-425d-842a-0adcc8be6c7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/829dcc22-3403-4a26-9356-d5422b0c85df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1259b80-78ea-4baa-b2ee-b55793af545b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc6bcfb3-6b98-4189-b4dc-351af0528588"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25462bb8-1fed-48e3-94b2-a5fab0800502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd774c7b-4f4b-442d-8917-e7c013eedc37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1356, 43, 3.1710914454277286, 300.4756637168142, 80, 1822, 95.0, 843.7999999999997, 1046.2999999999997, 1313.7200000000003, 5.4829305374161486, 796.8626761368691, 4.007225914125016], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/111277f5-c9e7-4f63-b911-953ac0583d79", 3, 0, 0.0, 281.3333333333333, 215, 373, 256.0, 373.0, 373.0, 373.0, 0.01775894014645206, 0.02448213265632307, 0.011388382841312031], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1362.8813559322039, 989, 1970, 1323.0, 1629.0, 1670.0, 1970.0, 0.2564592968668498, 308.6076562608669, 1.2610083591060437], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cf147df-a6b8-4d9d-a224-33f9d27e4c58", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.038299209770115, 3.9623742816091956], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 416.16666666666663, 83, 1407, 403.5, 891.3000000000009, 1407.0, 1407.0, 0.0929195316855603, 0.019736326310165395, 0.06192114842088418], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 416.16666666666663, 83, 1407, 403.5, 891.3000000000009, 1407.0, 1407.0, 0.09172582132829181, 0.01948277943252292, 0.06112566533069707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 150.45454545454547, 81, 251, 88.0, 247.0, 250.39999999999998, 251.0, 0.10984292461779654, 0.04438964780364079, 0.06180614845770548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 114.95454545454548, 82, 260, 84.0, 253.7, 259.55, 260.0, 0.1099301943266026, 0.08169616980717244, 0.055179804574095444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 179.68181818181816, 81, 649, 85.5, 410.39999999999986, 623.6499999999996, 649.0, 0.1099296450271826, 2.965387308372642, 0.06387513553825552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 183.09090909090907, 82, 962, 84.5, 584.1999999999996, 926.7499999999995, 962.0, 0.1099296450271826, 9.019198416138671, 0.06376778236928367], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 209.05555555555557, 82, 411, 176.5, 410.1, 411.0, 411.0, 0.09231147944531058, 0.14133192002748832, 0.059652888003097565], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7b335d4e-1ac4-41bc-a878-5e385cf656be", 3, 0, 0.0, 468.6666666666667, 410, 573, 423.0, 573.0, 573.0, 573.0, 0.0757346258709482, 0.034267945950722, 0.04856680109562758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0205cc4a-a483-47b6-80a5-fad71554bd74", 1, 0, 0.0, 794.0, 794, 794, 794.0, 794.0, 794.0, 794.0, 1.2594458438287153, 0.22753660264483627, 0.8683288727959697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 102.78947368421053, 83, 247, 84.0, 245.0, 247.0, 247.0, 0.10980564401010212, 0.08160360848797629, 0.0551172861535083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 590.111111111111, 402, 751, 650.0, 751.0, 751.0, 751.0, 0.04535033130936484, 13.33450317767252, 0.025863860824872135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 101.78947368421052, 81, 249, 83.0, 243.0, 249.0, 249.0, 0.10980691321208338, 0.04674243704885252, 0.0616535115094983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 857.5555555555555, 573, 1141, 854.0, 1141.0, 1141.0, 1141.0, 0.04532315408865209, 40.781853718575945, 0.025804100423519695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a12e8827-1182-49f1-baf6-e1045f686b33", 3, 0, 0.0, 322.6666666666667, 166, 411, 391.0, 411.0, 411.0, 411.0, 0.04555670290955476, 0.029288570392698776, 0.02921442211322359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 140.55555555555554, 82, 273, 83.0, 273.0, 273.0, 273.0, 0.045499815472970585, 0.08051334534865498, 0.025193745481615546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 83.44444444444444, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.06162441970338113, 0.045797054095969764, 0.030932570046423732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 101.0, 81, 244, 83.0, 244.0, 244.0, 244.0, 0.06162526361918327, 0.01648957249185177, 0.03514565815781545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 118.88888888888889, 81, 246, 84.0, 246.0, 246.0, 246.0, 0.06162484165839296, 0.01660982060323873, 0.036228666678078676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7d9a615-a197-468f-b304-6d4979f448ea", 3, 0, 0.0, 488.6666666666667, 247, 848, 371.0, 848.0, 848.0, 848.0, 0.022868119554529033, 0.02293511599853644, 0.014664777188288472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 126.55555555555557, 82, 312, 83.0, 312.0, 312.0, 312.0, 0.06162526361918327, 0.01660993433485799, 0.03628909566637451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e765d412-0450-4424-a71c-024bfc86958d", 3, 0, 0.0, 311.66666666666663, 169, 569, 197.0, 569.0, 569.0, 569.0, 0.017111665022045527, 0.02358981164334727, 0.010973300811663311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 83.22222222222221, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.04549958544822147, 0.03381365676376615, 0.0255490836257103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 555.2352941176471, 81, 1144, 885.0, 1084.0, 1144.0, 1144.0, 0.07694919090188979, 36.66571040087133, 0.04173680264795745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 209.89473684210526, 81, 1064, 85.0, 969.0, 1064.0, 1064.0, 0.10980627860742521, 10.426889516823477, 0.06356076838388275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 320.88235294117646, 81, 648, 486.0, 588.8, 648.0, 648.0, 0.076893154699981, 11.979298002247994, 0.041781499902752775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 145.10526315789474, 81, 739, 84.0, 404.0, 739.0, 739.0, 0.10980627860742521, 3.425079970756854, 0.06366800107783531], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 396.7222222222222, 85, 1057, 385.5, 988.6000000000001, 1057.0, 1057.0, 0.09190613320262239, 0.019521078097236688, 0.06154499794487674], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 229.33333333333331, 167, 396, 169.0, 396.0, 396.0, 396.0, 0.06158899609936358, 0.0954509148532129, 0.13851509571956477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 473.95833333333337, 94, 998, 490.0, 879.0, 977.75, 998.0, 0.10416666666666667, 0.06398518880208333, 0.047098795572916664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 84.6470588235294, 82, 94, 84.0, 92.4, 94.0, 94.0, 0.07694884259887927, 0.05718561447045618, 0.03862471200764057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 171.76470588235293, 81, 270, 246.0, 255.6, 270.0, 270.0, 0.07694953920805345, 0.08177656682841158, 0.04046392933769079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc6bcfb3-6b98-4189-b4dc-351af0528588", 3, 0, 0.0, 263.0, 172, 383, 234.0, 383.0, 383.0, 383.0, 0.07955238524568428, 0.03599538264697303, 0.051015038715494156], "isController": false}, {"data": ["login", 24, 0, 0.0, 2238.1249999999995, 1260, 3435, 2230.0, 3158.0, 3413.25, 3435.0, 0.10200351912140969, 45.897686253378865, 0.2173302517999371], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=829dcc22-3403-4a26-9356-d5422b0c85df", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 98.57894736842107, 83, 248, 86.0, 132.0, 248.0, 248.0, 0.1055573148441363, 0.0854560683650283, 0.03752232676100157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f76cd9e-bc4b-41b0-9f3d-1a1322e6bcce", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1259b80-78ea-4baa-b2ee-b55793af545b", 3, 0, 0.0, 337.3333333333333, 193, 519, 300.0, 519.0, 519.0, 519.0, 0.03137484574034177, 0.025502275329958794, 0.020119936884268653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a12e8827-1182-49f1-baf6-e1045f686b33", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 660.3529411764706, 167, 1228, 971.0, 1168.8, 1228.0, 1228.0, 0.0768639508070715, 48.73865055726365, 0.16245722323325948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cf147df-a6b8-4d9d-a224-33f9d27e4c58", 3, 0, 0.0, 320.6666666666667, 177, 453, 332.0, 453.0, 453.0, 453.0, 0.10007672548954198, 0.046454886246122026, 0.06417680638489509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, 52.63157894736842, 495.2631578947369, 82, 1225, 87.0, 1144.0, 1225.0, 1225.0, 0.08797273771159758, 49.865747525187984, 0.1246431171750565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 343.7727272727273, 168, 1046, 327.5, 721.1999999999998, 1011.0499999999995, 1046.0, 0.10979632781190891, 12.096018916160522, 0.24438065825393893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd774c7b-4f4b-442d-8917-e7c013eedc37", 3, 0, 0.0, 258.6666666666667, 177, 349, 250.0, 349.0, 349.0, 349.0, 0.049778485738463836, 0.032586111595068606, 0.031921750294522704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25462bb8-1fed-48e3-94b2-a5fab0800502", 3, 0, 0.0, 266.0, 176, 351, 271.0, 351.0, 351.0, 351.0, 0.04794706643865173, 0.030825343820422253, 0.030747304975307258], "isController": false}, {"data": ["register", 28, 9, 32.142857142857146, 828.3928571428572, 146, 1331, 854.5, 1288.8, 1327.4, 1331.0, 0.10925081255291837, 0.03418660331420144, 0.04929089394477371], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 322.15789473684214, 166, 1311, 171.0, 1055.0, 1311.0, 1311.0, 0.10975236400815633, 13.97345143566201, 0.24387972621117512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 99.00000000000001, 83, 250, 87.0, 160.60000000000005, 250.0, 250.0, 0.12377973808207421, 0.0960985271242666, 0.04399982877136232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 238.69230769230768, 166, 416, 175.0, 382.79999999999995, 416.0, 416.0, 0.07133137263509064, 0.11054969567567272, 0.160425928885365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 156.63636363636363, 81, 354, 85.0, 341.6, 354.0, 354.0, 0.05427220966834746, 0.04033315581798088, 0.027242105243682223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 82.9090909090909, 81, 85, 83.0, 84.8, 85.0, 85.0, 0.05427354855262314, 0.02193298943639387, 0.030538507699442958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 201.9090909090909, 81, 903, 84.0, 771.8000000000004, 903.0, 903.0, 0.05422940022283354, 4.4492613478101175, 0.03145728880113586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 178.8181818181818, 82, 648, 84.0, 567.8000000000003, 648.0, 648.0, 0.0542302022786545, 1.4628770385626038, 0.03151071323808538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 88.2, 85, 92, 88.0, 92.0, 92.0, 92.0, 0.07781253404298365, 0.022948618438458065, 0.048100912157430314], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 938.3050847457628, 652, 1629, 892.0, 1293.0, 1312.0, 1629.0, 0.2570246133739926, 307.49079380853846, 0.5075232111740361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0205cc4a-a483-47b6-80a5-fad71554bd74", 3, 0, 0.0, 404.0, 176, 837, 199.0, 837.0, 837.0, 837.0, 0.024769233309664955, 0.024841799422876863, 0.015883915891940093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 28, 9, 32.142857142857146, 828.3928571428572, 146, 1331, 854.5, 1288.8, 1327.4, 1331.0, 0.11321685475490573, 0.03542765139721729, 0.051080260641373484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 103.875, 80, 244, 83.0, 244.0, 244.0, 244.0, 0.041328718293123935, 0.01113938110244356, 0.02433712610425169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 84.5, 83, 92, 83.5, 92.0, 92.0, 92.0, 0.04136290781241921, 0.011148596246316117, 0.024316865725660514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 105.80000000000001, 81, 248, 83.0, 245.0, 248.0, 248.0, 0.1289679127832995, 0.0347608827423737, 0.07581902685111944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 95.06666666666668, 81, 245, 84.0, 154.40000000000006, 245.0, 245.0, 0.1291500206640033, 0.03480996650709464, 0.0760522094339785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 84.24999999999999, 83, 88, 84.0, 88.0, 88.0, 88.0, 0.041363121674792794, 0.011067866541887917, 0.02358990533015527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 95.8, 82, 249, 85.0, 151.80000000000007, 249.0, 249.0, 0.12914668480460106, 0.09597717493779434, 0.06482558202105952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 85.5, 83, 87, 85.5, 87.0, 87.0, 87.0, 0.04136226623856721, 0.030738949812060202, 0.020761918795530805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 94.0, 82, 248, 83.0, 150.20000000000005, 248.0, 248.0, 0.1289679127832995, 0.034508992287718816, 0.0735520127592255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 109.87499999999999, 85, 251, 88.5, 251.0, 251.0, 251.0, 0.039425958050780634, 0.031032541200126162, 0.014014696025863428], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 364.88888888888897, 82, 837, 378.0, 749.7000000000002, 837.0, 837.0, 0.09351037965214139, 0.019151567013174574, 0.06362378858601916], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1228.958333333333, 803, 1822, 1147.0, 1771.0, 1810.25, 1822.0, 0.10460342227529877, 0.054140443169832374, 0.048113488175454806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 191.125, 167, 329, 171.5, 329.0, 329.0, 329.0, 0.04131015145334276, 0.06402266636372556, 0.09290749882524256], "isController": false}, {"data": ["addBook", 55, 14, 25.454545454545453, 864.8545454545458, 425, 1975, 687.0, 1577.8, 1667.8, 1975.0, 0.2753496941115216, 84.98408701707417, 0.9994626769747579], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=111277f5-c9e7-4f63-b911-953ac0583d79", 1, 0, 0.0, 981.0, 981, 981, 981.0, 981.0, 981.0, 981.0, 1.0193679918450562, 0.1841631625891947, 0.7028064475025484], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 146.8983050847458, 82, 351, 85.0, 334.0, 339.0, 351.0, 0.25775109981083694, 0.19155135444926455, 0.12459647891246511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b335d4e-1ac4-41bc-a878-5e385cf656be", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 531.3389830508477, 401, 748, 489.0, 704.0, 743.0, 748.0, 0.2577195748937453, 75.77811211402125, 0.12961482526394416], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 115.44067796610172, 82, 257, 85.0, 249.0, 250.0, 257.0, 0.2580893514083367, 0.45669717260928333, 0.12551611035288252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d56a845d-1724-425d-842a-0adcc8be6c7a", 3, 0, 0.0, 363.33333333333337, 173, 740, 177.0, 740.0, 740.0, 740.0, 0.05524353190313968, 0.03551626806923856, 0.03542635346653163], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 790.0338983050848, 567, 1299, 804.0, 973.0, 987.0, 1299.0, 0.2574541709757513, 231.65771560014093, 0.12922992566556266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 89.0, 84, 109, 86.0, 105.8, 109.0, 109.0, 0.07011374606958519, 0.05237989818675066, 0.02492324567317286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 14, 8.284023668639053, 133.68639053254438, 84, 1316, 88.0, 246.0, 321.5, 732.2000000000095, 0.7189837228892084, 1.675558295912854, 0.3399609438150382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 102.81818181818181, 83, 247, 86.0, 218.4000000000001, 247.0, 247.0, 0.05778069599474721, 0.04474618351936967, 0.020539231779382796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f1c2c76-eaaf-40fc-80b7-46f115d39f39", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.8895151462395543, 1.6620604108635098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e765d412-0450-4424-a71c-024bfc86958d", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7d9a615-a197-468f-b304-6d4979f448ea", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d56a845d-1724-425d-842a-0adcc8be6c7a", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 103.59090909090907, 82, 254, 87.5, 206.9999999999999, 253.7, 254.0, 0.10802423671056378, 0.08766419990867043, 0.038399240393208224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 359.9090909090909, 165, 1195, 171.0, 1076.0000000000005, 1195.0, 1195.0, 0.05420641803989592, 5.971801343949578, 0.12065066643095088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/829dcc22-3403-4a26-9356-d5422b0c85df", 3, 0, 0.0, 282.0, 171, 387, 288.0, 387.0, 387.0, 387.0, 0.017689513656304542, 0.024386422634912024, 0.01134386129652342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 213.53333333333333, 166, 497, 171.0, 396.80000000000007, 497.0, 497.0, 0.12887151509944586, 0.1997256781863482, 0.28983505788478886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1259b80-78ea-4baa-b2ee-b55793af545b", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 106.11111111111111, 84, 252, 85.0, 252.0, 252.0, 252.0, 0.06548502575744346, 0.05429373717584912, 0.02327788024971623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc6bcfb3-6b98-4189-b4dc-351af0528588", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 88.05882352941178, 84, 97, 87.0, 95.4, 97.0, 97.0, 0.07851178600458139, 0.060953974485978724, 0.02790848643131604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25462bb8-1fed-48e3-94b2-a5fab0800502", 1, 0, 0.0, 1057.0, 1057, 1057, 1057.0, 1057.0, 1057.0, 1057.0, 0.9460737937559129, 0.17092153500473037, 0.6522735335856197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 84.53846153846155, 82, 92, 84.0, 89.6, 92.0, 92.0, 0.07142817896604964, 0.0530828556573865, 0.03585359764506788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd774c7b-4f4b-442d-8917-e7c013eedc37", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 96.23076923076924, 82, 248, 83.0, 184.39999999999995, 248.0, 248.0, 0.07142896389540603, 0.01911282822982544, 0.04073683097159875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 152.76923076923077, 81, 332, 84.0, 298.79999999999995, 332.0, 332.0, 0.07136504869292169, 0.01923511078051405, 0.041954843079237164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 127.3076923076923, 81, 332, 83.0, 297.59999999999997, 332.0, 332.0, 0.07136465692813579, 0.019235005187661598, 0.04202430481217371], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.930232558139537, 0.6637168141592921], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.627906976744185, 0.3687315634218289], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.627906976744185, 0.3687315634218289], "isController": false}, {"data": ["401/Unauthorized", 24, 55.81395348837209, 1.7699115044247788], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1356, 43, "401/Unauthorized", 24, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 28, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
