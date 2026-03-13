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

    var data = {"OkPercent": 99.25428784489188, "KoPercent": 0.7457121551081283};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8383968972204267, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55f9a97f-ef7e-4c41-9e07-9c154d937d5e"], "isController": false}, {"data": [0.4396551724137931, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/466668a2-75b6-401f-9213-685da2d0e8db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e90db25-5540-4f90-b6ad-99f69bc02983"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cec10403-b47f-47de-bda5-d291ab9305aa"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10bd4afb-5153-4043-8b48-990fea84b8f7"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28693dfa-78aa-41a0-9f57-3b8e66975819"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d8cb304-ebb1-43e9-ba1f-55dbfad751b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e3559ac-3b5c-40a3-9e5b-7b05b89201d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bd1acbe-e2d2-45f2-88c5-d570fbc947c5"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.075, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae2f805e-356c-4ce6-a45b-e9c3c5d1c6ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0aca63f9-6fcc-40c2-acd3-767c8c40490b"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57fac50d-7ced-493f-bb8d-0212ff7c4b07"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cec10403-b47f-47de-bda5-d291ab9305aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/55b1ea8f-1130-483d-baec-41a005987f12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=466668a2-75b6-401f-9213-685da2d0e8db"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd9bda7f-6ade-443b-91dd-7d8a49a1dbcb"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55b1ea8f-1130-483d-baec-41a005987f12"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d8cb304-ebb1-43e9-ba1f-55dbfad751b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10bd4afb-5153-4043-8b48-990fea84b8f7"], "isController": false}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/628cb923-c40d-4173-be53-bd4235dc2a85"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bd1acbe-e2d2-45f2-88c5-d570fbc947c5"], "isController": false}, {"data": [0.42063492063492064, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e3559ac-3b5c-40a3-9e5b-7b05b89201d9"], "isController": false}, {"data": [0.8362068965517241, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9538043478260869, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0aca63f9-6fcc-40c2-acd3-767c8c40490b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/316758ba-6295-4f30-9c84-6652d7882f4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd9bda7f-6ade-443b-91dd-7d8a49a1dbcb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55f9a97f-ef7e-4c41-9e07-9c154d937d5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57fac50d-7ced-493f-bb8d-0212ff7c4b07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 10, 0.7457121551081283, 278.7293064876953, 83, 2484, 99.0, 702.5999999999999, 863.0, 1303.4799999999996, 5.273506626292815, 718.5439806053129, 3.866356448346376], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/55f9a97f-ef7e-4c41-9e07-9c154d937d5e", 3, 0, 0.0, 357.0, 182, 619, 270.0, 619.0, 619.0, 619.0, 0.02275002275002275, 0.026889756707465042, 0.014589044536961204], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1268.0172413793102, 1015, 1658, 1280.5, 1515.6, 1576.4, 1658.0, 0.2756588484113971, 331.70951186402414, 1.3554124040540863], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/466668a2-75b6-401f-9213-685da2d0e8db", 3, 0, 0.0, 260.3333333333333, 172, 353, 256.0, 353.0, 353.0, 353.0, 0.02611875326484416, 0.026195273049799756, 0.016749330706947587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e90db25-5540-4f90-b6ad-99f69bc02983", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cec10403-b47f-47de-bda5-d291ab9305aa", 3, 0, 0.0, 405.33333333333337, 166, 719, 331.0, 719.0, 719.0, 719.0, 0.022997316979685704, 0.02718205011498659, 0.014747628401686471], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 608.8181818181818, 356, 1033, 524.0, 992.6000000000001, 1033.0, 1033.0, 0.08451526653041781, 0.015268871394655562, 0.05744397021989336], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 608.8181818181818, 356, 1033, 524.0, 992.6000000000001, 1033.0, 1033.0, 0.08422600133230221, 0.015216611568824128, 0.05724736028054915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 123.57142857142857, 85, 259, 88.0, 257.0, 259.0, 259.0, 0.0734746145206831, 0.027542730080507186, 0.041462725409620975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 114.5, 85, 276, 90.0, 266.5, 276.0, 276.0, 0.07347345771340102, 0.054602833320213075, 0.036880231703797006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 182.28571428571428, 84, 647, 88.0, 496.5, 647.0, 647.0, 0.0734761569870577, 1.5615630969937755, 0.04281667239605748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10bd4afb-5153-4043-8b48-990fea84b8f7", 3, 0, 0.0, 495.6666666666667, 208, 832, 447.0, 832.0, 832.0, 832.0, 0.01687526367599494, 0.023263913303332863, 0.010821702292223316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 160.35714285714286, 83, 612, 87.5, 435.5, 612.0, 612.0, 0.07347654261377055, 4.740841222767756, 0.04274514267570078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28693dfa-78aa-41a0-9f57-3b8e66975819", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 1.9121912425149699, 3.5729322604790417], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 346.2727272727273, 166, 1766, 182.0, 1481.600000000001, 1766.0, 1766.0, 0.08537721204594846, 0.24470909897935422, 0.05519503356876746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d8cb304-ebb1-43e9-ba1f-55dbfad751b9", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 99.46666666666665, 86, 264, 87.0, 159.60000000000008, 264.0, 264.0, 0.09799118079372857, 0.0728235240078393, 0.04918697942185204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 110.13333333333334, 84, 265, 87.0, 262.0, 265.0, 265.0, 0.09799438165545175, 0.026221152903900178, 0.05588742078787483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 623.5, 589, 675, 615.0, 675.0, 675.0, 675.0, 0.0663371919466649, 19.505337034395833, 0.037832929782082324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 701.25, 583, 872, 675.0, 872.0, 872.0, 872.0, 0.06615069127472382, 59.522508289508494, 0.03766196583316796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 87.0, 85, 92, 85.5, 92.0, 92.0, 92.0, 0.06689634411479413, 0.1183751714218818, 0.037041237415125265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 99.99999999999999, 83, 263, 89.0, 161.00000000000006, 263.0, 263.0, 0.12626368908829197, 0.09383463612909199, 0.06337845331189657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 111.33333333333333, 83, 262, 88.0, 260.2, 262.0, 262.0, 0.12627112936898108, 0.04643094652838575, 0.07130701667620715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 154.13333333333333, 84, 584, 88.0, 387.2000000000001, 584.0, 584.0, 0.1262690034850245, 7.606235965726384, 0.07350894721113861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 143.53333333333333, 85, 583, 87.0, 391.0000000000001, 583.0, 583.0, 0.12627006641805494, 2.506937619430438, 0.0736328766215181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 129.25, 85, 255, 88.5, 255.0, 255.0, 255.0, 0.0668952253532904, 0.0497141274354043, 0.03756323689271678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 439.6, 84, 845, 421.5, 790.2, 842.3, 845.0, 0.09895797254905842, 44.53461495762125, 0.05392436394763144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 134.86666666666662, 85, 265, 89.0, 265.0, 265.0, 265.0, 0.09799438165545175, 0.026412548180570983, 0.05760997827791207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 321.6500000000001, 84, 685, 336.5, 610.3000000000001, 681.3, 685.0, 0.09895846218549763, 14.561873005368497, 0.054021269884466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 99.73333333333335, 84, 266, 88.0, 161.00000000000006, 266.0, 266.0, 0.09799246111332502, 0.026412030534450882, 0.05770454497200682], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 457.0, 351, 749, 409.0, 731.4000000000001, 749.0, 749.0, 0.08422793610928192, 0.015216961113493313, 0.058071213762844756], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2e3559ac-3b5c-40a3-9e5b-7b05b89201d9", 3, 0, 0.0, 523.3333333333334, 243, 1014, 313.0, 1014.0, 1014.0, 1014.0, 0.01755402250425685, 0.024199637143726485, 0.01125697406685742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bd1acbe-e2d2-45f2-88c5-d570fbc947c5", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 257.46666666666664, 173, 672, 180.0, 584.4000000000001, 672.0, 672.0, 0.12617022887279516, 10.245400438020978, 0.2816076794561222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 335.1500000000001, 111, 792, 257.5, 715.7000000000002, 788.4499999999999, 792.0, 0.08646928610957387, 0.053114434534103486, 0.03909695260618429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 104.24999999999999, 85, 253, 88.0, 234.10000000000034, 252.85, 253.0, 0.09895699329071585, 0.07354128114671364, 0.049671772022878855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 156.4, 84, 265, 89.5, 263.7, 264.95, 265.0, 0.09895846218549763, 0.10079460552683012, 0.05228176566636155], "isController": false}, {"data": ["login", 20, 0, 0.0, 1952.75, 1282, 3108, 1853.5, 2903.9000000000005, 3098.85, 3108.0, 0.08507597284374947, 20.474114438881422, 0.15657634611458032], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 94.8, 87, 125, 91.0, 117.80000000000001, 125.0, 125.0, 0.09786140215817012, 0.07922568592687797, 0.03478667029841204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae2f805e-356c-4ce6-a45b-e9c3c5d1c6ce", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0aca63f9-6fcc-40c2-acd3-767c8c40490b", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 555.0500000000001, 174, 931, 600.0, 882.0, 928.5999999999999, 931.0, 0.0989144143030243, 59.24466287185638, 0.20980674596305549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57fac50d-7ced-493f-bb8d-0212ff7c4b07", 3, 0, 0.0, 454.3333333333333, 179, 812, 372.0, 812.0, 812.0, 812.0, 0.04817574511819116, 0.030972362177222507, 0.03089395113373587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cec10403-b47f-47de-bda5-d291ab9305aa", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55b1ea8f-1130-483d-baec-41a005987f12", 3, 0, 0.0, 826.6666666666666, 180, 1766, 534.0, 1766.0, 1766.0, 1766.0, 0.02406777485398883, 0.02413828591313138, 0.015434087390090495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=466668a2-75b6-401f-9213-685da2d0e8db", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 334.5, 174, 924, 340.0, 720.5, 924.0, 924.0, 0.07343954089795575, 6.38134592220392, 0.16382509193056816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 859.75, 700, 1127, 806.0, 1127.0, 1127.0, 1127.0, 0.06605674274201538, 79.02682935891931, 0.14895021385870463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd9bda7f-6ade-443b-91dd-7d8a49a1dbcb", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 963.8571428571429, 144, 1571, 1037.0, 1477.0, 1563.3999999999999, 1571.0, 0.08255755440935966, 0.02607565613599195, 0.03724764661828532], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 108.1875, 86, 260, 95.5, 177.4000000000001, 260.0, 260.0, 0.0783334557293579, 0.060815524711757364, 0.027845095591295194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 259.6, 174, 525, 179.0, 423.6000000000001, 525.0, 525.0, 0.09793424042203128, 0.15177894487281607, 0.22025640204290828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55b1ea8f-1130-483d-baec-41a005987f12", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 292.88235294117646, 178, 524, 346.0, 419.19999999999993, 524.0, 524.0, 0.08755890911900287, 0.13569920778501712, 0.1969220387705699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 89.06666666666668, 85, 96, 88.0, 95.4, 96.0, 96.0, 0.07128532187699005, 0.05297668940272405, 0.03578189008278602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 110.6, 85, 264, 88.0, 259.2, 264.0, 264.0, 0.07128430557205655, 0.02621183319472496, 0.040255212664844955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 131.79999999999998, 84, 767, 86.0, 360.2000000000002, 767.0, 767.0, 0.07128532187699005, 4.294109909194381, 0.0414995669416696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d8cb304-ebb1-43e9-ba1f-55dbfad751b9", 3, 0, 0.0, 527.0, 344, 871, 366.0, 871.0, 871.0, 871.0, 0.018767359807822234, 0.02587232056840077, 0.012035058210094337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 121.26666666666668, 84, 424, 88.0, 322.00000000000006, 424.0, 424.0, 0.07128430557205655, 1.415262638113342, 0.04156858886776761], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 821.3793103448277, 667, 1278, 703.0, 1141.6, 1208.15, 1278.0, 0.26044824040270687, 311.5866419802149, 0.5142835372014387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 963.8571428571429, 144, 1571, 1037.0, 1477.0, 1563.3999999999999, 1571.0, 0.08258287781666601, 0.026083654488969286, 0.03725907182744111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 124.55555555555556, 87, 256, 87.0, 256.0, 256.0, 256.0, 0.04777678685182826, 0.012877337081156836, 0.028134182101223086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 143.22222222222223, 83, 263, 86.0, 263.0, 263.0, 263.0, 0.047777040477770406, 0.012877405441274055, 0.02808767418712674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 165.0625, 86, 818, 89.0, 429.5000000000004, 818.0, 818.0, 0.07834074306194795, 4.425491718220588, 0.04563501292622261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 174.06250000000003, 84, 632, 89.0, 373.7000000000003, 632.0, 632.0, 0.07840485326041682, 1.460663657267885, 0.04574892560849517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 122.0, 87, 265, 90.0, 262.2, 265.0, 265.0, 0.07840254808281269, 0.05826595614357467, 0.03935440401813059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 105.88888888888889, 85, 259, 87.0, 259.0, 259.0, 259.0, 0.04777678685182826, 0.012784023044336857, 0.027247698751433302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 130.75, 84, 263, 89.5, 260.2, 263.0, 263.0, 0.07833767454613111, 0.028315167765026145, 0.0442657587248585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 129.0, 86, 279, 89.0, 279.0, 279.0, 279.0, 0.04777678685182826, 0.03550599101000127, 0.023981707462734106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 98.55555555555556, 87, 148, 92.0, 148.0, 148.0, 148.0, 0.05008152158791811, 0.03941963515611523, 0.017802415876955267], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 596.5454545454545, 353, 1357, 447.0, 1288.4000000000003, 1357.0, 1357.0, 0.08476012883539583, 0.015313109213426006, 0.057693173631123924], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10bd4afb-5153-4043-8b48-990fea84b8f7", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1165.7999999999997, 765, 2484, 1088.0, 1745.5000000000005, 2448.2499999999995, 2484.0, 0.08540366040088479, 0.044203066418426695, 0.03928234770392259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 274.55555555555554, 174, 538, 177.0, 538.0, 538.0, 538.0, 0.047754478308854736, 0.07401011433218015, 0.10740094096219968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/628cb923-c40d-4173-be53-bd4235dc2a85", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bd1acbe-e2d2-45f2-88c5-d570fbc947c5", 3, 0, 0.0, 580.0, 181, 1357, 202.0, 1357.0, 1357.0, 1357.0, 0.01876172607879925, 0.025864554018136334, 0.012031445434646654], "isController": false}, {"data": ["addBook", 63, 5, 7.936507936507937, 904.6666666666666, 457, 3070, 728.0, 1470.8000000000002, 2075.7999999999993, 3070.0, 0.29792727737029523, 80.29706774387475, 1.087440104203612], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 164.99999999999997, 87, 373, 91.0, 352.0, 361.29999999999995, 373.0, 0.2611259932917633, 0.19405945399905453, 0.12622789714787386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e3559ac-3b5c-40a3-9e5b-7b05b89201d9", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 489.89655172413785, 413, 713, 440.0, 619.3, 638.7999999999997, 713.0, 0.261087203125844, 76.76830663003943, 0.13130850547832976], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 116.32758620689654, 84, 277, 90.0, 258.1, 266.34999999999997, 277.0, 0.2615039180500825, 0.46273935498706004, 0.1271767101454503], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 652.810344827586, 577, 878, 604.5, 787.0, 854.5999999999999, 878.0, 0.26093098375479684, 234.7861578503111, 0.13097512270504452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 92.82352941176471, 88, 108, 92.0, 100.0, 108.0, 108.0, 0.08332802321420693, 0.06225189234264483, 0.029620508251925123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 5, 2.717391304347826, 170.26630434782612, 85, 1965, 94.0, 255.0, 376.25, 1664.100000000002, 0.758356345052137, 1.545096314346948, 0.3670108872047974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 93.66666666666667, 88, 106, 91.0, 103.6, 106.0, 106.0, 0.07470268332038488, 0.05785080846979024, 0.026554469461543058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 91.28571428571429, 87, 96, 91.0, 95.0, 96.0, 96.0, 0.07439883087551481, 0.06037639497807891, 0.026446459412780655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 235.06666666666666, 175, 854, 179.0, 547.4000000000002, 854.0, 854.0, 0.07125450684755812, 5.786079348425038, 0.15903764702179912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 342.18749999999994, 180, 906, 342.0, 639.3000000000003, 906.0, 906.0, 0.07830278708982798, 5.968604138118775, 0.17485264700124795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0aca63f9-6fcc-40c2-acd3-767c8c40490b", 3, 0, 0.0, 255.0, 170, 404, 191.0, 404.0, 404.0, 404.0, 0.030797659377887282, 0.025033123524278823, 0.019749801098449853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/316758ba-6295-4f30-9c84-6652d7882f4c", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.8146324936224489, 1.5221420599489794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 91.93333333333334, 87, 109, 91.0, 100.60000000000001, 109.0, 109.0, 0.1255808112520407, 0.10411924682908452, 0.04464005399974884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd9bda7f-6ade-443b-91dd-7d8a49a1dbcb", 3, 0, 0.0, 239.0, 163, 377, 177.0, 377.0, 377.0, 377.0, 0.027554028858252894, 0.027634753552173555, 0.017669738558189516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 94.95, 87, 138, 91.0, 109.30000000000001, 136.59999999999997, 138.0, 0.09629690261012755, 0.07476175544438612, 0.03423053959969378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55f9a97f-ef7e-4c41-9e07-9c154d937d5e", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 99.47058823529412, 85, 265, 89.0, 126.59999999999988, 265.0, 265.0, 0.08759951562620771, 0.06510081190580476, 0.0439708506170613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 136.23529411764707, 85, 263, 87.0, 256.6, 263.0, 263.0, 0.08760086982510744, 0.023440076496171327, 0.04995987107213158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 138.70588235294122, 83, 264, 90.0, 260.8, 264.0, 264.0, 0.08760041842082211, 0.02361105027748721, 0.051499464735678624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57fac50d-7ced-493f-bb8d-0212ff7c4b07", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 180.70588235294116, 86, 305, 252.0, 271.4, 305.0, 305.0, 0.08760041842082211, 0.02361105027748721, 0.051585012019292706], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 50.0, 0.37285607755406414], "isController": false}, {"data": ["401/Unauthorized", 5, 50.0, 0.37285607755406414], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 10, "406/Not Acceptable", 5, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
