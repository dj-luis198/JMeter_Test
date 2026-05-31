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

    var data = {"OkPercent": 98.82995319812792, "KoPercent": 1.1700468018720749};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8234700739744452, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3181818181818182, 500, 1500, "see books"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bcaf9a7-25ab-4790-b653-d9ea9dfcf9aa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e74b521-2c09-433e-b486-9515efb98066"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea9420a0-352b-4b74-86c9-a2509555953d"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a8dba27-71fd-4e3d-be15-a6792fd5a4e0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f82e55f-f659-4b47-b776-c91c6f6690d9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25d48ca5-ef34-4cc8-84b7-f230cced9cc4"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6b183fb-3895-45f6-bd6a-d1aadc6d134d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a34b77b-7857-4d11-9f74-071d300b5349"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71b8492c-8e1d-4c2b-a600-edbe5ca685b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab1ae740-d73f-4215-b415-f079011ea72e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b511321c-d293-41d1-bc11-7c4897174768"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea9420a0-352b-4b74-86c9-a2509555953d"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a8dba27-71fd-4e3d-be15-a6792fd5a4e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a34b77b-7857-4d11-9f74-071d300b5349"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.39166666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ff0e2e1-f7bf-4e1f-a611-f104b0e4c35e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5733c3a-2811-44d3-99c9-d4d9de84923e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7636363636363637, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d09855d-4536-4049-8a9f-ad45984470e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bcaf9a7-25ab-4790-b653-d9ea9dfcf9aa"], "isController": false}, {"data": [0.9657142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a075fc9-0137-410f-9bd0-040297898ed5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c73deb2-566e-4c84-b6d1-3f55657b846b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c73deb2-566e-4c84-b6d1-3f55657b846b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab1ae740-d73f-4215-b415-f079011ea72e"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57011d06-97a6-473b-87b6-483456baf59d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e74b521-2c09-433e-b486-9515efb98066"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6b183fb-3895-45f6-bd6a-d1aadc6d134d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25d48ca5-ef34-4cc8-84b7-f230cced9cc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71b8492c-8e1d-4c2b-a600-edbe5ca685b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f82e55f-f659-4b47-b776-c91c6f6690d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1282, 15, 1.1700468018720749, 304.9141965678628, 77, 3456, 101.0, 860.0, 1043.85, 1468.5100000000002, 5.124064718296348, 691.8999958032231, 3.744780258761271], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1430.2, 1013, 1915, 1425.0, 1693.4, 1849.2, 1915.0, 0.24346409568581623, 292.96921687006983, 1.1971110564239107], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 495.66666666666663, 111, 864, 421.5, 821.4000000000001, 864.0, 864.0, 0.0766616410701965, 0.014579936131270283, 0.051800260889147264], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 495.66666666666663, 111, 864, 421.5, 821.4000000000001, 864.0, 864.0, 0.07468678230670127, 0.014204346537334055, 0.05046584907979661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 104.82352941176471, 77, 261, 88.0, 246.6, 261.0, 261.0, 0.10385040654379739, 0.036963299571769796, 0.05871413724747552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 107.94117647058823, 81, 280, 88.0, 262.4, 280.0, 280.0, 0.10385294423096894, 0.07717977593727282, 0.05212930989718558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 144.58823529411765, 79, 740, 87.0, 357.5999999999997, 740.0, 740.0, 0.10385357867214037, 1.8226040559404246, 0.06063096967170051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 164.7058823529412, 79, 768, 88.0, 367.19999999999965, 768.0, 768.0, 0.10385611651434436, 5.5233997471561755, 0.06053102930575241], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 230.5, 88, 359, 222.0, 347.30000000000007, 359.0, 359.0, 0.07738740133106331, 0.18414775512046638, 0.05002344797954393], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 119.88888888888889, 83, 355, 89.0, 256.90000000000015, 355.0, 355.0, 0.09233326151857438, 0.06861876173401865, 0.04634696916069065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 127.33333333333334, 79, 354, 87.5, 268.5000000000001, 354.0, 354.0, 0.09233373515606966, 0.032410984508451104, 0.05222827271794609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1329.0, 477, 2965, 545.0, 2965.0, 2965.0, 2965.0, 0.03659518407377589, 10.760199192161313, 0.020870690917075316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1704.3333333333335, 696, 3374, 1043.0, 3374.0, 3374.0, 3374.0, 0.03641395382710655, 32.765339662533684, 0.02073177254023742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 202.0, 82, 264, 260.0, 264.0, 264.0, 264.0, 0.03792955217842061, 0.06711752787822085, 0.021002007895668445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bcaf9a7-25ab-4790-b653-d9ea9dfcf9aa", 3, 0, 0.0, 286.6666666666667, 183, 400, 277.0, 400.0, 400.0, 400.0, 0.019805902158843335, 0.023409905839440154, 0.012701050538060341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e74b521-2c09-433e-b486-9515efb98066", 3, 0, 0.0, 430.0, 254, 542, 494.0, 542.0, 542.0, 542.0, 0.03927472671335995, 0.03274172366956863, 0.025185941284283562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 86.0625, 79, 94, 85.0, 91.9, 94.0, 94.0, 0.07694194249551572, 0.05718048656160885, 0.03862124847919442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 126.5, 81, 262, 88.0, 259.9, 262.0, 262.0, 0.07694305252325122, 0.0278110813624691, 0.04347770875611938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 159.3125, 79, 764, 88.5, 410.50000000000034, 764.0, 764.0, 0.07688389570699547, 4.343193980771819, 0.044786370887912895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 150.9375, 79, 685, 87.0, 377.00000000000034, 685.0, 685.0, 0.07694120249481849, 1.4333961936946684, 0.044894891104154344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 81.33333333333333, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.037929072634174096, 0.028187523705670396, 0.02129806324672862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea9420a0-352b-4b74-86c9-a2509555953d", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 609.5882352941178, 81, 1111, 874.0, 1061.3999999999999, 1111.0, 1111.0, 0.12480270161142312, 66.0713159114268, 0.06706137815218588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 170.94444444444443, 79, 948, 89.0, 331.50000000000097, 948.0, 948.0, 0.09233420879842416, 4.639197867400382, 0.05384158399335194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 428.70588235294116, 82, 712, 523.0, 702.4, 712.0, 712.0, 0.12479903684508035, 21.59918036397272, 0.06718128298915717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 155.16666666666666, 80, 490, 88.0, 287.50000000000034, 490.0, 490.0, 0.09233752443097001, 1.5318550833089664, 0.05393369075650081], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 484.16666666666674, 81, 1169, 451.0, 998.0000000000007, 1169.0, 1169.0, 0.07484096295372333, 0.014233669468005488, 0.05115472394598977], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a8dba27-71fd-4e3d-be15-a6792fd5a4e0", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 278.25, 173, 844, 182.5, 496.10000000000036, 844.0, 844.0, 0.0768521364893944, 5.858028774220431, 0.17161329746099754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f82e55f-f659-4b47-b776-c91c6f6690d9", 3, 0, 0.0, 318.6666666666667, 162, 403, 391.0, 403.0, 403.0, 403.0, 0.06127826459954654, 0.027726818943154197, 0.039296282962599835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25d48ca5-ef34-4cc8-84b7-f230cced9cc4", 3, 0, 0.0, 518.0, 269, 795, 490.0, 795.0, 795.0, 795.0, 0.019542191591646364, 0.026940488733926547, 0.012531939269382597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 451.1499999999999, 166, 1366, 314.5, 1094.9000000000003, 1353.1, 1366.0, 0.09174480265692948, 0.05635496178828969, 0.04148226917007651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 88.70588235294116, 82, 101, 89.0, 93.8, 101.0, 101.0, 0.12480086920134786, 0.09274752095920479, 0.06264418629833281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 149.0, 81, 274, 89.0, 269.2, 274.0, 274.0, 0.12479903684508035, 0.1436536707434352, 0.06500905710657104], "isController": false}, {"data": ["login", 20, 0, 0.0, 2208.2000000000003, 1483, 5410, 1937.5, 2702.5, 5274.699999999998, 5410.0, 0.09212556714802275, 16.661408132096547, 0.16191248359013335], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 92.44444444444446, 81, 109, 92.5, 98.20000000000002, 109.0, 109.0, 0.09385558753597797, 0.07598269733137279, 0.03336272838192967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6b183fb-3895-45f6-bd6a-d1aadc6d134d", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a34b77b-7857-4d11-9f74-071d300b5349", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 711.1764705882351, 168, 1200, 966.0, 1147.2, 1200.0, 1200.0, 0.12472121140978988, 87.85013789259669, 0.26172969749603825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71b8492c-8e1d-4c2b-a600-edbe5ca685b3", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab1ae740-d73f-4215-b415-f079011ea72e", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b511321c-d293-41d1-bc11-7c4897174768", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 286.41176470588243, 170, 1026, 177.0, 640.3999999999996, 1026.0, 1026.0, 0.10379650999499335, 7.455914149601298, 0.23187858899329594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 1105.4, 79, 3456, 777.0, 3456.0, 3456.0, 3456.0, 0.05106991471324243, 36.66388974005413, 0.08262952607119146], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1005.6363636363637, 218, 1762, 997.5, 1496.8999999999999, 1723.8999999999994, 1762.0, 0.08739730816290858, 0.027637536547965233, 0.03943120739381227], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 334.94444444444446, 172, 1032, 254.0, 743.1000000000005, 1032.0, 1032.0, 0.09229112723357347, 6.269102140320968, 0.2062530443253775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 90.57142857142858, 83, 112, 88.5, 106.0, 112.0, 112.0, 0.09602260646506491, 0.07454880091770176, 0.03413303589187854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea9420a0-352b-4b74-86c9-a2509555953d", 3, 0, 0.0, 374.3333333333333, 275, 529, 319.0, 529.0, 529.0, 529.0, 0.01791472590469366, 0.024696895900513553, 0.011488284515705242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 308.6, 161, 1202, 186.0, 494.4000000000002, 1167.0499999999995, 1202.0, 0.13003816620178021, 7.96999983948414, 0.2907953093607974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a8dba27-71fd-4e3d-be15-a6792fd5a4e0", 3, 0, 0.0, 311.6666666666667, 190, 396, 349.0, 396.0, 396.0, 396.0, 0.02373774538894296, 0.02805721142814189, 0.01522244740111251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 102.66666666666667, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.046888920148168985, 0.034846160383551365, 0.023536039996248884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 140.44444444444446, 78, 265, 88.0, 265.0, 265.0, 265.0, 0.046846940634515784, 0.012535216536970043, 0.02671739583062228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 102.44444444444444, 80, 239, 87.0, 239.0, 239.0, 239.0, 0.04689063021007002, 0.012638490173807936, 0.027566561900841946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 140.22222222222223, 83, 264, 89.0, 264.0, 264.0, 264.0, 0.0468908745148097, 0.012638556021569802, 0.027612497394951415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 3.6410108024691357, 7.631655092592593], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 985.3454545454549, 639, 1535, 949.0, 1315.8, 1490.8, 1535.0, 0.24737557008824562, 295.94718348858027, 0.48847011984221933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1005.6363636363637, 218, 1762, 997.5, 1496.8999999999999, 1723.8999999999994, 1762.0, 0.08809549551714058, 0.027858323422590085, 0.03974620989152241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a34b77b-7857-4d11-9f74-071d300b5349", 3, 0, 0.0, 271.0, 169, 373, 271.0, 373.0, 373.0, 373.0, 0.02260312676586928, 0.022536906667922397, 0.014494843661706537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 85.0, 80, 90, 85.0, 90.0, 90.0, 90.0, 0.020824331148513925, 0.005612808004872893, 0.01226276531499404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 130.75, 84, 263, 88.0, 263.0, 263.0, 263.0, 0.02082400591401768, 0.005612720344012577, 0.012242237851795549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 107.71428571428571, 81, 242, 87.5, 240.0, 242.0, 242.0, 0.09602853419301736, 0.02588269085671171, 0.05645427498456684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 126.57142857142856, 79, 328, 87.5, 298.0, 328.0, 328.0, 0.09603248641826263, 0.025883756104922353, 0.05655038018575427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 122.75, 82, 240, 84.5, 240.0, 240.0, 240.0, 0.02082465639316951, 0.005572222511453561, 0.011876561849229486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 114.21428571428571, 81, 268, 88.5, 266.0, 268.0, 268.0, 0.09602655820238283, 0.07136348710157552, 0.04820083097268044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 86.5, 82, 90, 87.0, 90.0, 90.0, 90.0, 0.020823572283825288, 0.015475330574210005, 0.010452457181529491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 122.2857142857143, 83, 265, 88.0, 254.5, 265.0, 265.0, 0.09602853419301736, 0.02569513512586597, 0.05476627340695521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 137.0, 90, 268, 95.0, 268.0, 268.0, 268.0, 0.021337657765307102, 0.016795070467614772, 0.0075848705337615095], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 422.25, 79, 542, 435.0, 538.1, 542.0, 542.0, 0.07555152614082805, 0.014196653146091469, 0.05141906031215372], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1241.3, 758, 2099, 1213.5, 1699.8000000000004, 2080.1, 2099.0, 0.09000940598292521, 0.04658689958100621, 0.04140081075972439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 220.25, 174, 346, 180.5, 346.0, 346.0, 346.0, 0.02081382037673015, 0.0322573563846394, 0.04681076985118118], "isController": false}, {"data": ["addBook", 60, 6, 10.0, 869.0166666666665, 449, 1677, 732.0, 1515.7, 1570.4499999999998, 1677.0, 0.2836141901633145, 80.22187548007611, 1.033986987721869], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3ff0e2e1-f7bf-4e1f-a611-f104b0e4c35e", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5733c3a-2811-44d3-99c9-d4d9de84923e", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 154.52727272727267, 80, 406, 90.0, 349.0, 361.0, 406.0, 0.24806061699440737, 0.18434973587182032, 0.11991211466038247], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 535.8545454545452, 386, 788, 485.0, 722.0, 780.4, 788.0, 0.24804607343065757, 72.9337814933952, 0.12474973419608268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d09855d-4536-4049-8a9f-ad45984470e2", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 137.2909090909091, 79, 362, 90.0, 264.4, 286.5999999999997, 362.0, 0.24839110308230775, 0.4395358191261149, 0.12079957942870045], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 828.3454545454545, 555, 1225, 851.0, 1041.0, 1135.6, 1225.0, 0.24780355936021625, 222.9740783045168, 0.12438577100698356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 92.15, 82, 103, 92.0, 101.50000000000001, 102.95, 103.0, 0.1293937256982409, 0.0966662110929241, 0.04599542593179656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bcaf9a7-25ab-4790-b653-d9ea9dfcf9aa", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, 3.4285714285714284, 140.3314285714286, 79, 463, 93.0, 248.60000000000005, 300.59999999999985, 449.32000000000016, 0.7340357706117244, 1.5081854491564881, 0.35502836130708704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 89.66666666666669, 82, 97, 91.0, 97.0, 97.0, 97.0, 0.046509945376653046, 0.03601795574578697, 0.016532832145607135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a075fc9-0137-410f-9bd0-040297898ed5", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c73deb2-566e-4c84-b6d1-3f55657b846b", 3, 0, 0.0, 259.3333333333333, 180, 368, 230.0, 368.0, 368.0, 368.0, 0.0396851643627224, 0.03308388865004299, 0.025449145115417685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 102.41176470588235, 82, 245, 91.0, 140.99999999999991, 245.0, 245.0, 0.1003879699780918, 0.08146719048026786, 0.03568478620314982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c73deb2-566e-4c84-b6d1-3f55657b846b", 1, 0, 0.0, 1169.0, 1169, 1169, 1169.0, 1169.0, 1169.0, 1169.0, 0.8554319931565441, 0.15454581907613343, 0.589780260906758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab1ae740-d73f-4215-b415-f079011ea72e", 3, 0, 0.0, 340.6666666666667, 200, 502, 320.0, 502.0, 502.0, 502.0, 0.01822544880167674, 0.025125252498405276, 0.011687543665137756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 280.66666666666674, 167, 512, 317.0, 512.0, 512.0, 512.0, 0.04682476093358168, 0.07256923398593176, 0.10530998479495958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57011d06-97a6-473b-87b6-483456baf59d", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 276.85714285714283, 167, 532, 189.5, 519.5, 532.0, 532.0, 0.09596928982725528, 0.1487336552303263, 0.21583718210172745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e74b521-2c09-433e-b486-9515efb98066", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6b183fb-3895-45f6-bd6a-d1aadc6d134d", 3, 0, 0.0, 339.0, 188, 470, 359.0, 470.0, 470.0, 470.0, 0.022544525437739535, 0.022610573852107914, 0.014457264033967085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25d48ca5-ef34-4cc8-84b7-f230cced9cc4", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 90.68750000000001, 82, 100, 91.0, 97.9, 100.0, 100.0, 0.07564654153467922, 0.06271866578412369, 0.0268899815611555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71b8492c-8e1d-4c2b-a600-edbe5ca685b3", 3, 0, 0.0, 308.3333333333333, 171, 527, 227.0, 527.0, 527.0, 527.0, 0.044144913034521324, 0.028380925534889197, 0.02830907509049707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 107.82352941176471, 85, 271, 94.0, 174.1999999999999, 271.0, 271.0, 0.13211168877594634, 0.10256718025085679, 0.046961576869574674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f82e55f-f659-4b47-b776-c91c6f6690d9", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 95.75, 79, 241, 89.0, 109.30000000000004, 234.49999999999991, 241.0, 0.13011176600700003, 0.09669438860481154, 0.06531000754648243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 110.8, 77, 263, 88.0, 260.90000000000003, 263.0, 263.0, 0.13011515190943984, 0.044587311333029726, 0.0736599155877952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 197.1, 78, 1120, 88.5, 271.20000000000005, 1077.5999999999995, 1120.0, 0.13011684492674422, 5.88728531737125, 0.07593537746896713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 159.99999999999997, 81, 481, 89.0, 327.8000000000001, 473.5999999999999, 481.0, 0.13011938453531113, 1.9462886495234375, 0.0760639292801145], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.39001560062402496], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.078003120124805], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.078003120124805], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.62402496099844], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1282, 15, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
