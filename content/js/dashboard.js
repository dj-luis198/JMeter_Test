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

    var data = {"OkPercent": 99.12152269399706, "KoPercent": 0.8784773060029283};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8259911894273128, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8666bf4d-0036-4cc0-99db-021360ce018a"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/86aeb865-15ad-4a31-982a-7e12613de66c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d7fd1fb-0ceb-4052-a2eb-51d859a6281e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33c65104-d3da-43ff-85e8-80e56f1c221a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07c1c823-0ceb-4ed6-bccd-dc7b0827d5e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2abef19e-9dc8-43cd-a100-8d0d7e6867f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9588d8da-2904-4804-b50e-6b888cdc24e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5ceacb86-f70b-4302-817e-244e83b7256e"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbe85655-baf4-4ca1-bf07-3b40faa1825b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfeb1557-9502-40d6-a31e-d1a56a886878"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30a1fe00-2ea8-4dfd-9d47-32709c125491"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e736aa67-13c3-4f7c-b305-ce70b3b1a520"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d21f9062-6736-440d-88a7-85a1519f1d85"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6489be6e-8796-4ec4-b64a-4c0a79ce9024"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b9d9c19-ed8b-45dd-a5a2-44b23fa35d84"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6dd69464-0efc-470b-942a-380a62468135"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b9d9c19-ed8b-45dd-a5a2-44b23fa35d84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07c1c823-0ceb-4ed6-bccd-dc7b0827d5e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86aeb865-15ad-4a31-982a-7e12613de66c"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a12730b8-7b2e-4a54-b914-7c8136b356ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbe85655-baf4-4ca1-bf07-3b40faa1825b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9588d8da-2904-4804-b50e-6b888cdc24e6"], "isController": false}, {"data": [0.36885245901639346, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74b0f4c0-6d19-4b28-9d03-21ec70378cf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84eb8dd1-94d8-40bb-b154-b5051a88accf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8666bf4d-0036-4cc0-99db-021360ce018a"], "isController": false}, {"data": [0.8583333333333333, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33c65104-d3da-43ff-85e8-80e56f1c221a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9478021978021978, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d7fd1fb-0ceb-4052-a2eb-51d859a6281e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30a1fe00-2ea8-4dfd-9d47-32709c125491"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfeb1557-9502-40d6-a31e-d1a56a886878"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6489be6e-8796-4ec4-b64a-4c0a79ce9024"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a12730b8-7b2e-4a54-b914-7c8136b356ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dd69464-0efc-470b-942a-380a62468135"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d21f9062-6736-440d-88a7-85a1519f1d85"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1366, 12, 0.8784773060029283, 300.97218155197675, 77, 2103, 102.0, 817.7999999999997, 1012.2999999999997, 1484.8099999999959, 5.332646257388018, 760.0600218541877, 3.8880155570487744], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1336.2999999999993, 953, 1805, 1323.0, 1636.8999999999999, 1733.0499999999997, 1805.0, 0.2724473949488253, 327.84448206047426, 1.339621712468101], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8666bf4d-0036-4cc0-99db-021360ce018a", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 532.7142857142858, 364, 921, 469.0, 881.5, 921.0, 921.0, 0.09346418318979904, 0.016885619033313305, 0.06352643701181655], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 532.7142857142858, 364, 921, 469.0, 881.5, 921.0, 921.0, 0.09376716273960858, 0.016940356549636316, 0.0637323684245777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 120.3888888888889, 78, 319, 81.0, 256.0000000000001, 319.0, 319.0, 0.10704918910239256, 0.037576402641736104, 0.06055202070212374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86aeb865-15ad-4a31-982a-7e12613de66c", 3, 0, 0.0, 803.0, 167, 1863, 379.0, 1863.0, 1863.0, 1863.0, 0.030239192008789523, 0.030327783391627776, 0.019391669354594843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 81.88888888888887, 79, 86, 82.0, 84.2, 86.0, 86.0, 0.10704600599457634, 0.07955274468932871, 0.05373207722774633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 111.55555555555553, 79, 468, 81.0, 262.8000000000003, 468.0, 468.0, 0.1069480588927311, 1.7742399817891221, 0.062467599937019475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 169.61111111111111, 77, 873, 82.0, 309.6000000000009, 873.0, 873.0, 0.10695187165775401, 5.373641052064765, 0.062365381758764105], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 222.73333333333338, 167, 457, 188.0, 395.80000000000007, 457.0, 457.0, 0.09207933555551463, 0.1849140094105081, 0.059527851697022155], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2d7fd1fb-0ceb-4052-a2eb-51d859a6281e", 3, 0, 0.0, 659.3333333333333, 178, 1450, 350.0, 1450.0, 1450.0, 1450.0, 0.051288188330227545, 0.033307270741798164, 0.03288988639666285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 84.21428571428571, 80, 112, 82.0, 98.0, 112.0, 112.0, 0.09615186500278154, 0.0714566106124187, 0.04826372911272432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33c65104-d3da-43ff-85e8-80e56f1c221a", 3, 0, 0.0, 410.0, 170, 766, 294.0, 766.0, 766.0, 766.0, 0.033760592385861064, 0.028144816764384826, 0.02164985904952679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 93.07142857142858, 80, 241, 82.0, 162.5, 241.0, 241.0, 0.0961531857610868, 0.0360440304324833, 0.054260551953626696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 622.6666666666666, 607, 635, 626.0, 635.0, 635.0, 635.0, 0.027958211792773732, 8.22064256707641, 0.01594491766306627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 851.3333333333334, 779, 928, 847.0, 928.0, 928.0, 928.0, 0.02789581841681932, 25.100706447072334, 0.01588209193066959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 132.0, 80, 235, 81.0, 235.0, 235.0, 235.0, 0.02809620139357159, 0.049717106372218475, 0.015557174013823331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07c1c823-0ceb-4ed6-bccd-dc7b0827d5e0", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 81.84615384615385, 79, 93, 80.0, 90.6, 93.0, 93.0, 0.0660898211507763, 0.04911557997630934, 0.03317399225732326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 105.0, 78, 244, 82.0, 240.0, 244.0, 244.0, 0.0660925091766907, 0.025320898197199713, 0.037266404287878634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 196.92307692307693, 78, 963, 81.0, 674.9999999999998, 963.0, 963.0, 0.0660374483129972, 4.587246303490333, 0.03838625113025632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 159.46153846153845, 79, 623, 82.0, 471.79999999999984, 623.0, 623.0, 0.06603946111799729, 1.5101069744020887, 0.038451912794891595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2abef19e-9dc8-43cd-a100-8d0d7e6867f6", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9588d8da-2904-4804-b50e-6b888cdc24e6", 3, 0, 0.0, 266.0, 197, 390, 211.0, 390.0, 390.0, 390.0, 0.03291314221768753, 0.027438332428221923, 0.021106409560170708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 81.66666666666667, 80, 85, 80.0, 85.0, 85.0, 85.0, 0.02809593826385832, 0.020879891619918146, 0.015776527833709506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 549.2105263157894, 79, 1116, 699.0, 1038.0, 1116.0, 1116.0, 0.12644412500665494, 59.89753606569105, 0.06861621462891976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 139.71428571428572, 80, 746, 81.0, 490.5, 746.0, 746.0, 0.09615384615384616, 6.204022418011676, 0.05593771462912088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 347.4736842105263, 78, 645, 463.0, 641.0, 645.0, 645.0, 0.1265780620232504, 19.604662153159456, 0.06881250832750409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 176.42857142857142, 78, 619, 87.5, 432.0, 619.0, 619.0, 0.0961531857610868, 2.0435100677536555, 0.05603123003962885], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 637.0714285714286, 337, 1323, 516.5, 1192.0, 1323.0, 1323.0, 0.09376527871729098, 0.01694001617451058, 0.06464676442813226], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 293.46153846153845, 162, 1042, 175.0, 755.9999999999998, 1042.0, 1042.0, 0.06600794126308734, 6.168926063489485, 0.14715427230052908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ceacb86-f70b-4302-817e-244e83b7256e", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.5743452113309352, 1.0731649055755395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 583.681818181818, 99, 1082, 489.0, 1043.3, 1080.2, 1082.0, 0.09042483230303827, 0.05554415968614363, 0.040885446637018284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 99.36842105263158, 77, 240, 82.0, 237.0, 240.0, 240.0, 0.12657721876540579, 0.0940676401176502, 0.06353583051310407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 163.1578947368421, 78, 330, 84.0, 281.0, 330.0, 330.0, 0.1264416006175674, 0.13378529966659347, 0.06652221545648745], "isController": false}, {"data": ["login", 22, 0, 0.0, 2374.272727272726, 1531, 4186, 2203.5, 3426.2999999999997, 4075.5999999999985, 4186.0, 0.09371472386104662, 15.420377594460183, 0.1625863932610594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 85.85714285714286, 82, 91, 85.0, 91.0, 91.0, 91.0, 0.0897562476759543, 0.07266399347984971, 0.03190554116606188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbe85655-baf4-4ca1-bf07-3b40faa1825b", 1, 0, 0.0, 1323.0, 1323, 1323, 1323.0, 1323.0, 1323.0, 1323.0, 0.7558578987150416, 0.13655635865457294, 0.5211285903250189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfeb1557-9502-40d6-a31e-d1a56a886878", 3, 0, 0.0, 375.0, 231, 457, 437.0, 457.0, 457.0, 457.0, 0.02029261957426084, 0.023985189347051145, 0.013013170755629511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30a1fe00-2ea8-4dfd-9d47-32709c125491", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 650.7894736842107, 164, 1196, 780.0, 1121.0, 1196.0, 1196.0, 0.12637179913535085, 79.66361692509146, 0.2671955541237114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e736aa67-13c3-4f7c-b305-ce70b3b1a520", 2, 0, 0.0, 201.0, 165, 237, 201.0, 237.0, 237.0, 237.0, 0.01630975486438439, 0.027586421313587656, 0.010137850557793615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 275.6111111111112, 159, 952, 166.5, 457.0000000000008, 952.0, 952.0, 0.10689280433272168, 7.260957022783013, 0.23888500412724994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d21f9062-6736-440d-88a7-85a1519f1d85", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6489be6e-8796-4ec4-b64a-4c0a79ce9024", 3, 0, 0.0, 448.0, 188, 643, 513.0, 643.0, 643.0, 643.0, 0.03543125745532709, 0.029191573118304965, 0.02272121653222473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 933.6666666666666, 860, 1009, 932.0, 1009.0, 1009.0, 1009.0, 0.02787482345945142, 33.34797971409723, 0.0628544603201888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b9d9c19-ed8b-45dd-a5a2-44b23fa35d84", 3, 0, 0.0, 264.6666666666667, 178, 437, 179.0, 437.0, 437.0, 437.0, 0.07442137381856069, 0.033673733596288856, 0.0477246440177619], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1059.8695652173913, 260, 1933, 987.0, 1814.0000000000002, 1919.6, 1933.0, 0.09741511120146716, 0.030988196888646055, 0.04395095837409944], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6dd69464-0efc-470b-942a-380a62468135", 3, 0, 0.0, 319.3333333333333, 214, 389, 355.0, 389.0, 389.0, 389.0, 0.02787534147293304, 0.027957007512404528, 0.01787578863986917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 271.28571428571433, 164, 828, 170.0, 587.0, 828.0, 828.0, 0.09609774513505165, 8.350174123537084, 0.21436983045612107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 96.73333333333335, 81, 245, 85.0, 161.00000000000006, 245.0, 245.0, 0.08088171857475628, 0.06279391237005004, 0.028750923399620397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b9d9c19-ed8b-45dd-a5a2-44b23fa35d84", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.5360951409495549, 2.0458549703264093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07c1c823-0ceb-4ed6-bccd-dc7b0827d5e0", 3, 0, 0.0, 250.0, 176, 371, 203.0, 371.0, 371.0, 371.0, 0.06296964862936065, 0.03917154900088157, 0.040380927018177235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86aeb865-15ad-4a31-982a-7e12613de66c", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 328.1, 161, 1042, 172.0, 920.100000000001, 1038.3, 1042.0, 0.09492078860191171, 11.488224112134674, 0.21105044090706307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 85.125, 79, 115, 82.0, 104.50000000000001, 115.0, 115.0, 0.08259599202948677, 0.061382372982851006, 0.04145931631167597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 101.06249999999999, 79, 244, 81.0, 242.6, 244.0, 244.0, 0.08259599202948677, 0.022100880679765015, 0.047105526704316676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 110.81250000000001, 78, 245, 81.0, 243.6, 245.0, 245.0, 0.08259599202948677, 0.022262200976697608, 0.04855740937670999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 110.4375, 79, 243, 81.0, 238.8, 243.0, 243.0, 0.08259641841280659, 0.022262315900326773, 0.04863832060832262], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 901.1333333333331, 623, 1419, 838.0, 1271.3, 1331.3, 1419.0, 0.2660730281771337, 318.3158436510541, 0.5253902958732073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1059.8695652173913, 260, 1933, 987.0, 1814.0000000000002, 1919.6, 1933.0, 0.09842224856324913, 0.031308571935965625, 0.044405350425997164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a12730b8-7b2e-4a54-b914-7c8136b356ac", 3, 0, 0.0, 886.3333333333334, 171, 2103, 385.0, 2103.0, 2103.0, 2103.0, 0.03325794864972728, 0.027530912570395992, 0.021327525664050377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 80.66666666666666, 77, 88, 79.5, 88.0, 88.0, 88.0, 0.03148680702785533, 0.008486678456726631, 0.0185415474978484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 80.5, 78, 83, 80.5, 83.0, 83.0, 83.0, 0.03148713750432948, 0.008486767530463806, 0.0185109929468812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 273.40000000000003, 79, 978, 88.0, 880.8000000000001, 978.0, 978.0, 0.07835926154231923, 14.118456471103718, 0.044719875434893905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 221.66666666666669, 78, 623, 84.0, 618.8, 623.0, 623.0, 0.07842317143305275, 4.628713255476551, 0.04483293413760652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 125.06666666666665, 80, 246, 83.0, 246.0, 246.0, 246.0, 0.0784227614222752, 0.05828097797104632, 0.039364550167040484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 108.33333333333333, 80, 240, 81.5, 240.0, 240.0, 240.0, 0.03148680702785533, 0.008425180786750351, 0.017957319633073742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 122.4, 78, 245, 82.0, 238.4, 245.0, 245.0, 0.07836171768885174, 0.04450700684359001, 0.04337443514261833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 81.83333333333334, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.031486311326150956, 0.023399495038282106, 0.015804652364884368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 89.0, 81, 99, 89.0, 99.0, 99.0, 99.0, 0.03306440946964687, 0.02602530667239783, 0.011753364303663536], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 554.1428571428571, 371, 1450, 437.0, 1108.0, 1450.0, 1450.0, 0.09678333667466281, 0.017485270785949827, 0.06587693912328124], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1257.590909090909, 850, 1999, 1127.0, 1900.1, 1996.45, 1999.0, 0.09234656827559574, 0.04779656365826732, 0.04247581411895077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbe85655-baf4-4ca1-bf07-3b40faa1825b", 3, 0, 0.0, 340.0, 177, 664, 179.0, 664.0, 664.0, 664.0, 0.048605822977592715, 0.031248860801023966, 0.03116974976102137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 191.5, 160, 324, 167.0, 324.0, 324.0, 324.0, 0.03147309836916895, 0.04877715538268665, 0.070783735883004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9588d8da-2904-4804-b50e-6b888cdc24e6", 1, 0, 0.0, 1061.0, 1061, 1061, 1061.0, 1061.0, 1061.0, 1061.0, 0.942507068803016, 0.1702771559849199, 0.6498144439208294], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 899.5573770491802, 410, 1988, 741.0, 1550.4, 1645.4, 1988.0, 0.29279625220797173, 104.47905329311784, 1.061841095933972], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74b0f4c0-6d19-4b28-9d03-21ec70378cf3", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 142.61666666666667, 79, 464, 84.0, 328.4, 331.95, 464.0, 0.267002496473342, 0.19842665997677078, 0.1290685896038128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84eb8dd1-94d8-40bb-b154-b5051a88accf", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.8144087357954546, 3.3902254971590913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8666bf4d-0036-4cc0-99db-021360ce018a", 3, 0, 0.0, 448.6666666666667, 168, 693, 485.0, 693.0, 693.0, 693.0, 0.02831176920245746, 0.028394713838792787, 0.018155659286732163], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 489.8666666666668, 382, 726, 470.5, 639.9, 679.1999999999998, 726.0, 0.2668837321021097, 78.47267861193771, 0.13422375198494776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33c65104-d3da-43ff-85e8-80e56f1c221a", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 121.53333333333336, 79, 339, 84.0, 243.0, 244.0, 339.0, 0.26732249786142004, 0.4730355137938409, 0.1300064491552609], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 756.7333333333332, 539, 1052, 724.0, 975.7, 1008.0, 1052.0, 0.2665067626091012, 239.80325346458793, 0.1337739023252715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 88.35, 81, 122, 86.0, 105.20000000000005, 121.24999999999999, 122.0, 0.09556118304744612, 0.07139092288212529, 0.03396901428639687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 8, 4.395604395604396, 150.86263736263746, 80, 1466, 88.5, 279.9000000000001, 328.3499999999999, 730.619999999989, 0.7263758236583, 1.5832956883408698, 0.34812004108812694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 88.3125, 83, 102, 85.5, 99.9, 102.0, 102.0, 0.08524922076884141, 0.06601819538055785, 0.030303433945174093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d7fd1fb-0ceb-4052-a2eb-51d859a6281e", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 88.8888888888889, 81, 124, 85.0, 107.80000000000003, 124.0, 124.0, 0.10590789543360457, 0.08594673936066934, 0.03764694720491413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 217.62500000000003, 161, 346, 164.5, 333.40000000000003, 346.0, 346.0, 0.08256146959415878, 0.12795415258391601, 0.18568268015170672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 420.19999999999993, 162, 1225, 318.0, 1122.4, 1225.0, 1225.0, 0.07832448266679198, 18.837772373388475, 0.17214558661121293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30a1fe00-2ea8-4dfd-9d47-32709c125491", 3, 0, 0.0, 332.3333333333333, 279, 429, 289.0, 429.0, 429.0, 429.0, 0.03202527861992399, 0.026698157078654083, 0.020537043906656987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfeb1557-9502-40d6-a31e-d1a56a886878", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6489be6e-8796-4ec4-b64a-4c0a79ce9024", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.26529230910425844, 1.012412812041116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.15384615384616, 82, 93, 85.0, 92.6, 93.0, 93.0, 0.06623157615867048, 0.05491270327999144, 0.023543255587652395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a12730b8-7b2e-4a54-b914-7c8136b356ac", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 105.47368421052632, 81, 387, 86.0, 117.0, 387.0, 387.0, 0.12002754316253625, 0.09318544610763312, 0.04266604073355781], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dd69464-0efc-470b-942a-380a62468135", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 100.00000000000001, 80, 248, 83.0, 231.1000000000003, 247.9, 248.0, 0.09496044897300275, 0.07057119303560067, 0.04766569411340177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 120.55000000000003, 79, 245, 81.0, 241.8, 244.85, 245.0, 0.09495999810080004, 0.039671764831564704, 0.05335935830781283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 196.70000000000002, 80, 960, 82.0, 820.0000000000014, 956.1999999999999, 960.0, 0.0949622525046294, 8.567755938108352, 0.05501133611889274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 173.75000000000003, 79, 637, 82.0, 597.5000000000006, 636.4, 637.0, 0.0949622525046294, 2.8152412931484734, 0.05510407269360429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d21f9062-6736-440d-88a7-85a1519f1d85", 3, 0, 0.0, 303.6666666666667, 172, 533, 206.0, 533.0, 533.0, 533.0, 0.04271739594754304, 0.02746316959518148, 0.02739364258354811], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 33.333333333333336, 0.29282576866764276], "isController": false}, {"data": ["401/Unauthorized", 8, 66.66666666666667, 0.5856515373352855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1366, 12, "401/Unauthorized", 8, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
