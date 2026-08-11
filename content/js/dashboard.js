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

    var data = {"OkPercent": 98.23717948717949, "KoPercent": 1.7628205128205128};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.774260151410874, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37272727272727274, 500, 1500, "see books"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/aaf31991-db23-4194-84d4-c309f8d07b58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=541236c0-0e0b-4731-9275-7d5ec6e7984a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0178a7b-3093-480a-942a-3ff6b17dd932"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=256cc9d4-8653-44f9-abf5-21b62399da87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4bad27fa-02bb-430b-98f0-5af0f782ec7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/25c86ca6-64d7-4f63-876e-06b49b01fd11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a95c3f6-4250-477e-98fe-930ae7eabc3d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bad27fa-02bb-430b-98f0-5af0f782ec7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb28f884-e3ca-4816-9873-8c63addae62c"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/72b7d12f-1fad-4383-8c8b-a62598ef07ec"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b787945d-36c5-494a-bc5e-a53b9faff9a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1fc39727-388a-4ad9-ac07-a891aaddc8f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c088d39-1093-42d0-ab70-7379bd45dd7d"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0178a7b-3093-480a-942a-3ff6b17dd932"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/541236c0-0e0b-4731-9275-7d5ec6e7984a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/25898e89-4ca1-4276-9d49-2031656a0962"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a95c3f6-4250-477e-98fe-930ae7eabc3d"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bec9f98f-3c1c-4848-864d-5170400e29af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/256cc9d4-8653-44f9-abf5-21b62399da87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8363636363636363, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5586675f-ca97-4b8b-af78-61f3c1289710"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8711656441717791, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5586675f-ca97-4b8b-af78-61f3c1289710"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25c86ca6-64d7-4f63-876e-06b49b01fd11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72b7d12f-1fad-4383-8c8b-a62598ef07ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb28f884-e3ca-4816-9873-8c63addae62c"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b787945d-36c5-494a-bc5e-a53b9faff9a8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fc39727-388a-4ad9-ac07-a891aaddc8f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1248, 22, 1.7628205128205128, 398.3766025641027, 77, 13041, 114.5, 910.2000000000016, 1266.0499999999995, 3481.8099999999977, 4.9729040484539375, 718.2788327198557, 3.6347301362766973], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1396.163636363637, 1114, 2029, 1363.0, 1695.8, 1821.2, 2029.0, 0.25288635287301886, 304.30662136217234, 1.243440221402002], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 1409.571428571429, 98, 4657, 853.5, 4511.5, 4657.0, 4657.0, 0.07667829620825825, 0.015104597411559801, 0.051593111413564395], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 1409.571428571429, 98, 4657, 853.5, 4511.5, 4657.0, 4657.0, 0.07809885083119492, 0.015384427646993194, 0.05254893381122392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaf31991-db23-4194-84d4-c309f8d07b58", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.5913628472222222, 1.104962384259259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 113.46666666666667, 78, 248, 82.0, 242.0, 248.0, 248.0, 0.07141598861153034, 0.019109356327694643, 0.0407294310050134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 92.66666666666667, 80, 237, 81.0, 148.20000000000005, 237.0, 237.0, 0.07141428857085726, 0.0530725328148656, 0.03584662531779358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 134.2, 78, 247, 82.0, 242.8, 247.0, 247.0, 0.07141598861153034, 0.01924884068045154, 0.042054532356203905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 113.39999999999999, 77, 246, 82.0, 244.8, 246.0, 246.0, 0.07141598861153034, 0.01924884068045154, 0.04198479017982546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=541236c0-0e0b-4731-9275-7d5ec6e7984a", 1, 0, 0.0, 1090.0, 1090, 1090, 1090.0, 1090.0, 1090.0, 1090.0, 0.9174311926605505, 0.16574684633027523, 0.6325258027522935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0178a7b-3093-480a-942a-3ff6b17dd932", 1, 0, 0.0, 1222.0, 1222, 1222, 1222.0, 1222.0, 1222.0, 1222.0, 0.8183306055646482, 0.14784293166939444, 0.5642005932896891], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 592.3571428571428, 80, 3663, 380.0, 2202.0, 3663.0, 3663.0, 0.07753827067502603, 0.14657956707337336, 0.05011646317485988], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=256cc9d4-8653-44f9-abf5-21b62399da87", 1, 0, 0.0, 2064.0, 2064, 2064, 2064.0, 2064.0, 2064.0, 2064.0, 0.4844961240310077, 0.08753103803294573, 0.3340373667635659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 86.68421052631577, 79, 111, 82.0, 110.0, 111.0, 111.0, 0.10263668235027198, 0.07627589381695017, 0.05151880344535137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 98.84210526315789, 78, 242, 82.0, 238.0, 242.0, 242.0, 0.10262892082988986, 0.027461254206435373, 0.05853055641079656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 635.0, 624, 653, 632.0, 653.0, 653.0, 653.0, 0.03669374665169562, 10.789179862655306, 0.020926902387295155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 887.2, 619, 1339, 845.0, 1339.0, 1339.0, 1339.0, 0.03667329230814367, 32.99869288363931, 0.020879423257468516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 143.0, 79, 241, 83.0, 241.0, 241.0, 241.0, 0.036797173977038564, 0.06511374926405653, 0.020374997700176627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bad27fa-02bb-430b-98f0-5af0f782ec7e", 3, 0, 0.0, 729.0, 179, 1105, 903.0, 1105.0, 1105.0, 1105.0, 0.030206004953784813, 0.025181503478724904, 0.01937038729132685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 119.875, 79, 238, 85.5, 238.0, 238.0, 238.0, 0.06157825056190153, 0.04576274284922566, 0.030909395301579483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 121.875, 78, 247, 83.0, 247.0, 247.0, 247.0, 0.06157777658043212, 0.01647686599906094, 0.035118575706027694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 102.25, 80, 249, 82.0, 249.0, 249.0, 249.0, 0.06157777658043212, 0.016597135093944594, 0.0362009975599806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 100.375, 78, 238, 81.0, 238.0, 238.0, 238.0, 0.06157872455066774, 0.016597390601547166, 0.036261690335988916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 112.8, 79, 239, 82.0, 239.0, 239.0, 239.0, 0.03684055408193339, 0.027378575836280578, 0.020686834567491895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 538.1111111111111, 80, 1039, 714.0, 1000.3000000000001, 1039.0, 1039.0, 0.09159606136936112, 45.79891523865863, 0.04947538991934458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 98.57894736842105, 79, 240, 81.0, 239.0, 240.0, 240.0, 0.10262781213708916, 0.027661402490074812, 0.06033392861965593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 385.38888888888886, 80, 720, 469.5, 707.4, 720.0, 720.0, 0.09159512917457523, 14.973199678653755, 0.04956433476493128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 116.10526315789474, 79, 242, 83.0, 242.0, 242.0, 242.0, 0.10262725779967159, 0.027661253078817734, 0.06043382466133005], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 1020.1538461538462, 83, 2064, 1090.0, 1988.3999999999999, 2064.0, 2064.0, 0.07329435577080291, 0.014530033419407219, 0.04972916326035847], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 243.25, 162, 478, 174.0, 478.0, 478.0, 478.0, 0.06153988168957745, 0.09537479711070254, 0.13840463626083677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25c86ca6-64d7-4f63-876e-06b49b01fd11", 3, 0, 0.0, 1921.6666666666667, 258, 3663, 1844.0, 3663.0, 3663.0, 3663.0, 0.017145796422243814, 0.0236368645339201, 0.010995188460879008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a95c3f6-4250-477e-98fe-930ae7eabc3d", 3, 0, 0.0, 375.0, 304, 490, 331.0, 490.0, 490.0, 490.0, 0.08362602441879913, 0.03783859828845403, 0.05362736591960751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bad27fa-02bb-430b-98f0-5af0f782ec7e", 1, 0, 0.0, 1339.0, 1339, 1339, 1339.0, 1339.0, 1339.0, 1339.0, 0.7468259895444362, 0.13492461725168037, 0.5149015123226288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb28f884-e3ca-4816-9873-8c63addae62c", 3, 0, 0.0, 362.6666666666667, 239, 440, 409.0, 440.0, 440.0, 440.0, 0.04093216176390329, 0.02631543602985319, 0.026248814672815587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 850.3499999999999, 177, 2766, 496.0, 2163.4, 2736.5499999999997, 2766.0, 0.08987592628376526, 0.055206989875476904, 0.04063725963806965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 101.38888888888889, 81, 239, 84.0, 238.1, 239.0, 239.0, 0.0915927987706211, 0.06806847643011979, 0.04597529157040942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 170.27777777777777, 79, 320, 160.0, 316.4, 320.0, 320.0, 0.09159559526959637, 0.10093802794683385, 0.0479644469152639], "isController": false}, {"data": ["login", 20, 0, 0.0, 4723.0, 1527, 15863, 2588.0, 13049.700000000004, 15733.349999999999, 15863.0, 0.08916152501872393, 26.78931594860061, 0.17148791359802418], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 122.8421052631579, 82, 648, 86.0, 172.0, 648.0, 648.0, 0.10333893539140981, 0.08366013421824096, 0.03673376218991521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72b7d12f-1fad-4383-8c8b-a62598ef07ec", 3, 0, 0.0, 1139.3333333333335, 309, 2368, 741.0, 2368.0, 2368.0, 2368.0, 0.029913848117421826, 0.024937944345285578, 0.019183034111758136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 661.0555555555555, 163, 1126, 797.5, 1086.4, 1126.0, 1126.0, 0.09155366570704862, 60.91306979441116, 0.1928925268048788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b787945d-36c5-494a-bc5e-a53b9faff9a8", 3, 0, 0.0, 560.3333333333333, 187, 1154, 340.0, 1154.0, 1154.0, 1154.0, 0.03784581614502516, 0.031550499722464015, 0.024269615171126163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 261.6666666666667, 160, 476, 320.0, 390.20000000000005, 476.0, 476.0, 0.07138709892348255, 0.11063606053863945, 0.16055125861404326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 596.5555555555555, 79, 1579, 736.0, 1579.0, 1579.0, 1579.0, 0.061737287263597646, 41.040263643940484, 0.09551996300907538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fc39727-388a-4ad9-ac07-a891aaddc8f0", 3, 0, 0.0, 1627.6666666666667, 386, 4063, 434.0, 4063.0, 4063.0, 4063.0, 0.03597337969902272, 0.02237797155105222, 0.023068866538761317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c088d39-1093-42d0-ab70-7379bd45dd7d", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.6399517785571143, 1.195750876753507], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1615.2272727272727, 139, 7943, 1264.5, 3412.2999999999997, 7290.79999999999, 7943.0, 0.0915598468453471, 0.02880753704011986, 0.04130922777592808], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 96.59999999999998, 86, 117, 95.0, 111.60000000000001, 117.0, 117.0, 0.0716500040601669, 0.05562671213655535, 0.02546933738076245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 212.1578947368421, 162, 354, 167.0, 337.0, 354.0, 354.0, 0.10258071482561279, 0.15898007268383543, 0.2307064318783069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 449.70588235294116, 159, 1125, 171.0, 1037.0, 1125.0, 1125.0, 0.09670244657189828, 34.132186200560874, 0.2102089430564799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 83.375, 80, 89, 83.0, 89.0, 89.0, 89.0, 0.0448257120284195, 0.033312858255495355, 0.022500406233015257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 121.125, 79, 249, 80.5, 249.0, 249.0, 249.0, 0.044784808992789644, 0.011983435218773791, 0.025541336378700343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 119.375, 78, 238, 81.0, 238.0, 238.0, 238.0, 0.04478756697140874, 0.01207164891026251, 0.026330190739050838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 80.875, 78, 84, 81.0, 84.0, 84.0, 84.0, 0.04482772146295269, 0.012082471800561467, 0.026397574259922334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 83.5, 83, 84, 83.5, 84.0, 84.0, 84.0, 0.0235302422438439, 0.00693958316175865, 0.014545550137063662], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 922.9454545454544, 633, 1467, 852.0, 1248.6, 1302.3999999999999, 1467.0, 0.2512849800114221, 300.6241968874929, 0.49618967732724156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1615.2272727272727, 139, 7943, 1264.5, 3412.2999999999997, 7290.79999999999, 7943.0, 0.09050667281014992, 0.028476176175352565, 0.040834065271766855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 133.66666666666666, 79, 244, 82.0, 244.0, 244.0, 244.0, 0.0588708569634412, 0.01586753566592751, 0.03466711596577641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 117.1111111111111, 79, 254, 81.0, 254.0, 254.0, 254.0, 0.058933693047133855, 0.0158844719541103, 0.03464656563903768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0178a7b-3093-480a-942a-3ff6b17dd932", 3, 0, 0.0, 694.0, 242, 1371, 469.0, 1371.0, 1371.0, 1371.0, 0.017189415903647594, 0.023696997510399595, 0.011023160589253176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 114.66666666666669, 79, 244, 83.0, 244.0, 244.0, 244.0, 0.0714537503691777, 0.019259018654192432, 0.04200698996312987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/541236c0-0e0b-4731-9275-7d5ec6e7984a", 3, 0, 0.0, 747.6666666666667, 290, 1414, 539.0, 1414.0, 1414.0, 1414.0, 0.022429906542056073, 0.02651139018691589, 0.014383761682242991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 114.73333333333335, 78, 245, 82.0, 245.0, 245.0, 245.0, 0.07145409074669525, 0.019259110396570203, 0.0420769694533762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 104.46666666666667, 79, 253, 83.0, 244.6, 253.0, 253.0, 0.0714537503691777, 0.053101859405218985, 0.035866433290778654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 81.0, 78, 83, 82.0, 83.0, 83.0, 83.0, 0.05893485079660273, 0.015769676873309716, 0.033611282094937495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 92.33333333333333, 78, 235, 81.0, 148.60000000000005, 235.0, 235.0, 0.0714537503691777, 0.01911946054800263, 0.040750967007421666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 118.44444444444444, 80, 246, 82.0, 246.0, 246.0, 246.0, 0.05893330714075238, 0.0437971159512818, 0.029581757685885474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25898e89-4ca1-4276-9d49-2031656a0962", 2, 0, 0.0, 513.5, 420, 607, 513.5, 607.0, 607.0, 607.0, 0.023816044869428534, 0.027095402610238517, 0.014803625546280529], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 1462.9230769230771, 79, 4238, 1154.0, 4168.0, 4238.0, 4238.0, 0.07385020905289946, 0.014329559043242138, 0.050256088026608796], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 166.22222222222223, 84, 362, 101.0, 362.0, 362.0, 362.0, 0.056412185031966905, 0.044402559702895826, 0.020052768898081986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 3292.7499999999995, 899, 13041, 1509.5, 9851.600000000002, 12887.149999999998, 13041.0, 0.0885629771330393, 0.045838259648936355, 0.04073550998990382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 255.44444444444446, 161, 495, 169.0, 495.0, 495.0, 495.0, 0.05883891213389121, 0.09118882183250522, 0.13233009242612448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a95c3f6-4250-477e-98fe-930ae7eabc3d", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["addBook", 54, 8, 14.814814814814815, 1274.9259259259256, 432, 8072, 1015.5, 2243.5, 3052.75, 8072.0, 0.2570938868786897, 86.42995177257903, 0.9332764741239764], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bec9f98f-3c1c-4848-864d-5170400e29af", 1, 0, 0.0, 769.0, 769, 769, 769.0, 769.0, 769.0, 769.0, 1.3003901170351106, 0.4152612971391417, 0.7759163686605982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/256cc9d4-8653-44f9-abf5-21b62399da87", 3, 0, 0.0, 1726.0, 352, 4238, 588.0, 4238.0, 4238.0, 4238.0, 0.02661957958810637, 0.022191648217819146, 0.01707049862909165], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 153.27272727272728, 80, 415, 85.0, 328.2, 335.79999999999995, 415.0, 0.25209121118368283, 0.18734512862381114, 0.1218604975936748], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 498.1272727272726, 383, 724, 471.0, 651.0, 700.1999999999999, 724.0, 0.25179691434326784, 74.03665326134231, 0.12663614344412397], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 130.78181818181818, 79, 357, 86.0, 250.8, 262.1999999999999, 357.0, 0.25223225546082834, 0.4463328582959189, 0.12266763986278566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5586675f-ca97-4b8b-af78-61f3c1289710", 3, 0, 0.0, 351.6666666666667, 216, 563, 276.0, 563.0, 563.0, 563.0, 0.03345525916674101, 0.027890273022794183, 0.021454056171380142], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 768.2000000000002, 552, 1142, 735.0, 930.0, 951.8, 1142.0, 0.2517001199007844, 226.4802103283428, 0.1263416617470734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 116.3529411764706, 82, 258, 88.0, 250.79999999999998, 258.0, 258.0, 0.09732917298829188, 0.07271173567972977, 0.034597479460681875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 8, 4.9079754601226995, 269.2085889570554, 80, 6941, 94.0, 545.0, 772.9999999999986, 3800.5199999999277, 0.7054902724577463, 1.563700388452466, 0.33675122811573505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 87.375, 82, 93, 87.0, 93.0, 93.0, 93.0, 0.043688392540206976, 0.033832905551156374, 0.015529858285776696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5586675f-ca97-4b8b-af78-61f3c1289710", 1, 0, 0.0, 932.0, 932, 932, 932.0, 932.0, 932.0, 932.0, 1.0729613733905579, 0.1938455606223176, 0.7397565718884119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 186.06666666666666, 83, 891, 89.0, 796.8000000000001, 891.0, 891.0, 0.06812545984685398, 0.05528540735618716, 0.02421647205493637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 206.25, 162, 330, 168.0, 330.0, 330.0, 330.0, 0.04476325831757294, 0.0693743075683479, 0.10067361709508836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25c86ca6-64d7-4f63-876e-06b49b01fd11", 1, 0, 0.0, 1463.0, 1463, 1463, 1463.0, 1463.0, 1463.0, 1463.0, 0.6835269993164731, 0.12348876452494872, 0.47125982570061514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 231.4666666666666, 160, 499, 168.0, 484.6, 499.0, 499.0, 0.07142585044379261, 0.11069611782646376, 0.16063841169145937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72b7d12f-1fad-4383-8c8b-a62598ef07ec", 1, 0, 0.0, 1875.0, 1875, 1875, 1875.0, 1875.0, 1875.0, 1875.0, 0.5333333333333333, 0.09635416666666667, 0.36770833333333336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 111.0, 83, 247, 94.5, 247.0, 247.0, 247.0, 0.06050384577569712, 0.0501638330698895, 0.021507226428079833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb28f884-e3ca-4816-9873-8c63addae62c", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 138.33333333333337, 82, 1028, 86.0, 183.80000000000132, 1028.0, 1028.0, 0.09281268852577357, 0.07205672595506835, 0.03299201037439607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b787945d-36c5-494a-bc5e-a53b9faff9a8", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fc39727-388a-4ad9-ac07-a891aaddc8f0", 1, 0, 0.0, 1723.0, 1723, 1723, 1723.0, 1723.0, 1723.0, 1723.0, 0.5803830528148578, 0.10485436012768426, 0.4001469094602437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 109.99999999999999, 80, 243, 82.0, 239.0, 243.0, 243.0, 0.09674647302196146, 0.07189850192354752, 0.04856219446610174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 120.52941176470588, 79, 281, 81.0, 251.39999999999998, 281.0, 281.0, 0.09674977662183927, 0.06862742656976512, 0.052787763002885416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 329.05882352941177, 78, 905, 82.0, 886.6, 905.0, 905.0, 0.09675032724375392, 25.623147026705936, 0.05443317469125263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 258.94117647058823, 78, 732, 83.0, 651.9999999999999, 732.0, 732.0, 0.09675087787193598, 8.385457720577774, 0.05452796776203837], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4807692307692308], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.16025641025641027], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.16025641025641027], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9615384615384616], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1248, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
