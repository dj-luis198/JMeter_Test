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

    var data = {"OkPercent": 98.19890368050118, "KoPercent": 1.8010963194988254};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7346050870147256, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/26c5783a-3251-44d1-be05-8a48c2d5dbe6"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=115dfca3-9747-4526-8e02-a75bc29f6101"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb9f8e27-2b4e-4b1b-9ae3-0369334f25a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e73ec672-445b-45bb-b95f-b18bf3f75953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d374b375-6d7a-4d53-8add-514165b32142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e05922e-d061-43b3-b901-8d1225113a42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f039d834-2e24-4d85-96e8-07e4f965cf74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9cb338e6-eb83-4e03-9037-c9c27d96e7c5"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f039d834-2e24-4d85-96e8-07e4f965cf74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee961ede-2a07-4bec-9aab-1f8992475ab8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39e7faf2-18a1-4ba5-ae4f-8f0bf28e261e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/757a18dd-5b45-4b82-8927-ff863c2a5acf"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7dd588f-4bf6-49e7-8c6a-d398ee3a5688"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db1e1c70-263e-48b0-9f81-49b3f6b5b757"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=759da625-a2c6-4b33-87ad-140cfa9615fe"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e05922e-d061-43b3-b901-8d1225113a42"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/759da625-a2c6-4b33-87ad-140cfa9615fe"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/115dfca3-9747-4526-8e02-a75bc29f6101"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb9f8e27-2b4e-4b1b-9ae3-0369334f25a7"], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e73ec672-445b-45bb-b95f-b18bf3f75953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abfbaded-83d9-432f-bf5d-858f5bd70fe1"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cb338e6-eb83-4e03-9037-c9c27d96e7c5"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9420731707317073, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d374b375-6d7a-4d53-8add-514165b32142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=757a18dd-5b45-4b82-8927-ff863c2a5acf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39e7faf2-18a1-4ba5-ae4f-8f0bf28e261e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db1e1c70-263e-48b0-9f81-49b3f6b5b757"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee961ede-2a07-4bec-9aab-1f8992475ab8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26c5783a-3251-44d1-be05-8a48c2d5dbe6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7dd588f-4bf6-49e7-8c6a-d398ee3a5688"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1277, 23, 1.8010963194988254, 475.56225528582615, 126, 4092, 157.0, 1316.0, 1585.1999999999998, 1987.7400000000005, 4.935380144080636, 715.2247182241423, 3.6061411387800293], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2188.2321428571418, 1593, 3150, 2159.5, 2524.5, 2674.1499999999996, 3150.0, 0.24234451003133167, 291.62313024854376, 1.1916060625075733], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/26c5783a-3251-44d1-be05-8a48c2d5dbe6", 3, 0, 0.0, 855.0, 229, 1367, 969.0, 1367.0, 1367.0, 1367.0, 0.029759542893421156, 0.024809306429053248, 0.0190840818685025], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 737.3749999999999, 134, 1366, 664.5, 1305.8, 1366.0, 1366.0, 0.08957513394281748, 0.01746233995442865, 0.060347310086719924], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 737.3749999999999, 134, 1366, 664.5, 1305.8, 1366.0, 1366.0, 0.08999735632765787, 0.017544650641512408, 0.06063176386381151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 160.20000000000002, 128, 404, 133.5, 370.40000000000055, 403.55, 404.0, 0.11439684264714294, 0.06497383172224445, 0.06332043985585997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 147.3, 127, 397, 133.0, 146.3, 384.49999999999983, 397.0, 0.11439291679059232, 0.08501270476332105, 0.05741988206090278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 350.99999999999994, 128, 1083, 136.5, 1038.9000000000003, 1081.45, 1083.0, 0.11439422537950283, 6.751806356315133, 0.06539685501675875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 448.05000000000007, 130, 1637, 136.0, 1572.3000000000002, 1634.3999999999999, 1637.0, 0.11439422537950283, 20.611091270862648, 0.06528514190603658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=115dfca3-9747-4526-8e02-a75bc29f6101", 1, 0, 0.0, 1078.0, 1078, 1078, 1078.0, 1078.0, 1078.0, 1078.0, 0.9276437847866419, 0.1675918947124304, 0.6395669063079777], "isController": false}, {"data": ["goToProfile", 17, 2, 11.764705882352942, 382.52941176470586, 131, 2059, 250.0, 780.5999999999989, 2059.0, 2059.0, 0.09459685048133103, 0.17046235080129096, 0.061144517556062546], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb9f8e27-2b4e-4b1b-9ae3-0369334f25a7", 1, 0, 0.0, 3349.0, 3349, 3349, 3349.0, 3349.0, 3349.0, 3349.0, 0.2985965959988056, 0.05394567408181546, 0.205868356225739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 159.60000000000002, 131, 394, 134.0, 366.60000000000053, 393.9, 394.0, 0.09560869274234413, 0.07105294450871473, 0.04799108209918446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e73ec672-445b-45bb-b95f-b18bf3f75953", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 185.15000000000003, 131, 397, 133.0, 391.9, 396.75, 397.0, 0.09560914979563545, 0.025582917035160264, 0.054527093242823337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 971.6666666666666, 778, 1056, 1023.5, 1056.0, 1056.0, 1056.0, 0.04503017021404341, 13.24036518529915, 0.025681268950196633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1370.8333333333333, 1164, 1455, 1421.5, 1455.0, 1455.0, 1455.0, 0.044879946144064625, 40.38305443095968, 0.025551766212880547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d374b375-6d7a-4d53-8add-514165b32142", 3, 0, 0.0, 584.6666666666666, 379, 943, 432.0, 943.0, 943.0, 943.0, 0.017222276440499906, 0.023742298413254263, 0.011044233264252868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 310.33333333333337, 131, 401, 398.0, 401.0, 401.0, 401.0, 0.04532783355619518, 0.080209017972486, 0.025098517213244794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 157.58333333333334, 133, 402, 135.0, 324.0000000000003, 402.0, 402.0, 0.060006900793591264, 0.04459497217179976, 0.030120651374908113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e05922e-d061-43b3-b901-8d1225113a42", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 177.41666666666669, 131, 404, 133.0, 401.90000000000003, 404.0, 404.0, 0.06000840117616466, 0.016056935470965934, 0.03422354129578141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 178.75, 130, 406, 134.0, 402.7, 406.0, 406.0, 0.06000780101413184, 0.016173977617090222, 0.0352780236430736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 198.25000000000003, 127, 394, 134.0, 394.0, 394.0, 394.0, 0.05993048064245476, 0.016153137360661634, 0.035291093581445526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 134.33333333333334, 131, 139, 133.5, 139.0, 139.0, 139.0, 0.04532851843737488, 0.03368652590902567, 0.02545302548973687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f039d834-2e24-4d85-96e8-07e4f965cf74", 3, 0, 0.0, 492.0, 255, 887, 334.0, 887.0, 887.0, 887.0, 0.04959333465582226, 0.03188373565926073, 0.03180301734113602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 158.74999999999997, 130, 398, 133.5, 354.90000000000055, 397.05, 398.0, 0.09561052098172883, 0.0257700232333566, 0.05620852893652418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1042.4666666666667, 128, 1814, 1316.0, 1770.2, 1814.0, 1814.0, 0.09445249039733015, 56.66749722545809, 0.05011639301681254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 223.3, 130, 528, 132.5, 513.9000000000003, 527.95, 528.0, 0.09561097805249999, 0.025770146428212886, 0.05630216773989989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 753.4666666666666, 132, 1184, 1043.0, 1178.0, 1184.0, 1184.0, 0.09445011145113152, 18.52279828919365, 0.05020736718740162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cb338e6-eb83-4e03-9037-c9c27d96e7c5", 3, 0, 0.0, 1345.3333333333333, 485, 2059, 1492.0, 2059.0, 2059.0, 2059.0, 0.016314189538254056, 0.02249042730940948, 0.010461898890091305], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 739.4000000000002, 433, 3349, 485.0, 1986.4000000000008, 3349.0, 3349.0, 0.08443521286117163, 0.015897567421517468, 0.057812834222717574], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 380.5, 267, 798, 274.0, 720.6000000000003, 798.0, 798.0, 0.0598895038653684, 0.0928170338225973, 0.13469289785346036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 831.904761904762, 244, 2099, 832.0, 1376.2, 2030.699999999999, 2099.0, 0.08980960364028259, 0.055166250673572025, 0.04060727195844809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 152.4, 132, 400, 134.0, 245.8000000000001, 400.0, 400.0, 0.09444832732012315, 0.07019060262755246, 0.047408633049358696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 257.00000000000006, 130, 407, 138.0, 403.4, 407.0, 407.0, 0.0944507061764465, 0.11984663173039992, 0.048578162681896325], "isController": false}, {"data": ["login", 21, 0, 0.0, 3342.2857142857147, 2119, 6033, 3250.0, 4770.0, 5908.0999999999985, 6033.0, 0.09183218324456222, 31.514376246293917, 0.18206294030252146], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f039d834-2e24-4d85-96e8-07e4f965cf74", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 150.4, 132, 403, 137.0, 145.60000000000002, 390.1499999999998, 403.0, 0.09621074000490674, 0.0778893588516286, 0.03419991148611919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee961ede-2a07-4bec-9aab-1f8992475ab8", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39e7faf2-18a1-4ba5-ae4f-8f0bf28e261e", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/757a18dd-5b45-4b82-8927-ff863c2a5acf", 3, 0, 0.0, 383.6666666666667, 236, 461, 454.0, 461.0, 461.0, 461.0, 0.029357941812559327, 0.02386288434438823, 0.01882654471703837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1214.3333333333337, 264, 1948, 1450.0, 1907.8, 1948.0, 1948.0, 0.09436989222958309, 75.31488456006329, 0.19614315165556245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7dd588f-4bf6-49e7-8c6a-d398ee3a5688", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db1e1c70-263e-48b0-9f81-49b3f6b5b757", 3, 0, 0.0, 329.3333333333333, 219, 521, 248.0, 521.0, 521.0, 521.0, 0.04597912547703343, 0.029141066830658882, 0.029485311585206984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 609.8500000000001, 262, 1856, 282.5, 1766.5, 1851.75, 1856.0, 0.11430530948162543, 27.491498542607303, 0.2512261030462365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 1048.111111111111, 131, 1592, 1455.0, 1592.0, 1592.0, 1592.0, 0.06500119168851429, 51.84847985233896, 0.11194649679688572], "isController": false}, {"data": ["register", 24, 9, 37.5, 1268.083333333333, 314, 2320, 1343.0, 1897.5, 2219.5, 2320.0, 0.09464095587365431, 0.02943666449781143, 0.042699337513308885], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=759da625-a2c6-4b33-87ad-140cfa9615fe", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 423.8, 265, 920, 272.5, 777.9000000000003, 913.55, 920.0, 0.09554657417758286, 0.14807852853498438, 0.21488648469821614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 136.62499999999997, 132, 145, 136.0, 143.6, 145.0, 145.0, 0.08334722453742291, 0.06470805030005002, 0.02962733372228705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e05922e-d061-43b3-b901-8d1225113a42", 3, 0, 0.0, 360.3333333333333, 223, 574, 284.0, 574.0, 574.0, 574.0, 0.042867553548718976, 0.027559706464427073, 0.027489935055656372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/759da625-a2c6-4b33-87ad-140cfa9615fe", 3, 0, 0.0, 833.6666666666666, 243, 1785, 473.0, 1785.0, 1785.0, 1785.0, 0.05263804326847157, 0.03384118992683312, 0.03375551602828417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 435.79999999999995, 264, 1431, 275.0, 898.2000000000003, 1431.0, 1431.0, 0.08734285564555104, 7.092501452074975, 0.19494629688127776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/115dfca3-9747-4526-8e02-a75bc29f6101", 2, 0, 0.0, 305.0, 297, 313, 305.0, 313.0, 313.0, 313.0, 0.020646653177519923, 0.023308135813684603, 0.012833588620597101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 180.72727272727272, 131, 393, 134.0, 392.2, 393.0, 393.0, 0.06579144113161278, 0.04889383466909896, 0.03302421947426658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 157.45454545454544, 128, 399, 132.0, 347.8000000000002, 399.0, 399.0, 0.06579301517426178, 0.017604771638425512, 0.037522578966571164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 180.54545454545456, 131, 395, 134.0, 394.2, 395.0, 395.0, 0.06579222814352276, 0.017733061491808866, 0.03867863412343818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 223.54545454545453, 132, 533, 135.0, 515.8000000000001, 533.0, 533.0, 0.06563441630120231, 0.017690526268683435, 0.03864995413049315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.6811128752886836, 1.427630629330254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb9f8e27-2b4e-4b1b-9ae3-0369334f25a7", 3, 0, 0.0, 326.6666666666667, 220, 448, 312.0, 448.0, 448.0, 448.0, 0.04114831223339323, 0.026079350233859575, 0.026387426790294485], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1514.9107142857138, 1044, 2589, 1439.0, 1962.5, 2032.2999999999995, 2589.0, 0.2510422737257363, 300.3338357914556, 0.4957104272201551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1268.083333333333, 314, 2320, 1343.0, 1897.5, 2219.5, 2320.0, 0.09360885539772063, 0.029115644965013687, 0.04223368280639348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.40380859375, 3.0670166015625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 2.041903409090909, 4.4537168560606055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 215.99999999999997, 131, 408, 134.0, 401.0, 408.0, 408.0, 0.08255082034877721, 0.02225002579713136, 0.048530853369105356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 213.43749999999997, 130, 395, 133.0, 393.6, 395.0, 395.0, 0.08255124626584598, 0.022250140595091297, 0.048611720213188596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 167.75, 132, 407, 134.0, 399.3, 407.0, 407.0, 0.08255337591711641, 0.0613507022196539, 0.04143792502089633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.4083059210526316, 3.0016447368421053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 181.5, 128, 399, 132.5, 398.3, 399.0, 399.0, 0.08255380186055632, 0.02208959151346917, 0.04708146512359852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e73ec672-445b-45bb-b95f-b18bf3f75953", 3, 0, 0.0, 371.0, 248, 473, 392.0, 473.0, 473.0, 473.0, 0.06857769853243725, 0.04408885240936314, 0.043977235061491336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 5.587699718045113, 3.7740836466165413], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 635.0, 134, 1367, 509.5, 1155.0, 1367.0, 1367.0, 0.0868012499379991, 0.016220741391176033, 0.05907643663818759], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 5.622209821428571, 2.5390624999999996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abfbaded-83d9-432f-bf5d-858f5bd70fe1", 2, 0, 0.0, 368.5, 277, 460, 368.5, 460.0, 460.0, 460.0, 0.010934458853631333, 0.021623319510354934, 0.0067966631448597116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1698.619047619048, 867, 4092, 1734.0, 2261.2000000000003, 3913.1999999999975, 4092.0, 0.0925391418536912, 0.047896235529742516, 0.0425643904424693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 4.7686298076923075, 6.920072115384615], "isController": false}, {"data": ["addBook", 54, 8, 14.814814814814815, 1367.8703703703702, 665, 3537, 1069.0, 2409.5, 2516.75, 3537.0, 0.24868633744893873, 83.60325473281186, 0.902756230398681], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cb338e6-eb83-4e03-9037-c9c27d96e7c5", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 244.5357142857144, 129, 620, 135.0, 534.3, 541.65, 620.0, 0.2526631143435948, 0.1877701464994879, 0.12213695468757754], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 835.9642857142858, 647, 1212, 785.5, 1092.6000000000004, 1184.55, 1212.0, 0.25243191099972057, 74.22336336221274, 0.12695550211411724], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 218.19642857142858, 129, 561, 136.0, 400.90000000000003, 413.3499999999999, 561.0, 0.25287875366899976, 0.4474768570783473, 0.12298205012418154], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1268.642857142857, 909, 2001, 1287.5, 1602.9000000000005, 1695.1499999999999, 2001.0, 0.2517057559712696, 226.48528167447253, 0.1263444907902662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 158.93333333333334, 131, 408, 137.0, 273.6000000000001, 408.0, 408.0, 0.09156447054370982, 0.06840509762298635, 0.03254830788858436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 8, 4.878048780487805, 201.89634146341461, 131, 2997, 139.5, 324.0, 395.75, 1375.249999999986, 0.6800774624817022, 1.5174665740890487, 0.3240427209940742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 159.54545454545456, 135, 386, 136.0, 337.8000000000002, 386.0, 386.0, 0.06483937518420277, 0.05021252394636015, 0.02304837164750958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d374b375-6d7a-4d53-8add-514165b32142", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=757a18dd-5b45-4b82-8927-ff863c2a5acf", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 150.2, 129, 400, 137.0, 155.40000000000003, 387.8499999999998, 400.0, 0.11705558384398831, 0.09499334977964285, 0.04160960206954272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39e7faf2-18a1-4ba5-ae4f-8f0bf28e261e", 3, 0, 0.0, 429.6666666666667, 300, 498, 491.0, 498.0, 498.0, 498.0, 0.051281174680774685, 0.03296885416488607, 0.03288538871130408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db1e1c70-263e-48b0-9f81-49b3f6b5b757", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 429.6363636363636, 265, 793, 274.0, 791.8, 793.0, 793.0, 0.06558198045656982, 0.1016392607271253, 0.14749541112449246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 434.125, 263, 802, 401.0, 797.1, 802.0, 802.0, 0.0824937871866525, 0.1278492580715015, 0.18553046083091868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee961ede-2a07-4bec-9aab-1f8992475ab8", 3, 0, 0.0, 495.66666666666663, 222, 892, 373.0, 892.0, 892.0, 892.0, 0.03188165529554294, 0.02657842422261897, 0.020444941709706902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 158.66666666666666, 132, 396, 135.0, 321.0000000000002, 396.0, 396.0, 0.06066734074823053, 0.05029938700707785, 0.021565343781597572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 139.39999999999998, 132, 153, 138.0, 152.4, 153.0, 153.0, 0.09688858458696396, 0.07522111791663706, 0.034440864052397345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26c5783a-3251-44d1-be05-8a48c2d5dbe6", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7dd588f-4bf6-49e7-8c6a-d398ee3a5688", 3, 0, 0.0, 413.0, 248, 741, 250.0, 741.0, 741.0, 741.0, 0.03924852163901826, 0.0244153401211471, 0.02516913659793814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 136.93333333333334, 128, 169, 134.0, 156.4, 169.0, 169.0, 0.08741207801819337, 0.06496151501156754, 0.04387676572397597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 167.13333333333335, 126, 403, 133.0, 394.0, 403.0, 403.0, 0.08741411563139216, 0.03214289876862649, 0.04936393482986299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 262.93333333333334, 131, 1299, 133.0, 757.8000000000003, 1299.0, 1299.0, 0.087415643903633, 5.265773834239543, 0.05089001873608635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 228.1333333333333, 130, 1042, 134.0, 653.2000000000003, 1042.0, 1042.0, 0.08741411563139216, 1.735500274626013, 0.05097449438218617], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 39.130434782608695, 0.7047768206734534], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15661707126076743], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07830853563038372], "isController": false}, {"data": ["401/Unauthorized", 11, 47.82608695652174, 0.8613938919342208], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1277, 23, "401/Unauthorized", 11, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
