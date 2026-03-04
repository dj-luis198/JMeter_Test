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

    var data = {"OkPercent": 97.1830985915493, "KoPercent": 2.816901408450704};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8059651474530831, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e34e700-d0cb-440c-bd2e-509215081f31"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c51119ce-ccaa-44e8-a517-ff80b81d1225"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/94ed7542-b368-4704-8a64-1a973219399e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/486a9131-0e9c-4a12-a34e-eddac910700b"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19374de3-fa90-413c-9cf7-0346a7c4c127"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/baf53f37-1ba6-4e3c-bfbb-07b013503469"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d3a6973-dd89-42ad-82ac-62d879b425fa"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bf8249e-2192-4cb6-bad7-efba749ba5f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08c1ee1d-5272-4dc4-971e-a36644f4ec3f"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ba33d0d-08d0-452d-be86-1a7c38e20659"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/377b1632-48c5-4fe4-882b-a44531ed3e77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cee680e7-6c5c-429a-972e-9018d122baa1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c51119ce-ccaa-44e8-a517-ff80b81d1225"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/434c93f9-8748-47b4-b04f-d4f25ce7db25"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d3a6973-dd89-42ad-82ac-62d879b425fa"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19374de3-fa90-413c-9cf7-0346a7c4c127"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=486a9131-0e9c-4a12-a34e-eddac910700b"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e34e700-d0cb-440c-bd2e-509215081f31"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94ed7542-b368-4704-8a64-1a973219399e"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "addBook"], "isController": true}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8240740740740741, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bf8249e-2192-4cb6-bad7-efba749ba5f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ba33d0d-08d0-452d-be86-1a7c38e20659"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.891566265060241, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57e2b8d4-57ca-4934-b5b6-3135d8467b44"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08c1ee1d-5272-4dc4-971e-a36644f4ec3f"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=377b1632-48c5-4fe4-882b-a44531ed3e77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=434c93f9-8748-47b4-b04f-d4f25ce7db25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b833fd24-2429-4363-8f46-262d65ffd710"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 36, 2.816901408450704, 280.35367762128317, 81, 2268, 98.5, 708.3000000000004, 869.4499999999996, 1293.220000000003, 5.074610271519444, 715.8548936436337, 3.711163956468738], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e34e700-d0cb-440c-bd2e-509215081f31", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1241.2037037037042, 1002, 1960, 1201.5, 1454.5, 1507.5, 1960.0, 0.2450913646142534, 294.9272736053621, 1.2051123250319982], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c51119ce-ccaa-44e8-a517-ff80b81d1225", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94ed7542-b368-4704-8a64-1a973219399e", 3, 0, 0.0, 289.3333333333333, 171, 521, 176.0, 521.0, 521.0, 521.0, 0.03981367201496994, 0.024766903392124857, 0.025531553993974866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/486a9131-0e9c-4a12-a34e-eddac910700b", 3, 0, 0.0, 266.3333333333333, 184, 425, 190.0, 425.0, 425.0, 425.0, 0.020507211702782146, 0.024238829978125643, 0.013150783546380478], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 510.0714285714286, 89, 936, 510.5, 897.5, 936.0, 936.0, 0.0813400187082043, 0.01668673235357344, 0.05445174103952544], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 510.0714285714286, 89, 936, 510.5, 897.5, 936.0, 936.0, 0.0844971814154485, 0.017334417588088312, 0.0565652518166894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 125.50000000000001, 83, 253, 85.0, 250.2, 253.0, 253.0, 0.09473677977843435, 0.0342426275541924, 0.05353229413993806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 107.18750000000001, 82, 255, 86.5, 250.1, 255.0, 255.0, 0.09482717746906263, 0.07047215044331705, 0.047598798065525576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 135.1875, 81, 412, 84.0, 304.9000000000001, 412.0, 412.0, 0.0948277394844927, 1.7666180983185855, 0.05533161556834413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 148.0, 82, 771, 84.5, 408.4000000000004, 771.0, 771.0, 0.09473453606721416, 5.351581927981029, 0.05518471754305981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19374de3-fa90-413c-9cf7-0346a7c4c127", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 201.73333333333332, 83, 414, 184.0, 357.00000000000006, 414.0, 414.0, 0.07637941218404383, 0.1266923609130904, 0.04936317869472676], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/baf53f37-1ba6-4e3c-bfbb-07b013503469", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 104.1, 84, 391, 86.5, 122.90000000000006, 377.7499999999998, 391.0, 0.10340940818795695, 0.07685015588968284, 0.05190667559434557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 110.85, 83, 254, 85.0, 252.9, 253.95, 254.0, 0.10341208163349723, 0.03543681586444744, 0.05854295285443198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 456.875, 404, 589, 416.0, 589.0, 589.0, 589.0, 0.03726355112326317, 10.956721296585261, 0.021251868999986025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 696.3750000000001, 571, 855, 743.0, 855.0, 855.0, 855.0, 0.037236146989690244, 33.50515051548791, 0.021199876655263097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 184.0, 87, 353, 175.0, 353.0, 353.0, 353.0, 0.037321092015152366, 0.06604083860493758, 0.02066509684823378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 105.0, 84, 251, 86.0, 251.0, 251.0, 251.0, 0.06624563882877711, 0.04923137807490174, 0.03325220542772601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 131.22222222222223, 82, 256, 86.0, 256.0, 256.0, 256.0, 0.06625002760417817, 0.017727058167524238, 0.03778321886800787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 114.11111111111111, 82, 256, 86.0, 256.0, 256.0, 256.0, 0.06625002760417817, 0.01785645275268865, 0.03894777013448756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 108.22222222222223, 83, 254, 85.0, 254.0, 254.0, 254.0, 0.06625051528178552, 0.017856584197043755, 0.03901275460441081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 85.5, 83, 89, 85.5, 89.0, 89.0, 89.0, 0.037320917907975946, 0.027735564968720407, 0.020956570114341964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d3a6973-dd89-42ad-82ac-62d879b425fa", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5628163940809968, 2.1478290498442365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 152.3, 83, 726, 86.5, 256.7, 702.5499999999997, 726.0, 0.10341154693333057, 4.678973596769941, 0.060350332468123394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 576.0000000000001, 83, 839, 675.0, 833.3000000000001, 839.0, 839.0, 0.061610498428932285, 41.58207757820683, 0.03224924527139425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 138.8, 82, 411, 85.0, 328.70000000000016, 407.29999999999995, 411.0, 0.10341154693333057, 1.5468004305798286, 0.060451320306925474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 456.75000000000006, 84, 762, 571.0, 709.5000000000002, 762.0, 762.0, 0.06161018210942996, 13.590730860411865, 0.032309245891370984], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 432.7142857142857, 86, 761, 395.5, 760.5, 761.0, 761.0, 0.08458498978938338, 0.017352431289800258, 0.057025245976171195], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 238.88888888888889, 171, 507, 172.0, 507.0, 507.0, 507.0, 0.06620373094803743, 0.10260285255325723, 0.1488937425520803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bf8249e-2192-4cb6-bad7-efba749ba5f5", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08c1ee1d-5272-4dc4-971e-a36644f4ec3f", 1, 0, 0.0, 744.0, 744, 744, 744.0, 744.0, 744.0, 744.0, 1.3440860215053765, 0.24282804099462366, 0.9266843077956989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 448.9130434782609, 103, 1108, 369.0, 1049.2, 1103.1999999999998, 1108.0, 0.10042352530236213, 0.06168593497576737, 0.04540634005370475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 87.74999999999999, 83, 113, 85.0, 106.10000000000002, 113.0, 113.0, 0.061609549480169425, 0.04578600308047747, 0.030925105891413167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 155.58333333333331, 82, 259, 98.5, 257.8, 259.0, 259.0, 0.061610498428932285, 0.08588768213603598, 0.03125649798225618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ba33d0d-08d0-452d-be86-1a7c38e20659", 3, 0, 0.0, 342.3333333333333, 173, 440, 414.0, 440.0, 440.0, 440.0, 0.042387848816672555, 0.027251302543270926, 0.027182311903920873], "isController": false}, {"data": ["login", 23, 0, 0.0, 2215.2608695652175, 1303, 3547, 2152.0, 3229.6000000000004, 3506.3999999999996, 3547.0, 0.10173029970630905, 42.468434926334, 0.21216417252353068], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 99.85, 86, 277, 89.0, 101.7, 268.2499999999999, 277.0, 0.09844021479654869, 0.07969427545540904, 0.03499242010346067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/377b1632-48c5-4fe4-882b-a44531ed3e77", 3, 0, 0.0, 333.0, 220, 392, 387.0, 392.0, 392.0, 392.0, 0.05557716889901629, 0.025147221604698122, 0.03564030687860094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cee680e7-6c5c-429a-972e-9018d122baa1", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 678.0, 169, 927, 833.0, 920.7, 927.0, 927.0, 0.061582674740839574, 55.27957672335266, 0.1266835003335728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c51119ce-ccaa-44e8-a517-ff80b81d1225", 3, 0, 0.0, 272.6666666666667, 162, 369, 287.0, 369.0, 369.0, 369.0, 0.023274397387060986, 0.02750954977617788, 0.01492531342855148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/434c93f9-8748-47b4-b04f-d4f25ce7db25", 3, 0, 0.0, 242.33333333333334, 178, 364, 185.0, 364.0, 364.0, 364.0, 0.019727238055157355, 0.023316927531991, 0.012650605133027341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 484.8571428571428, 83, 939, 661.5, 890.5, 939.0, 939.0, 0.06513657744506428, 44.53660777428315, 0.10242563234822015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 288.31249999999994, 168, 857, 175.0, 613.4000000000002, 857.0, 857.0, 0.09468464096767704, 7.217305550665159, 0.21143385464132275], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 858.6249999999999, 105, 2134, 909.5, 1260.0, 1919.5, 2134.0, 0.0986724444864716, 0.03083513890202237, 0.0445182317897948], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 294.6, 170, 1118, 200.0, 416.3000000000002, 1083.2999999999995, 1118.0, 0.10336398075362678, 6.335147088559674, 0.2311456831325488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 102.60000000000001, 87, 257, 89.0, 179.00000000000006, 257.0, 257.0, 0.0859869873025882, 0.06675747549370863, 0.030565686892716902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d3a6973-dd89-42ad-82ac-62d879b425fa", 3, 0, 0.0, 357.0, 215, 464, 392.0, 464.0, 464.0, 464.0, 0.0906070673512534, 0.040997338417396556, 0.058104141498036846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 304.8235294117647, 169, 669, 183.0, 539.3999999999999, 669.0, 669.0, 0.08991093528528211, 6.458485113129112, 0.20085859158486535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 101.54545454545455, 84, 250, 86.0, 218.2000000000001, 250.0, 250.0, 0.0509254543939408, 0.03784596757205952, 0.025562190975083564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 116.36363636363636, 83, 251, 85.0, 250.6, 251.0, 251.0, 0.05092686901609289, 0.01362691612344673, 0.029044229985740477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19374de3-fa90-413c-9cf7-0346a7c4c127", 3, 0, 0.0, 389.0, 219, 563, 385.0, 563.0, 563.0, 563.0, 0.02865247414114209, 0.023886388761544558, 0.018374145201188123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 100.18181818181817, 82, 252, 84.0, 219.80000000000013, 252.0, 252.0, 0.050926633240276485, 0.01372631911554327, 0.029939290244771915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 101.36363636363636, 82, 254, 86.0, 222.40000000000012, 254.0, 254.0, 0.050926633240276485, 0.01372631911554327, 0.029989023285045623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 87.66666666666667, 86, 89, 88.0, 89.0, 89.0, 89.0, 0.03501073662589861, 0.010325432090841191, 0.021642379183783027], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 814.4444444444446, 653, 1577, 682.5, 1093.5, 1151.75, 1577.0, 0.241110178421532, 288.45159685261916, 0.4760984187190799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 858.6249999999999, 105, 2134, 909.5, 1260.0, 1919.5, 2134.0, 0.09935419771485346, 0.031048186785891704, 0.044825819672131145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 101.1, 82, 246, 84.5, 230.70000000000005, 246.0, 246.0, 0.06959087524443795, 0.018756915593227414, 0.04097978298085555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 119.89999999999999, 82, 259, 85.0, 257.9, 259.0, 259.0, 0.06959184383590243, 0.018757176658895577, 0.04091239256759108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=486a9131-0e9c-4a12-a34e-eddac910700b", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 141.73333333333335, 82, 572, 85.0, 381.2000000000001, 572.0, 572.0, 0.08351939598772821, 5.03107030279957, 0.04862177336733501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 119.59999999999998, 82, 588, 84.0, 301.8000000000002, 588.0, 588.0, 0.08351893095768374, 1.658166150473274, 0.048703064100779514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 85.53333333333335, 83, 91, 85.0, 88.6, 91.0, 91.0, 0.08351846593281774, 0.06206792243640069, 0.04192235497018391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 85.9, 81, 101, 85.0, 99.5, 101.0, 101.0, 0.06959281245432972, 0.018621514270006193, 0.039689650852859915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 130.73333333333335, 83, 254, 86.0, 254.0, 254.0, 254.0, 0.08343995104856204, 0.03068156533348167, 0.047119670273126774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 101.5, 83, 250, 85.0, 233.70000000000005, 250.0, 250.0, 0.06958990667993514, 0.05171671775725648, 0.034930871126451817], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 369.42857142857144, 83, 698, 392.0, 630.5, 698.0, 698.0, 0.08337998642097365, 0.016616672796088288, 0.05673631190963992], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 88.3, 86, 92, 88.5, 91.8, 92.0, 92.0, 0.06956424954087596, 0.054754672978462905, 0.024727916828983246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e34e700-d0cb-440c-bd2e-509215081f31", 3, 0, 0.0, 354.3333333333333, 301, 397, 365.0, 397.0, 397.0, 397.0, 0.026449428692340245, 0.026526917252962336, 0.01696138493616871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1314.7826086956522, 785, 2268, 1240.0, 2062.2000000000007, 2259.4, 2268.0, 0.10092942838837644, 0.052238864302577646, 0.04642359450285674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 222.7, 168, 509, 172.0, 491.50000000000006, 509.0, 509.0, 0.0695487675958382, 0.10778700602987816, 0.15641680837228064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94ed7542-b368-4704-8a64-1a973219399e", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["addBook", 56, 16, 28.571428571428573, 837.0000000000002, 429, 2264, 707.5, 1331.8000000000002, 1525.399999999999, 2264.0, 0.2610394029655941, 73.57236064691158, 0.9488216008357923], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 165.99999999999997, 83, 687, 88.0, 340.0, 373.75, 687.0, 0.24172646412376395, 0.17964242109197692, 0.1168501950598273], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 484.59259259259255, 402, 695, 420.5, 627.5, 675.0, 695.0, 0.241897551907183, 71.12591201536497, 0.12165746018769458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bf8249e-2192-4cb6-bad7-efba749ba5f5", 3, 0, 0.0, 426.0, 261, 698, 319.0, 698.0, 698.0, 698.0, 0.023921728105638352, 0.023991811293447837, 0.01534043110941001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ba33d0d-08d0-452d-be86-1a7c38e20659", 1, 0, 0.0, 760.0, 760, 760, 760.0, 760.0, 760.0, 760.0, 1.3157894736842104, 0.2377158717105263, 0.9071751644736842], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 127.24074074074079, 83, 263, 87.5, 255.5, 257.0, 263.0, 0.24224262842223787, 0.4286559010752881, 0.11780940327565866], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 645.7407407407406, 567, 869, 586.0, 756.5, 833.0, 869.0, 0.24189863551251153, 217.66081744660312, 0.12142177602874114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 110.00000000000001, 86, 254, 90.0, 249.2, 254.0, 254.0, 0.08789118037855248, 0.06566089159139908, 0.03124256802518858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 16, 9.63855421686747, 146.5180722891566, 84, 1251, 91.0, 297.50000000000006, 345.3, 1023.2000000000043, 0.690085221367699, 1.542676451101642, 0.32953047053627105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 92.36363636363637, 86, 109, 90.0, 106.20000000000002, 109.0, 109.0, 0.052827977696988326, 0.04091072882198412, 0.01877869519697632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 111.62499999999999, 85, 264, 90.0, 257.7, 264.0, 264.0, 0.09524886743143571, 0.0772966883159405, 0.03385799584476816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57e2b8d4-57ca-4934-b5b6-3135d8467b44", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 220.0, 169, 505, 175.0, 472.4000000000001, 505.0, 505.0, 0.05090542235303373, 0.07889346218189897, 0.11448748796780926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08c1ee1d-5272-4dc4-971e-a36644f4ec3f", 3, 0, 0.0, 268.3333333333333, 211, 357, 237.0, 357.0, 357.0, 357.0, 0.04864049807870033, 0.03127115354994568, 0.03119198607260405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 251.93333333333334, 169, 672, 174.0, 472.8000000000001, 672.0, 672.0, 0.08340051708320592, 6.772371754329877, 0.1861471306747102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=377b1632-48c5-4fe4-882b-a44531ed3e77", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=434c93f9-8748-47b4-b04f-d4f25ce7db25", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 111.88888888888889, 88, 248, 94.0, 248.0, 248.0, 248.0, 0.07123070834982193, 0.059057491590819154, 0.025320290858725763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b833fd24-2429-4363-8f46-262d65ffd710", 2, 0, 0.0, 181.0, 172, 190, 181.0, 190.0, 190.0, 190.0, 0.026886056890896383, 0.03095572370543636, 0.01671188985454643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 91.50000000000001, 86, 104, 89.5, 103.4, 104.0, 104.0, 0.05967180507210343, 0.04632723147687718, 0.021211461959224267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 114.41176470588236, 83, 252, 86.0, 250.4, 252.0, 252.0, 0.08995137334582069, 0.06684862804313432, 0.0451513729489764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 115.00000000000001, 82, 254, 85.0, 252.4, 254.0, 254.0, 0.08995565715253305, 0.032017764919410316, 0.050858431623117546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 181.76470588235293, 82, 582, 86.0, 321.19999999999976, 582.0, 582.0, 0.08995613315624322, 4.784154268484663, 0.05242962586185913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 148.11764705882356, 81, 570, 84.0, 394.79999999999984, 570.0, 570.0, 0.0899551811538604, 1.5786906924167783, 0.0525169178576909], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.22222222222222, 0.6259780907668232], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.2347417840375587], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.2347417840375587], "isController": false}, {"data": ["401/Unauthorized", 22, 61.111111111111114, 1.7214397496087637], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 36, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
