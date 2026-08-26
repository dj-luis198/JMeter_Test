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

    var data = {"OkPercent": 98.27044025157232, "KoPercent": 1.729559748427673};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7272108843537415, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d652d48-1108-49c0-95cd-6003faac26e8"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9962070-c5ac-4f15-ae05-045e595a21ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b603c4d-fc4b-4570-a957-7322a847aaee"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b26575b-f8ad-4ed3-9cc7-b20916f6b918"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f64e538a-5d24-44ec-b121-a7909a4e55cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9962070-c5ac-4f15-ae05-045e595a21ab"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f64e538a-5d24-44ec-b121-a7909a4e55cf"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b26575b-f8ad-4ed3-9cc7-b20916f6b918"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af475894-47d2-474c-a851-0e55d23f7e6d"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4aec1e87-cc75-4d27-8b09-997a35f2b66e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee41ad69-0bb5-4395-86bf-ab39868f8d61"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9171597633136095, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af475894-47d2-474c-a851-0e55d23f7e6d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee41ad69-0bb5-4395-86bf-ab39868f8d61"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41c30187-9857-427f-9c6c-a8a9e8a4fef5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47a18acd-09fc-4204-b025-3b9ac9904e7a"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=469a5641-d2ab-437d-be40-367dcc579d39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79ae28a2-bc24-432e-93ac-b53d337f9f67"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/79ae28a2-bc24-432e-93ac-b53d337f9f67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41c30187-9857-427f-9c6c-a8a9e8a4fef5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/656c6a79-a0c7-45ba-8b81-f71778d52dc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/47a18acd-09fc-4204-b025-3b9ac9904e7a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcce7204-d57d-45d1-9354-d4dfbf3bb977"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dcce7204-d57d-45d1-9354-d4dfbf3bb977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/469a5641-d2ab-437d-be40-367dcc579d39"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 22, 1.729559748427673, 488.52751572327014, 139, 3266, 155.5, 1400.4, 1704.0499999999997, 2148.43, 4.921305538790102, 706.7291695683798, 3.608688382120804], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/3d652d48-1108-49c0-95cd-6003faac26e8", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.7128034319196428, 1.3318743024553572], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2380.727272727273, 1699, 3061, 2326.0, 2883.6, 2933.7999999999997, 3061.0, 0.24905359633393107, 299.69549217943404, 1.2245945874427175], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 475.47058823529414, 287, 1684, 299.0, 803.1999999999992, 1684.0, 1684.0, 0.08495200211880288, 6.102274870947914, 0.18978046934731876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 148.8888888888889, 144, 155, 147.5, 154.1, 155.0, 155.0, 0.09565818143168411, 0.07426587327948132, 0.034003494180793965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9962070-c5ac-4f15-ae05-045e595a21ab", 3, 0, 0.0, 698.3333333333334, 339, 1270, 486.0, 1270.0, 1270.0, 1270.0, 0.02739951228868126, 0.027479784297339507, 0.01757065078408271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b603c4d-fc4b-4570-a957-7322a847aaee", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 607.2857142857142, 284, 1851, 574.0, 1370.5, 1851.0, 1851.0, 0.0838594515591868, 7.2867580965551735, 0.18706928437938017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b26575b-f8ad-4ed3-9cc7-b20916f6b918", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 155.33333333333334, 144, 178, 144.0, 178.0, 178.0, 178.0, 0.015043626516899007, 0.011179882597031392, 0.007551195341490322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 146.0, 142, 151, 145.0, 151.0, 151.0, 151.0, 0.015046418200147455, 0.004026092369961331, 0.008581160379771595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 241.0, 143, 429, 151.0, 429.0, 429.0, 429.0, 0.015024715657256186, 0.004049630391994832, 0.008832889478191625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 240.66666666666669, 142, 429, 151.0, 429.0, 429.0, 429.0, 0.015024715657256186, 0.004049630391994832, 0.008847562052075665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 2.0200128424657535, 4.234000428082192], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1648.6909090909087, 1125, 2443, 1545.0, 2255.6, 2326.2, 2443.0, 0.25660405527717906, 306.9876601150986, 0.506692773213336], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 678.9090909090909, 147, 2086, 528.0, 1843.000000000001, 2086.0, 2086.0, 0.08121737461144869, 0.015516671711988424, 0.05484912719010034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 678.9090909090909, 147, 2086, 528.0, 1843.000000000001, 2086.0, 2086.0, 0.08246742536698004, 0.01575549532934491, 0.055693333164649965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1088.2857142857142, 247, 2183, 1041.0, 1982.4000000000003, 2169.6, 2183.0, 0.08890695252368735, 0.0277834226636523, 0.040112316470648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 220.99999999999997, 140, 434, 144.0, 433.8, 434.0, 434.0, 0.05324401246877965, 0.014350925235725764, 0.0313536518737052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 222.88888888888889, 140, 430, 145.5, 426.4, 430.0, 430.0, 0.11503876167164104, 0.040380902127577986, 0.0650712960714263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 168.81818181818178, 139, 429, 143.0, 372.4000000000002, 429.0, 429.0, 0.05324375474958494, 0.014350855772349066, 0.031301504257080205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f64e538a-5d24-44ec-b121-a7909a4e55cf", 3, 0, 0.0, 502.33333333333337, 245, 884, 378.0, 884.0, 884.0, 884.0, 0.03542623667087846, 0.029533395870481677, 0.022717996823447443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 191.16666666666663, 142, 425, 145.0, 424.1, 425.0, 425.0, 0.1150446437131298, 0.08549704479071461, 0.0577470184263171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 261.55555555555554, 140, 1126, 145.0, 501.400000000001, 1126.0, 1126.0, 0.1150483202945237, 1.9086211738444037, 0.06719890496369586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 260.5, 140, 1399, 144.0, 522.4000000000013, 1399.0, 1399.0, 0.1150483202945237, 5.7804353240687485, 0.06708655308840825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 310.8333333333333, 140, 1588, 144.0, 1439.5000000000002, 1588.0, 1588.0, 0.09627212921859123, 9.648157541985345, 0.05567821709365139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9962070-c5ac-4f15-ae05-045e595a21ab", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 253.33333333333334, 140, 1140, 144.0, 868.2000000000004, 1140.0, 1140.0, 0.09627315904325874, 3.1683438141821063, 0.05577282944140174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 271.7272727272727, 141, 433, 146.0, 432.4, 433.0, 433.0, 0.053242723897754606, 0.01424658823045387, 0.030364990972938176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 161.2222222222222, 142, 434, 144.0, 182.0000000000004, 434.0, 434.0, 0.09627109941595532, 0.07154522134330274, 0.04832357919902445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 197.00000000000003, 141, 438, 145.0, 436.6, 438.0, 438.0, 0.05324246619103397, 0.0395678874720477, 0.026725222287296346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 158.55555555555557, 141, 424, 143.0, 176.5000000000004, 424.0, 424.0, 0.09627264412817098, 0.04182678679353262, 0.05400711481582508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 148.0, 143, 153, 148.0, 152.6, 153.0, 153.0, 0.052830261173600235, 0.04158319385343925, 0.01877950690155321], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 798.9090909090909, 148, 1948, 677.0, 1799.4000000000005, 1948.0, 1948.0, 0.08130862536681278, 0.015331988661142607, 0.0553366408080599], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1661.2380952380954, 812, 3266, 1517.0, 2216.4, 3163.0999999999985, 3266.0, 0.08918825942741138, 0.04616189208645315, 0.04102311542022535], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 248.54545454545456, 144, 339, 245.0, 327.20000000000005, 339.0, 339.0, 0.08111795287784375, 0.15944171490726744, 0.05243428754470706], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f64e538a-5d24-44ec-b121-a7909a4e55cf", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 472.4545454545455, 287, 872, 298.0, 870.8, 872.0, 872.0, 0.05320461042133215, 0.08245675462759192, 0.11965841582063275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 145.64705882352942, 143, 159, 144.0, 151.0, 159.0, 159.0, 0.08501275191278693, 0.06317842207581137, 0.04267241648747312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 195.1176470588235, 140, 436, 143.0, 433.6, 436.0, 436.0, 0.0850140273145069, 0.030258898968329773, 0.04806457127926107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1167.2857142857142, 1109, 1272, 1133.0, 1272.0, 1272.0, 1272.0, 0.04112663478373265, 12.092596159212954, 0.02345503390009753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b26575b-f8ad-4ed3-9cc7-b20916f6b918", 3, 0, 0.0, 370.3333333333333, 242, 517, 352.0, 517.0, 517.0, 517.0, 0.02530919398653551, 0.025383342015792936, 0.016230179737459292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1664.0, 1259, 1882, 1692.0, 1882.0, 1882.0, 1882.0, 0.04098864614501783, 36.8816558516416, 0.02333630927982949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af475894-47d2-474c-a851-0e55d23f7e6d", 1, 0, 0.0, 1133.0, 1133, 1133, 1133.0, 1133.0, 1133.0, 1133.0, 0.88261253309797, 0.15945636584289496, 0.6085199691085613], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1417.8771929824568, 726, 2712, 1123.0, 2409.4, 2671.6, 2712.0, 0.27378310614138734, 81.51956716151763, 0.9956815368118198], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 184.0, 141, 427, 144.0, 427.0, 427.0, 427.0, 0.04136724659606656, 0.07320063557819591, 0.0229054968945017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 173.5, 142, 422, 146.5, 394.9000000000001, 422.0, 422.0, 0.06427396133278486, 0.04776609821704031, 0.032262515747120524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 201.0, 141, 435, 143.5, 434.3, 435.0, 435.0, 0.06427354822122955, 0.01719819552013369, 0.036656007969919975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 247.39999999999998, 141, 589, 148.0, 573.7, 589.0, 589.0, 0.06427437444965066, 0.017323952488382408, 0.03778630216668916], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 266.7818181818182, 142, 589, 147.0, 583.4, 585.2, 589.0, 0.2582935717774355, 0.1919545001197543, 0.1248587090135064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 186.9, 143, 568, 144.0, 526.2000000000002, 568.0, 568.0, 0.06427437444965066, 0.017323952488382408, 0.03784907011048765], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 924.8545454545454, 698, 1452, 855.0, 1146.4, 1298.0, 1452.0, 0.2582026280332941, 75.92014577592238, 0.12985776702846333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 185.85714285714283, 143, 433, 144.0, 433.0, 433.0, 433.0, 0.04136626876255762, 0.030741924344049168, 0.023228129432100224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4aec1e87-cc75-4d27-8b09-997a35f2b66e", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 192.6, 141, 438, 146.0, 427.2, 430.59999999999997, 438.0, 0.2588759137143046, 0.45808901918976547, 0.1258986377243395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 260.05882352941177, 141, 1536, 145.0, 651.9999999999992, 1536.0, 1536.0, 0.0850140273145069, 4.521317306418059, 0.04954919124155485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 781.9047619047619, 141, 1834, 145.0, 1718.6, 1822.4999999999998, 1834.0, 0.1298468425576118, 50.09274895233693, 0.07155343584020181], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1377.0181818181813, 982, 1999, 1306.0, 1703.0, 1832.6, 1999.0, 0.25735448943208883, 231.56802197193198, 0.12917989020321646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 237.23529411764707, 141, 857, 145.0, 520.9999999999997, 857.0, 857.0, 0.0850140273145069, 1.491974691449089, 0.049632212752604175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 562.1904761904761, 140, 1276, 146.0, 1250.2, 1275.8, 1276.0, 0.12985085701565632, 16.383055100819917, 0.07168245552608148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 171.78571428571428, 145, 445, 148.0, 307.5, 445.0, 445.0, 0.07879156254924471, 0.058862837256027555, 0.028007938249926836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee41ad69-0bb5-4395-86bf-ab39868f8d61", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.2451344131614654, 0.9354859226594301], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 568.4545454545455, 146, 1133, 540.0, 1114.4, 1133.0, 1133.0, 0.08231499704414329, 0.015726373725052943, 0.05621886294927151], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, 6.508875739644971, 223.27810650887568, 142, 1351, 151.0, 408.0, 432.5, 1232.7000000000019, 0.7332364362105994, 1.593116485346118, 0.3514540330715665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 147.33333333333334, 147, 148, 147.0, 148.0, 148.0, 148.0, 0.015184030449042393, 0.01175872670516662, 0.005397448323683039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af475894-47d2-474c-a851-0e55d23f7e6d", 3, 0, 0.0, 489.33333333333337, 250, 850, 368.0, 850.0, 850.0, 850.0, 0.023915244373938764, 0.023985308566440534, 0.01533627324761047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee41ad69-0bb5-4395-86bf-ab39868f8d61", 3, 0, 0.0, 404.0, 255, 677, 280.0, 677.0, 677.0, 677.0, 0.019817677368212445, 0.027320268116660062, 0.012708601697714362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 450.4, 288, 1012, 301.5, 969.1000000000001, 1012.0, 1012.0, 0.06421452789479092, 0.09951997633694647, 0.1444199782633823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 165.88888888888889, 145, 447, 148.5, 185.10000000000042, 447.0, 447.0, 0.1105746194390181, 0.08973389526740629, 0.039305821753713464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41c30187-9857-427f-9c6c-a8a9e8a4fef5", 3, 0, 0.0, 689.3333333333334, 271, 1326, 471.0, 1326.0, 1326.0, 1326.0, 0.05684186592898556, 0.025719464075940734, 0.036451326783887225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47a18acd-09fc-4204-b025-3b9ac9904e7a", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 646.047619047619, 213, 1366, 593.0, 1177.4, 1350.6, 1366.0, 0.09171947815984521, 0.056339406018108044, 0.04147081873828939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 144.47619047619045, 141, 149, 144.0, 148.0, 148.9, 149.0, 0.12984363116989112, 0.09649512042996791, 0.06517541642707425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=469a5641-d2ab-437d-be40-367dcc579d39", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.5491308890577508, 2.0956022036474162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 226.1904761904762, 141, 440, 145.0, 438.8, 439.9, 440.0, 0.12984603969578928, 0.11832510202188834, 0.06937923158968652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79ae28a2-bc24-432e-93ac-b53d337f9f67", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["login", 21, 0, 0.0, 3281.4761904761904, 2300, 6758, 2951.0, 5001.800000000001, 6599.299999999997, 6758.0, 0.08817231389343745, 35.28014801008734, 0.18176929162992822], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 398.3333333333333, 290, 574, 331.0, 574.0, 574.0, 574.0, 0.015011258443832875, 0.023264518701526144, 0.03376067206654991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79ae28a2-bc24-432e-93ac-b53d337f9f67", 3, 0, 0.0, 547.3333333333334, 247, 956, 439.0, 956.0, 956.0, 956.0, 0.021326205641492266, 0.025206853087323705, 0.013675984737545496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 149.35294117647058, 144, 167, 148.0, 159.79999999999998, 167.0, 167.0, 0.08633166594723611, 0.06989155377954956, 0.03068820937968159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 473.6111111111111, 286, 1730, 291.5, 1583.3000000000002, 1730.0, 1730.0, 0.09619752558586965, 12.919820364481735, 0.21361570758624374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41c30187-9857-427f-9c6c-a8a9e8a4fef5", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/656c6a79-a0c7-45ba-8b81-f71778d52dc6", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 179.5, 144, 431, 151.0, 404.2000000000001, 431.0, 431.0, 0.062033969801863494, 0.051432461290802846, 0.022051137703006166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 928.095238095238, 288, 1984, 294.0, 1867.2, 1972.3999999999999, 1984.0, 0.12972572275759822, 66.62791303743514, 0.2775312442086731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47a18acd-09fc-4204-b025-3b9ac9904e7a", 3, 0, 0.0, 683.6666666666666, 242, 1163, 646.0, 1163.0, 1163.0, 1163.0, 0.04065205902678971, 0.026135356958954973, 0.02606919149829939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcce7204-d57d-45d1-9354-d4dfbf3bb977", 1, 0, 0.0, 1040.0, 1040, 1040, 1040.0, 1040.0, 1040.0, 1040.0, 0.9615384615384616, 0.17371544471153846, 0.6629356971153846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcce7204-d57d-45d1-9354-d4dfbf3bb977", 3, 0, 0.0, 617.0, 231, 1205, 415.0, 1205.0, 1205.0, 1205.0, 0.0386010962711341, 0.03218014568697084, 0.024753958220746802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 193.14285714285714, 142, 440, 149.0, 432.4, 439.3, 440.0, 0.12849380782221353, 0.09975837619009742, 0.045675533249302465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/469a5641-d2ab-437d-be40-367dcc579d39", 3, 0, 0.0, 823.6666666666666, 243, 1948, 280.0, 1948.0, 1948.0, 1948.0, 0.08543600842968616, 0.03865756891838014, 0.05478806530158911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 517.7777777777777, 287, 1824, 301.0, 954.6000000000014, 1824.0, 1824.0, 0.1149315199693516, 7.807006582622992, 0.25684999840372885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1472.5555555555557, 144, 2126, 1836.0, 2126.0, 2126.0, 2126.0, 0.05265405699509147, 48.99734243273444, 0.10009755626671035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 187.1428571428571, 141, 456, 144.5, 445.0, 456.0, 456.0, 0.08393084098702669, 0.06237438475696026, 0.04212934791731613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 246.07142857142853, 141, 436, 145.0, 434.5, 436.0, 436.0, 0.0839333569146098, 0.03146329939028411, 0.047364736149497294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 335.64285714285717, 141, 1707, 144.5, 1068.5, 1707.0, 1707.0, 0.08393285371702637, 5.4155015831085125, 0.048828125], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1088.2857142857142, 247, 2183, 1041.0, 1982.4000000000003, 2169.6, 2183.0, 0.09100758396533044, 0.028439869989165763, 0.041060062296858074], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 335.7142857142858, 141, 845, 420.5, 639.0, 845.0, 845.0, 0.0839333569146098, 1.783806314036655, 0.04891038390517929], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.550314465408805], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07861635220125786], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07861635220125786], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 1.0220125786163523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 22, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
