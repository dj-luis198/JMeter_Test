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

    var data = {"OkPercent": 99.43457189014539, "KoPercent": 0.5654281098546042};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7463617463617463, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37ca88a5-851c-4c10-bd55-f9ab31f78978"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65ea5ad8-a7fa-4d57-93a9-6a75c1dd613c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4329e378-fb7b-4eb8-8dbf-4b85b67f8c2d"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6bac05b-bf1a-482d-b956-d370f3c1214d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2780bf1-d019-4dd4-b50f-80e7ac488c6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5e358f25-7976-4188-8fb8-f1e6be03944b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49095329-e81e-4c91-aff6-dfe1a21225cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a5c3adc-dd4a-41a6-a6a3-ae10c85f0595"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca557119-e889-4757-af35-b58b7bccd4af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2abfb8b-2623-4933-90e0-917ddbdea01a"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49d2a0e2-fbae-49e3-8489-00e05ee9cfe2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/106da98e-f0d7-4924-9836-6c32d662e9a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/94fcef26-b77d-4656-bb8b-d3dec516d660"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba49807b-1283-4275-a226-c5c9063f0680"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b22939c-82d5-4375-b126-4a686d062236"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59ab16bd-2ad4-4df4-9a9c-e1a086857af5"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/65ea5ad8-a7fa-4d57-93a9-6a75c1dd613c"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4329e378-fb7b-4eb8-8dbf-4b85b67f8c2d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.32407407407407407, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2780bf1-d019-4dd4-b50f-80e7ac488c6a"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/31ab1074-79d7-4799-8ba8-ac087031322b"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=106da98e-f0d7-4924-9836-6c32d662e9a4"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4351851851851852, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e6bac05b-bf1a-482d-b956-d370f3c1214d"], "isController": false}, {"data": [0.9664634146341463, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a5c3adc-dd4a-41a6-a6a3-ae10c85f0595"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49095329-e81e-4c91-aff6-dfe1a21225cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6bfcb8a-b240-4e84-9c04-4c652775757e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59ab16bd-2ad4-4df4-9a9c-e1a086857af5"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca557119-e889-4757-af35-b58b7bccd4af"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94fcef26-b77d-4656-bb8b-d3dec516d660"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37ca88a5-851c-4c10-bd55-f9ab31f78978"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c2abfb8b-2623-4933-90e0-917ddbdea01a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba49807b-1283-4275-a226-c5c9063f0680"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1238, 7, 0.5654281098546042, 459.84491114701143, 125, 4007, 165.0, 1258.0, 1488.3999999999996, 2164.2499999999973, 4.830352405031682, 693.9927292929855, 3.515866572488451], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2090.037037037036, 1542, 3088, 2052.5, 2565.0, 2792.5, 3088.0, 0.2504556902141396, 301.38253207804013, 1.2314886720978446], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 640.3846153846154, 472, 907, 582.0, 901.4, 907.0, 907.0, 0.08827204084958444, 0.01594758550505188, 0.059997402764951926], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 640.3846153846154, 472, 907, 582.0, 901.4, 907.0, 907.0, 0.08886883643348852, 0.01605540501972205, 0.06040303726338673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37ca88a5-851c-4c10-bd55-f9ab31f78978", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 168.75000000000003, 127, 382, 131.0, 378.0, 381.8, 382.0, 0.12473960607232401, 0.03337758990607108, 0.0711405565881223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65ea5ad8-a7fa-4d57-93a9-6a75c1dd613c", 1, 0, 0.0, 1225.0, 1225, 1225, 1225.0, 1225.0, 1225.0, 1225.0, 0.8163265306122449, 0.14748086734693877, 0.5628188775510203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 131.25, 127, 141, 130.0, 139.70000000000002, 140.95, 141.0, 0.12473805009480092, 0.09270083605678076, 0.06261265405149186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 169.59999999999997, 126, 391, 130.0, 385.9, 390.75, 391.0, 0.12473027078941788, 0.03361870579871029, 0.07344956375587791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 155.75, 127, 384, 129.5, 358.00000000000045, 383.85, 384.0, 0.124737272120596, 0.03362059287625439, 0.07333187286777226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4329e378-fb7b-4eb8-8dbf-4b85b67f8c2d", 3, 0, 0.0, 1913.0, 244, 4007, 1488.0, 4007.0, 4007.0, 4007.0, 0.01872741006161318, 0.025817246618141866, 0.012009439394979804], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 277.2307692307692, 225, 512, 241.0, 487.2, 512.0, 512.0, 0.08828043298156976, 0.18483715655516167, 0.05707192054081951], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 146.22222222222223, 127, 383, 130.5, 186.8000000000003, 383.0, 383.0, 0.10513404590853338, 0.07813184466444717, 0.05277236288768179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 200.77777777777777, 125, 411, 128.0, 392.1, 411.0, 411.0, 0.10513527405261436, 0.03690458024741834, 0.059469420967478155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6bac05b-bf1a-482d-b956-d370f3c1214d", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 866.3333333333334, 746, 960, 893.0, 960.0, 960.0, 960.0, 0.24683231857824586, 72.57689726633207, 0.14077155668915584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1181.0, 1023, 1261, 1259.0, 1261.0, 1261.0, 1261.0, 0.23683587274019105, 213.10533460468145, 0.13483917364016737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 213.33333333333331, 127, 385, 128.0, 385.0, 385.0, 385.0, 0.2543881963876876, 0.4501478631391504, 0.14085752671076063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 156.88888888888889, 125, 381, 129.0, 381.0, 381.0, 381.0, 0.0548666739822232, 0.04077494033249204, 0.02754049846373313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2780bf1-d019-4dd4-b50f-80e7ac488c6a", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 160.33333333333334, 127, 402, 130.0, 402.0, 402.0, 402.0, 0.054950087004304426, 0.014703441249198645, 0.03133872149464237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 242.22222222222223, 128, 393, 131.0, 393.0, 393.0, 393.0, 0.05486600502328757, 0.014788102916432977, 0.03225520998439367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 216.66666666666669, 125, 406, 128.0, 406.0, 406.0, 406.0, 0.054948745031717636, 0.014810403934330146, 0.032357512943482165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e358f25-7976-4188-8fb8-f1e6be03944b", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.6200697815533981, 1.1586013349514563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 130.0, 128, 134, 128.0, 134.0, 134.0, 134.0, 0.26005547850208044, 0.19326388587898752, 0.14602724622919558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 843.3750000000001, 125, 1498, 1130.5, 1453.9, 1498.0, 1498.0, 0.08185273669509344, 46.0402959264195, 0.04372406930880479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 273.9444444444444, 126, 1433, 129.0, 516.8000000000014, 1433.0, 1433.0, 0.1051365022253893, 5.282430458409753, 0.061306810216931656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 670.8125, 127, 1139, 999.5, 1052.2, 1139.0, 1139.0, 0.08185189921984908, 15.050258185189923, 0.043803555441872366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 208.05555555555557, 127, 760, 129.0, 430.60000000000053, 760.0, 760.0, 0.10512974763020028, 1.7440746793542696, 0.0614055372714158], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 665.1538461538462, 248, 1225, 534.0, 1211.4, 1225.0, 1225.0, 0.08862649386772838, 0.016011622427275145, 0.06110381315489866], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49095329-e81e-4c91-aff6-dfe1a21225cc", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a5c3adc-dd4a-41a6-a6a3-ae10c85f0595", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 458.22222222222223, 257, 788, 505.0, 788.0, 788.0, 788.0, 0.054738532277487865, 0.08483403391052075, 0.12310824202642046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca557119-e889-4757-af35-b58b7bccd4af", 3, 0, 0.0, 412.3333333333333, 229, 564, 444.0, 564.0, 564.0, 564.0, 0.016782371796664784, 0.02313585434859224, 0.010762132955543497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2abfb8b-2623-4933-90e0-917ddbdea01a", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 757.7142857142857, 193, 2391, 517.0, 1718.8000000000002, 2326.2999999999993, 2391.0, 0.09389671361502347, 0.05767678990610328, 0.042455252347417836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 129.375, 126, 139, 128.5, 133.4, 139.0, 139.0, 0.08185189921984908, 0.06082938994756363, 0.04108581660058831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 289.68750000000006, 126, 396, 383.0, 392.5, 396.0, 396.0, 0.08185148048865334, 0.09873734499375883, 0.042384519071394955], "isController": false}, {"data": ["login", 21, 0, 0.0, 3256.6190476190477, 2196, 5784, 3103.0, 4941.200000000001, 5707.399999999999, 5784.0, 0.09437099485004, 16.261288884501138, 0.16474110749979776], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/49d2a0e2-fbae-49e3-8489-00e05ee9cfe2", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.8403577302631579, 1.5702097039473684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/106da98e-f0d7-4924-9836-6c32d662e9a4", 3, 0, 0.0, 365.0, 232, 607, 256.0, 607.0, 607.0, 607.0, 0.027583924089040906, 0.02766473636664552, 0.017688909653453967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 162.0, 129, 384, 133.5, 383.1, 384.0, 384.0, 0.10316486892330265, 0.08351921517325966, 0.036671887000080235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94fcef26-b77d-4656-bb8b-d3dec516d660", 3, 0, 0.0, 1214.0, 225, 2865, 552.0, 2865.0, 2865.0, 2865.0, 0.029456237849301885, 0.02455645349350981, 0.01888957961039216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba49807b-1283-4275-a226-c5c9063f0680", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 974.75, 257, 1629, 1259.5, 1582.8, 1629.0, 1629.0, 0.0817975000639043, 61.208943486235015, 0.1708840839958079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b22939c-82d5-4375-b126-4a686d062236", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.0898837457337884, 2.0364494453924915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59ab16bd-2ad4-4df4-9a9c-e1a086857af5", 3, 0, 0.0, 550.0, 276, 1093, 281.0, 1093.0, 1093.0, 1093.0, 0.03387036681607262, 0.02823633119009179, 0.02172025476160907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 354.3999999999999, 255, 529, 276.5, 518.6, 528.5, 529.0, 0.12462922804656147, 0.19315096182606745, 0.28029405487424913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1311.3333333333333, 1158, 1389, 1387.0, 1389.0, 1389.0, 1389.0, 0.23446658851113716, 280.5035536342321, 0.5286946805392732], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1595.2173913043482, 585, 3050, 1453.0, 2466.8000000000006, 2959.199999999999, 3050.0, 0.09733019055558612, 0.030961183238894838, 0.04391264456707108], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/65ea5ad8-a7fa-4d57-93a9-6a75c1dd613c", 3, 0, 0.0, 476.6666666666667, 226, 628, 576.0, 628.0, 628.0, 628.0, 0.044145562635195784, 0.027461643943964567, 0.02830949166384626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 466.83333333333337, 256, 1562, 393.5, 856.4000000000011, 1562.0, 1562.0, 0.1050481470674059, 7.135654134447038, 0.2347625474175664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 142.25, 129, 201, 133.0, 175.8, 201.0, 201.0, 0.1252995442229079, 0.09727845474337087, 0.044540072360486786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4329e378-fb7b-4eb8-8dbf-4b85b67f8c2d", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 576.8333333333333, 261, 1695, 512.0, 1518.6000000000004, 1695.0, 1695.0, 0.08796579108124618, 17.65321949450214, 0.19408598045204642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 132.75, 127, 143, 132.5, 143.0, 143.0, 143.0, 0.0367103826139628, 0.02728183707932196, 0.018426891273024295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 131.75, 128, 138, 130.5, 138.0, 138.0, 138.0, 0.03671122491590835, 0.00982312072945204, 0.02093687045985398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 195.37500000000003, 127, 383, 138.0, 383.0, 383.0, 383.0, 0.03666848481237194, 0.009883302547084626, 0.02155705845414835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 131.62500000000003, 127, 141, 129.0, 141.0, 141.0, 141.0, 0.03671105645242706, 0.00989477693444323, 0.02161793656329445], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1430.2222222222222, 1007, 2534, 1267.0, 2027.0, 2215.0, 2534.0, 0.24141199191716886, 288.81267072074894, 0.47669438247706586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1595.2173913043482, 585, 3050, 1453.0, 2466.8000000000006, 2959.199999999999, 3050.0, 0.09619446338127721, 0.030599903178181426, 0.04340023640834968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 128.25, 126, 130, 128.5, 130.0, 130.0, 130.0, 0.06305667218412549, 0.01699574367462757, 0.03713200520217545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 133.5, 128, 142, 132.0, 142.0, 142.0, 142.0, 0.06305170239596469, 0.01699440416141236, 0.03706750472887768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2780bf1-d019-4dd4-b50f-80e7ac488c6a", 3, 0, 0.0, 514.0, 342, 750, 450.0, 750.0, 750.0, 750.0, 0.03028589888547892, 0.03037462710486997, 0.019421621355596833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 414.5, 128, 1373, 260.0, 1209.2000000000003, 1373.0, 1373.0, 0.12778940306375094, 21.587696912987397, 0.07306708544318963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 268.625, 127, 1082, 129.0, 869.2000000000003, 1082.0, 1082.0, 0.12842431393323542, 7.108313994437622, 0.07355552746273689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 130.0, 127, 134, 129.5, 134.0, 134.0, 134.0, 0.06305269629092514, 0.016871522249720203, 0.03595974085341824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 163.1875, 128, 386, 131.0, 383.2, 386.0, 386.0, 0.1290707711171882, 0.09592075861345725, 0.06478747690843235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 131.75, 129, 137, 130.5, 137.0, 137.0, 137.0, 0.06305766623577261, 0.04686219141154586, 0.03165199262225305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 227.75, 127, 417, 132.0, 399.5, 417.0, 417.0, 0.12879855101630105, 0.07073543469510968, 0.0714272237874824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 194.5, 130, 382, 133.0, 382.0, 382.0, 382.0, 0.05511539786427833, 0.04338184636582845, 0.01959180158456769], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 767.8461538461539, 500, 1488, 607.0, 1372.8, 1488.0, 1488.0, 0.08805619339849492, 0.01590858962765777, 0.05993668632690523], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1641.7142857142858, 918, 2885, 1479.0, 2192.8, 2817.499999999999, 2885.0, 0.09372364022618639, 0.04850930597644413, 0.0431092134243494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 266.25, 258, 280, 263.5, 280.0, 280.0, 280.0, 0.06292276230926537, 0.0975179919773478, 0.14151476718577946], "isController": false}, {"data": ["addBook", 55, 3, 5.454545454545454, 1322.945454545454, 683, 2752, 1082.0, 2129.6, 2259.6, 2752.0, 0.2904735246585616, 108.55749651101686, 1.052620970670096], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/31ab1074-79d7-4799-8ba8-ac087031322b", 1, 0, 0.0, 799.0, 799, 799, 799.0, 799.0, 799.0, 799.0, 1.2515644555694618, 0.39966950876095114, 0.746783088235294], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 226.61111111111114, 126, 674, 132.0, 521.0, 550.25, 674.0, 0.24292044355473583, 0.18052974369643943, 0.11742736285116626], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 806.6666666666667, 625, 1147, 760.5, 1034.5, 1135.0, 1147.0, 0.2424264190924273, 71.28141652787006, 0.12192344319589851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=106da98e-f0d7-4924-9836-6c32d662e9a4", 1, 0, 0.0, 1191.0, 1191, 1191, 1191.0, 1191.0, 1191.0, 1191.0, 0.8396305625524769, 0.15169106842989083, 0.5788859151973131], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 210.25925925925927, 126, 524, 134.0, 390.0, 393.0, 524.0, 0.24354163659979794, 0.4309545366394862, 0.11844114748701111], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1200.296296296296, 877, 2008, 1136.5, 1512.5, 1633.5, 2008.0, 0.24216332570967308, 217.8989861512848, 0.12155463810036324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 156.94444444444446, 129, 475, 137.0, 196.90000000000043, 475.0, 475.0, 0.08236779968151117, 0.06153453784800395, 0.029279178793037174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6bac05b-bf1a-482d-b956-d370f3c1214d", 3, 0, 0.0, 680.0, 241, 1276, 523.0, 1276.0, 1276.0, 1276.0, 0.06567281802062128, 0.029715239924695172, 0.04211440478535934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 3, 1.829268292682927, 204.7621951219511, 126, 858, 138.5, 372.5, 449.0, 741.649999999999, 0.6564516387274445, 1.4647929337884464, 0.31484942890708806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 133.25, 130, 142, 132.0, 142.0, 142.0, 142.0, 0.03656524382161646, 0.028316639014201027, 0.012997801514715225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a5c3adc-dd4a-41a6-a6a3-ae10c85f0595", 3, 0, 0.0, 589.6666666666667, 228, 1200, 341.0, 1200.0, 1200.0, 1200.0, 0.025139103036803646, 0.02521275275273178, 0.016121104486491924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49095329-e81e-4c91-aff6-dfe1a21225cc", 3, 0, 0.0, 403.33333333333337, 251, 705, 254.0, 705.0, 705.0, 705.0, 0.09100837277029486, 0.040290165028515956, 0.05836148904865915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 138.04999999999998, 130, 170, 134.5, 149.3, 169.0, 170.0, 0.12757949797467547, 0.10353375275093293, 0.04535052467068543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6bfcb8a-b240-4e84-9c04-4c652775757e", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59ab16bd-2ad4-4df4-9a9c-e1a086857af5", 1, 0, 0.0, 773.0, 773, 773, 773.0, 773.0, 773.0, 773.0, 1.29366106080207, 0.23371806274256143, 0.8919186610608021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 330.62499999999994, 263, 514, 271.5, 514.0, 514.0, 514.0, 0.03664614482556435, 0.0567943670294635, 0.08241803860671357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca557119-e889-4757-af35-b58b7bccd4af", 1, 0, 0.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 0.17677501223091976, 0.674611668297456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 578.9375, 258, 1760, 392.0, 1417.7000000000003, 1760.0, 1760.0, 0.12765583985574888, 28.795889718818067, 0.2809768613817149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94fcef26-b77d-4656-bb8b-d3dec516d660", 1, 0, 0.0, 701.0, 701, 701, 701.0, 701.0, 701.0, 701.0, 1.4265335235378032, 0.2577233416547789, 0.9835279957203995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37ca88a5-851c-4c10-bd55-f9ab31f78978", 3, 0, 0.0, 416.6666666666667, 248, 502, 500.0, 502.0, 502.0, 502.0, 0.03335297452944512, 0.027805002529267233, 0.02138846348405172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 132.88888888888889, 129, 143, 132.0, 143.0, 143.0, 143.0, 0.05466804349146571, 0.04532536027759218, 0.01943278108485695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2abfb8b-2623-4933-90e0-917ddbdea01a", 3, 0, 0.0, 444.6666666666667, 316, 512, 506.0, 512.0, 512.0, 512.0, 0.07084996339418557, 0.03205776338473892, 0.04543438407765155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 151.62500000000003, 128, 389, 134.5, 221.70000000000016, 389.0, 389.0, 0.07756673162880441, 0.06022026527822217, 0.027572549133676565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba49807b-1283-4275-a226-c5c9063f0680", 3, 0, 0.0, 495.66666666666663, 237, 918, 332.0, 918.0, 918.0, 918.0, 0.02551910104713378, 0.025593864038482805, 0.01636478810639764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 132.05555555555554, 127, 142, 130.5, 141.1, 142.0, 142.0, 0.08802300334487412, 0.06541553275922775, 0.04418342160084502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 257.94444444444446, 128, 395, 258.5, 390.5, 395.0, 395.0, 0.08802730802711241, 0.04558966376013537, 0.04897092103461429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 385.0, 126, 1553, 131.5, 1386.5000000000002, 1553.0, 1553.0, 0.08802816901408451, 13.221088821339496, 0.050490115170187796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 310.05555555555554, 127, 1019, 136.0, 839.9000000000003, 1019.0, 1019.0, 0.08802773851849316, 4.33361817540505, 0.05057583284021498], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 57.142857142857146, 0.32310177705977383], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.24232633279483037], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1238, 7, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
