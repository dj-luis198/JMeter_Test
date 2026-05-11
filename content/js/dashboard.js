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

    var data = {"OkPercent": 99.47368421052632, "KoPercent": 0.5263157894736842};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7925566343042071, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.07627118644067797, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d4d4ad6-e4f8-40a4-a928-7bcd40912f08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b06d37ad-0893-4c27-91ae-e72c98deba60"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f46912e5-4662-4cf2-a47a-2ece6f509c33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fef9b35a-96af-4f3a-8d9d-901f176a07fa"], "isController": false}, {"data": [0.96875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/166bebea-2708-4a11-a0c6-3049a1f7ec2a"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a09422b-1118-4b84-b8f8-865630e8f444"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dd1c41d-20e1-425f-a111-9970d1871c9b"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a09422b-1118-4b84-b8f8-865630e8f444"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f056ed9f-d602-490c-8ddf-24653ebb1630"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee63817b-09e5-4bfd-a6cb-a08338ccef69"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=166bebea-2708-4a11-a0c6-3049a1f7ec2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fef9b35a-96af-4f3a-8d9d-901f176a07fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c65fbcb-0603-4803-948b-e70f53bc2106"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad4512f8-906a-4718-bf8b-8dbe7c1d43bb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86530d6f-dbbb-4d2c-b71d-0d93b40e34df"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d8063a5-6462-4a45-9481-7bb39fd7f095"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea55bbc3-7fc6-4723-9feb-01b757e75abb"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f46912e5-4662-4cf2-a47a-2ece6f509c33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d4d4ad6-e4f8-40a4-a928-7bcd40912f08"], "isController": false}, {"data": [0.3728813559322034, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=111f7432-3eec-4fd5-9ccf-2d2dc4b2ceca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b06d37ad-0893-4c27-91ae-e72c98deba60"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6df4050-9e93-45f8-81cc-e914438a4604"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8dd1c41d-20e1-425f-a111-9970d1871c9b"], "isController": false}, {"data": [0.9657142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fcf02432-1cc7-4aed-b3f5-2d889da615aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee63817b-09e5-4bfd-a6cb-a08338ccef69"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/111f7432-3eec-4fd5-9ccf-2d2dc4b2ceca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad4512f8-906a-4718-bf8b-8dbe7c1d43bb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1383241b-cdfd-424d-a40c-a4c7c8f9fea7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c65fbcb-0603-4803-948b-e70f53bc2106"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86530d6f-dbbb-4d2c-b71d-0d93b40e34df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 7, 0.5263157894736842, 399.4962406015039, 112, 2484, 133.0, 1122.0, 1354.45, 1740.0700000000002, 5.24133799930641, 757.7567353533174, 3.8265515825983636], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1853.4576271186445, 1366, 2539, 1853.0, 2278.0, 2386.0, 2539.0, 0.26339403300907593, 316.9519677682713, 1.2951064025397434], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d4d4ad6-e4f8-40a4-a928-7bcd40912f08", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b06d37ad-0893-4c27-91ae-e72c98deba60", 3, 0, 0.0, 382.0, 335, 408, 403.0, 408.0, 408.0, 408.0, 0.10131027961637173, 0.04485090503849791, 0.06496785509253006], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 609.5714285714287, 444, 1448, 499.5, 1144.0, 1448.0, 1448.0, 0.07405840033855268, 0.013379691467414304, 0.05033656898011003], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 609.5714285714287, 444, 1448, 499.5, 1144.0, 1448.0, 1448.0, 0.07202350023922091, 0.013012058148687371, 0.04895347281884546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 157.4375, 112, 344, 115.5, 341.2, 344.0, 344.0, 0.11300871579720587, 0.030238660281674226, 0.06445028322809397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 130.625, 114, 339, 116.0, 187.10000000000014, 339.0, 339.0, 0.1130055231449437, 0.08398164366533413, 0.05672347548486432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f46912e5-4662-4cf2-a47a-2ece6f509c33", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 171.75, 113, 343, 115.5, 342.3, 343.0, 343.0, 0.11282781769845356, 0.03041062273903631, 0.06644059967985107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 193.5, 114, 461, 116.0, 378.4000000000001, 461.0, 461.0, 0.11282781769845356, 0.03041062273903631, 0.06633041626412992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fef9b35a-96af-4f3a-8d9d-901f176a07fa", 3, 0, 0.0, 285.0, 201, 453, 201.0, 453.0, 453.0, 453.0, 0.07613247049866768, 0.03444796028422789, 0.04882192932368989], "isController": false}, {"data": ["goToProfile", 16, 0, 0.0, 290.5, 201, 862, 234.0, 544.2000000000003, 862.0, 862.0, 0.08162515687334837, 0.17215315525870073, 0.052769388525543574], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 128.84210526315786, 114, 341, 116.0, 127.0, 341.0, 341.0, 0.08776873400530308, 0.06522656892386293, 0.044055790311255644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 151.42105263157896, 113, 350, 115.0, 341.0, 350.0, 350.0, 0.08777116670978233, 0.03736229454617687, 0.04928105597952622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 706.0, 566, 909, 674.5, 909.0, 909.0, 909.0, 0.07471468330313615, 21.968597652091077, 0.04261071782131984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1155.75, 1015, 1348, 1130.0, 1348.0, 1348.0, 1348.0, 0.0740781895290479, 66.65568515380484, 0.04217537548382318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 233.5, 114, 349, 235.5, 349.0, 349.0, 349.0, 0.07533240423368112, 0.13330304342913105, 0.041712376172360545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 116.19999999999999, 113, 118, 116.0, 118.0, 118.0, 118.0, 0.06748063305831226, 0.05014918140368714, 0.033872114640598146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 130.46666666666667, 113, 344, 115.0, 209.00000000000009, 344.0, 344.0, 0.06741270055278414, 0.02478821176576334, 0.038068864882477196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 198.33333333333331, 113, 1358, 115.0, 617.6000000000004, 1358.0, 1358.0, 0.06710658763001902, 4.042389868303322, 0.039066868918465496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 159.86666666666667, 114, 785, 115.0, 384.80000000000024, 785.0, 785.0, 0.06727935734757862, 1.3357492930060866, 0.03923315128660558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 115.75, 115, 117, 115.5, 117.0, 117.0, 117.0, 0.07534801363799047, 0.055995935916514396, 0.04230967562680128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 245.57894736842107, 113, 1246, 115.0, 1239.0, 1246.0, 1246.0, 0.08777035579330543, 8.334421440334637, 0.05080539406580005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 774.4444444444442, 112, 1741, 1070.5, 1434.1000000000006, 1741.0, 1741.0, 0.09138029942278111, 45.69103218173003, 0.04935884662832078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/166bebea-2708-4a11-a0c6-3049a1f7ec2a", 3, 0, 0.0, 356.0, 254, 473, 341.0, 473.0, 473.0, 473.0, 0.029442361669970753, 0.024544885493748402, 0.018880681149037234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 222.21052631578948, 113, 903, 116.0, 682.0, 903.0, 903.0, 0.08776873400530308, 2.7376843720839994, 0.050890166956919405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 543.3333333333334, 114, 1032, 673.5, 926.7000000000002, 1032.0, 1032.0, 0.09126955957366975, 14.919978304465111, 0.0493881611972538], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 423.75, 210, 815, 424.0, 762.8000000000002, 815.0, 815.0, 0.08205464839583163, 0.01482432612620005, 0.05657283375728235], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a09422b-1118-4b84-b8f8-865630e8f444", 3, 0, 0.0, 326.3333333333333, 258, 459, 262.0, 459.0, 459.0, 459.0, 0.03074936195073952, 0.025634477850209607, 0.01971882911554585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dd1c41d-20e1-425f-a111-9970d1871c9b", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 316.0, 230, 1472, 234.0, 731.6000000000004, 1472.0, 1472.0, 0.0670708805065193, 5.446356360443383, 0.1496999346617839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a09422b-1118-4b84-b8f8-865630e8f444", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 616.5454545454547, 200, 1323, 606.5, 1026.6, 1281.5999999999995, 1323.0, 0.09682033226977665, 0.05947264550555617, 0.043777161954010345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 116.55555555555557, 114, 123, 116.0, 122.1, 123.0, 123.0, 0.09137705217629678, 0.06790814131461119, 0.04586699689318023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f056ed9f-d602-490c-8ddf-24653ebb1630", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 229.33333333333334, 113, 460, 118.0, 459.1, 460.0, 460.0, 0.09127326200496932, 0.10058281780842757, 0.0477956556462654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee63817b-09e5-4bfd-a6cb-a08338ccef69", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["login", 22, 0, 0.0, 2556.5909090909095, 1576, 4214, 2478.0, 3729.7, 4145.899999999999, 4214.0, 0.09746156913126301, 21.335396546759405, 0.17643278197403978], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=166bebea-2708-4a11-a0c6-3049a1f7ec2a", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fef9b35a-96af-4f3a-8d9d-901f176a07fa", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 120.36842105263158, 116, 152, 118.0, 122.0, 152.0, 152.0, 0.08795400468470804, 0.07120495105822555, 0.031264900102767314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c65fbcb-0603-4803-948b-e70f53bc2106", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad4512f8-906a-4718-bf8b-8dbe7c1d43bb", 3, 0, 0.0, 330.6666666666667, 252, 436, 304.0, 436.0, 436.0, 436.0, 0.07574801161469512, 0.03353427597525565, 0.04857538505239238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 918.2222222222224, 230, 1860, 1186.5, 1554.9000000000005, 1860.0, 1860.0, 0.09121359690684558, 60.68681304759829, 0.19217604287545798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86530d6f-dbbb-4d2c-b71d-0d93b40e34df", 3, 0, 0.0, 454.3333333333333, 215, 701, 447.0, 701.0, 701.0, 701.0, 0.019565004728209476, 0.023125173231812696, 0.01254656878729579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 368.00000000000006, 230, 679, 348.0, 607.6, 679.0, 679.0, 0.11273480546200133, 0.17471692994941027, 0.25354321970604404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1271.75, 1131, 1463, 1246.5, 1463.0, 1463.0, 1463.0, 0.07391939090421895, 88.43329005968991, 0.16667956406039214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d8063a5-6462-4a45-9481-7bb39fd7f095", 2, 0, 0.0, 270.0, 233, 307, 270.0, 307.0, 307.0, 307.0, 0.013265414411546215, 0.02621992067282182, 0.008245543235301921], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1147.818181818182, 353, 2441, 1089.0, 1691.8, 2335.5499999999984, 2441.0, 0.10021409374572951, 0.031850715164214456, 0.045213780576686555], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ea55bbc3-7fc6-4723-9feb-01b757e75abb", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 435.8947368421052, 230, 1362, 235.0, 1361.0, 1362.0, 1362.0, 0.08772051321117098, 11.168400264950575, 0.19492295166830564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 119.83333333333334, 116, 133, 118.5, 130.9, 133.0, 133.0, 0.14636823809233396, 0.11363549734707569, 0.05202933463438434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 493.78947368421046, 230, 1354, 457.0, 1142.0, 1354.0, 1354.0, 0.09522854851643946, 12.124308300859562, 0.2116064883846231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 139.6, 114, 344, 117.0, 321.6000000000001, 344.0, 344.0, 0.05201316973457679, 0.03865431852345014, 0.026108173089426246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 114.7, 114, 116, 114.0, 116.0, 116.0, 116.0, 0.05201425190502198, 0.013917875998023459, 0.029664378039582846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 183.99999999999997, 114, 346, 116.0, 345.9, 346.0, 346.0, 0.051952100163649116, 0.014002714497233549, 0.03054215263527028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f46912e5-4662-4cf2-a47a-2ece6f509c33", 3, 0, 0.0, 344.0, 217, 517, 298.0, 517.0, 517.0, 517.0, 0.018223456017688898, 0.025122505284802248, 0.011686265740510135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 161.6, 114, 345, 117.0, 344.6, 345.0, 345.0, 0.051952100163649116, 0.014002714497233549, 0.03059288710808634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d4d4ad6-e4f8-40a4-a928-7bcd40912f08", 3, 0, 0.0, 572.0, 271, 1054, 391.0, 1054.0, 1054.0, 1054.0, 0.0269684738540646, 0.02704748305480893, 0.01729423616292554], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1288.440677966102, 901, 1983, 1238.0, 1808.0, 1883.0, 1983.0, 0.26162919604452134, 312.9994754944349, 0.5166154632832247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1147.818181818182, 353, 2441, 1089.0, 1691.8, 2335.5499999999984, 2441.0, 0.0977460646101487, 0.031066309597330644, 0.044100275244031935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 115.25, 114, 117, 115.0, 117.0, 117.0, 117.0, 0.036066578904657996, 0.0097210700953961, 0.021238424882332785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 171.125, 114, 341, 115.0, 341.0, 341.0, 341.0, 0.036066416305626806, 0.009721026269875976, 0.02120310802342514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 376.4166666666667, 113, 1236, 227.0, 1234.2, 1236.0, 1236.0, 0.14014925896079325, 21.049237098968735, 0.08038508928675706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 246.0, 114, 679, 115.5, 676.9, 679.0, 679.0, 0.14052015878777943, 6.917827543707624, 0.08073505216810895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 143.375, 113, 341, 116.0, 341.0, 341.0, 341.0, 0.03606690410711871, 0.009650714575537622, 0.020569406248591136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=111f7432-3eec-4fd5-9ccf-2d2dc4b2ceca", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 155.08333333333331, 114, 344, 115.5, 343.1, 344.0, 344.0, 0.14052180429996722, 0.1044307549533936, 0.07053535879900698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 144.75, 115, 344, 116.0, 344.0, 344.0, 344.0, 0.03606625370806171, 0.02680314362483883, 0.018103568755804413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 152.41666666666666, 113, 345, 114.0, 344.4, 345.0, 345.0, 0.14052180429996722, 0.0727767547660312, 0.0781744021968242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 121.62500000000001, 116, 148, 118.0, 148.0, 148.0, 148.0, 0.035689112144112634, 0.028091234754057406, 0.012686364082477539], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 467.00000000000006, 391, 701, 453.5, 645.8000000000002, 701.0, 701.0, 0.08281973594307523, 0.01496254995065324, 0.05637241792219086], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1399.5454545454545, 898, 2484, 1240.5, 2290.0, 2458.4999999999995, 2484.0, 0.09614796297429352, 0.04976408239880427, 0.044224307188371344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 317.375, 230, 685, 233.5, 685.0, 685.0, 685.0, 0.0360472399078993, 0.0558661813806994, 0.08107108741005087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b06d37ad-0893-4c27-91ae-e72c98deba60", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["addBook", 58, 3, 5.172413793103448, 1283.9137931034484, 587, 3369, 1033.5, 2124.6, 2187.0999999999995, 3369.0, 0.2736856013061409, 97.01177183556922, 0.9934420520875605], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 206.05084745762713, 113, 468, 117.0, 464.0, 466.0, 468.0, 0.26308044910953954, 0.19551193532456992, 0.12717267803634968], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 756.8135593220339, 561, 1026, 683.0, 912.0, 1019.0, 1026.0, 0.2626038731845838, 77.21425798549447, 0.13207128387701236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6df4050-9e93-45f8-81cc-e914438a4604", 2, 0, 0.0, 224.0, 214, 234, 224.0, 234.0, 234.0, 234.0, 0.016823263208364525, 0.023789145630577962, 0.010457038117308614], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 173.49152542372877, 113, 475, 117.0, 345.0, 349.0, 475.0, 0.263531681868127, 0.466327546430709, 0.12816286872102267], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1079.1016949152543, 785, 1515, 1025.0, 1362.0, 1462.0, 1515.0, 0.26220940309584867, 235.936481820611, 0.1316168292883459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 130.3684210526316, 115, 345, 118.0, 127.0, 345.0, 345.0, 0.0952872911829165, 0.07118630640129993, 0.03387165428767735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dd1c41d-20e1-425f-a111-9970d1871c9b", 3, 0, 0.0, 547.0, 224, 980, 437.0, 980.0, 980.0, 980.0, 0.026992253223324904, 0.027071332090190116, 0.01730948530271812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, 1.7142857142857142, 199.50285714285718, 114, 1652, 122.0, 341.4, 412.5999999999999, 1236.280000000005, 0.7235201944822283, 1.596379479106804, 0.34628435558123477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 143.5, 115, 344, 119.5, 322.80000000000007, 344.0, 344.0, 0.05301889593451106, 0.041058578589909446, 0.01884656066422073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcf02432-1cc7-4aed-b3f5-2d889da615aa", 2, 0, 0.0, 273.5, 227, 320, 273.5, 320.0, 320.0, 320.0, 0.023989444644356483, 0.02762065940985966, 0.014911407730598536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 122.18749999999999, 116, 139, 119.0, 136.9, 139.0, 139.0, 0.11005413287660869, 0.08931150822310724, 0.03912080504598199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee63817b-09e5-4bfd-a6cb-a08338ccef69", 3, 0, 0.0, 341.3333333333333, 266, 478, 280.0, 478.0, 478.0, 478.0, 0.019039519696383126, 0.02624751494602296, 0.012209587826131105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 347.09999999999997, 230, 689, 236.5, 666.4000000000001, 689.0, 689.0, 0.051920001661440056, 0.08046586194990758, 0.11676930061161761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/111f7432-3eec-4fd5-9ccf-2d2dc4b2ceca", 3, 0, 0.0, 553.6666666666666, 345, 862, 454.0, 862.0, 862.0, 862.0, 0.07555913761837597, 0.034188542086439656, 0.04845426468365908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad4512f8-906a-4718-bf8b-8dbe7c1d43bb", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 551.3333333333334, 230, 1574, 456.0, 1507.1000000000004, 1574.0, 1574.0, 0.1399612773799249, 28.087818229664794, 0.30880779234411815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1383241b-cdfd-424d-a40c-a4c7c8f9fea7", 2, 0, 0.0, 294.0, 220, 368, 294.0, 368.0, 368.0, 368.0, 0.0959877135726627, 0.059008071966788256, 0.05966423797753888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c65fbcb-0603-4803-948b-e70f53bc2106", 3, 0, 0.0, 329.3333333333333, 235, 402, 351.0, 402.0, 402.0, 402.0, 0.032539372640895486, 0.027126736111111112, 0.020866720085470088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 165.2666666666667, 116, 350, 119.0, 345.2, 350.0, 350.0, 0.0682091018225472, 0.05655227289779548, 0.024246204163483574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 133.33333333333331, 116, 353, 119.5, 150.5000000000003, 353.0, 353.0, 0.09105579190716356, 0.07069272906854983, 0.03236748852949955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86530d6f-dbbb-4d2c-b71d-0d93b40e34df", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 140.10526315789474, 114, 347, 116.0, 345.0, 347.0, 347.0, 0.09528394615955547, 0.07081160451896652, 0.04782807453712062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 212.3684210526316, 113, 376, 116.0, 343.0, 376.0, 376.0, 0.09528633543799117, 0.04056133995155442, 0.05350061309234249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 281.0, 113, 1239, 115.0, 1026.0, 1239.0, 1239.0, 0.0952872911829165, 9.048208081741452, 0.05515653131692052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 268.94736842105266, 113, 903, 118.0, 675.0, 903.0, 903.0, 0.09528585757271815, 2.9721586634904713, 0.05524875407472417], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 57.142857142857146, 0.3007518796992481], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.22556390977443608], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 7, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
