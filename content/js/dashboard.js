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

    var data = {"OkPercent": 97.53846153846153, "KoPercent": 2.4615384615384617};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7410071942446043, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8d8df0e-5c0b-4d27-8790-3695761f51de"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e752155c-dabc-43a0-9ab5-84a664d647b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a31079b9-ca52-4e96-b716-cf8a09fede72"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cae40e75-8fa7-400b-9cd0-f445678b8816"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/781c8a0b-5982-42ed-be62-76a0d973d238"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a16f2f2-225e-4b62-99f3-aeb1fd547595"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b31949e2-4e1e-488c-b3fe-10a134aff359"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c78aae4-b04f-4d07-bb9b-cfbd1f385696"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=644dcc7d-217c-4f75-b9a1-7ffd7d1dd1ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff098c8a-fc12-4662-a825-d93e6a879ea4"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88aea48c-f564-4b31-9fb9-0db1929b7a92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=781c8a0b-5982-42ed-be62-76a0d973d238"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c795c50-41d8-4373-bdd1-49dfec4a6232"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b3f80e8-47b2-4866-8b2a-b0dd8e9bedaa"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "register"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc81c5ee-5969-4c45-9db1-d08344febab9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae40e75-8fa7-400b-9cd0-f445678b8816"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/644dcc7d-217c-4f75-b9a1-7ffd7d1dd1ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a31079b9-ca52-4e96-b716-cf8a09fede72"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3490566037735849, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e752155c-dabc-43a0-9ab5-84a664d647b4"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8d8df0e-5c0b-4d27-8790-3695761f51de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1e02f5d-e7cc-4a4b-a5ba-116c63ee7197"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c78aae4-b04f-4d07-bb9b-cfbd1f385696"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9716981132075472, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9364161849710982, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff098c8a-fc12-4662-a825-d93e6a879ea4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7d6d38c-cd46-4b8e-a35a-a9630273f99f"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88aea48c-f564-4b31-9fb9-0db1929b7a92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a16f2f2-225e-4b62-99f3-aeb1fd547595"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1e02f5d-e7cc-4a4b-a5ba-116c63ee7197"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc81c5ee-5969-4c45-9db1-d08344febab9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b3f80e8-47b2-4866-8b2a-b0dd8e9bedaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 32, 2.4615384615384617, 445.7715384615376, 137, 2404, 176.5, 1147.8000000000002, 1338.9, 1835.95, 5.069372411695432, 693.6968736473549, 3.6949487176924998], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2150.0000000000005, 1742, 2758, 2118.0, 2506.8, 2636.3, 2758.0, 0.23926793042269162, 287.9198448553445, 1.1764785446076684], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8d8df0e-5c0b-4d27-8790-3695761f51de", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e752155c-dabc-43a0-9ab5-84a664d647b4", 3, 0, 0.0, 499.33333333333337, 257, 978, 263.0, 978.0, 978.0, 978.0, 0.07063144511936714, 0.031958889555963654, 0.04529425354334417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a31079b9-ca52-4e96-b716-cf8a09fede72", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 529.2941176470588, 142, 1067, 540.0, 930.9999999999999, 1067.0, 1067.0, 0.08780946379409198, 0.018224700866731062, 0.05869433138258583], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 529.2941176470588, 142, 1067, 540.0, 930.9999999999999, 1067.0, 1067.0, 0.0884684037697948, 0.0183614627079658, 0.059134785516161095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae40e75-8fa7-400b-9cd0-f445678b8816", 3, 0, 0.0, 653.6666666666667, 327, 1215, 419.0, 1215.0, 1215.0, 1215.0, 0.020486066060734356, 0.024213836545093244, 0.01313722335274957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/781c8a0b-5982-42ed-be62-76a0d973d238", 3, 0, 0.0, 388.0, 261, 620, 283.0, 620.0, 620.0, 620.0, 0.02005950987930862, 0.023709661579352077, 0.012863683093176422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 197.83333333333331, 139, 444, 150.5, 440.40000000000003, 444.0, 444.0, 0.0668311455415272, 0.01788255261560396, 0.038114637691652235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a16f2f2-225e-4b62-99f3-aeb1fd547595", 3, 0, 0.0, 394.6666666666667, 318, 498, 368.0, 498.0, 498.0, 498.0, 0.027279671189029932, 0.027359592100716548, 0.017493799558069328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 174.16666666666666, 142, 429, 152.0, 347.7000000000003, 429.0, 429.0, 0.06682593514542993, 0.04966263344303924, 0.03354348697729589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 269.83333333333326, 140, 462, 153.0, 459.3, 462.0, 462.0, 0.0668281680728427, 0.018012279675883387, 0.039352915378832176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 273.25, 143, 483, 150.0, 472.20000000000005, 483.0, 483.0, 0.06682742374712503, 0.01801207905684229, 0.03928721591383717], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 248.35294117647058, 139, 369, 245.0, 368.2, 369.0, 369.0, 0.08835483300936561, 0.14717007915553568, 0.057099716874733634], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b31949e2-4e1e-488c-b3fe-10a134aff359", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 152.1764705882353, 139, 175, 152.0, 170.2, 175.0, 175.0, 0.08909573074221984, 0.06621274520979424, 0.044721880470215816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 920.5, 734, 1046, 993.5, 1046.0, 1046.0, 1046.0, 0.025828892198813593, 7.594551906387485, 0.014730540082135877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 183.7058823529412, 142, 425, 150.0, 425.0, 425.0, 425.0, 0.0891008674231505, 0.03958559907230274, 0.04993497602138421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1157.6666666666667, 951, 1351, 1137.5, 1351.0, 1351.0, 1351.0, 0.025823000546586844, 23.235581283811992, 0.014701962225254033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c78aae4-b04f-4d07-bb9b-cfbd1f385696", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 347.16666666666663, 151, 455, 432.0, 455.0, 455.0, 455.0, 0.025922853587722935, 0.04587129951265036, 0.014353767562733306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 185.00000000000003, 139, 463, 150.0, 455.0, 463.0, 463.0, 0.07804215194347912, 0.057998122684558215, 0.03917350204975417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 200.11764705882356, 140, 453, 150.0, 451.4, 453.0, 453.0, 0.0780468097218779, 0.020883619007611858, 0.04451107116950848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 198.7058823529412, 137, 474, 149.0, 448.4, 474.0, 474.0, 0.07804788467277277, 0.021036343915708286, 0.045883619700204305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=644dcc7d-217c-4f75-b9a1-7ffd7d1dd1ba", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 230.4705882352941, 140, 448, 149.0, 446.4, 448.0, 448.0, 0.07804537650007805, 0.02103566788478666, 0.04595836135697955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 199.33333333333334, 145, 444, 151.5, 444.0, 444.0, 444.0, 0.025922629591545766, 0.019264766717935866, 0.014556164077284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 1030.3333333333335, 138, 1501, 1329.5, 1479.1000000000001, 1501.0, 1501.0, 0.06009946461393607, 40.56225259836279, 0.03145831350885716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 309.5882352941176, 137, 1390, 151.0, 1116.3999999999996, 1390.0, 1390.0, 0.08909759855766711, 9.45297472969361, 0.05147883997547196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 791.75, 144, 1190, 1032.5, 1186.7, 1190.0, 1190.0, 0.06009916361997295, 13.257411838909201, 0.03151684654680222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 255.64705882352948, 137, 1101, 150.0, 798.5999999999997, 1101.0, 1101.0, 0.0891018014287736, 3.103412467962661, 0.0515682817896883], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 604.7058823529412, 139, 2202, 474.0, 1530.7999999999995, 2202.0, 2202.0, 0.08753456327976561, 0.01816764574504786, 0.058882682445200785], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 456.70588235294116, 294, 906, 306.0, 900.4, 906.0, 906.0, 0.07799023745733476, 0.12086963559061548, 0.17540187193773626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff098c8a-fc12-4662-a825-d93e6a879ea4", 1, 0, 0.0, 1193.0, 1193, 1193, 1193.0, 1193.0, 1193.0, 1193.0, 0.8382229673093042, 0.1514367665549036, 0.5779154442581727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 653.6818181818181, 203, 1371, 617.5, 1231.5999999999997, 1370.25, 1371.0, 0.09342857385528763, 0.05738923140134367, 0.04224358368652165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 150.91666666666666, 139, 175, 148.5, 170.20000000000002, 175.0, 175.0, 0.06009856164109139, 0.044663091219600146, 0.03016666082375095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88aea48c-f564-4b31-9fb9-0db1929b7a92", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 221.49999999999997, 140, 452, 150.0, 449.90000000000003, 452.0, 452.0, 0.060098862629024745, 0.0837803968778641, 0.030489608531033552], "isController": false}, {"data": ["login", 22, 0, 0.0, 2627.2272727272725, 1507, 4395, 2395.0, 4152.799999999999, 4379.099999999999, 4395.0, 0.09221380189122125, 30.21299587186054, 0.1808336887406948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 178.94117647058823, 153, 457, 159.0, 252.19999999999982, 457.0, 457.0, 0.08882479570296987, 0.07190991761500198, 0.031574439097540076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=781c8a0b-5982-42ed-be62-76a0d973d238", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c795c50-41d8-4373-bdd1-49dfec4a6232", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1184.6666666666667, 292, 1648, 1490.5, 1627.3000000000002, 1648.0, 1648.0, 0.06005374810455358, 53.90713849051151, 0.1235383011545333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 668.5714285714286, 139, 1796, 152.0, 1634.0, 1796.0, 1796.0, 0.06021401782334928, 30.882163586432924, 0.08098818998812923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 525.5, 298, 883, 586.0, 808.9000000000003, 883.0, 883.0, 0.06677053193857112, 0.10348128338526597, 0.15016849126418874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b3f80e8-47b2-4866-8b2a-b0dd8e9bedaa", 3, 0, 0.0, 447.33333333333337, 268, 705, 369.0, 705.0, 705.0, 705.0, 0.029057660083492344, 0.024053915882917002, 0.018633981238437472], "isController": false}, {"data": ["register", 26, 7, 26.923076923076923, 1104.1538461538462, 234, 2404, 1031.5, 1816.0000000000002, 2286.3999999999996, 2404.0, 0.10587871186330244, 0.03332570633317587, 0.047769496953950906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc81c5ee-5969-4c45-9db1-d08344febab9", 1, 0, 0.0, 2202.0, 2202, 2202, 2202.0, 2202.0, 2202.0, 2202.0, 0.45413260672116257, 0.08204544164396003, 0.31310314486830154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae40e75-8fa7-400b-9cd0-f445678b8816", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 229.87500000000003, 144, 505, 153.5, 470.70000000000005, 505.0, 505.0, 0.0897791992817664, 0.069701624442387, 0.0319136997446904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 483.1764705882353, 293, 1539, 309.0, 1267.7999999999997, 1539.0, 1539.0, 0.08902621036369825, 12.651893811696473, 0.19754224653714225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/644dcc7d-217c-4f75-b9a1-7ffd7d1dd1ba", 3, 0, 0.0, 381.3333333333333, 245, 478, 421.0, 478.0, 478.0, 478.0, 0.033429163602326666, 0.027868518224465687, 0.021437321711127454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a31079b9-ca52-4e96-b716-cf8a09fede72", 3, 0, 0.0, 417.6666666666667, 232, 616, 405.0, 616.0, 616.0, 616.0, 0.028765389483373607, 0.028849663085375676, 0.01844655510489779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 582.1000000000001, 292, 1433, 590.5, 1211.4000000000008, 1423.7499999999998, 1433.0, 0.10850517840963961, 13.132337238841599, 0.24125448262018304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 182.89999999999998, 144, 456, 152.5, 426.4000000000001, 456.0, 456.0, 0.08634012830143066, 0.06416488050526244, 0.04333869721380406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 181.5, 140, 411, 150.5, 390.80000000000007, 411.0, 411.0, 0.08629170046424935, 0.02308977141328547, 0.04921323542101721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 158.3, 144, 233, 150.5, 225.50000000000003, 233.0, 233.0, 0.0862738331464067, 0.02325349409024243, 0.05071957768958675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 148.75, 139, 155, 150.5, 155.0, 155.0, 155.0, 0.021660610720919276, 0.006388187927458614, 0.013389811119474513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 263.1, 138, 467, 149.5, 465.2, 467.0, 467.0, 0.08611335962661247, 0.023210241461860393, 0.05070933188949933], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1381.9056603773583, 1099, 2133, 1213.0, 1882.4, 1989.6, 2133.0, 0.23303771253698924, 278.7941212114883, 0.460158451904094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, 26.923076923076923, 1104.1538461538462, 234, 2404, 1031.5, 1816.0000000000002, 2286.3999999999996, 2404.0, 0.10476478291528156, 0.032975093180215576, 0.04726692354185554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 209.55555555555554, 139, 434, 149.0, 434.0, 434.0, 434.0, 0.04342874790094385, 0.011705404707676273, 0.025573764633075334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 246.0, 144, 453, 150.0, 453.0, 453.0, 453.0, 0.04342874790094385, 0.011705404707676273, 0.02553135374645332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e752155c-dabc-43a0-9ab5-84a664d647b4", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 272.125, 140, 1040, 150.0, 986.8000000000001, 1040.0, 1040.0, 0.0958548757181627, 10.803904607174736, 0.05532249174749429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 267.5, 138, 950, 147.0, 798.1000000000001, 950.0, 950.0, 0.09569149063419535, 3.5396273040716726, 0.05532164302289418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 166.87500000000003, 139, 433, 150.5, 243.30000000000018, 433.0, 433.0, 0.09584913346392777, 0.07123163141215727, 0.048111772070760624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 209.55555555555557, 139, 426, 152.0, 426.0, 426.0, 426.0, 0.04342623330502587, 0.011619910083571374, 0.024766523681772564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 220.43749999999997, 138, 456, 149.5, 447.6, 456.0, 456.0, 0.0958502818597351, 0.04364276749716942, 0.05365837312118471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 181.77777777777777, 142, 416, 153.0, 416.0, 416.0, 416.0, 0.04342874790094385, 0.03227468471935378, 0.02179919572371596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8d8df0e-5c0b-4d27-8790-3695761f51de", 3, 0, 0.0, 356.6666666666667, 215, 610, 245.0, 610.0, 610.0, 610.0, 0.06011060351045924, 0.027198482708183057, 0.03854748988138174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 155.0, 147, 162, 155.0, 162.0, 162.0, 162.0, 0.04447585208319949, 0.0350073601357996, 0.01580977554519982], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 567.0588235294117, 139, 1215, 534.0, 1138.1999999999998, 1215.0, 1215.0, 0.08584861354489125, 0.01726539499199588, 0.05841433981153704], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1e02f5d-e7cc-4a4b-a5ba-116c63ee7197", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1370.7272727272727, 674, 2356, 1201.0, 2296.8, 2349.1, 2356.0, 0.09141527466134797, 0.04731454645558049, 0.0420474554350536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 432.5555555555556, 299, 869, 318.0, 869.0, 869.0, 869.0, 0.04339545312085633, 0.06725447666288965, 0.09759739114973842], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 1342.05, 752, 2458, 1216.0, 2177.7, 2230.2, 2458.0, 0.2831083408435685, 85.77945882366126, 1.0297052163891418], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 267.99999999999994, 140, 608, 158.0, 582.2, 587.6, 608.0, 0.23439814958140026, 0.17419628108539612, 0.11330769926054018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c78aae4-b04f-4d07-bb9b-cfbd1f385696", 3, 0, 0.0, 336.6666666666667, 234, 534, 242.0, 534.0, 534.0, 534.0, 0.027657671777189797, 0.023057062962689803, 0.017736202278992155], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 841.3207547169811, 680, 1363, 749.0, 1054.6, 1199.5, 1363.0, 0.2339821555495711, 68.79852267033239, 0.11767657237112218], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 262.60377358490575, 138, 597, 155.0, 460.0, 528.2999999999998, 597.0, 0.23490721165139772, 0.4156756518675123, 0.1142419837914024], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1101.1698113207547, 958, 1504, 1044.0, 1394.2, 1433.6, 1504.0, 0.23368400631387728, 210.26927965389416, 0.11729841723177045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 158.75, 149, 180, 158.0, 167.70000000000002, 179.39999999999998, 180.0, 0.11095392638206984, 0.08289038445535492, 0.03944065351862639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, 5.202312138728324, 213.05780346820808, 140, 726, 157.0, 354.6, 415.3999999999992, 696.3999999999996, 0.7211338057523968, 1.5160898746873697, 0.3489165407461442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 153.70000000000002, 142, 163, 155.0, 162.9, 163.0, 163.0, 0.09264062847402356, 0.07174220544912177, 0.032930848402875565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 153.33333333333334, 147, 163, 152.0, 162.1, 163.0, 163.0, 0.06805228684038904, 0.05522602574644852, 0.02419046133779454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 450.7, 289, 870, 316.5, 845.1000000000001, 870.0, 870.0, 0.08600596881423571, 0.1332924536212813, 0.19342943962811018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff098c8a-fc12-4662-a825-d93e6a879ea4", 3, 0, 0.0, 330.0, 234, 477, 279.0, 477.0, 477.0, 477.0, 0.026301254569842985, 0.02637830902659057, 0.016866364421416234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7d6d38c-cd46-4b8e-a35a-a9630273f99f", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 514.75, 289, 1190, 316.5, 1138.2, 1190.0, 1190.0, 0.09560343694355812, 14.42651428748551, 0.21195674093858674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88aea48c-f564-4b31-9fb9-0db1929b7a92", 3, 0, 0.0, 347.6666666666667, 243, 449, 351.0, 449.0, 449.0, 449.0, 0.018828727617350046, 0.02595692104800698, 0.012074411916074085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a16f2f2-225e-4b62-99f3-aeb1fd547595", 1, 0, 0.0, 1363.0, 1363, 1363, 1363.0, 1363.0, 1363.0, 1363.0, 0.7336757153338225, 0.1325488352898019, 0.5058350146735143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 174.41176470588235, 140, 445, 155.0, 235.3999999999998, 445.0, 445.0, 0.08039573618848543, 0.06665623049221107, 0.02857817184825068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1e02f5d-e7cc-4a4b-a5ba-116c63ee7197", 3, 0, 0.0, 451.0, 231, 814, 308.0, 814.0, 814.0, 814.0, 0.054514728062364855, 0.035686561892387926, 0.03495898902436809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 163.58333333333331, 147, 248, 156.0, 224.30000000000007, 248.0, 248.0, 0.058901487262553384, 0.04572918200559564, 0.020937638050360773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc81c5ee-5969-4c45-9db1-d08344febab9", 3, 0, 0.0, 592.6666666666667, 306, 1119, 353.0, 1119.0, 1119.0, 1119.0, 0.08784515826769347, 0.03888978360809346, 0.05633299537348833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b3f80e8-47b2-4866-8b2a-b0dd8e9bedaa", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 176.44999999999996, 139, 440, 149.0, 388.3000000000005, 438.7, 440.0, 0.10915660151836833, 0.08112126343308426, 0.054791497246524726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 211.35, 142, 451, 151.5, 450.7, 451.0, 451.0, 0.10898766804536067, 0.04553215272441923, 0.061241703313770046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 336.1, 138, 1288, 152.5, 951.2000000000012, 1273.9499999999998, 1288.0, 0.10864723329820405, 9.802452592458796, 0.06293900272704556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 364.75, 144, 1171, 298.5, 1036.7000000000012, 1167.45, 1171.0, 0.10859237138591013, 3.2193184131939727, 0.06301326863037872], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.875, 0.5384615384615384], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.5, 0.3076923076923077], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 12.5, 0.3076923076923077], "isController": false}, {"data": ["401/Unauthorized", 17, 53.125, 1.3076923076923077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 32, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
