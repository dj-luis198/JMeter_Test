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

    var data = {"OkPercent": 99.26847110460864, "KoPercent": 0.731528895391368};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.828353464717101, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f799de7-6376-479c-a924-16c67b36917b"], "isController": false}, {"data": [0.4098360655737705, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3bc67633-57f9-4e94-94ce-14c3ac3c3eeb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dad0478f-5fef-4bdb-bd98-264102a7e894"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dd2b3f7-f273-4057-af52-7c94057c0ed9"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9e95bef-a9c1-4b22-9e60-6e47f0ffb5cd"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3753b6de-174a-43aa-b2c4-55d8c1e54d17"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ae6638c-c73b-448d-8125-0106e0eb015b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2794cc55-c217-4832-9387-c41d8465a15b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce6725f3-1f42-401e-ab23-bc39492bd72e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d983bbd6-49d7-4c61-af59-5c4050d4c606"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dad0478f-5fef-4bdb-bd98-264102a7e894"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f912522a-c46f-4f24-bcba-c0d560ba9e3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d8db233-3a9a-40eb-9808-f865c789991e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f799de7-6376-479c-a924-16c67b36917b"], "isController": false}, {"data": [0.35, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8dd2b3f7-f273-4057-af52-7c94057c0ed9"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8837470-5318-4675-83ad-bb57241725cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bc67633-57f9-4e94-94ce-14c3ac3c3eeb"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d983bbd6-49d7-4c61-af59-5c4050d4c606"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6277d200-13cf-4efd-8ce2-8acf2ad404d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9e95bef-a9c1-4b22-9e60-6e47f0ffb5cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1692f7bc-ecb6-4974-9e3b-24af3b72da7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.421875, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8114754098360656, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9603174603174603, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce6725f3-1f42-401e-ab23-bc39492bd72e"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2794cc55-c217-4832-9387-c41d8465a15b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7fd56e5-08dc-4116-992d-9553aa0ad293"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6277d200-13cf-4efd-8ce2-8acf2ad404d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b902d891-0847-4448-a518-3d0980ffa659"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37a86096-f31e-4e46-a8b1-5a5aae9e799c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d8db233-3a9a-40eb-9808-f865c789991e"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1367, 10, 0.731528895391368, 296.7937088514997, 77, 2236, 96.0, 782.6000000000001, 1006.7999999999997, 1637.1999999999994, 5.267173219487385, 740.9908485815333, 3.850263557335897], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/0f799de7-6376-479c-a924-16c67b36917b", 3, 0, 0.0, 556.6666666666666, 192, 1030, 448.0, 1030.0, 1030.0, 1030.0, 0.021755052610968897, 0.025713735686988305, 0.013950994024612216], "isController": false}, {"data": ["see books", 61, 0, 0.0, 1302.147540983607, 965, 1724, 1281.0, 1614.4, 1646.7, 1724.0, 0.26410928062693484, 317.811085249659, 1.2986232694888835], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3bc67633-57f9-4e94-94ce-14c3ac3c3eeb", 3, 0, 0.0, 785.6666666666666, 196, 1644, 517.0, 1644.0, 1644.0, 1644.0, 0.024518217035257195, 0.028979702491868122, 0.01572294516909397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dad0478f-5fef-4bdb-bd98-264102a7e894", 3, 0, 0.0, 411.3333333333333, 185, 665, 384.0, 665.0, 665.0, 665.0, 0.025252737817658397, 0.025326720447983567, 0.016193975748954113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dd2b3f7-f273-4057-af52-7c94057c0ed9", 1, 0, 0.0, 1349.0, 1349, 1349, 1349.0, 1349.0, 1349.0, 1349.0, 0.7412898443291327, 0.1339244347664937, 0.5110845997034841], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 642.6363636363636, 86, 1146, 646.0, 1121.4, 1146.0, 1146.0, 0.05954733200885631, 0.011376585447714735, 0.040214537872103155], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 642.6363636363636, 86, 1146, 646.0, 1121.4, 1146.0, 1146.0, 0.05948325276056369, 0.011364343034511103, 0.040171262761861504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 97.94444444444446, 77, 241, 80.0, 233.8, 241.0, 241.0, 0.09254498714652956, 0.02476301413881748, 0.05277956298200514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 98.44444444444444, 79, 239, 81.0, 236.3, 239.0, 239.0, 0.09254260815917328, 0.06877434063391687, 0.04645205136114753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 119.77777777777777, 78, 328, 80.0, 250.60000000000014, 328.0, 328.0, 0.09254498714652956, 0.024943766066838045, 0.05449670629820051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 116.16666666666667, 77, 244, 81.0, 241.3, 244.0, 244.0, 0.09254593877572007, 0.0249440225606433, 0.054406889788069804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9e95bef-a9c1-4b22-9e60-6e47f0ffb5cd", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 226.45454545454547, 79, 384, 202.0, 378.20000000000005, 384.0, 384.0, 0.05976636783482749, 0.1501375305623472, 0.03863271699266503], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 81.13333333333334, 78, 88, 80.0, 85.6, 88.0, 88.0, 0.0888346668403878, 0.06601873189993662, 0.04459083862886653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 81.13333333333334, 78, 84, 81.0, 84.0, 84.0, 84.0, 0.08883940205159793, 0.023771480627087727, 0.05066622148255194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 461.5905857535322, 0.8953100470957613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 997.0, 997, 997, 997.0, 997.0, 997.0, 997.0, 1.0030090270812437, 902.5092856695085, 0.5710490847542627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 21.5796493902439, 6.752572408536585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 82.5, 79, 99, 81.0, 94.80000000000001, 99.0, 99.0, 0.06046436633344082, 0.044934944120848114, 0.030350277632215414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 107.91666666666667, 78, 242, 80.5, 242.0, 242.0, 242.0, 0.06046528033215594, 0.03888319052609832, 0.033214570494958705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 284.1666666666667, 79, 967, 81.0, 934.9000000000001, 967.0, 967.0, 0.060465585004534916, 13.613982942091605, 0.03424808525647485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 211.50000000000003, 78, 619, 82.0, 602.8000000000001, 619.0, 619.0, 0.06046467099660894, 4.4568780610239696, 0.03430661508694316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 8.953783885542169, 6.765342620481928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 585.0, 78, 941, 777.0, 930.2, 941.0, 941.0, 0.07224250363620602, 43.34244504452547, 0.03833179717676296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 111.60000000000001, 78, 236, 82.0, 235.4, 236.0, 236.0, 0.08883834973881526, 0.023944711453040047, 0.05222723295192069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 458.7999999999999, 81, 722, 620.0, 719.0, 722.0, 722.0, 0.07218826700033687, 14.156983914047837, 0.038373515628759805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 111.26666666666667, 78, 239, 80.0, 237.8, 239.0, 239.0, 0.08883992821733801, 0.023945136902329384, 0.05231491866704572], "isController": false}, {"data": ["deleteBooks", 10, 0, 0.0, 664.9, 392, 1349, 521.5, 1339.6000000000001, 1349.0, 1349.0, 0.06632971173107283, 0.011983395185789522, 0.04573122703333731], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 381.8333333333333, 161, 1067, 165.0, 1030.4, 1067.0, 1067.0, 0.06043908998876841, 18.1467925022161, 0.132062952978388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3753b6de-174a-43aa-b2c4-55d8c1e54d17", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.5641977694346291, 1.0542043948763251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 761.2631578947369, 143, 1751, 742.0, 1278.0, 1751.0, 1751.0, 0.0895951712918209, 0.05503453392827671, 0.040510316707141676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 92.6, 79, 252, 81.0, 154.80000000000007, 252.0, 252.0, 0.07224180777899787, 0.053687515351384156, 0.03626200117031729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ae6638c-c73b-448d-8125-0106e0eb015b", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 167.73333333333332, 78, 254, 233.0, 248.6, 254.0, 254.0, 0.07218826700033687, 0.09159826327060976, 0.03712808003272535], "isController": false}, {"data": ["login", 19, 0, 0.0, 2809.6315789473683, 1706, 3951, 2607.0, 3804.0, 3951.0, 3951.0, 0.08498875017333231, 5.473278132115012, 0.13564739201955636], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 86.66666666666666, 81, 107, 83.0, 102.2, 107.0, 107.0, 0.09386322251215529, 0.0759888783814226, 0.0333654423773677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2794cc55-c217-4832-9387-c41d8465a15b", 1, 0, 0.0, 1255.0, 1255, 1255, 1255.0, 1255.0, 1255.0, 1255.0, 0.7968127490039841, 0.1439554282868526, 0.5493650398406374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce6725f3-1f42-401e-ab23-bc39492bd72e", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d983bbd6-49d7-4c61-af59-5c4050d4c606", 3, 0, 0.0, 400.6666666666667, 178, 606, 418.0, 606.0, 606.0, 606.0, 0.018451205786298136, 0.0254364767268791, 0.011832316210614363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 700.2, 161, 1022, 858.0, 1011.8, 1022.0, 1022.0, 0.0721601377777564, 57.5896858433235, 0.14998127594758287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dad0478f-5fef-4bdb-bd98-264102a7e894", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f912522a-c46f-4f24-bcba-c0d560ba9e3d", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d8db233-3a9a-40eb-9808-f865c789991e", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 246.77777777777777, 159, 482, 166.0, 477.5, 482.0, 482.0, 0.09250456098877097, 0.1433640022355269, 0.2080449257393941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 1, 50.0, 580.0, 79, 1081, 580.0, 1081.0, 1081.0, 1081.0, 0.013089776230275343, 7.831712825853617, 0.018982732130819226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f799de7-6376-479c-a924-16c67b36917b", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["register", 20, 2, 10.0, 1241.6000000000001, 388, 2158, 1165.0, 2062.4, 2153.85, 2158.0, 0.08589700090621336, 0.02754743661875046, 0.03875431095573298], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 215.33333333333334, 159, 322, 166.0, 319.6, 322.0, 322.0, 0.08879154704472134, 0.13760955582028592, 0.19969427035546217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 88.46666666666665, 80, 120, 85.0, 106.80000000000001, 120.0, 120.0, 0.12913111973898297, 0.10025316425047993, 0.0459020777197166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dd2b3f7-f273-4057-af52-7c94057c0ed9", 3, 0, 0.0, 537.6666666666667, 190, 1178, 245.0, 1178.0, 1178.0, 1178.0, 0.0234203007166612, 0.023488914878917046, 0.015018877738223493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 275.9523809523809, 162, 775, 217.0, 475.8, 745.0999999999996, 775.0, 0.11194029850746269, 6.54234408315565, 0.25039249900053306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8837470-5318-4675-83ad-bb57241725cb", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 17, 0, 0.0, 92.47058823529412, 78, 238, 83.0, 124.39999999999989, 238.0, 238.0, 0.08407766798223489, 0.062483501303203855, 0.042203048186395246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 17, 0, 0.0, 100.29411764705885, 78, 238, 81.0, 237.2, 238.0, 238.0, 0.08401450980004546, 0.02990314238976802, 0.04749947182054501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 17, 0, 0.0, 169.1764705882353, 78, 716, 82.0, 399.1999999999997, 716.0, 716.0, 0.08381651086656411, 4.4576295596798206, 0.0488512361702757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 17, 0, 0.0, 146.0, 79, 623, 82.0, 376.5999999999998, 623.0, 623.0, 0.08385454688948957, 1.4716261030572382, 0.04895529411982322], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 874.7540983606558, 623, 1373, 804.0, 1255.0, 1287.2, 1373.0, 0.2645032325763915, 316.4378223633147, 0.5222905627631482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 2, 10.0, 1241.6000000000001, 388, 2158, 1165.0, 2062.4, 2153.85, 2158.0, 0.08157072589788976, 0.02615998670397168, 0.036802417348461985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 106.58333333333333, 79, 234, 81.5, 233.7, 234.0, 234.0, 0.06277398227681234, 0.016919549910547074, 0.03696553839152133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 93.5, 78, 234, 81.0, 188.70000000000016, 234.0, 234.0, 0.06277398227681234, 0.016919549910547074, 0.036904235674454125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bc67633-57f9-4e94-94ce-14c3ac3c3eeb", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 255.06666666666666, 79, 857, 81.0, 853.4, 857.0, 857.0, 0.13080672869812424, 23.568230084130526, 0.07465180883904668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 190.00000000000003, 77, 505, 82.0, 478.6, 505.0, 505.0, 0.13125541428583928, 7.746991926698226, 0.07503605422161164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d983bbd6-49d7-4c61-af59-5c4050d4c606", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6277d200-13cf-4efd-8ce2-8acf2ad404d0", 3, 0, 0.0, 402.3333333333333, 355, 454, 398.0, 454.0, 454.0, 454.0, 0.05218298834579927, 0.033548633457992694, 0.033463700208731954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9e95bef-a9c1-4b22-9e60-6e47f0ffb5cd", 3, 0, 0.0, 367.0, 204, 473, 424.0, 473.0, 473.0, 473.0, 0.017072226901277, 0.023535443010061233, 0.0109480100896861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 94.08333333333331, 79, 235, 80.0, 192.40000000000015, 235.0, 235.0, 0.06277365389745924, 0.016796856609281083, 0.035800599488394716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 93.53333333333332, 79, 266, 80.0, 158.60000000000008, 266.0, 266.0, 0.1316886879417058, 0.09786630031605285, 0.06610154843948905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1692f7bc-ecb6-4974-9e3b-24af3b72da7f", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 94.49999999999999, 79, 245, 81.0, 196.40000000000018, 245.0, 245.0, 0.06277398227681234, 0.04665136768813886, 0.031509596572540564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 152.53333333333333, 78, 243, 81.0, 238.8, 243.0, 243.0, 0.13151203773518738, 0.07469472768240719, 0.07279396776201581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 101.25000000000001, 81, 266, 84.0, 215.90000000000018, 266.0, 266.0, 0.06319115323854661, 0.04973834913112164, 0.02246248025276461], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 608.1000000000001, 398, 1178, 561.5, 1128.5000000000002, 1178.0, 1178.0, 0.06679848233848126, 0.012068085188104526, 0.045467326357345156], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1566.842105263158, 722, 2236, 1567.0, 2121.0, 2236.0, 2236.0, 0.08808857073975854, 0.04559271727741409, 0.04051730158049441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 215.66666666666669, 160, 480, 165.0, 431.4000000000002, 480.0, 480.0, 0.06274706657463763, 0.09724569790424797, 0.1411196233607329], "isController": false}, {"data": ["addBook", 64, 6, 9.375, 873.7031249999999, 421, 2294, 700.5, 1450.5, 1550.75, 2294.0, 0.2943557288983737, 100.12968073039315, 1.069397561044319], "isController": true}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 133.91803278688522, 79, 403, 83.0, 327.20000000000005, 331.0, 403.0, 0.2655880598574532, 0.19737550151515812, 0.12838485315374937], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 515.6885245901639, 385, 731, 469.0, 654.4000000000001, 713.5, 731.0, 0.2654643886050499, 78.05534449716258, 0.1335099220035163], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 121.24590163934427, 78, 369, 84.0, 243.60000000000002, 275.29999999999995, 369.0, 0.2659029584973432, 0.47052359452850173, 0.1293160872379657], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 737.8524590163934, 540, 1055, 705.0, 946.0, 1008.4999999999999, 1055.0, 0.26491906939576737, 238.37464432036316, 0.1329769547552973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 97.23809523809524, 80, 237, 85.0, 117.4, 225.19999999999982, 237.0, 0.11408889154492657, 0.0852324238592469, 0.040555035666360616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 189, 6, 3.1746031746031744, 148.17460317460313, 80, 1103, 91.0, 249.0, 342.5, 767.2999999999979, 0.7671139468621386, 1.6164147100694868, 0.3695215976568525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 99.35294117647061, 81, 238, 88.0, 137.99999999999991, 238.0, 238.0, 0.08445820064287596, 0.06540561827128968, 0.03002225100977231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 112.16666666666667, 80, 260, 84.0, 257.3, 260.0, 260.0, 0.09453582907922102, 0.0767180409812819, 0.03360453299300435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 0, 0.0, 273.3529411764706, 160, 799, 174.0, 540.5999999999998, 799.0, 799.0, 0.08378098664432507, 6.018158450790991, 0.18716445252821448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce6725f3-1f42-401e-ab23-bc39492bd72e", 3, 0, 0.0, 353.66666666666663, 197, 662, 202.0, 662.0, 662.0, 662.0, 0.02761185100645197, 0.02301886407145947, 0.017706818516507284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 391.99999999999994, 160, 936, 316.0, 934.2, 936.0, 936.0, 0.13071439775519805, 31.43803810760409, 0.2872908433475086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2794cc55-c217-4832-9387-c41d8465a15b", 3, 0, 0.0, 453.0, 206, 683, 470.0, 683.0, 683.0, 683.0, 0.02486490070616318, 0.02938947085419222, 0.015945265101283027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 90.08333333333333, 82, 111, 88.0, 107.4, 111.0, 111.0, 0.06102243082853206, 0.050593792747484094, 0.021691567208579753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7fd56e5-08dc-4116-992d-9553aa0ad293", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.6490567835365854, 1.212763592479675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6277d200-13cf-4efd-8ce2-8acf2ad404d0", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 109.53333333333335, 80, 273, 84.0, 252.0, 273.0, 273.0, 0.07073302996722702, 0.054914803539009266, 0.02514338174616273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b902d891-0847-4448-a518-3d0980ffa659", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37a86096-f31e-4e46-a8b1-5a5aae9e799c", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.7769730839416059, 1.451775395377129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 96.57142857142856, 79, 238, 81.0, 207.6000000000001, 237.9, 238.0, 0.11235654476873277, 0.08349934625879457, 0.05639771876086782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 115.0, 78, 245, 80.0, 236.4, 244.2, 245.0, 0.11226524535302074, 0.03806911128693393, 0.06357729528967107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d8db233-3a9a-40eb-9808-f865c789991e", 3, 0, 0.0, 385.3333333333333, 305, 500, 351.0, 500.0, 500.0, 500.0, 0.027845586938563354, 0.027927165806547426, 0.017856707769846943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 157.57142857142858, 78, 694, 85.0, 237.6, 648.3999999999994, 694.0, 0.11198984625393965, 4.82725503720996, 0.06537948892633735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 155.33333333333331, 78, 635, 82.0, 244.8, 595.9999999999994, 635.0, 0.1120250936209711, 1.5972848751453659, 0.06550946578700295], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 20.0, 0.14630577907827358], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 10.0, 0.07315288953913679], "isController": false}, {"data": ["401/Unauthorized", 7, 70.0, 0.5120702267739575], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1367, 10, "401/Unauthorized", 7, "406/Not Acceptable", 2, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 189, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
