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

    var data = {"OkPercent": 98.01375095492743, "KoPercent": 1.9862490450725745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7390307793058284, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1efd782-2285-40a2-9480-c48f86691ccd"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42eec856-227c-4d06-b40d-d0be7a5d171b"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ded15a97-314b-47e2-a10a-e7c794c43b15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1a1fa87-eec1-4d4b-890c-127730af72df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/520feec1-e476-4932-9195-262eb13f126d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5642e814-e17a-4d2e-9540-7da28e3dea98"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b196bb7-19a4-4e1c-9b07-018e9c32c10f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1efd782-2285-40a2-9480-c48f86691ccd"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42eec856-227c-4d06-b40d-d0be7a5d171b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/74514010-2416-48e8-a82e-920956a5ab90"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42019a09-790f-4212-91c0-8848af6803e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc50399a-d876-49e9-8b6e-0fa06f4148e5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ddb2e27-938d-447d-82bc-9241add2072d"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1a1fa87-eec1-4d4b-890c-127730af72df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23939db0-ce34-4efc-bb8a-c52c91639dfe"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/011df6de-12c0-4785-99e7-e6f428e8707b"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5e98aa3-0857-4a55-8303-e7949ef8c97e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9382352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5e98aa3-0857-4a55-8303-e7949ef8c97e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/42019a09-790f-4212-91c0-8848af6803e8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b196bb7-19a4-4e1c-9b07-018e9c32c10f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=520feec1-e476-4932-9195-262eb13f126d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ded15a97-314b-47e2-a10a-e7c794c43b15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5642e814-e17a-4d2e-9540-7da28e3dea98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74514010-2416-48e8-a82e-920956a5ab90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ddb2e27-938d-447d-82bc-9241add2072d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc50399a-d876-49e9-8b6e-0fa06f4148e5"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 26, 1.9862490450725745, 458.358288770054, 132, 3629, 157.0, 1239.0, 1504.5, 1953.6000000000013, 5.093563587829924, 729.4938252944656, 3.7312871912343235], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2225.3571428571427, 1645, 3053, 2196.0, 2597.3, 2752.7999999999997, 3053.0, 0.25490927960816806, 306.7428171984673, 1.2533869363546153], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1efd782-2285-40a2-9480-c48f86691ccd", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 592.7500000000002, 140, 1012, 560.0, 962.3000000000001, 1012.0, 1012.0, 0.08044526453922461, 0.01625697454158769, 0.053955872315767775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 592.7500000000002, 140, 1012, 560.0, 962.3000000000001, 1012.0, 1012.0, 0.07829933837059078, 0.015823309896547, 0.05251656673305798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 227.80000000000004, 133, 411, 141.0, 410.4, 411.0, 411.0, 0.0972516678661039, 0.0552359082333262, 0.053830317721198916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 138.33333333333334, 134, 146, 138.0, 143.6, 146.0, 146.0, 0.09725229839598543, 0.07227441316342276, 0.048816095093297374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 355.5333333333333, 134, 1110, 138.0, 1093.2, 1110.0, 1110.0, 0.09673549934864764, 5.709548337922895, 0.05530172003779133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 418.6666666666667, 133, 1492, 137.0, 1480.6, 1492.0, 1492.0, 0.09640722411466032, 17.370265752538725, 0.055019904074812005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42eec856-227c-4d06-b40d-d0be7a5d171b", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 270.0625, 133, 495, 269.0, 409.6000000000001, 495.0, 495.0, 0.08001880441903848, 0.1491024218816422, 0.05171625488239736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ded15a97-314b-47e2-a10a-e7c794c43b15", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 155.875, 134, 405, 138.0, 235.60000000000016, 405.0, 405.0, 0.1032171495293943, 0.07670727616393463, 0.05181017075987175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1a1fa87-eec1-4d4b-890c-127730af72df", 3, 0, 0.0, 582.3333333333334, 272, 1016, 459.0, 1016.0, 1016.0, 1016.0, 0.02257625128872768, 0.026684364723102275, 0.014477609062107266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 155.0, 133, 429, 136.5, 228.1000000000002, 429.0, 429.0, 0.1032218107686154, 0.02761989858457092, 0.05886868895397598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 944.125, 681, 1083, 1001.0, 1083.0, 1083.0, 1083.0, 0.0501837981607638, 14.755702918187865, 0.028620447388560604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1252.4999999999998, 944, 1689, 1217.5, 1689.0, 1689.0, 1689.0, 0.050178447102508295, 45.15065490713851, 0.028568393223400716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 339.74999999999994, 136, 419, 403.5, 419.0, 419.0, 419.0, 0.05039116139029214, 0.08916873480391539, 0.027902137215132464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 151.44444444444443, 133, 398, 136.5, 171.20000000000036, 398.0, 398.0, 0.10469377072064213, 0.07780464796719595, 0.05255136538125981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 183.22222222222223, 132, 419, 137.0, 416.3, 419.0, 419.0, 0.10453083078781403, 0.02797016370689555, 0.059615239433675186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 213.27777777777774, 133, 420, 138.0, 416.4, 420.0, 420.0, 0.10469437965671877, 0.028218407016849977, 0.06154884429037568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 207.2222222222222, 133, 551, 137.5, 454.70000000000016, 551.0, 551.0, 0.10469498859987901, 0.028218571146061144, 0.06165144348215532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 172.75, 136, 415, 138.5, 415.0, 415.0, 415.0, 0.05047764471309769, 0.037513171510417324, 0.028344380576202317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1006.0588235294117, 133, 2412, 1366.0, 1932.7999999999995, 2412.0, 2412.0, 0.09538665260181123, 50.49827909503316, 0.051254983251225995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 206.24999999999997, 132, 426, 137.5, 425.3, 426.0, 426.0, 0.10322114485152284, 0.027821324198262012, 0.06068274335997729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 647.6470588235294, 135, 1211, 814.0, 1191.0, 1211.0, 1211.0, 0.09552923194497516, 16.53340572950617, 0.05142488698048956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 187.43750000000003, 133, 414, 137.0, 407.7, 414.0, 414.0, 0.10321981304311363, 0.027820965234276723, 0.06078276100097414], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 510.3571428571429, 136, 861, 500.0, 830.5, 861.0, 861.0, 0.07201053411241873, 0.014185110793350341, 0.048914521567154964], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 421.77777777777777, 271, 819, 289.0, 700.2000000000002, 819.0, 819.0, 0.10444773261380451, 0.16187358560362083, 0.23490539864217946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 568.9090909090907, 175, 1288, 528.0, 967.9, 1242.5499999999993, 1288.0, 0.0951264966208474, 0.058432193725110375, 0.04301129681196519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 139.94117647058823, 135, 160, 139.0, 151.2, 160.0, 160.0, 0.09552225387567498, 0.07098870624940298, 0.04794769383993842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 272.88235294117646, 134, 560, 142.0, 447.9999999999999, 560.0, 560.0, 0.09538665260181123, 0.10979766457003064, 0.049687854193085024], "isController": false}, {"data": ["login", 22, 0, 0.0, 2899.9545454545446, 1439, 4788, 2646.0, 4460.6, 4742.4, 4788.0, 0.0939119447456267, 40.98040802072039, 0.19832061698013334], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 161.5625, 135, 417, 142.5, 239.2000000000002, 417.0, 417.0, 0.10179735963098456, 0.08241212024813106, 0.036185780181326545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/520feec1-e476-4932-9195-262eb13f126d", 3, 0, 0.0, 433.33333333333337, 263, 711, 326.0, 711.0, 711.0, 711.0, 0.03129237509126943, 0.02608716556274121, 0.020067050432877855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5642e814-e17a-4d2e-9540-7da28e3dea98", 3, 0, 0.0, 487.6666666666667, 307, 661, 495.0, 661.0, 661.0, 661.0, 0.06988282978872092, 0.0324391000256237, 0.04481418446737637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b196bb7-19a4-4e1c-9b07-018e9c32c10f", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1efd782-2285-40a2-9480-c48f86691ccd", 3, 0, 0.0, 397.0, 236, 672, 283.0, 672.0, 672.0, 672.0, 0.01723771381947517, 0.023763580086418403, 0.011054132885535833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1152.3529411764705, 273, 2552, 1507.0, 2074.3999999999996, 2552.0, 2552.0, 0.0953064382302155, 67.13119321032728, 0.20000226878377772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42eec856-227c-4d06-b40d-d0be7a5d171b", 3, 0, 0.0, 365.3333333333333, 236, 464, 396.0, 464.0, 464.0, 464.0, 0.03730740054468805, 0.03054300532874038, 0.023924342146170396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74514010-2416-48e8-a82e-920956a5ab90", 3, 0, 0.0, 566.0, 241, 972, 485.0, 972.0, 972.0, 972.0, 0.045352159518662415, 0.029157068700962976, 0.02908325333716307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 631.6, 274, 1629, 540.0, 1617.0, 1629.0, 1629.0, 0.09632055480639569, 23.165996436139473, 0.21169828188210366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 931.8461538461538, 133, 1826, 1218.0, 1801.6, 1826.0, 1826.0, 0.07949028384145967, 58.530035957888494, 0.13045554620525615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42019a09-790f-4212-91c0-8848af6803e8", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc50399a-d876-49e9-8b6e-0fa06f4148e5", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ddb2e27-938d-447d-82bc-9241add2072d", 3, 0, 0.0, 511.0, 361, 806, 366.0, 806.0, 806.0, 806.0, 0.09873292743129833, 0.04467407849267731, 0.06331506088530525], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1088.8260869565215, 180, 2372, 1150.0, 1688.2, 2238.599999999998, 2372.0, 0.09361466575494122, 0.029063792289407704, 0.04223630427615513], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 399.81250000000006, 273, 835, 282.0, 646.0000000000002, 835.0, 835.0, 0.10312600708991299, 0.15982516919110537, 0.23193280696100546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 142.13333333333333, 137, 156, 140.0, 150.6, 156.0, 156.0, 0.1227054088544223, 0.09526445316334545, 0.043617938303720426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1a1fa87-eec1-4d4b-890c-127730af72df", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.2281111900252525, 0.8705216224747474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23939db0-ce34-4efc-bb8a-c52c91639dfe", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 465.30769230769226, 273, 1341, 298.0, 1032.5999999999997, 1341.0, 1341.0, 0.07103980414872456, 6.639190542416228, 0.1583720153036132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 171.0, 134, 414, 136.5, 414.0, 414.0, 414.0, 0.04113575828628431, 0.030570617242053084, 0.020648222421045054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 171.875, 134, 417, 137.0, 417.0, 417.0, 417.0, 0.041135969806198165, 0.011007085670799117, 0.02346035778009739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 240.75, 132, 429, 136.0, 429.0, 429.0, 429.0, 0.04113639285255174, 0.011087543386039338, 0.024183699704332175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 205.375, 133, 423, 135.5, 423.0, 423.0, 423.0, 0.041135969806198165, 0.011087429361826847, 0.02422362284486083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 142.0, 136, 148, 142.0, 148.0, 148.0, 148.0, 0.03264027156705944, 0.009626330091066358, 0.020177042872996702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/011df6de-12c0-4785-99e7-e6f428e8707b", 2, 0, 0.0, 262.0, 257, 267, 262.0, 267.0, 267.0, 267.0, 0.016014733554870483, 0.027087420426792647, 0.009954470612963926], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1529.8928571428564, 1074, 2468, 1486.5, 2027.5, 2174.7999999999997, 2468.0, 0.25557938934781615, 305.7618034320661, 0.5046694582629729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1088.8260869565215, 180, 2372, 1150.0, 1688.2, 2238.599999999998, 2372.0, 0.09009291321310499, 0.02797042210488382, 0.04064738857856885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 163.27272727272728, 133, 408, 137.0, 357.20000000000016, 408.0, 408.0, 0.05336282842395312, 0.014382949848643614, 0.03142361869105833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 140.36363636363637, 132, 158, 140.0, 155.20000000000002, 158.0, 158.0, 0.05336282842395312, 0.014382949848643614, 0.031371506553925566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 190.13333333333335, 134, 416, 136.0, 408.2, 416.0, 416.0, 0.12221154002835309, 0.03293982914826704, 0.07184701864948101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 210.99999999999997, 135, 417, 139.0, 416.4, 417.0, 417.0, 0.12221054432576443, 0.03293956077530369, 0.07196577951995697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 165.0, 134, 409, 139.0, 358.4000000000002, 409.0, 409.0, 0.05336256955325827, 0.014278656306242936, 0.030433340448342606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 192.13333333333335, 133, 421, 138.0, 413.8, 421.0, 421.0, 0.12220656167765169, 0.09081952484052044, 0.061341965529602506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 136.9090909090909, 134, 143, 137.0, 142.2, 143.0, 143.0, 0.05336127523745768, 0.0396561820856497, 0.026784858859426997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 210.0, 133, 422, 138.0, 414.2, 422.0, 422.0, 0.12221353148220572, 0.032701667603637075, 0.06969990467344545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 169.72727272727272, 137, 414, 145.0, 362.8000000000002, 414.0, 414.0, 0.05486968449931413, 0.04318844307270233, 0.01950445816186557], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 530.4285714285714, 135, 900, 493.0, 853.0, 900.0, 900.0, 0.07351937235461545, 0.014195146671147848, 0.0500317380504763], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1545.2272727272727, 884, 3629, 1317.5, 2459.5, 3455.1499999999974, 3629.0, 0.09297843745509564, 0.04812360532343817, 0.0427664492591309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 304.0909090909091, 273, 545, 279.0, 495.8000000000002, 545.0, 545.0, 0.05332609391209921, 0.08264503031103657, 0.11993163503863719], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1367.6666666666665, 690, 3517, 1104.0, 2277.2, 2728.9999999999955, 3517.0, 0.2582714841095071, 76.90099812583259, 0.9399067815521662], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 252.33928571428575, 134, 577, 141.0, 551.2, 565.6, 577.0, 0.25683478643728874, 0.19087038328005543, 0.12415353445943157], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 858.1607142857141, 658, 1396, 802.0, 1207.8000000000002, 1235.6499999999999, 1396.0, 0.2565841321041732, 75.44425423363818, 0.12904377737661052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5e98aa3-0857-4a55-8303-e7949ef8c97e", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 197.94642857142858, 133, 423, 140.5, 413.3, 415.9, 423.0, 0.25735648928983396, 0.4554003501886515, 0.12515969889290754], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1273.1249999999995, 933, 1899, 1292.5, 1510.3, 1621.3, 1899.0, 0.2562565494140419, 230.5800936137207, 0.12862877578009527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 142.53846153846152, 137, 158, 141.0, 155.2, 158.0, 158.0, 0.07273500400042522, 0.05433816216828642, 0.025855020953276152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 7, 4.117647058823529, 215.2058823529412, 134, 1535, 145.0, 380.4000000000001, 440.5499999999998, 1215.4999999999964, 0.7096432164370066, 1.5519205763137793, 0.3401420056082686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 145.75, 137, 169, 142.0, 169.0, 169.0, 169.0, 0.0415569303973362, 0.03218227129403087, 0.014772190102178102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5e98aa3-0857-4a55-8303-e7949ef8c97e", 3, 0, 0.0, 382.6666666666667, 275, 500, 373.0, 500.0, 500.0, 500.0, 0.018948365703458078, 0.026121851807989895, 0.01215113295436602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 144.6, 134, 177, 143.0, 160.8, 177.0, 177.0, 0.09680292215754353, 0.07855784014933463, 0.0344104137356893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42019a09-790f-4212-91c0-8848af6803e8", 3, 0, 0.0, 618.6666666666666, 271, 900, 685.0, 900.0, 900.0, 900.0, 0.01682189537902534, 0.023190340797582133, 0.010787478481992161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b196bb7-19a4-4e1c-9b07-018e9c32c10f", 3, 0, 0.0, 341.6666666666667, 237, 531, 257.0, 531.0, 531.0, 531.0, 0.04456526583181068, 0.02865117188080277, 0.02857863726844631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=520feec1-e476-4932-9195-262eb13f126d", 1, 0, 0.0, 861.0, 861, 861, 861.0, 861.0, 861.0, 861.0, 1.1614401858304297, 0.20983050232288036, 0.8007585656213705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 449.375, 270, 844, 405.5, 844.0, 844.0, 844.0, 0.04110680060632531, 0.06370751226781081, 0.09245015800426483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 459.1333333333334, 271, 837, 284.0, 829.2, 837.0, 837.0, 0.12207130591883072, 0.18918668212225034, 0.2745412280576828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ded15a97-314b-47e2-a10a-e7c794c43b15", 3, 0, 0.0, 326.0, 229, 486, 263.0, 486.0, 486.0, 486.0, 0.025459760847979768, 0.021224755055884174, 0.016326734658372442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5642e814-e17a-4d2e-9540-7da28e3dea98", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74514010-2416-48e8-a82e-920956a5ab90", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 160.05555555555554, 136, 419, 143.0, 193.10000000000036, 419.0, 419.0, 0.1048724925278349, 0.0869499474180975, 0.03727889382825381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 160.94117647058823, 136, 420, 142.0, 223.99999999999983, 420.0, 420.0, 0.09565232069409825, 0.0742613231951251, 0.03400141087173024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ddb2e27-938d-447d-82bc-9241add2072d", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 138.38461538461536, 134, 161, 137.0, 152.2, 161.0, 161.0, 0.07109302796143477, 0.05283378347524595, 0.03568536755095456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 201.0769230769231, 133, 433, 136.0, 423.0, 433.0, 433.0, 0.07109458313964617, 0.02723725766317574, 0.04008683451368571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 300.38461538461536, 134, 1203, 140.0, 886.5999999999997, 1203.0, 1203.0, 0.07109341674960899, 4.938455702307254, 0.04132518470616544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc50399a-d876-49e9-8b6e-0fa06f4148e5", 3, 0, 0.0, 355.6666666666667, 281, 479, 307.0, 479.0, 479.0, 479.0, 0.04459573962034161, 0.028670763590551648, 0.02859817937893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 270.2307692307692, 133, 1063, 138.0, 802.9999999999998, 1063.0, 1063.0, 0.07109341674960899, 1.625674447522121, 0.041394611870959976], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 34.61538461538461, 0.6875477463712758], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.22918258212375858], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.15278838808250572], "isController": false}, {"data": ["401/Unauthorized", 12, 46.15384615384615, 0.9167303284950343], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 26, "401/Unauthorized", 12, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
