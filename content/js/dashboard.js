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

    var data = {"OkPercent": 98.17073170731707, "KoPercent": 1.829268292682927};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7805755395683454, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2807017543859649, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d8856d1-f5b8-42a9-90c7-09d51952fac9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c10f40be-3a2c-4c8f-ad98-77c790753cb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2731c10a-3894-41b5-bde5-c060a478ee17"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbcecf82-0093-4098-af86-c506288a76a5"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19ec7023-def0-4aa3-ac92-5d3f5eb82e8f"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ffbe289-714c-4e7f-a454-fc8095890a98"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=755da2b5-31ac-4b36-b9d7-0bc010742ecf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c31a5922-3cbf-46ba-a8ec-381221f85bf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ec79ebd-7118-4779-8240-aecb7cf53e72"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31167907-6f8d-4d12-85d6-2d7f28d893d3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ffbe289-714c-4e7f-a454-fc8095890a98"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ef9cecd-05f1-40d5-a511-d311352f608e"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=079036e7-4667-4e9c-b63c-93850f6bbf5e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2731fad-6875-4f21-a181-99860c742b6a"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19ec7023-def0-4aa3-ac92-5d3f5eb82e8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2731c10a-3894-41b5-bde5-c060a478ee17"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19b07d08-6d52-4a95-8c6b-0f9a446c2809"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a01ec1d-3f94-4971-b86c-ed130e69bc2e"], "isController": false}, {"data": [0.3125, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7a5d34e-7676-401f-b5b6-81872fdc2d6e"], "isController": false}, {"data": [0.7456140350877193, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8994082840236687, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31167907-6f8d-4d12-85d6-2d7f28d893d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2731fad-6875-4f21-a181-99860c742b6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19b07d08-6d52-4a95-8c6b-0f9a446c2809"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a01ec1d-3f94-4971-b86c-ed130e69bc2e"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/792d14b0-b8bc-4a69-b6f0-b4f9a3a1772e"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbcecf82-0093-4098-af86-c506288a76a5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/755da2b5-31ac-4b36-b9d7-0bc010742ecf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c31a5922-3cbf-46ba-a8ec-381221f85bf0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ef9cecd-05f1-40d5-a511-d311352f608e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/079036e7-4667-4e9c-b63c-93850f6bbf5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 24, 1.829268292682927, 362.3833841463414, 81, 5802, 162.0, 912.7, 1091.6999999999998, 2415.9899999999807, 5.119480560021227, 759.5728511143747, 3.735093585626434], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1782.543859649123, 1019, 11755, 1460.0, 2092.6000000000017, 3870.599999999985, 11755.0, 0.2588873295090679, 311.5263560146453, 1.2729469766388248], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d8856d1-f5b8-42a9-90c7-09d51952fac9", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.8895617603550294, 3.5306490384615383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c10f40be-3a2c-4c8f-ad98-77c790753cb4", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2731c10a-3894-41b5-bde5-c060a478ee17", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 771.2142857142857, 86, 3999, 462.0, 2715.0, 3999.0, 3999.0, 0.10041528894499394, 0.01978046707454401, 0.06756458406552815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 771.2142857142857, 86, 3999, 462.0, 2715.0, 3999.0, 3999.0, 0.10030737044228386, 0.019759208574847212, 0.06749197093235701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 132.83333333333334, 82, 263, 85.0, 260.3, 263.0, 263.0, 0.06813574912417172, 0.035287752882993885, 0.03790494637148746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 194.41666666666669, 83, 1392, 85.5, 1001.7000000000014, 1392.0, 1392.0, 0.06816013086745126, 0.05065415975598673, 0.03421319068932612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 212.00000000000006, 83, 643, 86.0, 622.3000000000001, 643.0, 643.0, 0.06813381481229133, 3.35423746195862, 0.03914589295042129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 232.5, 82, 916, 86.5, 867.4000000000002, 916.0, 916.0, 0.06812221124697708, 10.23138179164254, 0.03907270059152787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbcecf82-0093-4098-af86-c506288a76a5", 3, 0, 0.0, 307.3333333333333, 184, 549, 189.0, 549.0, 549.0, 549.0, 0.03364775289090277, 0.028050747120313146, 0.021577497784856268], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 227.28571428571428, 83, 541, 183.5, 486.0, 541.0, 541.0, 0.10076364447707267, 0.17025654019029934, 0.06512806429440259], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 106.9375, 82, 253, 86.0, 250.9, 253.0, 253.0, 0.09926235661242393, 0.0737682161934127, 0.049825050096470605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 125.31250000000001, 82, 253, 84.5, 250.9, 253.0, 253.0, 0.09926358825463592, 0.045196921898167965, 0.05556919137399418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 650.7142857142858, 491, 695, 672.0, 695.0, 695.0, 695.0, 0.09510998790744439, 27.96549439360589, 0.05424241497846438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 897.8571428571429, 777, 1012, 903.0, 1012.0, 1012.0, 1012.0, 0.0949886692087444, 85.4709715262983, 0.05408046303583787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 134.42857142857142, 82, 259, 86.0, 259.0, 259.0, 259.0, 0.0956676233429001, 0.16928684911849118, 0.052972209409594094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 428.0, 82, 2578, 84.5, 2578.0, 2578.0, 2578.0, 0.044033223066803906, 0.032723908939294694, 0.022102613922204303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 109.875, 82, 244, 85.5, 244.0, 244.0, 244.0, 0.04402353057709346, 0.011779733767698836, 0.02510716978224861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 154.375, 84, 252, 116.5, 252.0, 252.0, 252.0, 0.044018443727922, 0.011864346161041477, 0.025878030394735397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 116.625, 81, 244, 84.5, 244.0, 244.0, 244.0, 0.04400851564777784, 0.011861670233190123, 0.02591517083555668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 131.14285714285714, 83, 251, 85.0, 251.0, 251.0, 251.0, 0.09589303816542918, 0.0712642598084879, 0.05384618842297049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19ec7023-def0-4aa3-ac92-5d3f5eb82e8f", 3, 0, 0.0, 355.3333333333333, 187, 521, 358.0, 521.0, 521.0, 521.0, 0.01953519264955818, 0.023089936364109945, 0.012527451015504433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 602.9411764705883, 81, 1121, 900.0, 1081.0, 1121.0, 1121.0, 0.17458279845956357, 92.42520458921695, 0.09381017329910141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 223.8125, 81, 984, 89.5, 757.2000000000003, 984.0, 984.0, 0.09926235661242393, 11.187965389232517, 0.057289114021428264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 383.29411764705884, 83, 738, 485.0, 683.5999999999999, 738.0, 738.0, 0.1745774199511183, 30.214409312164964, 0.09397776897759247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 149.06249999999997, 82, 659, 84.0, 549.1000000000001, 659.0, 659.0, 0.09926235661242393, 3.6717136017346097, 0.05738604991655758], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 380.92857142857144, 94, 718, 383.0, 717.0, 718.0, 718.0, 0.10319384964656106, 0.02032780631988619, 0.07009638029144892], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ffbe289-714c-4e7f-a454-fc8095890a98", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 589.25, 169, 2766, 255.5, 2766.0, 2766.0, 2766.0, 0.04398770543633054, 0.06817235207759431, 0.09892938048815356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=755da2b5-31ac-4b36-b9d7-0bc010742ecf", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c31a5922-3cbf-46ba-a8ec-381221f85bf0", 3, 0, 0.0, 326.0, 299, 361, 318.0, 361.0, 361.0, 361.0, 0.09771032146695763, 0.044211375924176795, 0.06265928818030811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ec79ebd-7118-4779-8240-aecb7cf53e72", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31167907-6f8d-4d12-85d6-2d7f28d893d3", 3, 0, 0.0, 350.3333333333333, 160, 566, 325.0, 566.0, 566.0, 566.0, 0.07231006556112611, 0.033518728306980335, 0.04637071261569611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 494.3333333333333, 105, 1634, 392.5, 1057.0, 1497.5, 1634.0, 0.11086218444695937, 0.06809796290736078, 0.05012616347552948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 84.82352941176471, 83, 87, 85.0, 87.0, 87.0, 87.0, 0.17458279845956357, 0.129743661745828, 0.08763238125802311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 154.41176470588235, 82, 342, 87.0, 339.6, 342.0, 342.0, 0.17457921275044413, 0.20095463379442785, 0.09094004487712705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ffbe289-714c-4e7f-a454-fc8095890a98", 3, 0, 0.0, 347.0, 191, 636, 214.0, 636.0, 636.0, 636.0, 0.040181620926588175, 0.0258329105891965, 0.025767510815552966], "isController": false}, {"data": ["login", 24, 0, 0.0, 2254.8333333333335, 1330, 3505, 2297.5, 2889.0, 3368.25, 3505.0, 0.11148427374963418, 39.0521345391635, 0.2221247944508703], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.06250000000001, 86, 367, 90.0, 177.30000000000018, 367.0, 367.0, 0.09390442876762176, 0.07602223774253754, 0.03338008991349055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ef9cecd-05f1-40d5-a511-d311352f608e", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 689.1764705882351, 168, 1206, 983.0, 1167.6, 1206.0, 1206.0, 0.17442516647343093, 122.86021562349302, 0.3660343380308425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=079036e7-4667-4e9c-b63c-93850f6bbf5e", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 475.8333333333333, 169, 1582, 331.0, 1407.7000000000007, 1582.0, 1582.0, 0.06808665161195147, 13.663818522831724, 0.15022504056829658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 685.9090909090909, 83, 1257, 983.0, 1216.0000000000002, 1257.0, 1257.0, 0.14909997831273042, 113.52613188909673, 0.2498721848907504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2731fad-6875-4f21-a181-99860c742b6a", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 917.4583333333334, 131, 3237, 858.5, 1562.0, 2823.25, 3237.0, 0.11523945799041592, 0.03618113842179562, 0.05199280233551968], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19ec7023-def0-4aa3-ac92-5d3f5eb82e8f", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 104.78947368421052, 86, 218, 90.0, 178.0, 218.0, 218.0, 0.09947175263992795, 0.07722660483275658, 0.03535909957122439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 337.875, 171, 1071, 176.5, 843.5000000000002, 1071.0, 1071.0, 0.09920880974230512, 14.97056337040229, 0.2199500003100275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2731c10a-3894-41b5-bde5-c060a478ee17", 3, 0, 0.0, 306.3333333333333, 177, 388, 354.0, 388.0, 388.0, 388.0, 0.07479804527775008, 0.03384416762241947, 0.04796619440011968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 260.4545454545454, 165, 989, 172.0, 414.19999999999993, 905.7499999999989, 989.0, 0.10308263947783958, 5.75807232974965, 0.23063642401638076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 580.2222222222222, 85, 3510, 168.0, 3510.0, 3510.0, 3510.0, 0.06852026677223863, 0.05092179981804062, 0.034393962032158845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 176.22222222222223, 83, 457, 152.0, 457.0, 457.0, 457.0, 0.06832727245120294, 0.04108829686681496, 0.037692692398211346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 453.0, 83, 1804, 148.0, 1804.0, 1804.0, 1804.0, 0.06848793851305075, 13.7089280448596, 0.03895548759607336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 1085.7777777777778, 83, 5168, 257.0, 5168.0, 5168.0, 5168.0, 0.06709608158883522, 4.3981714453987, 0.038229332077145586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 95.0, 94, 96, 95.0, 96.0, 96.0, 96.0, 0.3351206434316354, 0.09883440851206435, 0.20715953837131368], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 965.7368421052629, 648, 1510, 913.0, 1308.8000000000002, 1345.6999999999996, 1510.0, 0.2579687450499418, 308.62030352625175, 0.5093875024326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 917.4583333333334, 131, 3237, 858.5, 1562.0, 2823.25, 3237.0, 0.11206836170063739, 0.0351855256706591, 0.05056209287665476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 123.2, 84, 255, 86.0, 246.3, 255.0, 255.0, 0.05130283550771851, 0.013827717382939756, 0.030210556456205337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 121.5, 82, 255, 86.5, 245.70000000000005, 255.0, 255.0, 0.0513086265193767, 0.013829278241550752, 0.030163860512367944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 170.57894736842104, 82, 1279, 86.0, 250.0, 1279.0, 1279.0, 0.09883736052227743, 0.026639757328270085, 0.05810555765079199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 103.73684210526315, 82, 247, 85.0, 166.0, 247.0, 247.0, 0.09883067704215388, 0.02663795592151804, 0.05819814282853398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 155.2, 83, 651, 86.0, 601.8000000000002, 651.0, 651.0, 0.05130494117888494, 0.013728079963881321, 0.029259849266082816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 193.21052631578948, 83, 1981, 86.0, 174.0, 1981.0, 1981.0, 0.09887182049040423, 0.07347798378241954, 0.04962901926959743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 153.7, 84, 462, 91.0, 440.6000000000001, 462.0, 462.0, 0.05132442683446333, 0.038142469551783784, 0.025762456438392724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 122.36842105263159, 82, 523, 85.0, 243.0, 523.0, 523.0, 0.09864749097894655, 0.026395910672100932, 0.05625989719893046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 122.0, 87, 196, 93.5, 193.8, 196.0, 196.0, 0.050578363587624485, 0.03981070415197787, 0.017979027681538393], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 442.57142857142856, 85, 639, 499.0, 637.5, 639.0, 639.0, 0.1037037037037037, 0.020023148148148148, 0.07057291666666667], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1213.75, 738, 2262, 1119.0, 1791.0, 2170.25, 2262.0, 0.11197738056912503, 0.05795704267737917, 0.05150522094536903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 329.5, 170, 805, 178.0, 786.9000000000001, 805.0, 805.0, 0.051279947489333774, 0.07947390299372332, 0.11532980377728093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19b07d08-6d52-4a95-8c6b-0f9a446c2809", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a01ec1d-3f94-4971-b86c-ed130e69bc2e", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.2516212569637883, 0.9602411211699164], "isController": false}, {"data": ["addBook", 56, 9, 16.071428571428573, 1282.9642857142856, 423, 5275, 987.0, 2349.500000000001, 3752.999999999999, 5275.0, 0.25615925787003574, 94.09837730543332, 0.9270540413125418], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 162.42105263157896, 82, 367, 87.0, 345.0, 347.3999999999999, 367.0, 0.2586382920797695, 0.19221068386006307, 0.1250253462690292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7a5d34e-7676-401f-b5b6-81872fdc2d6e", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.8294439935064934, 1.54981737012987], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 532.0526315789472, 400, 829, 501.0, 677.2, 688.1999999999996, 829.0, 0.25853974935251667, 76.01927063725513, 0.13002731534818954], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 135.54385964912274, 82, 343, 88.0, 258.00000000000006, 284.39999999999964, 343.0, 0.25898260727332206, 0.45827781677662066, 0.12595052580284608], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 801.982456140351, 562, 1163, 800.0, 994.4, 1022.9999999999998, 1163.0, 0.2584119903163507, 232.51956312647906, 0.12971070607676197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 225.81818181818184, 84, 2439, 89.0, 256.7, 2111.6999999999953, 2439.0, 0.10482030464592178, 0.07830813774817398, 0.037260342667105005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 9, 5.325443786982248, 249.80473372781054, 83, 5084, 92.0, 376.0, 817.5, 4192.900000000014, 0.6849231791783355, 1.5962253108497506, 0.3259456385287526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 252.66666666666666, 85, 1465, 91.0, 1465.0, 1465.0, 1465.0, 0.06501997558138695, 0.050352383433632665, 0.02311256944494614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31167907-6f8d-4d12-85d6-2d7f28d893d3", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2731fad-6875-4f21-a181-99860c742b6a", 3, 0, 0.0, 401.6666666666667, 164, 581, 460.0, 581.0, 581.0, 581.0, 0.04201268783172518, 0.02662718203397426, 0.026941730152506057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 112.16666666666667, 87, 314, 89.5, 258.8000000000002, 314.0, 314.0, 0.06909974548260414, 0.05607606298441801, 0.024562800152019438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19b07d08-6d52-4a95-8c6b-0f9a446c2809", 3, 0, 0.0, 275.3333333333333, 164, 449, 213.0, 449.0, 449.0, 449.0, 0.019116925488596753, 0.02635422507949455, 0.012259226306163934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a01ec1d-3f94-4971-b86c-ed130e69bc2e", 3, 0, 0.0, 353.0, 180, 565, 314.0, 565.0, 565.0, 565.0, 0.043887239053791126, 0.028215265993241364, 0.02814383494009392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 1756.888888888889, 171, 5802, 505.0, 5802.0, 5802.0, 5802.0, 0.0670530911475019, 17.907227915785043, 0.1469914931047071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/792d14b0-b8bc-4a69-b6f0-b4f9a3a1772e", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 394.05263157894734, 169, 3261, 173.0, 698.0, 3261.0, 3261.0, 0.09860295186100097, 0.15281531699551615, 0.22176034974207542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbcecf82-0093-4098-af86-c506288a76a5", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/755da2b5-31ac-4b36-b9d7-0bc010742ecf", 3, 0, 0.0, 478.0, 312, 639, 483.0, 639.0, 639.0, 639.0, 0.02760143527463428, 0.027682298854540436, 0.017700139157236176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c31a5922-3cbf-46ba-a8ec-381221f85bf0", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ef9cecd-05f1-40d5-a511-d311352f608e", 3, 0, 0.0, 434.3333333333333, 355, 517, 431.0, 517.0, 517.0, 517.0, 0.019033842171380714, 0.026239688019465274, 0.012205946965371096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 120.0, 85, 269, 89.5, 269.0, 269.0, 269.0, 0.04400319023129177, 0.03648311377574874, 0.015641759027529494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 108.52941176470588, 86, 256, 90.0, 204.79999999999995, 256.0, 256.0, 0.17804775869291997, 0.13823043765710097, 0.0632904142228739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 89.49999999999999, 81, 180, 85.0, 92.19999999999999, 167.09999999999982, 180.0, 0.10317352379791121, 0.07667485508809611, 0.0517882726876234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 111.0, 81, 254, 85.0, 249.1, 253.39999999999998, 254.0, 0.1031314457153572, 0.03463656419932496, 0.058423451270391905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 161.59090909090907, 81, 906, 85.5, 322.0999999999999, 822.5999999999988, 906.0, 0.1031270947691125, 4.244438937333883, 0.060224611984305926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/079036e7-4667-4e9c-b63c-93850f6bbf5e", 3, 0, 0.0, 669.0, 541, 853, 613.0, 853.0, 853.0, 853.0, 0.04715646515137226, 0.03031706337042975, 0.030240311311264107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 137.0909090909091, 81, 487, 85.0, 252.7, 451.8999999999995, 487.0, 0.10313289611235861, 1.404920186272074, 0.06032871559697539], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5335365853658537], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1524390243902439], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1524390243902439], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 0.9908536585365854], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 24, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
