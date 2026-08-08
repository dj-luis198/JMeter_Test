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

    var data = {"OkPercent": 99.528672427337, "KoPercent": 0.4713275726630008};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7302231237322515, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=681cd1c3-21ca-4f43-9343-84c5207dab7b"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f2f30a1-f206-4456-a595-6d6f6ac036b5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9bfd531d-e997-49d4-bb74-12320bc404f5"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7ca69a8-65ff-4549-afd2-0e89fd4a4006"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b389a279-2664-4ca6-b61e-9d368aa101c6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3c9f0c89-d23f-4759-a005-69542419b43c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ce39266-496a-4165-bd29-142f9b19bfdb"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37b39636-c059-4751-9ad5-2e6fa0ab4e53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87abb7a1-c99a-4787-9823-834c2554d208"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bfd531d-e997-49d4-bb74-12320bc404f5"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4759f4c4-568a-493a-b63d-c37ab06ac523"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d62bde3-8f95-4d5f-badc-c956b582bd56"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5c0cf8e-e25a-45e7-b858-da653a09d53f"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a986c3fa-b343-4454-aac2-67562e2c0c88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b7ca69a8-65ff-4549-afd2-0e89fd4a4006"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b389a279-2664-4ca6-b61e-9d368aa101c6"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8ce39266-496a-4165-bd29-142f9b19bfdb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac3f71c6-f4b2-4348-a7a2-80feb9d03fa6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/681cd1c3-21ca-4f43-9343-84c5207dab7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c9f0c89-d23f-4759-a005-69542419b43c"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f2f30a1-f206-4456-a595-6d6f6ac036b5"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c4e04265-160f-44f4-a8e8-2239df50391b"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/20a0d504-2a9a-4093-b42d-0f4ebe664271"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1eb73712-eb7f-422a-a44a-6b71b9171bf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20a0d504-2a9a-4093-b42d-0f4ebe664271"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/37b39636-c059-4751-9ad5-2e6fa0ab4e53"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5c0cf8e-e25a-45e7-b858-da653a09d53f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4759f4c4-568a-493a-b63d-c37ab06ac523"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87abb7a1-c99a-4787-9823-834c2554d208"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d62bde3-8f95-4d5f-badc-c956b582bd56"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 6, 0.4713275726630008, 506.69756480754097, 132, 4773, 166.0, 1359.6000000000001, 1651.4999999999998, 2853.0599999999995, 4.977847989895712, 714.2879220282971, 3.631881658555994], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=681cd1c3-21ca-4f43-9343-84c5207dab7b", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2254.2857142857147, 1721, 2836, 2264.0, 2642.0, 2729.5, 2836.0, 0.24777116563059973, 298.15243180762343, 1.2182888856934275], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6f2f30a1-f206-4456-a595-6d6f6ac036b5", 3, 0, 0.0, 403.6666666666667, 247, 611, 353.0, 611.0, 611.0, 611.0, 0.01708068345508065, 0.023547101052170102, 0.010953433075035442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bfd531d-e997-49d4-bb74-12320bc404f5", 3, 0, 0.0, 576.3333333333334, 258, 876, 595.0, 876.0, 876.0, 876.0, 0.08515469770082316, 0.03853028313936986, 0.05460766747090548], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 927.3076923076922, 506, 1754, 931.0, 1642.0, 1754.0, 1754.0, 0.06127768690872924, 0.011070675857534091, 0.04164967782077691], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 927.3076923076922, 506, 1754, 931.0, 1642.0, 1754.0, 1754.0, 0.06094302296145588, 0.0110102141092474, 0.04142221091911455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 165.50000000000006, 133, 423, 138.5, 387.7000000000006, 422.6, 423.0, 0.09715198942986356, 0.025995747171662708, 0.055406993971719054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 138.79999999999995, 134, 152, 138.5, 142.0, 151.5, 152.0, 0.0972862014116228, 0.07229960866625482, 0.04883311281794347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 204.8, 135, 413, 139.0, 410.20000000000005, 412.9, 413.0, 0.09728809436945154, 0.026222181685516235, 0.057289766508573516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 212.20000000000002, 135, 549, 140.5, 411.90000000000003, 542.1999999999999, 549.0, 0.09728714788132914, 0.026221926577389493, 0.057194202172422014], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 338.1538461538462, 230, 575, 271.0, 535.4, 575.0, 575.0, 0.06169763413302959, 0.12428513798913171, 0.0398865564414703], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7ca69a8-65ff-4549-afd2-0e89fd4a4006", 1, 0, 0.0, 2180.0, 2180, 2180, 2180.0, 2180.0, 2180.0, 2180.0, 0.45871559633027525, 0.08287342316513761, 0.31626290137614677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 157.8666666666667, 134, 410, 139.0, 257.0000000000001, 410.0, 410.0, 0.10873741364437067, 0.08080973806969344, 0.05458108458320949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 174.13333333333335, 133, 402, 139.0, 400.2, 402.0, 402.0, 0.10853128233327786, 0.06164237676272891, 0.06007376057275575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1009.0, 840, 1103, 1084.0, 1103.0, 1103.0, 1103.0, 0.04956465709518067, 14.573654887488228, 0.028267343499595223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1348.3333333333333, 1198, 1627, 1220.0, 1627.0, 1627.0, 1627.0, 0.049486984922965264, 44.52847602252483, 0.028174718955164792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 322.3333333333333, 143, 413, 411.0, 413.0, 413.0, 413.0, 0.050136203352440796, 0.08871757858849875, 0.027760964160970635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b389a279-2664-4ca6-b61e-9d368aa101c6", 3, 0, 0.0, 357.0, 271, 515, 285.0, 515.0, 515.0, 515.0, 0.04593125621985761, 0.030067628990277886, 0.029454614177447755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c9f0c89-d23f-4759-a005-69542419b43c", 3, 0, 0.0, 1384.0, 476, 3153, 523.0, 3153.0, 3153.0, 3153.0, 0.08563598995204384, 0.03874805534939484, 0.05491630866065312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 140.84615384615384, 135, 170, 139.0, 159.6, 170.0, 170.0, 0.07586987732424452, 0.056383766253662176, 0.03808312201627117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 157.6923076923077, 132, 412, 136.0, 303.9999999999999, 412.0, 412.0, 0.07586943453926827, 0.02030100103882764, 0.04326928688567643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 219.61538461538464, 133, 419, 140.0, 412.2, 419.0, 419.0, 0.0758681062153487, 0.020448825503355705, 0.04460214838050774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 200.30769230769235, 134, 416, 139.0, 412.8, 416.0, 416.0, 0.07586722069190906, 0.020448586827116113, 0.04467571687228629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 228.33333333333331, 139, 403, 143.0, 403.0, 403.0, 403.0, 0.050363456276126047, 0.03742831076770695, 0.028280261092551245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 860.2105263157894, 134, 1792, 1206.0, 1757.0, 1792.0, 1792.0, 0.10050410744418055, 47.60955402294139, 0.05453959531227684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 464.4666666666667, 134, 1672, 137.0, 1629.4, 1672.0, 1672.0, 0.10852892657656354, 19.5543053312122, 0.06193779755014037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 603.578947368421, 134, 1219, 806.0, 1132.0, 1219.0, 1219.0, 0.10050038613306252, 15.565699813280862, 0.05463572081257207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 327.8, 138, 1070, 140.0, 1065.8, 1070.0, 1070.0, 0.1087366253950764, 6.41788198723432, 0.06216252002566184], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 718.4615384615385, 250, 2180, 605.0, 1748.7999999999997, 2180.0, 2180.0, 0.060985621466938755, 0.011017910128304366, 0.04204672730044801], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ce39266-496a-4165-bd29-142f9b19bfdb", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 385.53846153846155, 274, 554, 285.0, 554.0, 554.0, 554.0, 0.07580616945594496, 0.1174847567642428, 0.1704898518135168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 893.05, 268, 3441, 739.0, 1748.6000000000013, 3359.3999999999987, 3441.0, 0.08825541115989674, 0.05421157580036626, 0.039904546256867374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 156.57894736842107, 135, 444, 140.0, 157.0, 444.0, 444.0, 0.1004913498103887, 0.07468155977119706, 0.05044194707279276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 294.42105263157896, 134, 424, 400.0, 417.0, 424.0, 424.0, 0.10050198094694024, 0.10633911285843503, 0.05287511703191203], "isController": false}, {"data": ["login", 20, 0, 0.0, 4029.45, 2143, 6888, 3862.5, 5781.400000000001, 6834.799999999999, 6888.0, 0.09023438381195155, 16.319377375702135, 0.15858869193981365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37b39636-c059-4751-9ad5-2e6fa0ab4e53", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 166.4, 138, 464, 144.0, 280.4000000000001, 464.0, 464.0, 0.10336914499934532, 0.08368459101997781, 0.03674450076148604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87abb7a1-c99a-4787-9823-834c2554d208", 1, 0, 0.0, 806.0, 806, 806, 806.0, 806.0, 806.0, 806.0, 1.2406947890818858, 0.22414896091811412, 0.855400899503722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bfd531d-e997-49d4-bb74-12320bc404f5", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1061.3157894736842, 276, 1952, 1343.0, 1902.0, 1952.0, 1952.0, 0.10041540266576468, 63.30094392955859, 0.21231437188844376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4759f4c4-568a-493a-b63d-c37ab06ac523", 1, 0, 0.0, 891.0, 891, 891, 891.0, 891.0, 891.0, 891.0, 1.122334455667789, 0.2027655022446689, 0.7737969977553311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 421.15, 273, 684, 415.0, 561.0, 677.8999999999999, 684.0, 0.09708643605401888, 0.15046501368918747, 0.2183496701488335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d62bde3-8f95-4d5f-badc-c956b582bd56", 3, 0, 0.0, 340.6666666666667, 235, 544, 243.0, 544.0, 544.0, 544.0, 0.038442809913119255, 0.03204818886311797, 0.024652452971629206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1576.6666666666667, 1359, 1770, 1601.0, 1770.0, 1770.0, 1770.0, 0.04937052579609973, 59.06431282399407, 0.11132475006171316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5c0cf8e-e25a-45e7-b858-da653a09d53f", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1565.727272727273, 220, 3361, 1471.0, 2722.999999999999, 3307.149999999999, 3361.0, 0.08570749589967547, 0.027377092529033413, 0.0386688116266114], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a986c3fa-b343-4454-aac2-67562e2c0c88", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 141.3888888888889, 136, 154, 139.5, 149.5, 154.0, 154.0, 0.0947119179163378, 0.07353122533543804, 0.033667127071823205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 644.0, 274, 2011, 283.0, 1894.6000000000001, 2011.0, 2011.0, 0.1084214558833096, 26.076376591084866, 0.23829426622165684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7ca69a8-65ff-4549-afd2-0e89fd4a4006", 3, 0, 0.0, 506.6666666666667, 255, 720, 545.0, 720.0, 720.0, 720.0, 0.01699052495058589, 0.02342281027530314, 0.010895616586150457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b389a279-2664-4ca6-b61e-9d368aa101c6", 1, 0, 0.0, 1102.0, 1102, 1102, 1102.0, 1102.0, 1102.0, 1102.0, 0.9074410163339383, 0.16394198049001812, 0.6256380444646098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 684.25, 272, 1714, 547.0, 1472.5000000000002, 1714.0, 1714.0, 0.11758567218584416, 35.30501195148121, 0.2569315835115491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ce39266-496a-4165-bd29-142f9b19bfdb", 3, 0, 0.0, 592.3333333333334, 412, 782, 583.0, 782.0, 782.0, 782.0, 0.052997915415326995, 0.03296842980426103, 0.03398629341412571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 141.66666666666669, 137, 146, 141.5, 146.0, 146.0, 146.0, 0.026062027625749284, 0.019368362327339066, 0.013081916210581183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 183.16666666666666, 136, 399, 141.0, 399.0, 399.0, 399.0, 0.026033531188170363, 0.006966003462459648, 0.01484724825575341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 181.33333333333334, 135, 408, 136.0, 408.0, 408.0, 408.0, 0.02603262755987504, 0.007016606646997571, 0.015304337686567165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 184.0, 135, 412, 139.0, 412.0, 412.0, 412.0, 0.026032175769250796, 0.007016484875305878, 0.015329494129744364], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1540.9285714285722, 1067, 2242, 1496.5, 2031.4, 2158.35, 2242.0, 0.2410022249669698, 288.32244699026955, 0.4758852528156376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1565.727272727273, 220, 3361, 1471.0, 2722.999999999999, 3307.149999999999, 3361.0, 0.08651811768037061, 0.027636025161041678, 0.03903454137532346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac3f71c6-f4b2-4348-a7a2-80feb9d03fa6", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.7143980704697986, 1.3348538870246085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/681cd1c3-21ca-4f43-9343-84c5207dab7b", 3, 0, 0.0, 483.33333333333337, 323, 782, 345.0, 782.0, 782.0, 782.0, 0.01798464111648652, 0.024793279664166803, 0.011533119465976056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 185.16666666666669, 135, 412, 140.0, 412.0, 412.0, 412.0, 0.03619931341968881, 0.0097568461951505, 0.021316587882883157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 183.33333333333331, 134, 410, 137.5, 410.0, 410.0, 410.0, 0.03619931341968881, 0.0097568461951505, 0.02128123699087174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 165.83333333333334, 134, 398, 136.5, 397.1, 398.0, 398.0, 0.09673726695723676, 0.02607371648456772, 0.056870932332281764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 210.66666666666666, 134, 410, 137.0, 403.7, 410.0, 410.0, 0.0965991724670892, 0.026036495704020137, 0.05688408300552226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 156.38888888888886, 133, 466, 137.5, 183.40000000000043, 466.0, 466.0, 0.09673206829284021, 0.07188779684653458, 0.04855496396730456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 136.5, 134, 139, 136.0, 139.0, 139.0, 139.0, 0.036200187034299676, 0.009686378171287218, 0.020645419167999033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 181.11111111111111, 133, 410, 138.0, 401.90000000000003, 410.0, 410.0, 0.09673518742442563, 0.02588422007255139, 0.05516928657799275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 185.33333333333334, 138, 415, 139.5, 415.0, 415.0, 415.0, 0.03619909502262444, 0.026901866515837106, 0.018170248868778282], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 800.0833333333334, 515, 1195, 782.0, 1187.5, 1195.0, 1195.0, 0.05669282410578881, 0.010242355917549736, 0.03858876797044414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 187.0, 138, 406, 144.5, 406.0, 406.0, 406.0, 0.0356904920529171, 0.02809232089321405, 0.012686854596935377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2363.2499999999995, 950, 4773, 1954.0, 4446.900000000001, 4758.099999999999, 4773.0, 0.09041877455434846, 0.046798779798637384, 0.04158910431161926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 372.66666666666663, 278, 827, 283.0, 827.0, 827.0, 827.0, 0.036168763450258906, 0.05605451913628993, 0.08134439670502565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c9f0c89-d23f-4759-a005-69542419b43c", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["addBook", 57, 3, 5.2631578947368425, 1622.4385964912278, 709, 5523, 1253.0, 2737.2000000000003, 3886.899999999995, 5523.0, 0.25715871204089275, 92.72006103007855, 0.9332621329848908], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f2f30a1-f206-4456-a595-6d6f6ac036b5", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 237.78571428571416, 135, 572, 140.0, 543.2, 554.35, 572.0, 0.242600679281902, 0.18029210638039786, 0.11727278930131005], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 879.8392857142859, 659, 1229, 811.5, 1102.7, 1202.3, 1229.0, 0.24239066449669308, 71.27090348955988, 0.1219054611482392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4e04265-160f-44f4-a8e8-2239df50391b", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.587014590992647, 1.096837660845588], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 220.14285714285714, 134, 561, 141.0, 415.3, 426.25, 561.0, 0.24275948170850656, 0.42957048911700574, 0.11806076356526979], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1301.5178571428576, 930, 1670, 1320.5, 1596.2, 1650.9, 1670.0, 0.2416178037804557, 217.40812456044978, 0.12128081166323657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 178.8125, 136, 414, 144.5, 410.5, 414.0, 414.0, 0.1154143012746067, 0.08622259812018956, 0.04102617740620785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 3, 1.7647058823529411, 283.2823529411767, 136, 3803, 150.0, 453.70000000000005, 558.6999999999999, 3562.309999999997, 0.6823144104803494, 1.4739645314406467, 0.3278150737300925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 192.0, 144, 408, 151.0, 408.0, 408.0, 408.0, 0.0274294491709449, 0.021241751164608698, 0.00975031200998432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20a0d504-2a9a-4093-b42d-0f4ebe664271", 3, 0, 0.0, 642.6666666666666, 245, 945, 738.0, 945.0, 945.0, 945.0, 0.0641958401095609, 0.029046945882906787, 0.041167254236925445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 150.45000000000002, 139, 213, 145.5, 164.70000000000002, 210.59999999999997, 213.0, 0.0954458034866352, 0.07745650654042369, 0.03392800045813985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1eb73712-eb7f-422a-a44a-6b71b9171bf5", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.4212875164907652, 0.7871763687335093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20a0d504-2a9a-4093-b42d-0f4ebe664271", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 0.5681259827044025, 2.168091588050314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 328.5, 280, 551, 284.0, 551.0, 551.0, 551.0, 0.026015357732848292, 0.04031872336135765, 0.05850914927612267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 398.88888888888886, 269, 867, 285.0, 578.1000000000005, 867.0, 867.0, 0.09652406130350381, 0.1495934426647076, 0.2170848761542669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37b39636-c059-4751-9ad5-2e6fa0ab4e53", 3, 0, 0.0, 867.6666666666666, 575, 1170, 858.0, 1170.0, 1170.0, 1170.0, 0.03415456077234847, 0.03425462296211121, 0.021902501536955235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5c0cf8e-e25a-45e7-b858-da653a09d53f", 3, 0, 0.0, 634.0, 377, 1113, 412.0, 1113.0, 1113.0, 1113.0, 0.03030456083640588, 0.025263665462902166, 0.019433588817617052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 145.30769230769232, 138, 159, 145.0, 155.8, 159.0, 159.0, 0.07831278124830574, 0.06492924929669099, 0.027837746459358676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4759f4c4-568a-493a-b63d-c37ab06ac523", 3, 0, 0.0, 622.6666666666667, 246, 1195, 427.0, 1195.0, 1195.0, 1195.0, 0.03991166218769124, 0.03327271056727776, 0.025594392744059814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 189.47368421052633, 138, 411, 150.0, 404.0, 411.0, 411.0, 0.09704820230974721, 0.07534503987914945, 0.03449760316479296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87abb7a1-c99a-4787-9823-834c2554d208", 2, 0, 0.0, 249.0, 230, 268, 249.0, 268.0, 268.0, 268.0, 0.03041732570872369, 0.02563491414709819, 0.018906863099221318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 171.5625, 134, 412, 138.0, 405.0, 412.0, 412.0, 0.11862396204033214, 0.08815706553973902, 0.0595436684460261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 256.1875, 134, 425, 140.5, 422.2, 425.0, 425.0, 0.1183922334694844, 0.0761340681051323, 0.06503479621736814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 492.8125, 134, 1579, 269.0, 1335.4000000000003, 1579.0, 1579.0, 0.11770677770339363, 26.501985612185592, 0.0666698545585628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 405.0625, 133, 1095, 137.5, 1076.1, 1095.0, 1095.0, 0.1178211916140767, 8.684652961362012, 0.06684971907009624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d62bde3-8f95-4d5f-badc-c956b582bd56", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 50.0, 0.2356637863315004], "isController": false}, {"data": ["401/Unauthorized", 3, 50.0, 0.2356637863315004], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 6, "406/Not Acceptable", 3, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
