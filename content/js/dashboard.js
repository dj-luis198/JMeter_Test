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

    var data = {"OkPercent": 98.55623100303951, "KoPercent": 1.4437689969604863};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7858539765319427, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16666666666666666, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5962cdec-e1be-491f-83d4-281afca7d4ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f0b67fd-fcec-4081-8d2f-ff43315f2ecc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/928f8bb7-da66-4b18-926c-297ca84bd25e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e4fef8e-ea0b-4a38-8f83-ff499f9310f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24f0eb7c-a5e6-41ae-9b80-06b0d127947c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c4a11fe-f9e2-423c-a3c7-7f7a33b953a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2da4662f-e1a2-47b5-bcbd-1de2f2199ed2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b68f0fdd-c7fc-4f84-9693-5cb74661c14e"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c9d1379b-f0e6-42c0-a438-f5cacfd65786"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/964679ea-c54e-4d0e-a9b9-2b4db44f15da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=188559a3-1495-412a-adb1-387b9af33274"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c197e37b-803c-4041-a3ef-609e22b9f179"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e4fef8e-ea0b-4a38-8f83-ff499f9310f4"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b68f0fdd-c7fc-4f84-9693-5cb74661c14e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f0b67fd-fcec-4081-8d2f-ff43315f2ecc"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f5faad8-b051-4c07-b734-8e24c7ece6bf"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/188559a3-1495-412a-adb1-387b9af33274"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2da4662f-e1a2-47b5-bcbd-1de2f2199ed2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=964679ea-c54e-4d0e-a9b9-2b4db44f15da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.45614035087719296, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c4a11fe-f9e2-423c-a3c7-7f7a33b953a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9d1379b-f0e6-42c0-a438-f5cacfd65786"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5962cdec-e1be-491f-83d4-281afca7d4ba"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3f5534a-f7f1-45d7-aae7-8f263936a5f2"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6140350877192983, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9269005847953217, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3f5534a-f7f1-45d7-aae7-8f263936a5f2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24f0eb7c-a5e6-41ae-9b80-06b0d127947c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c197e37b-803c-4041-a3ef-609e22b9f179"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/dda7e075-15db-47e6-9345-cee2a3607a9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f5faad8-b051-4c07-b734-8e24c7ece6bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 19, 1.4437689969604863, 368.9832826747717, 90, 2250, 124.5, 1020.1999999999998, 1235.199999999999, 1722.4899999999998, 5.2174602545295965, 752.7932560312017, 3.8174135151944655], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1630.859649122807, 1252, 2369, 1635.0, 1939.8000000000002, 2022.5999999999992, 2369.0, 0.25608999991014386, 308.16167710027497, 1.259192528855053], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 607.6, 128, 985, 524.0, 928.6, 985.0, 985.0, 0.07902722751411954, 0.01487934518039282, 0.05346171361323021], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 607.6, 128, 985, 524.0, 928.6, 985.0, 985.0, 0.08005635967721275, 0.015073111470475214, 0.05415791884153111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 123.86666666666666, 92, 286, 101.0, 286.0, 286.0, 286.0, 0.09762955441871364, 0.04567486836281746, 0.054586107639838066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 130.26666666666665, 96, 303, 102.0, 301.2, 303.0, 303.0, 0.09763146076191591, 0.07255619300763477, 0.049006416827758574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 226.2, 93, 772, 101.0, 769.6, 772.0, 772.0, 0.09751911374629427, 3.8459608395745564, 0.05630839972759661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 261.0, 92, 1203, 100.0, 1107.6000000000001, 1203.0, 1203.0, 0.0975146759587318, 11.721962397528328, 0.05621060813402417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5962cdec-e1be-491f-83d4-281afca7d4ba", 3, 0, 0.0, 364.3333333333333, 206, 483, 404.0, 483.0, 483.0, 483.0, 0.021454316608501632, 0.025358275913238745, 0.013758139231363351], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 386.2, 102, 1742, 247.0, 999.8000000000004, 1742.0, 1742.0, 0.07930507605356793, 0.16539961662604485, 0.05126432943592943], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6f0b67fd-fcec-4081-8d2f-ff43315f2ecc", 3, 0, 0.0, 582.6666666666666, 215, 1057, 476.0, 1057.0, 1057.0, 1057.0, 0.04984465083822088, 0.03204530774918172, 0.031964180387791384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 110.9, 92, 306, 101.0, 106.9, 296.04999999999984, 306.0, 0.11245368313925702, 0.083571536004858, 0.05644647766950987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 120.80000000000001, 92, 299, 99.5, 279.00000000000034, 298.85, 299.0, 0.11245494773656303, 0.03853558707105466, 0.06366223945594297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 720.5714285714286, 492, 802, 779.0, 802.0, 802.0, 802.0, 0.09565455042361301, 28.125613854536756, 0.05455298578846679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 944.7142857142857, 702, 1120, 909.0, 1120.0, 1120.0, 1120.0, 0.09551228697348851, 85.9421237114369, 0.05437857744682012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 126.14285714285714, 91, 284, 103.0, 284.0, 284.0, 284.0, 0.0965863620056848, 0.17091258589287192, 0.05348092505588211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/928f8bb7-da66-4b18-926c-297ca84bd25e", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e4fef8e-ea0b-4a38-8f83-ff499f9310f4", 3, 0, 0.0, 321.3333333333333, 250, 412, 302.0, 412.0, 412.0, 412.0, 0.08765266171916088, 0.03966054680652136, 0.056209551948810846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24f0eb7c-a5e6-41ae-9b80-06b0d127947c", 3, 0, 0.0, 329.6666666666667, 197, 450, 342.0, 450.0, 450.0, 450.0, 0.015278294127533013, 0.021062361858757265, 0.00979760398152345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 116.08333333333333, 95, 274, 102.5, 226.30000000000018, 274.0, 274.0, 0.061579514548160304, 0.04576368219838867, 0.03091002976343203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 178.66666666666669, 94, 305, 98.5, 303.8, 305.0, 305.0, 0.061582990777947134, 0.02418615832473737, 0.03469054867878825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c4a11fe-f9e2-423c-a3c7-7f7a33b953a4", 3, 0, 0.0, 430.0, 405, 450, 435.0, 450.0, 450.0, 450.0, 0.078392432517181, 0.03638919556298832, 0.05027118882123913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2da4662f-e1a2-47b5-bcbd-1de2f2199ed2", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 189.75, 95, 810, 101.5, 654.6000000000006, 810.0, 810.0, 0.061520478629323735, 4.62821945155775, 0.03572673628734165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 203.25, 91, 804, 97.5, 653.1000000000006, 804.0, 804.0, 0.06158109460395659, 1.5241220684833088, 0.03582207553947605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.14285714285714, 92, 119, 102.0, 119.0, 119.0, 119.0, 0.09655305590421938, 0.07175476127256929, 0.05421680385246693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b68f0fdd-c7fc-4f84-9693-5cb74661c14e", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 150.10000000000002, 93, 750, 100.5, 280.6, 726.5499999999997, 750.0, 0.11245115402996823, 5.087980948314638, 0.06562579067217678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 801.4285714285713, 95, 1272, 989.0, 1237.5, 1272.0, 1272.0, 0.06900937048666393, 44.35870924442133, 0.036333895677548786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 189.14999999999998, 91, 492, 109.0, 306.3, 482.7499999999999, 492.0, 0.11233746173505209, 1.6803117189035863, 0.0656691451119162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 574.6428571428571, 95, 851, 749.5, 848.5, 851.0, 851.0, 0.06906860979688895, 14.511365023902671, 0.03643253538532884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9d1379b-f0e6-42c0-a438-f5cacfd65786", 3, 0, 0.0, 606.3333333333334, 425, 748, 646.0, 748.0, 748.0, 748.0, 0.03068143466388488, 0.030771321679501733, 0.019675268973910556], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 430.0, 107, 1174, 421.0, 896.0, 1174.0, 1174.0, 0.08623769572877012, 0.016283861770213497, 0.059017719921523694], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/964679ea-c54e-4d0e-a9b9-2b4db44f15da", 3, 0, 0.0, 284.3333333333333, 196, 458, 199.0, 458.0, 458.0, 458.0, 0.10686044026501389, 0.049534266581178314, 0.06852704014390539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=188559a3-1495-412a-adb1-387b9af33274", 1, 0, 0.0, 1174.0, 1174, 1174, 1174.0, 1174.0, 1174.0, 1174.0, 0.8517887563884157, 0.153887617120954, 0.587268419931857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 373.75000000000006, 199, 1084, 381.0, 881.5000000000007, 1084.0, 1084.0, 0.06148706465877241, 6.217344003794264, 0.13697484602614224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c197e37b-803c-4041-a3ef-609e22b9f179", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e4fef8e-ea0b-4a38-8f83-ff499f9310f4", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 849.8636363636363, 171, 1812, 866.5, 1576.6, 1784.6999999999996, 1812.0, 0.09415954050144236, 0.057838233374421136, 0.04257408911344513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 101.71428571428571, 92, 111, 103.0, 109.5, 111.0, 111.0, 0.06907201744561811, 0.051331841089956434, 0.03467091500688253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 185.57142857142858, 95, 312, 109.5, 310.0, 312.0, 312.0, 0.06906724683154006, 0.09257786098736563, 0.03524665023852867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b68f0fdd-c7fc-4f84-9693-5cb74661c14e", 3, 0, 0.0, 287.6666666666667, 204, 435, 224.0, 435.0, 435.0, 435.0, 0.021786967036318876, 0.0257514574573157, 0.013971459980972715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f0b67fd-fcec-4081-8d2f-ff43315f2ecc", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["login", 22, 0, 0.0, 3031.181818181818, 1837, 4522, 2907.0, 4371.2, 4500.099999999999, 4522.0, 0.09624681182435832, 36.766824701470824, 0.19599692557059048], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 127.05000000000001, 98, 315, 107.0, 282.8000000000004, 314.3, 315.0, 0.11315097168396934, 0.09160366750586971, 0.04022163446578598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 919.0, 199, 1377, 1088.0, 1338.5, 1377.0, 1377.0, 0.06897503103876396, 58.97205418111857, 0.14252081259976745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 432.46666666666664, 197, 1344, 246.0, 1320.6, 1344.0, 1344.0, 0.09745132306412947, 15.675648041147197, 0.21584579830499664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 847.1111111111111, 101, 1219, 1002.0, 1219.0, 1219.0, 1219.0, 0.12260077102262666, 114.08640289337819, 0.23306917407947253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f5faad8-b051-4c07-b734-8e24c7ece6bf", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1160.2499999999998, 206, 1744, 1147.5, 1715.0, 1738.75, 1744.0, 0.09951569030717176, 0.031098653220991177, 0.04489868058780601], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/188559a3-1495-412a-adb1-387b9af33274", 3, 0, 0.0, 1346.3333333333333, 1034, 1742, 1263.0, 1742.0, 1742.0, 1742.0, 0.02022994706497185, 0.02788861517583196, 0.012972980376951349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 323.35, 196, 857, 213.0, 581.3000000000004, 844.1999999999998, 857.0, 0.11227439863025233, 6.881263902728268, 0.25107143107755353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 129.16666666666666, 99, 305, 106.5, 293.3, 305.0, 305.0, 0.12005762766127741, 0.09320880272530815, 0.04267673483271971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2da4662f-e1a2-47b5-bcbd-1de2f2199ed2", 3, 0, 0.0, 702.0, 212, 1647, 247.0, 1647.0, 1647.0, 1647.0, 0.03742141502844028, 0.031196693973904798, 0.02399745690300369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 364.75, 196, 1211, 307.5, 609.6, 1180.9999999999995, 1211.0, 0.09370402646201707, 5.74309141442714, 0.20954379901891884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=964679ea-c54e-4d0e-a9b9-2b4db44f15da", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 125.375, 92, 306, 100.0, 306.0, 306.0, 306.0, 0.03841352155958897, 0.02854754873715548, 0.01928178718909056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 99.875, 92, 109, 99.0, 109.0, 109.0, 109.0, 0.03841370601030448, 0.010278667428538503, 0.021907816709001774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 119.25, 92, 282, 96.0, 282.0, 282.0, 282.0, 0.038414997214912705, 0.010354042218081939, 0.022583816722048285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 120.37500000000001, 93, 280, 97.5, 280.0, 280.0, 280.0, 0.03841481275179709, 0.010353992499507811, 0.02262122274348989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 2.7562792056074765, 5.777234228971963], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1113.1228070175446, 754, 1914, 1049.0, 1510.4, 1601.1999999999994, 1914.0, 0.2544097693351425, 304.3625312712008, 0.5023599156207599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1160.2499999999998, 206, 1744, 1147.5, 1715.0, 1738.75, 1744.0, 0.10002292191960657, 0.031257163099877056, 0.0451275292254475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 155.42857142857142, 98, 299, 105.0, 299.0, 299.0, 299.0, 0.04982170945402524, 0.013428507626280239, 0.029338369922634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c4a11fe-f9e2-423c-a3c7-7f7a33b953a4", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 178.71428571428572, 94, 295, 101.0, 295.0, 295.0, 295.0, 0.04975513366361265, 0.013410563370270598, 0.02925057662645978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 109.83333333333333, 92, 300, 99.0, 124.50000000000028, 300.0, 300.0, 0.11254149967800627, 0.030333451085087625, 0.0661620925841404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 158.38888888888889, 92, 397, 101.0, 310.60000000000014, 397.0, 397.0, 0.11241568823382463, 0.030299540969273044, 0.06619791016112915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 102.88888888888889, 96, 121, 101.0, 114.70000000000002, 121.0, 121.0, 0.11254290698328738, 0.08363784395925947, 0.05649126385684543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 97.71428571428571, 93, 103, 99.0, 103.0, 103.0, 103.0, 0.04982561036372695, 0.013332243398106626, 0.028416168410563027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 119.05555555555556, 91, 287, 100.0, 270.8, 287.0, 287.0, 0.11254009240792032, 0.030113266913838053, 0.06418302145139206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 129.28571428571428, 98, 296, 102.0, 296.0, 296.0, 296.0, 0.04982170945402524, 0.03702570399854805, 0.02500816275329001], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 623.5714285714286, 101, 1647, 474.5, 1455.0, 1647.0, 1647.0, 0.08800050286001634, 0.016444848434848197, 0.05989264135080772], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 141.42857142857144, 101, 348, 108.0, 348.0, 348.0, 348.0, 0.051322658220423485, 0.04039654543521614, 0.018243601164291162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1563.8636363636363, 1129, 2250, 1392.0, 2183.1, 2244.15, 2250.0, 0.09553130604322357, 0.049444914260652825, 0.04394066908824053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 313.2857142857143, 198, 579, 207.0, 579.0, 579.0, 579.0, 0.04971732151481576, 0.07705213793360607, 0.11181542133654365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9d1379b-f0e6-42c0-a438-f5cacfd65786", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5962cdec-e1be-491f-83d4-281afca7d4ba", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1122.175438596491, 536, 2425, 923.0, 1872.6, 2125.7, 2425.0, 0.28019879367045675, 89.32514124384915, 1.0181929128753804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f3f5534a-f7f1-45d7-aae7-8f263936a5f2", 3, 0, 0.0, 388.0, 212, 735, 217.0, 735.0, 735.0, 735.0, 0.017798450348256344, 0.024536600659135946, 0.011413719787130534], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 178.43859649122808, 94, 705, 103.0, 398.8, 415.29999999999995, 705.0, 0.25552058958013935, 0.1898937194047715, 0.12351825375211813], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 620.6666666666665, 458, 907, 588.0, 799.4, 832.0999999999997, 907.0, 0.2558325329216075, 75.22325911852228, 0.12866577583459754], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 148.42105263157896, 93, 413, 104.0, 302.0, 304.59999999999997, 413.0, 0.25625463618585204, 0.453450586688246, 0.12462383673882257], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 931.2456140350877, 652, 1297, 936.0, 1197.0, 1214.3, 1297.0, 0.2552528346499006, 229.67694930460397, 0.12812495801762588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 123.09999999999998, 104, 336, 110.5, 125.60000000000001, 325.4999999999999, 336.0, 0.09550323039676818, 0.0713476281772731, 0.03394841393010119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, 4.093567251461988, 190.87719298245617, 95, 1054, 110.0, 393.20000000000005, 530.2000000000003, 1014.4000000000001, 0.7084529624519931, 1.5780257298411988, 0.33877115001387903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 109.0, 97, 133, 106.5, 133.0, 133.0, 133.0, 0.038840230710970425, 0.030078420853319868, 0.013806488260540267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 117.86666666666666, 98, 286, 106.0, 183.40000000000006, 286.0, 286.0, 0.09186279373128295, 0.07454881014716419, 0.03265435245916699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3f5534a-f7f1-45d7-aae7-8f263936a5f2", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 250.0, 190, 589, 201.0, 589.0, 589.0, 589.0, 0.03839545397824898, 0.059505454554180784, 0.08635227589053455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24f0eb7c-a5e6-41ae-9b80-06b0d127947c", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 284.72222222222223, 194, 496, 216.5, 424.0000000000001, 496.0, 496.0, 0.11234552490325803, 0.17411362111471726, 0.2526677186056672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c197e37b-803c-4041-a3ef-609e22b9f179", 3, 0, 0.0, 375.0, 258, 473, 394.0, 473.0, 473.0, 473.0, 0.01875328182431926, 0.025852912931638036, 0.012026030336558897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dda7e075-15db-47e6-9345-cee2a3607a9a", 2, 0, 0.0, 409.5, 314, 505, 409.5, 505.0, 505.0, 505.0, 0.06936496375680644, 0.04264184051260708, 0.043116015069538376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 107.91666666666667, 95, 125, 106.0, 122.00000000000001, 125.0, 125.0, 0.06279533430666102, 0.052063709791362496, 0.022321778991820907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f5faad8-b051-4c07-b734-8e24c7ece6bf", 3, 0, 0.0, 441.33333333333337, 205, 701, 418.0, 701.0, 701.0, 701.0, 0.08016460465489138, 0.03721182494722497, 0.05140764035486198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 118.85714285714285, 99, 291, 106.0, 205.0, 291.0, 291.0, 0.06761063998300075, 0.05249068240867734, 0.0240334696814573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 122.94999999999997, 92, 312, 102.0, 279.00000000000034, 311.2, 312.0, 0.09383723930841954, 0.06973646397822976, 0.04710189551223403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 176.0, 96, 307, 100.5, 301.0, 306.7, 307.0, 0.09376684873063129, 0.03213162814411965, 0.05308265840737008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 198.95000000000002, 90, 1112, 100.0, 304.7, 1071.6499999999994, 1112.0, 0.09376025502789367, 4.242289867153438, 0.054717898832684825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 180.20000000000002, 93, 565, 101.5, 308.70000000000005, 552.2499999999998, 565.0, 0.09385133010797596, 1.4038014334617532, 0.05486270136976016], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 42.10526315789474, 0.60790273556231], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07598784194528875], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07598784194528875], "isController": false}, {"data": ["401/Unauthorized", 9, 47.36842105263158, 0.6838905775075987], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 19, "401/Unauthorized", 9, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
