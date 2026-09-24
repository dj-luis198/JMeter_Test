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

    var data = {"OkPercent": 98.46938775510205, "KoPercent": 1.530612244897959};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7738913179262961, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.07142857142857142, 500, 1500, "see books"], "isController": true}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8f8f525-5ff2-4991-a655-1482d5aabd0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95e63abd-383c-4976-b329-fa2dcdc50bd3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f8d4c74-95e8-47b2-aea4-6e8ff395c329"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05fb2323-8a55-43da-a483-6689408e472c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d9fed00-9c9e-46cb-8e9a-9b1c34c8895c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/49e3b356-191f-4ff9-a680-9e6c2551d4c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b053195-0446-425d-9ea8-100d6575fa2b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5db9ea07-6734-4013-8aaa-7958efbe157a"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6ade7d7-1422-401c-aa7e-23e6706006a8"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1eece7d-f196-4361-abaa-f82a8e9c915c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=730b74ff-2412-4ad1-9272-4c7a79224c43"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad6ff4ac-f5a6-4f24-9625-f46d42c2cc65"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=073ef21c-a000-4e9d-8c03-d1ae92a2cce5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86497797-00ed-4ad1-9c1c-9a705cdc78a3"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30284c23-418a-49de-a5bb-3abf6883c979"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a729bc0-8036-41a4-ba57-4e90e29db38c"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8f8f525-5ff2-4991-a655-1482d5aabd0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d9fed00-9c9e-46cb-8e9a-9b1c34c8895c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f8d4c74-95e8-47b2-aea4-6e8ff395c329"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86497797-00ed-4ad1-9c1c-9a705cdc78a3"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49e3b356-191f-4ff9-a680-9e6c2551d4c9"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad6ff4ac-f5a6-4f24-9625-f46d42c2cc65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/730b74ff-2412-4ad1-9272-4c7a79224c43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b053195-0446-425d-9ea8-100d6575fa2b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5db9ea07-6734-4013-8aaa-7958efbe157a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/073ef21c-a000-4e9d-8c03-d1ae92a2cce5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95e63abd-383c-4976-b329-fa2dcdc50bd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30284c23-418a-49de-a5bb-3abf6883c979"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1eece7d-f196-4361-abaa-f82a8e9c915c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6ade7d7-1422-401c-aa7e-23e6706006a8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9a729bc0-8036-41a4-ba57-4e90e29db38c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1372, 21, 1.530612244897959, 382.95189504373155, 102, 2944, 126.5, 1063.4, 1303.0499999999997, 1692.2399999999998, 5.4347395523866115, 771.2068331909785, 3.973323151861755], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1768.1249999999998, 1268, 2268, 1785.0, 2081.9, 2236.8, 2268.0, 0.257208734073727, 309.50900205451217, 1.264693335997281], "isController": true}, {"data": ["deleteBook", 15, 0, 0.0, 651.1333333333333, 433, 1373, 536.0, 1199.0, 1373.0, 1373.0, 0.10816813655145557, 0.019542094982440705, 0.07352053031231746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 651.1333333333333, 433, 1373, 536.0, 1199.0, 1373.0, 1373.0, 0.11062191641407995, 0.019985404820903115, 0.07518833381269496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8f8f525-5ff2-4991-a655-1482d5aabd0d", 1, 0, 0.0, 1701.0, 1701, 1701, 1701.0, 1701.0, 1701.0, 1701.0, 0.5878894767783657, 0.10621050117577895, 0.4053222369194591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 176.13333333333335, 103, 330, 109.0, 321.0, 330.0, 330.0, 0.0903152000481681, 0.03320965168437848, 0.05100221648553451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 123.26666666666668, 105, 312, 111.0, 195.00000000000006, 312.0, 312.0, 0.09031356871056308, 0.06711779862181494, 0.04533317804416936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 184.53333333333336, 103, 653, 109.0, 450.20000000000016, 653.0, 653.0, 0.0902049456364861, 1.7909087885175117, 0.052601933467838924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95e63abd-383c-4976-b329-fa2dcdc50bd3", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 226.39999999999998, 103, 1206, 111.0, 684.0000000000002, 1206.0, 1206.0, 0.0901919284236856, 5.433012622736182, 0.052506264581028424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f8d4c74-95e8-47b2-aea4-6e8ff395c329", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05fb2323-8a55-43da-a483-6689408e472c", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d9fed00-9c9e-46cb-8e9a-9b1c34c8895c", 3, 0, 0.0, 487.0, 211, 1017, 233.0, 1017.0, 1017.0, 1017.0, 0.021049677238282345, 0.024880005876368228, 0.013498653697726634], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 282.0666666666667, 199, 569, 233.0, 555.2, 569.0, 569.0, 0.10860672058386972, 0.23352566150543397, 0.07021254787746266], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 131.38888888888889, 103, 314, 107.5, 313.1, 314.0, 314.0, 0.11905943049905746, 0.08848069004861593, 0.05976225319972219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49e3b356-191f-4ff9-a680-9e6c2551d4c9", 3, 0, 0.0, 541.3333333333334, 230, 825, 569.0, 825.0, 825.0, 825.0, 0.06520888579750467, 0.030227035604051645, 0.041816896165717515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 149.66666666666669, 104, 416, 109.5, 341.3000000000001, 416.0, 416.0, 0.1190586429960446, 0.051726433003055836, 0.06678962503141825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 755.5555555555555, 518, 920, 763.0, 920.0, 920.0, 920.0, 0.10081435596428931, 29.642768005163937, 0.05749568738588375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b053195-0446-425d-9ea8-100d6575fa2b", 3, 0, 0.0, 312.3333333333333, 199, 417, 321.0, 417.0, 417.0, 417.0, 0.049165014175912417, 0.031928451588849376, 0.03152834567921467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 999.8888888888889, 768, 1236, 973.0, 1236.0, 1236.0, 1236.0, 0.10080983904029034, 90.70887037324843, 0.057394664219227794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 229.11111111111114, 105, 333, 309.0, 333.0, 333.0, 333.0, 0.10144845854703263, 0.17951621766330383, 0.05617312109000733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 112.0625, 106, 123, 112.0, 118.80000000000001, 123.0, 123.0, 0.08121167823933081, 0.06035360072278394, 0.0407644556787266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 203.43750000000003, 109, 343, 112.0, 335.3, 343.0, 343.0, 0.08112973151129478, 0.029324357300408183, 0.04584344814035443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 209.56250000000003, 104, 1305, 110.5, 612.7000000000007, 1305.0, 1305.0, 0.08072246607133848, 4.560035954606225, 0.04702241309722012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 202.37499999999997, 104, 660, 111.0, 493.4000000000002, 660.0, 660.0, 0.08098600460607902, 1.5087498892769469, 0.04725501733606661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 136.11111111111111, 105, 357, 109.0, 357.0, 357.0, 357.0, 0.10167538438943931, 0.07556149171910481, 0.05709311135149181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 652.15, 106, 1352, 669.5, 1318.4, 1350.7, 1352.0, 0.09641109691725518, 43.388430141121745, 0.05253651570295741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 204.61111111111111, 103, 1025, 108.5, 933.2000000000002, 1025.0, 1025.0, 0.1190547056372403, 11.931371679696543, 0.06885433822119041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 492.7, 107, 1007, 507.5, 882.0, 1000.8, 1007.0, 0.09651205435558902, 14.201880748499237, 0.05268577967263111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 218.16666666666666, 103, 881, 110.0, 877.4, 881.0, 881.0, 0.11906021801248809, 3.9182645402291247, 0.06897379600354535], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 552.1333333333333, 207, 1701, 503.0, 1130.4000000000003, 1701.0, 1701.0, 0.11052003359809022, 0.01996699825746747, 0.07619838253930829], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 399.3125, 217, 1419, 328.5, 801.6000000000006, 1419.0, 1419.0, 0.0806768790149353, 6.149568512633495, 0.1801540707788344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5db9ea07-6734-4013-8aaa-7958efbe157a", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 614.5999999999999, 135, 1254, 651.0, 1117.0, 1220.1, 1254.0, 0.10879025239338555, 0.0668252624564839, 0.04918934263489991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 110.20000000000002, 106, 117, 110.0, 114.9, 116.9, 117.0, 0.09650926006350309, 0.07172221377766197, 0.048443124680313074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 205.1, 104, 341, 115.5, 331.8, 340.55, 341.0, 0.09641295597302366, 0.09820186824205436, 0.0509369230287166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6ade7d7-1422-401c-aa7e-23e6706006a8", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["login", 25, 0, 0.0, 2786.0000000000005, 1774, 4228, 2607.0, 3990.4000000000005, 4192.0, 4228.0, 0.10560866497974425, 45.62519983139576, 0.2223846212134013], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e1eece7d-f196-4361-abaa-f82a8e9c915c", 3, 0, 0.0, 308.3333333333333, 202, 422, 301.0, 422.0, 422.0, 422.0, 0.04371393600279769, 0.028103848829923648, 0.028032699845544094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 140.33333333333331, 106, 352, 115.0, 334.90000000000003, 352.0, 352.0, 0.11852710319759785, 0.09595602397539904, 0.04213268121477111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=730b74ff-2412-4ad1-9272-4c7a79224c43", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad6ff4ac-f5a6-4f24-9625-f46d42c2cc65", 3, 0, 0.0, 394.3333333333333, 245, 615, 323.0, 615.0, 615.0, 615.0, 0.0286407118171577, 0.028724620152559527, 0.01836660230462261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=073ef21c-a000-4e9d-8c03-d1ae92a2cce5", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86497797-00ed-4ad1-9c1c-9a705cdc78a3", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 799.1999999999999, 218, 1460, 814.5, 1426.5000000000002, 1458.65, 1460.0, 0.09635814394943125, 57.71358798883691, 0.20438465689273894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30284c23-418a-49de-a5bb-3abf6883c979", 3, 0, 0.0, 300.6666666666667, 215, 458, 229.0, 458.0, 458.0, 458.0, 0.06991703178894379, 0.03163563612846089, 0.04483611739069637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 434.06666666666666, 216, 1318, 426.0, 913.0000000000002, 1318.0, 1318.0, 0.09013393903340364, 7.319145781881876, 0.20117590051316256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 0, 0.0, 1136.5555555555557, 875, 1594, 1088.0, 1594.0, 1594.0, 1594.0, 0.10068465565847765, 120.45385181735803, 0.2270320995267821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a729bc0-8036-41a4-ba57-4e90e29db38c", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["register", 25, 9, 36.0, 1070.6799999999998, 154, 2016, 1121.0, 1791.2000000000005, 1986.0, 2016.0, 0.10373831387894154, 0.03232096841790772, 0.04680380958210057], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f8f8f525-5ff2-4991-a655-1482d5aabd0d", 3, 0, 0.0, 429.0, 255, 740, 292.0, 740.0, 740.0, 740.0, 0.03211647575206081, 0.03241965862862649, 0.020595526442565036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 117.10000000000001, 112, 126, 115.5, 125.9, 126.0, 126.0, 0.098818623357758, 0.07671953668888438, 0.03512693252170304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 364.22222222222223, 214, 1339, 224.0, 1058.2000000000005, 1339.0, 1339.0, 0.11896972220569865, 15.978242998962319, 0.26418352484153895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d9fed00-9c9e-46cb-8e9a-9b1c34c8895c", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 327.1333333333334, 216, 528, 227.0, 480.6, 528.0, 528.0, 0.07839448102853559, 0.12149613417215428, 0.17631102520382566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 110.875, 106, 118, 111.5, 118.0, 118.0, 118.0, 0.03643717320410282, 0.027078797664377197, 0.018289752955965674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 112.99999999999999, 108, 121, 111.0, 121.0, 121.0, 121.0, 0.03643783704999271, 0.009749968116892582, 0.020780953942573968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f8d4c74-95e8-47b2-aea4-6e8ff395c329", 3, 0, 0.0, 647.3333333333334, 262, 1081, 599.0, 1081.0, 1081.0, 1081.0, 0.05190491020450534, 0.03397811667358732, 0.03328537535900896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 109.5, 103, 117, 108.5, 117.0, 117.0, 117.0, 0.03643866689137178, 0.00982135943556505, 0.021421950652935364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 111.0, 105, 119, 109.5, 119.0, 119.0, 119.0, 0.036438168982008655, 0.00982122523343202, 0.02145724208608517], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1215.2500000000002, 821, 1797, 1157.5, 1615.4, 1743.7, 1797.0, 0.24534286665615196, 293.51536350174365, 0.48445632458861254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86497797-00ed-4ad1-9c1c-9a705cdc78a3", 3, 0, 0.0, 356.66666666666663, 201, 636, 233.0, 636.0, 636.0, 636.0, 0.07692110458706188, 0.03480479667188021, 0.04932766147021871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1070.6799999999998, 154, 2016, 1121.0, 1791.2000000000005, 1986.0, 2016.0, 0.10619453990153642, 0.03308623633807244, 0.0479119896821385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 141.14285714285714, 104, 332, 111.0, 332.0, 332.0, 332.0, 0.08517991214300491, 0.02295864819479429, 0.050159655295148396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 139.71428571428572, 105, 328, 109.0, 328.0, 328.0, 328.0, 0.08517265714355243, 0.022956692745723112, 0.05007220664103375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49e3b356-191f-4ff9-a680-9e6c2551d4c9", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 256.2, 104, 1313, 110.5, 1210.6000000000017, 1312.15, 1313.0, 0.0948973684959716, 8.561901924162768, 0.054973749015439805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 202.85, 103, 639, 109.0, 593.9000000000005, 638.2, 639.0, 0.09479616454718241, 2.810317466430308, 0.05500769626360917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad6ff4ac-f5a6-4f24-9625-f46d42c2cc65", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 121.49999999999999, 105, 315, 111.0, 121.80000000000001, 305.34999999999985, 315.0, 0.09489781877363548, 0.07052464852220372, 0.047634256689110005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 138.2857142857143, 104, 314, 110.0, 314.0, 314.0, 314.0, 0.08517887563884156, 0.022792003833049402, 0.048578577512776826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 119.15, 104, 324, 107.0, 115.9, 313.59999999999985, 324.0, 0.0948973684959716, 0.03964559984626626, 0.05332416585213092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 111.57142857142857, 105, 117, 112.0, 117.0, 117.0, 117.0, 0.08517162081594414, 0.06329648773528661, 0.042752161229878204], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 585.7333333333332, 415, 1017, 572.0, 901.8000000000001, 1017.0, 1017.0, 0.11108560256533684, 0.020069176244714177, 0.07561197752738259], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 142.14285714285714, 111, 311, 115.0, 311.0, 311.0, 311.0, 0.09013301057131452, 0.07094453761765578, 0.03203946860152196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1547.9199999999998, 1076, 2944, 1405.0, 2271.6000000000004, 2789.7999999999997, 2944.0, 0.10621800182694964, 0.054976114226839165, 0.04885613169970046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/730b74ff-2412-4ad1-9272-4c7a79224c43", 3, 0, 0.0, 341.3333333333333, 212, 460, 352.0, 460.0, 460.0, 460.0, 0.028385973544272657, 0.033551259745850916, 0.018203244753325888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 284.8571428571429, 215, 450, 226.0, 450.0, 450.0, 450.0, 0.08505364454866891, 0.1318165370104859, 0.1912876400347505], "isController": false}, {"data": ["addBook", 63, 12, 19.047619047619047, 1070.2698412698414, 555, 2148, 909.0, 1953.4, 2078.7999999999997, 2148.0, 0.2955276810927957, 90.96506206081303, 1.073912741054424], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 202.50000000000003, 106, 738, 114.0, 444.0, 451.05, 738.0, 0.24646694042101833, 0.18316537271522945, 0.11914173389492586], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 698.8928571428571, 509, 999, 652.5, 910.3, 988.45, 999.0, 0.2466221572392411, 72.51510285465146, 0.12403360447090739], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 188.32142857142858, 102, 483, 114.5, 334.90000000000003, 361.49999999999983, 483.0, 0.24717295927825497, 0.4373802755978496, 0.12020716183649507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b053195-0446-425d-9ea8-100d6575fa2b", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1010.3392857142857, 711, 1352, 1006.5, 1297.1000000000001, 1350.3, 1352.0, 0.24617440577454824, 221.50816304438612, 0.12356801227355252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 132.4, 106, 352, 115.0, 229.60000000000008, 352.0, 352.0, 0.08272074029547849, 0.06179820930277445, 0.029404638151908368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 12, 6.593406593406593, 169.0274725274726, 104, 583, 117.0, 308.80000000000007, 367.79999999999995, 532.3699999999992, 0.7381450657841372, 1.5737546843821484, 0.35636665328271766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 117.375, 113, 126, 116.0, 126.0, 126.0, 126.0, 0.03592195954289306, 0.02781847062257246, 0.012769134056262768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5db9ea07-6734-4013-8aaa-7958efbe157a", 3, 0, 0.0, 296.6666666666667, 196, 480, 214.0, 480.0, 480.0, 480.0, 0.022637067443369602, 0.026756247359008795, 0.014516609005025428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 130.4, 107, 315, 113.0, 221.40000000000006, 315.0, 315.0, 0.09039248416624986, 0.0733556194747594, 0.032131703355971625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 226.25, 216, 233, 228.5, 233.0, 233.0, 233.0, 0.03641876112479343, 0.05644196670414764, 0.0819066473343743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 402.25, 214, 1428, 230.0, 1327.7000000000016, 1426.8, 1428.0, 0.09474766328575422, 11.467270826128564, 0.21066550758691915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/073ef21c-a000-4e9d-8c03-d1ae92a2cce5", 3, 0, 0.0, 508.6666666666667, 386, 594, 546.0, 594.0, 594.0, 594.0, 0.023673681967756446, 0.027981490633113167, 0.015181365063958398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95e63abd-383c-4976-b329-fa2dcdc50bd3", 3, 0, 0.0, 329.0, 223, 536, 228.0, 536.0, 536.0, 536.0, 0.02455433875165742, 0.02902239713778258, 0.015746109160405312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30284c23-418a-49de-a5bb-3abf6883c979", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 0.5735367063492064, 2.1887400793650795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 140.06249999999997, 107, 476, 114.0, 242.20000000000024, 476.0, 476.0, 0.08076362002735868, 0.06696124355783936, 0.028708943056600152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1eece7d-f196-4361-abaa-f82a8e9c915c", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 122.19999999999999, 105, 317, 112.0, 121.9, 307.2499999999999, 317.0, 0.09800990880177986, 0.07609167724356933, 0.034839459769382686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6ade7d7-1422-401c-aa7e-23e6706006a8", 3, 0, 0.0, 399.6666666666667, 226, 572, 401.0, 572.0, 572.0, 572.0, 0.0343611123837449, 0.03471904063774224, 0.02203495813671141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a729bc0-8036-41a4-ba57-4e90e29db38c", 3, 0, 0.0, 390.0, 242, 513, 415.0, 513.0, 513.0, 513.0, 0.02778498129144593, 0.027866382603823216, 0.017817842820360835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 108.46666666666667, 104, 113, 107.0, 113.0, 113.0, 113.0, 0.07843998556704265, 0.05829377833644478, 0.03937319588033195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 192.93333333333334, 104, 343, 112.0, 329.8, 343.0, 343.0, 0.07844121615261523, 0.020989153540836497, 0.04473600608703837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 137.86666666666667, 104, 332, 109.0, 325.4, 332.0, 332.0, 0.07844121615261523, 0.021142359041134574, 0.04611485558972106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 185.13333333333333, 103, 415, 111.0, 362.8, 415.0, 415.0, 0.07843875502008033, 0.021141695689006024, 0.046190009059676206], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 42.857142857142854, 0.6559766763848397], "isController": false}, {"data": ["401/Unauthorized", 12, 57.142857142857146, 0.8746355685131195], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1372, 21, "401/Unauthorized", 12, "406/Not Acceptable", 9, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
