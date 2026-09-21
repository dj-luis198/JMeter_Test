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

    var data = {"OkPercent": 97.37827715355806, "KoPercent": 2.6217228464419478};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7320742637644047, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9213501-cb6c-4bb3-88ca-d6cb6dc1b647"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d67de0c-caba-4b84-996d-2a8614f0a37c"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f269d87-f7bb-4580-8867-5e2f8a8bdd67"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83036c49-bf30-44ef-919c-4229b3eebe13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acefba63-fa85-4792-8610-f49a5aecc2c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdca26c8-ad85-46eb-bfd9-d0e2416e3f19"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acefba63-fa85-4792-8610-f49a5aecc2c3"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c685a89-6afd-43e1-9af6-b5adbbe24937"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a51e4c5-6fc7-49ff-b9d1-eb01e90c0c7d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6cbc19c2-c0ef-4775-b523-20e72d307edc"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a654be58-7f3c-4018-a474-c2d92deb5dd1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d67de0c-caba-4b84-996d-2a8614f0a37c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47860e30-5925-4abe-b873-ce5f9637f01b"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f1b3870e-bf55-40f9-9507-9f6d3d28dc53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e373df3b-2d31-4368-ae33-c316bf8a4db7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ffe4b9e-175c-4355-b20a-d706000c4549"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83036c49-bf30-44ef-919c-4229b3eebe13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a51e4c5-6fc7-49ff-b9d1-eb01e90c0c7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cbc19c2-c0ef-4775-b523-20e72d307edc"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a654be58-7f3c-4018-a474-c2d92deb5dd1"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0b15828-f285-4e07-98aa-a7701757d93b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f269d87-f7bb-4580-8867-5e2f8a8bdd67"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "addBook"], "isController": true}, {"data": [0.9051724137931034, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4224137931034483, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9294117647058824, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c685a89-6afd-43e1-9af6-b5adbbe24937"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47860e30-5925-4abe-b873-ce5f9637f01b"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1b3870e-bf55-40f9-9507-9f6d3d28dc53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ffe4b9e-175c-4355-b20a-d706000c4549"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e373df3b-2d31-4368-ae33-c316bf8a4db7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 35, 2.6217228464419478, 451.60299625468144, 125, 3332, 145.0, 1262.4, 1503.2000000000003, 2094.080000000002, 5.335731414868106, 768.4955707309153, 3.903529520133893], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2219.2068965517237, 1604, 4064, 2177.0, 2658.1000000000004, 3025.849999999997, 4064.0, 0.25435249747840194, 306.0696123796759, 1.2506492429724159], "isController": true}, {"data": ["deleteBook", 16, 4, 25.0, 491.18750000000006, 130, 1150, 484.5, 949.8000000000002, 1150.0, 1150.0, 0.08822426608438651, 0.01845903223494122, 0.05890951360859305], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 491.18750000000006, 130, 1150, 484.5, 949.8000000000002, 1150.0, 1150.0, 0.08839290646925585, 0.01849431661234186, 0.05902211894370477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 145.75, 125, 382, 129.5, 212.60000000000016, 382.0, 382.0, 0.08502136161710629, 0.03871211899802326, 0.04759618705762323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 132.0, 126, 140, 132.0, 140.0, 140.0, 140.0, 0.08502407244050972, 0.0631868350851835, 0.04267809886174023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 293.1875, 130, 1046, 137.5, 1025.7, 1046.0, 1046.0, 0.08502226520570075, 3.144972759663312, 0.04915349707204574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9213501-cb6c-4bb3-88ca-d6cb6dc1b647", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 305.25, 127, 1399, 133.0, 1207.2000000000003, 1399.0, 1399.0, 0.08502678343678259, 9.583458853015262, 0.049073075206189955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d67de0c-caba-4b84-996d-2a8614f0a37c", 3, 0, 0.0, 339.0, 274, 467, 276.0, 467.0, 467.0, 467.0, 0.017054757140258323, 0.023511359534177732, 0.010936807150491177], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 274.70588235294116, 127, 511, 260.0, 470.2, 511.0, 511.0, 0.08568721143571444, 0.14548318136454366, 0.055375754173471244], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 148.33333333333334, 127, 385, 130.0, 240.4000000000001, 385.0, 385.0, 0.0785270420957297, 0.058358475619971, 0.039416894176958074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f269d87-f7bb-4580-8867-5e2f8a8bdd67", 3, 0, 0.0, 449.0, 325, 597, 425.0, 597.0, 597.0, 597.0, 0.07804979576970107, 0.03617933241408019, 0.05005146408408565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83036c49-bf30-44ef-919c-4229b3eebe13", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.2614530571635311, 0.9977613965267729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 201.0666666666667, 129, 398, 132.0, 395.0, 398.0, 398.0, 0.07852293131337455, 0.028873536201688768, 0.044342962644024146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 944.5, 752, 1129, 983.0, 1129.0, 1129.0, 1129.0, 0.07072823559575277, 20.796449663598832, 0.04033719686320275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1300.1249999999998, 1016, 1523, 1329.0, 1523.0, 1523.0, 1523.0, 0.07061461192857332, 63.5391519405778, 0.040203436283552975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 267.5, 130, 435, 260.5, 435.0, 435.0, 435.0, 0.07097861769142046, 0.12559888208677136, 0.03930163694437051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acefba63-fa85-4792-8610-f49a5aecc2c3", 3, 0, 0.0, 406.0, 225, 533, 460.0, 533.0, 533.0, 533.0, 0.05315379163713678, 0.03417276643338058, 0.03408625310063785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 134.66666666666669, 128, 142, 133.5, 142.0, 142.0, 142.0, 0.15081818867355404, 0.1120826577935299, 0.07570366111153005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 219.16666666666669, 128, 391, 142.5, 391.0, 391.0, 391.0, 0.15078786660300067, 0.040347534618381045, 0.08599620517202383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 180.16666666666669, 126, 426, 129.0, 426.0, 426.0, 426.0, 0.15077271013946475, 0.040637957029777606, 0.08863786279683376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 219.33333333333331, 126, 395, 142.0, 395.0, 395.0, 395.0, 0.15077271013946475, 0.040637957029777606, 0.08878510177157935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 135.75, 129, 157, 132.5, 157.0, 157.0, 157.0, 0.0711699449322551, 0.052890945403755996, 0.03996359212504559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdca26c8-ad85-46eb-bfd9-d0e2416e3f19", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 750.1904761904764, 125, 1694, 381.0, 1560.4, 1682.1, 1694.0, 0.09775171065493646, 41.89816330063306, 0.053467058255364706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 213.66666666666669, 127, 1129, 130.0, 677.8000000000003, 1129.0, 1129.0, 0.07852868652918911, 4.7304382178830755, 0.04571637467083392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 603.8095238095237, 126, 1192, 391.0, 1147.4, 1187.6, 1192.0, 0.09764716823212126, 13.685933576676277, 0.05350523545754673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 227.8, 127, 1062, 134.0, 653.4000000000003, 1062.0, 1062.0, 0.07852416450288968, 1.5590011758993634, 0.04579042587580618], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 487.0625, 130, 1191, 464.5, 1123.8000000000002, 1191.0, 1191.0, 0.08858278615008137, 0.018534044856108337, 0.059494932787811004], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 408.8333333333333, 280, 555, 404.0, 555.0, 555.0, 555.0, 0.15027048687637748, 0.23288990495391707, 0.33796184694950915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acefba63-fa85-4792-8610-f49a5aecc2c3", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 745.3478260869566, 159, 1479, 681.0, 1286.4, 1443.5999999999995, 1479.0, 0.10145969623849205, 0.0623224110683706, 0.045874843123458804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 131.42857142857142, 126, 146, 130.0, 143.0, 145.9, 146.0, 0.09775717118677205, 0.07264961647766946, 0.04906951756836019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 204.2380952380952, 126, 401, 133.0, 393.2, 400.4, 401.0, 0.09764580611262746, 0.09596570249182798, 0.05178351808539824], "isController": false}, {"data": ["login", 23, 0, 0.0, 3070.4782608695655, 1847, 4517, 3075.0, 4069.4000000000005, 4445.799999999999, 4517.0, 0.10197973706963442, 42.572565303057175, 0.21268438795530628], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 140.99999999999997, 129, 183, 135.0, 168.60000000000002, 183.0, 183.0, 0.07879103042909595, 0.06378687912668021, 0.0280077490978427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c685a89-6afd-43e1-9af6-b5adbbe24937", 3, 0, 0.0, 348.0, 255, 529, 260.0, 529.0, 529.0, 529.0, 0.02274226194537309, 0.022808889665916172, 0.014584067718875318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a51e4c5-6fc7-49ff-b9d1-eb01e90c0c7d", 3, 0, 0.0, 386.0, 275, 516, 367.0, 516.0, 516.0, 516.0, 0.05060045877749291, 0.032531219428889493, 0.032448861911348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cbc19c2-c0ef-4775-b523-20e72d307edc", 3, 0, 0.0, 607.0, 236, 1049, 536.0, 1049.0, 1049.0, 1049.0, 0.026035790533386564, 0.026112067263464843, 0.016696128694912608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 895.7619047619048, 256, 1828, 527.0, 1695.0, 1816.1999999999998, 1828.0, 0.09758500350841323, 55.67235795137711, 0.20758141813082895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a654be58-7f3c-4018-a474-c2d92deb5dd1", 3, 0, 0.0, 429.3333333333333, 322, 496, 470.0, 496.0, 496.0, 496.0, 0.03278330237132553, 0.02664710482460933, 0.021023146377445085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d67de0c-caba-4b84-996d-2a8614f0a37c", 1, 0, 0.0, 1095.0, 1095, 1095, 1095.0, 1095.0, 1095.0, 1095.0, 0.91324200913242, 0.1649900114155251, 0.6296375570776256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47860e30-5925-4abe-b873-ce5f9637f01b", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 472.9375, 264, 1529, 277.5, 1335.1000000000001, 1529.0, 1529.0, 0.08496086490160469, 12.8205551030947, 0.1883617222098321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 786.0624999999999, 127, 1653, 660.5, 1632.0, 1653.0, 1653.0, 0.13273932485460896, 79.41894916083858, 0.19363219384919153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1b3870e-bf55-40f9-9507-9f6d3d28dc53", 3, 0, 0.0, 553.0, 378, 700, 581.0, 700.0, 700.0, 700.0, 0.0636118826996883, 0.02878272036216365, 0.040792776340620424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e373df3b-2d31-4368-ae33-c316bf8a4db7", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ffe4b9e-175c-4355-b20a-d706000c4549", 3, 0, 0.0, 429.6666666666667, 259, 606, 424.0, 606.0, 606.0, 606.0, 0.020945771397850966, 0.024757192690623975, 0.013432021371668748], "isController": false}, {"data": ["register", 25, 9, 36.0, 1110.8000000000002, 156, 2315, 1091.0, 1792.6000000000001, 2161.7, 2315.0, 0.1011527365861356, 0.03151539949261787, 0.04563726982694789], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 167.00000000000003, 129, 416, 135.5, 403.40000000000003, 416.0, 416.0, 0.09005087874649177, 0.06991254746431734, 0.032010273304417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 433.53333333333336, 262, 1258, 273.0, 961.6000000000001, 1258.0, 1258.0, 0.07846747784601542, 6.37179419484521, 0.1751367541012335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 400.764705882353, 257, 549, 510.0, 535.4, 549.0, 549.0, 0.09021630686280753, 0.13981765526491752, 0.20289858857914622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 156.18181818181816, 129, 380, 134.0, 332.4000000000002, 380.0, 380.0, 0.05742625946228139, 0.0426771322761681, 0.02882529039415296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83036c49-bf30-44ef-919c-4229b3eebe13", 3, 0, 0.0, 302.3333333333333, 221, 451, 235.0, 451.0, 451.0, 451.0, 0.03053124363932424, 0.030620690642173824, 0.019578955068186445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 154.72727272727272, 127, 395, 129.0, 343.20000000000016, 395.0, 395.0, 0.057428058305141375, 0.015366492163680407, 0.03275193950215094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 178.45454545454547, 128, 394, 130.0, 390.8, 394.0, 394.0, 0.0574247605126465, 0.01547776748192425, 0.033759478348255066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 154.81818181818184, 126, 393, 132.0, 342.00000000000017, 393.0, 393.0, 0.057428358123241256, 0.01547873715040487, 0.033817675730775855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a51e4c5-6fc7-49ff-b9d1-eb01e90c0c7d", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cbc19c2-c0ef-4775-b523-20e72d307edc", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 138.75, 130, 148, 138.5, 148.0, 148.0, 148.0, 0.090063720081958, 0.026561761196046203, 0.05567415508972599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a654be58-7f3c-4018-a474-c2d92deb5dd1", 1, 0, 0.0, 1191.0, 1191, 1191, 1191.0, 1191.0, 1191.0, 1191.0, 0.8396305625524769, 0.15169106842989083, 0.5788859151973131], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1563.4827586206895, 1025, 3332, 1398.0, 2109.3, 2428.6499999999983, 3332.0, 0.2748789111003687, 328.8507410474782, 0.5427784748485797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1110.8000000000002, 156, 2315, 1091.0, 1792.6000000000001, 2161.7, 2315.0, 0.10319278476048954, 0.03215100200194003, 0.046557682186861495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 154.5, 127, 376, 130.5, 351.80000000000007, 376.0, 376.0, 0.04706413900864098, 0.012685256217172763, 0.02771452717012745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 182.2, 128, 384, 132.0, 383.7, 384.0, 384.0, 0.047008165318315795, 0.012670169558452302, 0.02763565968908799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 248.11111111111114, 126, 1470, 129.0, 507.00000000000153, 1470.0, 1470.0, 0.09030976248532467, 4.537482510322908, 0.052661096310344484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 231.6666666666667, 126, 784, 130.0, 540.1000000000004, 784.0, 784.0, 0.0903088562885067, 1.4982000159294788, 0.05274876013466054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 181.2, 127, 400, 129.5, 397.7, 400.0, 400.0, 0.04706436051300153, 0.012593393340392988, 0.026841393105071186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 144.83333333333334, 128, 379, 130.0, 163.90000000000035, 379.0, 379.0, 0.09030840319691746, 0.06711395979770918, 0.04533058519845271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 187.2, 128, 430, 131.5, 426.40000000000003, 430.0, 430.0, 0.04706369600617476, 0.034976047520213854, 0.02362376928434944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 157.11111111111111, 126, 382, 129.0, 380.2, 382.0, 382.0, 0.09030930938464239, 0.031700370644457264, 0.0510831629581316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 188.1, 128, 414, 134.0, 411.2, 414.0, 414.0, 0.04797129397768375, 0.03775865522071593, 0.01705229590612977], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 419.49999999999994, 128, 700, 468.5, 627.9000000000001, 700.0, 700.0, 0.08846572782413013, 0.017904806730030247, 0.06019384361470964], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f0b15828-f285-4e07-98aa-a7701757d93b", 2, 0, 0.0, 222.0, 219, 225, 222.0, 225.0, 225.0, 225.0, 0.01990743044841487, 0.028373920644005374, 0.012374101055093813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f269d87-f7bb-4580-8867-5e2f8a8bdd67", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 0.6124205508474576, 2.337129237288136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1574.6521739130437, 950, 2727, 1489.0, 2327.2000000000003, 2658.7999999999993, 2727.0, 0.1001589478955734, 0.051840080453763586, 0.0460692035730616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 396.1, 258, 807, 266.0, 805.8, 807.0, 807.0, 0.0469787937724911, 0.07280795480170252, 0.10565640825981153], "isController": false}, {"data": ["addBook", 56, 10, 17.857142857142858, 1261.410714285714, 675, 2689, 1070.0, 2136.6, 2234.15, 2689.0, 0.26960796113793817, 81.71795956873558, 0.9799993620883062], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 247.34482758620697, 128, 909, 135.0, 516.4, 544.9499999999996, 909.0, 0.27637340906600083, 0.2053907854484635, 0.13359847410905315], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 848.689655172414, 624, 2265, 765.5, 1140.1, 1174.6, 2265.0, 0.27623914689731044, 81.22348119073361, 0.13892886782433095], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 195.32758620689657, 127, 416, 134.0, 385.1, 399.84999999999997, 416.0, 0.2769434987513668, 0.49006017552487957, 0.13468541247869206], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1292.6896551724137, 894, 2937, 1245.0, 1570.8, 1758.8499999999967, 2937.0, 0.275614311035502, 247.9982415480258, 0.1383454647189922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 135.41176470588238, 128, 143, 136.0, 142.2, 143.0, 143.0, 0.09390916221979163, 0.07015674716615293, 0.03338177250781656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, 5.882352941176471, 197.8235294117647, 128, 717, 137.0, 372.9000000000001, 418.2999999999996, 622.5699999999989, 0.7349380922736392, 1.6649674600755688, 0.3496697642145673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 181.27272727272725, 131, 386, 136.0, 385.8, 386.0, 386.0, 0.05387192195427743, 0.04171917393529493, 0.019149784757184558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 135.50000000000003, 130, 144, 134.0, 143.3, 144.0, 144.0, 0.0841166698210418, 0.06826264904422434, 0.02990084747544845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c685a89-6afd-43e1-9af6-b5adbbe24937", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47860e30-5925-4abe-b873-ce5f9637f01b", 3, 0, 0.0, 399.0, 255, 511, 431.0, 511.0, 511.0, 511.0, 0.02379592613744527, 0.023865640764801067, 0.015259757321213275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 339.2727272727273, 264, 776, 271.0, 725.4000000000002, 776.0, 776.0, 0.057384617792361585, 0.08893494964499789, 0.12905935036700072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 445.7777777777778, 258, 1604, 267.5, 848.9000000000012, 1604.0, 1604.0, 0.09024953997803928, 6.130422297339644, 0.20169048669571366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 140.5, 133, 150, 140.0, 150.0, 150.0, 150.0, 0.1490757304710793, 0.12359892106440072, 0.05299176356589148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 136.5714285714286, 129, 146, 136.0, 146.0, 146.0, 146.0, 0.09413832057236099, 0.0730859031787373, 0.033463231140956444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1b3870e-bf55-40f9-9507-9f6d3d28dc53", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.5409103667664671, 2.0642309131736525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ffe4b9e-175c-4355-b20a-d706000c4549", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e373df3b-2d31-4368-ae33-c316bf8a4db7", 3, 0, 0.0, 397.3333333333333, 269, 516, 407.0, 516.0, 516.0, 516.0, 0.035431675918270934, 0.029537930347230422, 0.02272148488248494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 130.41176470588235, 127, 135, 129.0, 134.2, 135.0, 135.0, 0.0902781096825928, 0.06709144674653625, 0.045315379274270214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 221.23529411764707, 127, 402, 130.0, 398.0, 402.0, 402.0, 0.09027954796499278, 0.024156832170320334, 0.051487554698784944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 206.9411764705882, 125, 415, 130.0, 399.8, 415.0, 415.0, 0.09027906853243409, 0.02433303019038262, 0.0530742180239505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 203.8235294117647, 126, 383, 132.0, 382.2, 383.0, 383.0, 0.09027906853243409, 0.02433303019038262, 0.05316238117681421], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.714285714285715, 0.6741573033707865], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.299625468164794], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.428571428571429, 0.299625468164794], "isController": false}, {"data": ["401/Unauthorized", 18, 51.42857142857143, 1.348314606741573], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 35, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
