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

    var data = {"OkPercent": 98.2932505818464, "KoPercent": 1.7067494181536074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7529960053262317, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/897bd5d8-3dfe-4a2c-b6c6-e46d91feec2d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ede219e1-de3e-493f-8e19-c9967a8f172d"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=776f3dda-c263-4ce0-964f-99ec70f5ef5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/36204859-a613-4bfd-8d13-50a435eac743"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c508bfb-e25c-4e03-a338-7dfd611d71b8"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d420e522-6fcc-4cbc-89a6-e4ffa8b77490"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d76587fd-2056-4225-b1a1-242075e0d752"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb7737f6-78d3-473b-92a8-6d11d5d6e81c"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1889ecc-00b0-44df-ac53-7972ac360419"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adf6f052-e56d-45f5-b821-078f7d9bc3a3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df10d4c3-951c-4555-a9f8-9c281ca05c65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3189d513-3bd2-4d5b-84e8-8ceccffacd78"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c508bfb-e25c-4e03-a338-7dfd611d71b8"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/55970993-175c-4c04-b94e-1a3f0fc70bd5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5877cb4e-2581-413c-86a8-ca3cac504eea"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb7737f6-78d3-473b-92a8-6d11d5d6e81c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36204859-a613-4bfd-8d13-50a435eac743"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d420e522-6fcc-4cbc-89a6-e4ffa8b77490"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d76587fd-2056-4225-b1a1-242075e0d752"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ede219e1-de3e-493f-8e19-c9967a8f172d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/776f3dda-c263-4ce0-964f-99ec70f5ef5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=897bd5d8-3dfe-4a2c-b6c6-e46d91feec2d"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9289940828402367, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5877cb4e-2581-413c-86a8-ca3cac504eea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1889ecc-00b0-44df-ac53-7972ac360419"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3189d513-3bd2-4d5b-84e8-8ceccffacd78"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/adf6f052-e56d-45f5-b821-078f7d9bc3a3"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df10d4c3-951c-4555-a9f8-9c281ca05c65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d96dd191-7ff7-4da8-9007-9d4ae65eb1a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 22, 1.7067494181536074, 398.7432117920874, 124, 2366, 147.0, 1015.0, 1158.5, 1653.099999999999, 5.0438055884896364, 724.1516389127743, 3.688958433602936], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1882.3272727272727, 1523, 2490, 1804.0, 2208.2, 2332.2, 2490.0, 0.24746461256040386, 297.782661708282, 1.2167815666422201], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/897bd5d8-3dfe-4a2c-b6c6-e46d91feec2d", 3, 0, 0.0, 328.3333333333333, 240, 497, 248.0, 497.0, 497.0, 497.0, 0.05297639018877254, 0.03405871439545109, 0.03397248980204489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ede219e1-de3e-493f-8e19-c9967a8f172d", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 797.5, 129, 1924, 734.5, 1526.5, 1924.0, 1924.0, 0.07639252662825213, 0.014424844418434607, 0.05166193817389121], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 797.5, 129, 1924, 734.5, 1526.5, 1924.0, 1924.0, 0.07650733104175661, 0.014446522400253566, 0.051739576900797314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=776f3dda-c263-4ce0-964f-99ec70f5ef5b", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 191.6, 125, 391, 128.0, 388.20000000000005, 390.9, 391.0, 0.1027395501035101, 0.042921855013946894, 0.057730797978085654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 154.7, 126, 383, 129.5, 355.60000000000053, 382.85, 383.0, 0.10287219158916962, 0.07645091581968562, 0.05163701804378241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36204859-a613-4bfd-8d13-50a435eac743", 3, 0, 0.0, 590.6666666666666, 229, 1036, 507.0, 1036.0, 1036.0, 1036.0, 0.016303993391448012, 0.022476371097910917, 0.010455360345427274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 241.29999999999998, 124, 1137, 129.0, 826.5000000000011, 1123.9499999999998, 1137.0, 0.10287430817027755, 3.049801291844125, 0.05969522843240129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 269.49999999999994, 126, 1179, 129.0, 830.3000000000011, 1163.9999999999998, 1179.0, 0.10274113344018411, 9.269587998422924, 0.05951761753585666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c508bfb-e25c-4e03-a338-7dfd611d71b8", 3, 0, 0.0, 339.6666666666667, 265, 469, 285.0, 469.0, 469.0, 469.0, 0.03823409461663947, 0.03187419150820758, 0.024518608852467375], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 269.7857142857142, 127, 401, 256.5, 366.5, 401.0, 401.0, 0.07699838303395629, 0.14533337378040062, 0.04977288055075843], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 130.31250000000003, 127, 136, 130.5, 134.6, 136.0, 136.0, 0.07688906829671491, 0.05714119235722661, 0.038594708109874476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d420e522-6fcc-4cbc-89a6-e4ffa8b77490", 1, 0, 0.0, 1081.0, 1081, 1081, 1081.0, 1081.0, 1081.0, 1081.0, 0.9250693802035153, 0.16712679232192415, 0.6377919750231268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 177.75000000000003, 126, 393, 129.5, 389.5, 393.0, 393.0, 0.07688943779404203, 0.02779170230812481, 0.04344741303083747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 858.1428571428572, 625, 1036, 890.0, 1036.0, 1036.0, 1036.0, 0.03597972799325637, 10.5792346694234, 0.020519688621154025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1041.7142857142858, 883, 1181, 1124.0, 1181.0, 1181.0, 1181.0, 0.035988051966747044, 32.382112419926585, 0.020489291305286646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 241.28571428571428, 127, 384, 159.0, 384.0, 384.0, 384.0, 0.036083218210684755, 0.06385038222437575, 0.01997967258345533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 167.25, 127, 392, 130.0, 367.7000000000001, 392.0, 392.0, 0.0702687192940336, 0.05222118689722614, 0.03527160323938796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 221.41666666666666, 125, 390, 130.0, 387.3, 390.0, 390.0, 0.07034368753333999, 0.02762684212531728, 0.039625570076967716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 265.66666666666663, 127, 1151, 130.0, 923.6000000000008, 1151.0, 1151.0, 0.07034327518289252, 5.291963289969635, 0.04085039157756518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 284.1666666666667, 128, 624, 302.5, 554.4000000000003, 624.0, 624.0, 0.07034327518289252, 1.7409846116758112, 0.04091908618223598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 166.71428571428572, 127, 389, 130.0, 389.0, 389.0, 389.0, 0.036129964644248884, 0.026850491303001368, 0.020287821943792098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d76587fd-2056-4225-b1a1-242075e0d752", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 208.00000000000003, 125, 878, 128.5, 535.0000000000003, 878.0, 878.0, 0.07688943779404203, 4.343507054906267, 0.04478959926186139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 762.2857142857144, 126, 1172, 892.0, 1166.0, 1172.0, 1172.0, 0.0905439752685599, 52.38333393628614, 0.04822780379120559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb7737f6-78d3-473b-92a8-6d11d5d6e81c", 3, 0, 0.0, 374.6666666666667, 236, 556, 332.0, 556.0, 556.0, 556.0, 0.04384234293480644, 0.027786797426454467, 0.02811504413462522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 209.31249999999997, 125, 643, 129.0, 468.00000000000017, 643.0, 643.0, 0.07688795982604099, 1.4324042955140681, 0.04486382421490185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 624.3571428571428, 127, 1017, 758.5, 1016.0, 1017.0, 1017.0, 0.0905428041106433, 17.123238356357074, 0.04831560068683185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1889ecc-00b0-44df-ac53-7972ac360419", 3, 0, 0.0, 412.0, 274, 561, 401.0, 561.0, 561.0, 561.0, 0.07410151908114117, 0.033529007657156974, 0.04751952883784118], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 589.357142857143, 130, 1081, 527.0, 1019.0, 1081.0, 1081.0, 0.07660906394668009, 0.0144657321500881, 0.05242825937366618], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 519.0000000000001, 259, 1279, 514.5, 1125.7000000000005, 1279.0, 1279.0, 0.07021526831009403, 7.099907595609791, 0.15641868121097935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 627.6363636363636, 147, 1829, 571.5, 1143.1999999999998, 1733.1499999999987, 1829.0, 0.0975268087898253, 0.059906604227343854, 0.04409659420868077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 129.07142857142856, 126, 133, 129.0, 132.5, 133.0, 133.0, 0.09069237147595356, 0.06739931122382878, 0.04552331927601576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adf6f052-e56d-45f5-b821-078f7d9bc3a3", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 0.18878167450365727, 0.7204316875653083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 228.7857142857143, 126, 509, 128.5, 451.5, 509.0, 509.0, 0.09069178397217058, 0.11183380001813836, 0.0468262126787114], "isController": false}, {"data": ["login", 22, 0, 0.0, 2573.727272727273, 1507, 3978, 2480.5, 3735.5, 3946.7999999999997, 3978.0, 0.09740806007420723, 37.210428079367645, 0.19836169051688257], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df10d4c3-951c-4555-a9f8-9c281ca05c65", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 144.125, 128, 316, 132.0, 192.10000000000014, 316.0, 316.0, 0.08065044584574593, 0.06529220664660487, 0.028668713171730004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3189d513-3bd2-4d5b-84e8-8ceccffacd78", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c508bfb-e25c-4e03-a338-7dfd611d71b8", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 892.5714285714284, 258, 1299, 1022.5, 1294.5, 1299.0, 1299.0, 0.09046849757673668, 69.62764413368336, 0.18858542003231019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55970993-175c-4c04-b94e-1a3f0fc70bd5", 1, 0, 0.0, 1100.0, 1100, 1100, 1100.0, 1100.0, 1100.0, 1100.0, 0.9090909090909091, 0.2903053977272727, 0.5424360795454545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5877cb4e-2581-413c-86a8-ca3cac504eea", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 0.2086190098152425, 0.7961352482678984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 464.3500000000001, 254, 1308, 265.0, 1210.400000000001, 1305.6, 1308.0, 0.10267098569279814, 12.426227287252884, 0.22828251975133088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1001.0, 127, 1332, 1251.0, 1332.0, 1332.0, 1332.0, 0.046227810650887574, 43.01738550912229, 0.08788099420611441], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 829.4347826086956, 147, 2366, 786.0, 1230.8000000000002, 2156.399999999997, 2366.0, 0.09496480109003076, 0.029628114742253145, 0.042845447366791224], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 404.56250000000006, 255, 1011, 270.0, 672.9000000000003, 1011.0, 1011.0, 0.0768403258029814, 5.857128508541283, 0.1715869238176195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 131.6, 128, 136, 132.0, 135.4, 136.0, 136.0, 0.08449038217816206, 0.0655955603824598, 0.03003369053989354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 466.3333333333334, 255, 1111, 391.5, 812.2000000000005, 1111.0, 1111.0, 0.1285530638480217, 8.732283501910441, 0.28729154763605197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 135.6, 127, 193, 128.5, 187.10000000000002, 193.0, 193.0, 0.053544942947863286, 0.03979267732746481, 0.02687705144062669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 128.4, 127, 130, 128.5, 130.0, 130.0, 130.0, 0.05354608979679259, 0.014327762308907392, 0.030538004337233273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 129.1, 126, 134, 129.0, 133.7, 134.0, 134.0, 0.053545229655489995, 0.014432112680581286, 0.03147873852793454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 154.2, 127, 379, 129.0, 354.4000000000001, 379.0, 379.0, 0.05354580307995459, 0.01443226723639401, 0.0315313664621217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb7737f6-78d3-473b-92a8-6d11d5d6e81c", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 130.0, 130, 130, 130.0, 130.0, 130.0, 130.0, 7.6923076923076925, 2.2686298076923075, 4.755108173076923], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1220.5272727272732, 1002, 1968, 1048.0, 1656.4, 1801.6, 1968.0, 0.24706331558969521, 295.57361855108593, 0.4878535391819958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 829.4347826086956, 147, 2366, 786.0, 1230.8000000000002, 2156.399999999997, 2366.0, 0.09618360195043618, 0.03000836901884362, 0.04339533603623194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 128.14285714285714, 125, 132, 128.0, 132.0, 132.0, 132.0, 0.036241638536251994, 0.00976825413672417, 0.021341511755234327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 128.57142857142856, 126, 133, 127.0, 133.0, 133.0, 133.0, 0.03624088800530153, 0.009768051845178927, 0.021305678299991717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 230.99999999999997, 126, 879, 130.0, 586.8000000000002, 879.0, 879.0, 0.08689103863754852, 5.234172480521925, 0.05058461376933326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 325.06666666666666, 126, 900, 379.0, 673.2000000000002, 900.0, 900.0, 0.08669217343058268, 1.721166995856114, 0.05055350243605007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 130.42857142857142, 127, 134, 131.0, 134.0, 134.0, 134.0, 0.036241638536251994, 0.009697469686458054, 0.020669059477706215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 164.26666666666668, 126, 381, 130.0, 379.8, 381.0, 381.0, 0.08689003197553176, 0.06457354915369108, 0.04361472308146809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36204859-a613-4bfd-8d13-50a435eac743", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 129.57142857142858, 127, 133, 129.0, 133.0, 133.0, 133.0, 0.03624107563512485, 0.02693306499836915, 0.018191321168412277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 172.00000000000006, 126, 509, 130.0, 435.80000000000007, 509.0, 509.0, 0.08669868738187303, 0.031879829839376234, 0.04895992280926867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d420e522-6fcc-4cbc-89a6-e4ffa8b77490", 3, 0, 0.0, 356.0, 232, 514, 322.0, 514.0, 514.0, 514.0, 0.04811702059408481, 0.031216543634118177, 0.03085629250336819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 132.57142857142856, 127, 135, 133.0, 135.0, 135.0, 135.0, 0.03453209017808692, 0.027180531917517636, 0.012275078930491835], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 516.2142857142857, 127, 812, 510.5, 709.0, 812.0, 812.0, 0.07591779187679627, 0.014186925532780219, 0.05166921702998753], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1182.1818181818182, 852, 1981, 1007.5, 1852.6, 1971.55, 1981.0, 0.09764541399436319, 0.05053913029005126, 0.04491307616342292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 262.4285714285714, 259, 266, 262.0, 266.0, 266.0, 266.0, 0.036216137911053166, 0.05612794029769665, 0.08145094297769086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d76587fd-2056-4225-b1a1-242075e0d752", 3, 0, 0.0, 339.6666666666667, 230, 548, 241.0, 548.0, 548.0, 548.0, 0.026268092148467256, 0.02634504944968347, 0.016845098155104328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ede219e1-de3e-493f-8e19-c9967a8f172d", 3, 0, 0.0, 658.0, 327, 1158, 489.0, 1158.0, 1158.0, 1158.0, 0.05587112394077661, 0.03591974927833132, 0.035828813204208956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/776f3dda-c263-4ce0-964f-99ec70f5ef5b", 3, 0, 0.0, 342.6666666666667, 229, 552, 247.0, 552.0, 552.0, 552.0, 0.05629785317519892, 0.026133052938747937, 0.03610246443852275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=897bd5d8-3dfe-4a2c-b6c6-e46d91feec2d", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 1167.3333333333333, 646, 2176, 1048.0, 1835.0, 2016.6, 2176.0, 0.2902181218305126, 92.497101796552, 1.05432790956396], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 233.25454545454548, 127, 690, 132.0, 522.6, 543.5999999999997, 690.0, 0.24806621112689714, 0.18435389323004758, 0.1199148188552872], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 744.5999999999999, 622, 1035, 643.0, 907.0, 1018.6, 1035.0, 0.24815575157353306, 72.96603050905769, 0.12480489459020462], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 197.03636363636366, 126, 517, 131.0, 385.0, 396.0, 517.0, 0.24871347303493746, 0.4401062628313542, 0.12095635700331919], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 979.6545454545454, 868, 1302, 898.0, 1174.6, 1258.8, 1302.0, 0.2478538113156531, 223.01929510235234, 0.12441099513305243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 148.2777777777778, 127, 391, 132.0, 185.80000000000032, 391.0, 391.0, 0.13856706260921778, 0.10351933876567539, 0.049256260536870385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 10, 5.9171597633136095, 186.55621301775142, 126, 556, 134.0, 303.0, 396.5, 549.0000000000001, 0.6812483371897095, 1.480094050817498, 0.3266768748941848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 185.5, 129, 396, 134.0, 395.0, 396.0, 396.0, 0.05093335370667482, 0.03944350536073547, 0.018105215575419564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 145.00000000000003, 130, 380, 132.0, 141.4, 368.0999999999998, 380.0, 0.10073739775154128, 0.08175075930813555, 0.03580899685699319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5877cb4e-2581-413c-86a8-ca3cac504eea", 3, 0, 0.0, 938.6666666666666, 248, 1756, 812.0, 1756.0, 1756.0, 1756.0, 0.021432858000171466, 0.025332912564655787, 0.013744378339953704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1889ecc-00b0-44df-ac53-7972ac360419", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.6103515625, 2.3292335304054057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 291.90000000000003, 256, 507, 261.5, 489.00000000000006, 507.0, 507.0, 0.05350741077639253, 0.08292603603724116, 0.12033942091604688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3189d513-3bd2-4d5b-84e8-8ceccffacd78", 3, 0, 0.0, 379.3333333333333, 277, 493, 368.0, 493.0, 493.0, 493.0, 0.021394950791613177, 0.025288107527456853, 0.013720069355298816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adf6f052-e56d-45f5-b821-078f7d9bc3a3", 3, 0, 0.0, 377.3333333333333, 232, 606, 294.0, 606.0, 606.0, 606.0, 0.02691331222133508, 0.026992159815733524, 0.017258862329436884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 491.20000000000005, 256, 1029, 509.0, 952.8000000000001, 1029.0, 1029.0, 0.08662758799919147, 7.034419577112991, 0.19334984370939332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df10d4c3-951c-4555-a9f8-9c281ca05c65", 3, 0, 0.0, 338.3333333333333, 227, 496, 292.0, 496.0, 496.0, 496.0, 0.03218676909211854, 0.026350821701392614, 0.020640603877432783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 152.75, 129, 393, 130.5, 315.90000000000026, 393.0, 393.0, 0.07267926036739367, 0.060258488331950404, 0.025835205833721963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 138.7142857142857, 127, 191, 133.0, 181.0, 191.0, 191.0, 0.08863901129514258, 0.06881641990199058, 0.03150839854632022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d96dd191-7ff7-4da8-9007-9d4ae65eb1a4", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 173.6111111111111, 126, 389, 132.0, 386.3, 389.0, 389.0, 0.12890473939758518, 0.0957973698062132, 0.0647041367679285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 204.33333333333331, 126, 475, 128.0, 394.90000000000015, 475.0, 475.0, 0.1291359370964502, 0.045329292155709244, 0.0730453168493701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 262.27777777777777, 126, 980, 133.0, 450.80000000000086, 980.0, 980.0, 0.12890197005177562, 6.476491782946986, 0.07516484234572941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 261.55555555555554, 127, 969, 133.0, 443.40000000000083, 969.0, 969.0, 0.1289010469629481, 2.1384342416679796, 0.07529018400624454], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.6206361520558572], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07757951900698215], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07757951900698215], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9309542280837859], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 22, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
