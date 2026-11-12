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

    var data = {"OkPercent": 98.4423676012461, "KoPercent": 1.557632398753894};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7700267022696929, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4319cd1-2d39-4dfc-bbea-9d29ca5e55fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de0b917a-83fb-4915-8273-6260530bb445"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4111d492-c005-4299-bfcd-34f0e135e5d8"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99443ad2-d816-42d9-b1ce-f5a58ff5766c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a88652cd-8f9b-430c-a7d3-5dfe71c2c58b"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1794986f-73aa-4a7a-9999-cfa18dfe1091"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cba68a15-127a-45a2-b4f7-9277650f1d33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebe06ff3-7ece-4b26-8b83-2d90648dd437"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1794986f-73aa-4a7a-9999-cfa18dfe1091"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.125, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0af859c3-3513-4e4f-85e9-cd65600f5765"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8e2c984-012f-46d7-9bd8-6df3e3a137fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b43c1aa-2296-4336-957d-ab710f3f36e7"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/deb5d1c6-b43a-4b9f-84f0-9b01d2f6e0de"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc2a0236-f8f5-4c4b-b561-3e5d6583f66b"], "isController": false}, {"data": [0.4782608695652174, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d4a0ed0-4761-4c45-b3f2-f02c966dc4e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99443ad2-d816-42d9-b1ce-f5a58ff5766c"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5117fa8c-ba4d-4328-b28c-78ff9b2a865d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc2a0236-f8f5-4c4b-b561-3e5d6583f66b"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/de0b917a-83fb-4915-8273-6260530bb445"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4319cd1-2d39-4dfc-bbea-9d29ca5e55fd"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9421965317919075, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8e2c984-012f-46d7-9bd8-6df3e3a137fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebe06ff3-7ece-4b26-8b83-2d90648dd437"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f6e56f9-0f9c-4556-a84d-4b46e483e5ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cba68a15-127a-45a2-b4f7-9277650f1d33"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d4a0ed0-4761-4c45-b3f2-f02c966dc4e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b43c1aa-2296-4336-957d-ab710f3f36e7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0af859c3-3513-4e4f-85e9-cd65600f5765"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9faf9843-2da2-4819-8102-c3da86e57a12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=deb5d1c6-b43a-4b9f-84f0-9b01d2f6e0de"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 20, 1.557632398753894, 383.3014018691585, 125, 2128, 142.0, 967.5, 1133.0, 1598.750000000004, 4.954410930572651, 695.6361229467554, 3.6100892584975477], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/d4319cd1-2d39-4dfc-bbea-9d29ca5e55fd", 3, 0, 0.0, 552.0, 249, 943, 464.0, 943.0, 943.0, 943.0, 0.02983412228012252, 0.02487148019511516, 0.019131907842396278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de0b917a-83fb-4915-8273-6260530bb445", 1, 0, 0.0, 1429.0, 1429, 1429, 1429.0, 1429.0, 1429.0, 1429.0, 0.6997900629811056, 0.1264269156752974, 0.48247244576627013], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1905.1454545454544, 1523, 2512, 2022.0, 2181.2, 2365.3999999999996, 2512.0, 0.24393164591769304, 293.5334353018432, 1.1994099972613128], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4111d492-c005-4299-bfcd-34f0e135e5d8", 2, 0, 0.0, 240.5, 223, 258, 240.5, 258.0, 258.0, 258.0, 0.025490371012350084, 0.029000275614636573, 0.015844356591172684], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 466.7142857142857, 132, 675, 498.5, 636.5, 675.0, 675.0, 0.06938971743515779, 0.013668845008153293, 0.046688979797679414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 466.7142857142857, 132, 675, 498.5, 636.5, 675.0, 675.0, 0.06869412468964976, 0.013531822553262482, 0.04622094913200067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99443ad2-d816-42d9-b1ce-f5a58ff5766c", 3, 0, 0.0, 327.6666666666667, 233, 449, 301.0, 449.0, 449.0, 449.0, 0.03738038277511962, 0.030383729098135966, 0.023971143902013558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 216.85, 125, 383, 130.5, 382.0, 382.95, 383.0, 0.09488836383994231, 0.03251594421038648, 0.05371756300587359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 143.45000000000002, 127, 389, 130.0, 136.9, 376.3999999999998, 389.0, 0.09488611294294023, 0.0705159491695093, 0.0476283809108118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 206.70000000000002, 126, 889, 129.5, 410.70000000000005, 865.2499999999997, 889.0, 0.09488881403215782, 1.4193198221546404, 0.05546918367153288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 217.79999999999998, 126, 882, 128.0, 399.70000000000005, 857.9499999999996, 882.0, 0.09488836383994231, 4.29333243930703, 0.05537625608471633], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 241.00000000000003, 130, 358, 233.0, 333.40000000000003, 358.0, 358.0, 0.06979990693345743, 0.13203361301768263, 0.04511546067938576], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 191.35294117647055, 126, 415, 129.0, 391.0, 415.0, 415.0, 0.09804430449100587, 0.07286300363052292, 0.04921364502771194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 886.6666666666666, 627, 1147, 886.0, 1147.0, 1147.0, 1147.0, 0.015650105377376208, 4.601650613353713, 0.008925450723034868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 191.70588235294116, 126, 383, 136.0, 382.2, 383.0, 383.0, 0.0980460008766466, 0.034897347278935106, 0.05543248739820518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1052.3333333333333, 901, 1135, 1121.0, 1135.0, 1135.0, 1135.0, 0.015609877930754584, 14.045795601331521, 0.008887264485966719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 382.3333333333333, 379, 386, 382.0, 386.0, 386.0, 386.0, 0.015670460659308515, 0.027729369838542017, 0.008676905462722585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 130.8235294117647, 128, 139, 129.0, 137.4, 139.0, 139.0, 0.09189487226612754, 0.06829296659621394, 0.04612691830545856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 187.47058823529412, 126, 381, 128.0, 380.2, 381.0, 381.0, 0.09189536901396268, 0.04082713602676858, 0.051501104095830655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 264.4117647058824, 126, 903, 131.0, 891.0, 903.0, 903.0, 0.09189487226612754, 9.749756664405332, 0.05309504970431474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 282.3529411764706, 126, 1031, 131.0, 929.3999999999999, 1031.0, 1031.0, 0.09189387878656836, 3.2006604196847497, 0.053184215807368804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 212.0, 128, 378, 130.0, 378.0, 378.0, 378.0, 0.01569078689296268, 0.0116608289311959, 0.00881074459321635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 638.0, 125, 1206, 871.0, 1161.2, 1206.0, 1206.0, 0.08431494110353378, 40.17543494265344, 0.045731943583385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 235.64705882352942, 126, 939, 129.0, 499.7999999999996, 939.0, 939.0, 0.09790314499455774, 5.2068017220155385, 0.05706142630484736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 491.29411764705884, 126, 910, 626.0, 894.8, 910.0, 910.0, 0.08431452292859055, 13.135483906465435, 0.04581405516897622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 273.2352941176471, 126, 876, 137.0, 598.3999999999997, 876.0, 876.0, 0.09790258117275774, 1.718165553984635, 0.057156705678925605], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 491.2857142857144, 130, 1429, 465.0, 1019.0, 1429.0, 1429.0, 0.06887865548864486, 0.013568172649269886, 0.04678713359015232], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a88652cd-8f9b-430c-a7d3-5dfe71c2c58b", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.6082589285714285, 1.1365327380952381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 445.4117647058824, 258, 1161, 268.0, 1061.0, 1161.0, 1161.0, 0.09182934865983168, 13.05025973019727, 0.20376219270928989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1794986f-73aa-4a7a-9999-cfa18dfe1091", 3, 0, 0.0, 346.0, 220, 580, 238.0, 580.0, 580.0, 580.0, 0.019429674293893254, 0.022965217239950004, 0.012459784622060453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cba68a15-127a-45a2-b4f7-9277650f1d33", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebe06ff3-7ece-4b26-8b83-2d90648dd437", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1794986f-73aa-4a7a-9999-cfa18dfe1091", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 451.1, 153, 722, 473.0, 712.4000000000001, 721.6, 722.0, 0.09144905601711927, 0.05617329710426564, 0.04134854778899045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 144.64705882352942, 126, 377, 129.0, 185.79999999999984, 377.0, 377.0, 0.08431201396603713, 0.0626576588165569, 0.04232067888529598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 233.23529411764702, 125, 412, 128.0, 389.59999999999997, 412.0, 412.0, 0.08431326842864866, 0.08960222115866269, 0.04433614770196748], "isController": false}, {"data": ["login", 20, 0, 0.0, 1981.1000000000001, 1332, 3036, 1815.0, 2793.9, 3024.1499999999996, 3036.0, 0.09623527600277157, 17.404671252778794, 0.16913537717010546], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0af859c3-3513-4e4f-85e9-cd65600f5765", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 133.35294117647058, 129, 140, 131.0, 139.2, 140.0, 140.0, 0.09975472074546117, 0.08075846044725322, 0.03545968588998814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8e2c984-012f-46d7-9bd8-6df3e3a137fc", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b43c1aa-2296-4336-957d-ab710f3f36e7", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 786.2941176470588, 256, 1344, 1014.0, 1297.6, 1344.0, 1344.0, 0.08425810736465421, 53.42721013352432, 0.178085279427144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/deb5d1c6-b43a-4b9f-84f0-9b01d2f6e0de", 3, 0, 0.0, 313.3333333333333, 239, 453, 248.0, 453.0, 453.0, 453.0, 0.04534461910519952, 0.029152220941656593, 0.029078417850665055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 428.7, 255, 1017, 390.0, 751.9000000000005, 1004.8999999999999, 1017.0, 0.09482852631728678, 5.8120116701318585, 0.21205843985737788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 653.0000000000001, 130, 1500, 138.0, 1500.0, 1500.0, 1500.0, 0.0328310187465117, 16.8381537769742, 0.04415790342286821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc2a0236-f8f5-4c4b-b561-3e5d6583f66b", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 794.6956521739131, 250, 1449, 769.0, 1353.4, 1433.3999999999999, 1449.0, 0.09528504729038326, 0.030310613718561114, 0.04298993344546588], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d4a0ed0-4761-4c45-b3f2-f02c966dc4e3", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99443ad2-d816-42d9-b1ce-f5a58ff5766c", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 515.7058823529412, 256, 1076, 511.0, 855.1999999999998, 1076.0, 1076.0, 0.09782933959441106, 7.027280178912599, 0.2185480921120779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 133.86666666666667, 128, 144, 132.0, 141.6, 144.0, 144.0, 0.09609101741169235, 0.07460191293192912, 0.03415735384556252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5117fa8c-ba4d-4328-b28c-78ff9b2a865d", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.6765591896186441, 1.2641518802966103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc2a0236-f8f5-4c4b-b561-3e5d6583f66b", 3, 0, 0.0, 343.0, 275, 439, 315.0, 439.0, 439.0, 439.0, 0.03176485536402524, 0.03185791646372453, 0.02037004071195629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 540.7333333333333, 256, 1269, 509.0, 1177.2, 1269.0, 1269.0, 0.16460544075850186, 26.47780321350972, 0.36458604818001256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 171.83333333333334, 128, 379, 128.5, 379.0, 379.0, 379.0, 0.07031442265999462, 0.052255151996343646, 0.03529454418675511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 213.16666666666666, 126, 381, 133.0, 381.0, 381.0, 381.0, 0.07010738113877756, 0.03630886829159997, 0.03900179504107124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 295.0, 126, 1124, 127.5, 1124.0, 1124.0, 1124.0, 0.07030618342883256, 10.55939600031052, 0.04032535651093847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 340.1666666666667, 130, 888, 256.0, 888.0, 888.0, 888.0, 0.07010738113877756, 3.451396414883797, 0.040279794176413544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 131.5, 130, 133, 131.5, 133.0, 133.0, 133.0, 0.02161811598119224, 0.00637565529914068, 0.013363542398529969], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1227.3272727272727, 1004, 1972, 1051.0, 1655.0, 1820.1999999999996, 1972.0, 0.24213714647976614, 289.68020768213114, 0.47812627947469444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 794.6956521739131, 250, 1449, 769.0, 1353.4, 1433.3999999999999, 1449.0, 0.09117432530999271, 0.0290029740668506, 0.041135291301969364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de0b917a-83fb-4915-8273-6260530bb445", 3, 0, 0.0, 748.0, 220, 1308, 716.0, 1308.0, 1308.0, 1308.0, 0.06346385733324872, 0.02871574273867699, 0.04069785121956379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 203.71428571428572, 126, 393, 131.0, 393.0, 393.0, 393.0, 0.04398697985396323, 0.011855865663763525, 0.025902489113222484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 128.14285714285714, 127, 132, 127.0, 132.0, 132.0, 132.0, 0.044060627423334504, 0.011875715985195628, 0.02590282979379626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 247.8, 126, 1164, 128.0, 700.8000000000003, 1164.0, 1164.0, 0.0964499971065001, 5.809988331559725, 0.056149470971765876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 213.5333333333333, 127, 624, 128.0, 492.0000000000001, 624.0, 624.0, 0.09661462358942649, 1.918165099094399, 0.056339660383495645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 203.28571428571428, 127, 384, 131.0, 384.0, 384.0, 384.0, 0.04399029699734801, 0.011770841188743511, 0.025088216256300037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 164.13333333333333, 127, 395, 130.0, 386.6, 395.0, 395.0, 0.0966121344840912, 0.07179866634999356, 0.048494762817209845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 131.42857142857142, 127, 141, 130.0, 141.0, 141.0, 141.0, 0.044059795436664044, 0.032743656569630214, 0.022115952006294258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 146.53333333333336, 127, 379, 129.0, 235.00000000000009, 379.0, 379.0, 0.09645806003549658, 0.035468432492219044, 0.05447117270494122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 135.42857142857142, 128, 145, 133.0, 145.0, 145.0, 145.0, 0.04681303542409266, 0.03684697905451043, 0.016640571185907938], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 490.2142857142857, 130, 867, 458.5, 810.0, 867.0, 867.0, 0.06929320926549198, 0.01337915759255593, 0.04715573030093051], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 991.1, 786, 1862, 868.0, 1449.2000000000005, 1842.4999999999998, 1862.0, 0.09368427462608264, 0.048488931202952924, 0.04309110678602043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 374.8571428571429, 262, 523, 282.0, 523.0, 523.0, 523.0, 0.043950800218498266, 0.06811515619800464, 0.09884637978828271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4319cd1-2d39-4dfc-bbea-9d29ca5e55fd", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1220.1525423728813, 650, 2684, 1019.0, 1857.0, 1987.0, 2684.0, 0.25732840774776583, 89.68050899504534, 0.9337099260071791], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 234.69090909090914, 127, 565, 133.0, 514.0, 526.8, 565.0, 0.2433628318584071, 0.18085851078539822, 0.11764121266592921], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 734.127272727273, 622, 1093, 640.0, 911.1999999999999, 985.9999999999995, 1093.0, 0.24327241202384955, 71.53016653931725, 0.12234891815652589], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 176.5454545454546, 127, 511, 130.0, 383.4, 417.39999999999986, 511.0, 0.2435298545462596, 0.4309336879275609, 0.11843541754300516], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 990.0000000000001, 872, 1433, 915.0, 1143.8, 1297.9999999999995, 1433.0, 0.2427130910615388, 218.393665981278, 0.12183059453674898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 131.8, 128, 140, 131.0, 138.8, 140.0, 140.0, 0.16179833455580964, 0.12087473235858825, 0.057514251736635456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 8, 4.624277456647399, 200.35260115606945, 127, 2128, 136.0, 303.1999999999999, 380.29999999999995, 1587.7999999999934, 0.708041385632899, 1.5063905019624615, 0.3411230142610995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 133.0, 130, 140, 131.5, 140.0, 140.0, 140.0, 0.06498922262058208, 0.050328567908321874, 0.023101637728410042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 145.34999999999997, 129, 385, 131.5, 140.9, 372.79999999999984, 385.0, 0.09278503562945369, 0.07529723106257423, 0.032982180633907364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 553.3333333333334, 259, 1252, 394.0, 1252.0, 1252.0, 1252.0, 0.07000186671644577, 14.048169214199879, 0.15445073326955386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8e2c984-012f-46d7-9bd8-6df3e3a137fc", 3, 0, 0.0, 338.0, 223, 487, 304.0, 487.0, 487.0, 487.0, 0.027636269840538723, 0.02303922104870432, 0.017722477729772555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebe06ff3-7ece-4b26-8b83-2d90648dd437", 3, 0, 0.0, 297.3333333333333, 226, 437, 229.0, 437.0, 437.0, 437.0, 0.02413612776056961, 0.02895235377529265, 0.015477920471459029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f6e56f9-0f9c-4556-a84d-4b46e483e5ba", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 434.2, 256, 1292, 269.0, 988.4000000000002, 1292.0, 1292.0, 0.09636882275846119, 7.825437012534373, 0.21509194991069824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 134.0, 128, 142, 133.0, 141.2, 142.0, 142.0, 0.09112984931411387, 0.07555590045672136, 0.03239381362337641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 151.58823529411768, 130, 420, 133.0, 202.3999999999998, 420.0, 420.0, 0.08161854373313616, 0.06336595924594068, 0.02901284171763825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cba68a15-127a-45a2-b4f7-9277650f1d33", 3, 0, 0.0, 329.6666666666667, 229, 443, 317.0, 443.0, 443.0, 443.0, 0.020435410479278493, 0.02415396336271491, 0.013104739141985232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d4a0ed0-4761-4c45-b3f2-f02c966dc4e3", 3, 0, 0.0, 514.6666666666666, 230, 867, 447.0, 867.0, 867.0, 867.0, 0.03170912165733009, 0.02643459002748124, 0.020334300021139416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b43c1aa-2296-4336-957d-ab710f3f36e7", 3, 0, 0.0, 374.6666666666667, 252, 514, 358.0, 514.0, 514.0, 514.0, 0.021862224262696486, 0.025840408951123352, 0.014019720637210962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0af859c3-3513-4e4f-85e9-cd65600f5765", 3, 0, 0.0, 401.66666666666663, 220, 753, 232.0, 753.0, 753.0, 753.0, 0.07192347342427657, 0.033807778523650835, 0.046122800340437774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9faf9843-2da2-4819-8102-c3da86e57a12", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 165.99999999999997, 128, 421, 129.0, 396.40000000000003, 421.0, 421.0, 0.1653256916124766, 0.12286411261435026, 0.08298574754766891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 198.6, 126, 411, 129.0, 396.0, 411.0, 411.0, 0.16578249336870027, 0.07755943993147657, 0.09269140970380194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=deb5d1c6-b43a-4b9f-84f0-9b01d2f6e0de", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 330.0, 126, 1140, 131.0, 987.6000000000001, 1140.0, 1140.0, 0.1654679433437762, 19.890431781703658, 0.09538106577902307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 305.26666666666665, 126, 980, 133.0, 770.0000000000001, 980.0, 980.0, 0.1652983635462009, 6.519040305250978, 0.09544473869083696], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 20.0, 0.3115264797507788], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.1557632398753894], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.0, 0.1557632398753894], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9345794392523364], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 20, "401/Unauthorized", 12, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
