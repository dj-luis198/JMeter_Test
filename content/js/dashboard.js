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

    var data = {"OkPercent": 97.86747905559787, "KoPercent": 2.1325209444021325};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.793485342019544, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37962962962962965, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad1efb98-3db8-4677-8ad0-b96e0e9591c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2460c98a-a870-4669-8321-a84b20d56a3d"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fdf90cb-d98a-4fcb-9788-160cf7175518"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e346513-2c99-47fd-a860-7429180744be"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=395ee945-2c13-40f9-a374-273e07030a35"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7124ebb4-35d3-4ef7-96d4-adc2614ba2d3"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c10d6170-0274-49e3-af95-148a841af960"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0636214c-6ddc-4336-8eef-137ee9daac7a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1ca6b0b-9fbb-4a65-a924-e548c196de82"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cae1a57d-827d-4379-b688-da1f74ec42b7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e54460e-d184-4427-b417-f376396132a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e1aa1d2-2564-46d6-8e16-e1a0fd7f9005"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2460c98a-a870-4669-8321-a84b20d56a3d"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54f71516-15a4-4171-bb52-f97e6694ffef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b8d129a-a707-4385-904e-1cef7be26257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfd9c3c7-6145-4742-8376-986241c11ae8"], "isController": false}, {"data": [0.3360655737704918, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7870370370370371, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9005681818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e346513-2c99-47fd-a860-7429180744be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4fdf90cb-d98a-4fcb-9788-160cf7175518"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90c1e0f0-f406-41a8-83cb-a28c187ac156"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0636214c-6ddc-4336-8eef-137ee9daac7a"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c10d6170-0274-49e3-af95-148a841af960"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5fc6572-3d35-43ac-b2d4-0b30c1f47e60"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/395ee945-2c13-40f9-a374-273e07030a35"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/54f71516-15a4-4171-bb52-f97e6694ffef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7124ebb4-35d3-4ef7-96d4-adc2614ba2d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad1efb98-3db8-4677-8ad0-b96e0e9591c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e54460e-d184-4427-b417-f376396132a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1ca6b0b-9fbb-4a65-a924-e548c196de82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae1a57d-827d-4379-b688-da1f74ec42b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5e1aa1d2-2564-46d6-8e16-e1a0fd7f9005"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 28, 2.1325209444021325, 327.8271134805788, 77, 5081, 96.0, 889.6000000000001, 1091.8999999999999, 1776.339999999998, 5.084693253196812, 707.4914248141647, 3.707545969906206], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1371.8333333333337, 1007, 1885, 1356.0, 1597.0, 1667.25, 1885.0, 0.23437906908106043, 282.03808351300586, 1.152440051585097], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad1efb98-3db8-4677-8ad0-b96e0e9591c6", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2460c98a-a870-4669-8321-a84b20d56a3d", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 509.5625000000001, 84, 930, 506.0, 899.9, 930.0, 930.0, 0.1048115030624611, 0.021181084389636763, 0.07029868207723297], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 509.5625000000001, 84, 930, 506.0, 899.9, 930.0, 930.0, 0.10463124027256439, 0.021144655550687296, 0.0701777770602545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 95.34782608695652, 79, 242, 82.0, 176.4000000000002, 241.2, 242.0, 0.11863008046214153, 0.039489632762533526, 0.06722304066948628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 82.95652173913044, 80, 86, 83.0, 86.0, 86.0, 86.0, 0.11862763301768067, 0.08815979367817871, 0.059545511104578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 134.17391304347825, 78, 649, 81.0, 244.6, 568.1999999999989, 649.0, 0.11863130422224286, 1.5471734318746841, 0.06941482691434821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 133.78260869565216, 80, 799, 83.0, 241.6, 687.5999999999984, 799.0, 0.11863008046214153, 4.671608444978853, 0.06929826116670106], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 201.0, 81, 324, 198.0, 306.5, 324.0, 324.0, 0.10460661375315455, 0.19055080489885848, 0.06760738727002889], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 93.22222222222224, 81, 247, 83.5, 112.00000000000021, 247.0, 247.0, 0.11938160329493225, 0.08872011729242525, 0.05992396884140155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 109.16666666666667, 79, 246, 82.0, 244.2, 246.0, 246.0, 0.11938239507613943, 0.03194411743248262, 0.06808527219186077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 559.3333333333334, 464, 645, 563.0, 645.0, 645.0, 645.0, 0.05780179763590648, 16.995647705268635, 0.03296508771422791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 876.5, 698, 964, 884.0, 964.0, 964.0, 964.0, 0.057620835694187016, 51.84732924425472, 0.032805612509483426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 189.0, 81, 249, 240.0, 249.0, 249.0, 249.0, 0.058113631520833736, 0.10283388702710033, 0.0321781533909304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 83.49999999999999, 80, 95, 82.0, 92.30000000000001, 95.0, 95.0, 0.056381439230205416, 0.04190065942791633, 0.0283008396135992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 121.0, 80, 242, 82.0, 241.1, 242.0, 242.0, 0.05638223395807981, 0.015086652445814324, 0.03215549280421739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 82.66666666666666, 79, 93, 82.5, 90.60000000000001, 93.0, 93.0, 0.05638249887235002, 0.015196845399188093, 0.03314674250112765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 148.33333333333331, 80, 244, 84.5, 243.7, 244.0, 244.0, 0.05638276378910967, 0.015196916802533466, 0.033201959535969855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fdf90cb-d98a-4fcb-9788-160cf7175518", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 84.33333333333333, 79, 95, 82.5, 95.0, 95.0, 95.0, 0.058113631520833736, 0.043187962487650854, 0.03263216613718691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e346513-2c99-47fd-a860-7429180744be", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 555.8333333333331, 78, 1007, 807.0, 1007.0, 1007.0, 1007.0, 0.0817063926173735, 40.853985356966156, 0.044133509380347796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 113.05555555555556, 79, 318, 82.5, 251.4000000000001, 318.0, 318.0, 0.11938239507613943, 0.03217728617286571, 0.07018379085530853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 385.8333333333334, 77, 693, 473.0, 654.3000000000001, 693.0, 693.0, 0.08170602173380177, 13.356611747737198, 0.0442131000853374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 109.0, 80, 244, 83.0, 241.3, 244.0, 244.0, 0.11938318686784945, 0.03217749958547504, 0.07030084148565743], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 753.1428571428571, 87, 2639, 535.5, 1914.0, 2639.0, 2639.0, 0.10513194058543471, 0.019851573881471248, 0.07194820515371791], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 246.58333333333331, 164, 337, 245.5, 334.0, 337.0, 337.0, 0.056359195942137896, 0.08734574605485629, 0.126753152592523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=395ee945-2c13-40f9-a374-273e07030a35", 1, 0, 0.0, 2639.0, 2639, 2639, 2639.0, 2639.0, 2639.0, 2639.0, 0.378931413414172, 0.06845928855627131, 0.26125544713906784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 694.6086956521739, 112, 1371, 774.0, 1111.0, 1325.3999999999994, 1371.0, 0.09263958368576652, 0.05690458802572964, 0.041886843014169825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 93.22222222222221, 80, 245, 83.0, 110.00000000000021, 245.0, 245.0, 0.08170602173380177, 0.06072097904240543, 0.041012592940599724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 119.05555555555557, 79, 243, 83.5, 242.1, 243.0, 243.0, 0.0817063926173735, 0.09004016096159347, 0.042785921307665425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7124ebb4-35d3-4ef7-96d4-adc2614ba2d3", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["login", 23, 0, 0.0, 3128.2608695652166, 1962, 6301, 2904.0, 4849.800000000002, 6120.999999999997, 6301.0, 0.0953676214485927, 29.893797269168893, 0.18514324709128754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 113.83333333333333, 81, 346, 88.5, 267.7000000000001, 346.0, 346.0, 0.12230421134167721, 0.09901385859594765, 0.04347532512536181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c10d6170-0274-49e3-af95-148a841af960", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 650.5555555555555, 161, 1091, 891.0, 1089.2, 1091.0, 1091.0, 0.0816748795295527, 54.340452660332325, 0.17207911630049097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0636214c-6ddc-4336-8eef-137ee9daac7a", 3, 0, 0.0, 1049.3333333333335, 206, 2643, 299.0, 2643.0, 2643.0, 2643.0, 0.0468084442433415, 0.029666679994070935, 0.03001713384094491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1ca6b0b-9fbb-4a65-a924-e548c196de82", 3, 0, 0.0, 636.3333333333333, 280, 1305, 324.0, 1305.0, 1305.0, 1305.0, 0.028378723525015845, 0.02846186431659304, 0.018198595489674875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 245.91304347826087, 163, 884, 168.0, 329.8, 773.3999999999985, 884.0, 0.11857626000164975, 6.343537899937103, 0.2653617075368102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 609.4, 81, 1048, 868.5, 1046.8, 1048.0, 1048.0, 0.08919810900008919, 64.03671617161716, 0.14401487657211667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae1a57d-827d-4379-b688-da1f74ec42b7", 3, 0, 0.0, 279.0, 198, 431, 208.0, 431.0, 431.0, 431.0, 0.04129160128829796, 0.026546521010543122, 0.02647931462823795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e54460e-d184-4427-b417-f376396132a7", 1, 0, 0.0, 926.0, 926, 926, 926.0, 926.0, 926.0, 926.0, 1.0799136069114472, 0.1951015793736501, 0.7445498110151187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e1aa1d2-2564-46d6-8e16-e1a0fd7f9005", 1, 0, 0.0, 1189.0, 1189, 1189, 1189.0, 1189.0, 1189.0, 1189.0, 0.8410428931875525, 0.15194622582001682, 0.5798596509671993], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1204.6249999999998, 199, 1954, 1229.5, 1677.5, 1886.25, 1954.0, 0.09686793671294802, 0.030413126614465612, 0.04370408863416209], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 243.5, 164, 566, 170.0, 360.8000000000003, 566.0, 566.0, 0.11931354937923812, 0.18491269811020594, 0.2683389689652201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 87.39999999999999, 79, 109, 85.0, 101.80000000000001, 109.0, 109.0, 0.08811556062056851, 0.06841002997397654, 0.03132232818934272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 331.38461538461536, 166, 1040, 323.0, 755.5999999999997, 1040.0, 1040.0, 0.07828071464270875, 7.315906716485316, 0.17451448080316015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 116.6, 82, 244, 84.5, 243.6, 244.0, 244.0, 0.06401843730994526, 0.04757620194616049, 0.032134254665343615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 130.1, 79, 251, 83.0, 250.0, 251.0, 251.0, 0.06401884714860055, 0.026745373838057925, 0.03597309047783667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 187.5, 80, 740, 82.0, 698.7000000000002, 740.0, 740.0, 0.06402007669605188, 5.77606762480714, 0.03708663036728318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 171.7, 79, 653, 83.0, 612.2000000000002, 653.0, 653.0, 0.06402089642059168, 1.8979569931625682, 0.03714962563780818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2460c98a-a870-4669-8321-a84b20d56a3d", 3, 0, 0.0, 540.3333333333334, 198, 1002, 421.0, 1002.0, 1002.0, 1002.0, 0.01868646601554714, 0.02576080194526111, 0.011983182959188758], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 937.7037037037037, 641, 1534, 881.5, 1253.5, 1317.0, 1534.0, 0.23949971171330997, 286.52491878076904, 0.4729183760588992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1204.6249999999998, 199, 1954, 1229.5, 1677.5, 1886.25, 1954.0, 0.09545590136223525, 0.029969797156209604, 0.04306701799741473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 82.5, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.026032288715436714, 0.007016515317832551, 0.015329560640047205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 83.33333333333334, 81, 90, 82.5, 90.0, 90.0, 90.0, 0.026032175769250796, 0.007016484875305878, 0.015304072083094705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 254.9333333333333, 79, 837, 83.0, 769.2, 837.0, 837.0, 0.08419020250550042, 15.169051953423173, 0.04804761166427192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 215.66666666666666, 81, 644, 83.0, 642.8, 644.0, 644.0, 0.08419209267865563, 4.96920805760423, 0.04813090923250489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54f71516-15a4-4171-bb52-f97e6694ffef", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 81.33333333333333, 78, 83, 82.0, 83.0, 83.0, 83.0, 0.02603206282404495, 0.006965610560340152, 0.014846410829338134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 93.4, 81, 243, 83.0, 148.20000000000005, 243.0, 243.0, 0.08426256214363959, 0.0626209079993259, 0.04229585638850659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 87.5, 82, 98, 84.0, 98.0, 98.0, 98.0, 0.02603070755801594, 0.01934508637856458, 0.013066195004707218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 102.33333333333333, 79, 245, 81.0, 239.6, 245.0, 245.0, 0.08426587569098018, 0.047860384083861396, 0.0466424788492652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 88.16666666666667, 83, 101, 86.5, 101.0, 101.0, 101.0, 0.026132631817350326, 0.020569239496859727, 0.009289333966323749], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 708.3571428571429, 82, 2643, 442.0, 1974.0, 2643.0, 2643.0, 0.10408534998698933, 0.019450659362105497, 0.07083989675105015], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1859.8695652173915, 1040, 5081, 1577.0, 3397.2000000000025, 4891.999999999997, 5081.0, 0.09468254589016002, 0.049005614572055475, 0.04355027257252477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 172.66666666666666, 166, 182, 171.5, 182.0, 182.0, 182.0, 0.026021337496747333, 0.04032799082747853, 0.05852259790528233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b8d129a-a707-4385-904e-1cef7be26257", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfd9c3c7-6145-4742-8376-986241c11ae8", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 935.229508196721, 420, 2852, 742.0, 1542.4, 2138.8999999999996, 2852.0, 0.27050158088218995, 85.94704879587995, 0.9822484723312358], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 149.33333333333334, 79, 412, 85.0, 332.5, 342.25, 412.0, 0.24016758360278062, 0.17848391711105083, 0.11609663465173477], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 535.2037037037038, 389, 732, 485.0, 707.5, 726.25, 732.0, 0.24015049430976745, 70.61221907395301, 0.12077881305618186], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 129.87037037037038, 79, 360, 87.0, 245.5, 268.25, 360.0, 0.24048524578482805, 0.42554615758018405, 0.11695473867269958], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 786.4629629629629, 545, 1205, 784.5, 979.5, 1042.25, 1205.0, 0.23990617003127665, 215.86799350420725, 0.12042165175398067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 92.00000000000001, 82, 121, 86.0, 117.39999999999999, 121.0, 121.0, 0.07740398928252455, 0.057826222462042276, 0.027514699315272406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, 7.386363636363637, 173.94886363636365, 81, 1789, 88.0, 315.60000000000025, 427.95000000000005, 1624.9899999999977, 0.7216575161040335, 1.5308794329658073, 0.3484036466768901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 88.50000000000001, 84, 93, 88.0, 93.0, 93.0, 93.0, 0.06341314935064934, 0.0491080346045556, 0.022541392933238636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e346513-2c99-47fd-a860-7429180744be", 3, 0, 0.0, 417.6666666666667, 218, 591, 444.0, 591.0, 591.0, 591.0, 0.019230029614245605, 0.0265101482475033, 0.012331757272156199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fdf90cb-d98a-4fcb-9788-160cf7175518", 3, 0, 0.0, 275.6666666666667, 196, 427, 204.0, 427.0, 427.0, 427.0, 0.09244707405010631, 0.040927090074265815, 0.0592840937105174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 95.91304347826085, 80, 266, 87.0, 106.80000000000001, 235.19999999999956, 266.0, 0.11980539436810468, 0.09722488546864745, 0.04258707377928721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90c1e0f0-f406-41a8-83cb-a28c187ac156", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 337.99999999999994, 165, 822, 249.0, 796.6000000000001, 822.0, 822.0, 0.06398362019323053, 7.743911308704972, 0.14226358052338603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0636214c-6ddc-4336-8eef-137ee9daac7a", 1, 0, 0.0, 1188.0, 1188, 1188, 1188.0, 1188.0, 1188.0, 1188.0, 0.8417508417508417, 0.1520741266835017, 0.5803477483164984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 360.46666666666664, 163, 920, 317.0, 852.2, 920.0, 920.0, 0.08414911222686601, 20.238650388488402, 0.18494725779080531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c10d6170-0274-49e3-af95-148a841af960", 3, 0, 0.0, 318.0, 226, 417, 311.0, 417.0, 417.0, 417.0, 0.036308183864643094, 0.030268638957471013, 0.023283568428823856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5fc6572-3d35-43ac-b2d4-0b30c1f47e60", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/395ee945-2c13-40f9-a374-273e07030a35", 3, 0, 0.0, 470.66666666666663, 226, 934, 252.0, 934.0, 934.0, 934.0, 0.02446562986764094, 0.024537306517643798, 0.015689222278402557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54f71516-15a4-4171-bb52-f97e6694ffef", 3, 0, 0.0, 495.3333333333333, 196, 706, 584.0, 706.0, 706.0, 706.0, 0.05513185702471745, 0.03544447188275292, 0.035354739042543416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 89.66666666666666, 81, 118, 85.0, 112.90000000000002, 118.0, 118.0, 0.054368017107802716, 0.045076607934105964, 0.01932613108128925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 99.22222222222223, 82, 293, 85.5, 129.20000000000027, 293.0, 293.0, 0.07957665221024152, 0.061780701667130865, 0.02828701309035929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7124ebb4-35d3-4ef7-96d4-adc2614ba2d3", 3, 0, 0.0, 357.6666666666667, 183, 556, 334.0, 556.0, 556.0, 556.0, 0.01972503303943034, 0.02331432127805064, 0.012649191109270107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad1efb98-3db8-4677-8ad0-b96e0e9591c6", 3, 0, 0.0, 458.6666666666667, 214, 751, 411.0, 751.0, 751.0, 751.0, 0.08339356201701228, 0.03767912242174905, 0.053478293350753325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e54460e-d184-4427-b417-f376396132a7", 3, 0, 0.0, 289.6666666666667, 182, 440, 247.0, 440.0, 440.0, 440.0, 0.04155757802435274, 0.026717518423859592, 0.02664987913671058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1ca6b0b-9fbb-4a65-a924-e548c196de82", 1, 0, 0.0, 1137.0, 1137, 1137, 1137.0, 1137.0, 1137.0, 1137.0, 0.8795074758135445, 0.15889539357959542, 0.6063791776605101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae1a57d-827d-4379-b688-da1f74ec42b7", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 82.15384615384616, 80, 84, 82.0, 83.6, 84.0, 84.0, 0.07839211737109018, 0.058258204413476206, 0.039349168289785505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e1aa1d2-2564-46d6-8e16-e1a0fd7f9005", 3, 0, 0.0, 833.6666666666666, 285, 1516, 700.0, 1516.0, 1516.0, 1516.0, 0.020468873666111734, 0.028217994783848694, 0.013126198281979204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 167.84615384615384, 81, 245, 235.0, 244.2, 245.0, 245.0, 0.07832033015031478, 0.03000553513871735, 0.04416108759827695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 149.53846153846155, 79, 956, 81.0, 609.9999999999997, 956.0, 956.0, 0.07839353554845323, 5.445553475321112, 0.04556859811252487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 212.23076923076923, 81, 657, 239.0, 492.1999999999998, 657.0, 657.0, 0.07839353554845323, 1.7926043425495988, 0.04564515429958391], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5331302361005331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.2284843869002285], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.5714285714285716, 0.07616146230007616], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.2947448591012947], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 28, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
