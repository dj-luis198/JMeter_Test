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

    var data = {"OkPercent": 98.6046511627907, "KoPercent": 1.3953488372093024};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7686666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bd40a01-f037-47d8-916b-32eda3ae6e8a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02d8ff96-45a2-4493-9e89-f9aea738d439"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6203a84-eb56-4052-aa05-411768c2a5ca"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d5ad46c-4435-4477-bd80-9bcfd17957a3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=218c27ac-6261-4f8a-a38d-7a9f2189abe7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00b19822-8223-4c04-b76f-4f6960e022e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=165383e7-f32b-4fe9-858f-ae9182aee846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f811789-a7d2-4968-ae2a-c84435d158b9"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f811789-a7d2-4968-ae2a-c84435d158b9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e515a50d-d727-44c1-b991-f198127aa793"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eecb004c-432e-4954-9ef2-6637684c3896"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/165383e7-f32b-4fe9-858f-ae9182aee846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6078b1b3-1372-4d08-a074-3c6f156d9705"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cccbc9ee-66cb-4448-87d7-0a40da48f878"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9a54ea7d-a9c2-431b-bc44-17a5f0d302ab"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c32ed71-f53b-408e-abb7-c68f4d1c7b17"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bd40a01-f037-47d8-916b-32eda3ae6e8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85513589-7025-45e5-bf23-eba48d0bb77f"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37719298245614036, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/218c27ac-6261-4f8a-a38d-7a9f2189abe7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7e8e716a-ed86-4465-94c4-650adfa31527"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e515a50d-d727-44c1-b991-f198127aa793"], "isController": false}, {"data": [0.2818181818181818, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00b19822-8223-4c04-b76f-4f6960e022e3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9431137724550899, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cccbc9ee-66cb-4448-87d7-0a40da48f878"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6203a84-eb56-4052-aa05-411768c2a5ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02d8ff96-45a2-4493-9e89-f9aea738d439"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eecb004c-432e-4954-9ef2-6637684c3896"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85513589-7025-45e5-bf23-eba48d0bb77f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a54ea7d-a9c2-431b-bc44-17a5f0d302ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 18, 1.3953488372093024, 427.0379844961236, 120, 2889, 145.0, 1205.9, 1450.3500000000001, 1821.8899999999983, 5.153630113180109, 758.5220058632531, 3.7665866863556645], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1998.5614035087713, 1600, 2602, 1946.0, 2386.8, 2543.5, 2602.0, 0.2476053951912426, 297.95278851322735, 1.2174737937381899], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2bd40a01-f037-47d8-916b-32eda3ae6e8a", 3, 0, 0.0, 307.0, 207, 477, 237.0, 477.0, 477.0, 477.0, 0.0851861316977596, 0.03854450620438993, 0.054627825340034644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02d8ff96-45a2-4493-9e89-f9aea738d439", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6203a84-eb56-4052-aa05-411768c2a5ca", 3, 0, 0.0, 341.0, 257, 438, 328.0, 438.0, 438.0, 438.0, 0.07240605314604301, 0.03356322255207202, 0.046432267154200756], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 530.8571428571429, 137, 944, 495.5, 832.0, 944.0, 944.0, 0.0739703590204211, 0.013967477808892294, 0.05002390002113439], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 530.8571428571429, 137, 944, 495.5, 832.0, 944.0, 944.0, 0.07506299930298643, 0.014173795976087073, 0.050762819352849715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 164.66666666666666, 121, 373, 124.0, 371.2, 373.0, 373.0, 0.0974500568458665, 0.034206915570353526, 0.05512230320502409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 180.6111111111111, 123, 373, 127.5, 368.5, 373.0, 373.0, 0.0975773707235362, 0.07251599523497174, 0.04897926616396251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 183.88888888888889, 122, 723, 123.0, 408.0000000000005, 723.0, 723.0, 0.0975826606454551, 1.6188705044210365, 0.05699733748421058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d5ad46c-4435-4477-bd80-9bcfd17957a3", 2, 0, 0.0, 226.0, 215, 237, 226.0, 237.0, 237.0, 237.0, 0.013244331426149608, 0.022634355464611147, 0.008232438430414282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 278.6666666666667, 121, 1452, 125.0, 479.1000000000015, 1452.0, 1452.0, 0.09745322245322247, 4.896395254366445, 0.05682656439492377], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 232.93333333333334, 123, 376, 234.0, 323.20000000000005, 376.0, 376.0, 0.0791773996030573, 0.14380285916188082, 0.051176642139267765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=218c27ac-6261-4f8a-a38d-7a9f2189abe7", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00b19822-8223-4c04-b76f-4f6960e022e3", 3, 0, 0.0, 295.3333333333333, 222, 440, 224.0, 440.0, 440.0, 440.0, 0.024233416265468998, 0.024304412602184237, 0.015540309258780574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 126.27777777777777, 122, 145, 125.0, 132.40000000000003, 145.0, 145.0, 0.12189423643418727, 0.09058741594376613, 0.06118519289762915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 164.2777777777778, 121, 369, 124.0, 364.5, 369.0, 369.0, 0.12189341098395069, 0.06312904195164895, 0.06781114562876685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 854.5, 724, 981, 856.0, 981.0, 981.0, 981.0, 0.08130632156650179, 23.90675816450979, 0.04637001151839555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1382.6666666666667, 1205, 1471, 1415.5, 1471.0, 1471.0, 1471.0, 0.08051637837330076, 72.44877879299239, 0.04584086776526791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 204.66666666666666, 122, 370, 124.5, 370.0, 370.0, 370.0, 0.08171047255889963, 0.14458923464524034, 0.04524398236415633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 177.77777777777777, 123, 367, 124.0, 367.0, 367.0, 367.0, 0.055449106961327335, 0.04120778359137705, 0.027832852517697505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 177.33333333333334, 120, 370, 123.0, 370.0, 370.0, 370.0, 0.05553293102809966, 0.014859397560253229, 0.03167112472696309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=165383e7-f32b-4fe9-858f-ae9182aee846", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 230.88888888888889, 121, 369, 126.0, 369.0, 369.0, 369.0, 0.05553087516659262, 0.014967306197245669, 0.032646080908485114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 257.8888888888889, 123, 367, 363.0, 367.0, 367.0, 367.0, 0.055450131848091284, 0.014945543349680854, 0.03265276318788969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 124.83333333333333, 122, 130, 124.5, 130.0, 130.0, 130.0, 0.08198513336248361, 0.0609284047742676, 0.04603657390959773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f811789-a7d2-4968-ae2a-c84435d158b9", 3, 0, 0.0, 333.0, 214, 409, 376.0, 409.0, 409.0, 409.0, 0.04360528496053721, 0.028033996678730792, 0.027963024535240334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 815.3684210526316, 123, 1587, 1104.0, 1585.0, 1587.0, 1587.0, 0.0878105141536684, 41.59650310514154, 0.047651285384171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 319.44444444444446, 122, 1211, 124.5, 1091.3000000000002, 1211.0, 1211.0, 0.12189423643418727, 18.307486623377283, 0.0699145978505983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 586.7368421052631, 122, 1240, 726.0, 1109.0, 1240.0, 1240.0, 0.0878105141536684, 13.600267186597343, 0.04773703783939919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 285.9444444444445, 123, 1089, 125.0, 990.9000000000002, 1089.0, 1089.0, 0.12189341098395069, 6.0008300814315705, 0.07003316093316178], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 444.2307692307693, 180, 796, 428.0, 766.0, 796.0, 796.0, 0.07424922609460494, 0.01406674791245445, 0.05078419498132346], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f811789-a7d2-4968-ae2a-c84435d158b9", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e515a50d-d727-44c1-b991-f198127aa793", 3, 0, 0.0, 906.0, 212, 2055, 451.0, 2055.0, 2055.0, 2055.0, 0.06016967849335125, 0.027225212599530677, 0.038585373252572254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 490.55555555555554, 249, 736, 488.0, 736.0, 736.0, 736.0, 0.05532503457814661, 0.0857429979253112, 0.12442729944674964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eecb004c-432e-4954-9ef2-6637684c3896", 3, 0, 0.0, 973.0, 219, 2263, 437.0, 2263.0, 2263.0, 2263.0, 0.02359306678410771, 0.023662187096951774, 0.015129668478089905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/165383e7-f32b-4fe9-858f-ae9182aee846", 3, 0, 0.0, 812.6666666666666, 234, 1206, 998.0, 1206.0, 1206.0, 1206.0, 0.04047217537942665, 0.0337399873524452, 0.02595383642495784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6078b1b3-1372-4d08-a074-3c6f156d9705", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 496.40909090909105, 139, 1424, 411.5, 1054.4999999999998, 1377.3499999999995, 1424.0, 0.10896105632791335, 0.06693018010767333, 0.0492665713670155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 138.47368421052633, 123, 368, 125.0, 135.0, 368.0, 368.0, 0.0878092966937489, 0.06525671365619426, 0.044076150879479435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 188.5263157894737, 122, 373, 124.0, 372.0, 373.0, 373.0, 0.0878105141536684, 0.09291052859618718, 0.04619800693240901], "isController": false}, {"data": ["login", 22, 0, 0.0, 2715.7727272727275, 1288, 4656, 2601.0, 4108.5, 4577.249999999999, 4656.0, 0.10446046171524079, 34.22550023800367, 0.20484971047833395], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 127.55555555555554, 123, 139, 127.0, 133.60000000000002, 139.0, 139.0, 0.11366578470437423, 0.09202044484367797, 0.04040463440663303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 961.842105263158, 248, 1714, 1234.0, 1709.0, 1714.0, 1714.0, 0.08775900453575487, 55.32246725059122, 0.1855541822361918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cccbc9ee-66cb-4448-87d7-0a40da48f878", 3, 0, 0.0, 459.33333333333337, 227, 923, 228.0, 923.0, 923.0, 923.0, 0.07612860659273733, 0.034446211967416956, 0.0488194514933895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a54ea7d-a9c2-431b-bc44-17a5f0d302ab", 3, 0, 0.0, 664.3333333333334, 267, 994, 732.0, 994.0, 994.0, 994.0, 0.018592774847694185, 0.02197603042707604, 0.011923101057928888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 474.8888888888889, 247, 1820, 257.5, 848.0000000000016, 1820.0, 1820.0, 0.09738046547862499, 6.614807976204001, 0.21762674338083335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 1046.5555555555557, 123, 1597, 1455.0, 1597.0, 1597.0, 1597.0, 0.09213004667922366, 73.48792760497707, 0.1586684137253296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c32ed71-f53b-408e-abb7-c68f4d1c7b17", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1083.1363636363635, 292, 2889, 1096.5, 1672.4, 2707.949999999997, 2889.0, 0.10403809685946819, 0.03273357734996051, 0.046939063231517864], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 148.15384615384616, 124, 374, 129.0, 281.9999999999999, 374.0, 374.0, 0.06315308794310392, 0.049029985268327754, 0.022448949229775226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 466.50000000000006, 247, 1334, 254.5, 1226.9, 1334.0, 1334.0, 0.12179114172429191, 24.441384894261606, 0.2687175646507977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 535.8333333333333, 246, 1603, 492.5, 1344.400000000001, 1603.0, 1603.0, 0.10353485241969579, 10.46906040234075, 0.23064477947076434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 124.19999999999999, 121, 128, 124.5, 127.7, 128.0, 128.0, 0.05368003478466254, 0.03989307272571113, 0.026944861210270066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 148.3, 121, 369, 124.0, 344.80000000000007, 369.0, 369.0, 0.05368003478466254, 0.022426092657108043, 0.030163566420991043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bd40a01-f037-47d8-916b-32eda3ae6e8a", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85513589-7025-45e5-bf23-eba48d0bb77f", 3, 0, 0.0, 343.3333333333333, 242, 495, 293.0, 495.0, 495.0, 495.0, 0.02614789247986612, 0.026224497633615732, 0.016768016987414147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 293.8, 122, 1334, 125.0, 1237.6000000000004, 1334.0, 1334.0, 0.05368032294082281, 4.843186566297883, 0.03109684332860946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 232.0, 122, 718, 125.0, 683.3000000000002, 718.0, 718.0, 0.05368003478466254, 1.591392859347573, 0.031149098309615708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.6384548611111112, 3.434244791666667], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1362.2807017543864, 965, 2093, 1330.0, 1865.4, 2022.6999999999998, 2093.0, 0.2516945223323693, 301.11415188329323, 0.4969983634336432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1083.1363636363635, 292, 2889, 1096.5, 1672.4, 2707.949999999997, 2889.0, 0.1045637315944068, 0.03289895816500157, 0.04717621484044525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 218.0, 120, 373, 125.0, 371.0, 373.0, 373.0, 0.06353209103659938, 0.017123883912208423, 0.03741196376471623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/218c27ac-6261-4f8a-a38d-7a9f2189abe7", 2, 0, 0.0, 265.0, 227, 303, 265.0, 303.0, 303.0, 303.0, 0.01914828431372549, 0.027076870787377454, 0.011902229458678004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 179.92307692307693, 121, 371, 124.0, 369.4, 371.0, 371.0, 0.06353084911423335, 0.017123549175320708, 0.03734919059254734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 141.9230769230769, 121, 362, 124.0, 268.79999999999995, 362.0, 362.0, 0.06520474289268302, 0.01757471585779347, 0.03833325705214373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 161.92307692307693, 123, 372, 125.0, 368.8, 372.0, 372.0, 0.06520474289268302, 0.01757471585779347, 0.038396933558874864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 125.61538461538461, 123, 131, 125.0, 130.2, 131.0, 131.0, 0.06520310768042452, 0.04845660639140924, 0.03272890365990059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 180.0769230769231, 121, 371, 124.0, 370.2, 371.0, 371.0, 0.06353115959027289, 0.01699954856224099, 0.03623261445382751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 180.15384615384613, 121, 371, 124.0, 370.2, 371.0, 371.0, 0.06520506994497696, 0.017447450356370787, 0.037187266452994666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 143.00000000000003, 123, 366, 124.0, 270.3999999999999, 366.0, 366.0, 0.06352960724042048, 0.047212921005820294, 0.03188888488435168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 175.76923076923077, 123, 373, 141.0, 371.8, 373.0, 373.0, 0.06445183712524974, 0.05073064523725713, 0.022910613978116123], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 564.5833333333334, 124, 1206, 464.0, 1121.1000000000004, 1206.0, 1206.0, 0.09017539113575905, 0.01694457829854066, 0.06137180957587507], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1343.8636363636363, 927, 2099, 1259.0, 1838.8999999999999, 2071.9999999999995, 2099.0, 0.10501193317422433, 0.054351879474940336, 0.04830138723150358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 363.00000000000006, 248, 737, 251.0, 641.3999999999999, 737.0, 737.0, 0.06349082313410238, 0.09839837530646532, 0.14279234929476348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e8e716a-ed86-4465-94c4-650adfa31527", 1, 0, 0.0, 1089.0, 1089, 1089, 1089.0, 1089.0, 1089.0, 1089.0, 0.9182736455463728, 0.2932377754820937, 0.5479152318640955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e515a50d-d727-44c1-b991-f198127aa793", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["addBook", 55, 7, 12.727272727272727, 1314.7636363636366, 635, 2618, 1022.0, 2199.0, 2265.4, 2618.0, 0.27202943853123884, 95.77807799764076, 0.9860970545394294], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00b19822-8223-4c04-b76f-4f6960e022e3", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 212.59649122807005, 123, 560, 126.0, 495.2, 500.0, 560.0, 0.2531960448112579, 0.18816620127086645, 0.12239457244294204], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 802.4736842105264, 603, 1162, 732.0, 1016.4000000000002, 1111.2, 1162.0, 0.25269877862257, 74.30183130416953, 0.1270897177642808], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 191.6315789473684, 121, 545, 127.0, 377.0, 394.9999999999996, 545.0, 0.25366027324106627, 0.4488597803836055, 0.12336212507231542], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1145.8070175438595, 839, 1594, 1103.0, 1468.0, 1558.0, 1594.0, 0.2522916491464132, 227.01246938335717, 0.1266385817004457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 128.66666666666669, 124, 142, 126.5, 138.70000000000002, 142.0, 142.0, 0.10368603867489243, 0.07746076131473897, 0.036857146560215666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 7, 4.191616766467066, 201.05389221556882, 122, 1663, 130.0, 370.0000000000001, 460.79999999999995, 1168.639999999995, 0.7218281703168696, 1.6616298080455747, 0.3435361462480063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 175.99999999999997, 125, 374, 126.5, 373.7, 374.0, 374.0, 0.05435048453456962, 0.04208977952725948, 0.019319898799397797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 130.66666666666663, 123, 153, 127.0, 149.4, 153.0, 153.0, 0.09838646202282565, 0.07984291986422669, 0.03497331267217631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cccbc9ee-66cb-4448-87d7-0a40da48f878", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 419.7, 246, 1456, 251.5, 1360.0000000000005, 1456.0, 1456.0, 0.05364432738060114, 6.4925509403180035, 0.11927480916030533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 325.7692307692308, 248, 498, 253.0, 496.0, 498.0, 498.0, 0.06516225401249111, 0.10098876671662439, 0.1465514365144209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 127.66666666666667, 124, 135, 126.0, 135.0, 135.0, 135.0, 0.05468132936387387, 0.04533637561516495, 0.01943750379731454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6203a84-eb56-4052-aa05-411768c2a5ca", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 130.3157894736842, 124, 160, 127.0, 149.0, 160.0, 160.0, 0.09249928191346936, 0.07181340734492982, 0.032880604117678555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02d8ff96-45a2-4493-9e89-f9aea738d439", 3, 0, 0.0, 388.6666666666667, 235, 643, 288.0, 643.0, 643.0, 643.0, 0.017444091686145902, 0.024048088636337204, 0.011186478066962052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eecb004c-432e-4954-9ef2-6637684c3896", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85513589-7025-45e5-bf23-eba48d0bb77f", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 155.00000000000003, 123, 372, 125.0, 318.3000000000002, 372.0, 372.0, 0.1036466340755584, 0.07702645364404291, 0.05202575186995802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a54ea7d-a9c2-431b-bc44-17a5f0d302ab", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 206.16666666666666, 121, 374, 125.0, 373.1, 374.0, 374.0, 0.10370844100286063, 0.04073054494464562, 0.05842039620945648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 338.25, 121, 1477, 246.5, 1145.2000000000012, 1477.0, 1477.0, 0.1037102336073012, 7.802177928409691, 0.060227557537573355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 276.1666666666667, 121, 988, 123.0, 802.9000000000007, 988.0, 988.0, 0.1037102336073012, 2.5668114018598702, 0.060328837062580486], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.46511627906976744], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15503875968992248], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07751937984496124], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.6976744186046512], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 18, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
