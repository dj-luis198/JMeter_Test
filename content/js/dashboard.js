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

    var data = {"OkPercent": 98.96907216494846, "KoPercent": 1.0309278350515463};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7965986394557824, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5bc9f525-4fb1-4012-a70c-c2c0011e4463"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca54cd5b-ae20-4d1a-8e42-472baebf2951"], "isController": false}, {"data": [0.26851851851851855, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2300f2fa-e9df-453b-96c9-800320a56a02"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=718f9b4b-804a-4f92-9457-ffef62b4b7b0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=684e7c90-edb4-44fb-bdf4-e5e59eeefb89"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9647b20b-67f6-4db7-b49f-64800039d8db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae63bafd-55c6-4f3e-b53e-c17f31703960"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ee0de342-18d6-4943-bcb3-1f4415b9805a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/29157a7e-b641-46b7-b138-4260a74fb3c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/142faee5-e7fc-42e1-90cb-b5caad9f3cf8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1965b0a-6d25-4ad7-8f74-3d0092f238b5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50b60e96-d588-4e10-8d26-37ef4165e05d"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae63bafd-55c6-4f3e-b53e-c17f31703960"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/684e7c90-edb4-44fb-bdf4-e5e59eeefb89"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38bd4c4c-8afc-43dc-847e-363e4c384d3b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2300f2fa-e9df-453b-96c9-800320a56a02"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=367d4471-e049-495d-b15b-59fc1aa33f8b"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca54cd5b-ae20-4d1a-8e42-472baebf2951"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29157a7e-b641-46b7-b138-4260a74fb3c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=142faee5-e7fc-42e1-90cb-b5caad9f3cf8"], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82fbbc63-5719-420c-8f38-b8d1490b08d8"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee0de342-18d6-4943-bcb3-1f4415b9805a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9647b20b-67f6-4db7-b49f-64800039d8db"], "isController": false}, {"data": [0.5648148148148148, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9352941176470588, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de82fc53-7386-444d-bd67-79e09fe66910"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50b60e96-d588-4e10-8d26-37ef4165e05d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/718f9b4b-804a-4f92-9457-ffef62b4b7b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bf247fc-27fc-4c8e-a4b8-cdbba118f253"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bc9f525-4fb1-4012-a70c-c2c0011e4463"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/367d4471-e049-495d-b15b-59fc1aa33f8b"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1261, 13, 1.0309278350515463, 340.7605075337033, 100, 2924, 124.0, 815.0, 1010.0, 1784.3999999999965, 5.065823567930645, 704.9716428373433, 3.6928148965744425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/5bc9f525-4fb1-4012-a70c-c2c0011e4463", 3, 0, 0.0, 703.0, 199, 1610, 300.0, 1610.0, 1610.0, 1610.0, 0.017499752086845437, 0.020684114527127533, 0.01122217174840023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca54cd5b-ae20-4d1a-8e42-472baebf2951", 1, 0, 0.0, 1348.0, 1348, 1348, 1348.0, 1348.0, 1348.0, 1348.0, 0.741839762611276, 0.13402378523738873, 0.5114637425816023], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1502.814814814815, 1220, 2247, 1445.5, 1781.0, 1916.25, 2247.0, 0.24431293772734677, 293.9923848024911, 1.2012848061105381], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2300f2fa-e9df-453b-96c9-800320a56a02", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=718f9b4b-804a-4f92-9457-ffef62b4b7b0", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 530.6428571428572, 108, 1004, 494.5, 897.5, 1004.0, 1004.0, 0.09105335726735866, 0.017193180672624157, 0.06157661123793543], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 530.6428571428572, 108, 1004, 494.5, 897.5, 1004.0, 1004.0, 0.09387404784894325, 0.017725798516119516, 0.06348415833534492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 149.84615384615387, 101, 307, 104.0, 306.2, 307.0, 307.0, 0.08104131860459317, 0.040411078192404554, 0.04517176863326933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 120.23076923076924, 102, 304, 104.0, 228.39999999999992, 304.0, 304.0, 0.08104131860459317, 0.06022699556454629, 0.04067894312769618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 210.76923076923077, 101, 708, 103.0, 705.6, 708.0, 708.0, 0.08104131860459317, 3.684457833578535, 0.04665111361681171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 257.7692307692308, 100, 905, 104.0, 904.2, 905.0, 905.0, 0.08104232903185586, 11.237256775606259, 0.046572552365812606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=684e7c90-edb4-44fb-bdf4-e5e59eeefb89", 1, 0, 0.0, 859.0, 859, 859, 859.0, 859.0, 859.0, 859.0, 1.1641443538998835, 0.2103190483119907, 0.8026229627473807], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 251.14285714285714, 102, 415, 215.5, 399.0, 415.0, 415.0, 0.09050300276034158, 0.18886567617055938, 0.05850246418666891], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9647b20b-67f6-4db7-b49f-64800039d8db", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 114.55555555555554, 102, 300, 103.0, 128.10000000000028, 300.0, 300.0, 0.1054030789410504, 0.07833178034583922, 0.05290740485908194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae63bafd-55c6-4f3e-b53e-c17f31703960", 3, 0, 0.0, 367.33333333333337, 209, 643, 250.0, 643.0, 643.0, 643.0, 0.03281378178835111, 0.02735549972655182, 0.021042692097347552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 113.83333333333331, 100, 301, 103.0, 126.40000000000028, 301.0, 301.0, 0.10540431337873526, 0.0282038885407944, 0.06011339747380996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 656.0, 500, 768, 700.0, 768.0, 768.0, 768.0, 0.038643858202802965, 11.362577408478462, 0.022039075381286067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 705.0, 703, 708, 704.0, 708.0, 708.0, 708.0, 0.03863987635239567, 34.768228663543276, 0.02199907022797527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 170.66666666666666, 104, 304, 104.0, 304.0, 304.0, 304.0, 0.03894283192273742, 0.06891055805078145, 0.021563071972843864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 118.22222222222223, 101, 363, 103.0, 133.50000000000037, 363.0, 363.0, 0.08493490683112581, 0.06312057040867847, 0.04263334190546745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee0de342-18d6-4943-bcb3-1f4415b9805a", 3, 0, 0.0, 1058.0, 222, 2001, 951.0, 2001.0, 2001.0, 2001.0, 0.02655313725316646, 0.02663092964746285, 0.017027890751542294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29157a7e-b641-46b7-b138-4260a74fb3c4", 3, 0, 0.0, 867.0, 190, 1951, 460.0, 1951.0, 1951.0, 1951.0, 0.03316639580776757, 0.02764945952594165, 0.021268815019955114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 125.11111111111109, 100, 304, 102.5, 303.1, 304.0, 304.0, 0.08493610917121233, 0.022727044836828296, 0.048440124761707025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 130.88888888888889, 101, 407, 103.0, 312.50000000000017, 407.0, 407.0, 0.08485642763868133, 0.022871459011988327, 0.049886298279771646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 136.33333333333331, 100, 306, 103.0, 304.2, 306.0, 306.0, 0.08485642763868133, 0.022871459011988327, 0.04996916588488754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/142faee5-e7fc-42e1-90cb-b5caad9f3cf8", 3, 0, 0.0, 416.6666666666667, 274, 525, 451.0, 525.0, 525.0, 525.0, 0.023844533640662878, 0.02818343152644756, 0.015290928148471963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 103.66666666666667, 101, 107, 103.0, 107.0, 107.0, 107.0, 0.038943337444018955, 0.028941288862205494, 0.021867596709287986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 572.2666666666667, 102, 918, 698.0, 915.6, 918.0, 918.0, 0.08324546312225985, 49.94375511612742, 0.04416995601864698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 125.11111111111111, 101, 304, 102.5, 303.1, 304.0, 304.0, 0.10540431337873526, 0.028409756340362243, 0.061966207669920545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1965b0a-6d25-4ad7-8f74-3d0092f238b5", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.7621382756563246, 1.4240565334128878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 508.26666666666665, 101, 818, 700.0, 817.4, 818.0, 818.0, 0.08333935228655402, 16.34384531938418, 0.044301159597637606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 181.1111111111111, 101, 310, 103.0, 306.4, 310.0, 310.0, 0.10540431337873526, 0.028409756340362243, 0.062069141569704465], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 665.4615384615385, 105, 1348, 716.0, 1201.6, 1348.0, 1348.0, 0.09184423218221895, 0.01740017680014695, 0.06281863987523313], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 273.22222222222223, 205, 771, 211.0, 444.3000000000005, 771.0, 771.0, 0.0848136455731989, 0.13144458547330726, 0.19074787671394244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50b60e96-d588-4e10-8d26-37ef4165e05d", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 576.25, 164, 1385, 460.5, 1176.4000000000003, 1375.4499999999998, 1385.0, 0.08506584096090374, 0.05225235738711763, 0.038462387075096124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 104.99999999999999, 102, 118, 104.0, 111.4, 118.0, 118.0, 0.08333981531896925, 0.061935155720444925, 0.04183268073627949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 227.00000000000003, 102, 316, 302.0, 312.4, 316.0, 316.0, 0.08334074139923549, 0.10574941730931638, 0.04286405319361721], "isController": false}, {"data": ["login", 20, 0, 0.0, 2537.9, 1475, 5124, 2380.0, 4149.500000000002, 5078.65, 5124.0, 0.08724747309506048, 15.779178383729654, 0.15333913801677768], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 121.55555555555556, 103, 305, 107.5, 151.10000000000025, 305.0, 305.0, 0.09996723296252895, 0.08093050402923486, 0.035535227342148965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae63bafd-55c6-4f3e-b53e-c17f31703960", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/684e7c90-edb4-44fb-bdf4-e5e59eeefb89", 3, 0, 0.0, 432.33333333333337, 202, 816, 279.0, 816.0, 816.0, 816.0, 0.04333381482016467, 0.027859467535750394, 0.027788937238191532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 696.5333333333334, 206, 1025, 812.0, 1021.4, 1025.0, 1025.0, 0.08319698272275992, 66.39798988290025, 0.1729208120718822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38bd4c4c-8afc-43dc-847e-363e4c384d3b", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2300f2fa-e9df-453b-96c9-800320a56a02", 3, 0, 0.0, 308.3333333333333, 184, 547, 194.0, 547.0, 547.0, 547.0, 0.018783928470800383, 0.0258951618078905, 0.012045683296704673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 410.2307692307692, 206, 1009, 212.0, 1007.8, 1009.0, 1009.0, 0.08098931564028283, 15.012573055867055, 0.17895888818801983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=367d4471-e049-495d-b15b-59fc1aa33f8b", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 539.2, 102, 871, 806.0, 871.0, 871.0, 871.0, 0.06129178567488386, 44.00233062015029, 0.09916819385365973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca54cd5b-ae20-4d1a-8e42-472baebf2951", 3, 0, 0.0, 514.3333333333334, 250, 900, 393.0, 900.0, 900.0, 900.0, 0.029235491887151004, 0.024372426667641185, 0.018748020513570142], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1106.4347826086957, 331, 1912, 949.0, 1760.2000000000005, 1905.0, 1912.0, 0.09017874996569286, 0.028824118110637564, 0.04068611570717783], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29157a7e-b641-46b7-b138-4260a74fb3c4", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 106.83333333333333, 103, 113, 106.0, 113.0, 113.0, 113.0, 0.09203065643422109, 0.071449581899615, 0.032714022404352026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 308.22222222222223, 206, 605, 209.0, 438.5000000000003, 605.0, 605.0, 0.10533954446499216, 0.1632557197909595, 0.23691110439734075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 447.07692307692304, 204, 1010, 412.0, 935.5999999999999, 1010.0, 1010.0, 0.06646012903489669, 18.427558539231924, 0.14554628468707503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.037960388334772666, 0.02821079640894726, 0.019054335550852685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 101.75, 101, 103, 101.5, 103.0, 103.0, 103.0, 0.03796110884398934, 0.010157562327395583, 0.021649694887587667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 202.75, 102, 305, 202.0, 305.0, 305.0, 305.0, 0.03788991086398469, 0.010212515037558373, 0.022275123379022252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 152.25, 101, 304, 102.0, 304.0, 304.0, 304.0, 0.03796146910885451, 0.010231802220745942, 0.022354263547499288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 2.808779761904762, 5.887276785714286], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 983.2407407407408, 799, 1816, 851.5, 1317.0, 1477.25, 1816.0, 0.24720520778971075, 295.7433709520147, 0.4881337208503859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1106.4347826086957, 331, 1912, 949.0, 1760.2000000000005, 1905.0, 1912.0, 0.09246305497933652, 0.02955425772267516, 0.041716729883255345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 118.38461538461539, 100, 305, 102.0, 226.99999999999994, 305.0, 305.0, 0.08290446217324482, 0.022345343320132393, 0.04881971747115882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 149.6153846153846, 100, 306, 103.0, 305.6, 306.0, 306.0, 0.082903933472782, 0.022345200818835776, 0.048738445264272234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 164.33333333333334, 100, 716, 102.0, 444.20000000000044, 716.0, 716.0, 0.09523910305929163, 4.785150049537561, 0.05553547524312427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 205.16666666666666, 101, 817, 103.5, 455.20000000000056, 817.0, 817.0, 0.09523859914602723, 1.5799831447520887, 0.05562818784755475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 125.66666666666666, 102, 306, 103.0, 304.2, 306.0, 306.0, 0.09523708743822816, 0.07077678080126136, 0.04780455365551687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 149.30769230769232, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.08290446217324482, 0.022183420542450275, 0.04728145108317869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 159.05555555555557, 100, 309, 102.5, 308.1, 309.0, 309.0, 0.09513742071881606, 0.033395134117336155, 0.05381416820824524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 135.53846153846155, 101, 308, 103.0, 306.4, 308.0, 308.0, 0.08290340477906243, 0.061610831090689946, 0.04161362310199032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 138.0769230769231, 103, 308, 106.0, 307.2, 308.0, 308.0, 0.08473968620242356, 0.06669940144448573, 0.030122310329767747], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 671.0769230769231, 102, 1610, 547.0, 1465.6, 1610.0, 1610.0, 0.09146041171256104, 0.017135086148672415, 0.06224694487047799], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1381.75, 699, 2924, 1145.5, 2618.800000000001, 2910.7, 2924.0, 0.08489324674222165, 0.043938887474001445, 0.039047577358971096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 302.53846153846155, 205, 615, 209.0, 613.0, 615.0, 615.0, 0.08284792943905579, 0.12839810939431792, 0.18632693505678272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=142faee5-e7fc-42e1-90cb-b5caad9f3cf8", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["addBook", 58, 6, 10.344827586206897, 1097.3965517241372, 532, 3587, 868.5, 1703.4000000000003, 2373.7999999999965, 3587.0, 0.27156736509422924, 90.64604701948964, 0.9866996371298139], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/82fbbc63-5719-420c-8f38-b8d1490b08d8", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 200.2962962962963, 102, 734, 104.5, 411.5, 469.5, 734.0, 0.24808081921799413, 0.18436474943837258, 0.11992188038369833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee0de342-18d6-4943-bcb3-1f4415b9805a", 1, 0, 0.0, 842.0, 842, 842, 842.0, 842.0, 842.0, 842.0, 1.187648456057007, 0.21456539489311163, 0.8188279394299288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9647b20b-67f6-4db7-b49f-64800039d8db", 3, 0, 0.0, 368.0, 287, 415, 402.0, 415.0, 415.0, 415.0, 0.049780137725047705, 0.032327921471832735, 0.031922809673940095], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 582.9629629629632, 498, 833, 507.5, 741.0, 808.75, 833.0, 0.24808537812346385, 72.94533837811888, 0.12476950169295299], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 175.01851851851856, 100, 435, 107.0, 316.0, 367.0, 435.0, 0.24861649524405854, 0.43993465759983796, 0.1209091939761144], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 774.462962962963, 693, 1049, 707.0, 910.5, 1017.25, 1049.0, 0.24816290516040976, 223.29741828719344, 0.1245661457543463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 139.0769230769231, 104, 309, 107.0, 307.0, 309.0, 309.0, 0.06484210946345649, 0.048441614980023646, 0.02304934359833805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, 3.5294117647058822, 205.30588235294124, 102, 2352, 109.0, 315.8, 424.45, 2293.0699999999993, 0.7209866490236992, 1.5202348083871953, 0.34782801446638506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 114.25, 107, 124, 113.0, 124.0, 124.0, 124.0, 0.041452925022021865, 0.032101728068811855, 0.014735219441421834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 109.07692307692308, 103, 127, 106.0, 125.4, 127.0, 127.0, 0.08160498167026566, 0.06622435524217847, 0.029008020828102245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 306.75, 207, 409, 305.5, 409.0, 409.0, 409.0, 0.037852620820834085, 0.058664169182288756, 0.08513143139685633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 354.6111111111112, 206, 1124, 212.0, 664.1000000000007, 1124.0, 1124.0, 0.09508414947228297, 6.458825055399723, 0.2124949156392296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de82fc53-7386-444d-bd67-79e09fe66910", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50b60e96-d588-4e10-8d26-37ef4165e05d", 3, 0, 0.0, 393.0, 382, 411, 386.0, 411.0, 411.0, 411.0, 0.045322697606961566, 0.029138127530517286, 0.029064360119047623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 109.33333333333331, 102, 137, 105.5, 122.60000000000002, 137.0, 137.0, 0.08570979615353481, 0.0710621259124522, 0.03046715410145183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/718f9b4b-804a-4f92-9457-ffef62b4b7b0", 3, 0, 0.0, 567.0, 197, 1249, 255.0, 1249.0, 1249.0, 1249.0, 0.044903457566232596, 0.027933107880556803, 0.028795511525220776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 109.66666666666666, 104, 123, 108.0, 122.4, 123.0, 123.0, 0.08126161363894924, 0.06308885043258265, 0.028885964223220234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bf247fc-27fc-4c8e-a4b8-cdbba118f253", 2, 0, 0.0, 236.0, 175, 297, 236.0, 297.0, 297.0, 297.0, 0.017898052691867127, 0.02548375080541237, 0.011125107947630298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 110.53846153846153, 102, 179, 104.0, 153.79999999999998, 179.0, 179.0, 0.0664948031753826, 0.049416548062955236, 0.033377274250143224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bc9f525-4fb1-4012-a70c-c2c0011e4463", 1, 0, 0.0, 982.0, 982, 982, 982.0, 982.0, 982.0, 982.0, 1.0183299389002036, 0.1839756237270876, 0.7020907586558045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 196.76923076923077, 101, 312, 111.0, 310.0, 312.0, 312.0, 0.06649684395748294, 0.040841210651771376, 0.03663520534736928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 303.7692307692307, 101, 906, 107.0, 826.4, 906.0, 906.0, 0.06649684395748294, 13.821627770808398, 0.03777412364832377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/367d4471-e049-495d-b15b-59fc1aa33f8b", 3, 0, 0.0, 472.0, 383, 615, 418.0, 615.0, 615.0, 615.0, 0.024224023771841994, 0.024294992591486063, 0.015534286077646071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 242.23076923076923, 100, 705, 103.0, 626.1999999999999, 705.0, 705.0, 0.06649718410001176, 4.525874677744415, 0.03783925552566024], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 23.076923076923077, 0.23790642347343377], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07930214115781126], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07930214115781126], "isController": false}, {"data": ["401/Unauthorized", 8, 61.53846153846154, 0.63441712926249], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1261, 13, "401/Unauthorized", 8, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
