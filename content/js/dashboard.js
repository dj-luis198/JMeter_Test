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

    var data = {"OkPercent": 97.92307692307692, "KoPercent": 2.076923076923077};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8206987475280159, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0f0e313d-4ef3-44ea-b3bd-0253a2d136cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/959a7098-e5f4-4e5b-8af4-ea6bde9bd162"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8f3c647-e9e1-4e3e-b493-5151d8c3fb82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f02a1047-2cbc-4ddc-8df7-7fb53ee50c1d"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=091ff96c-ca6c-43cc-b0a1-7bc611ef3e53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4758cd68-74ff-4915-9506-9817e545083c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/67caed1f-1c95-4f6e-a78a-340a3a1bad8f"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4e22563-eb16-461e-9345-07bbcf7e2cbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b1ad4b4-ee6a-4031-8752-dfc5fecfd48f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea75bd66-75bf-41c0-9ef4-b93c7f340870"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83c794af-7e47-4a80-9335-2169c1fff9fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/006f48ea-588b-43dc-82e2-01b4bbfeb312"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1c36a551-2b1c-4429-9edd-8144a2d880f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a1b4c8f-8ea2-4fc7-bb60-e981c5ea82ef"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95a1ea5f-fd6b-435d-8799-348e678a31c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/091ff96c-ca6c-43cc-b0a1-7bc611ef3e53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=006f48ea-588b-43dc-82e2-01b4bbfeb312"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f02a1047-2cbc-4ddc-8df7-7fb53ee50c1d"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=959a7098-e5f4-4e5b-8af4-ea6bde9bd162"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9181286549707602, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67caed1f-1c95-4f6e-a78a-340a3a1bad8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea75bd66-75bf-41c0-9ef4-b93c7f340870"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95a1ea5f-fd6b-435d-8799-348e678a31c8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4e22563-eb16-461e-9345-07bbcf7e2cbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b1ad4b4-ee6a-4031-8752-dfc5fecfd48f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a1b4c8f-8ea2-4fc7-bb60-e981c5ea82ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de4f3b85-a928-4716-a0d6-58778cb689de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81b6b14a-1220-41e3-bf10-658a8fc662b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cff9ace-749a-48a1-a136-5672c49a97de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8f3c647-e9e1-4e3e-b493-5151d8c3fb82"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c36a551-2b1c-4429-9edd-8144a2d880f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 27, 2.076923076923077, 272.7269230769233, 78, 1987, 98.0, 661.9000000000001, 832.95, 1298.97, 5.068186602833506, 721.5440396480826, 3.693696071326929], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/0f0e313d-4ef3-44ea-b3bd-0253a2d136cd", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.5946665502793296, 1.1111353584729982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/959a7098-e5f4-4e5b-8af4-ea6bde9bd162", 3, 0, 0.0, 270.3333333333333, 179, 378, 254.0, 378.0, 378.0, 378.0, 0.026462960676040436, 0.02654048888114602, 0.01697006267311187], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1180.6909090909091, 958, 1574, 1141.0, 1426.6, 1465.6, 1574.0, 0.23831704833503045, 286.77661551200254, 1.1718030648114046], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8f3c647-e9e1-4e3e-b493-5151d8c3fb82", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f02a1047-2cbc-4ddc-8df7-7fb53ee50c1d", 3, 0, 0.0, 279.3333333333333, 165, 370, 303.0, 370.0, 370.0, 370.0, 0.020653333792296308, 0.024411541341089808, 0.013244488141544181], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 537.0, 83, 973, 443.5, 957.5, 973.0, 973.0, 0.08985994685426, 0.017701206048858137, 0.0604624056470558], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 537.0, 83, 973, 443.5, 957.5, 973.0, 973.0, 0.09265019258004314, 0.018250847087475017, 0.06233982684340794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 125.11111111111109, 79, 243, 82.5, 240.3, 243.0, 243.0, 0.09206360572226456, 0.024634206999902823, 0.05250502513847901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 91.27777777777779, 79, 246, 83.0, 100.20000000000023, 246.0, 246.0, 0.09206172227024206, 0.06841696352309982, 0.0462106691864301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 90.05555555555556, 78, 245, 81.0, 101.00000000000023, 245.0, 245.0, 0.09206360572226456, 0.02481401872982912, 0.054213236572778836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 99.16666666666667, 78, 248, 81.0, 238.10000000000002, 248.0, 248.0, 0.09206407659731172, 0.024814145645369177, 0.054123607530841465], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 178.92857142857144, 82, 313, 176.5, 270.0, 313.0, 313.0, 0.08969529227851669, 0.15779889554662874, 0.057974091674995516], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=091ff96c-ca6c-43cc-b0a1-7bc611ef3e53", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 97.52380952380953, 80, 238, 83.0, 207.80000000000013, 238.0, 238.0, 0.12506700017866715, 0.0929452999374665, 0.06277777157405753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 97.42857142857143, 79, 244, 83.0, 212.0000000000001, 243.9, 244.0, 0.12506625533764912, 0.06029980168065225, 0.06982633284894973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 496.8333333333333, 399, 634, 477.5, 634.0, 634.0, 634.0, 0.04500888925562799, 13.234107876930695, 0.025669132153600338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 619.0, 538, 827, 556.0, 827.0, 827.0, 827.0, 0.044959648715278036, 40.454770944639684, 0.025597143750983493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 190.33333333333331, 80, 257, 238.0, 257.0, 257.0, 257.0, 0.04506399086703119, 0.07974214008892627, 0.024952424630475274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 107.83333333333333, 80, 386, 81.5, 296.9000000000003, 386.0, 386.0, 0.058363771661470665, 0.04337385765076092, 0.029295877572261646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 108.99999999999999, 78, 251, 82.5, 247.70000000000002, 251.0, 251.0, 0.058366042636394146, 0.03753324128522026, 0.03206142478805831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 242.66666666666666, 80, 732, 87.0, 683.7000000000002, 732.0, 732.0, 0.05836661040773941, 13.141393379706415, 0.03305921292625865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 200.91666666666666, 80, 561, 84.0, 514.2000000000002, 561.0, 561.0, 0.05836575875486381, 4.302166296814202, 0.03311572835603113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 80.83333333333334, 78, 83, 81.5, 83.0, 83.0, 83.0, 0.04511854898746456, 0.03353048415962943, 0.025335122722453245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 476.81250000000006, 79, 777, 629.0, 747.6, 777.0, 777.0, 0.07261439035680896, 40.843936996237666, 0.03878913234880322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 171.76190476190476, 79, 730, 83.0, 551.6, 712.2999999999997, 730.0, 0.12506923475495363, 16.105682526264538, 0.07199158239382515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 323.3125, 79, 577, 391.5, 570.0, 577.0, 577.0, 0.07261537902958622, 13.351922350332897, 0.038860573933802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 168.90476190476193, 79, 646, 83.0, 565.4, 638.4999999999999, 646.0, 0.12495165560943682, 5.277429398595782, 0.07204592531163538], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 384.7142857142857, 86, 943, 387.0, 729.5, 943.0, 943.0, 0.092824654228163, 0.0182852136956147, 0.06305290756653538], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4758cd68-74ff-4915-9506-9817e545083c", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67caed1f-1c95-4f6e-a78a-340a3a1bad8f", 3, 0, 0.0, 831.6666666666666, 213, 1875, 407.0, 1875.0, 1875.0, 1875.0, 0.024532251733612457, 0.028996291030191024, 0.015731945284901218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 351.58333333333337, 163, 957, 173.5, 914.4000000000001, 957.0, 957.0, 0.058340220720501726, 17.516608541676796, 0.1274768006466041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 495.45833333333326, 93, 1117, 483.5, 1069.5, 1114.5, 1117.0, 0.10047684636671536, 0.06171868785611716, 0.045430449089637906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 81.375, 79, 87, 81.0, 84.9, 87.0, 87.0, 0.07261504946900246, 0.053964895162022325, 0.03644935100299537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 181.68749999999997, 80, 335, 237.0, 290.20000000000005, 335.0, 335.0, 0.07261504946900246, 0.08759544907869656, 0.0376016894345103], "isController": false}, {"data": ["login", 24, 0, 0.0, 2269.5833333333335, 1285, 3796, 2326.0, 3082.0, 3621.75, 3796.0, 0.09968267681214799, 29.95048282498629, 0.19172366404445845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4e22563-eb16-461e-9345-07bbcf7e2cbd", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b1ad4b4-ee6a-4031-8752-dfc5fecfd48f", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.129150390625, 4.30908203125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea75bd66-75bf-41c0-9ef4-b93c7f340870", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 95.61904761904762, 83, 254, 86.0, 99.0, 238.49999999999977, 254.0, 0.12439284444970976, 0.10070475395391541, 0.044217768925482764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83c794af-7e47-4a80-9335-2169c1fff9fa", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/006f48ea-588b-43dc-82e2-01b4bbfeb312", 3, 0, 0.0, 287.6666666666667, 163, 417, 283.0, 417.0, 417.0, 417.0, 0.01985939548000159, 0.023473133134077395, 0.012735354523308309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c36a551-2b1c-4429-9edd-8144a2d880f8", 3, 0, 0.0, 304.6666666666667, 186, 501, 227.0, 501.0, 501.0, 501.0, 0.050138717117358025, 0.032821927123374665, 0.0321527580472641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a1b4c8f-8ea2-4fc7-bb60-e981c5ea82ef", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 560.3750000000001, 163, 858, 715.0, 832.1, 858.0, 858.0, 0.07258770636458083, 54.31726902648544, 0.15164379964885696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a1ea5f-fd6b-435d-8799-348e678a31c8", 3, 0, 0.0, 267.0, 192, 381, 228.0, 381.0, 381.0, 381.0, 0.05634437683119225, 0.03622400528698069, 0.03613229894448201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 226.66666666666666, 160, 491, 166.5, 344.30000000000024, 491.0, 491.0, 0.09202406940659813, 0.14261933412917113, 0.2069642889095659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 474.0, 82, 906, 628.5, 892.5, 906.0, 906.0, 0.07488841625977294, 53.76356416439505, 0.12116711724530449], "isController": false}, {"data": ["register", 24, 6, 25.0, 885.0833333333333, 148, 1708, 854.5, 1402.5, 1632.0, 1708.0, 0.10482683916505423, 0.033065497119445814, 0.04729492157642095], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 287.4761904761905, 161, 817, 168.0, 774.2000000000002, 816.2, 817.0, 0.1248899778766325, 21.51045182294764, 0.2763155913986488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 104.75, 80, 245, 85.5, 242.9, 245.0, 245.0, 0.09520522676694951, 0.0739142141403563, 0.03384248295231408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 223.64285714285714, 162, 328, 173.0, 327.0, 328.0, 328.0, 0.06306221087102427, 0.09773411001202686, 0.14182839026950086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 101.55555555555556, 80, 238, 83.0, 238.0, 238.0, 238.0, 0.07473158904268835, 0.05553783131004476, 0.03751175465619317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 115.77777777777777, 79, 237, 82.0, 237.0, 237.0, 237.0, 0.07473220958232998, 0.01999670451714689, 0.04262071327742257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 132.7777777777778, 79, 242, 81.0, 242.0, 242.0, 242.0, 0.07463800567248842, 0.0201172749664129, 0.04387898380355277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 116.88888888888889, 80, 246, 82.0, 246.0, 246.0, 246.0, 0.0747328301322771, 0.020142833121590313, 0.04400771149390927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 88.5, 86, 91, 88.5, 91.0, 91.0, 91.0, 0.0989756025139803, 0.029190070272677785, 0.061183160538427275], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 770.0000000000001, 621, 1193, 656.0, 1058.0, 1128.8, 1193.0, 0.2400666948926902, 287.20322777855375, 0.47403794636037067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 885.0833333333333, 148, 1708, 854.5, 1402.5, 1632.0, 1708.0, 0.09967481092934301, 0.03144039446306426, 0.04497047133726218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 102.71428571428572, 78, 234, 81.0, 234.0, 234.0, 234.0, 0.045627872111592735, 0.01229813740507773, 0.026868756721963302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/091ff96c-ca6c-43cc-b0a1-7bc611ef3e53", 3, 0, 0.0, 250.0, 165, 412, 173.0, 412.0, 412.0, 412.0, 0.02102017937219731, 0.02484514039728139, 0.013479737422926009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 105.28571428571429, 79, 243, 83.0, 243.0, 243.0, 243.0, 0.045626385086690126, 0.012297736605396951, 0.026823324045104943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 119.9375, 78, 246, 81.0, 244.6, 246.0, 246.0, 0.08956961798557929, 0.02414181109767567, 0.05265713869855345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 130.25000000000003, 78, 242, 82.0, 241.3, 242.0, 242.0, 0.08957212515465188, 0.02414248685808976, 0.05274608541821785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 81.85714285714286, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.04562608769334055, 0.01220854299606964, 0.026021128137608283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 102.62499999999999, 79, 248, 83.0, 241.0, 248.0, 248.0, 0.089651424056839, 0.06662571651099071, 0.045000812466030514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 106.42857142857143, 80, 245, 84.0, 245.0, 245.0, 245.0, 0.04562608769334055, 0.03390766868616422, 0.02290215729919633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 110.37500000000001, 78, 244, 81.0, 244.0, 244.0, 244.0, 0.08965242874032735, 0.0239890287840329, 0.051129900765967934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 87.57142857142857, 83, 96, 87.0, 96.0, 96.0, 96.0, 0.0484264851365281, 0.038116940449259416, 0.017214102138375223], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 392.7142857142857, 82, 588, 403.5, 544.5, 588.0, 588.0, 0.09262935027127167, 0.017884908032287948, 0.06303654724096865], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=006f48ea-588b-43dc-82e2-01b4bbfeb312", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f02a1047-2cbc-4ddc-8df7-7fb53ee50c1d", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1243.7083333333335, 832, 1987, 1214.0, 1790.0, 1959.75, 1987.0, 0.10036046132358722, 0.05194437939599729, 0.04616189187832967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 213.42857142857142, 165, 489, 168.0, 489.0, 489.0, 489.0, 0.04560082342058291, 0.07067236989107918, 0.10255732064218988], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 800.4827586206897, 410, 1471, 714.0, 1242.4, 1309.4499999999998, 1471.0, 0.2717722361232159, 90.77769250728632, 0.9855633079952582], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=959a7098-e5f4-4e5b-8af4-ea6bde9bd162", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 150.23636363636362, 79, 406, 85.0, 325.0, 334.99999999999994, 406.0, 0.24066651497383298, 0.1788547049756708, 0.11633781729692122], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 462.21818181818185, 387, 649, 409.0, 570.0, 624.9999999999999, 649.0, 0.24045292587492076, 70.70114399578114, 0.12093091486873456], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 123.83636363636363, 78, 339, 87.0, 245.8, 252.39999999999998, 339.0, 0.2409691340445574, 0.42640241297728315, 0.11719006714276325], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 615.7454545454545, 536, 847, 565.0, 733.8, 821.8, 847.0, 0.24045818213614306, 216.36469496649983, 0.12069873595505619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 97.14285714285714, 82, 238, 85.0, 167.0, 238.0, 238.0, 0.06450542767098547, 0.048190090008109254, 0.02292966374242061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, 7.60233918128655, 135.08771929824567, 80, 662, 87.0, 268.8, 308.80000000000007, 557.6000000000001, 0.6974866009152982, 1.5361721751792663, 0.3342641121219908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 107.22222222222223, 83, 239, 87.0, 239.0, 239.0, 239.0, 0.07259118259102128, 0.05621563261199206, 0.025803896936652096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67caed1f-1c95-4f6e-a78a-340a3a1bad8f", 1, 0, 0.0, 943.0, 943, 943, 943.0, 943.0, 943.0, 943.0, 1.0604453870625663, 0.19158437168610817, 0.7311273860021209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 104.22222222222223, 80, 248, 85.5, 240.8, 248.0, 248.0, 0.09724998649305742, 0.07892064333567453, 0.03456933113620401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea75bd66-75bf-41c0-9ef4-b93c7f340870", 3, 0, 0.0, 672.3333333333334, 313, 1308, 396.0, 1308.0, 1308.0, 1308.0, 0.029278004411219333, 0.029363779814767826, 0.018775282776725938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95a1ea5f-fd6b-435d-8799-348e678a31c8", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4e22563-eb16-461e-9345-07bbcf7e2cbd", 3, 0, 0.0, 465.0, 162, 833, 400.0, 833.0, 833.0, 833.0, 0.0446017067586453, 0.028674599885522286, 0.02860200596176147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 254.00000000000003, 162, 473, 169.0, 473.0, 473.0, 473.0, 0.07458542932201845, 0.11559284798246414, 0.16774437864121922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b1ad4b4-ee6a-4031-8752-dfc5fecfd48f", 3, 0, 0.0, 334.6666666666667, 174, 588, 242.0, 588.0, 588.0, 588.0, 0.06422057627263776, 0.02905813835252815, 0.041183116945669396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a1b4c8f-8ea2-4fc7-bb60-e981c5ea82ef", 3, 0, 0.0, 287.0, 192, 471, 198.0, 471.0, 471.0, 471.0, 0.06927126627874758, 0.03134344405190727, 0.04442200344047289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 264.75000000000006, 160, 482, 243.0, 479.9, 482.0, 482.0, 0.08952801947234423, 0.13875094424083037, 0.20135061410625857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de4f3b85-a928-4716-a0d6-58778cb689de", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81b6b14a-1220-41e3-bf10-658a8fc662b7", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cff9ace-749a-48a1-a136-5672c49a97de", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 131.0, 84, 298, 86.0, 283.90000000000003, 298.0, 298.0, 0.06061493855160604, 0.050255940263978054, 0.021546716438266212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 87.3125, 81, 104, 84.0, 101.2, 104.0, 104.0, 0.0731732972345067, 0.05680934697405549, 0.026010820501328552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8f3c647-e9e1-4e3e-b493-5151d8c3fb82", 3, 0, 0.0, 502.6666666666667, 185, 878, 445.0, 878.0, 878.0, 878.0, 0.07413447994662319, 0.03354392159043171, 0.04754066585118739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c36a551-2b1c-4429-9edd-8144a2d880f8", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 84.0, 80, 94, 83.0, 92.5, 94.0, 94.0, 0.06308579668348954, 0.04688309694935112, 0.031666112788392216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 103.35714285714288, 78, 237, 82.0, 235.0, 237.0, 237.0, 0.06308721807899421, 0.016880759525043372, 0.03597942906067639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 115.35714285714285, 78, 245, 81.0, 243.5, 245.0, 245.0, 0.06308807094704207, 0.017004206622444933, 0.037088885459100905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 126.07142857142858, 79, 244, 82.0, 241.0, 244.0, 244.0, 0.06308750236578134, 0.017004053372027, 0.037150160084537254], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.46153846153846156], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15384615384615385], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15384615384615385], "isController": false}, {"data": ["401/Unauthorized", 17, 62.96296296296296, 1.3076923076923077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 27, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
