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

    var data = {"OkPercent": 98.82352941176471, "KoPercent": 1.1764705882352942};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7371916508538899, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/41ed547a-efca-47f7-8b17-bb62d9b95738"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19c5eb55-fb8e-4e05-8b2c-3433a5acf060"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=364634ee-e6f2-482e-a659-91811c44eeca"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25d52202-ba29-4506-8813-f76c6df088a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e5b05d6-568f-4fe0-82ed-309b552aecc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08695287-91cb-42f2-9d94-ccdd946efc45"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f72a9dc-157c-4027-98a2-700ad7325b2c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3588220-d43f-4b5b-8fa4-3e955e609cee"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a51ab7f8-95c8-412f-9e2f-9f21be792d9e"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/612b2916-a059-4665-bc88-a1dc20aefc07"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1e85690-3c75-4f82-8440-86ef5670f258"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=509a4208-82db-422e-995b-4e16d108a57b"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3a4245f-332b-42cc-a698-fd26f2ff74be"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48ddc29e-64b1-44ec-b5a6-14237ac54a1f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/08695287-91cb-42f2-9d94-ccdd946efc45"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/509a4208-82db-422e-995b-4e16d108a57b"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1e85690-3c75-4f82-8440-86ef5670f258"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/364634ee-e6f2-482e-a659-91811c44eeca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19c5eb55-fb8e-4e05-8b2c-3433a5acf060"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25d52202-ba29-4506-8813-f76c6df088a0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41ed547a-efca-47f7-8b17-bb62d9b95738"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a5d069f-ade1-46c9-95be-84fa7bda5647"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3620689655172414, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f72a9dc-157c-4027-98a2-700ad7325b2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48ec330e-3626-4c66-8575-44c712ab0243"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4c8a4cd9-9d85-48db-b38c-a3db6207bc18"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4a5d069f-ade1-46c9-95be-84fa7bda5647"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7ebfc6e2-dd7f-411c-b92b-30363827a754"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3588220-d43f-4b5b-8fa4-3e955e609cee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48ddc29e-64b1-44ec-b5a6-14237ac54a1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3a4245f-332b-42cc-a698-fd26f2ff74be"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1360, 16, 1.1764705882352942, 469.9757352941178, 132, 3015, 157.0, 1270.0, 1567.95, 2072.920000000003, 5.280733090005437, 746.6898573401219, 3.851552034392715], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2290.068965517242, 1650, 3002, 2284.5, 2723.8, 2796.75, 3002.0, 0.25200079945081205, 303.2410157505931, 1.2390859621433972], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/41ed547a-efca-47f7-8b17-bb62d9b95738", 3, 0, 0.0, 791.6666666666666, 523, 1285, 567.0, 1285.0, 1285.0, 1285.0, 0.07207726683004181, 0.03261308622843689, 0.04622142436692134], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 625.7142857142858, 144, 1123, 564.0, 1104.0, 1123.0, 1123.0, 0.07382642353164517, 0.013940299142031494, 0.04992656083560965], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 625.7142857142858, 144, 1123, 564.0, 1104.0, 1123.0, 1123.0, 0.0723006052593526, 0.013652185995889195, 0.048894696427833666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 168.7894736842105, 134, 436, 139.0, 415.0, 436.0, 436.0, 0.08490557606199, 0.0361424743495786, 0.047672106954213554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 156.3157894736842, 135, 436, 141.0, 150.0, 436.0, 436.0, 0.08490178204371995, 0.06309595325710046, 0.042616714814914115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 341.0, 134, 1098, 145.0, 1097.0, 1098.0, 1098.0, 0.08490443782090526, 2.648341179546074, 0.049229387492682575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 318.42105263157896, 134, 1568, 140.0, 1536.0, 1568.0, 1568.0, 0.08490367901046995, 8.062210028800223, 0.049146033769321175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19c5eb55-fb8e-4e05-8b2c-3433a5acf060", 3, 0, 0.0, 471.0, 274, 761, 378.0, 761.0, 761.0, 761.0, 0.030647896532701308, 0.025549890306070328, 0.01965376177390025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=364634ee-e6f2-482e-a659-91811c44eeca", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 352.46666666666664, 141, 1285, 267.0, 789.4000000000003, 1285.0, 1285.0, 0.07675696697403568, 0.15122021989591755, 0.04961718262273439], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/25d52202-ba29-4506-8813-f76c6df088a0", 3, 0, 0.0, 473.33333333333337, 251, 739, 430.0, 739.0, 739.0, 739.0, 0.022281639928698752, 0.026336144069370175, 0.014288681855317887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 159.24999999999997, 134, 417, 143.0, 230.80000000000018, 417.0, 417.0, 0.087900496637806, 0.0653244901771195, 0.04412192897639872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 173.125, 133, 422, 139.5, 410.8, 422.0, 422.0, 0.08776356495600851, 0.03172215769467056, 0.049591985129560964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 974.25, 816, 1162, 959.5, 1162.0, 1162.0, 1162.0, 0.08385216862671112, 24.655321730289497, 0.047821939919921175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1480.0, 1159, 1734, 1513.5, 1734.0, 1734.0, 1734.0, 0.0823113013416742, 74.06385363507285, 0.046862781916207095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 210.25, 142, 411, 144.0, 411.0, 411.0, 411.0, 0.08509914049868096, 0.15058558846055656, 0.04712032486596886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 172.7, 137, 457, 142.0, 425.9000000000001, 457.0, 457.0, 0.09583592888974077, 0.07122181824716087, 0.04810514399348316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 223.70000000000002, 134, 425, 140.5, 424.9, 425.0, 425.0, 0.09583409201989515, 0.04003693805284292, 0.05385052397289812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 312.40000000000003, 134, 1590, 140.5, 1472.3000000000004, 1590.0, 1590.0, 0.09583960284068584, 8.646912901567937, 0.05551958242685043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 296.2, 134, 847, 145.0, 805.6000000000001, 847.0, 847.0, 0.09583592888974077, 2.841142214528727, 0.055611043892855434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e5b05d6-568f-4fe0-82ed-309b552aecc7", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 143.0, 141, 147, 142.0, 147.0, 147.0, 147.0, 0.08509008913186836, 0.06323589631772639, 0.04778007934650812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08695287-91cb-42f2-9d94-ccdd946efc45", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 805.7142857142857, 136, 1826, 148.0, 1736.6000000000001, 1818.3999999999999, 1826.0, 0.09812808986663926, 42.059486284847154, 0.05367292564227171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 251.6875, 134, 1378, 142.0, 701.1000000000007, 1378.0, 1378.0, 0.08789856505592546, 4.965415906138067, 0.05120263091392533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 605.1904761904761, 138, 1263, 415.0, 1253.4, 1263.0, 1263.0, 0.09812808986663926, 13.753338107342785, 0.0537687538550321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 265.06249999999994, 135, 1062, 140.5, 621.0000000000005, 1062.0, 1062.0, 0.08776693490436148, 1.6350769983433993, 0.05121166367710545], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 525.3076923076924, 144, 823, 531.0, 802.1999999999999, 823.0, 823.0, 0.07309283915077366, 0.013847666792236417, 0.04999326175389079], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f72a9dc-157c-4027-98a2-700ad7325b2c", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 544.8, 279, 1732, 289.0, 1645.9000000000003, 1732.0, 1732.0, 0.09570660184139503, 11.583330766203128, 0.21279764753172672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3588220-d43f-4b5b-8fa4-3e955e609cee", 3, 0, 0.0, 486.6666666666667, 437, 564, 459.0, 564.0, 564.0, 564.0, 0.04385900790924109, 0.0281971160874841, 0.028125730983465155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 546.5, 159, 1032, 484.0, 977.8, 1027.6499999999999, 1032.0, 0.10248956469886703, 0.06295501581600328, 0.046340496538647885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 140.1904761904762, 136, 145, 140.0, 144.0, 144.9, 145.0, 0.09812442176680031, 0.07292254391067873, 0.04925386014466343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 228.52380952380952, 135, 558, 144.0, 455.0, 548.3999999999999, 558.0, 0.09812533876605051, 0.09643698425789209, 0.05203782381361793], "isController": false}, {"data": ["login", 22, 0, 0.0, 2883.3181818181815, 1501, 5199, 2733.5, 3970.3, 5016.899999999998, 5199.0, 0.10098042815701538, 22.105713025098225, 0.18280290399056293], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 146.625, 138, 160, 145.5, 157.9, 160.0, 160.0, 0.08767843932378004, 0.07098186152286488, 0.03116694522837493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a51ab7f8-95c8-412f-9e2f-9f21be792d9e", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 963.2857142857141, 279, 1971, 556.0, 1882.0, 1963.6, 1971.0, 0.09805844283192783, 55.942455635850635, 0.2085885114611642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/612b2916-a059-4665-bc88-a1dc20aefc07", 2, 0, 0.0, 352.5, 235, 470, 352.5, 470.0, 470.0, 470.0, 0.015602084438480981, 0.026389463132274475, 0.009697975337005026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1e85690-3c75-4f82-8440-86ef5670f258", 3, 0, 0.0, 488.0, 339, 737, 388.0, 737.0, 737.0, 737.0, 0.05829997279334603, 0.03626668229429826, 0.037386375782191304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=509a4208-82db-422e-995b-4e16d108a57b", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 0.21951890947752128, 0.8377316221142164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 577.7894736842106, 276, 1708, 543.0, 1674.0, 1708.0, 1708.0, 0.08484870136829695, 10.802766925920386, 0.1885415247869851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1129.8333333333335, 141, 1876, 1477.0, 1876.0, 1876.0, 1876.0, 0.088353531932439, 70.47557438999249, 0.15233218811203225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3a4245f-332b-42cc-a698-fd26f2ff74be", 3, 0, 0.0, 412.6666666666667, 363, 504, 371.0, 504.0, 504.0, 504.0, 0.05572893446277307, 0.0358283351445237, 0.0357376304985882], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1129.3913043478262, 499, 1663, 1164.0, 1576.4, 1657.1999999999998, 1663.0, 0.09180170831005029, 0.029202547497405605, 0.04141834886644847], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/48ddc29e-64b1-44ec-b5a6-14237ac54a1f", 3, 0, 0.0, 389.6666666666667, 259, 643, 267.0, 643.0, 643.0, 643.0, 0.028375234095681292, 0.02845836466432098, 0.018196357802243535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08695287-91cb-42f2-9d94-ccdd946efc45", 3, 0, 0.0, 504.66666666666663, 257, 995, 262.0, 995.0, 995.0, 995.0, 0.056110425317023906, 0.026046050293644558, 0.035982271443534206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/509a4208-82db-422e-995b-4e16d108a57b", 3, 0, 0.0, 718.3333333333334, 314, 1287, 554.0, 1287.0, 1287.0, 1287.0, 0.03507992375963236, 0.02924468904570914, 0.02249591465054549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 464.50000000000006, 276, 1520, 287.0, 1036.3000000000004, 1520.0, 1520.0, 0.08769718163182531, 6.684688765785493, 0.19583063276257084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 149.27777777777777, 139, 170, 146.0, 163.70000000000002, 170.0, 170.0, 0.09710675809088114, 0.07539050066626025, 0.0345184179151179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1e85690-3c75-4f82-8440-86ef5670f258", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 758.1874999999999, 278, 1695, 571.0, 1688.7, 1695.0, 1695.0, 0.08797541087266109, 19.84500068558963, 0.19363826091857325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 142.6, 137, 147, 143.0, 146.9, 147.0, 147.0, 0.05538049166800503, 0.04115679117124202, 0.027798410856791588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/364634ee-e6f2-482e-a659-91811c44eeca", 3, 0, 0.0, 764.0, 236, 1531, 525.0, 1531.0, 1531.0, 1531.0, 0.022619999095200037, 0.031183494846410205, 0.014505663482273461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 167.4, 134, 412, 140.5, 385.5000000000001, 412.0, 412.0, 0.0553801849698178, 0.014818526056377028, 0.031584011740599216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19c5eb55-fb8e-4e05-8b2c-3433a5acf060", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 142.1, 136, 162, 140.0, 160.3, 162.0, 162.0, 0.05537987827502756, 0.01492660781631602, 0.03255731125152987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 168.7, 136, 417, 142.5, 389.80000000000007, 417.0, 417.0, 0.05537987827502756, 0.01492660781631602, 0.03261139316390783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 2.048068576388889, 4.292805989583334], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1573.1034482758628, 1085, 2416, 1410.5, 2158.0, 2224.7, 2416.0, 0.24706398531247203, 295.57441977236033, 0.4878548616228696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1129.3913043478262, 499, 1663, 1164.0, 1576.4, 1657.1999999999998, 1663.0, 0.09120578006717504, 0.029012979970417605, 0.04114948280374499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 180.54545454545453, 136, 561, 143.0, 479.0000000000003, 561.0, 561.0, 0.0483291301635282, 0.013026210864388462, 0.028459438953718268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 142.27272727272728, 137, 150, 142.0, 149.8, 150.0, 150.0, 0.04833061656685662, 0.013026611496535574, 0.028413116380124694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25d52202-ba29-4506-8813-f76c6df088a0", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 295.8888888888889, 134, 1552, 142.5, 541.3000000000015, 1552.0, 1552.0, 0.10052833223496822, 5.050899667488578, 0.05861971109274297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 257.72222222222223, 135, 1130, 143.5, 497.300000000001, 1130.0, 1130.0, 0.10052271813429835, 1.6676452797603092, 0.05871460413595139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 140.72727272727272, 139, 144, 141.0, 143.8, 144.0, 144.0, 0.048330191870861725, 0.012932102121695424, 0.02756331255135083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 166.27777777777777, 137, 581, 141.5, 190.4000000000006, 581.0, 581.0, 0.10052496369931865, 0.07470654040545069, 0.050458819669384564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 141.72727272727272, 138, 145, 141.0, 144.8, 145.0, 145.0, 0.04832934250126315, 0.035916630511192635, 0.024259064497704357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 218.44444444444446, 136, 428, 142.5, 428.0, 428.0, 428.0, 0.1005255251062499, 0.03528646633232622, 0.056861931681736186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 173.18181818181822, 142, 419, 147.0, 368.4000000000002, 419.0, 419.0, 0.05057285249278187, 0.03980636631756073, 0.017977068659543557], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 638.9230769230769, 142, 1165, 564.0, 1097.0, 1165.0, 1165.0, 0.07349200067838771, 0.01376870866074962, 0.05001784300978009], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1556.318181818182, 807, 3015, 1459.5, 2495.5999999999995, 2959.499999999999, 3015.0, 0.10210285470299672, 0.05284620409432447, 0.046963324770616655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 325.1818181818182, 283, 706, 288.0, 624.0000000000002, 706.0, 706.0, 0.04829878506601566, 0.07485368349586606, 0.1086250996162442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41ed547a-efca-47f7-8b17-bb62d9b95738", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["addBook", 63, 8, 12.698412698412698, 1428.9682539682535, 724, 3348, 1143.0, 2376.8, 2533.6, 3348.0, 0.2957802024451163, 102.26139718439548, 1.0730881169716802], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 255.01724137931032, 135, 642, 146.0, 559.6, 575.0, 642.0, 0.2483684760452887, 0.1845785256547507, 0.12006093324454874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a5d069f-ade1-46c9-95be-84fa7bda5647", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 899.8793103448278, 663, 1252, 839.0, 1134.5, 1238.4, 1252.0, 0.24780500309756254, 72.86289881117686, 0.12462849276879366], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 212.25862068965517, 135, 543, 143.5, 424.1, 426.29999999999995, 543.0, 0.2485739143105717, 0.4398593093073788, 0.12088848567057099], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1316.017241379311, 941, 1963, 1262.0, 1688.3, 1759.8499999999997, 1963.0, 0.24769600013665988, 222.8772963260918, 0.12433178131859685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 145.74999999999997, 138, 161, 144.0, 154.70000000000002, 161.0, 161.0, 0.08583506791699749, 0.06412483101221005, 0.030511684298620202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 8, 4.3478260869565215, 221.32608695652178, 135, 1674, 147.5, 356.5, 438.5, 1237.1000000000029, 0.7460356718578316, 1.6107300405048715, 0.3595713285111317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f72a9dc-157c-4027-98a2-700ad7325b2c", 3, 0, 0.0, 320.3333333333333, 227, 454, 280.0, 454.0, 454.0, 454.0, 0.029024767801857584, 0.02910980130127709, 0.01861288820626935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 173.50000000000003, 140, 434, 145.0, 405.4000000000001, 434.0, 434.0, 0.05319431884674717, 0.041194428560029785, 0.018908918027554657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48ec330e-3626-4c66-8575-44c712ab0243", 2, 0, 0.0, 305.5, 249, 362, 305.5, 362.0, 362.0, 362.0, 0.056492387650764066, 0.03472847463491795, 0.03511465306612434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c8a4cd9-9d85-48db-b38c-a3db6207bc18", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.5084967157643312, 0.9501268909235668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 166.1052631578947, 136, 515, 146.0, 160.0, 515.0, 515.0, 0.08468193021317562, 0.06872137110073138, 0.03010177988046477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a5d069f-ade1-46c9-95be-84fa7bda5647", 3, 0, 0.0, 862.0, 278, 1165, 1143.0, 1165.0, 1165.0, 1165.0, 0.015872511983746545, 0.02188153914425997, 0.010178661656243718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 313.7, 281, 563, 287.0, 536.0000000000001, 563.0, 563.0, 0.0553366682898756, 0.08576102790628182, 0.12445346393709328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ebfc6e2-dd7f-411c-b92b-30363827a754", 1, 0, 0.0, 1397.0, 1397, 1397, 1397.0, 1397.0, 1397.0, 1397.0, 0.7158196134574087, 0.22858692734430924, 0.4271150232641374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 511.72222222222223, 278, 1698, 419.5, 1078.800000000001, 1698.0, 1698.0, 0.10044362601489915, 6.822880700524538, 0.22447232220083144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3588220-d43f-4b5b-8fa4-3e955e609cee", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 149.09999999999997, 140, 191, 145.0, 186.8, 191.0, 191.0, 0.08803359361932514, 0.0729887900222725, 0.03129319148186948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48ddc29e-64b1-44ec-b5a6-14237ac54a1f", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 147.14285714285714, 140, 164, 146.0, 157.6, 163.5, 164.0, 0.0971781321437496, 0.07544591313894622, 0.03454378916047349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 196.125, 138, 422, 144.5, 418.5, 422.0, 422.0, 0.08872819227399266, 0.0659396038286215, 0.044537393387531474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 263.125, 135, 431, 146.5, 428.9, 431.0, 431.0, 0.08872474810489483, 0.04872712911668968, 0.0492036780567062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3a4245f-332b-42cc-a698-fd26f2ff74be", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 482.31250000000006, 132, 1555, 276.5, 1546.6, 1555.0, 1555.0, 0.08804270070984427, 14.87321399706983, 0.050340821548451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 396.125, 137, 1132, 271.0, 1107.5, 1132.0, 1132.0, 0.0882427558212643, 4.884255923984381, 0.05054138309489405], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 25.0, 0.29411764705882354], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07352941176470588], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07352941176470588], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.7352941176470589], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1360, 16, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
