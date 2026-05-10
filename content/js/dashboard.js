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

    var data = {"OkPercent": 99.14196567862714, "KoPercent": 0.858034321372855};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7677852348993288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008771929824561403, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/edf8ed61-d37a-4dae-947f-bdfb306aee24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b29963e-f427-47ac-8894-ac024143ae08"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11dac4ce-9482-4391-aa5b-d2902dda17d6"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d0a9212-fa7f-45e7-98db-d3055d035cea"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/603c0a80-4944-4ae0-9143-c5054f32366f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37f38aa3-c9b1-44aa-8117-5ce7ef5e55d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=709abb01-5ad8-4276-9133-ed757df25224"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a40d657a-8d81-4163-8553-7b3defd70d58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34ad03c3-5fd2-4392-a633-3e716602d100"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35852f3e-0ee6-4947-b5e6-6085d3bc7d86"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9482dab8-2beb-49e9-84f8-0ece8dbb2fda"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8b1d3ee-9771-40b2-89cc-cd3213c70dcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1706fa2c-c9c2-4266-8310-96b831e92fcd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2e0dcebb-841b-44ab-b0a6-c9047aac03cd"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5411dfd8-8768-46b6-a6b9-ef7680568366"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b29963e-f427-47ac-8894-ac024143ae08"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cfe383df-9aff-45b0-9eeb-3b8bd481cffa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11dac4ce-9482-4391-aa5b-d2902dda17d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edf8ed61-d37a-4dae-947f-bdfb306aee24"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95bc4bf6-47a2-4810-8e7a-b1bf80ed48ce"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98475cba-a143-43a4-b8f3-495b0ec86e77"], "isController": false}, {"data": [0.9385964912280702, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.45614035087719296, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37f38aa3-c9b1-44aa-8117-5ce7ef5e55d7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=603c0a80-4944-4ae0-9143-c5054f32366f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a40d657a-8d81-4163-8553-7b3defd70d58"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9482dab8-2beb-49e9-84f8-0ece8dbb2fda"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d0a9212-fa7f-45e7-98db-d3055d035cea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e0dcebb-841b-44ab-b0a6-c9047aac03cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35852f3e-0ee6-4947-b5e6-6085d3bc7d86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8b1d3ee-9771-40b2-89cc-cd3213c70dcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5411dfd8-8768-46b6-a6b9-ef7680568366"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/709abb01-5ad8-4276-9133-ed757df25224"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1282, 11, 0.858034321372855, 431.6154446177846, 2, 3036, 162.5, 1197.1000000000001, 1373.85, 1880.6100000000024, 5.040576245596377, 708.8790763006416, 3.6719004953093544], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 1, 1.7543859649122806, 2076.859649122807, 1492, 3051, 2057.0, 2491.6, 2604.9999999999995, 3051.0, 0.25413980364356226, 305.822407864568, 1.2469822639955235], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/edf8ed61-d37a-4dae-947f-bdfb306aee24", 3, 0, 0.0, 511.66666666666663, 296, 874, 365.0, 874.0, 874.0, 874.0, 0.05170541700418814, 0.03324160110132538, 0.03315744514917013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b29963e-f427-47ac-8894-ac024143ae08", 3, 0, 0.0, 355.0, 214, 460, 391.0, 460.0, 460.0, 460.0, 0.04849660523763336, 0.03117864431781442, 0.03109971104106046], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 612.1538461538462, 435, 1223, 525.0, 1107.8, 1223.0, 1223.0, 0.07310722580572598, 0.013207848412167293, 0.04969006753982938], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 612.1538461538462, 435, 1223, 525.0, 1107.8, 1223.0, 1223.0, 0.07201418125415467, 0.013010374542986926, 0.04894713882118325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 172.12500000000003, 122, 381, 126.0, 378.9, 381.0, 381.0, 0.10772959870724481, 0.05916448542283867, 0.05974311119714516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 126.875, 119, 137, 127.0, 131.4, 137.0, 137.0, 0.10772959870724481, 0.0800607662267708, 0.054075208726097494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 380.62499999999994, 120, 1135, 250.5, 1040.5, 1135.0, 1135.0, 0.10773250020199844, 5.963017557872552, 0.06170421032077352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11dac4ce-9482-4391-aa5b-d2902dda17d6", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 382.875, 118, 1494, 126.5, 1400.2, 1494.0, 1494.0, 0.10773250020199844, 18.19944773416669, 0.06159900280104501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d0a9212-fa7f-45e7-98db-d3055d035cea", 3, 0, 0.0, 290.3333333333333, 220, 424, 227.0, 424.0, 424.0, 424.0, 0.05889281507656066, 0.03786240552610915, 0.03776655133490381], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 334.8571428571429, 214, 1531, 243.5, 913.5, 1531.0, 1531.0, 0.07605595545294037, 0.16467472497623253, 0.049168986826022006], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/603c0a80-4944-4ae0-9143-c5054f32366f", 3, 0, 0.0, 487.6666666666667, 231, 717, 515.0, 717.0, 717.0, 717.0, 0.020907234600079445, 0.024711643500289215, 0.013407308646535322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 146.21428571428572, 120, 382, 127.5, 262.5, 382.0, 382.0, 0.08497775403796079, 0.06315241291297671, 0.04265484919483578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37f38aa3-c9b1-44aa-8117-5ce7ef5e55d7", 3, 0, 0.0, 526.3333333333334, 251, 880, 448.0, 880.0, 880.0, 880.0, 0.01791258657750179, 0.02117207091891569, 0.011486912616431814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 179.3571428571429, 120, 381, 126.0, 377.5, 381.0, 381.0, 0.084978269842426, 0.0227383261101804, 0.04846416951950858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 914.0, 873, 955, 914.0, 955.0, 955.0, 955.0, 0.03422372046065127, 10.062910149899896, 0.019518215575215183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1223.0, 1093, 1353, 1223.0, 1353.0, 1353.0, 1353.0, 0.034143093705720676, 30.72201573356437, 0.01943889026409683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 0.03471679772257807, 0.061432458470030725, 0.019223070613966567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 214.5, 121, 390, 127.5, 385.5, 390.0, 390.0, 0.07763845987478026, 0.057698113246784935, 0.03897086755433306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 213.85714285714283, 120, 385, 128.0, 380.5, 385.0, 385.0, 0.07752624817259558, 0.0207443281243078, 0.044214188410933414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 248.07142857142853, 122, 382, 242.0, 380.5, 382.0, 382.0, 0.07763673770428167, 0.020925526959357166, 0.04564191025193121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 177.57142857142858, 119, 377, 126.0, 375.5, 377.0, 377.0, 0.07763759877998058, 0.020925759046166646, 0.0457182344378206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 125.5, 125, 126, 125.5, 126.0, 126.0, 126.0, 0.03471559250837514, 0.025799380760618634, 0.019493618840152056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1006.5000000000002, 127, 1603, 1161.0, 1600.5, 1603.0, 1603.0, 0.08552908905410937, 54.97746127135936, 0.04503163812642421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 197.07142857142856, 121, 382, 127.0, 379.5, 382.0, 382.0, 0.08498033312290583, 0.022904855412033215, 0.04995914115233332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 703.4285714285714, 123, 1135, 885.5, 1105.0, 1135.0, 1135.0, 0.08553117916949225, 17.97016279179878, 0.04511626512832732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 176.0, 118, 377, 124.0, 376.5, 377.0, 377.0, 0.08498291236440673, 0.022905550598219, 0.05004364858958717], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 546.8461538461538, 424, 795, 491.0, 783.4, 795.0, 795.0, 0.07190464338062447, 0.01299058498575735, 0.049574881080782104], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 502.7857142857144, 253, 773, 499.5, 764.0, 773.0, 773.0, 0.0774726217288569, 0.12006743230829676, 0.17423774203277093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=709abb01-5ad8-4276-9133-ed757df25224", 1, 0, 0.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 0.2358538674934726, 0.9000693537859008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 556.4, 169, 1908, 497.0, 1120.7000000000005, 1869.9499999999994, 1908.0, 0.08542591224196036, 0.05247353398456354, 0.038625192742214494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 125.35714285714286, 120, 129, 126.5, 128.5, 129.0, 129.0, 0.08552804403472439, 0.06356136866252467, 0.042931068978367515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 284.6428571428571, 118, 392, 362.5, 387.0, 392.0, 392.0, 0.08553379195737973, 0.11464964747858601, 0.04364991782646416], "isController": false}, {"data": ["login", 20, 0, 0.0, 2648.7500000000005, 1706, 4538, 2564.0, 3781.7000000000003, 4500.349999999999, 4538.0, 0.08530239699735562, 10.326196699330376, 0.14284819372174357], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a40d657a-8d81-4163-8553-7b3defd70d58", 2, 0, 0.0, 300.5, 231, 370, 300.5, 370.0, 370.0, 370.0, 0.01949963925667375, 0.02776413480100618, 0.01212062537780551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34ad03c3-5fd2-4392-a633-3e716602d100", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 146.35714285714286, 127, 372, 129.5, 251.5, 372.0, 372.0, 0.08259635750063422, 0.06686755895315016, 0.029360423955303572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35852f3e-0ee6-4947-b5e6-6085d3bc7d86", 3, 0, 0.0, 286.3333333333333, 211, 424, 224.0, 424.0, 424.0, 424.0, 0.04101666643879629, 0.025515250509290273, 0.026303005496233302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1133.285714285714, 248, 1730, 1286.0, 1725.5, 1730.0, 1730.0, 0.08546121586892691, 73.0673604158909, 0.17658566800148945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9482dab8-2beb-49e9-84f8-0ece8dbb2fda", 3, 0, 0.0, 318.0, 251, 420, 283.0, 420.0, 420.0, 420.0, 0.04254112308564946, 0.027349843129608625, 0.02728060302041974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8b1d3ee-9771-40b2-89cc-cd3213c70dcc", 3, 0, 0.0, 563.3333333333333, 218, 1221, 251.0, 1221.0, 1221.0, 1221.0, 0.028194958741377042, 0.02827756115956467, 0.01808075153662525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1706fa2c-c9c2-4266-8310-96b831e92fcd", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e0dcebb-841b-44ab-b0a6-c9047aac03cd", 3, 0, 0.0, 1016.0, 444, 1531, 1073.0, 1531.0, 1531.0, 1531.0, 0.015882932201056747, 0.021895904255037537, 0.010185343891953707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 583.3750000000001, 246, 1622, 496.5, 1527.5, 1622.0, 1622.0, 0.10763828155483497, 24.28044097848244, 0.2369172185931677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1349.0, 1218, 1480, 1349.0, 1480.0, 1480.0, 1480.0, 0.03406922867266285, 40.758641872785496, 0.07682211816911964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5411dfd8-8768-46b6-a6b9-ef7680568366", 3, 0, 0.0, 1271.0, 231, 2894, 688.0, 2894.0, 2894.0, 2894.0, 0.028992230082337932, 0.024169629310178204, 0.01859202254629093], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1263.4545454545453, 164, 3036, 1211.0, 2314.899999999999, 2976.2999999999993, 3036.0, 0.0908017797148824, 0.02900433268946617, 0.040967209207300466], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 144.66666666666666, 122, 380, 129.0, 195.50000000000028, 380.0, 380.0, 0.08896445375825392, 0.0690690827517694, 0.03162408317187933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 417.1428571428571, 247, 756, 500.5, 638.0, 756.0, 756.0, 0.08491229772677648, 0.13159747704335378, 0.1909697477194983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b29963e-f427-47ac-8894-ac024143ae08", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 494.3999999999999, 248, 1446, 374.5, 1306.7000000000012, 1442.05, 1446.0, 0.08622213408404072, 10.435429523644265, 0.19170952625248427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 168.33333333333331, 123, 386, 125.5, 386.0, 386.0, 386.0, 0.030313594131288178, 0.02252797376358428, 0.01521600330418176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 163.0, 121, 366, 123.0, 366.0, 366.0, 366.0, 0.030313747284393473, 0.008111295660081846, 0.017288308998130653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 207.83333333333334, 122, 375, 126.5, 375.0, 375.0, 375.0, 0.030314053595246755, 0.008170584758093853, 0.017821347914393115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfe383df-9aff-45b0-9eeb-3b8bd481cffa", 2, 0, 0.0, 329.5, 248, 411, 329.5, 411.0, 411.0, 411.0, 0.01666139055965611, 0.02818118012629334, 0.010356420987520619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 204.16666666666666, 121, 375, 126.5, 375.0, 375.0, 375.0, 0.030313594131288178, 0.008170460918198766, 0.017850680919108172], "isController": false}, {"data": ["https://demoqa.com/books", 57, 1, 1.7543859649122806, 1378.421052631579, 856, 2488, 1319.0, 1891.0000000000002, 2089.6, 2488.0, 0.2384777588111256, 281.54557219757254, 0.4688003365883456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1263.4545454545453, 164, 3036, 1211.0, 2314.899999999999, 2976.2999999999993, 3036.0, 0.0940536704444891, 0.03004306696193819, 0.04243437084507223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 163.41666666666669, 118, 377, 124.0, 371.90000000000003, 377.0, 377.0, 0.0741399762752076, 0.019983040480427046, 0.043658599310498224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 238.75, 119, 1241, 126.0, 981.5000000000009, 1241.0, 1241.0, 0.07402289774970391, 5.568783319942385, 0.04298725572443743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 288.44444444444446, 119, 1639, 126.5, 504.1000000000018, 1639.0, 1639.0, 0.0901293355965811, 4.528417224028982, 0.052555886447051524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 226.11111111111111, 121, 719, 127.5, 410.30000000000047, 719.0, 719.0, 0.09012753045559467, 1.4951918683687417, 0.05264284900634397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 206.41666666666666, 121, 376, 126.5, 375.7, 376.0, 376.0, 0.07402335436830319, 0.01980703036808113, 0.04221644428817292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 140.8888888888889, 121, 377, 127.0, 169.10000000000034, 377.0, 377.0, 0.09012707918164611, 0.06697920630589131, 0.045239569042349714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 165.83333333333334, 119, 375, 127.0, 371.7, 375.0, 375.0, 0.07413768603925591, 0.05509646394128295, 0.037213643187673374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 205.33333333333334, 120, 373, 126.0, 373.0, 373.0, 373.0, 0.09012798173406238, 0.031636721018846764, 0.050980595570710406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 151.0, 127, 366, 130.0, 299.10000000000025, 366.0, 366.0, 0.07681228996639462, 0.06045967354776764, 0.02730436869899184], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 593.5833333333333, 420, 1221, 454.0, 1116.9000000000003, 1221.0, 1221.0, 0.07785635502497892, 0.01406584539025498, 0.052994022902744436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/11dac4ce-9482-4391-aa5b-d2902dda17d6", 3, 0, 0.0, 429.3333333333333, 263, 577, 448.0, 577.0, 577.0, 577.0, 0.04792179163604996, 0.03037230739433245, 0.0307310968499409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edf8ed61-d37a-4dae-947f-bdfb306aee24", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1478.8500000000001, 900, 2429, 1386.5, 2118.5, 2413.6499999999996, 2429.0, 0.08471202148296865, 0.043845089244114635, 0.0389642208188264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95bc4bf6-47a2-4810-8e7a-b1bf80ed48ce", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 448.5, 248, 1372, 255.0, 1186.6000000000006, 1372.0, 1372.0, 0.07396540884379739, 5.659154346161196, 0.16582023786042727], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 1312.1578947368419, 645, 2462, 1025.0, 2147.8, 2371.7, 2462.0, 0.27927623359252124, 94.84089407897639, 1.0142663226546922], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/98475cba-a143-43a4-b8f3-495b0ec86e77", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 220.40350877192984, 122, 781, 128.0, 507.8, 512.5, 781.0, 0.2393590217354789, 0.1778830229889643, 0.11570577710845903], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 779.3684210526317, 585, 1146, 746.0, 1010.2, 1132.3, 1146.0, 0.23955216353427697, 70.43628995950728, 0.12047789474624282], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 177.73684210526315, 121, 510, 128.0, 377.0, 378.5, 510.0, 0.24005255887604865, 0.424780504573633, 0.11674431085964085], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 1, 1.7543859649122806, 1143.8421052631577, 2, 1675, 1171.0, 1482.0, 1627.2, 1675.0, 0.23929169657812874, 211.54553164081688, 0.11800596550001469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 145.1, 125, 385, 130.0, 176.3000000000001, 374.79999999999984, 385.0, 0.09160445197636606, 0.06843496656437502, 0.03256252003847387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 6, 3.508771929824561, 200.21052631578954, 121, 1565, 132.0, 337.00000000000006, 404.00000000000017, 1193.4800000000005, 0.6942104472582747, 1.5099743274075097, 0.3325235691551337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 128.33333333333334, 121, 134, 129.0, 134.0, 134.0, 134.0, 0.03192015704717267, 0.024719418494538993, 0.011346618325362162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37f38aa3-c9b1-44aa-8117-5ce7ef5e55d7", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=603c0a80-4944-4ae0-9143-c5054f32366f", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 129.3125, 123, 135, 129.0, 135.0, 135.0, 135.0, 0.10443932401647531, 0.08475495923602634, 0.03712491595898145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a40d657a-8d81-4163-8553-7b3defd70d58", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 415.83333333333337, 252, 760, 366.0, 760.0, 760.0, 760.0, 0.0302944621723149, 0.04695049947994506, 0.06813295545199337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9482dab8-2beb-49e9-84f8-0ece8dbb2fda", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 473.6111111111111, 248, 1786, 487.0, 850.0000000000015, 1786.0, 1786.0, 0.09006980409817608, 6.1182132949911185, 0.2012888113287798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 131.8571428571429, 128, 150, 129.0, 147.5, 150.0, 150.0, 0.07785823128343733, 0.06455238121058428, 0.027676168151534366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d0a9212-fa7f-45e7-98db-d3055d035cea", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e0dcebb-841b-44ab-b0a6-c9047aac03cd", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 139.07142857142856, 126, 253, 130.0, 196.5, 253.0, 253.0, 0.08532527212667146, 0.06624374154365606, 0.030330467826277744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35852f3e-0ee6-4947-b5e6-6085d3bc7d86", 1, 0, 0.0, 795.0, 795, 795, 795.0, 795.0, 795.0, 795.0, 1.2578616352201257, 0.22725039308176098, 0.8672366352201257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8b1d3ee-9771-40b2-89cc-cd3213c70dcc", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5411dfd8-8768-46b6-a6b9-ef7680568366", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 151.6, 119, 389, 127.0, 347.00000000000045, 388.05, 389.0, 0.08636063336888512, 0.06418011913449373, 0.04334898979649117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/709abb01-5ad8-4276-9133-ed757df25224", 3, 0, 0.0, 323.0, 239, 426, 304.0, 426.0, 426.0, 426.0, 0.03348102184078658, 0.027911750304119284, 0.021470577157014833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 186.10000000000002, 118, 379, 127.0, 374.8, 378.85, 379.0, 0.08627978809684043, 0.03604540365998861, 0.04848182624113475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 279.1, 122, 1321, 127.5, 1154.800000000002, 1317.0, 1321.0, 0.08636771920127133, 7.792333474940406, 0.050032549834173976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 270.84999999999997, 118, 1198, 127.5, 684.0000000000007, 1173.9499999999996, 1198.0, 0.08627494963699815, 2.5576983946388747, 0.05006306159600029], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 27.272727272727273, 0.23400936037441497], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 9.090909090909092, 0.078003120124805], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.46801872074882994], "isController": false}, {"data": ["Assertion failed", 1, 9.090909090909092, 0.078003120124805], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1282, 11, "401/Unauthorized", 6, "406/Not Acceptable", 3, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Assertion failed", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 57, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
