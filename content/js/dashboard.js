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

    var data = {"OkPercent": 98.69831546707503, "KoPercent": 1.3016845329249618};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7869336835193697, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1111111111111111, 500, 1500, "see books"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a694c3ca-4833-41a5-8356-4b0c11333ef9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebb9f9ba-c43a-4471-84e1-d637a433d636"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5f2fbd1-e389-4e2a-93b6-290868bfa5f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/259f7b1e-fa5e-4a39-9448-1937df327d82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8297e03c-a588-4245-82e2-8c30647115f2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11c9fed7-6f39-475d-9645-9f46fbec6032"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e58004e-628e-4126-877c-8ee8a5e34fac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca19525d-cfb6-4e77-935c-13bacc6eae42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ce88893-3fa5-45a6-9339-ca4d2715b291"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/197e4ef9-ade6-483b-8283-d75f3b9bff44"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/616b4b81-fca2-46fc-ae51-381b4ddbdc5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aeb8a5cb-b45e-4035-b3ce-f7ac7f324d9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/411531e3-6325-457a-8784-a1a3f5d10d0c"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4263580-fbc9-4172-824c-8275e70a5dc7"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5f2fbd1-e389-4e2a-93b6-290868bfa5f3"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a694c3ca-4833-41a5-8356-4b0c11333ef9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebb9f9ba-c43a-4471-84e1-d637a433d636"], "isController": false}, {"data": [0.3360655737704918, 500, 1500, "addBook"], "isController": true}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11c9fed7-6f39-475d-9645-9f46fbec6032"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=259f7b1e-fa5e-4a39-9448-1937df327d82"], "isController": false}, {"data": [0.9517045454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c70f30be-0faa-4a1b-8cbc-f1c3999d1939"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e58004e-628e-4126-877c-8ee8a5e34fac"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c70f30be-0faa-4a1b-8cbc-f1c3999d1939"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8297e03c-a588-4245-82e2-8c30647115f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7392bff5-56de-49a4-8842-66a14517b5c4"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ce88893-3fa5-45a6-9339-ca4d2715b291"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aeb8a5cb-b45e-4035-b3ce-f7ac7f324d9e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=616b4b81-fca2-46fc-ae51-381b4ddbdc5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca19525d-cfb6-4e77-935c-13bacc6eae42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4263580-fbc9-4172-824c-8275e70a5dc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 17, 1.3016845329249618, 363.9035222052068, 108, 4506, 143.5, 905.3, 1102.0, 1484.0900000000008, 5.117594965477786, 715.8588089566729, 3.736781403557238], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1685.1481481481483, 1336, 2258, 1710.0, 1933.5, 2020.25, 2258.0, 0.230374443795035, 277.2176348237102, 1.132749340339845], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 841.857142857143, 112, 2696, 610.5, 2029.0, 2696.0, 2696.0, 0.07710779669978629, 0.014559905529179793, 0.05214565352988478], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 841.857142857143, 112, 2696, 610.5, 2029.0, 2696.0, 2696.0, 0.07501111771923338, 0.014163999418663836, 0.05072773341852453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a694c3ca-4833-41a5-8356-4b0c11333ef9", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 140.12499999999997, 109, 336, 113.0, 331.1, 336.0, 336.0, 0.0836658178072235, 0.030241026187400974, 0.04727649787959443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 114.625, 112, 120, 114.0, 118.6, 120.0, 120.0, 0.08366319290117807, 0.062175478318160664, 0.041995001124224156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 291.3125, 109, 957, 338.5, 614.7000000000004, 957.0, 957.0, 0.08365925585091921, 1.5585519203720746, 0.04881484899504319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 209.25, 110, 770, 114.5, 467.6000000000003, 770.0, 770.0, 0.08366538031144438, 4.726282049396564, 0.04873671812087556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebb9f9ba-c43a-4471-84e1-d637a433d636", 3, 0, 0.0, 293.0, 206, 441, 232.0, 441.0, 441.0, 441.0, 0.08088869715271785, 0.03660002898511648, 0.05187198352566868], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 290.5714285714286, 110, 413, 319.0, 412.0, 413.0, 413.0, 0.07684285635874635, 0.15988202563258136, 0.04967234583401943], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 113.71428571428571, 110, 119, 114.0, 116.8, 118.8, 119.0, 0.10796193570609677, 0.08023343073470668, 0.05419183100872435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 112.99999999999999, 110, 122, 112.0, 116.0, 121.39999999999999, 122.0, 0.10796582110577566, 0.044333063632998465, 0.060710691443965736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 705.3333333333334, 549, 905, 669.5, 905.0, 905.0, 905.0, 0.10419741937724676, 30.637500976850806, 0.05942509073858604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5f2fbd1-e389-4e2a-93b6-290868bfa5f3", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.23221601863753213, 0.8861865359897172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 897.1666666666666, 772, 989, 920.5, 989.0, 989.0, 989.0, 0.10380622837370243, 93.40502676254326, 0.059100616349480974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 264.8333333333333, 109, 362, 334.0, 362.0, 362.0, 362.0, 0.10458610050724258, 0.18506837316320662, 0.057910467761334516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/259f7b1e-fa5e-4a39-9448-1937df327d82", 3, 0, 0.0, 482.0, 337, 696, 413.0, 696.0, 696.0, 696.0, 0.024519820187985288, 0.024591655598692277, 0.01572397323252963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 113.27272727272727, 109, 118, 114.0, 117.6, 118.0, 118.0, 0.0660022440762986, 0.049050495841858624, 0.033130032671110816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 134.27272727272728, 109, 348, 111.0, 302.8000000000002, 348.0, 348.0, 0.06600264010560422, 0.01766086268450738, 0.03764213068522741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 152.9090909090909, 108, 355, 111.0, 351.0, 355.0, 355.0, 0.06600264010560422, 0.017789774090963637, 0.03880233334333373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 134.0, 109, 350, 113.0, 303.20000000000016, 350.0, 350.0, 0.0660022440762986, 0.017789667348689857, 0.03886655583789849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 163.33333333333334, 112, 408, 114.5, 408.0, 408.0, 408.0, 0.10504201680672269, 0.07806345194327731, 0.0589835543592437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8297e03c-a588-4245-82e2-8c30647115f2", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.27414880500758726, 1.0462111153262519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 647.5882352941178, 111, 1369, 779.0, 1195.3999999999999, 1369.0, 1369.0, 0.07354499872377797, 38.9351735310468, 0.039518607425449166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 197.8095238095238, 109, 997, 113.0, 697.4000000000003, 975.9999999999998, 997.0, 0.10796471096304522, 9.278408134241264, 0.06258780165854361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 477.94117647058823, 109, 904, 569.0, 894.4, 904.0, 904.0, 0.07354468055651693, 12.728502240949679, 0.03959025743882813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 188.61904761904765, 109, 827, 114.0, 674.0000000000002, 820.3, 827.0, 0.10796471096304522, 3.0496817611614944, 0.06269323594659346], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 472.7142857142857, 112, 778, 494.0, 745.0, 778.0, 778.0, 0.0753506496302436, 0.0142281116454429, 0.05156704963185826], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/11c9fed7-6f39-475d-9645-9f46fbec6032", 3, 0, 0.0, 308.3333333333333, 211, 495, 219.0, 495.0, 495.0, 495.0, 0.019101466992665038, 0.026320478443994495, 0.01224931314308272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e58004e-628e-4126-877c-8ee8a5e34fac", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 271.27272727272725, 220, 468, 229.0, 467.8, 468.0, 468.0, 0.0659575233549594, 0.1022212788714068, 0.14834001590475734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 734.0454545454546, 150, 4506, 489.5, 1497.8, 4063.4999999999936, 4506.0, 0.09430120662680298, 0.0579252528986905, 0.042638143230673616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 126.70588235294117, 110, 331, 114.0, 161.39999999999986, 331.0, 331.0, 0.07354277161075974, 0.05465434491776188, 0.03691502403118214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca19525d-cfb6-4e77-935c-13bacc6eae42", 3, 0, 0.0, 555.3333333333334, 219, 1036, 411.0, 1036.0, 1036.0, 1036.0, 0.06082601731513959, 0.028195393442955335, 0.03900626761420085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 219.7058823529412, 110, 358, 115.0, 350.8, 358.0, 358.0, 0.07354468055651693, 0.08465580819114696, 0.038310154140998136], "isController": false}, {"data": ["login", 22, 0, 0.0, 2545.4090909090905, 1309, 6194, 2481.5, 3873.0, 5857.999999999995, 6194.0, 0.09256493219618717, 30.328040455608804, 0.18152226449587877], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 138.71428571428572, 114, 335, 117.0, 291.20000000000016, 334.5, 335.0, 0.11065327586388593, 0.08958160712027484, 0.0393337816547407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ce88893-3fa5-45a6-9339-ca4d2715b291", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 779.8235294117649, 227, 1485, 901.0, 1308.9999999999998, 1485.0, 1485.0, 0.07350715613784754, 51.776387751599856, 0.15425608460889867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/197e4ef9-ade6-483b-8283-d75f3b9bff44", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/616b4b81-fca2-46fc-ae51-381b4ddbdc5e", 3, 0, 0.0, 371.3333333333333, 232, 558, 324.0, 558.0, 558.0, 558.0, 0.03354841595562663, 0.027967934004674413, 0.021513795388211087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aeb8a5cb-b45e-4035-b3ce-f7ac7f324d9e", 3, 0, 0.0, 378.6666666666667, 318, 476, 342.0, 476.0, 476.0, 476.0, 0.027254392499591187, 0.02733423935261733, 0.017477588940167522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/411531e3-6325-457a-8784-a1a3f5d10d0c", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 448.43749999999994, 227, 1071, 455.0, 729.4000000000003, 1071.0, 1071.0, 0.08360854479327788, 6.373033770340392, 0.1867005749393838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 829.25, 110, 1314, 1003.5, 1314.0, 1314.0, 1314.0, 0.13813585661498082, 123.95312176244086, 0.25649225036260664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4263580-fbc9-4172-824c-8275e70a5dc7", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 840.375, 176, 1592, 868.5, 1369.5, 1537.0, 1592.0, 0.09817757869546542, 0.030824308154875128, 0.04429496226299319], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 316.904761904762, 223, 1114, 231.0, 845.8000000000004, 1096.9999999999998, 1114.0, 0.10789869853617433, 12.445044118043745, 0.2400374739244812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 116.0909090909091, 113, 120, 116.0, 119.6, 120.0, 120.0, 0.06907291588174717, 0.05362594543553613, 0.024553263067339813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5f2fbd1-e389-4e2a-93b6-290868bfa5f3", 3, 0, 0.0, 590.3333333333333, 242, 1158, 371.0, 1158.0, 1158.0, 1158.0, 0.02423087174599585, 0.028640070087796527, 0.01553867751940489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 466.0, 226, 1109, 454.5, 804.8000000000005, 1109.0, 1109.0, 0.08799589352496884, 5.97733781104104, 0.19665401725697246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 154.72727272727272, 110, 338, 115.0, 337.6, 338.0, 338.0, 0.059625443803019214, 0.04431148704501721, 0.029929177846437376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 155.27272727272728, 108, 344, 114.0, 340.8, 344.0, 344.0, 0.05955958394923357, 0.015936841798916017, 0.03396757522104728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 155.63636363636363, 110, 339, 112.0, 338.6, 339.0, 339.0, 0.059556681718264406, 0.016052386869375955, 0.035012814838276535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 115.81818181818181, 111, 146, 113.0, 140.00000000000003, 146.0, 146.0, 0.05962964569148706, 0.016072052940283618, 0.03511394174996747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 2.6332310267857144, 5.519321986607142], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1093.5, 879, 1686, 1005.5, 1448.5, 1463.0, 1686.0, 0.2292837853903769, 274.3031192679054, 0.45274591216732624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 840.375, 176, 1592, 868.5, 1369.5, 1537.0, 1592.0, 0.09446141251298844, 0.029657562620044712, 0.04261833259863346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 203.5, 108, 344, 114.5, 344.0, 344.0, 344.0, 0.08437964088024842, 0.022742950081004455, 0.04968840180741191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 157.49999999999997, 110, 341, 114.0, 340.1, 341.0, 341.0, 0.08437821691952005, 0.022742566279089393, 0.04960516268120222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 305.0909090909091, 110, 987, 115.0, 948.6000000000001, 987.0, 987.0, 0.07156659271452087, 11.724099704462501, 0.040955100908895724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 296.72727272727275, 111, 799, 118.0, 770.4000000000001, 799.0, 799.0, 0.0716687081389591, 3.8472556585702744, 0.04108352702887597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 134.45454545454544, 110, 345, 114.0, 299.20000000000016, 345.0, 345.0, 0.07166917508779473, 0.05326195531426933, 0.035974566401490715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 181.5, 110, 349, 114.5, 348.7, 349.0, 349.0, 0.08421052631578947, 0.022532894736842106, 0.04802631578947368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 154.45454545454547, 111, 346, 113.0, 345.4, 346.0, 346.0, 0.07167104294398582, 0.03874970272806051, 0.03978048299767394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 170.0, 111, 438, 114.5, 429.3, 438.0, 438.0, 0.08414746000891964, 0.062535368229285, 0.042238080512289736], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 639.5, 110, 1158, 607.0, 1097.0, 1158.0, 1158.0, 0.07341104416723036, 0.013718484048828833, 0.04996313880717541], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 118.9, 114, 128, 117.5, 127.4, 128.0, 128.0, 0.08090025807182324, 0.06367735156825151, 0.028757513611468423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1215.5909090909092, 843, 2139, 1028.5, 2000.6, 2130.75, 2139.0, 0.09369197485648094, 0.04849291667376454, 0.0430946485912134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 423.2, 225, 780, 455.5, 771.6, 780.0, 780.0, 0.08390035993254412, 0.13002917110639406, 0.18869387590297765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a694c3ca-4833-41a5-8356-4b0c11333ef9", 3, 0, 0.0, 849.3333333333334, 218, 1895, 435.0, 1895.0, 1895.0, 1895.0, 0.03081664098613251, 0.030906924114021572, 0.01976197354904982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebb9f9ba-c43a-4471-84e1-d637a433d636", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 1082.2295081967216, 555, 2345, 921.0, 1743.2, 1943.6999999999998, 2345.0, 0.2867107229810395, 91.0759166885029, 1.0425072514899556], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 211.6296296296297, 111, 510, 117.0, 455.5, 471.25, 510.0, 0.23025165653275115, 0.171114756466234, 0.11130329099971857], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 645.6296296296297, 538, 920, 567.5, 878.0, 907.5, 920.0, 0.22989582313348006, 67.59700526099562, 0.1156214344860764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11c9fed7-6f39-475d-9645-9f46fbec6032", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 192.9814814814815, 109, 451, 117.0, 342.0, 346.5, 451.0, 0.23064700756863885, 0.408137087611693, 0.11217012672771694], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 867.4814814814814, 757, 1247, 789.5, 1019.0, 1140.75, 1247.0, 0.22978136728423956, 206.75767819491844, 0.11533947537509681], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 134.38888888888889, 111, 375, 117.0, 195.9000000000003, 375.0, 375.0, 0.08449196856898769, 0.0631214413625738, 0.030034254452257342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=259f7b1e-fa5e-4a39-9448-1937df327d82", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 6, 3.409090909090909, 181.9715909090908, 110, 1041, 118.0, 325.20000000000005, 367.50000000000017, 799.9899999999968, 0.7137758743754461, 1.4955771749886446, 0.34580647802300307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c70f30be-0faa-4a1b-8cbc-f1c3999d1939", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 138.45454545454547, 113, 348, 117.0, 303.8000000000002, 348.0, 348.0, 0.061161059309547246, 0.04736398440670992, 0.02174084530144062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e58004e-628e-4126-877c-8ee8a5e34fac", 3, 0, 0.0, 405.0, 239, 656, 320.0, 656.0, 656.0, 656.0, 0.022559104854719365, 0.026664098218582684, 0.014466613464777716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c70f30be-0faa-4a1b-8cbc-f1c3999d1939", 3, 0, 0.0, 697.6666666666666, 321, 1057, 715.0, 1057.0, 1057.0, 1057.0, 0.08711054327942158, 0.03941525233020703, 0.055861904381660325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8297e03c-a588-4245-82e2-8c30647115f2", 3, 0, 0.0, 446.0, 219, 895, 224.0, 895.0, 895.0, 895.0, 0.030147117935525363, 0.030235439570102097, 0.019332624457351878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 117.6875, 114, 127, 117.0, 127.0, 127.0, 127.0, 0.08709047066956242, 0.07067595813125623, 0.030957940745821016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 313.9090909090909, 223, 683, 230.0, 681.2, 683.0, 683.0, 0.05951640217938244, 0.09223879908074212, 0.13385378341710719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7392bff5-56de-49a4-8842-66a14517b5c4", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.8748929794520548, 1.6347388698630136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 483.72727272727275, 222, 1145, 448.0, 1135.6000000000001, 1145.0, 1145.0, 0.07151308689490177, 15.646046331947495, 0.15750782783874448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ce88893-3fa5-45a6-9339-ca4d2715b291", 3, 0, 0.0, 357.3333333333333, 219, 513, 340.0, 513.0, 513.0, 513.0, 0.052882072977260705, 0.03434236184558435, 0.03391200643398555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aeb8a5cb-b45e-4035-b3ce-f7ac7f324d9e", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=616b4b81-fca2-46fc-ae51-381b4ddbdc5e", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 115.36363636363636, 112, 119, 116.0, 118.8, 119.0, 119.0, 0.06801669500695624, 0.05639274810635338, 0.024177809553253982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca19525d-cfb6-4e77-935c-13bacc6eae42", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.5221504696531792, 1.9926390895953758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 117.64705882352939, 110, 136, 117.0, 128.0, 136.0, 136.0, 0.07710554842455222, 0.059862217771014664, 0.027408612916540048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4263580-fbc9-4172-824c-8275e70a5dc7", 3, 0, 0.0, 474.0, 246, 769, 407.0, 769.0, 769.0, 769.0, 0.022995025409503076, 0.02717934155660992, 0.014746158872630555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 156.94444444444443, 111, 424, 115.0, 346.60000000000014, 424.0, 424.0, 0.08813937773599317, 0.06550201802450274, 0.0442418360901372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 188.16666666666666, 111, 353, 114.0, 352.1, 353.0, 353.0, 0.08805228348921848, 0.030908109493014518, 0.04980648370543576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 255.44444444444446, 110, 995, 115.0, 495.5000000000008, 995.0, 995.0, 0.0881462836547408, 4.428781666858467, 0.05139953649745845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 273.22222222222223, 110, 778, 330.5, 388.30000000000064, 778.0, 778.0, 0.08805056058856908, 1.460735488166983, 0.051429705691001235], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 41.1764705882353, 0.5359877488514548], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07656967840735068], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07656967840735068], "isController": false}, {"data": ["401/Unauthorized", 8, 47.05882352941177, 0.6125574272588055], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 17, "401/Unauthorized", 8, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
