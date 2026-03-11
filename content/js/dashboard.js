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

    var data = {"OkPercent": 96.84044233807268, "KoPercent": 3.1595576619273302};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7368243243243243, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/60b1d41b-780e-41a0-be39-fec2b8c6c8e1"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa0d350f-f253-41e5-9cd5-fe3f5621781e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c4206bb-9f47-4726-a565-8de3813b243d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdcab6f3-2887-4bd6-91d2-a629ec364b97"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43abd6a5-19b5-4c27-8699-53fedbf572ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b8faef9-012e-46dc-a3d1-43124114163e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/725c60e9-80b4-4caf-945a-2427fce11f93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c4206bb-9f47-4726-a565-8de3813b243d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43abd6a5-19b5-4c27-8699-53fedbf572ad"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=725c60e9-80b4-4caf-945a-2427fce11f93"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ccfb5de5-776f-41fe-bb9f-e9968ce6e6f9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd44b7a6-f49b-418c-9a61-a969800b3cec"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdcab6f3-2887-4bd6-91d2-a629ec364b97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccfb5de5-776f-41fe-bb9f-e9968ce6e6f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fea7fce6-6466-40ce-b041-7fbf01f0712e"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b8faef9-012e-46dc-a3d1-43124114163e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd44b7a6-f49b-418c-9a61-a969800b3cec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fea7fce6-6466-40ce-b041-7fbf01f0712e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac0e5024-7e72-4928-b61e-697ac400ad83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9ef13fe-5909-493c-8d81-61c736a42bca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac0e5024-7e72-4928-b61e-697ac400ad83"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23529411764705882, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9ef13fe-5909-493c-8d81-61c736a42bca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1f90997-e6c7-40b3-b140-914aadbab08d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f1f90997-e6c7-40b3-b140-914aadbab08d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1266, 40, 3.1595576619273302, 435.64139020537067, 135, 2102, 164.0, 1119.0, 1314.6499999999999, 1810.349999999993, 5.146592516708132, 732.8285894535505, 3.771322972309625], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2142.7037037037044, 1672, 2716, 2096.5, 2569.5, 2589.25, 2716.0, 0.23375915015562299, 281.2919655505569, 1.1493919150718377], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 170.80000000000004, 144, 425, 154.0, 269.0000000000001, 425.0, 425.0, 0.07854883642990303, 0.06098273922048135, 0.02792165669969209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 509.33333333333337, 291, 1147, 310.0, 924.7000000000004, 1147.0, 1147.0, 0.1102306269673105, 7.4876868466538875, 0.24634440028415006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60b1d41b-780e-41a0-be39-fec2b8c6c8e1", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.5632027116402117, 1.0523451278659612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 516.6153846153845, 290, 1119, 577.0, 911.3999999999999, 1119.0, 1119.0, 0.1079420434259144, 10.087975360152779, 0.24063972526674138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 148.60000000000002, 144, 161, 147.5, 160.1, 161.0, 161.0, 0.051556224640782, 0.03831473335120616, 0.025878808071642532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 147.0, 142, 151, 147.5, 150.9, 151.0, 151.0, 0.05155835116392978, 0.013795886932535896, 0.0294043721481787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 175.6, 138, 444, 147.5, 415.1000000000001, 444.0, 444.0, 0.05147925643362007, 0.013875268335624162, 0.03026417223929618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 146.79999999999998, 140, 151, 147.5, 150.8, 151.0, 151.0, 0.051557819516696995, 0.01389644354160974, 0.030360708172429973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 156.25, 151, 159, 157.5, 159.0, 159.0, 159.0, 0.04616485469611984, 0.013615025506082219, 0.028537454123675646], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1363.7592592592598, 1096, 2102, 1192.5, 1945.5, 1987.0, 2102.0, 0.24498684329915613, 293.0894357930315, 0.4837533175301697], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 413.93333333333334, 149, 595, 480.0, 590.2, 595.0, 595.0, 0.08675534991324466, 0.01831690102660497, 0.057859492481203006], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 413.93333333333334, 149, 595, 480.0, 590.2, 595.0, 595.0, 0.08802920222068335, 0.01858585304698412, 0.058709059085200535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 916.7083333333334, 353, 1903, 828.0, 1743.5, 1895.75, 1903.0, 0.10198054721061957, 0.0315701498689125, 0.046010754698541254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 249.0588235294118, 137, 450, 150.0, 449.2, 450.0, 450.0, 0.08146327204420101, 0.021797789589952224, 0.04645952233770839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 185.85714285714286, 142, 410, 149.0, 410.0, 410.0, 410.0, 0.04780506460513016, 0.01288495881935149, 0.0281508339422788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 186.99999999999997, 139, 482, 149.0, 462.0, 482.0, 482.0, 0.08146639511201628, 0.06054289714867617, 0.0408923116089613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 148.2857142857143, 142, 157, 148.0, 157.0, 157.0, 157.0, 0.047803105836076325, 0.012884430869879946, 0.028102997766912056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 201.41176470588238, 138, 550, 147.0, 450.7999999999999, 550.0, 550.0, 0.08146600471544405, 0.021957634083459528, 0.04797265707364527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 215.00000000000003, 144, 449, 150.0, 441.8, 449.0, 449.0, 0.08146249131466085, 0.021956687112154684, 0.04789103493303304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 327.4666666666667, 137, 1325, 150.0, 869.0000000000002, 1325.0, 1325.0, 0.07687064719960233, 4.630560670478596, 0.04475112807674765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 288.5333333333333, 139, 1015, 149.0, 750.4000000000001, 1015.0, 1015.0, 0.07687025326186109, 1.5261647925271866, 0.04482596734807876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa0d350f-f253-41e5-9cd5-fe3f5621781e", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 148.73333333333335, 139, 162, 150.0, 156.6, 162.0, 162.0, 0.07686670800387407, 0.05712457499116033, 0.03858348429100711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 188.2857142857143, 139, 442, 149.0, 442.0, 442.0, 442.0, 0.04780277939017311, 0.012790978079011165, 0.027262522620958105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 242.79999999999998, 143, 450, 149.0, 445.2, 450.0, 450.0, 0.07686788972020088, 0.028264963615865533, 0.0434083382443374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 214.85714285714286, 144, 607, 152.0, 607.0, 607.0, 607.0, 0.04780147365114485, 0.035524337352071514, 0.023994099078797317], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 463.4, 143, 1119, 488.0, 874.8000000000002, 1119.0, 1119.0, 0.08517645722722239, 0.01736246663922092, 0.0579543720365691], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 194.71428571428572, 149, 447, 154.0, 447.0, 447.0, 447.0, 0.04836525440123815, 0.03806874516347456, 0.017192336525440124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1259.7272727272727, 830, 1950, 1209.5, 1630.8999999999999, 1904.2499999999993, 1950.0, 0.09957003847024214, 0.051535273817605795, 0.045798328241683645], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 233.0, 143, 347, 249.0, 308.6, 347.0, 347.0, 0.08660608090162704, 0.14379090333029249, 0.05596692441598632], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 408.1428571428571, 289, 1049, 305.0, 1049.0, 1049.0, 1049.0, 0.04775255987829919, 0.07400714113951251, 0.10739662636691703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c4206bb-9f47-4726-a565-8de3813b243d", 3, 0, 0.0, 537.3333333333334, 252, 872, 488.0, 872.0, 872.0, 872.0, 0.038523769165575164, 0.03211568126075456, 0.024704370200580427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 197.6111111111111, 137, 454, 149.5, 446.8, 454.0, 454.0, 0.11052844879462587, 0.08214077102803738, 0.05548010027386493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 825.6666666666666, 684, 1047, 739.0, 1047.0, 1047.0, 1047.0, 0.05383419069266659, 15.829039527006818, 0.03070231187941141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 211.7222222222222, 141, 447, 149.0, 446.1, 447.0, 447.0, 0.11053319987472904, 0.03879935998206906, 0.06252273990309923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdcab6f3-2887-4bd6-91d2-a629ec364b97", 3, 0, 0.0, 586.6666666666667, 272, 1119, 369.0, 1119.0, 1119.0, 1119.0, 0.03429276879815276, 0.028074971851352278, 0.02199113103266958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1199.8888888888887, 1022, 1497, 1228.0, 1497.0, 1497.0, 1497.0, 0.0536234560913267, 48.25048005095718, 0.030529760645745578], "isController": false}, {"data": ["addBook", 54, 14, 25.925925925925927, 1284.6111111111109, 746, 2251, 1159.0, 2032.5, 2055.75, 2251.0, 0.2610915561056744, 70.46505365824324, 0.9502295354383437], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 340.7777777777778, 143, 449, 425.0, 449.0, 449.0, 449.0, 0.053909970349516306, 0.09539537722004253, 0.02985054022282788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43abd6a5-19b5-4c27-8699-53fedbf572ad", 3, 0, 0.0, 312.3333333333333, 242, 453, 242.0, 453.0, 453.0, 453.0, 0.043914863717539596, 0.02823302599028018, 0.028161549975114913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 224.08333333333334, 144, 449, 152.0, 447.5, 449.0, 449.0, 0.06756756756756757, 0.05021378800675676, 0.03391575168918919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 172.16666666666669, 137, 443, 149.0, 356.00000000000034, 443.0, 443.0, 0.06757023080864674, 0.01808031566559493, 0.03853614725805635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b8faef9-012e-46dc-a3d1-43124114163e", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/725c60e9-80b4-4caf-945a-2427fce11f93", 3, 0, 0.0, 430.0, 250, 712, 328.0, 712.0, 712.0, 712.0, 0.019668261981249588, 0.02324721980921786, 0.012612785189798728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 221.16666666666666, 142, 447, 151.0, 443.40000000000003, 447.0, 447.0, 0.06746310611384398, 0.018183415319747015, 0.03966092761770906], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 249.648148148148, 143, 624, 152.0, 601.5, 608.5, 624.0, 0.2461527240901466, 0.18293185843027496, 0.11898984221154547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 244.83333333333331, 143, 449, 150.5, 448.7, 449.0, 449.0, 0.06745665909653048, 0.018181677647111733, 0.03972301312032019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c4206bb-9f47-4726-a565-8de3813b243d", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 821.5740740740741, 683, 1141, 744.5, 1038.0, 1082.25, 1141.0, 0.24571142558128953, 72.24731750807662, 0.12357557048277744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 149.22222222222223, 138, 158, 152.0, 158.0, 158.0, 158.0, 0.05400378026461852, 0.04013366873181123, 0.030324388332183254], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 231.55555555555554, 138, 611, 153.0, 447.0, 490.25, 611.0, 0.24671165347063903, 0.43656398055546675, 0.11998281584802563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 809.6250000000001, 136, 1356, 1248.0, 1342.7, 1356.0, 1356.0, 0.08266298816369338, 41.84866751945164, 0.04460087984418027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 227.05555555555554, 144, 982, 149.5, 496.9000000000008, 982.0, 982.0, 0.11033873993158999, 5.543809316650729, 0.06434031992104651], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1109.7592592592591, 947, 1494, 1033.5, 1348.0, 1390.75, 1494.0, 0.24577964489392787, 221.15295651008833, 0.12336986081589739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 571.125, 137, 1185, 678.5, 1085.6000000000001, 1185.0, 1185.0, 0.08266384231872077, 13.681824529849397, 0.04468206711270698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 275.94444444444446, 135, 1001, 149.5, 504.2000000000008, 1001.0, 1001.0, 0.11033197665865739, 1.8303782816101113, 0.06444412221718236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43abd6a5-19b5-4c27-8699-53fedbf572ad", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 229.23076923076923, 145, 510, 155.0, 489.2, 510.0, 510.0, 0.10861301183881829, 0.08114155669599218, 0.03860853155207994], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 446.1333333333334, 151, 933, 463.0, 877.2, 933.0, 933.0, 0.08817305431460146, 0.018616224944157066, 0.0591149813367035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 14, 8.641975308641975, 199.25925925925927, 138, 1070, 155.0, 318.9000000000001, 390.8499999999998, 727.2800000000025, 0.6992192052208367, 1.5590007005680075, 0.3332258674958025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 155.70000000000002, 149, 193, 151.5, 189.3, 193.0, 193.0, 0.05352803263068869, 0.04145286120716419, 0.01902754284919012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 473.66666666666663, 297, 897, 305.5, 895.5, 897.0, 897.0, 0.06739755571531272, 0.10445304777363408, 0.1515786824339504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 152.00000000000003, 139, 166, 151.0, 161.2, 166.0, 166.0, 0.08163892543964962, 0.06625190140659067, 0.029020086777375453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=725c60e9-80b4-4caf-945a-2427fce11f93", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.21507626488095238, 0.8207775297619048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccfb5de5-776f-41fe-bb9f-e9968ce6e6f9", 3, 0, 0.0, 420.6666666666667, 248, 510, 504.0, 510.0, 510.0, 510.0, 0.02461094202482424, 0.02468304439403759, 0.015782407483367105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd44b7a6-f49b-418c-9a61-a969800b3cec", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 570.8636363636365, 286, 1050, 568.0, 821.5, 1015.9499999999995, 1050.0, 0.0976259152429554, 0.05996748114044819, 0.04414140503660972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 166.37500000000003, 138, 451, 149.5, 242.4000000000002, 451.0, 451.0, 0.08266170696424881, 0.061431209960735686, 0.04149230212853895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 239.68750000000003, 144, 447, 150.0, 444.9, 447.0, 447.0, 0.08266127990659275, 0.09195461960312253, 0.0432377422362976], "isController": false}, {"data": ["login", 22, 0, 0.0, 2698.5454545454545, 1564, 4137, 2680.5, 3618.0, 4064.549999999999, 4137.0, 0.10134185833329494, 49.73204597264, 0.22164932722825412], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 328.4, 290, 595, 297.5, 567.2, 595.0, 595.0, 0.051438212419242006, 0.07971918272396199, 0.11568574531397885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdcab6f3-2887-4bd6-91d2-a629ec364b97", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 170.11111111111111, 145, 457, 153.5, 193.3000000000004, 457.0, 457.0, 0.1139925904816187, 0.09228501709888857, 0.04052080364776289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccfb5de5-776f-41fe-bb9f-e9968ce6e6f9", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fea7fce6-6466-40ce-b041-7fbf01f0712e", 3, 0, 0.0, 364.6666666666667, 230, 615, 249.0, 615.0, 615.0, 615.0, 0.019572408123854197, 0.02313392379482897, 0.012551316407549732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 547.5333333333334, 285, 1476, 581.0, 1020.6000000000003, 1476.0, 1476.0, 0.07680845507473462, 6.237076577389639, 0.17143387144056818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b8faef9-012e-46dc-a3d1-43124114163e", 3, 0, 0.0, 335.0, 228, 430, 347.0, 430.0, 430.0, 430.0, 0.03049803287687944, 0.025424955142476644, 0.01955765780190511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd44b7a6-f49b-418c-9a61-a969800b3cec", 3, 0, 0.0, 443.0, 261, 576, 492.0, 576.0, 576.0, 576.0, 0.02135778562478642, 0.021420357262359038, 0.013696236224228272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fea7fce6-6466-40ce-b041-7fbf01f0712e", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac0e5024-7e72-4928-b61e-697ac400ad83", 3, 0, 0.0, 687.6666666666666, 231, 1383, 449.0, 1383.0, 1383.0, 1383.0, 0.06587036711751273, 0.029804625746530828, 0.042241088288248727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 208.33333333333334, 150, 445, 159.5, 444.7, 445.0, 445.0, 0.06736690825188486, 0.05585400889243189, 0.023946830667662202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 980.6875, 288, 1504, 1391.0, 1492.8, 1504.0, 1504.0, 0.08259684480052862, 55.639183628595546, 0.17387482770814405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9ef13fe-5909-493c-8d81-61c736a42bca", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 156.18750000000003, 146, 172, 154.5, 169.9, 172.0, 172.0, 0.08409854246713586, 0.06529134888805958, 0.029894403767614704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac0e5024-7e72-4928-b61e-697ac400ad83", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 496.0000000000001, 292, 910, 573.0, 907.6, 910.0, 910.0, 0.08140748757338645, 0.12616570583883233, 0.18308734754053616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 785.0, 143, 1649, 1181.0, 1512.9999999999998, 1649.0, 1649.0, 0.0943207794225349, 59.7509350587563, 0.14200673873421515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9ef13fe-5909-493c-8d81-61c736a42bca", 3, 0, 0.0, 361.3333333333333, 252, 549, 283.0, 549.0, 549.0, 549.0, 0.029967036260113874, 0.02468963827289981, 0.019217142393367297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1f90997-e6c7-40b3-b140-914aadbab08d", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 147.46153846153848, 138, 160, 150.0, 158.0, 160.0, 160.0, 0.10832520894266262, 0.08050340234899049, 0.054374177145047456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1f90997-e6c7-40b3-b140-914aadbab08d", 3, 0, 0.0, 613.0, 265, 1025, 549.0, 1025.0, 1025.0, 1025.0, 0.024616596509366612, 0.02468871544445265, 0.015786033568832108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 212.84615384615387, 137, 444, 148.0, 440.8, 444.0, 444.0, 0.10807844832603111, 0.041406256495099054, 0.06094026691219873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 297.6923076923077, 137, 958, 150.0, 754.3999999999999, 958.0, 958.0, 0.10833875027084688, 7.525677390640365, 0.06297515396603164], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 916.7083333333334, 353, 1903, 828.0, 1743.5, 1895.75, 1903.0, 0.09795198720094034, 0.030323027287791102, 0.04419318172542425], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 304.3076923076923, 139, 754, 151.0, 634.8, 754.0, 754.0, 0.10807844832603111, 2.471401429337479, 0.062929390998728], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 25.0, 0.7898894154818326], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.0, 0.315955766192733], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.0, 0.315955766192733], "isController": false}, {"data": ["401/Unauthorized", 22, 55.0, 1.7377567140600316], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1266, 40, "401/Unauthorized", 22, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
