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

    var data = {"OkPercent": 98.05389221556887, "KoPercent": 1.9461077844311376};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8150641025641026, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49122807017543857, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e1e8629-60b8-4b65-8bf4-36285c1e4e53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dbfc8b8-638e-4ace-a377-f1b1963b2ce3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b9b48da-0cc7-4d0d-995c-816c02016f57"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c154ddd-6697-4ad4-92c4-6e0b74dad4ae"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98cff3f2-020f-4f3a-87e4-5eb1b6cc7f80"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d76caba6-1b27-4369-a739-6e06c17b0942"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14df6ff4-2c5d-45cc-badb-58594be6122f"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/dc13311a-40d9-4919-89c4-ff69ed91b0c9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d025a792-5ea9-46e1-bcd5-b6ddd79d66f3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af8dba29-c7f9-49a5-8a85-7d03aabda413"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76c8b428-d926-4cd0-a0e3-b70412ff323b"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7faa4e12-cf22-4fcd-8316-065a30addeea"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0b9b48da-0cc7-4d0d-995c-816c02016f57"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dbfc8b8-638e-4ace-a377-f1b1963b2ce3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/218cd34a-0888-4b8f-bd67-8b0796c5f74b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/82145c17-57ca-478b-93dd-7e2ed53b425c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c154ddd-6697-4ad4-92c4-6e0b74dad4ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e1e8629-60b8-4b65-8bf4-36285c1e4e53"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4e0e32b-6c44-4a13-8d43-e83f13e5337e"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9342857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4e0e32b-6c44-4a13-8d43-e83f13e5337e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14df6ff4-2c5d-45cc-badb-58594be6122f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af8dba29-c7f9-49a5-8a85-7d03aabda413"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98cff3f2-020f-4f3a-87e4-5eb1b6cc7f80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d025a792-5ea9-46e1-bcd5-b6ddd79d66f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=218cd34a-0888-4b8f-bd67-8b0796c5f74b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d76caba6-1b27-4369-a739-6e06c17b0942"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc13311a-40d9-4919-89c4-ff69ed91b0c9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7faa4e12-cf22-4fcd-8316-065a30addeea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 26, 1.9461077844311376, 275.1489520958082, 78, 3021, 89.0, 704.1999999999998, 813.1499999999999, 1579.4499999999982, 5.258496841359495, 747.4229266501683, 3.8454072715151635], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1169.80701754386, 956, 1706, 1136.0, 1373.8, 1442.7999999999997, 1706.0, 0.25471445169362766, 306.5082623349383, 1.2524289690209134], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0e1e8629-60b8-4b65-8bf4-36285c1e4e53", 3, 0, 0.0, 277.6666666666667, 175, 478, 180.0, 478.0, 478.0, 478.0, 0.060371890847621346, 0.027984886903324478, 0.03871504719069468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dbfc8b8-638e-4ace-a377-f1b1963b2ce3", 3, 0, 0.0, 282.6666666666667, 183, 471, 194.0, 471.0, 471.0, 471.0, 0.051932764381048005, 0.03338776355877923, 0.03330323757508612], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 522.1999999999999, 81, 1127, 471.0, 894.2000000000002, 1127.0, 1127.0, 0.10279746158801518, 0.020137862104058442, 0.0692142804520347], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 522.1999999999999, 81, 1127, 471.0, 894.2000000000002, 1127.0, 1127.0, 0.10167837097692578, 0.01991863400192511, 0.0684607885835525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 108.78947368421053, 80, 254, 82.0, 246.0, 254.0, 254.0, 0.09384477087058313, 0.03994769697523486, 0.0526912148946469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 82.36842105263159, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.09385311493548833, 0.06974826217373693, 0.047109864332852545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 132.89473684210526, 79, 564, 82.0, 551.0, 564.0, 564.0, 0.0938443073549241, 2.9271937959034493, 0.05441291279147301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 152.31578947368422, 78, 714, 82.0, 634.0, 714.0, 714.0, 0.09385172415496401, 8.911890751036074, 0.054325561134519154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b9b48da-0cc7-4d0d-995c-816c02016f57", 1, 0, 0.0, 1066.0, 1066, 1066, 1066.0, 1066.0, 1066.0, 1066.0, 0.9380863039399625, 0.16947848264540336, 0.6467665337711069], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 180.50000000000003, 81, 324, 186.5, 256.1000000000001, 324.0, 324.0, 0.09959415382317059, 0.18182741266837638, 0.06436782805380575], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 99.45000000000002, 78, 265, 82.0, 227.40000000000032, 263.9, 265.0, 0.08537303748730077, 0.06344617336702722, 0.04285326295749277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 82.60000000000001, 78, 108, 81.0, 84.9, 106.84999999999998, 108.0, 0.08537340191663288, 0.02925539719975242, 0.04833101669050008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 533.4285714285714, 394, 639, 557.0, 639.0, 639.0, 639.0, 0.07668123610152595, 22.546829470516062, 0.04373226746415152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 668.4285714285714, 547, 724, 713.0, 724.0, 724.0, 724.0, 0.07654037504783774, 68.8711640116724, 0.0435771861844623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 127.42857142857143, 80, 242, 83.0, 242.0, 242.0, 242.0, 0.07708147511920099, 0.13639807901952364, 0.042680855852135706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 93.07142857142858, 80, 249, 81.0, 165.5, 249.0, 249.0, 0.08845867084528579, 0.0657393051887329, 0.04440210626413759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 115.35714285714288, 80, 240, 81.5, 239.5, 240.0, 240.0, 0.08845922977284934, 0.023669754841563202, 0.05044940447982814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 104.64285714285715, 79, 261, 80.5, 250.5, 261.0, 261.0, 0.08845867084528579, 0.023842376126268435, 0.05200402328990434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 117.0, 79, 259, 82.0, 249.0, 259.0, 259.0, 0.08845811192478532, 0.023842225479727298, 0.05209007958070855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 81.57142857142858, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.07708232392194864, 0.05728481299277629, 0.04328353149914108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 171.8, 80, 1382, 82.0, 241.0, 1324.9499999999991, 1382.0, 0.08537413078463095, 3.8628500939649024, 0.04982380913759322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 377.15000000000026, 80, 792, 317.5, 719.4, 788.4, 792.0, 0.10115979707344706, 45.52551447659921, 0.05512418629588229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 139.3, 79, 739, 82.0, 239.8, 714.0499999999997, 739.0, 0.08537376634907624, 1.276996452186422, 0.049906969273981486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 316.2000000000001, 82, 641, 317.5, 563.6, 637.15, 641.0, 0.10107901852273014, 14.873915769590377, 0.05517887827559194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c154ddd-6697-4ad4-92c4-6e0b74dad4ae", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 478.4666666666667, 86, 1066, 410.0, 991.6, 1066.0, 1066.0, 0.10209846375844865, 0.02000092952143047, 0.06942163772742432], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 245.5, 163, 511, 170.5, 416.5, 511.0, 511.0, 0.08841230446671593, 0.13702180389519353, 0.19884134490903008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98cff3f2-020f-4f3a-87e4-5eb1b6cc7f80", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 407.909090909091, 103, 1071, 372.5, 849.0, 1039.9499999999996, 1071.0, 0.11477043304971124, 0.07049863514479333, 0.051893271974625295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 82.3, 81, 92, 82.0, 83.0, 91.55, 92.0, 0.10115979707344706, 0.07517832575477854, 0.050777476265382614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 129.64999999999998, 80, 243, 82.5, 242.9, 243.0, 243.0, 0.10116030874126228, 0.10303730665735993, 0.05344504592678017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d76caba6-1b27-4369-a739-6e06c17b0942", 3, 0, 0.0, 390.6666666666667, 206, 540, 426.0, 540.0, 540.0, 540.0, 0.033345189400675795, 0.02779851238773786, 0.021383471067490663], "isController": false}, {"data": ["login", 22, 0, 0.0, 2311.8636363636365, 1483, 3563, 2199.5, 3287.5, 3528.6499999999996, 3563.0, 0.11154093805928908, 42.6092671427648, 0.2271418712006368], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 106.80000000000001, 79, 248, 83.5, 239.20000000000005, 247.7, 248.0, 0.0862120990059745, 0.06979475593354771, 0.03064570706853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14df6ff4-2c5d-45cc-badb-58594be6122f", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc13311a-40d9-4919-89c4-ff69ed91b0c9", 3, 0, 0.0, 1244.6666666666667, 174, 1803, 1757.0, 1803.0, 1803.0, 1803.0, 0.06476544116059671, 0.028672200513805833, 0.04153252574426286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d025a792-5ea9-46e1-bcd5-b6ddd79d66f3", 3, 0, 0.0, 290.3333333333333, 181, 502, 188.0, 502.0, 502.0, 502.0, 0.01794537428068958, 0.024739147161041787, 0.01150793858494742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 476.70000000000005, 165, 874, 476.5, 802.3000000000001, 870.4499999999999, 874.0, 0.1010371463068397, 60.516070510667, 0.2143092595492733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af8dba29-c7f9-49a5-8a85-7d03aabda413", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 253.99999999999997, 162, 796, 166.0, 716.0, 796.0, 796.0, 0.09380538837899352, 11.943114399065403, 0.2084440972342222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 473.41666666666663, 81, 807, 639.5, 804.9, 807.0, 807.0, 0.09733781087263348, 67.93993838820752, 0.15476775299719342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76c8b428-d926-4cd0-a0e3-b70412ff323b", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["register", 25, 8, 32.0, 784.76, 109, 2508, 725.0, 1128.4, 2096.099999999999, 2508.0, 0.10055951313106122, 0.031471985125236815, 0.04536962408842801], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7faa4e12-cf22-4fcd-8316-065a30addeea", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 296.34999999999997, 160, 1626, 167.5, 486.4000000000004, 1569.8999999999992, 1626.0, 0.08534316486592589, 5.230656738322921, 0.19084698557273796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 83.38461538461539, 82, 87, 83.0, 86.2, 87.0, 87.0, 0.06934405854772205, 0.0538364517045303, 0.02464964581188557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b9b48da-0cc7-4d0d-995c-816c02016f57", 3, 0, 0.0, 731.6666666666667, 182, 1703, 310.0, 1703.0, 1703.0, 1703.0, 0.01998694186464843, 0.027553612889578805, 0.01281714696398353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 334.1333333333333, 163, 809, 323.0, 795.2, 809.0, 809.0, 0.07901640380543, 12.710277260330077, 0.1750141324130556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dbfc8b8-638e-4ace-a377-f1b1963b2ce3", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 104.5, 80, 239, 82.5, 239.0, 239.0, 239.0, 0.0477660419266433, 0.035498005767749564, 0.023976314013959624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 100.75, 79, 240, 81.0, 240.0, 240.0, 240.0, 0.047765756729000984, 0.012781071624752215, 0.027241408134508368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 101.375, 80, 242, 81.0, 242.0, 242.0, 242.0, 0.04776518634393322, 0.012874210381763253, 0.02808070525297637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 101.625, 79, 240, 82.5, 240.0, 240.0, 240.0, 0.047765756729000984, 0.012874364118363544, 0.028127686823816004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 90.0, 86, 94, 90.0, 94.0, 94.0, 94.0, 0.041517032362526726, 0.012244281028792062, 0.025664337388163493], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 770.9999999999997, 623, 1368, 645.0, 1037.4, 1053.9999999999995, 1368.0, 0.24152235352940427, 288.94470157688676, 0.47691230355122605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 784.76, 109, 2508, 725.0, 1128.4, 2096.099999999999, 2508.0, 0.1002570590995312, 0.0313773264650564, 0.0452331653359213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 103.57142857142857, 80, 240, 81.0, 240.0, 240.0, 240.0, 0.03653673507735349, 0.009847791876317933, 0.021515284425433743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 80.28571428571429, 78, 81, 81.0, 81.0, 81.0, 81.0, 0.03653711649076655, 0.00984789467915192, 0.02147982824945455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/218cd34a-0888-4b8f-bd67-8b0796c5f74b", 3, 0, 0.0, 937.0, 190, 2030, 591.0, 2030.0, 2030.0, 2030.0, 0.03390405153415833, 0.028264412753574053, 0.021741855964287734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 106.23076923076923, 80, 247, 81.0, 244.6, 247.0, 247.0, 0.06854913127158639, 0.018476133038044767, 0.040299391626459964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 129.53846153846155, 80, 393, 82.0, 331.79999999999995, 393.0, 393.0, 0.06854949273375377, 0.01847623046339457, 0.040366546990677266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 82.53846153846153, 81, 86, 82.0, 86.0, 86.0, 86.0, 0.06860628961353549, 0.05098572890224659, 0.034437141466169184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 126.42857142857143, 80, 243, 81.0, 243.0, 243.0, 243.0, 0.03650624778354924, 0.009768273332707512, 0.020819969439055428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 154.6923076923077, 80, 393, 82.0, 335.79999999999995, 393.0, 393.0, 0.06860737582064977, 0.0183578329832598, 0.03912764402271432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 82.99999999999999, 80, 91, 82.0, 91.0, 91.0, 91.0, 0.03653730720045933, 0.027153213651903853, 0.01834001552835556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82145c17-57ca-478b-93dd-7e2ed53b425c", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.5068824404761905, 0.9471106150793651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 84.42857142857143, 82, 90, 83.0, 90.0, 90.0, 90.0, 0.03725841907205246, 0.029326450949291292, 0.013244203654518647], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 660.4666666666667, 81, 1757, 478.0, 1724.6, 1757.0, 1757.0, 0.10395154471995453, 0.019984955179558967, 0.07074254537484927], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1290.4545454545455, 813, 2036, 1179.0, 1896.6, 2027.1499999999999, 2036.0, 0.11348454288941963, 0.05873711692518789, 0.05219845673917641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c154ddd-6697-4ad4-92c4-6e0b74dad4ae", 3, 0, 0.0, 338.3333333333333, 197, 488, 330.0, 488.0, 488.0, 488.0, 0.02094562515709219, 0.02475701983899796, 0.01343192759097383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 210.42857142857144, 161, 335, 163.0, 335.0, 335.0, 335.0, 0.036490832981457444, 0.056553664005442345, 0.0820687386291958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e1e8629-60b8-4b65-8bf4-36285c1e4e53", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 857.6440677966102, 419, 3354, 683.0, 1251.0, 1702.0, 3354.0, 0.2860023655788882, 88.1550029812111, 1.039310138965641], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a4e0e32b-6c44-4a13-8d43-e83f13e5337e", 3, 0, 0.0, 557.3333333333333, 188, 1266, 218.0, 1266.0, 1266.0, 1266.0, 0.019708964293926354, 0.02717039836744079, 0.012638886607758762], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 158.43859649122805, 80, 535, 83.0, 323.2, 325.2, 535.0, 0.2421286935245442, 0.1799413435275177, 0.11704463212368103], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 462.57894736842115, 392, 644, 401.0, 579.6000000000001, 637.5999999999999, 644.0, 0.24226144685336382, 71.23290921199153, 0.12184047375926013], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 133.15789473684214, 79, 251, 83.0, 243.2, 246.1, 251.0, 0.24259861420861778, 0.4292858290488432, 0.11798252917567545], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 610.1754385964913, 540, 806, 557.0, 719.4, 731.1999999999996, 806.0, 0.2420998980632008, 217.84191384349515, 0.1215228003950051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 94.93333333333334, 80, 244, 83.0, 159.40000000000003, 244.0, 244.0, 0.07987773381543983, 0.05967428356329245, 0.02839403819220713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 155.75428571428566, 81, 3021, 84.0, 243.0, 331.3999999999999, 1510.120000000018, 0.69980125644317, 1.5626772933986748, 0.33524072913292624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 103.75, 82, 246, 83.5, 246.0, 246.0, 246.0, 0.04695386782486207, 0.03636173553233948, 0.01669063270336894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 86.68421052631581, 81, 108, 84.0, 108.0, 108.0, 108.0, 0.09404264586509335, 0.07631781124403572, 0.0334292217723574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4e0e32b-6c44-4a13-8d43-e83f13e5337e", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14df6ff4-2c5d-45cc-badb-58594be6122f", 3, 0, 0.0, 411.0, 211, 801, 221.0, 801.0, 801.0, 801.0, 0.03767566277770103, 0.031408649861227975, 0.02416049989325229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af8dba29-c7f9-49a5-8a85-7d03aabda413", 3, 0, 0.0, 270.6666666666667, 185, 420, 207.0, 420.0, 420.0, 420.0, 0.024092902231002748, 0.028476994791917634, 0.015450200974959444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 227.375, 162, 479, 168.0, 479.0, 479.0, 479.0, 0.04774209719097436, 0.07399092601765264, 0.10737309553790424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98cff3f2-020f-4f3a-87e4-5eb1b6cc7f80", 3, 0, 0.0, 308.6666666666667, 180, 422, 324.0, 422.0, 422.0, 422.0, 0.044482007028157106, 0.028192209532494107, 0.02852524539240544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d025a792-5ea9-46e1-bcd5-b6ddd79d66f3", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 251.0, 163, 475, 169.0, 417.4, 475.0, 475.0, 0.06851914319446786, 0.10619128930627002, 0.15410115896177684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=218cd34a-0888-4b8f-bd67-8b0796c5f74b", 1, 0, 0.0, 942.0, 942, 942, 942.0, 942.0, 942.0, 942.0, 1.0615711252653928, 0.19178775212314225, 0.7319035297239915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 96.50000000000001, 82, 242, 84.0, 171.0, 242.0, 242.0, 0.08847376436908726, 0.07335373627866708, 0.03144965842807399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d76caba6-1b27-4369-a739-6e06c17b0942", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 86.1, 81, 124, 84.0, 90.50000000000001, 122.34999999999998, 124.0, 0.10029335807236166, 0.07786447233156985, 0.03565115462728481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc13311a-40d9-4919-89c4-ff69ed91b0c9", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.6042276337792643, 2.3058632943143813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7faa4e12-cf22-4fcd-8316-065a30addeea", 3, 0, 0.0, 529.6666666666666, 227, 942, 420.0, 942.0, 942.0, 942.0, 0.08001280204832772, 0.03620370926014829, 0.05131029298021017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 81.86666666666666, 80, 85, 82.0, 83.8, 85.0, 85.0, 0.07905096679332389, 0.05874783762667917, 0.03967987981618015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 144.86666666666665, 80, 243, 81.0, 242.4, 243.0, 243.0, 0.07905138339920949, 0.03698328392621871, 0.04419878129117259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 197.73333333333332, 79, 727, 82.0, 712.6, 727.0, 727.0, 0.07905096679332389, 9.50249232876243, 0.04556752994714125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 187.60000000000002, 80, 397, 239.0, 395.8, 397.0, 397.0, 0.07905096679332389, 3.1176136752902486, 0.045644728156900356], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 30.76923076923077, 0.5988023952095808], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.2245508982035928], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.1497005988023952], "isController": false}, {"data": ["401/Unauthorized", 13, 50.0, 0.9730538922155688], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 26, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
