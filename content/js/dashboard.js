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

    var data = {"OkPercent": 98.95749799518845, "KoPercent": 1.0425020048115476};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7261410788381742, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6061e9c2-e1b6-4b57-8484-e2dcdd13502b"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50ffc8c7-84a0-4a18-a697-38062827e89c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7f41ae4-02a4-4dc9-af92-5cced7e5ae99"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7dea61cb-90cf-49c8-95ee-635b6cda6ec1"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/61dddf46-70d7-49ec-a308-d43bd0d80eef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/54f86a8b-2ec7-446b-8739-0c291b0e6c93"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3b6c78d-9cd7-48d7-a03d-832bbbf94fea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/76bd0597-f157-4512-9117-467f0911c615"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da720564-d9bb-4463-b33c-cce45fdff4a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4fdbbfd-c2c1-4dd4-9e74-3657e125dc72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da720564-d9bb-4463-b33c-cce45fdff4a4"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69cea00a-34c1-477c-b2c7-eafc4611d9b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/def552a6-92e1-4a7f-8ad4-ad590974dc60"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.175, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14199970-e390-4bdd-bcbd-c181fdf71981"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d58c86b-7122-463f-b381-2ff01be02521"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/3b0858e6-826e-4077-b235-724e2b4ce9e2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.27358490566037735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/754a9b87-afb0-451e-8998-03d0badd3891"], "isController": false}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50ffc8c7-84a0-4a18-a697-38062827e89c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e83ae66c-a3af-4489-9bd9-bab934b37847"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.45, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dea61cb-90cf-49c8-95ee-635b6cda6ec1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7f41ae4-02a4-4dc9-af92-5cced7e5ae99"], "isController": false}, {"data": [0.23728813559322035, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54f86a8b-2ec7-446b-8739-0c291b0e6c93"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3b6c78d-9cd7-48d7-a03d-832bbbf94fea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3867924528301887, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9005847953216374, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=def552a6-92e1-4a7f-8ad4-ad590974dc60"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69cea00a-34c1-477c-b2c7-eafc4611d9b8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=754a9b87-afb0-451e-8998-03d0badd3891"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e83ae66c-a3af-4489-9bd9-bab934b37847"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14199970-e390-4bdd-bcbd-c181fdf71981"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1247, 13, 1.0425020048115476, 493.4731355252609, 129, 5284, 173.0, 1334.8000000000002, 1674.599999999999, 2307.52, 4.884717532492968, 687.3835787974076, 3.56216211303205], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/6061e9c2-e1b6-4b57-8484-e2dcdd13502b", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.6808868603411514, 1.2722381396588487], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2283.603773584906, 1628, 2986, 2291.0, 2741.6, 2861.1, 2986.0, 0.23853029334725512, 287.033700350257, 1.1728515888705366], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/50ffc8c7-84a0-4a18-a697-38062827e89c", 3, 0, 0.0, 543.0, 297, 1018, 314.0, 1018.0, 1018.0, 1018.0, 0.027111046847888953, 0.027190473742951127, 0.017385664808053786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7f41ae4-02a4-4dc9-af92-5cced7e5ae99", 3, 0, 0.0, 366.3333333333333, 247, 563, 289.0, 563.0, 563.0, 563.0, 0.02093071931905393, 0.024739401643061463, 0.013422368834158933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dea61cb-90cf-49c8-95ee-635b6cda6ec1", 3, 0, 0.0, 937.3333333333334, 284, 2196, 332.0, 2196.0, 2196.0, 2196.0, 0.02186397691164038, 0.02584248052284057, 0.014020844568988135], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 686.5, 148, 1207, 597.0, 1165.0000000000002, 1207.0, 1207.0, 0.06457306442239394, 0.012280863570567596, 0.043632011222260486], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 686.5, 148, 1207, 597.0, 1165.0000000000002, 1207.0, 1207.0, 0.06488345309737384, 0.012339895010462457, 0.04384174080952922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 217.15384615384613, 130, 412, 137.0, 411.2, 412.0, 412.0, 0.09230987715685579, 0.03536511219200454, 0.05204912394376198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61dddf46-70d7-49ec-a308-d43bd0d80eef", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.5269569925742574, 0.984619946369637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 137.0, 131, 147, 138.0, 144.2, 147.0, 147.0, 0.09230987715685579, 0.0686013833167649, 0.04633523130724987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 244.76923076923077, 130, 773, 137.0, 627.3999999999999, 773.0, 773.0, 0.09231053263177329, 2.110840651605848, 0.05374841785072677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 301.53846153846155, 132, 1727, 139.0, 1200.5999999999995, 1727.0, 1727.0, 0.09230725535027054, 6.412060530926481, 0.05365636582785407], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 275.46153846153845, 134, 342, 286.0, 338.4, 342.0, 342.0, 0.06749179715080783, 0.15510641152604143, 0.04362732230188562], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/54f86a8b-2ec7-446b-8739-0c291b0e6c93", 3, 0, 0.0, 552.6666666666666, 312, 803, 543.0, 803.0, 803.0, 803.0, 0.021942014569497674, 0.025934718392528016, 0.0140708882493198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3b6c78d-9cd7-48d7-a03d-832bbbf94fea", 3, 0, 0.0, 721.0, 268, 1561, 334.0, 1561.0, 1561.0, 1561.0, 0.01628443479440901, 0.022449407992943413, 0.01044281788573755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76bd0597-f157-4512-9117-467f0911c615", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.555366847826087, 1.0377038043478262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 137.95238095238096, 130, 157, 136.0, 154.4, 156.9, 157.0, 0.14184205549401563, 0.1054119181942831, 0.07119806301164457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 156.85714285714286, 130, 530, 136.0, 161.0, 493.2999999999995, 530.0, 0.14146748942362103, 0.03785360556842985, 0.08068067756190887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1041.0, 1027, 1065, 1031.0, 1065.0, 1065.0, 1065.0, 0.02180454406698356, 6.41125993469539, 0.01243540403820156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1291.3333333333333, 1183, 1420, 1271.0, 1420.0, 1420.0, 1420.0, 0.021742439066814515, 19.563884891450872, 0.012378751929641467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 311.3333333333333, 138, 403, 393.0, 403.0, 403.0, 403.0, 0.021903885749331935, 0.038759610329872525, 0.012128421113155475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da720564-d9bb-4463-b33c-cce45fdff4a4", 2, 0, 0.0, 294.0, 246, 342, 294.0, 342.0, 342.0, 342.0, 0.011189186769905563, 0.02212705391509645, 0.006954997440473527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 150.94444444444446, 131, 395, 135.5, 179.00000000000034, 395.0, 395.0, 0.0959882254443455, 0.07133499957338567, 0.048181589724993736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 231.88888888888886, 131, 541, 139.0, 432.1000000000002, 541.0, 541.0, 0.0957813630752203, 0.0496055171395428, 0.0532846189764165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 373.0, 131, 1548, 138.5, 1226.7000000000005, 1548.0, 1548.0, 0.09585940620423379, 14.397274622220742, 0.05498185993875649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 332.16666666666663, 131, 1065, 141.0, 1043.4, 1065.0, 1065.0, 0.09598720170643914, 4.7254636881749095, 0.05514889681375816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 138.33333333333334, 134, 142, 139.0, 142.0, 142.0, 142.0, 0.021946990701791607, 0.016310214769593174, 0.01232374966165056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 176.9047619047619, 131, 410, 138.0, 401.0, 409.4, 410.0, 0.14158289678606825, 0.03816101514936995, 0.08323525768087214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 1254.0833333333333, 133, 1913, 1400.0, 1842.8000000000002, 1913.0, 1913.0, 0.057428083289863464, 43.06415502053054, 0.029648743521394356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4fdbbfd-c2c1-4dd4-9e74-3657e125dc72", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 162.52380952380952, 129, 401, 137.0, 348.40000000000015, 400.09999999999997, 401.0, 0.1418516366976939, 0.03823344895367531, 0.0835317743444428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 909.5, 133, 1231, 1038.5, 1231.0, 1231.0, 1231.0, 0.057428083289863464, 14.074049176385573, 0.02970482563398211], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 716.4166666666667, 141, 2561, 597.0, 2067.2000000000016, 2561.0, 2561.0, 0.06487222873947854, 0.012337760299817816, 0.044340970799388035], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 578.6666666666667, 267, 1680, 413.5, 1361.4000000000005, 1680.0, 1680.0, 0.09571158907824423, 19.20766776945471, 0.2111761558503709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da720564-d9bb-4463-b33c-cce45fdff4a4", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.30569215313028764, 1.1665873519458545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 861.3499999999999, 171, 2307, 690.0, 1817.2000000000007, 2284.1499999999996, 2307.0, 0.09228667934070396, 0.05668781377470976, 0.04172727786596282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 140.24999999999997, 131, 175, 136.0, 167.8, 175.0, 175.0, 0.05742753363099939, 0.04267807919256888, 0.028825929967122736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 313.58333333333337, 133, 413, 396.0, 412.4, 413.0, 413.0, 0.05742753363099939, 0.08724423810412568, 0.02873246067410353], "isController": false}, {"data": ["login", 20, 0, 0.0, 3561.9, 1922, 6552, 3280.5, 6328.000000000001, 6543.7, 6552.0, 0.09108131740017487, 16.472549905446208, 0.16007719426278783], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 161.47619047619048, 133, 416, 143.0, 225.60000000000005, 398.4999999999998, 416.0, 0.1325171956837256, 0.1072819875212974, 0.047105721903199345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69cea00a-34c1-477c-b2c7-eafc4611d9b8", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/def552a6-92e1-4a7f-8ad4-ad590974dc60", 3, 0, 0.0, 400.0, 286, 500, 414.0, 500.0, 500.0, 500.0, 0.04430136743554151, 0.028481510639711743, 0.028409405549484627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1400.25, 271, 2050, 1545.5, 1978.6000000000004, 2050.0, 2050.0, 0.05738935810002965, 57.22951042991802, 0.11683367368410984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 1106.5, 134, 1560, 1366.0, 1560.0, 1560.0, 1560.0, 0.025670810363306144, 23.0351275959607, 0.04755617896405445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 519.9230769230769, 269, 1861, 529.0, 1336.5999999999995, 1861.0, 1861.0, 0.09222016500315676, 8.618650552966296, 0.20559028221143955], "isController": false}, {"data": ["register", 20, 3, 15.0, 1762.1, 827, 3775, 1672.5, 3404.0000000000023, 3761.95, 3775.0, 0.09061295130913061, 0.02890057607183795, 0.040882015141424165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14199970-e390-4bdd-bcbd-c181fdf71981", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.23402080634715025, 0.8930739961139896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d58c86b-7122-463f-b381-2ff01be02521", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.8272951748704663, 1.545802299222798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 348.38095238095235, 269, 688, 281.0, 540.2, 673.2999999999997, 688.0, 0.1413351460126663, 0.2190418717989272, 0.31786605592497125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 146.61111111111111, 133, 179, 142.5, 178.1, 179.0, 179.0, 0.0972079710536264, 0.07546907908948534, 0.03455439596046876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 635.3846153846154, 284, 1726, 545.0, 1360.7999999999997, 1726.0, 1726.0, 0.08200082000820008, 7.663577837701454, 0.18280786774213897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 145.33333333333337, 134, 199, 139.0, 199.0, 199.0, 199.0, 0.043465662126919734, 0.03230211804549406, 0.021817724934801507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 183.88888888888889, 130, 570, 134.0, 570.0, 570.0, 570.0, 0.04337579341555456, 0.01884512552472661, 0.024332991748960184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 359.66666666666663, 131, 1605, 142.0, 1605.0, 1605.0, 1605.0, 0.04316049951084767, 4.325439794999617, 0.024961530207554046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b0858e6-826e-4077-b235-724e2b4ce9e2", 2, 0, 0.0, 448.5, 297, 600, 448.5, 600.0, 600.0, 600.0, 0.01795912503142847, 0.02557070732013936, 0.011163069416508027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 243.88888888888889, 131, 813, 141.0, 813.0, 813.0, 813.0, 0.04332505343423257, 1.4258248759218608, 0.025099008277492153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 2.0916445035460995, 4.3841422872340425], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1579.7169811320753, 1039, 2424, 1474.0, 2126.8, 2267.9999999999995, 2424.0, 0.23482915071600738, 280.9373040782734, 0.4636958425271161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/754a9b87-afb0-451e-8998-03d0badd3891", 3, 0, 0.0, 447.6666666666667, 289, 531, 523.0, 531.0, 531.0, 531.0, 0.051184057872108106, 0.03184008287552037, 0.032823110028663074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, 15.0, 1762.1, 827, 3775, 1672.5, 3404.0000000000023, 3761.95, 3775.0, 0.09167247258993069, 0.02923850541784313, 0.041360041344285135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 282.5, 131, 525, 261.5, 525.0, 525.0, 525.0, 0.07551658060923001, 0.020354078367331527, 0.04446923643297432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50ffc8c7-84a0-4a18-a697-38062827e89c", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 203.0, 132, 410, 136.0, 410.0, 410.0, 410.0, 0.07571240642419769, 0.02040685954402203, 0.0445106139329756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 273.0, 131, 1461, 138.5, 537.6000000000015, 1461.0, 1461.0, 0.09406747773736361, 4.726283441314958, 0.05485228139763368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 218.94444444444449, 130, 775, 135.5, 480.70000000000044, 775.0, 775.0, 0.09406207051519885, 1.5604648462607713, 0.05494098584888406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 163.05555555555557, 132, 391, 136.5, 285.70000000000016, 391.0, 391.0, 0.09419842374637598, 0.07000488327245323, 0.047283193169567625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 168.25, 130, 407, 135.0, 407.0, 407.0, 407.0, 0.07571312297704, 0.02025917548409078, 0.04318014044784312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 181.0, 129, 413, 138.0, 407.6, 413.0, 413.0, 0.09419793078545376, 0.03306535439354849, 0.05328274882645078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e83ae66c-a3af-4489-9bd9-bab934b37847", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 137.12499999999997, 132, 143, 136.5, 143.0, 143.0, 143.0, 0.07571097335920125, 0.05626567453745327, 0.038003359674442815], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 909.6000000000001, 500, 2196, 683.5, 2132.5, 2196.0, 2196.0, 0.06648803547801573, 0.012011998597102452, 0.045256016336110316], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 146.375, 136, 166, 143.5, 166.0, 166.0, 166.0, 0.07617596648257476, 0.05995881736812036, 0.027078175585602743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2093.0999999999995, 777, 5284, 1876.5, 3926.900000000001, 5218.8499999999985, 5284.0, 0.09269558769002595, 0.047977208472376714, 0.0426363494160178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 457.875, 265, 662, 544.0, 662.0, 662.0, 662.0, 0.07541833608296017, 0.11688369078482205, 0.16961760546782936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dea61cb-90cf-49c8-95ee-635b6cda6ec1", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7f41ae4-02a4-4dc9-af92-5cced7e5ae99", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 1509.4237288135596, 732, 2609, 1327.0, 2465.0, 2561.0, 2609.0, 0.27509675012822304, 95.87305243011843, 0.9983458496526321], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 261.07547169811323, 131, 559, 142.0, 538.2, 544.6, 559.0, 0.23580708311087384, 0.17524334985095213, 0.11398877552722905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54f86a8b-2ec7-446b-8739-0c291b0e6c93", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3b6c78d-9cd7-48d7-a03d-832bbbf94fea", 1, 0, 0.0, 2561.0, 2561, 2561, 2561.0, 2561.0, 2561.0, 2561.0, 0.39047247169074584, 0.07054434303006638, 0.2692124658336587], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 859.6603773584907, 650, 1372, 798.0, 1117.0, 1230.9, 1372.0, 0.2357189873868104, 69.30920889872534, 0.11855007666426501], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 208.6603773584906, 131, 421, 138.0, 402.0, 410.2, 421.0, 0.23628646836436265, 0.41811628972287607, 0.1149127551225123], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1316.7169811320757, 907, 1901, 1318.0, 1638.4, 1707.7999999999997, 1901.0, 0.2354456809044668, 211.8544375472002, 0.11818269529774994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 143.76923076923075, 135, 167, 142.0, 159.79999999999998, 167.0, 167.0, 0.0831627430910952, 0.0621284164694217, 0.029561756333162745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, 4.093567251461988, 251.60233918128637, 133, 1345, 147.0, 566.6000000000006, 674.8000000000002, 1321.24, 0.7024808666395533, 1.473763970023375, 0.3397707193342453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 157.22222222222223, 140, 220, 145.0, 220.0, 220.0, 220.0, 0.044147294997130423, 0.0341882860671137, 0.015692983768511207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 166.69230769230768, 132, 404, 145.0, 311.9999999999999, 404.0, 404.0, 0.09078719481535281, 0.0736759364175373, 0.03227201065701994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=def552a6-92e1-4a7f-8ad4-ad590974dc60", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 508.66666666666663, 278, 1745, 286.0, 1745.0, 1745.0, 1745.0, 0.043131128214467136, 5.792731416474174, 0.09577675118370986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 468.8333333333333, 267, 1852, 296.0, 803.5000000000016, 1852.0, 1852.0, 0.09399526890479847, 6.384860160823294, 0.21006147551684343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69cea00a-34c1-477c-b2c7-eafc4611d9b8", 3, 0, 0.0, 667.3333333333334, 233, 1205, 564.0, 1205.0, 1205.0, 1205.0, 0.0335379146124694, 0.027959179466970747, 0.021507061128439035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=754a9b87-afb0-451e-8998-03d0badd3891", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.2696478544776119, 1.029034514925373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e83ae66c-a3af-4489-9bd9-bab934b37847", 3, 0, 0.0, 417.3333333333333, 259, 561, 432.0, 561.0, 561.0, 561.0, 0.08333333333333333, 0.03770616319444445, 0.05343967013888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 151.72222222222226, 134, 247, 140.0, 196.60000000000008, 247.0, 247.0, 0.09513440377155058, 0.07887608281449848, 0.03381730759066837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 143.41666666666666, 132, 168, 140.0, 166.20000000000002, 168.0, 168.0, 0.055978504254366325, 0.04345987390841917, 0.01989860893416928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14199970-e390-4bdd-bcbd-c181fdf71981", 3, 0, 0.0, 492.33333333333337, 333, 807, 337.0, 807.0, 807.0, 807.0, 0.028305358204308073, 0.02838828405842226, 0.018151548067215792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 157.38461538461536, 131, 400, 136.0, 298.3999999999999, 400.0, 400.0, 0.08221395866535124, 0.06109845951594951, 0.041267553470693885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 199.15384615384613, 131, 410, 139.0, 406.8, 410.0, 410.0, 0.08221811834349466, 0.0314988283918136, 0.046358863903716255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 373.1538461538462, 131, 1595, 389.0, 1122.1999999999996, 1595.0, 1595.0, 0.08207433409304704, 5.701237635580487, 0.04770817286748783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 416.76923076923083, 138, 1095, 401.0, 828.9999999999998, 1095.0, 1095.0, 0.08221551849532953, 1.8800006205690578, 0.0478705291359149], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 23.076923076923077, 0.24057738572574178], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.08019246190858059], "isController": false}, {"data": ["401/Unauthorized", 9, 69.23076923076923, 0.7217321571772254], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1247, 13, "401/Unauthorized", 9, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
