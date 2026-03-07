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

    var data = {"OkPercent": 98.34212509419744, "KoPercent": 1.6578749058025621};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7673139158576052, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b74239a8-1490-4096-8b57-317091c7e76e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea76ba09-81f8-4615-914f-b65b2ff34881"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/318ae459-5dfd-4234-8206-ce87911dc525"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de209e68-6939-4453-a4e7-7acb92cd4035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7edfb683-cd25-43b6-8d09-a2d6af14938e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c862761-c685-49fd-941d-0a5babb158b7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67919f5d-bd9f-4205-82f7-987bf92ae5c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f454bd25-7235-4632-a865-77be78b618b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae3b67f0-1cf3-4e74-ad60-d97ae23624b9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=395a88f4-9ffb-4e32-8466-4a909b026fd2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/395a88f4-9ffb-4e32-8466-4a909b026fd2"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1f0965f-f285-4582-8580-4b227ae7957e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e9a6f02-96bc-4835-8a4a-ff68ac57f771"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dd5002e-25c1-4804-920b-d1be77667b4d"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a48dbed1-e2f6-4a91-98d0-a642367a8354"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c862761-c685-49fd-941d-0a5babb158b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b74239a8-1490-4096-8b57-317091c7e76e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae3b67f0-1cf3-4e74-ad60-d97ae23624b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=318ae459-5dfd-4234-8206-ce87911dc525"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f454bd25-7235-4632-a865-77be78b618b4"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67919f5d-bd9f-4205-82f7-987bf92ae5c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1796fa9a-c204-48d9-9972-52c177722c2c"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7edfb683-cd25-43b6-8d09-a2d6af14938e"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9472222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/0e9a6f02-96bc-4835-8a4a-ff68ac57f771"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9936706-19ce-46a7-b36f-0c5e40380f79"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1f0965f-f285-4582-8580-4b227ae7957e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de209e68-6939-4453-a4e7-7acb92cd4035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dd5002e-25c1-4804-920b-d1be77667b4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 22, 1.6578749058025621, 431.06857573474036, 136, 2323, 162.0, 1141.4, 1300.9999999999995, 1738.6000000000001, 5.2774540956941225, 726.5713705323587, 3.8587126462037724], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2152.388888888889, 1677, 2946, 2098.5, 2536.0, 2605.25, 2946.0, 0.24148216385906385, 290.5846595171363, 1.1873659131156118], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b74239a8-1490-4096-8b57-317091c7e76e", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.5474668560606061, 2.089251893939394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea76ba09-81f8-4615-914f-b65b2ff34881", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 496.7857142857143, 152, 730, 540.0, 713.5, 730.0, 730.0, 0.07351744201311762, 0.014481951467985778, 0.04946632572952933], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 496.7857142857143, 152, 730, 540.0, 713.5, 730.0, 730.0, 0.0718018678743057, 0.014144006339079192, 0.048311998989645145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 210.11111111111111, 139, 446, 147.5, 433.40000000000003, 446.0, 446.0, 0.10650383413802897, 0.02849809624396478, 0.06074046790684464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/318ae459-5dfd-4234-8206-ce87911dc525", 3, 0, 0.0, 504.3333333333333, 228, 891, 394.0, 891.0, 891.0, 891.0, 0.025178769261758487, 0.025252535187330043, 0.016146541486218823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 196.22222222222223, 144, 444, 149.0, 435.0, 444.0, 444.0, 0.10649816290668986, 0.07914560739452245, 0.05345708567777206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 225.44444444444443, 138, 442, 148.5, 437.5, 442.0, 442.0, 0.10650068337938502, 0.028705262317099866, 0.06271475788844645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de209e68-6939-4453-a4e7-7acb92cd4035", 3, 0, 0.0, 342.0, 248, 461, 317.0, 461.0, 461.0, 461.0, 0.016402943781644013, 0.022612782198978644, 0.010518814859973536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 242.33333333333331, 142, 450, 148.5, 441.0, 450.0, 450.0, 0.10650068337938502, 0.028705262317099866, 0.06261075331483376], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 312.35714285714283, 147, 981, 232.5, 783.5, 981.0, 981.0, 0.0742796203250264, 0.1546783974304557, 0.04801025125081575], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7edfb683-cd25-43b6-8d09-a2d6af14938e", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c862761-c685-49fd-941d-0a5babb158b7", 3, 0, 0.0, 542.3333333333334, 227, 983, 417.0, 983.0, 983.0, 983.0, 0.052611272842060956, 0.03382397912209323, 0.03373834879520185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67919f5d-bd9f-4205-82f7-987bf92ae5c4", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f454bd25-7235-4632-a865-77be78b618b4", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 176.24999999999994, 142, 442, 147.0, 399.8000000000005, 441.2, 442.0, 0.08830645873439183, 0.06562618661803923, 0.04432570291941152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 175.75, 142, 441, 146.5, 410.4000000000006, 440.9, 441.0, 0.08819430970313795, 0.036845239932619546, 0.04955762285467342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae3b67f0-1cf3-4e74-ad60-d97ae23624b9", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 949.5714285714286, 735, 1260, 969.0, 1260.0, 1260.0, 1260.0, 0.05178127589063794, 15.225414412023612, 0.029531508906379452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1219.5714285714287, 1015, 1347, 1298.0, 1347.0, 1347.0, 1347.0, 0.051611000516110006, 46.439668986857626, 0.029383997364152474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 310.14285714285717, 142, 445, 409.0, 445.0, 445.0, 445.0, 0.05194072820900949, 0.09191074171359882, 0.02876014931104334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 173.85714285714283, 142, 459, 151.0, 325.0, 459.0, 459.0, 0.08010023972857462, 0.05952761956391141, 0.04020656564500718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 193.28571428571428, 141, 460, 149.5, 443.5, 460.0, 460.0, 0.08010528122675516, 0.021434420953252844, 0.045685043199633804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 224.71428571428572, 141, 571, 151.0, 508.5, 571.0, 571.0, 0.08010436454351956, 0.021590629505870505, 0.047092604936717554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 173.0, 142, 450, 149.0, 324.5, 450.0, 450.0, 0.08010436454351956, 0.021590629505870505, 0.04717083185521709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 188.00000000000003, 145, 426, 149.0, 426.0, 426.0, 426.0, 0.051944582551072656, 0.038603346993521775, 0.02916810055358084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=395a88f4-9ffb-4e32-8466-4a909b026fd2", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 302.90000000000003, 138, 1322, 147.5, 1183.7000000000016, 1319.2, 1322.0, 0.08819508753362439, 7.957203678286369, 0.051091138598580055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 943.0, 139, 1343, 1276.5, 1330.5, 1343.0, 1343.0, 0.08648434942148148, 55.59149551902965, 0.045534589106678444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 248.79999999999998, 143, 735, 149.0, 679.8000000000005, 733.55, 735.0, 0.08830801836806781, 2.6179705437566234, 0.051242797377251854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 771.2857142857143, 143, 1264, 1000.0, 1225.0, 1264.0, 1264.0, 0.08648060981184291, 18.16963885851772, 0.04561707389768108], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 488.64285714285717, 149, 1328, 422.5, 1033.0, 1328.0, 1328.0, 0.07182249583173016, 0.014148069770424522, 0.048786792997306656], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 401.4285714285714, 289, 900, 303.0, 811.0, 900.0, 900.0, 0.08003384288213301, 0.12403682485736826, 0.17999798843510972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/395a88f4-9ffb-4e32-8466-4a909b026fd2", 3, 0, 0.0, 395.3333333333333, 230, 636, 320.0, 636.0, 636.0, 636.0, 0.028584768129889186, 0.028668512567769724, 0.018330726958294824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 572.1304347826086, 158, 1241, 502.0, 989.2000000000002, 1199.5999999999995, 1241.0, 0.09914006767387229, 0.06089756110045475, 0.04482602669238561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 146.35714285714283, 139, 152, 145.5, 152.0, 152.0, 152.0, 0.08648434942148148, 0.0642720604587377, 0.04341108945570457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 208.14285714285717, 139, 451, 148.0, 440.0, 451.0, 451.0, 0.08648221246208682, 0.11592091201670342, 0.04413391925032276], "isController": false}, {"data": ["login", 23, 0, 0.0, 2462.434782608696, 1531, 3917, 2362.0, 3715.4000000000005, 3895.7999999999997, 3917.0, 0.09846101157987114, 35.9835407235279, 0.19824726690425737], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 168.65000000000003, 141, 458, 153.0, 164.70000000000002, 443.3499999999998, 458.0, 0.08893355329565515, 0.07199796453329894, 0.03161309902306492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1093.8571428571431, 289, 1488, 1423.0, 1476.0, 1488.0, 1488.0, 0.08640588547517065, 73.87503105211509, 0.17853760739017194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1f0965f-f285-4582-8580-4b227ae7957e", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e9a6f02-96bc-4835-8a4a-ff68ac57f771", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 504.83333333333337, 294, 884, 572.0, 881.3, 884.0, 884.0, 0.10640498921171637, 0.16490695105370498, 0.23930731460408478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 953.8181818181818, 147, 1740, 1177.0, 1691.2000000000003, 1740.0, 1740.0, 0.08084846792153288, 61.5587871719206, 0.1354915242324908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dd5002e-25c1-4804-920b-d1be77667b4d", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 965.0, 160, 1962, 1037.0, 1314.2, 1840.1999999999982, 1962.0, 0.0961872221548447, 0.030156523793791325, 0.04339696937064282], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 512.6999999999999, 291, 1468, 300.5, 1361.900000000001, 1465.35, 1468.0, 0.0881344579290165, 10.666877294250108, 0.19596145880154764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 153.55000000000004, 144, 175, 152.0, 166.10000000000002, 174.6, 175.0, 0.09815035653117009, 0.07620071625222678, 0.03488938454818937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a48dbed1-e2f6-4a91-98d0-a642367a8354", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 461.3333333333334, 289, 886, 313.0, 883.3, 886.0, 886.0, 0.09868962114150995, 0.15294963745271123, 0.2219552709852514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 189.28571428571428, 143, 431, 150.0, 431.0, 431.0, 431.0, 0.040946447895645055, 0.03042992856307215, 0.020553197478868707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 186.0, 143, 423, 148.0, 423.0, 423.0, 423.0, 0.04094908274054661, 0.010957078780185325, 0.02335377375046799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 190.57142857142858, 139, 455, 147.0, 455.0, 455.0, 455.0, 0.040948124575894425, 0.011036799202096544, 0.024073018549500433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 145.85714285714286, 142, 150, 144.0, 150.0, 150.0, 150.0, 0.040949322288716124, 0.011037122023130517, 0.024113712246187323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 149.5, 149, 150, 149.5, 150.0, 150.0, 150.0, 0.04261575504464, 0.012568318382305939, 0.026343528264899534], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1398.5185185185185, 1097, 2323, 1196.5, 1913.5, 1983.25, 2323.0, 0.23471729605674943, 280.80348701882957, 0.46347497326830794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 965.0, 160, 1962, 1037.0, 1314.2, 1840.1999999999982, 1962.0, 0.09890346162115675, 0.03100811653407869, 0.04462246022360782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 193.83333333333331, 142, 424, 150.0, 424.0, 424.0, 424.0, 0.03166260329924326, 0.00853406104549916, 0.0186450681537536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c862761-c685-49fd-941d-0a5babb158b7", 1, 0, 0.0, 1328.0, 1328, 1328, 1328.0, 1328.0, 1328.0, 1328.0, 0.7530120481927711, 0.1360422157379518, 0.5191665097891566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 145.66666666666669, 143, 150, 144.5, 150.0, 150.0, 150.0, 0.03166343875499359, 0.008534286226931866, 0.018614638799322403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 347.50000000000006, 142, 1274, 149.5, 1025.8000000000002, 1261.7499999999998, 1274.0, 0.0929666110416444, 12.56902680082136, 0.05345580134894553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 320.0499999999999, 143, 1027, 151.0, 965.1000000000006, 1025.35, 1027.0, 0.09297179700537841, 4.12181927502917, 0.053549576048605656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 209.74999999999997, 141, 463, 151.5, 455.6, 462.7, 463.0, 0.09309426725502243, 0.06918431384870319, 0.04672895836824368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 145.16666666666669, 136, 150, 146.0, 150.0, 150.0, 150.0, 0.03166360585143436, 0.008472488284465835, 0.01805815021214616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 204.59999999999997, 138, 454, 148.5, 440.90000000000003, 453.4, 454.0, 0.09309903409752124, 0.045885822762713836, 0.05192271325497498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b74239a8-1490-4096-8b57-317091c7e76e", 3, 0, 0.0, 310.0, 227, 448, 255.0, 448.0, 448.0, 448.0, 0.0832523935063133, 0.03766954003052588, 0.053387765367004306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 149.16666666666669, 138, 156, 150.0, 156.0, 156.0, 156.0, 0.0316621020469549, 0.023530136384504567, 0.015892891066537906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae3b67f0-1cf3-4e74-ad60-d97ae23624b9", 3, 0, 0.0, 523.3333333333334, 232, 936, 402.0, 936.0, 936.0, 936.0, 0.10462439840970915, 0.0473398156866848, 0.06709312007393457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 203.33333333333331, 143, 462, 154.0, 462.0, 462.0, 462.0, 0.03076812627239022, 0.024217880640182148, 0.010937107385888711], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 406.9230769230769, 147, 636, 431.0, 577.5999999999999, 636.0, 636.0, 0.07578230658023596, 0.014704454469407265, 0.05157090709963624], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1159.3478260869567, 717, 1552, 1162.0, 1502.0, 1547.6, 1552.0, 0.09900436049639925, 0.0512424912725504, 0.04553813847051177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=318ae459-5dfd-4234-8206-ce87911dc525", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 344.83333333333337, 289, 573, 304.0, 573.0, 573.0, 573.0, 0.03163705965167597, 0.04903126334688454, 0.07115248865020485], "isController": false}, {"data": ["addBook", 63, 7, 11.11111111111111, 1307.9047619047615, 746, 2257, 1156.0, 2041.4, 2206.3999999999996, 2257.0, 0.30182532458199585, 87.11474602357113, 1.0996094685718392], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f454bd25-7235-4632-a865-77be78b618b4", 3, 0, 0.0, 533.6666666666666, 284, 864, 453.0, 864.0, 864.0, 864.0, 0.029217553906386955, 0.029303152208847077, 0.018736517316270282], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 277.8888888888888, 138, 800, 153.0, 589.5, 598.25, 800.0, 0.23569464449391123, 0.1751597895115883, 0.11393442287547466], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 839.3888888888889, 704, 1184, 745.0, 1038.0, 1055.75, 1184.0, 0.23578623794324538, 69.32898279524585, 0.11858389896559705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67919f5d-bd9f-4205-82f7-987bf92ae5c4", 3, 0, 0.0, 319.3333333333333, 250, 421, 287.0, 421.0, 421.0, 421.0, 0.020879151471284205, 0.028783595859664262, 0.013389299608863895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1796fa9a-c204-48d9-9972-52c177722c2c", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 231.62962962962956, 137, 600, 151.0, 450.5, 512.0, 600.0, 0.23640351453224936, 0.4183234065746444, 0.11496967796587909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7edfb683-cd25-43b6-8d09-a2d6af14938e", 3, 0, 0.0, 433.0, 223, 586, 490.0, 586.0, 586.0, 586.0, 0.017543962245393247, 0.024185768264726695, 0.011250522663875228], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1114.0, 946, 1502, 1035.5, 1343.0, 1386.25, 1502.0, 0.23557434333651794, 211.97020822972425, 0.1182472778075881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 152.94444444444446, 147, 157, 153.0, 157.0, 157.0, 157.0, 0.09840044608202224, 0.07351205200463576, 0.034978283568218846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 7, 3.888888888888889, 213.01666666666662, 139, 1243, 156.5, 339.30000000000007, 429.94999999999976, 1180.6299999999999, 0.7431475602052738, 1.5079702575832017, 0.36134501838258065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 280.7142857142857, 150, 449, 173.0, 449.0, 449.0, 449.0, 0.041732992315167555, 0.032318616119070186, 0.014834774612032217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 151.27777777777777, 144, 165, 151.0, 160.5, 165.0, 165.0, 0.107005915049193, 0.08683780801355408, 0.03803725886514282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e9a6f02-96bc-4835-8a4a-ff68ac57f771", 2, 0, 0.0, 604.0, 227, 981, 604.0, 981.0, 981.0, 981.0, 0.02107326119253585, 0.03003557100635359, 0.013098760497118231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9936706-19ce-46a7-b36f-0c5e40380f79", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 383.1428571428571, 295, 887, 300.0, 887.0, 887.0, 887.0, 0.040911269301352415, 0.06340447693481081, 0.09201040351661582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 590.1999999999999, 291, 1473, 313.0, 1388.8000000000006, 1470.1499999999999, 1473.0, 0.09290140374021051, 16.793738670383497, 0.20537198012374466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1f0965f-f285-4582-8580-4b227ae7957e", 3, 0, 0.0, 411.0, 321, 469, 443.0, 469.0, 469.0, 469.0, 0.026031272235045037, 0.026107535727921145, 0.016693231218437084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de209e68-6939-4453-a4e7-7acb92cd4035", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dd5002e-25c1-4804-920b-d1be77667b4d", 3, 0, 0.0, 295.6666666666667, 223, 431, 233.0, 431.0, 431.0, 431.0, 0.034891023702635436, 0.029087210840641066, 0.022374777569723895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 173.7142857142857, 146, 450, 153.5, 304.0, 450.0, 450.0, 0.07876496534341525, 0.06530415583648393, 0.02799848377441714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 149.5, 143, 154, 150.0, 153.5, 154.0, 154.0, 0.08448749283365016, 0.06559331719018738, 0.030032663468211578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 180.55555555555554, 139, 447, 149.5, 443.4, 447.0, 447.0, 0.09892338383921653, 0.073516303810199, 0.04965490165366923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 243.94444444444446, 139, 449, 151.0, 444.5, 449.0, 449.0, 0.09892718958846289, 0.026470751901600423, 0.05641941281217024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 243.44444444444446, 141, 448, 152.0, 442.6, 448.0, 448.0, 0.09877301960095701, 0.026622415439320445, 0.058067732226343864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 195.44444444444443, 137, 444, 148.5, 440.4, 444.0, 444.0, 0.09892501483875223, 0.026663382905757437, 0.058253695261491795], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.5275056518462697], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15071590052750566], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15071590052750566], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8289374529012811], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 22, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
