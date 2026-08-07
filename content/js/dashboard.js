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

    var data = {"OkPercent": 98.53508095605243, "KoPercent": 1.4649190439475712};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.772005294506949, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15178571428571427, 500, 1500, "see books"], "isController": true}, {"data": [0.39285714285714285, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c7dbeb3-2a81-43fb-b4c7-c6da9f64880a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/816c89c8-5d46-4de9-bab7-bc13598b771f"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3341d7b5-215a-4acc-b1be-bee1587f81eb"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53b5a524-4fc7-4b74-baaf-b1f0f507c195"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c1d83518-4d5f-4a1d-8774-886a8c7accf2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d583a292-fb04-406c-8277-df3fb9b3bb2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7360f0ee-f3d5-4367-bebf-f65e432ed4d5"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ded5334-d460-4d38-9b3f-f5b8df7a0ad5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac9dc1ff-882f-45f4-a0ed-8def40236ec8"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b411b898-09a4-4770-ad1c-d70b613ca08a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/67d146be-dcfa-49f8-a79f-c506c2c0c2f6"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b35cbeff-4dfc-4758-aca2-952af4fa22c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2675433-10ac-4125-bacf-1f5b73dd1245"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8827d1f-9384-4634-bcfe-751a24388776"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f00f7320-96cd-449f-86ec-0ef9947025e2"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c7dbeb3-2a81-43fb-b4c7-c6da9f64880a"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53b5a524-4fc7-4b74-baaf-b1f0f507c195"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9558823529411765, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3341d7b5-215a-4acc-b1be-bee1587f81eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=816c89c8-5d46-4de9-bab7-bc13598b771f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b411b898-09a4-4770-ad1c-d70b613ca08a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f00f7320-96cd-449f-86ec-0ef9947025e2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7360f0ee-f3d5-4367-bebf-f65e432ed4d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac9dc1ff-882f-45f4-a0ed-8def40236ec8"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d583a292-fb04-406c-8277-df3fb9b3bb2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b35cbeff-4dfc-4758-aca2-952af4fa22c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bc0d8989-d9e0-4e96-80a6-89b74bdfeda2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2675433-10ac-4125-bacf-1f5b73dd1245"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67d146be-dcfa-49f8-a79f-c506c2c0c2f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 19, 1.4649190439475712, 379.888974556669, 94, 3025, 124.0, 1036.2000000000005, 1296.3999999999996, 1858.6199999999994, 5.128874336647131, 731.8555288385492, 3.748926901924613], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1650.982142857143, 1213, 2312, 1626.0, 2005.5000000000007, 2187.35, 2312.0, 0.25523807787496067, 307.1376635902312, 1.2550036348636984], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 708.3571428571429, 106, 1544, 611.5, 1324.5, 1544.0, 1544.0, 0.08675069090728829, 0.01708872426912543, 0.05837033792492347], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 708.3571428571429, 106, 1544, 611.5, 1324.5, 1544.0, 1544.0, 0.08861095990987, 0.017455172348317026, 0.059622022829980886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 128.7058823529412, 98, 303, 103.0, 299.0, 303.0, 303.0, 0.10670884804660039, 0.04740844616224766, 0.059803051559204574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 104.3529411764706, 99, 113, 104.0, 113.0, 113.0, 113.0, 0.10670884804660039, 0.07930218101900673, 0.053562839742141204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 217.5882352941177, 97, 783, 104.0, 603.7999999999998, 783.0, 783.0, 0.10670817824031938, 3.716641925015536, 0.06175809373685764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 244.35294117647058, 98, 1268, 103.0, 1188.0, 1268.0, 1268.0, 0.10671152735581389, 11.321757126917669, 0.061655821584603414], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 230.07142857142858, 102, 407, 215.0, 397.0, 407.0, 407.0, 0.08704951874051782, 0.15752829692279952, 0.0562640095319223], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c7dbeb3-2a81-43fb-b4c7-c6da9f64880a", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.26646616887905605, 1.0168925147492625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 103.07692307692308, 98, 113, 103.0, 110.6, 113.0, 113.0, 0.0926255789098682, 0.06883600151407196, 0.04649369878874243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 116.38461538461539, 100, 296, 102.0, 219.19999999999993, 296.0, 296.0, 0.09262425900592795, 0.03548555595930233, 0.052226388829514366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 754.8333333333333, 602, 805, 775.0, 805.0, 805.0, 805.0, 0.056531775568850993, 16.622219048852877, 0.03224077825411033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1069.6666666666665, 951, 1165, 1065.5, 1165.0, 1165.0, 1165.0, 0.05637773079633544, 50.72878127202255, 0.032097868217054265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 198.66666666666669, 96, 306, 192.0, 306.0, 306.0, 306.0, 0.05689091167685962, 0.100670246053193, 0.03150112003982364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 126.29411764705883, 96, 309, 104.0, 297.0, 309.0, 309.0, 0.09461685738456745, 0.07031584811489826, 0.04749322724186295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 122.8235294117647, 94, 295, 100.0, 291.0, 295.0, 295.0, 0.09462212376573788, 0.03367869248922978, 0.05349672231746279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 184.23529411764707, 98, 911, 104.0, 425.3999999999996, 911.0, 911.0, 0.09462265043609909, 5.03233455125208, 0.05514943769098469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 178.7058823529412, 94, 807, 103.0, 403.7999999999996, 807.0, 807.0, 0.09462054378983108, 1.6605666274733533, 0.05524061273759497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 137.16666666666669, 97, 305, 103.5, 305.0, 305.0, 305.0, 0.0568887540414719, 0.04227767756402356, 0.03194436872445932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/816c89c8-5d46-4de9-bab7-bc13598b771f", 3, 0, 0.0, 331.0, 243, 493, 257.0, 493.0, 493.0, 493.0, 0.04477812439362956, 0.029312763071480813, 0.028715138364404376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 887.7692307692307, 99, 1412, 1067.0, 1330.3999999999999, 1412.0, 1412.0, 0.1155463118506075, 79.98316731883672, 0.060290315663635796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 196.07692307692307, 96, 1113, 102.0, 786.5999999999997, 1113.0, 1113.0, 0.09262491895319591, 6.4341268164280985, 0.05384101734223483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 618.5384615384617, 101, 872, 788.0, 847.6, 872.0, 872.0, 0.11575723037469725, 26.189099453269694, 0.06051341392559481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 204.0769230769231, 97, 811, 103.0, 608.9999999999998, 811.0, 811.0, 0.09262491895319591, 2.1180296408646893, 0.053931471364650055], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 548.0714285714286, 107, 1370, 483.0, 1098.5, 1370.0, 1370.0, 0.08848327034167183, 0.01743001921351013, 0.06010394019162948], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3341d7b5-215a-4acc-b1be-bee1587f81eb", 3, 0, 0.0, 388.6666666666667, 202, 540, 424.0, 540.0, 540.0, 540.0, 0.0757920266787934, 0.03429391832145925, 0.04860361085847102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 325.05882352941177, 202, 1015, 210.0, 686.9999999999998, 1015.0, 1015.0, 0.09456317376261306, 6.792664852815201, 0.21125156620256544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53b5a524-4fc7-4b74-baaf-b1f0f507c195", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1d83518-4d5f-4a1d-8774-886a8c7accf2", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.5313409941763727, 0.9928114600665557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d583a292-fb04-406c-8277-df3fb9b3bb2a", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7360f0ee-f3d5-4367-bebf-f65e432ed4d5", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 803.5454545454545, 104, 2376, 755.5, 1514.1999999999998, 2257.7999999999984, 2376.0, 0.09439062272068098, 0.0579801774329183, 0.042678572577807904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 106.46153846153847, 98, 128, 105.0, 123.6, 128.0, 128.0, 0.11573867986681148, 0.08601282751820659, 0.05809539204252061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 197.69230769230768, 100, 314, 106.0, 313.2, 314.0, 314.0, 0.1155463118506075, 0.16441393021891582, 0.058432825373970085], "isController": false}, {"data": ["login", 22, 0, 0.0, 3339.0, 1780, 5468, 3287.5, 4525.3, 5341.399999999998, 5468.0, 0.09432627458378531, 30.905127932689627, 0.18497630320323452], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 122.0, 102, 293, 107.0, 226.19999999999993, 293.0, 293.0, 0.09139546819086185, 0.07399105774435984, 0.03248823283347042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ded5334-d460-4d38-9b3f-f5b8df7a0ad5", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac9dc1ff-882f-45f4-a0ed-8def40236ec8", 1, 0, 0.0, 777.0, 777, 777, 777.0, 777.0, 777.0, 777.0, 1.287001287001287, 0.23251488095238096, 0.8873270592020591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 995.6923076923078, 210, 1511, 1185.0, 1432.1999999999998, 1511.0, 1511.0, 0.11542422843342687, 106.26243897221384, 0.2368745865814895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b411b898-09a4-4770-ad1c-d70b613ca08a", 1, 0, 0.0, 1370.0, 1370, 1370, 1370.0, 1370.0, 1370.0, 1370.0, 0.7299270072992701, 0.13187157846715328, 0.5032504562043795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67d146be-dcfa-49f8-a79f-c506c2c0c2f6", 3, 0, 0.0, 461.3333333333333, 200, 679, 505.0, 679.0, 679.0, 679.0, 0.041721716153257773, 0.03478167808219178, 0.02675513698630137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 399.9411764705882, 204, 1376, 219.0, 1290.3999999999999, 1376.0, 1376.0, 0.10663923320118432, 15.15495548008042, 0.23662417629033472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 765.8000000000001, 102, 1377, 1111.0, 1366.2, 1377.0, 1377.0, 0.09387115245613871, 67.3915670850191, 0.15188059120051817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b35cbeff-4dfc-4758-aca2-952af4fa22c7", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2675433-10ac-4125-bacf-1f5b73dd1245", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1335.6521739130433, 109, 2519, 1372.0, 2136.8000000000006, 2482.3999999999996, 2519.0, 0.09406760597942783, 0.029635769207173677, 0.04244065816649966], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 117.92307692307693, 103, 147, 114.0, 144.6, 147.0, 147.0, 0.06318900316917155, 0.0490578686713783, 0.022461715970291448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 346.00000000000006, 201, 1219, 210.0, 895.3999999999996, 1219.0, 1219.0, 0.09255765273792656, 8.650191256149744, 0.2063426577751988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 312.6470588235294, 201, 971, 214.0, 526.9999999999995, 971.0, 971.0, 0.1047288139769843, 7.522883438370172, 0.233961330810601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 118.6923076923077, 101, 305, 103.0, 225.39999999999992, 305.0, 305.0, 0.05947397556077096, 0.044198921290768266, 0.029853147888902615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 137.15384615384613, 99, 305, 102.0, 304.2, 305.0, 305.0, 0.059420150744351655, 0.01589953252339097, 0.033888054721388054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 150.0, 98, 306, 102.0, 301.6, 306.0, 306.0, 0.05947479183822857, 0.016030314987647544, 0.03496467254552109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 135.84615384615387, 99, 303, 102.0, 302.2, 303.0, 303.0, 0.059420150744351655, 0.016015587505313532, 0.03499057704965239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 107.5, 107, 108, 107.5, 108.0, 108.0, 108.0, 0.05855486590935707, 0.01726911084436117, 0.036196513789670925], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1134.2857142857142, 787, 1855, 1084.0, 1557.8000000000004, 1723.6, 1855.0, 0.24978478364623338, 298.82944048208464, 0.4932273755201991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1335.6521739130433, 109, 2519, 1372.0, 2136.8000000000006, 2482.3999999999996, 2519.0, 0.09217550215610522, 0.02903966652506372, 0.04158699413683654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 121.20000000000002, 97, 305, 101.0, 285.00000000000006, 305.0, 305.0, 0.06697205925687803, 0.018051062846580406, 0.03943764817568111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 140.4, 98, 300, 104.0, 299.2, 300.0, 300.0, 0.06688068485821294, 0.018026434590690206, 0.039318527621722846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8827d1f-9384-4634-bcfe-751a24388776", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 102.23076923076924, 100, 105, 102.0, 105.0, 105.0, 105.0, 0.05973935260923111, 0.016101622382956822, 0.03512020534253626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 179.3846153846154, 96, 309, 104.0, 307.8, 309.0, 309.0, 0.05973935260923111, 0.016101622382956822, 0.035178544554068714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 134.92307692307693, 100, 309, 104.0, 307.8, 309.0, 309.0, 0.05973852905360384, 0.04439552793925051, 0.02998594134135974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 100.60000000000001, 95, 106, 101.0, 105.9, 106.0, 106.0, 0.0669693682109803, 0.017919537978328712, 0.0381934678078247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 133.3076923076923, 98, 307, 103.0, 301.4, 307.0, 307.0, 0.059739078088165684, 0.01598487050405996, 0.03406994297215699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 104.3, 96, 116, 104.0, 115.8, 116.0, 116.0, 0.06696802276912774, 0.04976822785869747, 0.03361480830403483], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 695.5714285714286, 103, 1776, 540.0, 1467.5, 1776.0, 1776.0, 0.08735313753751506, 0.016866174993292526, 0.05944595492578103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 129.1, 102, 334, 106.0, 311.80000000000007, 334.0, 334.0, 0.06714158145280953, 0.05284776821383251, 0.023866734032053392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1862.3181818181818, 1120, 3025, 1766.5, 2908.5, 3016.2999999999997, 3025.0, 0.09476958068768254, 0.04905066187936694, 0.043590305179588354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 247.9, 201, 409, 209.0, 408.3, 409.0, 409.0, 0.06683375104427736, 0.10357926065162908, 0.15031067251461988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f00f7320-96cd-449f-86ec-0ef9947025e2", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["addBook", 57, 5, 8.771929824561404, 1044.0350877192984, 525, 1944, 863.0, 1769.6000000000001, 1918.1, 1944.0, 0.26952138675846155, 85.8998663770888, 0.9799703053630028], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 189.76785714285714, 99, 515, 104.0, 411.20000000000005, 417.75, 515.0, 0.25113008538422904, 0.18663085447011551, 0.12139589088397791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c7dbeb3-2a81-43fb-b4c7-c6da9f64880a", 3, 0, 0.0, 327.3333333333333, 188, 575, 219.0, 575.0, 575.0, 575.0, 0.033068783068783074, 0.03316566426917989, 0.021206218309082894], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 663.3035714285714, 483, 924, 605.5, 838.9000000000002, 906.45, 924.0, 0.2509590219768401, 73.79028508496755, 0.12621474249811782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53b5a524-4fc7-4b74-baaf-b1f0f507c195", 3, 0, 0.0, 581.6666666666666, 324, 1034, 387.0, 1034.0, 1034.0, 1034.0, 0.023969510782284934, 0.024039733958404908, 0.015371072995150168], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 170.83928571428572, 96, 421, 105.0, 308.90000000000003, 313.95, 421.0, 0.2512968713539516, 0.4446776668880473, 0.12221273626393352], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 940.3928571428571, 652, 1404, 911.0, 1178.3000000000002, 1311.05, 1404.0, 0.25028827846358753, 225.20983292140056, 0.12563298352566796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 121.3529411764706, 102, 311, 108.0, 173.39999999999986, 311.0, 311.0, 0.09798609750193091, 0.07320250448142299, 0.034830995596389504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, 2.9411764705882355, 172.9235294117646, 99, 707, 113.5, 309.9, 443.39999999999986, 706.29, 0.7156870174375037, 1.5649979976550725, 0.3433348949518806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 138.76923076923075, 105, 304, 109.0, 302.4, 304.0, 304.0, 0.06180117136989427, 0.04785969618781851, 0.021968385135392104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3341d7b5-215a-4acc-b1be-bee1587f81eb", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=816c89c8-5d46-4de9-bab7-bc13598b771f", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 112.00000000000001, 99, 161, 107.0, 140.2, 161.0, 161.0, 0.10197104022457622, 0.08275188908849887, 0.036247518204829826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b411b898-09a4-4770-ad1c-d70b613ca08a", 3, 0, 0.0, 467.66666666666663, 239, 751, 413.0, 751.0, 751.0, 751.0, 0.048713160672241615, 0.031317868596249084, 0.031238582852967444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 288.9230769230769, 205, 608, 211.0, 529.1999999999999, 608.0, 608.0, 0.05939164679330793, 0.09204545259861298, 0.13357320562987127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f00f7320-96cd-449f-86ec-0ef9947025e2", 3, 0, 0.0, 838.3333333333333, 332, 1776, 407.0, 1776.0, 1776.0, 1776.0, 0.052290315833507635, 0.033617634691138536, 0.0335325267552116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7360f0ee-f3d5-4367-bebf-f65e432ed4d5", 3, 0, 0.0, 856.3333333333334, 200, 1431, 938.0, 1431.0, 1431.0, 1431.0, 0.021160587700055723, 0.025011098287403104, 0.013569777919632089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac9dc1ff-882f-45f4-a0ed-8def40236ec8", 3, 0, 0.0, 322.6666666666667, 226, 444, 298.0, 444.0, 444.0, 444.0, 0.05424758598242378, 0.035193827754873244, 0.03478767720878088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 317.46153846153845, 203, 617, 219.0, 611.0, 617.0, 617.0, 0.05971026741013605, 0.09253925232410734, 0.1342897908647884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d583a292-fb04-406c-8277-df3fb9b3bb2a", 3, 0, 0.0, 549.3333333333334, 200, 973, 475.0, 973.0, 973.0, 973.0, 0.020819598181755092, 0.02460806022068774, 0.013351109511086437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 106.88235294117646, 103, 112, 106.0, 112.0, 112.0, 112.0, 0.09912247456342381, 0.08218259853940119, 0.035234942129967056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 123.53846153846155, 101, 295, 105.0, 240.19999999999993, 295.0, 295.0, 0.10911715825345399, 0.08471498126122648, 0.03878773984790747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b35cbeff-4dfc-4758-aca2-952af4fa22c7", 3, 0, 0.0, 372.3333333333333, 283, 457, 377.0, 457.0, 457.0, 457.0, 0.016546429280561253, 0.022810588542700818, 0.010610828672755753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc0d8989-d9e0-4e96-80a6-89b74bdfeda2", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.3637083570615034, 0.6795896212984055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2675433-10ac-4125-bacf-1f5b73dd1245", 3, 0, 0.0, 570.3333333333333, 211, 1159, 341.0, 1159.0, 1159.0, 1159.0, 0.0414966456878069, 0.026678344802545127, 0.026610804689120963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 103.29411764705884, 99, 111, 103.0, 108.6, 111.0, 111.0, 0.10479337212742873, 0.07787866815329421, 0.052601360618650755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67d146be-dcfa-49f8-a79f-c506c2c0c2f6", 1, 0, 0.0, 827.0, 827, 827, 827.0, 827.0, 827.0, 827.0, 1.2091898428053203, 0.2184571493349456, 0.833679715840387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 161.05882352941177, 97, 306, 103.0, 303.6, 306.0, 306.0, 0.10480047838336015, 0.03730145703488623, 0.05925128149408494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 158.76470588235293, 98, 871, 102.0, 409.3999999999996, 871.0, 871.0, 0.10479918626514194, 5.573555206438985, 0.06108068381469038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 188.3529411764706, 95, 785, 101.0, 402.5999999999997, 785.0, 785.0, 0.10479918626514194, 1.8391992301883302, 0.06118302677002743], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.4626060138781804], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.15420200462606015], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.526315789473685, 0.15420200462606015], "isController": false}, {"data": ["401/Unauthorized", 9, 47.36842105263158, 0.6939090208172706], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 19, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
