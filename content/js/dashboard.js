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

    var data = {"OkPercent": 98.78048780487805, "KoPercent": 1.2195121951219512};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.819281045751634, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.28703703703703703, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=758a661f-b94d-4512-ad17-c3fdb2fb5adb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e5128dd-68bc-413c-afdb-834d8bb5632c"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/128b4439-ec2f-4a7c-bd07-5c5efa6ffc34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/385d4857-669a-4141-a0d5-b89f3a8f4ac1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3fed300-73db-4073-98c7-4653aa1f11bf"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd1b97d3-ce93-452c-9355-2bbb08b0b4e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/48196786-7ddf-4f2a-9b9a-cbd04c7d28f5"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9368ef79-8535-471a-a1fc-6a196136ae58"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/92117b1a-713e-4eba-ad8a-a8ebab841600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beea911a-7507-45cc-858f-f7a9afc1f4d4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be3cbef3-2b90-4692-a5d4-f01d02ebe9ae"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/aa37037c-75de-4b51-85c4-822e4ca110f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e089404-bb62-406d-a1a2-9ae6915e03ab"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3822ebf7-0fd3-439b-a44b-2a031968b929"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c1874c9b-7015-46fc-94c4-e90a123d72a1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17c23659-80c5-44b4-8449-6cec9666c7bb"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17c23659-80c5-44b4-8449-6cec9666c7bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5394f90-aead-42aa-bdd0-52e9ab0f751d"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/758a661f-b94d-4512-ad17-c3fdb2fb5adb"], "isController": false}, {"data": [0.46296296296296297, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd1b97d3-ce93-452c-9355-2bbb08b0b4e1"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=385d4857-669a-4141-a0d5-b89f3a8f4ac1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e5128dd-68bc-413c-afdb-834d8bb5632c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3fed300-73db-4073-98c7-4653aa1f11bf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48196786-7ddf-4f2a-9b9a-cbd04c7d28f5"], "isController": false}, {"data": [0.40625, 500, 1500, "addBook"], "isController": true}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7870370370370371, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.945054945054945, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be3cbef3-2b90-4692-a5d4-f01d02ebe9ae"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/beea911a-7507-45cc-858f-f7a9afc1f4d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92117b1a-713e-4eba-ad8a-a8ebab841600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e089404-bb62-406d-a1a2-9ae6915e03ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9368ef79-8535-471a-a1fc-6a196136ae58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3822ebf7-0fd3-439b-a44b-2a031968b929"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 16, 1.2195121951219512, 305.13338414634126, 81, 2712, 98.0, 832.4000000000001, 1064.6999999999998, 1585.0, 5.086119004330179, 689.6975864678997, 3.7078422651352745], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1423.333333333333, 1015, 2177, 1418.0, 1666.5, 2023.0, 2177.0, 0.25387034747328485, 305.49089019754877, 1.248278515164052], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=758a661f-b94d-4512-ad17-c3fdb2fb5adb", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e5128dd-68bc-413c-afdb-834d8bb5632c", 3, 0, 0.0, 525.6666666666666, 162, 1049, 366.0, 1049.0, 1049.0, 1049.0, 0.058004640371229696, 0.03729139476991493, 0.03719698617556071], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 586.7142857142858, 89, 2683, 431.5, 1664.5, 2683.0, 2683.0, 0.08160743327135055, 0.015409550911380156, 0.055188620644931886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 586.7142857142858, 89, 2683, 431.5, 1664.5, 2683.0, 2683.0, 0.08188954270539651, 0.015462820319720173, 0.055379402659655366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 155.3125, 81, 253, 84.5, 251.6, 253.0, 253.0, 0.08988915543520397, 0.04092853390787485, 0.05032124839182683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/128b4439-ec2f-4a7c-bd07-5c5efa6ffc34", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 106.12499999999999, 83, 259, 85.0, 251.3, 259.0, 259.0, 0.08997104057131611, 0.0668632440183316, 0.0451612449742739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 208.25, 82, 664, 90.5, 650.0, 664.0, 664.0, 0.08988006628654888, 3.324662774204421, 0.05196191332191108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 205.8125, 81, 896, 84.5, 788.2000000000002, 896.0, 896.0, 0.08997002873417792, 10.140617268200657, 0.051926061505760894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/385d4857-669a-4141-a0d5-b89f3a8f4ac1", 3, 0, 0.0, 261.3333333333333, 167, 421, 196.0, 421.0, 421.0, 421.0, 0.07878358150161507, 0.035647518973712544, 0.05052202329367893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3fed300-73db-4073-98c7-4653aa1f11bf", 3, 0, 0.0, 301.3333333333333, 182, 401, 321.0, 401.0, 401.0, 401.0, 0.03103116563401843, 0.031122077252086842, 0.019899543066086038], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 182.93333333333337, 84, 264, 171.0, 244.8, 264.0, 264.0, 0.08302567707439655, 0.1848402378408896, 0.05366939763487521], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cd1b97d3-ce93-452c-9355-2bbb08b0b4e1", 3, 0, 0.0, 284.6666666666667, 194, 371, 289.0, 371.0, 371.0, 371.0, 0.022142018909284147, 0.02656033192731513, 0.014199146240654222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 105.1875, 82, 245, 84.5, 245.0, 245.0, 245.0, 0.1034580865426894, 0.07688633189354163, 0.05193110984662339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 105.3125, 82, 246, 85.0, 244.6, 246.0, 246.0, 0.10345072835778435, 0.0471034200164228, 0.057913212920995966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 539.3333333333334, 483, 649, 486.0, 649.0, 649.0, 649.0, 0.05234871222167935, 15.392259534009213, 0.029855124938926503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1009.6666666666666, 823, 1145, 1061.0, 1145.0, 1145.0, 1145.0, 0.051899522524392776, 46.699281597078055, 0.029548263312227527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 195.0, 86, 253, 246.0, 253.0, 253.0, 253.0, 0.05286809410520751, 0.09355174464710547, 0.029273641950832673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 97.30769230769232, 83, 246, 84.0, 184.39999999999995, 246.0, 246.0, 0.13721475164129954, 0.1019730722646767, 0.06887537338244917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 134.00000000000003, 81, 257, 83.0, 254.6, 257.0, 257.0, 0.1372176483006122, 0.052569862254591516, 0.07737046785940468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 171.30769230769232, 81, 727, 84.0, 538.5999999999999, 727.0, 727.0, 0.136976197751483, 9.514958146527654, 0.07962153081437619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 191.15384615384616, 81, 659, 86.0, 497.39999999999986, 659.0, 659.0, 0.1369689817936615, 3.132033653542228, 0.07975109509334963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 139.66666666666666, 82, 254, 83.0, 254.0, 254.0, 254.0, 0.05287088928835783, 0.03929174487152374, 0.02968824349688062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 578.7368421052632, 82, 1189, 733.0, 1077.0, 1189.0, 1189.0, 0.09164267075682375, 43.41182460256021, 0.0497308448730749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 166.5625, 82, 723, 86.5, 613.1000000000001, 723.0, 723.0, 0.1034500594837842, 11.659965817029175, 0.059706040190348114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 385.9473684210527, 82, 830, 486.0, 668.0, 830.0, 830.0, 0.09164222873900293, 14.193730767190152, 0.04982009937152724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 177.18750000000003, 82, 730, 85.0, 678.2, 730.0, 730.0, 0.10345072835778435, 3.8266414316934236, 0.05980745233184407], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 410.92857142857144, 89, 811, 385.5, 749.0, 811.0, 811.0, 0.08205320564291617, 0.015493724028695177, 0.05615401789639024], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/48196786-7ddf-4f2a-9b9a-cbd04c7d28f5", 3, 0, 0.0, 813.6666666666666, 210, 1856, 375.0, 1856.0, 1856.0, 1856.0, 0.023258157798847948, 0.027490355132687792, 0.014914899369703924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 321.15384615384613, 167, 973, 329.0, 722.9999999999998, 973.0, 973.0, 0.13684642672926514, 12.789301899007338, 0.30507747942040275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9368ef79-8535-471a-a1fc-6a196136ae58", 3, 0, 0.0, 238.0, 166, 377, 171.0, 377.0, 377.0, 377.0, 0.019291860121152884, 0.026595386592800276, 0.012371407694879941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 525.0, 143, 1548, 471.5, 818.7, 1511.5999999999995, 1548.0, 0.09221731933474427, 0.05664520884917396, 0.04169591684764316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 94.3157894736842, 82, 249, 84.0, 94.0, 249.0, 249.0, 0.0916373668243794, 0.06810159780600852, 0.045997662644268564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 119.05263157894736, 83, 256, 84.0, 255.0, 256.0, 256.0, 0.09156935414688688, 0.09688768115068942, 0.048175570983117505], "isController": false}, {"data": ["login", 20, 0, 0.0, 2420.35, 1505, 4806, 2173.5, 3681.3, 4750.549999999999, 4806.0, 0.0950303859659126, 17.18676035920298, 0.16701775939731728], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 92.3125, 85, 113, 88.5, 110.9, 113.0, 113.0, 0.100035012254289, 0.08098537613164608, 0.0355593207622668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92117b1a-713e-4eba-ad8a-a8ebab841600", 3, 0, 0.0, 818.3333333333334, 192, 1846, 417.0, 1846.0, 1846.0, 1846.0, 0.019461184667181306, 0.02682881414892996, 0.012479991469514055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beea911a-7507-45cc-858f-f7a9afc1f4d4", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be3cbef3-2b90-4692-a5d4-f01d02ebe9ae", 3, 0, 0.0, 376.3333333333333, 232, 561, 336.0, 561.0, 561.0, 561.0, 0.05102474700229611, 0.03313618823879581, 0.03272094778467557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 682.9999999999999, 168, 1273, 817.0, 1168.0, 1273.0, 1273.0, 0.09152700769308586, 57.697781696946855, 0.1935210996849544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa37037c-75de-4b51-85c4-822e4ca110f6", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 0.37132085755813954, 0.6938135901162791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e089404-bb62-406d-a1a2-9ae6915e03ab", 3, 0, 0.0, 314.6666666666667, 227, 422, 295.0, 422.0, 422.0, 422.0, 0.0442008486562942, 0.028416886750058934, 0.028344945264615746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3822ebf7-0fd3-439b-a44b-2a031968b929", 3, 0, 0.0, 288.6666666666667, 163, 536, 167.0, 536.0, 536.0, 536.0, 0.06009976561091412, 0.038090574103011, 0.03854053979606146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1874c9b-7015-46fc-94c4-e90a123d72a1", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.3628817471590909, 0.6780450994318182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 376.5625, 168, 981, 332.5, 877.4000000000001, 981.0, 981.0, 0.08983717012914093, 13.556387299971925, 0.19917269090398654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 723.6, 84, 1399, 906.0, 1399.0, 1399.0, 1399.0, 0.06009254251547383, 43.14137521783547, 0.09722785589808305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17c23659-80c5-44b4-8449-6cec9666c7bb", 3, 0, 0.0, 339.33333333333337, 160, 596, 262.0, 596.0, 596.0, 596.0, 0.019794793969186104, 0.023396776335323808, 0.01269392712216687], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 974.2608695652174, 138, 1785, 955.0, 1589.8, 1746.5999999999995, 1785.0, 0.09035162495433315, 0.02846505847321467, 0.040764112039943276], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 298.25, 168, 968, 174.5, 860.2000000000002, 968.0, 968.0, 0.10339390492930442, 15.602092292792154, 0.22922852799389978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 117.6470588235294, 84, 261, 88.0, 257.0, 261.0, 261.0, 0.10691084264610624, 0.08300207021841256, 0.03800346359685808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17c23659-80c5-44b4-8449-6cec9666c7bb", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5394f90-aead-42aa-bdd0-52e9ab0f751d", 2, 0, 0.0, 248.5, 233, 264, 248.5, 264.0, 264.0, 264.0, 0.014803191568102083, 0.02529842309001821, 0.009201397883883767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 258.0, 169, 501, 175.0, 405.6000000000001, 501.0, 501.0, 0.09981036031540073, 0.15468656427787206, 0.22447583965465615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 85.33333333333334, 84, 87, 85.0, 87.0, 87.0, 87.0, 0.054980046824673216, 0.04085919495466437, 0.027597406316291047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 84.33333333333334, 82, 93, 84.0, 90.60000000000001, 93.0, 93.0, 0.05498130635583901, 0.014711794864745987, 0.03135652628106444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 85.25, 83, 92, 85.0, 90.2, 92.0, 92.0, 0.05498080253644769, 0.014819044433651916, 0.03232269836615382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 105.33333333333334, 83, 335, 85.0, 260.3000000000003, 335.0, 335.0, 0.05498055063021456, 0.01481897653705002, 0.0323762422168158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 3.31372893258427, 6.945663623595506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/758a661f-b94d-4512-ad17-c3fdb2fb5adb", 3, 0, 0.0, 257.0, 166, 421, 184.0, 421.0, 421.0, 421.0, 0.018734894990913575, 0.02582756519743457, 0.012014239300813719], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 997.8148148148149, 648, 1822, 905.0, 1315.5, 1648.25, 1822.0, 0.2564066038945314, 306.7514396162448, 0.5063028838620532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd1b97d3-ce93-452c-9355-2bbb08b0b4e1", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 974.2608695652174, 138, 1785, 955.0, 1589.8, 1746.5999999999995, 1785.0, 0.09080966688645238, 0.02860936346371759, 0.040970767677286135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 118.69999999999999, 82, 250, 85.5, 249.7, 250.0, 250.0, 0.05049128015591708, 0.013608977854524524, 0.029732658138689447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 86.30000000000001, 82, 93, 85.0, 92.7, 93.0, 93.0, 0.05049153509414147, 0.013609046568342817, 0.02968350012370426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=385d4857-669a-4141-a0d5-b89f3a8f4ac1", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 1.136251965408805, 4.336183176100628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 189.47058823529412, 82, 741, 84.0, 737.8, 741.0, 741.0, 0.11019712320686594, 11.691567874135439, 0.06366973030874641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 172.8235294117647, 81, 704, 84.0, 665.5999999999999, 704.0, 704.0, 0.11019783752949412, 3.8381866297611946, 0.06377775810602328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 103.5, 81, 255, 85.5, 239.00000000000006, 255.0, 255.0, 0.05049128015591708, 0.013510362072969998, 0.028795808213921456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 94.35294117647061, 82, 250, 85.0, 120.39999999999989, 250.0, 250.0, 0.11019426600895814, 0.081892418391423, 0.05531235618027782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 104.7, 83, 246, 87.5, 231.90000000000003, 246.0, 246.0, 0.05049153509414147, 0.03752349434242349, 0.025344383826551478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 94.0, 81, 252, 84.0, 121.59999999999988, 252.0, 252.0, 0.11019783752949412, 0.04895852915056914, 0.061758392861773016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e5128dd-68bc-413c-afdb-834d8bb5632c", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 110.2, 86, 247, 91.0, 234.10000000000005, 247.0, 247.0, 0.04848602390360979, 0.038163803971005356, 0.01723526630948629], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 409.57142857142856, 85, 596, 409.0, 578.5, 596.0, 596.0, 0.0826714694853701, 0.015449000191915911, 0.056265731568691135], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1257.65, 760, 2712, 1107.0, 1786.2000000000003, 2666.3999999999996, 2712.0, 0.09284706231894824, 0.04805560842679938, 0.042706021828344355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 225.2, 168, 502, 178.0, 485.70000000000005, 502.0, 502.0, 0.05046834625322997, 0.07821607959362888, 0.11350449357537952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3fed300-73db-4073-98c7-4653aa1f11bf", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48196786-7ddf-4f2a-9b9a-cbd04c7d28f5", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["addBook", 64, 6, 9.375, 941.9218749999999, 436, 3089, 713.5, 1565.0, 2224.75, 3089.0, 0.29587987277165473, 95.14553753773625, 1.0758783789250315], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 164.85185185185188, 82, 588, 87.0, 342.5, 378.0, 588.0, 0.25720409621338414, 0.19114484103357943, 0.12433205822814956], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 532.4259259259259, 405, 772, 492.5, 687.5, 754.0, 772.0, 0.25706451367202376, 75.5855023647555, 0.1292853755284104], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 125.83333333333334, 81, 267, 87.0, 251.0, 256.5, 267.0, 0.25756845835738096, 0.4557754360777094, 0.1252627854120857], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 831.3703703703701, 565, 1346, 813.0, 1072.0, 1199.5, 1346.0, 0.25686886368825634, 231.1310550739925, 0.1289361288435193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 91.66666666666666, 85, 119, 88.0, 107.60000000000001, 119.0, 119.0, 0.10432823052365817, 0.07794052377988135, 0.03708542569395662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 6, 3.2967032967032965, 166.82967032967034, 83, 2081, 92.5, 264.2000000000003, 357.49999999999994, 1438.5799999999904, 0.7575032360371758, 1.5406538225819206, 0.3688666169988721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 90.0, 86, 100, 88.5, 98.2, 100.0, 100.0, 0.054445472858931775, 0.04216333982141885, 0.019353664180323405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 99.93750000000001, 84, 256, 88.5, 148.2000000000001, 256.0, 256.0, 0.08681733090968284, 0.07045429881440082, 0.030860848096801327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 192.83333333333331, 170, 420, 171.5, 347.7000000000003, 420.0, 420.0, 0.05495814021653507, 0.08517438332386831, 0.1236021454283987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be3cbef3-2b90-4692-a5d4-f01d02ebe9ae", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 284.8823529411765, 166, 991, 170.0, 856.5999999999999, 991.0, 991.0, 0.11013429905997137, 15.651654170607747, 0.24437945598515132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beea911a-7507-45cc-858f-f7a9afc1f4d4", 3, 0, 0.0, 242.0, 170, 385, 171.0, 385.0, 385.0, 385.0, 0.0758399271936699, 0.03431559205703162, 0.04863432831104482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92117b1a-713e-4eba-ad8a-a8ebab841600", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e089404-bb62-406d-a1a2-9ae6915e03ab", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 102.61538461538461, 85, 258, 89.0, 193.99999999999994, 258.0, 258.0, 0.13139541935353455, 0.10894014749135822, 0.04670696547332673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9368ef79-8535-471a-a1fc-6a196136ae58", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 89.63157894736841, 85, 97, 89.0, 96.0, 97.0, 97.0, 0.0884856839477655, 0.0686973815805406, 0.03145389546580727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 96.0, 82, 250, 84.0, 153.40000000000006, 250.0, 250.0, 0.0998681740103064, 0.07421843791195622, 0.050129142032517074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 116.73333333333332, 82, 247, 85.0, 245.2, 247.0, 247.0, 0.09986484957024826, 0.026721649201414087, 0.05695417202053221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 138.26666666666668, 82, 251, 84.0, 249.8, 251.0, 251.0, 0.09986684420772304, 0.02691723535286285, 0.05871078145805593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 138.66666666666666, 82, 252, 85.0, 251.4, 252.0, 252.0, 0.09986617931971158, 0.026917056144766013, 0.05880791614236923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3822ebf7-0fd3-439b-a44b-2a031968b929", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.4573170731707317], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07621951219512195], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07621951219512195], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.6097560975609756], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
