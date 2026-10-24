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

    var data = {"OkPercent": 99.4404476418865, "KoPercent": 0.5595523581135092};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7350515463917526, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/753746e5-2442-4e11-abb0-c2659a509eab"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=322ff0b9-bf8d-4f50-b51f-0dd027a61ab6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb943dc0-a55c-4953-b0a9-7b5f7d1c0d93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5972e3e5-0b18-4c49-9a10-ef782c2b39fd"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/752e4547-f76e-44ff-8f6d-faa556ec0187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=312b7f5f-fbe6-4032-8645-d9bbc548d28d"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ed57265-4ddb-4a09-ae35-11faa8c10586"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=384d02ec-04c1-456e-b8c2-96b5c9097c6a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.075, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81aa51d2-3a29-491c-8a3b-b245daff77e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0487fddf-2f26-46d8-9528-bde705a9e9f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/322ff0b9-bf8d-4f50-b51f-0dd027a61ab6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8274082c-cfac-485b-9a41-abc8d559ea01"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08ebca65-fa70-4653-94aa-94c78cd0b29a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/86999b2d-9adc-453d-9f60-4f4509bb08f9"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8274082c-cfac-485b-9a41-abc8d559ea01"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86999b2d-9adc-453d-9f60-4f4509bb08f9"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45a1addd-fc45-4309-81a0-92b0c493dbf4"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29508196721311475, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/384d02ec-04c1-456e-b8c2-96b5c9097c6a"], "isController": false}, {"data": [0.8942307692307693, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ed57265-4ddb-4a09-ae35-11faa8c10586"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/75426d0c-f1f2-4b79-991e-4d4ce503ffdb"], "isController": false}, {"data": [0.9195402298850575, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/312b7f5f-fbe6-4032-8645-d9bbc548d28d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=752e4547-f76e-44ff-8f6d-faa556ec0187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cb53003a-a038-42b7-8cfb-138695cb27a0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/45a1addd-fc45-4309-81a0-92b0c493dbf4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/81aa51d2-3a29-491c-8a3b-b245daff77e0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/f1dd475a-b319-4e03-a12d-909062e8e2d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89440d71-21e3-4c1f-a1cc-b5e6403ac930"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0487fddf-2f26-46d8-9528-bde705a9e9f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=753746e5-2442-4e11-abb0-c2659a509eab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/08ebca65-fa70-4653-94aa-94c78cd0b29a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1251, 7, 0.5595523581135092, 490.66027178257417, 125, 4635, 158.0, 1362.7999999999997, 1670.799999999999, 2966.0000000000005, 4.88164641427267, 656.7417985608703, 3.5570873501556974], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/753746e5-2442-4e11-abb0-c2659a509eab", 3, 0, 0.0, 337.0, 236, 510, 265.0, 510.0, 510.0, 510.0, 0.039774083207382065, 0.033158016632195794, 0.02550616664015061], "isController": false}, {"data": ["see books", 52, 0, 0.0, 2231.9230769230776, 1526, 3291, 2195.0, 2661.5, 2901.5499999999984, 3291.0, 0.245294589367423, 295.172061845488, 1.2061115795556394], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=322ff0b9-bf8d-4f50-b51f-0dd027a61ab6", 1, 0, 0.0, 2144.0, 2144, 2144, 2144.0, 2144.0, 2144.0, 2144.0, 0.4664179104477612, 0.08426495452425373, 0.3215732859141791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb943dc0-a55c-4953-b0a9-7b5f7d1c0d93", 1, 0, 0.0, 3936.0, 3936, 3936, 3936.0, 3936.0, 3936.0, 3936.0, 0.2540650406504065, 0.08113209794207317, 0.15159544905995936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5972e3e5-0b18-4c49-9a10-ef782c2b39fd", 2, 0, 0.0, 332.5, 322, 343, 332.5, 343.0, 343.0, 343.0, 0.030039050765995796, 0.02654818451486933, 0.018671734191949535], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 1468.5384615384617, 496, 4274, 691.0, 3933.5999999999995, 4274.0, 4274.0, 0.06766568985170804, 0.012224758420474597, 0.045991523571082805], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 1468.5384615384617, 496, 4274, 691.0, 3933.5999999999995, 4274.0, 4274.0, 0.06587381617151515, 0.011901031241924123, 0.044773609429076704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 164.31250000000006, 127, 382, 129.5, 381.3, 382.0, 382.0, 0.09519163265548958, 0.034407034215442465, 0.05378931488797135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 164.50000000000003, 126, 386, 130.0, 384.6, 386.0, 386.0, 0.09517577776455892, 0.07073121765510677, 0.04777377907322586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 246.87499999999997, 126, 749, 130.0, 501.2000000000003, 749.0, 749.0, 0.09519503081939122, 1.773460648010424, 0.055545928627525644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 208.8125, 126, 877, 128.0, 530.5000000000003, 877.0, 877.0, 0.09519389807113364, 5.377531423282642, 0.055452304882257046], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 579.2857142857142, 222, 2910, 374.0, 1954.0, 2910.0, 2910.0, 0.06899780685542495, 0.16938538047362067, 0.044606004041300114], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/752e4547-f76e-44ff-8f6d-faa556ec0187", 3, 0, 0.0, 416.0, 248, 629, 371.0, 629.0, 629.0, 629.0, 0.024405323614591128, 0.02447682358611825, 0.015650549323159024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 133.77777777777777, 127, 155, 129.0, 154.1, 155.0, 155.0, 0.13274629969689594, 0.0986522793645877, 0.06663241996504347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 142.16666666666666, 126, 386, 127.0, 159.20000000000036, 386.0, 386.0, 0.13274629969689594, 0.046596601510357896, 0.07508750654513005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 1006.0, 1002, 1010, 1006.0, 1010.0, 1010.0, 1010.0, 0.022047313534845778, 6.482642218951871, 0.012573858500341734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1609.0, 1382, 1836, 1609.0, 1836.0, 1836.0, 1836.0, 0.021957271150341434, 19.75719117784292, 0.012501063555321344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 126.5, 126, 127, 126.5, 127.0, 127.0, 127.0, 0.022264276967605474, 0.03939733385283313, 0.012327973672492486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 167.53846153846158, 126, 379, 129.0, 371.4, 379.0, 379.0, 0.06265996365722107, 0.04656663314760277, 0.03145236457012855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 174.61538461538458, 126, 388, 129.0, 385.2, 388.0, 388.0, 0.06266117176391199, 0.02400630829296508, 0.03533163726411684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 269.99999999999994, 126, 1373, 136.0, 976.9999999999997, 1373.0, 1373.0, 0.06228678753497642, 4.326709210838381, 0.03620606685288819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 298.07692307692304, 127, 999, 137.0, 775.3999999999999, 999.0, 999.0, 0.062398602271309125, 1.4268524135059375, 0.03633199866322995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 127.0, 126, 128, 127.0, 128.0, 128.0, 128.0, 0.02226402912135009, 0.01654582632944084, 0.012501774164820607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1065.8124999999998, 127, 2025, 1389.5, 2016.6, 2025.0, 2025.0, 0.09788626839191214, 55.058791506072005, 0.05228885626013276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 202.44444444444443, 127, 1376, 129.0, 277.1000000000017, 1376.0, 1376.0, 0.13274434177243197, 6.669546154931084, 0.07740539200141594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 700.5625000000002, 126, 1131, 1003.0, 1129.6, 1131.0, 1131.0, 0.09790603468321278, 18.002161390449267, 0.05239502637343809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 232.88888888888886, 126, 1008, 129.5, 590.4000000000007, 1008.0, 1008.0, 0.13274629969689594, 2.2022259664668096, 0.07753616875742088], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 1235.8333333333335, 226, 4166, 673.5, 3585.800000000002, 4166.0, 4166.0, 0.0632477731513203, 0.011426599641595953, 0.04360637484846888], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=312b7f5f-fbe6-4032-8645-d9bbc548d28d", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 519.923076923077, 258, 1500, 505.0, 1220.3999999999996, 1500.0, 1500.0, 0.062248015245975424, 5.8175334104251055, 0.138772111512531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ed57265-4ddb-4a09-ae35-11faa8c10586", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=384d02ec-04c1-456e-b8c2-96b5c9097c6a", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 678.0, 138, 3188, 319.0, 1857.6000000000004, 3122.2999999999993, 3188.0, 0.08362147901309931, 0.051365146776601034, 0.03780932107721189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 145.43750000000003, 127, 379, 128.5, 211.00000000000017, 379.0, 379.0, 0.09790363834395996, 0.07275846560522806, 0.04914303721562053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 194.43749999999997, 127, 387, 129.5, 385.6, 387.0, 387.0, 0.09789645002998078, 0.11809237294876346, 0.05069296155116926], "isController": false}, {"data": ["login", 20, 0, 0.0, 3244.9500000000003, 1258, 8315, 2397.5, 6209.300000000001, 8212.349999999999, 8315.0, 0.08406752303450131, 10.176710261807283, 0.14078026220660433], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81aa51d2-3a29-491c-8a3b-b245daff77e0", 1, 0, 0.0, 905.0, 905, 905, 905.0, 905.0, 905.0, 905.0, 1.1049723756906078, 0.19962879834254144, 0.7618266574585635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 133.61111111111111, 128, 158, 131.0, 141.8, 158.0, 158.0, 0.12817591432152214, 0.10376741501224793, 0.04556253204397859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1228.75, 257, 2155, 1526.5, 2147.3, 2155.0, 2155.0, 0.0978078808700011, 73.18948681809567, 0.20433155190541977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0487fddf-2f26-46d8-9528-bde705a9e9f5", 2, 0, 0.0, 305.0, 233, 377, 305.0, 377.0, 377.0, 377.0, 0.013286741160995442, 0.02627504965919509, 0.00825879955954453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/322ff0b9-bf8d-4f50-b51f-0dd027a61ab6", 3, 0, 0.0, 1079.0, 800, 1439, 998.0, 1439.0, 1439.0, 1439.0, 0.018748242352279475, 0.02584596561259882, 0.012022798643877137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8274082c-cfac-485b-9a41-abc8d559ea01", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 457.875, 258, 1004, 411.0, 838.8000000000002, 1004.0, 1004.0, 0.09510053910118103, 7.249007248815701, 0.21236256857640437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1736.5, 1509, 1964, 1736.5, 1964.0, 1964.0, 1964.0, 0.021926458657662202, 26.231667424956697, 0.04944159476615432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08ebca65-fa70-4653-94aa-94c78cd0b29a", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.23191792362002567, 0.8850489409499358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86999b2d-9adc-453d-9f60-4f4509bb08f9", 3, 0, 0.0, 1776.0, 246, 4635, 447.0, 4635.0, 4635.0, 4635.0, 0.017225144117039112, 0.0237462517368687, 0.011046072236512713], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1110.4761904761906, 213, 2836, 992.0, 1858.2000000000003, 2745.199999999999, 2836.0, 0.08459521191100583, 0.027002489516236235, 0.038166980373910836], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 151.3529411764706, 128, 379, 131.0, 202.19999999999985, 379.0, 379.0, 0.07762734309002489, 0.06026732202790018, 0.027594094614032283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 388.7777777777777, 256, 1504, 269.5, 757.0000000000011, 1504.0, 1504.0, 0.13261915462656657, 9.008482733262356, 0.296378484015708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8274082c-cfac-485b-9a41-abc8d559ea01", 3, 0, 0.0, 603.6666666666666, 251, 1076, 484.0, 1076.0, 1076.0, 1076.0, 0.018532246108228317, 0.025548197352977513, 0.011884285427477144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 537.2307692307692, 255, 1856, 510.0, 1422.3999999999996, 1856.0, 1856.0, 0.09954286851918498, 9.303010884629815, 0.22191509232601053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 159.0, 127, 460, 128.0, 368.20000000000033, 460.0, 460.0, 0.06877460841457333, 0.05111081738622101, 0.034521629614346384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 170.16666666666666, 125, 388, 127.5, 387.1, 388.0, 388.0, 0.06877500257906259, 0.027010755407434577, 0.038741908191102806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86999b2d-9adc-453d-9f60-4f4509bb08f9", 1, 0, 0.0, 2232.0, 2232, 2232, 2232.0, 2232.0, 2232.0, 2232.0, 0.44802867383512546, 0.08094268033154121, 0.30889476926523296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 321.0833333333333, 127, 1622, 131.0, 1258.4000000000015, 1622.0, 1622.0, 0.06877263765989639, 5.173803365059488, 0.03993827655770024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 280.5833333333333, 126, 1167, 128.0, 941.4000000000008, 1167.0, 1167.0, 0.06877500257906259, 1.7021701199837234, 0.04000681302369299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45a1addd-fc45-4309-81a0-92b0c493dbf4", 1, 0, 0.0, 2156.0, 2156, 2156, 2156.0, 2156.0, 2156.0, 2156.0, 0.46382189239332094, 0.0837959473562152, 0.3197834531539889], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1521.7115384615386, 1002, 2656, 1483.5, 2021.0, 2202.5499999999993, 2656.0, 0.24589543769387906, 294.1764305676401, 0.48554743654006205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1110.4761904761906, 213, 2836, 992.0, 1858.2000000000003, 2745.199999999999, 2836.0, 0.08334954018836996, 0.026604875551198448, 0.03760496832717473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 128.0, 127, 132, 127.5, 132.0, 132.0, 132.0, 0.040500792296749306, 0.010916229173733211, 0.02384958765130843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 163.75, 127, 387, 128.0, 387.0, 387.0, 387.0, 0.0405001771882752, 0.0109160633827773, 0.02380967447982585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 197.47058823529412, 127, 1268, 127.0, 378.3999999999992, 1268.0, 1268.0, 0.07734409477836368, 4.113405814512937, 0.04507888244607524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 261.94117647058823, 127, 1257, 129.0, 625.7999999999995, 1257.0, 1257.0, 0.07725552036137406, 1.355814855441288, 0.045102702977518644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 147.1176470588235, 126, 380, 129.0, 200.79999999999984, 380.0, 380.0, 0.07734163163545706, 0.05747752116658478, 0.03882187369201652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 130.375, 125, 136, 130.5, 136.0, 136.0, 136.0, 0.04049894702737729, 0.010836632310059938, 0.02309705572655111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 206.2941176470588, 127, 389, 131.0, 389.0, 389.0, 389.0, 0.0773352985597438, 0.027525822028732338, 0.04372323118250221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 128.625, 127, 130, 129.0, 130.0, 130.0, 130.0, 0.04050058725851525, 0.030098580960673933, 0.020329396338746912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 258.625, 131, 1100, 136.0, 1100.0, 1100.0, 1100.0, 0.04281852971873578, 0.033702866165333044, 0.01522064923595686], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 1619.5454545454547, 464, 4635, 629.0, 4507.6, 4635.0, 4635.0, 0.062316590942566766, 0.011258368480834816, 0.0424166639521182], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1562.4, 818, 4293, 1044.5, 2925.5000000000005, 4226.049999999999, 4293.0, 0.08435045928825083, 0.0436579525613017, 0.03879791633277943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 295.625, 256, 516, 262.0, 516.0, 516.0, 516.0, 0.04047251663167481, 0.06272449599069133, 0.09102363847924519], "isController": false}, {"data": ["addBook", 61, 4, 6.557377049180328, 1581.4918032786884, 724, 4607, 1141.0, 2896.2000000000007, 4093.499999999999, 4607.0, 0.27808676307007785, 88.27542951725734, 1.0121781202702456], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/384d02ec-04c1-456e-b8c2-96b5c9097c6a", 3, 0, 0.0, 407.0, 231, 526, 464.0, 526.0, 526.0, 526.0, 0.09100561201274078, 0.04224414151372668, 0.058359718640982855], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 252.40384615384608, 126, 637, 132.0, 514.7, 519.15, 637.0, 0.24752946552676175, 0.18395500318932195, 0.11965535687084675], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 857.0384615384614, 627, 1278, 763.0, 1119.5000000000002, 1229.9999999999998, 1278.0, 0.24692882276683745, 72.60527270201865, 0.12418783566886846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ed57265-4ddb-4a09-ae35-11faa8c10586", 3, 0, 0.0, 391.0, 242, 499, 432.0, 499.0, 499.0, 499.0, 0.06946695688417542, 0.03143198895475385, 0.04454749513731302], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 216.5192307692308, 125, 529, 131.0, 391.7, 486.8499999999997, 529.0, 0.248015873015873, 0.43887183779761907, 0.12061709449404763], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1260.0384615384612, 871, 2018, 1255.0, 1541.1, 1683.9999999999993, 2018.0, 0.24653312788906007, 221.83094183359012, 0.12374807395993837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 155.6153846153846, 128, 380, 131.0, 291.19999999999993, 380.0, 380.0, 0.1004054836841089, 0.07500995607260089, 0.035691011778335585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75426d0c-f1f2-4b79-991e-4d4ce503ffdb", 1, 0, 0.0, 2376.0, 2376, 2376, 2376.0, 2376.0, 2376.0, 2376.0, 0.42087542087542085, 0.1344006470959596, 0.2511278146043771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, 2.2988505747126435, 292.74712643678157, 127, 3531, 136.5, 484.0, 748.0, 3385.5, 0.7366357759441851, 1.4649822495650038, 0.35907769311287885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 152.24999999999997, 127, 383, 130.0, 309.8000000000003, 383.0, 383.0, 0.06808549268364643, 0.052726362986456665, 0.024202264977389944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/312b7f5f-fbe6-4032-8645-d9bbc548d28d", 3, 0, 0.0, 364.3333333333333, 222, 541, 330.0, 541.0, 541.0, 541.0, 0.09195402298850575, 0.042624521072796934, 0.058967911877394634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=752e4547-f76e-44ff-8f6d-faa556ec0187", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 151.18749999999997, 128, 382, 130.0, 226.60000000000016, 382.0, 382.0, 0.09344102411362427, 0.07582958109220878, 0.03321536404038988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 524.0833333333333, 255, 1750, 391.5, 1487.500000000001, 1750.0, 1750.0, 0.06872143765247568, 6.9488569781609, 0.15309087193187415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 442.11764705882354, 257, 1397, 284.0, 895.3999999999995, 1397.0, 1397.0, 0.07720745188159102, 5.545968096291317, 0.17247935410289483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb53003a-a038-42b7-8cfb-138695cb27a0", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.5412473516949153, 1.0113215042372883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45a1addd-fc45-4309-81a0-92b0c493dbf4", 3, 0, 0.0, 1921.3333333333333, 377, 2910, 2477.0, 2910.0, 2910.0, 2910.0, 0.016034977631206204, 0.022105511154999438, 0.010282846983553457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81aa51d2-3a29-491c-8a3b-b245daff77e0", 3, 0, 0.0, 1562.6666666666667, 246, 3998, 444.0, 3998.0, 3998.0, 3998.0, 0.015230977778003422, 0.020997132451121253, 0.009767261140190995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 197.30769230769226, 128, 742, 132.0, 587.5999999999999, 742.0, 742.0, 0.06038815648893968, 0.0500679149014744, 0.021466102501927774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1dd475a-b319-4e03-a12d-909062e8e2d5", 2, 0, 0.0, 562.0, 478, 646, 562.0, 646.0, 646.0, 646.0, 0.08066793046424393, 0.04959029514379059, 0.050141736074698504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 167.875, 128, 407, 133.5, 393.7, 407.0, 407.0, 0.09640180271371074, 0.07484319644277347, 0.03426782830838936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89440d71-21e3-4c1f-a1cc-b5e6403ac930", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.7750872269417476, 1.4482516686893205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0487fddf-2f26-46d8-9528-bde705a9e9f5", 1, 0, 0.0, 4166.0, 4166, 4166, 4166.0, 4166.0, 4166.0, 4166.0, 0.24003840614498317, 0.04336631361017763, 0.16549522923667787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=753746e5-2442-4e11-abb0-c2659a509eab", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 152.84615384615384, 127, 389, 129.0, 297.3999999999999, 389.0, 389.0, 0.10087606986831793, 0.07496746989237299, 0.05063505850812052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08ebca65-fa70-4653-94aa-94c78cd0b29a", 3, 0, 0.0, 2085.3333333333335, 236, 3242, 2778.0, 3242.0, 3242.0, 3242.0, 0.024978144123891592, 0.02952332074018567, 0.016017885391948712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 246.69230769230774, 126, 394, 136.0, 390.0, 394.0, 394.0, 0.1010807868750486, 0.0387253615581992, 0.05699462036389083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 322.1538461538462, 127, 1726, 130.0, 1240.3999999999996, 1726.0, 1726.0, 0.0998402555910543, 6.935335254458251, 0.05803514856998034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 257.4615384615385, 126, 1009, 129.0, 763.3999999999999, 1009.0, 1009.0, 0.10039307751117839, 2.295662077866415, 0.05845453303704504], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 42.857142857142854, 0.23980815347721823], "isController": false}, {"data": ["401/Unauthorized", 4, 57.142857142857146, 0.31974420463629094], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1251, 7, "401/Unauthorized", 4, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
