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

    var data = {"OkPercent": 98.66999168744805, "KoPercent": 1.3300083125519535};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6841349605168701, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29f4a1df-5c3c-416e-92d1-22c0453b93f2"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/8aedcba9-8f53-436a-a1a2-72aa0bc71b70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65d24ca8-6d23-4aa0-a5b2-41f442616a72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dc1fdc41-ece3-4005-86f2-06a91d06af2d"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b08bd33-e20d-4604-a339-3f49a867192c"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dcdf9815-0111-40a8-bcc3-30ea387b67a0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7d7c3e63-0b97-4a1d-973b-76ff8e659983"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/01300d89-9cf2-4d99-916c-8487e9ba0549"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac11e261-9990-429e-9cc2-ecb7abf262bf"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/793c3eb3-3cd3-46ca-b3c8-dcce4656df0c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85428b48-c42c-4170-b43c-579b354a3eb5"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be56be09-f24d-4964-97bc-f13bcfdd31aa"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb4f0491-a6c9-4186-842c-051f6a86aba0"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ac11e261-9990-429e-9cc2-ecb7abf262bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/29f4a1df-5c3c-416e-92d1-22c0453b93f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/47333fcc-bc1e-46ff-836e-82ae6d7ef5f9"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcdf9815-0111-40a8-bcc3-30ea387b67a0"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aedcba9-8f53-436a-a1a2-72aa0bc71b70"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4727272727272727, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7641509433962265, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06f12744-81c5-4aec-80ad-1c0810e2e246"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01300d89-9cf2-4d99-916c-8487e9ba0549"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b08bd33-e20d-4604-a339-3f49a867192c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/85428b48-c42c-4170-b43c-579b354a3eb5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=793c3eb3-3cd3-46ca-b3c8-dcce4656df0c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/3904db05-2214-41b9-86f5-5fb07a34cea8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/be56be09-f24d-4964-97bc-f13bcfdd31aa"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1203, 16, 1.3300083125519535, 712.9143807148783, 139, 14971, 287.0, 1463.4000000000012, 2464.5999999999985, 5660.1200000000035, 4.862059767364788, 699.4293677389907, 3.550667042873425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29f4a1df-5c3c-416e-92d1-22c0453b93f2", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["see books", 55, 0, 0.0, 3359.381818181818, 1699, 10370, 2276.0, 8401.0, 9713.599999999997, 10370.0, 0.24369818644240526, 293.25149528222465, 1.1982620788452252], "isController": true}, {"data": ["deleteBook", 11, 2, 18.181818181818183, 1204.090909090909, 147, 3925, 1003.0, 3574.200000000001, 3925.0, 3925.0, 0.07858939186099681, 0.015830906439328992, 0.05273247724479881], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 2, 18.181818181818183, 1204.090909090909, 147, 3925, 1003.0, 3574.200000000001, 3925.0, 3925.0, 0.07805847289242122, 0.01572395907252342, 0.05237623740420097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 222.33333333333334, 140, 432, 143.5, 432.0, 432.0, 432.0, 0.1162948462000659, 0.04082181287513164, 0.06578179614159543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 161.94444444444446, 142, 424, 144.0, 214.30000000000032, 424.0, 424.0, 0.11629259216187929, 0.08642447522967786, 0.05837343005000581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 221.66666666666663, 140, 707, 143.0, 463.10000000000036, 707.0, 707.0, 0.11629559756554549, 1.929313173545336, 0.06792743073951078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 251.61111111111111, 141, 1252, 143.0, 511.3000000000012, 1252.0, 1252.0, 0.11629559756554549, 5.843102954311982, 0.06781386082001319], "isController": false}, {"data": ["goToProfile", 11, 2, 18.181818181818183, 377.45454545454544, 142, 801, 289.0, 774.8000000000001, 801.0, 801.0, 0.07898950875706418, 0.13530740158625296, 0.051051458074523014], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8aedcba9-8f53-436a-a1a2-72aa0bc71b70", 3, 0, 0.0, 1666.6666666666667, 390, 2840, 1770.0, 2840.0, 2840.0, 2840.0, 0.02856082026675806, 0.023809980697645637, 0.01831536976741972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 145.06250000000003, 141, 173, 143.0, 153.40000000000003, 173.0, 173.0, 0.09468744266971245, 0.07036830456215934, 0.04752865774632051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 846.0, 843, 849, 846.0, 849.0, 849.0, 849.0, 0.018048098181654107, 5.306740118666245, 0.01029305599422461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 266.0, 140, 430, 144.0, 429.3, 430.0, 430.0, 0.09468744266971245, 0.052001807198612825, 0.052510382330139604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1269.0, 1267, 1271, 1269.0, 1271.0, 1271.0, 1271.0, 0.01798011399392272, 16.178538177400796, 0.010236725057086862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 284.5, 142, 427, 284.5, 427.0, 427.0, 427.0, 0.01816381948796193, 0.03214144620330763, 0.01005750551726017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 143.91666666666666, 142, 146, 144.0, 145.7, 146.0, 146.0, 0.05767400728614958, 0.042861249555429526, 0.028949648188555555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 189.91666666666666, 141, 424, 144.0, 423.4, 424.0, 424.0, 0.057675116071171095, 0.015432599417481327, 0.03289283963433976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 189.25, 139, 426, 142.5, 425.7, 426.0, 426.0, 0.05767567047966933, 0.015545395558973373, 0.03390698596558685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65d24ca8-6d23-4aa0-a5b2-41f442616a72", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 142.25, 140, 144, 142.0, 144.0, 144.0, 144.0, 0.05767539327408789, 0.0155453208434065, 0.03396314662526855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 144.0, 143, 145, 144.0, 145.0, 145.0, 145.0, 0.018163654527290893, 0.013498575288348016, 0.01019931772772682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc1fdc41-ece3-4005-86f2-06a91d06af2d", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.43095268218623484, 0.8052357456140351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 886.2857142857142, 141, 1705, 1254.5, 1552.5, 1705.0, 1705.0, 0.12507370414708668, 72.36017185629478, 0.06661989431272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 381.0625, 140, 1567, 143.0, 1454.3000000000002, 1567.0, 1567.0, 0.09468688231604115, 15.9956277130011, 0.05413981405863485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 646.2142857142857, 140, 1124, 724.5, 1057.5, 1124.0, 1124.0, 0.12507258676910707, 23.65342818935096, 0.06674144034484299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 399.18750000000006, 140, 1281, 284.0, 1077.3000000000002, 1281.0, 1281.0, 0.09468688231604115, 5.240939741416042, 0.054232281717146606], "isController": false}, {"data": ["deleteBooks", 11, 2, 18.181818181818183, 670.9090909090909, 150, 1239, 550.0, 1222.4, 1239.0, 1239.0, 0.07874297576863883, 0.01586184410680411, 0.053268952002577044], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 335.41666666666663, 286, 569, 289.5, 568.7, 569.0, 569.0, 0.05763439620765673, 0.08932205740385862, 0.1296211078771811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b08bd33-e20d-4604-a339-3f49a867192c", 1, 0, 0.0, 1239.0, 1239, 1239, 1239.0, 1239.0, 1239.0, 1239.0, 0.8071025020177562, 0.1458144168684423, 0.5564593422114608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 1534.9999999999998, 176, 4271, 1189.5, 3652.700000000001, 4271.0, 4271.0, 0.08961153400010952, 0.055044584849676656, 0.04051771508012765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 152.92857142857142, 142, 280, 143.5, 212.5, 280.0, 280.0, 0.12506923475495363, 0.09294696059425753, 0.06277889322660758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 274.7142857142857, 141, 565, 144.5, 497.0, 565.0, 565.0, 0.12507146941109207, 0.1542280577740852, 0.06457721934855631], "isController": false}, {"data": ["login", 18, 0, 0.0, 9964.72222222222, 2813, 20108, 9651.0, 18703.100000000002, 20108.0, 20108.0, 0.08613305643150747, 11.571391069796485, 0.1458261805013901], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 291.875, 144, 1841, 146.0, 1085.7000000000007, 1841.0, 1841.0, 0.09325476619281588, 0.07549629020883239, 0.03314915517010252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcdf9815-0111-40a8-bcc3-30ea387b67a0", 3, 0, 0.0, 1930.3333333333335, 248, 5085, 458.0, 5085.0, 5085.0, 5085.0, 0.01730652744526811, 0.023858445224840635, 0.01109826141509706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d7c3e63-0b97-4a1d-973b-76ff8e659983", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.44290698682385576, 0.8275723821081831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01300d89-9cf2-4d99-916c-8487e9ba0549", 3, 0, 0.0, 2468.3333333333335, 261, 6494, 650.0, 6494.0, 6494.0, 6494.0, 0.018607651466282935, 0.021993614086612417, 0.011932641077010867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac11e261-9990-429e-9cc2-ecb7abf262bf", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/793c3eb3-3cd3-46ca-b3c8-dcce4656df0c", 3, 0, 0.0, 2292.6666666666665, 670, 4342, 1866.0, 4342.0, 4342.0, 4342.0, 0.05656748500961647, 0.02559531385526266, 0.036275372874005354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85428b48-c42c-4170-b43c-579b354a3eb5", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1061.2142857142856, 287, 1851, 1400.0, 1697.0, 1851.0, 1851.0, 0.12490854909798184, 96.13388349322372, 0.2603771680555308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be56be09-f24d-4964-97bc-f13bcfdd31aa", 1, 0, 0.0, 1156.0, 1156, 1156, 1156.0, 1156.0, 1156.0, 1156.0, 0.8650519031141869, 0.1562837910899654, 0.5964127378892734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 4, 66.66666666666667, 566.8333333333334, 142, 1415, 144.0, 1415.0, 1415.0, 1415.0, 0.032677424801076174, 13.037016033723102, 0.038995911237221764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 447.3888888888889, 284, 1396, 289.5, 908.2000000000007, 1396.0, 1396.0, 0.11618600087784978, 7.89222028825424, 0.2596535236632155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb4f0491-a6c9-4186-842c-051f6a86aba0", 1, 0, 0.0, 2756.0, 2756, 2756, 2756.0, 2756.0, 2756.0, 2756.0, 0.36284470246734396, 0.11586935322931786, 0.2165020636792453], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 2283.5238095238096, 246, 5664, 1838.0, 5034.0, 5611.299999999999, 5664.0, 0.08391641924643055, 0.026504851168236438, 0.03786072821469816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 228.82352941176467, 143, 1106, 145.0, 557.9999999999995, 1106.0, 1106.0, 0.08407600470825626, 0.06527385131158567, 0.029886392298637966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 687.3125000000001, 287, 1711, 570.0, 1598.3000000000002, 1711.0, 1711.0, 0.09460626056929318, 21.340750639700925, 0.20823309134825746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 559.4375, 286, 1136, 566.0, 937.9000000000002, 1136.0, 1136.0, 0.09342301943198804, 7.1211388649249105, 0.20861661309440394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac11e261-9990-429e-9cc2-ecb7abf262bf", 3, 0, 0.0, 470.3333333333333, 276, 627, 508.0, 627.0, 627.0, 627.0, 0.02440889785689877, 0.02034869381885343, 0.015652841399118024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 177.6, 142, 425, 143.5, 400.9000000000001, 425.0, 425.0, 0.07798000592648045, 0.05795193799809729, 0.039142307662315384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 199.7, 139, 423, 142.5, 422.5, 423.0, 423.0, 0.0779806140193548, 0.020865906485647668, 0.04447331893291328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 199.8, 141, 423, 142.5, 422.7, 423.0, 423.0, 0.07798000592648045, 0.021018048472371684, 0.04584371442162229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 311.0, 150, 472, 311.0, 472.0, 472.0, 472.0, 0.01465931746217896, 0.004323353392166061, 0.009061863235897737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 257.9, 142, 428, 154.0, 427.9, 428.0, 428.0, 0.07780829592051104, 0.020971767259825243, 0.045818752382879066], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1408.4545454545453, 1122, 2124, 1257.0, 1985.2, 2051.5999999999995, 2124.0, 0.26131741989433277, 312.62648282788206, 0.5159998271741609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 2283.5238095238096, 246, 5664, 1838.0, 5034.0, 5611.299999999999, 5664.0, 0.08487386127569455, 0.02680725752346156, 0.038292699130245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29f4a1df-5c3c-416e-92d1-22c0453b93f2", 3, 0, 0.0, 2033.0, 503, 4504, 1092.0, 4504.0, 4504.0, 4504.0, 0.025879024188261275, 0.025954841641937818, 0.01659559819364411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 142.75, 141, 144, 143.0, 144.0, 144.0, 144.0, 0.026927866976337138, 0.00725790164596587, 0.01585693729172978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 213.0, 141, 425, 143.0, 425.0, 425.0, 425.0, 0.026928229536228566, 0.007257999367186606, 0.01583085369219687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 270.82352941176464, 139, 1134, 144.0, 567.5999999999995, 1134.0, 1134.0, 0.08150271835537103, 4.3345746891510295, 0.047502675806157774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 262.7058823529411, 141, 985, 143.0, 602.5999999999997, 985.0, 985.0, 0.08139306626831944, 1.428427740313028, 0.047518252095871454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 151.8235294117647, 141, 285, 144.0, 172.9999999999999, 285.0, 285.0, 0.0815007646689391, 0.06056843936822525, 0.04090956351546357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 212.75, 141, 424, 143.0, 424.0, 424.0, 424.0, 0.026928410819835467, 0.007205453676401287, 0.015357609295687415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 228.05882352941177, 140, 488, 143.0, 437.59999999999997, 488.0, 488.0, 0.0813954045112206, 0.028970928673685822, 0.046018702389673316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 144.0, 143, 145, 144.0, 145.0, 145.0, 145.0, 0.02692732315480518, 0.020011418867975334, 0.01351625400543932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47333fcc-bc1e-46ff-836e-82ae6d7ef5f9", 1, 0, 0.0, 2111.0, 2111, 2111, 2111.0, 2111.0, 2111.0, 2111.0, 0.4737091425864519, 0.1512723531501658, 0.28265262316437706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 1547.0, 146, 5750, 146.0, 5750.0, 5750.0, 5750.0, 0.026211632722602293, 0.020631421850017036, 0.009317416319362531], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 1089.909090909091, 143, 2931, 954.0, 2718.000000000001, 2931.0, 2931.0, 0.08008212057455281, 0.015733463497113402, 0.05449480239736748], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcdf9815-0111-40a8-bcc3-30ea387b67a0", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 6035.277777777778, 933, 14971, 5046.5, 13832.500000000002, 14971.0, 14971.0, 0.08666846423481377, 0.04485770121528447, 0.03986410806113016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 359.0, 288, 569, 289.5, 569.0, 569.0, 569.0, 0.02690124552766793, 0.04169167641836817, 0.06050153168966723], "isController": false}, {"data": ["addBook", 52, 3, 5.769230769230769, 2978.23076923077, 722, 21614, 1596.5, 7097.400000000008, 14474.949999999999, 21614.0, 0.2628971263321806, 91.72842043538544, 0.9545474330244292], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aedcba9-8f53-436a-a1a2-72aa0bc71b70", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 258.2, 141, 575, 145.0, 570.8, 574.0, 575.0, 0.26254988447805083, 0.19511763875761393, 0.12691620392249528], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 823.4363636363637, 694, 1167, 713.0, 1049.6, 1129.2, 1167.0, 0.26208322810294626, 77.06117104444931, 0.13180943600880599], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 236.14545454545456, 139, 572, 146.0, 428.4, 465.9999999999995, 572.0, 0.2627819530910324, 0.465000877930616, 0.12779825453059976], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1145.727272727273, 979, 1782, 995.0, 1424.2, 1540.1999999999998, 1782.0, 0.26207198879284876, 235.8128361892231, 0.1315478537495354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 295.9375, 142, 2244, 145.5, 989.6000000000013, 2244.0, 2244.0, 0.09545855905305109, 0.07131425554256259, 0.03393253466338926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 159, 3, 1.8867924528301887, 831.3396226415095, 141, 12959, 242.0, 2605.0, 4413.0, 8666.00000000004, 0.6898855831268739, 1.5438274629783098, 0.3288625796188707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 146.39999999999998, 143, 151, 147.0, 150.8, 151.0, 151.0, 0.08024844919871923, 0.06214552755330503, 0.02852581592610723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 531.0555555555555, 144, 4166, 147.5, 2519.0000000000027, 4166.0, 4166.0, 0.11517493793350568, 0.09346716154564767, 0.04094109121855084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06f12744-81c5-4aec-80ad-1c0810e2e246", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01300d89-9cf2-4d99-916c-8487e9ba0549", 1, 0, 0.0, 894.0, 894, 894, 894.0, 894.0, 894.0, 894.0, 1.1185682326621924, 0.20208508109619686, 0.7712003635346756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 464.6, 286, 853, 449.0, 828.5000000000001, 853.0, 853.0, 0.07772000590672044, 0.12045082946676304, 0.17479411484685273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 490.1176470588235, 285, 1278, 561.0, 889.9999999999997, 1278.0, 1278.0, 0.08133621040242285, 5.842545207383415, 0.18170288869139609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b08bd33-e20d-4604-a339-3f49a867192c", 3, 0, 0.0, 947.0, 289, 1473, 1079.0, 1473.0, 1473.0, 1473.0, 0.027292328126563622, 0.022485964351670745, 0.01750191614887055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85428b48-c42c-4170-b43c-579b354a3eb5", 3, 0, 0.0, 1433.6666666666665, 428, 2931, 942.0, 2931.0, 2931.0, 2931.0, 0.06202576136622077, 0.028065041764012654, 0.03977563473029132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 1282.75, 143, 4730, 148.0, 4505.000000000001, 4730.0, 4730.0, 0.056861527964025604, 0.04714398168111108, 0.020212496268462228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 1627.8571428571427, 144, 5345, 288.5, 5189.0, 5345.0, 5345.0, 0.11775888028127549, 0.09142413068712307, 0.04185960197498465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=793c3eb3-3cd3-46ca-b3c8-dcce4656df0c", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3904db05-2214-41b9-86f5-5fb07a34cea8", 1, 0, 0.0, 1954.0, 1954, 1954, 1954.0, 1954.0, 1954.0, 1954.0, 0.5117707267144319, 0.16342678480040942, 0.30536319728761513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 196.49999999999997, 141, 428, 144.0, 425.9, 428.0, 428.0, 0.09365542996622551, 0.06960134980888438, 0.04701063574476554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 238.5, 141, 545, 143.5, 466.6000000000001, 545.0, 545.0, 0.0936570746212742, 0.03385236791425694, 0.052922192190170685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 308.56249999999994, 140, 990, 146.0, 667.3000000000003, 990.0, 990.0, 0.09350218269157722, 5.281965921741595, 0.054466847632349415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be56be09-f24d-4964-97bc-f13bcfdd31aa", 3, 0, 0.0, 2440.6666666666665, 801, 5567, 954.0, 5567.0, 5567.0, 5567.0, 0.045896823939783365, 0.029507235443057337, 0.02943253358117618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 299.3125, 140, 846, 145.0, 632.5000000000002, 846.0, 846.0, 0.0936570746212742, 1.7448088920075393, 0.05464853719356576], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.41562759767248547], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 12.5, 0.1662510390689942], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 12.5, 0.1662510390689942], "isController": false}, {"data": ["401/Unauthorized", 7, 43.75, 0.5818786367414797], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1203, 16, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 159, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
