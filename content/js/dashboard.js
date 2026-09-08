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

    var data = {"OkPercent": 97.34446130500758, "KoPercent": 2.655538694992413};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7746753246753246, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98a0847f-6375-4012-bb21-62b4b4ea4fda"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73bfe85e-a2a7-4268-9360-d7403597f91d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea0eac08-c5d0-4c00-9a2c-de7336fb6d5c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56013046-479f-4483-8be2-1bc5d1efa27a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76972e30-83d3-43b6-9aa5-d39ed5dce96a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd16eb4b-8686-45ad-8d25-3829ce0ff17a"], "isController": false}, {"data": [0.5208333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09783396-f243-40ea-843c-1282b02271a6"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c24e881b-4ea9-44e8-a2c8-a37efc881f1f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e9c3078-d665-43e2-8a16-bca42a190436"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab7a28d6-ead7-4161-b78c-9c0809115255"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/77148d22-3b69-4aa4-9464-54e13137eac1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bb5917b-ca09-4bce-a536-c57d8d48df14"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea0eac08-c5d0-4c00-9a2c-de7336fb6d5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98a0847f-6375-4012-bb21-62b4b4ea4fda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e9c3078-d665-43e2-8a16-bca42a190436"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9719edc0-17a3-4a9a-a61e-e4da153b7cd1"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/09783396-f243-40ea-843c-1282b02271a6"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6228070175438597, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8952095808383234, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab7a28d6-ead7-4161-b78c-9c0809115255"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/8a76aecf-5cf3-4f9d-a1bc-1cf36c61dea5"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77148d22-3b69-4aa4-9464-54e13137eac1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76972e30-83d3-43b6-9aa5-d39ed5dce96a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd16eb4b-8686-45ad-8d25-3829ce0ff17a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73bfe85e-a2a7-4268-9360-d7403597f91d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9719edc0-17a3-4a9a-a61e-e4da153b7cd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c24e881b-4ea9-44e8-a2c8-a37efc881f1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9bb5917b-ca09-4bce-a536-c57d8d48df14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7100e3a8-2ce1-4e7d-87d8-1ef063528b43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1318, 35, 2.655538694992413, 334.9499241274664, 83, 2395, 103.0, 893.2000000000016, 1106.1499999999999, 1626.5399999999981, 5.149081135141893, 751.135399645903, 3.767030479640033], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98a0847f-6375-4012-bb21-62b4b4ea4fda", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1420.2105263157894, 1054, 1889, 1407.0, 1757.4, 1844.6, 1889.0, 0.2391170289079903, 287.73686055858997, 1.1757365630388], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 531.8666666666667, 87, 1055, 495.0, 1003.4000000000001, 1055.0, 1055.0, 0.09166406951803033, 0.018655070398005392, 0.06142566846022696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 531.8666666666667, 87, 1055, 495.0, 1003.4000000000001, 1055.0, 1055.0, 0.08939532998796143, 0.018193346454581212, 0.05990534710716712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73bfe85e-a2a7-4268-9360-d7403597f91d", 3, 0, 0.0, 370.0, 236, 484, 390.0, 484.0, 484.0, 484.0, 0.02236952971792023, 0.026440026824794387, 0.014345043471452754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 110.81249999999999, 85, 261, 88.0, 256.1, 261.0, 261.0, 0.12891581797086502, 0.03449505285548537, 0.07352230243650897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 110.81249999999999, 86, 266, 88.5, 256.90000000000003, 266.0, 266.0, 0.12891477927372635, 0.09580483108135328, 0.06470917631513218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 131.25, 84, 262, 89.5, 258.5, 262.0, 262.0, 0.1289189341627118, 0.03474768147354342, 0.07591613017589377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 121.93749999999999, 85, 267, 88.0, 260.0, 267.0, 267.0, 0.128912701929662, 0.034746001691979216, 0.07578656890786771], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 242.43749999999997, 84, 524, 198.5, 445.6000000000001, 524.0, 524.0, 0.0857127551293727, 0.13859267022017466, 0.05539626245513473], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 88.44444444444444, 86, 93, 88.0, 92.1, 93.0, 93.0, 0.09233562975464371, 0.0686205217219569, 0.04634815790418639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 116.16666666666667, 84, 264, 88.0, 257.7, 264.0, 264.0, 0.09233752443097001, 0.032412314619595047, 0.05223041610879412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 575.111111111111, 420, 700, 514.0, 700.0, 700.0, 700.0, 0.06626417317037255, 19.48386708971433, 0.037791286261228095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea0eac08-c5d0-4c00-9a2c-de7336fb6d5c", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 904.3333333333334, 676, 1094, 972.0, 1094.0, 1094.0, 1094.0, 0.06626027034190299, 59.621107726775776, 0.03772435313411079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 164.55555555555554, 85, 267, 92.0, 267.0, 267.0, 267.0, 0.0665463902280323, 0.11775591708319777, 0.0368474641204046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56013046-479f-4483-8be2-1bc5d1efa27a", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 90.81818181818183, 85, 110, 90.0, 107.20000000000002, 110.0, 110.0, 0.06663355181061534, 0.04951966106238112, 0.033446919561187775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 103.90909090909092, 85, 268, 87.0, 232.40000000000012, 268.0, 268.0, 0.06663476274995608, 0.026928394889719466, 0.03749388550330448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 177.72727272727272, 83, 741, 89.0, 644.8000000000004, 741.0, 741.0, 0.06656500375184567, 5.461338261034662, 0.0386129025669886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 155.81818181818178, 84, 678, 87.0, 593.8000000000003, 678.0, 678.0, 0.06663557006730193, 1.7975157994451074, 0.038718910341840475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 87.0, 86, 89, 86.0, 89.0, 89.0, 89.0, 0.06654934264038215, 0.04945707983333087, 0.037369015642792706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 144.44444444444446, 83, 956, 87.0, 326.000000000001, 956.0, 956.0, 0.09234036659125537, 4.639507256734434, 0.053845174702843564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 548.2105263157896, 84, 1115, 780.0, 1095.0, 1115.0, 1115.0, 0.08921109222548808, 42.25996750544657, 0.048411323587412784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 149.0, 83, 683, 88.0, 304.1000000000006, 683.0, 683.0, 0.09225565065860283, 1.530496819102045, 0.053885868868843216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 416.6842105263158, 85, 773, 519.0, 751.0, 773.0, 773.0, 0.08928487514215092, 13.828619150665878, 0.04853855491254781], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 381.3333333333333, 89, 809, 426.0, 704.0, 809.0, 809.0, 0.08966358223943763, 0.01824793997919805, 0.06054043043002654], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 285.8181818181818, 172, 827, 181.0, 735.8000000000003, 827.0, 827.0, 0.06652917304237908, 7.329372043987879, 0.14807820466490465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76972e30-83d3-43b6-9aa5-d39ed5dce96a", 3, 0, 0.0, 546.0, 184, 1179, 275.0, 1179.0, 1179.0, 1179.0, 0.031348617525967105, 0.03144045917887522, 0.02010311735877448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd16eb4b-8686-45ad-8d25-3829ce0ff17a", 3, 0, 0.0, 341.3333333333333, 186, 537, 301.0, 537.0, 537.0, 537.0, 0.02639613560574732, 0.02200537216351526, 0.0169272093565502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 750.5833333333335, 112, 1655, 735.0, 1269.5, 1649.5, 1655.0, 0.10329555872137314, 0.06345010394115597, 0.046704925476558364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 100.0, 86, 256, 90.0, 111.0, 256.0, 256.0, 0.08927774305865548, 0.06634801022230158, 0.044813242121239175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 156.57894736842104, 85, 354, 89.0, 267.0, 354.0, 354.0, 0.08921444334882848, 0.09439599767572898, 0.046936628398365966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09783396-f243-40ea-843c-1282b02271a6", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["login", 24, 0, 0.0, 2987.1249999999995, 1588, 4254, 2969.5, 3682.0, 4203.25, 4254.0, 0.10463397726826844, 47.08129191489988, 0.22293474600102017], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 115.72222222222223, 88, 278, 94.5, 270.8, 278.0, 278.0, 0.09112309211025894, 0.07377055015566862, 0.03239141164856861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c24e881b-4ea9-44e8-a2c8-a37efc881f1f", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e9c3078-d665-43e2-8a16-bca42a190436", 3, 0, 0.0, 340.33333333333337, 186, 597, 238.0, 597.0, 597.0, 597.0, 0.04541601065762383, 0.02919811883099189, 0.02912419954281216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 667.736842105263, 178, 1203, 874.0, 1187.0, 1203.0, 1203.0, 0.089167968988319, 56.21066544969988, 0.18853324117354434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab7a28d6-ead7-4161-b78c-9c0809115255", 3, 0, 0.0, 527.3333333333334, 242, 904, 436.0, 904.0, 904.0, 904.0, 0.056026593956598064, 0.02535057473947634, 0.035928512400552795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77148d22-3b69-4aa4-9464-54e13137eac1", 3, 0, 0.0, 540.3333333333334, 227, 935, 459.0, 935.0, 935.0, 935.0, 0.04084411164057182, 0.03405005530973451, 0.026192350238257316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bb5917b-ca09-4bce-a536-c57d8d48df14", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 267.24999999999994, 175, 534, 182.5, 520.0, 534.0, 534.0, 0.12882032784773437, 0.19964634794370553, 0.28971993655598854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 629.6000000000001, 84, 1181, 846.0, 1136.0, 1181.0, 1181.0, 0.11036309458117205, 79.23139002317626, 0.17856403818563074], "isController": false}, {"data": ["register", 25, 10, 40.0, 1071.9199999999998, 284, 2090, 1103.0, 1618.8000000000002, 1971.4999999999998, 2090.0, 0.1016053647632595, 0.0315135389148547, 0.045841482930298716], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 96.625, 89, 140, 94.0, 112.00000000000003, 140.0, 140.0, 0.0751508888941077, 0.05834468424884338, 0.026713792536577345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 283.27777777777777, 175, 1043, 182.0, 421.100000000001, 1043.0, 1043.0, 0.0922112251798119, 6.263674596511854, 0.20607447849429314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 328.1363636363636, 174, 1376, 182.0, 882.6999999999996, 1325.8999999999992, 1376.0, 0.09531690705301786, 10.500853113396792, 0.21215289210992638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea0eac08-c5d0-4c00-9a2c-de7336fb6d5c", 3, 0, 0.0, 510.66666666666663, 203, 1011, 318.0, 1011.0, 1011.0, 1011.0, 0.03214779412552642, 0.02680029321467225, 0.0206156101651325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 89.125, 87, 95, 88.5, 95.0, 95.0, 95.0, 0.0418782390200492, 0.031122402240485788, 0.021020912945610638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 130.99999999999997, 84, 264, 89.5, 264.0, 264.0, 264.0, 0.04184363035336946, 0.011196440153147687, 0.02386394543590602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 153.125, 84, 264, 93.5, 264.0, 264.0, 264.0, 0.04184384921568935, 0.01127822498391627, 0.02459960666781737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 120.0, 85, 350, 86.0, 350.0, 350.0, 350.0, 0.04188065061590732, 0.011288144111318768, 0.024662140938859486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 93.66666666666667, 89, 100, 92.0, 100.0, 100.0, 100.0, 0.15985506474130123, 0.04714475542175095, 0.09881665623168327], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 970.2982456140353, 669, 1498, 882.0, 1360.6000000000001, 1421.8999999999999, 1498.0, 0.24025289778714437, 287.42599117492097, 0.47440562434141204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 1071.9199999999998, 284, 2090, 1103.0, 1618.8000000000002, 1971.4999999999998, 2090.0, 0.09798234750027435, 0.030389837466881967, 0.04420687943860034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98a0847f-6375-4012-bb21-62b4b4ea4fda", 3, 0, 0.0, 562.0, 194, 1225, 267.0, 1225.0, 1225.0, 1225.0, 0.07275902211874272, 0.032921562742530074, 0.04665861769984478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e9c3078-d665-43e2-8a16-bca42a190436", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 87.5, 87, 88, 87.5, 88.0, 88.0, 88.0, 0.027420548959390167, 0.007390694836710631, 0.01614706154542214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 87.0, 86, 88, 87.0, 88.0, 88.0, 88.0, 0.027420548959390167, 0.007390694836710631, 0.016120283665578983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 110.18749999999999, 85, 255, 89.0, 253.6, 255.0, 255.0, 0.07476321089299982, 0.02015102168600386, 0.04395259077889248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 109.1875, 85, 264, 89.0, 254.9, 264.0, 264.0, 0.07476390959174233, 0.020151210007149298, 0.04402601316779357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 100.5, 87, 260, 89.0, 150.1000000000001, 260.0, 260.0, 0.07476216286937182, 0.05556055267928901, 0.037527101284040146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 170.5, 88, 253, 170.5, 253.0, 253.0, 253.0, 0.027420548959390167, 0.007337139077024322, 0.015638281828402205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 108.875, 85, 262, 87.0, 255.0, 262.0, 262.0, 0.07476390959174233, 0.020005186746227928, 0.04263879218904054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 88.5, 87, 90, 88.5, 90.0, 90.0, 90.0, 0.027419797093501508, 0.020377407800932272, 0.013763452837948999], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 595.1333333333333, 85, 1336, 484.0, 1269.4, 1336.0, 1336.0, 0.09097359946143628, 0.01801703708083914, 0.06190469150852422], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 196.0, 115, 277, 196.0, 277.0, 277.0, 277.0, 0.026668444562970864, 0.020990982732182143, 0.009479798653243549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9719edc0-17a3-4a9a-a61e-e4da153b7cd1", 3, 0, 0.0, 371.3333333333333, 232, 475, 407.0, 475.0, 475.0, 475.0, 0.08170157139355648, 0.03840399384514829, 0.05239326030120646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1601.8750000000002, 1224, 2395, 1520.0, 1978.5, 2294.5, 2395.0, 0.10365513935137796, 0.05364963267209992, 0.04767731507275295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 259.0, 175, 343, 259.0, 343.0, 343.0, 343.0, 0.027386755764912087, 0.0424441224598784, 0.06159345559237552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09783396-f243-40ea-843c-1282b02271a6", 3, 0, 0.0, 694.3333333333333, 223, 1336, 524.0, 1336.0, 1336.0, 1336.0, 0.023013370768416447, 0.027201025149778686, 0.014757923311777475], "isController": false}, {"data": ["addBook", 55, 13, 23.636363636363637, 969.7454545454548, 440, 2645, 790.0, 1599.2, 1905.5999999999974, 2645.0, 0.26206699385333776, 80.88482788452374, 0.951416725234669], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 155.66666666666663, 85, 367, 91.0, 354.0, 365.1, 367.0, 0.24102397131391892, 0.17912035368153545, 0.11651061113319322], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 583.421052631579, 420, 880, 523.0, 760.2, 782.0999999999999, 880.0, 0.24073792509249406, 70.78494322861233, 0.12107424943616645], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 142.63157894736844, 84, 310, 92.0, 263.4, 283.0999999999999, 310.0, 0.24119021021630954, 0.426793614171829, 0.11729758270285366], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 810.3508771929826, 576, 1141, 774.0, 1042.0, 1055.8999999999999, 1141.0, 0.24067388688327315, 216.55878647713598, 0.12080700962695547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 104.95454545454545, 89, 260, 94.0, 122.3, 239.74999999999972, 260.0, 0.0966183574879227, 0.07218070652173914, 0.034344806763285024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 13, 7.7844311377245505, 167.26946107784426, 86, 1847, 96.0, 303.20000000000005, 472.7999999999996, 1453.279999999996, 0.6928598099821599, 1.595358656080156, 0.328874225978094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 135.0, 89, 264, 93.5, 264.0, 264.0, 264.0, 0.041813449295966046, 0.032380923136426834, 0.014863374554425431], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 95.50000000000001, 86, 131, 92.5, 110.70000000000002, 131.0, 131.0, 0.13078733978550874, 0.10613699156421659, 0.04649081218938007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab7a28d6-ead7-4161-b78c-9c0809115255", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 255.25, 176, 438, 187.5, 438.0, 438.0, 438.0, 0.04182241158480801, 0.06481656951668975, 0.09405958386700473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a76aecf-5cf3-4f9d-a1bc-1cf36c61dea5", 2, 0, 0.0, 357.5, 188, 527, 357.5, 527.0, 527.0, 527.0, 0.018864899025627966, 0.026510341501834612, 0.011726082255675977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 233.3125, 175, 513, 184.0, 400.3000000000001, 513.0, 513.0, 0.07473178296021933, 0.11581966753698056, 0.16807353140369644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77148d22-3b69-4aa4-9464-54e13137eac1", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76972e30-83d3-43b6-9aa5-d39ed5dce96a", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd16eb4b-8686-45ad-8d25-3829ce0ff17a", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73bfe85e-a2a7-4268-9360-d7403597f91d", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 109.9090909090909, 88, 265, 91.0, 233.80000000000013, 265.0, 265.0, 0.06601373085601804, 0.05473208739917903, 0.023465818390225168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9719edc0-17a3-4a9a-a61e-e4da153b7cd1", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c24e881b-4ea9-44e8-a2c8-a37efc881f1f", 3, 0, 0.0, 372.0, 216, 488, 412.0, 488.0, 488.0, 488.0, 0.028283742504808234, 0.028200879977938683, 0.018137686437002677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 114.84210526315789, 88, 281, 94.0, 267.0, 281.0, 281.0, 0.08980267044783175, 0.06971984668557249, 0.03192204301075269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bb5917b-ca09-4bce-a536-c57d8d48df14", 3, 0, 0.0, 570.6666666666666, 187, 1085, 440.0, 1085.0, 1085.0, 1085.0, 0.05269814502529511, 0.033879829565415964, 0.03379405784499719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7100e3a8-2ce1-4e7d-87d8-1ef063528b43", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.7496148767605634, 1.40065654342723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 107.72727272727272, 85, 291, 90.0, 213.1999999999999, 285.8999999999999, 291.0, 0.0953540887399824, 0.07086373196399083, 0.04786328282456148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 103.72727272727272, 84, 260, 87.0, 213.4999999999999, 260.0, 260.0, 0.09536524890329964, 0.03853893936504083, 0.05365988525826643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 194.6818181818182, 84, 1084, 88.5, 744.2999999999995, 1064.4999999999998, 1084.0, 0.09536442213494933, 7.824191962621482, 0.055318815183749905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 180.31818181818184, 85, 701, 89.0, 547.2999999999997, 696.3499999999999, 701.0, 0.09536359538093421, 2.57246346382252, 0.055411464112945175], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 28.571428571428573, 0.7587253414264037], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.2276176024279211], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.2276176024279211], "isController": false}, {"data": ["401/Unauthorized", 19, 54.285714285714285, 1.4415781487101669], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1318, 35, "401/Unauthorized", 19, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
