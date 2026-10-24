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

    var data = {"OkPercent": 99.01886792452831, "KoPercent": 0.9811320754716981};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8210116731517509, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.32727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79328e92-b62e-46d0-befb-c5168f279efd"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3baef088-ad20-4686-bf44-7d9af6d3e81d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36b2ee8f-2527-4c90-ab03-73f9f0ee0a72"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f27b8e2b-2ea6-458a-95ac-fec4e32eca2b"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fafaa47e-1f2c-44c1-ba44-b93df0902656"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/765b3bca-835d-4db1-86ba-1af49b2fbeae"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0df2f8d8-ec01-469b-a38a-29fd46aaec47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7cf9f47-3bf4-4366-aec1-77ad07830b54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=058736be-1e5f-456e-b0b8-44011bb3ee0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6249028e-ac31-4c57-bcf2-c9437244ab9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6deb7c7-1982-4fc8-b782-f57777074ec4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2c506fd-635e-4f42-b376-0e3b7f58068c"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4982950e-0e9b-4ab9-acf7-4fb183d0cdaf"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47ee3530-bcc5-432a-856e-1f039d03a7f3"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79328e92-b62e-46d0-befb-c5168f279efd"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec5cf201-d848-4768-ad39-6d549fb7b8e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8f63174-2f71-4acb-8f2a-6dd37da9f104"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fd2a989-0b48-47a0-aec6-b26037d35106"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2c506fd-635e-4f42-b376-0e3b7f58068c"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3baef088-ad20-4686-bf44-7d9af6d3e81d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.36507936507936506, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=765b3bca-835d-4db1-86ba-1af49b2fbeae"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9392265193370166, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f27b8e2b-2ea6-458a-95ac-fec4e32eca2b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fafaa47e-1f2c-44c1-ba44-b93df0902656"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36b2ee8f-2527-4c90-ab03-73f9f0ee0a72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24811151-4a22-473d-a498-94fe7f970a26"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6249028e-ac31-4c57-bcf2-c9437244ab9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/058736be-1e5f-456e-b0b8-44011bb3ee0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7fd2a989-0b48-47a0-aec6-b26037d35106"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec5cf201-d848-4768-ad39-6d549fb7b8e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8f63174-2f71-4acb-8f2a-6dd37da9f104"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4b653aa-8701-4748-b8a0-43b3e632c0ee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47ee3530-bcc5-432a-856e-1f039d03a7f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 13, 0.9811320754716981, 308.43547169811353, 80, 3725, 95.0, 831.4000000000001, 1001.7, 1503.0800000000004, 5.1440129512658155, 718.6029740402048, 3.745522342971725], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1424.2545454545452, 993, 3138, 1400.0, 1740.4, 1788.5999999999997, 3138.0, 0.24551379341130258, 295.4353528005312, 1.2071894041268636], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/79328e92-b62e-46d0-befb-c5168f279efd", 3, 0, 0.0, 336.6666666666667, 257, 406, 347.0, 406.0, 406.0, 406.0, 0.04058551367731811, 0.026092574711166425, 0.026026517559998914], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 564.9230769230769, 429, 884, 478.0, 864.8, 884.0, 884.0, 0.0978797735212625, 0.01768335752093121, 0.0665276585652331], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 564.9230769230769, 429, 884, 478.0, 864.8, 884.0, 884.0, 0.09720570971384133, 0.01756157841509829, 0.06606950582112654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 119.61111111111111, 80, 248, 84.0, 247.1, 248.0, 248.0, 0.14259797669315294, 0.06195337442267625, 0.07999474169960943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 96.33333333333333, 82, 283, 84.5, 112.90000000000026, 283.0, 283.0, 0.142594587743203, 0.10597117311775144, 0.07157579892578744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 198.33333333333331, 82, 742, 85.0, 655.6000000000001, 742.0, 742.0, 0.14259684702527134, 4.69285357086271, 0.08260900241622435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 203.16666666666669, 81, 980, 85.0, 838.7000000000003, 980.0, 980.0, 0.14259910637893336, 14.290933989487277, 0.08247105436194822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3baef088-ad20-4686-bf44-7d9af6d3e81d", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36b2ee8f-2527-4c90-ab03-73f9f0ee0a72", 1, 0, 0.0, 919.0, 919, 919, 919.0, 919.0, 919.0, 919.0, 1.088139281828074, 0.19658766322089227, 0.7502210282916213], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 218.57142857142856, 176, 347, 203.5, 322.0, 347.0, 347.0, 0.08445742139427137, 0.1698751217845853, 0.05460040328418715], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 85.29411764705883, 83, 92, 85.0, 88.8, 92.0, 92.0, 0.07947304694987121, 0.05906151243051952, 0.039891744269759576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 93.70588235294117, 81, 244, 85.0, 119.19999999999989, 244.0, 244.0, 0.07947341847897227, 0.021265348303943752, 0.045324683976288874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 534.25, 484, 660, 496.5, 660.0, 660.0, 660.0, 0.05588075047847893, 16.430796056216035, 0.031869490507257514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 908.25, 896, 913, 912.0, 913.0, 913.0, 913.0, 0.05568548836173293, 50.10590031253481, 0.03170374972157256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 170.75, 84, 265, 167.0, 265.0, 265.0, 265.0, 0.05633406098162101, 0.09968488134638406, 0.031192785719315542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 96.28571428571428, 82, 243, 85.0, 168.0, 243.0, 243.0, 0.09137367263423772, 0.06790562976040516, 0.0458653005214826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 108.14285714285714, 82, 251, 84.0, 248.0, 251.0, 251.0, 0.09137367263423772, 0.0342523797946703, 0.05156340761795362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 195.07142857142858, 82, 954, 87.0, 603.0, 954.0, 954.0, 0.09127418765972983, 5.889177906838393, 0.05309896240807386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f27b8e2b-2ea6-458a-95ac-fec4e32eca2b", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 162.99999999999997, 83, 665, 85.0, 458.5, 665.0, 665.0, 0.09127478273341895, 1.9398310723809027, 0.05318844412353389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 84.0, 82, 87, 83.5, 87.0, 87.0, 87.0, 0.05633247426310082, 0.0418642704240427, 0.03163200459109665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 707.2666666666667, 82, 1464, 910.0, 1257.6000000000001, 1464.0, 1464.0, 0.07847938346596349, 47.0843090119184, 0.04164107911768245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 84.23529411764706, 83, 87, 84.0, 86.2, 87.0, 87.0, 0.07947156086820342, 0.021420069140257954, 0.046720585588533654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 471.79999999999995, 81, 753, 651.0, 715.8000000000001, 753.0, 753.0, 0.0785447233654843, 15.403561152303455, 0.04175245223171741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fafaa47e-1f2c-44c1-ba44-b93df0902656", 3, 0, 0.0, 625.0, 181, 1091, 603.0, 1091.0, 1091.0, 1091.0, 0.0243619206938275, 0.02879496550758062, 0.015622716069934954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 104.0, 80, 257, 84.0, 250.6, 257.0, 257.0, 0.07947416154759568, 0.021420770104625397, 0.04679972598945331], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 559.5384615384615, 326, 1237, 467.0, 1109.8, 1237.0, 1237.0, 0.09721370563689932, 0.017563022991041382, 0.06702429314419037], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 304.2142857142858, 168, 1036, 184.5, 766.0, 1036.0, 1036.0, 0.09122422915526363, 7.926702095469414, 0.20349824556259286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/765b3bca-835d-4db1-86ba-1af49b2fbeae", 3, 0, 0.0, 287.6666666666667, 176, 492, 195.0, 492.0, 492.0, 492.0, 0.0368903863653132, 0.030201602118737857, 0.023656920943902017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 624.9565217391305, 96, 3725, 446.0, 1051.4000000000003, 3211.799999999993, 3725.0, 0.09318418461812716, 0.057239113403126936, 0.04213308347479773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 86.13333333333333, 83, 90, 86.0, 89.4, 90.0, 90.0, 0.07854184447667568, 0.05836947621752949, 0.039424324278331355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 164.26666666666665, 84, 260, 93.0, 258.8, 260.0, 260.0, 0.07854431208273334, 0.09966332307893704, 0.04039713967796832], "isController": false}, {"data": ["login", 23, 0, 0.0, 2405.1304347826085, 1110, 5742, 2175.0, 3754.4000000000015, 5425.599999999996, 5742.0, 0.09780159033890377, 20.485139407131012, 0.17576630070799848], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0df2f8d8-ec01-469b-a38a-29fd46aaec47", 2, 0, 0.0, 195.0, 192, 198, 195.0, 198.0, 198.0, 198.0, 0.028858779562212312, 0.024321412853700417, 0.017938098819675917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 117.35294117647061, 83, 343, 89.0, 264.5999999999999, 343.0, 343.0, 0.08157272208173587, 0.06603885410718656, 0.028996553552492046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7cf9f47-3bf4-4366-aec1-77ad07830b54", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=058736be-1e5f-456e-b0b8-44011bb3ee0e", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6249028e-ac31-4c57-bcf2-c9437244ab9f", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6deb7c7-1982-4fc8-b782-f57777074ec4", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.8209150064267352, 1.533880944730077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2c506fd-635e-4f42-b376-0e3b7f58068c", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 806.0666666666666, 178, 1555, 997.0, 1348.0, 1555.0, 1555.0, 0.07844244677679986, 62.6034817251978, 0.16303874435868068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4982950e-0e9b-4ab9-acf7-4fb183d0cdaf", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 355.9444444444445, 166, 1065, 332.0, 922.8000000000002, 1065.0, 1065.0, 0.14249976250039584, 19.138447920295132, 0.31643420568257385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 993.0, 980, 1001, 995.5, 1001.0, 1001.0, 1001.0, 0.055617352614015576, 66.53768944660735, 0.12541061248609567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47ee3530-bcc5-432a-856e-1f039d03a7f3", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 740.1739130434784, 295, 1147, 742.0, 1104.4, 1140.3999999999999, 1147.0, 0.09834439351440104, 0.03128380588527058, 0.04437022441763015], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 200.88235294117646, 168, 343, 171.0, 341.4, 343.0, 343.0, 0.07944036598643905, 0.12311705158249882, 0.17866324498707925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 97.16666666666669, 85, 256, 88.0, 109.30000000000024, 256.0, 256.0, 0.10907173890649523, 0.08467971917057002, 0.03877159468941822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79328e92-b62e-46d0-befb-c5168f279efd", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 360.6315789473684, 168, 1056, 172.0, 998.0, 1056.0, 1056.0, 0.09789071274743166, 24.77478796517409, 0.21488561116005647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec5cf201-d848-4768-ad39-6d549fb7b8e9", 3, 0, 0.0, 663.3333333333334, 179, 1408, 403.0, 1408.0, 1408.0, 1408.0, 0.03291928192073037, 0.027443450846025542, 0.021110346804635034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 99.58333333333333, 84, 252, 85.5, 203.1000000000002, 252.0, 252.0, 0.06297757998152657, 0.046802674185489966, 0.03161179307666471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 111.83333333333334, 82, 251, 84.5, 249.8, 251.0, 251.0, 0.06297956313176375, 0.01685195341611647, 0.035918032098584005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 98.0, 81, 245, 85.0, 197.90000000000015, 245.0, 245.0, 0.06297923259805079, 0.01697487128619338, 0.03702490041408846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8f63174-2f71-4acb-8f2a-6dd37da9f104", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.554184240797546, 2.114886886503067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 112.16666666666667, 83, 251, 85.0, 250.7, 251.0, 251.0, 0.06297956313176375, 0.016974960375358197, 0.037086598211380405], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 982.5272727272727, 653, 2768, 914.0, 1347.0, 1434.3999999999999, 2768.0, 0.24868760767043013, 297.5168365749386, 0.4910608815523533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 740.1739130434784, 295, 1147, 742.0, 1104.4, 1140.3999999999999, 1147.0, 0.0979657205165775, 0.031163348255358297, 0.04419937781119024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 117.8, 81, 243, 86.0, 243.0, 243.0, 243.0, 0.03332489102760634, 0.00898209953478452, 0.01962393485317053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 85.0, 82, 88, 85.0, 88.0, 88.0, 88.0, 0.033325113138759105, 0.008982159400681165, 0.019591521591340803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fd2a989-0b48-47a0-aec6-b26037d35106", 1, 0, 0.0, 1237.0, 1237, 1237, 1237.0, 1237.0, 1237.0, 1237.0, 0.8084074373484236, 0.14605017178658042, 0.5573590339531124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2c506fd-635e-4f42-b376-0e3b7f58068c", 3, 0, 0.0, 353.3333333333333, 223, 590, 247.0, 590.0, 590.0, 590.0, 0.03293048374880627, 0.027452789349183875, 0.02111753026860298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 149.38888888888889, 83, 574, 85.0, 294.1000000000004, 574.0, 574.0, 0.1064528147898444, 5.34856666644489, 0.06207437355475519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 121.44444444444444, 83, 413, 84.5, 265.4000000000002, 413.0, 413.0, 0.1063842362202863, 1.7648863129292307, 0.06213827512736557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3baef088-ad20-4686-bf44-7d9af6d3e81d", 3, 0, 0.0, 720.3333333333333, 235, 1680, 246.0, 1680.0, 1680.0, 1680.0, 0.0331928170743851, 0.027671485848795654, 0.021285758345227425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 86.0, 83, 97, 85.0, 91.60000000000001, 97.0, 97.0, 0.10645092612305727, 0.07911050271449861, 0.053433375026612724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 117.6, 83, 249, 85.0, 249.0, 249.0, 249.0, 0.033325113138759105, 0.008917071289082026, 0.019005728586948552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 112.22222222222223, 81, 261, 84.0, 250.20000000000002, 261.0, 261.0, 0.10645407393826846, 0.03736750533748899, 0.06021539577259045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 116.4, 82, 245, 85.0, 245.0, 245.0, 245.0, 0.033289391336768795, 0.024739479303985405, 0.016709714010839025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 122.0, 87, 253, 88.0, 253.0, 253.0, 253.0, 0.03325573661456602, 0.02617590206185567, 0.011821375124709012], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 634.5384615384615, 398, 1680, 590.0, 1308.3999999999996, 1680.0, 1680.0, 0.09895111814763506, 0.01787691099346923, 0.06735247006728677], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1295.6086956521735, 805, 3128, 1257.0, 1829.6, 2868.399999999996, 3128.0, 0.0954178680329399, 0.04938620122798648, 0.04388849203468232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 237.4, 171, 495, 171.0, 495.0, 495.0, 495.0, 0.033270341486785024, 0.05156253119094514, 0.0748257777774081], "isController": false}, {"data": ["addBook", 63, 9, 14.285714285714286, 917.5555555555555, 432, 2177, 745.0, 1572.4, 1730.8, 2177.0, 0.2803201879480117, 96.91640319442652, 1.0168428841498958], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 143.50909090909084, 82, 387, 86.0, 347.0, 367.5999999999999, 387.0, 0.24971736534558614, 0.1855809717070225, 0.12071298422467298], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 531.2727272727274, 402, 759, 497.0, 697.8, 738.0, 759.0, 0.24940935330422048, 73.33463104137475, 0.1254353681168687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=765b3bca-835d-4db1-86ba-1af49b2fbeae", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 156.50909090909087, 81, 1936, 86.0, 252.8, 267.7999999999998, 1936.0, 0.2500659264715243, 0.4424994714515645, 0.12161409314728427], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 837.509090909091, 567, 2683, 825.0, 1024.4, 1062.1999999999998, 2683.0, 0.24913030874039716, 224.16788972898019, 0.12505173700445718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 96.36842105263159, 84, 253, 87.0, 101.0, 253.0, 253.0, 0.09928047780036264, 0.07416949757546622, 0.03529110734309766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, 4.972375690607735, 155.49723756906076, 82, 1669, 89.0, 297.8000000000001, 363.4000000000001, 764.5400000000075, 0.7455340041766381, 1.5789300338476557, 0.3609651807816986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 101.0, 85, 252, 87.0, 203.40000000000018, 252.0, 252.0, 0.06106839150945797, 0.04729222115917985, 0.021707904794377637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f27b8e2b-2ea6-458a-95ac-fec4e32eca2b", 3, 0, 0.0, 381.66666666666663, 188, 751, 206.0, 751.0, 751.0, 751.0, 0.03832004904966278, 0.031372045364551404, 0.024573729371040264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fafaa47e-1f2c-44c1-ba44-b93df0902656", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 114.33333333333333, 83, 251, 87.0, 250.1, 251.0, 251.0, 0.13412716745776856, 0.10884733999746649, 0.04767801655725368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 227.08333333333331, 170, 503, 171.5, 453.20000000000016, 503.0, 503.0, 0.06294916854639879, 0.09755891648743639, 0.14157415543198867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 254.83333333333334, 168, 659, 173.0, 390.8000000000004, 659.0, 659.0, 0.10632893446593339, 7.222654773209244, 0.23762486265845964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36b2ee8f-2527-4c90-ab03-73f9f0ee0a72", 3, 0, 0.0, 330.33333333333337, 189, 601, 201.0, 601.0, 601.0, 601.0, 0.028268817609588784, 0.028351636411179375, 0.018128115459274056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24811151-4a22-473d-a498-94fe7f970a26", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6249028e-ac31-4c57-bcf2-c9437244ab9f", 3, 0, 0.0, 331.66666666666663, 186, 604, 205.0, 604.0, 604.0, 604.0, 0.034378437843784374, 0.028659889100889256, 0.02204606853914558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/058736be-1e5f-456e-b0b8-44011bb3ee0e", 3, 0, 0.0, 262.6666666666667, 184, 398, 206.0, 398.0, 398.0, 398.0, 0.03263388049472963, 0.027205523420248234, 0.020927325707883256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fd2a989-0b48-47a0-aec6-b26037d35106", 3, 0, 0.0, 364.3333333333333, 218, 441, 434.0, 441.0, 441.0, 441.0, 0.048204386599180526, 0.030990775889772636, 0.0309123182292922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec5cf201-d848-4768-ad39-6d549fb7b8e9", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 117.5, 85, 250, 87.5, 248.0, 250.0, 250.0, 0.09170706144373117, 0.07603446793528101, 0.03259899449757631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8f63174-2f71-4acb-8f2a-6dd37da9f104", 3, 0, 0.0, 393.0, 224, 580, 375.0, 580.0, 580.0, 580.0, 0.09145504984300216, 0.04048791269091242, 0.058647932353748135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 88.86666666666666, 84, 96, 88.0, 96.0, 96.0, 96.0, 0.07723439092959312, 0.05996224686428373, 0.02745441240075381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4b653aa-8701-4748-b8a0-43b3e632c0ee", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47ee3530-bcc5-432a-856e-1f039d03a7f3", 3, 0, 0.0, 433.66666666666663, 297, 707, 297.0, 707.0, 707.0, 707.0, 0.01836210062431142, 0.025313638067694946, 0.011775175205043457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 93.78947368421052, 82, 252, 85.0, 90.0, 252.0, 252.0, 0.09793461060683377, 0.07278148307793017, 0.04915858383975836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 154.26315789473682, 82, 259, 85.0, 255.0, 259.0, 259.0, 0.09793410581006969, 0.05717185309368686, 0.05412147952661746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 238.68421052631578, 83, 970, 85.0, 745.0, 970.0, 970.0, 0.0979351154088018, 18.572879189303425, 0.05580328379019205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 215.10526315789474, 83, 674, 85.0, 661.0, 674.0, 674.0, 0.09793461060683377, 6.0831608202281355, 0.05589863542294866], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 30.76923076923077, 0.3018867924528302], "isController": false}, {"data": ["401/Unauthorized", 9, 69.23076923076923, 0.6792452830188679], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 13, "401/Unauthorized", 9, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
