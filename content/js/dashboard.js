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

    var data = {"OkPercent": 98.83900928792569, "KoPercent": 1.1609907120743035};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7444963308872582, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d4293410-eb09-4aa1-9bad-71a294c13844"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc56cfa2-e47a-4e0d-ad7d-34e344ebe34d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ed72b0b-1117-4ffc-ae60-67cf256bba93"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9daac24c-7204-4601-9326-873bf6487324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c47195a-40fd-4697-bbc7-0ac9198a8b7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f53c2d92-f108-4dea-9b69-79ebbc7a6b87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/721db0d5-c015-4eff-87b1-836cc66de5a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c53eddb4-bebc-4c78-abb9-5d9f33554a52"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bfdd73cd-ad3f-4fdd-bbbb-178cc8926f96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46cf59dd-a75a-4cdb-9259-0ec44ad7f93d"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/506a61c8-b75c-4c27-ab9a-e0fc8609afbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ee678a4-76c3-46a3-97f5-ae01da506ae6"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d1c29be-9619-4d5d-b5d4-95595ffc60f6"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.19444444444444445, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4293410-eb09-4aa1-9bad-71a294c13844"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc56cfa2-e47a-4e0d-ad7d-34e344ebe34d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ed72b0b-1117-4ffc-ae60-67cf256bba93"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c47195a-40fd-4697-bbc7-0ac9198a8b7c"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3055555555555556, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9daac24c-7204-4601-9326-873bf6487324"], "isController": false}, {"data": [0.9416666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c53eddb4-bebc-4c78-abb9-5d9f33554a52"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=721db0d5-c015-4eff-87b1-836cc66de5a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfdd73cd-ad3f-4fdd-bbbb-178cc8926f96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f53c2d92-f108-4dea-9b69-79ebbc7a6b87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b36a14a4-8790-47e7-8ad1-460c4a7de2cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/25603d0b-dd06-4677-be0e-cb26e2cbe4dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ee678a4-76c3-46a3-97f5-ae01da506ae6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=506a61c8-b75c-4c27-ab9a-e0fc8609afbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/00d54bef-75ca-47bb-84fe-1484a94ad67f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d1c29be-9619-4d5d-b5d4-95595ffc60f6"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 15, 1.1609907120743035, 481.1896284829729, 139, 2745, 164.0, 1348.400000000001, 1623.6999999999998, 2160.259999999999, 5.101758764205555, 683.5746541899971, 3.729312975328337], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2460.462962962962, 1800, 3399, 2439.5, 2871.5, 3132.75, 3399.0, 0.23632488544807634, 284.37890712185833, 1.1620076154600238], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 567.7692307692307, 162, 1225, 519.0, 1066.6, 1225.0, 1225.0, 0.07521363565357757, 0.014249458317181687, 0.05084491490734258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 567.7692307692307, 162, 1225, 519.0, 1066.6, 1225.0, 1225.0, 0.0768616785408106, 0.014561685192302007, 0.0519590027936264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4293410-eb09-4aa1-9bad-71a294c13844", 3, 0, 0.0, 644.0, 265, 1155, 512.0, 1155.0, 1155.0, 1155.0, 0.01928689905237036, 0.026588547358980624, 0.012368226280328649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 11, 0, 0.0, 280.9090909090909, 143, 454, 155.0, 454.0, 454.0, 454.0, 0.14157014157014156, 0.05721122908622908, 0.07965834137709138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc56cfa2-e47a-4e0d-ad7d-34e344ebe34d", 1, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 1.1454753722794961, 0.20694623424971365, 0.7897515750286369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 11, 0, 0.0, 203.54545454545453, 143, 450, 155.0, 447.0, 450.0, 450.0, 0.14105638408371055, 0.10482803543721067, 0.07080369279201877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 11, 0, 0.0, 291.0, 141, 846, 153.0, 765.4000000000003, 846.0, 846.0, 0.14157378568302917, 3.818998116103375, 0.0822621117982445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 11, 0, 0.0, 301.54545454545456, 139, 1551, 148.0, 1331.000000000001, 1551.0, 1551.0, 0.14157014157014156, 11.615148910070785, 0.08212174227799228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ed72b0b-1117-4ffc-ae60-67cf256bba93", 3, 0, 0.0, 619.0, 370, 1012, 475.0, 1012.0, 1012.0, 1012.0, 0.03440327519179826, 0.028680594975975048, 0.02206199613536542], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 375.53846153846155, 167, 1155, 302.0, 908.5999999999998, 1155.0, 1155.0, 0.07588139154798039, 0.16855564513775392, 0.049050433764300724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9daac24c-7204-4601-9326-873bf6487324", 1, 0, 0.0, 908.0, 908, 908, 908.0, 908.0, 908.0, 908.0, 1.1013215859030838, 0.19896923182819382, 0.759309609030837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 163.54545454545453, 142, 443, 150.0, 163.6, 401.4499999999994, 443.0, 0.11821474245306338, 0.08785294824880979, 0.059338259395385326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 201.1818181818182, 141, 450, 151.5, 433.3, 447.9, 450.0, 0.1182191891238346, 0.03970376353475376, 0.06697058290120637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1091.3333333333333, 946, 1202, 1126.0, 1202.0, 1202.0, 1202.0, 0.04459507670353193, 13.112433246744558, 0.02543312968248305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1555.0, 1359, 1687, 1619.0, 1687.0, 1687.0, 1687.0, 0.044270641186453186, 39.83480075905703, 0.025204867003615437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 356.0, 160, 464, 444.0, 464.0, 464.0, 464.0, 0.0452447742285766, 0.08006204189666094, 0.025052526355080987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 171.06249999999997, 143, 468, 152.0, 251.00000000000023, 468.0, 468.0, 0.07540731733755614, 0.056040008294804905, 0.037850938585452985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 215.75000000000003, 141, 638, 149.5, 509.90000000000015, 638.0, 638.0, 0.07529730670946064, 0.020147912146867394, 0.04294299523273926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 188.43750000000003, 142, 473, 154.0, 445.0, 473.0, 473.0, 0.07540838352703862, 0.020324915872522126, 0.04433188172195044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 203.56249999999997, 140, 474, 147.5, 455.1, 474.0, 474.0, 0.07529057456119712, 0.020293162674697662, 0.044336148887111196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c47195a-40fd-4697-bbc7-0ac9198a8b7c", 3, 0, 0.0, 357.6666666666667, 251, 548, 274.0, 548.0, 548.0, 548.0, 0.026463427543135385, 0.026540957116015666, 0.016970362063794504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 263.0, 160, 459, 170.0, 459.0, 459.0, 459.0, 0.04504098729844158, 0.03347284309972075, 0.025291570016214758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1051.375, 140, 1857, 1459.0, 1824.8, 1857.0, 1857.0, 0.07729020539872085, 43.47397622178907, 0.04128685776669951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 252.13636363636363, 143, 1598, 150.0, 429.5, 1422.9499999999975, 1598.0, 0.11803714951014584, 4.858097423906278, 0.06893185098346406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 780.875, 143, 1311, 1064.5, 1292.8, 1311.0, 1311.0, 0.07729281901403348, 14.211971782082559, 0.04136373517547885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 267.6363636363637, 143, 1187, 151.0, 537.8, 1094.2999999999988, 1187.0, 0.1182198243898245, 1.6104407416413211, 0.0691539793061571], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 590.0769230769231, 184, 1211, 528.0, 1089.8, 1211.0, 1211.0, 0.07670114284702842, 0.014531271203440931, 0.052461230891090276], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 430.25, 300, 943, 309.0, 834.5000000000001, 943.0, 943.0, 0.07523923726223225, 0.11660612259293221, 0.16921480802238367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 666.6842105263158, 165, 1588, 658.0, 1210.0, 1588.0, 1588.0, 0.0905887793877152, 0.05564486546374303, 0.04095957505518764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f53c2d92-f108-4dea-9b69-79ebbc7a6b87", 3, 0, 0.0, 397.6666666666667, 347, 483, 363.0, 483.0, 483.0, 483.0, 0.02098944231051781, 0.028935640685235325, 0.013460026481679715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 149.93749999999997, 145, 156, 150.5, 155.3, 156.0, 156.0, 0.07729281901403348, 0.05744124538054637, 0.038797372044153525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/721db0d5-c015-4eff-87b1-836cc66de5a7", 3, 0, 0.0, 720.0, 539, 1040, 581.0, 1040.0, 1040.0, 1040.0, 0.019412324237580963, 0.022944710060760574, 0.012448658446625814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 240.49999999999997, 143, 455, 153.5, 452.2, 455.0, 455.0, 0.0772950593964222, 0.09324093956975638, 0.04002510277827429], "isController": false}, {"data": ["login", 19, 0, 0.0, 2813.2105263157896, 1764, 4338, 2730.0, 4337.0, 4338.0, 4338.0, 0.08622450137278483, 16.408328499750404, 0.15267001684781376], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 194.27272727272728, 141, 454, 155.5, 449.09999999999997, 453.85, 454.0, 0.11797448533630772, 0.09550864096074131, 0.04193624283439064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c53eddb4-bebc-4c78-abb9-5d9f33554a52", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfdd73cd-ad3f-4fdd-bbbb-178cc8926f96", 3, 0, 0.0, 605.6666666666666, 238, 1040, 539.0, 1040.0, 1040.0, 1040.0, 0.016543144520910536, 0.022806060236346393, 0.010608722235089112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46cf59dd-a75a-4cdb-9259-0ec44ad7f93d", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1203.9375, 289, 2014, 1609.0, 1974.8, 2014.0, 2014.0, 0.07723349616728775, 57.79370639022707, 0.1613493717537796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/506a61c8-b75c-4c27-ab9a-e0fc8609afbb", 3, 0, 0.0, 520.0, 302, 820, 438.0, 820.0, 820.0, 820.0, 0.03974984100063599, 0.0255553177006042, 0.025490620693767226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ee678a4-76c3-46a3-97f5-ae01da506ae6", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 0.6273057725694445, 2.393934461805556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 11, 0, 0.0, 614.0, 287, 1695, 576.0, 1536.8000000000006, 1695.0, 1695.0, 0.14078017815091634, 15.509441270669091, 0.31334338125191974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 1405.5, 167, 1857, 1799.0, 1857.0, 1857.0, 1857.0, 0.04376942268131483, 39.27551261516829, 0.08108456526020921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d1c29be-9619-4d5d-b5d4-95595ffc60f6", 3, 0, 0.0, 419.6666666666667, 367, 464, 428.0, 464.0, 464.0, 464.0, 0.023265733452247084, 0.027499309298538138, 0.01491975745472876], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1229.428571428571, 296, 2055, 1245.0, 1622.8, 2012.8999999999994, 2055.0, 0.08552125203112974, 0.027154906476402244, 0.03858478363123236], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 180.06666666666666, 150, 484, 158.0, 300.4000000000001, 484.0, 484.0, 0.07773833277188982, 0.06035349077505117, 0.027633547977507708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 517.909090909091, 300, 2042, 444.0, 687.0999999999999, 1843.8499999999972, 2042.0, 0.11794159746532785, 6.5880758615767725, 0.26388175952780474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 502.0, 292, 1732, 311.5, 957.8000000000009, 1732.0, 1732.0, 0.08496492541672641, 6.476423436313478, 0.18972941658302933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 191.125, 144, 456, 150.5, 456.0, 456.0, 456.0, 0.045172474152874946, 0.03357055940462679, 0.02267446456501731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 219.875, 145, 445, 149.5, 445.0, 445.0, 445.0, 0.04525014847704969, 0.02060340012443791, 0.025331687123504625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 406.875, 142, 1888, 153.5, 1888.0, 1888.0, 1888.0, 0.0452465655028873, 5.099788339747977, 0.026113984582232807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 314.0, 144, 896, 156.0, 896.0, 896.0, 896.0, 0.04524963658885615, 1.6737836155308066, 0.026159946152932458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.602836277173913, 3.3595872961956523], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1684.2592592592594, 1140, 2745, 1599.0, 2250.0, 2496.5, 2745.0, 0.23318982083248765, 278.97609561430403, 0.46045880637040043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1229.428571428571, 296, 2055, 1245.0, 1622.8, 2012.8999999999994, 2055.0, 0.08633093525179857, 0.02741199897225077, 0.038950089928057555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 197.53846153846152, 142, 472, 150.0, 464.4, 472.0, 472.0, 0.07332660232727355, 0.01976381078352295, 0.04317963008139253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 198.3076923076923, 144, 481, 151.0, 464.2, 481.0, 481.0, 0.07320891571964365, 0.019732090565060197, 0.04303883521799362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 323.1333333333334, 144, 1556, 154.0, 909.8000000000004, 1556.0, 1556.0, 0.0746755348012884, 4.498330729542637, 0.04347321824173964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 317.4, 144, 1201, 154.0, 748.6000000000003, 1201.0, 1201.0, 0.074807744097669, 1.4852161974974316, 0.043623239836121167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 189.26666666666668, 143, 435, 154.0, 426.0, 435.0, 435.0, 0.07520116311132279, 0.05588680188253578, 0.037747458827363196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 195.69230769230768, 141, 446, 152.0, 445.2, 446.0, 446.0, 0.0733303249097473, 0.019621590844990974, 0.04182120092509025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 146.86666666666667, 139, 156, 147.0, 154.8, 156.0, 156.0, 0.07519927808693036, 0.02765140121321502, 0.042466050659247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 176.07692307692307, 142, 446, 153.0, 334.39999999999986, 446.0, 446.0, 0.07332536155043656, 0.05449277357410374, 0.03680589437199648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 202.23076923076925, 147, 461, 159.0, 447.4, 461.0, 461.0, 0.07612444590186973, 0.059918265036042, 0.027059861629180258], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 560.7272727272727, 464, 820, 539.0, 787.6000000000001, 820.0, 820.0, 0.07193256648857907, 0.012995629687878055, 0.04896191293216759], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1413.2631578947367, 902, 2294, 1443.0, 1734.0, 2294.0, 2294.0, 0.087447991457712, 0.04526116745369859, 0.0402226601333812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 425.2307692307692, 289, 919, 318.0, 804.9999999999999, 919.0, 919.0, 0.07314383453739337, 0.11335865762777665, 0.16450219818321968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4293410-eb09-4aa1-9bad-71a294c13844", 1, 0, 0.0, 1211.0, 1211, 1211, 1211.0, 1211.0, 1211.0, 1211.0, 0.8257638315441783, 0.1491858484723369, 0.5693254541701073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc56cfa2-e47a-4e0d-ad7d-34e344ebe34d", 2, 0, 0.0, 299.0, 251, 347, 299.0, 347.0, 347.0, 347.0, 0.02153849467460719, 0.030667114487868442, 0.013387941269909645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ed72b0b-1117-4ffc-ae60-67cf256bba93", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["addBook", 63, 8, 12.698412698412698, 1440.0634920634918, 765, 2825, 1236.0, 2466.6, 2591.2, 2825.0, 0.30163890471562155, 87.03969861994216, 1.0990097909953604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c47195a-40fd-4697-bbc7-0ac9198a8b7c", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 267.77777777777777, 141, 801, 157.0, 609.0, 648.25, 801.0, 0.23494707164580422, 0.17460422023677444, 0.11357304732878232], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 966.5555555555558, 707, 1488, 891.5, 1225.5, 1302.0, 1488.0, 0.23487553771274722, 69.0612066893858, 0.11812588078326643], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 223.2962962962963, 139, 632, 153.0, 455.0, 500.5, 632.0, 0.23535975173904705, 0.4164764356944856, 0.11446206676371624], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1412.9259259259256, 987, 1915, 1405.5, 1751.5, 1876.0, 1915.0, 0.23402862950234246, 210.57937220465803, 0.11747140191816798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 176.4375, 146, 483, 156.0, 261.10000000000025, 483.0, 483.0, 0.07917813100021774, 0.059151631069498604, 0.02814535125398365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9daac24c-7204-4601-9326-873bf6487324", 3, 0, 0.0, 475.3333333333333, 252, 613, 561.0, 613.0, 613.0, 613.0, 0.0367728175332794, 0.02364137845970925, 0.02358152686867201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 8, 4.444444444444445, 220.92222222222227, 142, 1056, 160.0, 395.5, 446.95, 723.089999999999, 0.7280051445696882, 1.4592490273042373, 0.3540493769489304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 229.25, 149, 454, 162.5, 454.0, 454.0, 454.0, 0.044863922116231206, 0.0347432521857142, 0.01594772231475406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 11, 0, 0.0, 153.45454545454547, 145, 161, 154.0, 160.6, 161.0, 161.0, 0.14758761337412118, 0.1197708073377878, 0.052462784441582144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 635.6250000000001, 293, 2042, 331.0, 2042.0, 2042.0, 2042.0, 0.0451299177507249, 6.810083654296369, 0.10005487868513985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c53eddb4-bebc-4c78-abb9-5d9f33554a52", 3, 0, 0.0, 445.3333333333333, 320, 658, 358.0, 658.0, 658.0, 658.0, 0.0836540070269366, 0.03785125968992248, 0.05364531049578941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 554.5333333333333, 301, 1711, 321.0, 1208.8000000000002, 1711.0, 1711.0, 0.07461906964943961, 6.059291924102458, 0.1665472372911288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=721db0d5-c015-4eff-87b1-836cc66de5a7", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfdd73cd-ad3f-4fdd-bbbb-178cc8926f96", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f53c2d92-f108-4dea-9b69-79ebbc7a6b87", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b36a14a4-8790-47e7-8ad1-460c4a7de2cf", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 176.93749999999997, 145, 459, 160.5, 261.6000000000002, 459.0, 459.0, 0.07883520977556602, 0.06536239560493705, 0.028023453474908228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25603d0b-dd06-4677-be0e-cb26e2cbe4dd", 1, 0, 0.0, 994.0, 994, 994, 994.0, 994.0, 994.0, 994.0, 1.006036217303823, 0.32126351861167, 0.6002813757545271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ee678a4-76c3-46a3-97f5-ae01da506ae6", 3, 0, 0.0, 340.6666666666667, 239, 475, 308.0, 475.0, 475.0, 475.0, 0.07680294923325055, 0.03475133445124293, 0.049251891272624866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=506a61c8-b75c-4c27-ab9a-e0fc8609afbb", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 177.18749999999997, 147, 463, 157.0, 271.9000000000002, 463.0, 463.0, 0.07778015439360647, 0.060385959709880026, 0.0276484142571023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00d54bef-75ca-47bb-84fe-1484a94ad67f", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.5816683743169399, 1.0868482468123861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 149.0, 140, 158, 150.5, 155.2, 158.0, 158.0, 0.08503130214810327, 0.06319220794404941, 0.04268172783605965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 241.1875, 142, 460, 152.5, 457.9, 460.0, 460.0, 0.0850335616838771, 0.030735397478754894, 0.04804935998958339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 313.1875, 142, 1588, 155.0, 792.1000000000008, 1588.0, 1588.0, 0.08503491746298324, 4.803647607662178, 0.04953450026041944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d1c29be-9619-4d5d-b5d4-95595ffc60f6", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 228.9375, 139, 856, 148.0, 583.7000000000003, 856.0, 856.0, 0.08503401360544217, 1.5841633284173045, 0.049617014774659865], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 26.666666666666668, 0.30959752321981426], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07739938080495357], "isController": false}, {"data": ["401/Unauthorized", 10, 66.66666666666667, 0.7739938080495357], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 15, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
