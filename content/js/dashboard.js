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

    var data = {"OkPercent": 98.11320754716981, "KoPercent": 1.8867924528301887};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7168918918918918, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96aae727-7654-43c1-a8f9-efe0367cf4a5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/917bdd61-0ea2-4657-adbd-ef9037631f27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=302d0d3f-dc9c-4693-b020-b09c1ec554af"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33615992-57d9-40ca-b792-50c1c88f182a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d6bca362-aaf8-4ab3-b6ce-06e5961ad8ac"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ca173cf-7a7e-4a15-9f3f-074e71c590ba"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90256ec1-100b-4a1c-902c-84bef0895a98"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5961927e-160c-4415-b62a-886109b83126"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd21c8b3-0174-4d97-a678-a760921a1caa"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b7f5712e-80c6-4ab4-806c-63ef585e2f4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea8c96bf-654e-4f7c-9444-f7bdb8229b6d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc4bfbcd-7398-4c0a-a291-a84f0c5dbf90"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ce1d03d-3ef6-41f4-8699-ab77dbb39256"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=917bdd61-0ea2-4657-adbd-ef9037631f27"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33615992-57d9-40ca-b792-50c1c88f182a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/944fe8cc-9889-40a7-9e07-e3d1fc239d3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6bca362-aaf8-4ab3-b6ce-06e5961ad8ac"], "isController": false}, {"data": [0.2818181818181818, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/302d0d3f-dc9c-4693-b020-b09c1ec554af"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9212121212121213, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5961927e-160c-4415-b62a-886109b83126"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea8c96bf-654e-4f7c-9444-f7bdb8229b6d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd21c8b3-0174-4d97-a678-a760921a1caa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90256ec1-100b-4a1c-902c-84bef0895a98"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7f5712e-80c6-4ab4-806c-63ef585e2f4d"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=944fe8cc-9889-40a7-9e07-e3d1fc239d3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/cc4bfbcd-7398-4c0a-a291-a84f0c5dbf90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3747d8c2-c1da-44a4-aec9-28db14c1f766"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/48e8bfea-a88d-4002-8264-39ad42483cf4"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 24, 1.8867924528301887, 505.7665094339629, 140, 3892, 165.0, 1402.0, 1692.849999999999, 2320.7, 5.020405263531808, 720.9601719325995, 3.6707643290733563], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2352.763636363636, 1707, 3066, 2319.0, 2832.7999999999997, 2961.7999999999997, 3066.0, 0.25030149953352904, 301.19630072871865, 1.230730517725897], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/96aae727-7654-43c1-a8f9-efe0367cf4a5", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.9419939159292035, 1.7601170722713864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/917bdd61-0ea2-4657-adbd-ef9037631f27", 3, 0, 0.0, 449.33333333333337, 274, 758, 316.0, 758.0, 758.0, 758.0, 0.02246030141724502, 0.022526103081553357, 0.01440325318749111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=302d0d3f-dc9c-4693-b020-b09c1ec554af", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 643.8461538461538, 159, 1134, 648.0, 1086.3999999999999, 1134.0, 1134.0, 0.07904128995385204, 0.015669318223273405, 0.05314149226915383], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 643.8461538461538, 159, 1134, 648.0, 1086.3999999999999, 1134.0, 1134.0, 0.07809824759547511, 0.015482367443243602, 0.05250746063547943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 187.54999999999998, 141, 450, 146.0, 420.9, 448.54999999999995, 450.0, 0.09446617166392715, 0.025277081089761757, 0.05387523852708345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33615992-57d9-40ca-b792-50c1c88f182a", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 174.95, 141, 451, 145.5, 405.00000000000057, 450.09999999999997, 451.0, 0.09446572547315521, 0.07020353230963976, 0.04741736610664236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 257.8, 141, 459, 146.0, 432.9, 457.7, 459.0, 0.09446661785891411, 0.02546170559478544, 0.05562829157121602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 186.25, 140, 438, 143.5, 425.7, 437.4, 438.0, 0.0944675102615333, 0.025461946125178898, 0.05553656364984673], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 356.1538461538462, 146, 1188, 267.0, 947.5999999999998, 1188.0, 1188.0, 0.07912837056424615, 0.15546299607401548, 0.05114336691216751], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 168.58823529411765, 141, 536, 145.0, 231.19999999999973, 536.0, 536.0, 0.10092554663057093, 0.07500423924400829, 0.050659893523548306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 146.58823529411765, 140, 158, 147.0, 153.2, 158.0, 158.0, 0.1009249474596597, 0.03592204586742024, 0.057060163884304384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 973.5714285714287, 760, 1208, 894.0, 1208.0, 1208.0, 1208.0, 0.06337651990475415, 18.63480115051018, 0.0361444215081801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1531.2857142857142, 1248, 1683, 1581.0, 1683.0, 1683.0, 1683.0, 0.06285129383877745, 56.5537046769219, 0.035783500300788335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 267.71428571428567, 141, 437, 145.0, 437.0, 437.0, 437.0, 0.06356240011622838, 0.11247565333066976, 0.03519519615810693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 153.0, 143, 183, 149.0, 183.0, 183.0, 183.0, 0.04295209767307011, 0.03192045539961558, 0.02155993965230277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 180.625, 141, 427, 145.5, 427.0, 427.0, 427.0, 0.04289015295700799, 0.011476466709199402, 0.024460790358293617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 181.87500000000003, 140, 448, 143.0, 448.0, 448.0, 448.0, 0.04295555710672845, 0.011577865001422903, 0.02525316931469778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 180.875, 141, 428, 147.0, 428.0, 428.0, 428.0, 0.04295601840665389, 0.01157798933616843, 0.025295389745324505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 146.99999999999997, 142, 153, 146.0, 153.0, 153.0, 153.0, 0.06373312210355721, 0.04736416593828813, 0.03578764180619668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 253.64705882352942, 142, 1138, 144.0, 586.7999999999995, 1138.0, 1138.0, 0.10075268179932437, 5.358349183977361, 0.05872223745036449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1213.5714285714284, 142, 1806, 1538.0, 1768.0, 1806.0, 1806.0, 0.0769454841244978, 49.459983968545785, 0.04051231265148642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 284.11764705882354, 140, 1117, 149.0, 560.9999999999995, 1117.0, 1117.0, 0.10076163945114543, 1.7683413041223364, 0.058825858326171356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 851.2142857142857, 141, 1327, 1121.0, 1309.0, 1327.0, 1327.0, 0.07694590702735978, 16.166390886581734, 0.0405876778000066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6bca362-aaf8-4ab3-b6ce-06e5961ad8ac", 3, 0, 0.0, 596.6666666666666, 274, 929, 587.0, 929.0, 929.0, 929.0, 0.01686207943163551, 0.023245737758130335, 0.010813247552188137], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 646.1538461538462, 180, 1353, 553.0, 1225.8, 1353.0, 1353.0, 0.07849198777940129, 0.015560423358611778, 0.05325568161234618], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 375.12499999999994, 291, 601, 306.0, 601.0, 601.0, 601.0, 0.04285362273813222, 0.06641474539591391, 0.0963788019198423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ca173cf-7a7e-4a15-9f3f-074e71c590ba", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.7621382756563246, 1.4240565334128878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 753.1304347826085, 308, 1850, 610.0, 1333.6000000000004, 1762.7999999999988, 1850.0, 0.10145745844655397, 0.062321036487189896, 0.04587383130933056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 146.57142857142858, 140, 159, 145.0, 156.5, 159.0, 159.0, 0.07694632993487042, 0.05718374714886367, 0.03862345076808926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 268.6428571428571, 142, 442, 148.5, 439.0, 442.0, 442.0, 0.07694421544380324, 0.10313616378125859, 0.039266453696070354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90256ec1-100b-4a1c-902c-84bef0895a98", 3, 0, 0.0, 398.66666666666663, 255, 677, 264.0, 677.0, 677.0, 677.0, 0.02551367532997687, 0.030156300495815757, 0.01636130872397605], "isController": false}, {"data": ["login", 23, 0, 0.0, 3410.9130434782605, 1731, 4847, 3742.0, 4639.6, 4842.0, 4847.0, 0.09843151520338947, 35.97276098394069, 0.19818787714249034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 155.8823529411765, 144, 207, 151.0, 173.39999999999998, 207.0, 207.0, 0.09598446180947649, 0.0777061707422422, 0.03411947665883735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5961927e-160c-4415-b62a-886109b83126", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd21c8b3-0174-4d97-a678-a760921a1caa", 1, 0, 0.0, 1353.0, 1353, 1353, 1353.0, 1353.0, 1353.0, 1353.0, 0.7390983000739099, 0.13352850147819662, 0.5095736326681448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1361.7857142857142, 293, 1957, 1680.5, 1915.5, 1957.0, 1957.0, 0.07688463460577404, 65.73458205649922, 0.1588641633853403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7f5712e-80c6-4ab4-806c-63ef585e2f4d", 3, 0, 0.0, 873.3333333333334, 242, 1887, 491.0, 1887.0, 1887.0, 1887.0, 0.02931519699812383, 0.024438873539126018, 0.018799133491635398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea8c96bf-654e-4f7c-9444-f7bdb8229b6d", 3, 0, 0.0, 399.6666666666667, 291, 495, 413.0, 495.0, 495.0, 495.0, 0.03134599711616826, 0.026131868038576474, 0.020101436952751132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc4bfbcd-7398-4c0a-a291-a84f0c5dbf90", 1, 0, 0.0, 1035.0, 1035, 1035, 1035.0, 1035.0, 1035.0, 1035.0, 0.966183574879227, 0.1745546497584541, 0.6661382850241546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 465.6, 287, 884, 432.5, 845.3000000000006, 883.4, 884.0, 0.0943997356807401, 0.146301152856772, 0.21230721803978947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 1151.0, 146, 1831, 1493.0, 1829.6, 1831.0, 1831.0, 0.09864055382187309, 75.1058494408874, 0.1653087477357509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ce1d03d-3ef6-41f4-8699-ab77dbb39256", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1441.7391304347827, 526, 3892, 1295.0, 2605.800000000001, 3685.399999999997, 3892.0, 0.10079275694484006, 0.031600446555736204, 0.04547485713722276], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 473.8235294117647, 285, 1283, 296.0, 1022.9999999999998, 1283.0, 1283.0, 0.10066557710983207, 7.231012880752742, 0.22488416981986784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 156.14999999999998, 144, 177, 156.0, 164.70000000000002, 176.39999999999998, 177.0, 0.09946784701845128, 0.07722357263639529, 0.035357711244840107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=917bdd61-0ea2-4657-adbd-ef9037631f27", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 573.0555555555557, 291, 1772, 435.5, 1442.6000000000006, 1772.0, 1772.0, 0.10955569080949483, 14.71389036822885, 0.24327877738892267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 145.1111111111111, 140, 152, 143.0, 152.0, 152.0, 152.0, 0.04971029942170352, 0.03694290806632459, 0.024952240139409772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 175.33333333333334, 141, 424, 144.0, 424.0, 424.0, 424.0, 0.04971057399142769, 0.013301462181299987, 0.028350561729486103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 175.88888888888886, 141, 424, 145.0, 424.0, 424.0, 424.0, 0.049633265317377155, 0.013377716042574312, 0.02917893136822368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33615992-57d9-40ca-b792-50c1c88f182a", 3, 0, 0.0, 347.6666666666667, 241, 526, 276.0, 526.0, 526.0, 526.0, 0.027700063710146532, 0.023092403372944426, 0.01776338720995725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 240.55555555555557, 141, 432, 152.0, 432.0, 432.0, 432.0, 0.049633265317377155, 0.013377716042574312, 0.029227401353885178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 190.5, 180, 201, 190.5, 201.0, 201.0, 201.0, 0.13946028868279758, 0.041129889826371946, 0.08620933860958092], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1618.981818181818, 1123, 2455, 1482.0, 2159.5999999999995, 2351.9999999999995, 2455.0, 0.2511140331653152, 300.4196850288096, 0.49585212408229234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1441.7391304347827, 526, 3892, 1295.0, 2605.800000000001, 3685.399999999997, 3892.0, 0.09934690210442655, 0.03114714356059297, 0.044822528097895574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 143.25, 140, 147, 143.0, 147.0, 147.0, 147.0, 0.02684870085848721, 0.007236563903264131, 0.015810318962566197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 145.5, 142, 154, 143.0, 154.0, 154.0, 154.0, 0.02684834043695674, 0.0072364667583984955, 0.01578388763969527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 229.60000000000002, 141, 1539, 146.0, 402.3000000000006, 1483.5499999999993, 1539.0, 0.09726301865504698, 4.400776409645087, 0.056762089793218826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 253.60000000000002, 140, 869, 149.5, 451.1, 848.1999999999997, 869.0, 0.09726491071081196, 1.4548607987151305, 0.05685817924950395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 162.95, 141, 425, 148.0, 171.60000000000002, 412.3999999999998, 425.0, 0.09726018070941576, 0.07228027101549356, 0.04882005164515596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/944fe8cc-9889-40a7-9e07-e3d1fc239d3e", 3, 0, 0.0, 470.0, 262, 883, 265.0, 883.0, 883.0, 883.0, 0.031164945669111387, 0.0256765877241279, 0.019985332997444476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 144.75, 142, 150, 143.5, 150.0, 150.0, 150.0, 0.02684870085848721, 0.007184125034399897, 0.015312149708355987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 233.84999999999997, 140, 453, 148.0, 450.3, 452.95, 453.0, 0.09712604046270845, 0.03328274179527773, 0.05498434146116415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 144.25, 142, 149, 143.0, 149.0, 149.0, 149.0, 0.026848881072881286, 0.019953123531701818, 0.013476879757286115], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 779.0769230769231, 146, 2542, 677.0, 1896.7999999999993, 2542.0, 2542.0, 0.07615075506402522, 0.01477594653924107, 0.051821641385592275], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 162.75, 145, 194, 156.0, 194.0, 194.0, 194.0, 0.02624499704743783, 0.020657683222885637, 0.009329276294206417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1831.478260869565, 986, 3833, 1500.0, 3236.000000000001, 3767.999999999999, 3833.0, 0.10064852659309113, 0.05209347567806475, 0.04629439064975188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 292.25, 286, 297, 293.0, 297.0, 297.0, 297.0, 0.026822775218437973, 0.04157006276529401, 0.06032505012506119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6bca362-aaf8-4ab3-b6ce-06e5961ad8ac", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["addBook", 55, 9, 16.363636363636363, 1455.7272727272727, 771, 3833, 1159.0, 2525.4, 2581.3999999999996, 3833.0, 0.2625561512132481, 80.99245628440082, 0.9543580442430983], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/302d0d3f-dc9c-4693-b020-b09c1ec554af", 3, 0, 0.0, 475.0, 272, 602, 551.0, 602.0, 602.0, 602.0, 0.040581670612106865, 0.026090103990530945, 0.026024053094352385], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 253.8545454545455, 142, 653, 150.0, 586.0, 593.8, 653.0, 0.2529282189714559, 0.18796716273171674, 0.12226510585045963], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 948.5090909090908, 698, 1313, 865.0, 1166.0, 1263.2, 1313.0, 0.25232251404977635, 74.19119702660856, 0.1269004831402684], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 224.8545454545455, 141, 576, 149.0, 438.59999999999997, 472.99999999999983, 576.0, 0.2534608932883556, 0.4485069713266604, 0.12326516099375104], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1360.2545454545455, 978, 1868, 1312.0, 1725.4, 1802.3999999999999, 1868.0, 0.2518084424503251, 226.57767914883024, 0.12639603458932333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 185.5, 146, 446, 152.0, 428.0, 446.0, 446.0, 0.1073262060782408, 0.08018022231431075, 0.03815111231687466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, 5.454545454545454, 226.98181818181817, 142, 1968, 155.0, 366.4, 456.69999999999965, 1734.3600000000013, 0.7086654755360088, 1.572938722984813, 0.33859999511450317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 155.22222222222223, 144, 180, 151.0, 180.0, 180.0, 180.0, 0.05297982057500765, 0.04102831808201276, 0.01883267059502225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 172.35, 144, 444, 150.0, 268.0000000000002, 435.7499999999999, 444.0, 0.09431915716401158, 0.07654220664384144, 0.03352751289814474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5961927e-160c-4415-b62a-886109b83126", 3, 0, 0.0, 451.33333333333337, 264, 793, 297.0, 793.0, 793.0, 793.0, 0.021010757507844015, 0.024834004072585163, 0.01347369540704841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea8c96bf-654e-4f7c-9444-f7bdb8229b6d", 1, 0, 0.0, 890.0, 890, 890, 890.0, 890.0, 890.0, 890.0, 1.1235955056179776, 0.2029933286516854, 0.7746664325842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd21c8b3-0174-4d97-a678-a760921a1caa", 3, 0, 0.0, 553.0, 267, 852, 540.0, 852.0, 852.0, 852.0, 0.10230179028132992, 0.04628889599317988, 0.06560368712702472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90256ec1-100b-4a1c-902c-84bef0895a98", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.2491918103448276, 0.950969827586207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7f5712e-80c6-4ab4-806c-63ef585e2f4d", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.2519721931659693, 0.9615803695955369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 418.3333333333333, 290, 584, 301.0, 584.0, 584.0, 584.0, 0.04959388121714405, 0.07686082958164807, 0.111537801213948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 485.05000000000007, 290, 1687, 310.0, 850.7000000000006, 1646.5999999999995, 1687.0, 0.09705486997073795, 5.948463598661128, 0.21703705736913365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=944fe8cc-9889-40a7-9e07-e3d1fc239d3e", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.2622119920174166, 1.000657656023222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 191.5, 148, 427, 161.0, 427.0, 427.0, 427.0, 0.04177807486631016, 0.03463826714989973, 0.01485080005013369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc4bfbcd-7398-4c0a-a291-a84f0c5dbf90", 3, 0, 0.0, 1416.3333333333335, 519, 2542, 1188.0, 2542.0, 2542.0, 2542.0, 0.02486036760196894, 0.024933200710177832, 0.015942358130168883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 174.92857142857142, 145, 432, 154.0, 312.5, 432.0, 432.0, 0.07419773696902245, 0.05760468836950473, 0.026374976813207197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3747d8c2-c1da-44a4-aec9-28db14c1f766", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.0898837457337884, 2.0364494453924915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 178.11111111111111, 142, 442, 147.0, 422.20000000000005, 442.0, 442.0, 0.10965313059687855, 0.0814902660002193, 0.0550407315691363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 226.55555555555551, 141, 468, 146.0, 439.20000000000005, 468.0, 468.0, 0.10965246261155615, 0.04763980688982973, 0.061512937467637294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48e8bfea-a88d-4002-8264-39ad42483cf4", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.6094197280534351, 1.13870169370229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 335.6111111111111, 140, 1330, 147.0, 1268.8000000000002, 1330.0, 1330.0, 0.10965446659193917, 10.989302692778645, 0.063417785040694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 343.94444444444446, 142, 1155, 145.5, 1146.9, 1155.0, 1155.0, 0.1096537985903395, 3.6086998486168396, 0.06352448249498943], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.550314465408805], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15723270440251572], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.15723270440251572], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 1.0220125786163523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 24, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
