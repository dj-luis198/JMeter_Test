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

    var data = {"OkPercent": 98.38833461243284, "KoPercent": 1.6116653875671527};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7309210526315789, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1e085cf-ac26-4c35-9261-79412634bb5c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b027f2ee-5cf1-48e1-8db5-56ada0eaa35a"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84e2bd85-7449-4deb-9e7a-e4cc34ad3566"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6153b1ff-1367-417f-b9ca-4bc6db431152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1fcbfb4-7f88-4758-b4e3-3c4234b1098f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e5f34e4f-e642-428a-903c-7d2e73d92f74"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87611253-6c65-42ee-b619-61308a234b40"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3e537d4-3cf4-432b-afb3-e1b7846fa1e6"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4243fba3-ea08-42cb-8cb6-b87cf80b9117"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c821c51-6866-4385-a01d-6ad5dd6d18d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/595e7d7d-1f76-41a5-b0d7-69f93a602a8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=203fb711-f83a-4a93-b64a-7a469c023bc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a409950b-8dd8-476f-8ee8-069a59b32cc3"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de211e94-c9ec-4a58-a7b8-d7598bf459da"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d3e537d4-3cf4-432b-afb3-e1b7846fa1e6"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/203fb711-f83a-4a93-b64a-7a469c023bc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.20535714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1e085cf-ac26-4c35-9261-79412634bb5c"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b027f2ee-5cf1-48e1-8db5-56ada0eaa35a"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb992de8-2711-424f-a5e0-7bd45330a5c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84e2bd85-7449-4deb-9e7a-e4cc34ad3566"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dba2f542-aaa1-4f88-8f38-4676729427dc"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b382d4be-ec8c-4aa4-abea-1778f991e01b"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9534883720930233, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87611253-6c65-42ee-b619-61308a234b40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1fcbfb4-7f88-4758-b4e3-3c4234b1098f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6153b1ff-1367-417f-b9ca-4bc6db431152"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c821c51-6866-4385-a01d-6ad5dd6d18d5"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4243fba3-ea08-42cb-8cb6-b87cf80b9117"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a409950b-8dd8-476f-8ee8-069a59b32cc3"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de211e94-c9ec-4a58-a7b8-d7598bf459da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 21, 1.6116653875671527, 496.4896392939369, 137, 3791, 161.0, 1405.6000000000001, 1704.0, 2222.920000000001, 5.081487085691109, 731.1295742645883, 3.704829533267556], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2418.9999999999995, 1751, 3378, 2409.5, 3012.8, 3141.8999999999996, 3378.0, 0.24444007944302584, 294.1441928771361, 1.2019099609332373], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1e085cf-ac26-4c35-9261-79412634bb5c", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b027f2ee-5cf1-48e1-8db5-56ada0eaa35a", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 664.1428571428571, 152, 2005, 534.0, 1629.5, 2005.0, 2005.0, 0.09895461517256979, 0.01949273390397161, 0.06658176743544977], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 664.1428571428571, 152, 2005, 534.0, 1629.5, 2005.0, 2005.0, 0.09479250597531332, 0.018672854134645984, 0.06378128575878016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 172.99999999999997, 137, 442, 145.0, 384.00000000000057, 440.4, 442.0, 0.09836952512111748, 0.041096174655091855, 0.055275219487002925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 161.25000000000003, 138, 442, 145.5, 157.5, 427.7999999999998, 442.0, 0.09836275199307526, 0.07309966236985378, 0.049373490746524105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 272.05, 137, 1136, 145.0, 1065.3000000000015, 1136.0, 1136.0, 0.0983671060397403, 2.916181235244934, 0.057079818758607126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84e2bd85-7449-4deb-9e7a-e4cc34ad3566", 1, 0, 0.0, 787.0, 787, 787, 787.0, 787.0, 787.0, 787.0, 1.2706480304955527, 0.22956043519695044, 0.8760522554002541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 326.2, 137, 1760, 146.5, 1457.7000000000025, 1750.4999999999998, 1760.0, 0.09836420329913538, 8.874689307442235, 0.056982075583053814], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 252.26666666666668, 149, 354, 258.0, 324.6, 354.0, 354.0, 0.08812021947809331, 0.169378994783283, 0.05695687102724677], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6153b1ff-1367-417f-b9ca-4bc6db431152", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.2881404505582137, 1.099606259968102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 147.6153846153846, 139, 156, 145.0, 155.6, 156.0, 156.0, 0.08508744371138338, 0.06323393033629177, 0.042709908269190494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 144.15384615384616, 138, 148, 143.0, 148.0, 148.0, 148.0, 0.08509189925119127, 0.022768730854322666, 0.048528973791695025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1108.0, 867, 1188, 1175.0, 1188.0, 1188.0, 1188.0, 0.05098763040086475, 14.99205628651989, 0.02907888296299318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1484.8, 1273, 1759, 1356.0, 1759.0, 1759.0, 1759.0, 0.05069091720145584, 45.61177640299786, 0.028860160867625738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 206.6, 142, 428, 155.0, 428.0, 428.0, 428.0, 0.0515357658214801, 0.09119414811379098, 0.028535917207792208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 146.58333333333334, 138, 153, 146.0, 152.7, 153.0, 153.0, 0.06638453240394988, 0.04933459878848229, 0.03332192349182641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 171.66666666666666, 138, 444, 146.0, 361.2000000000003, 444.0, 444.0, 0.0663856341487702, 0.017763343512463902, 0.037860556975470507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 170.83333333333334, 142, 443, 146.5, 355.4000000000003, 443.0, 443.0, 0.0662782027560686, 0.017864046836596613, 0.03896433404214189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 192.25, 138, 444, 144.0, 439.5, 444.0, 444.0, 0.06638747047140636, 0.017893497900496245, 0.03909340302173636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 150.2, 147, 153, 149.0, 153.0, 153.0, 153.0, 0.05153151667559879, 0.03829637127942449, 0.028936154383270806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1169.8, 139, 1879, 1625.0, 1866.4, 1879.0, 1879.0, 0.15289896436434802, 91.73290828483039, 0.08112803122196853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 144.53846153846152, 138, 149, 143.0, 149.0, 149.0, 149.0, 0.08508855755259127, 0.022934025277846864, 0.05002276527994135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1fcbfb4-7f88-4758-b4e3-3c4234b1098f", 3, 0, 0.0, 463.0, 250, 887, 252.0, 887.0, 887.0, 887.0, 0.08880994671403197, 0.03931690349319124, 0.05695169108940201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5f34e4f-e642-428a-903c-7d2e73d92f74", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.5412473516949153, 1.0113215042372883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 817.8666666666667, 137, 1318, 1130.0, 1265.8, 1318.0, 1318.0, 0.1529083161736223, 29.987152515851495, 0.08128231780974128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 210.1538461538462, 137, 445, 144.0, 444.6, 445.0, 445.0, 0.08508800062834215, 0.02293387516935785, 0.05010553162001009], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 518.7857142857142, 154, 934, 494.0, 918.0, 934.0, 934.0, 0.09484645037159484, 0.01868348045824385, 0.06442625095693294], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87611253-6c65-42ee-b619-61308a234b40", 3, 0, 0.0, 352.3333333333333, 268, 497, 292.0, 497.0, 497.0, 497.0, 0.026608010785113705, 0.026685963941710716, 0.01706307983290169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3e537d4-3cf4-432b-afb3-e1b7846fa1e6", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 0.2002927522172949, 0.7643604490022172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 369.4166666666667, 284, 593, 299.0, 591.8, 593.0, 593.0, 0.0662218763968677, 0.10263097445491118, 0.14893455209178352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4243fba3-ea08-42cb-8cb6-b87cf80b9117", 3, 0, 0.0, 840.0, 246, 1273, 1001.0, 1273.0, 1273.0, 1273.0, 0.024870878688144055, 0.024943742590550724, 0.015949098637904877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 806.9090909090909, 268, 1596, 668.0, 1342.2, 1559.9999999999995, 1596.0, 0.09564344125101622, 0.058749731002821486, 0.04324503251877003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 145.33333333333337, 138, 153, 145.0, 151.8, 153.0, 153.0, 0.15289896436434802, 0.11362901550905162, 0.07674811297194814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 182.13333333333333, 137, 433, 144.0, 428.8, 433.0, 433.0, 0.1528974058406809, 0.1940084921767494, 0.07863863972274604], "isController": false}, {"data": ["login", 22, 0, 0.0, 3057.454545454546, 2120, 5214, 2826.5, 4178.599999999999, 5080.199999999998, 5214.0, 0.093661261276603, 25.59535517973383, 0.17661267662598076], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c821c51-6866-4385-a01d-6ad5dd6d18d5", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 152.76923076923077, 141, 168, 152.0, 164.0, 168.0, 168.0, 0.07808182975758594, 0.06321273131742067, 0.02775565042164188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/595e7d7d-1f76-41a5-b0d7-69f93a602a8b", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.6117546695402298, 1.143064535440613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=203fb711-f83a-4a93-b64a-7a469c023bc4", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a409950b-8dd8-476f-8ee8-069a59b32cc3", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1317.6, 287, 2031, 1774.0, 2016.6, 2031.0, 2031.0, 0.15266554033423577, 121.83957483601176, 0.31730777182099457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 533.95, 279, 1904, 300.0, 1642.2000000000019, 1895.1999999999998, 1904.0, 0.0982907243043474, 11.896086048000274, 0.21854328232044742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 975.1111111111111, 149, 1906, 1423.0, 1906.0, 1906.0, 1906.0, 0.0911051049227125, 60.56271162956664, 0.14095786578699626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de211e94-c9ec-4a58-a7b8-d7598bf459da", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["register", 24, 6, 25.0, 1165.2083333333333, 174, 2224, 1206.5, 1923.5, 2194.75, 2224.0, 0.09564763411591697, 0.030170103339298027, 0.043153522423392224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 153.36842105263156, 144, 185, 151.0, 183.0, 185.0, 185.0, 0.09270056254604533, 0.07196967502354105, 0.03295215309253956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 361.1538461538462, 283, 600, 299.0, 596.0, 600.0, 600.0, 0.08500343283094125, 0.13173871865498415, 0.19117471270474384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3e537d4-3cf4-432b-afb3-e1b7846fa1e6", 3, 0, 0.0, 621.3333333333334, 354, 944, 566.0, 944.0, 944.0, 944.0, 0.02388630120625821, 0.02395628060432342, 0.015317712687606991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 620.7857142857143, 294, 1845, 585.0, 1672.5, 1845.0, 1845.0, 0.068094047607467, 11.728192729258065, 0.15065618038599596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 175.4, 144, 430, 146.5, 402.30000000000007, 430.0, 430.0, 0.04949710936881286, 0.036784472880533776, 0.024845228726142393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/203fb711-f83a-4a93-b64a-7a469c023bc4", 3, 0, 0.0, 692.0, 261, 1552, 263.0, 1552.0, 1552.0, 1552.0, 0.025252737817658397, 0.025326720447983567, 0.016193975748954113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 144.7, 140, 152, 143.5, 151.7, 152.0, 152.0, 0.049499804475772326, 0.013245064869493766, 0.028230357240088905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 203.20000000000002, 138, 444, 144.0, 443.8, 444.0, 444.0, 0.049500049500049506, 0.013341810216810216, 0.029100615038115035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 231.29999999999998, 139, 441, 146.5, 440.2, 441.0, 441.0, 0.049430071278162784, 0.013322948899192312, 0.029107747051496248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 155.0, 154, 156, 155.0, 156.0, 156.0, 156.0, 0.032350943029989324, 0.009541000776422632, 0.019998190369124258], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1738.410714285714, 1127, 2786, 1575.5, 2402.0000000000005, 2524.0499999999997, 2786.0, 0.23431158419735731, 280.318114586733, 0.4626738508272036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1e085cf-ac26-4c35-9261-79412634bb5c", 3, 0, 0.0, 348.0, 239, 462, 343.0, 462.0, 462.0, 462.0, 0.05346068857366883, 0.03437007159277212, 0.03428305875329674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1165.2083333333333, 174, 2224, 1206.5, 1923.5, 2194.75, 2224.0, 0.09459395544624699, 0.02983774180579861, 0.04267813224234971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 199.63636363636363, 138, 445, 148.0, 441.0, 445.0, 445.0, 0.055609198772553325, 0.014988416856664763, 0.03274643248032193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 198.45454545454547, 138, 442, 148.0, 439.0, 442.0, 442.0, 0.05560779317945141, 0.014988038005399012, 0.032691300287138424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b027f2ee-5cf1-48e1-8db5-56ada0eaa35a", 3, 0, 0.0, 367.0, 305, 487, 309.0, 487.0, 487.0, 487.0, 0.017768406588525163, 0.024495182910938825, 0.011394453443813337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 418.73684210526307, 138, 2197, 146.0, 1609.0, 2197.0, 2197.0, 0.09187798603454612, 13.074323359433935, 0.05276750698756262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 387.84210526315786, 137, 1134, 149.0, 1133.0, 1134.0, 1134.0, 0.0918806518690459, 4.2865327596837375, 0.05285876523284492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 162.4210526315789, 138, 447, 148.0, 153.0, 447.0, 447.0, 0.09187976324035746, 0.06828173811124222, 0.04611933428275755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 145.9090909090909, 139, 157, 145.0, 156.4, 157.0, 157.0, 0.05560666875612937, 0.014879128163261179, 0.03171317827498003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 206.1578947368421, 137, 444, 149.0, 428.0, 444.0, 444.0, 0.09188020755255306, 0.04637457021823967, 0.05118203584778835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 174.45454545454547, 141, 444, 149.0, 386.8000000000002, 444.0, 444.0, 0.05560357682645113, 0.041322580043876275, 0.027910389149214725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb992de8-2711-424f-a5e0-7bd45330a5c7", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 177.45454545454547, 149, 428, 153.0, 373.8000000000002, 428.0, 428.0, 0.05802422247541883, 0.04567140948748787, 0.020625797833059036], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 646.142857142857, 149, 1552, 528.5, 1412.5, 1552.0, 1552.0, 0.09081238161957396, 0.01753408707610078, 0.06180005546041878], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1563.409090909091, 753, 3791, 1383.5, 2432.2, 3587.899999999997, 3791.0, 0.09580754876386488, 0.04958789145004725, 0.04406772994900425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84e2bd85-7449-4deb-9e7a-e4cc34ad3566", 3, 0, 0.0, 320.6666666666667, 245, 459, 258.0, 459.0, 459.0, 459.0, 0.028967874627038617, 0.029052741447235016, 0.01857640397632359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 378.45454545454544, 288, 889, 301.0, 828.4000000000002, 889.0, 889.0, 0.0555620097284028, 0.08611026312399925, 0.12496026211378089], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1450.258620689655, 732, 2952, 1167.5, 2494.6, 2641.45, 2952.0, 0.25324303909111945, 89.80467965437784, 0.9181723097839138], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dba2f542-aaa1-4f88-8f38-4676729427dc", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.7676344651442308, 1.434326171875], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 299.6428571428572, 141, 634, 153.0, 595.0, 600.0, 634.0, 0.235712060881058, 0.1751727327446144, 0.11394284192980832], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 957.7857142857144, 680, 1337, 882.0, 1275.3, 1327.75, 1337.0, 0.23522888610721399, 69.16510284962993, 0.1183035901808742], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 231.19642857142853, 137, 603, 150.0, 433.70000000000005, 446.6, 603.0, 0.2359106572639419, 0.41745128023658473, 0.1147299876146905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b382d4be-ec8c-4aa4-abea-1778f991e01b", 2, 0, 0.0, 247.5, 232, 263, 247.5, 263.0, 263.0, 263.0, 0.015156222766162217, 0.025635329913079062, 0.009420835733068605], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1431.517857142857, 958, 2188, 1407.0, 1842.9, 1927.1999999999998, 2188.0, 0.234949590726204, 211.40805473276583, 0.11793368128248913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 175.21428571428572, 141, 431, 153.0, 303.0, 431.0, 431.0, 0.06590282158223261, 0.04923404151407025, 0.023426393609309246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, 4.069767441860465, 200.0639534883723, 139, 567, 154.0, 315.3000000000002, 392.19999999999993, 537.0700000000004, 0.7064786557189858, 1.5656222916606766, 0.338859297536361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 207.3, 145, 436, 156.5, 434.0, 436.0, 436.0, 0.05287983586098949, 0.04095088851344205, 0.018797129153711106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87611253-6c65-42ee-b619-61308a234b40", 1, 0, 0.0, 934.0, 934, 934, 934.0, 934.0, 934.0, 934.0, 1.0706638115631693, 0.1934304737687366, 0.738172510706638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1fcbfb4-7f88-4758-b4e3-3c4234b1098f", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 154.85, 142, 177, 151.5, 166.9, 176.5, 177.0, 0.0976124006793823, 0.07921475094195966, 0.03469815805399918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6153b1ff-1367-417f-b9ca-4bc6db431152", 3, 0, 0.0, 453.0, 271, 797, 291.0, 797.0, 797.0, 797.0, 0.041190685413005274, 0.026481641826394994, 0.02641459969518893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c821c51-6866-4385-a01d-6ad5dd6d18d5", 3, 0, 0.0, 410.66666666666663, 232, 740, 260.0, 740.0, 740.0, 740.0, 0.03654748126941585, 0.03046813135773893, 0.02343702412133764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 410.9, 290, 873, 302.5, 844.6000000000001, 873.0, 873.0, 0.04939296051526736, 0.07654944173606378, 0.11108592584634838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4243fba3-ea08-42cb-8cb6-b87cf80b9117", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a409950b-8dd8-476f-8ee8-069a59b32cc3", 3, 0, 0.0, 434.0, 254, 560, 488.0, 560.0, 560.0, 560.0, 0.053007279666407524, 0.034078573353240514, 0.0339922984839918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 652.263157894737, 287, 2346, 570.0, 1759.0, 2346.0, 2346.0, 0.09181316504141257, 17.463056526707966, 0.20278081388746605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 155.66666666666666, 145, 182, 152.5, 181.1, 182.0, 182.0, 0.06507521610394681, 0.053953963351807466, 0.023132205724449843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de211e94-c9ec-4a58-a7b8-d7598bf459da", 3, 0, 0.0, 328.3333333333333, 259, 466, 260.0, 466.0, 466.0, 466.0, 0.02913724614174299, 0.023683497270811277, 0.0186850178708443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 169.8, 145, 434, 150.0, 272.0000000000001, 434.0, 434.0, 0.16287175478028598, 0.12644828618196033, 0.057895819082054795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 147.21428571428572, 139, 156, 148.0, 154.0, 156.0, 156.0, 0.068547814548784, 0.05094227233557093, 0.0344077897246826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 270.2142857142857, 143, 445, 148.5, 445.0, 445.0, 445.0, 0.06845497129780846, 0.03300507544715765, 0.038219418963982905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 445.6428571428571, 137, 1701, 281.5, 1531.0, 1701.0, 1701.0, 0.06814475893791526, 8.775282390055732, 0.0392250663194529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 331.0, 143, 1171, 148.0, 1152.5, 1171.0, 1171.0, 0.06820750672331137, 2.880796572329189, 0.039327793706395914], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.4604758250191865], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15349194167306215], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.15349194167306215], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8442056792018419], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 21, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
