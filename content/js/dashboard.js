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

    var data = {"OkPercent": 97.48667174409749, "KoPercent": 2.5133282559025134};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8167539267015707, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58f123f8-6e44-4340-abb7-9bc6bab43531"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9ef1096-e418-4203-bcb3-4809a2239ed8"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/612af9f1-bac7-496d-baaf-128a1b64cbdd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01729e0b-2c45-4d91-b895-4e22a0a0f1aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a803b6a2-7400-478a-ab03-562f444d3baa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3633c6c7-f4dd-491b-9ec4-d08553e766ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a803b6a2-7400-478a-ab03-562f444d3baa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bca926d-6065-4f2f-a974-c409b30e3f8e"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1365f259-04cf-471d-9533-ca8963ab7c1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/540bb485-41bc-4aad-a0b5-d46b0f11fac1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=612af9f1-bac7-496d-baaf-128a1b64cbdd"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e0e3ba5-974d-4319-9f34-b4f61c66097e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/daf42684-3403-4e3f-8a95-d0c75715cff6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbcee4a0-a0f8-4bce-b673-19b38200bd6d"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db9552b4-cb0b-49cd-8705-0d8c3538137d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2edbbb05-bbac-4cd9-a6c3-fe50e81c5de3"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9ef1096-e418-4203-bcb3-4809a2239ed8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58f123f8-6e44-4340-abb7-9bc6bab43531"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3524590163934426, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8090909090909091, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1365f259-04cf-471d-9533-ca8963ab7c1b"], "isController": false}, {"data": [0.9209039548022598, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3633c6c7-f4dd-491b-9ec4-d08553e766ad"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbcee4a0-a0f8-4bce-b673-19b38200bd6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01729e0b-2c45-4d91-b895-4e22a0a0f1aa"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e0e3ba5-974d-4319-9f34-b4f61c66097e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db9552b4-cb0b-49cd-8705-0d8c3538137d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94d0f407-13bf-4b89-8916-80470163dec2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daf42684-3403-4e3f-8a95-d0c75715cff6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 33, 2.5133282559025134, 286.9322162985529, 77, 1781, 93.0, 840.200000000001, 1018.3, 1286.2999999999995, 5.137957886745791, 714.8967035492703, 3.7579364977460292], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1354.8727272727267, 995, 1748, 1330.0, 1596.3999999999999, 1696.8, 1748.0, 0.2521709627428865, 303.4466505105316, 1.2399226537211265], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/58f123f8-6e44-4340-abb7-9bc6bab43531", 3, 0, 0.0, 284.3333333333333, 157, 373, 323.0, 373.0, 373.0, 373.0, 0.05093465084296847, 0.032746072726192295, 0.03266317127625257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9ef1096-e418-4203-bcb3-4809a2239ed8", 3, 0, 0.0, 251.0, 174, 385, 194.0, 385.0, 385.0, 385.0, 0.023382696804364767, 0.023451200798908806, 0.014994763250194854], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 410.78571428571433, 82, 891, 414.0, 784.0, 891.0, 891.0, 0.07489514679448772, 0.015364580547055551, 0.0501373272730677], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 410.78571428571433, 82, 891, 414.0, 784.0, 891.0, 891.0, 0.07348734180537403, 0.015075772338839636, 0.04919489531990615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/612af9f1-bac7-496d-baaf-128a1b64cbdd", 3, 0, 0.0, 341.0, 222, 577, 224.0, 577.0, 577.0, 577.0, 0.041021153241354795, 0.026372648975154858, 0.026305882775217757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 115.71428571428572, 79, 241, 82.0, 240.5, 241.0, 241.0, 0.08407600470825626, 0.03151677241226068, 0.04744523424175455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 83.78571428571429, 81, 88, 83.0, 87.5, 88.0, 88.0, 0.08407448999813835, 0.062481139539632115, 0.04220145298734679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 190.21428571428575, 80, 640, 161.5, 443.0, 640.0, 640.0, 0.08407650962375762, 1.7868486885565866, 0.04899380311083086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 187.57142857142858, 79, 924, 83.0, 584.0, 924.0, 924.0, 0.08407600470825626, 5.424737947479522, 0.04891140340868145], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 206.2142857142857, 81, 362, 186.5, 358.5, 362.0, 362.0, 0.07503926161366573, 0.129565209453339, 0.04849600717428941], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 91.80952380952381, 81, 248, 84.0, 89.6, 232.19999999999976, 248.0, 0.10398304581195904, 0.07727646275673909, 0.05219461479233101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 98.38095238095238, 79, 241, 83.0, 210.2000000000001, 240.6, 241.0, 0.10398665009482591, 0.0352618420987477, 0.058889017152845516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 583.0, 477, 644, 629.5, 644.0, 644.0, 644.0, 0.04441647851352852, 13.059919448865529, 0.02533127290224673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 877.0, 769, 1031, 867.5, 1031.0, 1031.0, 1031.0, 0.04434753686389002, 39.90399162478288, 0.025248646476218637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 160.5, 81, 246, 157.0, 246.0, 246.0, 246.0, 0.044600712124703595, 0.07892235387691691, 0.024695902123737245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 83.5, 81, 86, 84.0, 85.4, 86.0, 86.0, 0.057848052448900886, 0.04299059366563826, 0.029037010701889705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 122.83333333333334, 81, 246, 83.0, 244.5, 246.0, 246.0, 0.057848889060293, 0.015479097268086214, 0.03299194454219835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 109.75, 80, 245, 82.5, 244.4, 245.0, 245.0, 0.05784916793613452, 0.015592158545286257, 0.034008983493704084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 122.58333333333334, 80, 244, 82.5, 242.8, 244.0, 244.0, 0.05784916793613452, 0.015592158545286257, 0.034065476821766714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01729e0b-2c45-4d91-b895-4e22a0a0f1aa", 3, 0, 0.0, 318.6666666666667, 186, 548, 222.0, 548.0, 548.0, 548.0, 0.036806203072091086, 0.0306838170793051, 0.023602936214850077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a803b6a2-7400-478a-ab03-562f444d3baa", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 83.16666666666667, 80, 89, 82.5, 89.0, 89.0, 89.0, 0.044600049060053965, 0.03314515364716901, 0.025043972860870147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 132.90476190476187, 79, 968, 82.0, 214.2000000000001, 895.399999999999, 968.0, 0.10398716501277556, 4.48230427046814, 0.060707536717372786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 538.9473684210525, 80, 1086, 783.0, 1061.0, 1086.0, 1086.0, 0.0981638199158891, 46.50094216278145, 0.05326961403535964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 108.38095238095237, 78, 470, 83.0, 205.2000000000001, 446.39999999999964, 470.0, 0.10398819486397354, 1.4826925421894963, 0.060809688914363245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 359.6315789473684, 79, 742, 462.0, 723.0, 742.0, 742.0, 0.09816280559631321, 15.203650687656285, 0.05336492571917171], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 372.0, 84, 608, 411.5, 602.0, 608.0, 608.0, 0.07343068143672374, 0.015064148584361363, 0.04950526897920863], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3633c6c7-f4dd-491b-9ec4-d08553e766ad", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 234.75, 164, 331, 174.0, 330.7, 331.0, 331.0, 0.057825194437216294, 0.08961775739439674, 0.13005021756729407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a803b6a2-7400-478a-ab03-562f444d3baa", 3, 0, 0.0, 254.66666666666666, 176, 375, 213.0, 375.0, 375.0, 375.0, 0.022595976409800628, 0.022662175559438717, 0.014490258309670325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bca926d-6065-4f2f-a974-c409b30e3f8e", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 396.14285714285717, 86, 1209, 369.0, 799.0000000000001, 1171.0999999999995, 1209.0, 0.09420884755662624, 0.05786852061827921, 0.04259638322140425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 82.5263157894737, 80, 91, 82.0, 86.0, 91.0, 91.0, 0.09816229844438588, 0.07295069249626725, 0.04927287246134214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 141.15789473684208, 79, 251, 82.0, 246.0, 251.0, 251.0, 0.0981638199158891, 0.10386515197309278, 0.051644986670386556], "isController": false}, {"data": ["login", 21, 0, 0.0, 2072.7619047619046, 1174, 2852, 2214.0, 2571.4, 2824.8999999999996, 2852.0, 0.09289281496193606, 31.8783569970407, 0.18416570778795666], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1365f259-04cf-471d-9533-ca8963ab7c1b", 3, 0, 0.0, 332.6666666666667, 303, 379, 316.0, 379.0, 379.0, 379.0, 0.0353440150801131, 0.029464851113336476, 0.022665270087181905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/540bb485-41bc-4aad-a0b5-d46b0f11fac1", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.8970110603932585, 1.6760665379213484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 87.61904761904762, 80, 99, 86.0, 97.0, 98.9, 99.0, 0.10414393683918192, 0.08431183949187677, 0.037019915048302945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=612af9f1-bac7-496d-baaf-128a1b64cbdd", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 631.7894736842105, 163, 1169, 865.0, 1148.0, 1169.0, 1169.0, 0.09812072981165984, 61.854403321063934, 0.20746260599620944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e0e3ba5-974d-4319-9f34-b4f61c66097e", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daf42684-3403-4e3f-8a95-d0c75715cff6", 3, 0, 0.0, 564.0, 362, 951, 379.0, 951.0, 951.0, 951.0, 0.07496064566102796, 0.03391774006146773, 0.048070466130281604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbcee4a0-a0f8-4bce-b673-19b38200bd6d", 3, 0, 0.0, 251.66666666666669, 165, 410, 180.0, 410.0, 410.0, 410.0, 0.018079150520980854, 0.02491179822764061, 0.011593726082790455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 341.07142857142856, 167, 1006, 326.0, 670.5, 1006.0, 1006.0, 0.08403361344537816, 7.301891459708884, 0.1874577956182473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 521.1666666666665, 81, 1113, 466.0, 1089.3000000000002, 1113.0, 1113.0, 0.08807210169392009, 52.69420930518451, 0.12847431826688782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db9552b4-cb0b-49cd-8705-0d8c3538137d", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2edbbb05-bbac-4cd9-a6c3-fe50e81c5de3", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 871.0454545454548, 97, 1781, 972.5, 1436.7999999999997, 1738.9999999999993, 1781.0, 0.0886089205016876, 0.027737487010737787, 0.03997785280447233], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 241.38095238095235, 164, 1051, 170.0, 457.8000000000001, 994.8999999999992, 1051.0, 0.1039403283524468, 6.074786303634447, 0.23249784849707236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 114.61111111111113, 82, 351, 85.5, 259.20000000000016, 351.0, 351.0, 0.09452987143937484, 0.07338989042412403, 0.03360241523821528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 309.5, 164, 878, 324.5, 606.0, 878.0, 878.0, 0.09519211809262193, 8.271481918172176, 0.2123496049527099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 97.72727272727273, 82, 243, 83.0, 211.6000000000001, 243.0, 243.0, 0.06125915406677247, 0.045525601801576034, 0.030749223818672903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 110.63636363636363, 80, 241, 82.0, 240.0, 241.0, 241.0, 0.0612056398215021, 0.024734381433547368, 0.03443903987825642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 175.27272727272725, 80, 933, 83.0, 794.2000000000005, 933.0, 933.0, 0.06126017754313273, 5.026102796318263, 0.03553568892638754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 163.36363636363635, 79, 646, 85.0, 564.8000000000003, 646.0, 646.0, 0.0612059803807012, 1.6510508823398489, 0.03556402180323946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 127.33333333333334, 84, 214, 84.0, 214.0, 214.0, 214.0, 0.07690138678834176, 0.022679901181717976, 0.047537673668965164], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 947.9818181818184, 636, 1396, 951.0, 1250.4, 1355.8, 1396.0, 0.23824065771748124, 285.01865248376714, 0.47043223623510455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 871.0454545454548, 97, 1781, 972.5, 1436.7999999999997, 1738.9999999999993, 1781.0, 0.08620993687081441, 0.026986526758388814, 0.03889549886163697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 103.28571428571429, 78, 232, 83.0, 232.0, 232.0, 232.0, 0.03853861569292431, 0.010387361260983505, 0.022694126233235704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 128.14285714285714, 82, 243, 82.0, 243.0, 243.0, 243.0, 0.038537767011671435, 0.010387132514864568, 0.022655991934595904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 193.5, 80, 957, 83.0, 319.800000000001, 957.0, 957.0, 0.09394768157999123, 4.720264457830539, 0.05478242630326312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 130.61111111111111, 80, 475, 82.5, 268.00000000000034, 475.0, 475.0, 0.09386831318641205, 1.5572504634747963, 0.0548278135723151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 104.14285714285714, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.03853797917848039, 0.010311920209866824, 0.021978691250227098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 83.3888888888889, 81, 90, 83.0, 86.4, 90.0, 90.0, 0.09394522993095025, 0.06981671872798159, 0.04715610174268402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 106.42857142857143, 80, 247, 84.0, 247.0, 247.0, 247.0, 0.038537130525261094, 0.02863941047824579, 0.019343833095687695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 117.11111111111111, 77, 249, 81.5, 247.2, 249.0, 249.0, 0.09394670090501989, 0.03297716768964185, 0.05314064147329304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9ef1096-e418-4203-bcb3-4809a2239ed8", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 84.85714285714286, 84, 88, 84.0, 88.0, 88.0, 88.0, 0.03925108921772579, 0.030894900302233387, 0.013952535620363466], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 380.0714285714286, 81, 757, 382.0, 667.0, 757.0, 757.0, 0.07372184746949759, 0.014691916728540361, 0.05016438490966441], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58f123f8-6e44-4340-abb7-9bc6bab43531", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1154.6666666666665, 741, 1667, 1117.0, 1585.2, 1660.6999999999998, 1667.0, 0.09716689107591511, 0.05029145729515137, 0.0446929743132383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 236.42857142857144, 163, 489, 170.0, 489.0, 489.0, 489.0, 0.03851952940140651, 0.059697747226593885, 0.0866313244252336], "isController": false}, {"data": ["addBook", 61, 14, 22.950819672131146, 840.7377049180327, 415, 1591, 681.0, 1480.2, 1555.4, 1591.0, 0.3029701003278037, 90.30700362260356, 1.101501774051356], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 146.90909090909088, 78, 373, 84.0, 333.4, 337.79999999999995, 373.0, 0.23939689393411798, 0.17791116824596073, 0.11572408447010586], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 524.3272727272727, 384, 740, 484.0, 649.0, 732.1999999999999, 740.0, 0.23928753224943333, 70.35847957517763, 0.12034480381685368], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 145.45454545454552, 79, 339, 87.0, 245.4, 263.19999999999965, 339.0, 0.23969214812103146, 0.42414274647979394, 0.1165690329729235], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 799.0363636363637, 552, 1115, 801.0, 1014.4, 1050.3999999999999, 1115.0, 0.23863241929885456, 214.7218703561589, 0.11978228859337037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 100.35714285714285, 83, 254, 88.0, 177.0, 254.0, 254.0, 0.0954380606986066, 0.071298941830502, 0.033925248138957816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1365f259-04cf-471d-9533-ca8963ab7c1b", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 14, 7.909604519774011, 129.6045197740113, 80, 499, 88.0, 241.60000000000014, 306.4999999999999, 463.9, 0.7414979095623906, 1.564923548737778, 0.3574448013455883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 132.54545454545456, 83, 273, 88.0, 267.8, 273.0, 273.0, 0.06156842771027017, 0.04767945622484789, 0.0218856520376351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3633c6c7-f4dd-491b-9ec4-d08553e766ad", 3, 0, 0.0, 358.3333333333333, 298, 422, 355.0, 422.0, 422.0, 422.0, 0.021767838743850583, 0.021831611708920458, 0.013959193465294808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbcee4a0-a0f8-4bce-b673-19b38200bd6d", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 85.78571428571428, 79, 92, 85.0, 91.0, 92.0, 92.0, 0.08624938393297191, 0.06999339653154263, 0.03065896069492361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01729e0b-2c45-4d91-b895-4e22a0a0f1aa", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 303.0909090909091, 166, 1176, 174.0, 1005.8000000000006, 1176.0, 1176.0, 0.06117670613491132, 6.739702587357556, 0.13616487921771678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 296.6111111111111, 166, 1039, 324.5, 406.300000000001, 1039.0, 1039.0, 0.09382623381497467, 6.373378035995392, 0.209683714372094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 87.33333333333334, 83, 96, 86.0, 94.5, 96.0, 96.0, 0.05783550618116973, 0.04795150854278622, 0.020558715087837673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e0e3ba5-974d-4319-9f34-b4f61c66097e", 3, 0, 0.0, 509.6666666666667, 187, 872, 470.0, 872.0, 872.0, 872.0, 0.02021604210327702, 0.02786944606359967, 0.012964063458156164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 94.15789473684212, 81, 256, 85.0, 93.0, 256.0, 256.0, 0.09405987158352269, 0.07302499795791069, 0.033435344976955335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db9552b4-cb0b-49cd-8705-0d8c3538137d", 3, 0, 0.0, 453.66666666666663, 268, 757, 336.0, 757.0, 757.0, 757.0, 0.06920734520623789, 0.0313145214312079, 0.044381012388114795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94d0f407-13bf-4b89-8916-80470163dec2", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daf42684-3403-4e3f-8a95-d0c75715cff6", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.6042276337792643, 2.3058632943143813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 83.42857142857143, 81, 90, 82.5, 88.5, 90.0, 90.0, 0.09534901143507073, 0.07085995869344612, 0.04786073425549448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 107.07142857142858, 78, 249, 81.0, 247.0, 249.0, 249.0, 0.09535095963930094, 0.03574330755452032, 0.05380784482993475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 181.57142857142856, 80, 797, 82.5, 522.5, 797.0, 797.0, 0.09535031022904507, 6.152176807143782, 0.055470255811260874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 178.64285714285714, 79, 640, 82.0, 443.0, 640.0, 640.0, 0.09524651839958637, 2.02424098304612, 0.055502888860919676], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.21212121212121, 0.5331302361005331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.2284843869002285], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.2284843869002285], "isController": false}, {"data": ["401/Unauthorized", 20, 60.60606060606061, 1.5232292460015233], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 33, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
