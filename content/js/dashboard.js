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

    var data = {"OkPercent": 96.75118858954042, "KoPercent": 3.248811410459588};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7854718262050238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.32407407407407407, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07db7755-ea9d-44eb-acbe-3b81676f418d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8007d40f-c224-4336-88dc-92a4a5310ada"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55422a59-aed6-423b-9ed3-90a96e8b61aa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c49fb20-c81d-49b2-b2fc-623f578460f3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bed206dc-aa53-47a7-b6f7-796edb6298d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/98cffd3e-622d-4175-9bd7-4b858593d397"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02c8f3e1-b168-4a6d-b131-53cd7347262f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25dbd95e-72f8-40d5-9d2f-b77628ee6763"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1f66df1-1570-4905-87d7-fa4f90624866"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2689d56-3a77-476c-a89a-068c7b768364"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c91d973-2928-43e3-960b-756954558a95"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ccf62c8-3528-492b-9053-d2c92d576d8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2efc5c62-0791-4a7d-adfe-575749e7f4dc"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8546d8e2-4083-4f0f-9283-a4f7592751d0"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55422a59-aed6-423b-9ed3-90a96e8b61aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bed206dc-aa53-47a7-b6f7-796edb6298d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8007d40f-c224-4336-88dc-92a4a5310ada"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c49fb20-c81d-49b2-b2fc-623f578460f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98cffd3e-622d-4175-9bd7-4b858593d397"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f579df30-089a-46d9-86dd-28e98e498b49"], "isController": false}, {"data": [0.2818181818181818, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8703703703703703, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8871951219512195, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8546d8e2-4083-4f0f-9283-a4f7592751d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c91d973-2928-43e3-960b-756954558a95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ccf62c8-3528-492b-9053-d2c92d576d8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f579df30-089a-46d9-86dd-28e98e498b49"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2689d56-3a77-476c-a89a-068c7b768364"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1262, 41, 3.248811410459588, 322.53882725832045, 81, 3900, 100.5, 873.8000000000006, 1093.0, 1533.1099999999997, 4.891890006124553, 698.7538363251905, 3.5739670933664884], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1418.7962962962956, 993, 1859, 1403.5, 1688.0, 1773.25, 1859.0, 0.23945935399187612, 288.1513064045954, 1.1774197728018518], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/07db7755-ea9d-44eb-acbe-3b81676f418d", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8007d40f-c224-4336-88dc-92a4a5310ada", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 445.7857142857142, 85, 1181, 448.0, 1034.0, 1181.0, 1181.0, 0.09581494028676042, 0.02043820364096773, 0.06381424733942442], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 445.7857142857142, 85, 1181, 448.0, 1034.0, 1181.0, 1181.0, 0.09773874433638884, 0.020848568650995887, 0.06509553089591522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 139.0, 82, 254, 84.0, 252.8, 254.0, 254.0, 0.098530580607868, 0.06582817826809514, 0.05398654729139434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 102.46666666666667, 82, 248, 88.0, 177.20000000000005, 248.0, 248.0, 0.09852022620243936, 0.07321669154302379, 0.049452535418021325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 257.46666666666675, 81, 663, 244.0, 655.2, 663.0, 663.0, 0.09853187506158242, 7.745246863401976, 0.055764166009787494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 322.8666666666666, 81, 905, 84.0, 903.8, 905.0, 905.0, 0.09852993339376502, 23.661450327776244, 0.05566684648379511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55422a59-aed6-423b-9ed3-90a96e8b61aa", 3, 0, 0.0, 359.0, 179, 654, 244.0, 654.0, 654.0, 654.0, 0.04838475557634308, 0.03110673576278567, 0.031027984533006467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c49fb20-c81d-49b2-b2fc-623f578460f3", 3, 0, 0.0, 405.66666666666663, 181, 823, 213.0, 823.0, 823.0, 823.0, 0.05268241285450874, 0.03386971529546053, 0.03378396918078848], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 182.92857142857142, 83, 433, 192.5, 333.5, 433.0, 433.0, 0.095333428666762, 0.12318999484178055, 0.06160497231925803], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 102.94736842105263, 83, 250, 86.0, 250.0, 250.0, 250.0, 0.09147016628313386, 0.06797734037252429, 0.04591373581008868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 92.57894736842105, 82, 245, 84.0, 87.0, 245.0, 245.0, 0.09147324888908145, 0.02447624042539875, 0.05216833725705427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 559.4285714285714, 408, 683, 561.0, 683.0, 683.0, 683.0, 0.03397893306150187, 9.990934526843358, 0.019378610261637785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 856.9999999999999, 648, 1060, 844.0, 1060.0, 1060.0, 1060.0, 0.03396656719314846, 30.563176867251375, 0.01933838737656792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 240.42857142857142, 84, 333, 248.0, 333.0, 333.0, 333.0, 0.03404420883690392, 0.06024229141842764, 0.018850650791527854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bed206dc-aa53-47a7-b6f7-796edb6298d8", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 96.00000000000001, 83, 250, 85.0, 154.60000000000005, 250.0, 250.0, 0.06571770303484352, 0.048839035165542895, 0.03298720640616169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 105.86666666666666, 81, 248, 84.0, 246.2, 248.0, 248.0, 0.06571827888208827, 0.017584773841496273, 0.03747995592494096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 165.6, 81, 333, 91.0, 282.0, 333.0, 333.0, 0.06571856680949502, 0.017713207460371704, 0.03863532931573828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 132.79999999999998, 81, 332, 85.0, 280.40000000000003, 332.0, 332.0, 0.06571827888208827, 0.01771312985493785, 0.03869933805263596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98cffd3e-622d-4175-9bd7-4b858593d397", 3, 0, 0.0, 1292.0, 208, 3006, 662.0, 3006.0, 3006.0, 3006.0, 0.023421946363742827, 0.023490565347230354, 0.015019933052269976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 84.28571428571429, 82, 90, 84.0, 90.0, 90.0, 90.0, 0.0340722136230445, 0.025321244694469593, 0.019132346516846276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 109.68421052631578, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.09147368927832074, 0.024655017813297386, 0.05377652436088778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 617.0, 83, 998, 829.0, 989.6, 998.0, 998.0, 0.09298346753947148, 50.21003730380489, 0.04986964880144311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 126.36842105263158, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.09147324888908145, 0.024654899114635236, 0.053865594804800895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 406.1333333333334, 82, 674, 488.0, 669.8, 674.0, 674.0, 0.09307404971395242, 16.430151125110136, 0.05000912319591467], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 414.49999999999994, 85, 878, 435.0, 810.5, 878.0, 878.0, 0.0980028420824204, 0.0209049031171904, 0.06557221409420873], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 273.6666666666667, 167, 584, 327.0, 437.0000000000001, 584.0, 584.0, 0.065692951146342, 0.10181124362230932, 0.14774498680666565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02c8f3e1-b168-4a6d-b131-53cd7347262f", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25dbd95e-72f8-40d5-9d2f-b77628ee6763", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.9419939159292035, 1.7601170722713864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 656.1363636363636, 101, 1584, 596.0, 1368.6, 1560.5999999999997, 1584.0, 0.09666208254063104, 0.059375439373102454, 0.043705609586242346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 108.93333333333334, 83, 261, 86.0, 252.6, 261.0, 261.0, 0.09307635984561735, 0.06917100570558087, 0.04671996968813215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 150.86666666666667, 82, 253, 88.0, 253.0, 253.0, 253.0, 0.09298231476373194, 0.1086730803801117, 0.04834353943379969], "isController": false}, {"data": ["login", 22, 0, 0.0, 3030.9999999999995, 1579, 6437, 2702.5, 5378.0, 6304.699999999998, 6437.0, 0.09369995570547549, 35.7939113063371, 0.19081050994071347], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 109.00000000000001, 84, 254, 89.0, 250.0, 254.0, 254.0, 0.09409620594192777, 0.07617749484947084, 0.03344826070591964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1f66df1-1570-4905-87d7-fa4f90624866", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2689d56-3a77-476c-a89a-068c7b768364", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c91d973-2928-43e3-960b-756954558a95", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ccf62c8-3528-492b-9053-d2c92d576d8a", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2efc5c62-0791-4a7d-adfe-575749e7f4dc", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 727.0, 169, 1093, 916.0, 1081.0, 1093.0, 1093.0, 0.09293392398005018, 66.76638105619405, 0.19474376374647626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8546d8e2-4083-4f0f-9283-a4f7592751d0", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 484.0666666666666, 83, 1145, 85.0, 1093.4, 1145.0, 1145.0, 0.07275584593222065, 40.6296495532791, 0.10227027796370938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 470.1333333333333, 169, 1153, 336.0, 1054.6000000000001, 1153.0, 1153.0, 0.09846525489372317, 31.52488858041001, 0.21473246374837532], "isController": false}, {"data": ["register", 24, 9, 37.5, 1042.625, 216, 3137, 1020.5, 2071.5, 3004.25, 3137.0, 0.09839493266096795, 0.0306042832544124, 0.04439302625914766], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 239.42105263157902, 167, 497, 172.0, 497.0, 497.0, 497.0, 0.09143319121086418, 0.14170358833168112, 0.20563538999865258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 88.0625, 85, 93, 87.5, 91.6, 93.0, 93.0, 0.10467025598419478, 0.08126255225335435, 0.037207005056881744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55422a59-aed6-423b-9ed3-90a96e8b61aa", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 251.85714285714283, 167, 490, 172.0, 417.0, 490.0, 490.0, 0.14308198597796537, 0.22174913256546, 0.32179473994849045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 112.66666666666666, 83, 247, 86.5, 247.0, 247.0, 247.0, 0.032722870013852684, 0.02431846101615419, 0.016425346862422148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bed206dc-aa53-47a7-b6f7-796edb6298d8", 3, 0, 0.0, 1533.0, 190, 3840, 569.0, 3840.0, 3840.0, 3840.0, 0.04060364079312445, 0.026104228700006765, 0.026038142045070038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 85.16666666666666, 82, 96, 83.0, 96.0, 96.0, 96.0, 0.03272394083511497, 0.008756210731270997, 0.018662872507526507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8007d40f-c224-4336-88dc-92a4a5310ada", 3, 0, 0.0, 350.0, 210, 433, 407.0, 433.0, 433.0, 433.0, 0.03313818623660665, 0.027625942367171103, 0.021250724897823925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 141.0, 83, 248, 91.5, 248.0, 248.0, 248.0, 0.03269487507833147, 0.00881229054845653, 0.019221010544097215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 141.83333333333334, 81, 248, 94.5, 248.0, 248.0, 248.0, 0.03269487507833147, 0.00881229054845653, 0.019252939133040898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 86.5, 85, 88, 86.5, 88.0, 88.0, 88.0, 0.10346076250581966, 0.030512842067146037, 0.06395572525994517], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 956.6666666666664, 651, 1499, 897.0, 1316.0, 1419.75, 1499.0, 0.23204049536348714, 277.60110278319684, 0.45818933752438573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1042.625, 216, 3137, 1020.5, 2071.5, 3004.25, 3137.0, 0.0959079283887468, 0.02983073749200767, 0.043270959878516625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 103.0, 81, 248, 83.0, 248.0, 248.0, 248.0, 0.05506068911511355, 0.01484057636305795, 0.03242343314102878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 121.33333333333333, 82, 248, 84.0, 248.0, 248.0, 248.0, 0.05506068911511355, 0.01484057636305795, 0.0323696629368148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 161.18749999999997, 81, 805, 84.5, 420.0000000000004, 805.0, 805.0, 0.0962591295768208, 5.437706665719117, 0.05607282303962267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 141.62500000000003, 83, 651, 84.0, 372.4000000000003, 651.0, 651.0, 0.0962591295768208, 1.793284553267396, 0.05616682609585003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 84.88888888888889, 82, 92, 84.0, 92.0, 92.0, 92.0, 0.05506001541680432, 0.014732855687699593, 0.031401415042396214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 85.50000000000001, 83, 96, 85.0, 89.7, 96.0, 96.0, 0.0962591295768208, 0.07153632578902405, 0.04831757090086513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 102.0, 83, 246, 84.0, 246.0, 246.0, 246.0, 0.05505967857383197, 0.04091837440887317, 0.0276373777216305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 125.75, 82, 252, 84.0, 247.8, 252.0, 252.0, 0.09625970869405656, 0.0347930905081911, 0.05439284564755711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 125.66666666666664, 85, 261, 90.0, 261.0, 261.0, 261.0, 0.05668291576918717, 0.04461565440426256, 0.020149005214828253], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 483.8571428571429, 83, 1231, 520.5, 1027.0, 1231.0, 1231.0, 0.09930134411462212, 0.020406093733375888, 0.06756314944852289], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1444.090909090909, 1117, 2219, 1401.0, 1868.3999999999999, 2172.3499999999995, 2219.0, 0.09415792852557245, 0.048734084100149795, 0.04330896907768029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 224.88888888888889, 168, 494, 171.0, 494.0, 494.0, 494.0, 0.05503139847012712, 0.08528791930868335, 0.12376690495771754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c49fb20-c81d-49b2-b2fc-623f578460f3", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 0.24315486204576042, 0.927931527590848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98cffd3e-622d-4175-9bd7-4b858593d397", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.2057677249430524, 0.7852541287015945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f579df30-089a-46d9-86dd-28e98e498b49", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["addBook", 55, 16, 29.09090909090909, 914.8545454545458, 426, 2541, 758.0, 1611.8, 1771.8, 2541.0, 0.2665568129498146, 82.24904849819468, 0.9674564043303365], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 145.2962962962963, 83, 484, 85.0, 342.5, 365.5, 484.0, 0.23277868781791533, 0.17299275530218122, 0.11252485397448056], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 502.72222222222246, 402, 743, 489.0, 659.0, 683.25, 743.0, 0.23275059480707563, 68.43640292037344, 0.11705718391176166], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 134.7222222222222, 82, 383, 87.0, 253.5, 341.25, 383.0, 0.23307206242878353, 0.4124282979696834, 0.11334949911087325], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 808.425925925926, 565, 1176, 803.5, 1092.0, 1149.25, 1176.0, 0.23242000878031144, 209.13193245132092, 0.11666394971980477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 108.57142857142857, 86, 298, 93.5, 203.5, 298.0, 298.0, 0.1506494065489449, 0.11254569922845983, 0.05355115623419526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 16, 9.75609756097561, 159.42073170731703, 84, 1323, 90.0, 308.5, 437.25, 882.2999999999961, 0.6729060926722988, 1.5023945994157206, 0.32086612810244586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 92.0, 86, 102, 89.5, 102.0, 102.0, 102.0, 0.03106699597682402, 0.024058718564083446, 0.011043346226136664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8546d8e2-4083-4f0f-9283-a4f7592751d0", 3, 0, 0.0, 605.6666666666667, 234, 1231, 352.0, 1231.0, 1231.0, 1231.0, 0.04635638791025404, 0.029802690795166578, 0.02972724094505223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 90.33333333333333, 84, 121, 87.0, 106.60000000000001, 121.0, 121.0, 0.0958791156110376, 0.07780814948512915, 0.034082029377361024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c91d973-2928-43e3-960b-756954558a95", 3, 0, 0.0, 303.3333333333333, 195, 420, 295.0, 420.0, 420.0, 420.0, 0.02011829557799863, 0.023779144285062837, 0.012901380953338967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ccf62c8-3528-492b-9053-d2c92d576d8a", 3, 0, 0.0, 291.0, 195, 474, 204.0, 474.0, 474.0, 474.0, 0.06764984440535787, 0.03140256449285167, 0.04338222443963379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 256.16666666666663, 167, 494, 182.5, 494.0, 494.0, 494.0, 0.03267884861523379, 0.050645832765992216, 0.07349549644617522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f579df30-089a-46d9-86dd-28e98e498b49", 3, 0, 0.0, 1549.6666666666667, 182, 3900, 567.0, 3900.0, 3900.0, 3900.0, 0.03508279539713725, 0.02255485706684442, 0.022497756162877726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 278.37499999999994, 167, 889, 184.0, 506.10000000000036, 889.0, 889.0, 0.09620993006740708, 7.333570209572287, 0.21483987435584445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2689d56-3a77-476c-a89a-068c7b768364", 3, 0, 0.0, 376.0, 200, 632, 296.0, 632.0, 632.0, 632.0, 0.04862709501734366, 0.03126253667293416, 0.03118339101047103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.13333333333334, 85, 249, 90.0, 201.00000000000003, 249.0, 249.0, 0.06711079096778234, 0.055641661651999234, 0.02385578897682888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 89.66666666666667, 86, 97, 88.0, 96.4, 97.0, 97.0, 0.0925000925000925, 0.07181403665778666, 0.032880892255892254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 96.35714285714286, 82, 244, 84.0, 169.0, 244.0, 244.0, 0.14344556240906575, 0.1066035869075186, 0.07200294831861309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 129.85714285714286, 82, 246, 84.5, 246.0, 246.0, 246.0, 0.1434470321833663, 0.03838328790843981, 0.0818096355420761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 119.07142857142857, 82, 248, 84.0, 247.5, 248.0, 248.0, 0.14320492624946296, 0.03859820277817557, 0.0841888335958757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 142.71428571428572, 83, 250, 85.5, 249.5, 250.0, 250.0, 0.1432063910966541, 0.03859859760027005, 0.08432954475711174], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 21.951219512195124, 0.7131537242472267], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.75609756097561, 0.31695721077654515], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.75609756097561, 0.31695721077654515], "isController": false}, {"data": ["401/Unauthorized", 24, 58.53658536585366, 1.901743264659271], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1262, 41, "401/Unauthorized", 24, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
