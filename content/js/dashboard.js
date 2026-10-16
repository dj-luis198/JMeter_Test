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

    var data = {"OkPercent": 98.61325115562404, "KoPercent": 1.386748844375963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7660915726609158, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09649122807017543, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50683fb7-62f3-465a-8356-3245c0f606b9"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3ea5f92-7c4f-41b1-947c-0bdece7a9e16"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c97bd2e7-2955-4673-a1f4-8088fe29bf93"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62adeb5a-d4ae-49e4-9567-17063a68c81a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab6ae22e-d696-4deb-be49-da64941c8a36"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=286c75ac-1877-4302-a120-de50994fb7ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a685dbe1-c22a-4654-a5ee-d6a8aca16e08"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8e3ddf1-6be0-4c4e-845e-647606a35a03"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11172c0b-7d5b-4383-9ab6-3e5b7aa84ac1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c87903bd-0692-43f8-bb2b-456b51932346"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/53ec3d07-07de-4757-be75-fc852ab875e0"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/866160b8-2578-4940-89ff-3bcebe3a920c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e3b70f0-7950-4ca8-9765-dd2fe16e71b4"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0fe03be8-3270-46bd-97d1-9198fe94a96a"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/286c75ac-1877-4302-a120-de50994fb7ce"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3ea5f92-7c4f-41b1-947c-0bdece7a9e16"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/62adeb5a-d4ae-49e4-9567-17063a68c81a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37719298245614036, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50683fb7-62f3-465a-8356-3245c0f606b9"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11172c0b-7d5b-4383-9ab6-3e5b7aa84ac1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8e3ddf1-6be0-4c4e-845e-647606a35a03"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c87903bd-0692-43f8-bb2b-456b51932346"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab6ae22e-d696-4deb-be49-da64941c8a36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/403cabde-6bb9-4ce2-b685-5fe2c75cb6db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9277456647398844, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53ec3d07-07de-4757-be75-fc852ab875e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fe03be8-3270-46bd-97d1-9198fe94a96a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c97bd2e7-2955-4673-a1f4-8088fe29bf93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee527b72-d081-4ac9-b948-96844146d25c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e3b70f0-7950-4ca8-9765-dd2fe16e71b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 18, 1.386748844375963, 400.6302003081664, 102, 3858, 125.0, 1096.1000000000001, 1334.1, 1986.2299999999998, 5.099475123361724, 727.141310561178, 3.7266838298413583], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1799.6315789473686, 1346, 2550, 1796.0, 2134.8, 2351.599999999999, 2550.0, 0.2528826402722259, 304.3023574166153, 1.2434219665729078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50683fb7-62f3-465a-8356-3245c0f606b9", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 932.5384615384617, 115, 3692, 526.0, 2945.999999999999, 3692.0, 3692.0, 0.07811326423313804, 0.014798802012918732, 0.05280508299534324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 932.5384615384617, 115, 3692, 526.0, 2945.999999999999, 3692.0, 3692.0, 0.07716186779204283, 0.014618556984039363, 0.05216193271188352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 184.26666666666668, 107, 350, 112.0, 338.0, 350.0, 350.0, 0.11895792854593759, 0.05565310381061898, 0.06651111265315833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 127.13333333333334, 107, 335, 112.0, 208.4000000000001, 335.0, 335.0, 0.11895792854593759, 0.0884052574447837, 0.059711303977160075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3ea5f92-7c4f-41b1-947c-0bdece7a9e16", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 280.86666666666673, 104, 873, 319.0, 696.0000000000001, 873.0, 873.0, 0.11896170226265158, 4.69161409220325, 0.0686895401931938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c97bd2e7-2955-4673-a1f4-8088fe29bf93", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 254.13333333333333, 106, 1275, 112.0, 1030.8000000000002, 1275.0, 1275.0, 0.11896264572924102, 14.300161962685383, 0.0685739105004362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62adeb5a-d4ae-49e4-9567-17063a68c81a", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab6ae22e-d696-4deb-be49-da64941c8a36", 3, 0, 0.0, 581.3333333333334, 292, 1049, 403.0, 1049.0, 1049.0, 1049.0, 0.04728505004334463, 0.030953852746473325, 0.030322769721806288], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 268.38461538461536, 113, 403, 244.0, 399.0, 403.0, 403.0, 0.0775998949416807, 0.1499708907124864, 0.050161290262407024], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=286c75ac-1877-4302-a120-de50994fb7ce", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 147.53846153846155, 105, 341, 113.0, 339.4, 341.0, 341.0, 0.10729170965212727, 0.07973534281764535, 0.05385540894647794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 759.0, 622, 891, 761.5, 891.0, 891.0, 891.0, 0.020384242980176322, 5.9936442567395405, 0.01162538857463181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 146.46153846153842, 105, 342, 112.0, 338.0, 342.0, 342.0, 0.1072890532153704, 0.041103828981249174, 0.060495164771226725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a685dbe1-c22a-4654-a5ee-d6a8aca16e08", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.534901067839196, 0.9994634631490787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1143.5, 987, 1224, 1181.5, 1224.0, 1224.0, 1224.0, 0.020373445251459246, 18.33206184995976, 0.011599334552344473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 283.5, 120, 345, 334.5, 345.0, 345.0, 345.0, 0.02044028371113791, 0.0361697207857245, 0.011318008656460151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 112.16666666666667, 104, 125, 112.0, 116.00000000000001, 125.0, 125.0, 0.0854453363460726, 0.06349990328062621, 0.04288955359558722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 111.16666666666667, 102, 121, 111.5, 114.70000000000002, 121.0, 121.0, 0.08545101520553343, 0.022864822428043125, 0.048733782109405786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 135.00000000000003, 103, 339, 110.5, 331.8, 339.0, 339.0, 0.08545426060701009, 0.02303259367923319, 0.050237758677168044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 135.88888888888889, 104, 337, 111.5, 324.40000000000003, 337.0, 337.0, 0.08545020389368095, 0.023031500268218697, 0.05031882123817345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8e3ddf1-6be0-4c4e-845e-647606a35a03", 1, 0, 0.0, 1000.0, 1000, 1000, 1000.0, 1000.0, 1000.0, 1000.0, 1.0, 0.1806640625, 0.689453125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11172c0b-7d5b-4383-9ab6-3e5b7aa84ac1", 3, 0, 0.0, 387.6666666666667, 273, 532, 358.0, 532.0, 532.0, 532.0, 0.04526798647996137, 0.029102953547501205, 0.02902927518408981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 110.25, 107, 113, 110.5, 113.0, 113.0, 113.0, 0.020464963981663392, 0.015208825771529143, 0.011491556923297315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c87903bd-0692-43f8-bb2b-456b51932346", 3, 0, 0.0, 735.0, 205, 1756, 244.0, 1756.0, 1756.0, 1756.0, 0.0314821810855056, 0.026245399010410106, 0.020188768469546238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 650.6250000000001, 107, 1210, 967.0, 1204.4, 1210.0, 1210.0, 0.07728983203953374, 39.12847279669634, 0.04170178925961172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 220.23076923076923, 106, 1096, 113.0, 790.7999999999997, 1096.0, 1096.0, 0.10709725254355974, 7.439437597829221, 0.06225349610742678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 535.75, 109, 995, 659.0, 924.3000000000001, 995.0, 995.0, 0.07728833863885574, 12.7921163328374, 0.041776460387311184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 204.46153846153848, 105, 667, 114.0, 534.5999999999999, 667.0, 667.0, 0.10709637025686652, 2.4489445086336152, 0.0623575695508543], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 534.0, 157, 1000, 548.0, 891.5999999999999, 1000.0, 1000.0, 0.07729032027919643, 0.014642892709144633, 0.052864210196971406], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 251.83333333333334, 217, 451, 227.0, 447.4, 451.0, 451.0, 0.08539912228679872, 0.13235196002846636, 0.19206462756493892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53ec3d07-07de-4757-be75-fc852ab875e0", 3, 0, 0.0, 480.0, 206, 687, 547.0, 687.0, 687.0, 687.0, 0.03600705738324712, 0.029478434023068524, 0.023090463230793237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 654.6, 165, 1165, 570.5, 1125.5, 1163.2, 1165.0, 0.09695371429679471, 0.0595545764576991, 0.04383747042911714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 113.99999999999999, 107, 125, 114.0, 121.5, 125.0, 125.0, 0.07728908533198078, 0.057438470642223995, 0.038795497910779415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 223.93749999999997, 107, 350, 213.0, 347.9, 350.0, 350.0, 0.07728833863885574, 0.08597761596873686, 0.0404273109213253], "isController": false}, {"data": ["login", 20, 0, 0.0, 3319.9, 1871, 5066, 3206.5, 4984.200000000002, 5065.2, 5066.0, 0.10009909810712606, 24.089532230658353, 0.18422535184832986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 118.38461538461539, 112, 134, 117.0, 133.2, 134.0, 134.0, 0.10980935406759187, 0.08889839308792351, 0.0390337938287143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/866160b8-2578-4940-89ff-3bcebe3a920c", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.703383122246696, 1.3142724394273126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e3b70f0-7950-4ca8-9765-dd2fe16e71b4", 3, 0, 0.0, 359.6666666666667, 240, 498, 341.0, 498.0, 498.0, 498.0, 0.03602651551541935, 0.03003382364420213, 0.02310294126477087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 780.7500000000001, 225, 1336, 1077.0, 1322.7, 1336.0, 1336.0, 0.07724654683796088, 52.03509667435512, 0.1626119018824018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fe03be8-3270-46bd-97d1-9198fe94a96a", 3, 0, 0.0, 491.0, 251, 798, 424.0, 798.0, 798.0, 798.0, 0.024407110604889558, 0.02447861581173982, 0.015651695277224098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 873.5, 111, 1333, 1190.5, 1333.0, 1333.0, 1333.0, 0.030543211007773248, 24.362923500710128, 0.05266019436935905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 458.0, 214, 1386, 438.0, 1146.0000000000002, 1386.0, 1386.0, 0.11885141987829614, 19.117985971075527, 0.2632450622187183], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1397.0454545454545, 481, 2821, 1308.0, 2039.6999999999998, 2708.3499999999985, 2821.0, 0.0894225336655516, 0.02827797096206452, 0.040344932181137536], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 421.07692307692304, 222, 1434, 232.0, 1130.3999999999996, 1434.0, 1434.0, 0.10699676540547659, 9.999632198618919, 0.23853237732409321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 144.58823529411765, 113, 346, 118.0, 334.8, 346.0, 346.0, 0.0961685325247634, 0.07466209312225283, 0.03418490804591199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/286c75ac-1877-4302-a120-de50994fb7ce", 3, 0, 0.0, 363.3333333333333, 215, 510, 365.0, 510.0, 510.0, 510.0, 0.07392986520121245, 0.03345133874664235, 0.047409451317183764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3ea5f92-7c4f-41b1-947c-0bdece7a9e16", 3, 0, 0.0, 890.6666666666666, 292, 1254, 1126.0, 1254.0, 1254.0, 1254.0, 0.05379429063262085, 0.03458454557272988, 0.03449698976115335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 466.1111111111111, 221, 1578, 240.5, 1250.4000000000005, 1578.0, 1578.0, 0.10201999591920016, 20.473656391340203, 0.22509489985037065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 112.86666666666667, 106, 123, 113.0, 118.2, 123.0, 123.0, 0.06995322461047712, 0.05198672258649716, 0.035113239697055904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62adeb5a-d4ae-49e4-9567-17063a68c81a", 3, 0, 0.0, 1013.6666666666666, 238, 1961, 842.0, 1961.0, 1961.0, 1961.0, 0.026894010703816258, 0.02242043014728953, 0.017246484728684255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 110.26666666666667, 104, 113, 111.0, 113.0, 113.0, 113.0, 0.06995355084224075, 0.01871803997145895, 0.03989538446471543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 110.0, 105, 114, 111.0, 112.8, 114.0, 114.0, 0.0699542033148965, 0.018854843862218203, 0.04112542030817159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 125.8, 105, 329, 113.0, 200.60000000000008, 329.0, 329.0, 0.06995485579972391, 0.018855019727269336, 0.041194119186751484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 1.878483280254777, 3.9373507165605095], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1267.0175438596489, 879, 2091, 1233.0, 1668.6000000000001, 1894.1999999999994, 2091.0, 0.2580002715792333, 308.6580202156792, 0.5094497550129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1397.0454545454545, 481, 2821, 1308.0, 2039.6999999999998, 2708.3499999999985, 2821.0, 0.08643178175189364, 0.027332209392777446, 0.03899558903259264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 112.33333333333333, 110, 116, 111.0, 116.0, 116.0, 116.0, 0.017484962931878584, 0.0047127439152329, 0.010296320945237096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 113.66666666666667, 111, 116, 114.0, 116.0, 116.0, 116.0, 0.017484962931878584, 0.0047127439152329, 0.010279245786123934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50683fb7-62f3-465a-8356-3245c0f606b9", 3, 0, 0.0, 430.0, 244, 671, 375.0, 671.0, 671.0, 671.0, 0.025651330021461614, 0.025893481248877755, 0.016449583379648233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 212.94117647058826, 103, 938, 116.0, 457.1999999999996, 938.0, 938.0, 0.0899932769728379, 4.786129695200712, 0.05245127459595666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 152.88235294117646, 104, 829, 111.0, 268.1999999999995, 829.0, 829.0, 0.08999565903291723, 1.5794010689631441, 0.05254054933085581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 113.66666666666667, 112, 115, 114.0, 115.0, 115.0, 115.0, 0.01748506484044878, 0.00467862086551071, 0.009971951041818448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 125.23529411764706, 105, 330, 112.0, 161.99999999999986, 330.0, 330.0, 0.0899947061937533, 0.06688083145844362, 0.04517312400741133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 113.66666666666667, 112, 115, 114.0, 115.0, 115.0, 115.0, 0.01748537057328702, 0.012994499029561932, 0.00877683640104446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 138.05882352941177, 106, 339, 113.0, 333.4, 339.0, 339.0, 0.08999565903291723, 0.03203200272104522, 0.050881047575940454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 118.66666666666667, 118, 120, 118.0, 120.0, 120.0, 120.0, 0.017752529735487306, 0.013973182584768328, 0.006310469554411504], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 752.7692307692308, 111, 1756, 671.0, 1503.9999999999998, 1756.0, 1756.0, 0.07850905269769183, 0.014708652150544127, 0.05343239313710096], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1882.9500000000003, 1204, 3858, 1735.5, 3126.900000000002, 3826.2499999999995, 3858.0, 0.09791394343511486, 0.05067811525450282, 0.04503658921673741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 229.33333333333334, 227, 231, 230.0, 231.0, 231.0, 231.0, 0.01747345490974961, 0.02708044232594983, 0.03929820962612631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11172c0b-7d5b-4383-9ab6-3e5b7aa84ac1", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.2895257411858974, 1.104892828525641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8e3ddf1-6be0-4c4e-845e-647606a35a03", 3, 0, 0.0, 537.3333333333334, 231, 988, 393.0, 988.0, 988.0, 988.0, 0.021752371008439922, 0.02571056612358247, 0.01394927437715711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c87903bd-0692-43f8-bb2b-456b51932346", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 1147.0689655172407, 558, 3669, 933.0, 1931.9, 2133.4499999999994, 3669.0, 0.2745601120962664, 91.68795610854828, 0.996584049122591], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab6ae22e-d696-4deb-be49-da64941c8a36", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/403cabde-6bb9-4ce2-b685-5fe2c75cb6db", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 222.877192982456, 111, 461, 117.0, 444.4, 448.29999999999995, 461.0, 0.25943643124706994, 0.19280383220607447, 0.1254111654954098], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 714.0526315789474, 513, 1069, 661.0, 907.0, 1004.4, 1069.0, 0.25892966652584526, 76.13391923268237, 0.13022341627032258], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 172.2456140350877, 105, 456, 116.0, 340.40000000000003, 350.0999999999999, 456.0, 0.25982669103871414, 0.4597714493770997, 0.12636102747781217], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1041.1052631578953, 762, 1629, 993.0, 1271.0, 1444.8999999999994, 1629.0, 0.2585186428224793, 232.61552923896875, 0.12976424063550232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 117.83333333333334, 109, 140, 117.5, 124.70000000000002, 140.0, 140.0, 0.1023145832385976, 0.07643618767336638, 0.03636963701059524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, 5.202312138728324, 197.2080924855491, 106, 2998, 119.0, 356.19999999999993, 461.8999999999994, 1264.9199999999787, 0.7254611710536799, 1.5993095211012753, 0.3472919305024972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 143.46666666666667, 113, 405, 121.0, 277.80000000000007, 405.0, 405.0, 0.07075338201166016, 0.05479241399926417, 0.02515061626195732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53ec3d07-07de-4757-be75-fc852ab875e0", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 117.4, 110, 136, 116.0, 128.20000000000002, 136.0, 136.0, 0.12734095115201113, 0.10334016641339967, 0.04526572872981646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 240.9333333333333, 221, 452, 226.0, 318.80000000000007, 452.0, 452.0, 0.06991638000950863, 0.10835673347176776, 0.15724357730654137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 340.35294117647055, 218, 1052, 232.0, 744.7999999999997, 1052.0, 1052.0, 0.0899394760231938, 6.460535252306683, 0.20092235081950735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fe03be8-3270-46bd-97d1-9198fe94a96a", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c97bd2e7-2955-4673-a1f4-8088fe29bf93", 3, 0, 0.0, 348.6666666666667, 224, 592, 230.0, 592.0, 592.0, 592.0, 0.016430253573580154, 0.022650430951859358, 0.010536327975245084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 146.00000000000003, 110, 351, 117.5, 336.6, 351.0, 351.0, 0.09132234759314879, 0.07571550108064777, 0.03246224074600211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee527b72-d081-4ac9-b948-96844146d25c", 1, 0, 0.0, 2479.0, 2479, 2479, 2479.0, 2479.0, 2479.0, 2479.0, 0.40338846308995563, 0.1288164330375151, 0.24069370209762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 119.37499999999999, 108, 153, 117.0, 132.70000000000002, 153.0, 153.0, 0.07540092083374568, 0.058538800842605286, 0.026802671077620535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e3b70f0-7950-4ca8-9765-dd2fe16e71b4", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 124.33333333333334, 108, 336, 112.5, 136.20000000000033, 336.0, 336.0, 0.10208537740396886, 0.0758661837933792, 0.051242074204726554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 173.33333333333334, 105, 340, 112.0, 340.0, 340.0, 340.0, 0.10208479843923686, 0.05287008929584174, 0.05679131527755722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 289.6666666666667, 105, 1242, 112.0, 1115.1000000000001, 1242.0, 1242.0, 0.10208537740396886, 15.332363005322618, 0.05855287597193786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 269.44444444444446, 106, 905, 125.5, 678.2000000000004, 905.0, 905.0, 0.10208653535313433, 5.02573475720419, 0.05865323401636788], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.3852080123266564], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07704160246533127], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07704160246533127], "isController": false}, {"data": ["401/Unauthorized", 11, 61.111111111111114, 0.847457627118644], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 18, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
