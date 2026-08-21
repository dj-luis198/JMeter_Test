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

    var data = {"OkPercent": 98.4399375975039, "KoPercent": 1.5600624024960998};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7942551770207081, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7eee23a0-bb8f-404e-9e28-99a8fc3ba9e9"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "see books"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01ebbe17-f6a0-4659-9d27-05bbe1fbefe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa7afcc6-a5d7-4ee3-a1c8-0a1fb8242c6e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6e9ab9f9-0f96-4308-a173-1639ce144763"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fd0cd90-44e6-43c6-b701-9186e7d2b0d2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/333d9c3f-0ceb-41c0-8084-7ea6bb25793e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/edab0b69-522a-4849-8d80-1a1669788b39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01b75266-1a77-4ceb-bc48-4d3b015f5750"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/01b75266-1a77-4ceb-bc48-4d3b015f5750"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d153ec9-2d66-43c4-8aa6-e422232a21cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/05bb972b-a79e-4aa1-a94b-30c96b9c48e6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=206be2ee-85a3-4615-9053-193da57993cb"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01ebbe17-f6a0-4659-9d27-05bbe1fbefe8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a6978976-216e-4029-a92f-4399db4df24d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3835b1a4-6164-494f-8458-dc62e6f78d5a"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ade29ca-33ad-4279-a5eb-739b0e38afd2"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5850db33-a0a1-4728-8784-dead9bc9e9b5"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa7afcc6-a5d7-4ee3-a1c8-0a1fb8242c6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=333d9c3f-0ceb-41c0-8084-7ea6bb25793e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4807692307692308, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eee23a0-bb8f-404e-9e28-99a8fc3ba9e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5a68f7f-fa39-40cb-96c6-11dca109f4df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6978976-216e-4029-a92f-4399db4df24d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edab0b69-522a-4849-8d80-1a1669788b39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05bb972b-a79e-4aa1-a94b-30c96b9c48e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e9ab9f9-0f96-4308-a173-1639ce144763"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/206be2ee-85a3-4615-9053-193da57993cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d153ec9-2d66-43c4-8aa6-e422232a21cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5850db33-a0a1-4728-8784-dead9bc9e9b5"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ade29ca-33ad-4279-a5eb-739b0e38afd2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1282, 20, 1.5600624024960998, 344.6942277691111, 80, 3510, 102.0, 921.4000000000001, 1176.0999999999995, 2131.1900000000005, 5.06677311369412, 693.6000950452236, 3.6982864688108896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7eee23a0-bb8f-404e-9e28-99a8fc3ba9e9", 3, 0, 0.0, 351.66666666666663, 185, 672, 198.0, 672.0, 672.0, 672.0, 0.03844231730288702, 0.0312468965837594, 0.024652137072489397], "isController": false}, {"data": ["see books", 52, 0, 0.0, 1402.9615384615386, 1015, 1945, 1362.5, 1706.7, 1844.6999999999998, 1945.0, 0.24418419001286665, 293.8357579571175, 1.2006517546042808], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 716.1428571428571, 88, 1341, 617.0, 1265.5, 1341.0, 1341.0, 0.10902492777098535, 0.020586668490238377, 0.07373023679824937], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 716.1428571428571, 88, 1341, 617.0, 1265.5, 1341.0, 1341.0, 0.11128421989761852, 0.0210132800825093, 0.0752581272256844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 162.46666666666667, 83, 257, 89.0, 256.4, 257.0, 257.0, 0.09934893332361922, 0.046479260082260915, 0.05554743745984647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01ebbe17-f6a0-4659-9d27-05bbe1fbefe8", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 96.33333333333333, 82, 248, 86.0, 153.80000000000007, 248.0, 248.0, 0.09934827531394055, 0.07383206788467651, 0.049868177257192815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 224.86666666666662, 81, 760, 89.0, 715.0, 760.0, 760.0, 0.09924310591224263, 3.913951678531731, 0.05730384806872916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 208.93333333333334, 82, 813, 85.0, 763.8000000000001, 813.0, 813.0, 0.0992417927037434, 11.92957419895333, 0.057206173997327095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa7afcc6-a5d7-4ee3-a1c8-0a1fb8242c6e", 3, 0, 0.0, 542.3333333333333, 187, 1075, 365.0, 1075.0, 1075.0, 1075.0, 0.03868372188982876, 0.031669778825820095, 0.02480694405044357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e9ab9f9-0f96-4308-a173-1639ce144763", 3, 0, 0.0, 783.0, 259, 1606, 484.0, 1606.0, 1606.0, 1606.0, 0.04022418277868655, 0.025860273759083962, 0.025794804711592612], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 223.14285714285717, 82, 446, 203.5, 369.5, 446.0, 446.0, 0.1092742627889914, 0.24065339179506393, 0.0706364811150658], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6fd0cd90-44e6-43c6-b701-9186e7d2b0d2", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.8725025614754098, 1.6302723702185793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/333d9c3f-0ceb-41c0-8084-7ea6bb25793e", 3, 0, 0.0, 381.0, 240, 561, 342.0, 561.0, 561.0, 561.0, 0.0376889156898956, 0.024230341304539, 0.02416899866832498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 95.12499999999999, 82, 251, 84.0, 136.90000000000012, 251.0, 251.0, 0.1032577830553978, 0.0767374735401931, 0.051830566885228975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 115.75, 82, 260, 84.5, 253.70000000000002, 260.0, 260.0, 0.10325844944530851, 0.027629702292982943, 0.05888958444927751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 567.8333333333333, 428, 690, 575.0, 690.0, 690.0, 690.0, 0.08050665521683126, 23.671629706284886, 0.045913951803349076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 897.8333333333334, 757, 1058, 893.0, 1058.0, 1058.0, 1058.0, 0.08037508372404555, 72.32164161922303, 0.04576042364367046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 186.83333333333334, 83, 348, 171.0, 348.0, 348.0, 348.0, 0.08097275266872697, 0.14328381624583328, 0.04483549879215644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 85.23076923076921, 83, 88, 85.0, 87.6, 88.0, 88.0, 0.07950729938167785, 0.059086967606891444, 0.03990893738494376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 85.76923076923077, 82, 94, 85.0, 92.8, 94.0, 94.0, 0.07950632686885738, 0.03045990587674073, 0.04482981441388548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 191.23076923076923, 83, 1129, 87.0, 778.5999999999997, 1129.0, 1129.0, 0.07900238222567943, 5.487846594465579, 0.04592250853833439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 159.84615384615387, 81, 735, 85.0, 540.5999999999999, 735.0, 735.0, 0.07919199795319143, 1.810862572186552, 0.04611006431303988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edab0b69-522a-4849-8d80-1a1669788b39", 3, 0, 0.0, 306.6666666666667, 189, 467, 264.0, 467.0, 467.0, 467.0, 0.028820381773990565, 0.028904816486219054, 0.018481820343346816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01b75266-1a77-4ceb-bc48-4d3b015f5750", 1, 0, 0.0, 927.0, 927, 927, 927.0, 927.0, 927.0, 927.0, 1.0787486515641855, 0.19489111380798274, 0.7437466289104638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 85.0, 83, 87, 85.0, 87.0, 87.0, 87.0, 0.08116443915372545, 0.06031849433201666, 0.0455757348763595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 631.3529411764706, 81, 1141, 903.0, 1127.4, 1141.0, 1141.0, 0.1023566104307407, 54.188217531128444, 0.05500021449730862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 94.375, 81, 246, 84.0, 138.2000000000001, 246.0, 246.0, 0.10325911584382058, 0.02783155856727977, 0.06070506615037109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 418.1176470588235, 82, 760, 499.0, 750.4, 760.0, 760.0, 0.1023547616037185, 17.714711690720037, 0.05509917687203848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 114.81250000000003, 81, 250, 84.0, 247.9, 250.0, 250.0, 0.1032577830553978, 0.027831199339150188, 0.06080512029531726], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 763.2857142857143, 107, 2068, 556.5, 1989.5, 2068.0, 2068.0, 0.11141795261553644, 0.02103853220774673, 0.07625010694133845], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/01b75266-1a77-4ceb-bc48-4d3b015f5750", 3, 0, 0.0, 1162.3333333333335, 446, 2579, 462.0, 2579.0, 2579.0, 2579.0, 0.01875082034839024, 0.022162834858400055, 0.012024451851018482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 290.8461538461538, 169, 1215, 174.0, 864.1999999999997, 1215.0, 1215.0, 0.07896207390850118, 7.379584735416312, 0.17603346359544694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 664.7272727272727, 89, 2083, 439.5, 1493.2, 1996.1499999999987, 2083.0, 0.09359591241124342, 0.057492020416671986, 0.042319245553130574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 96.3529411764706, 82, 257, 86.0, 127.39999999999989, 257.0, 257.0, 0.10235291284348434, 0.07606500651747224, 0.05137636445463959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 134.23529411764707, 82, 253, 86.0, 251.4, 253.0, 253.0, 0.10235229660491411, 0.11781567781303247, 0.05331632729856165], "isController": false}, {"data": ["login", 22, 0, 0.0, 3409.863636363636, 1590, 5973, 3263.0, 4900.3, 5822.849999999998, 5973.0, 0.09274247942803183, 30.38621215737977, 0.18187043928318494], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d153ec9-2d66-43c4-8aa6-e422232a21cf", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 100.0, 85, 259, 89.5, 144.90000000000012, 259.0, 259.0, 0.09581985866570847, 0.07757291292370344, 0.03406096538507606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05bb972b-a79e-4aa1-a94b-30c96b9c48e6", 3, 0, 0.0, 572.6666666666666, 257, 780, 681.0, 780.0, 780.0, 780.0, 0.01998920582885242, 0.027556733947001956, 0.012818598789986741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=206be2ee-85a3-4615-9053-193da57993cb", 1, 0, 0.0, 2068.0, 2068, 2068, 2068.0, 2068.0, 2068.0, 2068.0, 0.4835589941972921, 0.08736173235009671, 0.3333912596711799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 729.5294117647059, 169, 1228, 987.0, 1216.0, 1228.0, 1228.0, 0.10229871223974003, 72.05635573060837, 0.21467568111385243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01ebbe17-f6a0-4659-9d27-05bbe1fbefe8", 3, 0, 0.0, 421.66666666666663, 202, 843, 220.0, 843.0, 843.0, 843.0, 0.037529085040906705, 0.031286454033125674, 0.024066503102404362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6978976-216e-4029-a92f-4399db4df24d", 3, 0, 0.0, 762.6666666666666, 218, 1138, 932.0, 1138.0, 1138.0, 1138.0, 0.01972555182231223, 0.02331493446185407, 0.01264952379230309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3835b1a4-6164-494f-8458-dc62e6f78d5a", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 374.8666666666667, 167, 898, 335.0, 869.8000000000001, 898.0, 898.0, 0.09918535759627592, 15.954578220465907, 0.21968652674367858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 758.25, 82, 1142, 935.5, 1142.0, 1142.0, 1142.0, 0.10704202737599851, 96.05176945488849, 0.19875686992386637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ade29ca-33ad-4279-a5eb-739b0e38afd2", 3, 0, 0.0, 283.0, 187, 443, 219.0, 443.0, 443.0, 443.0, 0.021865092380015303, 0.025843798968696475, 0.01402155989213221], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1291.4583333333333, 275, 2177, 1289.0, 1943.0, 2127.0, 2177.0, 0.0959735113108782, 0.030132308482858732, 0.043300549048462623], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5850db33-a0a1-4728-8784-dead9bc9e9b5", 3, 0, 0.0, 961.0, 293, 2071, 519.0, 2071.0, 2071.0, 2071.0, 0.018760670131137084, 0.025863098309038268, 0.012030768280709654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 243.25000000000003, 168, 512, 174.0, 388.10000000000014, 512.0, 512.0, 0.10320117133329462, 0.15994165908783065, 0.23210185310603274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 89.88235294117646, 84, 113, 88.0, 98.6, 113.0, 113.0, 0.15780630668263296, 0.12251563848895819, 0.05609521057859218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 336.4117647058823, 171, 1068, 183.0, 1053.6, 1068.0, 1068.0, 0.0916254352208173, 13.021280723153748, 0.20330972462514416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 89.875, 83, 118, 86.5, 118.0, 118.0, 118.0, 0.03631378743724523, 0.026987101796624634, 0.018227819084710987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 85.125, 82, 93, 84.0, 93.0, 93.0, 93.0, 0.03631378743724523, 0.009716775154106636, 0.020710206897803923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa7afcc6-a5d7-4ee3-a1c8-0a1fb8242c6e", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 126.75000000000001, 82, 258, 86.5, 258.0, 258.0, 258.0, 0.036313952274388224, 0.009787744948956201, 0.021348632098810265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=333d9c3f-0ceb-41c0-8084-7ea6bb25793e", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.22005366930572473, 0.8397723812423874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 157.99999999999997, 82, 333, 90.5, 333.0, 333.0, 333.0, 0.036273118445334145, 0.009776738955968967, 0.021360049240758287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 2.7562792056074765, 5.777234228971963], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 954.480769230769, 654, 1593, 870.0, 1353.4, 1460.7499999999995, 1593.0, 0.2474399482279493, 296.0242021251285, 0.48859724152042333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1291.4583333333333, 275, 2177, 1289.0, 1943.0, 2127.0, 2177.0, 0.09835178795354517, 0.030879003737367943, 0.04437356058060339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 117.5, 81, 270, 83.0, 267.40000000000003, 270.0, 270.0, 0.062375249500998, 0.01681207896706587, 0.03673073774326348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 125.60000000000002, 80, 334, 85.0, 326.1, 334.0, 334.0, 0.06237408232131385, 0.016811764375666623, 0.03666913823967865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 143.2941176470588, 82, 332, 86.0, 280.79999999999995, 332.0, 332.0, 0.14196123623184775, 0.03826298945311521, 0.08345767989411361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 139.5294117647059, 82, 265, 86.0, 263.4, 265.0, 265.0, 0.14215116522146315, 0.03831418125109749, 0.08370815686381082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 117.4, 81, 262, 84.0, 260.3, 262.0, 262.0, 0.06230568414756478, 0.016671638141047607, 0.035533710490408044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 86.17647058823529, 83, 92, 85.0, 89.6, 92.0, 92.0, 0.1421535425499001, 0.10564340418015035, 0.07135441491274282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 101.80000000000001, 83, 245, 87.0, 229.40000000000006, 245.0, 245.0, 0.06237369327112596, 0.046353887284498886, 0.03130867025523315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 122.41176470588235, 82, 251, 84.0, 249.4, 251.0, 251.0, 0.14196123623184775, 0.037985721413599884, 0.08096226753847567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 106.8, 85, 256, 89.5, 240.50000000000006, 256.0, 256.0, 0.05716703063009501, 0.04499670574985994, 0.020321092919291586], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 772.5714285714286, 84, 2579, 616.5, 1827.0, 2579.0, 2579.0, 0.11018416496143554, 0.020590358393672282, 0.07499071550842122], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2075.2727272727275, 1178, 3510, 1992.5, 3209.3999999999996, 3483.45, 3510.0, 0.0926815294137472, 0.047969932216099624, 0.042629883158080986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 262.8, 167, 500, 173.5, 492.20000000000005, 500.0, 500.0, 0.06227154128291829, 0.09650872657811654, 0.14005015583453206], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 1004.7868852459013, 447, 3667, 820.0, 1645.8000000000002, 1838.1999999999998, 3667.0, 0.283926942339558, 84.63007424864088, 1.033085161500903], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 147.36538461538456, 84, 437, 87.0, 339.4, 360.3499999999999, 437.0, 0.24824912754753733, 0.18448983014030848, 0.12000324036721774], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 541.7115384615382, 403, 754, 498.5, 696.8000000000001, 745.7, 754.0, 0.24807266620868637, 72.941600653099, 0.12476310849362643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eee23a0-bb8f-404e-9e28-99a8fc3ba9e9", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 115.73076923076927, 81, 259, 88.0, 251.10000000000002, 253.7, 259.0, 0.24859091973859712, 0.4398894009436894, 0.12089675588849741], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 802.2115384615387, 559, 1251, 754.5, 1012.9000000000001, 1115.9499999999994, 1251.0, 0.24787991171661605, 223.04278028901845, 0.12442409631087954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 104.64705882352939, 86, 264, 92.0, 159.99999999999991, 264.0, 264.0, 0.09136002837535, 0.06825236494838159, 0.03247563508655019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 185.59770114942532, 84, 2261, 93.5, 350.0, 510.75, 1428.5, 0.7322492677507322, 1.5129888434564691, 0.3555462753130997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 89.625, 85, 96, 88.5, 96.0, 96.0, 96.0, 0.03769051376881581, 0.029188063885420838, 0.013397799816258747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5a68f7f-fa39-40cb-96c6-11dca109f4df", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 104.73333333333333, 85, 248, 90.0, 176.60000000000005, 248.0, 248.0, 0.09527196971621656, 0.07731543636149997, 0.033866207985061354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6978976-216e-4029-a92f-4399db4df24d", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 290.62500000000006, 169, 421, 334.5, 421.0, 421.0, 421.0, 0.03625881542450008, 0.05619408210808753, 0.0815469257056872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edab0b69-522a-4849-8d80-1a1669788b39", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05bb972b-a79e-4aa1-a94b-30c96b9c48e6", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 270.82352941176475, 169, 420, 332.0, 366.4, 420.0, 420.0, 0.14186054274174706, 0.2198561341124537, 0.31904768548265966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e9ab9f9-0f96-4308-a173-1639ce144763", 1, 0, 0.0, 1911.0, 1911, 1911, 1911.0, 1911.0, 1911.0, 1911.0, 0.5232862375719519, 0.09453901753008896, 0.3607813317634746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/206be2ee-85a3-4615-9053-193da57993cb", 3, 0, 0.0, 478.0, 188, 1049, 197.0, 1049.0, 1049.0, 1049.0, 0.0737300007373, 0.03422492872766596, 0.04728128302489616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 91.6153846153846, 84, 101, 91.0, 100.6, 101.0, 101.0, 0.08384554360935716, 0.06951647121517991, 0.02980447057988868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 111.23529411764706, 84, 253, 90.0, 251.4, 253.0, 253.0, 0.09958525669564403, 0.07731472565726269, 0.03539944671602971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d153ec9-2d66-43c4-8aa6-e422232a21cf", 3, 0, 0.0, 268.0, 173, 427, 204.0, 427.0, 427.0, 427.0, 0.0273620269789586, 0.022810596058956047, 0.01754661235304311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 86.47058823529412, 83, 94, 85.0, 91.6, 94.0, 94.0, 0.09166841915115044, 0.06812467477932177, 0.04601324945672981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 142.99999999999997, 82, 257, 86.0, 253.0, 257.0, 257.0, 0.09166792485387054, 0.04072608747816146, 0.05137363711364666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5850db33-a0a1-4728-8784-dead9bc9e9b5", 1, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 1.1454753722794961, 0.20694623424971365, 0.7897515750286369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 228.23529411764707, 81, 978, 85.0, 969.2, 978.0, 978.0, 0.09166990207497519, 9.725888035325266, 0.05296506635283206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 170.8235294117647, 83, 491, 87.0, 482.2, 491.0, 491.0, 0.09166940776170268, 3.1928421021412894, 0.053054301654363194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ade29ca-33ad-4279-a5eb-739b0e38afd2", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 35.0, 0.5460218408736349], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.078003120124805], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.078003120124805], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.858034321372855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1282, 20, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
