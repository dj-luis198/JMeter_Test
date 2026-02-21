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

    var data = {"OkPercent": 66.72051696284329, "KoPercent": 33.2794830371567};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5184085510688836, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a553df3-efdc-4bab-9b30-11af8d0567b0"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b04dbaf0-596e-4eef-998b-3c2fc3aba2eb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b06df867-ded5-4a73-8e25-4c64a67efce6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/165bfc1e-0eeb-45f6-89dc-917d96de94ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72cee387-a835-425b-9da6-3049bc7fc5e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40fdc6df-f888-453b-826a-b90c1aea7091"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9939ca88-f104-4723-82c4-abba456a35f1"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9217877094972067, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9939ca88-f104-4723-82c4-abba456a35f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7bb4e21-508e-4896-8dbe-7dcaf4363607"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72cee387-a835-425b-9da6-3049bc7fc5e1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f873a3f-ef8f-480f-8ac1-098197e3fc8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f873a3f-ef8f-480f-8ac1-098197e3fc8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7bb4e21-508e-4896-8dbe-7dcaf4363607"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b9d2fe4-72c8-40e5-8282-dcbd1f6ad9c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f20f40e-15c7-4e2c-b432-b29c642a4b2c"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9eb78e88-ff9d-4404-a7a1-b06d9366ba2d"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=194228af-d607-48c5-9134-aeda87b3e72b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f20f40e-15c7-4e2c-b432-b29c642a4b2c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/194228af-d607-48c5-9134-aeda87b3e72b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b9d2fe4-72c8-40e5-8282-dcbd1f6ad9c8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96f106ee-61f0-49e6-8fe1-20034de70c5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96f106ee-61f0-49e6-8fe1-20034de70c5d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9eb78e88-ff9d-4404-a7a1-b06d9366ba2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b04dbaf0-596e-4eef-998b-3c2fc3aba2eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b06df867-ded5-4a73-8e25-4c64a67efce6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a553df3-efdc-4bab-9b30-11af8d0567b0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac36512b-272c-461f-aeab-0116a8b37a9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac36512b-272c-461f-aeab-0116a8b37a9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/912139af-505c-4721-947c-4453a4ab1dcf"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 619, 206, 33.2794830371567, 233.7851373182552, 82, 2923, 89.0, 532.0, 916.0, 1517.799999999998, 2.3998666309982126, 2.466479952487293, 1.151682765933525], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a553df3-efdc-4bab-9b30-11af8d0567b0", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.0565149853801168, 4.0318896198830405], "isController": false}, {"data": ["see books", 57, 57, 100.0, 552.6666666666666, 339, 3185, 509.0, 679.8000000000001, 881.0999999999929, 3185.0, 0.25403560063820874, 1.634975528182353, 0.426452341305743], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 104.4705882352941, 82, 254, 85.0, 253.2, 254.0, 254.0, 0.0852433698208385, 0.042371948475397256, 0.04278817586710057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 121.15, 83, 259, 87.0, 254.60000000000002, 258.8, 259.0, 0.1048300442906937, 0.08138660665146631, 0.03726380480645753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 13, 100.0, 97.92307692307692, 82, 254, 84.0, 189.19999999999993, 254.0, 254.0, 0.09539884053716886, 0.047419931477948186, 0.04788574612900858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 93.5, 88, 99, 93.5, 99.0, 99.0, 99.0, 0.2594033722438392, 0.07650372892347601, 0.16035384241245138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b04dbaf0-596e-4eef-998b-3c2fc3aba2eb", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.2606985028860029, 0.9948818542568544], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 239.36842105263156, 83, 2923, 86.0, 421.40000000000015, 612.399999999993, 2923.0, 0.269419471937835, 0.13392042110972463, 0.13023695176682454], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 395.59999999999997, 84, 562, 392.0, 557.8, 562.0, 562.0, 0.0891620550070438, 0.017466707260168933, 0.060033461776227016], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 395.59999999999997, 84, 562, 392.0, 557.8, 562.0, 562.0, 0.09236225708726387, 0.01809362184736829, 0.06218818117164602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 826.4583333333335, 149, 1328, 817.0, 1240.0, 1310.0, 1328.0, 0.09595048954739355, 0.030265632933406363, 0.04329016227626545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b06df867-ded5-4a73-8e25-4c64a67efce6", 3, 0, 0.0, 247.66666666666669, 156, 430, 157.0, 430.0, 430.0, 430.0, 0.020369226173097683, 0.028080622670269756, 0.013062296732097148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/165bfc1e-0eeb-45f6-89dc-917d96de94ad", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.9353693181818181, 3.6162405303030303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 88.25000000000001, 85, 108, 86.0, 103.80000000000001, 108.0, 108.0, 0.07830649160815431, 0.061635773668137085, 0.027835510688836104], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 391.8666666666666, 85, 614, 398.0, 612.8, 614.0, 614.0, 0.09156502948393949, 0.020405409890854483, 0.061287764851847774], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1132.1428571428573, 647, 2749, 1013.0, 2138.6000000000004, 2704.399999999999, 2749.0, 0.09196046575786372, 0.0475967254410818, 0.04229822204292364], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 160.26666666666665, 82, 204, 164.0, 199.2, 204.0, 204.0, 0.0894854586129754, 0.1754113068605518, 0.05683724832214765], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 12, 100.0, 180.49999999999997, 84, 249, 245.5, 249.0, 249.0, 249.0, 0.0804953145019017, 0.04001183113424606, 0.04040487466208738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72cee387-a835-425b-9da6-3049bc7fc5e1", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40fdc6df-f888-453b-826a-b90c1aea7091", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.8272951748704663, 1.545802299222798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9939ca88-f104-4723-82c4-abba456a35f1", 3, 0, 0.0, 266.6666666666667, 198, 398, 204.0, 398.0, 398.0, 398.0, 0.02658089896600303, 0.02665877269344249, 0.017045693672860015], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 565.9836065573771, 338, 2076, 510.0, 694.2, 766.6999999999999, 2076.0, 0.2943830744210064, 0.9254846990174362, 0.5750847633232471], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 101.07692307692308, 85, 256, 89.0, 192.39999999999995, 256.0, 256.0, 0.09885480510394963, 0.07385149014113425, 0.035139794001794594], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 381.2, 88, 693, 349.0, 643.2, 693.0, 693.0, 0.09262689885142646, 0.018145464755464986, 0.06298146690132148], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 12, 6.70391061452514, 157.5418994413407, 83, 1800, 90.0, 269.0, 332.0, 1581.599999999997, 0.7827326552565527, 1.6544886807128552, 0.37659528922846175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 121.875, 85, 353, 88.5, 353.0, 353.0, 353.0, 0.04224087861027509, 0.03271193040815249, 0.015015312318496225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9939ca88-f104-4723-82c4-abba456a35f1", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7bb4e21-508e-4896-8dbe-7dcaf4363607", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72cee387-a835-425b-9da6-3049bc7fc5e1", 3, 0, 0.0, 310.0, 157, 614, 159.0, 614.0, 614.0, 614.0, 0.028655758374645388, 0.028739710791758605, 0.018376251301449025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 84.64285714285714, 83, 92, 84.0, 89.0, 92.0, 92.0, 0.0688200797329781, 0.034208418539146336, 0.03454445408471752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f873a3f-ef8f-480f-8ac1-098197e3fc8e", 3, 0, 0.0, 467.3333333333333, 173, 765, 464.0, 765.0, 765.0, 765.0, 0.049191617748335685, 0.03162547039484472, 0.031545405912832454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f873a3f-ef8f-480f-8ac1-098197e3fc8e", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 97.16666666666666, 84, 249, 88.0, 111.30000000000021, 249.0, 249.0, 0.10445076307085244, 0.08476424229675622, 0.03712898218534207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7bb4e21-508e-4896-8dbe-7dcaf4363607", 3, 0, 0.0, 293.0, 159, 503, 217.0, 503.0, 503.0, 503.0, 0.038519317437695, 0.03153518338405044, 0.024701515414146863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b9d2fe4-72c8-40e5-8282-dcbd1f6ad9c8", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f20f40e-15c7-4e2c-b432-b29c642a4b2c", 3, 0, 0.0, 280.3333333333333, 167, 500, 174.0, 500.0, 500.0, 500.0, 0.07442137381856069, 0.04871789803031431, 0.0477246440177619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 396.4285714285715, 117, 806, 384.0, 765.2000000000002, 805.1, 806.0, 0.09096225066597362, 0.05587427311415762, 0.0411284395101033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9eb78e88-ff9d-4404-a7a1-b06d9366ba2d", 3, 0, 0.0, 464.0, 196, 839, 357.0, 839.0, 839.0, 839.0, 0.020248243464879422, 0.023932738288078508, 0.012984713419860827], "isController": false}, {"data": ["login", 21, 5, 23.80952380952381, 1853.190476190476, 934, 3782, 1692.0, 2832.4, 3691.4999999999986, 3782.0, 0.09105651574410517, 0.13599195775844874, 0.1366228832070105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=194228af-d607-48c5-9134-aeda87b3e72b", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, 100.0, 85.74999999999999, 84, 96, 84.0, 96.0, 96.0, 96.0, 0.04234843231397128, 0.021050148484190803, 0.021256927938848865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f20f40e-15c7-4e2c-b432-b29c642a4b2c", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/194228af-d607-48c5-9134-aeda87b3e72b", 3, 0, 0.0, 452.0, 176, 833, 347.0, 833.0, 833.0, 833.0, 0.03224280985340269, 0.026879503917501397, 0.020676541475001076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 97.29411764705883, 83, 248, 89.0, 124.7999999999999, 248.0, 248.0, 0.0843764579755606, 0.06830867545091772, 0.02999319404600006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b9d2fe4-72c8-40e5-8282-dcbd1f6ad9c8", 3, 0, 0.0, 310.0, 155, 612, 163.0, 612.0, 612.0, 612.0, 0.06533670180329297, 0.02956315608938061, 0.04189886150797108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, 100.0, 109.4, 82, 252, 85.0, 247.70000000000002, 251.8, 252.0, 0.10417100712529688, 0.05178031506521105, 0.05228896256094004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96f106ee-61f0-49e6-8fe1-20034de70c5d", 3, 0, 0.0, 261.0, 158, 380, 245.0, 380.0, 380.0, 380.0, 0.01879864148484203, 0.02591544488551627, 0.012055118400110285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96f106ee-61f0-49e6-8fe1-20034de70c5d", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9eb78e88-ff9d-4404-a7a1-b06d9366ba2d", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 100.92857142857142, 85, 246, 87.5, 176.5, 246.0, 246.0, 0.06740069230139664, 0.055882019300669675, 0.02395883984151209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 84.87500000000001, 82, 88, 85.0, 88.0, 88.0, 88.0, 0.07469201215612498, 0.03712718182369884, 0.037491888914304924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b04dbaf0-596e-4eef-998b-3c2fc3aba2eb", 3, 0, 0.0, 547.6666666666666, 164, 1130, 349.0, 1130.0, 1130.0, 1130.0, 0.028512773722627737, 0.02859630723939325, 0.018284558669784064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 88.3125, 84, 100, 88.5, 95.10000000000001, 100.0, 100.0, 0.07410598081581421, 0.057533451902902634, 0.02634236036812146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b06df867-ded5-4a73-8e25-4c64a67efce6", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a553df3-efdc-4bab-9b30-11af8d0567b0", 3, 0, 0.0, 287.0, 174, 344, 343.0, 344.0, 344.0, 344.0, 0.07246026761992175, 0.032786384111878654, 0.04646703359741075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 18, 100.0, 86.16666666666667, 83, 101, 85.0, 90.20000000000002, 101.0, 101.0, 0.10440593025683859, 0.05189708837961996, 0.05240688296095218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, 100.0, 103.11111111111111, 82, 246, 85.0, 246.0, 246.0, 246.0, 0.06640400194785072, 0.03300745799946877, 0.03779177411203093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac36512b-272c-461f-aeab-0116a8b37a9f", 3, 0, 0.0, 271.0, 183, 403, 227.0, 403.0, 403.0, 403.0, 0.03997867803837953, 0.03332857892457356, 0.025637368403518122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac36512b-272c-461f-aeab-0116a8b37a9f", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/912139af-505c-4721-947c-4453a4ab1dcf", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["register", 24, 6, 25.0, 826.4583333333335, 149, 1328, 817.0, 1240.0, 1310.0, 1328.0, 0.09684721947597584, 0.030548488174550973, 0.04369474159951254], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 2.912621359223301, 0.9693053311793215], "isController": false}, {"data": ["401/Unauthorized", 16, 7.766990291262136, 2.5848142164781907], "isController": false}, {"data": ["404/Not Found", 184, 89.32038834951456, 29.72536348949919], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 619, 206, "404/Not Found", 184, "401/Unauthorized", 16, "406/Not Acceptable", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
