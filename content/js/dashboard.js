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

    var data = {"OkPercent": 99.30178432893716, "KoPercent": 0.6982156710628394};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7427997320830543, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93d64f48-ac2f-49f5-b4c4-515b93005d70"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/629a41e4-b934-45eb-888a-cd9cac0423c2"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c716b8e9-079e-4138-8800-7f2a24da9b4b"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33893808-a636-4ca7-ae7f-7b901c03128e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5659d2c3-0b45-41d1-887b-b217b5e5a5dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94733091-0628-4b7d-9a88-a2e4155d5087"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21675d40-4cf4-4611-962c-48e57417ac63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d49e16f-3524-43bd-a990-55925ab46a0e"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/432be3af-f300-43e3-88ee-623f1bf8075a"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94129717-4058-4287-a941-2d82f0f9f4ca"], "isController": false}, {"data": [0.425, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5463364a-349f-4550-9ee2-a8f9017b0d7e"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9446ef1d-740f-421b-8a07-7e4afc19d67d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01ef29be-3f46-4c1a-9cde-d92bef2dde24"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9446ef1d-740f-421b-8a07-7e4afc19d67d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/daca222b-3c1a-4c88-8366-79f7150c541f"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c716b8e9-079e-4138-8800-7f2a24da9b4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/163715b2-5a0c-4d30-89e2-abc2d7bdefb9"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=629a41e4-b934-45eb-888a-cd9cac0423c2"], "isController": false}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21675d40-4cf4-4611-962c-48e57417ac63"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9540229885057471, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/33893808-a636-4ca7-ae7f-7b901c03128e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d49e16f-3524-43bd-a990-55925ab46a0e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/5659d2c3-0b45-41d1-887b-b217b5e5a5dc"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/94733091-0628-4b7d-9a88-a2e4155d5087"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=432be3af-f300-43e3-88ee-623f1bf8075a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94129717-4058-4287-a941-2d82f0f9f4ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daca222b-3c1a-4c88-8366-79f7150c541f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/943842dd-2346-49db-afb7-3895872b0ed9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01ef29be-3f46-4c1a-9cde-d92bef2dde24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 9, 0.6982156710628394, 467.7401086113267, 129, 5100, 151.0, 1320.0, 1590.0, 2089.5999999999967, 5.135703698981624, 718.3440029378895, 3.75763031375006], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2235.214285714286, 1585, 2918, 2255.0, 2684.3, 2873.8, 2918.0, 0.26212810574996726, 315.42874127166067, 1.2888818480967628], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/93d64f48-ac2f-49f5-b4c4-515b93005d70", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/629a41e4-b934-45eb-888a-cd9cac0423c2", 3, 0, 0.0, 511.66666666666663, 254, 931, 350.0, 931.0, 931.0, 931.0, 0.044243872223697016, 0.028444546758398963, 0.028372535247618205], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 829.5833333333333, 480, 1794, 596.0, 1753.5000000000002, 1794.0, 1794.0, 0.07941182309692875, 0.01434686257122248, 0.053975223511193764], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 829.5833333333333, 480, 1794, 596.0, 1753.5000000000002, 1794.0, 1794.0, 0.07845803802599577, 0.014174547885555874, 0.053326947720793993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 187.4375, 129, 406, 135.0, 402.5, 406.0, 406.0, 0.10305825367789143, 0.04692471755597351, 0.05769349992270631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 133.6875, 130, 143, 133.0, 138.1, 143.0, 143.0, 0.10305692606953766, 0.07658820384659977, 0.0517297460934984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 304.74999999999994, 133, 821, 178.0, 798.6, 821.0, 821.0, 0.10304896113766053, 3.8117800661445522, 0.059575180657709996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 347.125, 130, 1554, 135.0, 1553.3, 1554.0, 1554.0, 0.10305825367789143, 11.615804969501196, 0.059479910081673665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c716b8e9-079e-4138-8800-7f2a24da9b4b", 3, 0, 0.0, 376.6666666666667, 256, 522, 352.0, 522.0, 522.0, 522.0, 0.021037573105566542, 0.024865699201273475, 0.013490891607410835], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 374.8333333333333, 227, 1351, 252.0, 1081.000000000001, 1351.0, 1351.0, 0.07933831842434098, 0.19316117124845456, 0.05129098320011107], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33893808-a636-4ca7-ae7f-7b901c03128e", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.17694815132223313, 0.675272404505387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 172.35294117647058, 131, 399, 135.0, 395.0, 399.0, 399.0, 0.08535464856478668, 0.06343250738066666, 0.04284403258037144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 202.76470588235293, 131, 524, 135.0, 424.7999999999999, 524.0, 524.0, 0.08535593424580501, 0.022839380843115792, 0.04867955624956067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 954.75, 646, 1069, 1052.0, 1069.0, 1069.0, 1069.0, 0.11086167234832738, 32.59701262437294, 0.06322579751115545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1373.0, 1299, 1453, 1370.0, 1453.0, 1453.0, 1453.0, 0.10969422734128616, 98.70305858357328, 0.062452865761689284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 202.0, 133, 404, 135.5, 404.0, 404.0, 404.0, 0.11380772185392779, 0.20138632031183318, 0.06301658036247759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 166.375, 132, 511, 136.0, 327.6000000000002, 511.0, 511.0, 0.11428734696209945, 0.08493424906070088, 0.05736689095558509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5659d2c3-0b45-41d1-887b-b217b5e5a5dc", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 231.62500000000003, 129, 407, 136.0, 401.4, 407.0, 407.0, 0.11407874285225376, 0.04123378388495159, 0.06446173103797397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 316.62500000000006, 129, 1725, 134.0, 803.8000000000009, 1725.0, 1725.0, 0.11428734696209945, 6.456125991532022, 0.0665746117801683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 224.68749999999997, 131, 770, 136.0, 520.8000000000003, 770.0, 770.0, 0.11428897968513387, 2.1291763470027716, 0.06668717320494871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 201.0, 133, 395, 138.0, 395.0, 395.0, 395.0, 0.11381095999544756, 0.0845802153872418, 0.06390752148181869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 876.7999999999998, 130, 1743, 800.0, 1683.0, 1740.0, 1743.0, 0.09645387334641892, 43.40768105899119, 0.05255982551494311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 180.35294117647058, 130, 399, 136.0, 393.4, 399.0, 399.0, 0.08535636281475159, 0.023006207164913514, 0.05018020548289107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94733091-0628-4b7d-9a88-a2e4155d5087", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 593.3999999999999, 129, 1171, 590.5, 1151.4, 1170.5, 1171.0, 0.09657916594232292, 14.211756310241254, 0.0527224157829673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 164.64705882352945, 130, 393, 134.0, 390.6, 393.0, 393.0, 0.08535593424580501, 0.02300609165218963, 0.05026330893576213], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 543.6666666666666, 241, 1021, 514.0, 908.5000000000005, 1021.0, 1021.0, 0.07881669863121667, 0.014239344967553792, 0.05434041917347555], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/21675d40-4cf4-4611-962c-48e57417ac63", 3, 0, 0.0, 357.6666666666667, 242, 503, 328.0, 503.0, 503.0, 503.0, 0.049386780805004526, 0.0317509414355091, 0.03167055930529262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d49e16f-3524-43bd-a990-55925ab46a0e", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 534.0625, 268, 1858, 526.5, 1196.5000000000007, 1858.0, 1858.0, 0.11396985497335954, 8.687314632037639, 0.2544983590121663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 625.35, 157, 1655, 586.0, 1135.7000000000003, 1629.4499999999996, 1655.0, 0.08884940026654821, 0.05457643824966681, 0.04017311750333186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 160.65000000000003, 132, 399, 134.5, 365.10000000000053, 398.55, 399.0, 0.09657776683229753, 0.071773125546268, 0.0484775118669931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 215.89999999999998, 131, 409, 136.0, 402.7, 408.7, 409.0, 0.09657590141531983, 0.0983678370861119, 0.051023010415710966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/432be3af-f300-43e3-88ee-623f1bf8075a", 3, 0, 0.0, 493.6666666666667, 451, 521, 509.0, 521.0, 521.0, 521.0, 0.03654391970082711, 0.02991795509361334, 0.023434740172730926], "isController": false}, {"data": ["login", 20, 0, 0.0, 3244.95, 1796, 6296, 2705.5, 5700.500000000002, 6269.549999999999, 6296.0, 0.08968529430229324, 21.58337915691339, 0.1650594781661151], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 139.0, 134, 153, 137.0, 152.2, 153.0, 153.0, 0.08540653510710984, 0.06914259531620513, 0.03035935427635545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94129717-4058-4287-a941-2d82f0f9f4ca", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1054.05, 269, 1879, 1071.0, 1817.8, 1875.95, 1879.0, 0.09639065203456569, 57.733058665158154, 0.20445360958894207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5463364a-349f-4550-9ee2-a8f9017b0d7e", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 550.5625000000001, 267, 1687, 428.0, 1686.3, 1687.0, 1687.0, 0.10295811535169849, 15.536331847679904, 0.22826236462616553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1574.75, 1442, 1848, 1504.5, 1848.0, 1848.0, 1848.0, 0.10929260362304982, 130.75195018989592, 0.24644201344299027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9446ef1d-740f-421b-8a07-7e4afc19d67d", 3, 0, 0.0, 470.0, 343, 589, 478.0, 589.0, 589.0, 589.0, 0.016434663993294657, 0.02265651107148531, 0.01053915627174169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01ef29be-3f46-4c1a-9cde-d92bef2dde24", 3, 0, 0.0, 373.3333333333333, 250, 457, 413.0, 457.0, 457.0, 457.0, 0.01727881674662919, 0.02382024378970528, 0.01108049120796208], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1286.6190476190477, 144, 2431, 1129.0, 2284.0, 2421.7999999999997, 2431.0, 0.08689966812602935, 0.027447104999627575, 0.0392066862052984], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 423.5294117647059, 264, 799, 279.0, 789.4, 799.0, 799.0, 0.08529640500740072, 0.1321927683073681, 0.19183361399613658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 140.0, 134, 158, 139.0, 152.79999999999998, 158.0, 158.0, 0.149655791679138, 0.11618784607901826, 0.05319795719844358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9446ef1d-740f-421b-8a07-7e4afc19d67d", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 501.9999999999999, 270, 1329, 530.0, 863.4000000000003, 1329.0, 1329.0, 0.10985630794920245, 8.920661202230816, 0.24519556024886116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 133.9090909090909, 132, 139, 133.0, 138.2, 139.0, 139.0, 0.05036560853101835, 0.037429910246196255, 0.02528117459467132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 157.45454545454547, 130, 398, 133.0, 345.8000000000002, 398.0, 398.0, 0.050366761600380956, 0.013477043631351935, 0.028724793725217263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 181.8181818181818, 130, 401, 135.0, 400.6, 401.0, 401.0, 0.05036699222058911, 0.01357547837195566, 0.029610282535932272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 133.54545454545453, 130, 140, 134.0, 139.2, 140.0, 140.0, 0.05036814535330965, 0.01357578917725924, 0.029660148093794646], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1528.6607142857144, 1039, 2357, 1456.5, 2129.5, 2313.15, 2357.0, 0.25211143325349805, 301.6129222866507, 0.497821599647044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daca222b-3c1a-4c88-8366-79f7150c541f", 3, 0, 0.0, 443.66666666666663, 229, 848, 254.0, 848.0, 848.0, 848.0, 0.03335000833750209, 0.02780252973709077, 0.02138656133622367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1286.6190476190477, 144, 2431, 1129.0, 2284.0, 2421.7999999999997, 2431.0, 0.08633377459484792, 0.027268368538328085, 0.03895137095978491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 245.14285714285714, 130, 401, 135.0, 401.0, 401.0, 401.0, 0.037257625837631266, 0.010042094464049052, 0.021939793339933254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c716b8e9-079e-4138-8800-7f2a24da9b4b", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 170.71428571428572, 130, 408, 131.0, 408.0, 408.0, 408.0, 0.037311443952880975, 0.01005660012792495, 0.021935048105111665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 297.61538461538464, 130, 1196, 137.0, 878.3999999999996, 1196.0, 1196.0, 0.1444669170759896, 10.035295855049673, 0.08397573650345609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/163715b2-5a0c-4d30-89e2-abc2d7bdefb9", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 285.2307692307692, 130, 898, 136.0, 754.3999999999999, 898.0, 898.0, 0.14445889033347778, 3.30330342061984, 0.08411214385327422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 209.14285714285714, 130, 402, 133.0, 402.0, 402.0, 402.0, 0.037257427534303444, 0.00996927260195229, 0.021248376640657433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 176.76923076923077, 131, 403, 137.0, 398.6, 403.0, 403.0, 0.14488877000579556, 0.10767612692813516, 0.07272737088181534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 208.42857142857142, 132, 394, 135.0, 394.0, 394.0, 394.0, 0.037309654139506127, 0.027727194140785314, 0.018727697487994285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 198.23076923076923, 131, 459, 134.0, 431.79999999999995, 459.0, 459.0, 0.144890384851153, 0.055509387225126224, 0.08169675696309753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 176.7142857142857, 136, 410, 138.0, 410.0, 410.0, 410.0, 0.03617384114516046, 0.028472769495116533, 0.012858670094568756], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 653.4166666666666, 457, 1195, 555.5, 1115.8000000000002, 1195.0, 1195.0, 0.07871846341559412, 0.01422159739441886, 0.05358082910221592], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1889.6000000000001, 1133, 5100, 1671.0, 3257.100000000003, 5014.449999999999, 5100.0, 0.087082602202319, 0.045072049967997144, 0.04005459534891822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 459.2857142857143, 267, 804, 278.0, 804.0, 804.0, 804.0, 0.037229685887821634, 0.05769874170309858, 0.08373043613247386], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 1408.6610169491526, 686, 3165, 1112.0, 2462.0, 2586.0, 3165.0, 0.2787463030680991, 85.85502401824607, 1.0145062499409436], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=629a41e4-b934-45eb-888a-cd9cac0423c2", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 239.3214285714285, 131, 590, 136.5, 536.6, 548.45, 590.0, 0.253746154159851, 0.18857502276918614, 0.1226604944425061], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 859.6428571428571, 645, 1369, 793.5, 1172.8000000000002, 1218.0, 1369.0, 0.253196607165464, 74.4482094252437, 0.12734009051778705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21675d40-4cf4-4611-962c-48e57417ac63", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 181.0357142857143, 130, 530, 137.0, 402.0, 406.6, 530.0, 0.2542449832016707, 0.4498944429310815, 0.12364648597112504], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1286.4285714285713, 903, 1820, 1242.0, 1590.3, 1766.85, 1820.0, 0.2527554861480967, 227.4298307328104, 0.12687140613293132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 151.33333333333334, 132, 322, 138.0, 218.20000000000005, 322.0, 322.0, 0.10731993503566599, 0.08017553740457468, 0.03814888315720939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, 2.2988505747126435, 220.35632183908055, 132, 2345, 142.0, 377.5, 490.75, 1421.0, 0.7275251184318907, 1.5581138453988217, 0.35049629939540156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 140.36363636363637, 133, 149, 138.0, 149.0, 149.0, 149.0, 0.05236549209281069, 0.04055257346640515, 0.018614296017366302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33893808-a636-4ca7-ae7f-7b901c03128e", 3, 0, 0.0, 458.6666666666667, 227, 625, 524.0, 625.0, 625.0, 625.0, 0.021530533885471912, 0.025448362154345223, 0.013807015545045466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 176.75, 133, 404, 137.5, 399.8, 404.0, 404.0, 0.10219985181021488, 0.08293757505301616, 0.03632885357316232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d49e16f-3524-43bd-a990-55925ab46a0e", 3, 0, 0.0, 386.6666666666667, 263, 472, 425.0, 472.0, 472.0, 472.0, 0.09092562284051646, 0.04220701112323453, 0.05830842350124265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5659d2c3-0b45-41d1-887b-b217b5e5a5dc", 3, 0, 0.0, 1856.6666666666667, 1195, 3024, 1351.0, 3024.0, 3024.0, 3024.0, 0.016608169004727794, 0.022895701736660876, 0.010650420878682862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 318.45454545454544, 267, 535, 270.0, 535.0, 535.0, 535.0, 0.05033426527988139, 0.07800828027262868, 0.11320294232379575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94733091-0628-4b7d-9a88-a2e4155d5087", 3, 0, 0.0, 471.3333333333333, 233, 710, 471.0, 710.0, 710.0, 710.0, 0.03239146161071941, 0.027003428771175918, 0.020771868285519936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 547.9230769230769, 265, 1336, 536.0, 1123.9999999999998, 1336.0, 1336.0, 0.14424090450142577, 13.480370061135954, 0.3215622988948928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=432be3af-f300-43e3-88ee-623f1bf8075a", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94129717-4058-4287-a941-2d82f0f9f4ca", 3, 0, 0.0, 313.3333333333333, 223, 480, 237.0, 480.0, 480.0, 480.0, 0.023208676950689296, 0.02327667112144327, 0.014883168487258437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daca222b-3c1a-4c88-8366-79f7150c541f", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/943842dd-2346-49db-afb7-3895872b0ed9", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 154.5, 133, 391, 137.5, 223.00000000000017, 391.0, 391.0, 0.12187690432663009, 0.10104833180987202, 0.04332343083485679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 139.8, 135, 148, 138.5, 147.0, 147.95, 148.0, 0.09940604885807301, 0.07717559457242973, 0.03533574393001814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01ef29be-3f46-4c1a-9cde-d92bef2dde24", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 136.4, 131, 164, 134.0, 151.4, 164.0, 164.0, 0.11017664989533218, 0.08187932672885526, 0.05530351371699291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 238.80000000000004, 130, 403, 138.0, 403.0, 403.0, 403.0, 0.10997228698368011, 0.04043772635962404, 0.06210283966773707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 312.20000000000005, 130, 1192, 137.0, 728.2000000000003, 1192.0, 1192.0, 0.10997793109516024, 6.624888704624939, 0.06402491275084134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 280.6666666666667, 130, 1042, 135.0, 659.2000000000003, 1042.0, 1042.0, 0.11018717127493903, 2.187631421157406, 0.06425432897849147], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 55.55555555555556, 0.3878975950349108], "isController": false}, {"data": ["401/Unauthorized", 4, 44.44444444444444, 0.3103180760279286], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 9, "406/Not Acceptable", 5, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
