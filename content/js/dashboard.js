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

    var data = {"OkPercent": 98.3503534956795, "KoPercent": 1.6496465043205029};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7777401894451962, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2767857142857143, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2f164393-c3c3-4384-a836-c2b6192a26d5"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=662c5ba5-0088-42db-8002-f519aba4e7a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91152bba-a0b3-443f-bb38-9333fecc72f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54d48975-5003-4ff3-964e-2f436a481392"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1ef6b6b8-210d-47bd-a021-21b80905a28e"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/662c5ba5-0088-42db-8002-f519aba4e7a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.125, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91152bba-a0b3-443f-bb38-9333fecc72f1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67a13c60-2518-475e-bb85-5d8cc7d0c0ca"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d7edd6d-92bc-42f2-bd76-b0ccbd6543ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/482e44b7-d31c-4a1a-a4d6-ae40d57048dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45c35053-b47d-453a-a9c7-f349a208251a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf3cf6e0-13a5-4b2e-b87b-9986f620b804"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8147810f-f969-4f50-8407-c0064dcfd405"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=616288ee-0853-42e2-8ff1-ca86f82ac622"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f164393-c3c3-4384-a836-c2b6192a26d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cf3cf6e0-13a5-4b2e-b87b-9986f620b804"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7678571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8541666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89bc3b8f-a986-4f05-974e-5d11b6dd903b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89bc3b8f-a986-4f05-974e-5d11b6dd903b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/67a13c60-2518-475e-bb85-5d8cc7d0c0ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8147810f-f969-4f50-8407-c0064dcfd405"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f9ddb85-510c-4888-84e5-0c935c2121ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89e017be-83a2-4342-94d0-70052f5cd7f8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ef6b6b8-210d-47bd-a021-21b80905a28e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/616288ee-0853-42e2-8ff1-ca86f82ac622"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d7edd6d-92bc-42f2-bd76-b0ccbd6543ca"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/45c35053-b47d-453a-a9c7-f349a208251a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 21, 1.6496465043205029, 413.4194815396703, 97, 7985, 113.0, 883.0, 1063.0999999999988, 4914.159999999998, 4.994938357830635, 716.7399729089336, 3.6538652774289995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1462.928571428571, 1187, 1861, 1429.5, 1719.4, 1833.5, 1861.0, 0.24560003157714694, 295.5396825989636, 1.2076134365145847], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2f164393-c3c3-4384-a836-c2b6192a26d5", 3, 0, 0.0, 1356.6666666666667, 201, 3572, 297.0, 3572.0, 3572.0, 3572.0, 0.04453549478934711, 0.02015115161366943, 0.028559545812178976], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 1725.5384615384617, 103, 7155, 439.0, 5898.199999999999, 7155.0, 7155.0, 0.06786775185461684, 0.013454251588366422, 0.04562923520874554], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 1725.5384615384617, 103, 7155, 439.0, 5898.199999999999, 7155.0, 7155.0, 0.06971070059254095, 0.013819601777622864, 0.046868297048019945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 147.45454545454544, 98, 305, 102.0, 300.7, 304.4, 305.0, 0.1005447698438814, 0.04063208383605718, 0.05657428544660159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 129.45454545454544, 100, 306, 102.0, 298.8, 305.09999999999997, 306.0, 0.10054063441140314, 0.07471818631550566, 0.05046668563228634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 173.22727272727272, 99, 700, 102.0, 435.89999999999986, 668.7999999999995, 700.0, 0.10054431033458404, 2.712214905465497, 0.05842174282136475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 204.5909090909091, 98, 885, 102.0, 607.5999999999998, 856.3499999999996, 885.0, 0.10054339132858951, 8.249101464848659, 0.05832302192302946], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 836.9230769230769, 101, 5688, 293.0, 3757.999999999998, 5688.0, 5688.0, 0.0680243631873077, 0.12757634099566736, 0.043966467913431145], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 100.94736842105262, 99, 103, 101.0, 103.0, 103.0, 103.0, 0.10027708140915688, 0.07452232319567226, 0.0503343943792057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 131.68421052631578, 98, 304, 100.0, 300.0, 304.0, 304.0, 0.10027761064842669, 0.03475905665157225, 0.05674632469362551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 688.8, 587, 776, 687.0, 776.0, 776.0, 776.0, 0.03450036570387646, 10.144253036894693, 0.019675989815492047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 767.2, 686, 885, 690.0, 885.0, 885.0, 885.0, 0.03452180397138833, 31.06277989631376, 0.019654503628241594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=662c5ba5-0088-42db-8002-f519aba4e7a9", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 217.4, 99, 297, 295.0, 297.0, 297.0, 297.0, 0.03461477220018415, 0.06125192111985711, 0.019166577966312902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91152bba-a0b3-443f-bb38-9333fecc72f1", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 101.75, 99, 105, 101.5, 105.0, 105.0, 105.0, 0.08675001897656665, 0.06446949652457737, 0.043544443119096936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 154.75, 99, 323, 103.0, 323.0, 323.0, 323.0, 0.08653981372305096, 0.05565084700842682, 0.047537739471890786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 322.25, 99, 902, 101.5, 902.0, 902.0, 902.0, 0.08674907829104316, 19.531779474354803, 0.049135220125786166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 250.375, 100, 704, 102.0, 704.0, 704.0, 704.0, 0.08674813762592035, 6.3942441932965375, 0.049219402305331755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 101.2, 100, 104, 101.0, 104.0, 104.0, 104.0, 0.03466084364493432, 0.025758693372846697, 0.019462876070153547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 142.05263157894734, 99, 698, 100.0, 298.0, 698.0, 698.0, 0.10027972766137119, 4.7746520309943525, 0.05849994392252072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 600.0666666666668, 100, 910, 875.0, 907.6, 910.0, 910.0, 0.12324377618930243, 73.94105031940678, 0.06539301926711034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 153.6315789473684, 98, 693, 101.0, 308.0, 693.0, 693.0, 0.10027813989328295, 1.5774530704902545, 0.05859694554105334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 454.8666666666667, 99, 705, 493.0, 697.8, 705.0, 705.0, 0.12324276359573086, 24.169382286728396, 0.06551283624734001], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 1687.7692307692307, 102, 7586, 481.0, 6743.999999999999, 7586.0, 7586.0, 0.069836153639538, 0.0138444718640881, 0.04738282299221058], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 454.125, 200, 1004, 303.5, 1004.0, 1004.0, 1004.0, 0.08644630063862205, 25.955438451584666, 0.1888902321083172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54d48975-5003-4ff3-964e-2f436a481392", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ef6b6b8-210d-47bd-a021-21b80905a28e", 3, 0, 0.0, 1077.0, 185, 2346, 700.0, 2346.0, 2346.0, 2346.0, 0.04339649934905251, 0.02789976764790974, 0.02782913532475047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 577.5, 157, 3049, 392.5, 1742.5000000000027, 2989.999999999999, 3049.0, 0.08855591863482196, 0.054396164864553724, 0.04004042024211188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/662c5ba5-0088-42db-8002-f519aba4e7a9", 3, 0, 0.0, 911.6666666666666, 187, 2309, 239.0, 2309.0, 2309.0, 2309.0, 0.05383966547621184, 0.034613717225103646, 0.03452608756124262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 101.93333333333334, 100, 107, 102.0, 104.6, 107.0, 107.0, 0.12323972591484955, 0.09158733537226613, 0.061860565547102224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 167.53333333333333, 99, 302, 103.0, 301.4, 302.0, 302.0, 0.12323972591484955, 0.1563764490937772, 0.06338501528172602], "isController": false}, {"data": ["login", 20, 0, 0.0, 2727.4, 1112, 8645, 1863.0, 7397.400000000004, 8591.8, 8645.0, 0.08557504289449025, 25.71172779889223, 0.16458988962958843], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 116.36842105263158, 100, 299, 105.0, 124.0, 299.0, 299.0, 0.10196086849194509, 0.08254449216779539, 0.03624390247174611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91152bba-a0b3-443f-bb38-9333fecc72f1", 3, 0, 0.0, 421.0, 175, 683, 405.0, 683.0, 683.0, 683.0, 0.016723899567408464, 0.023055245660148063, 0.01072463611581858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67a13c60-2518-475e-bb85-5d8cc7d0c0ca", 1, 0, 0.0, 7586.0, 7586, 7586, 7586.0, 7586.0, 7586.0, 7586.0, 0.1318217769575534, 0.023815457751120483, 0.09088493606643817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d7edd6d-92bc-42f2-bd76-b0ccbd6543ca", 3, 0, 0.0, 488.0, 284, 803, 377.0, 803.0, 803.0, 803.0, 0.023503235612102602, 0.02357209274768493, 0.015072061899688191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/482e44b7-d31c-4a1a-a4d6-ae40d57048dd", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45c35053-b47d-453a-a9c7-f349a208251a", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf3cf6e0-13a5-4b2e-b87b-9986f620b804", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8147810f-f969-4f50-8407-c0064dcfd405", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 704.1999999999999, 205, 1015, 976.0, 1010.8, 1015.0, 1015.0, 0.12313552295656599, 98.27220819702916, 0.2559310918221595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 354.7272727272727, 201, 1001, 209.5, 904.0999999999998, 998.75, 1001.0, 0.10049241282283188, 11.071027152364769, 0.22367234391701155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 594.25, 100, 986, 802.0, 986.0, 986.0, 986.0, 0.05287648054145516, 39.54196420014409, 0.08754439765426714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=616288ee-0853-42e2-8ff1-ca86f82ac622", 1, 0, 0.0, 2414.0, 2414, 2414, 2414.0, 2414.0, 2414.0, 2414.0, 0.4142502071251035, 0.07484012531068765, 0.2856060998342999], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1372.409090909091, 180, 3717, 1088.0, 2978.9, 3612.4499999999985, 3717.0, 0.08942326061596367, 0.028278200844643345, 0.04034526016071799], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 277.3684210526316, 201, 802, 205.0, 410.0, 802.0, 802.0, 0.10022259966873792, 6.457733179087236, 0.22405334974258617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 104.83333333333334, 100, 117, 102.5, 114.9, 117.0, 117.0, 0.09976472153172103, 0.07745405626730294, 0.03546324085697896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 333.47058823529414, 202, 611, 398.0, 453.39999999999986, 611.0, 611.0, 0.12324466966803685, 0.1910051667609126, 0.2771801506303602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f164393-c3c3-4384-a836-c2b6192a26d5", 1, 0, 0.0, 5481.0, 5481, 5481, 5481.0, 5481.0, 5481.0, 5481.0, 0.18244845831052725, 0.032961879675241744, 0.12578965973362524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 120.8, 99, 296, 102.0, 276.70000000000005, 296.0, 296.0, 0.05159239940771926, 0.03834161713796323, 0.02589696610895283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 100.5, 98, 107, 100.0, 106.6, 107.0, 107.0, 0.051592931768347734, 0.013805139945827423, 0.02942409389913582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 120.3, 99, 292, 100.5, 273.9000000000001, 292.0, 292.0, 0.0515931979527819, 0.013905979135710747, 0.030331157390209675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 120.89999999999999, 98, 307, 100.5, 286.5000000000001, 307.0, 307.0, 0.051592931768347734, 0.013905907390687477, 0.030381384625306335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.02094394353512823, 0.006176827097274146, 0.012946793220445478], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 941.2142857142856, 782, 1434, 809.0, 1289.7, 1416.4, 1434.0, 0.2496389151406002, 298.6549310372497, 0.4929393422014586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1372.409090909091, 180, 3717, 1088.0, 2978.9, 3612.4499999999985, 3717.0, 0.08853653138016379, 0.027997791617200233, 0.03994519286878483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 188.66666666666666, 98, 305, 103.0, 305.0, 305.0, 305.0, 0.047736747748416734, 0.012866545291565447, 0.028110604387007118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 177.2222222222222, 97, 394, 102.0, 394.0, 394.0, 394.0, 0.047788202685696994, 0.012880414005129268, 0.028094236344521083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 135.58333333333331, 99, 298, 101.5, 296.8, 298.0, 298.0, 0.09314962157966233, 0.025106733941393365, 0.05476178924898118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 167.16666666666669, 98, 307, 100.0, 304.90000000000003, 307.0, 307.0, 0.09315106774411402, 0.02510712372790573, 0.05485360727509839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 143.44444444444446, 97, 297, 101.0, 297.0, 297.0, 297.0, 0.047788456432857215, 0.012787145568948123, 0.02725435405936388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 134.91666666666663, 100, 309, 101.5, 305.40000000000003, 309.0, 309.0, 0.09299946525307479, 0.06911386040780267, 0.046681372207109814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 146.11111111111111, 101, 296, 104.0, 296.0, 296.0, 296.0, 0.04778718772400244, 0.03551372056441978, 0.02398692821302466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 160.08333333333334, 99, 398, 100.5, 368.3000000000001, 398.0, 398.0, 0.09315106774411402, 0.024925188048718006, 0.05312521832281502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 105.33333333333334, 100, 116, 103.0, 116.0, 116.0, 116.0, 0.04765333785157574, 0.03750838897301762, 0.016939272439427312], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 2161.916666666666, 100, 7985, 580.0, 7670.000000000001, 7985.0, 7985.0, 0.0734205406199141, 0.013796226260691866, 0.0499687484704054], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cf3cf6e0-13a5-4b2e-b87b-9986f620b804", 3, 0, 0.0, 594.6666666666666, 246, 812, 726.0, 812.0, 812.0, 812.0, 0.043696744592527856, 0.02809279640958415, 0.028021675406015585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1616.1999999999998, 653, 4858, 1008.0, 4719.300000000001, 4854.2, 4858.0, 0.08810145763861664, 0.04559938725436213, 0.04052322905057464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 368.8888888888889, 204, 690, 400.0, 690.0, 690.0, 690.0, 0.047709923664122134, 0.07394106333492367, 0.10730073652194658], "isController": false}, {"data": ["addBook", 56, 9, 16.071428571428573, 1750.839285714286, 520, 7340, 1329.0, 6067.900000000001, 6916.9, 7340.0, 0.25163789307186957, 81.5997040025029, 0.9141532834251512], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 170.83928571428575, 99, 415, 104.0, 402.6, 410.3, 415.0, 0.2504192286193404, 0.18610257126886529, 0.12105226383454444], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 558.9999999999997, 486, 815, 498.5, 730.3000000000003, 793.3, 815.0, 0.25035877306318427, 73.61379197421304, 0.1259128594995507], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 153.67857142857142, 98, 536, 103.0, 304.6, 310.6, 536.0, 0.2507938071843469, 0.4437874791191763, 0.12196808200957496], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 766.642857142857, 675, 1117, 701.0, 916.0000000000001, 1021.6, 1117.0, 0.2501261797245932, 225.06397619111428, 0.1255516175570712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 105.29411764705881, 101, 113, 104.0, 110.6, 113.0, 113.0, 0.1171476611813997, 0.0875175398474324, 0.04164233268557568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 9, 5.357142857142857, 424.6845238095236, 100, 6324, 108.0, 929.8, 1224.8499999999974, 6281.22, 0.7177984097347136, 1.5675261577169737, 0.3432858210246572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 127.1, 103, 300, 109.0, 281.20000000000005, 300.0, 300.0, 0.05373339638051842, 0.04161189778296006, 0.019100543244637405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89bc3b8f-a986-4f05-974e-5d11b6dd903b", 3, 0, 0.0, 494.0, 194, 854, 434.0, 854.0, 854.0, 854.0, 0.04088140304975267, 0.025910186112587386, 0.02621626432552499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89bc3b8f-a986-4f05-974e-5d11b6dd903b", 1, 0, 0.0, 1241.0, 1241, 1241, 1241.0, 1241.0, 1241.0, 1241.0, 0.8058017727639001, 0.14557942183722802, 0.5555625503626107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67a13c60-2518-475e-bb85-5d8cc7d0c0ca", 3, 0, 0.0, 2972.333333333333, 863, 6935, 1119.0, 6935.0, 6935.0, 6935.0, 0.019542573496361824, 0.023098660275159437, 0.012532184175726822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 124.04545454545453, 100, 325, 105.0, 241.19999999999987, 320.79999999999995, 325.0, 0.09943502824858756, 0.08069385593220339, 0.035346045197740115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 244.29999999999995, 200, 604, 204.0, 565.1000000000001, 604.0, 604.0, 0.05156526357584477, 0.07991608720201723, 0.11597148634293994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 344.3333333333333, 201, 609, 302.5, 605.7, 609.0, 609.0, 0.09292672727554324, 0.14401827752567103, 0.2089943876128673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8147810f-f969-4f50-8407-c0064dcfd405", 3, 0, 0.0, 394.3333333333333, 293, 535, 355.0, 535.0, 535.0, 535.0, 0.01712475383166367, 0.02360785562405457, 0.010981694351685362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f9ddb85-510c-4888-84e5-0c935c2121ce", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 109.875, 101, 140, 105.0, 140.0, 140.0, 140.0, 0.09691096305269534, 0.08034903089036947, 0.0344488188976378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 133.0666666666667, 100, 312, 107.0, 304.8, 312.0, 312.0, 0.12354220201620872, 0.0959141119168808, 0.043915392122949204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89e017be-83a2-4342-94d0-70052f5cd7f8", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ef6b6b8-210d-47bd-a021-21b80905a28e", 1, 0, 0.0, 2327.0, 2327, 2327, 2327.0, 2327.0, 2327.0, 2327.0, 0.42973785990545765, 0.07763818758057585, 0.29628411044263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/616288ee-0853-42e2-8ff1-ca86f82ac622", 3, 0, 0.0, 3149.0, 700, 7985, 762.0, 7985.0, 7985.0, 7985.0, 0.0364834790645636, 0.023455361703292026, 0.023395981040752047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d7edd6d-92bc-42f2-bd76-b0ccbd6543ca", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45c35053-b47d-453a-a9c7-f349a208251a", 3, 0, 0.0, 2108.6666666666665, 239, 5688, 399.0, 5688.0, 5688.0, 5688.0, 0.020782819535850365, 0.024564589106338762, 0.013327524246622792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 114.47058823529412, 100, 309, 102.0, 149.79999999999984, 309.0, 309.0, 0.12333497779970401, 0.09165812314997532, 0.06190837752836704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 147.58823529411762, 99, 301, 101.0, 297.0, 301.0, 301.0, 0.12352227397240367, 0.033051858465272074, 0.07044629687488646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 171.35294117647058, 99, 304, 102.0, 304.0, 304.0, 304.0, 0.12352317149375847, 0.03329335481667708, 0.07261811449144784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 181.58823529411765, 99, 303, 101.0, 301.4, 303.0, 303.0, 0.12352317149375847, 0.03329335481667708, 0.07273874258860971], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.3927729772191673], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15710919088766692], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07855459544383346], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.021209740769835], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 21, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
