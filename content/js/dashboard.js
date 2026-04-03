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

    var data = {"OkPercent": 96.30969609261939, "KoPercent": 3.6903039073806077};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7906832298136646, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41379310344827586, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f8130ee-81fe-4f0d-b28b-827a753ce5f8"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d6716e6c-5625-4ae6-bf56-27d2364d7257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47847839-41fc-4703-a5f0-e8180dbdacb8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04cf4421-b8e0-43d0-9474-bf200c3c160c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a16c1eb-14da-4b88-bbd7-013301b34c4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4827586206896552, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81f0abac-d834-4d31-a3f7-16c59d044bab"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81f0abac-d834-4d31-a3f7-16c59d044bab"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c6415cc-ff99-4d3e-b3b1-25899b07ec21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82ef482d-4812-4099-8532-480d16bceb6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47847839-41fc-4703-a5f0-e8180dbdacb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8189655172413793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7960e81a-3751-4875-9101-e65bcab3f369"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8653846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7960e81a-3751-4875-9101-e65bcab3f369"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a863964-a3e6-42da-8467-48ef1bbfda19"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a863964-a3e6-42da-8467-48ef1bbfda19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82ef482d-4812-4099-8532-480d16bceb6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22a5fc03-9ddb-4508-95d5-f63067d802cd"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22a5fc03-9ddb-4508-95d5-f63067d802cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67ff86a3-6a99-49ff-b532-3c99cc0ac6e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c6415cc-ff99-4d3e-b3b1-25899b07ec21"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/1de17e0c-e88e-4cc1-bc34-352b9b52f8f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a16c1eb-14da-4b88-bbd7-013301b34c4f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acd7c3f7-42d8-4d60-8f9c-785da308fdae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acd7c3f7-42d8-4d60-8f9c-785da308fdae"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/04cf4421-b8e0-43d0-9474-bf200c3c160c"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1382, 51, 3.6903039073806077, 288.37337192474706, 76, 2474, 90.0, 812.7, 998.0, 1479.760000000002, 5.388901670091595, 740.5513342722644, 3.951983587148523], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1323.7068965517237, 970, 1862, 1326.0, 1613.7, 1682.7499999999995, 1862.0, 0.26080778466270355, 313.83832176232994, 1.2823898396256959], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 88.61111111111111, 81, 117, 85.5, 100.80000000000003, 117.0, 117.0, 0.08464772438700939, 0.06571771571061764, 0.03008962077819475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 188.35714285714286, 161, 326, 165.5, 323.0, 326.0, 326.0, 0.07879821465759362, 0.12212184244296978, 0.17721903159808405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f8130ee-81fe-4f0d-b28b-827a753ce5f8", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 273.47058823529414, 163, 872, 174.0, 443.9999999999996, 872.0, 872.0, 0.10945568332539243, 7.8624240651196935, 0.2445210287707483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6716e6c-5625-4ae6-bf56-27d2364d7257", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 0.3687481957274827, 0.6890065675519631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 114.33333333333336, 80, 244, 82.0, 242.8, 244.0, 244.0, 0.06583567415730338, 0.04892670706416784, 0.03304642237974017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47847839-41fc-4703-a5f0-e8180dbdacb8", 3, 0, 0.0, 338.0, 179, 432, 403.0, 432.0, 432.0, 432.0, 0.027201755419949767, 0.02728144806278165, 0.01744383404209018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04cf4421-b8e0-43d0-9474-bf200c3c160c", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 139.53333333333336, 80, 326, 82.0, 275.6, 326.0, 326.0, 0.06583711896767397, 0.017616572848772136, 0.03754773191125156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 101.53333333333333, 79, 237, 81.0, 234.0, 237.0, 237.0, 0.06583769690957851, 0.017745316745159834, 0.03870536478473268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a16c1eb-14da-4b88-bbd7-013301b34c4f", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 123.73333333333333, 77, 243, 82.0, 241.8, 243.0, 243.0, 0.0658374079373579, 0.017745238858115995, 0.038769489244362125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 92.6, 84, 119, 87.0, 119.0, 119.0, 119.0, 0.050431695311869605, 0.014873410140805293, 0.031175061652747516], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 918.2241379310343, 618, 1520, 858.0, 1274.1, 1339.6499999999994, 1520.0, 0.25067639406329145, 299.89611651482016, 0.4949879578085697], "isController": false}, {"data": ["deleteBook", 15, 5, 33.333333333333336, 496.66666666666663, 84, 1503, 408.0, 1247.4, 1503.0, 1503.0, 0.09141770578125571, 0.019997623139649687, 0.06067731187759779], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, 33.333333333333336, 496.66666666666663, 84, 1503, 408.0, 1247.4, 1503.0, 1503.0, 0.09232416862086157, 0.020195911885813468, 0.061278964784484614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 946.4000000000001, 280, 1585, 927.0, 1437.2, 1552.0, 1585.0, 0.0980707521634408, 0.03055516872092202, 0.04424676513623989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 91.93750000000001, 78, 243, 81.0, 138.7000000000001, 243.0, 243.0, 0.11595799421659504, 0.04191303965763402, 0.06552362734724346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 95.72727272727273, 76, 242, 82.0, 211.2000000000001, 242.0, 242.0, 0.07138082970480783, 0.019239364256373983, 0.042033828429686636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 92.8125, 79, 243, 82.5, 138.7000000000001, 243.0, 243.0, 0.11595547309833024, 0.08617394045686456, 0.05820421208256029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 96.0909090909091, 78, 243, 81.0, 212.2000000000001, 243.0, 243.0, 0.07137990331267642, 0.01923911456474482, 0.04196357597092892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81f0abac-d834-4d31-a3f7-16c59d044bab", 3, 0, 0.0, 258.0, 170, 430, 174.0, 430.0, 430.0, 430.0, 0.06668741386209043, 0.030955811252389633, 0.042765040790468146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 145.75000000000003, 79, 634, 81.5, 361.0000000000003, 634.0, 634.0, 0.11595799421659504, 2.1602696883991275, 0.0676610366644683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 170.9375, 78, 1017, 83.0, 475.20000000000056, 1017.0, 1017.0, 0.11595715383165921, 6.55045387487136, 0.06754730689510226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 141.72222222222223, 78, 852, 82.0, 302.1000000000009, 852.0, 852.0, 0.08556515786771626, 4.29909676022979, 0.049894439928505556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 120.83333333333333, 77, 473, 80.5, 276.8000000000003, 473.0, 473.0, 0.08549281860323733, 1.418303225810282, 0.049935746803518505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 83.38888888888889, 78, 112, 82.0, 87.70000000000005, 112.0, 112.0, 0.08556190403757118, 0.06358653219979656, 0.04294806511260897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 95.0, 77, 241, 80.0, 210.2000000000001, 241.0, 241.0, 0.07138036650573638, 0.019099824631417742, 0.04070911527280278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 89.72222222222224, 79, 243, 81.0, 99.00000000000023, 243.0, 243.0, 0.08556475112541416, 0.030034935969044576, 0.04839941922925174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 97.0909090909091, 79, 246, 83.0, 214.0000000000001, 246.0, 246.0, 0.07137944012562782, 0.05304663470273708, 0.03582913303180928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 101.0909090909091, 83, 246, 86.0, 215.80000000000013, 246.0, 246.0, 0.06631979404689413, 0.05220093164237955, 0.023574614290106894], "isController": false}, {"data": ["deleteAccount", 15, 5, 33.333333333333336, 355.66666666666663, 82, 783, 395.0, 655.2, 783.0, 783.0, 0.09239980780839975, 0.019370272209833804, 0.06286315049464697], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81f0abac-d834-4d31-a3f7-16c59d044bab", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.0949337121212122, 4.178503787878788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1345.4782608695655, 812, 2474, 1246.0, 1997.0000000000002, 2394.999999999999, 2474.0, 0.09991398708937524, 0.051713294098993036, 0.045956531170991924], "isController": false}, {"data": ["goToProfile", 15, 5, 33.333333333333336, 159.7333333333333, 81, 292, 174.0, 268.6, 292.0, 292.0, 0.09166238908850921, 0.14597354814414215, 0.05922846430361028], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 209.72727272727272, 162, 489, 166.0, 457.0000000000001, 489.0, 489.0, 0.07134194192765927, 0.11056607601483912, 0.1604496994720696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 81.99999999999999, 78, 85, 82.5, 84.5, 85.0, 85.0, 0.07883415546095457, 0.05858671123611956, 0.039571050690361965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 587.0, 477, 666, 621.0, 666.0, 666.0, 666.0, 0.05028410519434807, 14.785196516568613, 0.02867765374365163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 82.00000000000001, 78, 94, 81.0, 90.0, 94.0, 94.0, 0.07883504330296308, 0.021094533071300665, 0.04496061063372112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 869.0, 721, 998, 883.0, 998.0, 998.0, 998.0, 0.05017141901496781, 45.14433102161552, 0.028564391880592024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 152.33333333333331, 79, 248, 96.0, 248.0, 248.0, 248.0, 0.050376141859215476, 0.08914215727431488, 0.027893820736499195], "isController": false}, {"data": ["addBook", 62, 22, 35.483870967741936, 776.0000000000002, 417, 3066, 633.5, 1416.3, 1575.5499999999993, 3066.0, 0.28564188800073714, 67.28941019413283, 1.040909310140287], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 83.84615384615384, 79, 100, 81.0, 94.8, 100.0, 100.0, 0.07169130825608135, 0.05327840388952921, 0.03598567621447834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c6415cc-ff99-4d3e-b3b1-25899b07ec21", 3, 0, 0.0, 274.0, 167, 386, 269.0, 386.0, 386.0, 386.0, 0.047171294694801726, 0.030326597337966603, 0.030249821142174282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 105.53846153846155, 78, 240, 82.0, 237.2, 240.0, 240.0, 0.07169051755039016, 0.019182814266412992, 0.04088599829045689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82ef482d-4812-4099-8532-480d16bceb6d", 3, 0, 0.0, 307.33333333333337, 168, 570, 184.0, 570.0, 570.0, 570.0, 0.025855382228733948, 0.035643731685770924, 0.016580437171421183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 129.30769230769232, 79, 244, 82.0, 243.6, 244.0, 244.0, 0.07169130825608135, 0.019323047928396928, 0.04214664801773533], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 147.5344827586207, 80, 358, 85.0, 330.2, 336.15, 358.0, 0.2512726091194628, 0.18673677298819452, 0.12146478663489657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 116.46153846153845, 78, 241, 81.0, 240.6, 241.0, 241.0, 0.07162810686913544, 0.019306013179571663, 0.04217944183797722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47847839-41fc-4703-a5f0-e8180dbdacb8", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 101.66666666666667, 81, 245, 83.0, 245.0, 245.0, 245.0, 0.05041790844107827, 0.037468777659824766, 0.028310837259394536], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 515.4482758620691, 387, 727, 477.5, 660.7, 722.25, 727.0, 0.25123995581642156, 73.87288896168592, 0.1263560324662667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7960e81a-3751-4875-9101-e65bcab3f369", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 122.10344827586212, 79, 337, 84.0, 242.5, 251.94999999999976, 337.0, 0.25156905353649706, 0.4451593017657545, 0.12234510611442923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 541.25, 78, 1000, 747.5, 970.6, 1000.0, 1000.0, 0.08891358710752986, 45.013073292928595, 0.04797339538760767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 81.5, 77, 85, 81.5, 84.0, 85.0, 85.0, 0.07883459937945908, 0.02124838811399483, 0.046346121900814816], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 769.4655172413794, 534, 1191, 763.5, 960.1, 1007.9499999999996, 1191.0, 0.25107138219124714, 225.9144710320982, 0.12602606488896584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 392.99999999999994, 79, 727, 522.5, 672.4000000000001, 727.0, 727.0, 0.08899221874287368, 14.729244216201034, 0.04810272761150447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 103.14285714285715, 77, 241, 81.5, 237.5, 241.0, 241.0, 0.07883548723146662, 0.02124862741785624, 0.04642363164118591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 94.58823529411765, 82, 242, 84.0, 129.1999999999999, 242.0, 242.0, 0.10785570175995127, 0.0805757928187136, 0.03833933148498268], "isController": false}, {"data": ["deleteBooks", 15, 5, 33.333333333333336, 397.1333333333333, 84, 951, 391.0, 850.2, 951.0, 951.0, 0.09249895167854764, 0.0202341456796823, 0.061575636778199855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 22, 12.087912087912088, 133.5659340659341, 79, 1782, 86.0, 226.0, 305.25, 790.1499999999851, 0.7445072139476472, 1.6058829812093742, 0.35639815361188265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 97.13333333333334, 83, 241, 84.0, 155.80000000000007, 241.0, 241.0, 0.06661071366718624, 0.05158427337702996, 0.023678027123882606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7960e81a-3751-4875-9101-e65bcab3f369", 3, 0, 0.0, 316.0, 276, 380, 292.0, 380.0, 380.0, 380.0, 0.025613441934327137, 0.025688481314994106, 0.016425286657104313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a863964-a3e6-42da-8467-48ef1bbfda19", 3, 0, 0.0, 439.6666666666667, 178, 746, 395.0, 746.0, 746.0, 746.0, 0.02936253927239628, 0.029448562336670873, 0.01882949295788433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a863964-a3e6-42da-8467-48ef1bbfda19", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 240.23076923076925, 163, 331, 189.0, 328.6, 331.0, 331.0, 0.07159575932810135, 0.11095944341181331, 0.16102054075450917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 100.6875, 83, 247, 85.5, 177.70000000000007, 247.0, 247.0, 0.11579770141562691, 0.09397254870740816, 0.04116246417508612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82ef482d-4812-4099-8532-480d16bceb6d", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22a5fc03-9ddb-4508-95d5-f63067d802cd", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 506.9565217391304, 100, 1169, 438.0, 1070.2, 1149.7999999999997, 1169.0, 0.09873914406041119, 0.06065129063867054, 0.04464474970700232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 92.875, 80, 243, 82.0, 141.5000000000001, 243.0, 243.0, 0.08899172376968942, 0.0661354509655602, 0.04466967384533238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 122.31249999999999, 78, 246, 81.5, 246.0, 246.0, 246.0, 0.08891161074496816, 0.09890765487291196, 0.04650711084499372], "isController": false}, {"data": ["login", 23, 0, 0.0, 2529.782608695652, 1509, 3993, 2274.0, 3635.4, 3926.199999999999, 3993.0, 0.09939928259648213, 46.66421122752712, 0.21446897688966682], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 266.0666666666666, 162, 485, 168.0, 482.6, 485.0, 485.0, 0.06581169956520404, 0.10199528047849493, 0.14801205478385243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 85.28571428571428, 83, 97, 84.0, 91.5, 97.0, 97.0, 0.0779583813612647, 0.06311279116063324, 0.027711768374512065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22a5fc03-9ddb-4508-95d5-f63067d802cd", 3, 0, 0.0, 280.6666666666667, 171, 488, 183.0, 488.0, 488.0, 488.0, 0.051362827009998634, 0.03302134874503493, 0.032937750393781676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67ff86a3-6a99-49ff-b532-3c99cc0ac6e5", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.8209150064267352, 1.533880944730077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c6415cc-ff99-4d3e-b3b1-25899b07ec21", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 235.99999999999997, 161, 936, 164.5, 396.00000000000085, 936.0, 936.0, 0.08545791197835066, 5.804939163165266, 0.19098211318425676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1de17e0c-e88e-4cc1-bc34-352b9b52f8f2", 1, 0, 0.0, 1758.0, 1758, 1758, 1758.0, 1758.0, 1758.0, 1758.0, 0.5688282138794084, 0.1816472909556314, 0.3394082408987486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 113.00000000000003, 82, 259, 89.0, 251.0, 259.0, 259.0, 0.07335059893585208, 0.060815096188025795, 0.02607384571547867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 646.375, 163, 1085, 829.5, 1053.5, 1085.0, 1085.0, 0.0888711146659557, 59.8656798588199, 0.18708280913261793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a16c1eb-14da-4b88-bbd7-013301b34c4f", 3, 0, 0.0, 386.66666666666663, 174, 783, 203.0, 783.0, 783.0, 783.0, 0.018764542520453353, 0.0258684367103255, 0.012033251551202181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acd7c3f7-42d8-4d60-8f9c-785da308fdae", 3, 0, 0.0, 325.6666666666667, 206, 518, 253.0, 518.0, 518.0, 518.0, 0.029396202010700218, 0.024506404085092207, 0.018851080065455543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 89.00000000000001, 81, 112, 86.0, 105.0, 112.0, 112.0, 0.0878797365804896, 0.06822694392723558, 0.03123850011259591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acd7c3f7-42d8-4d60-8f9c-785da308fdae", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04cf4421-b8e0-43d0-9474-bf200c3c160c", 3, 0, 0.0, 583.3333333333334, 194, 993, 563.0, 993.0, 993.0, 993.0, 0.0287092328892972, 0.023933706194495485, 0.018410543226534987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, 52.63157894736842, 504.7368421052631, 81, 1206, 93.0, 1082.0, 1206.0, 1206.0, 0.08636049598196428, 48.9518776021781, 0.12235883183793315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 284.625, 162, 1100, 167.5, 670.2000000000005, 1100.0, 1100.0, 0.11588576560655334, 8.833354288588149, 0.25877664919930177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 83.05882352941178, 80, 91, 82.0, 87.8, 91.0, 91.0, 0.10951279689241333, 0.08138597503430327, 0.05497029062763716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 118.58823529411767, 80, 241, 81.0, 240.2, 241.0, 241.0, 0.10952126323113497, 0.03898171800207446, 0.06192028221052564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 160.76470588235293, 79, 791, 82.0, 354.1999999999996, 791.0, 791.0, 0.10952055765291002, 5.824652805739521, 0.06383246656401799], "isController": false}, {"data": ["register", 25, 9, 36.0, 946.4000000000001, 280, 1585, 927.0, 1437.2, 1552.0, 1585.0, 0.09987735061344669, 0.031118037050501986, 0.04506185154630114], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 161.35294117647058, 80, 639, 82.0, 327.7999999999997, 639.0, 639.0, 0.10952055765291002, 1.922058104682326, 0.0639394202336009], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 17.647058823529413, 0.6512301013024602], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 9.803921568627452, 0.361794500723589], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 9.803921568627452, 0.361794500723589], "isController": false}, {"data": ["401/Unauthorized", 32, 62.745098039215684, 2.3154848046309695], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1382, 51, "401/Unauthorized", 32, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 22, "401/Unauthorized", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
