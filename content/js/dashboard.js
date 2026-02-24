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

    var data = {"OkPercent": 97.56816507000737, "KoPercent": 2.4318349299926307};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7663492063492063, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb369db2-67db-4dd4-a28c-4174bd09169a"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccc5304f-6a49-493d-8e16-d0e5d4372c81"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8bc093c-1cab-41fb-9cba-fece90866a86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28ee4445-756c-48c5-a6ef-8eeefe412c91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55d0bff2-810b-4de2-b21f-79641de89022"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1d474fc-0dbd-42d8-9810-bb5794a7b2ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28ee4445-756c-48c5-a6ef-8eeefe412c91"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04b4bd60-a74a-4143-b76f-667c5a0b07a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30de6f1b-bef9-4ae1-897d-26c1810cf5ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb369db2-67db-4dd4-a28c-4174bd09169a"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1575c722-7b39-4fba-8f0d-3a08d663f9ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b96a4645-74c7-4e3f-b84c-f6a9e3724f1e"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=058697aa-b4d2-419c-b128-84de967d037f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01894d36-fe86-4f27-9f7a-7995ff81c8a4"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccc5304f-6a49-493d-8e16-d0e5d4372c81"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3728813559322034, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55d0bff2-810b-4de2-b21f-79641de89022"], "isController": false}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8bc093c-1cab-41fb-9cba-fece90866a86"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9050279329608939, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1d474fc-0dbd-42d8-9810-bb5794a7b2ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa1fe758-8450-4a34-b11b-259440b4c84e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01894d36-fe86-4f27-9f7a-7995ff81c8a4"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d74f3b80-6964-4b87-9192-44668c1e0248"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30de6f1b-bef9-4ae1-897d-26c1810cf5ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04b4bd60-a74a-4143-b76f-667c5a0b07a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b96a4645-74c7-4e3f-b84c-f6a9e3724f1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1575c722-7b39-4fba-8f0d-3a08d663f9ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/058697aa-b4d2-419c-b128-84de967d037f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 33, 2.4318349299926307, 380.07148120854833, 124, 2293, 142.0, 1009.0, 1140.1999999999998, 1645.5200000000004, 5.416906176151242, 767.6339091914758, 3.9722086666506993], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1872.169491525424, 1517, 2814, 1848.0, 2179.0, 2223.0, 2814.0, 0.2482182974749047, 298.6900798663408, 1.2204874294786574], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cb369db2-67db-4dd4-a28c-4174bd09169a", 3, 0, 0.0, 392.0, 313, 437, 426.0, 437.0, 437.0, 437.0, 0.01972879483368626, 0.027197736367402768, 0.012651603457800108], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 635.7857142857144, 134, 1972, 507.0, 1546.5, 1972.0, 1972.0, 0.07539163260580409, 0.014851141913978147, 0.05072737779824122], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 635.7857142857144, 134, 1972, 507.0, 1546.5, 1972.0, 1972.0, 0.07482949564919932, 0.014740408462146965, 0.050349143068650716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 181.46666666666667, 125, 398, 131.0, 389.0, 398.0, 398.0, 0.1180795541316036, 0.04341883605047507, 0.06668112321207875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 153.13333333333338, 127, 462, 131.0, 267.60000000000014, 462.0, 462.0, 0.11807862462018043, 0.0877517903671458, 0.0592699346238015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 214.60000000000002, 126, 880, 132.0, 580.6000000000001, 880.0, 880.0, 0.11784577915700986, 2.3396837068389833, 0.06872035442118081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 231.86666666666667, 125, 908, 130.0, 600.8000000000002, 908.0, 908.0, 0.11782911636018005, 7.097831121909931, 0.06859557021437045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccc5304f-6a49-493d-8e16-d0e5d4372c81", 3, 0, 0.0, 286.3333333333333, 216, 380, 263.0, 380.0, 380.0, 380.0, 0.06412174582139955, 0.029013420147052535, 0.04111973934510323], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 250.64285714285714, 131, 435, 241.0, 384.5, 435.0, 435.0, 0.07559109536896554, 0.14528190922859288, 0.04885791641244661], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c8bc093c-1cab-41fb-9cba-fece90866a86", 2, 0, 0.0, 348.0, 210, 486, 348.0, 486.0, 486.0, 486.0, 0.03385125757421888, 0.029123982346569176, 0.02104133344334992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 148.73333333333338, 127, 386, 132.0, 239.60000000000008, 386.0, 386.0, 0.07751657562775506, 0.057607533254610946, 0.038909687375650495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 179.5333333333333, 126, 380, 131.0, 379.4, 380.0, 380.0, 0.07752138298147239, 0.028505258533812243, 0.04377737473836533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 824.8571428571429, 626, 952, 882.0, 952.0, 952.0, 952.0, 0.05633712133406304, 16.564984240696326, 0.032129764510832826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1096.2857142857142, 877, 1286, 1129.0, 1286.0, 1286.0, 1286.0, 0.05615453728661276, 50.52795135964173, 0.03197079613095238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 200.57142857142858, 126, 390, 128.0, 390.0, 390.0, 390.0, 0.056681997797499516, 0.10030056641510657, 0.03138544213982639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28ee4445-756c-48c5-a6ef-8eeefe412c91", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 149.46666666666667, 127, 393, 132.0, 244.2000000000001, 393.0, 393.0, 0.07773631840796019, 0.05777083819185323, 0.039019987950870645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 147.60000000000002, 127, 393, 131.0, 237.00000000000009, 393.0, 393.0, 0.07773833277188982, 0.02080107732372833, 0.04433514290896841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55d0bff2-810b-4de2-b21f-79641de89022", 3, 0, 0.0, 318.3333333333333, 234, 404, 317.0, 404.0, 404.0, 404.0, 0.07003618536243726, 0.03168955001750905, 0.044912527722656706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 146.19999999999996, 125, 391, 128.0, 237.4000000000001, 391.0, 391.0, 0.07773792989075229, 0.02095280141586683, 0.04570140018968055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 181.79999999999998, 126, 394, 131.0, 392.2, 394.0, 394.0, 0.07763091159391788, 0.020923956640548177, 0.04571429657337156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1d474fc-0dbd-42d8-9810-bb5794a7b2ed", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 165.28571428571428, 126, 392, 127.0, 392.0, 392.0, 392.0, 0.05656017194292271, 0.042033487156800955, 0.03175986217498101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 619.15, 126, 1254, 632.0, 1168.7, 1249.75, 1254.0, 0.10207675150945995, 45.93817665721606, 0.055623854826444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 230.4, 126, 1153, 130.0, 688.0000000000002, 1153.0, 1153.0, 0.07752138298147239, 4.669759917891935, 0.045129961368510815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 535.4000000000001, 126, 1087, 521.5, 914.5, 1078.3999999999999, 1087.0, 0.10207987750414699, 15.021193537067754, 0.05572524562970524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 179.26666666666665, 126, 627, 130.0, 477.6000000000001, 627.0, 627.0, 0.07752058171444519, 1.5390762679783148, 0.04520519859481025], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 447.3571428571429, 134, 1115, 409.5, 1007.0, 1115.0, 1115.0, 0.07477074754725244, 0.014728835872868365, 0.05078944891288674], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 334.33333333333337, 258, 785, 266.0, 629.6000000000001, 785.0, 785.0, 0.07757751286493755, 0.12022999308267178, 0.17447364465620233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28ee4445-756c-48c5-a6ef-8eeefe412c91", 3, 0, 0.0, 596.0, 429, 924, 435.0, 924.0, 924.0, 924.0, 0.020253574755944425, 0.023939039693630922, 0.012988132249091964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 438.09523809523813, 137, 949, 453.0, 855.2, 941.3999999999999, 949.0, 0.09977526808664294, 0.06128773791650235, 0.04511323156651922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 143.60000000000002, 127, 381, 131.0, 144.5, 369.1999999999998, 381.0, 0.1020705000944152, 0.07585512751157224, 0.05123460649270451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 230.85, 126, 395, 130.0, 391.7, 394.85, 395.0, 0.10207987750414699, 0.10397393773127471, 0.05393087278295266], "isController": false}, {"data": ["login", 21, 0, 0.0, 2345.3333333333335, 1380, 3863, 2209.0, 3250.8, 3807.1999999999994, 3863.0, 0.10524944117558614, 42.113172476581994, 0.21697418976724836], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 137.13333333333333, 128, 151, 136.0, 150.4, 151.0, 151.0, 0.07915734369063199, 0.06408343546829484, 0.028137962015029338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04b4bd60-a74a-4143-b76f-667c5a0b07a4", 3, 0, 0.0, 325.0, 209, 432, 334.0, 432.0, 432.0, 432.0, 0.04260516374584599, 0.027391015103530546, 0.027321670761496292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30de6f1b-bef9-4ae1-897d-26c1810cf5ce", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb369db2-67db-4dd4-a28c-4174bd09169a", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 792.0499999999997, 254, 1389, 889.0, 1300.9, 1384.6, 1389.0, 0.10200126481568372, 61.09352806756054, 0.21635424529264163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1575c722-7b39-4fba-8f0d-3a08d663f9ea", 3, 0, 0.0, 419.3333333333333, 248, 560, 450.0, 560.0, 560.0, 560.0, 0.04573867967678, 0.029405563919804846, 0.029331119454185088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b96a4645-74c7-4e3f-b84c-f6a9e3724f1e", 3, 0, 0.0, 289.0, 202, 393, 272.0, 393.0, 393.0, 393.0, 0.029763085836739554, 0.029850282377276875, 0.019086353873169568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 422.53333333333336, 255, 1040, 273.0, 931.4000000000001, 1040.0, 1040.0, 0.11771076111778139, 9.558466321970322, 0.2627264338151627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 855.7272727272727, 131, 1412, 1255.0, 1398.4, 1412.0, 1412.0, 0.07738522364329632, 58.92184026458712, 0.12968757694553487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=058697aa-b4d2-419c-b128-84de967d037f", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01894d36-fe86-4f27-9f7a-7995ff81c8a4", 1, 0, 0.0, 1115.0, 1115, 1115, 1115.0, 1115.0, 1115.0, 1115.0, 0.8968609865470852, 0.16203054932735425, 0.6183436098654709], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 989.6521739130435, 155, 2139, 1000.0, 1840.4000000000005, 2115.9999999999995, 2139.0, 0.09324727555786197, 0.02909226311137779, 0.04207054815208225], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 137.16666666666666, 126, 156, 135.0, 155.1, 156.0, 156.0, 0.09247557103665115, 0.07179499899818131, 0.03287217564193459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 415.3333333333333, 254, 1283, 269.0, 971.0000000000002, 1283.0, 1283.0, 0.0774633340218963, 6.290254709125181, 0.17289553908025201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccc5304f-6a49-493d-8e16-d0e5d4372c81", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 462.13333333333327, 258, 793, 522.0, 785.8, 793.0, 793.0, 0.09692865404870987, 0.15022048239775643, 0.2179948147208778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 129.99999999999997, 126, 135, 130.0, 134.6, 135.0, 135.0, 0.051619684932213965, 0.038361894759194166, 0.025910662163240214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 128.9090909090909, 126, 132, 129.0, 131.8, 132.0, 132.0, 0.05162065389290122, 0.02086090345529886, 0.029045783413814627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 220.1818181818182, 126, 1129, 129.0, 929.8000000000008, 1129.0, 1129.0, 0.05162113838688635, 4.235266014578278, 0.029944293165830558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 225.45454545454547, 127, 911, 129.0, 810.2000000000004, 911.0, 911.0, 0.0515538808355478, 1.390682412276385, 0.02995562411831147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 134.5, 134, 135, 134.5, 135.0, 135.0, 135.0, 0.039916972696790676, 0.011772388432061312, 0.024675238004949706], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1214.3050847457628, 999, 2236, 1039.0, 1649.0, 1679.0, 2236.0, 0.2530809387158073, 302.7727878742059, 0.49973599422203346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 989.6521739130435, 155, 2139, 1000.0, 1840.4000000000005, 2115.9999999999995, 2139.0, 0.09795695856420653, 0.03056163941617653, 0.04419542466471037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 127.80000000000001, 124, 132, 127.0, 132.0, 132.0, 132.0, 0.049562364323027665, 0.013358606008941051, 0.029185650084751644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 156.60000000000002, 126, 398, 130.0, 371.6000000000001, 398.0, 398.0, 0.04956162740559749, 0.013358407386664948, 0.029136816111493838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 200.38888888888886, 126, 1161, 129.0, 460.8000000000011, 1161.0, 1161.0, 0.09595854590816767, 4.821297407853141, 0.05595499410921149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 228.66666666666666, 126, 881, 132.0, 443.6000000000007, 881.0, 881.0, 0.09583133684714902, 1.5898165062822764, 0.0559744017196401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 160.7, 125, 379, 131.5, 359.20000000000005, 379.0, 379.0, 0.0495621186814494, 0.013261738787809702, 0.02826589581051411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 132.38888888888886, 127, 139, 132.0, 138.1, 139.0, 139.0, 0.0959554766588303, 0.07131066185290026, 0.04816515136976443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 157.8, 128, 380, 133.0, 356.6000000000001, 380.0, 380.0, 0.04955966239957973, 0.03683096004500017, 0.02487662741541405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 173.55555555555554, 125, 389, 130.5, 389.0, 389.0, 389.0, 0.09583133684714902, 0.03363871253260927, 0.054206679577277324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 164.60000000000002, 129, 396, 136.5, 372.1000000000001, 396.0, 396.0, 0.04944522458021004, 0.03891879981606376, 0.01757623217499654], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 380.07692307692304, 131, 560, 409.0, 512.8, 560.0, 560.0, 0.07574036203893054, 0.014696315741177704, 0.05154236325951561], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1230.3809523809525, 857, 2293, 1104.0, 2061.0000000000005, 2278.1, 2293.0, 0.10425923811320567, 0.05396230097656153, 0.04795517690558582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 321.7, 256, 778, 265.0, 733.0000000000002, 778.0, 778.0, 0.049528243480844954, 0.07675910391025483, 0.11139018040662688], "isController": false}, {"data": ["addBook", 60, 17, 28.333333333333332, 1088.5666666666664, 668, 2072, 948.0, 1794.4, 1904.9499999999996, 2072.0, 0.2856612343421936, 80.88655001273574, 1.038623147070306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55d0bff2-810b-4de2-b21f-79641de89022", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 234.38983050847446, 127, 887, 134.0, 524.0, 529.0, 887.0, 0.2540705110262295, 0.1888160731357038, 0.1228172880449059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8bc093c-1cab-41fb-9cba-fece90866a86", 1, 0, 0.0, 899.0, 899, 899, 899.0, 899.0, 899.0, 899.0, 1.1123470522803114, 0.20096113737486096, 0.7669111512791991], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 722.2542372881358, 620, 1094, 649.0, 1004.0, 1042.0, 1094.0, 0.25408254668228486, 74.70870505914955, 0.12778565580212567], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 204.59322033898303, 126, 428, 132.0, 382.0, 392.0, 428.0, 0.25465280894996717, 0.45061610333724667, 0.12384482310262077], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 970.9661016949152, 866, 1317, 904.0, 1169.0, 1186.0, 1317.0, 0.2540836408893789, 228.62490670366313, 0.12753807755580152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 151.2, 128, 398, 133.0, 245.60000000000008, 398.0, 398.0, 0.10144319857167977, 0.07578520205794435, 0.03605988699227679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 17, 9.497206703910615, 177.76536312849174, 126, 439, 138.0, 291.0, 377.0, 425.3999999999998, 0.7375785995071821, 1.6326073094451266, 0.35189262694386986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 156.9090909090909, 128, 380, 135.0, 332.4000000000002, 380.0, 380.0, 0.05066882853668423, 0.03923865334920956, 0.01801118514389947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1d474fc-0dbd-42d8-9810-bb5794a7b2ed", 3, 0, 0.0, 334.6666666666667, 255, 411, 338.0, 411.0, 411.0, 411.0, 0.01809463494074007, 0.024944915030610092, 0.011603655870201153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 135.8666666666667, 129, 150, 135.0, 145.2, 150.0, 150.0, 0.12022891585578943, 0.09756858308218849, 0.042737622433112646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa1fe758-8450-4a34-b11b-259440b4c84e", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01894d36-fe86-4f27-9f7a-7995ff81c8a4", 3, 0, 0.0, 382.6666666666667, 244, 462, 442.0, 462.0, 462.0, 462.0, 0.02296263978506969, 0.027141062844917987, 0.014725390747587011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 377.8181818181818, 254, 1259, 264.0, 1115.0000000000005, 1259.0, 1259.0, 0.05152104166178778, 5.675959359851057, 0.11467365372005339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d74f3b80-6964-4b87-9192-44668c1e0248", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.6942085597826086, 1.2971297554347825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 393.6666666666667, 260, 1293, 269.0, 609.9000000000011, 1293.0, 1293.0, 0.09576250897773521, 6.5049042956800465, 0.21401091958609314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30de6f1b-bef9-4ae1-897d-26c1810cf5ce", 3, 0, 0.0, 307.3333333333333, 238, 409, 275.0, 409.0, 409.0, 409.0, 0.021152232618152845, 0.0291600602662361, 0.01356442000578161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04b4bd60-a74a-4143-b76f-667c5a0b07a4", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b96a4645-74c7-4e3f-b84c-f6a9e3724f1e", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 153.53333333333336, 131, 398, 135.0, 249.2000000000001, 398.0, 398.0, 0.07572430295779127, 0.06278313790152812, 0.026917623317027368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1575c722-7b39-4fba-8f0d-3a08d663f9ea", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 149.3, 129, 388, 134.0, 164.60000000000002, 376.89999999999986, 388.0, 0.10234314633534779, 0.0794558606802749, 0.03637979029889316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/058697aa-b4d2-419c-b128-84de967d037f", 3, 0, 0.0, 308.6666666666667, 227, 382, 317.0, 382.0, 382.0, 382.0, 0.06107616197398156, 0.0283113459150227, 0.03916667939086708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 165.46666666666664, 126, 395, 132.0, 388.4, 395.0, 395.0, 0.09701014726140354, 0.07209445514250791, 0.0486945465745717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 249.7333333333333, 126, 395, 136.0, 394.4, 395.0, 395.0, 0.09717102748644464, 0.026000841339146322, 0.05541785161336296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 220.66666666666669, 124, 494, 129.0, 433.40000000000003, 494.0, 494.0, 0.09717102748644464, 0.026190628502205784, 0.057125936080898124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 217.33333333333334, 128, 412, 130.0, 403.0, 412.0, 412.0, 0.09717039800995025, 0.026190458838619403, 0.057220458984375], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.5895357406042742], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.0606060606060606, 0.14738393515106854], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.0606060606060606, 0.14738393515106854], "isController": false}, {"data": ["401/Unauthorized", 21, 63.63636363636363, 1.5475313190862197], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 33, "401/Unauthorized", 21, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
